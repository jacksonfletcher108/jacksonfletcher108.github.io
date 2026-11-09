--# selene: allow(undefined_variable, global_usage)
--[[
	Checks Install-Starfall-Valley.lua: runs it against a pretend Roblox place
	and confirms every script lands in the right spot with byte-identical code,
	that running it twice is safe, and that your own scripts are kept as backups.

	With Lune:   lune run tests/installer.luau      (from the roblox/game folder)
]]

local readfile, loadchunk = readfile, loadchunk
if not (readfile and loadchunk) then
	local fs = require("@lune/fs")
	local luau = require("@lune/luau")
	readfile = fs.readFile
	loadchunk = function(source, name, env)
		return luau.load(source, { debugName = name, environment = env })
	end
end
local arg = arg or {}
local gameDir = arg[1] or "."

local function newInstance(className, name)
	local props = { ClassName = className, Name = name or className }
	local children = {}
	local attributes = {}
	local self = {}
	local methods = {}
	function methods:FindFirstChild(n)
		for _, c in ipairs(children) do
			if c.Name == n then
				return c
			end
		end
		return nil
	end
	function methods:WaitForChild(n)
		return self:FindFirstChild(n)
	end
	function methods:GetChildren()
		return table.clone(children)
	end
	function methods:Destroy()
		self.Parent = nil
	end
	function methods:SetAttribute(k, v)
		attributes[k] = v
	end
	function methods:GetAttribute(k)
		return attributes[k]
	end
	function methods:_children()
		return children
	end
	setmetatable(self, {
		__index = function(_, k)
			if methods[k] then
				return methods[k]
			end
			return props[k]
		end,
		__newindex = function(_, k, v)
			if k == "Parent" then
				local old = props.Parent
				if old then
					local list = old:_children()
					for i, c in ipairs(list) do
						if c == self then
							table.remove(list, i)
							break
						end
					end
				end
				props.Parent = v
				if v then
					table.insert(v:_children(), self)
				end
			else
				props[k] = v
			end
		end,
	})
	return self
end

local function buildDataModel()
	local dm = newInstance("DataModel", "Game")
	local services = {}
	for _, n in ipairs({
		"ReplicatedStorage",
		"ServerScriptService",
		"StarterPlayer",
		"Lighting",
		"Workspace",
		"ChangeHistoryService",
		"Players",
	}) do
		local s = newInstance(n, n)
		s.Parent = dm
		services[n] = s
	end
	local sps = newInstance("StarterPlayerScripts", "StarterPlayerScripts")
	sps.Parent = services.StarterPlayer
	local baseplate = newInstance("Part", "Baseplate")
	baseplate.Parent = services.Workspace
	local recordings = {}
	local chs = services.ChangeHistoryService
	rawset(chs, "TryBeginRecording", nil)
	local dmMethods = {
		GetService = function(_, n)
			return services[n]
		end,
	}
	local proxy = setmetatable({}, {
		__index = function(_, k)
			if dmMethods[k] then
				return dmMethods[k]
			end
			return dm[k]
		end,
	})
	-- ChangeHistoryService methods
	local chsMeta = getmetatable(chs)
	local oldIndex = chsMeta.__index
	chsMeta.__index = function(t, k)
		if k == "TryBeginRecording" then
			return function(_, label)
				table.insert(recordings, "begin:" .. label)
				return "rec1"
			end
		elseif k == "FinishRecording" then
			return function(_, id, op)
				table.insert(recordings, "finish:" .. id .. ":" .. tostring(op))
			end
		end
		return oldIndex(t, k)
	end
	return proxy, services, recordings
end

local function runInstaller(gameProxy)
	local printed = {}
	local env = setmetatable({
		game = gameProxy,
		Instance = { new = newInstance },
		Enum = { FinishRecordingOperation = { Commit = "Commit" } },
		require = function()
			error("no Roblox engine in this test")
		end,
		print = function(...)
			local parts = {}
			for i = 1, select("#", ...) do
				parts[i] = tostring(select(i, ...))
			end
			table.insert(printed, table.concat(parts, " "))
		end,
	}, { __index = _G })
	local source = readfile(gameDir .. "/Install-Starfall-Valley.lua")
	loadchunk(source, "Install-Starfall-Valley.lua", env)()
	return printed
end

local failures = 0
local function check(cond, msg)
	if not cond then
		failures += 1
		print("FAIL  " .. msg)
	end
end

local function expected()
	-- Rojo layout: list of { servicePath, rootName, rootClass, initFile, srcFolder }
	return {
		{ { "ReplicatedStorage" }, "Shared", "Folder", nil, "shared", { "Config", "Formulas", "Net" } },
		{
			{ "ServerScriptService" },
			"Server",
			"Script",
			"init.server.luau",
			"server",
			{
				"Actions",
				"Analytics",
				"Badges",
				"Characters",
				"DataService",
				"Economy",
				"Events",
				"Leaderboard",
				"Map",
				"Progression",
				"Rewards",
				"Shop",
				"Stars",
				"State",
				"Toasts",
			},
		},
		{
			{ "StarterPlayer", "StarterPlayerScripts" },
			"Client",
			"LocalScript",
			"init.client.luau",
			"client",
			{
				"ClientState",
				"Effects",
				"Gates",
				"Hud",
				"Panels",
				"Sounds",
				"StarRenderer",
				"Theme",
				"Toasts",
				"Tutorial",
			},
		},
	}
end

local function verify(services, label)
	local count = 0
	for _, e in ipairs(expected()) do
		local node = services[e[1][1]]
		for i = 2, #e[1] do
			node = node:FindFirstChild(e[1][i])
		end
		local matches = 0
		for _, c in ipairs(node:GetChildren()) do
			if c.Name == e[2] then
				matches += 1
			end
		end
		check(matches == 1, label .. ": exactly one " .. e[2] .. " (found " .. matches .. ")")
		local root = node:FindFirstChild(e[2])
		check(root and root.ClassName == e[3], label .. ": " .. e[2] .. " is a " .. e[3])
		if root and e[4] then
			check(
				root.Source == readfile(gameDir .. "/src/" .. e[5] .. "/" .. e[4]),
				label .. ": " .. e[2] .. " source matches " .. e[4]
			)
			count += 1
		end
		if root then
			check(
				#root:GetChildren() == #e[6],
				label .. ": " .. e[2] .. " has " .. #e[6] .. " modules (has " .. #root:GetChildren() .. ")"
			)
			for _, name in ipairs(e[6]) do
				local m = root:FindFirstChild(name)
				check(m and m.ClassName == "ModuleScript", label .. ": " .. e[2] .. "." .. name .. " is a ModuleScript")
				if m then
					check(
						m.Source == readfile(gameDir .. "/src/" .. e[5] .. "/" .. name .. ".luau"),
						label .. ": " .. name .. " source is byte-identical"
					)
					check(m:GetAttribute("StarfallValley") == true, label .. ": " .. name .. " is tagged")
					count += 1
				end
			end
		end
	end
	return count
end

-- 1) fresh empty place
local gameProxy, services, recordings = buildDataModel()
local printed = runInstaller(gameProxy)
local n = verify(services, "fresh")
check(n == 30, "fresh: 30 scripts installed (got " .. n .. ")")
check(
	recordings[1] == "begin:Install Starfall Valley" and recordings[2] == "finish:rec1:Commit",
	"undo recording begun and committed"
)
local joined = table.concat(printed, "\n")
check(string.find(joined, "Installed 30 scripts", 1, true) ~= nil, "prints the script count")
check(string.find(joined, "Preview skipped", 1, true) ~= nil, "a failed preview is reported, not fatal")
check(services.StarterPlayer.CharacterUseJumpPower == true, "StarterPlayer settings applied")

-- 2) run again: replaces itself, no backups, no duplicates
runInstaller(gameProxy)
verify(services, "rerun")
check(services.ServerScriptService:FindFirstChild("Server_Backup") == nil, "rerun: no backup of our own install")

-- 3) the user already has their own "Server" script: keep it as a backup
local gameProxy2, services2 = buildDataModel()
local mine = newInstance("Script", "Server")
mine.Source = "print('my own script')"
mine.Parent = services2.ServerScriptService
runInstaller(gameProxy2)
verify(services2, "existing")
local backup = services2.ServerScriptService:FindFirstChild("Server_Backup")
check(backup ~= nil and backup.Source == "print('my own script')", "existing: user's script kept as Server_Backup")

print(failures == 0 and "installer test: all checks passed" or ("installer test: " .. failures .. " failures"))
if failures > 0 then
	error("failed")
end
