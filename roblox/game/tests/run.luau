--# selene: allow(undefined_variable, global_usage)
--[[
	Unit tests for the game's pure logic (src/shared). Runs outside Roblox.

	With Lune (https://lune-org.github.io/docs):   lune run tests/run.luau
	Run from the roblox/game folder.
]]

-- File loading works under Lune or under a bare Luau runner that provides
-- readfile(path) and loadchunk(source, name, env).
local readFile, loadChunk
if readfile and loadchunk then
	readFile, loadChunk = readfile, loadchunk
else
	local fs = require("@lune/fs")
	local luau = require("@lune/luau")
	readFile = fs.readFile
	loadChunk = function(source, name, env)
		return luau.load(source, { debugName = name, environment = env })
	end
end

-- Minimal stand-ins for the Roblox types the shared modules touch.
local Color3 = {
	fromRGB = function(r, g, b)
		return { R = r / 255, G = g / 255, B = b / 255 }
	end,
}

local cache = {}
local function folder(path)
	return setmetatable({}, {
		__index = function(_, name)
			return { __file = path .. "/" .. name .. ".luau" }
		end,
	})
end

local function requireModule(ref)
	local file = ref.__file
	if cache[file] == nil then
		local env = setmetatable({
			script = { Parent = folder(string.match(file, "^(.*)/[^/]+$")) },
			require = requireModule,
			Color3 = Color3,
		}, { __index = _G })
		cache[file] = loadChunk(readFile(file), file, env)()
	end
	return cache[file]
end

local shared = folder("src/shared")
local Config = requireModule(shared.Config)
local F = requireModule(shared.Formulas)

---------------------------------------------------------------------------
local passed, failed = 0, 0
local function test(name, fn)
	local ok, err = pcall(fn)
	if ok then
		passed += 1
	else
		failed += 1
		print("FAIL  " .. name .. "\n      " .. tostring(err))
	end
end
local function eq(actual, expected, label)
	if actual ~= expected then
		error(string.format("%s: expected %s, got %s", label or "value", tostring(expected), tostring(actual)), 2)
	end
end
local function near(actual, expected, tolerance, label)
	if math.abs(actual - expected) > tolerance then
		error(string.format("%s: expected %s ± %s, got %s", label or "value", expected, tolerance, actual), 2)
	end
end

---------------------------------------------------------------------------
-- Config sanity
---------------------------------------------------------------------------
test("star ids are unique and every zone only uses real stars", function()
	local seen = {}
	for _, star in ipairs(Config.Stars) do
		assert(not seen[star.id], "duplicate star " .. star.id)
		seen[star.id] = star
		assert(F.RarityTier[star.rarity] ~= nil, "unknown rarity " .. star.rarity)
	end
	for _, zone in ipairs(Config.Zones) do
		for id in pairs(zone.weights) do
			assert(seen[id], zone.name .. " uses unknown star " .. id)
			assert(not seen[id].eventOnly, zone.name .. " uses event-only star " .. id)
		end
	end
end)

test("zones get more expensive and pay more", function()
	for i = 2, #Config.Zones do
		assert(Config.Zones[i].cost > Config.Zones[i - 1].cost, "zone cost order")
		assert(Config.EarningsPerMinuteByZone[i] > Config.EarningsPerMinuteByZone[i - 1], "earnings order")
	end
	eq(#Config.EarningsPerMinuteByZone, #Config.Zones, "earnings table length")
end)

test("each zone unlock takes 5-35 minutes at the previous zone's pace", function()
	for i = 2, #Config.Zones do
		local minutes = Config.Zones[i].cost / Config.EarningsPerMinuteByZone[i - 1]
		assert(minutes >= 5 and minutes <= 35, Config.Zones[i].name .. " takes " .. minutes .. " min")
	end
end)

test("first upgrade is affordable within 30 seconds of joining", function()
	local seconds = F.upgradeCost("Net", 0) / (Config.EarningsPerMinuteByZone[1] / 60)
	assert(seconds <= 30, "first Net costs " .. seconds .. "s of play")
end)

test("monetization keys are unique and every pass effect exists", function()
	local keys = {}
	for _, list in ipairs({ Config.GamePasses, Config.DevProducts }) do
		for _, item in ipairs(list) do
			assert(not keys[item.key], "duplicate key " .. item.key)
			keys[item.key] = true
			assert(type(item.id) == "number", item.key .. " id must be a number")
		end
	end
	for key in pairs(Config.PassEffects) do
		assert(keys[key], "pass effect for unknown pass " .. key)
	end
end)

test("quest pool entries are well formed", function()
	for _, quest in ipairs(Config.QuestPool) do
		assert(string.find(quest.text, "%%d"), quest.id .. " text needs %d")
		assert(#quest.amounts > 0, quest.id .. " needs amounts")
	end
	assert(#Config.QuestPool >= Config.QuestsPerDay, "pool smaller than quests per day")
end)

---------------------------------------------------------------------------
-- Formatting
---------------------------------------------------------------------------
test("formatNumber", function()
	local cases = {
		{ 0, "0" }, { 7, "7" }, { 999, "999" }, { 1000, "1K" }, { 1500, "1.5K" },
		{ 1234, "1.23K" }, { 12345, "12.3K" }, { 100000, "100K" }, { 999999, "999K" },
		{ 1000000, "1M" }, { 2500000, "2.5M" }, { 1234567890, "1.23B" }, { 10 ^ 12, "1T" },
		{ -1500, "-1.5K" },
	}
	for _, case in ipairs(cases) do
		eq(F.formatNumber(case[1]), case[2], "formatNumber(" .. case[1] .. ")")
	end
end)

test("commas", function()
	eq(F.commas(0), "0")
	eq(F.commas(999), "999")
	eq(F.commas(1000), "1,000")
	eq(F.commas(1234567), "1,234,567")
end)

test("formatTime", function()
	eq(F.formatTime(0), "0:00")
	eq(F.formatTime(65), "1:05")
	eq(F.formatTime(3600 + 5 * 60), "1h 05m")
	eq(F.formatTime(-3), "0:00")
end)

---------------------------------------------------------------------------
-- Upgrades and stats
---------------------------------------------------------------------------
test("upgrade costs grow and stop at max level", function()
	eq(F.upgradeCost("Net", 0), 15, "Net level 1")
	eq(F.upgradeCost("Net", 1), 25, "Net level 2") -- 15 * 1.65 = 24.75
	local net = F.getUpgrade("Net")
	eq(F.upgradeCost("Net", net.maxLevel), nil, "Net past max")
	eq(F.upgradeCost("Nope", 0), nil, "unknown upgrade")
	for _, upgrade in ipairs(Config.Upgrades) do
		local last = 0
		for level = 0, upgrade.maxLevel - 1 do
			local cost = F.upgradeCost(upgrade.id, level)
			assert(cost > last, upgrade.id .. " cost must rise")
			last = cost
		end
	end
end)

test("stats from upgrades", function()
	eq(F.walkSpeed(0), 16)
	eq(F.walkSpeed(10), 32)
	eq(F.jumpPower(0), 50)
	near(F.catchRadius(0, false), 5, 1e-9, "base radius")
	near(F.catchRadius(10, true), (5 + 8) * 1.5, 1e-9, "radius with magnet")
	near(F.luck(12, true), 12 * 0.06 + 0.25, 1e-9, "max luck")
end)

---------------------------------------------------------------------------
-- Star rolls
---------------------------------------------------------------------------
local function shares(zoneId, luck, rolls)
	local random = F.seededRandom(12345)
	local counts = {}
	for _ = 1, rolls do
		local id = F.rollStar(zoneId, luck, random)
		counts[id] = (counts[id] or 0) + 1
	end
	for id, count in pairs(counts) do
		counts[id] = count / rolls
	end
	return counts
end

test("star rolls match zone weights with no luck", function()
	local s = shares(1, 0, 100000)
	near(s.Ember, 0.70, 0.01, "Ember share")
	near(s.Moon, 0.26, 0.01, "Moon share")
	near(s.Gold, 0.04, 0.005, "Gold share")
end)

test("luck makes rare stars more common but never removes commons", function()
	local plain = shares(3, 0, 100000)
	local lucky = shares(3, F.luck(12, true), 100000)
	assert(lucky.Prism > plain.Prism * 2, "Prism should more than double")
	assert(lucky.Gold > 0.1, "Gold still common")
	assert(lucky.Prism < 0.05, "Prism stays rare: " .. lucky.Prism)
end)

test("seeded random stays in [0, 1) and repeats", function()
	local a, b = F.seededRandom(42), F.seededRandom(42)
	for _ = 1, 10000 do
		local x = a()
		assert(x >= 0 and x < 1, "out of range " .. x)
		eq(x, b(), "same seed same sequence")
	end
end)

---------------------------------------------------------------------------
-- Earnings
---------------------------------------------------------------------------
test("combo multiplier ramps to 2x and caps", function()
	eq(F.comboMultiplier(0), 1)
	eq(F.comboMultiplier(1), 1)
	near(F.comboMultiplier(11), 1.5, 1e-9, "combo 11")
	near(F.comboMultiplier(21), 2, 1e-9, "combo 21")
	near(F.comboMultiplier(500), 2, 1e-9, "combo cap")
end)

test("catch value", function()
	eq(F.catchValue("Ember", 1, 1, false), 1, "plain ember")
	eq(F.catchValue("Gold", 1, 11, true), 23, "gold air combo") -- 10 * 1.5 * 1.5 = 22.5
	eq(F.catchValue("Ember", 0.1, 1, false), 1, "never below 1")
end)

test("base multiplier stacks", function()
	near(F.baseMultiplier({}), 1, 1e-9, "nothing")
	near(F.baseMultiplier({ novas = 2 }), 2, 1e-9, "two novas")
	near(F.baseMultiplier({ hasDouble = true, boostActive = true }), 4, 1e-9, "pass and boost")
	near(F.baseMultiplier({ friends = 10 }), 1.3, 1e-9, "friend bonus caps at 30%")
	near(F.baseMultiplier({ showerActive = true }), 1.25, 1e-9, "shower")
end)

test("reward scaling follows best zone and novas", function()
	eq(F.minutesOfEarnings(3, 1, 0), 270)
	eq(F.minutesOfEarnings(3, 2, 0), 1800)
	eq(F.minutesOfEarnings(3, 1, 1), 405)
	eq(F.minutesOfEarnings(1, 99, 0), Config.EarningsPerMinuteByZone[#Config.Zones], "clamped zone")
end)

---------------------------------------------------------------------------
-- Supernova
---------------------------------------------------------------------------
test("supernova cost and rules", function()
	eq(F.supernovaCost(0), 100000)
	eq(F.supernovaCost(1), 300000)
	local ok, why = F.canSupernova(10 ^ 9, 2, 0)
	eq(ok, false, "needs zone 3")
	assert(string.find(why, "Aurora Peak"), why)
	ok = F.canSupernova(99999, 3, 0)
	eq(ok, false, "needs stardust")
	ok = F.canSupernova(100000, 3, 0)
	eq(ok, true, "can nova")
end)

---------------------------------------------------------------------------
-- Daily rewards and quests
---------------------------------------------------------------------------
test("daily rewards: claim, wait, streak loops after 7", function()
	local now = 1800000000
	local can, wait, day = F.dailyState(0, 0, now)
	eq(can, true, "first claim")
	eq(day, 1, "first day")
	can, wait = F.dailyState(now, 1, now + 3600)
	eq(can, false, "too soon")
	eq(wait, 19 * 3600, "wait time")
	can, wait, day = F.dailyState(now, 1, now + 21 * 3600)
	eq(can, true, "next day")
	eq(day, 2, "day two")
	local _, _, looped = F.dailyState(now, 7, now + 30 * 3600)
	eq(looped, 1, "after day 7 comes day 1")
	-- missing several days does NOT reset: streak 3 claims day 4 even a week later
	local _, _, paused = F.dailyState(now, 3, now + 7 * 86400)
	eq(paused, 4, "streak pauses instead of resetting")
end)

test("quests are three different ones, same all day, new tomorrow", function()
	local day = F.dayNumber(1800000000)
	local a = F.questsForDay(day, 123456)
	local b = F.questsForDay(day, 123456)
	eq(#a, Config.QuestsPerDay, "count")
	local ids = {}
	for i, q in ipairs(a) do
		assert(not ids[q.id], "duplicate quest " .. q.id)
		ids[q.id] = true
		eq(q.id, b[i].id, "deterministic id")
		eq(q.goal, b[i].goal, "deterministic goal")
		assert(not string.find(q.text, "%%d"), "text filled in")
	end
	local differentDays = 0
	for offset = 1, 10 do
		local c = F.questsForDay(day + offset, 123456)
		if c[1].id ~= a[1].id or c[2].id ~= a[2].id or c[3].id ~= a[3].id then
			differentDays += 1
		end
	end
	assert(differentDays >= 7, "quests should change most days")
end)

---------------------------------------------------------------------------
print(string.format("\n%d passed, %d failed", passed, failed))
if failed > 0 then
	error("tests failed")
end
