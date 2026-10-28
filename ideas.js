/* =====================================================================
   DATE IDEAS — edit this file to add your own!
   =====================================================================

   HOW TO ADD AN IDEA
   1. Copy one block below, from the opening {  to the closing },
   2. Paste it right before the  ];  at the very bottom of this file.
   3. Change the words inside the quotes. Keep the commas.
   4. Give it a new "id" (any unique word-with-dashes, e.g. "our-taco-spot").

   FIELDS
   id        Unique name, no spaces.
   title     Short name shown in big letters.
   desc      One sentence about it.
   plan      2–4 short steps, in order: ["Step one", "Step two"]
   tip       One useful tip.
   tier      "in" (stay in, upgraded), "ease" (ease out), "send" (full send)
   budget    0 = Free, 1 = $ (under ~$30), 2 = $$ (~$30–80), 3 = $$$ ($80+)
   energy    "lazy", "chill", or "active"
   time      "short" (a couple hours), "half" (half day), "full" (full day)
   when      "day", "night", or "any"
   area      Neighborhood shown on the card
   cost      Rough cost in words, e.g. "~$20"
   duration  How long, in words, e.g. "~2 hrs"

   OPTIONAL
   place     What to search in Maps, e.g. "Shem Creek Park, Mount Pleasant, SC"
   verify    true = a real business/venue (the app reminds you to check hours)
   rainy     true = works on a rainy day (stay-in ideas count automatically)
   start/end Dated events: "YYYY-MM-DD". Shows up 30 days before start, disappears after end.
   months    Only show in these months (1 = Jan … 12 = Dec), e.g. [10, 11, 12]
   ===================================================================== */

window.DATE_IDEAS_UPDATED = "2026-10-28";

window.DATE_IDEAS = [

  /* ================= STAY IN, BUT UPGRADED ================= */
  {
    id: "charleston-on-screen",
    title: "Charleston-on-screen movie night",
    desc: "Watch something filmed around here and call out every place you recognize.",
    plan: ["Pick Outer Banks, The Notebook, or another local shoot", "Make boiled peanuts or real popcorn", "Pause whenever one of you spots a place you've been"],
    tip: "Outer Banks is set in North Carolina but mostly filmed around Charleston.",
    tier: "in", budget: 0, energy: "lazy", time: "short", when: "night",
    area: "Home", cost: "Free", duration: "~2.5 hrs"
  },
  {
    id: "shrimp-and-grits",
    title: "Cook shrimp & grits together",
    desc: "Make the Lowcountry classic yourselves instead of ordering in.",
    plan: ["Buy local shrimp and stone-ground grits", "One of you on grits, one on shrimp", "Eat at the table with the TV off"],
    tip: "Stone-ground grits take about 45 minutes, so start them first.",
    tier: "in", budget: 1, energy: "chill", time: "short", when: "night",
    area: "Home", cost: "~$25", duration: "~1.5 hrs"
  },
  {
    id: "pizza-swap",
    title: "Build-each-other pizzas",
    desc: "You each design a pizza for the other person. No vetoes allowed.",
    plan: ["Grab store dough and a pile of toppings", "Build each other's pizza in secret", "Rate them honestly; loser does dishes"],
    tip: "Let the dough sit out for 30 minutes first or it'll fight you.",
    tier: "in", budget: 1, energy: "chill", time: "short", when: "night",
    area: "Home", cost: "~$20", duration: "~1.5 hrs"
  },
  {
    id: "food-passport",
    title: "Movie + food passport",
    desc: "Pick a country at random, cook one dish from there, and watch a movie set there.",
    plan: ["Spin a globe or let a random generator pick", "Shop for one main dish", "Cook, then watch a movie set in that country"],
    tip: "Keep a list of countries you've done and turn it into a running tradition.",
    tier: "in", budget: 1, energy: "chill", time: "half", when: "night",
    area: "Home", cost: "~$25", duration: "~3–4 hrs"
  },
  {
    id: "spooky-double-feature",
    title: "Spooky double feature + pumpkins",
    desc: "Carve pumpkins during the first movie, roast the seeds during the second.",
    plan: ["Pick one classic and one new horror movie", "Carve during movie one", "Roast the seeds with salt and butter during movie two"],
    tip: "Spread a trash bag on the floor first. Pumpkin guts get everywhere.",
    tier: "in", budget: 1, energy: "chill", time: "half", when: "night",
    area: "Home", cost: "~$15", duration: "~4 hrs", months: [9, 10]
  },
  {
    id: "cocoa-bar",
    title: "Hot cocoa bar + holiday movie",
    desc: "Real hot chocolate, every topping, and the cheesiest holiday movie you can find.",
    plan: ["Buy marshmallows, peppermint, whipped cream", "Make cocoa on the stove, not from packets", "Blankets on, phones away"],
    tip: "A pinch of salt and a little vanilla makes stovetop cocoa taste expensive.",
    tier: "in", budget: 1, energy: "lazy", time: "short", when: "night",
    area: "Home", cost: "~$12", duration: "~2 hrs", months: [11, 12, 1]
  },
  {
    id: "fondue-night",
    title: "Fondue night",
    desc: "One pot of cheese, one pot of chocolate, and dip absolutely everything.",
    plan: ["Get bread, apples, and veggies for the cheese", "Strawberries, pretzels, and marshmallows for the chocolate", "Whoever drops a piece in the pot owes a kiss"],
    tip: "No fondue pot? A small slow cooker on 'warm' works fine.",
    tier: "in", budget: 2, energy: "chill", time: "short", when: "night",
    area: "Home", cost: "~$35", duration: "~2 hrs", months: [10, 11, 12, 1, 2]
  },
  {
    id: "restaurant-at-home",
    title: "Fancy restaurant at home",
    desc: "Dress up, write a menu, and cook three courses like you're out somewhere nice.",
    plan: ["Write a little menu: starter, main, dessert", "Dress up like you're going out", "Candles on, phones in a bowl"],
    tip: "Pick dishes you can prep ahead so you're not stuck at the stove all night.",
    tier: "in", budget: 2, energy: "chill", time: "half", when: "night",
    area: "Home", cost: "~$40", duration: "~3 hrs"
  },
  {
    id: "splurge-dinner-home",
    title: "Splurge dinner at home",
    desc: "Buy the ingredients you'd normally skip, like good steak or scallops and a fancy dessert.",
    plan: ["Go to a butcher or seafood market", "Pick up a fancy sparkling drink and dessert", "Cook it simply and eat slowly"],
    tip: "A restaurant-quality meal at home still costs about half of going out for one.",
    tier: "in", budget: 3, energy: "chill", time: "half", when: "night",
    area: "Home", cost: "~$90", duration: "~3 hrs"
  },
  {
    id: "private-chef",
    title: "Book a chef for the night",
    desc: "A local chef cooks a multi-course dinner in your kitchen and does the dishes.",
    plan: ["Search private chefs in Mount Pleasant", "Pick a menu a week ahead", "Your only job is to set the table"],
    tip: "Weeknights are often cheaper and easier to book than weekends.",
    tier: "in", budget: 3, energy: "lazy", time: "short", when: "night",
    area: "Home", cost: "$150+", duration: "~2.5 hrs",
    place: "private chef, Mount Pleasant, SC", verify: true
  },
  {
    id: "sushi-night",
    title: "Roll your own sushi",
    desc: "Rolling mats are cheap and ugly rolls taste exactly the same.",
    plan: ["Buy sushi rice, nori, a mat, and fillings", "Make the rice first and let it cool", "Have a roll-off; best roll wins"],
    tip: "Cooked shrimp, crab, avocado, and cucumber are easy and need no raw fish.",
    tier: "in", budget: 2, energy: "chill", time: "short", when: "night",
    area: "Home", cost: "~$35", duration: "~2 hrs"
  },
  {
    id: "paint-each-other",
    title: "Paint-each-other portraits",
    desc: "Thirty minutes, two canvases, one dramatic reveal.",
    plan: ["Grab cheap canvases and acrylics", "Set a 30-minute timer", "Reveal at the same time and hang the worst one"],
    tip: "Craft stores sell starter acrylic sets for under $10.",
    tier: "in", budget: 1, energy: "lazy", time: "short", when: "any",
    area: "Home", cost: "~$20", duration: "~1.5 hrs"
  },
  {
    id: "bake-off",
    title: "Bake Off night",
    desc: "Watch an episode of The Great British Bake Off, then attempt the technical.",
    plan: ["Watch one episode", "Pick that week's technical bake", "Judge each other, Paul Hollywood style"],
    tip: "The recipes for most technicals are posted online.",
    tier: "in", budget: 1, energy: "chill", time: "short", when: "any",
    area: "Home", cost: "~$15", duration: "~2.5 hrs"
  },
  {
    id: "breakfast-for-dinner",
    title: "Pajama breakfast-for-dinner",
    desc: "Pancakes, bacon, and the comfiest pajamas you own.",
    plan: ["Change into pajamas first. That's the rule.", "Make pancakes and bacon together", "Eat on the couch with a comfort show"],
    tip: "A spoonful of sugar and a splash of vanilla upgrades boxed pancake mix.",
    tier: "in", budget: 1, energy: "lazy", time: "short", when: "night",
    area: "Home", cost: "~$15", duration: "~1.5 hrs"
  },
  {
    id: "game-tournament",
    title: "Living-room picnic + game tournament",
    desc: "Blanket on the floor, snacks everywhere, best of five at any game you own.",
    plan: ["Spread a blanket on the floor with snacks", "Pick five games or rounds", "Loser plans the next date"],
    tip: "A deck of cards covers it: gin rummy, speed, and war.",
    tier: "in", budget: 0, energy: "lazy", time: "short", when: "night",
    area: "Home", cost: "Free", duration: "~2 hrs"
  },
  {
    id: "new-two-player-game",
    title: "Learn a new two-player game",
    desc: "Buy a board game made for two and learn it together.",
    plan: ["Pick up a two-player game like Patchwork or Codenames Duet", "Learn the rules together", "Play a best-of-three"],
    tip: "Watching a how-to-play video is faster than reading the rulebook.",
    tier: "in", budget: 1, energy: "chill", time: "short", when: "any",
    area: "Home", cost: "~$25", duration: "~2 hrs"
  },
  {
    id: "recreate-first-date",
    title: "Recreate your first date",
    desc: "Same food, same outfits if you still have them, and the same awkward small talk.",
    plan: ["Get the same food you had", "Wear what you wore, or close to it", "Retell the night from each of your sides"],
    tip: "Look up the date in your phone photos for details you forgot.",
    tier: "in", budget: 1, energy: "lazy", time: "short", when: "night",
    area: "Home", cost: "~$20", duration: "~2 hrs"
  },
  {
    id: "blanket-stargazing",
    title: "Blanket stargazing",
    desc: "Cool nights mean clearer skies. Hot drinks, a stargazing app, and find a planet.",
    plan: ["Make tea or cocoa", "Get somewhere dark: backyard, balcony, or a dark street", "Use a stargazing app to find one planet"],
    tip: "Give your eyes 15 minutes in the dark and you'll see twice as many stars.",
    tier: "in", budget: 0, energy: "lazy", time: "short", when: "night",
    area: "Home", cost: "Free", duration: "~1 hr", months: [10, 11, 12, 1, 2, 3]
  },
  {
    id: "puzzle-playlist",
    title: "Puzzle + playlist swap",
    desc: "Do a puzzle while playing 10-song playlists you each made about the other.",
    plan: ["Each make a 10-song playlist about the other", "Start a 500-piece puzzle", "Explain each song choice while you work"],
    tip: "500 pieces is about one evening. 1,000 turns into a week.",
    tier: "in", budget: 1, energy: "lazy", time: "short", when: "any",
    area: "Home", cost: "~$15", duration: "~2 hrs"
  },
  {
    id: "home-spa-day",
    title: "At-home spa day",
    desc: "Face masks, a long bath, smoothies, robes, and a movie marathon to finish.",
    plan: ["Morning smoothies and face masks", "Take turns giving massages", "End with a movie marathon"],
    tip: "Put towels in the dryer for ten minutes before you use them.",
    tier: "in", budget: 1, energy: "lazy", time: "full", when: "any",
    area: "Home", cost: "~$25", duration: "All day"
  },
  {
    id: "trilogy-day",
    title: "Trilogy day",
    desc: "Pick a trilogy and watch the whole thing without leaving the couch.",
    plan: ["Pick a trilogy neither of you has finished", "Stock snacks for the whole day", "Order (or make) a real dinner between movies two and three"],
    tip: "The extended Lord of the Rings trilogy is about 11 hours. Plan accordingly.",
    tier: "in", budget: 0, energy: "lazy", time: "full", when: "any",
    area: "Home", cost: "Free", duration: "All day"
  },
  {
    id: "blanket-fort",
    title: "Blanket fort movie night",
    desc: "Build a real fort, string up lights, and watch a movie inside it.",
    plan: ["Build the fort with chairs, sheets, and clips", "Add pillows and string lights", "Watch a movie on a laptop inside"],
    tip: "Binder clips hold sheets to chairs better than anything else.",
    tier: "in", budget: 0, energy: "chill", time: "half", when: "night",
    area: "Home", cost: "Free", duration: "~3 hrs"
  },
  {
    id: "learn-a-dance",
    title: "Learn a dance routine",
    desc: "Learn a short dance from a video and film the final take.",
    plan: ["Pick a routine from a dance tutorial video", "Practice in sections", "Film the final take, no matter how it goes"],
    tip: "Slow the video to 0.75x while you're learning.",
    tier: "in", budget: 0, energy: "active", time: "short", when: "night",
    area: "Home", cost: "Free", duration: "~1.5 hrs"
  },
  {
    id: "karaoke-at-home",
    title: "Living-room karaoke",
    desc: "Lyrics videos on the TV, a hairbrush mic, and no judging.",
    plan: ["Queue up karaoke videos on the TV", "Each pick three songs for the other", "Finish with a duet"],
    tip: "Search any song plus 'karaoke' and you'll find a lyrics version.",
    tier: "in", budget: 0, energy: "active", time: "short", when: "night",
    area: "Home", cost: "Free", duration: "~1.5 hrs"
  },
  {
    id: "workout-then-brunch",
    title: "Partner workout + big brunch",
    desc: "Earn a huge brunch with a workout you do together.",
    plan: ["Do a 30-minute partner workout video", "Shower and change", "Cook the biggest brunch you can manage"],
    tip: "Search 'partner workout no equipment' for routines you can do in a living room.",
    tier: "in", budget: 0, energy: "active", time: "short", when: "day",
    area: "Home", cost: "Free", duration: "~2 hrs"
  },
  {
    id: "herb-garden",
    title: "Plant a balcony herb garden",
    desc: "Buy a few pots and herbs and set up a little garden you'll actually cook with.",
    plan: ["Pick up pots, soil, and 4–5 herb plants", "Pot them together", "Cook something that night using what you planted"],
    tip: "Basil, mint, and rosemary all do well in the Lowcountry heat.",
    tier: "in", budget: 1, energy: "active", time: "half", when: "day",
    area: "Home", cost: "~$30", duration: "~3 hrs"
  },
  {
    id: "room-makeover",
    title: "One-room makeover",
    desc: "Rearrange and refresh one room together, then celebrate with takeout in it.",
    plan: ["Pick one room and agree on a vibe", "Rearrange, declutter, and buy one or two new things", "Order takeout and enjoy the new room"],
    tip: "Lamps and a rug change a room more than anything else for the money.",
    tier: "in", budget: 2, energy: "active", time: "full", when: "day",
    area: "Home", cost: "~$60", duration: "All day"
  },
  {
    id: "bread-from-scratch",
    title: "Bake bread from scratch",
    desc: "A slow afternoon of kneading, waiting, and eating warm bread with butter.",
    plan: ["Pick an easy no-knead or focaccia recipe", "Make the dough together", "Eat it warm with good butter"],
    tip: "Focaccia is the most forgiving first bread.",
    tier: "in", budget: 1, energy: "chill", time: "half", when: "day",
    area: "Home", cost: "~$10", duration: "~4 hrs"
  },
  {
    id: "dumplings",
    title: "Dumpling-folding afternoon",
    desc: "Make filling, fold a hundred dumplings, and freeze whatever you don't eat.",
    plan: ["Buy wrappers, ground pork or veggies, and scallions", "Fold together while a show plays", "Pan-fry a batch and freeze the rest"],
    tip: "Wet the wrapper edge with a fingertip of water so it seals.",
    tier: "in", budget: 1, energy: "chill", time: "half", when: "any",
    area: "Home", cost: "~$20", duration: "~3 hrs"
  },
  {
    id: "chili-cookoff",
    title: "Chili cook-off",
    desc: "Two pots, two recipes, one winner. Cozy-weather food.",
    plan: ["Each pick a chili recipe and shop for it", "Cook side by side", "Blind taste with all the toppings"],
    tip: "Cornbread from a box is completely acceptable here.",
    tier: "in", budget: 1, energy: "chill", time: "half", when: "night",
    area: "Home", cost: "~$30", duration: "~3 hrs", months: [10, 11, 12, 1, 2]
  },
  {
    id: "holiday-cookies",
    title: "Holiday cookie bake",
    desc: "Make two kinds of cookies, decorate badly, and give some away.",
    plan: ["Pick one easy cookie and one ambitious one", "Bake with holiday music on", "Box some up for a neighbor or family"],
    tip: "Chill the dough for 30 minutes so cutout shapes keep their edges.",
    tier: "in", budget: 1, energy: "chill", time: "half", when: "any",
    area: "Home", cost: "~$20", duration: "~3 hrs", months: [11, 12]
  },
  {
    id: "backyard-campout",
    title: "Backyard campout",
    desc: "Tent, sleeping bags, and a camp dinner without leaving home.",
    plan: ["Set up a tent (or blankets) outside", "Make hot dogs or foil-packet dinners", "Stay out until you're too cold"],
    tip: "Cooler months mean no mosquitoes. Bring bug spray anyway.",
    tier: "in", budget: 0, energy: "chill", time: "half", when: "night",
    area: "Home (backyard)", cost: "Free", duration: "Overnight", months: [10, 11, 12, 1, 2, 3, 4]
  },
  {
    id: "36-questions",
    title: "The 36 questions",
    desc: "The famous list of questions designed to make two people closer. Works on couples too.",
    plan: ["Pull up 'the 36 questions' list", "Take turns answering, in order", "End with four minutes of eye contact. Yes, really."],
    tip: "Do it with candles on and no TV. It goes deeper than you'd think.",
    tier: "in", budget: 0, energy: "lazy", time: "short", when: "any",
    area: "Home", cost: "Free", duration: "~1.5 hrs"
  },
  {
    id: "time-capsule-letters",
    title: "Letters to open in a year",
    desc: "Write each other letters, seal them, and put a date on the envelope.",
    plan: ["Write each other a letter about right now", "Seal them and write next year's date on the front", "Set a calendar reminder to open them"],
    tip: "Include predictions about the next year. They're the most fun to read later.",
    tier: "in", budget: 0, energy: "lazy", time: "short", when: "any",
    area: "Home", cost: "Free", duration: "~1 hr"
  },
  {
    id: "photo-scrapbook",
    title: "Print photos + make a scrapbook",
    desc: "Get your favorite phone photos printed and turn them into a real album.",
    plan: ["Each pick 20 favorite photos together", "Order prints for same-day pickup", "Build the album with tape and captions"],
    tip: "Drugstores do same-day 4×6 prints for cheap.",
    tier: "in", budget: 1, energy: "chill", time: "half", when: "any",
    area: "Home", cost: "~$25", duration: "~3 hrs"
  },

  /* ================= EASE OUT ================= */
  {
    id: "drive-in",
    title: "Drive-in double feature",
    desc: "Movie night in the car at the Highway 21 Drive-In, with blankets and snacks from home.",
    plan: ["Pack blankets, pillows, and snacks", "Drive down to Beaufort before dark", "Watch both movies from the back seat"],
    tip: "You'll tune your car radio to hear the movie, so bring a portable charger.",
    tier: "ease", budget: 2, energy: "lazy", time: "half", when: "night",
    area: "Beaufort", cost: "~$10–20 each + gas", duration: "~5–6 hrs",
    place: "Highway 21 Drive-In, Beaufort, SC", verify: true
  },
  {
    id: "pitt-street-sunset",
    title: "Takeout picnic at Pitt Street Bridge",
    desc: "Takeout and a blanket at sunset over the marsh in the Old Village.",
    plan: ["Grab takeout from anywhere you like", "Get there 30 minutes before sunset", "Stay until the sky goes pink"],
    tip: "Parking at the end of Pitt Street is limited, so go a little early.",
    tier: "ease", budget: 1, energy: "lazy", time: "short", when: "night",
    area: "Mount Pleasant (Old Village)", cost: "~$25 takeout", duration: "~1.5 hrs",
    place: "Pitt Street Bridge, Mount Pleasant, SC"
  },
  {
    id: "shem-creek-boardwalk",
    title: "Shem Creek boardwalk + dinner on a deck",
    desc: "Walk the boardwalk looking for dolphins, then eat outside on the water.",
    plan: ["Walk the full Shem Creek boardwalk", "Watch for dolphins and shrimp boats", "Eat on any waterfront deck"],
    tip: "Late afternoon is best for dolphins and before the dinner crowd.",
    tier: "ease", budget: 2, energy: "chill", time: "short", when: "any",
    area: "Mount Pleasant", cost: "~$50", duration: "~2 hrs",
    place: "Shem Creek Park, Mount Pleasant, SC"
  },
  {
    id: "terrace-theater",
    title: "Indie movie at The Terrace",
    desc: "James Island's cozy little indie movie theater.",
    plan: ["Pick whatever's playing that you haven't heard of", "Share a big popcorn", "Talk about it over late dessert"],
    tip: "Buy tickets online for new releases on weekends.",
    tier: "ease", budget: 2, energy: "lazy", time: "short", when: "night",
    area: "James Island", cost: "~$30", duration: "~2.5 hrs",
    place: "The Terrace Theater, James Island, SC", verify: true,
    rainy: true
  },
  {
    id: "big-screen-movie",
    title: "Big-screen movie night out",
    desc: "Your usual movie night, but with a giant screen and somebody else's popcorn.",
    plan: ["Pick the biggest new release", "Get the big popcorn to share", "Grab food after and debate the ending"],
    tip: "Tuesday tickets are usually discounted.",
    tier: "ease", budget: 2, energy: "lazy", time: "short", when: "night",
    area: "Mount Pleasant", cost: "~$35", duration: "~2.5 hrs",
    place: "Regal Palmetto Grande, Mount Pleasant, SC", verify: true,
    rainy: true
  },
  {
    id: "poes-sunset",
    title: "Burgers at Poe's + beach sunset",
    desc: "Burgers on Sullivan's Island, then a short walk to the beach for sunset.",
    plan: ["Eat at Poe's Tavern", "Walk to the beach", "Watch the sunset over the water"],
    tip: "Weeknights have a much shorter wait than weekends.",
    tier: "ease", budget: 2, energy: "lazy", time: "short", when: "night",
    area: "Sullivan's Island", cost: "~$45", duration: "~2 hrs",
    place: "Poe's Tavern, Sullivan's Island, SC", verify: true
  },
  {
    id: "waterfront-park-night",
    title: "Pineapple Fountain night walk",
    desc: "Takeout downtown, then wander Waterfront Park and the Battery after dark.",
    plan: ["Grab takeout downtown", "Eat on a swing bench at Waterfront Park", "Walk down to the Battery"],
    tip: "The swings on the pier at Waterfront Park are the best seats in the city.",
    tier: "ease", budget: 1, energy: "chill", time: "short", when: "night",
    area: "Downtown", cost: "~$25 takeout", duration: "~2 hrs",
    place: "Waterfront Park, Charleston, SC"
  },
  {
    id: "kaminskys",
    title: "Dessert at Kaminsky's",
    desc: "Split two slices of cake on Market Street. Dessert counts as the date.",
    plan: ["Get dinner anywhere, or skip it", "Each pick a slice and share", "Walk Market Street after"],
    tip: "It works well as the second stop after a movie or a show.",
    tier: "ease", budget: 1, energy: "lazy", time: "short", when: "night",
    area: "Downtown", cost: "~$25", duration: "~1 hr",
    place: "Kaminsky's Dessert Cafe, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "pages-brunch",
    title: "Brunch at Page's Okra Grill",
    desc: "A Mount Pleasant brunch staple with big Southern plates.",
    plan: ["Go early to beat the wait", "Order one sweet, one savory, and share", "Walk it off at Shem Creek after"],
    tip: "There's usually a wait on weekends, so put your name in and take a walk.",
    tier: "ease", budget: 2, energy: "lazy", time: "short", when: "day",
    area: "Mount Pleasant", cost: "~$40", duration: "~1.5 hrs",
    place: "Page's Okra Grill, Mount Pleasant, SC", verify: true,
    rainy: true
  },
  {
    id: "bookstore-date",
    title: "Bookstore date on King Street",
    desc: "Pick a book for each other at Buxton Books, then go read them over coffee.",
    plan: ["Split up and each pick a book for the other (under $20)", "Swap without explaining", "Read the first chapter over coffee"],
    tip: "Write a little note inside the cover before you hand it over.",
    tier: "ease", budget: 2, energy: "chill", time: "short", when: "day",
    area: "Downtown", cost: "~$45", duration: "~2 hrs",
    place: "Buxton Books, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "festival-of-lights",
    title: "Holiday Festival of Lights",
    desc: "Drive through millions of lights at James Island County Park.",
    plan: ["Make cocoa for the car", "Drive the lights loop", "Park and walk the holiday village"],
    tip: "Weeknights have far shorter lines than weekends.",
    tier: "ease", budget: 1, energy: "lazy", time: "short", when: "night",
    area: "James Island", cost: "~$20–25 per car", duration: "~1.5 hrs",
    place: "James Island County Park, Charleston, SC", verify: true, start: "2026-11-13", end: "2026-12-31"
  },
  {
    id: "farmers-market",
    title: "Saturday farmers market",
    desc: "Breakfast from a vendor at Marion Square, then buy ingredients for dinner.",
    plan: ["Get breakfast from a food stand", "Buy ingredients for one dinner", "Cook it together that night"],
    tip: "Go before 10am for the best produce and shorter lines.",
    tier: "ease", budget: 1, energy: "chill", time: "short", when: "day",
    area: "Downtown", cost: "~$30", duration: "~2 hrs",
    place: "Marion Square, Charleston, SC", verify: true, months: [4, 5, 6, 7, 8, 9, 10, 11]
  },
  {
    id: "night-market",
    title: "City Market night market",
    desc: "Friday and Saturday evenings: local makers, snacks, and people-watching.",
    plan: ["Get dinner nearby first", "Walk the night market end to end", "Buy each other one small thing under $15"],
    tip: "The night market runs on Friday and Saturday evenings for most of the year.",
    tier: "ease", budget: 1, energy: "chill", time: "short", when: "night",
    area: "Downtown", cost: "~$20", duration: "~1.5 hrs",
    place: "Charleston City Market, Charleston, SC", verify: true, months: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  {
    id: "park-circle",
    title: "Park Circle dinner stroll",
    desc: "Pick an East Montague Ave restaurant you've never tried, then walk around.",
    plan: ["Walk East Montague and pick a place on the spot", "Have dinner", "Walk the park circle after"],
    tip: "Street parking is easy on weeknights.",
    tier: "ease", budget: 2, energy: "chill", time: "short", when: "night",
    area: "Park Circle (N. Charleston)", cost: "~$50", duration: "~2 hrs",
    place: "East Montague Avenue, North Charleston, SC"
  },
  {
    id: "palmetto-islands",
    title: "Picnic at Palmetto Islands park",
    desc: "Marsh boardwalks and an observation tower, right in Mount Pleasant.",
    plan: ["Pack a picnic", "Walk the boardwalks", "Climb the observation tower"],
    tip: "There's a small entry fee per person. Bring bug spray in warm months.",
    tier: "ease", budget: 0, energy: "chill", time: "short", when: "day",
    area: "Mount Pleasant", cost: "~$2 each", duration: "~2 hrs",
    place: "Palmetto Islands County Park, Mount Pleasant, SC", verify: true
  },
  {
    id: "bowens-oysters",
    title: "Oysters at Bowens Island",
    desc: "Shovels of roasted oysters and a sunset over the marsh. Cooler months are oyster season.",
    plan: ["Get there before sunset", "Order roasted oysters to share", "Eat on the dock as the sun goes down"],
    tip: "Wear clothes that can get a little messy.",
    tier: "ease", budget: 2, energy: "chill", time: "short", when: "night",
    area: "James Island", cost: "~$50", duration: "~2 hrs",
    place: "Bowens Island Restaurant, Charleston, SC", verify: true, months: [10, 11, 12, 1, 2, 3]
  },
  {
    id: "golden-hour-photos",
    title: "Golden-hour photo walk",
    desc: "Rainbow Row, the Battery, and the little alleys. Take one really good photo of each other.",
    plan: ["Start at Rainbow Row an hour before sunset", "Wander to Philadelphia Alley and the Battery", "Pick a favorite photo of each other"],
    tip: "The hour before sunset gives the softest light.",
    tier: "ease", budget: 0, energy: "chill", time: "short", when: "day",
    area: "Downtown", cost: "Free", duration: "~1.5 hrs",
    place: "Rainbow Row, Charleston, SC"
  },
  {
    id: "mp-pier-sunset",
    title: "Mount Pleasant Pier at sunset",
    desc: "Swing benches under the Ravenel Bridge with takeout in your laps.",
    plan: ["Grab takeout on the way", "Find a swing on the pier", "Watch the bridge lights come on"],
    tip: "The pier sits at Memorial Waterfront Park, with free parking.",
    tier: "ease", budget: 0, energy: "lazy", time: "short", when: "night",
    area: "Mount Pleasant", cost: "Free (+ takeout)", duration: "~1 hr",
    place: "Mount Pleasant Pier, Mount Pleasant, SC", verify: true
  },
  {
    id: "thrift-challenge",
    title: "$20 thrift outfit challenge",
    desc: "Each gets $20 to build an outfit for the other. Wear them out to dinner.",
    plan: ["Split up in a thrift store with $20 each", "Build a full outfit for the other person", "Wear them out to dinner"],
    tip: "Thrift stores restock early in the week.",
    tier: "ease", budget: 1, energy: "chill", time: "half", when: "day",
    area: "Mount Pleasant", cost: "~$40", duration: "~3 hrs",
    place: "thrift store, Mount Pleasant, SC",
    rainy: true
  },
  {
    id: "morris-lighthouse",
    title: "Morris Island Lighthouse walk",
    desc: "An easy walk at the north end of Folly to see the lighthouse standing in the ocean.",
    plan: ["Park at the end of East Ashley Avenue", "Walk the path to the beach", "Sit and watch the lighthouse"],
    tip: "Go at low tide for more beach to walk on.",
    tier: "ease", budget: 0, energy: "chill", time: "short", when: "day",
    area: "Folly Beach", cost: "Free", duration: "~1.5 hrs",
    place: "Lighthouse Inlet Heritage Preserve, Folly Beach, SC"
  },
  {
    id: "folly-afternoon",
    title: "Lazy Folly Beach afternoon",
    desc: "Wander Center Street, eat somewhere with a deck, then end up on the sand.",
    plan: ["Walk Center Street", "Lunch on a deck", "Spend the rest of the afternoon on the beach"],
    tip: "Paid parking fills up fast on weekends; side streets have more.",
    tier: "ease", budget: 2, energy: "lazy", time: "half", when: "day",
    area: "Folly Beach", cost: "~$50", duration: "~4 hrs",
    place: "Center Street, Folly Beach, SC"
  },
  {
    id: "hampton-park",
    title: "Hampton Park picnic",
    desc: "Sandwiches, a blanket, and a slow loop around one of downtown's prettiest parks.",
    plan: ["Pick up sandwiches", "Find a spot by the pond", "Walk the loop after"],
    tip: "Spring and fall are prettiest when the gardens are planted.",
    tier: "ease", budget: 0, energy: "lazy", time: "short", when: "day",
    area: "Downtown", cost: "Free (+ food)", duration: "~2 hrs",
    place: "Hampton Park, Charleston, SC"
  },
  {
    id: "the-alley",
    title: "Bowling at The Alley",
    desc: "Downtown bowling, arcade games, and food. Loser buys dessert.",
    plan: ["Bowl one game", "Play a few arcade games", "Loser buys dessert"],
    tip: "Reserve a lane on weekend nights.",
    tier: "ease", budget: 2, energy: "chill", time: "short", when: "night",
    area: "Downtown", cost: "~$50", duration: "~2 hrs",
    place: "The Alley, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "riverdogs",
    title: "RiverDogs baseball game",
    desc: "Cheap seats, hot dogs, and between-inning chaos at The Joe.",
    plan: ["Get the cheapest seats", "Eat ballpark food for dinner", "Stay for fireworks if it's a fireworks night"],
    tip: "Check the promo calendar for theme nights and fireworks.",
    tier: "ease", budget: 1, energy: "lazy", time: "short", when: "night",
    area: "Downtown (The Joe)", cost: "~$30", duration: "~3 hrs",
    place: "Joseph P. Riley Jr. Park, Charleston, SC", verify: true, months: [4, 5, 6, 7, 8, 9]
  },
  {
    id: "angel-oak",
    title: "Visit the Angel Oak",
    desc: "A massive, centuries-old live oak on Johns Island. Free, and way bigger than the photos make it look.",
    plan: ["Drive out to Johns Island", "Walk around the whole tree", "Stop at a farm stand on Maybank Highway"],
    tip: "It keeps limited hours and closes some days, so check first.",
    tier: "ease", budget: 0, energy: "lazy", time: "short", when: "day",
    area: "Johns Island", cost: "Free", duration: "~1.5 hrs",
    place: "Angel Oak Tree, Johns Island, SC", verify: true
  },
  {
    id: "sullivans-beach-day",
    title: "Full beach day at Sullivan's",
    desc: "Chairs, a cooler, a book each, and stay until the sun goes down.",
    plan: ["Pack lunch, drinks, and chairs", "Claim a spot and stay all day", "Watch the sunset before you pack up"],
    tip: "Sullivan's has free street parking; follow the signs.",
    tier: "ease", budget: 0, energy: "lazy", time: "full", when: "day",
    area: "Sullivan's Island", cost: "Free (bring food)", duration: "All day",
    place: "Sullivan's Island Beach, Sullivan's Island, SC", months: [4, 5, 6, 7, 8, 9, 10]
  },
  {
    id: "yes-day",
    title: "Yes day",
    desc: "Take turns choosing what happens next all day, and the other person has to say yes.",
    plan: ["Set one rule: free or cheap only", "Take turns picking the next activity", "End wherever the day takes you"],
    tip: "Agree on a time to stop so it doesn't turn into a 2am grocery run.",
    tier: "ease", budget: 0, energy: "chill", time: "full", when: "any",
    area: "Anywhere", cost: "Free–$", duration: "All day"
  },
  {
    id: "downtown-wander-day",
    title: "Downtown wander day",
    desc: "King Street in the morning, lunch somewhere new, the waterfront, then dinner.",
    plan: ["Coffee and browsing on King Street", "Lunch somewhere neither of you has tried", "Waterfront Park in the afternoon, dinner after"],
    tip: "Park in a city garage once and walk everywhere.",
    tier: "ease", budget: 2, energy: "chill", time: "full", when: "any",
    area: "Downtown", cost: "~$80", duration: "All day",
    place: "King Street, Charleston, SC"
  },
  {
    id: "coffee-crawl",
    title: "Coffee shop crawl",
    desc: "Three coffee shops, one drink each, and a winner by the end.",
    plan: ["Pick three coffee shops you've never been to", "Split one drink at each", "Crown a winner"],
    tip: "Share small drinks so you're not shaking by stop three.",
    tier: "ease", budget: 1, energy: "chill", time: "short", when: "day",
    area: "Downtown", cost: "~$20", duration: "~2 hrs",
    place: "coffee shops, Charleston, SC",
    rainy: true
  },
  {
    id: "ice-cream-drive",
    title: "Ice cream + sunset drive",
    desc: "Grab ice cream and drive over the Ravenel Bridge while the sun goes down.",
    plan: ["Get ice cream", "Drive over the bridge at sunset", "Park somewhere with a view to finish"],
    tip: "Westbound gets the sunset straight ahead.",
    tier: "ease", budget: 1, energy: "lazy", time: "short", when: "night",
    area: "Mount Pleasant → Downtown", cost: "~$12", duration: "~1 hr"
  },
  {
    id: "restaurant-roulette",
    title: "Restaurant roulette",
    desc: "Pick a Mount Pleasant restaurant neither of you has tried. No looking at reviews.",
    plan: ["Each name three places you've never been", "Pick one at random", "Order something you'd never usually get"],
    tip: "No reviews and no menu peeking. And McAlister's doesn't count.",
    tier: "ease", budget: 2, energy: "lazy", time: "short", when: "night",
    area: "Mount Pleasant", cost: "~$50", duration: "~1.5 hrs",
    place: "restaurants, Mount Pleasant, SC",
    rainy: true
  },
  {
    id: "nice-dinner-downtown",
    title: "Dressed-up dinner downtown",
    desc: "A real reservation somewhere nice. Get dressed up and take your time.",
    plan: ["Book a table a few days ahead", "Get dressed up", "Walk the Battery after dinner"],
    tip: "Weeknight reservations are much easier to get than weekends.",
    tier: "ease", budget: 3, energy: "lazy", time: "short", when: "night",
    area: "Downtown", cost: "$100+", duration: "~2.5 hrs",
    place: "fine dining, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "fancy-brunch",
    title: "Long fancy brunch",
    desc: "A slow, nice brunch downtown with no plans after.",
    plan: ["Book a brunch table downtown", "Order a little of everything", "Walk it off on King Street"],
    tip: "Sunday brunch spots book up; reserve a few days ahead.",
    tier: "ease", budget: 3, energy: "lazy", time: "short", when: "day",
    area: "Downtown", cost: "~$90", duration: "~2 hrs",
    place: "brunch, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "highway-174-drive",
    title: "Scenic drive down Highway 174",
    desc: "A slow drive through oaks and marsh toward Edisto, stopping at farm stands.",
    plan: ["Make a road-trip playlist", "Drive Highway 174 toward Edisto", "Stop at any farm stand that looks good"],
    tip: "Go in the afternoon so the light comes through the oaks.",
    tier: "ease", budget: 1, energy: "lazy", time: "half", when: "day",
    area: "Edisto Island route", cost: "~$20 + gas", duration: "~3–4 hrs",
    place: "Highway 174, Edisto Island, SC"
  },
  {
    id: "gibbes-museum",
    title: "Gibbes Museum of Art",
    desc: "A small, beautiful art museum downtown. Pick a favorite piece each.",
    plan: ["Walk through separately", "Each pick a favorite piece", "Show each other why over coffee"],
    tip: "It's small enough to see everything in about an hour.",
    tier: "ease", budget: 1, energy: "chill", time: "short", when: "day",
    area: "Downtown", cost: "~$15–20 each", duration: "~1.5 hrs",
    place: "Gibbes Museum of Art, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "sc-aquarium",
    title: "South Carolina Aquarium",
    desc: "Sea turtles, a giant ocean tank, and a harbor view from the deck.",
    plan: ["Go on a weekday morning", "Don't skip the sea turtle care center", "Lunch by the harbor after"],
    tip: "Weekday mornings are the quietest.",
    tier: "ease", budget: 2, energy: "chill", time: "short", when: "day",
    area: "Downtown", cost: "~$35+ each", duration: "~2 hrs",
    place: "South Carolina Aquarium, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "charleston-museum",
    title: "The Charleston Museum",
    desc: "Learn where you actually live. Pirates, history, and some strange old stuff.",
    plan: ["Each find the weirdest object in the museum", "Compare finds", "Grab lunch nearby"],
    tip: "Combo tickets include historic houses if you want to make a day of it.",
    tier: "ease", budget: 1, energy: "chill", time: "short", when: "day",
    area: "Downtown", cost: "~$15 each", duration: "~1.5 hrs",
    place: "The Charleston Museum, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "ravenel-halfway",
    title: "Halfway up the Ravenel at sunset",
    desc: "Walk from Mount Pleasant to the first tower and back while the sun sets.",
    plan: ["Park at Memorial Waterfront Park", "Walk up to the first tower", "Watch the sunset, then walk back down"],
    tip: "It's a real incline. Wear sneakers and bring water.",
    tier: "ease", budget: 0, energy: "active", time: "short", when: "night",
    area: "Mount Pleasant", cost: "Free", duration: "~1.5 hrs",
    place: "Mount Pleasant Memorial Waterfront Park, Mount Pleasant, SC"
  },
  {
    id: "breach-inlet-walk",
    title: "Beach walk to Breach Inlet",
    desc: "Walk Sullivan's beach to the inlet and watch for dolphins.",
    plan: ["Start mid-island on Sullivan's", "Walk the beach to Breach Inlet", "Watch for dolphins in the channel"],
    tip: "Don't swim at Breach Inlet. The currents there are dangerous.",
    tier: "ease", budget: 0, energy: "active", time: "short", when: "day",
    area: "Sullivan's Island", cost: "Free", duration: "~1.5 hrs",
    place: "Breach Inlet, Sullivan's Island, SC"
  },
  {
    id: "caw-caw",
    title: "Alligator spotting at Caw Caw",
    desc: "Boardwalks over old rice fields with alligators and herons everywhere.",
    plan: ["Drive out to Ravenel", "Walk the boardwalk trails", "Count alligators; most wins"],
    tip: "Cool, sunny days are best: the gators come out to sun themselves.",
    tier: "ease", budget: 1, energy: "active", time: "half", when: "day",
    area: "Ravenel", cost: "~$2 each", duration: "~3 hrs",
    place: "Caw Caw Interpretive Center, Ravenel, SC", verify: true
  },
  {
    id: "mini-golf",
    title: "Mini golf",
    desc: "Low effort, very competitive. Loser buys ice cream.",
    plan: ["Play 18 holes", "Keep score honestly", "Loser buys ice cream"],
    tip: "Most courses are cheaper before 5pm.",
    tier: "ease", budget: 1, energy: "chill", time: "short", when: "any",
    area: "Charleston area", cost: "~$25", duration: "~1.5 hrs",
    place: "mini golf, Charleston, SC", verify: true
  },
  {
    id: "iop-front-beach",
    title: "Isle of Palms evening",
    desc: "Dinner by Front Beach, then a walk on the sand as it gets dark.",
    plan: ["Dinner near Front Beach", "Walk the beach after", "Look for ghost crabs with a phone flashlight"],
    tip: "Ghost crabs come out after dark. A flashlight makes the walk more fun.",
    tier: "ease", budget: 2, energy: "chill", time: "short", when: "night",
    area: "Isle of Palms", cost: "~$50", duration: "~2.5 hrs",
    place: "Front Beach, Isle of Palms, SC"
  },

  {
    id: "francis-marion-day",
    title: "Francis Marion forest day",
    desc: "A free day of easy trails, picnic tables, and quiet woods about 45 minutes away.",
    plan: ["Pack a picnic and plenty of water", "Hike an easy trail loop", "Picnic, then stop for dinner on the drive home"],
    tip: "Download a trail map first. Cell service gets spotty out there.",
    tier: "ease", budget: 0, energy: "active", time: "full", when: "day",
    area: "Francis Marion Forest", cost: "Free", duration: "All day",
    place: "Francis Marion National Forest, SC"
  },
  {
    id: "three-beach-day",
    title: "Three-beach day",
    desc: "Walk Sullivan's, Isle of Palms, and Folly in one day, with coffee and snacks in between.",
    plan: ["Morning walk on Sullivan's", "Midday on Isle of Palms", "Sunset on Folly"],
    tip: "It's best in cooler months, when the beaches are empty and parking is easy.",
    tier: "ease", budget: 0, energy: "active", time: "full", when: "day",
    area: "Sullivan's, IOP & Folly", cost: "Free (+ snacks)", duration: "All day",
    place: "Sullivan's Island Beach, Sullivan's Island, SC"
  },

  /* ================= FULL SEND ================= */
  {
    id: "dolphin-kayak",
    title: "Dolphin kayak tour from Shem Creek",
    desc: "A guided paddle through the creek and marsh with good odds of seeing dolphins.",
    plan: ["Book a guided tour", "Paddle out from Shem Creek", "Celebrate with lunch on the creek after"],
    tip: "Go with a guide the first time; they know where the dolphins hang out.",
    tier: "send", budget: 2, energy: "active", time: "half", when: "day",
    area: "Mount Pleasant", cost: "~$50–65 each", duration: "~2.5 hrs",
    place: "Nature Adventures Outfitters, Mount Pleasant, SC", verify: true
  },
  {
    id: "ravenel-walk",
    title: "Walk the whole Ravenel Bridge",
    desc: "About 2.5 miles each way from Mount Pleasant. Reward yourselves with food downtown.",
    plan: ["Start at Memorial Waterfront Park", "Walk all the way across", "Eat downtown, then walk (or ride) back"],
    tip: "There's no shade. Go early or late and bring water.",
    tier: "send", budget: 0, energy: "active", time: "half", when: "any",
    area: "Mount Pleasant → Downtown", cost: "Free", duration: "~2.5–3 hrs",
    place: "Mount Pleasant Memorial Waterfront Park, Mount Pleasant, SC"
  },
  {
    id: "sunset-sail",
    title: "Sunset sail on the harbor",
    desc: "A schooner cruise around Charleston Harbor as the sun goes down.",
    plan: ["Book a sunset sail", "Bring a layer; it's cooler on the water", "Dinner downtown after"],
    tip: "Sunset sails sell out on nice weekends, so book ahead.",
    tier: "send", budget: 3, energy: "chill", time: "short", when: "night",
    area: "Downtown", cost: "~$45+ each", duration: "~2 hrs",
    place: "Schooner Pride, Charleston, SC", verify: true
  },
  {
    id: "ghost-tour",
    title: "Downtown ghost tour",
    desc: "Charleston is extremely haunted, allegedly. Hold hands for safety.",
    plan: ["Book an evening ghost tour", "Walk the old streets after dark", "Get dessert after to calm down"],
    tip: "The graveyard tours are the spookiest.",
    tier: "send", budget: 2, energy: "chill", time: "short", when: "night",
    area: "Downtown", cost: "~$30 each", duration: "~1.5 hrs",
    place: "Bulldog Tours, Charleston, SC", verify: true
  },
  {
    id: "fort-sumter",
    title: "Ferry to Fort Sumter",
    desc: "A boat ride across the harbor to the fort where the Civil War started.",
    plan: ["Book the ferry", "Ride out across the harbor", "Explore the fort, then ride back"],
    tip: "Ferries leave from Liberty Square downtown and Patriots Point in Mount Pleasant.",
    tier: "send", budget: 2, energy: "chill", time: "half", when: "day",
    area: "Mount Pleasant (Patriots Point)", cost: "~$35 each", duration: "~2.5 hrs",
    place: "Fort Sumter Tours, Patriots Point, Mount Pleasant, SC", verify: true
  },
  {
    id: "uss-yorktown",
    title: "Explore the USS Yorktown",
    desc: "Climb around a real aircraft carrier at Patriots Point.",
    plan: ["Start on the flight deck", "Climb down into the ship", "Lunch at Shem Creek after"],
    tip: "Wear sneakers. There are lots of steep ladders.",
    tier: "send", budget: 2, energy: "active", time: "half", when: "day",
    area: "Mount Pleasant", cost: "~$30 each", duration: "~3 hrs",
    place: "Patriots Point Naval & Maritime Museum, Mount Pleasant, SC", verify: true
  },
  {
    id: "pumpkin-patch",
    title: "Boone Hall pumpkin patch",
    desc: "Hayride, corn maze, and you each pick the weirdest pumpkin you can find.",
    plan: ["Do the corn maze", "Take the hayride", "Each pick the strangest pumpkin"],
    tip: "Weekdays are much less crowded than weekends.",
    tier: "send", budget: 2, energy: "active", time: "half", when: "day",
    area: "Mount Pleasant", cost: "~$40", duration: "~3 hrs",
    place: "Boone Hall Pumpkin Patch, Mount Pleasant, SC", verify: true, months: [9, 10]
  },
  {
    id: "stingrays-hockey",
    title: "Stingrays hockey game",
    desc: "Loud, cheap, and a freezing ice rink in the South.",
    plan: ["Get cheap seats", "Learn one chant", "Get late-night food after"],
    tip: "Cheap seats are fine. Every seat is close to the ice.",
    tier: "send", budget: 2, energy: "chill", time: "short", when: "night",
    area: "North Charleston", cost: "~$25 each", duration: "~2.5 hrs",
    place: "North Charleston Coliseum, North Charleston, SC", verify: true, months: [10, 11, 12, 1, 2, 3, 4],
    rainy: true
  },
  {
    id: "ice-skating",
    title: "Go ice skating",
    desc: "Hold hands, fall down, get hot chocolate after.",
    plan: ["Check the public skate times", "Rent skates and hold hands", "Hot chocolate after"],
    tip: "Wear thick socks and gloves.",
    tier: "send", budget: 2, energy: "active", time: "short", when: "any",
    area: "North Charleston", cost: "~$15 each", duration: "~1.5 hrs",
    place: "Carolina Ice Palace, North Charleston, SC", verify: true, months: [11, 12, 1, 2],
    rainy: true
  },
  {
    id: "tea-garden",
    title: "Charleston Tea Garden trip",
    desc: "A working tea plantation on Wadmalaw Island, with tastings and rows of tea bushes.",
    plan: ["Drive out to Wadmalaw", "Do the factory walk and tasting", "Picnic on the grounds"],
    tip: "The trolley tour costs extra and is worth it once.",
    tier: "send", budget: 1, energy: "chill", time: "half", when: "day",
    area: "Wadmalaw Island", cost: "~$20", duration: "~4 hrs",
    place: "Charleston Tea Garden, Wadmalaw Island, SC", verify: true
  },
  {
    id: "cypress-gardens",
    title: "Paddle Cypress Gardens",
    desc: "Paddle a boat through black-water swamp and cypress trees.",
    plan: ["Drive to Moncks Corner", "Take a boat out on the swamp", "Walk the garden trails after"],
    tip: "It's beautiful and a little spooky. Bring bug spray.",
    tier: "send", budget: 2, energy: "active", time: "half", when: "day",
    area: "Moncks Corner", cost: "~$20 each", duration: "~4 hrs",
    place: "Cypress Gardens, Moncks Corner, SC", verify: true
  },
  {
    id: "hunting-island",
    title: "Hunting Island road trip",
    desc: "A wild boneyard beach and a historic lighthouse. Lunch in Beaufort on the way.",
    plan: ["Drive down early", "Lunch in Beaufort", "Walk the boneyard beach and see the lighthouse"],
    tip: "Check whether the lighthouse is open for climbing. The beach is worth it either way.",
    tier: "send", budget: 1, energy: "active", time: "full", when: "day",
    area: "Hunting Island", cost: "~$30 + gas", duration: "All day",
    place: "Hunting Island State Park, SC", verify: true
  },
  {
    id: "savannah-day-trip",
    title: "Day trip to Savannah",
    desc: "Two hours south: wander the squares and River Street and eat too many pralines.",
    plan: ["Leave by 9am", "Walk the squares to Forsyth Park", "Dinner on River Street, then drive home"],
    tip: "Park once in a garage and walk everywhere.",
    tier: "send", budget: 3, energy: "chill", time: "full", when: "any",
    area: "Savannah", cost: "~$100+", duration: "All day",
    place: "Forsyth Park, Savannah, GA"
  },
  {
    id: "beaufort-overnight",
    title: "Overnight in Beaufort",
    desc: "A tiny getaway: a night at an inn in a small, pretty waterfront town.",
    plan: ["Book a room at an inn or B&B", "Walk the waterfront park at sunset", "Slow breakfast before driving home"],
    tip: "Sunday-to-Monday nights are usually cheapest.",
    tier: "send", budget: 3, energy: "lazy", time: "full", when: "any",
    area: "Beaufort", cost: "$150+", duration: "Overnight",
    place: "Henry C. Chambers Waterfront Park, Beaufort, SC", verify: true
  },
  {
    id: "couples-massage",
    title: "Couples massage",
    desc: "The laziest full send there is.",
    plan: ["Book a couples massage", "Arrive early for the relaxation room", "Get a light dinner after"],
    tip: "Ask about weekday deals.",
    tier: "send", budget: 3, energy: "lazy", time: "short", when: "any",
    area: "Mount Pleasant", cost: "$200+", duration: "~2 hrs",
    place: "couples massage, Mount Pleasant, SC", verify: true,
    rainy: true
  },
  {
    id: "theatre-99",
    title: "Improv at Theatre 99",
    desc: "Charleston's improv comedy theater. Funnier than any Netflix special.",
    plan: ["Buy tickets ahead", "Dinner nearby first", "Shout a suggestion if you're brave"],
    tip: "Weekend shows sell out, so buy tickets early.",
    tier: "send", budget: 2, energy: "lazy", time: "short", when: "night",
    area: "Downtown", cost: "~$20–30 each", duration: "~1.5 hrs",
    place: "Theatre 99, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "symphony",
    title: "Charleston Symphony concert",
    desc: "Get dressed up and hear a live orchestra. You'll feel very fancy.",
    plan: ["Pick a concert on the calendar", "Dinner downtown before", "Dress up"],
    tip: "Pick a program with a piece you already know. It makes the first time easier.",
    tier: "send", budget: 3, energy: "lazy", time: "short", when: "night",
    area: "Downtown", cost: "~$40–80 each", duration: "~2.5 hrs",
    place: "Charleston Symphony, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "dinner-cruise",
    title: "Harbor dinner cruise",
    desc: "Dinner on a boat while the city lights come on.",
    plan: ["Book a dinner cruise", "Dress up a little", "Spend dessert on the outside deck"],
    tip: "Bring a jacket, even in warm months.",
    tier: "send", budget: 3, energy: "lazy", time: "short", when: "night",
    area: "Charleston Harbor", cost: "$80+ each", duration: "~3 hrs",
    place: "dinner cruise, Charleston, SC", verify: true
  },
  {
    id: "pour-house",
    title: "Live music at the Pour House",
    desc: "A James Island music venue with bigger shows inside and smaller sets on the deck.",
    plan: ["Check the lineup", "Pick a band you've never heard", "Grab food beforehand"],
    tip: "Deck shows are smaller and sometimes free.",
    tier: "send", budget: 1, energy: "chill", time: "short", when: "night",
    area: "James Island", cost: "Free–$25", duration: "~2.5 hrs",
    place: "The Charleston Pour House, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "iop-sunrise",
    title: "Sunrise on Isle of Palms",
    desc: "Set an alarm, bring coffee and a blanket, and watch the sun come up over the ocean.",
    plan: ["Check sunrise time the night before", "Bring coffee and a blanket", "Get breakfast after"],
    tip: "Arrive 20 minutes before sunrise. The sky is best before the sun appears.",
    tier: "send", budget: 0, energy: "active", time: "short", when: "day",
    area: "Isle of Palms", cost: "Free (+ breakfast)", duration: "~2 hrs",
    place: "Isle of Palms County Park, Isle of Palms, SC"
  },
  {
    id: "beach-horseback",
    title: "Horseback ride on the beach",
    desc: "A guided ride along the sand at Seabrook Island.",
    plan: ["Book a guided beach ride", "Wear long pants and closed-toe shoes", "Lunch on Johns Island on the way back"],
    tip: "Rides book up weeks out in spring and fall.",
    tier: "send", budget: 3, energy: "active", time: "half", when: "day",
    area: "Seabrook Island", cost: "~$100+ each", duration: "~3 hrs",
    place: "Seabrook Island Equestrian Center, Seabrook Island, SC", verify: true
  },
  {
    id: "escape-room",
    title: "Escape room",
    desc: "Find out how well you actually work together under pressure.",
    plan: ["Book a room for two", "Agree: no blaming", "Get dinner after and replay it"],
    tip: "Pick a beginner room for your first one.",
    tier: "send", budget: 2, energy: "active", time: "short", when: "night",
    area: "Mount Pleasant", cost: "~$30–40 each", duration: "~1.5 hrs",
    place: "escape room, Mount Pleasant, SC", verify: true,
    rainy: true
  },
  {
    id: "dance-class",
    title: "One-night dance class",
    desc: "Salsa, swing, whatever's on tonight. Nobody's good at the start.",
    plan: ["Find a beginner drop-in class", "Wear shoes that can spin", "Practice one move in the kitchen after"],
    tip: "Drop-in beginner classes are designed for total beginners.",
    tier: "send", budget: 2, energy: "active", time: "short", when: "night",
    area: "Charleston area", cost: "~$20–40 each", duration: "~1.5 hrs",
    place: "dance lessons, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "climbing-gym",
    title: "Try a climbing gym",
    desc: "Rent shoes, learn the basics, and spot each other on the bouldering walls.",
    plan: ["Book an intro session or day pass", "Start on the easiest routes", "Get food after; you'll be hungry"],
    tip: "Bouldering needs no ropes or experience. It's the easiest way to start.",
    tier: "send", budget: 2, energy: "active", time: "short", when: "any",
    area: "Charleston area", cost: "~$25–35 each", duration: "~2 hrs",
    place: "climbing gym, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "pickleball",
    title: "Learn pickleball",
    desc: "Borrow or buy cheap paddles and play on a free public court.",
    plan: ["Get two paddles and a ball", "Find a free public court", "Play to 11, best of three"],
    tip: "Courts are quietest on weekday mornings and early evenings.",
    tier: "send", budget: 0, energy: "active", time: "short", when: "day",
    area: "Mount Pleasant", cost: "Free–$30", duration: "~1.5 hrs",
    place: "pickleball courts, Mount Pleasant, SC"
  },
  {
    id: "ghost-crab-hunt",
    title: "Night beach walk",
    desc: "The beach after dark: stars, waves, and ghost crabs everywhere.",
    plan: ["Go after dark on Sullivan's or IOP", "Bring a red or dim flashlight", "Count ghost crabs and look for stars"],
    tip: "A dim light keeps your night vision and doesn't disturb nesting turtles in summer.",
    tier: "send", budget: 0, energy: "chill", time: "short", when: "night",
    area: "Sullivan's Island", cost: "Free", duration: "~1 hr",
    place: "Sullivan's Island Beach, Sullivan's Island, SC"
  },
  {
    id: "volunteer-together",
    title: "Volunteer together",
    desc: "A beach sweep, food bank shift, or shelter visit. You'll feel great after.",
    plan: ["Find a one-time volunteer shift", "Sign up together", "Get lunch after and talk about it"],
    tip: "Beach sweeps and food banks usually need no training.",
    tier: "send", budget: 0, energy: "active", time: "half", when: "day",
    area: "Charleston area", cost: "Free", duration: "~3 hrs",
    place: "volunteer opportunities, Charleston, SC", verify: true
  },
  {
    id: "open-mic",
    title: "Open mic night",
    desc: "Watch an open mic at a coffee shop or café. If you're brave, one of you signs up.",
    plan: ["Find an open mic", "Watch the first half", "Dare each other to sign up"],
    tip: "Get there early if you want a slot.",
    tier: "send", budget: 0, energy: "active", time: "short", when: "night",
    area: "Charleston area", cost: "Free", duration: "~2 hrs",
    place: "open mic, Charleston, SC", verify: true
  },
  {
    id: "pottery-class",
    title: "Pottery class",
    desc: "Make a pair of lopsided mugs together. Use them forever.",
    plan: ["Book a couples or intro wheel class", "Wear clothes that can get muddy", "Pick up your mugs after they're fired"],
    tip: "Pieces usually take a couple of weeks to fire and glaze.",
    tier: "send", budget: 3, energy: "chill", time: "short", when: "any",
    area: "Charleston area", cost: "~$50+ each", duration: "~2 hrs",
    place: "pottery class, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "beach-cruisers",
    title: "Beach cruiser bike ride",
    desc: "Rent bikes and ride the hard sand at low tide on Isle of Palms.",
    plan: ["Check the tide chart", "Rent cruisers", "Ride the beach at low tide"],
    tip: "Ride within a couple hours of low tide, when the sand is hard and flat.",
    tier: "send", budget: 2, energy: "active", time: "half", when: "day",
    area: "Isle of Palms", cost: "~$25 each", duration: "~3 hrs",
    place: "bike rental, Isle of Palms, SC", verify: true
  },
  {
    id: "fort-moultrie",
    title: "Fort Moultrie + Breach Inlet",
    desc: "Explore the old fort on Sullivan's, then watch for dolphins at Breach Inlet.",
    plan: ["Explore Fort Moultrie", "Drive to Breach Inlet", "Watch for dolphins"],
    tip: "Check the fort's hours. It's run by the National Park Service.",
    tier: "send", budget: 0, energy: "chill", time: "short", when: "day",
    area: "Sullivan's Island", cost: "Free–$10", duration: "~2 hrs",
    place: "Fort Moultrie, Sullivan's Island, SC", verify: true
  },
  {
    id: "paddleboard",
    title: "Paddleboard lesson",
    desc: "Rent boards or take a quick lesson on the calm water behind Folly.",
    plan: ["Book a rental or lesson", "Paddle on the calm river side", "Lunch on Folly after"],
    tip: "Mornings usually have the calmest water and least wind.",
    tier: "send", budget: 2, energy: "active", time: "half", when: "day",
    area: "Folly Beach", cost: "~$40+ each", duration: "~3 hrs",
    place: "paddleboard rental, Folly Beach, SC", verify: true
  },
  {
    id: "music-hall-show",
    title: "Concert at Charleston Music Hall",
    desc: "Pick a show you'd never normally go to and get dressed up for it.",
    plan: ["Pick a show from the calendar", "Dinner nearby first", "Walk King Street after"],
    tip: "Balcony seats are cheaper and still have a good view.",
    tier: "send", budget: 3, energy: "chill", time: "short", when: "night",
    area: "Downtown", cost: "~$40–80 each", duration: "~3 hrs",
    place: "Charleston Music Hall, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "edisto-day-trip",
    title: "Edisto Beach day trip",
    desc: "A sleepy, old-school beach town about an hour away. Hunt for shells and fossils.",
    plan: ["Drive down Highway 174", "Beach and shell hunting", "Seafood on the way home"],
    tip: "The state park beach is great for finding fossilized shark teeth.",
    tier: "send", budget: 1, energy: "chill", time: "full", when: "day",
    area: "Edisto Beach", cost: "~$30 + gas", duration: "All day",
    place: "Edisto Beach State Park, SC", verify: true
  },
  {
    id: "kiawah-day",
    title: "Kiawah beach + Freshfields",
    desc: "Beachwalker Park in the morning, then lunch and a wander around Freshfields Village.",
    plan: ["Morning at Beachwalker Park", "Lunch at Freshfields Village", "Browse the shops after"],
    tip: "Beachwalker has paid parking that fills up on summer weekends.",
    tier: "send", budget: 2, energy: "chill", time: "full", when: "day",
    area: "Kiawah Island", cost: "~$60", duration: "~6 hrs",
    place: "Beachwalker Park, Kiawah Island, SC", verify: true
  },
  {
    id: "fishing-charter",
    title: "Inshore fishing charter",
    desc: "A captain takes you into the creeks for redfish. No experience needed.",
    plan: ["Book a half-day inshore charter", "Bring sunscreen, snacks, and drinks", "Take a photo with your best catch"],
    tip: "Charters usually supply rods, bait, and licenses. Ask when you book.",
    tier: "send", budget: 3, energy: "active", time: "half", when: "day",
    area: "Charleston area", cost: "$300+ total", duration: "~4 hrs",
    place: "inshore fishing charter, Charleston, SC", verify: true
  },
  {
    id: "boat-day",
    title: "Rent a boat for the day",
    desc: "A pontoon, a cooler, and a sandbar. The most Lowcountry day possible.",
    plan: ["Rent a pontoon boat", "Pack lunch and drinks", "Find a sandbar at low tide"],
    tip: "Ask the rental place where the good sandbars are and when the tide turns.",
    tier: "send", budget: 3, energy: "chill", time: "full", when: "day",
    area: "Charleston area", cost: "$300+", duration: "All day",
    place: "boat rental, Charleston, SC", verify: true, months: [4, 5, 6, 7, 8, 9, 10]
  },
  /* ================= MORE: STAY IN ================= */
  {
    id: "co-op-video-game",
    title: "Co-op video game night",
    desc: "Play a game where you have to work together, like It Takes Two or Overcooked.",
    plan: ["Pick a two-player co-op game", "Snacks within arm's reach", "Play until someone rage-quits"],
    tip: "It Takes Two was literally made for couples. Overcooked will test your relationship.",
    tier: "in", budget: 0, energy: "lazy", time: "short", when: "night",
    area: "Home", cost: "Free if you own one", duration: "~2 hrs"
  },
  {
    id: "homemade-pasta",
    title: "Make pasta from scratch",
    desc: "Flour, eggs, and a rolling pin. It's easier than it looks and way better than the box.",
    plan: ["Mix the dough and let it rest 30 minutes", "Roll it out and cut wide noodles", "Toss with butter, parmesan, and black pepper"],
    tip: "No pasta machine? A clean glass bottle works as a rolling pin.",
    tier: "in", budget: 1, energy: "chill", time: "half", when: "night",
    area: "Home", cost: "~$15", duration: "~2.5 hrs"
  },
  {
    id: "ramen-upgrade",
    title: "Instant ramen upgrade challenge",
    desc: "Each of you gets one pack of ramen and ten minutes to make it fancy.",
    plan: ["Raid the fridge for toppings", "Ten-minute timer, then cook", "Taste each other's and pick a winner"],
    tip: "A soft-boiled egg and a little butter in the broth wins every time.",
    tier: "in", budget: 0, energy: "lazy", time: "short", when: "night",
    area: "Home", cost: "~$5", duration: "~45 min"
  },
  {
    id: "no-churn-ice-cream",
    title: "Make no-churn ice cream",
    desc: "Two ingredients, no machine, and you get to pick the weird mix-ins.",
    plan: ["Whip cream and fold in sweetened condensed milk", "Each pick a mix-in for half the tub", "Freeze, then taste test that night"],
    tip: "Crushed Oreos and a swirl of peanut butter is a safe bet.",
    tier: "in", budget: 1, energy: "chill", time: "short", when: "day",
    area: "Home", cost: "~$12", duration: "~30 min + freezing"
  },
  {
    id: "short-film-festival",
    title: "Home short-film festival",
    desc: "Each pick three short films online, then hand out awards.",
    plan: ["Each find three short films under 15 minutes", "Watch them in alternating order", "Hand out awards for best and worst"],
    tip: "Pixar shorts and Oscar-nominated shorts are a good place to start.",
    tier: "in", budget: 0, energy: "lazy", time: "short", when: "night",
    area: "Home", cost: "Free", duration: "~1.5 hrs"
  },
  {
    id: "lego-build",
    title: "Build a Lego set together",
    desc: "Pick a set you both like and split the bags.",
    plan: ["Pick a set at the store together", "Split the steps, one bag each", "Put it somewhere you'll both see it"],
    tip: "The botanical and flower sets look good on a shelf after.",
    tier: "in", budget: 2, energy: "chill", time: "half", when: "any",
    area: "Home", cost: "~$50", duration: "~3 hrs"
  },
  {
    id: "paint-by-numbers",
    title: "Paint-by-numbers night",
    desc: "Low pressure, weirdly relaxing, and you end up with something to hang.",
    plan: ["Get one kit to share or two small ones", "Put on a podcast or playlist", "Work on it a little each night this week"],
    tip: "Do the darkest colors first. It goes faster.",
    tier: "in", budget: 1, energy: "lazy", time: "half", when: "any",
    area: "Home", cost: "~$20", duration: "~3 hrs"
  },
  {
    id: "snack-ranking",
    title: "Blind snack ranking",
    desc: "Buy five versions of one snack and rank them blind. Very serious business.",
    plan: ["Pick a snack: chips, frozen pizza, salsa, cookies", "Buy five brands", "Blindfold taste and rank them"],
    tip: "Store brands win more often than you'd think.",
    tier: "in", budget: 1, energy: "lazy", time: "short", when: "night",
    area: "Home", cost: "~$20", duration: "~1 hr"
  },
  {
    id: "copycat-dish",
    title: "Recreate a restaurant favorite",
    desc: "Pick a dish you always order out and try to make it at home.",
    plan: ["Pick a dish you both love from a restaurant", "Find a copycat recipe", "Rate it against the real thing"],
    tip: "Search the dish name plus 'copycat recipe'.",
    tier: "in", budget: 2, energy: "chill", time: "half", when: "night",
    area: "Home", cost: "~$35", duration: "~2.5 hrs"
  },
  {
    id: "two-person-book-club",
    title: "Two-person book club",
    desc: "Read the same short book this week, then talk about it over dinner.",
    plan: ["Pick a short book or a long article", "Read it on your own this week", "Make dinner and talk it over"],
    tip: "Pick something under 200 pages so you both actually finish.",
    tier: "in", budget: 0, energy: "lazy", time: "short", when: "night",
    area: "Home", cost: "Free (library)", duration: "~1.5 hrs"
  },
  {
    id: "crossword-coffee",
    title: "Crossword + coffee in bed",
    desc: "A slow morning with coffee and a crossword you solve together.",
    plan: ["One of you makes coffee", "Do a crossword together", "No phones until it's done"],
    tip: "Monday puzzles are the easiest. Saturday is brutal.",
    tier: "in", budget: 0, energy: "lazy", time: "short", when: "day",
    area: "Home", cost: "Free", duration: "~1 hr"
  },
  {
    id: "bucket-list-night",
    title: "Make a bucket list",
    desc: "Write down 20 things you want to do together, then plan the first one.",
    plan: ["Each write ten things on your own", "Swap lists and combine them", "Pick one and put it on the calendar"],
    tip: "Mix small stuff (try a new restaurant) with big stuff (a trip).",
    tier: "in", budget: 0, energy: "lazy", time: "short", when: "any",
    area: "Home", cost: "Free", duration: "~1 hr"
  },
  {
    id: "dream-trip-plan",
    title: "Plan a dream trip",
    desc: "Pick a place you'd love to go and plan the whole trip like it's real.",
    plan: ["Each pitch one destination", "Pick one and build a day-by-day plan", "Price it out and start a savings jar"],
    tip: "It's more fun if you actually go. Set a rough date.",
    tier: "in", budget: 0, energy: "lazy", time: "short", when: "night",
    area: "Home", cost: "Free", duration: "~1.5 hrs"
  },
  {
    id: "massage-night",
    title: "Candles + massage night",
    desc: "Take turns giving each other a real massage, with candles and a playlist.",
    plan: ["Candles on, lights off", "Pick a slow playlist", "20 minutes each, timer on"],
    tip: "Warm the lotion in your hands first.",
    tier: "in", budget: 0, energy: "lazy", time: "short", when: "night",
    area: "Home", cost: "Free", duration: "~1 hr"
  },
  {
    id: "tie-dye",
    title: "Tie-dye matching shirts",
    desc: "Make matching shirts in the backyard. Wear them somewhere public.",
    plan: ["Buy a kit and two white shirts", "Dye them outside", "Let them set overnight and wear them the next day"],
    tip: "Wear gloves. The dye stays on your hands for days.",
    tier: "in", budget: 1, energy: "chill", time: "half", when: "day",
    area: "Home (outside)", cost: "~$25", duration: "~2 hrs"
  },
  {
    id: "candle-making",
    title: "Make candles at home",
    desc: "Soy wax, a few scents, and old jars. You end up with candles you'll actually use.",
    plan: ["Get a soy wax kit and some jars", "Each make one scent", "Light them the next night"],
    tip: "Let them cure for a day before burning for a better smell.",
    tier: "in", budget: 1, energy: "chill", time: "short", when: "night",
    area: "Home", cost: "~$25", duration: "~1.5 hrs"
  },
  {
    id: "breakfast-in-bed",
    title: "Breakfast in bed",
    desc: "One of you cooks, the other stays in bed. Next weekend you switch.",
    plan: ["Flip a coin for who cooks", "Bring it to bed on a tray", "Switch next weekend"],
    tip: "Toast, eggs, fruit, and coffee is plenty. Don't overthink it.",
    tier: "in", budget: 0, energy: "lazy", time: "short", when: "day",
    area: "Home", cost: "~$10", duration: "~1 hr"
  },
  {
    id: "game-day-wings",
    title: "Big game + homemade wings",
    desc: "Pick a game to watch and make wings from scratch. Pick a team even if you don't care.",
    plan: ["Pick a game and each pick a side", "Bake or air-fry wings with two sauces", "Loser does the dishes"],
    tip: "Baking powder on the wings makes them crispy in the oven.",
    tier: "in", budget: 1, energy: "lazy", time: "short", when: "night",
    area: "Home", cost: "~$25", duration: "~3 hrs"
  },
  {
    id: "home-yoga",
    title: "Morning yoga + smoothies",
    desc: "A 30-minute yoga video together, then smoothies on the porch.",
    plan: ["Pick a beginner yoga video", "Do it together in the living room", "Make smoothies after"],
    tip: "Partner yoga videos are funny and a little hard.",
    tier: "in", budget: 0, energy: "active", time: "short", when: "day",
    area: "Home", cost: "Free", duration: "~1 hr"
  },
  {
    id: "car-wash-date",
    title: "Wash the car + drive-thru dinner",
    desc: "Wash and clean out the car together, then take it out for a drive-thru reward.",
    plan: ["Wash the outside together", "Clean out the inside (finally)", "Drive somewhere for milkshakes"],
    tip: "A playlist and a hose fight are mandatory.",
    tier: "in", budget: 0, energy: "active", time: "short", when: "day",
    area: "Home", cost: "~$10", duration: "~2 hrs"
  },
  {
    id: "grandma-recipe",
    title: "Cook a family recipe",
    desc: "Get a recipe from one of your grandparents or parents and make it together.",
    plan: ["Call a family member for a recipe", "Shop and cook it together", "Send them a photo of how it turned out"],
    tip: "Ask them to stay on the phone while you cook. They'll love it.",
    tier: "in", budget: 1, energy: "chill", time: "short", when: "night",
    area: "Home", cost: "~$20", duration: "~2 hrs"
  },
  {
    id: "disposable-camera",
    title: "Disposable camera day",
    desc: "Each get a disposable camera and shoot one ordinary day. Develop them and laugh.",
    plan: ["Buy two disposable cameras", "Take every picture of each other", "Get them developed and look through them together"],
    tip: "Most drugstores can still develop them, or mail them out.",
    tier: "ease", budget: 2, energy: "chill", time: "full", when: "any",
    area: "Anywhere", cost: "~$40 with developing", duration: "All day"
  },

  /* ================= MORE: EASE OUT ================= */
  {
    id: "water-taxi",
    title: "Water taxi across the harbor",
    desc: "A cheap boat ride from Mount Pleasant to downtown. Get off, walk around, ride back.",
    plan: ["Catch the water taxi near Patriots Point", "Ride across to the Aquarium Wharf", "Walk Waterfront Park, then ride back"],
    tip: "It's one of the cheapest ways to get out on the harbor.",
    tier: "ease", budget: 1, energy: "lazy", time: "short", when: "day",
    area: "Mount Pleasant ↔ Downtown", cost: "~$15 each", duration: "~2 hrs",
    place: "Charleston Water Taxi, Mount Pleasant, SC", verify: true
  },
  {
    id: "brittlebank-sunset",
    title: "Sunset at Brittlebank Park",
    desc: "A quiet riverfront park downtown with a great view of the sunset over the Ashley.",
    plan: ["Grab takeout", "Find a spot on the water", "Stay until the lights come on across the river"],
    tip: "It's much quieter than Waterfront Park.",
    tier: "ease", budget: 0, energy: "lazy", time: "short", when: "night",
    area: "Downtown", cost: "Free", duration: "~1.5 hrs",
    place: "Brittlebank Park, Charleston, SC"
  },
  {
    id: "white-point-picnic",
    title: "Picnic at White Point Garden",
    desc: "Big oaks, old cannons, and harbor views at the tip of the peninsula.",
    plan: ["Pack sandwiches and a blanket", "Picnic under the oaks", "Walk along the Battery wall after"],
    tip: "Street parking on the surrounding blocks is free on Sundays.",
    tier: "ease", budget: 0, energy: "lazy", time: "short", when: "day",
    area: "Downtown", cost: "Free", duration: "~2 hrs",
    place: "White Point Garden, Charleston, SC"
  },
  {
    id: "sullivans-lighthouse",
    title: "Sullivan's lighthouse + sunset",
    desc: "Walk past the odd, triangular Sullivan's lighthouse and watch the sunset from the beach.",
    plan: ["Park near Station 18", "Walk past the lighthouse", "Sunset from the beach path"],
    tip: "It's one of the only triangle-shaped lighthouses in the country.",
    tier: "ease", budget: 0, energy: "chill", time: "short", when: "night",
    area: "Sullivan's Island", cost: "Free", duration: "~1 hr",
    place: "Sullivan's Island Lighthouse, Sullivan's Island, SC"
  },
  {
    id: "riverfront-park-nc",
    title: "North Charleston Riverfront Park",
    desc: "A big, quiet park on the Cooper River with sculptures, a pier, and space to walk.",
    plan: ["Walk the riverfront path", "Find the sculptures", "Dinner in Park Circle after"],
    tip: "Most people have never been. You'll have it mostly to yourselves.",
    tier: "ease", budget: 0, energy: "chill", time: "short", when: "any",
    area: "North Charleston", cost: "Free", duration: "~1.5 hrs",
    place: "Riverfront Park, North Charleston, SC"
  },
  {
    id: "west-ashley-greenway",
    title: "Bike the West Ashley Greenway",
    desc: "A flat, shady trail through West Ashley. Stop for food halfway.",
    plan: ["Bring or rent bikes", "Ride the greenway out and back", "Stop for a bite on the way"],
    tip: "Weekday mornings are the quietest.",
    tier: "ease", budget: 0, energy: "active", time: "half", when: "day",
    area: "West Ashley", cost: "Free", duration: "~3 hrs",
    place: "West Ashley Greenway, Charleston, SC"
  },
  {
    id: "daniel-island",
    title: "Daniel Island evening",
    desc: "Walk the waterfront park, then dinner in the little downtown area.",
    plan: ["Walk the waterfront park at sunset", "Pick a restaurant on the island", "Ice cream on the way home"],
    tip: "It's a 15-minute drive from Mount Pleasant and feels like a different town.",
    tier: "ease", budget: 2, energy: "chill", time: "short", when: "night",
    area: "Daniel Island", cost: "~$50", duration: "~2.5 hrs",
    place: "Daniel Island Waterfront Park, Charleston, SC"
  },
  {
    id: "summerville-day",
    title: "Summerville afternoon",
    desc: "Wander Azalea Park and the little downtown in the birthplace of sweet tea.",
    plan: ["Walk Azalea Park", "Wander the shops downtown", "Get sweet tea and lunch"],
    tip: "Early spring is best when the azaleas bloom.",
    tier: "ease", budget: 1, energy: "chill", time: "half", when: "day",
    area: "Summerville", cost: "~$30", duration: "~3–4 hrs",
    place: "Azalea Park, Summerville, SC"
  },
  {
    id: "charles-towne-landing",
    title: "Charles Towne Landing",
    desc: "Where Charleston started. Trails, a replica ship, and an animal forest with bison and bears.",
    plan: ["Walk the trails along the marsh", "Go through the animal forest", "Picnic by the water"],
    tip: "It's much bigger than people expect. Wear walking shoes.",
    tier: "ease", budget: 1, energy: "active", time: "half", when: "day",
    area: "West Ashley", cost: "~$12 each", duration: "~3 hrs",
    place: "Charles Towne Landing State Historic Site, Charleston, SC", verify: true
  },
  {
    id: "library-date",
    title: "Library date",
    desc: "Wander the stacks, each pick something for the other, and read together for an hour.",
    plan: ["Go to the main library downtown", "Each pick a book for the other", "Read for an hour, then get coffee"],
    tip: "Free, quiet, and air-conditioned on hot days.",
    tier: "ease", budget: 0, energy: "lazy", time: "short", when: "day",
    area: "Downtown", cost: "Free", duration: "~2 hrs",
    place: "Charleston County Public Library Main, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "blue-bicycle-books",
    title: "Used books on King Street",
    desc: "Dig through stacks at Blue Bicycle Books. Each find the weirdest book you can.",
    plan: ["Set a $10 limit each", "Find the strangest book in the store", "Read the best parts out loud over coffee"],
    tip: "The old Charleston books section is fun to browse.",
    tier: "ease", budget: 1, energy: "chill", time: "short", when: "day",
    area: "Downtown", cost: "~$20", duration: "~1.5 hrs",
    place: "Blue Bicycle Books, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "record-store",
    title: "Record store dig",
    desc: "Pick a record for each other based only on the cover.",
    plan: ["Go to a record store", "Each pick an album for the other by cover alone", "Listen to both at home"],
    tip: "Don't own a record player? Buy the CD or stream it after.",
    tier: "ease", budget: 1, energy: "chill", time: "short", when: "day",
    area: "Charleston area", cost: "~$25", duration: "~1.5 hrs",
    place: "record store, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "plant-shop-crawl",
    title: "Plant shop crawl",
    desc: "Hit two or three plant shops and each pick one plant to name together.",
    plan: ["Visit two or three plant shops", "Each pick one plant", "Name them and pot them at home"],
    tip: "Pothos and snake plants are nearly impossible to kill.",
    tier: "ease", budget: 1, energy: "chill", time: "short", when: "day",
    area: "Charleston area", cost: "~$30", duration: "~2 hrs",
    place: "plant shop, Mount Pleasant, SC",
    rainy: true
  },
  {
    id: "crabbing",
    title: "Go crabbing off a dock",
    desc: "String, a chicken neck, and patience. The most Lowcountry date there is.",
    plan: ["Buy chicken necks, string, and a net", "Find a public dock at rising tide", "Count your catch and let them go"],
    tip: "Check SC crabbing rules on size limits if you want to keep any.",
    tier: "ease", budget: 0, energy: "chill", time: "half", when: "day",
    area: "Folly Beach", cost: "~$10", duration: "~3 hrs",
    place: "Folly River Park, Folly Beach, SC"
  },
  {
    id: "pier-fishing",
    title: "Fish off the Mount Pleasant Pier",
    desc: "Rent a rod at the pier, bait up, and see who catches something first.",
    plan: ["Rent rods and bait at the pier", "Pick a spot along the rail", "First catch picks dinner"],
    tip: "Ask the bait shop what's biting. They always know.",
    tier: "ease", budget: 1, energy: "chill", time: "half", when: "any",
    area: "Mount Pleasant", cost: "~$25", duration: "~3 hrs",
    place: "Mount Pleasant Pier, Mount Pleasant, SC", verify: true
  },
  {
    id: "shell-hunting",
    title: "Shell hunting at low tide",
    desc: "Low tide on Sullivan's or IOP, a bag, and see who finds the best shell.",
    plan: ["Check the tide chart", "Walk the beach at low tide", "Pick your best find and keep it on a shelf"],
    tip: "The hour around low tide is when the good stuff shows up.",
    tier: "ease", budget: 0, energy: "chill", time: "short", when: "day",
    area: "Isle of Palms", cost: "Free", duration: "~1.5 hrs",
    place: "Isle of Palms County Park, Isle of Palms, SC"
  },
  {
    id: "waffle-house-midnight",
    title: "Midnight Waffle House",
    desc: "A late drive, a booth, and hashbrowns scattered, smothered, and covered.",
    plan: ["Head out after 11", "Order something off the menu you've never tried", "Play a song on the jukebox if there is one"],
    tip: "It's a classic for a reason. Low effort, high fun.",
    tier: "ease", budget: 1, energy: "lazy", time: "short", when: "night",
    area: "Mount Pleasant", cost: "~$20", duration: "~1 hr",
    place: "Waffle House, Mount Pleasant, SC",
    rainy: true
  },
  {
    id: "biscuit-morning",
    title: "Biscuit breakfast downtown",
    desc: "Hot biscuits from Callie's, then a morning walk around downtown.",
    plan: ["Get there early", "Order a few biscuits to split", "Walk to Waterfront Park to eat them"],
    tip: "The line moves quickly, but go early on weekends.",
    tier: "ease", budget: 1, energy: "lazy", time: "short", when: "day",
    area: "Downtown", cost: "~$20", duration: "~1.5 hrs",
    place: "Callie's Hot Little Biscuit, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "taco-crawl",
    title: "Taco crawl",
    desc: "Three taco spots, one taco each at every stop, and a winner by the end.",
    plan: ["Pick three taco spots near each other", "One taco each at every stop", "Vote on a winner"],
    tip: "Order the same taco everywhere so you can compare.",
    tier: "ease", budget: 1, energy: "chill", time: "short", when: "night",
    area: "Charleston area", cost: "~$30", duration: "~2 hrs",
    place: "tacos, Charleston, SC"
  },
  {
    id: "ice-cream-crawl",
    title: "Ice cream crawl",
    desc: "Two or three ice cream shops, one scoop each, then pick the best.",
    plan: ["Pick two or three spots", "One small scoop each at every stop", "Crown a winner"],
    tip: "Get kids' sizes. You'll want room for the last stop.",
    tier: "ease", budget: 1, energy: "lazy", time: "short", when: "any",
    area: "Mount Pleasant", cost: "~$20", duration: "~1.5 hrs",
    place: "ice cream, Mount Pleasant, SC",
    rainy: true
  },
  {
    id: "new-cuisine",
    title: "Try a cuisine you've never had",
    desc: "Ethiopian, Peruvian, Korean, whatever neither of you has tried. Let the server pick.",
    plan: ["Pick a cuisine neither of you has had", "Ask the server what to order", "Share everything"],
    tip: "Telling the server it's your first time usually gets you great recommendations.",
    tier: "ease", budget: 2, energy: "lazy", time: "short", when: "night",
    area: "Charleston area", cost: "~$50", duration: "~1.5 hrs",
    place: "restaurants, Charleston, SC",
    rainy: true
  },
  {
    id: "food-truck-night",
    title: "Food truck dinner",
    desc: "Find where the food trucks are tonight and order from two of them.",
    plan: ["Check where trucks are parked tonight", "Each order from a different truck", "Swap halfway through"],
    tip: "Most trucks post where they'll be each day on social media.",
    tier: "ease", budget: 1, energy: "lazy", time: "short", when: "night",
    area: "Charleston area", cost: "~$30", duration: "~1.5 hrs",
    place: "food trucks, Charleston, SC"
  },
  {
    id: "outdoor-movie",
    title: "Outdoor movie night",
    desc: "Bring a blanket to a free movie on a lawn somewhere.",
    plan: ["Find an outdoor movie screening", "Pack a blanket and snacks", "Get there early for a good spot"],
    tip: "Parks run these in warmer months. Bring bug spray.",
    tier: "ease", budget: 0, energy: "lazy", time: "short", when: "night",
    area: "Charleston area", cost: "Free", duration: "~2.5 hrs",
    place: "outdoor movie, Charleston, SC", verify: true, months: [4, 5, 6, 7, 8, 9, 10]
  },
  {
    id: "dine-in-theater",
    title: "Dine-in movie",
    desc: "Dinner and a movie at the same time, in a big reclining seat.",
    plan: ["Book reclining seats", "Order dinner from your seat", "Share a dessert at the end"],
    tip: "Order everything at the start so you're not interrupted later.",
    tier: "ease", budget: 2, energy: "lazy", time: "short", when: "night",
    area: "Charleston area", cost: "~$60", duration: "~2.5 hrs",
    place: "dine-in movie theater, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "live-jazz",
    title: "Live jazz night",
    desc: "Find a restaurant or café with live jazz and stay for a set over dinner.",
    plan: ["Find a live jazz listing for tonight", "Get there for the first set", "Order dessert and stay for a second"],
    tip: "Many spots have jazz on weeknights with no cover.",
    tier: "ease", budget: 2, energy: "lazy", time: "short", when: "night",
    area: "Downtown", cost: "~$40", duration: "~2 hrs",
    place: "live jazz, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "mcclellanville",
    title: "McClellanville day trip",
    desc: "A tiny shrimping village up Highway 17. Moss, marsh, and fresh seafood.",
    plan: ["Drive up Highway 17", "Walk the old village", "Seafood lunch by the docks"],
    tip: "It's about 40 minutes from Mount Pleasant and feels like going back in time.",
    tier: "ease", budget: 2, energy: "lazy", time: "full", when: "day",
    area: "McClellanville", cost: "~$50", duration: "~5 hrs",
    place: "McClellanville, SC"
  },
  {
    id: "towne-centre",
    title: "Towne Centre stroll + dinner",
    desc: "Walk the outdoor shops, catch a movie or don't, and get dinner.",
    plan: ["Walk the shops with no plan to buy", "Pick a place for dinner", "Movie if you're feeling it"],
    tip: "Good for a rainy-ish day when the beach isn't an option.",
    tier: "ease", budget: 2, energy: "lazy", time: "short", when: "night",
    area: "Mount Pleasant", cost: "~$50", duration: "~2.5 hrs",
    place: "Mount Pleasant Towne Centre, Mount Pleasant, SC"
  },
  {
    id: "parade-of-boats",
    title: "Holiday Parade of Boats",
    desc: "Boats covered in Christmas lights parading across the harbor.",
    plan: ["Find the parade date and route", "Grab a spot by the water with cocoa", "Dinner nearby after"],
    tip: "Get there early. The good viewing spots fill up.",
    tier: "ease", budget: 0, energy: "lazy", time: "short", when: "night",
    area: "Charleston Harbor", cost: "Free", duration: "~2 hrs",
    place: "Waterfront Park, Charleston, SC", verify: true, months: [12]
  },
  {
    id: "holiday-market",
    title: "Holiday market + lights downtown",
    desc: "Shop the holiday market, then walk King Street looking at the lights.",
    plan: ["Walk the holiday market", "Each buy the other a small gift", "Walk King Street and see the decorations"],
    tip: "Set a gift budget first so it stays fun.",
    tier: "ease", budget: 1, energy: "chill", time: "short", when: "night",
    area: "Downtown", cost: "~$30", duration: "~2 hrs",
    place: "Marion Square, Charleston, SC", verify: true, months: [11, 12]
  },

  /* ================= MORE: FULL SEND ================= */
  {
    id: "bulls-island",
    title: "Ferry to Bulls Island",
    desc: "A boat ride to a wild barrier island with a beach full of bleached, fallen trees.",
    plan: ["Book the ferry ahead", "Pack lunch, water, and bug spray", "Walk to Boneyard Beach"],
    tip: "There's nothing on the island. Bring everything you need.",
    tier: "send", budget: 2, energy: "active", time: "full", when: "day",
    area: "Awendaw", cost: "~$40+ each", duration: "All day",
    place: "Coastal Expeditions Bulls Island Ferry, Awendaw, SC", verify: true
  },
  {
    id: "congaree",
    title: "Hike Congaree National Park",
    desc: "A national park two hours away with a boardwalk through giant old-growth trees.",
    plan: ["Leave early", "Walk the boardwalk loop", "Get dinner in Columbia on the way back"],
    tip: "Entry is free. In late spring, look up the synchronous fireflies event.",
    tier: "send", budget: 0, energy: "active", time: "full", when: "day",
    area: "Congaree", cost: "Free (+ gas)", duration: "All day",
    place: "Congaree National Park, Hopkins, SC", verify: true
  },
  {
    id: "riverbanks-zoo",
    title: "Riverbanks Zoo day trip",
    desc: "One of the best zoos in the South, about two hours away in Columbia.",
    plan: ["Leave by 9", "Spend the day at the zoo and gardens", "Dinner in Columbia before driving home"],
    tip: "The botanical garden across the river is included.",
    tier: "send", budget: 2, energy: "chill", time: "full", when: "day",
    area: "Columbia", cost: "~$30 each + gas", duration: "All day",
    place: "Riverbanks Zoo and Garden, Columbia, SC", verify: true
  },
  {
    id: "zipline",
    title: "Zipline course",
    desc: "Treetop lines and wobbly bridges. You'll both scream at least once.",
    plan: ["Book a zipline tour", "Wear closed-toe shoes", "Celebrate with lunch after"],
    tip: "Book the earliest slot so it isn't hot.",
    tier: "send", budget: 3, energy: "active", time: "half", when: "day",
    area: "Charleston area", cost: "~$60+ each", duration: "~3 hrs",
    place: "zipline, Charleston, SC", verify: true
  },
  {
    id: "axe-throwing",
    title: "Axe throwing",
    desc: "Throw axes at a wall. It's more satisfying than it should be.",
    plan: ["Book a lane for two", "Get the quick lesson", "Play a few games, loser buys dinner"],
    tip: "Most places teach you in five minutes. No experience needed.",
    tier: "send", budget: 2, energy: "active", time: "short", when: "night",
    area: "Charleston area", cost: "~$25–35 each", duration: "~1.5 hrs",
    place: "axe throwing, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "go-karts",
    title: "Go-karts",
    desc: "Race each other. Trash talk encouraged.",
    plan: ["Find a go-kart track", "Race three laps", "Loser buys dessert"],
    tip: "Best of three settles it.",
    tier: "send", budget: 2, energy: "active", time: "short", when: "any",
    area: "Charleston area", cost: "~$20 each", duration: "~1.5 hrs",
    place: "go karts, Charleston, SC", verify: true
  },
  {
    id: "cooking-class",
    title: "Couples cooking class",
    desc: "A chef teaches you a full meal, then you eat it.",
    plan: ["Book a couples or date-night class", "Cook alongside a chef", "Recreate one dish at home next week"],
    tip: "Look for 'date night' classes. They're made for this.",
    tier: "send", budget: 3, energy: "chill", time: "short", when: "night",
    area: "Charleston area", cost: "~$80+ each", duration: "~2.5 hrs",
    place: "cooking class, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "candle-class",
    title: "Candle-making class",
    desc: "Blend your own scent at a candle studio and take it home.",
    plan: ["Book a pour session", "Each make your own scent", "Name them after each other"],
    tip: "Smell every option before you pick. It takes longer than you'd think.",
    tier: "send", budget: 2, energy: "chill", time: "short", when: "any",
    area: "Charleston area", cost: "~$40 each", duration: "~1.5 hrs",
    place: "candle making class, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "gaillard-show",
    title: "Show at the Gaillard Center",
    desc: "A big touring show or performance at Charleston's main performing arts hall.",
    plan: ["Look at what's coming up", "Get tickets", "Dress up and get dinner before"],
    tip: "Cheaper seats still have a good view in this hall.",
    tier: "send", budget: 3, energy: "lazy", time: "short", when: "night",
    area: "Downtown", cost: "~$50–100 each", duration: "~3 hrs",
    place: "Charleston Gaillard Center, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "dock-street",
    title: "A play at Dock Street Theatre",
    desc: "A small, historic theater downtown. Very pretty inside.",
    plan: ["Check what's playing", "Dinner nearby before", "Walk the French Quarter after"],
    tip: "It's one of the oldest theater sites in America.",
    tier: "send", budget: 2, energy: "lazy", time: "short", when: "night",
    area: "Downtown", cost: "~$35+ each", duration: "~2.5 hrs",
    place: "Dock Street Theatre, Charleston, SC", verify: true,
    rainy: true
  },
  {
    id: "spoleto",
    title: "Spoleto Festival show",
    desc: "Charleston's big arts festival. Pick a show you'd never normally see.",
    plan: ["Look through the festival lineup", "Pick something new to both of you", "Dinner downtown after"],
    tip: "There are cheaper and free events too, not just big shows.",
    tier: "send", budget: 2, energy: "chill", time: "short", when: "night",
    area: "Downtown", cost: "~$30–80 each", duration: "~3 hrs",
    place: "Spoleto Festival USA, Charleston, SC", verify: true, months: [5, 6]
  },
  {
    id: "bridge-run",
    title: "Train for the Bridge Run",
    desc: "Sign up for the Cooper River Bridge Run and train for it together.",
    plan: ["Sign up together", "Walk or run three times a week", "Do it on race day and celebrate"],
    tip: "You can walk the whole thing. Plenty of people do.",
    tier: "send", budget: 2, energy: "active", time: "short", when: "day",
    area: "Mount Pleasant → Downtown", cost: "~$50 each", duration: "~1 hr per session",
    place: "Cooper River Bridge Run, Charleston, SC", verify: true, months: [1, 2, 3, 4]
  },
  {
    id: "stadium-concert",
    title: "Concert at Credit One Stadium",
    desc: "An outdoor concert on Daniel Island. Bring a blanket for the lawn.",
    plan: ["Check the concert calendar", "Get lawn tickets", "Eat on Daniel Island before"],
    tip: "Lawn tickets are cheaper and more relaxed.",
    tier: "send", budget: 3, energy: "chill", time: "half", when: "night",
    area: "Daniel Island", cost: "~$50+ each", duration: "~4 hrs",
    place: "Credit One Stadium, Charleston, SC", verify: true, months: [3, 4, 5, 6, 7, 8, 9, 10]
  },
  {
    id: "sunset-paddle",
    title: "Sunset paddle tour",
    desc: "A guided kayak or paddleboard tour timed for sunset over the marsh.",
    plan: ["Book a sunset tour", "Bring a dry bag for phones", "Dinner on the water after"],
    tip: "Sunset tours book up first. Reserve a few days ahead.",
    tier: "send", budget: 2, energy: "active", time: "short", when: "night",
    area: "Mount Pleasant", cost: "~$50+ each", duration: "~2 hrs",
    place: "sunset kayak tour, Mount Pleasant, SC", verify: true, months: [4, 5, 6, 7, 8, 9, 10]
  },
  {
    id: "trampoline-park",
    title: "Trampoline park",
    desc: "Feel ten years old for an hour. Dodgeball is mandatory.",
    plan: ["Book an adult session if they have one", "Jump, dodgeball, foam pit", "Get milkshakes after"],
    tip: "Some places have adults-only nights. Worth checking.",
    tier: "send", budget: 1, energy: "active", time: "short", when: "any",
    area: "Charleston area", cost: "~$25 each", duration: "~1.5 hrs",
    place: "trampoline park, Charleston, SC", verify: true,
    rainy: true
  },
  /* ================= NORTH CHARLESTON & SUMMERVILLE ================= */
  {
    id: "park-circle-film",
    title: "Indie movie at Park Circle Film Society",
    desc: "A small nonprofit theater in Park Circle that shows indie and cult movies.",
    plan: ["Check what's showing this week", "Dinner on East Montague first", "Talk about the movie over dessert after"],
    tip: "They do themed screenings and old favorites, not just new releases.",
    tier: "ease", budget: 1, energy: "lazy", time: "short", when: "night",
    area: "Park Circle (N. Charleston)", cost: "~$25", duration: "~2.5 hrs",
    place: "Park Circle Film Society, North Charleston, SC", verify: true, rainy: true
  },
  {
    id: "nc-performing-arts",
    title: "Show at the North Charleston PAC",
    desc: "Touring Broadway shows, comedians, and concerts, right in North Charleston.",
    plan: ["Look at what's coming up", "Get tickets", "Dinner nearby before"],
    tip: "Weeknight shows are usually cheaper.",
    tier: "send", budget: 3, energy: "lazy", time: "short", when: "night",
    area: "North Charleston", cost: "~$50–100 each", duration: "~3 hrs",
    place: "North Charleston Performing Arts Center, North Charleston, SC", verify: true, rainy: true
  },
  {
    id: "coliseum-event",
    title: "Whatever's on at the Coliseum",
    desc: "Pick something random at the North Charleston Coliseum: a concert, a show, or a monster truck rally.",
    plan: ["Look at the event calendar", "Pick the most random thing on it", "Go all in on the experience"],
    tip: "The weirder the event, the better the story.",
    tier: "send", budget: 2, energy: "chill", time: "short", when: "night",
    area: "North Charleston", cost: "~$30–60 each", duration: "~3 hrs",
    place: "North Charleston Coliseum, North Charleston, SC", verify: true, rainy: true
  },
  {
    id: "tanger-outlets",
    title: "Outlet stroll + pretzels",
    desc: "Walk the outlets with a small budget each and grab a snack halfway.",
    plan: ["Set a $25 budget each", "Find one thing for the other person", "Pretzels or coffee halfway through"],
    tip: "Weekday evenings are calm. Weekends get packed.",
    tier: "ease", budget: 2, energy: "chill", time: "short", when: "any",
    area: "North Charleston", cost: "~$50", duration: "~2 hrs",
    place: "Tanger Outlets, North Charleston, SC", verify: true
  },
  {
    id: "wannamaker-park",
    title: "Wannamaker Park walk + picnic",
    desc: "A big county park in North Charleston with trails, a lake, and plenty of picnic spots.",
    plan: ["Pack a picnic", "Walk the paved loop", "Eat by the water"],
    tip: "Small entry fee per person. Bring cash or a card.",
    tier: "ease", budget: 0, energy: "chill", time: "short", when: "day",
    area: "North Charleston", cost: "~$2 each", duration: "~2 hrs",
    place: "Wannamaker County Park, North Charleston, SC", verify: true
  },
  {
    id: "whirlin-waters",
    title: "Whirlin' Waters water park",
    desc: "Slides, a lazy river, and feeling twelve again on a hot summer day.",
    plan: ["Go on a weekday if you can", "Lazy river first, slides after", "Get ice cream on the way home"],
    tip: "Get there at opening for the shortest lines.",
    tier: "send", budget: 2, energy: "active", time: "half", when: "day",
    area: "North Charleston", cost: "~$30 each", duration: "~4 hrs",
    place: "Whirlin' Waters Adventure Waterpark, North Charleston, SC", verify: true, months: [6, 7, 8]
  },
  {
    id: "nc-arts-fest",
    title: "North Charleston Arts Fest",
    desc: "A free spring arts festival with music, art, and food around North Charleston.",
    plan: ["Look at the event schedule", "Pick two or three things to see", "Get food from a vendor"],
    tip: "A lot of it is free. Check the schedule for the big events.",
    tier: "ease", budget: 0, energy: "chill", time: "half", when: "any",
    area: "North Charleston", cost: "Free–$", duration: "~3 hrs",
    place: "North Charleston Arts Fest, North Charleston, SC", verify: true, months: [5]
  },
  {
    id: "montague-brunch",
    title: "Park Circle brunch",
    desc: "A slow brunch on East Montague, then a walk around the neighborhood.",
    plan: ["Pick a brunch spot on East Montague", "Order one sweet, one savory, and share", "Walk the park after"],
    tip: "Close to her place, so no one has a long drive.",
    tier: "ease", budget: 2, energy: "lazy", time: "short", when: "day",
    area: "Park Circle (N. Charleston)", cost: "~$40", duration: "~1.5 hrs",
    place: "East Montague Avenue, North Charleston, SC", rainy: true
  },
  {
    id: "summerville-farmers-market",
    title: "Summerville farmers market",
    desc: "A Saturday morning market in Summerville. Breakfast, then ingredients for dinner.",
    plan: ["Get coffee and breakfast there", "Buy ingredients for one dinner", "Cook it together that night"],
    tip: "Go early for the best stuff.",
    tier: "ease", budget: 1, energy: "chill", time: "short", when: "day",
    area: "Summerville", cost: "~$30", duration: "~2 hrs",
    place: "Summerville Farmers Market, Summerville, SC", verify: true, months: [4, 5, 6, 7, 8, 9, 10, 11]
  },
  {
    id: "colonial-dorchester",
    title: "Colonial Dorchester ruins",
    desc: "Old fort walls and a church tower by the Ashley River, just outside Summerville.",
    plan: ["Walk the trail through the ruins", "Sit by the river", "Lunch in Summerville after"],
    tip: "It's small and quiet. Good for a short walk and a long talk.",
    tier: "ease", budget: 1, energy: "chill", time: "short", when: "day",
    area: "Summerville", cost: "~$5 each", duration: "~1.5 hrs",
    place: "Colonial Dorchester State Historic Site, Summerville, SC", verify: true
  },
  {
    id: "edisto-river-float",
    title: "Float the Edisto River",
    desc: "Tubes, a slow black-water river, and a cooler. A whole summer afternoon.",
    plan: ["Book with a tube outfitter near Givhans Ferry", "Pack snacks and drinks in a dry bag", "Float for a few hours"],
    tip: "Wear water shoes and lots of sunscreen.",
    tier: "send", budget: 2, energy: "chill", time: "half", when: "day",
    area: "Ridgeville", cost: "~$25 each", duration: "~4 hrs",
    place: "Givhans Ferry State Park, Ridgeville, SC", verify: true, months: [5, 6, 7, 8, 9]
  },
  {
    id: "downtown-summerville-dinner",
    title: "Downtown Summerville dinner",
    desc: "A small-town Main Street evening. Dinner, a walk, and dessert.",
    plan: ["Pick a restaurant downtown", "Walk around Hutchinson Square", "Dessert or coffee before heading home"],
    tip: "Easy to do right after her shift.",
    tier: "ease", budget: 2, energy: "lazy", time: "short", when: "night",
    area: "Summerville", cost: "~$50", duration: "~2 hrs",
    place: "Hutchinson Square, Summerville, SC", rainy: true
  },
  {
    id: "old-santee-canal",
    title: "Old Santee Canal Park",
    desc: "Boardwalks through swamp and woods in Moncks Corner, with canoes you can rent.",
    plan: ["Walk the boardwalk", "Rent a canoe if it's open", "Picnic by the water"],
    tip: "Look for turtles and gators from the boardwalk.",
    tier: "ease", budget: 1, energy: "active", time: "half", when: "day",
    area: "Moncks Corner", cost: "~$5–10 each", duration: "~3 hrs",
    place: "Old Santee Canal Park, Moncks Corner, SC", verify: true
  },

  /* ================= MOUNT PLEASANT ================= */
  {
    id: "pitt-street-pharmacy",
    title: "Old soda fountain in the Old Village",
    desc: "Milkshakes and grilled cheese at the counter of an old-school pharmacy soda fountain.",
    plan: ["Sit at the counter", "Split a milkshake", "Walk to the Pitt Street Bridge after"],
    tip: "It's a lunch spot, not a dinner spot. Check the hours.",
    tier: "ease", budget: 1, energy: "lazy", time: "short", when: "day",
    area: "Mount Pleasant (Old Village)", cost: "~$20", duration: "~1 hr",
    place: "Pitt Street Pharmacy, Mount Pleasant, SC", verify: true, rainy: true
  },
  {
    id: "mtp-farmers-market",
    title: "Mount Pleasant farmers market",
    desc: "An afternoon market with local food, produce, and snacks.",
    plan: ["Graze through the food stands", "Buy one thing to cook later", "Take a walk after"],
    tip: "It runs on a weekday afternoon in the warmer months. Check the day.",
    tier: "ease", budget: 1, energy: "chill", time: "short", when: "day",
    area: "Mount Pleasant", cost: "~$25", duration: "~1.5 hrs",
    place: "Mount Pleasant Farmers Market, Mount Pleasant, SC", verify: true, months: [4, 5, 6, 7, 8, 9, 10]
  },
  {
    id: "boone-hall-market",
    title: "Boone Hall Farms market",
    desc: "A big farm market in Mount Pleasant with a café, local goods, and u-pick in season.",
    plan: ["Wander the market", "Grab lunch at the café", "Do u-pick if something's in season"],
    tip: "Strawberry picking in spring is the best time to go.",
    tier: "ease", budget: 1, energy: "chill", time: "short", when: "day",
    area: "Mount Pleasant", cost: "~$25", duration: "~1.5 hrs",
    place: "Boone Hall Farms, Mount Pleasant, SC", verify: true
  },

  /* ================= AFTER WORK / MEET IN THE MIDDLE ================= */
  {
    id: "trader-joes-challenge",
    title: "$20 grocery dinner challenge",
    desc: "Each of you gets $20 at the grocery store to put together half of a dinner.",
    plan: ["Split up in the store with $20 each", "One does dinner, one does dessert and snacks", "Picnic at a park or eat in the car with the windows down"],
    tip: "Trader Joe's is perfect for this. So is any store with a good deli.",
    tier: "ease", budget: 2, energy: "chill", time: "short", when: "night",
    area: "Mount Pleasant", cost: "~$40", duration: "~1.5 hrs",
    place: "Trader Joe's, Mount Pleasant, SC", rainy: true
  },
  {
    id: "after-shift-milkshakes",
    title: "After-shift milkshakes",
    desc: "Both off work late? Meet in the middle for milkshakes and a drive.",
    plan: ["Pick a spot about halfway", "Get milkshakes", "Drive around with a playlist and talk"],
    tip: "Low effort, still counts as getting out.",
    tier: "ease", budget: 1, energy: "lazy", time: "short", when: "night",
    area: "North Charleston", cost: "~$12", duration: "~1 hr",
    place: "milkshakes, North Charleston, SC", rainy: true
  },
  {
    id: "gas-station-picnic",
    title: "Gas station picnic + stars",
    desc: "Each pick $10 of gas station snacks, then find a dark spot to eat and look at the sky.",
    plan: ["$10 each, no showing the other", "Drive somewhere dark and quiet", "Swap snacks and look for stars"],
    tip: "A beach or a big empty park works great. Bring a blanket.",
    tier: "ease", budget: 1, energy: "lazy", time: "short", when: "night",
    area: "Anywhere", cost: "~$20", duration: "~1.5 hrs"
  },
  {
    id: "day-off-lunch",
    title: "Day-off lunch date",
    desc: "A real lunch out on a day you're both off. One rule: no sandwiches, no sweet tea from work.",
    plan: ["Find a day you're both off", "Pick somewhere neither of you has been", "Order the least McAlister's thing on the menu"],
    tip: "Lunch menus are usually cheaper than dinner for the same food.",
    tier: "ease", budget: 2, energy: "lazy", time: "short", when: "day",
    area: "Charleston area", cost: "~$40", duration: "~1.5 hrs",
    place: "lunch, Charleston, SC", rainy: true
  },
  {
    id: "daniel-island-picnic",
    title: "Meet-in-the-middle picnic",
    desc: "Daniel Island is about halfway between you. Bring food and meet at the waterfront.",
    plan: ["Each bring half the picnic", "Meet at the Daniel Island waterfront park", "Walk the river path after"],
    tip: "About 15–20 minutes from both Mount Pleasant and North Charleston.",
    tier: "ease", budget: 1, energy: "lazy", time: "short", when: "any",
    area: "Daniel Island", cost: "~$20", duration: "~1.5 hrs",
    place: "Daniel Island Waterfront Park, Charleston, SC"
  },
  {
    id: "first-friday-art-walk",
    title: "Art walk night",
    desc: "Galleries downtown open their doors in the evening, often with free snacks.",
    plan: ["Look up the next gallery walk", "Wander gallery to gallery", "Each pick a piece you'd buy if money didn't matter"],
    tip: "Many galleries in the French Quarter do these a few times a year.",
    tier: "ease", budget: 0, energy: "chill", time: "short", when: "night",
    area: "Downtown", cost: "Free", duration: "~2 hrs",
    place: "French Quarter galleries, Charleston, SC", verify: true, rainy: true
  },
  {
    id: "sunrise-battery",
    title: "Sunrise at the Battery",
    desc: "Watch the sun come up over the harbor, then get breakfast downtown.",
    plan: ["Meet at the Battery before sunrise", "Walk the seawall as it gets light", "Get breakfast nearby"],
    tip: "It's about the same drive for both of you.",
    tier: "send", budget: 0, energy: "active", time: "short", when: "day",
    area: "Downtown", cost: "Free (+ breakfast)", duration: "~1.5 hrs",
    place: "White Point Garden, Charleston, SC"
  },

  /* ================= RAINY DAY ================= */
  {
    id: "board-game-cafe",
    title: "Board game café",
    desc: "Hundreds of games on the shelves, snacks, and someone to teach you the rules.",
    plan: ["Ask staff for a two-player game", "Order snacks", "Play until someone wins best of three"],
    tip: "Tell them what you like and they'll pick a game for you.",
    tier: "ease", budget: 1, energy: "lazy", time: "short", when: "any",
    area: "Charleston area", cost: "~$25", duration: "~2 hrs",
    place: "board game cafe, Charleston, SC", verify: true, rainy: true
  },
  {
    id: "paint-your-own-pottery",
    title: "Paint-your-own pottery",
    desc: "Pick a mug or plate and paint it. No talent needed, very relaxing on a rainy day.",
    plan: ["Each pick a piece", "Paint something for the other person", "Pick them up after they're fired"],
    tip: "Sketch with pencil first. It burns off in the kiln.",
    tier: "ease", budget: 2, energy: "chill", time: "short", when: "any",
    area: "Charleston area", cost: "~$40", duration: "~2 hrs",
    place: "paint your own pottery, Charleston, SC", verify: true, rainy: true
  },
  {
    id: "hot-pot",
    title: "Hot pot or Korean BBQ",
    desc: "Cook your own food at the table. Perfect for a cold or rainy night.",
    plan: ["Pick hot pot or KBBQ", "Order a mix of meats and veggies", "Take turns cooking for each other"],
    tip: "Go hungry. All-you-can-eat spots are the move.",
    tier: "ease", budget: 2, energy: "chill", time: "short", when: "night",
    area: "Charleston area", cost: "~$60", duration: "~1.5 hrs",
    place: "hot pot, North Charleston, SC", verify: true, rainy: true
  },
  {
    id: "rainy-movie-double",
    title: "Rainy-day movie double feature",
    desc: "Two movies back to back at the theater, with lunch in between.",
    plan: ["Pick two movies with a gap between them", "Lunch in between", "Rank both on the drive home"],
    tip: "Matinee prices make this cheaper than you'd think.",
    tier: "ease", budget: 2, energy: "lazy", time: "half", when: "day",
    area: "North Charleston", cost: "~$50", duration: "~5 hrs",
    place: "movie theater, North Charleston, SC", verify: true, rainy: true
  },
  {
    id: "bowling-north",
    title: "Bowling night",
    desc: "Cheap, a little silly, and it doesn't care about the weather.",
    plan: ["Bowl two games", "Loser of game one picks the music", "Loser of game two buys snacks"],
    tip: "Look for weeknight specials.",
    tier: "ease", budget: 1, energy: "chill", time: "short", when: "night",
    area: "North Charleston", cost: "~$30", duration: "~1.5 hrs",
    place: "bowling, North Charleston, SC", verify: true, rainy: true
  },

  /* ================= BIG WEEKENDS ================= */
  {
    id: "downtown-staycation",
    title: "Downtown staycation",
    desc: "Book one night at a hotel downtown and act like tourists in your own city.",
    plan: ["Book a hotel for one night", "Dinner and dessert within walking distance", "Slow breakfast and a walk before checkout"],
    tip: "Sunday nights are usually the cheapest.",
    tier: "send", budget: 3, energy: "lazy", time: "full", when: "any",
    area: "Downtown", cost: "$200+", duration: "Overnight",
    place: "hotels, downtown Charleston, SC", verify: true, rainy: true
  },
  {
    id: "savannah-overnight",
    title: "Savannah overnight",
    desc: "The day trip, but you stay the night and do the evening too.",
    plan: ["Book a room near the squares", "Walk the city and have a long dinner", "Breakfast before driving home"],
    tip: "Weeknights are much cheaper than weekends.",
    tier: "send", budget: 3, energy: "chill", time: "full", when: "any",
    area: "Savannah", cost: "$200+", duration: "Overnight",
    place: "Savannah, GA"
  },
  {
    id: "asheville-fall",
    title: "Asheville fall weekend",
    desc: "Mountains, leaves changing color, and a small, artsy downtown.",
    plan: ["Book a cheap cabin or room", "Drive the Blue Ridge Parkway", "Food and shops downtown"],
    tip: "Peak leaves are usually mid to late October. Check the foliage forecast.",
    tier: "send", budget: 3, energy: "chill", time: "full", when: "any",
    area: "Asheville", cost: "$300+", duration: "Weekend",
    place: "Asheville, NC", months: [10, 11]
  },
  {
    id: "myrtle-beach-day",
    title: "Myrtle Beach day",
    desc: "Boardwalk, the big Ferris wheel, and cheesy beach-town fun.",
    plan: ["Leave early", "Walk the boardwalk", "Ride the SkyWheel at night"],
    tip: "It's about two hours away. Go in the off-season for no crowds.",
    tier: "send", budget: 2, energy: "chill", time: "full", when: "any",
    area: "Myrtle Beach", cost: "~$80 + gas", duration: "All day",
    place: "Myrtle Beach Boardwalk, Myrtle Beach, SC", verify: true
  },
  /* ================= DATED EVENTS ================= */
  {
    id: "mtp-christmas-parade-2026",
    title: "Mount Pleasant Christmas Light Parade",
    desc: "Fireworks, then a lit-up parade down Coleman Boulevard with Santa on a fire truck.",
    plan: ["Get there before the 5:30 fireworks", "Find a spot along Coleman Blvd", "Dinner on Shem Creek after"],
    tip: "Coleman closes in sections starting around 4pm, so park early and walk.",
    tier: "ease", budget: 0, energy: "lazy", time: "short", when: "night",
    area: "Mount Pleasant", cost: "Free", duration: "~2.5 hrs",
    place: "Coleman Boulevard, Mount Pleasant, SC", verify: true, start: "2026-12-13", end: "2026-12-13"
  },
  {
    id: "summerville-christmas-parade-2026",
    title: "Summerville Christmas Parade",
    desc: "Summerville's big small-town parade. This year's theme is \"Christmas Stories.\"",
    plan: ["Get downtown early for a spot", "Hot chocolate from a local shop", "Walk Hutchinson Square after"],
    tip: "It's usually a Sunday afternoon. Check the start time the week of.",
    tier: "ease", budget: 0, energy: "lazy", time: "short", when: "day",
    area: "Summerville", cost: "Free", duration: "~2 hrs",
    place: "Hutchinson Square, Summerville, SC", verify: true, start: "2026-12-13", end: "2026-12-13"
  },
  {
    id: "north-charleston-christmas-festival",
    title: "North Charleston Christmas Festival",
    desc: "A parade and festival in Park Circle, usually on a Saturday in early December.",
    plan: ["Check the date on the city's events page", "Get to Park Circle early", "Dinner on East Montague after"],
    tip: "It got moved for rain last year, so check the forecast and the city's page.",
    tier: "ease", budget: 0, energy: "lazy", time: "short", when: "any",
    area: "Park Circle (N. Charleston)", cost: "Free", duration: "~3 hrs",
    place: "Park Circle, North Charleston, SC", verify: true, months: [12]
  },
  {
    id: "holy-smokes-2026",
    title: "Holy Smokes BBQ Festival",
    desc: "All-you-can-eat barbecue from dozens of pitmasters at Riverfront Park, with live music.",
    plan: ["Buy tickets ahead online", "Show up hungry around opening", "Walk the river path between rounds"],
    tip: "Tickets cover all the food, and the money goes to kids' charities.",
    tier: "send", budget: 3, energy: "chill", time: "half", when: "day",
    area: "North Charleston", cost: "~$95 each", duration: "~4 hrs",
    place: "Riverfront Park, North Charleston, SC", verify: true, start: "2026-11-14", end: "2026-11-14"
  },
  {
    id: "harvest-festival-2026",
    title: "Harvest Festival on Johns Island",
    desc: "Bluegrass, hayrides, pumpkin decorating, and barbecue at Johns Island County Park.",
    plan: ["Get there after 11 when it opens", "Decorate a pumpkin for each other", "Catch a bluegrass set with some kettle corn"],
    tip: "Admission is about $10 a person. Check the county parks site for the latest.",
    tier: "ease", budget: 1, energy: "chill", time: "half", when: "day",
    area: "Johns Island", cost: "~$10 each", duration: "~3 hrs",
    place: "Johns Island County Park, Johns Island, SC", verify: true, start: "2026-11-07", end: "2026-11-07"
  },
  {
    id: "charleston-literary-festival-2026",
    title: "Charleston Literary Festival talk",
    desc: "Famous authors in conversation at the Dock Street Theatre. Pick one talk that sounds good to both of you.",
    plan: ["Look through the lineup together", "Pick one talk and get tickets", "Dinner downtown after to talk it over"],
    tip: "You don't need to have read the book. The talks are made for that.",
    tier: "send", budget: 2, energy: "lazy", time: "short", when: "any",
    area: "Downtown", cost: "~$25–50 each", duration: "~2 hrs",
    place: "Dock Street Theatre, Charleston, SC", verify: true, rainy: true, start: "2026-11-06", end: "2026-11-15"
  },
  {
    id: "charleston-holiday-market-2026",
    title: "Charleston Holiday Market",
    desc: "A big indoor holiday market at the Coliseum with local makers, gifts, and food.",
    plan: ["Set a small gift budget for each other", "Split up for 20 minutes and shop in secret", "Meet back up and swap what you found"],
    tip: "Tickets are only a few bucks. Go Friday or early Sunday to skip the biggest crowds.",
    tier: "ease", budget: 1, energy: "chill", time: "short", when: "day",
    area: "North Charleston", cost: "~$8 each + gifts", duration: "~2 hrs",
    place: "North Charleston Coliseum, North Charleston, SC", verify: true, rainy: true, start: "2026-11-20", end: "2026-11-22"
  },
  /* ================= ALCOHOL-FREE SWAPS ================= */
  {
    id: "sparkling-cider-board",
    title: "Sparkling cider + a really good board",
    desc: "A cheese shop board and a bottle of fancy sparkling cider, at home in pajamas.",
    plan: ["Ask a cheese shop for three cheeses that go together", "Add fruit, honey, and good crackers", "Pop the cider and pick a movie"],
    tip: "Ask for a firm, a soft, and a blue. You can't go wrong with that.",
    tier: "in", budget: 3, energy: "lazy", time: "short", when: "night",
    area: "Home", cost: "~$80", duration: "~2 hrs"
  },
  {
    id: "blind-soda-tasting",
    title: "Blind craft soda tasting",
    desc: "Each of you secretly buys three fancy sodas. Taste them blind and rank them.",
    plan: ["Each buy three craft sodas the other hasn't tried", "Pour them into cups with no labels", "Score them and reveal"],
    tip: "Check the international aisle for the weirdest flavors.",
    tier: "in", budget: 1, energy: "lazy", time: "short", when: "night",
    area: "Home", cost: "~$20", duration: "~1 hr"
  },
  {
    id: "mocktail-night",
    title: "Home mocktail night",
    desc: "Learn two fancy mocktails, then invent and name a house drink of your own.",
    plan: ["Pick two mocktail recipes", "Buy fresh fruit, herbs, and fancy soda", "Invent a drink and name it after yourselves"],
    tip: "Fresh lime and a little muddled mint make anything taste fancy.",
    tier: "in", budget: 1, energy: "chill", time: "short", when: "night",
    area: "Home", cost: "~$25", duration: "~1.5 hrs"
  },
  {
    id: "taco-night",
    title: "Taco + agua fresca night",
    desc: "Build-your-own tacos and homemade agua fresca. Way cheaper than going out.",
    plan: ["Pick up tortillas, a protein, and toppings", "Blend fruit, water, lime, and sugar for agua fresca", "Taco bar on the counter, eat on the couch"],
    tip: "Watermelon agua fresca takes two minutes and tastes like summer.",
    tier: "in", budget: 1, energy: "lazy", time: "short", when: "night",
    area: "Home", cost: "~$25", duration: "~1.5 hrs"
  },
  {
    id: "boba-crawl",
    title: "Boba crawl",
    desc: "Two or three boba shops, one drink each, and a winner by the end.",
    plan: ["Pick two or three boba shops", "Each order something you've never tried", "Crown a winner"],
    tip: "Order half sugar. You'll make it to the last stop.",
    tier: "ease", budget: 1, energy: "lazy", time: "short", when: "any",
    area: "North Charleston", cost: "~$20", duration: "~1.5 hrs",
    place: "boba tea, North Charleston, SC", rainy: true
  },
  {
    id: "afternoon-tea",
    title: "Afternoon tea",
    desc: "Little sandwiches, scones, and a pot of tea. Very fancy, very calm.",
    plan: ["Book an afternoon tea downtown", "Dress up a little", "Walk around downtown after"],
    tip: "Book ahead. Tea services fill up on weekends.",
    tier: "ease", budget: 2, energy: "lazy", time: "short", when: "day",
    area: "Downtown", cost: "~$40 each", duration: "~1.5 hrs",
    place: "afternoon tea, Charleston, SC", verify: true, rainy: true
  },
  {
    id: "dessert-crawl",
    title: "Downtown dessert crawl",
    desc: "Three dessert stops in one night. Split everything.",
    plan: ["Pick three dessert spots within walking distance", "Split one thing at each", "Vote on the best bite"],
    tip: "Start with something light. End with cake.",
    tier: "ease", budget: 1, energy: "chill", time: "short", when: "night",
    area: "Downtown", cost: "~$30", duration: "~2 hrs",
    place: "dessert, Charleston, SC", rainy: true
  },
  {
    id: "coffee-shop-games",
    title: "Coffee shop + card games",
    desc: "A cozy café, two warm drinks, and a deck of cards.",
    plan: ["Bring a deck of cards or a small game", "Get drinks and a pastry to share", "Best of five"],
    tip: "Weeknight evenings are quiet at most cafés.",
    tier: "ease", budget: 1, energy: "lazy", time: "short", when: "any",
    area: "Mount Pleasant", cost: "~$15", duration: "~1.5 hrs",
    place: "coffee shop, Mount Pleasant, SC", rainy: true
  },
  {
    id: "hot-chocolate-walk",
    title: "Hot chocolate walk",
    desc: "Get hot chocolate and walk downtown looking at the holiday decorations.",
    plan: ["Get hot chocolate to go", "Walk King Street and the side streets", "End at Waterfront Park"],
    tip: "Cold nights are the best for this. Bring gloves.",
    tier: "ease", budget: 1, energy: "chill", time: "short", when: "night",
    area: "Downtown", cost: "~$12", duration: "~1.5 hrs",
    place: "King Street, Charleston, SC", months: [11, 12, 1, 2]
  },
  {
    id: "angel-oak-farm-stands",
    title: "Angel Oak + farm stands",
    desc: "See the giant Angel Oak, then stop at farm stands on the way back.",
    plan: ["Visit the Angel Oak", "Stop at farm stands on Maybank Highway", "Cook something with what you bought"],
    tip: "The Angel Oak keeps limited hours, so go there first.",
    tier: "ease", budget: 1, energy: "chill", time: "half", when: "day",
    area: "Johns Island", cost: "~$25", duration: "~3–4 hrs",
    place: "Angel Oak Tree, Johns Island, SC", verify: true
  },
  {
    id: "dinner-show-dessert",
    title: "Dinner, a show, and dessert",
    desc: "The full evening downtown: dinner, a show, and something sweet after.",
    plan: ["Book dinner and show tickets", "Dinner first", "Show, then a late dessert"],
    tip: "Pick dinner within walking distance of the venue.",
    tier: "send", budget: 3, energy: "chill", time: "half", when: "night",
    area: "Downtown", cost: "$150+", duration: "~5 hrs",
    place: "King Street, Charleston, SC", rainy: true
  },
  {
    id: "private-karaoke",
    title: "Private karaoke room",
    desc: "Rent a karaoke room for just the two of you. No crowd, no judging.",
    plan: ["Book an hour in a private room", "Each pick three songs for the other", "Finish with a duet"],
    tip: "Private rooms are much less nerve-wracking than a stage.",
    tier: "send", budget: 2, energy: "active", time: "short", when: "night",
    area: "Charleston area", cost: "~$30–50", duration: "~1.5 hrs",
    place: "private karaoke room, Charleston, SC", verify: true, rainy: true
  },
  {
    id: "arcade-laser-tag",
    title: "Arcade + laser tag",
    desc: "Arcade games, a round of laser tag, and prizes you don't need.",
    plan: ["Load up a game card", "Play every two-player game", "One round of laser tag, loser buys ice cream"],
    tip: "Weeknights are less crowded with kids.",
    tier: "send", budget: 2, energy: "active", time: "short", when: "any",
    area: "North Charleston", cost: "~$40", duration: "~2 hrs",
    place: "arcade laser tag, North Charleston, SC", verify: true, rainy: true
  },
  {
    id: "painting-class",
    title: "Painting class",
    desc: "An instructor walks you through a painting step by step. Hang them side by side.",
    plan: ["Book a beginner class", "Follow along (or go rogue)", "Hang them side by side at home"],
    tip: "Look for a class with a fun theme. Sunsets and dogs are easy wins.",
    tier: "send", budget: 2, energy: "lazy", time: "short", when: "night",
    area: "Charleston area", cost: "~$40 each", duration: "~2 hrs",
    place: "painting class, Charleston, SC", verify: true, rainy: true
  },
  {
    id: "brunch-spot-new",
    title: "New brunch spot in Park Circle",
    desc: "Pick a café neither of you has tried for a slow weekend brunch.",
    plan: ["Pick a place on or near East Montague", "Order one sweet, one savory", "Walk the park after"],
    tip: "Get there before 10 on weekends to skip the wait.",
    tier: "ease", budget: 1, energy: "lazy", time: "short", when: "day",
    area: "Park Circle (N. Charleston)", cost: "~$30", duration: "~1.5 hrs",
    place: "brunch, North Charleston, SC", rainy: true
  },
  {
    id: "sunset-milkshakes-pier",
    title: "Milkshakes on the pier",
    desc: "Grab milkshakes and watch the sunset from the Mount Pleasant Pier swings.",
    plan: ["Get milkshakes on the way", "Find a swing on the pier", "Stay until the bridge lights come on"],
    tip: "The pier has free parking at Memorial Waterfront Park.",
    tier: "ease", budget: 1, energy: "lazy", time: "short", when: "night",
    area: "Mount Pleasant", cost: "~$15", duration: "~1 hr",
    place: "Mount Pleasant Pier, Mount Pleasant, SC"
  }

  // Add your own ideas above this line (remember the comma after the previous } ).
];
