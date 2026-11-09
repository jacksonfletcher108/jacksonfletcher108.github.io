--[[
	Starfall Valley: client entry point. Builds the UI layers, starts each
	client module, then tells the server we're ready for data.
]]

local Players = game:GetService("Players")

local Net = require(game:GetService("ReplicatedStorage").Shared.Net)

local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")

local function screenGui(name: string, displayOrder: number, fullscreen: boolean)
	local gui = Instance.new("ScreenGui")
	gui.Name = name
	gui.ResetOnSpawn = false
	gui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
	gui.DisplayOrder = displayOrder
	if fullscreen then
		gui.IgnoreGuiInset = true
		gui.ScreenInsets = Enum.ScreenInsets.None
	else
		-- keep clear of notches and Roblox's own buttons (top bar, chat, menu)
		gui.ScreenInsets = Enum.ScreenInsets.CoreUISafeInsets
	end
	gui.Parent = playerGui
	return gui
end

local App = {}
App.screen = screenGui("StarfallHud", 1, false) -- always-on HUD
App.fullscreen = screenGui("StarfallBackdrop", 2, true) -- dims the game behind menus
App.overlay = screenGui("StarfallMenus", 3, false) -- menus and toasts

App.Theme = require(script.Theme)
App.Sounds = require(script.Sounds)
App.State = require(script.ClientState)
App.Toasts = require(script.Toasts)
App.Effects = require(script.Effects)
App.Panels = require(script.Panels)
App.Hud = require(script.Hud)
App.StarRenderer = require(script.StarRenderer)
App.Gates = require(script.Gates)
App.Tutorial = require(script.Tutorial)

local ORDER = { "Theme", "Sounds", "State", "Toasts", "Effects", "Panels", "Hud", "StarRenderer", "Tutorial", "Gates" }

for _, name in ipairs(ORDER) do
	local module = App[name]
	if type(module.init) == "function" then
		module.init(App)
	end
end

for _, name in ipairs(ORDER) do
	local module = App[name]
	if type(module.start) == "function" then
		if name == "Gates" then
			task.spawn(module.start) -- waits for the map to arrive
		else
			local ok, err = pcall(module.start)
			if not ok then
				warn("[Client] " .. name .. " failed to start: " .. tostring(err))
			end
		end
	end
end

Net.event("Ready"):FireServer()
