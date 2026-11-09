--[[
	Short messages that pop up on a player's screen.
	kind: "info" | "good" | "warn" | "rare" | "event"
]]

local Players = game:GetService("Players")

local Net = require(game:GetService("ReplicatedStorage").Shared.Net)

local Toasts = {}
local toastEvent = Net.event("Toast")

function Toasts.send(player: Player, text: string, kind: string?)
	if player.Parent then
		toastEvent:FireClient(player, text, kind or "info")
	end
end

function Toasts.all(text: string, kind: string?)
	for _, player in ipairs(Players:GetPlayers()) do
		Toasts.send(player, text, kind)
	end
end

return Toasts
