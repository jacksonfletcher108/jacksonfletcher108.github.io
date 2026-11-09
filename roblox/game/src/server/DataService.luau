--[[
	Loads and saves each player's progress with DataStoreService.

	- Retries with backoff when Roblox's servers hiccup.
	- Fills in any new fields when you add them to TEMPLATE later.
	- Autosaves, saves on leave, and saves on server shutdown.
	- In Studio without API access, plays with temporary data (nothing saved)
	  and tells you how to turn saving on.
]]

local DataStoreService = game:GetService("DataStoreService")
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")

local Config = require(game:GetService("ReplicatedStorage").Shared.Config)

local DataService = {}

local TEMPLATE = {
	version = 1,
	stardust = 0,
	totalEarned = 0,
	upgrades = { Net = 0, Boots = 0, Spring = 0, Luck = 0 },
	bestZone = 1,
	novas = 0,
	book = {}, -- starId -> how many you've caught
	daily = { lastClaim = 0, streak = 0 },
	quests = { day = 0, progress = {}, claimed = {}, notified = {}, bonusClaimed = false },
	stats = {
		catches = 0,
		airCatches = 0,
		rareCatches = 0,
		bestCombo = 0,
		upgradesBought = 0,
		showerCatches = 0,
		minutesPlayed = 0,
	},
	boostEndsAt = 0,
	funnel = 0, -- highest onboarding step reached
	badges = {}, -- badge key -> true once awarded
	receipts = {}, -- recent purchase IDs, so a purchase is never granted twice
	firstJoin = 0,
	lastSeen = 0,
	sessions = 0,
}

local store = nil
local storeOk = false
local profiles = {} -- [Player] = { data = table, temporary = bool }
local loadedEvent = Instance.new("BindableEvent")
DataService.Loaded = loadedEvent.Event -- (player, data)

local function deepCopy(value)
	if type(value) ~= "table" then
		return value
	end
	local copy = {}
	for k, v in pairs(value) do
		copy[k] = deepCopy(v)
	end
	return copy
end

-- Adds any keys from the template that saved data is missing.
local function reconcile(data, template)
	for key, value in pairs(template) do
		if data[key] == nil then
			data[key] = deepCopy(value)
		elseif type(value) == "table" and type(data[key]) == "table" then
			reconcile(data[key], value)
		end
	end
	return data
end

local function withRetries(label: string, fn: () -> any, attempts: number?)
	local tries = attempts or 4
	local lastErr
	for attempt = 1, tries do
		local ok, result = pcall(fn)
		if ok then
			return true, result
		end
		lastErr = result
		warn(string.format("[Data] %s failed (attempt %d/%d): %s", label, attempt, tries, tostring(result)))
		if attempt < tries then
			task.wait(2 ^ attempt)
		end
	end
	return false, lastErr
end

local function keyFor(player: Player): string
	return "player_" .. player.UserId
end

function DataService.get(player: Player)
	local profile = profiles[player]
	return profile and profile.data or nil
end

function DataService.isTemporary(player: Player): boolean
	local profile = profiles[player]
	return profile ~= nil and profile.temporary
end

function DataService.waitFor(player: Player, timeout: number?)
	local deadline = os.clock() + (timeout or 30)
	while not profiles[player] and player.Parent and os.clock() < deadline do
		task.wait(0.1)
	end
	return DataService.get(player)
end

local function load(player: Player)
	local data, temporary = nil, false
	if storeOk then
		local ok, result = withRetries("load " .. player.Name, function()
			return store:GetAsync(keyFor(player))
		end)
		if ok then
			data = result
		elseif RunService:IsStudio() then
			temporary = true
		else
			player:Kick("Couldn't load your progress. Roblox's servers may be busy; please rejoin in a minute.")
			return
		end
	else
		temporary = true
	end

	if not player.Parent then
		return
	end
	data = reconcile(type(data) == "table" and data or {}, TEMPLATE)
	local now = os.time()
	if data.firstJoin == 0 then
		data.firstJoin = now
	end
	data.sessions += 1
	local previousSeen = data.lastSeen
	data.lastSeen = now
	profiles[player] = { data = data, temporary = temporary, previousSeen = previousSeen }
	loadedEvent:Fire(player, data)
end

function DataService.previousSeen(player: Player): number
	local profile = profiles[player]
	return profile and profile.previousSeen or 0
end

-- Saves right away. Returns true if the save reached Roblox's servers.
-- Used by purchases, which must be saved before they are confirmed.
function DataService.saveNow(player: Player): boolean
	local profile = profiles[player]
	if not profile then
		return false
	end
	if profile.temporary then
		return true -- Studio test data: nothing to save, treat as saved
	end
	profile.data.lastSeen = os.time()
	local snapshot = deepCopy(profile.data)
	local ok = withRetries("save " .. player.Name, function()
		store:UpdateAsync(keyFor(player), function()
			return snapshot
		end)
	end, 3)
	return ok
end

local function release(player: Player)
	if profiles[player] then
		DataService.saveNow(player)
		profiles[player] = nil
	end
end

function DataService.start()
	local ok, result = pcall(function()
		return DataStoreService:GetDataStore(Config.DataStoreName)
	end)
	store = ok and result or nil
	storeOk = ok
	if not ok then
		warn("[Data] DataStores unavailable: " .. tostring(result))
	end
	if RunService:IsStudio() and storeOk then
		-- In Studio, a quick read tells us whether "Studio Access to API Services" is on.
		local probeOk = pcall(function()
			store:GetAsync("probe")
		end)
		if not probeOk then
			storeOk = false
			warn("[Data] Saving is OFF in Studio. Turn it on: Game Settings > Security > Enable Studio Access to API Services.")
		end
	end

	Players.PlayerAdded:Connect(load)
	for _, player in ipairs(Players:GetPlayers()) do
		task.spawn(load, player)
	end
	Players.PlayerRemoving:Connect(release)

	task.spawn(function()
		while true do
			task.wait(Config.AutosaveSeconds)
			for player in pairs(profiles) do
				task.spawn(DataService.saveNow, player)
			end
		end
	end)

	game:BindToClose(function()
		local pending = 0
		for player in pairs(profiles) do
			pending += 1
			task.spawn(function()
				DataService.saveNow(player)
				pending -= 1
			end)
		end
		local deadline = os.clock() + 25
		while pending > 0 and os.clock() < deadline do
			task.wait(0.1)
		end
	end)
end

DataService.TEMPLATE = TEMPLATE
return DataService
