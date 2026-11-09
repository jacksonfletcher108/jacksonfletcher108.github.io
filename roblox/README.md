# Make Claude learn game design: the full project

This folder follows a TikTok ([@momentumcash](https://www.tiktok.com/@momentumcash/video/7705619523206106399), "Make Claude Learn Game Design, 10/10 method") step by step. Here's what he says:

> "Tell your Claude agent to research GitHub for the best repos to study YouTube videos. Then have it study the top 20 videos on Roblox development and game design, then player retention, then gameplay loops, then UI design, then monetization, then what makes a game fun. Then have it identify the best techniques and figure out how to apply them to your Roblox game."

You didn't have a Roblox game yet, so the last step builds one: **Starfall Valley**.

| Step | What he said | What's here |
|---|---|---|
| 1 | Research GitHub for the best repos to study YouTube videos | [`research/github-repos.md`](research/github-repos.md): ranked picks (yt-dlp, youtube-transcript-api, faster-whisper) and the runners-up |
| 1b | (build the tool) | [`study-kit/`](study-kit/): one script that finds the top videos, pulls transcripts, and packs them for Claude |
| 2 | Study the top 20 videos on each of six topics | [`research/videos/`](research/videos/): the 6 × 20 lists. [`research/notes/`](research/notes/): what they teach, technique by technique, with sources |
| 3 | Identify the best techniques | [`PLAYBOOK.md`](PLAYBOOK.md): the 15 best techniques, ranked and mapped to code |
| 4 | Apply them to your Roblox game | [`game/`](game/): **Starfall Valley**, an original game you can open in Roblox Studio and play right away |

## Start here
- **Play the game:** run [`game/Install-Starfall-Valley.lua`](game/Install-Starfall-Valley.lua) in your open place (Model tab → Run Script), or open [`game/Starfall-Valley.rbxlx`](game/Starfall-Valley.rbxlx). Then press Play. Details in [`game/README.md`](game/README.md).
- **Read the playbook:** [`PLAYBOOK.md`](PLAYBOOK.md), about 10 minutes.
- **See the research:** [`research/notes/`](research/notes/), one file per topic.

## One honest limitation
YouTube blocks transcript downloads from cloud servers, and this was built on one. Getting around that would mean proxies or a logged-in account's cookies, which breaks YouTube's rules, so I didn't. Instead, each video was studied through everything readable about it:
- its title and description;
- the creator's own written posts and website;
- write-ups of the talk (for example, GDC coverage);
- the books it's based on;
- Roblox's official Creator docs and DevForum.

Each video in the notes is marked `content`, `creator` or `title-only`, so you can see how solid each point is.

**For full transcripts:** on your own computer, run the study kit (`python study-kit/study.py all`, 5–10 minutes). Then paste [`study-kit/PROMPT.md`](study-kit/PROMPT.md) into Claude Code. It re-studies all 120 videos from their transcripts, updates the notes and playbook, and makes the top three improvements to the game.
