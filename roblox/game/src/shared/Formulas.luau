--[[
	Pure game math. No Roblox services, so the same numbers are used by the
	server, the client UI and the unit tests (roblox/game/tests).
]]

local Config = require(script.Parent.Config)

local Formulas = {}

local RARITY_TIER = { Common = 0, Uncommon = 1, Rare = 2, Epic = 3, Legendary = 4, Mythic = 5 }
Formulas.RarityTier = RARITY_TIER

local starsById = {}
for index, star in ipairs(Config.Stars) do
	starsById[star.id] = star
	star.index = index
end

local upgradesById = {}
for _, upgrade in ipairs(Config.Upgrades) do
	upgradesById[upgrade.id] = upgrade
end

function Formulas.getStar(id: string)
	return starsById[id]
end

function Formulas.getUpgrade(id: string)
	return upgradesById[id]
end

---------------------------------------------------------------------------
-- Upgrades
---------------------------------------------------------------------------

-- Price of the NEXT level when you currently own `level` levels.
function Formulas.upgradeCost(id: string, level: number): number?
	local upgrade = upgradesById[id]
	if not upgrade or level >= upgrade.maxLevel then
		return nil
	end
	return math.floor(upgrade.baseCost * upgrade.growth ^ level + 0.5)
end

function Formulas.catchRadius(netLevel: number, hasMagnet: boolean): number
	local radius = Config.BaseCatchRadius + netLevel * upgradesById.Net.perLevel
	if hasMagnet then
		radius *= Config.PassEffects.StarMagnet
	end
	return radius
end

function Formulas.walkSpeed(bootsLevel: number): number
	return Config.BaseWalkSpeed + bootsLevel * upgradesById.Boots.perLevel
end

function Formulas.jumpPower(springLevel: number): number
	return Config.BaseJumpPower + springLevel * upgradesById.Spring.perLevel
end

function Formulas.luck(luckLevel: number, hasLuckyCharm: boolean): number
	local luck = luckLevel * upgradesById.Luck.perLevel
	if hasLuckyCharm then
		luck += Config.PassEffects.LuckyCharm
	end
	return luck
end

---------------------------------------------------------------------------
-- Picking which star falls. `random` is a function returning [0, 1).
-- Luck raises each star's weight by (luck x rarity tier), so it helps rare
-- stars the most without ever removing common ones.
---------------------------------------------------------------------------
function Formulas.starWeights(zoneId: number, luck: number): { { id: string, weight: number } }
	local zone = Config.Zones[zoneId]
	local list = {}
	for _, star in ipairs(Config.Stars) do
		local base = zone.weights[star.id]
		if base then
			local tier = RARITY_TIER[star.rarity] or 0
			table.insert(list, { id = star.id, weight = base * (1 + luck * tier) })
		end
	end
	return list
end

function Formulas.rollStar(zoneId: number, luck: number, random: () -> number): string
	local list = Formulas.starWeights(zoneId, luck)
	local total = 0
	for _, entry in ipairs(list) do
		total += entry.weight
	end
	local pick = random() * total
	for _, entry in ipairs(list) do
		pick -= entry.weight
		if pick < 0 then
			return entry.id
		end
	end
	return list[#list].id
end

---------------------------------------------------------------------------
-- Earnings
---------------------------------------------------------------------------

function Formulas.comboMultiplier(combo: number): number
	local steps = math.min(math.max(combo - 1, 0), Config.ComboMaxSteps)
	return 1 + steps * Config.ComboStep
end

function Formulas.supernovaMultiplier(novas: number): number
	return 1 + novas * Config.Supernova.bonusPerNova
end

-- Everything that multiplies Stardust except the per-catch combo and air bonus.
-- ctx = { novas, hasDouble, boostActive, friends, showerActive }
function Formulas.baseMultiplier(ctx): number
	local mult = Formulas.supernovaMultiplier(ctx.novas or 0)
	if ctx.hasDouble then
		mult *= Config.PassEffects.DoubleStardust
	end
	if ctx.boostActive then
		mult *= 2
	end
	local friendBonus = math.min((ctx.friends or 0) * Config.FriendBonusEach, Config.FriendBonusMax)
	mult *= 1 + friendBonus
	if ctx.showerActive then
		mult *= 1 + Config.MeteorShower.payoutBonus
	end
	return mult
end

function Formulas.catchValue(starId: string, baseMult: number, combo: number, airCatch: boolean): number
	local star = starsById[starId]
	local value = star.value * baseMult * Formulas.comboMultiplier(combo)
	if airCatch then
		value *= Config.AirCatchBonus
	end
	return math.max(1, math.floor(value + 0.5))
end

-- Rewards (daily, quests, packs) are paid in "minutes of earnings" for the
-- best zone you have unlocked, including your Supernova bonus, so they stay
-- worth having at every stage of the game.
function Formulas.earningsPerMinute(bestZone: number, novas: number): number
	local base = Config.EarningsPerMinuteByZone[math.clamp(bestZone, 1, #Config.EarningsPerMinuteByZone)]
	return base * Formulas.supernovaMultiplier(novas)
end

function Formulas.minutesOfEarnings(minutes: number, bestZone: number, novas: number): number
	return math.floor(minutes * Formulas.earningsPerMinute(bestZone, novas) + 0.5)
end

---------------------------------------------------------------------------
-- Supernova (rebirth)
---------------------------------------------------------------------------
function Formulas.supernovaCost(novas: number): number
	return math.floor(Config.Supernova.baseCost * Config.Supernova.growth ^ novas + 0.5)
end

function Formulas.canSupernova(stardust: number, bestZone: number, novas: number): (boolean, string?)
	if bestZone < Config.Supernova.requiredZone then
		return false, "Reach " .. Config.Zones[Config.Supernova.requiredZone].name .. " first"
	end
	local cost = Formulas.supernovaCost(novas)
	if stardust < cost then
		return false, "Need " .. Formulas.formatNumber(cost) .. " Stardust"
	end
	return true, nil
end

---------------------------------------------------------------------------
-- Days, daily rewards and quests (all in UTC days so every server agrees)
---------------------------------------------------------------------------
function Formulas.dayNumber(unixTime: number): number
	return math.floor(unixTime / 86400)
end

-- Returns canClaim, secondsUntilClaim, dayIndex (1..7) of the reward you'd get.
function Formulas.dailyState(lastClaim: number, streak: number, now: number)
	local cooldown = Config.DailyCooldownHours * 3600
	local waited = now - lastClaim
	local dayIndex = (streak % #Config.DailyRewards) + 1
	if lastClaim == 0 or waited >= cooldown then
		return true, 0, dayIndex
	end
	return false, cooldown - waited, dayIndex
end

-- A tiny deterministic random generator (Park-Miller) so quests are the same
-- for a player all day, on any server, and in tests.
function Formulas.seededRandom(seed: number): () -> number
	local state = math.floor(math.abs(seed)) % 2147483646 + 1
	return function()
		state = (state * 16807) % 2147483647
		return (state - 1) / 2147483646
	end
end

function Formulas.questsForDay(day: number, userId: number)
	local random = Formulas.seededRandom(day * 7919 + userId % 100003)
	local pool = table.clone(Config.QuestPool)
	local quests = {}
	for i = 1, math.min(Config.QuestsPerDay, #pool) do
		local index = math.floor(random() * #pool) + 1
		local quest = table.remove(pool, index)
		local amount = quest.amounts[math.floor(random() * #quest.amounts) + 1]
		quests[i] = {
			id = quest.id,
			stat = quest.stat,
			isMax = quest.isMax == true,
			goal = amount,
			text = string.format(quest.text, amount),
		}
	end
	return quests
end

---------------------------------------------------------------------------
-- Formatting
---------------------------------------------------------------------------
local SUFFIXES = { "", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc" }

function Formulas.formatNumber(n: number): string
	n = math.floor(n)
	if n < 0 then
		return "-" .. Formulas.formatNumber(-n)
	end
	if n < 1000 then
		return tostring(n)
	end
	local tier = math.min(math.floor(math.log10(n) / 3), #SUFFIXES - 1)
	local scaled = n / 10 ^ (tier * 3)
	local text
	if scaled >= 100 then
		text = string.format("%d", math.floor(scaled))
	elseif scaled >= 10 then
		text = string.format("%.1f", math.floor(scaled * 10) / 10)
	else
		text = string.format("%.2f", math.floor(scaled * 100) / 100)
	end
	-- trim trailing zeros after a decimal point: 1.50K -> 1.5K, 2.00M -> 2M
	if string.find(text, ".", 1, true) then
		text = string.gsub(text, "0+$", "")
		text = string.gsub(text, "%.$", "")
	end
	return text .. SUFFIXES[tier + 1]
end

-- Adds thousands separators: 12345 -> "12,345"
function Formulas.commas(n: number): string
	local s = tostring(math.floor(n))
	local formatted, count = s, 1
	repeat
		formatted, count = formatted:gsub("^(-?%d+)(%d%d%d)", "%1,%2")
	until count == 0
	return formatted
end

function Formulas.formatTime(seconds: number): string
	seconds = math.max(0, math.floor(seconds))
	local h = math.floor(seconds / 3600)
	local m = math.floor(seconds % 3600 / 60)
	local s = seconds % 60
	if h > 0 then
		return string.format("%dh %02dm", h, m)
	end
	return string.format("%d:%02d", m, s)
end

return Formulas
