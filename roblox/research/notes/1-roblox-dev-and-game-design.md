# Roblox development and game design: what the top 20 videos teach

Researched 2026-11-09. YouTube transcripts are blocked from this server, so each video was studied through
written sources only. Most of these 20 videos have no written trace beyond the title and snippet. The
techniques below therefore lean on Roblox's own docs (which say exactly what the Home algorithm ranks on),
Roblox's Q2 2026 shareholder letter, creator write-ups on the DevForum, and interviews with the makers of
2025-26 hits. Evidence levels per video are in the table at the bottom.

## The 10-second version
- Roblox now tells you its ranking signals. The top tier is play-through rate (clicks into plays), first-play
  bounce (under 60 s and 61-180 s), play days per user (Day 1, Days 2-7, Days 8-28) and playtime per user
  (capped at 60 min/day). All are per-user averages, so a small game with engaged players is not disadvantaged.
- Since April 2026 the algorithm judges games over 28 days (it used to be 7) and deliberately trades
  short-term monetization for long-term retention. The "2025-vintage viral games" lost share. A spike-and-die
  "+1" clone is now the wrong target. A simple hook that brings people back for weeks is the right one.
- The hits are simple and familiar, and they have one fresh twist. Grow a Garden's maker calls its theme
  "as generic as you can get" but credits offline growth as the novel part. Clones are deprioritized by name.
- The click gate matters a lot. Home only shows games with a custom thumbnail, thumbnail A/B testing is built in
  (+8.5% average qualified play-through), and the icon must read at about 150x150 px.
- Ship small and fast, measure, update weekly, and expect most games to flop. With AI: plan first, give it one
  bounded job at a time, playtest after every few changes, and never let it own DataStore or RemoteEvent logic.

## Techniques (ranked: most useful for a Roblox game first)

### 1. Win the first minute (play-through rate and first-play bounce)
- What: The player must understand the game and get a reward before the 60-second bounce mark. They should still
  be playing at 3 minutes.
- Why it works: Roblox lists play-through rate and first-play bounce (measured under 60 s and 61-180 s) among
  its "most important" ranking signals. A new game's first signals are these first-session ones. Day 1 and
  Days 2-7 data come later.
  Community version: "If you can't explain your game in a single sentence to a stranger, you already have
  friction," and "Effort must follow enjoyment, not precede it" (kalidrios, DevForum, Mar 2026).
- Backed by: [Discovery docs](https://create.roblox.com/docs/discovery),
  [Discovery FAQ](https://create.roblox.com/docs/discovery-faq),
  [kalidrios DevForum post](https://devforum.roblox.com/t/why-your-technically-superior-game-isn%E2%80%99t-succeeding-on-roblox-and-why-the-algorithm-ignores-it/4461606),
  [Funnel events docs](https://create.roblox.com/docs/production/analytics/funnel-events). The video titles
  (#3, #5, #8, #11) circle this but have no written source.
- Apply in Roblox:
  - Spawn the player straight into play. No menu wall; if there is a menu, one big Play button.
  - Make the core action visible from spawn. A `Highlight` or `Beam` points at the first target, and a
    `ProximityPrompt` or one big mobile button triggers it.
  - Make the first reward land within the first few seconds (my target, not a Roblox number). Give feedback with a
    `TweenService` pop on the counter, a `SoundService` sound and a floating "+1".
  - Teach by doing, not with text walls. Show one contextual hint at a time and hide it when the player does the action.
  - Log onboarding steps from the server with `AnalyticsService:LogOnboardingFunnelStepEvent(player, step, name)`:
    1 "Joined" in `Players.PlayerAdded`, 2 "First action", 3 "First upgrade", 4 "First goal reached".
    Roblox's example plant game had about 70% drop-off between "In Farm" and "Plant Seed". Its suggested fix was
    contextual prompts toward the first action.
- Watch out: Funnel events only fire from the server in published games, not from the client or Studio.
  Validate any client-reported step on the server. Don't hide the fun behind a long tutorial or a loading screen.

### 2. One-sentence hook: a familiar theme with one fresh twist (genre and trend choice)
- What: Pick a concept a 9-year-old already understands, such as farming, growing, getting stronger, escaping or
  collecting. Then add one mechanic that is new for Roblox.
- Why it works: Familiar themes need no explanation, which helps play-through and bounce. The twist gives
  people something to talk about and makes the icon interesting ("interesting ideas create interesting icons",
  AtreyuDev). Grow a Garden's co-owner Janzen "Jandel" Madsen: "The theme and genre is as generic as you can get.
  ... Everyone likes to farm, to watch something grow." He credits offline growth (returning to find plants
  bigger) as "a novel concept for Roblox". The game went from about 500 to about 100,000 CCU in two weeks and passed
  1M CCU in about a month.
  The "+1 every second" template (+1 Speed, +1 Jump, +1 Height) is the extreme form: the whole game is the title.
- Backed by: [GamesBeat interview with Madsen](https://gamesbeat.com/janzen-madsen-interview/),
  [AtreyuDev DevForum guide](https://devforum.roblox.com/t/how-to-actually-make-a-popular-game/3115791),
  [kalidrios](https://devforum.roblox.com/t/why-your-technically-superior-game-isn%E2%80%99t-succeeding-on-roblox-and-why-the-algorithm-ignores-it/4461606)
  ("broad appeal", "cognitive clarity"), and the discovery docs ("follow trends but add your own spin" in title,
  images, description and gameplay). Video #13 remakes a +1 game and #20 chases the Grow a Garden trend (title-only).
- Apply in Roblox:
  - Write the pitch before building, as "[verb] to [grow a number], [twist]". Example shape: "Every second you
    get +1 size. Bigger players can eat smaller ones." Test it on someone who hasn't seen it.
  - Choose a number that visibly grows on screen and in the world. The player's size, a tower, a garden or a pet
    is better than an abstract counter.
  - The twist should create a reason to return or play together, such as offline growth, other players or
    weekly events. A twist that is only cosmetic doesn't do that.
- Watch out: Pure +1 games churn. Third-party trackers (search snippets only) showed "+1 Blocks Every Second"
  down 41% over 30 days and "+1 Height Every Second" peaking at 406 CCU in July 2026. One analysis says the brainrot
  genre's growth phase is over and calls it "trend-driven ... high churn"
  ([rowatcher](https://rowatcher.com/news/is-the-brainrot-trend-dying-what-ccu-data-from-three-top-games-reveals)).
  Under the 28-day algorithm, the hook only gets you the click; you still need technique 4.

### 3. Don't clone: originality is now an algorithm input
- What: Your title, art and place file must not look like a copy of an existing game, including one made from a
  template.
- Why it works: Roblox says that "Games with metadata and place files that closely resemble existing games on Roblox
  are no longer prioritized for recommendations." It highlights "the game that first added the unique metadata
  and/or placefile", though creation date alone isn't the test. Rule of thumb from the FAQ: if users see several
  games with near-identical visuals and titles, those games may get reduced discoverability.
  Separately, Roblox's "Standout Games" Home sort is hand-curated for novelty and says copies or reskins of popular
  games are "a hard sell". The 2026 shareholder letter added a DevEx rate increase "to incentivize novel game
  creation" and an incubator of 26 teams building novel content.
- Backed by: [Discovery docs](https://create.roblox.com/docs/discovery),
  [Discovery FAQ](https://create.roblox.com/docs/discovery-faq),
  [Standout Games](https://create.roblox.com/docs/creator-programs/standout-games),
  [Q2 2026 shareholder letter (SEC)](https://www.sec.gov/Archives/edgar/data/0001315098/000162828026051059/ex991-robloxq22026earnin.htm).
  Steal a Brainrot itself is reported to be "battling its many imitators"
  ([The Star, Mar 2026, headline/snippet](https://www.thestar.com.my/tech/tech-news/2026/03/25/robloxs-hit-game-steal-a-brainrot-battles-its-many-imitators)).
- Apply in Roblox: Build your own map and models, and use your own name and icon. If you start from a template or
  an AI "remake" (video #12 promotes a template Discord, and #13 has AI remake a viral +1 game), change the theme,
  the twist and the art enough that a player would not mistake it for the original.
- Watch out: Reusing your own thumbnail is fine, per the FAQ. Toolbox free models can carry backdoors, so read any
  script that comes with one.

### 4. Design for 28-day retention, not a viral spike
- What: Give players a reason to come back on Day 2, Day 7 and Day 28. A long first session is not enough.
- Why it works: "Play days per user" over Day 1, Days 2-7 and Days 8-28 is a top-tier signal. Playtime counts only
  up to 60 minutes per user per game per day, so a 5-hour grind earns no extra credit but a return visit does.
  In April 2026 Roblox began judging games over a 28-day window instead of 7. It "intentionally provides more
  impressions for highly retentive games at the expense of near term monetization." The result was "a greater than
  expected shift of engagement from high monetizing, 2025-vintage viral games" toward newer and evergreen titles.
  The letter names Animal Hospital, Grow a Garden 2 and Kick a Lucky Block as new games that rose fast under it.
  The top 10 games now take about 20% of hours, down from 30% three years earlier.
- Backed by: [Discovery docs](https://create.roblox.com/docs/discovery),
  [Q2 2026 shareholder letter](https://www.sec.gov/Archives/edgar/data/0001315098/000162828026051059/ex991-robloxq22026earnin.htm),
  [GamesBeat/Madsen](https://gamesbeat.com/janzen-madsen-interview/) (offline growth).
  [AtreyuDev](https://devforum.roblox.com/t/how-to-actually-make-a-popular-game/3115791): "retention drops when
  players get tired of doing the same thing". He lists daily rewards, badges, rebirths and difficulties, but says
  a replayable core loop matters most.
- Apply in Roblox:
  - Offline progress: save `os.time()` on `PlayerRemoving` and `game:BindToClose` with `DataStoreService`
    (`UpdateAsync`), and on join grant progress for the elapsed time, with a cap (for example 8 hours).
  - Long goals: a rebirth/prestige reset with a permanent multiplier, plus `BadgeService:AwardBadge` milestones and a
    global leaderboard on `OrderedDataStore`.
  - Something new each week: a new zone, item or event (see technique 6).
  - A daily reward that never punishes a missed day. For example, a streak that pauses instead of resetting.
- Watch out: The audience skews young. Don't use FOMO timers, guilt messages ("your plants are dying!") or
  streak-loss mechanics designed to make kids anxious. kalidrios openly recommends FOMO ("stronger than intrinsic
  motivation"); treat that as a dark pattern. Roblox's own data says under-13 cohorts were where the
  short-term-monetization games lost impressions.

### 5. Thumbnails, icon and title: the click gate
- What: The icon and thumbnails decide play-through rate, the first ranking signal.
- Why it works: "A custom thumbnail is required for your game to receive impressions from homepage
  recommendations." A game with only the default thumbnail is not eligible. Thumbnail personalization, Roblox's
  built-in A/B testing, starts once 2-5 thumbnails are active. It sends traffic to the winner per user group by
  qualified play-through rate, and Roblox reports a +8.5% average lift, with some games gaining +50%.
- Backed by: [Thumbnails docs](https://create.roblox.com/docs/production/publishing/thumbnails),
  [Game icons docs](https://create.roblox.com/docs/production/promotion/game-icons),
  [Discovery docs](https://create.roblox.com/docs/discovery), and AtreyuDev's thread (CTR is one of his "3
  pillars"; one reply was told to use more vibrant icon colors because most players use dark-themed UIs).
  Videos #7 and #9 promote an AI thumbnail/GUI tool (title-only).
- Apply in Roblox:
  - Icon: square 512x512 and sharp. Check that it still reads at about 150x150. Use one focal subject that shows the
    twist, with saturated colors that match the genre (bright for fun, heavy contrast for horror).
  - Thumbnails: 16:9 at 1920x1080 (up to 10 on the page). Keep text away from the bottom edge, where the player
    count overlays it. Show a real moment from the game. Activate 3-5 at once and leave them running rather than
    picking a winner early. Test a new set with each major update.
  - Video thumbnail: 3 uploads per month, and rejections count. Real gameplay only, with no voice-over, no music
    with lyrics and no "best game ever" claims.
  - Title and description: accurate, with no keyword stuffing. Anything implying a monetary reward ("FREE ROBUX")
    is "not prioritized for recommendations." Inaccurate tags cause bounces.
- Watch out: Misleading thumbnails raise bounce and can be moderated. All images are moderated. Thumbnails
  "must accurately reflect your game," including personalized ones.

### 6. Ship a tiny version fast, then update on a cadence
- What: Make one player action with a clear finish line, publish it, and add content weekly.
- Why it works: The algorithm keeps re-testing your game. Signals use a moving window, so a weak start isn't
  permanent, and "Roblox continually reclassifies content quality with every update." Grow a Garden "implemented a
  live service" with "weekly updates". Madsen had made "maybe 30 or 40" games before it, of which "maybe five or six
  were good", taking a lesson from each. 99 Nights in the Forest is reported to have kept a strict weekly cadence at
  first (PC Gamer, via search snippet). SmartyRBX: "Name one player action and a clear finish line. Leave the extra
  features out," and "Save a working checkpoint before adding more."
- Backed by: [Discovery FAQ](https://create.roblox.com/docs/discovery-faq),
  [GamesBeat/Madsen](https://gamesbeat.com/janzen-madsen-interview/), [SmartyRBX site](https://www.smartyrbx.com/),
  and [AtreyuDev](https://devforum.roblox.com/t/how-to-actually-make-a-popular-game/3115791) (if metrics are
  still bad by days 5-7 of ads, "it might be time to abandon the project"; he believes Roblox decides promotion in
  the first 10-25 days, but that is a community claim). The speed-build titles #2, #17 and #20 (a week, 1 hour,
  24 hours) are this idea as entertainment.
- Apply in Roblox:
  - Version 1 is the core loop, saving (DataStore with retries), one upgrade path, one rebirth, mobile-sized UI
    (`UIScale`, `UICorner`, `UIStroke`, big touch targets) and one sound per reward.
  - Publish, then put a short "what's new" board in the lobby and use Roblox experience Events for update days.
  - Plan 3-4 weekly updates ahead so content never stalls.
- Watch out: Don't polish before the hook is proven ("effort often does not equal the popularity", DevForum
  reply). A "1 hour" or "24 hours" build that went viral almost always had a big YouTube audience behind it
  (#17 and #19 are big creators). That speed is not the lesson.

### 7. Measure, don't guess: funnels and the Home Recommendations dashboard
- What: Instrument onboarding and the shop, and read Roblox's own per-signal breakdown.
- Why it works: Roblox shows which recommendation signals are weak under Creator Analytics > Acquisition > Home
  Recommendations, and shows a reduced-exposure banner on the Creator Dashboard that updates daily. Its advice
  for low retention is to "focus on core gameplay first."
  Community benchmarks for average playtime, from one AtreyuDev post (not official): under 5 min "really bad",
  5-7 average, 7-9 good, 9-15 excellent, over 15 "crazy good". He says you need "at least a few thousand daily
  visits" before the numbers mean much.
- Backed by: [Funnel events docs](https://create.roblox.com/docs/production/analytics/funnel-events),
  [Discovery FAQ](https://create.roblox.com/docs/discovery-faq),
  [AtreyuDev](https://devforum.roblox.com/t/how-to-actually-make-a-popular-game/3115791),
  [TheKozzz reply in kalidrios thread](https://devforum.roblox.com/t/why-your-technically-superior-game-isn%E2%80%99t-succeeding-on-roblox-and-why-the-algorithm-ignores-it/4461606)
  ("test onboarding and thumbnails while tracking early-session metrics").
- Apply in Roblox: Use `LogOnboardingFunnelStepEvent` for the first session. Use
  `LogFunnelStepEvent(player, "Shop", HttpService:GenerateGUID(), step, name)` for open shop, view item and purchase.
  The dashboard holds up to 10 funnel tabs. Add custom events (`AnalyticsService:LogCustomEvent`) for rebirths and
  zone unlocks. Change one thing per update so you can tell what moved the numbers.
- Watch out: Funnels count only the first instance of each step, and logging a later step completes the earlier
  ones. Ad traffic is excluded from ranking signals, so judge organic Home numbers separately.

### 8. Build with AI: plan, small jobs, playtest, keep server authority human-owned
- What: As of 2026, AI is a normal part of Roblox development. Roblox says 44% of its top 1,000 creators used
  Assistant or third-party AI over MCP between March 6 and April 7, 2026. What works and what doesn't is fairly
  clear.
- What works:
  - Plan first. Roblox's Planning Mode drafts an editable plan, "a mini game design document". Roblox criticizes
    single-step AI tools that "can feel like shooting in the dark."
  - One bounded job at a time. SmartyRBX: "Give the agent one bounded job. Test the result and keep a working
    version." The kalidrios AI post says to split work into investigate, implement, test and review, and to avoid
    "Refactor my entire game."
  - Playtest after every few changes (Roblox Build docs). Roblox's Playtesting Agent (beta) tests the game against
    the plan, using the player character as an automated QA tester.
  - Specific prompts. Use exact instance names and selection for context, and ask for a script when you want
    run-time behavior, because Assistant tends to act at edit time (Roblox prompt-engineering docs).
  - A rules file listing what the AI must never do. Examples: never swap `UpdateAsync` for `SetAsync`, never trust
    client-reported ownership or currency, and don't delete "unused" code without checking callers. Use established
    libraries (ProfileStore) instead of AI-invented save systems.
  - Verify the work yourself. SmartyRBX: "The AI can do the grunt work. It does not get to sign off its own
    homework."
- What doesn't work: One-shot "make me a viral game" prompts. Not reading the generated code (the kalidrios post
  author admits "I rarely stopped to read what it was generating" before a silent feature break). AI remakes of
  existing hits (clone penalty, technique 3). Players and devs also push back on "AI slop": "if you can't read and
  verify critical paths in your game before shipping, you don't have a game yet" (DevForum reply).
- Tools (Nov 2026): Studio has a built-in MCP server (since March 2026), the recommended way to connect Claude
  Code, Cursor, Codex and others, with one-toggle "Quick connect". Each tool call targets a `studio_id`. There is an
  official [roblox-studio-agent-plugin](https://github.com/Roblox/roblox-studio-agent-plugin) for Claude and
  ChatGPT/Codex. Roblox "Build" is a separate mobile AI game maker. It is limited to 2D/2.5D and "simpler game
  types", its games default to 16+, and opening one in Studio permanently removes its Build status.
- Backed by: [Roblox newsroom, "Studio is Going Agentic", Apr 2026](https://about.roblox.com/newsroom/2026/04/roblox-studio-going-agentic),
  [prompt-engineering docs](https://create.roblox.com/docs/assistant/prompt-engineering),
  [Build docs](https://create.roblox.com/docs/ai/build),
  [built-in MCP announcement](https://devforum.roblox.com/t/assistant-updates-studio-built-in-mcp-server-and-playtest-automation/4474643),
  [kalidrios AI workflow post, Sep 2026](https://devforum.roblox.com/t/how-to-develop-with-ai-the-right-way-%E2%80%94-vibe-coding-without-losing-your-project/4856246),
  [SmartyRBX](https://www.smartyrbx.com/). Videos #7, #9 and #13 build with AI and #18 pointedly without it (all
  title-only).
- Apply in Roblox: Keep a design doc and an AI rules file in the repo. Build one system per prompt (save, currency,
  upgrade, rebirth, UI) and playtest each one. Then do a human review of every `RemoteEvent` handler: type, range
  and rate checks, and the server deciding "can I" rather than the client claiming "I can"
  ([DevForum RemoteEvent thread](https://devforum.roblox.com/t/how-would-i-make-my-remote-events-exploit-safe/3317725)).
- Watch out: AI-generated UI and thumbnails still have to meet the accuracy and moderation rules. Connect only
  trusted MCP clients, and work on a test place or under version control.

### 9. Make it social (the co-play signal)
- What: Give friends a reason to join each other.
- Why it works: "Intentional co-play days per user, including joins, invites, and private servers" is an
  "important" (second-tier) ranking signal. Steal a Brainrot's longevity was partly credited to viral TikToks of
  kids reacting to stolen characters, a player-vs-player social moment (search snippet).
- Backed by: [Discovery docs](https://create.roblox.com/docs/discovery).
- Apply in Roblox: Shared server goals, trading or gifting, visible leaderboards in the lobby, and an "Invite
  friends" button using `SocialService:CanSendGameInviteAsync` / `PromptGameInvite`. Enable free private servers
  so friend groups can play together.
- Watch out: Check Roblox's current rules before rewarding invites with in-game items. Keep player-vs-player
  "stealing" mechanics friendly for a young audience.

### 10. Use ads and YouTubers to get a sample, not to rank
- What: Paid traffic gets you the first players so you can measure, but it doesn't lift your Home ranking.
- Why it works: "Ads do not penalize or downrank your game in RFY", and they don't help either, because "Roblox
  doesn't count the engagement, monetization, or retention of users first acquired from ads." Getting into the
  candidate pool only needs "a very low minimum number of plays from any source". A drop in impressions after a
  campaign is not a penalty.
- Backed by: [Discovery docs](https://create.roblox.com/docs/discovery),
  [Discovery FAQ](https://create.roblox.com/docs/discovery-faq),
  [AtreyuDev](https://devforum.roblox.com/t/how-to-actually-make-a-popular-game/3115791). His community advice:
  about 10,000 R$ spread over 10-15 days with a low max bid, the first 3 days spent finding the best device and age
  group, and YouTuber shorts giving roughly one-day spikes. Video #6's snippet mentions advertising (title-only).
- Apply in Roblox: Launch, send in a small amount of traffic (friends, a small Ads Manager campaign, a short
  clip), then watch D1 retention and the onboarding funnel. Fix those before spending more.
- Watch out: Don't pay for traffic before the first minute works. For a young creator, ad spend is real money and
  needs a parent's OK.

### 11. Monetize after the fun, never with "free Robux" bait
- What: Spending is a ranking input, but a second-tier one. Short-term monetization now costs you impressions.
- Why it works: "Spend days per user and Robux spent per user" are "important" signals. But the 2026 change gives
  fewer impressions to games "that emphasize short-term monetization rather than long-term retention",
  especially in the US under-13 cohort (CEO on the Q2 2026 call, via search results). Metadata implying monetary
  rewards is not prioritized, and Roblox warns against "promotional monetary rewards to drive engagement."
- Backed by: [Discovery docs](https://create.roblox.com/docs/discovery),
  [Q2 2026 shareholder letter](https://www.sec.gov/Archives/edgar/data/0001315098/000162828026051059/ex991-robloxq22026earnin.htm).
  Video #16's title mentions "Make Robux" and #19 is about "$14M Robux in 1 week" (title-only).
- Apply in Roblox: One or two optional passes that make the core loop better (2x speed, an auto-collector), sold
  with `MarketplaceService:PromptGamePassPurchase` and checked with `UserOwnsGamePassAsync`. If you sell developer
  products, handle them in an idempotent `ProcessReceipt`. Only show the shop after the player has felt the loop.
  The monetization topic notes cover the details.
- Watch out: No pay-to-win pressure aimed at kids. Paid random items have their own Roblox rules (see the
  monetization notes).

### 12. Clear the launch gates
- What: There are hard requirements without which nobody will see the game.
- Details:
  - Complete the Maturity & Compliance Questionnaire. Roblox said in 2025 it would restrict unrated experiences to
    the developer and collaborators until they have a label. Devs in 2026 report slow or confusing reviews and
    some auto-16+ ratings, so do it early.
  - Upload a custom thumbnail, which Home requires.
  - Keep the description and tags accurate.
  - Follow the Community Standards.
  - Keep the economy server-authoritative.
- Backed by: [Unrated experiences announcement](https://devforum.roblox.com/t/important-updates-unrated-experiences-and-changes-to-experience-pages/3899317)
  (search summary), [questionnaire complaints, 2026](https://devforum.roblox.com/t/experience-still-stuck-at-16-after-fixing-maturity-questionnaire/4704112),
  [Discovery docs](https://create.roblox.com/docs/discovery).
- Watch out: A 16+ label cuts off most of Roblox's audience. Avoid content that triggers it unless it's intended.

## Video by video

Note: searches for videos #5, #6, #8 and #9 surfaced AI transcript and summary sites (recapio, sozai, gist.ly,
chaindesk). Per the brief, none were used as evidence. "Likely angle" lines are inference from the title and
snippet only.

| # | Video | What it teaches | Evidence |
|---|-------|-----------------|----------|
| 1 | The ULTIMATE Beginner Guide to Roblox Studio (SmartyRBX, 5.1M) | A 40-minute Studio basics tutorial. SmartyRBX's written material stresses starting small: "a collectable, a currency counter, and a reason to open Studio". | creator: [smartyrbx.com](https://www.smartyrbx.com/) |
| 2 | How I Learned To Make Roblox Games in a Week (BinzuDev, 1.7M) | Likely angle (inference): an indie dev from outside Roblox (GameJolt) learns Studio and ships a game in a week. | title-only |
| 3 | DON'T Make a Roblox Game Without Watching This First (SmartyRBX, 869K) | Pre-start advice. His site's scoping rules: "one player action and a clear finish line", "make one thing work before buying another thing". | creator: [smartyrbx.com](https://www.smartyrbx.com/) (not this exact video) |
| 4 | Watch this before making ROBLOX Games (waveshine, 561K) | The snippet says "the journey of being a dev in a realistic way". Likely angle (inference): expect failures and a long learning curve. | title-only |
| 5 | How To Make A Popular Roblox Game (AlvinBlox, 505K) | The snippet promises tips toward a popular game. No usable written source was found. | title-only |
| 6 | I Made a Successful Roblox Game to Prove It's Not Luck (Zyonic, 407K) | The snippet covers dev process and advertising. Likely angle (inference): a repeatable process beats luck. | title-only |
| 7 | How To Make Your First Roblox Game in 2026 (With AI) (DitchyDevelopments, 389K) | The snippet promotes an AI thumbnail/GUI tool (ForgeGUI). Likely angle (inference): AI for UI and thumbnails on a first game. See technique 8. | title-only |
| 8 | Here's Why Roblox Games Blow Up (AlvinBlox, 288K) | The snippet: "why certain games blow up ... apply these principles". Roblox's discovery docs answer the same question officially (techniques 1-5). | title-only |
| 9 | Building a Viral Roblox Game with AI [FULL PROCESS] (tef, 256K) | An AI-built game ("untitled bandit beater"), with the snippet saying it "turned out better than I expected". Uses the same AI GUI tool as #7. | title-only |
| 10 | 10 Stages of Roblox Game Development (Zilar, 422K) | Likely angle (inference): a comedic tour of the dev journey's motivation ups and downs. | title-only |
| 11 | Before You Make Your Roblox Game, Study THIS First (SmartyRBX, 94K) | Likely about studying before building (inference). The site's written advice is about scope and verifying AI work. | creator: [smartyrbx.com](https://www.smartyrbx.com/) |
| 12 | Making A Viral Roblox Game Is Easier Than You Think (bubDEV, 89K) | The snippet links a "Template Discord". Likely angle (inference): templates for fast shipping. Clone risk, see technique 3. | title-only |
| 13 | Can Claude AI Build a Viral +1 Roblox Game in Just 3 Prompts? (Yxii, 89K) | Per the snippet: Claude Opus 5.5 got 3 prompts to remake a viral +1 game with zero human coding. Shows the +1 template is AI-buildable, and that remakes risk the clone penalty. | title-only (descriptive snippet) |
| 14 | The DO's and DON'Ts of Growing a Game (SmartyRBX, 273K) | Growth do's and don'ts. Same creator's written tips favor small, tested, checkpointed builds. | creator: [smartyrbx.com](https://www.smartyrbx.com/) (weak match) |
| 15 | The Secret To Making Your Roblox Game FUN! (SmartyRBX, 58K) | Game feel and fun (title). No written source on fun from him was found. | title-only (creator site has no fun-specific text) |
| 16 | How to make your FIRST Roblox Game (Make Robux) (CodeBro29, 2.8M) | A beginner start-to-publish tutorial with a monetization angle (from the title and snippet "EVERYTHING"). | title-only |
| 17 | Can I Make a VIRAL Roblox Game in 1 Hour? (Temprist, 9.9M) | Four YouTubers each build a game in 1 hour. Likely angle (inference): entertainment. A creator audience can spike a simple game, but the speed is not the lesson. | title-only |
| 18 | I Made a VIRAL Roblox Game Without AI (Duckable, 603K) | Counter-trend framing against AI-built games. The anti-"AI slop" sentiment matches DevForum replies (technique 8). | title-only |
| 19 | How I Made $14M Robux in 1 WEEK (Laughability, 6.6M) | The snippet: "I didn't intend to make as much Robux as I did". A big creator's game spiking. The game wasn't identified. | title-only |
| 20 | I Made a VIRAL Roblox Game in 24 Hours (Azerr, 340K) | The snippet cites Grow a Garden's success as the inspiration. For what actually drove Grow a Garden (generic theme, offline growth, weekly updates), see the [Madsen interview](https://gamesbeat.com/janzen-madsen-interview/), which is not about this video. | title-only |

What the list says as a whole: 6 of the 20 are SmartyRBX or AlvinBlox advice videos. 5 are "I made a viral game in
X time" challenges (#2, #6, #17, #19, #20). 4 are about AI vs. no AI (#7, #9, #13, #18). The most-viewed ones (#17,
#19) are big entertainment creators whose audiences supply the launch spike, which a new developer won't have.

## Sources
Official Roblox:
- https://create.roblox.com/docs/discovery
- https://create.roblox.com/docs/discovery-faq
- https://create.roblox.com/docs/production/publishing/thumbnails
- https://create.roblox.com/docs/production/promotion/game-icons
- https://create.roblox.com/docs/creator-programs/standout-games
- https://create.roblox.com/docs/production/analytics/funnel-events
- https://create.roblox.com/docs/assistant/prompt-engineering
- https://create.roblox.com/docs/ai/build
- https://about.roblox.com/newsroom/2026/04/roblox-studio-going-agentic
- https://devforum.roblox.com/t/assistant-updates-studio-built-in-mcp-server-and-playtest-automation/4474643 (search summary)
- https://devforum.roblox.com/t/studio-mcp-server-updates-and-external-llm-support-for-assistant/4415631 (search summary)
- https://devforum.roblox.com/t/studio-mcp-multi-agent-improvements-and-connected-ai-clients/4820583 (search summary)
- https://github.com/Roblox/roblox-studio-agent-plugin (search summary)
- https://devforum.roblox.com/t/important-updates-unrated-experiences-and-changes-to-experience-pages/3899317 (search summary)
- https://devforum.roblox.com/t/experience-still-stuck-at-16-after-fixing-maturity-questionnaire/4704112 (search summary)
- https://www.sec.gov/Archives/edgar/data/0001315098/000162828026051059/ex991-robloxq22026earnin.htm (Q2 2026 shareholder letter)
- https://www.nasdaq.com/articles/roblox-q2-earnings-call-highlights (search summary; CEO quote on under-13 impressions)

Creators and community:
- https://www.smartyrbx.com/
- https://devforum.roblox.com/t/how-to-actually-make-a-popular-game/3115791 (AtreyuDev, Aug 2024)
- https://devforum.roblox.com/t/why-your-technically-superior-game-isn%E2%80%99t-succeeding-on-roblox-and-why-the-algorithm-ignores-it/4461606 (kalidrios, Mar 2026)
- https://devforum.roblox.com/t/how-to-develop-with-ai-the-right-way-%E2%80%94-vibe-coding-without-losing-your-project/4856246 (kalidrios, Sep 2026)
- https://devforum.roblox.com/t/how-would-i-make-my-remote-events-exploit-safe/3317725 (search summary)
- https://gamesbeat.com/janzen-madsen-interview/ (Grow a Garden)
- https://www.pcgamer.com/games/survival-crafting/with-a-peak-player-count-of-14-2-million-99-nights-in-the-forest-has-an-audience-other-multiplayer-games-would-kill-for-to-find-these-behemoth-playerbases-you-need-to-be-on-a-platform-like-roblox/ (body not retrievable; search snippet only)
- https://www.thestar.com.my/tech/tech-news/2026/03/25/robloxs-hit-game-steal-a-brainrot-battles-its-many-imitators (search snippet only)
- https://rowatcher.com/games/4341358490/1-blocks-every-second/dying (third-party tracker, search snippet)
- https://rowatcher.com/games/4025872087/1-strong-every-second/dying (third-party tracker, search snippet)
- https://rowatcher.com/news/is-the-brainrot-trend-dying-what-ccu-data-from-three-top-games-reveals (search snippet)

Tried but blocked or empty: godisageek.com (403; it pointed to the SEC letter used above), medium.com/roblox-developer
(403), windowscentral.com clone article (truncated), a reddit mirror for r/robloxgamedev (403).
