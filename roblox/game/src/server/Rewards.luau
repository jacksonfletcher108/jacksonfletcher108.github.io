--[[
	Daily rewards, daily quests, and the welcome / welcome-back gifts.

	Gentle by design (see PLAYBOOK.md, retention):
	  - Missing a day PAUSES your daily streak; it never resets to day 1.
	  - Quests are short session goals, and there are only three a day.
	  - Coming back after 3+ days away gets a gift, not a guilt trip.
]]

local Players = game:GetService("Players")

local Config = require(game:GetService("ReplicatedStorage").Shared.Config)
local Formulas = require(game:GetService("ReplicatedStorage").Shared.Formulas)

local Rewards = {}
local S

local WELCOME_BACK_DAYS = 3
local WELCOME_BACK_MINUTES = 10

---------------------------------------------------------------------------
-- Quests
---------------------------------------------------------------------------
local function ensureDay(player: Player, data)
	local day = Formulas.dayNumber(os.time())
	if data.quests.day ~= day then
		data.quests = { day = day, progress = {}, claimed = {}, notified = {}, bonusClaimed = false }
	end
	return Formulas.questsForDay(day, player.UserId)
end

function Rewards.questList(player: Player)
	local data = S.Data.get(player)
	if not data then
		return {}
	end
	local quests = ensureDay(player, data)
	local list = {}
	for i, quest in ipairs(quests) do
		local progress = math.min(data.quests.progress[quest.stat] or 0, quest.goal)
		list[i] = {
			text = quest.text,
			goal = quest.goal,
			progress = progress,
			done = progress >= quest.goal,
			claimed = data.quests.claimed[tostring(i)] == true,
			reward = S.Economy.minutesOfEarnings(player, Config.QuestRewardMinutes),
		}
	end
	return list
end

local function checkQuests(player: Player, data)
	local quests = ensureDay(player, data)
	for i, quest in ipairs(quests) do
		local key = tostring(i)
		if not data.quests.notified[key] and (data.quests.progress[quest.stat] or 0) >= quest.goal then
			data.quests.notified[key] = true
			S.Toasts.send(player, "✅ Quest done: " .. quest.text .. ". Claim it in Quests!", "good")
		end
	end
end

-- Adds to a counting stat (catches, air catches...).
function Rewards.add(player: Player, stat: string, amount: number)
	local data = S.Data.get(player)
	if not data then
		return
	end
	data.stats[stat] = (data.stats[stat] or 0) + amount
	ensureDay(player, data)
	data.quests.progress[stat] = (data.quests.progress[stat] or 0) + amount
	checkQuests(player, data)
end

-- Records a "best of" stat (best combo).
function Rewards.max(player: Player, stat: string, value: number)
	local data = S.Data.get(player)
	if not data then
		return
	end
	data.stats[stat] = math.max(data.stats[stat] or 0, value)
	ensureDay(player, data)
	data.quests.progress[stat] = math.max(data.quests.progress[stat] or 0, value)
	checkQuests(player, data)
end

function Rewards.claimQuest(player: Player, index: number)
	local data = S.Data.get(player)
	if not data or type(index) ~= "number" then
		return { ok = false, message = "Still loading" }
	end
	local list = Rewards.questList(player)
	local quest = list[index]
	if not quest then
		return { ok = false, message = "Unknown quest" }
	end
	if quest.claimed then
		return { ok = false, message = "Already claimed" }
	end
	if not quest.done then
		return { ok = false, message = "Not finished yet" }
	end
	data.quests.claimed[tostring(index)] = true
	S.Economy.add(player, quest.reward, "Quest")
	S.Analytics.funnel(player, 6)

	local allClaimed = true
	for i = 1, #list do
		if not data.quests.claimed[tostring(i)] then
			allClaimed = false
		end
	end
	if allClaimed and not data.quests.bonusClaimed then
		data.quests.bonusClaimed = true
		S.Economy.grantBoost(player, Config.QuestAllDoneBoostMinutes)
		S.Toasts.send(player, "All quests done! 2x Stardust for " .. Config.QuestAllDoneBoostMinutes .. " minutes.", "rare")
	end
	S.State.push(player)
	return { ok = true, message = "+" .. Formulas.formatNumber(quest.reward) .. " Stardust" }
end

---------------------------------------------------------------------------
-- Daily reward
---------------------------------------------------------------------------
function Rewards.dailyState(player: Player)
	local data = S.Data.get(player)
	if not data then
		return false, 0, 1
	end
	return Formulas.dailyState(data.daily.lastClaim, data.daily.streak, os.time())
end

function Rewards.dailyPreview(player: Player)
	local list = {}
	for i, reward in ipairs(Config.DailyRewards) do
		list[i] = {
			amount = S.Economy.minutesOfEarnings(player, reward.minutes),
			boostMinutes = reward.boostMinutes,
		}
	end
	return list
end

function Rewards.claimDaily(player: Player)
	local data = S.Data.get(player)
	if not data then
		return { ok = false, message = "Still loading" }
	end
	local canClaim, wait, dayIndex = Rewards.dailyState(player)
	if not canClaim then
		return { ok = false, message = "Next reward in " .. Formulas.formatTime(wait) }
	end
	local reward = Config.DailyRewards[dayIndex]
	local amount = S.Economy.minutesOfEarnings(player, reward.minutes)
	data.daily.lastClaim = os.time()
	data.daily.streak += 1
	S.Economy.add(player, amount, "DailyReward")
	local message = "Day " .. dayIndex .. ": +" .. Formulas.formatNumber(amount) .. " Stardust"
	if reward.boostMinutes then
		S.Economy.grantBoost(player, reward.boostMinutes)
		message ..= " and " .. reward.boostMinutes .. " min of 2x!"
	end
	S.State.push(player)
	return { ok = true, message = message }
end

---------------------------------------------------------------------------
-- Welcome gifts
---------------------------------------------------------------------------
local function onLoaded(player: Player, data)
	S.Analytics.funnel(player, 1)
	S.Badges.award(player, "Welcome")
	if data.sessions == 1 then
		S.Toasts.send(player, "Welcome to Starfall Valley! Run under a falling star to catch it.", "good")
		return
	end
	local previous = S.Data.previousSeen(player)
	local awayDays = previous > 0 and (os.time() - previous) / 86400 or 0
	if awayDays >= WELCOME_BACK_DAYS then
		local gift = S.Economy.minutesOfEarnings(player, WELCOME_BACK_MINUTES)
		S.Economy.add(player, gift, "WelcomeBack")
		S.Toasts.send(player, "Welcome back! Here's " .. Formulas.formatNumber(gift) .. " Stardust to get you going.", "rare")
	else
		S.Toasts.send(player, "Welcome back!", "good")
	end
	local canClaim = Rewards.dailyState(player)
	if canClaim then
		S.Toasts.send(player, "🎁 Your daily reward is ready!", "info")
	end
end

function Rewards.init(services)
	S = services
end

function Rewards.start()
	S.Data.Loaded:Connect(onLoaded)
	-- "Play for N minutes" quest, and lifetime minutes played
	task.spawn(function()
		while true do
			task.wait(60)
			for _, player in ipairs(Players:GetPlayers()) do
				if S.Data.get(player) then
					Rewards.add(player, "minutesPlayed", 1)
					S.State.push(player)
				end
			end
		end
	end)
end

return Rewards
