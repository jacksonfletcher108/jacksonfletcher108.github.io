--[[
	The latest progress snapshot from the server, plus helpers:
	  State.get()            current snapshot (or nil until loaded)
	  State.Changed          fires with the new snapshot
	  State.act(name, ...)   ask the server to do something; shows the reply
	  State.boostLeft()      seconds of 2x boost left
]]

local Net = require(game:GetService("ReplicatedStorage").Shared.Net)

local State = {}
local App

local current = nil
local receivedAt = 0
local changed = Instance.new("BindableEvent")
State.Changed = changed.Event

function State.get()
	return current
end

function State.boostLeft(): number
	if not current then
		return 0
	end
	local serverNow = current.serverTime + (os.clock() - receivedAt)
	return math.max(0, current.boostEndsAt - serverNow)
end

function State.act(name: string, ...)
	local ok, result = pcall(function(...)
		return Net.func("Action"):InvokeServer(name, ...)
	end, ...)
	if not ok or type(result) ~= "table" then
		App.Toasts.show("Couldn't reach the server. Try again.", "warn")
		App.Sounds.play("Denied")
		return false
	end
	if result.message then
		App.Toasts.show(result.message, result.ok and "good" or "warn")
	end
	if not result.ok then
		App.Sounds.play("Denied")
	end
	return result.ok
end

function State.init(app)
	App = app
end

function State.start()
	Net.event("State").OnClientEvent:Connect(function(snapshot)
		local previous = current
		current = snapshot
		receivedAt = os.clock()
		changed:Fire(snapshot, previous)
	end)
end

return State
