Paste this into Claude Code, opened in the `roblox/` folder, after running `python study-kit/study.py all` on your own computer.

---

You're studying Roblox game design from YouTube transcripts so we can improve our game.

1. Read the six study packs in `study-kit/packs/`. Each holds the top 20 YouTube videos on one topic, in this order: Roblox development and game design, player retention, gameplay loops, UI design, monetization, and what makes a game fun.

2. For each topic, go video by video and pull out:
   - **Ideas:** every concrete, actionable technique the creator teaches. Skip filler, sponsor reads, and "like and subscribe".
   - **Numbers:** any real figures, like retention rates, prices, timings, or revenue.
   - **Agreements and disagreements:** where creators agree with each other, and where they disagree.

3. Update `research/notes/<topic>.md`. Upgrade a video's evidence from `title-only` or `creator` to `transcript`, and correct anything the earlier notes guessed wrong. Keep the existing structure.

4. Re-rank the techniques across all six topics. Then update `PLAYBOOK.md`: add what's new, remove what the transcripts contradicted, and keep each technique tied to the videos that back it.

5. Read the game in `game/src/`. List the changes that would apply the playbook better, with the biggest win for the least work first. Then make the top three changes. Keep the code style, and run `rojo build game -o game/Starfall-Valley.rbxlx` to check that it still builds.

Rules:
- Don't make up what a video says. If a transcript is missing, say so.
- Roblox's audience is young. No dark patterns: no fake timers, no pay-to-win, no gambling-style paid random items, and no punishing players for missing a day.
