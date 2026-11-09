--[[
	Game passes and developer products.

	Passes are checked once when you join and again right after you buy one.
	Developer products are granted in ProcessReceipt, which follows Roblox's
	rules so a purchase is never lost or given twice:
	  1. If we can't find the player or their data yet -> NotProcessedYet
	     (Roblox will try again later, e.g. next time they join).
	  2. If this PurchaseId was already granted -> PurchaseGranted.
	  3. Grant it, remember the PurchaseId, SAVE, and only then confirm.
	     If the save fails -> NotProcessedYet.

	Items with ID 0 in Config are hidden from the shop.
]]

local MarketplaceService = game:GetService("MarketplaceService")
local Players = game:GetService("Players")

local Config = require(game:GetService("ReplicatedStorage").Shared.Config)

local Shop = {}
local S

local owned = {} -- [Player] = { [passKey] = true }
local passById = {}
local productById = {}
for _, pass in ipairs(Config.GamePasses) do
	if pass.id ~= 0 then
		passById[pass.id] = pass
	end
end
for _, product in ipairs(Config.DevProducts) do
	if product.id ~= 0 then
		productById[product.id] = product
	end
end

local MAX_RECEIPTS = 50

function Shop.hasPass(player: Player, key: string): boolean
	local set = owned[player]
	return set ~= nil and set[key] == true
end

function Shop.ownedPasses(player: Player)
	local list = {}
	for key in pairs(owned[player] or {}) do
		table.insert(list, key)
	end
	return list
end

local function onPassOwned(player: Player, pass, isNew: boolean)
	owned[player] = owned[player] or {}
	owned[player][pass.key] = true
	S.Characters.refresh(player)
	S.State.push(player)
	if isNew then
		S.Toasts.send(player, "Thanks! " .. pass.name .. " is active.", "good")
	end
end

local function checkPasses(player: Player)
	owned[player] = owned[player] or {}
	for _, pass in ipairs(Config.GamePasses) do
		if pass.id ~= 0 then
			local ok, has = pcall(function()
				return MarketplaceService:UserOwnsGamePassAsync(player.UserId, pass.id)
			end)
			if ok and has then
				onPassOwned(player, pass, false)
			end
		end
	end
end

---------------------------------------------------------------------------
-- Developer products
---------------------------------------------------------------------------
local grants = {
	MeteorShower = function(player: Player)
		S.Events.callShower(player)
	end,
	Boost30 = function(player: Player)
		S.Economy.grantBoost(player, 30)
		S.Toasts.send(player, "2x Boost: +30 minutes!", "good")
	end,
	PouchSmall = function(player: Player, product)
		local amount = S.Economy.minutesOfEarnings(player, product.minutes)
		S.Economy.add(player, amount, "Robux_" .. product.key)
		S.Toasts.send(player, "+" .. amount .. " Stardust. Thanks!", "good")
	end,
	PouchLarge = function(player: Player, product)
		local amount = S.Economy.minutesOfEarnings(player, product.minutes)
		S.Economy.add(player, amount, "Robux_" .. product.key)
		S.Toasts.send(player, "+" .. amount .. " Stardust. Thanks!", "good")
	end,
}

local function processReceipt(receipt)
	local player = Players:GetPlayerByUserId(receipt.PlayerId)
	if not player then
		return Enum.ProductPurchaseDecision.NotProcessedYet
	end
	local data = S.Data.waitFor(player, 10)
	if not data then
		return Enum.ProductPurchaseDecision.NotProcessedYet
	end
	if table.find(data.receipts, receipt.PurchaseId) then
		return Enum.ProductPurchaseDecision.PurchaseGranted
	end
	local product = productById[receipt.ProductId]
	local grant = product and grants[product.key]
	if not grant then
		warn("[Shop] No grant for product " .. tostring(receipt.ProductId))
		return Enum.ProductPurchaseDecision.NotProcessedYet
	end

	local ok, err = pcall(grant, player, product)
	if not ok then
		warn("[Shop] Grant failed: " .. tostring(err))
		return Enum.ProductPurchaseDecision.NotProcessedYet
	end
	table.insert(data.receipts, receipt.PurchaseId)
	while #data.receipts > MAX_RECEIPTS do
		table.remove(data.receipts, 1)
	end
	if not S.Data.saveNow(player) then
		-- Already granted in memory and the receipt is remembered, so a retry
		-- in this session won't grant twice. If the server dies before saving,
		-- the grant is lost too and Roblox retries next time: still consistent.
		return Enum.ProductPurchaseDecision.NotProcessedYet
	end
	return Enum.ProductPurchaseDecision.PurchaseGranted
end

-- What the client shop shows. Only items with a real ID.
function Shop.catalog()
	local passes, products = {}, {}
	for _, pass in ipairs(Config.GamePasses) do
		if pass.id ~= 0 then
			table.insert(passes, { key = pass.key, id = pass.id, name = pass.name, description = pass.description })
		end
	end
	for _, product in ipairs(Config.DevProducts) do
		if product.id ~= 0 then
			table.insert(products, { key = product.key, id = product.id, name = product.name, description = product.description })
		end
	end
	return passes, products
end

function Shop.init(services)
	S = services
end

function Shop.start()
	MarketplaceService.ProcessReceipt = processReceipt

	MarketplaceService.PromptGamePassPurchaseFinished:Connect(function(player, passId, purchased)
		local pass = passById[passId]
		if purchased and pass then
			onPassOwned(player, pass, true)
		end
	end)

	Players.PlayerAdded:Connect(checkPasses)
	for _, player in ipairs(Players:GetPlayers()) do
		task.spawn(checkPasses, player)
	end
	Players.PlayerRemoving:Connect(function(player)
		owned[player] = nil
	end)
end

return Shop
