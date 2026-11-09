--[[
	All client/server messages in one place. The server creates the remotes;
	clients wait for them.

	Server -> client events:
	  State        (state)                     your full progress, sent whenever it changes
	  StarSpawned  (star)                      a star started falling
	  StarSnapshot ({star})                    every falling star, sent when you join
	  StarCaught   (info)                      someone caught a star
	  Toast        (text, kind)                a short message for you
	  ShowerState  (phase, startsAt, endsAt)   Meteor Shower timing
	  Leaderboard  ({ {name, value} })         the all-time top 10

	Client -> server:
	  Action       (name, ...) -> { ok, message }   every button press goes through here
]]

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RunService = game:GetService("RunService")

local EVENTS = { "State", "StarSpawned", "StarSnapshot", "StarCaught", "Toast", "ShowerState", "Leaderboard", "Ready" }
local FUNCTIONS = { "Action" }

local Net = {}

local folder
if RunService:IsServer() then
	folder = ReplicatedStorage:FindFirstChild("Remotes")
	if not folder then
		folder = Instance.new("Folder")
		folder.Name = "Remotes"
		folder.Parent = ReplicatedStorage
	end
	for _, name in ipairs(EVENTS) do
		if not folder:FindFirstChild(name) then
			local remote = Instance.new("RemoteEvent")
			remote.Name = name
			remote.Parent = folder
		end
	end
	for _, name in ipairs(FUNCTIONS) do
		if not folder:FindFirstChild(name) then
			local remote = Instance.new("RemoteFunction")
			remote.Name = name
			remote.Parent = folder
		end
	end
else
	folder = ReplicatedStorage:WaitForChild("Remotes")
end

function Net.event(name: string): RemoteEvent
	return folder:WaitForChild(name) :: RemoteEvent
end

function Net.func(name: string): RemoteFunction
	return folder:WaitForChild(name) :: RemoteFunction
end

return Net
