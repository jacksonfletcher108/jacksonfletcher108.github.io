# UI design: what the top 20 videos teach

Research date: 2026-11-09. Video transcripts could not be fetched (YouTube blocks this server), so most of the evidence comes from Roblox's official Creator Hub docs, Roblox DevForum write-ups, and the creators' own written material. Each video's evidence level is in the "Video by video" table. Most of the Roblox tutorial videos are **title-only**. The techniques below lean on the official docs and DevForum sources, and say so where they do.

## The 10-second version
- **Build for phones first.** About 80% of Roblox daily users are on mobile. Size and position with Scale, use AnchorPoint and UIAspectRatioConstraint, keep the thumbstick, jump and top-bar zones clear, and make touch targets at least 9x9 mm (Roblox's own curriculum, citing WCAG).
- **A minimal HUD with a clear hierarchy.** Show only what the player needs right now. Group by category and make the primary action the biggest thing on screen. Roblox's docs and Riot both say good UI goes unnoticed.
- **The "cartoony" look is a repeatable recipe:** a bold rounded font (Fredoka One or Luckiest Guy), thick dark UIStroke (which now scales via `StrokeSizingMode.ScaledSize`), UICorner, a subtle top-to-bottom UIGradient, an offset drop shadow, and optionally a tiled stud texture.
- **Every press gets feedback.** Use a quick UIScale tween on hover/press plus a click sound. Use `Activated`, which fires for click and tap, and respect `GuiService.ReducedMotionEnabled`.
- **Consistency and accessibility are cheap wins.** Use one font family and fixed color meanings (green = health, red = can't afford, red X top-right = close). Pair colors with icons, keep MinTextSize at 9 or above, and honor `PreferredTextSize`/`PreferredTransparency`.

## Techniques (ranked: most useful for a Roblox game first)

### 1. Mobile-first layout: Scale, AnchorPoint and aspect-ratio locks
- What: Size and position almost everything in Scale (a percentage of the parent), not Offset (pixels). Set AnchorPoint to the edge or center the element hangs from, and lock shapes with UIAspectRatioConstraint so nothing stretches between a phone and a monitor.
- Why it works: Roblox runs on screens from small phones to 4K TVs. Scale UI keeps its proportions, and Offset UI ends up tiny on tablets and huge on phones. Roblox's laser-tag sample game positions and sizes "almost all" elements in Scale (e.g. Objective Size `{0.5,0},{0.13,0}`, Position `{0.5,0},{0.03,0}`, AnchorPoint `0.5,0`).
- Backed by: #8 Kek "Ultimate Beginner's Guide" (snippet: "Scaling vs Offset"); #2, #20 Kingkade 3D (title-only); official [position and size / cross-platform design](https://create.roblox.com/docs/ui/cross-platform-design), [size modifiers](https://create.roblox.com/docs/ui/size-modifiers), [implement designs in Studio](https://create.roblox.com/docs/tutorials/curriculums/user-interface-design/implement-designs-in-studio); DevForum ["(hopefully) the last UI tutorial"](https://devforum.roblox.com/t/hopefully-the-last-ui-tutorial-youll-ever-need/1788203); mobile share from [PocketGamer.biz on Roblox's annual report](https://www.pocketgamer.biz/80-of-roblox-users-are-on-mobile-contributing-46-of-robux-revenue) (80% of 82.9M DAU on mobile in 2024; PC 17%, console 3%).
- Apply in Roblox:
  - Put each ScreenGui in StarterGui. Set `ResetOnSpawn = false` for HUDs (my tip, so the HUD doesn't rebuild on every death).
  - Use AnchorPoint `(0.5,0.5)` for centered panels, `(0.5,0)` for top-center bars and `(1,1)` for bottom-right clusters. Growth and tweens scale outward from the anchor.
  - Add `UIAspectRatioConstraint` (AspectRatio = width/height; `1` for square icons and buttons) to every icon, button and panel that must keep its shape.
  - Add `UISizeConstraint` (MinSize/MaxSize) so panels don't become huge on TVs or tiny on phones. The docs' example uses 200x200 to 400x400.
  - Use `AutomaticSize` for content-driven boxes (localized labels, chat-like lists) and `ScrollingFrame.AutomaticCanvasSize` for shop and inventory grids.
  - Use `UIListLayout`/`UIGridLayout` plus `UIPadding` instead of hand-placing grid items.
  - Test with Studio's Device Emulator set to "Actual Resolution", on at least one Phone, Tablet, Desktop and Console profile (official).
  - The AutoScale Lite and UI Tools plugins convert Offset to Scale in bulk ([AutoScale Lite](https://devforum.roblox.com/t/plugin-autoscale-lite-for-guis-scale-your-ui/217704), [UI Tools](https://devforum.roblox.com/t/ui-tools-the-all-in-one-interface-design-solution/2166473)).
- Watch out: Layouts (UIListLayout and friends) override child Position/Size, but size constraints take precedence over layouts. Pure Scale can make things too big on wide monitors, so pair it with UISizeConstraint or UIAspectRatioConstraint. Don't use the in-viewport drag handles to place final positions; type the values in.

### 2. Safe areas, the top bar, thumb zones and touch-target size
- What: Keep important UI out of areas the player can't see or reach. The device notch and cutouts, Roblox's top bar (the Roblox menu, chat and other experience controls), the virtual thumbstick (bottom-left) and the jump button (bottom-right) all take space.
- Why it works: A button under the notch or the jump button is a broken button. On touch screens the comfortable zone is near where the thumbs rest, and far top corners are "uncomfortable or impossible" to reach on some phones and tablets (official).
- Backed by: official [wireframe your layouts](https://create.roblox.com/docs/tutorials/curriculums/user-interface-design/wireframe-your-layouts), [cross-platform design](https://create.roblox.com/docs/ui/cross-platform-design), [choose an art style](https://create.roblox.com/docs/tutorials/curriculums/user-interface-design/choose-an-art-style) (touch zones at least 9x9 mm, per WCAG), [ScreenInsets enum](https://create.roblox.com/docs/reference/engine/enums/ScreenInsets.md), [adaptive design](https://create.roblox.com/docs/production/publishing/adaptive-design); DevForum on the 58 px top bar ([1](https://devforum.roblox.com/t/what-are-the-new-topbar-inset-dimensions/3237388), [2](https://devforum.roblox.com/t/how-tall-is-the-roblox-top-bar/3248916), [3](https://devforum.roblox.com/t/guiservicegetguiinset-returns-0-0-0-0-for-the-first-frame-of-the-game-with-new-topbar-ui/2973508)).
- Apply in Roblox:
  - `ScreenGui.ScreenInsets`: `DeviceSafeInsets` avoids notches; `CoreUISafeInsets` also avoids Roblox core UI; `TopbarSafeInsets` gives the strip inside the top bar (for small top-bar buttons); `None` is full-screen. Use `CoreUISafeInsets` for HUDs and `None` plus `IgnoreGuiInset = true` only for full-screen backgrounds, fades and loading screens.
  - The top bar is reported as 58 px tall (`GuiService.TopbarInset.Height`). Read it from `GuiService.TopbarInset` and listen for its change signal, because it can read 0 on the first frame. Don't hard-code 36 or 58.
  - Place custom action buttons relative to the jump button. The official sample reads `TouchGui.TouchControlFrame.JumpButton`, makes a button 80% of its size and puts it 20 px to its left.
  - Touch-target floor: 9x9 mm. Converting that to Roblox UI units (my estimate, verify in the emulator): about 45-60 px on phones, bigger for the primary action. Leave gaps between adjacent buttons so a thumb can't hit two at once.
  - Reserve space for touch controls even on PC so one layout works everywhere (official).
  - Disable core UI you don't use (`StarterGui:SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false)`, etc.) to free space. The curriculum suggests this and shows how to plan around the open states of chat and the player list.
  - Make every action work on gamepad, keyboard and touch (official adaptive design). Show prompts that match the active input (`UserInputService:GetLastInputType()` / `PreferredInput`).
- Watch out: DevForum reports bugs with `TopbarSafeInsets` on Xbox/PS ([thread](https://devforum.roblox.com/t/topbarsafeinsets-is-wrong-on-xbox-and-ps4-with-new-experience-controls/2848042)), so test console. A button 40% down the screen is reachable on a phone but almost unreachable on a tablet (official example).

### 3. Minimal, contextual HUD with a clear hierarchy of information
- What: Decide what the player needs at each moment, show only that, and rank it. Most important goes in the focal area, biggest and brightest. Secondary items get smaller and more muted.
- Why it works: Players scan top-down and left-to-right. Clutter hides the next action, and mobile screens are "especially sensitive to clutter" (official). Riot's episode makes the point that good UI makes critical info "available when players need it and out of the way when they don't", and that "no acknowledgment from players is a sign of good interface design."
- Backed by: #10 Riot Games (content: [Riot ArtEdu page](https://www.riotgames.com/en/artedu/user-interface-design)); official [UI/UX design](https://create.roblox.com/docs/production/game-design/ui-ux-design) ("Hierarchy of Information", contextual buttons; Super Striker League swaps Sprint/Tackle for Deke/Pass based on ball possession); [wireframing](https://create.roblox.com/docs/tutorials/curriculums/user-interface-design/wireframe-your-layouts) (laser tag: objective top, action center, player state on the sides); [choose an art style](https://create.roblox.com/docs/tutorials/curriculums/user-interface-design/choose-an-art-style) (primary/secondary/tertiary interactions).
- Apply in Roblox:
  - Wireframe first in grayscale boxes (Figma or Studio frames), over real game screenshots, with chat and the player list open.
  - HUD skeleton for a simulator-style starter game:
    - Top-center: current objective or event (inside `CoreUISafeInsets`).
    - Left edge, vertically centered: a stack of three or four menu buttons (Shop, Inventory, Settings).
    - Top-right or under the top bar: currency counters.
    - Right-thumb zone: the one context action.
  - Hide what's irrelevant. Use `ProximityPrompt` for world interactions instead of permanent buttons. Fold rarely used buttons into a collapsible "More" menu on small screens (official adaptive design).
  - Size by likelihood: the primary button is the largest and most saturated, secondary is smaller or muted gray, tertiary is a text link (DevForum [clean UI tutorial](https://devforum.roblox.com/t/how-to-make-extremely-clean-ui-while-keeping-good-ux/2438099)).
  - Use world-space UI (BillboardGui over players or objects) for information that belongs to a thing, such as team markers or pet levels, instead of crowding the 2D HUD (laser tag sample).
- Watch out: Too much motion, glow or brightness competing for attention confuses players (official). Don't permanently pin shop and "BUY" buttons with flashing effects over gameplay; a young audience reads that as noise or pressure.

### 4. One consistent visual language (style guide plus tokens)
- What: Choose a palette, one font family, a corner radius, a stroke style and icon rules, then apply them everywhere. Use genre conventions players already know.
- Why it works: Consistency lets players read purpose and status at a glance without instructions (official). Examples from Roblox's doc:
  - "Health" is green in all text, icons and the bar.
  - Close buttons are square, red, white X, top-right.
  - Unaffordable prices are red.
  - Disabled buttons are gray, and locked features get a lock icon.
- Backed by: official [UI/UX design](https://create.roblox.com/docs/production/game-design/ui-ux-design), [choose an art style](https://create.roblox.com/docs/tutorials/curriculums/user-interface-design/choose-an-art-style), [UI styling](https://create.roblox.com/docs/ui/styling); DevForum [UI Design Guide (Zien)](https://devforum.roblox.com/t/ui-design-guide/2975811) (one font family); #6 ByteBlox, #7 Develuper, #20 Kingkade "improve your UI" (title-only, likely angle: polish through consistency, an inference).
- Apply in Roblox:
  - Write a one-page style guide covering:
    - Two or three brand colors plus neutrals, each with a fixed meaning.
    - One font family in two or three weights (Roblox's laser tag sample uses Montserrat Medium, Bold and Black).
    - One corner radius.
    - One stroke color rule (a darker shade of the fill).
    - Icons: white, flat, recolored via `ImageColor3`.
  - Enforce it with Roblox's StyleSheet system:
    - Put design tokens (e.g. `$Primary`, `$Danger`) as attributes on a token StyleSheet.
    - Write `StyleRule`s with selectors (class, CollectionService tag, or `UICorner`/`UIStroke` modifiers).
    - Link it with a `StyleLink` on each ScreenGui.
    - Theme sheets can swap light and dark, and "related themes must have the same set of tokens."
  - Build buttons, panels and toasts from reusable templates (ModuleScript component factories, or React Luau/Fusion; see #12) so they can't drift.
- Watch out: The StyleSheet system is new, and only one StyleSheet can apply per tree. If it proves flaky, a ModuleScript `Theme` table is a fine fallback. Leave room in labels for longer translated text (official).

### 5. The "cartoony" and "stud" look: a concrete recipe
- What: The front-page Roblox look (simulators, Grow a Garden-style games) is bold rounded fonts, thick dark outlines, rounded corners, chunky drop shadows, bright gradient fills and, for "stud UI", a tiled Roblox-stud texture inside panels.
- Why it works: It reads instantly on small screens, matches Roblox's toy-like 3D world and young audience, and the heavy outlines keep UI legible over busy 3D backgrounds.
- Backed by: #11 and #13 Kek cartoony and stud tutorials (creator: [Kek's DevForum UI importing masterclass](https://devforum.roblox.com/t/extremely-detailed-roblox-ui-importing-masterclass-w-free-plugin/4619363)); #4 Kingkade 3D stud GUI and #1 Stewiepfing "Fixing UIStroke Bug" chapter (title-only); official [appearance modifiers](https://create.roblox.com/docs/ui/appearance-modifiers); Roblox's [UIStroke improvements announcement](https://devforum.roblox.com/t/studio-beta-uistroke-improvements-scaling-offsets-and-more/3958036) (fully released Dec 4, 2025); DevForum on stud tiling ([Grow a Garden UI example](https://devforum.roblox.com/t/grow-a-garden-ui-example/3764006), [GUI texture](https://devforum.roblox.com/t/is-it-possible-to-make-a-gui-texture/1448389), [seamless pattern](https://devforum.roblox.com/t/creating-seamless-infinite-pattern-ui/2819198)); [Ultimate UI Design Guide](https://devforum.roblox.com/t/the-ultimate-ui-design-guide/1236916) (light themes suit cartoony UI); font discussion ([new fonts thread](https://devforum.roblox.com/t/new-fonts-are-live/821617), [Cartoon Style UI Review](https://devforum.roblox.com/t/cartoon-style-ui-review/3617988)).
- Apply in Roblox (recipe per panel or button):
  - **Font:** Fredoka One or Luckiest Guy for headings, buttons and numbers. Use a cleaner font (Gotham/Builder Sans/Montserrat) for body text if there is much of it.
  - **Text outline:** a `UIStroke` (Contextual) in a dark shade of the fill or near-black, with `StrokeSizingMode = ScaledSize` so it scales with font size. This is the official fix for the old "strokes don't scale" bug that community scripts used to patch ([example](https://devforum.roblox.com/t/fix-uistrokes-free-script/2955166)).
  - **Panel border:** a second `UIStroke` with `ApplyStrokeMode = Border` and `StrokeSizingMode = ScaledSize`. Thickness is then a fraction of the shortest side (0.1 on a 200x300 frame = 20 px). Use small values like 0.02-0.05 for an outline. `BorderStrokePosition = Inner` keeps it inside the bounds. Multiple border strokes are now allowed, with distinct ZIndex, for a double outline.
  - **Corners:** `UICorner` with Scale 0.15-0.25 for chunky panels. Scale ≥0.5 makes a pill. Per-corner radii now exist.
  - **Fill:** a `UIGradient` from a light tint at the top to the base color at the bottom, `Rotation = 90`. Keep it subtle (DevForum guides: gradients as accents, not everywhere).
  - **Drop shadow:** duplicate the frame, color it black at about 0.5-0.7 transparency, offset it a few pixels down, and put it at a lower ZIndex. A shadow texture also works (clean-UI tutorial).
  - **Stud texture:** an `ImageLabel` with a stud image, `ScaleType = Tile` and `TileSize` set (required). Tint it with `ImageColor3`. For a slow scrolling pattern, move it one tile and snap back.
  - **Images:** export art from Figma as PNG (SVG not supported) at up to 1024 px (Kek). Use 9-slice (`ScaleType = Slice`, `SliceCenter`) for stretchable panel art.
- Watch out:
  - Keep fewer than about 300 UIStrokes on screen for low-end devices (Roblox's announcement).
  - Don't tween `Thickness` on a text UIStroke; it flickers and costs performance (official).
  - Contextual (text) strokes are limited to one per object.
  - The style is everywhere, and one DevForum reviewer calls it the look of "soulless cashgrab simulators", so give it your own palette and icon shapes.
  - Luckiest Guy's tight ascender can crowd the top of a label, so add `UIPadding`.

### 6. Button feedback: hover, press, release and sound
- What: Every interactive element reacts within a frame or two. It grows slightly on hover, squashes on press, springs back on release, and plays a short click sound. Disabled states look disabled (gray).
- Why it works: Missing feedback leaves players unsure whether something worked or is broken (official). Button hover/pressed/released states and purchase sounds are Roblox's own examples.
- Backed by: #9 PineappleDev (snippet: buttons "grow when the player hovers over it, and shrinks back"); #15 Develuper animations (snippet: "interactive states, hover effects"); official [UI/UX design](https://create.roblox.com/docs/production/game-design/ui-ux-design) (feedback), [buttons](https://create.roblox.com/docs/ui/buttons) (`Activated` fires on click or tap; `SecondaryActivated` = right-click/long-press; `HoverImage`/`PressedImage`), [size modifiers](https://create.roblox.com/docs/ui/size-modifiers) (UIScale for hover tweens; scales strokes and corners too), [UI animation](https://create.roblox.com/docs/ui/animation); DevForum ([UIScale hover](https://devforum.roblox.com/t/ui-size-animation/2395076), [fast-hover glitch](https://devforum.roblox.com/t/ui-buttons-scale-down-if-hovering-too-quick/2940845), [hover on mobile](https://devforum.roblox.com/t/mouseleave-mouseenter-doesnt-work-on-mobile/1282044)).
- Apply in Roblox:
  - Put a `UIScale` in every button and tween `UIScale.Scale`, not `Size`. This leaves layouts untouched and scales strokes and corners proportionally.
  - Starting values (my suggestion; the DevForum example uses 1.05 with Quint):
    - Hover: 1.06 over 0.12 s, Quad Out.
    - Press: 0.92 over 0.06 s.
    - Release: back to 1.0 (or 1.06 if still hovered) with `Enum.EasingStyle.Back` for a small bounce.
  - Handle clicks with `Activated`. Hover (`MouseEnter`/`MouseLeave`) is desktop-only polish; touch has no hover. Drive press feedback from `InputBegan`/`InputEnded` or `MouseButton1Down`/`Up`.
  - Track state and replace the running tween instead of stacking tweens; that's the fix for buttons stuck small after fast hovers.
  - Play UI sounds client-side with `SoundService:PlayLocalSound(sound)`. Use a soft click for every button, a distinct "cha-ching" for purchases, and an error buzz for can't-afford. Put them in a "UI" `SoundGroup` with its own volume slider (official accessibility).
  - If `GuiService.ReducedMotionEnabled`, skip scale bounces and use color or brightness changes instead.
  - Gamepad: make buttons `Selectable` and give them a visible selection state (`SelectionImageObject` or a StyleRule on the selected state).
- Watch out: Don't use the legacy `TweenSize` in hover handlers (DevForum calls it laggy). Don't animate so long that it delays the action; fire the action on `Activated` immediately and let the animation play alongside.

```lua
-- LocalScript: attach to every button tagged "Button" (CollectionService)
local TweenService, CollectionService = game:GetService("TweenService"), game:GetService("CollectionService")
local SoundService, GuiService = game:GetService("SoundService"), game:GetService("GuiService")
local click = SoundService:WaitForChild("UI"):WaitForChild("Click")
local function wire(btn)
	local s = btn:FindFirstChildOfClass("UIScale") or Instance.new("UIScale", btn)
	local hovering, current = false, nil
	local function to(v, t, style)
		if GuiService.ReducedMotionEnabled then s.Scale = 1 return end
		if current then current:Cancel() end
		current = TweenService:Create(s, TweenInfo.new(t, style or Enum.EasingStyle.Quad), {Scale = v})
		current:Play()
	end
	btn.MouseEnter:Connect(function() hovering = true to(1.06, 0.12) end)
	btn.MouseLeave:Connect(function() hovering = false to(1, 0.12) end)
	btn.MouseButton1Down:Connect(function() to(0.92, 0.06) end)
	btn.MouseButton1Up:Connect(function() to(hovering and 1.06 or 1, 0.2, Enum.EasingStyle.Back) end)
	btn.Activated:Connect(function() SoundService:PlayLocalSound(click) end)
end
for _, b in CollectionService:GetTagged("Button") do wire(b) end
CollectionService:GetInstanceAddedSignal("Button"):Connect(wire)
```

### 7. Readable text and strong contrast
- What: Make text big enough, high-contrast against whatever 3D scene is behind it, and in a legible font. Decorative fonts are for titles only.
- Why it works: The 3D world behind the UI keeps changing, light and dark, so text that's readable in the lobby can vanish in a bright map. Official guidance says to prioritize legibility over aesthetics.
- Backed by: official [size modifiers](https://create.roblox.com/docs/ui/size-modifiers) ("Do not use MinTextSize property values lower than 9"), [adaptive design](https://create.roblox.com/docs/production/publishing/adaptive-design) (avoid thin or decorative fonts; test the smallest size on real devices), [choose an art style](https://create.roblox.com/docs/tutorials/curriculums/user-interface-design/choose-an-art-style) (contrasting backing or a stroke behind text; stylized fonts sparingly; black and white overlays read well over a colorful scene); DevForum ([clean UI](https://devforum.roblox.com/t/how-to-make-extremely-clean-ui-while-keeping-good-ux/2438099): contrast checkers, avoid yellow on white; ["last UI tutorial"](https://devforum.roblox.com/t/hopefully-the-last-ui-tutorial-youll-ever-need/1788203): check palettes at whocanuse.com).
- Apply in Roblox:
  - Every label over the 3D world gets either a solid or semi-opaque backing panel or a dark `UIStroke`.
  - Aim for WCAG AA contrast (4.5:1 for small text, 3:1 for large). That's the general web standard, not a Roblox rule.
  - Big headline numbers (currency, timers): `TextScaled = true` plus `UITextSizeConstraint` (MinTextSize ≥ 9, sensible MaxTextSize).
  - Body text: fixed `TextSize` plus `TextWrapped` plus `AutomaticSize`. Text with `TextScaled` ignores the player's `PreferredTextSize` (official accessibility page), so don't TextScale everything.
  - Use one display font and one readable font, and keep both bold enough for small phones.
- Watch out: Low-contrast "aesthetic" pastel-on-white, thin fonts, and long text in Luckiest Guy are the common failures. Test over the brightest and darkest parts of your map (official).

### 8. Accessibility: honor player settings and never rely on one sense
- What: Read Roblox's built-in accessibility preferences and react to them. Don't encode meaning in color alone or sound alone, and give volume controls.
- Why it works: Roblox's doc notes over 26% of people have some disability and over 5% have color blindness. Every one of these is a cheap win and widens your audience.
- Backed by: official [accessibility](https://create.roblox.com/docs/production/publishing/accessibility), [adaptive design](https://create.roblox.com/docs/production/publishing/adaptive-design), [choose an art style](https://create.roblox.com/docs/tutorials/curriculums/user-interface-design/choose-an-art-style).
- Apply in Roblox:
  - `GuiService.PreferredTextSize` (Medium default up to Largest): design body text with `AutomaticSize`/`TextWrapped` so it grows cleanly.
  - `GuiService.PreferredTransparency` (1 default down to 0 = opaque): multiply panel `BackgroundTransparency` by it (the official example tags panels and updates on change).
  - `GuiService.ReducedMotionEnabled`: set tween time to 0, or swap slides for `CanvasGroup.GroupTransparency` fades.
  - Pair every color meaning with an icon or shape: a lock icon plus gray, a red price plus a "not enough" icon, team color plus a team symbol. The DevForum suggests avoiding red/green-only pairs.
  - Every sound event gets a visual cue (a toast, flash or icon). Add separate Music, SFX and UI volume sliders via `SoundGroup`s.
  - Gamepad and keyboard: every button must be reachable via selection; use `GuiService.SelectedObject` to put focus on the first button when a menu opens.
- Watch out: Accessibility settings can break layouts built entirely on TextScaled or fixed-size frames, so test with the Largest text size.

### 9. Shop and inventory flows with minimal friction
- What: Map each goal (buy coins, equip a pet, preview a skin) as a flow chart and cut steps. Keep the most common actions one tap away. Show the player's balance, ownership and affordability at a glance.
- Why it works: Friction kills both engagement and purchases. Roblox's doc holds up Berry Avenue's avatar flow as a model: open Avatar, pick a category, scroll, tap to equip, tap Done. The Design Doc video (#12) argues inventories should feel intuitive, stack items, and make common actions easy. The example given is Ocarina of Time's Water Temple forcing players to dig through menus to toggle the iron boots.
- Backed by: #12 Design Doc (content: [Falmouth student summary](https://journal.falmouth.ac.uk/sc247065/?p=936)); official [UI/UX design](https://create.roblox.com/docs/production/game-design/ui-ux-design):
  - Friction and flow charts.
  - Unaffordable prices in red.
  - Dragon Adventures makes its best-value bundle larger with more padding.
  - Jailbreak marks premium pass rewards with a gold stripe.
  - Tower Defense Simulator groups daily skins and crates by size and proximity.
  
  Also [wireframing](https://create.roblox.com/docs/tutorials/curriculums/user-interface-design/wireframe-your-layouts) (one primary task per flow chart; plan unusual paths such as disconnecting mid-purchase; separate flows per input device) and DevForum [UI Design Guide](https://devforum.roblox.com/t/ui-design-guide/2975811) (shop: colorful stroked buttons, coin and gem amounts that visibly grow per tier).
- Apply in Roblox:
  - **Shop layout:**
    - Tabs on the left (Coins / Passes / Items).
    - A `ScrollingFrame` grid of cards using `UIGridLayout`, `UIAspectRatioConstraint` and `AutomaticCanvasSize`.
    - Each card shows: icon, name, one-line benefit, price with Robux or coin icon, and its state. States: Buy (green), Owned (gray check) or Can't afford (red price plus lock or "need X more").
  - **Robux purchases:**
    - Call `MarketplaceService:PromptProductPurchase` / `PromptGamePassPurchase` on the client.
    - Grant items only on the server: developer products via `MarketplaceService.ProcessReceipt` (idempotent, saved with DataStoreService), passes via `UserOwnsGamePassAsync` plus `PromptGamePassPurchaseFinished`.
    - Confirm with a toast plus a sound (technique #10). Then update the card to Owned.
  - **Inventory:** a grid sorted by rarity or newest, "Equip best" and multi-select delete buttons, tap to preview, a second tap or button to equip, and an always-visible "x/50" capacity. Keep favorites one tap from the HUD (the "iron boots" lesson).
  - Close with the red X in the top-right corner. Tapping outside the panel or pressing the gamepad B button also closes it. Open only one modal at a time.
- Watch out: The audience skews young. Size emphasis is fine for honest value labeling, but don't fake urgency (countdowns that reset), disguise the Robux button as a "Continue" button, or pop the shop over gameplay unprompted. Roblox's rules on paid random items and age-related purchase limits are covered in the monetization notes; check current policy there.

### 10. Notifications and toasts that inform without nagging
- What: Short, auto-dismissing messages for events like "+50 coins", "Pet hatched!", "Inventory full" or "Purchase complete". They stack in one consistent spot and use the same style every time.
- Why it works: They confirm actions (feedback) and surface events without stealing input focus. They also give the visual equivalent of sound cues for players who can't hear them (accessibility).
- Backed by: DevForum toast and queue threads ([toast module](https://devforum.roblox.com/t/toast-notifications/1853377), [queue](https://devforum.roblox.com/t/notification-queue-help/2087319), [tweening inside UIListLayout](https://devforum.roblox.com/t/tween-inside-a-uilistlayout/2029296)); official accessibility (visual cues for audio events). No video in the list covers toasts directly.
- Apply in Roblox:
  - Use one `NotificationGui` with a container frame. Position it top-center below the top bar, or right-middle; keep it clear of the thumb zones. Put a `UIListLayout` in the container.
  - Each toast is an invisible "slot" frame (for the layout) holding an inner frame that you tween. Layouts control child positions, so animate the inner frame. Turn on `ClipsDescendants` on the slot.
  - Starting values (my suggestion): at most 3 visible, the rest queued in a table. Show for 3 s, slide or fade in over 0.2 s, then `:Destroy()` the frame (don't just hide it).
  - Color-code by type with an icon (success, warning, error), using the same tokens as technique #4.
  - Merge duplicates ("+50 coins x3") instead of spamming.
  - Use `StarterGui:SetCore("SendNotification", {...})` only for quick prototypes; it doesn't match your art style.
- Watch out: Toasts that cover the action button or fire every second become noise. Big celebrations (rare hatch, level up) deserve a separate full-screen moment, and everything else stays small.

### 11. Purposeful motion for panels and transitions
- What: Menus slide or scale in, and fades cover teleports and loading. Easing makes motion feel physical.
- Why it works: Motion explains where things come from and go, and makes the game feel polished. Too much motion distracts (official), and some players turn it off (ReducedMotion).
- Backed by: #15 Develuper "Make Your UI Feel 10x Better With ANIMATIONS" (title-only); #3 DeHapy devlog (title-only); official [UI animation](https://create.roblox.com/docs/ui/animation) (TweenService; default easing Quad Out; Back overshoots then settles; chain tweens via `Completed`; `CanvasGroup.GroupTransparency` to fade a whole panel); [Ultimate UI Design Guide](https://devforum.roblox.com/t/the-ultimate-ui-design-guide/1236916) (storyboard animation timing; the author staggered elements by 0.3 s).
- Apply in Roblox:
  - Open a panel with `UIScale` 0.85 → 1 using `Back` Out over 0.25 s, combined with a `CanvasGroup` fade from 1 → 0. Close faster (0.15 s, Quad In).
  - Stagger grid items by about 0.03 s for a "pop-in" (my suggestion; the guide's 0.3 s is for big hero elements).
  - Animate a `UIGradient.Offset` for a shine sweep on featured items.
  - Count currency up over about 0.4 s with an eased number tween.
- Watch out: Never block input until an animation finishes, and keep any open or close under about 0.3 s. Tween `UIScale`/`Position` rather than `Size` inside layouts.

### 12. Workflow and tooling: design first, then build with components
- What: Sketch in Figma, block in grayscale, add style, then import into Studio. As the UI grows, build it from code components (React Luau or Fusion) instead of hand-edited instances. AI generators are for references, not final UI.
- Why it works: Iterating on gray boxes is fast, and art comes after the layout works (official wireframing). Component code keeps hundreds of shop cards consistent. Roblox's own app UI is built with React Luau (DevForum).
- Backed by: #11/#13 Kek Figma tutorials (creator: [masterclass](https://devforum.roblox.com/t/extremely-detailed-roblox-ui-importing-masterclass-w-free-plugin/4619363)); #5 Leif React Luau (title-only; background: DevForum [How To: React + Roblox](https://devforum.roblox.com/t/how-to-react-roblox/2964543)); #16 gfxcomet plugins (title-only); #14/#17 AI GUI tools (title-only; [ForgeGUI site](https://www.forgegui.com/), [Nilo guide](https://nilo.io/articles/forgegui-for-beginners) says it "gives you design references only"); DevForum [Ultimate UI Design Guide](https://devforum.roblox.com/t/the-ultimate-ui-design-guide/1236916) (sketch → layout → colors → icons → text → finishing touches; white icons recolored in Studio; PNG only); [UI Design Guide](https://devforum.roblox.com/t/ui-design-guide/2975811); [Stroke Scaler plugin](https://devforum.roblox.com/t/plug-in-stroke-scaler-lite-plus-fix-uistroke-sizing-without-pain/4059570).
- Apply in Roblox: For the starter game, a small ModuleScript library is enough:
  - `makeButton(props)`: UICorner, two UIStrokes, UIGradient, UIScale, sound and tag.
  - `makePanel`, `toast(msg, kind)`.
  
  Upload icons as white PNGs (up to 1024 px) and tint with `ImageColor3`. Move to React Luau only if the UI grows large.
- Watch out: AI-generated art still has to pass Roblox asset moderation. Check the tool's license and public-gallery settings (the Nilo guide notes free generations may show in ForgeGUI's public catalog). Don't copy another game's UI wholesale; the DevForum guide encourages references, not copying.

## Video by video
| # | Video | What it teaches | Evidence |
|---|---|---|---|
| 1 | Essential UI Tips & Tricks (Stewiepfing, 319K) | Snippet chapters start with "Fixing UIStroke Bug" (strokes not scaling across screens). Likely angle (inference): quick fixes and polish tricks. The stroke bug now has an official fix in `StrokeSizingMode.ScaledSize`. | title-only (snippet chapters); context: [UIStroke release](https://devforum.roblox.com/t/studio-beta-uistroke-improvements-scaling-offsets-and-more/3958036) |
| 2 | How To Make GUI (Kingkade 3D, 695K) | Likely angle (inference): beginner walkthrough of ScreenGui, frames and buttons. | title-only |
| 3 | This New UI is Insane (DeHapy, 187K) | Devlog: snippet says he spent "24 hours learning how to create UI" for his game. Likely angle (inference): before and after polish of a real game's UI. | title-only |
| 4 | How To Make Stud GUI (Kingkade 3D, 184K) | Likely angle (inference): stud-texture panels. Community docs describe the technique: ImageLabel, ScaleType Tile, TileSize, ImageColor3 tint. | title-only; context: [DevForum](https://devforum.roblox.com/t/grow-a-garden-ui-example/3764006) |
| 5 | How Modern Roblox UI Actually Works (Leif, 182K) | Snippet: building game UI "like the pros" with React Luau (declarative components). | title-only; background: [React + Roblox guide](https://devforum.roblox.com/t/how-to-react-roblox/2964543) |
| 6 | Making Good UI is EASY, People Are Just Lazy (ByteBlox, 176K) | Likely angle (inference): good UI comes from effort and fundamentals (consistency, spacing, contrast), not talent. | title-only |
| 7 | Make Your Roblox UI Look 10x Better (Develuper, 159K) | Snippet: "a simple guide on how to make your Roblox UI look" better. Likely angle (inference): styling with strokes, corners and gradients. | title-only |
| 8 | The Ultimate Beginner's Guide to Roblox GUI (Kek, 145K) | Snippet: ScreenGui, Frames, Scaling vs Offset basics. The creator's DevForum masterclass covers all GUI objects, modifiers (Corner, Stroke, Padding, Scale, Gradient, AspectRatio), layouts, PNG/JPG and 1024 px import rules, and 9-slice. | creator: [Kek DevForum masterclass](https://devforum.roblox.com/t/extremely-detailed-roblox-ui-importing-masterclass-w-free-plugin/4619363) |
| 9 | Make Your Roblox UI Buttons SUPER Smooth (PineappleDev, 137K) | Snippet: buttons that grow on hover and shrink back (TweenService). See technique 6. | title-only |
| 10 | So You Wanna Make Games?? Ep 9: UI Design (Riot Games, 533K) | Good UI goes unnoticed, and broken UI breaks immersion. Know your audience. Make critical info (stats, inventory, mission, location) available when needed and out of the way otherwise. Covers the UX vs UI distinction and the visual design and motion graphics roles, aiming for a consistent, cohesive, immersive experience. | content: [Riot ArtEdu](https://www.riotgames.com/en/artedu/user-interface-design), [UNQ wiki](https://sheroesingames.unq.edu.ar/wiki/index.php/Interface_Design_by_Riot_Games_(Video)) |
| 11 | The Greatest Cartoony UI Tutorial (w/ Figma) (Kek, 94K) | Snippet: step-by-step front-page cartoony UI designed in Figma and then built in Studio. See technique 5. | creator: [Kek masterclass](https://devforum.roblox.com/t/extremely-detailed-roblox-ui-importing-masterclass-w-free-plugin/4619363) |
| 12 | Inventory UX Design: Zelda, Resident Evil, Doom (Design Doc, 310K) | History of inventories. Make them intuitive, stack items, and make common actions easy. Ocarina of Time's iron-boots menu juggling is the cautionary example. | content: [Falmouth blog summary](https://journal.falmouth.ac.uk/sc247065/?p=936) |
| 13 | The Greatest Stud UI Tutorial (w/ Figma) (Kek, 71K) | Snippet: front-page stud-style UI, Figma to Studio (about 1 hour long). | creator: [Kek masterclass](https://devforum.roblox.com/t/extremely-detailed-roblox-ui-importing-masterclass-w-free-plugin/4619363) |
| 14 | This AI Makes INSANE Roblox GUIs (DitchyDevelopments, 71K) | Mostly off-topic tool showcase. Snippet: an AI tool that "designs Roblox GUIs instantly". Lesson: useful for references; you still build it in Studio. | title-only |
| 15 | Make Your UI Feel 10x Better With ANIMATIONS (Develuper, 54K) | Snippet: "smooth animations, interactive states, hover effects". See techniques 6 and 11. | title-only |
| 16 | Best UI Plugins To Use In Roblox Studio (gfxcomet, 209K) | Likely angle (inference): Studio plugins for UI (scale converters, UI editors). gfxcomet also sells UI assets ([Gumroad](https://gfxcomet.gumroad.com/l/academy)), so part of the video is promotional. | title-only; context: [AutoScale Lite](https://devforum.roblox.com/t/plugin-autoscale-lite-for-guis-scale-your-ui/217704) |
| 17 | This AI Makes INSANE Roblox GUIs! (RoBuilder, 208K) | Mostly off-topic tool promo for Forge GUI (AI-generated GUI sets, icons and thumbnails, plus a Studio plugin). It gives references, not finished UI. | title-only; context: [forgegui.com](https://www.forgegui.com/), [Nilo guide](https://nilo.io/articles/forgegui-for-beginners) |
| 18 | Making UI That Looks Good In Unity (Game Dev Guide, 775K) | Not Roblox-specific. Likely angle (inference): engine-agnostic visual polish (hierarchy, spacing, typography). | title-only |
| 19 | Pixel Art Class: Intro to Game UI (AdamCYounis, 185K) | Snippet: "theory-heavy", broad overview of game UI principles. Likely angle (inference): readability and framing for small-resolution art. | title-only |
| 20 | How To Improve Your UI In Roblox Studio (Kingkade 3D, 46K) | Likely angle (inference): taking basic UI to polished with strokes, gradients and consistency. | title-only |

Note: a third-party "transcript and summary" site for video #7 appeared in search results. Per the brief it was not opened or used.

## Sources
Official Roblox (create.roblox.com)
- https://create.roblox.com/docs/production/game-design/ui-ux-design
- https://create.roblox.com/docs/production/publishing/adaptive-design
- https://create.roblox.com/docs/production/publishing/accessibility
- https://create.roblox.com/docs/ui/cross-platform-design
- https://create.roblox.com/docs/ui/appearance-modifiers
- https://create.roblox.com/docs/ui/size-modifiers
- https://create.roblox.com/docs/ui/animation
- https://create.roblox.com/docs/ui/buttons
- https://create.roblox.com/docs/ui/styling
- https://create.roblox.com/docs/reference/engine/enums/ScreenInsets
- https://create.roblox.com/docs/reference/engine/enums/ScreenInsets.md
- https://create.roblox.com/docs/tutorials/curriculums/user-interface-design/choose-an-art-style
- https://create.roblox.com/docs/tutorials/curriculums/user-interface-design/wireframe-your-layouts
- https://create.roblox.com/docs/tutorials/curriculums/user-interface-design/implement-designs-in-studio

Roblox DevForum
- https://devforum.roblox.com/t/studio-beta-uistroke-improvements-scaling-offsets-and-more/3958036
- https://devforum.roblox.com/t/fix-uistrokes-free-script/2955166
- https://devforum.roblox.com/t/what-are-the-new-topbar-inset-dimensions/3237388
- https://devforum.roblox.com/t/how-tall-is-the-roblox-top-bar/3248916
- https://devforum.roblox.com/t/guiservicegetguiinset-returns-0-0-0-0-for-the-first-frame-of-the-game-with-new-topbar-ui/2973508
- https://devforum.roblox.com/t/topbarsafeinsets-is-wrong-on-xbox-and-ps4-with-new-experience-controls/2848042
- https://devforum.roblox.com/t/how-to-make-extremely-clean-ui-while-keeping-good-ux/2438099
- https://devforum.roblox.com/t/ui-design-guide/2975811
- https://devforum.roblox.com/t/hopefully-the-last-ui-tutorial-youll-ever-need/1788203
- https://devforum.roblox.com/t/the-ultimate-ui-design-guide/1236916
- https://devforum.roblox.com/t/extremely-detailed-roblox-ui-importing-masterclass-w-free-plugin/4619363
- https://devforum.roblox.com/t/grow-a-garden-ui-example/3764006
- https://devforum.roblox.com/t/is-it-possible-to-make-a-gui-texture/1448389
- https://devforum.roblox.com/t/creating-seamless-infinite-pattern-ui/2819198
- https://devforum.roblox.com/t/new-fonts-are-live/821617
- https://devforum.roblox.com/t/cartoon-style-ui-review/3617988
- https://devforum.roblox.com/t/ui-size-animation/2395076
- https://devforum.roblox.com/t/ui-buttons-scale-down-if-hovering-too-quick/2940845
- https://devforum.roblox.com/t/mouseleave-mouseenter-doesnt-work-on-mobile/1282044
- https://devforum.roblox.com/t/toast-notifications/1853377
- https://devforum.roblox.com/t/notification-queue-help/2087319
- https://devforum.roblox.com/t/tween-inside-a-uilistlayout/2029296
- https://devforum.roblox.com/t/how-to-react-roblox/2964543
- https://devforum.roblox.com/t/plugin-autoscale-lite-for-guis-scale-your-ui/217704
- https://devforum.roblox.com/t/ui-tools-the-all-in-one-interface-design-solution/2166473
- https://devforum.roblox.com/t/plug-in-stroke-scaler-lite-plus-fix-uistroke-sizing-without-pain/4059570

Video-specific and other
- https://www.riotgames.com/en/artedu/user-interface-design
- https://sheroesingames.unq.edu.ar/wiki/index.php/Interface_Design_by_Riot_Games_(Video)
- https://thetvdb.com/series/so-you-wanna-make-games/episodes/8303989
- https://journal.falmouth.ac.uk/sc247065/?p=936
- https://www.pocketgamer.biz/80-of-roblox-users-are-on-mobile-contributing-46-of-robux-revenue
- https://www.forgegui.com/
- https://nilo.io/articles/forgegui-for-beginners
- https://gfxcomet.gumroad.com/l/academy
