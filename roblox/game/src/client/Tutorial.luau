--[[
	First-time help that teaches by playing, not by reading. No menus or text
	walls: a glowing line points at the nearest star, and one short hint at a
	time tells you the very next thing to do.

	  1. Catch 5 stars             (line to the nearest star)
	  2. Buy your first upgrade    (Upgrades button pulses)
	  3. Unlock Crystal Cliffs     (line to the gate once you can afford it)
	Then it disappears for good. The NEXT GOAL bar takes over.
]]

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")

local Config = require(game:GetService("ReplicatedStorage").Shared.Config)

local Tutorial = {}
local App

local player = Players.LocalPlayer
local hint
local beam, targetPart, sourceAttachment
local pulseTime = 0
local pulsing = nil -- the UIScale we're pulsing, so we can reset it

local function step(state): number
	if not state then
		return 0
	end
	if state.stats.catches < 5 then
		return 1
	end
	local bought = 0
	for _, upgrade in pairs(state.upgrades) do
		bought += upgrade.level
	end
	if bought == 0 and state.novas == 0 then
		return 2
	end
	if state.bestZone < 2 and state.novas == 0 then
		return 3
	end
	return 0
end

local function ensureBeam()
	local character = player.Character
	local root = character and character:FindFirstChild("HumanoidRootPart")
	if not root then
		return false
	end
	if not sourceAttachment or sourceAttachment.Parent ~= root then
		sourceAttachment = Instance.new("Attachment")
		sourceAttachment.Name = "TutorialSource"
		sourceAttachment.Position = Vector3.new(0, -1.5, 0)
		sourceAttachment.Parent = root
		beam.Attachment0 = sourceAttachment
	end
	return true
end

local function setHint(text: string?)
	hint.Visible = text ~= nil
	hint.Text = text or ""
end

function Tutorial.init(app)
	App = app
end

function Tutorial.start()
	local Theme = App.Theme
	hint = Theme.label({
		Name = "TutorialHint",
		Text = "",
		Color = Theme.Colors.Gold,
		AnchorPoint = Vector2.new(0.5, 1),
		Position = UDim2.fromScale(0.5, 0.76),
		Size = UDim2.fromScale(0.6, 0.07),
		MaxTextSize = 32,
		OutlineThickness = 3,
		RichText = true,
		Parent = App.screen,
	})
	hint.Visible = false

	targetPart = Instance.new("Part")
	targetPart.Name = "TutorialTarget"
	targetPart.Anchored = true
	targetPart.CanCollide = false
	targetPart.CanQuery = false
	targetPart.CanTouch = false
	targetPart.Transparency = 1
	targetPart.Size = Vector3.one * 0.2
	targetPart.Parent = workspace
	local targetAttachment = Instance.new("Attachment")
	targetAttachment.Parent = targetPart

	beam = Instance.new("Beam")
	beam.Attachment1 = targetAttachment
	beam.Color = ColorSequence.new(Theme.Colors.Gold)
	beam.LightEmission = 1
	beam.FaceCamera = true
	beam.Width0 = 0.6
	beam.Width1 = 0.6
	beam.Segments = 12
	beam.CurveSize0 = 4
	beam.CurveSize1 = -2
	beam.TextureSpeed = 2
	beam.Transparency = NumberSequence.new(0.1, 0.5)
	beam.Enabled = false
	beam.Parent = targetPart

	RunService.RenderStepped:Connect(function(dt)
		local state = App.State.get()
		local current = step(state)
		local showBeam = false

		if current == 1 then
			setHint(
				string.format(
					'Run under a falling star to catch it!  <font color="#FFFFFF">%d/5</font>',
					state.stats.catches
				)
			)
			local root = player.Character and player.Character:FindFirstChild("HumanoidRootPart")
			local target = root and App.StarRenderer.nearest(root.Position)
			if target and ensureBeam() then
				targetPart.Position = target
				showBeam = true
			end
		elseif current == 2 then
			local cost = state.upgrades.Net.cost or 0
			if state.stardust >= cost then
				setHint("Tap <b>Upgrades</b> and buy a <b>Bigger Net</b>!")
				pulseTime += dt
				local button = App.Hud.buttonFor("Upgrades")
				local scale = button
					and button:FindFirstChild("Button")
					and button.Button:FindFirstChildOfClass("UIScale")
				if scale and not App.Panels.isOpen("Upgrades") and not Theme.reducedMotion() then
					pulsing = scale
					scale.Scale = 1 + math.abs(math.sin(pulseTime * 4)) * 0.12
				end
			else
				setHint(string.format("Catch more stars: ★ %d more for your first upgrade", cost - state.stardust))
			end
		elseif current == 3 then
			local zone = Config.Zones[2]
			if state.stardust >= zone.cost then
				setHint("Follow the line to the gate and unlock <b>" .. zone.name .. "</b>!")
				local map = workspace:FindFirstChild("Map")
				local gateFolder = map and map:FindFirstChild("Gate_2")
				local anchor = gateFolder and gateFolder:FindFirstChild("PromptAnchor")
				if anchor and ensureBeam() then
					targetPart.Position = anchor.Position
					showBeam = true
				end
			else
				setHint(nil) -- the NEXT GOAL bar already shows this
			end
		else
			setHint(nil)
		end
		beam.Enabled = showBeam
		if pulsing and (current ~= 2 or App.Panels.isOpen("Upgrades")) then
			pulsing.Scale = 1
			pulsing = nil
		end
	end)
end

Tutorial.step = step

return Tutorial
