--[[
	Thin wrapper around AnalyticsService so a failed call can never break the
	game. Results show up in the Creator Dashboard under Analytics:
	  - Funnels > Onboarding: where new players drop off (Config.Funnel)
	  - Economy: where Stardust comes from and where it goes

	Catches happen several times a second, so their Stardust is added up and
	logged once a minute per player instead of on every catch.
]]

local AnalyticsService = game:GetService("AnalyticsService")
local Players = game:GetService("Players")

local Config = require(game:GetService("ReplicatedStorage").Shared.Config)

local Analytics = {}
local S
local pendingCatches = {} -- [Player] = amount earned from catches since last flush

local funnelNames = {}
for _, step in ipairs(Config.Funnel) do
	funnelNames[step.step] = step.name
end

-- Logs each onboarding step once, in order. Steps are saved in data.funnel.
function Analytics.funnel(player: Player, step: number)
	local data = S.Data.get(player)
	if not data or data.funnel >= step then
		return
	end
	for s = data.funnel + 1, step do
		pcall(function()
			AnalyticsService:LogOnboardingFunnelStepEvent(player, s, funnelNames[s])
		end)
	end
	data.funnel = step
end

local function logEconomy(player: Player, isSource: boolean, amount: number, transactionType: string, sku: string)
	local data = S.Data.get(player)
	if not data or amount <= 0 then
		return
	end
	pcall(function()
		AnalyticsService:LogEconomyEvent(
			player,
			isSource and Enum.AnalyticsEconomyFlowType.Source or Enum.AnalyticsEconomyFlowType.Sink,
			"Stardust",
			math.floor(amount),
			math.floor(data.stardust),
			transactionType,
			sku
		)
	end)
end

function Analytics.earned(player: Player, amount: number, sku: string)
	if sku == "StarCatch" then
		pendingCatches[player] = (pendingCatches[player] or 0) + amount
		return
	end
	logEconomy(player, true, amount, Enum.AnalyticsEconomyTransactionType.Gameplay.Name, sku)
end

function Analytics.spent(player: Player, amount: number, sku: string)
	logEconomy(player, false, amount, Enum.AnalyticsEconomyTransactionType.Shop.Name, sku)
end

function Analytics.purchasedWithRobux(player: Player, amount: number, sku: string)
	logEconomy(player, true, amount, Enum.AnalyticsEconomyTransactionType.IAP.Name, sku)
end

local function flush(player: Player)
	local amount = pendingCatches[player]
	if amount and amount > 0 then
		pendingCatches[player] = 0
		logEconomy(player, true, amount, Enum.AnalyticsEconomyTransactionType.Gameplay.Name, "StarCatch")
	end
end

function Analytics.init(services)
	S = services
end

function Analytics.start()
	Players.PlayerRemoving:Connect(function(player)
		flush(player)
		pendingCatches[player] = nil
	end)
	task.spawn(function()
		while true do
			task.wait(60)
			for player in pairs(pendingCatches) do
				flush(player)
			end
		end
	end)
end

return Analytics
