--[[
	Loads and saves each player's progress with DataStoreService.

	- Session lock: only one server owns your save at a time. If you hop
	  servers, the new one waits for the old one to finish saving, so an old
	  server can never overwrite newer progress (or a purchase).
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

local LOCK_KEY = "_session"
local LOCK_TIMEOUT = 300 -- a lock older than this belongs to a crashed server
local LOCK_WAIT_TRIES = 10 -- x 3s: wait up to ~30s for another server to let go

-- Claims this player's save for this server and returns the stored data.
-- Returns (ok, data). If another server holds a fresh lock, waits for it.
local function claim(player: Player)
	local key = keyFor(player)
	for attempt = 1, LOCK_WAIT_TRIES do
		local lockedElsewhere = false
		local force = attempt == LOCK_WAIT_TRIES -- last try: assume the other server died
		local ok, result = withRetries("load " .. player.Name, function()
			return store:UpdateAsync(key, function(stored)
				stored = type(stored) == "table" and stored or {}
				local lock = stored[LOCK_KEY]
				lockedElsewhere = false
				if not force and type(lock) == "table" and lock.job ~= game.JobId and os.time() - (lock.at or 0) < LOCK_TIMEOUT then
					lockedElsewhere = true
					return nil -- leave it alone; try again shortly
				end
				stored[LOCK_KEY] = { job = game.JobId, at = os.time() }
				return stored
			end)
		end)
		if not ok then
			return false, nil
		end
		if not lockedElsewhere then
			return true, result
		end
		if not player.Parent then
			return false, nil
		end
		task.wait(3)
	end
	return false, nil
end

local function load(player: Player)
	local data, temporary = nil, false
	if storeOk then
		local ok, result = claim(player)
		if ok then
			data = result
		elseif RunService:IsStudio() then
			temporary = true
		else
			if player.Parent then
				player:Kick("Couldn't load your progress. Roblox's servers may be busy; please rejoin in a minute.")
			end
			return
		end
	else
		temporary = true
	end

	if not player.Parent then
		-- left while loading: let go of the lock right away
		if storeOk and not temporary then
			pcall(function()
				store:UpdateAsync(keyFor(player), function(stored)
					if type(stored) == "table" and type(stored[LOCK_KEY]) == "table" and stored[LOCK_KEY].job == game.JobId then
						stored[LOCK_KEY] = nil
						return stored
					end
					return nil
				end)
			end)
		end
		return
	end
	data = type(data) == "table" and data or {}
	data[LOCK_KEY] = nil -- the lock lives only in the store, never in memory
	data = reconcile(data, TEMPLATE)
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
-- `final` also releases the session lock (when the player leaves).
local function save(player: Player, final: boolean): boolean
	local profile = profiles[player]
	if not profile then
		return false
	end
	if profile.temporary then
		return true -- Studio test data: nothing to save, treat as saved
	end
	if profile.lost then
		return false
	end
	profile.data.lastSeen = os.time()
	local snapshot = deepCopy(profile.data)
	snapshot[LOCK_KEY] = (not final) and { job = game.JobId, at = os.time() } or nil
	local lostLock = false
	local ok = withRetries("save " .. player.Name, function()
		store:UpdateAsync(keyFor(player), function(stored)
			local lock = type(stored) == "table" and stored[LOCK_KEY] or nil
			lostLock = type(lock) == "table" and lock.job ~= game.JobId
			if lostLock then
				return nil -- another server owns this save now; never overwrite it
			end
			return snapshot
		end)
	end, 3)
	if lostLock then
		profile.lost = true
		warn("[Data] " .. player.Name .. "'s save is owned by another server; not saving here.")
		return false
	end
	return ok
end

function DataService.saveNow(player: Player): boolean
	return save(player, false)
end

-- Final save and release. Safe to call twice (leaving during shutdown).
local function release(player: Player)
	local profile = profiles[player]
	if profile and not profile.releasing then
		profile.releasing = true
		save(player, true)
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
			for player, profile in pairs(profiles) do
				if not profile.releasing then
					task.spawn(DataService.saveNow, player)
				end
			end
		end
	end)

	game:BindToClose(function()
		for player in pairs(profiles) do
			task.spawn(release, player)
		end
		local deadline = os.clock() + 25
		while next(profiles) and os.clock() < deadline do
			task.wait(0.1)
		end
	end)
end

DataService.TEMPLATE = TEMPLATE
return DataService
