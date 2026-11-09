--[[
	Short pop-up messages near the top of the screen. At most three at once,
	each fades after a few seconds. They tell you something, then get out of
	the way.
]]

local Net = require(game:GetService("ReplicatedStorage").Shared.Net)

local Toasts = {}
local App
local container

local MAX_VISIBLE = 3
local KIND_COLORS

function Toasts.show(text: string, kind: string?)
	if not container then
		return
	end
	local Theme = App.Theme
	local color = KIND_COLORS[kind or "info"] or KIND_COLORS.info

	local visible = {}
	for _, child in ipairs(container:GetChildren()) do
		if child:IsA("Frame") then
			table.insert(visible, child)
		end
	end
	table.sort(visible, function(a, b)
		return a.LayoutOrder < b.LayoutOrder
	end)
	while #visible >= MAX_VISIBLE do
		table.remove(visible, 1):Destroy()
	end

	local toast = Theme.new("Frame", {
		Name = "Toast",
		BackgroundColor3 = Theme.Colors.PanelDark,
		BackgroundTransparency = 0.1,
		Size = UDim2.fromScale(1, 0),
		AutomaticSize = Enum.AutomaticSize.Y,
		LayoutOrder = math.floor(os.clock() * 1000),
		Parent = container,
	})
	Theme.corner(toast, 12)
	Theme.stroke(toast, 3, color, true)
	Theme.padding(toast, 8)
	local label = Theme.label({
		Text = text,
		Scaled = false,
		TextSize = 20,
		Color = Theme.Colors.Text,
		Size = UDim2.fromScale(1, 0),
		AutomaticSize = Enum.AutomaticSize.Y,
		Parent = toast,
	})
	local scale = Theme.new("UIScale", { Scale = 0.6, Parent = toast })
	Theme.tween(scale, 0.25, { Scale = 1 }, Enum.EasingStyle.Back)

	task.delay(kind == "rare" and 5 or 3.5, function()
		if toast.Parent then
			Theme.tween(toast, 0.3, { BackgroundTransparency = 1 })
			Theme.tween(label, 0.3, { TextTransparency = 1 })
			local stroke = toast:FindFirstChildOfClass("UIStroke")
			if stroke then
				Theme.tween(stroke, 0.3, { Transparency = 1 })
			end
			local labelStroke = label:FindFirstChildOfClass("UIStroke")
			if labelStroke then
				Theme.tween(labelStroke, 0.3, { Transparency = 1 })
			end
			task.wait(0.32)
			toast:Destroy()
		end
	end)
end

function Toasts.init(app)
	App = app
end

function Toasts.start()
	local Theme = App.Theme
	KIND_COLORS = {
		info = Theme.Colors.Blue,
		good = Theme.Colors.Green,
		warn = Theme.Colors.Red,
		rare = Theme.Colors.Gold,
		event = Theme.Colors.Pink,
	}
	container = Theme.new("Frame", {
		Name = "Toasts",
		BackgroundTransparency = 1,
		AnchorPoint = Vector2.new(0.5, 0),
		Position = UDim2.fromScale(0.5, 0.3),
		Size = UDim2.fromScale(0.42, 0.3),
		ZIndex = 50,
		Parent = App.overlay,
	})
	Theme.new("UISizeConstraint", { MinSize = Vector2.new(260, 0), MaxSize = Vector2.new(520, math.huge), Parent = container })
	Theme.new("UIListLayout", {
		SortOrder = Enum.SortOrder.LayoutOrder,
		Padding = UDim.new(0, 6),
		HorizontalAlignment = Enum.HorizontalAlignment.Center,
		Parent = container,
	})
	Net.event("Toast").OnClientEvent:Connect(function(text, kind)
		Toasts.show(text, kind)
		if kind == "rare" or kind == "event" then
			App.Sounds.play("Unlock", 1.2, 0.5)
		end
	end)
end

return Toasts
