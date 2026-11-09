--[[
	All-time "Top Star Catchers" board in the spawn area, using an
	OrderedDataStore of total Stardust ever earned (Supernova doesn't lower it).
	Also shows "Stardust" and "Supernovas" in the player list.
]]

local DataStoreService = game:GetService("DataStoreService")
local Players = game:GetService("Players")

local Config = require(game:GetService("ReplicatedStorage").Shared.Config)
local Net = require(game:GetService("ReplicatedStorage").Shared.Net)

local Leaderboard = {}
local S

local leaderboardEvent = Net.event("Leaderboard")
local store
local names = {}
local lastRows = {}

local function nameFor(userId: number): string
	if names[userId] then
		return names[userId]
	end
	local player = Players:GetPlayerByUserId(userId)
	if player then
		names[userId] = player.DisplayName
		return player.DisplayName
	end
	local ok, name = pcall(function()
		return Players:GetNameFromUserIdAsync(userId)
	end)
	names[userId] = ok and name or ("Player " .. userId)
	return names[userId]
end

local function refresh()
	if not store then
		-- No DataStore (e.g. Studio without API access): rank who's here now.
		local rows = {}
		for _, player in ipairs(Players:GetPlayers()) do
			local data = S.Data.get(player)
			if data then
				table.insert(rows, { name = player.DisplayName, value = data.totalEarned })
			end
		end
		table.sort(rows, function(a, b)
			return a.value > b.value
		end)
		lastRows = rows
		S.Map.setLeaderboard(rows)
		leaderboardEvent:FireAllClients(rows)
		return
	end
	for _, player in ipairs(Players:GetPlayers()) do
		local data = S.Data.get(player)
		if data and not S.Data.isTemporary(player) then
			pcall(function()
				store:SetAsync(tostring(player.UserId), math.floor(data.totalEarned))
			end)
		end
	end
	local ok, pages = pcall(function()
		return store:GetSortedAsync(false, 10)
	end)
	if not ok then
		return
	end
	local rows = {}
	for _, entry in ipairs(pages:GetCurrentPage()) do
		table.insert(rows, { name = nameFor(tonumber(entry.key) or 0), value = entry.value })
	end
	lastRows = rows
	S.Map.setLeaderboard(rows)
	leaderboardEvent:FireAllClients(rows)
end

local function setupLeaderstats(player: Player)
	local stats = Instance.new("Folder")
	stats.Name = "leaderstats"
	local stardust = Instance.new("NumberValue")
	stardust.Name = "Stardust"
	stardust.Parent = stats
	local novas = Instance.new("IntValue")
	novas.Name = "Supernovas"
	novas.Parent = stats
	stats.Parent = player
end

function Leaderboard.sendTo(player: Player)
	leaderboardEvent:FireClient(player, lastRows)
end

function Leaderboard.init(services)
	S = services
end

function Leaderboard.start()
	local ok, result = pcall(function()
		return DataStoreService:GetOrderedDataStore(Config.LeaderboardStoreName)
	end)
	store = ok and result or nil
	if store then
		local probeOk = pcall(function()
			store:GetSortedAsync(false, 1)
		end)
		if not probeOk then
			store = nil
		end
	end

	Players.PlayerAdded:Connect(setupLeaderstats)
	for _, player in ipairs(Players:GetPlayers()) do
		setupLeaderstats(player)
	end

	-- keep the player list numbers current
	task.spawn(function()
		while true do
			task.wait(0.5)
			for _, player in ipairs(Players:GetPlayers()) do
				local data = S.Data.get(player)
				local stats = player:FindFirstChild("leaderstats")
				if data and stats then
					stats.Stardust.Value = math.floor(data.stardust)
					stats.Supernovas.Value = data.novas
				end
			end
		end
	end)

	task.spawn(function()
		task.wait(10)
		while true do
			refresh()
			task.wait(Config.LeaderboardRefreshSeconds)
		end
	end)
end

return Leaderboard
