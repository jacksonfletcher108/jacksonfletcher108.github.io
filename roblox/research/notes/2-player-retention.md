# Player retention: what the top 20 videos teach

Researched 2026-11-09. YouTube transcripts were not used (blocked here, and the brief rules them out).
Most of the useful, checkable material came from Roblox's own Creator Hub docs, GDC Vault abstracts,
Game Developer / PocketGamer.biz write-ups and Roblox DevForum threads. Of the 20 videos, only 6 have a
written source describing the specific talk. The rest are labelled `title-only` and are not leaned on.

## The 10-second version
- **Day 1 is decided in the first 5 minutes, and Roblox's discovery algorithm watches the first 60 and 180 seconds.**
  First-play bounce rate (sessions under 60 s and 61-180 s) is one of the top-weighted ranking signals. Put the player in the core loop within seconds, give a fast win, and end the first session on a "designed moment of joy" with the next goal visible.
- **Measure it like Roblox does.** D1/D7/D30 = % of *new* users who come back 1, 7 and 30 days after their first play, grouped by first-play date. Instrument onboarding with `AnalyticsService:LogOnboardingFunnelStepEvent` and fix the biggest drop-off first. Realistic bar: median D1 for Roblox games that reached 1M+ MAU is 10.3%; the top 1% is 22.2%.
- **Each retention horizon needs a different fix.** Roblox's docs say D1 comes from the core loop, onboarding and performance, D7 from a progression system with short-, mid- and long-term goals, and D30 from steady content (small updates every 2-4 weeks, big ones every 2-3 months) plus social systems.
- **Social play and returning players are the long game.** "Intentional co-play days" is a discovery signal. Invites, parties, trading and events bring people back. Jagex's GDC talk argues that winning back lapsed players matters as much as reducing churn.
- **Login rewards don't fix a weak game, and pressure tactics break Roblox rules.** The one A/B test found in the DevForum material showed no playtime gain from daily rewards. Roblox explicitly bans false time pressure, bait-and-switch rewards and disguised ads in notifications. Bring players back because the game is good, then add gentle reminders.

## Techniques (ranked: most useful for a Roblox game first)

### 1. Get to the fun in under 5 minutes (the FTUE)
- What: The first-time user experience (FTUE) should teach only the essentials: the controls, plus what the core loop is and *why* you do it. It should get the player to a satisfying moment fast and leave them wanting more. Roblox's onboarding doc has three rules: "teach the essentials, get to the fun quickly, leave players wanting more". It also asks for an "intentionally designed moment of joy" at the end of onboarding.
- Why it works: Players decide "within minutes" (Roblox onboarding doc). The discovery system treats first-play bounce rate as a top-tier *negative* signal, measured in two windows: under 60 s and 61-180 s. A slow start therefore loses both the player and future recommendations.
- Backed by: Roblox Creator Hub (onboarding, engagement and retention pages; "aim to get users to the fun in 5 minutes or less"); Roblox discovery doc; videos #9 and #14 by title (FTUE-focused, not verified); Homa/GameAnalytics FTUE guidance seen in search results (track drop-off through the tutorial funnel).
- Apply in Roblox (my recommended timeline, based on the docs):
  - 0-10 s: spawn straight into the world, with no menu wall or settings screen. A short loading screen built with `ReplicatedFirst` is fine.
  - 10-30 s: the player does the core action once. Guide them with a `Beam` or a `BillboardGui` arrow toward the first objective. Use `ProximityPrompt` so "press E" is self-explaining, and show controls for each device on screen (check `UserInputService.TouchEnabled` / `GamepadEnabled`).
  - 30-120 s: finish the first full loop (for example collect, sell, upgrade) and give a big reward with feedback: `TweenService` pop on the currency label, `UIScale` bounce, `SoundService` sting, particles.
  - 2-4 min: first level-up, with very low early XP thresholds ("level up quickly", per the onboarding doc), and a starter item. Be generous, but don't hand out so much that the economy breaks.
  - ~5 min: the "moment of joy". Examples: first rare find, first new area unlocked, or a welcome badge via `BadgeService:AwardBadge` from the server. Then reveal the next short-term goal and tease a long-term one (a locked zone or pet visible across a gate).
  - Replace long tutorials with short, contextual tooltips (Roblox engagement doc). Remove anything that blocks playing with friends.
- Watch out: Forced, unskippable dialogue is the classic drop-off point. Test a dialogue tutorial against a guided arrow with Roblox **Experiments** (A/B testing, which the onboarding doc suggests). Tune XP thresholds and starter currency live with **Configs** instead of shipping updates. Don't front-load shop popups in the first session; save daily rewards and offers for session 2+ (mobile publishers' advice, seen in search results).

### 2. Instrument the funnel, then read D1/D7/D30 by cohort
- What: Log every onboarding step, then compare retention cohorts before and after each change.
- Why it works: You can't fix the step you can't see. Roblox's funnel doc says onboarding is "where most users are typically lost". Its example shows a 70% drop at step 2.
- Backed by: video #2 (Roblox Creators' retention explainer; its written counterpart is the Creator Hub retention page); Roblox funnel-events, retention and analytics docs; GameAnalytics 2026 Roblox report via GameDev Reports; Level 0 Gamedev "metrics-aware design" series (#15, #18, #20; title-only).
- Apply in Roblox:
  - Server only (events don't fire from the client or in Studio). Log `AnalyticsService:LogOnboardingFunnelStepEvent(player, 1, "Joined")` in `Players.PlayerAdded`, then one step per milestone: "Moved", "FirstCollect", "FirstSell", "FirstUpgrade", "ReachedZone2". Use 6-10 clear, numbered steps. If the client reports a step, validate it on the server first.
  - Use `AnalyticsService:LogFunnelStepEvent(player, "ShopCheckout", sessionGuid, step, name)` for repeating funnels such as the shop. Up to 10 funnels show on the dashboard. AnalyticsService also has progression, economy and custom-event calls (check the API reference for exact signatures).
  - Read Analytics > Retention by daily cohort (10 days) and weekly cohort (10 weeks). Per cohort it also shows 7-day playtime per user, payer conversion and revenue.
  - Benchmarks: the dashboard compares you to similar games once you have 100+ DAU (updated daily; Roblox says these benchmarks aren't a direct discovery signal). For a reality check, GameAnalytics' 2026 Roblox report covers 500+ games with 1M+ MAU, Aug 2025-Jul 2026:

    | Metric | Median game | Top 1% |
    |---|---|---|
    | D1 | 10.3% | 22.2% |
    | D7 | 1.6% | 9.1% |
    | D30 | 0.5% | 4.7% |
    | Session length | 9.8 min | 21.1 min |

    Even the median here is a game that reached 1M MAU. Treat about 10% D1 as healthy for a new game and about 20% as excellent.
- Watch out: Metrics show *where* players leave, not *why*. Playtest to find out why. Expect a temporary dip after any big influx of new players (Roblox's retention doc shows this). After changing funnel steps, set the date range to start after the update.

### 3. Layered goals: short, mid and long term, always visible
- What: Always give the player a next thing (seconds to minutes), a session goal (10-20 minutes) and a long-term ambition (days to weeks).
- Why it works: Roblox's docs tie D7 retention to a progression system with "short-term and long-term goals" and enough variety and balance that players neither run out of content nor get frustrated. The onboarding doc says to surface goals in visible places: season passes, quests, skill trees, collections (Jailbreak's season pass is its example).
- Backed by: Roblox onboarding, engagement and retention docs; video #12 (PocketGamer.biz webinar: "context, purpose and progression", "the value of returning tomorrow, and tomorrow and tomorrow"); Raph Koster's GDC 2014 retention microtalk (caveat below); video #6 (Homa: game maps as a meta layer).
- Apply in Roblox:
  - Short: a HUD tracker for the current objective, a progress bar to the next upgrade, `ProximityPrompt` hints.
  - Mid: three rotating daily quests (for example "sell 50 items", "find 1 rare", "play 10 min with a friend"), saved in `DataStoreService` and reset on the UTC day.
  - Long: a collection book (a Pokédex-style index of pets or items), a zone map with locked areas, rebirth/prestige, badges for milestones.
  - Use a visible world map or level map, as Homa recommends for hybridcasual games. Seeing the road ahead is a goal in itself.
- Watch out: Raph Koster: "Quests work against self-expression. They force you to build what the developers want, not what you want." Leave room for goals players set themselves (base building, outfits, collections). Don't let quests become the only reason to play.

### 4. Pacing and novelty: keep introducing new ways to play
- What: Alternate intensity and rest, and introduce something new (a mechanic, area, enemy or tool) on a steady rhythm so the player always wants to see what comes next.
- Why it works: Constant intensity is exhausting and constant calm is boring. A build-up needs a release. New content pulls people forward, but novelty alone fades, so it must be paired with goals and growing mastery.
- Backed by: video #3 (Brackeys on pacing; title-only, likely angle inferred); video #1 (GMTK; unverified search snippets mention novelty that "burns out rather quickly", short-term goals and mastery); Game Developer pacing articles in search results (intensity ramps, ratio of intensity to rest); Roblox retention doc ("content variety: new modes, items, social features").
- Apply in Roblox:
  - First session: a new verb or tool every 3-5 minutes (for example shovel, then metal detector, then magnet), each opening a new zone.
  - Within a run or round: start calm, ramp up to a peak (boss, timer, wave), then a safe "hub" moment to spend rewards. `TweenService` and lighting changes (`Lighting.ClockTime`, `ColorCorrectionEffect`) make the beats feel different.
  - Gate zones by progress, not by payment, so each unlock is a fresh dose of novelty.
- Watch out: Don't shovel content in faster than the team can make it. Roblox's docs warn against players running out of content. Spread the reveals out.

### 5. Social glue: play with friends, invites, trading, leaderboards
- What: Build reasons to play *together* and to bring friends along.
- Why it works: Roblox's discovery doc lists "intentional co-play days per user" as an important ranking signal. Its retention doc names trading, parties, guilds, PvP, tournaments and leaderboards as the D30 levers. Pixelberry let players put real-life friends into High School Story, and its D7 retention stayed over 50%.
- Backed by: Roblox discovery, retention and invite-prompt docs; video #10 (Pixelberry, via PocketGamer.biz interview); video #12 ("social engagement, and players' own audiences").
- Apply in Roblox:
  - `SocialService:CanSendGameInviteAsync(player)` (in a `pcall`), then `SocialService:PromptGameInvite(player, options)`. Pass `ExperienceInviteOptions` with a short `PromptMessage` and `LaunchData` (200 chars max, JSON via `HttpService:JSONEncode`). Read it on join with `Player:GetJoinData()` and spawn the friend next to the inviter.
  - Show the prompt at moments of pride, such as just after clearing a stage, not on join.
  - Co-op bonuses: +10-20% rewards when playing with a friend, shared base or party objectives, a "friend joined" toast.
  - Leaderboards on an `OrderedDataStore` (all-time) plus a weekly board so new players can compete. Trading with a server-side confirmation screen.
- Watch out: Never *require* inviting friends to progress, and don't gate rewards behind friend counts. Roblox's notification rules also bar tricking users. Kids under 13 have stricter chat and notification limits, so solo play must stand on its own. Roblox has a "Friend Invite Reward System" for rewarding invites; use that sanctioned route rather than an ad-hoc bribe.

### 6. A live content rhythm: updates, events and announcements
- What: A predictable schedule of new content, time-limited events and update announcements.
- Why it works: Roblox's retention doc links D30 retention to regular content: smaller updates every 2-4 weeks, bigger features every 2-3 months. Pixelberry credits years of *weekly* episode releases for its retention (D7 over 50%).
- Backed by: Roblox retention doc; Roblox experience-events doc; video #10 (Pixelberry interview); video #8 (Jagex: "community events" as a returner lever).
- Apply in Roblox:
  - Creator Dashboard > Events & Updates: publish up to 10 upcoming or ongoing events. Players tap **Notify Me** and get an inbox notification when the event starts. An event reaches the Trending Events chart if it started within 7 days, has 1,000+ RSVPs and is public. The event ID arrives in join data, so you can greet event players.
  - Update announcements reach followers: 60 characters, once every 3 days. Be specific ("New Volcano zone + 12 pets"), not "bug fixes".
  - A simple cadence for a small team: a weekend event every 2 weeks (2x drops, a limited badge), a new zone or feature monthly.
  - Timed content can be scheduled with `os.time()` windows on the server, so events go live without a new publish.
- Watch out: Event exclusives create FOMO. Prefer cosmetics and badges that will come back later, and never sell "last chance" items with countdown pressure. Roblox bans "false time pressure" in notifications, and that's a good rule for the whole game.

### 7. Win back lapsed players (returners)
- What: Treat people who have stopped playing as a group to win back: give them reasons and a smooth path back.
- Why it works: Jagex's Phil Mansell (GDC 2015): "Retention is the cornerstone of successful online and F2P games". His talk argued that improving the rate of returning players matters as much as reducing churn, with case studies across "game content, community events, communications and billing".
- Backed by: video #8 (GDC Vault abstract); Roblox experience-notifications, experience-events and Creator Rewards docs.
- Apply in Roblox:
  - **Experience Notifications**: ask with `ExperienceNotificationService:PromptOptIn()` after checking `CanPromptOptInAsync()` in a `pcall`. Ask at a good moment, such as after the first quest. The prompt won't reshow for 30 days and only works for opted-in users aged 13+. Send from the server with the Open Cloud package's `createUserNotification` (99-character string with parameters, plus `launchData`). Roblox allows only **1 notification per user per day**, and delivery reach shrinks if players ignore them. Make them personal and actionable ("Your crops are ready", "Your friend beat your time"), not ads.
  - **Welcome-back flow**: store `lastSeen` in `DataStoreService`. If it's more than 7 days ago, show a one-screen "What's new", give a modest gift, and offer a catch-up boost (for example 2x XP for 30 minutes) so returners aren't hopelessly behind friends.
  - **Share Links**: Creator Rewards "Audience Expansion" pays 35% of a new or *reactivated* user's first $100 of purchases over 60 days when they arrive through your Share Link, a direct link or a search for your game name (and play 10+ minutes, with the game averaging 100+ DAU). So off-platform community posts that bring lapsed players back are rewarded.
- Watch out: Players under 13 can only get update notices, not personalized notifications. Don't guilt-trip ("Your pets miss you!"). Don't let decay or loss mechanics punish time away; returners who find their stuff gone don't stay.

### 8. Daily rewards and streaks, done gently
- What: Reward players for coming back on consecutive days and for time played.
- Why it works (and when it doesn't): It gives a light reason to check in. But the evidence is mixed. One developer's A/B test found daily rewards did **not** increase total playtime per player. A simulator with *two* daily reward systems and a stay-in-game timer still saw D1 fall from 20% to 3%. Rewards amplify a good core loop; they don't replace one.
- Backed by: Roblox Engagement Rewards feature package doc; DevForum threads ("Do daily rewards actually keep players retention?", "Raising Day 1 Retention"); Raph Koster's GDC 2014 notes (the panel centred on "daily login bonus" mechanics).
- Apply in Roblox:
  - Roblox's official **Engagement Rewards** feature package (put Core + Engagement Rewards in `ReplicatedStorage`) supports two reward types. Daily rewards unlock on consecutive logins (`requiredDaysVisitedStreak`). Time rewards unlock on minutes in the current session (`requiredSecondsInGame`, which resets each session). `isHiddenOnJoin` controls the popup on join, `isAlignedToStreakResetTime` controls the day boundary, and `Types.RewardEffect.Valuable` highlights big rewards. You grant the reward in `rewardClaimedHandlerFunction()`, which must return a boolean.
  - Or roll your own: save `{streak, lastClaimDay}` with `DataStore:UpdateAsync`, where `day = os.time() // 86400` (UTC).
  - Design: a **7-day cycle** that repeats (streak of streaks), with small consumables on days 1-6 and a durable item that *changes how you play* (a new tool or vehicle) on day 7. Add **one grace day**, and when a streak breaks, step back a tier rather than to zero. Keep the total small next to what play earns, so it never becomes the main income.
  - Time-in-session rewards at roughly 10, 30 and 60 minutes. The package doc uses these as example thresholds.
- Watch out: A harsh reset turns a reward into a punishment and leans on loss aversion. That matters with a young audience. No countdowns tied to purchases, and no "pay to restore your streak". Stay-in-game timers mostly create AFK farming. Roblox's discovery system caps credited playtime at 60 minutes per user per game per day, so padding beyond that gains nothing anyway.

### 9. Emotional attachment: visceral, behavioural and reflective
- What: Design for the three levels of Don Norman's emotional design. *Visceral*: how it looks, sounds and feels right now. *Behavioural*: the satisfaction of skilled, repeated actions. *Reflective*: memories, identity, pride.
- Why it works: Epic's Jim Brown (GDC 2017): "Humans aren't always as rational as they might think." Combining the levels helps players "build memories", form habits of repeated movement and action, and makes feedback land. He stressed respecting players' **mental models** so emotional design doesn't end up "frustrating or confusing players".
- Backed by: video #5 (GDC Vault abstract plus Game Developer's UX Summit recap).
- Apply in Roblox:
  - Visceral: juicy feedback on every core action (camera shake via `Camera.CFrame` offsets, `TweenService` squash and stretch on UI, `UIStroke`/`UICorner` polish, layered `SoundService` sounds).
  - Behavioural: a core action that rewards skill (timing windows, combos), with controls that work the same on touch, gamepad and keyboard.
  - Reflective: things players *own and name*, such as pets, a home base or a trophy shelf of badges, so leaving would mean leaving something of theirs.
- Watch out: Follow genre conventions players already know (standard WASD/jump, a familiar shop icon). Clever but unfamiliar UI breaks their mental model.

### 10. Curiosity, story beats and cliffhangers
- What: Open questions the player wants answered, such as a locked door, a mystery NPC, a "to be continued" or the next zone visible but out of reach.
- Why it works: Pixelberry's GDC 2014 talk explained High School Story's mix of "drama, romance, comedy and cliffhangers" to drive engagement and retention. The studio built around story: 8 of its 15 staff were writers.
- Backed by: video #10 (Game Developer and GDC Vault description; PocketGamer.biz interview); video #5 (emotional ties).
- Apply in Roblox: End sessions on a hook, for example the boss gate visible at the edge of the newest zone, or an NPC who says "come back when you've found the third key". Run a weekly mystery tied to update cadence (technique 6). Hide secrets players will share with friends, like a hidden badge via `BadgeService`.
- Watch out: Cliffhangers work when the payoff arrives. Don't promise content you won't ship.

### 11. Performance is a retention feature
- What: The game must run well on cheap phones as well as PCs.
- Why it works: Roblox's retention doc lists performance alongside core loop and FTUE as the D1 levers: test across devices and track crashes, frame rate and errors with each update. GameAnalytics' 2026 report says 44% of Roblox players use both mobile and PC and 11.55% are mobile-only.
- Backed by: Roblox retention and engagement docs; GameAnalytics 2026 Roblox report.
- Apply in Roblox: Turn on `Workspace.StreamingEnabled`, keep part, texture and mesh counts low (the engagement doc warns about "excessive textures, meshes"), test on a low-end phone, and watch the error and performance reports after each update. Size touch buttons for thumbs with `UIScale` and the safe area.
- Watch out: If onboarding retention drops right after an update, check the error and performance reports first (Roblox's engagement doc gives this exact advice).

### 12. Natural session goals and stopping points
- What: Design a satisfying session of about 10-20 minutes that ends on a high and sets up tomorrow, rather than an endless treadmill.
- Why it works: The median Roblox game session is 9.8 minutes and the top 1% is 21.1 (GameAnalytics 2026). Roblox's discovery system values *play days per user* (coming back across days) and caps playtime credit at 60 minutes a day. Its Creator Rewards count a player who spends 10+ minutes in a day (cumulative). So steady 10-20 minute daily visits beat one marathon.
- Backed by: Roblox discovery and Creator Rewards docs; GameAnalytics report; video #12 ("lifestyle fit").
- Apply in Roblox: Give each session a "session goal" card (three daily quests or one boss), show progress toward it, then show a "Great session! Tomorrow:" summary that previews the next unlock. Timers that pay out while offline (crops grow, eggs hatch) give players a reason to come back *later* rather than a reason to stay.
- Watch out: Offline timers become manipulative when they get paired with "pay to skip" or "come back or lose it" pressure. Keep them generous and lossless.

## Engagement versus compulsion: where the line is
The GMTK video (#1) is the obvious reference here, but I could not verify its contents (see the table). The line below comes from Roblox's own rules plus the sources above.
- **Roblox's explicit rules (notifications doc):** no disguised ads, false time pressure, bait-and-switch rewards, or tricking users into purchases. Gameplay may not *require* notifications to be on.
- **Discovery doc:** "You should not rely on promotional monetary rewards to drive engagement". Metadata implying a monetary reward isn't prioritized for recommendations.
- **Likes and favorites for rewards:** DevForum users widely say this breaks Roblox rules. I found no current official wording, and a March 2026 thread shows the practice is common and disputed. Don't do it: it's at best a grey area, and likes and favorites aren't among the listed discovery signals anyway. Rewards for joining a group are widely treated as acceptable by forum users (unofficial).
- **The test I'd use:** would the player be *glad* they came back?
  1. Rewards come from playing, not just from showing up or idling.
  2. Missing a day costs little (grace days, no full reset, no decay).
  3. No countdowns or "last chance" pressure tied to spending.
  4. Clear stopping points; the game is happy to let you leave.
  5. No social pressure loops (no forced invites, no shaming).
  6. Extrinsic rewards support play rather than replace it. The overjustification effect (Lepper, Greene & Nisbett, 1973) shows extra rewards can undermine interest kids already had. GMTK has a separate episode on rewards backfiring; I saw only its title.
- Titles like video #16's ("How to Make Players Addicted... Psychology Hacks") are the framing to avoid with a young audience.

## Video by video
| # | Video | What it teaches | Evidence |
|---|---|---|---|
| 1 | How to Keep Players Engaged (Without Being Evil), Game Maker's Toolkit (2.78M views) | Ways to hold players to the credits without manipulation (from the description). Search-engine snippets I did not open hint at novelty ("burns out rather quickly"), player-set and short-term goals, and mastery needing "pitch-perfect difficulty". Unverified. | title-only, plus unverified snippets. Air date Apr 6 2018 ([TheTVDB](https://thetvdb.com/series/game-makers-toolkit/episodes/6636291)). Community subtitles exist on Amara but were not opened, per the brief. |
| 2 | What are retention metrics on Roblox?, Roblox Creators | D1/D7/D30 definitions and how to keep players coming back; its written twin is the Creator Hub retention page (cohorts; D1 = core loop/FTUE/performance; D7 = progression; D30 = updates + social) | creator ([Roblox retention doc](https://create.roblox.com/docs/production/analytics/retention)) |
| 3 | Keeping players Interested - Pacing in Game Design, Brackeys | Likely angle (inference): alternating intensity and rest, introducing new elements over time | title-only |
| 4 | A guide to increasing your RETENTION, dev_fraudkuna | Likely angle (inference): Roblox-specific tips; the description links a Sol's RNG video, so probably uses that game as a case study | title-only |
| 5 | From Rational to Emotional, Jim Brown (Epic), GDC 2017 | Norman's visceral/behavioural/reflective levels; build memories and patterns; respect mental models; emotional attachment rather than narrative | content ([GDC Vault](https://gdcvault.com/play/1024153/From-Rational-to-Emotional-Designs), [Game Developer recap](https://www.gamedeveloper.com/design/gdc-2017-ux-summit-overview)) |
| 6 | Engagement Power of Game Maps (Scrape Master), Homa Academy | Game maps as a meta layer for engagement; maps in hypercasual vs hybridcasual; a Scrape Master breakdown | content, outline only ([Homa hangout page](https://hubspot.academy.homagames.com/homa-academy/hangout-030), seen via search) |
| 7 | Successful Roblox GAME DEV Tutorial #1: RETENTION!, TehLemonsRUs | Likely angle (inference): picking game ideas that keep players and reach the front page | title-only |
| 8 | Returners and Retention, Phil Mansell (Jagex), GDC 2015 | Returners matter as much as churn; levers are content, community events, communications, billing; RuneScape case studies | content ([GDC Vault abstract](https://gdcvault.com/play/1022236/Returners-and-Retention-How-to)) |
| 9 | Mastering the FTUE Experience, Homa Academy | The FTUE as the bridge that makes or breaks mobile retention (description only) | title-only (Homa page returned 503) |
| 10 | Getting Players to Care: Narrative to Drive Retention, Pixelberry, GDC 2014 | Drama, romance, comedy and cliffhangers; studio context: weekly episodes, 8 of 15 staff writers, real friends in the game, D7 over 50% | content ([Game Developer summary via search](https://gamedeveloper.com/design/video-storytelling-strategies-that-will-get-players-to-care)) + creator ([PocketGamer.biz interview](https://www.pocketgamer.biz/pixelberrys-oliver-miao-on-how-weekly-updates-keep-high-school-storys-day-7-retention-over-50/)) |
| 11 | How to Increase Retention for Casual Mobile Games, App Masters (Kevin Wolstenholme) | Likely angle (inference): indie casual-mobile retention tips | title-only (companion article returned 404) |
| 12 | Game Design For Engagement & Retention, PocketGamer.biz webinar | Build retention into the core loop; use data and configs; "context, purpose and progression"; lifestyle fit, social, players' own audiences | content ([event page](https://www.pocketgamer.biz/free-webinar-game-design-for-engagement-and-retention/)) |
| 13 | Game Retention Tips From Day 1 To Day 180, Stash | Likely angle (inference): short- vs long-term retention levers | title-only |
| 14 | ThursDev: FTUE & retention in your first minutes, Level 0 Gamedev | Likely angle (inference): first impressions in a crowded market | title-only |
| 15 | ThursDev: Metrics-aware design Pt 2: measuring retention, Level 0 Gamedev | Likely angle (inference): what D1/D7/D30 mean and why to track them | title-only |
| 16 | How to Make Players Addicted..., Justin G | Clickbait "psychology hacks"; useful only as an example of the framing to avoid | title-only |
| 17 | How to retain your players!, Rule of Carnage (podcast ep. 172) | Likely angle (inference): an indie discussion of whether and how to retain players | title-only |
| 18 | ThursDev: Metrics-aware Pt 5: retention and session length, Level 0 Gamedev | Likely angle (inference): design changes that move retention and session length | title-only |
| 19 | Drive player engagement: best of Finnish mobile gaming, PocketGamer.biz | Likely angle (inference): lessons from Finnish studios | title-only |
| 20 | ThursDev: Metrics-aware Pt 3: Play Pattern Profile, Level 0 Gamedev | Likely angle (inference): profiling *when and how long* players play, to plan sessions | title-only |

Off-topic check: none are clearly off-topic. #16 is low-quality clickbait. Several (#6, #9, #11, #13, #19) are mobile-industry talks, so their advice needs translating to Roblox's younger, social, free-to-play audience.

## Sources
- https://create.roblox.com/docs/production/analytics/retention
- https://create.roblox.com/docs/production/analytics/engagement
- https://create.roblox.com/docs/production/analytics/funnel-events
- https://create.roblox.com/docs/en-us/production/analytics.md
- https://create.roblox.com/docs/production/game-design/onboarding
- https://create.roblox.com/docs/discovery
- https://create.roblox.com/docs/production/promotion/experience-notifications
- https://create.roblox.com/docs/production/promotion/invite-prompts
- https://create.roblox.com/docs/production/promotion/experience-events
- https://create.roblox.com/docs/resources/feature-packages/engagement-rewards
- https://create.roblox.com/docs/creator-rewards
- https://devforum.roblox.com/t/raising-day-1-retention/2514579
- https://devforum.roblox.com/t/do-daily-rewards-actually-keep-players-retention/3556728
- https://devforum.roblox.com/t/the-issue-of-bribing-players-for-likes/4495969
- https://devforum.roblox.com/t/is-rewarding-players-for-liking-favoriting-a-game-allowed/2926286 (seen via search summary only)
- https://gamedevreports.substack.com/p/gameanalytics-key-roblox-and-roblox
- https://gdcvault.com/play/1024153/From-Rational-to-Emotional-Designs
- https://www.gamedeveloper.com/design/gdc-2017-ux-summit-overview
- https://www.gamedeveloper.com/design/video-epic-s-guide-to-keeping-players-engaged-via-emotional-game-design
- https://gdcvault.com/play/1022236/Returners-and-Retention-How-to
- https://gamedeveloper.com/design/video-storytelling-strategies-that-will-get-players-to-care (via search)
- https://www.pocketgamer.biz/pixelberrys-oliver-miao-on-how-weekly-updates-keep-high-school-storys-day-7-retention-over-50/
- https://www.raphkoster.com/?p=15856
- https://www.pocketgamer.biz/free-webinar-game-design-for-engagement-and-retention/
- https://hubspot.academy.homagames.com/homa-academy/hangout-030 (via search)
- https://hubspot.academy.homagames.com/homa-academy/retention-and-ftue (returned 503)
- https://appmasters.com/articles/retention-casual-mobile-games (returned 404)
- https://thetvdb.com/series/game-makers-toolkit/episodes/6636291
- https://www.gamedeveloper.com/design/trinity-part-6-intensity-ramps (pacing background, via search)
