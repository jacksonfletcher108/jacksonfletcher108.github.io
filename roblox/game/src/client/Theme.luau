--[[
	The UI style guide in code: one font, one palette, one way to make a
	button. Every screen uses these helpers so the game looks consistent.

	Look: "cartoony". A rounded bold font, thick dark outlines, rounded
	corners, a soft top-to-bottom gradient, and buttons that grow on hover and
	squish on press with a click sound.
]]

local GuiService = game:GetService("GuiService")
local TweenService = game:GetService("TweenService")

local Theme = {}
local App

Theme.Font = Enum.Font.FredokaOne

Theme.Colors = {
	Panel = Color3.fromRGB(32, 36, 74),
	PanelDark = Color3.fromRGB(22, 24, 52),
	Row = Color3.fromRGB(44, 49, 96),
	Outline = Color3.fromRGB(12, 13, 30),
	Text = Color3.fromRGB(255, 255, 255),
	SubText = Color3.fromRGB(190, 195, 235),
	Gold = Color3.fromRGB(255, 200, 61),
	Green = Color3.fromRGB(70, 210, 120), -- can do it / buy
	Red = Color3.fromRGB(235, 75, 90), -- can't afford / close
	Blue = Color3.fromRGB(80, 160, 255),
	Pink = Color3.fromRGB(255, 92, 150),
	Purple = Color3.fromRGB(160, 100, 255),
	Gray = Color3.fromRGB(110, 115, 150),
	Shadow = Color3.fromRGB(8, 9, 22),
}

function Theme.reducedMotion(): boolean
	local ok, value = pcall(function()
		return GuiService.ReducedMotionEnabled
	end)
	return ok and value == true
end

function Theme.tween(
	object: Instance,
	seconds: number,
	goal,
	style: Enum.EasingStyle?,
	direction: Enum.EasingDirection?
)
	if Theme.reducedMotion() then
		seconds = 0
	end
	local tween = TweenService:Create(
		object,
		TweenInfo.new(seconds, style or Enum.EasingStyle.Quad, direction or Enum.EasingDirection.Out),
		goal
	)
	tween:Play()
	return tween
end

-- Creates an instance: Theme.new("Frame", { Size = ... }, { child, child })
function Theme.new(className: string, props, children)
	local instance = Instance.new(className)
	local parent = nil
	for key, value in pairs(props or {}) do
		if key == "Parent" then
			parent = value
		else
			(instance :: any)[key] = value
		end
	end
	for _, child in ipairs(children or {}) do
		child.Parent = instance
	end
	instance.Parent = parent
	return instance
end

-- A dark outline that scales with the element (new UIStroke sizing, with a
-- fallback for older engine versions).
function Theme.stroke(parent: Instance, thickness: number?, color: Color3?, border: boolean?)
	local stroke = Instance.new("UIStroke")
	stroke.Color = color or Theme.Colors.Outline
	stroke.Thickness = thickness or 3
	stroke.LineJoinMode = Enum.LineJoinMode.Round
	if border then
		stroke.ApplyStrokeMode = Enum.ApplyStrokeMode.Border
	end
	stroke.Parent = parent
	return stroke
end

function Theme.corner(parent: Instance, radius: number?)
	local corner = Instance.new("UICorner")
	corner.CornerRadius = UDim.new(0, radius or 14)
	corner.Parent = parent
	return corner
end

function Theme.gradient(parent: Instance)
	local gradient = Instance.new("UIGradient")
	gradient.Rotation = 90
	gradient.Color = ColorSequence.new(Color3.new(1, 1, 1), Color3.fromRGB(200, 200, 215))
	gradient.Parent = parent
	return gradient
end

function Theme.padding(parent: Instance, pixels: number)
	return Theme.new("UIPadding", {
		PaddingTop = UDim.new(0, pixels),
		PaddingBottom = UDim.new(0, pixels),
		PaddingLeft = UDim.new(0, pixels),
		PaddingRight = UDim.new(0, pixels),
		Parent = parent,
	})
end

-- Text with an outline. Headline numbers use TextScaled with a minimum size;
-- body text uses a fixed size so it respects the player's text-size setting.
function Theme.label(props)
	local label = Theme.new("TextLabel", {
		BackgroundTransparency = 1,
		Font = Theme.Font,
		TextColor3 = props.Color or Theme.Colors.Text,
		Text = props.Text or "",
		TextScaled = props.Scaled ~= false,
		TextSize = props.TextSize or 20,
		TextWrapped = true,
		RichText = props.RichText == true,
		TextXAlignment = props.AlignX or Enum.TextXAlignment.Center,
		TextYAlignment = props.AlignY or Enum.TextYAlignment.Center,
		Size = props.Size or UDim2.fromScale(1, 1),
		Position = props.Position or UDim2.new(),
		AnchorPoint = props.AnchorPoint or Vector2.new(),
		AutomaticSize = props.AutomaticSize or Enum.AutomaticSize.None,
		LayoutOrder = props.LayoutOrder or 0,
		ZIndex = props.ZIndex or 1,
		Name = props.Name or "Label",
		Parent = props.Parent,
	})
	if props.Scaled ~= false then
		Theme.new("UITextSizeConstraint", { MinTextSize = 9, MaxTextSize = props.MaxTextSize or 48, Parent = label })
	end
	if props.Outline ~= false then
		Theme.stroke(label, props.OutlineThickness or 2)
	end
	return label
end

-- Hover grows, press squishes, release bounces back, and every press clicks.
function Theme.feedback(button: GuiButton)
	local scale = button:FindFirstChildOfClass("UIScale") or Theme.new("UIScale", { Parent = button })
	local hovering = false
	local current
	local function to(value: number, seconds: number, style: Enum.EasingStyle?)
		if Theme.reducedMotion() then
			scale.Scale = 1
			return
		end
		if current then
			current:Cancel()
		end
		current = TweenService:Create(scale, TweenInfo.new(seconds, style or Enum.EasingStyle.Quad), { Scale = value })
		current:Play()
	end
	button.MouseEnter:Connect(function()
		hovering = true
		to(1.06, 0.12)
	end)
	button.MouseLeave:Connect(function()
		hovering = false
		to(1, 0.12)
	end)
	button.MouseButton1Down:Connect(function()
		to(0.92, 0.06)
	end)
	button.MouseButton1Up:Connect(function()
		to(hovering and 1.06 or 1, 0.25, Enum.EasingStyle.Back)
	end)
	button.Activated:Connect(function()
		App.Sounds.play("Click")
	end)
	return scale
end

-- A chunky cartoony button. props.OnClick runs on click or tap.
function Theme.button(props)
	local button = Theme.new("TextButton", {
		Name = props.Name or "Button",
		AutoButtonColor = false,
		BackgroundColor3 = props.Color or Theme.Colors.Green,
		Size = props.Size or UDim2.fromOffset(160, 48),
		Position = props.Position or UDim2.new(),
		AnchorPoint = props.AnchorPoint or Vector2.new(),
		LayoutOrder = props.LayoutOrder or 0,
		Text = "",
		ZIndex = props.ZIndex or 1,
		Parent = props.Parent,
	})
	Theme.corner(button, props.Radius or 12)
	Theme.stroke(button, 3, nil, true)
	Theme.gradient(button)
	local label = Theme.label({
		Name = "Text",
		Text = props.Text or "",
		Size = UDim2.fromScale(0.88, 0.72),
		Position = UDim2.fromScale(0.5, 0.5),
		AnchorPoint = Vector2.new(0.5, 0.5),
		MaxTextSize = props.MaxTextSize or 30,
		RichText = props.RichText,
		ZIndex = (props.ZIndex or 1) + 1,
		Parent = button,
	})
	Theme.feedback(button)
	if props.OnClick then
		button.Activated:Connect(props.OnClick)
	end
	return button, label
end

-- A little red dot for "something's waiting here".
function Theme.badge(parent: GuiObject)
	local dot = Theme.new("Frame", {
		Name = "Badge",
		BackgroundColor3 = Theme.Colors.Red,
		Size = UDim2.fromScale(0.3, 0.3),
		Position = UDim2.fromScale(0.92, 0.08),
		AnchorPoint = Vector2.new(0.5, 0.5),
		Visible = false,
		ZIndex = 10,
		Parent = parent,
	})
	Theme.new("UIAspectRatioConstraint", { Parent = dot })
	Theme.corner(dot, 999)
	Theme.stroke(dot, 2, nil, true)
	return dot
end

function Theme.init(app)
	App = app
end

return Theme
