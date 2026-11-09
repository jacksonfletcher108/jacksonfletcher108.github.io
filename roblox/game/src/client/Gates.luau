--[[
	Zone gates are per player: once YOU unlock a zone, its gate disappears for
	you only (other players still see theirs). The server separately refuses
	catches in zones you haven't unlocked, so walking through isn't a cheat.

	Locked gates stay see-through, so you can watch the rarer stars falling
	on the other side. That's the next goal, in plain sight.
]]

local Config = require(game:GetService("ReplicatedStorage").Shared.Config)
local Formulas = require(game:GetService("ReplicatedStorage").Shared.Formulas)

local Gates = {}
local App
local opened = {} -- [zoneId] = true once the open animation has played

local function gateFolder(zoneId: number)
	local map = workspace:FindFirstChild("Map")
	return map and map:FindFirstChild("Gate_" .. zoneId)
end

local function apply(state)
	for _, zone in ipairs(Config.Zones) do
		if zone.id > 1 then
			local folder = gateFolder(zone.id)
			local gate = folder and folder:FindFirstChild("Gate")
			if gate then
				local unlocked = state.bestZone >= zone.id
				local labelPart = folder:FindFirstChild("GateLabel")
				local label = labelPart and labelPart:FindFirstChild("Label")
				local promptAnchor = folder:FindFirstChild("PromptAnchor")
				local prompt = promptAnchor and promptAnchor:FindFirstChildOfClass("ProximityPrompt")
				if unlocked then
					gate.CanCollide = false
					if not opened[zone.id] then
						opened[zone.id] = true
						App.Theme.tween(gate, 0.6, { Transparency = 1 })
					end
					if prompt then
						prompt.Enabled = false
					end
					if label then
						label.Title.Text = "✔ " .. zone.name
						label.Subtitle.Text = "Open"
					end
				else
					opened[zone.id] = nil
					gate.CanCollide = true
					gate.Transparency = 0.2
					if prompt then
						prompt.Enabled = state.bestZone == zone.id - 1
					end
					if label then
						label.Title.Text = "🔒 " .. zone.name
						if state.bestZone == zone.id - 1 then
							local short = math.max(zone.cost - state.stardust, 0)
							label.Subtitle.Text = short > 0 and ("★ " .. Formulas.formatNumber(short) .. " more to unlock") or "Ready! Press to unlock"
						else
							label.Subtitle.Text = "Unlock " .. Config.Zones[zone.id - 1].name .. " first"
						end
					end
				end
			end
		end
	end
end

function Gates.init(app)
	App = app
end

function Gates.start()
	-- the map is built by the server; wait for it to replicate
	workspace:WaitForChild("Map", 30)
	App.State.Changed:Connect(function(state, previous)
		apply(state)
		if previous and state.bestZone > previous.bestZone then
			App.Sounds.play("Unlock", 1, 0.9)
			App.Effects.shake(0.8)
		end
	end)
	local state = App.State.get()
	if state then
		apply(state)
	end
end

return Gates
