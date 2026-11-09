--[[
	Meteor Shower: a server-wide event on a timer.
	  idle -> warning (30s countdown banner) -> active (45s of 4x stars, Novas,
	  +25% Stardust) -> idle

	Anyone can buy "Call a Meteor Shower" to start one early for the whole
	server, and everyone sees who did it.
]]

local Players = game:GetService("Players")

local Config = require(game:GetService("ReplicatedStorage").Shared.Config)
local Net = require(game:GetService("ReplicatedStorage").Shared.Net)

local Events = {}
local S

local cfg = Config.MeteorShower
local showerEvent = Net.event("ShowerState")

local phase = "idle" -- "idle" | "warning" | "active"
local startsAt = 0
local endsAt = 0

local function broadcast(player: Player?)
	if player then
		showerEvent:FireClient(player, phase, startsAt, endsAt)
	else
		showerEvent:FireAllClients(phase, startsAt, endsAt)
	end
end

local function schedule(secondsFromNow: number)
	local now = workspace:GetServerTimeNow()
	startsAt = now + secondsFromNow
	endsAt = startsAt + cfg.duration
end

function Events.isShowerActive(): boolean
	return phase == "active"
end

function Events.phase(): string
	return phase
end

-- Called by the "Call a Meteor Shower" product.
function Events.callShower(buyer: Player)
	local now = workspace:GetServerTimeNow()
	if phase == "active" then
		endsAt += cfg.duration -- already raining: make it last longer
	elseif phase == "warning" then
		startsAt = math.min(startsAt, now + 10)
		endsAt = startsAt + cfg.duration
	else
		schedule(10)
		phase = "warning"
	end
	broadcast()
	S.Toasts.all("☄️ " .. buyer.DisplayName .. " called a Meteor Shower for everyone!", "event")
end

local function tick()
	local now = workspace:GetServerTimeNow()
	if phase == "idle" and now >= startsAt - cfg.warning then
		phase = "warning"
		broadcast()
	elseif phase == "warning" and now >= startsAt then
		phase = "active"
		broadcast()
		S.Toasts.all("☄️ METEOR SHOWER! 4x stars and +25% Stardust!", "event")
	elseif phase == "active" and now >= endsAt then
		phase = "idle"
		schedule(cfg.every - cfg.duration)
		broadcast()
		S.Toasts.all("The Meteor Shower is over. Next one in " .. math.floor((cfg.every - cfg.duration) / 60) .. " minutes.", "info")
	end
end

function Events.init(services)
	S = services
end

function Events.start()
	schedule(cfg.firstAfter)
	Players.PlayerAdded:Connect(function(player)
		broadcast(player)
	end)
	task.spawn(function()
		while true do
			task.wait(0.25)
			tick()
		end
	end)
end

-- Lets clients re-request the state when their UI loads.
Events.sendTo = broadcast

return Events
