--[[
	The always-on screen. Kept minimal (PLAYBOOK: UI):
	  top center   Stardust count, your multiplier and boost timer, and the
	               NEXT GOAL bar (always shows what you're working toward)
	  left side    Upgrades, Quests, Daily, Star Book
	  right side   Shop, Zones, Supernova, Invite
	  bottom       combo counter while you're on a streak
	Red dots mean something is ready for you.
]]

local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local SocialService = game:GetService("SocialService")

local Config = require(game:GetService("ReplicatedStorage").Shared.Config)
local Formulas = require(game:GetService("ReplicatedStorage").Shared.Formulas)
local Net = require(game:GetService("ReplicatedStorage").Shared.Net)

local Hud = {}
local App

local player = Players.LocalPlayer
local refs = {}
local displayed = 0
local comboShownAt = 0

---------------------------------------------------------------------------
-- What to show in the NEXT GOAL bar
---------------------------------------------------------------------------
local function nextGoal(state)
	if state.bestZone < #Config.Zones then
		local zone = Config.Zones[state.bestZone + 1]
		return "Unlock " .. zone.name, zone.cost, zone.accent
	end
	return "Go Supernova (x" .. tostring(Formulas.supernovaMultiplier(state.novas + 1)) .. " forever)", state.supernovaCost, App.Theme.Colors.Purple
end

local function sideButton(parent, name: string, icon: string, color: Color3, order: number, onClick)
	local Theme = App.Theme
	local holder = Theme.new("Frame", {
		Name = name,
		BackgroundTransparency = 1,
		Size = UDim2.fromScale(1, 1),
		SizeConstraint = Enum.SizeConstraint.RelativeXX,
		LayoutOrder = order,
		Parent = parent,
	})
	local button = Theme.button({
		Name = "Button",
		Text = icon,
		Color = color,
		Size = UDim2.fromScale(1, 1),
		Radius = 16,
		MaxTextSize = 40,
		OnClick = onClick,
		Parent = holder,
	})
	local caption = Theme.label({
		Name = "Caption",
		Text = name,
		Size = UDim2.fromScale(1.3, 0.3),
		Position = UDim2.fromScale(0.5, 1.02),
		AnchorPoint = Vector2.new(0.5, 0),
		MaxTextSize = 16,
		Parent = holder,
	})
	local badge = App.Theme.badge(button)
	return holder, badge, caption
end

-- Short screens (phones held sideways) get a compact 2x2 grid so the right
-- side stays clear of the jump button and the left of the thumbstick.
-- Taller screens get one column per side.
local SHORT_SCREEN = 500

local function layoutColumn(frame: Frame, short: boolean)
	local Theme = App.Theme
	for _, child in ipairs(frame:GetChildren()) do
		if child:IsA("UIGridStyleLayout") or child:IsA("UISizeConstraint") then
			child:Destroy()
		end
	end
	if short then
		frame.SizeConstraint = Enum.SizeConstraint.RelativeXY
		frame.Size = UDim2.fromOffset(112, 140)
		Theme.new("UIGridLayout", {
			CellSize = UDim2.fromOffset(46, 46),
			CellPadding = UDim2.fromOffset(18, 24),
			SortOrder = Enum.SortOrder.LayoutOrder,
			HorizontalAlignment = Enum.HorizontalAlignment.Center,
			Parent = frame,
		})
	else
		-- width is 9.5% of screen height (RelativeYY), so buttons are the same
		-- physical size on every screen shape; never smaller than 46px
		frame.SizeConstraint = Enum.SizeConstraint.RelativeYY
		frame.Size = UDim2.fromScale(0.095, 0.62)
		Theme.new("UISizeConstraint", { MinSize = Vector2.new(46, 200), Parent = frame })
		Theme.new("UIListLayout", {
			SortOrder = Enum.SortOrder.LayoutOrder,
			Padding = UDim.new(0.07, 0),
			HorizontalAlignment = Enum.HorizontalAlignment.Center,
			Parent = frame,
		})
	end
end

local function isShortScreen(): boolean
	local camera = workspace.CurrentCamera
	return camera ~= nil and camera.ViewportSize.Y < SHORT_SCREEN
end

local function column(name: string, anchorX: number, positionX: number)
	local frame = App.Theme.new("Frame", {
		Name = name,
		BackgroundTransparency = 1,
		AnchorPoint = Vector2.new(anchorX, 0),
		Position = UDim2.new(positionX, positionX == 0 and 10 or -10, 0.2, 0),
		Parent = App.screen,
	})
	local short = isShortScreen()
	layoutColumn(frame, short)
	local camera = workspace.CurrentCamera
	if camera then
		camera:GetPropertyChangedSignal("ViewportSize"):Connect(function()
			local nowShort = isShortScreen()
			if nowShort ~= short then
				short = nowShort
				layoutColumn(frame, short)
			end
		end)
	end
	return frame
end

local function invite()
	local ok, canInvite = pcall(function()
		return SocialService:CanSendGameInviteAsync(player)
	end)
	if ok and canInvite then
		pcall(function()
			local options = Instance.new("ExperienceInviteOptions")
			options.PromptMessage = "Catch falling stars with me! Friends earn +10% each."
			SocialService:PromptGameInvite(player, options)
		end)
	else
		App.Toasts.show("Invites aren't available on this account.", "warn")
	end
end

---------------------------------------------------------------------------
-- Build
---------------------------------------------------------------------------
local function build()
	local Theme = App.Theme
	local C = Theme.Colors

	-- Stardust counter
	local top = Theme.new("Frame", {
		Name = "Top",
		BackgroundTransparency = 1,
		AnchorPoint = Vector2.new(0.5, 0),
		Position = UDim2.new(0.5, 0, 0, 6),
		Size = UDim2.fromScale(0.75, 0.24),
		SizeConstraint = Enum.SizeConstraint.RelativeYY,
		Parent = App.screen,
	})
	local pill = Theme.new("Frame", {
		Name = "Stardust",
		BackgroundColor3 = C.PanelDark,
		Size = UDim2.fromScale(1, 0.4),
		Parent = top,
	})
	Theme.corner(pill, 999)
	Theme.stroke(pill, 3, nil, true)
	refs.pillScale = Theme.new("UIScale", { Parent = pill })
	Theme.label({
		Text = "★",
		Color = C.Gold,
		Size = UDim2.fromScale(0.2, 0.9),
		Position = UDim2.fromScale(0.02, 0.05),
		Parent = pill,
	})
	refs.stardust = Theme.label({
		Name = "Amount",
		Text = "0",
		Size = UDim2.fromScale(0.74, 0.78),
		Position = UDim2.fromScale(0.21, 0.11),
		AlignX = Enum.TextXAlignment.Left,
		MaxTextSize = 40,
		Parent = pill,
	})

	refs.multiplier = Theme.label({
		Name = "Multiplier",
		Text = "",
		RichText = true,
		Size = UDim2.fromScale(1, 0.16),
		Position = UDim2.fromScale(0, 0.42),
		MaxTextSize = 20,
		Parent = top,
	})

	-- Next goal bar
	local goal = Theme.new("Frame", {
		Name = "Goal",
		BackgroundColor3 = C.PanelDark,
		Size = UDim2.fromScale(1.15, 0.2),
		Position = UDim2.fromScale(0.5, 0.6),
		AnchorPoint = Vector2.new(0.5, 0),
		ClipsDescendants = false,
		Parent = top,
	})
	Theme.corner(goal, 10)
	Theme.stroke(goal, 3, nil, true)
	refs.goalFill = Theme.new("Frame", {
		Name = "Fill",
		BackgroundColor3 = C.Gold,
		Size = UDim2.fromScale(0, 1),
		Parent = goal,
	})
	Theme.corner(refs.goalFill, 10)
	Theme.gradient(refs.goalFill)
	refs.goalText = Theme.label({
		Name = "Text",
		Text = "",
		Size = UDim2.fromScale(0.96, 0.8),
		Position = UDim2.fromScale(0.5, 0.5),
		AnchorPoint = Vector2.new(0.5, 0.5),
		MaxTextSize = 20,
		ZIndex = 3,
		Parent = goal,
	})

	-- Meteor Shower banner
	refs.banner = Theme.label({
		Name = "ShowerBanner",
		Text = "",
		Color = C.Pink,
		Size = UDim2.fromScale(1.3, 0.16),
		Position = UDim2.fromScale(0.5, 0.83),
		AnchorPoint = Vector2.new(0.5, 0),
		MaxTextSize = 26,
		OutlineThickness = 3,
		Parent = top,
	})
	refs.banner.Visible = false

	-- Combo
	refs.combo = Theme.label({
		Name = "Combo",
		Text = "",
		Color = C.Gold,
		AnchorPoint = Vector2.new(0.5, 1),
		Position = UDim2.fromScale(0.5, 0.86),
		Size = UDim2.fromScale(0.3, 0.08),
		MaxTextSize = 44,
		OutlineThickness = 3,
		Parent = App.screen,
	})
	refs.comboScale = Theme.new("UIScale", { Parent = refs.combo })
	refs.combo.Visible = false

	-- Side buttons
	local left = column("Left", 0, 0)
	local right = column("Right", 1, 1)
	local panels = App.Panels
	refs.buttons = {}
	local function add(parent, name, icon, color, order, panel)
		local holder, badge = sideButton(parent, name, icon, color, order, function()
			if type(panel) == "function" then
				panel()
			else
				panels.toggle(panel)
			end
		end)
		refs.buttons[name] = { holder = holder, badge = badge }
	end
	add(left, "Upgrades", "⬆", C.Green, 1, "Upgrades")
	add(left, "Quests", "📜", C.Blue, 2, "Quests")
	add(left, "Daily", "🎁", C.Pink, 3, "Daily")
	add(left, "Book", "📖", C.Gold, 4, "Book")
	add(right, "Shop", "🛒", C.Gold, 1, "Shop")
	add(right, "Zones", "🗺", C.Blue, 2, "Zones")
	add(right, "Supernova", "💥", C.Purple, 3, "Supernova")
	add(right, "Invite", "👋", C.Green, 4, invite)
end

---------------------------------------------------------------------------
-- Update
---------------------------------------------------------------------------
local function refresh(state)
	if not state then
		return
	end
	-- multiplier line
	local parts = { "<font color=\"#FFC83D\">x" .. string.format("%.2f", state.multiplier):gsub("%.?0+$", "") .. "</font> Stardust" }
	local boost = App.State.boostLeft()
	if boost > 0 then
		table.insert(parts, "<font color=\"#46D278\">2x BOOST " .. Formulas.formatTime(boost) .. "</font>")
	end
	if state.friends > 0 then
		table.insert(parts, "👥 +" .. math.floor(math.min(state.friends * Config.FriendBonusEach, Config.FriendBonusMax) * 100) .. "%")
	end
	if state.temporary then
		table.insert(parts, "<font color=\"#EB4B5A\">(Studio: not saving)</font>")
	end
	refs.multiplier.Text = table.concat(parts, "   ")

	-- next goal
	local text, cost, color = nextGoal(state)
	local progress = math.clamp(state.stardust / math.max(cost, 1), 0, 1)
	refs.goalFill.BackgroundColor3 = color
	App.Theme.tween(refs.goalFill, 0.25, { Size = UDim2.fromScale(math.max(progress, 0.02), 1) })
	if progress >= 1 then
		refs.goalText.Text = "✔ " .. text .. ": ready!"
	else
		refs.goalText.Text = string.format("%s   %s / %s", text, Formulas.formatNumber(state.stardust), Formulas.formatNumber(cost))
	end

	-- red dots
	local anyUpgrade = false
	for _, upgrade in pairs(state.upgrades) do
		if upgrade.cost and state.stardust >= upgrade.cost then
			anyUpgrade = true
		end
	end
	local questReady = false
	for _, quest in ipairs(state.quests) do
		if quest.done and not quest.claimed then
			questReady = true
		end
	end
	refs.buttons.Upgrades.badge.Visible = anyUpgrade
	refs.buttons.Quests.badge.Visible = questReady
	refs.buttons.Daily.badge.Visible = state.daily.canClaim
	refs.buttons.Supernova.badge.Visible = Formulas.canSupernova(state.stardust, state.bestZone, state.novas)
	refs.buttons.Shop.holder.Visible = #state.catalog.passes + #state.catalog.products > 0 or RunService:IsStudio()
end

-- Called by Effects when you catch a star.
function Hud.onEarn(_value: number, combo: number)
	if not App.Theme.reducedMotion() then
		refs.pillScale.Scale = 1.12
		App.Theme.tween(refs.pillScale, 0.25, { Scale = 1 }, Enum.EasingStyle.Back)
	end
	if combo >= 2 then
		refs.combo.Visible = true
		refs.combo.Text = "COMBO x" .. combo .. "  (+" .. math.floor((Formulas.comboMultiplier(combo) - 1) * 100 + 0.5) .. "%)"
		comboShownAt = os.clock()
		if not App.Theme.reducedMotion() then
			refs.comboScale.Scale = 1.25
			App.Theme.tween(refs.comboScale, 0.2, { Scale = 1 }, Enum.EasingStyle.Back)
		end
	end
end

function Hud.buttonFor(name: string)
	local entry = refs.buttons and refs.buttons[name]
	return entry and entry.holder
end

local function showerText(phase: string, startsAt: number, endsAt: number)
	local now = workspace:GetServerTimeNow()
	if phase == "warning" then
		return "☄️ METEOR SHOWER IN " .. Formulas.formatTime(startsAt - now) .. "!"
	elseif phase == "active" then
		return "☄️ METEOR SHOWER! 4x STARS · " .. Formulas.formatTime(endsAt - now) .. " LEFT"
	end
	return nil
end

function Hud.init(app)
	App = app
end

function Hud.start()
	build()
	App.State.Changed:Connect(refresh)

	local shower = { phase = "idle", startsAt = 0, endsAt = 0 }
	Net.event("ShowerState").OnClientEvent:Connect(function(phase, startsAt, endsAt)
		shower.phase, shower.startsAt, shower.endsAt = phase, startsAt, endsAt
	end)

	local lastSecond = -1
	RunService.RenderStepped:Connect(function(dt)
		local state = App.State.get()
		if not state then
			return
		end
		-- count the number up smoothly instead of jumping
		local target = state.stardust
		if math.abs(target - displayed) < 1 then
			displayed = target
		else
			displayed += (target - displayed) * math.min(1, dt * 12)
		end
		refs.stardust.Text = Formulas.commas(displayed)

		-- combo fades out after the combo window passes
		if refs.combo.Visible and os.clock() - comboShownAt > Config.ComboWindow then
			refs.combo.Visible = false
		end

		-- once a second: timers
		local second = math.floor(os.clock())
		if second ~= lastSecond then
			lastSecond = second
			local text = showerText(shower.phase, shower.startsAt, shower.endsAt)
			refs.banner.Visible = text ~= nil
			refs.banner.Text = text or ""
			refresh(state)
		end
	end)
end

return Hud
