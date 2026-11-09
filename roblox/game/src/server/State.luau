--[[
	Sends each player a snapshot of their own progress whenever it changes.
	Changes are batched: many catches in one moment become one message.
]]

local Players = game:GetService("Players")

local Config = require(game:GetService("ReplicatedStorage").Shared.Config)
local Formulas = require(game:GetService("ReplicatedStorage").Shared.Formulas)
local Net = require(game:GetService("ReplicatedStorage").Shared.Net)

local State = {}
local S

local stateEvent = Net.event("State")
local dirty = {} -- [Player] = true
local BATCH_SECONDS = 0.15

local function build(player: Player)
	local data = S.Data.get(player)
	if not data then
		return nil
	end
	local canClaim, dailyWait, dailyDay = S.Rewards.dailyState(player)
	local passes, products = S.Shop.catalog()
	local upgrades = {}
	for _, upgrade in ipairs(Config.Upgrades) do
		local level = data.upgrades[upgrade.id] or 0
		upgrades[upgrade.id] = { level = level, cost = Formulas.upgradeCost(upgrade.id, level) }
	end
	return {
		stardust = data.stardust,
		totalEarned = data.totalEarned,
		upgrades = upgrades,
		bestZone = data.bestZone,
		novas = data.novas,
		supernovaCost = Formulas.supernovaCost(data.novas),
		multiplier = S.Economy.multiplier(player),
		friends = S.Economy.friendsInServer(player),
		catchRadius = Formulas.catchRadius(data.upgrades.Net, S.Shop.hasPass(player, "StarMagnet")),
		boostEndsAt = data.boostEndsAt,
		book = data.book,
		stats = data.stats,
		funnel = data.funnel,
		daily = {
			canClaim = canClaim,
			wait = dailyWait,
			day = dailyDay,
			streak = data.daily.streak,
			preview = S.Rewards.dailyPreview(player),
		},
		quests = S.Rewards.questList(player),
		passes = S.Shop.ownedPasses(player),
		catalog = { passes = passes, products = products },
		temporary = S.Data.isTemporary(player),
		serverTime = os.time(),
	}
end

function State.push(player: Player)
	dirty[player] = true
end

function State.sendNow(player: Player)
	dirty[player] = nil
	local snapshot = build(player)
	if snapshot and player.Parent then
		stateEvent:FireClient(player, snapshot)
	end
end

function State.init(services)
	S = services
end

function State.start()
	Players.PlayerRemoving:Connect(function(player)
		dirty[player] = nil
	end)
	S.Data.Loaded:Connect(function(player)
		State.sendNow(player)
	end)
	task.spawn(function()
		while true do
			task.wait(BATCH_SECONDS)
			for player in pairs(dirty) do
				task.spawn(State.sendNow, player)
			end
		end
	end)
	-- the boost timer and shower bonus change the multiplier on their own,
	-- so refresh everyone every few seconds
	task.spawn(function()
		while true do
			task.wait(5)
			for _, player in ipairs(Players:GetPlayers()) do
				dirty[player] = true
			end
		end
	end)
end

return State
