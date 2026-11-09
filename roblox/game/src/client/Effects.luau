--[[
	"Juice": the layered feedback that makes catching a star feel good.
	  - a sparkle burst where you caught it
	  - a "+12" number that pops up and floats away (bigger for rare stars)
	  - a ping whose pitch climbs with your combo
	  - a small camera kick, only for rare catches (skipped with Reduced Motion)
]]

local Players = game:GetService("Players")

local Config = require(game:GetService("ReplicatedStorage").Shared.Config)
local Formulas = require(game:GetService("ReplicatedStorage").Shared.Formulas)

local Effects = {}
local App

local player = Players.LocalPlayer
local fxFolder
local burstPart
local burstEmitter

local function anchorPart(position: Vector3)
	local p = Instance.new("Part")
	p.Anchored = true
	p.CanCollide = false
	p.CanQuery = false
	p.CanTouch = false
	p.Transparency = 1
	p.Size = Vector3.new(0.2, 0.2, 0.2)
	p.Position = position
	p.Parent = fxFolder
	return p
end

function Effects.burst(position: Vector3, color: Color3, count: number)
	burstPart.Position = position
	burstEmitter.Color = ColorSequence.new(color, Color3.new(1, 1, 1))
	burstEmitter:Emit(count)
end

function Effects.popNumber(position: Vector3, text: string, color: Color3, big: boolean, extra: string?)
	local Theme = App.Theme
	local holder = anchorPart(position)
	local gui = Instance.new("BillboardGui")
	gui.Size = big and UDim2.fromOffset(220, 90) or UDim2.fromOffset(140, 56)
	gui.StudsOffset = Vector3.new(0, 2, 0)
	gui.AlwaysOnTop = true
	gui.LightInfluence = 0
	gui.MaxDistance = 120
	gui.Parent = holder
	local label = Theme.label({
		Text = text,
		Color = color,
		Size = UDim2.fromScale(1, extra and 0.65 or 1),
		MaxTextSize = big and 60 or 40,
		OutlineThickness = 3,
		Parent = gui,
	})
	local extraLabel
	if extra then
		extraLabel = Theme.label({
			Text = extra,
			Color = Theme.Colors.Gold,
			Position = UDim2.fromScale(0, 0.62),
			Size = UDim2.fromScale(1, 0.38),
			MaxTextSize = 28,
			Parent = gui,
		})
	end
	local scale = Instance.new("UIScale")
	scale.Scale = 0.3
	scale.Parent = label
	Theme.tween(scale, 0.25, { Scale = 1 }, Enum.EasingStyle.Back)
	Theme.tween(gui, 0.9, { StudsOffset = Vector3.new(0, 6, 0) }, Enum.EasingStyle.Quad)
	task.delay(0.55, function()
		Theme.tween(label, 0.35, { TextTransparency = 1 })
		local stroke = label:FindFirstChildOfClass("UIStroke")
		if stroke then
			Theme.tween(stroke, 0.35, { Transparency = 1 })
		end
		if extraLabel then
			Theme.tween(extraLabel, 0.35, { TextTransparency = 1 })
			local extraStroke = extraLabel:FindFirstChildOfClass("UIStroke")
			if extraStroke then
				Theme.tween(extraStroke, 0.35, { Transparency = 1 })
			end
		end
	end)
	task.delay(1, function()
		holder:Destroy()
	end)
end

-- A quick camera kick for big moments only.
function Effects.shake(strength: number)
	if App.Theme.reducedMotion() then
		return
	end
	local character = player.Character
	local humanoid = character and character:FindFirstChildOfClass("Humanoid")
	if not humanoid then
		return
	end
	task.spawn(function()
		for i = 1, 6 do
			local falloff = (7 - i) / 6
			humanoid.CameraOffset = Vector3.new(
				(math.random() - 0.5) * strength * falloff,
				(math.random() - 0.5) * strength * falloff,
				0
			)
			task.wait(0.03)
		end
		humanoid.CameraOffset = Vector3.new()
	end)
end

-- Everything that happens when YOU catch a star.
function Effects.myCatch(position: Vector3, starType: string, info)
	local def = Formulas.getStar(starType)
	local tier = Formulas.RarityTier[def.rarity] or 0
	local rarityColor = Config.RarityColors[def.rarity]
	Effects.burst(position, def.color, 10 + tier * 8)
	local extra = nil
	if info.air then
		extra = "AIR CATCH!"
	end
	if info.combo >= 5 then
		extra = (extra and (extra .. "  ") or "") .. "x" .. info.combo
	end
	Effects.popNumber(position, "+" .. Formulas.formatNumber(info.value), tier >= 2 and rarityColor or def.color, tier >= 2, extra)
	-- the ping climbs a semitone-ish per combo step, capped
	local pitch = 1 + math.min(info.combo - 1, Config.ComboMaxSteps) * 0.035
	App.Sounds.play("Catch", pitch, tier >= 2 and 0.8 or 0.45)
	if tier >= 3 then
		Effects.shake(0.6 + (tier - 3) * 0.3)
		App.Sounds.play("Unlock", 1.4, 0.6)
	end
	if info.first then
		Effects.popNumber(position + Vector3.new(0, 3, 0), "NEW!", Config.RarityColors.Legendary, true)
	end
	App.Hud.onEarn(info.value, info.combo)
end

function Effects.otherCatch(position: Vector3, starType: string)
	local def = Formulas.getStar(starType)
	Effects.burst(position, def.color, 8)
end

function Effects.init(app)
	App = app
end

function Effects.start()
	fxFolder = Instance.new("Folder")
	fxFolder.Name = "ClientEffects"
	fxFolder.Parent = workspace

	burstPart = anchorPart(Vector3.new(0, -500, 0))
	burstEmitter = Instance.new("ParticleEmitter")
	burstEmitter.Enabled = false
	burstEmitter.LightEmission = 1
	burstEmitter.Lifetime = NumberRange.new(0.35, 0.7)
	burstEmitter.Speed = NumberRange.new(10, 22)
	burstEmitter.SpreadAngle = Vector2.new(180, 180)
	burstEmitter.Drag = 6
	burstEmitter.Size = NumberSequence.new({ NumberSequenceKeypoint.new(0, 0.7), NumberSequenceKeypoint.new(1, 0) })
	burstEmitter.Transparency = NumberSequence.new(0, 1)
	burstEmitter.Rotation = NumberRange.new(0, 360)
	burstEmitter.RotSpeed = NumberRange.new(-180, 180)
	burstEmitter.Parent = burstPart
end

return Effects
