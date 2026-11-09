--[[
	Plays UI and game sounds locally. Each play can change pitch, so a rising
	combo sounds like it's climbing.
]]

local Debris = game:GetService("Debris")
local SoundService = game:GetService("SoundService")

local Config = require(game:GetService("ReplicatedStorage").Shared.Config)

local Sounds = {}
local templates = {}

function Sounds.play(name: string, pitch: number?, volume: number?)
	local template = templates[name]
	if not template then
		return
	end
	local sound = template:Clone()
	sound.PlaybackSpeed = (pitch or 1) * template.PlaybackSpeed
	if volume then
		sound.Volume = volume
	end
	sound.Parent = SoundService
	sound:Play()
	Debris:AddItem(sound, 4)
end

function Sounds.start()
	local folder = Instance.new("Folder")
	folder.Name = "StarfallSounds"
	folder.Parent = SoundService
	for name, def in pairs(Config.Sounds) do
		local sound = Instance.new("Sound")
		sound.Name = name
		sound.SoundId = def.id
		sound.Volume = def.volume or 0.5
		sound.PlaybackSpeed = def.pitch or 1
		sound.Parent = folder
		templates[name] = sound
	end
end

return Sounds
