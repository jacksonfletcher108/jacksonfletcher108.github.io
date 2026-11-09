--[[
	Applies upgrades and cosmetics to your character: run speed, jump height,
	your Supernova aura, and the Comet Trail pass.
]]

local Players = game:GetService("Players")

local Config = require(game:GetService("ReplicatedStorage").Shared.Config)
local Formulas = require(game:GetService("ReplicatedStorage").Shared.Formulas)

local Characters = {}
local S

local function getParts(player: Player)
	local character = player.Character
	if not character then
		return nil, nil
	end
	return character:FindFirstChildOfClass("Humanoid"), character:FindFirstChild("HumanoidRootPart")
end

local function setAura(root: BasePart, novas: number)
	local existing = root:FindFirstChild("NovaAura")
	if novas <= 0 then
		if existing then
			existing:Destroy()
		end
		return
	end
	local colors = Config.Supernova.auraColors
	local color = colors[math.min(novas, #colors)]
	local aura = existing or Instance.new("ParticleEmitter")
	aura.Name = "NovaAura"
	aura.Color = ColorSequence.new(color)
	aura.LightEmission = 1
	aura.Size = NumberSequence.new({ NumberSequenceKeypoint.new(0, 0.6), NumberSequenceKeypoint.new(1, 0) })
	aura.Transparency = NumberSequence.new({ NumberSequenceKeypoint.new(0, 0.3), NumberSequenceKeypoint.new(1, 1) })
	aura.Lifetime = NumberRange.new(0.6, 1.1)
	aura.Rate = 6 + math.min(novas, 10) * 2
	aura.Speed = NumberRange.new(1, 3)
	aura.SpreadAngle = Vector2.new(180, 180)
	aura.Parent = root
end

local function setTrail(character: Model, root: BasePart, on: boolean)
	local trail = root:FindFirstChild("CometTrail")
	if not on then
		if trail then
			trail:Destroy()
		end
		return
	end
	if trail then
		return
	end
	local a0 = Instance.new("Attachment")
	a0.Name = "TrailTop"
	a0.Position = Vector3.new(0, 0.8, 0)
	a0.Parent = root
	local a1 = Instance.new("Attachment")
	a1.Name = "TrailBottom"
	a1.Position = Vector3.new(0, -0.8, 0)
	a1.Parent = root
	trail = Instance.new("Trail")
	trail.Name = "CometTrail"
	trail.Attachment0 = a0
	trail.Attachment1 = a1
	trail.Lifetime = 0.6
	trail.LightEmission = 1
	trail.FaceCamera = true
	trail.Color = ColorSequence.new({
		ColorSequenceKeypoint.new(0, Color3.fromRGB(255, 90, 120)),
		ColorSequenceKeypoint.new(0.33, Color3.fromRGB(255, 215, 0)),
		ColorSequenceKeypoint.new(0.66, Color3.fromRGB(80, 230, 255)),
		ColorSequenceKeypoint.new(1, Color3.fromRGB(190, 110, 255)),
	})
	trail.Transparency = NumberSequence.new(0.2, 1)
	trail.Parent = root

	local head = character:FindFirstChild("Head")
	if head and not head:FindFirstChild("StarTag") then
		local tag = Instance.new("BillboardGui")
		tag.Name = "StarTag"
		tag.Size = UDim2.fromOffset(40, 40)
		tag.StudsOffset = Vector3.new(0, 2.6, 0)
		tag.LightInfluence = 0
		tag.MaxDistance = 80
		tag.Parent = head
		local star = Instance.new("TextLabel")
		star.BackgroundTransparency = 1
		star.Size = UDim2.fromScale(1, 1)
		star.Font = Enum.Font.FredokaOne
		star.TextScaled = true
		star.Text = "★"
		star.TextColor3 = Color3.fromRGB(255, 215, 0)
		star.Parent = tag
	end
end

-- Re-applies everything. Called on spawn and after any upgrade or purchase.
function Characters.refresh(player: Player)
	local data = S.Data.get(player)
	local humanoid, root = getParts(player)
	if not data or not humanoid or not root then
		return
	end
	humanoid.WalkSpeed = Formulas.walkSpeed(data.upgrades.Boots)
	humanoid.UseJumpPower = true
	humanoid.JumpPower = Formulas.jumpPower(data.upgrades.Spring)
	setAura(root, data.novas)
	setTrail(player.Character, root, S.Shop.hasPass(player, "CometTrail"))
end

function Characters.teleport(player: Player, cframe: CFrame)
	local _, root = getParts(player)
	if root then
		player.Character:PivotTo(cframe)
	end
end

local function onPlayer(player: Player)
	player.CharacterAdded:Connect(function(character)
		character:WaitForChild("HumanoidRootPart", 10)
		character:WaitForChild("Humanoid", 10)
		S.Data.waitFor(player)
		Characters.refresh(player)
	end)
	if player.Character then
		task.spawn(Characters.refresh, player)
	end
end

function Characters.init(services)
	S = services
end

function Characters.start()
	Players.PlayerAdded:Connect(onPlayer)
	for _, player in ipairs(Players:GetPlayers()) do
		onPlayer(player)
	end
	-- re-apply once data loads, in case the character spawned first
	S.Data.Loaded:Connect(function(player)
		Characters.refresh(player)
	end)
end

return Characters
