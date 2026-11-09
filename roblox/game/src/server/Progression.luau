--[[
	Everything you spend Stardust on: upgrades, zone gates, teleporting
	between unlocked zones, and Supernova (rebirth).
]]

local Config = require(game:GetService("ReplicatedStorage").Shared.Config)
local Formulas = require(game:GetService("ReplicatedStorage").Shared.Formulas)

local Progression = {}
local S

local ZONE_BADGES = { [2] = "CliffsUnlocked", [3] = "PeakUnlocked", [4] = "RiftUnlocked" }

---------------------------------------------------------------------------
-- Upgrades
---------------------------------------------------------------------------
function Progression.buyUpgrade(player: Player, upgradeId: string)
	local data = S.Data.get(player)
	local upgrade = Formulas.getUpgrade(upgradeId)
	if not data or not upgrade then
		return { ok = false, message = "Unknown upgrade" }
	end
	local level = data.upgrades[upgradeId] or 0
	local cost = Formulas.upgradeCost(upgradeId, level)
	if not cost then
		return { ok = false, message = upgrade.name .. " is maxed out!" }
	end
	if not S.Economy.spend(player, cost, "Upgrade_" .. upgradeId) then
		return { ok = false, message = "Need " .. Formulas.formatNumber(cost - data.stardust) .. " more Stardust" }
	end
	data.upgrades[upgradeId] = level + 1
	S.Rewards.add(player, "upgradesBought", 1)
	S.Analytics.funnel(player, 4)
	S.Characters.refresh(player)
	S.State.push(player)
	return { ok = true, message = upgrade.name .. " level " .. (level + 1) .. "!" }
end

---------------------------------------------------------------------------
-- Zones
---------------------------------------------------------------------------
function Progression.unlockZone(player: Player, zoneId: number)
	local data = S.Data.get(player)
	local zone = Config.Zones[zoneId]
	if not data or not zone then
		return { ok = false, message = "Unknown zone" }
	end
	if data.bestZone >= zoneId then
		return { ok = true, message = zone.name .. " is already open" }
	end
	if data.bestZone < zoneId - 1 then
		return { ok = false, message = "Unlock " .. Config.Zones[zoneId - 1].name .. " first" }
	end
	if not S.Economy.spend(player, zone.cost, "Zone_" .. zoneId) then
		return { ok = false, message = "Need " .. Formulas.formatNumber(zone.cost - data.stardust) .. " more Stardust" }
	end
	data.bestZone = zoneId
	if zoneId == 2 then
		S.Analytics.funnel(player, 5)
	elseif zoneId == 3 then
		S.Analytics.funnel(player, 7)
	end
	if ZONE_BADGES[zoneId] then
		S.Badges.award(player, ZONE_BADGES[zoneId])
	end
	S.State.push(player)
	S.Toasts.send(player, "🔓 " .. zone.name .. " unlocked! Rarer stars fall here.", "rare")
	return { ok = true, message = zone.name .. " unlocked!" }
end

-- Called by the gate's ProximityPrompt.
function Progression.tryUnlock(player: Player, zoneId: number)
	local result = Progression.unlockZone(player, zoneId)
	if not result.ok then
		S.Toasts.send(player, result.message, "warn")
	end
end

function Progression.teleport(player: Player, zoneId: number)
	local data = S.Data.get(player)
	if not data or not Config.Zones[zoneId] then
		return { ok = false, message = "Unknown zone" }
	end
	if zoneId > data.bestZone then
		return { ok = false, message = "Unlock " .. Config.Zones[zoneId].name .. " first" }
	end
	S.Characters.teleport(player, S.Map.spawnPoint(zoneId))
	return { ok = true }
end

---------------------------------------------------------------------------
-- Supernova (rebirth)
---------------------------------------------------------------------------
function Progression.supernova(player: Player)
	local data = S.Data.get(player)
	if not data then
		return { ok = false, message = "Still loading" }
	end
	local ok, why = Formulas.canSupernova(data.stardust, data.bestZone, data.novas)
	if not ok then
		return { ok = false, message = why }
	end
	local given = data.stardust
	data.stardust = 0
	S.Analytics.spent(player, given, "Supernova")
	for key in pairs(data.upgrades) do
		data.upgrades[key] = 0
	end
	data.bestZone = 1
	data.novas += 1
	S.Analytics.funnel(player, 8)
	S.Badges.award(player, "FirstSupernova")
	S.Characters.refresh(player)
	S.Characters.teleport(player, S.Map.spawnPoint(1))
	S.State.push(player)
	S.Toasts.all(string.format("💥 %s went SUPERNOVA #%d!", player.DisplayName, data.novas), "rare")
	S.Toasts.send(
		player,
		string.format("Every catch now pays x%s, forever!", tostring(Formulas.supernovaMultiplier(data.novas))),
		"good"
	)
	return { ok = true }
end

function Progression.init(services)
	S = services
end

return Progression
