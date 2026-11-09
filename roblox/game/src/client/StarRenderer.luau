--[[
	Draws the falling stars. The server sends each star's start time and
	path; this works out where it is every frame, so falling looks perfectly
	smooth whatever the network is doing.

	Each star gets a glowing landing ring on the ground that grows as the star
	gets closer, so you can see where to run. Reading the game is part of the
	skill.
]]

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local TweenService = game:GetService("TweenService")

local Formulas = require(game:GetService("ReplicatedStorage").Shared.Formulas)
local Net = require(game:GetService("ReplicatedStorage").Shared.Net)

local StarRenderer = {}
local App

local localPlayer = Players.LocalPlayer
local folder
local stars = {} -- [id] = { info, part, ring, ... }
local MAX_DRAW_DISTANCE = 450

local function heightAt(info, now: number): (number, boolean)
	local t = (now - info.t0) / info.fall
	if t >= 1 then
		return info.groundY, true
	end
	t = math.max(t, 0)
	return info.startY + (info.groundY - info.startY) * t * t, false
end

local function makeStar(info)
	local def = Formulas.getStar(info.type)
	if not def then
		return
	end
	local tier = Formulas.RarityTier[def.rarity] or 0

	local part = Instance.new("Part")
	part.Name = "Star_" .. info.id
	part.Shape = Enum.PartType.Ball
	part.Size = Vector3.one * def.size
	part.Anchored = true
	part.CanCollide = false
	part.CanQuery = false
	part.CanTouch = false
	part.CastShadow = false
	part.Material = Enum.Material.Neon
	part.Color = def.color
	part.Position = Vector3.new(info.x, info.startY, info.z)

	-- a falling streak behind it
	local top = Instance.new("Attachment")
	top.Position = Vector3.new(0, def.size * 0.4, 0)
	top.Parent = part
	local bottom = Instance.new("Attachment")
	bottom.Position = Vector3.new(0, -def.size * 0.4, 0)
	bottom.Parent = part
	local trail = Instance.new("Trail")
	trail.Attachment0 = top
	trail.Attachment1 = bottom
	trail.Color = ColorSequence.new(def.color)
	trail.LightEmission = 1
	trail.FaceCamera = true
	trail.Lifetime = 0.25 + tier * 0.08
	trail.WidthScale = NumberSequence.new(1, 0)
	trail.Transparency = NumberSequence.new(0.2, 1)
	trail.Parent = part
	local fx = { trail }

	-- rare stars sparkle and glow
	if tier >= 2 then
		local sparkle = Instance.new("ParticleEmitter")
		sparkle.Color = ColorSequence.new(def.color, Color3.new(1, 1, 1))
		sparkle.LightEmission = 1
		sparkle.Rate = 8 + tier * 4
		sparkle.Lifetime = NumberRange.new(0.4, 0.8)
		sparkle.Speed = NumberRange.new(1, 3)
		sparkle.SpreadAngle = Vector2.new(180, 180)
		sparkle.Size = NumberSequence.new({ NumberSequenceKeypoint.new(0, 0.4), NumberSequenceKeypoint.new(1, 0) })
		sparkle.Parent = part
		table.insert(fx, sparkle)
		local light = Instance.new("PointLight")
		light.Color = def.color
		light.Range = 8 + tier * 2
		light.Brightness = 1.5
		light.Parent = part
		table.insert(fx, light)
	end

	-- the landing ring
	local ring = Instance.new("Part")
	ring.Name = "Ring_" .. info.id
	ring.Shape = Enum.PartType.Cylinder
	ring.Anchored = true
	ring.CanCollide = false
	ring.CanQuery = false
	ring.CanTouch = false
	ring.CastShadow = false
	ring.Material = Enum.Material.Neon
	ring.Color = def.color
	ring.Transparency = 0.85
	ring.Size = Vector3.new(0.15, 1, 1)
	ring.CFrame = CFrame.new(info.x, info.groundY - def.size / 2 + 0.05, info.z) * CFrame.Angles(0, 0, math.pi / 2)

	part.Parent = folder
	ring.Parent = folder
	stars[info.id] = {
		fx = fx,
		trail = trail,
		far = false,
		info = info,
		def = def,
		tier = tier,
		part = part,
		ring = ring,
		spin = math.random() * math.pi * 2,
		expiresAt = info.t0 + info.fall + info.life,
	}
end

local function removeStar(id: number, fade: boolean)
	local star = stars[id]
	if not star then
		return
	end
	stars[id] = nil
	star.ring:Destroy()
	if fade then
		local tween = TweenService:Create(star.part, TweenInfo.new(0.4), { Size = Vector3.one * 0.1, Transparency = 1 })
		tween:Play()
		tween.Completed:Connect(function()
			star.part:Destroy()
		end)
	else
		star.part:Destroy()
	end
end

-- The caught star zips into whoever caught it, then the effects play.
local function flyTo(star, character: Model?, onArrive)
	local root = character and character:FindFirstChild("HumanoidRootPart")
	star.ring:Destroy()
	star.part.Anchored = true
	local trail = star.part:FindFirstChildOfClass("Trail")
	if trail then
		trail.Lifetime = 0.15
	end
	if not root then
		star.part:Destroy()
		return
	end
	local start = star.part.Position
	local started = os.clock()
	local duration = 0.16
	local connection
	connection = RunService.RenderStepped:Connect(function()
		local t = math.min((os.clock() - started) / duration, 1)
		local target = root.Position
		star.part.Position = start:Lerp(target, t * t)
		star.part.Size = Vector3.one * star.def.size * (1 - 0.6 * t)
		if t >= 1 then
			connection:Disconnect()
			star.part:Destroy()
			onArrive(target)
		end
	end)
end

local function onCaught(info)
	local star = stars[info.id]
	if not star then
		return
	end
	stars[info.id] = nil
	local catcher = Players:GetPlayerByUserId(info.userId)
	local character = catcher and catcher.Character
	if catcher == localPlayer then
		flyTo(star, character, function(position)
			App.Effects.myCatch(position, star.info.type, info)
		end)
	else
		flyTo(star, character, function(position)
			App.Effects.otherCatch(position, star.info.type)
		end)
	end
end

local function setFar(star, far: boolean)
	star.far = far
	star.part.Transparency = far and 1 or 0
	if far then
		star.ring.Transparency = 1
	else
		star.trail:Clear() -- don't draw a streak from where it was last drawn
	end
	for _, effect in ipairs(star.fx) do
		effect.Enabled = not far
	end
end

local function update()
	local now = workspace:GetServerTimeNow()
	local camera = workspace.CurrentCamera
	local cameraPos = camera and camera.CFrame.Position or Vector3.zero
	local hue = (os.clock() * 0.4) % 1
	for id, star in pairs(stars) do
		local info = star.info
		if now >= star.expiresAt then
			removeStar(id, true)
		else
			local y, landed = heightAt(info, now)
			local dx, dz = info.x - cameraPos.X, info.z - cameraPos.Z
			local far = dx * dx + dz * dz > MAX_DRAW_DISTANCE * MAX_DRAW_DISTANCE
			if far ~= star.far then
				setFar(star, far)
			end
			-- stars far from the camera are hidden and skipped entirely
			if not far then
				star.spin += 0.05
				local bob = landed and math.sin(os.clock() * 3 + star.spin) * 0.35 + 0.35 or 0
				star.part.CFrame = CFrame.new(info.x, y + bob, info.z) * CFrame.Angles(0, star.spin, 0)

				-- the ring grows from small to full as the star drops
				local progress = math.clamp((now - info.t0) / info.fall, 0, 1)
				local ringSize = landed and star.def.size * 2.2 or (2 + progress * 6)
				star.ring.Size = Vector3.new(0.15, ringSize, ringSize)
				star.ring.Transparency = landed and 0.7 or (0.9 - progress * 0.35)

				if star.def.rainbow then
					local color = Color3.fromHSV(hue, 0.6, 1)
					star.part.Color = color
					star.ring.Color = color
				end
				-- landed stars blink in their last 3 seconds
				if landed and star.expiresAt - now < 3 then
					star.part.Transparency = (math.floor(now * 6) % 2 == 0) and 0.6 or 0
				end
			end
		end
	end
end

-- The nearest star you could chase (used by the tutorial arrow).
function StarRenderer.nearest(position: Vector3): Vector3?
	local best, bestDistance = nil, math.huge
	local now = workspace:GetServerTimeNow()
	for _, star in pairs(stars) do
		local info = star.info
		local y = heightAt(info, now)
		-- prefer stars that have a little time left before landing or expiring
		if star.expiresAt - now > 2 then
			local d = (Vector3.new(info.x, position.Y, info.z) - position).Magnitude
			if d < bestDistance then
				best, bestDistance = Vector3.new(info.x, math.min(y, info.groundY + 3), info.z), d
			end
		end
	end
	return best
end

function StarRenderer.init(app)
	App = app
end

function StarRenderer.start()
	folder = Instance.new("Folder")
	folder.Name = "ClientStars"
	folder.Parent = workspace

	Net.event("StarSpawned").OnClientEvent:Connect(makeStar)
	Net.event("StarSnapshot").OnClientEvent:Connect(function(list)
		for id in pairs(stars) do
			removeStar(id, false)
		end
		for _, info in ipairs(list) do
			makeStar(info)
		end
	end)
	Net.event("StarCaught").OnClientEvent:Connect(onCaught)
	RunService.RenderStepped:Connect(update)
end

return StarRenderer
