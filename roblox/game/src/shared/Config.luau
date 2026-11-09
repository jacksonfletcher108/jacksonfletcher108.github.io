--[[
	Starfall Valley: every tuning number in one place.

	Change numbers here, not in the scripts. Each section notes which playbook
	technique it serves (see roblox/PLAYBOOK.md).

	Monetization IDs: 0 = not set up yet. Items with ID 0 are hidden from the shop,
	so the game runs fine before you create any passes or products.
]]

local Config = {}

Config.GameName = "Starfall Valley"
Config.DataStoreName = "StarfallValley_v1"
Config.LeaderboardStoreName = "StarfallValley_AllTime_v1"

---------------------------------------------------------------------------
-- Stars: the thing you catch. Rarer stars fall faster (a skill test) and
-- are worth much more (a reason to chase them).
---------------------------------------------------------------------------
Config.Stars = {
	{ id = "Ember", name = "Ember Star", value = 1, color = Color3.fromRGB(255, 170, 60), size = 1.6, fallTime = 4.0, rarity = "Common" },
	{ id = "Moon", name = "Moon Star", value = 3, color = Color3.fromRGB(170, 210, 255), size = 1.7, fallTime = 3.8, rarity = "Common" },
	{ id = "Gold", name = "Gold Star", value = 10, color = Color3.fromRGB(255, 215, 0), size = 1.9, fallTime = 3.5, rarity = "Uncommon" },
	{ id = "Rose", name = "Rose Star", value = 30, color = Color3.fromRGB(255, 105, 180), size = 2.0, fallTime = 3.3, rarity = "Uncommon" },
	{ id = "Comet", name = "Comet", value = 90, color = Color3.fromRGB(80, 230, 255), size = 2.1, fallTime = 3.0, rarity = "Rare" },
	{ id = "Aurora", name = "Aurora Star", value = 260, color = Color3.fromRGB(120, 255, 170), size = 2.3, fallTime = 2.8, rarity = "Rare" },
	{ id = "Void", name = "Void Star", value = 750, color = Color3.fromRGB(170, 90, 255), size = 2.4, fallTime = 2.6, rarity = "Epic" },
	{ id = "Prism", name = "Prism Star", value = 2500, color = Color3.fromRGB(255, 255, 255), size = 2.6, fallTime = 2.4, rarity = "Legendary", rainbow = true },
	-- Only falls during a Meteor Shower (event-only reward).
	{ id = "Nova", name = "Nova", value = 8000, color = Color3.fromRGB(255, 250, 220), size = 3.0, fallTime = 2.2, rarity = "Mythic", eventOnly = true },
}

Config.RarityColors = {
	Common = Color3.fromRGB(235, 235, 235),
	Uncommon = Color3.fromRGB(90, 230, 120),
	Rare = Color3.fromRGB(80, 170, 255),
	Epic = Color3.fromRGB(190, 110, 255),
	Legendary = Color3.fromRGB(255, 200, 40),
	Mythic = Color3.fromRGB(255, 90, 120),
}

---------------------------------------------------------------------------
-- Zones: the long-term goals. Each pays about 6-7x more per minute than the
-- last, so every unlock feels like a big jump. Costs are set so each unlock
-- takes roughly 8, 20 and 30 minutes of play.
-- Zones sit side by side along the X axis, separated by gates.
---------------------------------------------------------------------------
Config.ZoneSize = 170 -- studs, square
Config.ZoneSpacing = 200 -- center-to-center distance along X
Config.Zones = {
	{
		id = 1,
		name = "Ember Meadow",
		cost = 0,
		ground = Color3.fromRGB(86, 160, 72),
		accent = Color3.fromRGB(255, 190, 90),
		weights = { Ember = 70, Moon = 26, Gold = 4 },
	},
	{
		id = 2,
		name = "Crystal Cliffs",
		cost = 750,
		ground = Color3.fromRGB(70, 130, 160),
		accent = Color3.fromRGB(120, 230, 255),
		weights = { Moon = 45, Gold = 35, Rose = 17, Comet = 3 },
	},
	{
		id = 3,
		name = "Aurora Peak",
		cost = 12000,
		ground = Color3.fromRGB(215, 225, 240),
		accent = Color3.fromRGB(120, 255, 170),
		weights = { Gold = 30, Rose = 36, Comet = 24, Aurora = 9, Prism = 1 },
	},
	{
		id = 4,
		name = "Void Rift",
		cost = 120000,
		ground = Color3.fromRGB(45, 30, 70),
		accent = Color3.fromRGB(190, 110, 255),
		weights = { Comet = 32, Aurora = 38, Void = 26, Prism = 4 },
	},
}

-- Stars per second in a zone with one player in it. More players means
-- more stars, so busy zones feel lively and empty zones don't waste CPU.
Config.SpawnPerSecond = 1.6
Config.SpawnPerExtraPlayer = 0.6
Config.MaxStarsPerZone = 45
Config.StarLifetimeOnGround = 14 -- seconds a landed star waits before fading
Config.SpawnHeight = 90 -- studs above the ground

---------------------------------------------------------------------------
-- Catching: skill and juice.
---------------------------------------------------------------------------
Config.BaseCatchRadius = 5 -- studs, horizontal
Config.CatchReachUp = 4.5 -- how far above your body you can grab a falling star
Config.CatchReachDown = 5
Config.AirCatchBonus = 1.5 -- catch it before it lands: 1.5x
Config.ComboWindow = 2.5 -- seconds between catches to keep a combo going
Config.ComboStep = 0.05 -- each combo step adds 5%
Config.ComboMaxSteps = 20 -- caps at 2x

---------------------------------------------------------------------------
-- Upgrades: the short-term goals. The first one should be affordable within
-- about 30 seconds of joining (first-session retention).
---------------------------------------------------------------------------
Config.Upgrades = {
	{
		id = "Net",
		name = "Bigger Net",
		description = "Catch stars from farther away.",
		icon = "rbxasset://textures/ui/GuiImagePlaceholder.png",
		baseCost = 15,
		growth = 1.65,
		maxLevel = 15,
		perLevel = 0.8, -- +0.8 studs catch radius per level
	},
	{
		id = "Boots",
		name = "Swift Boots",
		description = "Run faster.",
		baseCost = 30,
		growth = 1.7,
		maxLevel = 10,
		perLevel = 1.6, -- +1.6 walk speed per level (16 -> 32)
	},
	{
		id = "Spring",
		name = "Spring Shoes",
		description = "Jump higher for more air catches (1.5x).",
		baseCost = 60,
		growth = 1.75,
		maxLevel = 8,
		perLevel = 6, -- +6 jump power per level (50 -> 98)
	},
	{
		id = "Luck",
		name = "Star Charm",
		description = "Rarer stars fall more often.",
		baseCost = 120,
		growth = 1.8,
		maxLevel = 12,
		perLevel = 0.06, -- each level boosts rarer stars' weight by 6% per rarity tier
	},
}

Config.BaseWalkSpeed = 16
Config.BaseJumpPower = 50

---------------------------------------------------------------------------
-- Supernova (rebirth): the meta loop. Give up your Stardust, upgrades and
-- zones for a permanent multiplier and a new aura colour.
---------------------------------------------------------------------------
Config.Supernova = {
	baseCost = 100000, -- Stardust needed for the first Supernova
	growth = 3,
	bonusPerNova = 0.5, -- +50% Stardust per Supernova, forever
	requiredZone = 3, -- must have reached Aurora Peak
	auraColors = {
		Color3.fromRGB(255, 200, 80),
		Color3.fromRGB(120, 230, 255),
		Color3.fromRGB(255, 105, 180),
		Color3.fromRGB(120, 255, 170),
		Color3.fromRGB(190, 110, 255),
		Color3.fromRGB(255, 255, 255),
	},
}

---------------------------------------------------------------------------
-- Social: playing with friends pays (bring-a-friend retention).
---------------------------------------------------------------------------
Config.FriendBonusEach = 0.1 -- +10% per friend in the server
Config.FriendBonusMax = 0.3

---------------------------------------------------------------------------
-- Meteor Shower: a server-wide event on a timer. A "come together" moment
-- and a reason to stay a few more minutes.
---------------------------------------------------------------------------
Config.MeteorShower = {
	firstAfter = 180, -- seconds after the server starts
	every = 480, -- then every 8 minutes
	warning = 30, -- countdown banner before it starts
	duration = 45,
	spawnMultiplier = 4,
	novaChance = 0.02, -- per star spawned during the shower
	payoutBonus = 0.25, -- everyone earns +25% during the shower
}

---------------------------------------------------------------------------
-- Daily rewards: a 7-day calendar. Missing a day PAUSES your streak instead
-- of resetting it, so players come back to a reward, not a punishment.
-- Amounts are "minutes of earnings" so they stay useful at every stage.
---------------------------------------------------------------------------
Config.DailyRewards = {
	{ minutes = 3 },
	{ minutes = 5 },
	{ minutes = 8 },
	{ minutes = 5, boostMinutes = 15 },
	{ minutes = 12 },
	{ minutes = 15 },
	{ minutes = 25, boostMinutes = 30 },
}
Config.DailyCooldownHours = 20 -- can claim again 20h after the last claim

---------------------------------------------------------------------------
-- Daily quests: three a day, each a clear session goal.
---------------------------------------------------------------------------
Config.QuestsPerDay = 3
Config.QuestPool = {
	{ id = "catch", text = "Catch %d stars", stat = "catches", amounts = { 60, 100, 150 } },
	{ id = "air", text = "Make %d air catches", stat = "airCatches", amounts = { 10, 20, 30 } },
	{ id = "rare", text = "Catch %d Gold Stars or better", stat = "rareCatches", amounts = { 5, 10, 15 } },
	{ id = "combo", text = "Reach a x%d combo", stat = "bestCombo", amounts = { 8, 12, 16 }, isMax = true },
	{ id = "upgrade", text = "Buy %d upgrades", stat = "upgradesBought", amounts = { 2, 3, 5 } },
	{ id = "shower", text = "Catch %d stars in a Meteor Shower", stat = "showerCatches", amounts = { 10, 20, 30 } },
	{ id = "minutes", text = "Play for %d minutes", stat = "minutesPlayed", amounts = { 10, 15, 20 } },
}
Config.QuestRewardMinutes = 4 -- each quest pays 4 minutes of earnings
Config.QuestAllDoneBoostMinutes = 15 -- finishing all three gives a 2x boost

-- Earnings-per-minute estimate used to scale daily and quest rewards and
-- Stardust packs. It's based on the best zone you've unlocked, so rewards grow
-- with you. It's roughly what an average player earns there per minute.
Config.EarningsPerMinuteByZone = { 90, 600, 4000, 20000 }

---------------------------------------------------------------------------
-- Onboarding funnel steps (logged with AnalyticsService so you can see where
-- new players drop off in the Creator Dashboard).
---------------------------------------------------------------------------
Config.Funnel = {
	{ step = 1, name = "Joined" },
	{ step = 2, name = "First catch" },
	{ step = 3, name = "Five catches" },
	{ step = 4, name = "First upgrade" },
	{ step = 5, name = "Unlocked zone 2" },
	{ step = 6, name = "First daily quest done" },
	{ step = 7, name = "Unlocked zone 3" },
	{ step = 8, name = "First Supernova" },
}

---------------------------------------------------------------------------
-- Monetization. Ethical rules this game follows:
--   * No paid random items (no loot boxes).
--   * Everything shows its price and exactly what you get.
--   * Nothing you can buy is needed to finish the game.
--   * The best purchase helps the whole server (Meteor Shower).
-- Create these in the Creator Dashboard, then paste the IDs here.
---------------------------------------------------------------------------
Config.GamePasses = {
	{ key = "DoubleStardust", id = 0, name = "2x Stardust", description = "Earn double Stardust forever.", suggestedPrice = 199 },
	{ key = "StarMagnet", id = 0, name = "Star Magnet", description = "+50% catch radius forever.", suggestedPrice = 149 },
	{ key = "LuckyCharm", id = 0, name = "Lucky Charm", description = "Rare stars fall 25% more often.", suggestedPrice = 249 },
	{ key = "CometTrail", id = 0, name = "Comet Trail", description = "A rainbow trail and a ★ name tag. Looks only.", suggestedPrice = 79 },
}
Config.PassEffects = {
	DoubleStardust = 2,
	StarMagnet = 1.5,
	LuckyCharm = 0.25,
}

Config.DevProducts = {
	{ key = "MeteorShower", id = 0, name = "Call a Meteor Shower", description = "Starts a Meteor Shower for EVERYONE in the server.", suggestedPrice = 49 },
	{ key = "Boost30", id = 0, name = "2x Boost (30 min)", description = "Double Stardust for 30 minutes.", suggestedPrice = 39 },
	{ key = "PouchSmall", id = 0, name = "Stardust Pouch", description = "15 minutes of earnings, right now.", suggestedPrice = 25, minutes = 15 },
	{ key = "PouchLarge", id = 0, name = "Stardust Chest", description = "90 minutes of earnings, right now.", suggestedPrice = 99, minutes = 90 },
}

---------------------------------------------------------------------------
-- Badges (create in the Creator Dashboard, paste IDs; 0 = skip).
---------------------------------------------------------------------------
Config.Badges = {
	Welcome = 0,
	FirstGold = 0,
	CliffsUnlocked = 0,
	PeakUnlocked = 0,
	RiftUnlocked = 0,
	FirstSupernova = 0,
	BookComplete = 0,
	NovaCaught = 0,
}

---------------------------------------------------------------------------
-- Saving.
---------------------------------------------------------------------------
Config.AutosaveSeconds = 120
Config.LeaderboardRefreshSeconds = 120

---------------------------------------------------------------------------
-- Sounds. These are built into Roblox. Swap in any audio asset ID you like
-- ("rbxassetid://123..."). A missing sound just stays silent.
---------------------------------------------------------------------------
Config.Sounds = {
	Catch = { id = "rbxasset://sounds/electronicpingshort.wav", volume = 0.5 },
	Click = { id = "rbxasset://sounds/button.wav", volume = 0.6 },
	Unlock = { id = "rbxasset://sounds/electronicpingshort.wav", volume = 0.8, pitch = 0.6 },
	Denied = { id = "rbxasset://sounds/button.wav", volume = 0.5, pitch = 0.5 },
}

return Config
