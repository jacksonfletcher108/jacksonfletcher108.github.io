--[[
	Every button press arrives here as Action(name, ...). Each handler checks
	everything on the server: the client is never trusted with prices,
	amounts or unlocks.
]]

local Players = game:GetService("Players")

local Net = require(game:GetService("ReplicatedStorage").Shared.Net)

local Actions = {}
local S

local MAX_PER_SECOND = 12
local recent = {} -- [Player] = { windowStart, count }
local lastReady = {} -- [Player] = os.clock() of their last "Ready"

local function throttled(player: Player): boolean
	local now = os.clock()
	local entry = recent[player]
	if not entry or now - entry.windowStart >= 1 then
		recent[player] = { windowStart = now, count = 1 }
		return false
	end
	entry.count += 1
	return entry.count > MAX_PER_SECOND
end

local handlers = {
	BuyUpgrade = function(player, upgradeId)
		if type(upgradeId) ~= "string" then
			return { ok = false }
		end
		return S.Progression.buyUpgrade(player, upgradeId)
	end,
	UnlockZone = function(player, zoneId)
		if type(zoneId) ~= "number" then
			return { ok = false }
		end
		return S.Progression.unlockZone(player, zoneId)
	end,
	Teleport = function(player, zoneId)
		if type(zoneId) ~= "number" then
			return { ok = false }
		end
		return S.Progression.teleport(player, zoneId)
	end,
	Supernova = function(player)
		return S.Progression.supernova(player)
	end,
	ClaimDaily = function(player)
		return S.Rewards.claimDaily(player)
	end,
	ClaimQuest = function(player, index)
		return S.Rewards.claimQuest(player, index)
	end,
}

function Actions.init(services)
	S = services
end

function Actions.start()
	Net.func("Action").OnServerInvoke = function(player: Player, name, ...)
		if throttled(player) then
			return { ok = false, message = "Slow down!" }
		end
		local handler = type(name) == "string" and handlers[name]
		if not handler then
			return { ok = false, message = "Unknown action" }
		end
		if not S.Data.get(player) then
			return { ok = false, message = "Still loading your progress..." }
		end
		local ok, result = pcall(handler, player, ...)
		if not ok then
			warn("[Actions] " .. name .. ": " .. tostring(result))
			return { ok = false, message = "Something went wrong" }
		end
		return result
	end

	-- the client says "Ready" once its UI is listening; send it everything
	-- (at most once every 10 seconds, so it can't be spammed)
	Net.event("Ready").OnServerEvent:Connect(function(player)
		local now = os.clock()
		if lastReady[player] and now - lastReady[player] < 10 then
			return
		end
		lastReady[player] = now
		task.spawn(function()
			S.Data.waitFor(player)
			S.State.sendNow(player)
			S.Stars.sendSnapshot(player)
			S.Events.sendTo(player)
		end)
	end)

	Players.PlayerRemoving:Connect(function(player)
		recent[player] = nil
		lastReady[player] = nil
	end)
end

return Actions
