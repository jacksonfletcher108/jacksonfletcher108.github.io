--[[
	Starfall Valley: server entry point.

	Every service is a ModuleScript next to this one. Each can have:
	  init(services)  store references to the other services (no work yet)
	  start()         connect events and start loops
	init runs for all of them first, so services can call each other freely.
]]

local services = {
	Data = require(script.DataService),
	Map = require(script.Map),
	Toasts = require(script.Toasts),
	Analytics = require(script.Analytics),
	Badges = require(script.Badges),
	Economy = require(script.Economy),
	Shop = require(script.Shop),
	Characters = require(script.Characters),
	Events = require(script.Events),
	Rewards = require(script.Rewards),
	Progression = require(script.Progression),
	State = require(script.State),
	Stars = require(script.Stars),
	Leaderboard = require(script.Leaderboard),
	Actions = require(script.Actions),
}

-- the order things start in
local START_ORDER = {
	"Map", -- the world first
	"Analytics",
	"Economy",
	"Shop",
	"Characters",
	"Events",
	"Rewards",
	"State",
	"Stars",
	"Leaderboard",
	"Actions",
	"Data", -- last: loading players fires Loaded, which the others listen to
}

for _, service in pairs(services) do
	if type(service.init) == "function" then
		service.init(services)
	end
end

for _, name in ipairs(START_ORDER) do
	local service = services[name]
	if type(service.start) == "function" then
		local ok, err = pcall(service.start)
		if not ok then
			warn("[Server] " .. name .. " failed to start: " .. tostring(err))
		end
	end
end

print("[Starfall Valley] server ready")
