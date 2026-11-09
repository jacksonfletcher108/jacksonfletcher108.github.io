--[[
	Stardust in and out, multipliers, timed boosts, and the friends bonus.
	Every change to a player's Stardust goes through here.
]]

local Players = game:GetService("Players")

local Formulas = require(game:GetService("ReplicatedStorage").Shared.Formulas)

local Economy = {}
local S

local friendCounts = {} -- [Player] = number of friends in this server

function Economy.friendsInServer(player: Player): number
	return friendCounts[player] or 0
end

function Economy.boostActive(data): boolean
	return data.boostEndsAt > os.time()
end

-- Everything that multiplies Stardust except combo and the air-catch bonus.
function Economy.multiplier(player: Player): number
	local data = S.Data.get(player)
	if not data then
		return 1
	end
	return Formulas.baseMultiplier({
		novas = data.novas,
		hasDouble = S.Shop.hasPass(player, "DoubleStardust"),
		boostActive = Economy.boostActive(data),
		friends = Economy.friendsInServer(player),
		showerActive = S.Events.isShowerActive(),
	})
end

function Economy.add(player: Player, amount: number, sku: string)
	local data = S.Data.get(player)
	if not data or amount <= 0 then
		return
	end
	amount = math.floor(amount)
	data.stardust += amount
	data.totalEarned += amount
	S.Analytics.earned(player, amount, sku)
	S.State.push(player)
end

-- Returns true and takes the Stardust if the player can afford it.
function Economy.spend(player: Player, amount: number, sku: string): boolean
	local data = S.Data.get(player)
	if not data or amount < 0 or data.stardust < amount then
		return false
	end
	data.stardust -= amount
	S.Analytics.spent(player, amount, sku)
	S.State.push(player)
	return true
end

-- Adds minutes to the 2x boost. Stacks on top of time already left.
function Economy.grantBoost(player: Player, minutes: number)
	local data = S.Data.get(player)
	if not data or minutes <= 0 then
		return
	end
	local now = os.time()
	data.boostEndsAt = math.max(data.boostEndsAt, now) + minutes * 60
	S.State.push(player)
end

-- Rewards are "minutes of earnings" so they're useful at every stage.
function Economy.minutesOfEarnings(player: Player, minutes: number): number
	local data = S.Data.get(player)
	if not data then
		return 0
	end
	return Formulas.minutesOfEarnings(minutes, data.bestZone, data.novas)
end

---------------------------------------------------------------------------
-- Friends bonus: +10% per friend in the server (max +30%).
---------------------------------------------------------------------------
local friendPairs = {} -- [Player] = { [Player] = true }

local function isFriends(a: Player, b: Player): boolean
	local ok, result = pcall(function()
		return a:IsFriendsWith(b.UserId)
	end)
	return ok and result == true
end

local function recount(player: Player)
	local count = 0
	for other in pairs(friendPairs[player] or {}) do
		if other.Parent then
			count += 1
		end
	end
	local changed = friendCounts[player] ~= count
	friendCounts[player] = count
	if changed then
		S.State.push(player)
	end
end

local function onJoin(player: Player)
	friendPairs[player] = friendPairs[player] or {}
	for _, other in ipairs(Players:GetPlayers()) do
		if other ~= player and isFriends(player, other) then
			friendPairs[player][other] = true
			friendPairs[other] = friendPairs[other] or {}
			friendPairs[other][player] = true
			recount(other)
			S.Toasts.send(other, player.DisplayName .. " joined. Friend bonus +10%!", "good")
		end
	end
	recount(player)
end

local function onLeave(player: Player)
	for other in pairs(friendPairs[player] or {}) do
		if friendPairs[other] then
			friendPairs[other][player] = nil
			recount(other)
		end
	end
	friendPairs[player] = nil
	friendCounts[player] = nil
end

function Economy.init(services)
	S = services
end

function Economy.start()
	Players.PlayerAdded:Connect(onJoin)
	for _, player in ipairs(Players:GetPlayers()) do
		task.spawn(onJoin, player)
	end
	Players.PlayerRemoving:Connect(onLeave)
end

return Economy
