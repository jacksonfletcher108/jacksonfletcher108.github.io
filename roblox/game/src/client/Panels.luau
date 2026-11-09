--[[
	The menus: Upgrades, Quests, Daily, Star Book, Shop, Zones, Supernova.
	One open at a time, centered, with a big red X to close. Every panel
	redraws from the latest server state, so it's never out of date.

	Shop prices are read live from Roblox (MarketplaceService), never
	hard-coded, so discounts and price changes always show correctly.
]]

local MarketplaceService = game:GetService("MarketplaceService")
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")

local Config = require(game:GetService("ReplicatedStorage").Shared.Config)
local Formulas = require(game:GetService("ReplicatedStorage").Shared.Formulas)

local Panels = {}
local App

local player = Players.LocalPlayer
local panels = {} -- [name] = { frame, content, update }
local openName = nil
local backdrop
local priceCache = {} -- [id] = "R$ 199"

local ROBUX = utf8.char(0xE002) -- Roblox's Robux icon in its fonts

---------------------------------------------------------------------------
-- Building blocks
---------------------------------------------------------------------------
local function clear(container: Instance)
	for _, child in ipairs(container:GetChildren()) do
		if child:IsA("GuiObject") then
			child:Destroy()
		end
	end
end

local function row(parent: Instance, order: number, height: number?)
	local Theme = App.Theme
	local frame = Theme.new("Frame", {
		Name = "Row",
		BackgroundColor3 = Theme.Colors.Row,
		Size = UDim2.new(1, 0, 0, height or 72),
		LayoutOrder = order,
		Parent = parent,
	})
	Theme.corner(frame, 12)
	Theme.stroke(frame, 2, nil, true)
	return frame
end

local function rowText(parent: Instance, title: string, subtitle: string?, widthScale: number?)
	local Theme = App.Theme
	local width = widthScale or 0.6
	Theme.label({
		Name = "Title",
		Text = title,
		RichText = true,
		AlignX = Enum.TextXAlignment.Left,
		Size = UDim2.new(width, -16, subtitle and 0.5 or 0.8, 0),
		Position = UDim2.new(0, 12, subtitle and 0.06 or 0.1, 0),
		MaxTextSize = 24,
		Parent = parent,
	})
	if subtitle then
		Theme.label({
			Name = "Subtitle",
			Text = subtitle,
			RichText = true,
			Color = Theme.Colors.SubText,
			AlignX = Enum.TextXAlignment.Left,
			Size = UDim2.new(width, -16, 0.36, 0),
			Position = UDim2.new(0, 12, 0.56, 0),
			MaxTextSize = 18,
			Outline = false,
			Parent = parent,
		})
	end
end

local function rowButton(parent: Instance, text: string, color: Color3, onClick)
	return App.Theme.button({
		Text = text,
		Color = color,
		AnchorPoint = Vector2.new(1, 0.5),
		Position = UDim2.new(1, -10, 0.5, 0),
		Size = UDim2.new(0.34, 0, 0, 50),
		MaxTextSize = 24,
		OnClick = onClick,
		Parent = parent,
	})
end

local function progressBar(parent: Instance, fraction: number, color: Color3)
	local Theme = App.Theme
	local bar = Theme.new("Frame", {
		Name = "Bar",
		BackgroundColor3 = Theme.Colors.PanelDark,
		Size = UDim2.new(0.56, -16, 0, 10),
		Position = UDim2.new(0, 12, 1, -16),
		Parent = parent,
	})
	Theme.corner(bar, 999)
	local fill = Theme.new("Frame", {
		BackgroundColor3 = color,
		Size = UDim2.fromScale(math.clamp(fraction, 0, 1), 1),
		Parent = bar,
	})
	Theme.corner(fill, 999)
	return bar
end

local function note(parent: Instance, text: string, order: number)
	App.Theme.label({
		Text = text,
		RichText = true,
		Scaled = false,
		TextSize = 18,
		Color = App.Theme.Colors.SubText,
		Size = UDim2.fromScale(1, 0),
		AutomaticSize = Enum.AutomaticSize.Y,
		LayoutOrder = order,
		Outline = false,
		Parent = parent,
	})
end

local function createPanel(name: string, title: string, accent: Color3, update, signature)
	local Theme = App.Theme
	local frame = Theme.new("Frame", {
		Name = name .. "Panel",
		BackgroundColor3 = Theme.Colors.Panel,
		AnchorPoint = Vector2.new(0.5, 0.5),
		Position = UDim2.fromScale(0.5, 0.54),
		Size = UDim2.fromScale(0.62, 0.74),
		Visible = false,
		ZIndex = 20,
		Parent = App.overlay,
	})
	Theme.new("UISizeConstraint", { MinSize = Vector2.new(300, 240), MaxSize = Vector2.new(720, 560), Parent = frame })
	Theme.corner(frame, 18)
	Theme.stroke(frame, 4, nil, true)

	local header = Theme.new("Frame", {
		Name = "Header",
		BackgroundColor3 = accent,
		Size = UDim2.new(1, 0, 0, 52),
		Parent = frame,
	})
	Theme.corner(header, 18)
	Theme.gradient(header)
	Theme.label({
		Text = title,
		Size = UDim2.new(1, -120, 0, 40),
		Position = UDim2.fromOffset(16, 6),
		AlignX = Enum.TextXAlignment.Left,
		MaxTextSize = 32,
		OutlineThickness = 3,
		Parent = header,
	})
	Theme.button({
		Name = "Close",
		Text = "✕",
		Color = Theme.Colors.Red,
		AnchorPoint = Vector2.new(1, 0),
		Position = UDim2.new(1, 6, 0, -6),
		Size = UDim2.fromOffset(54, 54),
		Radius = 999,
		MaxTextSize = 30,
		OnClick = function()
			Panels.close()
		end,
		Parent = frame,
	})

	local content = Theme.new("ScrollingFrame", {
		Name = "Content",
		BackgroundTransparency = 1,
		BorderSizePixel = 0,
		Position = UDim2.fromOffset(14, 62),
		Size = UDim2.new(1, -28, 1, -74),
		CanvasSize = UDim2.new(),
		AutomaticCanvasSize = Enum.AutomaticSize.Y,
		ScrollBarThickness = 8,
		ScrollingDirection = Enum.ScrollingDirection.Y,
		Parent = frame,
	})
	Theme.new("UIListLayout", {
		SortOrder = Enum.SortOrder.LayoutOrder,
		Padding = UDim.new(0, 8),
		Parent = content,
	})
	Theme.new("UIPadding", { PaddingRight = UDim.new(0, 10), PaddingBottom = UDim.new(0, 6), Parent = content })
	panels[name] = { frame = frame, content = content, update = update, signature = signature, last = nil }
end

---------------------------------------------------------------------------
-- Panels
---------------------------------------------------------------------------
local function updateUpgrades(content, state)
	local C = App.Theme.Colors
	clear(content)
	for i, upgrade in ipairs(Config.Upgrades) do
		local info = state.upgrades[upgrade.id]
		local r = row(content, i)
		rowText(r, string.format("%s  <font color=\"#BEC3EB\">Lv %d/%d</font>", upgrade.name, info.level, upgrade.maxLevel), upgrade.description)
		progressBar(r, info.level / upgrade.maxLevel, C.Green)
		if info.cost then
			local afford = state.stardust >= info.cost
			rowButton(r, "★ " .. Formulas.formatNumber(info.cost), afford and C.Green or C.Gray, function()
				App.State.act("BuyUpgrade", upgrade.id)
			end)
		else
			rowButton(r, "MAX", C.Gold, nil)
		end
	end
	note(content, "Tip: Spring Shoes help you catch stars in mid-air for <b>1.5x</b>.", 99)
end

local function updateQuests(content, state)
	local C = App.Theme.Colors
	clear(content)
	for i, quest in ipairs(state.quests) do
		local r = row(content, i)
		rowText(r, quest.text, string.format("%d / %d   ·   reward ★ %s", quest.progress, quest.goal, Formulas.formatNumber(quest.reward)))
		progressBar(r, quest.progress / quest.goal, C.Blue)
		if quest.claimed then
			rowButton(r, "✔ Done", C.Gray, nil)
		elseif quest.done then
			rowButton(r, "Claim!", C.Green, function()
				App.State.act("ClaimQuest", i)
			end)
		else
			rowButton(r, math.floor(quest.progress / quest.goal * 100) .. "%", C.Gray, nil)
		end
	end
	note(content, "Finish all three for <b>" .. Config.QuestAllDoneBoostMinutes .. " minutes of 2x Stardust</b>. New quests every day.", 99)
end

local function updateDaily(content, state)
	local Theme = App.Theme
	local C = Theme.Colors
	clear(content)
	local grid = Theme.new("Frame", {
		Name = "Days",
		BackgroundTransparency = 1,
		Size = UDim2.fromScale(1, 0),
		AutomaticSize = Enum.AutomaticSize.Y,
		LayoutOrder = 1,
		Parent = content,
	})
	Theme.new("UIGridLayout", {
		CellSize = UDim2.new(0.25, -8, 0, 92),
		CellPadding = UDim2.fromOffset(8, 8),
		SortOrder = Enum.SortOrder.LayoutOrder,
		Parent = grid,
	})
	local today = state.daily.day
	for i, reward in ipairs(state.daily.preview) do
		local isToday = i == today
		local claimedThisCycle = i < today
		local tile = Theme.new("Frame", {
			BackgroundColor3 = isToday and C.Pink or (claimedThisCycle and C.PanelDark or C.Row),
			LayoutOrder = i,
			Parent = grid,
		})
		Theme.corner(tile, 12)
		Theme.stroke(tile, isToday and 3 or 2, isToday and C.Gold or nil, true)
		Theme.label({ Text = "Day " .. i, Size = UDim2.fromScale(1, 0.3), MaxTextSize = 20, Parent = tile })
		Theme.label({
			Text = (claimedThisCycle and "✔ " or "★ ") .. Formulas.formatNumber(reward.amount),
			Color = C.Gold,
			Size = UDim2.fromScale(1, 0.34),
			Position = UDim2.fromScale(0, 0.32),
			MaxTextSize = 24,
			Parent = tile,
		})
		if reward.boostMinutes then
			Theme.label({
				Text = "+" .. reward.boostMinutes .. "m 2x",
				Color = C.Green,
				Size = UDim2.fromScale(1, 0.26),
				Position = UDim2.fromScale(0, 0.68),
				MaxTextSize = 18,
				Parent = tile,
			})
		end
	end
	local r = row(content, 2, 64)
	r.BackgroundTransparency = 1
	if state.daily.canClaim then
		App.Theme.button({
			Text = "Claim Day " .. today .. "!",
			Color = C.Green,
			AnchorPoint = Vector2.new(0.5, 0.5),
			Position = UDim2.fromScale(0.5, 0.5),
			Size = UDim2.new(0.6, 0, 0, 54),
			OnClick = function()
				App.State.act("ClaimDaily")
			end,
			Parent = r,
		})
	else
		App.Theme.label({
			Text = "Next reward in " .. Formulas.formatTime(state.daily.wait),
			Size = UDim2.new(1, 0, 0, 40),
			Position = UDim2.fromScale(0, 0.2),
			MaxTextSize = 26,
			Parent = r,
		})
	end
	note(content, "Missed a day? No problem: your streak waits for you instead of resetting.", 3)
end

local function updateBook(content, state)
	local Theme = App.Theme
	clear(content)
	local found = 0
	for _, star in ipairs(Config.Stars) do
		if (state.book[star.id] or 0) > 0 then
			found += 1
		end
	end
	note(content, string.format("<b>%d / %d</b> stars discovered. Rarer stars fall in later zones, and the Nova only falls during Meteor Showers.", found, #Config.Stars), 0)
	for i, star in ipairs(Config.Stars) do
		local count = state.book[star.id] or 0
		local r = row(content, i, 60)
		local dot = Theme.new("Frame", {
			BackgroundColor3 = count > 0 and star.color or Theme.Colors.PanelDark,
			Size = UDim2.fromOffset(40, 40),
			Position = UDim2.new(0, 10, 0.5, 0),
			AnchorPoint = Vector2.new(0, 0.5),
			Parent = r,
		})
		Theme.corner(dot, 999)
		Theme.stroke(dot, 2, nil, true)
		local holder = Theme.new("Frame", {
			BackgroundTransparency = 1,
			Position = UDim2.fromOffset(56, 0),
			Size = UDim2.new(1, -56, 1, 0),
			Parent = r,
		})
		local rarityHex = Config.RarityColors[star.rarity]:ToHex()
		if count > 0 then
			rowText(holder, string.format("%s  <font color=\"#%s\">%s</font>", star.name, rarityHex, star.rarity), string.format("Worth ★%s each · caught %s", Formulas.formatNumber(star.value), Formulas.commas(count)), 0.95)
		else
			rowText(holder, "???  <font color=\"#" .. rarityHex .. "\">" .. star.rarity .. "</font>", "Not found yet", 0.95)
		end
	end
end

local function priceText(id: number, infoType: Enum.InfoType): string
	if priceCache[id] then
		return priceCache[id]
	end
	priceCache[id] = "..."
	task.spawn(function()
		local ok, info = pcall(function()
			return MarketplaceService:GetProductInfo(id, infoType)
		end)
		if ok and info and info.PriceInRobux then
			priceCache[id] = ROBUX .. " " .. info.PriceInRobux
		else
			priceCache[id] = "Buy"
		end
		if openName == "Shop" then
			Panels.refresh(true)
		end
	end)
	return priceCache[id]
end

local function updateShop(content, state)
	local C = App.Theme.Colors
	clear(content)
	local owned = {}
	for _, key in ipairs(state.passes) do
		owned[key] = true
	end
	local order = 0
	if #state.catalog.passes + #state.catalog.products == 0 then
		note(content, RunService:IsStudio()
			and "<b>Shop is empty.</b> Create game passes and developer products in the Creator Dashboard, then paste their IDs into <b>Config.luau</b> (GamePasses / DevProducts). Items with ID 0 stay hidden."
			or "The shop opens soon!", 1)
		return
	end
	note(content, "Everything here is optional. You can unlock every zone and star for free.", 0)
	for _, pass in ipairs(state.catalog.passes) do
		order += 1
		local r = row(content, order)
		rowText(r, pass.name, pass.description)
		if owned[pass.key] then
			rowButton(r, "✔ Owned", C.Gray, nil)
		else
			rowButton(r, priceText(pass.id, Enum.InfoType.GamePass), C.Gold, function()
				MarketplaceService:PromptGamePassPurchase(player, pass.id)
			end)
		end
	end
	for _, product in ipairs(state.catalog.products) do
		order += 1
		local r = row(content, order)
		rowText(r, product.name, product.description)
		rowButton(r, priceText(product.id, Enum.InfoType.Product), C.Gold, function()
			MarketplaceService:PromptProductPurchase(player, product.id)
		end)
	end
end

local function updateZones(content, state)
	local C = App.Theme.Colors
	clear(content)
	for i, zone in ipairs(Config.Zones) do
		local r = row(content, i)
		local stars = {}
		for id in pairs(zone.weights) do
			table.insert(stars, Formulas.getStar(id))
		end
		table.sort(stars, function(a, b)
			return a.value < b.value
		end)
		local names = {}
		for _, s in ipairs(stars) do
			table.insert(names, s.name)
		end
		local subtitle = table.concat(names, ", ")
		if i <= state.bestZone then
			rowText(r, "✔ " .. zone.name, subtitle)
			rowButton(r, "Go", C.Blue, function()
				App.State.act("Teleport", i)
				Panels.close()
			end)
		elseif i == state.bestZone + 1 then
			rowText(r, "🔒 " .. zone.name, subtitle)
			local afford = state.stardust >= zone.cost
			rowButton(r, "★ " .. Formulas.formatNumber(zone.cost), afford and C.Green or C.Gray, function()
				App.State.act("UnlockZone", i)
			end)
		else
			rowText(r, "🔒 " .. zone.name, "Unlock " .. Config.Zones[i - 1].name .. " first")
			rowButton(r, "★ " .. Formulas.formatNumber(zone.cost), C.Gray, nil)
		end
	end
	note(content, "You can also walk through a zone's gate to unlock it.", 99)
end

local function updateSupernova(content, state)
	local C = App.Theme.Colors
	clear(content)
	local now = Formulas.supernovaMultiplier(state.novas)
	local next = Formulas.supernovaMultiplier(state.novas + 1)
	note(
		content,
		string.format(
			"Go <b>Supernova</b> to start fresh with a permanent boost.\n\nYou keep: your Star Book, quests, daily streak and passes.\nYou reset: Stardust, upgrades and zones.\n\nYour bonus: <b>x%s</b> → <font color=\"#FFC83D\"><b>x%s</b></font> on every catch, forever. You also get a new aura color.",
			tostring(now),
			tostring(next)
		),
		1
	)
	local r = row(content, 2, 72)
	local ok, why = Formulas.canSupernova(state.stardust, state.bestZone, state.novas)
	rowText(r, "Supernova #" .. (state.novas + 1), ok and "Ready!" or why)
	rowButton(r, "★ " .. Formulas.formatNumber(state.supernovaCost), ok and C.Purple or C.Gray, function()
		if ok then
			App.State.act("Supernova")
			Panels.close()
		else
			App.Toasts.show(why, "warn")
		end
	end)
end

---------------------------------------------------------------------------
-- What each panel depends on (it only redraws when this text changes)
---------------------------------------------------------------------------
local function affordList(state, costs)
	local parts = {}
	for _, cost in ipairs(costs) do
		table.insert(parts, state.stardust >= cost and "1" or "0")
	end
	return table.concat(parts)
end

local signatures = {
	Upgrades = function(state)
		local parts = {}
		for _, upgrade in ipairs(Config.Upgrades) do
			local info = state.upgrades[upgrade.id]
			table.insert(parts, info.level .. ":" .. ((info.cost and state.stardust >= info.cost) and "y" or "n"))
		end
		return table.concat(parts, ",")
	end,
	Quests = function(state)
		local parts = {}
		for _, quest in ipairs(state.quests) do
			table.insert(parts, quest.progress .. (quest.claimed and "c" or "") .. quest.reward)
		end
		return table.concat(parts, ",")
	end,
	Daily = function(state)
		return tostring(state.daily.canClaim) .. state.daily.day .. ":" .. math.floor(state.daily.wait / 60)
	end,
	Book = function(state)
		local parts = {}
		for _, star in ipairs(Config.Stars) do
			table.insert(parts, tostring(state.book[star.id] or 0))
		end
		return table.concat(parts, ",")
	end,
	Shop = function(state)
		return table.concat(state.passes, ",") .. #state.catalog.passes .. #state.catalog.products
	end,
	Zones = function(state)
		local costs = {}
		for _, zone in ipairs(Config.Zones) do
			table.insert(costs, zone.cost)
		end
		return state.bestZone .. affordList(state, costs)
	end,
	Supernova = function(state)
		return state.novas .. tostring((Formulas.canSupernova(state.stardust, state.bestZone, state.novas)))
	end,
}

---------------------------------------------------------------------------
-- Open / close
---------------------------------------------------------------------------
-- Redraws the open panel, but only when something it shows has changed,
-- so buttons don't flicker while you're catching stars.
function Panels.refresh(force: boolean?)
	local panel = openName and panels[openName]
	local state = App.State.get()
	if not panel or not state then
		return
	end
	local key = panel.signature(state)
	if force or key ~= panel.last then
		panel.last = key
		panel.update(panel.content, state)
	end
end

function Panels.open(name: string)
	if openName then
		panels[openName].frame.Visible = false
	end
	local panel = panels[name]
	if not panel then
		return
	end
	openName = name
	backdrop.Visible = true
	panel.frame.Visible = true
	local scale = panel.frame:FindFirstChildOfClass("UIScale") or App.Theme.new("UIScale", { Parent = panel.frame })
	scale.Scale = 0.85
	App.Theme.tween(scale, 0.2, { Scale = 1 }, Enum.EasingStyle.Back)
	Panels.refresh(true)
end

function Panels.close()
	if openName then
		panels[openName].frame.Visible = false
	end
	openName = nil
	backdrop.Visible = false
end

function Panels.toggle(name: string)
	if openName == name then
		Panels.close()
	else
		Panels.open(name)
	end
end

function Panels.isOpen(name: string): boolean
	return openName == name
end

function Panels.init(app)
	App = app
end

function Panels.start()
	local Theme = App.Theme
	local C = Theme.Colors
	backdrop = Theme.new("TextButton", {
		Name = "Backdrop",
		Text = "",
		AutoButtonColor = false,
		BackgroundColor3 = Color3.new(0, 0, 0),
		BackgroundTransparency = 0.55,
		Size = UDim2.fromScale(1, 1),
		Visible = false,
		ZIndex = 15,
		Parent = App.fullscreen,
	})
	backdrop.Activated:Connect(Panels.close)

	createPanel("Upgrades", "⬆ Upgrades", C.Green, updateUpgrades, signatures.Upgrades)
	createPanel("Quests", "📜 Daily Quests", C.Blue, updateQuests, signatures.Quests)
	createPanel("Daily", "🎁 Daily Reward", C.Pink, updateDaily, signatures.Daily)
	createPanel("Book", "📖 Star Book", C.Gold, updateBook, signatures.Book)
	createPanel("Shop", "🛒 Shop", C.Gold, updateShop, signatures.Shop)
	createPanel("Zones", "🗺 Zones", C.Blue, updateZones, signatures.Zones)
	createPanel("Supernova", "💥 Supernova", C.Purple, updateSupernova, signatures.Supernova)

	App.State.Changed:Connect(function()
		Panels.refresh()
	end)
end

return Panels
