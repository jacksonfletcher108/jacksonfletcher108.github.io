--[[
	The core loop: stars spawn, fall, and get caught.

	The server decides everything (which star, where, when) and sends each
	new star to clients, which draw it falling smoothly on their own. The
	server works out where every star is from its start time, so it can check
	catches fairly without moving any parts itself. That keeps the game light
	on the network and hard to cheat.

	Catching: stand within your catch radius of a star. Grab it before it lands
	for an AIR CATCH (1.5x). Catch stars quickly one after another to build a
	combo (up to 2x).
]]

local Players = game:GetService("Players")

local Config = require(game:GetService("ReplicatedStorage").Shared.Config)
local Formulas = require(game:GetService("ReplicatedStorage").Shared.Formulas)
local Net = require(game:GetService("ReplicatedStorage").Shared.Net)

local Stars = {}
local S

local spawnedEvent = Net.event("StarSpawned")
local snapshotEvent = Net.event("StarSnapshot")
local caughtEvent = Net.event("StarCaught")

local random = Random.new()
local nextId = 0
local active = {} -- [id] = star
local zoneStars = {} -- [zoneId] = { [id] = star }
local spawnBudget = {} -- [zoneId] = fractional stars owed
local combos = {} -- [Player] = { count, lastAt }
for _, zone in ipairs(Config.Zones) do
	zoneStars[zone.id] = {}
	spawnBudget[zone.id] = 0
end

-- Position of a star at a given server time: falls with gravity-like easing,
-- then sits on the ground until it expires.
local function heightAt(star, now: number): (number, boolean)
	local t = (now - star.t0) / star.fall
	if t >= 1 then
		return star.groundY, true
	end
	t = math.max(t, 0)
	-- ease-in (accelerates like it's falling)
	local eased = t * t
	return star.startY + (star.groundY - star.startY) * eased, false
end
Stars.heightAt = heightAt

local function publicInfo(star)
	return {
		id = star.id,
		type = star.type,
		x = star.x,
		z = star.z,
		startY = star.startY,
		groundY = star.groundY,
		t0 = star.t0,
		fall = star.fall,
		life = Config.StarLifetimeOnGround,
	}
end

local function rootOf(player: Player): BasePart?
	local character = player.Character
	if not character then
		return nil
	end
	local humanoid = character:FindFirstChildOfClass("Humanoid")
	if not humanoid or humanoid.Health <= 0 then
		return nil
	end
	return character:FindFirstChild("HumanoidRootPart") :: BasePart?
end

-- Players standing in each zone that they've actually unlocked.
local function playersByZone()
	local byZone = {}
	for _, zone in ipairs(Config.Zones) do
		byZone[zone.id] = {}
	end
	for _, player in ipairs(Players:GetPlayers()) do
		local data = S.Data.get(player)
		local root = rootOf(player)
		if data and root then
			local zoneId = S.Map.zoneAt(root.Position)
			if zoneId <= data.bestZone then
				table.insert(byZone[zoneId], { player = player, root = root, data = data })
			end
		end
	end
	return byZone
end

-- Luck is shared: the luckiest player in a zone lifts everyone there.
local function zoneLuck(list): number
	local best = 0
	for _, entry in ipairs(list) do
		local luck = Formulas.luck(entry.data.upgrades.Luck, S.Shop.hasPass(entry.player, "LuckyCharm"))
		best = math.max(best, luck)
	end
	return best
end

local function spawnStar(zoneId: number, luck: number)
	local count = 0
	for _ in pairs(zoneStars[zoneId]) do
		count += 1
	end
	if count >= Config.MaxStarsPerZone then
		return
	end
	local starType = Formulas.rollStar(zoneId, luck, function()
		return random:NextNumber()
	end)
	if S.Events.isShowerActive() and random:NextNumber() < Config.MeteorShower.novaChance then
		starType = "Nova"
	end
	local def = Formulas.getStar(starType)
	local point = S.Map.randomPointIn(zoneId, random)
	nextId += 1
	local star = {
		id = nextId,
		type = starType,
		zone = zoneId,
		x = point.X,
		z = point.Z,
		groundY = point.Y + def.size / 2 + 0.2,
		startY = point.Y + Config.SpawnHeight,
		t0 = workspace:GetServerTimeNow(),
		fall = def.fallTime,
	}
	star.expiresAt = star.t0 + star.fall + Config.StarLifetimeOnGround
	active[star.id] = star
	zoneStars[zoneId][star.id] = star
	spawnedEvent:FireAllClients(publicInfo(star))
end

local function removeStar(star)
	active[star.id] = nil
	zoneStars[star.zone][star.id] = nil
end

local function onCatch(entry, star, airCatch: boolean, now: number)
	local player, data = entry.player, entry.data
	removeStar(star)

	local combo = combos[player]
	if not combo or now - combo.lastAt > Config.ComboWindow then
		combo = { count = 0, lastAt = now }
		combos[player] = combo
	end
	combo.count += 1
	combo.lastAt = now

	local value = Formulas.catchValue(star.type, S.Economy.multiplier(player), combo.count, airCatch)
	local def = Formulas.getStar(star.type)
	local tier = Formulas.RarityTier[def.rarity]
	local firstOfKind = (data.book[star.type] or 0) == 0
	data.book[star.type] = (data.book[star.type] or 0) + 1

	-- stats and quests
	S.Rewards.add(player, "catches", 1)
	if airCatch then
		S.Rewards.add(player, "airCatches", 1)
	end
	if tier >= Formulas.RarityTier.Uncommon and star.type ~= "Moon" then
		S.Rewards.add(player, "rareCatches", 1)
	end
	if S.Events.isShowerActive() then
		S.Rewards.add(player, "showerCatches", 1)
	end
	S.Rewards.max(player, "bestCombo", combo.count)

	S.Economy.add(player, value, "StarCatch")

	-- onboarding funnel
	local catches = data.stats.catches
	if catches >= 1 then
		S.Analytics.funnel(player, 2)
	end
	if catches >= 5 then
		S.Analytics.funnel(player, 3)
	end

	if firstOfKind then
		S.Toasts.send(player, "NEW STAR DISCOVERED: " .. def.name .. "!", "rare")
		local all = true
		for _, s in ipairs(Config.Stars) do
			if (data.book[s.id] or 0) == 0 then
				all = false
				break
			end
		end
		if all then
			S.Badges.award(player, "BookComplete")
			S.Toasts.send(player, "Star Book complete! You found every star.", "rare")
		end
	end
	if star.type == "Gold" then
		S.Badges.award(player, "FirstGold")
	elseif star.type == "Nova" then
		S.Badges.award(player, "NovaCaught")
		S.Toasts.all("✨ " .. player.DisplayName .. " caught a NOVA!", "rare")
	elseif tier >= Formulas.RarityTier.Legendary then
		S.Toasts.all("🌈 " .. player.DisplayName .. " caught a " .. def.name .. "!", "rare")
	end

	caughtEvent:FireAllClients({
		id = star.id,
		userId = player.UserId,
		value = value,
		combo = combo.count,
		air = airCatch,
		first = firstOfKind,
	})
end

-- Checks every player against every star in their zone, 10 times a second.
local function catchTick()
	local now = workspace:GetServerTimeNow()
	-- expire old stars
	for _, star in pairs(active) do
		if now >= star.expiresAt then
			removeStar(star)
		end
	end

	local byZone = playersByZone()
	for zoneId, list in pairs(byZone) do
		for _, entry in ipairs(list) do
			local radius = Formulas.catchRadius(entry.data.upgrades.Net, S.Shop.hasPass(entry.player, "StarMagnet"))
			local radiusSq = radius * radius
			local pos = entry.root.Position
			for _, star in pairs(zoneStars[zoneId]) do
				local dx, dz = star.x - pos.X, star.z - pos.Z
				if dx * dx + dz * dz <= radiusSq then
					local y, landed = heightAt(star, now)
					local dy = y - pos.Y
					if dy <= Config.CatchReachUp and dy >= -Config.CatchReachDown then
						onCatch(entry, star, not landed, now)
					end
				end
			end
		end
	end
	return byZone
end

local function spawnTick(byZone, dt: number)
	local rateMultiplier = S.Events.isShowerActive() and Config.MeteorShower.spawnMultiplier or 1
	for zoneId, list in pairs(byZone) do
		local count = #list
		if count == 0 then
			spawnBudget[zoneId] = 0
		else
			local perSecond = (Config.SpawnPerSecond + (count - 1) * Config.SpawnPerExtraPlayer) * rateMultiplier
			spawnBudget[zoneId] += perSecond * dt
			local luck = zoneLuck(list)
			while spawnBudget[zoneId] >= 1 do
				spawnBudget[zoneId] -= 1
				spawnStar(zoneId, luck)
			end
		end
	end
end

function Stars.sendSnapshot(player: Player)
	local list = {}
	for _, star in pairs(active) do
		table.insert(list, publicInfo(star))
	end
	snapshotEvent:FireClient(player, list)
end

function Stars.init(services)
	S = services
end

function Stars.start()
	Players.PlayerRemoving:Connect(function(player)
		combos[player] = nil
	end)
	task.spawn(function()
		local last = os.clock()
		while true do
			task.wait(0.1)
			local now = os.clock()
			local dt = now - last
			last = now
			local ok, err = pcall(function()
				local byZone = catchTick()
				spawnTick(byZone, dt)
			end)
			if not ok then
				warn("[Stars] " .. tostring(err))
			end
		end
	end)
end

return Stars
