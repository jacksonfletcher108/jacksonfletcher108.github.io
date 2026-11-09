# Gameplay loops: what the top 20 videos teach

Scope: 20 YouTube videos from `videos/3-gameplay-loops.json`. YouTube transcripts are blocked here, so each video was studied through written sources only. Evidence levels are in the video table. Most of these videos have little written coverage, so the techniques below lean on the Roblox Creator Hub docs, Daniel Cook's Lost Garden essays (the main written source for "loops" and "chains"), the Machinations feedback-loop article, the GDC abstract for the Hi-Fi Rush talk, and DevForum threads. I did not use third-party AI-summary or transcript-mirror sites (recapio, gist.ly, lilys.ai, a Hugging Face GMTK transcript dump), as the brief requires.

## The 10-second version
- A loop has three nested layers. The **core loop** takes seconds (swing, jump, shoot). The **mid loop** takes minutes (fill bag, sell, upgrade). The **meta loop** takes days (unlock areas, rebirth, collect). Each outer loop has to feed back into the inner one, or the game "becomes repetitive, boring, and shallow" (Roblox docs).
- Make the core action fun with no rewards attached, then add progression to amplify it. Progression cannot rescue a dull verb ("built a progression system on top of nothing").
- Think in **chains**: every resource a player collects must lead to something they want (the "anchor"). If a chain breaks, the early actions feel pointless (Cook, value chains; video #6's theme).
- **Positive feedback loops** compound success: more pets → more coins → more pets. Each one needs a **negative loop** as a brake: rising costs, a bag cap, area gates. In PvP, add catch-up mechanics so leaders don't run away with the game (GMTK #4, Machinations).
- Design the loop on paper first: write the verb, the 10-second loop, the anchor, and the sources and sinks. Then test the bare verb for 5 minutes before you build any shop or UI.

## Techniques (ranked: most useful for a Roblox game first)

### 1. Make the core action satisfying on its own, then add progression
- What: Pick one verb the player does every few seconds and make it feel good in isolation: input, instant feedback, small reward. Only then layer on XP, shops and gates.
- Why it works: Progression amplifies a fun loop but can't create one. When the reward wall arrives, retention falls off unless the verb itself is fun. Tower of Hell kept players for most of its life with no XP: attempt → fail → retry → finish → feel good. Hi-Fi Rush's director says the team spent about a year on the core mechanic alone, iterating until it felt right.
- Backed by: Roblox docs, which put "minute-to-minute player interaction" first of the three parts of a core loop ([core loops](https://create.roblox.com/docs/production/game-design/core-loops)). RoWatcher, "[The Core Loop Mistake Killing Most Roblox Games](https://rowatcher.com/news/the-core-loop-mistake-killing-most-roblox-games)" (an unsigned post that also promotes the site's analytics tool). Video #16, Hi-Fi Rush ([GDC abstract](https://schedule.gdconf.com/session/developing-hi-fi-rush-backwards-and-finding-our-positive-gameplay-loop/899845), [interview](https://ungeek.ph/2023/02/hi-fi-rushs-core-gameplay-mechanic-took-a-year-to-develop-explains-director)). Video #1, Tim Cain: the core loop is the set of features players experience most often.
- Apply in Roblox: Prototype the verb in an empty baseplate. For each action, add three kinds of feedback in under 0.2 s: a sound (SoundService / `Sound:Play()`), a visual pop (TweenService on Size/Transparency, a ParticleEmitter burst) and a number popup (BillboardGui). Use the RoWatcher test: "if a new player would earn nothing and still play for ten minutes, the loop is working." Run a 5-minute no-rewards playtest with a friend before writing any DataStore code.
- Watch out: Copying the visible parts of a hit simulator (XP bar, egg shop, rebirth button) without its satisfying action is the failure mode RoWatcher describes.

### 2. Nest three loops (core → mid → meta), each feeding the next
- What: The core loop runs in seconds, the mid (session) loop in minutes, and the meta loop over days. Each layer's output is the next layer's input, and the outer layer changes how the inner one plays.
- Why it works: Cook calls loops "fractal": they occur at many levels and frequencies, and nesting them produces depth ([Loops and Arcs](https://lostgarden.com/2012/04/30/loops-and-arcs)). Roblox's docs call the third part the "progression engine". Their Action RPG example is Explore → Fight → Upgrade, where upgrades improve future exploring and fighting.
- Backed by: [Roblox core loops doc](https://create.roblox.com/docs/production/game-design/core-loops). [Lost Garden](https://lostgarden.com/2012/04/30/loops-and-arcs). Video #19, IxDF/Om Tandon: his IxDF master class separates "core loop prototyping vs. meta loop prototyping" ([IxDF](https://ixdf.org/master-classes/how-to-prototype-for-games-ux)). Unity's glossary: larger games build loops "around the core loop, operating across different timescales" ([Unity](https://unity.com/glossary/core-game-loop), from a search snippet).
- Apply in Roblox (target lengths are my suggestion, not from a source):
  - Core, 3–15 s: swing / jump / place tower → instant feedback.
  - Mid, 1–5 min: bag full → sell → buy one upgrade → feel the upgrade on the very next core loop.
  - Meta, 1–7 days: unlock zone N+1, rebirth, collection book. Save it with DataStoreService and mark milestones with BadgeService.
  - Always show the next goal on screen: a progress bar toward the next zone gate, or a "Next: 250 coins" label.
- Watch out: If the meta loop doesn't change the core loop (an upgrade that is just "+5% coins" and nothing new), players notice the treadmill. Every few meta steps should add a new verb, place or enemy.

### 3. Design chains backwards from an anchor (value chains)
- What: Write the chain of actions from the end goal backwards. For each node, list action, inputs and outputs, and end the chain at a real human motive (self-expression, mastery, showing off, beating friends). Cook's notation: `ChopTree (-treeHealth & -player time) -> +stick`.
- Why it works: Value in a game is self-contained. A stick matters only because it leads to a lamp, which leads to a decorated room, which leads to self-expression. Cook lists how chains break: a missing link (no use downstream), a weak or invisible anchor, hidden cause and effect, or a motive that doesn't fit the audience. His fix includes revealing the anchor early as a "player promise".
- Backed by: [Cook, Value Chains](https://lostgarden.com/2021/12/12/value-chains/). Video #6, Indie Game Clinic, "Gameplay Loops Are Out, Chains Are In" (title-only: its snippet says it is about designers' "visual and spatial metaphors"). Video #14, Dave the Diver, whose two halves form one chain: dive by day → catch fish → serve sushi at night → earn money → buy better dive gear. AV Club calls this a "one more time" loop because during each half you're planning the other ([AV Club](https://www.avclub.com/dave-the-diver-review-gameplay-loop-roguelike-fish-restaurant-management)).
- Apply in Roblox: Show the anchor in the first 60 seconds: a locked zone visible through a glass wall, a showcase of rare pets, the top of the leaderboard. Make every collectible spendable on something the player can see, and avoid dead-end currencies. A Dave-style interlock works well on Roblox: gather in zone A, then craft, cook or display in your plot, which earns currency to gather better in zone A.
- Watch out: Too many parallel currencies hide the chain. Keep to 1–2 currencies at launch.

### 4. Pair every positive feedback loop with a negative one
- What: A positive loop compounds a change: success makes the next success easier (killstreaks, XCOM veterans, Hades boons). A negative loop pushes back toward equilibrium: Mario Kart's blue shell and catch-up items, or Cultist Simulator's notoriety, which attracts interference.
- Why it works: Positive loops feel great but cause runaway leads and broken balance. Machinations notes that Call of Duty's killstreak loop became hard to balance and was later phased out. Negative loops keep difficulty in range but feel unfair if they're too strong. GMTK's episode (S4E1, Jan 2018) grew out of Mark Brown playing Pyre, and its synopsis says it covers how Pyre designs its positive and negative loops.
- Backed by: Video #4, GMTK ([episode listing](https://thetvdb.com/series/game-makers-toolkit/episodes/6496889); the definitions and examples above come from [Machinations](https://machinations.io/articles/game-systems-feedback-loops-and-how-they-help-craft-player-experiences), not the video).
- Apply in Roblox:
  - Simulator/tycoon positive loop: income → buy multiplier → more income. Brakes: price that grows per purchase (idle games commonly use ×1.07–×1.15 per purchase, an idle-game convention I'm adding, not from these sources), backpack capacity that forces sell trips, zone gates.
  - PvP or round games: give trailing players a comeback lever: a bounty on the leader, better random drops for last place, a respawn shield. Keep it visible and modest.
  - Tower defense: cash per kill is positive; enemy HP and speed scaling per wave is the negative counterweight.
- Watch out: Hidden rubber-banding feels like cheating once players notice. Never make the brake "pay Robux to remove the wall" at every step. That turns a balance tool into a paywall for a young audience.

### 5. Reward success instead of punishing failure ("positive gameplay loop" in the Hi-Fi Rush sense)
- What: Johanas says the easy design is a negative loop where a mistimed input means failure. Hi-Fi Rush instead rewards you for hitting the beat and doesn't punish you for missing it. The GDC abstract says this lowered the barrier to entry.
- Why it works: New players aren't driven off, and skilled players still get a higher ceiling. Note the second meaning of "positive loop" here (reward vs punishment), which differs from GMTK's systems meaning in technique 4.
- Backed by: Video #16 ([GDC Vault](https://gdcvault.com/play/1034256/Developing-Hi-Fi-RUSH-Backwards), [interview](https://ungeek.ph/2023/02/hi-fi-rushs-core-gameplay-mechanic-took-a-year-to-develop-explains-director)).
- Apply in Roblox: Give "perfect" bonuses: a timed click that gives ×2, a combo meter, a speed-run bonus. Death in an obby costs only the current stage, never total progress. Offer optional hard modes for players who want punishment.
- Watch out: Don't remove all stakes. Horror (Pressure) and hard obbies need real threat. Keep the punishment local to the run or stage and keep long-term progress safe.

### 6. Keep the economy "taut": sinks slightly larger than sources, and measure it
- What: List every source (faucet) and sink (drain). Cook's source types are capped, trickle, grind, investment and random. His sink types are fixed, repeatable, exponential and competitive. Pair low-power sources with equal or stronger sinks, avoid truly exponential sources in long-running games, and keep sinks a little larger than sources.
- Why it works: When currency piles up, nothing pulls the player back to earlier steps of the chain, and the loop goes slack.
- Backed by: [Cook, Value Chains](https://lostgarden.com/2021/12/12/value-chains/). [Roblox economy events doc](https://create.roblox.com/docs/production/analytics/economy-events): the net of sources minus sinks should be close to zero, and if balances keep growing, add sinks.
- Apply in Roblox: On the server, call `AnalyticsService:LogEconomyEvent(player, Enum.AnalyticsEconomyFlowType.Source|Sink, "Coins", amount, endingBalance, transactionType, itemSKU)`. Transaction types include `Gameplay`, `Shop`, `TimedReward`, `Onboarding`, `IAP` and `ContextualPurchase`, and amounts are always positive. Watch the Average Wallet Balance chart. Balance against a time window: for a live game, total a week's sources against a week's sinks in a spreadsheet (Cook).
- Watch out: Events are server-only and only work in published games. Don't fix inflation by wiping wallets, which kids read as theft. Add new desirable sinks instead.

### 7. Repetition with variation
- What: Each pass through the loop should change one thing: a new room layout, enemy, modifier or zone. Then the same verbs stay fresh.
- Why it works: Cook says pure "arcs" (one-shot content) wear out and create a "content treadmill", while loops deliver value through being exercised. Varying the loop's inputs gets the benefits of both. Video #20's own chapter list includes "repetition with variation is key". Pressure randomizes its 100-room facility each run.
- Backed by: [Loops and Arcs](https://lostgarden.com/2012/04/30/loops-and-arcs). Video #20 (chapter list in the JSON description). Pressure fan wiki ([how to play](https://pressuregame-wiki.pages.dev/how-to-play)).
- Apply in Roblox: Build rooms or stages as Models in ServerStorage, tag them with CollectionService, and assemble them procedurally from a seed with `Random.new(seed)`. Add per-round modifiers ("low gravity", "double enemies") picked at round start, and rotate weekly events.
- Watch out: Random layouts need hand-made pieces that are each fun. Randomness multiplies quality, it doesn't create it.

### 8. Use a prestige (rebirth) meta loop, but keep it meaningful
- What: The player resets short-term progress (cash, upgrades, base) for a permanent bonus that makes the next run faster. Simulator diagram: click → earn → upgrade → progress → rebirth. Tycoon diagram: claim → earn → spend → expand → rebirth.
- Why it works: It restarts the satisfying early-game curve with the player now powerful, turns the end of content into a new start, and creates a long meta loop out of existing content.
- Backed by: Third-party Roblox guides ([creation.dev simulator guide](https://www.creation.dev/blog/roblox-simulator-game-guide), [creation.dev tycoon guide](https://www.creation.dev/blog/how-to-make-a-tycoon-game)). These are generic and partly promotional, but they describe the genre's common pattern. DevForum: "Some grind element is the most important part of a long lasting Roblox game, Pets is the proven easiest way" ([DevForum](https://devforum.roblox.com/t/tips-for-a-new-original-roblox-simulator/2322827)).
- Apply in Roblox: Store `Rebirths` in a DataStore profile (DataStoreService, `UpdateAsync`) and show it in a `leaderstats` folder. Make each rebirth add something new as well as a multiplier, e.g. rebirth 3 unlocks a new zone or tool. A suggested cost curve is `baseCost * 2.5^rebirths`. Cook warns against truly exponential sources, so cap or soften the multiplier, e.g. `1 + 0.5*rebirths` (additive, not compounding).
- Watch out: Make the reset clear before players confirm, with a dialog showing exactly what is lost and kept. If paid eggs or pets feed this loop, Roblox's paid-random-item rules apply: odds disclosure, plus age and regional limits. Check the monetization notes and current Creator Hub policy.

### 9. Short fail-retry loops with generous checkpoints (obbies and skill games)
- What: Keep each attempt short, respawn instantly at the last checkpoint, and pace difficulty with relief stages.
- Why it works: Checkpoints decide how frustrating a stage feels, not how hard it is. One DevForum reply notes a stage is "just as hard with checkpoints as it is without". The first stages matter most for keeping players.
- Backed by: DevForum "[Checkpoints - An Important Element in Games](https://devforum.roblox.com/t/checkpoints-an-important-element-in-games/478483)" (put a checkpoint immediately after each stage). "[The Guide To Making A Difficulty Chart](https://devforum.roblox.com/t/the-guide-to-making-a-difficulty-chartpart-1/1135152)". [creation.dev obby guide](https://www.creation.dev/blog/roblox-obby-design-guide): ease in, ramp, give periodic relief; "30 well-designed stages will perform better than 200 repetitive ones". RoWatcher's Tower of Hell loop.
- Apply in Roblox: Use SpawnLocation or checkpoint parts with `Touched` that save `Stage` to the player and to a DataStore. Respawn in under 1 s (`Players.RespawnTime`). Add a stage counter, a per-stage timer, and a badge (BadgeService) at milestones (stage 10, 25, finish).
- Watch out: A "skip stage" developer product is common in Roblox obbies but sells the loop's whole point. If you add one, keep it cheap and never make stages deliberately unfair to drive sales.

### 10. Run-based loops whose failures still feed the meta loop (horror and roguelite)
- What: Each run is self-contained and dangerous, and something persists after death or escape.
- Why it works: Machinations' Hades example: death resets the run but advances the plot, which softens the negative loop. In Pressure, guides say Kroner stays on your account and leftover Research converts to Kroner after a run (search snippets, unverified). Kroner buys kit in the pre-round shop.
- Backed by: [Machinations](https://machinations.io/articles/game-systems-feedback-loops-and-how-they-help-craft-player-experiences). [Pressure wiki](https://pressuregame-wiki.pages.dev/how-to-play). Video #11, Eclipse's review (title-only), whose snippet says Pressure has "one of the most unfun gameplay loops" yet he can't deny the overall experience. My inference: in horror, atmosphere and monster "arcs" carry an otherwise thin loop.
- Apply in Roblox: Lobby place → TeleportService to a run server with `TeleportData` (party, loadout) → the run hands out a run-only currency → on death or escape, convert it to a persistent currency in the DataStore → spend it in the lobby shop. Use ProximityPrompt for lockers and loot, and SoundService/positional audio for monster tells.
- Watch out: If death loses everything, young players quit. If death loses nothing, there's no tension. Pressure's split (run items lost, currency kept) sits between the two.

### 11. Anchor the loop to design pillars, and cut features that don't feed it
- What: Write 2–4 design pillars. The core loop should touch all of them, because players spend most of their time there. Features that don't feed the loop get cut.
- Why it works: Cain warns that "a game that includes everything is about nothing", and says 1980s games had small loops because they had to.
- Backed by: Video #1, Tim Cain (secondhand: notes on his video from a fan wiki, seen only as a search snippet because the page is access-gated: [turbo-wiki](https://turbo-wiki.pages.dev/tim-cain/system-design/core-game-loops)). [PC Gamer](https://www.pcgamer.com/gaming-industry/fallout-co-creator-tim-cain-says-less-is-often-more-in-game-design-as-a-very-wise-designer-once-said-to-me-a-game-that-includes-everything-is-about-nothing). Cook's test: remove the arcs (missions, story) and see if what remains is still playable.
- Apply in Roblox: Write the pillars above the loop diagram in the design doc. Check each new feature: does it add a node to an existing chain, or start a disconnected chain? Cain's notes say you can usually identify a game's core loop within an hour of play or of watching a streamer, so watch a 30-minute stream of your genre's top Roblox game and write its loop down.
- Watch out: Roblox players expect lots of features over time. Add them as new nodes on the existing chain, not parallel side-games.

### 12. Instrument each loop so you can see where it breaks
- What: Log each step of the onboarding and mid loops as funnel steps, and check where players drop off.
- Why it works: Cook treats player complaints as signals of structural breaks in the chain. Funnels turn "players leave" into "players leave between Sell and Upgrade".
- Backed by: [Roblox funnel events doc](https://create.roblox.com/docs/production/analytics/funnel-events). RoWatcher's advice to measure session depth and D7/D30 return rates, not just D1.
- Apply in Roblox:
  - Onboarding: `AnalyticsService:LogOnboardingFunnelStepEvent(player, 1, "Spawned")`, then 2 "First Collect", 3 "First Sell", 4 "First Upgrade", 5 "Entered Zone 2".
  - Recurring loop: `LogFunnelStepEvent(player, "SellLoop", sessionId, step, name)` with `HttpService:GenerateGUID()` as the session ID.
  - Server-only; validate any client-reported step.
- Watch out: Only the first instance of a step counts, and repeats still eat into the rate limit. Log the step after it completes.

## Genre loop diagrams (synthesis)
These diagrams are my synthesis from the docs, guides and wikis above, not claims about any one video. ⟳ marks where a loop repeats; [+] is a positive loop and [−] its brake.

**Simulator** (Bee Swarm / Pet Sim style)
- Core (5–10 s): swing tool → resource pops into backpack (sound + number popup)
- Mid (1–3 min): backpack full [−] → walk to sell pad → coins → buy bigger tool/backpack [+] ⟳
- Meta (days): coins → hatch eggs → pets multiply income [+] → pay to unlock next area (gate cost grows [−]) → rebirth for a permanent multiplier ⟳
- Anchor: collection plus showing off rare pets and big numbers.

**Tycoon**
- Core (passive): dropper spawns part → conveyor → collector adds cash; the player walks over the cash pad
- Mid (30 s–2 min): cash → step on the next buy button (dropper, upgrader, wall, floor) → income up [+] → next button costs more [−] ⟳
- Meta: base complete → rebirth (base reset, +x% income) → new floor or world ⟳
- Anchor: the base itself is a visible progress bar and a thing to show off. A DevForum critique: unclear upgrade names make it hard to tell cosmetic upgrades from functional ones ([DevForum](https://devforum.roblox.com/t/feedback-on-my-sci-fi-tycoon/705263)).

**Obby**
- Core (1–5 s): jump → land or fall → instant respawn at checkpoint ⟳
- Mid (30 s–2 min): clear stage → checkpoint saved → next stage, harder [−], with relief stages ⟳
- Meta: finish → badge/win counter → harder tower, or a new randomized tower (Tower of Hell style) ⟳
- No economy needed; the anchor is mastery and bragging rights.

**"+1 per second" games** (+1 Speed/Jump/Strong Every Second)
- Core (1 s, passive): stat +1 every second → stand or walk while it climbs
- Mid (1–3 min): stat is high enough to clear the next wall, gap or treadmill gate → reach win pad → wins currency ⟳
- Meta: wins → rebirths and pets multiply the per-second gain [+] → next world with bigger gates [−] ⟳
- Read: a simulator with the "collect" step automated, so the only decision is when to attempt the next gate. Listing sites tag these "Incremental Simulator", and one "+1 speed" game shows about 331M visits ([bloxodes](https://bloxodes.com/stats/games/roblox-but-every-second-you-get-1-speed-4122139330), [RoWatcher listing](https://rowatcher.com/games/4025872087/1-strong-every-second/dying); unverified third-party stats). The low effort fits FlameWorks' complaint (#15) that Roblox's ecosystem favors simple loops.
- Roblox build: a server loop on `task.wait(1)` (or a Heartbeat accumulator) raising `Humanoid.WalkSpeed`, or `JumpPower` with `UseJumpPower`, from a stored stat. Cap the speed so physics doesn't break.

**Tower defense** (Tower Defense Simulator style; basics from [bloxodes TDS wiki](https://bloxodes.com/wiki/tower-defense-simulator), the rest is my analysis)
- Core (seconds): enemies walk the path → towers fire → kills pay cash
- Mid (per wave, 30–60 s): spend cash to place or upgrade towers [+] → enemies scale each wave [−] → boss wave ⟳
- Meta: match ends → coins/XP → unlock or buy new towers → harder maps or modes ⟳
- Co-op adds a social layer: deciding with teammates who places what.

**Horror run** (Pressure)
- Core (seconds): enter room → read the warnings (flickering lights, audio) → hide in a locker or push on
- Mid (one run): pre-round shop (Kroner → flashlight, batteries, Code Breachers) → 100 randomized rooms, scavenging, keycards → Sebastian's shop around room 50 → the Ridge (rooms 90–100) → grab the Crystal → extract
- Meta: currency persists → better kit next run → badges unlock items → Endless Mode ⟳
- Lesson from #11: the loop can be thin if tension and atmosphere carry it.

## Designing a loop on paper (worksheet)
1. **Fantasy and pillars** (#1 Cain): one sentence ("be a bug catcher who builds the best jar collection") plus 2–4 pillars.
2. **The verb and the 10-second loop**: action → feedback (sound, visual, number) → small reward.
3. **The anchor** (Cook): what does the player ultimately want? Show it in the first minute.
4. **Write the chain backwards** in Cook's notation, for example:
   - `SwingNet (-player time) -> +bug`
   - `SellBugs (-bug) -> +coins`
   - `BuyNet (-coins) -> +catchRate`
   - `UnlockMeadow (-coins & catchRate>=X) -> +rareBug`
   - `DisplayInJar (-rareBug) -> +collection` (anchor: collect and show off)
5. **Nest it**: label each node core, mid or meta, with a target duration.
6. **Mark the feedback loops**: label each [+] loop and write its [−] brake next to it.
7. **Sources and sinks table**: give every currency at least one repeatable sink, and keep sinks slightly larger than sources.
8. **Paper and greybox test**: play the verb for 5 minutes with no rewards. Then cut every arc (quests, story) and check the game is still playable.
9. **Instrument**: one onboarding funnel and one recurring-loop funnel, plus economy events on every source and sink.

## Video by video
| # | Video | What it teaches | Evidence |
|---|---|---|---|
| 1 | Core Game Loops (Timothy Cain) | The core loop is the set of features players experience most; it should touch every design pillar, can be spotted within about an hour of play, and in his RPGs depends on the character build. | content (secondhand fan notes, snippet only) [turbo-wiki](https://turbo-wiki.pages.dev/tim-cain/system-design/core-game-loops); creator [PC Gamer](https://www.pcgamer.com/gaming-industry/fallout-co-creator-tim-cain-says-less-is-often-more-in-game-design-as-a-very-wise-designer-once-said-to-me-a-game-that-includes-everything-is-about-nothing) |
| 2 | How To Design a Gameplay Loop (Apox Fox) | Likely angle (inference): a step-by-step beginner method for defining a loop. | title-only (JSON snippet) |
| 3 | How Gameplay Loops Keep You Playing (Architect of Games) | Likely angle (inference): why loops motivate continued play; the snippet references Errant Signal. | title-only |
| 4 | How Games Use Feedback Loops (GMTK) | Positive vs negative feedback loops, built around how Pyre designs both (per the episode synopsis). Definitions and examples in technique 4 come from Machinations, not the video. | content (thin: episode synopsis) [TVDB](https://thetvdb.com/series/game-makers-toolkit/episodes/6496889) |
| 5 | The Real Core Loop (Extra Credits) | One loop every game shares; understanding it shows what kind of game you're making and how to reduce player frustration. Likely the player's learn-and-act cycle (inference). | content (thin: official description) [BetaSeries](https://www.betaseries.com/en/episode/extra-credits/s17e39) |
| 6 | Gameplay Loops Are Out, Chains Are In (Indie Game Clinic) | A video essay on the spatial metaphors designers use; argues for "chains". Likely angle (inference): sequences where each action gets its value from what it leads to, close to Cook's value chains. | title-only (snippet); creator = Joe Baxter-Webb [Patreon](https://patreon.com/indiegameclinic) |
| 7 | Go from Ideas to Gameplay using Gameplay Loops (Game Design with Michael) | Snippet: the "primary loop" is the most important. Likely angle (inference): turn an idea into a primary loop plus secondary loops. | title-only |
| 8 | What are loops in game design? (Game Design with Michael) | Snippet: how players come up with actions, and designing around that loop. Likely angle (inference): the player's decision loop. | title-only |
| 9 | Core loops - Simple Game Design (Matthew Palaje) | Snippet: using core loops to generate new game ideas. | title-only |
| 10 | Mechanics Shaping Story (Extra Credits) | Snippet: Pokemon and old D&D have combat-centric loops. Likely angle (inference): the core loop decides what stories a game tells. | title-only |
| 11 | ROBLOX Pressure review (Eclipse) | Off-topic review but useful: snippet calls the loop "unfun" yet the experience strong. Pressure's run/meta loop is described in technique 10 and the genre diagrams. | title-only; game info [Pressure wiki](https://pressuregame-wiki.pages.dev/how-to-play) |
| 12 | Golembert Devlog #04 (Studio Firlefanz) | Devlog on ordering a gardening game's loop. The game is a garden-decorating management game with roguelike deckbuilding (Steam). | title-only; [Steam](https://store.steampowered.com/app/2455710) |
| 13 | Building the core loop for my cozy game (Rooi) | Beginner devlog building a cozy-game loop in Godot. | title-only |
| 14 | Dave the Diver's Addictive Gameplay Loop (IGN) | Off-topic analysis but useful: two interlocking loops, dive by day and sushi bar by night, each feeding the other. | title-only (IGN text not found); loop per [AV Club](https://www.avclub.com/dave-the-diver-review-gameplay-loop-roguelike-fish-restaurant-management) |
| 15 | Roblox and the Plight of Soulless Mediocrity (FlameWorks) | Snippet: Roblox's ecosystem favors simple loops and recognizable visuals. A critique to design against. | title-only |
| 16 | Developing Hi-Fi RUSH Backwards (GDC) | Work backwards from the desired feel; pillars defined the mechanics; reward hitting the beat, don't punish missing it; about a year on the core mechanic. | content [GDC abstract](https://schedule.gdconf.com/session/developing-hi-fi-rush-backwards-and-finding-our-positive-gameplay-loop/899845), [interview](https://ungeek.ph/2023/02/hi-fi-rushs-core-gameplay-mechanic-took-a-year-to-develop-explains-director) |
| 17 | The Core Loop of Helldivers 2 (Andrew Chambers) | Likely angle (inference): co-op mission loop of drop → objectives → extract → unlock. | title-only |
| 18 | 5 Steps to Create an Engaging Game Loop (Ludonaut) | Snippet: a defined core loop saves time and money. Steps unknown. | title-only |
| 19 | What is a Core Gameplay Loop? (IxDF, Om Tandon) | Core loop as the defining element; his IxDF class separates core-loop and meta-loop prototyping. | creator [IxDF master class](https://ixdf.org/master-classes/how-to-prototype-for-games-ux) |
| 20 | What are "Game Loops"? Explained with Music (Indie Game Clinic) | The creator's chapter list: "repetition with variation is key"; loops compared to music. | title-only (chapter list in description) |

## Sources
- https://create.roblox.com/docs/production/game-design/core-loops
- https://create.roblox.com/docs/production/analytics/economy-events
- https://create.roblox.com/docs/production/analytics/funnel-events
- https://lostgarden.com/2012/04/30/loops-and-arcs
- https://lostgarden.com/2021/12/12/value-chains/
- https://machinations.io/articles/game-systems-feedback-loops-and-how-they-help-craft-player-experiences
- https://thetvdb.com/series/game-makers-toolkit/episodes/6496889
- https://www.betaseries.com/en/episode/extra-credits/s17e39
- https://turbo-wiki.pages.dev/tim-cain/system-design/core-game-loops (search snippet only; page access-gated)
- https://www.pcgamer.com/gaming-industry/fallout-co-creator-tim-cain-says-less-is-often-more-in-game-design-as-a-very-wise-designer-once-said-to-me-a-game-that-includes-everything-is-about-nothing
- https://schedule.gdconf.com/session/developing-hi-fi-rush-backwards-and-finding-our-positive-gameplay-loop/899845
- https://gdcvault.com/play/1034256/Developing-Hi-Fi-RUSH-Backwards
- https://ungeek.ph/2023/02/hi-fi-rushs-core-gameplay-mechanic-took-a-year-to-develop-explains-director
- https://www.avclub.com/dave-the-diver-review-gameplay-loop-roguelike-fish-restaurant-management
- https://store.steampowered.com/app/2455710
- https://ixdf.org/master-classes/how-to-prototype-for-games-ux
- https://patreon.com/indiegameclinic
- https://pressuregame-wiki.pages.dev/how-to-play
- https://urbanshade.org/wiki/Pressure, https://sportskeeda.com/roblox-news/roblox-pressure-a-survival-guide, https://progameguides.com/?p=886286 (Pressure fan wiki/guides, search snippets only: 100 randomized rooms, lockers, Kroner/Research persistence)
- https://rowatcher.com/news/the-core-loop-mistake-killing-most-roblox-games
- https://rowatcher.com/games/4025872087/1-strong-every-second/dying
- https://bloxodes.com/stats/games/roblox-but-every-second-you-get-1-speed-4122139330
- https://bloxodes.com/wiki/tower-defense-simulator
- https://devforum.roblox.com/t/tips-for-a-new-original-roblox-simulator/2322827
- https://devforum.roblox.com/t/feedback-on-my-sci-fi-tycoon/705263
- https://devforum.roblox.com/t/checkpoints-an-important-element-in-games/478483
- https://devforum.roblox.com/t/the-guide-to-making-a-difficulty-chartpart-1/1135152
- https://www.creation.dev/blog/roblox-simulator-game-guide (third-party, partly promotional)
- https://www.creation.dev/blog/how-to-make-a-tycoon-game (third-party, partly promotional)
- https://www.creation.dev/blog/roblox-obby-design-guide (third-party)
- https://unity.com/glossary/core-game-loop (search snippet)
