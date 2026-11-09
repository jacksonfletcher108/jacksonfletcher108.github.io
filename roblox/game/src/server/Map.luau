--[[
	Builds the whole world from code, so the game works straight from the
	.rbxlx file with nothing hand-placed. Swap in your own builds later: keep
	the zone layout (Config.ZoneSpacing / ZoneSize) and the "Gate_<n>" names.

	Layout: zones sit side by side along +X. Zone n's center is at
	X = (n - 1) * ZoneSpacing. Each pair of zones is joined by a bridge with a
	gate in the middle.
]]

local Lighting = game:GetService("Lighting")
local Players = game:GetService("Players")

local Config = require(game:GetService("ReplicatedStorage").Shared.Config)
local Formulas = require(game:GetService("ReplicatedStorage").Shared.Formulas)

local Map = {}

local HALF = Config.ZoneSize / 2
local BRIDGE_WIDTH = 40
local WALL_HEIGHT = 80

local mapFolder
local gates = {} -- [zoneId] = gate part (the gate INTO that zone)
local S

-- Shape and Size are set first (Shape can change Size), Parent last.
local function part(props)
	local p = Instance.new("Part")
	p.Anchored = true
	p.TopSurface = Enum.SurfaceType.Smooth
	p.BottomSurface = Enum.SurfaceType.Smooth
	if props.Shape then
		p.Shape = props.Shape
	end
	if props.Size then
		p.Size = props.Size
	end
	for key, value in pairs(props) do
		if key ~= "Parent" and key ~= "Shape" and key ~= "Size" then
			(p :: any)[key] = value
		end
	end
	p.Parent = props.Parent or mapFolder
	return p
end

local function invisibleWall(size: Vector3, position: Vector3, parent)
	return part({
		Name = "Wall",
		Size = size,
		Position = position,
		Transparency = 1,
		CanQuery = false,
		Parent = parent,
	})
end

function Map.zoneCenter(zoneId: number): Vector3
	return Vector3.new((zoneId - 1) * Config.ZoneSpacing, 0, 0)
end

-- Which zone a world position is in (by nearest zone center).
function Map.zoneAt(position: Vector3): number
	local index = math.floor(position.X / Config.ZoneSpacing + 0.5) + 1
	return math.clamp(index, 1, #Config.Zones)
end

-- A random point on a zone's ground, kept away from the edges.
function Map.randomPointIn(zoneId: number, random: Random): Vector3
	local center = Map.zoneCenter(zoneId)
	local margin = 10
	return Vector3.new(
		center.X + random:NextNumber(-HALF + margin, HALF - margin),
		0,
		center.Z + random:NextNumber(-HALF + margin, HALF - margin)
	)
end

function Map.spawnPoint(zoneId: number): CFrame
	local center = Map.zoneCenter(zoneId)
	if zoneId == 1 then
		return CFrame.new(center + Vector3.new(-HALF + 25, 4, 0)) * CFrame.Angles(0, -math.pi / 2, 0)
	end
	return CFrame.new(center + Vector3.new(-HALF + 12, 4, 0)) * CFrame.Angles(0, -math.pi / 2, 0)
end

function Map.getGate(zoneId: number)
	return gates[zoneId]
end

---------------------------------------------------------------------------
-- Scenery
---------------------------------------------------------------------------
local function tree(position: Vector3, random: Random, leafColor: Color3, parent)
	local height = random:NextNumber(9, 15)
	part({
		Name = "Trunk",
		Shape = Enum.PartType.Cylinder,
		Size = Vector3.new(height, 2.2, 2.2),
		CFrame = CFrame.new(position + Vector3.new(0, height / 2, 0)) * CFrame.Angles(0, 0, math.pi / 2),
		Color = Color3.fromRGB(105, 70, 45),
		Material = Enum.Material.Wood,
		Parent = parent,
	})
	for i = 1, 2 do
		local size = random:NextNumber(7, 10) - i
		part({
			Name = "Leaves",
			Shape = Enum.PartType.Ball,
			Size = Vector3.new(size, size, size),
			Position = position + Vector3.new(random:NextNumber(-1, 1), height + i * 2.5 - 2, random:NextNumber(-1, 1)),
			Color = leafColor,
			Material = Enum.Material.Grass,
			CanCollide = false,
			Parent = parent,
		})
	end
end

local function crystal(position: Vector3, random: Random, color: Color3, parent)
	for _ = 1, random:NextInteger(2, 4) do
		local h = random:NextNumber(4, 12)
		part({
			Name = "Crystal",
			Size = Vector3.new(1.6, h, 1.6),
			CFrame = CFrame.new(position + Vector3.new(random:NextNumber(-2, 2), h / 2 - 0.5, random:NextNumber(-2, 2)))
				* CFrame.Angles(random:NextNumber(-0.35, 0.35), random:NextNumber(0, math.pi), random:NextNumber(-0.35, 0.35)),
			Color = color,
			Material = Enum.Material.Neon,
			Transparency = 0.15,
			Parent = parent,
		})
	end
end

local function pine(position: Vector3, random: Random, parent)
	local height = random:NextNumber(10, 16)
	part({
		Name = "Trunk",
		Size = Vector3.new(1.6, height * 0.4, 1.6),
		Position = position + Vector3.new(0, height * 0.2, 0),
		Color = Color3.fromRGB(95, 65, 45),
		Material = Enum.Material.Wood,
		Parent = parent,
	})
	for i = 0, 2 do
		local width = 8 - i * 2.2
		part({
			Name = "Needles",
			Size = Vector3.new(width, 3, width),
			CFrame = CFrame.new(position + Vector3.new(0, height * 0.35 + i * 3, 0)) * CFrame.Angles(0, math.rad(45 * i), 0),
			Color = i == 2 and Color3.fromRGB(240, 245, 255) or Color3.fromRGB(40, 110, 80),
			Material = i == 2 and Enum.Material.Snow or Enum.Material.Grass,
			CanCollide = false,
			Parent = parent,
		})
	end
end

local function floatingRock(position: Vector3, random: Random, color: Color3, parent)
	local size = random:NextNumber(4, 9)
	part({
		Name = "FloatingRock",
		Size = Vector3.new(size, size * 0.7, size),
		CFrame = CFrame.new(position + Vector3.new(0, random:NextNumber(18, 40), 0))
			* CFrame.Angles(random:NextNumber(0, 1), random:NextNumber(0, 6), random:NextNumber(0, 1)),
		Color = Color3.fromRGB(60, 50, 80),
		Material = Enum.Material.Slate,
		CanCollide = false,
		Parent = parent,
	})
	part({
		Name = "RockGlow",
		Shape = Enum.PartType.Ball,
		Size = Vector3.new(1.4, 1.4, 1.4),
		Position = position + Vector3.new(0, 1, 0),
		Color = color,
		Material = Enum.Material.Neon,
		CanCollide = false,
		Parent = parent,
	})
end

-- Places scenery away from the middle of the zone so it never hides stars,
-- and away from the edges so it can't be used to climb walls.
local function scatter(zoneId: number, count: number, random: Random, place)
	local center = Map.zoneCenter(zoneId)
	local placed = 0
	local tries = 0
	while placed < count and tries < count * 20 do
		tries += 1
		local x = random:NextNumber(-HALF + 12, HALF - 12)
		local z = random:NextNumber(-HALF + 12, HALF - 12)
		local fromCenter = math.sqrt(x * x + z * z)
		if fromCenter > 30 and math.abs(z) > 22 then -- keep the central path clear
			place(center + Vector3.new(x, 0, z))
			placed += 1
		end
	end
end

---------------------------------------------------------------------------
-- Signs
---------------------------------------------------------------------------
local function billboard(adornee: BasePart, title: string, subtitle: string?, color: Color3, offset: number)
	local gui = Instance.new("BillboardGui")
	gui.Name = "Label"
	gui.Size = UDim2.fromOffset(320, 110)
	gui.StudsOffset = Vector3.new(0, offset, 0)
	gui.AlwaysOnTop = false
	gui.MaxDistance = 220
	gui.LightInfluence = 0
	gui.Adornee = adornee
	gui.Parent = adornee

	local titleLabel = Instance.new("TextLabel")
	titleLabel.Name = "Title"
	titleLabel.BackgroundTransparency = 1
	titleLabel.Size = UDim2.fromScale(1, 0.55)
	titleLabel.Font = Enum.Font.FredokaOne
	titleLabel.TextScaled = true
	titleLabel.TextColor3 = color
	titleLabel.Text = title
	titleLabel.Parent = gui
	local stroke = Instance.new("UIStroke")
	stroke.Thickness = 3
	stroke.Color = Color3.fromRGB(14, 16, 38)
	stroke.Parent = titleLabel

	local sub = Instance.new("TextLabel")
	sub.Name = "Subtitle"
	sub.BackgroundTransparency = 1
	sub.Position = UDim2.fromScale(0, 0.58)
	sub.Size = UDim2.fromScale(1, 0.4)
	sub.Font = Enum.Font.FredokaOne
	sub.TextScaled = true
	sub.TextColor3 = Color3.fromRGB(255, 255, 255)
	sub.Text = subtitle or ""
	sub.Parent = gui
	local subStroke = stroke:Clone()
	subStroke.Parent = sub
	return gui
end

local function surfaceBoard(name: string, cframe: CFrame, size: Vector3)
	local board = part({
		Name = name,
		Size = size,
		CFrame = cframe,
		Color = Color3.fromRGB(27, 31, 59),
		Material = Enum.Material.SmoothPlastic,
	})
	local gui = Instance.new("SurfaceGui")
	gui.Name = "Gui"
	gui.Face = Enum.NormalId.Front
	gui.SizingMode = Enum.SurfaceGuiSizingMode.PixelsPerStud
	gui.PixelsPerStud = 40
	gui.LightInfluence = 0
	gui.Parent = board
	return board, gui
end

local function buildWelcomeSign()
	-- in front of the spawn, facing the player as they arrive
	local position = Map.zoneCenter(1) + Vector3.new(-HALF + 42, 8, -30)
	local cf = CFrame.lookAt(position, Vector3.new(Map.spawnPoint(1).X, position.Y, 0))
	local _, gui = surfaceBoard("WelcomeSign", cf, Vector3.new(26, 14, 1))
	local text = Instance.new("TextLabel")
	text.BackgroundTransparency = 1
	text.Size = UDim2.fromScale(1, 1)
	text.Font = Enum.Font.FredokaOne
	text.TextScaled = true
	text.TextColor3 = Color3.fromRGB(255, 215, 90)
	text.RichText = true
	text.Text = "★ STARFALL VALLEY ★\n<font color=\"#FFFFFF\">Run under falling stars to catch them.\nJump to catch them in the air for 1.5x!</font>"
	text.Parent = gui
	local pad = Instance.new("UIPadding")
	pad.PaddingTop = UDim.new(0, 30)
	pad.PaddingBottom = UDim.new(0, 30)
	pad.PaddingLeft = UDim.new(0, 30)
	pad.PaddingRight = UDim.new(0, 30)
	pad.Parent = text
end

local leaderboardGui
local function buildLeaderboard()
	local position = Map.zoneCenter(1) + Vector3.new(-HALF + 42, 10, 30)
	local cf = CFrame.lookAt(position, Vector3.new(Map.spawnPoint(1).X, position.Y, 0))
	local _, gui = surfaceBoard("Leaderboard", cf, Vector3.new(22, 18, 1))
	leaderboardGui = gui
	local title = Instance.new("TextLabel")
	title.Name = "Title"
	title.BackgroundTransparency = 1
	title.Size = UDim2.fromScale(1, 0.14)
	title.Font = Enum.Font.FredokaOne
	title.TextScaled = true
	title.TextColor3 = Color3.fromRGB(255, 215, 90)
	title.Text = "TOP STAR CATCHERS"
	title.Parent = gui
	local list = Instance.new("Frame")
	list.Name = "List"
	list.BackgroundTransparency = 1
	list.Position = UDim2.fromScale(0.05, 0.16)
	list.Size = UDim2.fromScale(0.9, 0.82)
	list.Parent = gui
	local layout = Instance.new("UIListLayout")
	layout.SortOrder = Enum.SortOrder.LayoutOrder
	layout.Padding = UDim.new(0, 4)
	layout.Parent = list
	for i = 1, 10 do
		local row = Instance.new("TextLabel")
		row.Name = "Row" .. i
		row.LayoutOrder = i
		row.BackgroundTransparency = 1
		row.Size = UDim2.fromScale(1, 0.095)
		row.Font = Enum.Font.FredokaOne
		row.TextScaled = true
		row.TextXAlignment = Enum.TextXAlignment.Left
		row.TextColor3 = Color3.fromRGB(255, 255, 255)
		row.Text = i == 1 and "Loading..." or ""
		row.Parent = list
	end
end

function Map.setLeaderboard(rows)
	if not leaderboardGui then
		return
	end
	for i = 1, 10 do
		local label = leaderboardGui.List:FindFirstChild("Row" .. i)
		local row = rows[i]
		if label then
			label.Text = row and string.format("%d.  %s   ★ %s", i, row.name, Formulas.formatNumber(row.value)) or ""
		end
	end
end

---------------------------------------------------------------------------
-- Lighting: a clear night sky so the glowing stars pop.
---------------------------------------------------------------------------
local function setupLighting()
	Lighting.ClockTime = 20.6
	Lighting.Brightness = 2
	Lighting.Ambient = Color3.fromRGB(95, 95, 140)
	Lighting.OutdoorAmbient = Color3.fromRGB(120, 120, 175)
	Lighting.ExposureCompensation = 0.35
	Lighting.GlobalShadows = true
	Lighting.EnvironmentDiffuseScale = 0.5
	Lighting.EnvironmentSpecularScale = 0.5

	local sky = Lighting:FindFirstChildOfClass("Sky") or Instance.new("Sky")
	sky.StarCount = 5000
	sky.CelestialBodiesShown = true
	sky.Parent = Lighting

	local atmosphere = Lighting:FindFirstChildOfClass("Atmosphere") or Instance.new("Atmosphere")
	atmosphere.Density = 0.28
	atmosphere.Offset = 0.1
	atmosphere.Color = Color3.fromRGB(120, 110, 190)
	atmosphere.Decay = Color3.fromRGB(60, 50, 110)
	atmosphere.Glare = 0.2
	atmosphere.Haze = 1.2
	atmosphere.Parent = Lighting

	local bloom = Lighting:FindFirstChildOfClass("BloomEffect") or Instance.new("BloomEffect")
	bloom.Intensity = 0.8
	bloom.Size = 30
	bloom.Threshold = 0.9
	bloom.Parent = Lighting

	local color = Lighting:FindFirstChildOfClass("ColorCorrectionEffect") or Instance.new("ColorCorrectionEffect")
	color.Saturation = 0.15
	color.Contrast = 0.05
	color.Parent = Lighting
end

---------------------------------------------------------------------------
-- Build
---------------------------------------------------------------------------
local function buildZone(zone, random: Random)
	local folder = Instance.new("Folder")
	folder.Name = string.format("Zone_%d_%s", zone.id, (string.gsub(zone.name, " ", "")))
	folder.Parent = mapFolder
	local center = Map.zoneCenter(zone.id)

	local materials = { Enum.Material.Grass, Enum.Material.Glacier, Enum.Material.Snow, Enum.Material.Slate }
	part({
		Name = "Ground",
		Size = Vector3.new(Config.ZoneSize, 6, Config.ZoneSize),
		Position = center - Vector3.new(0, 3, 0),
		Color = zone.ground,
		Material = materials[zone.id] or Enum.Material.Grass,
		Parent = folder,
	})

	-- a soft glowing ring marks the middle, where stars land most
	local ring = part({
		Name = "CenterRing",
		Shape = Enum.PartType.Cylinder,
		Size = Vector3.new(0.2, 46, 46),
		CFrame = CFrame.new(center + Vector3.new(0, 0.05, 0)) * CFrame.Angles(0, 0, math.pi / 2),
		Color = zone.accent,
		Material = Enum.Material.Neon,
		Transparency = 0.75,
		CanCollide = false,
		CanQuery = false,
		Parent = folder,
	})
	ring.CastShadow = false

	-- zone name floating over the middle
	local marker = part({
		Name = "NameMarker",
		Size = Vector3.new(1, 1, 1),
		Position = center + Vector3.new(0, 30, 0),
		Transparency = 1,
		CanCollide = false,
		CanQuery = false,
		Parent = folder,
	})
	local label = billboard(marker, zone.name, nil, zone.accent, 0)
	label.MaxDistance = 400
	label.Size = UDim2.fromOffset(360, 70)

	-- side walls (front and back) so you can't fall off
	invisibleWall(Vector3.new(Config.ZoneSize, WALL_HEIGHT, 2), center + Vector3.new(0, WALL_HEIGHT / 2, HALF + 1), folder)
	invisibleWall(Vector3.new(Config.ZoneSize, WALL_HEIGHT, 2), center + Vector3.new(0, WALL_HEIGHT / 2, -HALF - 1), folder)

	if zone.id == 1 then
		invisibleWall(Vector3.new(2, WALL_HEIGHT, Config.ZoneSize), center + Vector3.new(-HALF - 1, WALL_HEIGHT / 2, 0), folder)
		scatter(1, 22, random, function(p)
			tree(p, random, Color3.fromRGB(70, 150, 70), folder)
		end)
	elseif zone.id == 2 then
		scatter(2, 20, random, function(p)
			crystal(p, random, zone.accent, folder)
		end)
	elseif zone.id == 3 then
		scatter(3, 24, random, function(p)
			pine(p, random, folder)
		end)
	else
		scatter(zone.id, 22, random, function(p)
			floatingRock(p, random, zone.accent, folder)
		end)
	end

	-- the far end of the last zone is closed off
	if zone.id == #Config.Zones then
		invisibleWall(Vector3.new(2, WALL_HEIGHT, Config.ZoneSize), center + Vector3.new(HALF + 1, WALL_HEIGHT / 2, 0), folder)
	else
		-- walls on the near side of the gap, leaving the bridge open
		local sideLength = (Config.ZoneSize - BRIDGE_WIDTH) / 2
		local sideOffset = BRIDGE_WIDTH / 2 + sideLength / 2
		invisibleWall(Vector3.new(2, WALL_HEIGHT, sideLength), center + Vector3.new(HALF + 1, WALL_HEIGHT / 2, sideOffset), folder)
		invisibleWall(Vector3.new(2, WALL_HEIGHT, sideLength), center + Vector3.new(HALF + 1, WALL_HEIGHT / 2, -sideOffset), folder)
	end
	if zone.id > 1 then
		local sideLength = (Config.ZoneSize - BRIDGE_WIDTH) / 2
		local sideOffset = BRIDGE_WIDTH / 2 + sideLength / 2
		invisibleWall(Vector3.new(2, WALL_HEIGHT, sideLength), center + Vector3.new(-HALF - 1, WALL_HEIGHT / 2, sideOffset), folder)
		invisibleWall(Vector3.new(2, WALL_HEIGHT, sideLength), center + Vector3.new(-HALF - 1, WALL_HEIGHT / 2, -sideOffset), folder)
	end
end

local function buildBridgeAndGate(zone)
	local folder = Instance.new("Folder")
	folder.Name = "Gate_" .. zone.id
	folder.Parent = mapFolder

	local gap = Config.ZoneSpacing - Config.ZoneSize
	local x = Map.zoneCenter(zone.id).X - Config.ZoneSpacing / 2
	part({
		Name = "Bridge",
		Size = Vector3.new(gap + 2, 6, BRIDGE_WIDTH),
		Position = Vector3.new(x, -3, 0),
		Color = Color3.fromRGB(70, 60, 90),
		Material = Enum.Material.Cobblestone,
		Parent = folder,
	})
	invisibleWall(Vector3.new(gap, WALL_HEIGHT, 2), Vector3.new(x, WALL_HEIGHT / 2, BRIDGE_WIDTH / 2 + 1), folder)
	invisibleWall(Vector3.new(gap, WALL_HEIGHT, 2), Vector3.new(x, WALL_HEIGHT / 2, -BRIDGE_WIDTH / 2 - 1), folder)

	-- pillars
	for _, side in ipairs({ 1, -1 }) do
		part({
			Name = "Pillar",
			Size = Vector3.new(4, 26, 4),
			Position = Vector3.new(x, 13, side * (BRIDGE_WIDTH / 2 - 1)),
			Color = Color3.fromRGB(45, 40, 70),
			Material = Enum.Material.Slate,
			Parent = folder,
		})
		part({
			Name = "PillarGlow",
			Shape = Enum.PartType.Ball,
			Size = Vector3.new(3, 3, 3),
			Position = Vector3.new(x, 27.5, side * (BRIDGE_WIDTH / 2 - 1)),
			Color = zone.accent,
			Material = Enum.Material.Neon,
			CanCollide = false,
			Parent = folder,
		})
	end

	local gate = part({
		Name = "Gate",
		Size = Vector3.new(1.5, WALL_HEIGHT, BRIDGE_WIDTH - 6),
		Position = Vector3.new(x, WALL_HEIGHT / 2, 0),
		Color = zone.accent,
		Material = Enum.Material.ForceField,
		Transparency = 0.2,
		Parent = folder,
	})
	gate:SetAttribute("ZoneId", zone.id)
	gates[zone.id] = gate

	local labelAnchor = part({
		Name = "GateLabel",
		Size = Vector3.new(1, 1, 1),
		Position = Vector3.new(x - 2, 14, 0),
		Transparency = 1,
		CanCollide = false,
		CanQuery = false,
		Parent = folder,
	})
	billboard(labelAnchor, "🔒 " .. zone.name, "★ " .. Formulas.formatNumber(zone.cost) .. " to unlock", zone.accent, 0)

	-- the prompt lives on a small part at player height (prompts measure distance to their part)
	local promptAnchor = part({
		Name = "PromptAnchor",
		Size = Vector3.new(1, 1, 1),
		Position = Vector3.new(x - 2.5, 4, 0),
		Transparency = 1,
		CanCollide = false,
		CanQuery = false,
		Parent = folder,
	})
	local prompt = Instance.new("ProximityPrompt")
	prompt.Name = "UnlockPrompt"
	prompt.ActionText = "Unlock (" .. Formulas.formatNumber(zone.cost) .. " ★)"
	prompt.ObjectText = zone.name
	prompt.HoldDuration = 0
	prompt.MaxActivationDistance = 14
	prompt.RequiresLineOfSight = false
	prompt.KeyboardKeyCode = Enum.KeyCode.E
	prompt.Parent = promptAnchor
	prompt.Triggered:Connect(function(player)
		S.Progression.tryUnlock(player, zone.id)
	end)
end

function Map.init(services)
	S = services
end

function Map.start()
	local existing = workspace:FindFirstChild("Map")
	if existing then
		existing:Destroy()
	end
	mapFolder = Instance.new("Folder")
	mapFolder.Name = "Map"
	mapFolder.Parent = workspace

	local baseplate = workspace:FindFirstChild("Baseplate")
	if baseplate then
		baseplate:Destroy()
	end

	setupLighting()
	local random = Random.new(20261109)
	for _, zone in ipairs(Config.Zones) do
		buildZone(zone, random)
		if zone.id > 1 then
			buildBridgeAndGate(zone)
		end
	end
	buildWelcomeSign()
	buildLeaderboard()

	local spawn = workspace:FindFirstChildOfClass("SpawnLocation") or Instance.new("SpawnLocation")
	spawn.Name = "Spawn"
	spawn.Anchored = true
	spawn.Size = Vector3.new(12, 1, 12)
	spawn.CFrame = Map.spawnPoint(1) - Vector3.new(0, 3.5, 0)
	spawn.Duration = 0
	spawn.Neutral = true
	spawn.Color = Config.Zones[1].accent
	spawn.Material = Enum.Material.Neon
	spawn.Transparency = 0.4
	spawn.CanCollide = true
	spawn.Parent = mapFolder

	workspace.FallenPartsDestroyHeight = -100
	Players.RespawnTime = 2
end

return Map
