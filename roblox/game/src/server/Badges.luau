--[[
	Awards Roblox badges listed in Config.Badges. A badge with ID 0 is skipped.
	Each award is remembered in the player's data so it's only tried once.
]]

local BadgeService = game:GetService("BadgeService")

local Config = require(game:GetService("ReplicatedStorage").Shared.Config)

local Badges = {}
local S

function Badges.award(player: Player, key: string)
	local data = S.Data.get(player)
	local id = Config.Badges[key]
	if not data or data.badges[key] or not id or id == 0 then
		return
	end
	data.badges[key] = true
	task.spawn(function()
		local ok, err = pcall(function()
			BadgeService:AwardBadge(player.UserId, id)
		end)
		if not ok then
			data.badges[key] = nil -- try again next time
			warn("[Badges] " .. key .. ": " .. tostring(err))
		end
	end)
end

function Badges.init(services)
	S = services
end

return Badges
