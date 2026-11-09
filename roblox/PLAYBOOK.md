# The playbook: the best techniques, and how Starfall Valley uses them

This is step 3 of the TikTok's method ("identify the best techniques and figure out how to apply them to your Roblox game"). It boils down 120 videos across six topics, plus the sources behind them, into the 15 techniques that came up most often and matter most. Each one is mapped to the exact place it lives in the game.

Every claim links back to a topic file in [`research/notes/`](research/notes/), which list the videos, sources and evidence level for each point.

> **About the evidence:** YouTube blocks transcript downloads from the cloud server this was researched on (see [`research/github-repos.md`](research/github-repos.md)). So the videos were studied through their titles and descriptions, the creators' own written posts, write-ups of the talks, and Roblox's official Creator docs. Each notes file marks every video as `content`, `creator` or `title-only`. To redo the study from full transcripts, run the [study kit](study-kit/) from home.

---

## The 15 techniques, ranked

### 1. Win the first minute
**What:** Get a new player into the fun within seconds and give them a win inside 30 seconds. Teach by doing, not with text walls.
**Why:** Roblox's discovery ranking weighs *first-play bounce* (sessions under 60 seconds and from 61 to 180 seconds) and play-through rate among its top signals. D1 retention is decided in the first five minutes. Median D1 for Roblox games with 1M+ monthly players is **10.3%**; the top 1% hit **22.2%**. ([dev & design](research/notes/1-roblox-dev-and-game-design.md) #1, [retention](research/notes/2-player-retention.md) #1, [fun](research/notes/6-what-makes-a-game-fun.md) #2)
**In the game:**
- You spawn facing the valley with stars already falling: no menu, no loading screen.
- A glowing line points to the nearest star (`client/Tutorial.luau`).
- The first upgrade costs 15 Stardust, about 10 seconds of catching. A unit test enforces "affordable within 30 seconds" (`tests/run.luau`).
- Hints come one at a time: catch 5 → buy an upgrade → unlock zone 2. Then they disappear.

### 2. Make the core action fun with no rewards attached
**What:** The verb itself, done thousands of times, has to feel good. Progression amplifies fun; it can't create it.
**Why:** The loops research calls it "a progression system on top of nothing" when this is missing. The suggested test: play the bare verb for 5 minutes before building any shop. ([loops](research/notes/3-gameplay-loops.md) #1, [fun](research/notes/6-what-makes-a-game-fun.md) #11)
**In the game:** Catching isn't clicking. Every star shows a **landing ring** that grows as the star falls (`client/StarRenderer.luau`), so you read the sky, pick a target and run. Rarer stars fall faster. Catch one before it lands for an **air catch (1.5x)**, so jumping is a real skill. Chaining catches within 2.5 seconds builds a **combo, up to 2x**.

### 3. Juice every action
**What:** Layer feedback on every catch: sound, particles, a number pop-up, a squash or bounce, and screen shake for big moments only.
**Why:** It's the cheapest way to make a Roblox game feel good. It can't rescue a boring loop, but it multiplies a good one. ([fun](research/notes/6-what-makes-a-game-fun.md) #1)
**In the game** (`client/Effects.luau`):
- The star zips into you, with a sparkle burst and a "+12" that pops and floats away. Rare stars get bigger, rarity-colored numbers and "AIR CATCH! x8" tags.
- The catch ping **rises in pitch with your combo**.
- The Stardust counter bounces and counts up smoothly.
- Only Epic and rarer catches shake the camera.
- All motion respects Roblox's Reduced Motion setting.

### 4. Nest three loops, each feeding the next
**What:**
- **Core** (seconds): catch.
- **Mid** (minutes): save, then upgrade, then unlock a zone.
- **Meta** (days): Supernova, the Star Book, daily quests and rewards.

**Why:** If the outer loops don't feed and change the inner one, the game turns "repetitive, boring, and shallow" (Roblox docs, via [loops](research/notes/3-gameplay-loops.md) #2).
**In the game:**
```
CORE  (2-5 s)   spot a star → run/jump → catch → +Stardust, combo
MID   (1-30 m)  Stardust → upgrades (net, speed, jump, luck) → unlock the next zone → rarer stars
META  (days)    Aurora Peak → SUPERNOVA (reset for x1.5 forever) → faster runs
                Star Book (9 stars) · 3 daily quests · 7-day rewards · Meteor Showers
```
Each zone pays about 6–7x more per minute than the last. Unlocks take about 8, 20 and 30 minutes of play (a test keeps every unlock between 5 and 35 minutes).

### 5. Always show the next goal
**What:** Short, mid and long-term goals, always on screen.
**Why:** Roblox's retention doc ties D7 to "a progression system with short-, mid- and long-term goals". ([retention](research/notes/2-player-retention.md) #3, [loops](research/notes/3-gameplay-loops.md) #3)
**In the game:**
- A **NEXT GOAL bar** under your Stardust always shows the next zone or Supernova, with progress (`client/Hud.luau`).
- Locked gates are see-through, so you can watch rarer stars falling on the other side.
- Gate signs count down "★ 230 more to unlock".
- Red dots appear when an upgrade, quest or daily reward is ready.

### 6. Pair every positive feedback loop with a brake
**What:** Snowballing (more upgrades → more Stardust → more upgrades) needs limits: rising costs, gates, caps.
**Why:** Without them the economy breaks and goals stop meaning anything. Keep sinks slightly bigger than sources. ([loops](research/notes/3-gameplay-loops.md) #4, #6)
**In the game:**
- Upgrade costs grow 1.65–1.8x per level, and every upgrade has a max level.
- Zones have hard gates, and stars per zone are capped.
- Supernova costs 3x more each time.
- Rewards are paid in "minutes of earnings" so they never break the curve (`shared/Formulas.luau`).

### 7. Build for 28-day retention, not a viral spike
**What:** Design for players coming back for weeks.
**Why:** Since April 2026 Roblox judges games over **28 days** (it used to be 7) and trades short-term monetization for long-term retention. Spike-and-die "+1" clones lost share. ([dev & design](research/notes/1-roblox-dev-and-game-design.md) #4)
**In the game:** Supernova gives a permanent reason to replay, and the Star Book has a 9-star completion goal (one star is event-only). Daily quests change every day. **Your job:** small updates every 2–4 weeks and bigger ones every 2–3 months ([retention](research/notes/2-player-retention.md) #6). Ideas are in [README](README.md#what-to-add-next).

### 8. Social play: friends make people come back
**What:** Reward playing together, make inviting easy, and celebrate other players.
**Why:** "Intentional co-play days" is a Roblox discovery signal, and Roblox's docs say single-player games struggle on the platform. ([retention](research/notes/2-player-retention.md) #5, [fun](research/notes/6-what-makes-a-game-fun.md) #6–7, [dev & design](research/notes/1-roblox-dev-and-game-design.md) #9)
**In the game:**
- **+10% Stardust per friend in the server** (up to +30%), with a "Friend joined" toast.
- An **Invite** button uses `SocialService:PromptGameInvite`.
- Stars are shared, so everyone sees everyone catching.
- **Luck is shared:** the luckiest player in a zone raises rare-star odds for everyone there.
- Server-wide shout-outs for Novas, Prism Stars and Supernovas, plus an all-time leaderboard at spawn.

### 9. Server events: a reason to stay, and a moment to share
**What:** A scheduled event everyone experiences together.
**Why:** Pacing and novelty ("keep introducing new ways to play") plus a social moment. ([retention](research/notes/2-player-retention.md) #4, #6, [fun](research/notes/6-what-makes-a-game-fun.md) #10)
**In the game:** A **Meteor Shower** every 8 minutes, with a 30-second countdown banner. It brings 4x stars, +25% Stardust, and the **Nova**, a star that only falls during showers (`server/Events.luau`). A natural stopping point follows each one.

### 10. Gentle daily rewards and quests (no guilt trips)
**What:** Give players reasons to return without punishing them for leaving.
**Why:** The one A/B test found showed daily rewards alone didn't raise playtime, and Roblox bans false time pressure. Streaks help most when they're forgiving. ([retention](research/notes/2-player-retention.md) #8, #12)
**In the game** (`server/Rewards.luau`):
- A 7-day calendar where **missing a day pauses your streak instead of resetting it**.
- Three daily quests as session goals, with a 2x boost for finishing all three.
- A **welcome-back gift** after 3+ days away (Jagex's "returners" talk, [retention](research/notes/2-player-retention.md) #7).

### 11. Mobile-first UI
**What:** About **80% of Roblox daily users are on mobile**. Design for a phone in landscape first.
**Why:** Roblox's own UI curriculum and docs. ([UI](research/notes/4-ui-design.md) #1–2)
**In the game** (`client/Hud.luau`, `client/init.client.luau`):
- Sizes use Scale with `RelativeYY` constraints, so buttons are the same physical size on every screen. There are 46px minimums.
- The HUD uses `ScreenInsets = CoreUISafeInsets` to stay clear of notches and Roblox's top bar.
- Side buttons sit clear of the thumbstick and jump zones.
- Body text uses fixed sizes so it respects the player's text-size setting.

### 12. One consistent, cartoony visual language
**What:** One font, one palette with fixed meanings, and one button style.
**Why:** Consistency is a cheap win, and "good UI goes unnoticed" (Riot and Roblox docs). ([UI](research/notes/4-ui-design.md) #3–6)
**In the game** (`client/Theme.luau`):
- The font is Fredoka One, with thick dark UIStrokes, rounded corners and soft gradients.
- Colors keep fixed meanings: green means you can buy, gray means not yet, and a red ✕ closes.
- Buttons grow on hover, squish on press and click.
- The HUD is minimal: everything else lives in menus that open one at a time.

### 13. Measure every step
**What:** Instrument onboarding and the economy, then fix the biggest drop-off first.
**Why:** It's "measure, don't guess". D1/D7/D30 by cohort is how Roblox judges you. ([retention](research/notes/2-player-retention.md) #2, [dev & design](research/notes/1-roblox-dev-and-game-design.md) #7, [loops](research/notes/3-gameplay-loops.md) #12)
**In the game** (`server/Analytics.luau`):
- 8 onboarding funnel steps (Joined → First catch → Five catches → First upgrade → Zone 2 → First quest → Zone 3 → First Supernova), logged with `AnalyticsService:LogOnboardingFunnelStepEvent`.
- Every Stardust source and sink logged with `LogEconomyEvent`. Catches are batched to once a minute.

**Your job:** check Creator Dashboard → Analytics weekly.

### 14. Fair, honest monetization, and build the receipt pipeline first
**What:**
- Sell convenience and self-expression at fair prices: permanent passes, plus repeatable products.
- Never sell randomness to kids.
- Process every purchase so it's saved before it's confirmed.

**Why:** The critics in the list (Extra Credits, Vox, the "whaling" talk, CORSO) name the same traps: pay walls, pay-to-win, whale-hunting, fake urgency. Paid random items need full odds and `PolicyService` gating, and they're restricted in several countries. Rewarded ads can't be shown to under-13s. A small game in 2026 also earns from **engagement**: Creator Rewards pays per active spender who plays 10+ minutes. ([monetization](research/notes/5-monetization.md) #1–8)
**In the game** (`server/Shop.luau`, `shared/Config.luau`):
- **Passes:** 2x Stardust, Star Magnet, Lucky Charm (which helps the whole zone, since luck is shared), and Comet Trail (cosmetic only).
- **Products:** "Call a Meteor Shower" **for the whole server**, a 30-minute 2x boost, and two Stardust packs.
- No loot boxes, no fake timers, and nothing needed to finish the game.
- `ProcessReceipt` checks for an already-granted `PurchaseId`, grants, then **saves before confirming**.
- Shop prices are **read live** from Roblox, so discounts show correctly.
- Items with ID 0 are hidden, so the game runs before you set anything up.

### 15. Ship small, then update, and don't clone
**What:** Ship a tiny, polished version fast. Pick a familiar theme with one fresh twist. Expect to iterate.
**Why:** Roblox now **deprioritizes look-alike games**. The model is Grow a Garden: a "generic" theme plus one novel mechanic. ([dev & design](research/notes/1-roblox-dev-and-game-design.md) #2–3, #6)
**In the game:** The theme is a familiar collect-and-upgrade simulator. The twist: you **physically catch falling stars**, reading landing rings and jumping for air catches, with shared luck and server-wide showers. It's built as an original concept, not a copy of any existing game.

---

## What you still have to do (the parts code can't)

1. **Thumbnail and icon.** These are the click gate: Home only shows games with a custom thumbnail, and A/B testing 2–5 thumbnails averages **+8.5%** play-through. The icon must read at about 150px. Starters are in [`game/marketing/`](game/marketing/). ([dev & design](research/notes/1-roblox-dev-and-game-design.md) #5)
2. **Playtest on a phone** before publishing. Use Studio's Device Emulator, then a real phone.
3. **Set up passes, products and badges** in the Creator Dashboard and paste the IDs into `game/src/shared/Config.luau`.
4. **Turn on API access** for saving (Game Settings → Security → Enable Studio Access to API Services).
5. **Update every 2–4 weeks.** Start with the ideas in the [README](README.md#what-to-add-next).
