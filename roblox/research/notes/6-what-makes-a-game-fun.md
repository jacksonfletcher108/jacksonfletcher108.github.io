# What makes a game fun: what the top 20 videos teach

Evidence note: YouTube transcripts were not available, so these notes rely on written sources. Of the 20 videos, 1 has a written description of its content (Riot), 3 have the creator's written take or a write-up of a related talk (Thomas Brush x2, Ian Bogost), and 16 are title-only. Most of the substance comes from the books and talks these videos build on: Raph Koster's *A Theory of Fun*, "Juice It or Lose It", "The Art of Screenshake", Self-Determination Theory research, Jenova Chen's flow thesis, Sid Meier's "Interesting Decisions" talk and Nicole Lazzaro's Four Keys. It also draws on Roblox's official Creator Hub game-design docs. Wherever a number below has no source, it is a suggested starting value to tune, not a quote.

## The 10-second version
- **Feedback first.** Every core action needs a layered, satisfying reaction: sound, particles, a number pop-up, squash and stretch, and screen shake for big moments. That is the cheapest way to make a Roblox game feel fun, but juice cannot rescue a boring loop.
- **Fun is learning.** Players enjoy mastering patterns and get bored once a pattern is mastered. Keep introducing one new thing at a time, then combine it with what they already know. Keep the challenge just above their current skill (flow).
- **Feed the three needs.** These are autonomy (real choices), competence (clear mastery and readable feedback) and relatedness (playing with friends). Roblox's own docs say single-player games struggle on the platform and that games which get players "into the fun quickly" do better.
- **Make choices and combinations matter.** Use trade-offs (Sid Meier) and synergies, where two elements combined are worth more than the sum of their parts. Add variety and surprise so players never do the same interesting thing ten times.
- **Find the fun before you polish.** Prototype the core action, watch real players, and cut anything that isn't fun. Never "play the player for money" (Koster), especially with a young audience.

## Techniques (ranked: most useful for a Roblox game first)

### 1. Juice every core action (layered feedback)
- What: Make each player input produce an immediate, exaggerated, multi-sensory reaction. Layer small effects; no single one is impressive, but the stack transforms how the game feels.
- Why it works: Feedback tells players "you did that, and it mattered" (competence), and it makes even a trivial verb pleasurable. In the "Juice It or Lose It" talk, Jonasson and Purho turn a plain Breakout clone into something exciting without adding mechanics. Their layers were color, tweening/easing, squash and stretch, sound, music, many particles, screen shake, eyes on everything, more action, an environment that reacts to music, and screen flashes. Nijman's "Art of Screenshake" lists 30 steps, including impact effects, hit animation, knockback, camera kick, "sleep" (micro-pauses), permanence (debris stays), more bass, and finally "meaning" (let the player win or lose).
- Backed by: #2 Jonas Tyroller's button video (title-only). Its description promises "the three fundamentals of fun" and asks why pressing buttons is fun; an r/gamedev post calls it a video on "the fundamentals of creating fun from scratch"; and an itch.io game, *One More Press*, was built in response, focusing "entirely on the button". #8 Jonas Tyroller's "2X as fun" video (title-only). #3/#20 Thomas Brush (creator-indirect: a write-up of a Brush workshop says "every action should have a reaction", with screen shake, sound, particles, hit feedback, a slight delay before impact, faster animations, squash and stretch, and "add juice early"). DevForum "Game Design 101" (feedback pillar: hit markers; a weapon with no hit confirmation is bad design). Sources: [GDC Vault: Juice It or Lose It](https://gdcvault.com/play/1016789/Juice-It-or-Lose), [RPG Playground summary of both talks](https://rpgplayground.com/research-making-a-juicy-game/).
- Apply in Roblox:
  - **Run cosmetic effects on the client.** The server validates the action (a hit or a pickup), then sends an `UnreliableRemoteEvent` to nearby clients. Losing one is fine for cosmetics. The acting player's own client plays the effect immediately, so there is no lag.
  - **Build one "hit/collect" event, one layer at a time**, in this order: sound, particle burst, number pop-up, scale pop, then camera shake and hitstop for big moments only.
  - **Pitch-shifted sounds.** Set `Sound.PlaybackSpeed = 0.9 + math.random() * 0.2` on every play so repeats don't grate. For streaks, raise pitch per pickup (+0.05 per coin, capped at about 1.5, reset after about 1.5 s of idle time). That is the classic rising coin chime. Use `PitchShiftSoundEffect` to change pitch without changing speed. Layer a low thump with a bright sparkle. Preload with `ContentProvider:PreloadAsync`. Use `SoundService:PlayLocalSound` for UI clicks.
  - **Particle bursts.** Keep a `ParticleEmitter` with `Enabled = false` and call `:Emit(10)` for small events or `:Emit(30)` for big ones (Emit's default count is 16). Use a short `Lifetime` (0.3 to 0.8 s), a high `Speed` with a wide `SpreadAngle` for "pop", and `LightEmission` of about 0.5 to 1 for glow.
  - **Number pop-ups.** Use a `BillboardGui` (`AlwaysOnTop`) with a `TextLabel` and a `UIStroke`. Tween `StudsOffset` upward by 2 to 3 studs and `TextTransparency` to 1 over about 0.7 s (Quad, Out), and start a `UIScale` at 1.4, easing to 1 with Back easing. Bigger values get bigger text and hotter colors (white, then yellow, then orange). Clean up with `Debris:AddItem`.
  - **Squash and stretch.** For pickups, tween the object 1 → 1.25 → 0 over about 0.15 s (`TweenService`, or `Model:ScaleTo`). For buttons, set `UIScale` to 0.92 on press and spring back to 1 with `EasingStyle.Back`.
  - **Screen shake.** Client-side only. Offset `Humanoid.CameraOffset` (or the camera CFrame in a `RenderStepped` step) by random amounts. Start at about 0.1 to 0.5 studs and decay to 0 over 0.1 to 0.3 s. Scale it to how big the event is.
  - **Hitstop and flash.** On heavy hits, call `AnimationTrack:AdjustSpeed(0)` for 0.04 to 0.08 s, and tween a `Highlight` `FillTransparency` from 0.3 to 1. Add gamepad rumble with `HapticService:SetMotor`.
  - **Permanence.** Leave debris or decals for a few seconds so the world remembers what happened.
- Watch out:
  - Too much shake causes nausea. Respect the player's Reduce Motion setting (`GuiService.ReducedMotionEnabled`) and add your own toggle.
  - Cap simultaneous particles for low-end phones.
  - Match effect size to how important the event is.
  - Juice should support the game, not distract from it. A boring loop with juice is still boring.

### 2. Get players to the fun in seconds, and teach by doing
- What: The core action and its best feedback should happen within the first 30 to 60 seconds. Teach one verb at a time through play, not walls of text.
- Why it works: Roblox players can leave in one tap, and they learn patterns fastest by playing (Koster).
- Backed by: Roblox, [Design for Roblox](https://create.roblox.com/docs/production/game-design/design-for-roblox). It says first-time experiences "that get users into the fun quickly tend to do better", that long tutorials lose players, that visual onboarding works better, and that most users are on mobile, so design mobile-first. Also #3/#20 Brush (creator-indirect: "focus on the first 30 seconds") and the DevForum "Game Design 101" post (avoid wordy tutorials; release information gradually).
- Apply in Roblox:
  - Spawn players facing the core activity, with no menus first.
  - Use a `Beam` or arrow to point at the first goal, a `ProximityPrompt` for the first interaction, and a first reward within about 10 s.
  - Use mobile touch buttons via `ContextActionService:BindAction(..., true)`.
  - Instrument each step with `AnalyticsService:LogOnboardingFunnelStepEvent` to see where people drop off.
- Watch out: Don't show a shop or purchase prompt before the first fun moment. Don't neglect "tourists": the doc notes that most "locals" (regular players) start as tourists.

### 3. A clear core loop with goals at every time scale
- What: Every minute should have an obvious "what do I do next?" and a visible result.
- Why it works: Koster describes each game unit as a problem, a core mechanic, then feedback ("Then you get told how you did"). Riot's game-design episode stresses clear goals and creating opposition.
- Backed by: Roblox, [Core loops](https://create.roblox.com/docs/production/game-design/core-loops). The doc defines three parts (minute-to-minute interaction, the most-repeated action, and a progression engine) and warns: "Without a progression system, a game becomes repetitive, boring, and shallow." Also #10 Riot (content: fun, clear goals, opposition), [Game Developer on Koster](https://www.gamedeveloper.com/design/raph-koster-s-theory-of-fun-ten-years-on).
- Apply in Roblox:
  - Write the loop in one line, e.g. "explore, collect, upgrade, unlock the next zone".
  - Give players three goal horizons: the next 30 s (next pickup or enemy), the next 5 minutes (next upgrade) and the next session (next zone or badge).
  - Keep a progress bar to the next unlock always on screen.
  - Use `leaderstats` for visible numbers and `DataStoreService` to save progress. Use `BadgeService:AwardBadge` for milestones.
- Watch out: Progress bars on top of a dull action make a treadmill, not fun. Koster criticizes games that "play you — and plays you for money".

### 4. Fun is learning: keep serving new patterns, one at a time
- What: Fun is the brain mastering patterns. Once a pattern is mastered, it gets boring; too much novelty at once is "noise". Keep players at the edge.
- Why it works: Koster says fun happens when you are "bumping against the top of what you can do". Simple games such as Typing Shark and Bookworm switch from fun to unplayable as soon as they are mastered. He now calls learning and pattern recognition "gooey" ideas that overlap rather than "nice boxes".
- Backed by: #17 (summarizes Koster's book), [Engadget on Koster's 2012 keynote](https://www.engadget.com/2012-10-10-gdc-online-2012-raph-kosters-keynote-on-a-theory-of-fun-10-ye.html), [Game Developer](https://www.gamedeveloper.com/design/raph-koster-s-theory-of-fun-ten-years-on), the [Grand Text Auto review](https://grandtextauto.soe.ucsc.edu/?p=656) (fun is "the act of mastering a problem mentally"), and [PocketGamer](https://www.pocketgamer.biz/gdc-online-12-raph-kosters-thoughts-10-years-on-from-a-theory-of-fun). Probably also #1 and #5 (title-only).
- Apply in Roblox: Use an "introduce, test, twist, combine" pattern.
  - In an obby, each new stage adds one obstacle type (timed lava, a conveyor, disappearing tiles). The next stage tests it, then a later stage combines it with an earlier one.
  - New enemies get one new behavior each.
  - Aim for a new pattern every 5 to 10 minutes of play.
  - When analytics show almost everyone clears a section quickly, it has been mastered, so move on or remix it.
- Watch out: Never introduce three new things at once. Don't make the end of a session pure grinding of mastered content.

### 5. Flow: a sawtooth difficulty curve, pacing, and player-chosen challenge
- What: Match challenge to skill, rising in waves with breathers. Let players choose how hard to push.
- Why it works: Chen's *Flow in Games* thesis proposes player-centric dynamic difficulty, built through player choice (in *flOw*, players decide whether to dive deeper or retreat), to keep players between anxiety and boredom. The DevForum "Game Design 101" post says challenge counters players adapting to rewards. It also says to alternate intense moments with breaks, which multiplayer games do through map layout and respawn times. Sid Meier: too many complex decisions in a row makes players feel out of control, while too few makes them bored.
- Backed by: [Jenova Chen, Flow in Games abstract](https://jenovachen.info/abstract), [Engadget on the thesis](https://www.engadget.com/2006-09-12-flow-in-games-an-interactive-thesis-on-dynamic-difficulty.html), [DevForum Game Design 101](https://devforum.roblox.com/t/game-design-101-how-to-make-your-game-fun-enjoyable-and-replayable/1886641), [Sid Meier write-up](https://www.gamedeveloper.com/design/gdc-2012-sid-meier-on-how-to-see-games-as-sets-of-interesting-decisions), #10 Riot.
- Apply in Roblox:
  - **Sawtooth curve.** Ramp up over 3 to 5 stages or waves, then give an easier "reward" stage.
  - **Branching routes.** Offer a safe path and a hard path that pays 2x coins. That is difficulty players choose for themselves.
  - **Rounds.** Use 2 to 4 minute rounds with 15 to 20 s intermissions.
  - **Quiet help.** After 3 fails on the same section, show a hint or move a checkpoint closer.
  - **Find spikes.** Log fails with `AnalyticsService` progression events (e.g. `LogProgressionFailEvent`) or `LogCustomEvent` to locate difficulty spikes.
- Watch out: Selling "skip stage" developer products for a spike you designed in is a dark pattern for a young audience; fix the spike instead. Hidden difficulty adjustment that players notice feels unfair.

### 6. Satisfy autonomy, competence and relatedness (Self-Determination Theory)
- What: People keep playing what meets three needs: the feeling of choosing (autonomy), the feeling of getting better (competence) and connection to others (relatedness).
- Why it works: Across four studies, Ryan, Rigby and Przybylski (2006) found that perceived in-game autonomy and competence were linked to enjoyment, game preference and short-term well-being. In an online multiplayer community, autonomy, competence and relatedness each independently predicted enjoyment and future play. Intuitive controls fed competence and autonomy.
- Backed by: [ScienceDaily / University of Rochester release](https://www.sciencedaily.com/releases/2006/12/061226134706.htm), [the paper (PDF)](https://www.rochester.edu/warner/lida/wp-content/uploads/2022/11/02bfe513dd59366750000000.pdf). #1 My GameDev Pal's "Psychology in Gaming" video likely covers this (title-only inference).
- Apply in Roblox:
  - **Autonomy.** Offer two or more ways to progress (parkour route or collecting), free cosmetic choices, and a space players can decorate or build. Let them pick which goal to chase next.
  - **Competence.** Responsive controls, clear feedback (technique 1), a personal best time, an `OrderedDataStore` leaderboard, and badges for skill feats rather than just time played.
  - **Relatedness.** Co-op objectives, gifting, emotes, friends shown on leaderboards, and `SocialService:PromptGameInvite`.
- Watch out: Pay-to-win undermines competence. Nagging pop-ups and forced reward loops undermine autonomy.

### 7. Social fun: design for groups and mixed skill (party-game rules)
- What: On Roblox, fun is often hanging out with friends. Design so a group with different skill levels has a good time together.
- Why it works: Party games use simple controls "of any skill level", short rounds, and minigames. Player-to-player interaction is the "central gameplay element", and "winning matters less than having fun together". Jackbox calls its phone-as-controller approach "inclusivity through design". Lazzaro's "People Fun" is one of her four keys.
- Backed by: [Design for Roblox](https://create.roblox.com/docs/production/game-design/design-for-roblox). It says single-player games "often find it harder to build and retain an audience on Roblox", that younger players favor "exploration, experimentation, and socializing", that you should avoid costly private servers that discourage groups, and that you should design with streamers in mind (Brookhaven's UI-hiding "Creator Cam"). Also [Wikipedia: Party video game](https://en.wikipedia.org/wiki/Party_video_game) and SDT Study 4 (relatedness). #18 Skip the Tutorial (title-only; its snippet says multiplayer design is hard "when not everyone is at the same" skill level). #6 Extra Credits (title-only; asymmetric maps that "funnel players").
- Apply in Roblox:
  - **Round structure.** A round-based minigame lobby with 1 to 3 minute rounds and one- or two-button controls.
  - **Mixed skill (suggestions).** Random round modifiers, team rounds, participation points and catch-up bonuses for whoever is in last place.
  - **Co-op.** Tasks that need two players, such as two-plate doors or carrying a heavy object together.
  - **Spectating.** Spectate and cheer while dead.
  - **Streamers.** A "hide UI" toggle so players can record or stream cleanly.
  - **Small servers.** The game should still be fun with 2 to 4 players at launch.
- Watch out: Roblox restricts chat by age and age-check status, so social fun should not depend on chat. Use emotes, pings and quick-chat buttons. Add anti-griefing protection.

### 8. Meaningful choices (trade-offs, not "best buttons")
- What: A good decision has a cost, depends on the situation, expresses the player's style, has lasting effects, and gives the player enough information to choose well.
- Why it works: Sid Meier says "good decisions are situational", should "express your personal play style", and should come with trade-offs. Choices are not interesting if players always pick the first option, if the outcome is random, or if results are unclear, so err toward too much information. Bogost's *Play Anything* argues that limits, not ease, are what make play enjoyable.
- Backed by: [Sid Meier write-up](https://www.gamedeveloper.com/design/gdc-2012-sid-meier-on-how-to-see-games-as-sets-of-interesting-decisions). #13 Bogost (creator: his book; [review](https://www.washingtonindependentreviewofbooks.com/bookreview/play-anything-the-pleasure-of-limits-the-uses-of-boredom-and-the-secret-of)). #10 Riot (opposition).
- Apply in Roblox:
  - **Trade-off upgrades.** Speed vs. carry capacity vs. magnet range, with exact numbers shown in the UI.
  - **Per-round picks.** A role pick each round (scout, builder, defender).
  - **Situational value.** Map hazards change which upgrade is best.
  - **Rebalance from data.** Log picks with `AnalyticsService:LogCustomEvent`. If one option takes more than about 70% of picks, rebalance it.
- Watch out: Don't stack many complex choices back to back. Don't lock the interesting options behind Robux.

### 9. Synergies: combinations worth more than their parts
- What: Two or more elements whose combined value differs from the sum of their individual values. Discovering combos is creative self-expression.
- Why it works: Kritz and Gaina (2025) define synergy that way. They say it supports player creativity, self-expression and intrinsic motivation, and that some players seek it out specifically. They also warn that balancing gets hard because combinations grow exponentially. They cite Game Maker's Toolkit's "How Synergies Make Slay the Spire Fun" as an example.
- Backed by: [arXiv: When 1+1 does not equal 2: Synergy in games](https://arxiv.org/html/2502.10304v1), plus Sid Meier on personal style. None of the 20 videos is confirmed to cover synergies.
- Apply in Roblox:
  - **Small tagged system.** Start with a few elements (e.g. fire, ice, wind, electric) using `CollectionService` tags or `Instance:SetAttribute`.
  - **Pair rules.** Wet + electric = chain stun; wind + fire = a spreading fire.
  - **Run perks.** Perks with tags, where 3 of the same tag unlock a bonus.
  - **Team roles.** One player freezes and another shatters for bonus damage.
  - **Highlight combos.** Give every synergy trigger a unique sound, color and pop-up text ("COMBO!") so players notice they found something.
- Watch out: Start with 6 to 10 elements. Rate combos on a simple tier scale (the paper suggests "cold to hot") and watch for one dominant combo.

### 10. Variety and surprise: mix the four kinds of fun
- What: Mix Hard Fun (challenge and mastery), Easy Fun (curiosity and exploration), Serious Fun (meaning, changing how you feel) and People Fun (social). Add unpredictable events.
- Why it works: Lazzaro's research says players move between these within one session, and that bestselling games tend to have three of the four. Meier: "something that's interesting you do once doesn't mean it's something interesting to do ten times." The DevForum post points to Left 4 Dead 2's Director, which varies layouts, enemy counts and item drops each session.
- Backed by: [Lazzaro, Game Usability ch. 20 (PDF)](https://edisciplinas.usp.br/pluginfile.php/7739573/mod_resource/content/1/Game_Usability_2008_cap20_Nicole_Lazzaro.pdf), [Big Think interview](https://bigthink.com/videos/big-think-interview-with-nicole-lazzaro/), [Escapist on Meier](https://www.escapistmagazine.com/v2/gdc-2012-sid-meier-sees-interesting-decisions-even-in-rhythm-games/), [DevForum Game Design 101](https://devforum.roblox.com/t/game-design-101-how-to-make-your-game-fun-enjoyable-and-replayable/1886641). #6 and #9 (title-only).
- Apply in Roblox:
  - **Server events.** Every 8 to 15 minutes, run an event such as a meteor shower, a golden enemy or coin rain. Announce it with a banner, a sting sound and a `Lighting`/`Atmosphere` shift.
  - **Rotation.** Rotate maps and modes.
  - **Secrets.** Hide secret rooms with hidden badges for Easy Fun.
  - **Free surprises.** Rare cosmetic drops earned through play.
- Watch out: Randomness must not remove agency. Never monetize surprise for kids. Roblox has rules on paid random items (odds disclosure, and they have tightened over time), so check the current Creator Hub and Community Standards before selling anything random.

### 11. Find the fun first, then polish: prototype and playtest
- What: Make the core action fun in a gray box before adding content. Watch real players; cut what doesn't add fun.
- Why it works: "Juice It or Lose It" started from a deliberately boring game. The DevForum post says to test with genuine play sessions and "Don't add stuff purely for the sake of adding stuff". A Reddit discussion of Jonas Tyroller's design-process video summarizes his approach as treating design as a "search" for the right design (creator-adjacent; seen only as a search snippet).
- Backed by: [DevForum Game Design 101](https://devforum.roblox.com/t/game-design-101-how-to-make-your-game-fun-enjoyable-and-replayable/1886641), [Roblox game design index (Prototyping)](https://create.roblox.com/docs/production/game-design), #3/#20 Brush ("add juice early", creator-indirect).
- Apply in Roblox:
  - Build a one-day graybox with Parts and test it with 3 to 5 friends in Studio Team Test.
  - Note where they laugh, replay or quit.
  - Change one thing per test round.
  - Track replays per session with `AnalyticsService:LogCustomEvent`.
- Watch out: Friends are polite, so trust what they do over what they say. Don't build ten zones on an unproven loop.

## Video by video
| # | Video | What it teaches | Evidence |
|---|---|---|---|
| 1 | What Makes Games FUN (Psychology in Gaming), My GameDev Pal | Likely angle (inference): psychological models of fun such as SDT, flow and reward. | title-only |
| 2 | Can We Make This Button Fun To Press?, Jonas Tyroller | Its description promises "the three fundamentals of fun" and uses one button as the test case. The three are not confirmed in writing. | title-only (corroborated: [r/gamedev post](https://www.reddit.com/r/gamedev/comments/g1fm3w/how_to_make_a_button_fun_to_press/), seen only as a search snippet; [One More Press](https://safetydad.itch.io/one-more-press), "inspired by Jonas Tyroller's video") |
| 3 | The Trick To Instantly Make Your Game FUN, Thomas Brush | "6 things" for new devs. Brush's related workshop pushes juice: every action gets a reaction, an anticipation delay, faster animation, squash and stretch, juice early, and the first 30 seconds. | creator-indirect ([write-up of a different Brush workshop](https://multigamedev.blogspot.com/2026/03/how-to-make-your-game-10x-more-fun.html)) |
| 4 | How do Game Designers make their games FUN?, Sasquatch B Studios | Likely angle (inference): an indie dev's practical approach to finding the fun. | title-only |
| 5 | What is Fun? A Game Design Introduction, Indie Game Clinic | Likely angle (inference): defining fun from first principles (30-min intro). | title-only |
| 6 | Overwatch and Asymmetric Level Design, Extra Credits | Asymmetric maps that still "funnel players" (snippet). Level design rather than fun in general, but relevant to variety. | title-only ([TheTVDB listing](https://thetvdb.com/series/extra-credits/episodes/5801467)) |
| 7 | I Played 1 Addictive Roblox Game from EVERY YEAR, Laughability | Off-topic: an entertainment playthrough, not design advice. It may show which Roblox genres hooked players each year. | title-only |
| 8 | How to make your game 2X as fun! (In No Time.), Jonas Tyroller | "A couple of effective tricks" (snippet). Likely angle (inference): quick feel and polish wins. | title-only |
| 9 | How Can You Make Backtracking Fun?, Design Doc | Likely angle (inference): making revisits rewarding through new abilities, shortcuts and changed areas. | title-only |
| 10 | So You Wanna Make Games?? Ep. 10: Game Design, Riot Games | Understanding "fun", setting clear goals, creating opposition, and how design choices set theme and tone even without art. | content ([Riot page](https://www.riotgames.com/en/artedu/game-design), [Sheroes in Games wiki](https://sheroesingames.unq.edu.ar/wiki/index.php/Concepts_to_be_considered_when_developing_a_video_game,_by_Riot_Games_(Video))) |
| 11 | The Secret To Making Your Roblox Game FUN!, SmartyRBX | A 3-minute Roblox-specific tip. The "secret" could not be found in writing. | title-only |
| 12 | Games That Make Stealing Fun, Design Doc | Likely angle (inference): risk/reward and tension in stealing mechanics. | title-only |
| 13 | WIRED by Design: the Counterintuitive Secret to Fun, Ian Bogost | Bogost's position (from his book *Play Anything*): fun comes from limits and effort, not ease; "fun is the opposite of happiness" (review). | creator ([book review](https://www.washingtonindependentreviewofbooks.com/bookreview/play-anything-the-pleasure-of-limits-the-uses-of-boredom-and-the-secret-of)) |
| 14 | How to make an ADDICTIVE game?, VAV | Likely angle (inference): reward loops and habit hooks. Treat "addictive" framing with caution for kids. | title-only |
| 15 | How to instantly increase your game's fun, BiteMe Games | Likely angle (inference): quick polish and feel improvements. | title-only |
| 16 | How To Make a Viral Roblox Game with NO ROBUX, Cencu | Likely angle (inference): shareable concepts and free promotion. Roblox docs say many players arrive via YouTubers and streamers. | title-only |
| 17 | A Theory of Fun for Game Design, The Game Overanalyser | Summarizes Koster's book: fun is learning and mastering patterns; boredom comes once a pattern is mastered. | title-only for the video; book covered via [Engadget](https://www.engadget.com/2012-10-10-gdc-online-2012-raph-kosters-keynote-on-a-theory-of-fun-10-ye.html) and [Game Developer](https://www.gamedeveloper.com/design/raph-koster-s-theory-of-fun-ten-years-on) |
| 18 | How Party Games Design for Everyone to Have Fun, Skip the Tutorial | Designing multiplayer fun when players have different skill levels (snippet). | title-only (topic backed by [Wikipedia: Party video game](https://en.wikipedia.org/wiki/Party_video_game)) |
| 19 | What makes autobattlers fun?, Savallion | Likely angle (inference): drafting, synergies between units, and low-execution strategy. | title-only |
| 20 | The Secret Trick To Instantly Make Your Game FUN, Thomas Brush | "8 things" version of #3. Same juice and first-impression themes. | creator-indirect (same write-up as #3) |

Roblox-specific videos (#7, #11, #16): no written content was found for any of them. What Roblox itself says makes a Roblox game fun comes from the Creator Hub instead: get players into the fun quickly, design for socializing and friends, design mobile-first, design for streamers, and remember younger players care more about "having a good time" than visual fidelity.

## Sources
Pages fetched and read:
- https://create.roblox.com/docs/production/game-design
- https://create.roblox.com/docs/production/game-design/design-for-roblox
- https://create.roblox.com/docs/production/game-design/core-loops
- https://create.roblox.com/docs/reference/engine/classes/ParticleEmitter
- https://devforum.roblox.com/t/game-design-101-how-to-make-your-game-fun-enjoyable-and-replayable/1886641
- https://rpgplayground.com/research-making-a-juicy-game/
- https://www.engadget.com/2012-10-10-gdc-online-2012-raph-kosters-keynote-on-a-theory-of-fun-10-ye.html
- https://www.gamedeveloper.com/design/raph-koster-s-theory-of-fun-ten-years-on
- https://www.raphkoster.com/games/presentations/revisiting-fun-20-years-of-a-theory-of-fun/
- https://www.gamedeveloper.com/design/gdc-2012-sid-meier-on-how-to-see-games-as-sets-of-interesting-decisions
- https://arxiv.org/html/2502.10304v1
- https://en.wikipedia.org/wiki/Party_video_game
- https://www.riotgames.com/en/artedu/game-design
- https://sheroesingames.unq.edu.ar/wiki/index.php/Concepts_to_be_considered_when_developing_a_video_game,_by_Riot_Games_(Video)
- https://multigamedev.blogspot.com/2026/03/how-to-make-your-game-10x-more-fun.html
- https://safetydad.itch.io/one-more-press
- https://tyrollerjonas.podbean.com/ (Jonas Tyroller's podcast; nothing directly on these two videos)

Seen only through search-result snippets (the page itself was not read in full):
- https://gdcvault.com/play/1016789/Juice-It-or-Lose
- https://www.raphkoster.com/wp-content/uploads/2026/07/Theory-of-Fun-10-Years-Later.pdf (too large to fetch)
- https://grandtextauto.soe.ucsc.edu/?p=656
- https://www.pocketgamer.biz/gdc-online-12-raph-kosters-thoughts-10-years-on-from-a-theory-of-fun
- https://www.sciencedaily.com/releases/2006/12/061226134706.htm
- https://www.rochester.edu/warner/lida/wp-content/uploads/2022/11/02bfe513dd59366750000000.pdf
- https://jenovachen.info/abstract
- https://www.engadget.com/2006-09-12-flow-in-games-an-interactive-thesis-on-dynamic-difficulty.html
- https://www.escapistmagazine.com/v2/gdc-2012-sid-meier-sees-interesting-decisions-even-in-rhythm-games/
- https://edisciplinas.usp.br/pluginfile.php/7739573/mod_resource/content/1/Game_Usability_2008_cap20_Nicole_Lazzaro.pdf
- https://bigthink.com/videos/big-think-interview-with-nicole-lazzaro/
- https://www.washingtonindependentreviewofbooks.com/bookreview/play-anything-the-pleasure-of-limits-the-uses-of-boredom-and-the-secret-of
- https://www.reddit.com/r/gamedev/comments/g1fm3w/how_to_make_a_button_fun_to_press/
- https://www.reddit.com/r/gamedesign/comments/1b08jlb/ (discussion of Jonas Tyroller's design-process video)
- https://thetvdb.com/series/extra-credits/episodes/5801467

Deliberately not used: third-party AI-summary and transcript sites that appeared in search results (e.g. recapio, sozai.app, rosetta.to), per the brief.
