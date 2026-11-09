# Monetization: what the top 20 videos teach

Researched 2026-11-09. YouTube transcripts were blocked, so the notes on each video come from written sources only. Most of the Roblox-creator videos in this list have no written companion, so they are marked `title-only`. The rules and numbers below come mainly from Roblox's Creator Hub docs and DevForum announcements, checked this session. Several pages were updated in 2026.

Note: the brief mentions a "Going Indie" video. None is in this topic's top 20. The third industry-critique video in the list is PocketGamer.biz's "Let's go whaling" talk (#11), so these notes cover that one instead.

## The 10-second version
- **Build the receipt pipeline before the shop.** `ProcessReceipt` must save the purchase, keyed by `PurchaseId`, before it returns `PurchaseGranted`. Don't hard-code any price: Roblox Plus discounts and price tests change what players see.
- **In 2026 a small game earns from engagement, not only from sales.** Creator Rewards pays 5 Robux per Active Spender per day. Roblox Plus pays up to 750 Robux per subscriber you sign up, plus up to 100 Robux for private-server play. A fun, sticky game with 10+ minute sessions earns without any pressure selling.
- **Sell convenience and self-expression, permanently and at fair prices.** That means 2x currency, VIP, auto-collect, extra slots and trails, plus one honest starter pack. The critics (Extra Credits, Vox, the whaling talk, CORSO) all point at the same traps: pay walls, pay-to-win, whale-hunting, hidden currency prices and fake urgency.
- **Don't sell randomness in a starter game.** Paid random items (eggs, spins, luck potions, pity timers) need full numeric odds and `PolicyService` gating. They are restricted in Australia, Belgium, the Netherlands, the UK and Brazil, and breaking the rules can get the game removed.
- **Rewarded video ads are opt-in extras with tight rules.** You need 2,000+ monthly visitors, ID-verified 13+ creators, and rewards worth 3–10 Robux that are never random. Rewarded formats can't be shown to under-13 users (effective May 4, 2026).

## Techniques (ranked: most useful for a Roblox game first)

### 1. Make every purchase idempotent and saved before it's granted
- What: `MarketplaceService.ProcessReceipt` is the only correct place to grant developer products. Record the receipt's `PurchaseId` in the same DataStore write that changes the player's data. Return `PurchaseGranted` only after that write succeeds. Return `NotProcessedYet` for any failure, and Roblox retries (for example the next time the player joins).
- Why it works: a buyer who pays and gets nothing is the worst outcome (refunds, bad reviews, a broken trust). A double grant breaks your economy. Keying on `PurchaseId` turns a retried receipt into a harmless no-op.
- Backed by: official developer-products guide (one callback, set by one server script; "Do not use the PromptProductPurchaseFinished event to process purchases"; Roblox doesn't record purchase history for you). The MarketplaceService reference sample keys a "PurchaseHistory" store by `PurchaseId` with `UpdateAsync`, and admits it "does not completely mitigate cross-server data failure scenarios". #18 (Squidingz pass tutorial) is the pass side of this.
- Apply in Roblox: put it in a single ServerScriptService script. The grant functions must be pure: they edit the saved table only, never yield, never touch Instances.
```lua
local MarketplaceService = game:GetService("MarketplaceService")
local DataStoreService  = game:GetService("DataStoreService")
local Players           = game:GetService("Players")
local store    = DataStoreService:GetDataStore("PlayerData_v1")
local Decision = Enum.ProductPurchaseDecision

local GRANTS = { -- [productId] = pure function on the saved table
  [111111] = function(d) d.boostUntil = math.max(d.boostUntil or 0, os.time()) + 900 end, -- 15-min 2x
  [222222] = function(d) d.starterPack = true; d.coins += 1000 end,
}

MarketplaceService.ProcessReceipt = function(r)
  local grant  = GRANTS[r.ProductId]
  local player = Players:GetPlayerByUserId(r.PlayerId)
  if not grant or not player then return Decision.NotProcessedYet end
  local ok, saved = pcall(store.UpdateAsync, store, "u" .. r.PlayerId, function(d)
    d = d or newPlayerData()
    d.receipts = d.receipts or {}
    if d.receipts[r.PurchaseId] then return d end -- already granted earlier: no double grant
    grant(d)
    d.receipts[r.PurchaseId] = os.time()
    pruneOldest(d.receipts, 50)                  -- keep the table small
    return d
  end)
  if not ok then return Decision.NotProcessedYet end -- nothing saved = nothing granted
  PlayerData.mergeLive(player, saved)              -- only now update live state + UI
  return Decision.PurchaseGranted
end
```
  - Passes: on `PlayerAdded`, wrap `UserOwnsGamePassAsync` in `pcall` and restore perks. Grant on `PromptGamePassPurchaseFinished` when `purchased` is true.
  - Subscriptions: check `GetUserSubscriptionStatusAsync` on the server, and listen to `Players.UserSubscriptionStatusChanged`.
  - Read every price at runtime with `GetProductInfoAsync`, `GetDeveloperProductsAsync` or `PriceInRobux`.
- Watch out:
  - The live session cache must never `SetAsync` an older copy over the saved receipt. Either do every save through `UpdateAsync` merges, or use a session-locked profile library. With a profile library, put the grant and the `PurchaseId` into the profile and return `PurchaseGranted` only after its save confirms.
  - Never return `PurchaseGranted` for an unknown product ID.
  - Cross-game pass and developer-product sales were disabled on May 30, 2026. Sell only inside your own universe.

### 2. Pick the right product type for each job
- What: the docs list seven ways to charge, and each fits a different kind of item.

| Type | Use for | Key facts (official docs) |
|---|---|---|
| Pass | Permanent perk (VIP, 2x, auto-collect) | One-time Robux fee. A promoted pass on sale must be priced 50–800 R$ (">49 and <801"). |
| Developer product | Repeatable item (boosts, currency, skips) | Repeatable. Price range 1 R$ to 1 billion R$. Must be granted via ProcessReceipt. |
| Subscription | Monthly perks | Local-currency tiers: $2.99, $4.99, $7.99, $9.99, $14.99. Creator share: 70% in month 1, then 100%. Robux subscriptions: minimum 49 R$, 70% share. Benefits must be honoured for the full term. |
| Private servers | Playing with friends | Monthly Robux fee. Roblox Plus subscribers get them free, and you earn a bonus instead (technique 4). |
| Paid access | Closed betas | One-time fee in Robux or local currency. |
| Immersive ads | Passive income | Image and portal ad units. Being eligible doesn't guarantee ads get served. |
| Robux transfers | Tip jar or support-the-dev | `PromptRobuxTransferAsync`, 10–500 R$. You earn 10% of Plus subscribers' transfers, with no fee (Plus doc). |

- Why it works: the product type sets the player's expectation. Passes promise permanence, developer products are consumed, subscriptions recur. A mismatch, such as a "permanent" boost sold as a product, breaks trust.
- Backed by: Roblox monetization overview, passes, developer products and subscriptions docs. #4, #5, #6, #10, #14 and #17 are all "ways to monetize" explainers (title-only).
- Apply in Roblox: create passes only after the game is published. Use 512x512 icons with key content inside the circle, and set them to **Listed** so they show on the game page.
- Watch out: subscriptions can't revoke benefits quietly, require extra tasks after payment, or push users to buy on other platforms. If a subscription replaces a pass, existing pass holders keep their benefits.

### 3. A small, fair pass catalogue on a clear price ladder
- What: these are the standard Roblox passes. They are listed with how to keep each one fair. No source found this session ranks them with sales data, so the list is common practice, not measured results.
  - **2x Coins**: speeds up the core loop. Fine in PvE. In PvP it's pay-to-win.
  - **VIP**: a lounge area, a chat tag, a cosmetic, and at most a small bonus.
  - **Auto-collect**: saves clicks. It's convenience, not power.
  - **Extra slots**: more inventory, equip slots or plots.
  - **Cosmetic trail or aura pack**: pure self-expression, and the safest to sell.
- Why it works: the whaling talk (#11) says convenience and speed-ups bring in most F2P revenue, and customisation only "single-digit percentages" on mobile. Monetisation 101 (DevForum) warns that functional items "can make players feel cheated" in competitive games and recommends cosmetics. Roblox's foundations doc splits items into *Enhancement* (speed, tools, access) and *Expression* (skins, emotes, pets). It says each needs "a clear purpose" and an "accurate and truthful" description.
- Backed by: #11 (content), Monetisation 101, Roblox Monetization foundations. #8 (MoseyTube77) breaks down "what developer products sold the most" (title-only, contents unknown).
- Apply in Roblox: suggested ladder (my recommendation): 25 / 49 / 99 / 199 / 399 / 799 R$.
  - Trails: 49–99.
  - Auto-collect and slots: 99–149.
  - VIP: 199.
  - 2x Coins: 249–299.
  - Keep 5–7 items. Per the whaling talk's jam study, a display of 24 choices drew more interest but buyers were "one-tenth as likely" to buy as with six.
  - Show live prices. Plus members see 10–20% off, and you're still paid full price.
- Watch out:
  - Don't sell anything that decides PvP fights.
  - Don't stack multipliers so far that free players feel pointless. The whaling talk itself says "keep the power gap reasonable".

### 4. Earn from engagement: Creator Rewards, Roblox Plus and private servers
- What:
  - **Creator Rewards** replaced Engagement-Based (Premium) Payouts and the Creator Affiliate program.
    - *Daily Engagement Rewards* pay **5 Robux per day** for each Active Spender who plays **10+ minutes** in your game, if it's one of the first three games they launch that day. An Active Spender has spent $9.99+ in the last 60 days. This started July 24, 2025, with no enrollment needed.
    - *Audience Expansion Rewards* pay a **35% share of a new or returning user's first $100 of purchases anywhere on Roblox in their first 60 days**. "Returning" means a lapsed user, gone 60 days. To qualify, the user must play 10+ minutes in your game that day, your game must average **100+ DAU** for the next 60 days, and your account must be ID-verified.
    - All Creator Rewards are paid as Earned Robux with a 60-day hold.
  - **Roblox Plus** costs $4.99/month. It launched April 30, 2026, and new Premium sign-ups ended.
    - You earn 250 R$/month for 3 months (up to 750 R$) per subscriber who signs up through `PromptRobloxSubscriptionPurchase` in your game. Free trial periods don't count.
    - You earn up to 100 R$ per subscriber who spends 60+ cumulative minutes in 30 days in a paid private server they created in your game. Your server must be in that subscriber's top five.
    - Roblox pays for the 10%/20% subscriber discounts, so a 100 R$ item still earns you 70 R$.
- Why it works: the payout now follows minutes played and players brought in, not only purchases. A fair game that holds attention for 10+ minutes gets paid without pushing anyone to buy.
- Backed by: Creator Rewards doc, Roblox Plus doc (updated 2026-11-06), Business Wire launch release. #7, #12 and #13 cover "how much devs make" (title-only).
- Apply in Roblox:
  - Design the first session to last at least 10 minutes. Track it with AnalyticsService funnels (`LogFunnelStepEvent`).
  - Turn on paid private servers at a modest price.
  - Put a passive Plus button in the shop. Don't use pop-ups.
  - Make sharing easy, because Share Links count toward Audience Expansion.
- Watch out: the Plus prompt is a $4.99/month real-money subscription shown to a young audience. Keep it a button the player chooses to press, never an interruption.

### 5. Design against the traps the critics name
- What: avoid these four patterns:
  - pay walls that block normal progress;
  - pay-to-win power gaps;
  - squeezing big spenders ("whales") until the free majority leaves;
  - making free play deliberately frustrating so that paying looks like relief.
- Why it works: Extra Credits argues that squeezing the biggest spenders "drives away most of their players". Without those free players there's no community, no social proof and no Creator Rewards minutes. Vox's video, per 2016 coverage, shows how F2P games make spending easy while making some play "frustratingly difficult" unless you pay, and hunt rare "whales". The whaling talk lists the tricks openly:
  - loss aversion ("threaten to take them back unless the player pays");
  - fake scarcity and time-limited offers;
  - hiding that most players don't pay;
  - a joke about targeting "sad or tired" players.
  The University of Sydney's 2026 report found misleading or deceptive monetisation in **14 of 15** Roblox games studied: countdown timers, fake "daily discount" reference prices, prices hidden behind virtual currency, and random rewards. A former Square Enix executive called Grow a Garden's pay-to-grow and pay-to-steal design "somewhat evil" (GamesRadar headline).
- Backed by: #9 (creator), #2 (content, secondary), #11 (content), #15 CORSO (title-only). Likely angle, inference only: gacha unit summons and pay-to-win in Roblox tower defense games. Also the Sydney 2025 and 2026 studies.
- Apply in Roblox: write these rules into the design doc.
  - The whole game is completable free.
  - No purchase fixes a loss. Monetisation 101 says to offer purchases with a "positive outset rather than a negative one".
  - No energy timers that sell refills.
  - No countdown timers that reset, and no invented "was" prices.
  - Every price is shown in Robux, not only in an in-game currency.
  - At most one unprompted offer per session.
- Watch out: Roblox's Community Standards ban deceptive content used "to drive discoverability, monetization, or engagement". The Advertising Standards ban "offering free Robux to entice engagement".

### 6. An honest shop, one starter pack, and offers at the right moment
- What:
  - **The shop**: easy to find, quick to enter and leave. It should preview items, explain their value, rotate stock and act as an "information hub" for new content (Roblox foundations doc).
  - **The starter pack**: a one-time, high-value "ice breaker". Players who buy early are more likely to buy again (whaling talk). Monetisation 101 says the first offer should "feel like a cup of coffee", a couple of dollars, and shown at a milestone 30–60 minutes in. Roblox's glossary defines a starter pack as an offer in the "first few minutes".
  - **Contextual offers**: the whaling talk's Hill Climb Racing example puts the upgrade store right after each race.
- Why it works: offers made when the player sees the value convert better and feel less pushy than pop-ups on first spawn.
- Backed by: #11, Monetisation 101, Monetization foundations doc and its DevForum playbook thread. Commenters there argued that discount maths and limited offers can mislead kids. The staff reply said the playbook teaches "how to count discounts properly".
- Apply in Roblox:
  - Starter pack: about 49–99 R$, sold as a developer product that records `starterPack = true`.
  - It contains an exclusive trail, about 1,000 coins and a 30-minute 2x boost.
  - Show it once, after the first real milestone (e.g. first upgrade or rebirth, about 10–15 minutes in), with a clear "No thanks". Afterwards it stays in the shop.
  - Use ProximityPrompt kiosks and a shop button.
- Watch out: no fake "90% OFF" labels and no expiring "today only" timers on a permanent item. The 2026 Sydney report flags exactly these.

### 7. Don't sell randomness (and know the paid random item rules if you ever do)
- What: a paid random item is any random outcome bought with Robux, or with in-game currency bought with Robux. That covers capsules (spins, eggs, chests), enhancements with a chance of working, combinations, and probability modifiers (luck potions, pity systems, rate-up scrolls). Putting a random item in a paid bundle makes the whole bundle one. The rules, per the docs updated 2026-11-06 and the DevForum clarification of May 26, 2026:
  - **Odds**: show odds for every outcome before purchase, as numeric percentages totalling 100%. A Details or Info popup is fine, a bare (i) icon is not. Nested loot must show the final odds. Every outcome must give something: no "lose your payment" result. Luck boosts must state their effect as numbers, and displayed odds must update live while the boost is active.
  - **Gating**: `PolicyService:GetPolicyInfoForPlayerAsync()` returns `ArePaidRandomItemsRestricted`. If it's true, give the user a compliant alternative: a free earnable path, fixed-order outcomes, a direct purchase, or hide the item.
  - **Trading**: `IsPaidItemTradingAllowed` gates trading, and is checked separately from buying.
  - **Regulated markets named**: Australia, Belgium, the Netherlands, the UK and Brazil. Roblox maintains the list.
  - **Testing and enforcement**: test with Studio's Player Emulator. Violations can mean game removal and account suspension.
  - **Exempt**: random rewards earned only through gameplay need no odds disclosure. Rewarded ad rewards can never be random.
- Why it works: this is the rule set most likely to get a new game moderated. It's also the main thing the CORSO and Sydney critiques attack.
- Backed by: paid random items doc, DevForum "Clarifying Requirements for Paid Random Items" (2026), #15.
- Apply in Roblox:
  - Keep two currencies apart: earned-only "Coins", and no Robux-bought currency at launch.
  - Any egg or chest costs earned Coins only. Show its odds anyway (good practice).
  - Never sell Coin packs while Coin-priced eggs exist. Selling them would make every egg a paid random item.
  - Still add the `PolicyService` check now, so a later change can't slip in ungated.
- Watch out: random-duration potions and "chance to upgrade" buttons count as paid random items too.

### 8. Rewarded video ads: small, opt-in, never for under-13s
- What: the player chooses to watch a video and gets a developer product. Creators earn by EPM (earnings per 1,000 impressions).
- Eligibility:
  - Publisher: 13+, ID-verified, two-step verification on, account in good standing.
  - Game: public and unrestricted, no free-form user creation, maturity questionnaire approved, average **2,000+ unique visitors a month**.
- Rewards:
  - must be a developer product you also sell in the shop, created in the same universe;
  - can't be random;
  - should be worth about **3–10 Robux**;
  - should be granted right after the ad finishes, via ProcessReceipt.
- Ad policy changes (DevForum, March 2026):
  - From May 4, 2026, rewarded formats are prohibited for under-13 users, and independent rewarded-video setups are banned in favour of Roblox's native format.
  - Brand deals ("Advertising Integrations") must be registered in Ads Manager.
  - From 2027 a fee applies to brand deals, charged per 1,000 qualified visits.
- Why it works: it earns from players who'll never pay, without hurting balance, as long as the reward is small and the video is truly optional.
- Backed by: Roblox rewarded video ads guide, AdService reference, "New Advertising Policies & Standards" DevForum post. #19 (SmartyRBX promotion, title-only) is adjacent.
- Apply in Roblox:
  - `AdService:GetAdAvailabilityNowAsync()` decides whether to show the button.
  - On the server, `AdService:CreateAdRewardFromDevProductId(id)` builds the reward and `AdService:ShowRewardedVideoAdAsync(player, reward)` plays the ad.
  - Grant in the same ProcessReceipt as technique 1.
  - Place it at natural breaks, such as in the lobby after a round or when a run ends (the guide's examples: finishing a level, running out of lives). Never make it a progression gate.
  - Turn on the option to exclude your likeliest buyers if ads cannibalise sales.
- Watch out:
  - Never promise "free Robux".
  - Ads must not cover the screen or block play.
  - Keep reward value below the cheapest paid item so buyers don't feel cheated.

### 9. Recurring revenue later: season pass and a supporter subscription
- What: a season pass is a limited-time, quest-based track. The free track is something like advanced daily quests. The premium track is a superset of it, with more rewards. A subscription sells monthly perks.
- Why it works: it rewards playing the core loop instead of shortcutting it. Monetisation 101 says a pass can "feel earned, not bought" and that "a $3/month item seems a lot more preferable than a $20 one off purchase".
- Backed by: Roblox Monetization foundations (season passes), subscriptions doc, Monetisation 101. A DevForum commenter called season passes "a bit manipulative" because of FOMO.
- Apply in Roblox:
  - Add these after launch, once there's steady content.
  - Space rewards to the average session length. Show the XP needed per level and the time left in the season.
  - A "Supporter Club" at $2.99/month or 149 R$/month could include a monthly exclusive cosmetic, a nameplate and a daily earned-currency bonus.
- Watch out: don't make season exclusives the only way to get power items, and don't re-release "last chance" pressure every week.

### 10. Price optimization and personalization (build for it now, use it at scale)
- What: Managed Pricing combines regional pricing with price optimization. Price tests:
  - split users 98% test / 2% control and run about 3 weeks;
  - repeat at least every 90 days;
  - are applied only if they add revenue;
  - need about **60,000 transactions in 30 days**;
  - cover passes and developer products, not subscriptions.
- Why it works: Roblox sets prices from real conversion data, so you don't have to guess.
- Backed by: price optimization doc, passes doc. `RankProductsAsync` has a strict rate limit, so call it once at join. `RecommendTopProductsAsync` returns up to 50 items, needs sales in the past 28 days, and skips passes the player already owns.
- Apply in Roblox:
  - The starter game won't qualify, but its code must not block optimization later. Read every price at runtime, never hard-code it. Run price scripts on the client so players see their personal price.
  - Use the Dynamic Price Check tool to find hard-coded prices.
- Watch out: you can't change prices during an active test, and stopping a test reverts them.

### 11. UGC and avatar items: commissions from in-game sales
- What:
  - When avatar items sell inside your game (Avatar Inspect Menu, AvatarEditorService, or MarketplaceService), the item's creator gets 30% and **the game owner gets 40%**.
  - Making your own UGC costs an 80 R$ upload fee (500 R$ if it uses an emissive mask) plus a refundable publishing advance (e.g. Hat 1,500 R$, Body 2,500 R$) and requires ID verification.
  - Marketplace sales use a progressive share: 30% at the price floor, up to 70% at 10x the floor.
  - Earnings have a 30-day escrow.
- Why it works: avatar sales from your players earn you money without new gameplay content.
- Backed by: Marketplace fees and commissions doc, monetization overview. #3 (gubs) and #5 (SmartyRBX) cover UGC-style income (title-only, inferred from their titles).
- Apply in Roblox: add an avatar inspect or try-on corner in the lobby. Later, sell one themed accessory matching the game's look.
- Watch out: UGC copying other brands or creators breaks IP rules and the Community Standards.

### 12. Know the cash math (DevEx) and set realistic expectations
- What: per the official DevEx page:
  - **$0.0038 per Earned Robux**, so 30,000 R$ = $114. This rate applies from Sept 5, 2025.
  - The legacy $0.0035 rate covers older balances, which are cashed out first.
  - The **U.S. 18+ rate is $0.0054** for eligible purchases by age-verified U.S. adults in eligible games. Player characters must use a standard or higher-fidelity (R15-class) rig 100% of the time, and any R6 option makes a game ineligible.
  - Cash-out needs 30,000 Earned Robux, age 13+, a verified email and a W-9 or W-8 tax form.
- Why it works: a 199 R$ pass earns you about 139 R$ (70%), which is about $0.53. You need a lot of players before cash-out matters, so build for retention first.
- Backed by: DevEx doc, U.S. 18+ rate doc. #1 (TEG), #7 (Blake Dev), #12 (janisjanis01) and #13 (VuukStudios) all promise earnings figures (title-only).
- Apply in Roblox: use R15 avatars from day one to keep the 18+ rate possible. Tag purchases with AnalyticsService economy events (`LogEconomyEvent`) to see what actually sells.
- Watch out: "10M Robux with AI and no scripting" headlines (#1) are survivorship stories, not a plan.

## Recommended ethical setup for the original starter game
- **Free core**: the whole game can be played and finished free. Coins are earned only, and none are sold at launch. Any egg or chest uses Coins only and shows its odds anyway.
- **Passes**:
  - Trail Pack: 49–99 R$.
  - Auto-Collect: 99–149 R$.
  - +Slots: 99 R$.
  - VIP (lounge, tag, cosmetic, +10% coins): 199 R$.
  - 2x Coins: 249–299 R$, PvE only.
- **Developer products**:
  - 15-minute 2x boost: 25–49 R$.
  - Starter Pack: 49–99 R$, offered once after the first milestone, with "No thanks" always visible.
  - Tip jar via Robux transfers: 10–500 R$.
- **Engagement income**:
  - Paid private servers on, at a modest monthly price.
  - A passive Roblox Plus button in the shop.
  - A first session designed to pass 10 minutes, for Creator Rewards.
- **Ads**: rewarded video, only after the game reaches 2,000+ monthly visitors. Reward the same 15-minute boost product. Check `GetAdAvailabilityNowAsync` (Roblox blocks under-13s). No brand deals until you understand the Ads Manager rules.
- **Code guardrails**:
  - Only one `ProcessReceipt`, idempotent on `PurchaseId`, saving before granting.
  - Pass perks restored on join.
  - No hard-coded prices.
  - The `PolicyService` check added now.
  - R15 rig.
- **Honesty rules**:
  - Prices shown in Robux.
  - No countdown timers or fake "was" prices.
  - No offer on first spawn, at most one unprompted offer per session.
  - Nothing sold that fixes a loss or wins PvP.
  - No "free Robux" language.
- **Later**: a season pass with a strong free track and a $2.99 Supporter Club. Price optimization once the game reaches about 60k transactions a month.

## Video by video
| # | Video | What it teaches | Evidence |
|---|---|---|---|
| 1 | My AI Roblox Game Made 10,000,000 ROBUX.. (TEG) | Likely angle (inference): an AI-assisted, no-script game earning through passes. The snippet says "without making a Single SCRIPT". | title-only |
| 2 | How free games are designed to make money (Vox) | F2P sells items at points in the game, makes spending easy while some play is "frustratingly difficult" unless you pay, targets rare "whales", and uses behavioural psychology. | content (secondary: search excerpts of 2016 press coverage, e.g. [Lifehacker AU](https://www.lifehacker.com.au/?p=739639); I couldn't open the article itself) |
| 3 | I Tested Every Way of Making Robux on Roblox (gubs) | Likely angle (inference): a side-by-side test of Robux-earning methods (games, UGC, etc.). Credits @bloxyrbx and @ProjectSupreme for the ideas. | title-only |
| 4 | Top 5 Ways to MONETIZE Your Roblox Game! (RoBuilder) | Likely angle (inference): an overview of passes, products and similar. The top hit for 4 of the 5 queries. | title-only |
| 5 | 6 Ways to Make REAL Money on Roblox (SmartyRBX) | Likely angle (inference): income routes beyond your own game (UGC, assets, commissions). Only an AI-summary page was found, which the brief bars, so it wasn't used. | title-only |
| 6 | 4 Ways to Earn REAL Money With Roblox Development (SmartyRBX) | Likely angle (inference): the developer-side version of #5. | title-only |
| 7 | How Much Money Do Roblox Developers Make? (Blake Dev) | Likely angle (inference): top-developer earnings figures. The DevEx math in technique 12 puts any such figures in context. | title-only |
| 8 | My Roblox Game Made $43,292 (MoseyTube77) | The snippet says it breaks down "what developer products sold the most, why they sold". The contents couldn't be found in writing. | title-only |
| 9 | Doing Free to Play Wrong (Extra Credits) | Pay walls and pay-to-win put profit before design. EC's 2014 F2P episode argues that squeezing top spenders "drives away most of their players". This may be the same video retitled, but that's unconfirmed. | creator ([TheTVDB EC episode](https://www.thetvdb.com/series/extra-credits/episodes/4996720), [2014 blog response](https://devwiththehair-devwiththe.squarespace.com/blog/2014/4/10/doing-free-to-play-the-wrong-wayand-the-right-way)) |
| 10 | How to MONETIZE your ROBLOX GAME to EARN ROBUX (Abstro) | Likely angle (inference): a beginner pass and product setup. The channel sells templates. | title-only |
| 11 | Let's go whaling (PocketGamerbiz, Torulf Jernström) | Convenience outsells cosmetics. Covers ice-breaker offers, Hook/Habit/Hobby, anchoring, choice overload, putting the store in the loop, and that whales convert late. It also lists the manipulative tricks openly. | content ([speaker's article of the same name](https://www.pocketgamer.biz/monetisation-lets-go-whaling/)) |
| 12 | How Much Money Roblox Developers Make? (janisjanis01) | Likely angle (inference): a developer's own earnings experience. | title-only |
| 13 | How Much Money Does a Roblox Game Actually Make? (VuukStudios) | Likely angle (inference): revenue per player math. The channel sells a course. | title-only |
| 14 | Roblox Game Monetization Explained Like You're 5 (Tizzy RBLX) | Likely angle (inference): a plain-language intro to passes and products. | title-only |
| 15 | The Gross Monetization of Roblox's Tower Defense Games (CORSO) | Critique of gambling and pay-to-win in Roblox TD games. Likely angle (inference): paid unit summons (gacha) and power gaps. For the current rules see technique 7. | title-only |
| 16 | How To Publish A Roblox Game - 2026 Updated (GuideRealm) | Off-topic (a publishing how-to), though passes can only be created after publishing. | title-only |
| 17 | 4 Ways to Earn REAL MONEY from Roblox Games (AlvinBlox) | The snippet says it covers methods "from freelance commissions to" others. | title-only |
| 18 | Flying Carpet Gamepass - Roblox Scripting Tutorial (Squidingz) | Likely angle (inference): scripting a pass perk. For the correct ownership pattern see technique 1. | title-only |
| 19 | 3 Ways To Promote Your Roblox Game WITHOUT Robux or Ads (SmartyRBX) | Mostly off-topic (promotion), but traffic drives Creator Rewards and ad eligibility. | title-only |
| 20 | MONETIZANDO UN JUEGO DE ROBLOX COMO UN PRO (DEValen) | Likely angle (inference): monetizing the creator's "Don't Touch The Lava" obby (Spanish). | title-only |

## Sources
- Roblox monetization overview: https://create.roblox.com/docs/production/monetization
- Creator Rewards: https://create.roblox.com/docs/en-us/creator-rewards.md
- Developer products: https://create.roblox.com/docs/production/monetization/developer-products
- MarketplaceService reference (ProcessReceipt sample): https://create.roblox.com/docs/reference/engine/classes/MarketplaceService
- Passes: https://create.roblox.com/docs/en-us/production/monetization/passes.md
- Subscriptions: https://create.roblox.com/docs/en-us/production/monetization/subscriptions.md
- Roblox Plus (creator earnings): https://create.roblox.com/docs/en-us/production/monetization/roblox-plus.md
- Roblox Plus launch release: https://www.businesswire.com/news/home/20260410099173/en
- Paid random items: https://create.roblox.com/docs/en-us/production/monetization/paid-random-items.md
- Clarifying Requirements for Paid Random Items (May 2026): https://devforum.roblox.com/t/clarifying-requirements-for-paid-random-items/4654622
- Rewarded video ads: https://create.roblox.com/docs/en-us/production/promotion/rewarded-video-ads
- AdService reference: https://create.roblox.com/docs/en-us/reference/engine/classes/AdService
- Immersive ads: https://create.roblox.com/docs/en-us/production/monetization/immersive-ads
- New Advertising Policies & Standards (March 2026): https://devforum.roblox.com/t/new-advertising-policies-standards/4527365
- Price optimization: https://create.roblox.com/docs/en-us/production/monetization/price-optimization.md
- Developer Exchange: https://create.roblox.com/docs/en-us/production/monetization/developer-exchange.md
- U.S. 18+ DevEx rate: https://create.roblox.com/docs/en-us/production/monetization/18-plus-devex-rate
- Marketplace fees and commissions: https://create.roblox.com/docs/en-us/marketplace/marketplace-fees-and-commissions.md
- Monetization foundations: https://create.roblox.com/docs/en-us/production/game-design/monetization-foundations.md
- Monetization Foundations playbook thread: https://devforum.roblox.com/t/monetization-foundations-playbook/2569495
- Monetisation 101 (DevForum, 2019): https://devforum.roblox.com/t/monetisation-101-how-to-effectively-generate-revenue-in-your-roblox-game/246902
- Community Standards: https://about.roblox.com/community-standards
- Advertising Standards: https://en.help.roblox.com/hc/en-us/articles/13722260778260-Advertising-Standards
- Commerce Standards: https://en.help.roblox.com/hc/en-us/articles/36495190721172-Commerce-Standards
- Jernström, "Let's go whaling": https://www.pocketgamer.biz/monetisation-lets-go-whaling/
- Jernström author page: https://www.pocketgamer.biz/people/897/torulf-jernstrm/
- Extra Credits, "Free to Play Is Currently Broken" (TheTVDB): https://www.thetvdb.com/series/extra-credits/episodes/4996720
- 2014 blog on the EC F2P video: https://devwiththehair-devwiththe.squarespace.com/blog/2014/4/10/doing-free-to-play-the-wrong-wayand-the-right-way
- Vox video coverage (search excerpt only): https://www.lifehacker.com.au/?p=739639
- University of Sydney 2026 report coverage: https://www.sydney.edu.au/news-opinion/news/2026/05/17/inside-the-pay-to-play-world-of-roblox-targeting-children-.html
- University of Sydney 2025 study: https://sydney.edu.au/news-opinion/news/2025/03/24/literally-just-child-gambling-study-urges-swift-regulation-of-roblox.html
- GamesRadar on Grow a Garden (headline only): https://www.gamesradar.com/games/simulation/former-square-enix-exec-says-viral-roblox-hit-grow-a-garden-is-somewhat-evil-do-you-wanna-pay-to-grow-this-faster-do-you-wanna-pay-to-steal-this-from-someones-garden
