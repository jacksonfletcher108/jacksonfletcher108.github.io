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
   age21     true = 21+
   months    Only show in these months (1 = Jan … 12 = Dec), e.g. [10, 11, 12]
   ===================================================================== */

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
    desc: "Buy the ingredients you'd normally skip: good steak or scallops and a real bottle of wine.",
    plan: ["Go to a butcher or seafood market", "Pick a bottle you'd never normally buy", "Cook it simply and eat slowly"],
    tip: "A restaurant-quality meal at home still costs about half of going out for one.",
    tier: "in", budget: 3, energy: "chill", time: "half", when: "night",
    area: "Home", cost: "~$90", duration: "~3 hrs", age21: true
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
    id: "champagne-board",
    title: "Champagne + a really good board",
    desc: "A proper cheese shop board and a real bottle of Champagne, at home in pajamas.",
    plan: ["Ask a cheese shop for three cheeses that go together", "Add fruit, honey, and good crackers", "Pop the bottle and pick a movie"],
    tip: "Ask for a firm, a soft, and a blue. You can't go wrong with that.",
    tier: "in", budget: 3, energy: "lazy", time: "short", when: "night",
    area: "Home", cost: "~$90", duration: "~2 hrs", age21: true
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
    id: "blind-wine-board",
    title: "Blind wine tasting",
    desc: "You each secretly buy a bottle, then taste blind and guess which is whose.",
    plan: ["Each buy a bottle under $15 without telling the other", "Cover the labels with paper bags", "Taste, score, and reveal"],
    tip: "Pick wines from two different countries to make guessing more fun.",
    tier: "in", budget: 2, energy: "lazy", time: "short", when: "night",
    area: "Home", cost: "~$35", duration: "~2 hrs", age21: true
  },
  {
    id: "home-cocktail-class",
    title: "Home cocktail class",
    desc: "Learn two classic cocktails, then invent and name a house drink.",
    plan: ["Pick two classics, like a margarita and an old fashioned", "Follow a video and make both", "Invent a drink and name it after yourselves"],
    tip: "Fresh-squeezed citrus makes the biggest difference.",
    tier: "in", budget: 2, energy: "chill", time: "short", when: "night",
    area: "Home", cost: "~$40", duration: "~2 hrs", age21: true
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
    area: "Beaufort (~1.5 hrs away)", cost: "~$10–20 each + gas", duration: "~5–6 hrs",
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
    desc: "James Island's cozy little theater, and they serve beer and wine.",
    plan: ["Pick whatever's playing that you haven't heard of", "Get a drink at the bar", "Talk about it over late dessert"],
    tip: "Buy tickets online for new releases on weekends.",
    tier: "ease", budget: 2, energy: "lazy", time: "short", when: "night",
    area: "James Island", cost: "~$30", duration: "~2.5 hrs",
    place: "The Terrace Theater, James Island, SC", verify: true
  },
  {
    id: "big-screen-movie",
    title: "Big-screen movie night out",
    desc: "Your usual movie night, but with a giant screen and somebody else's popcorn.",
    plan: ["Pick the biggest new release", "Get the big popcorn to share", "Grab food after and debate the ending"],
    tip: "Tuesday tickets are usually discounted.",
    tier: "ease", budget: 2, energy: "lazy", time: "short", when: "night",
    area: "Mount Pleasant", cost: "~$35", duration: "~2.5 hrs",
    place: "Regal Palmetto Grande, Mount Pleasant, SC", verify: true
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
    place: "Kaminsky's Dessert Cafe, Charleston, SC", verify: true
  },
  {
    id: "pages-brunch",
    title: "Brunch at Page's Okra Grill",
    desc: "A Mount Pleasant brunch staple with big Southern plates.",
    plan: ["Go early to beat the wait", "Order one sweet, one savory, and share", "Walk it off at Shem Creek after"],
    tip: "There's usually a wait on weekends, so put your name in and take a walk.",
    tier: "ease", budget: 2, energy: "lazy", time: "short", when: "day",
    area: "Mount Pleasant", cost: "~$40", duration: "~1.5 hrs",
    place: "Page's Okra Grill, Mount Pleasant, SC", verify: true
  },
  {
    id: "bookstore-date",
    title: "Bookstore date on King Street",
    desc: "Pick a book for each other at Buxton Books, then go read them over coffee.",
    plan: ["Split up and each pick a book for the other (under $20)", "Swap without explaining", "Read the first chapter over coffee"],
    tip: "Write a little note inside the cover before you hand it over.",
    tier: "ease", budget: 2, energy: "chill", time: "short", when: "day",
    area: "Downtown", cost: "~$45", duration: "~2 hrs",
    place: "Buxton Books, Charleston, SC", verify: true
  },
  {
    id: "festival-of-lights",
    title: "Holiday Festival of Lights",
    desc: "Drive through millions of lights at James Island County Park.",
    plan: ["Make cocoa for the car", "Drive the lights loop", "Park and walk the holiday village"],
    tip: "Weeknights have far shorter lines than weekends.",
    tier: "ease", budget: 1, energy: "lazy", time: "short", when: "night",
    area: "James Island", cost: "~$20–25 per car", duration: "~1.5 hrs",
    place: "James Island County Park, Charleston, SC", verify: true, months: [11, 12, 1]
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
    id: "westbrook",
    title: "Westbrook Brewing taproom",
    desc: "A big Mount Pleasant brewery with plenty of space to hang out.",
    plan: ["Order a flight to share", "Bring a deck of cards", "Grab food from whatever truck is there"],
    tip: "Check their food-truck schedule before you go hungry.",
    tier: "ease", budget: 1, energy: "lazy", time: "short", when: "any",
    area: "Mount Pleasant", cost: "~$25", duration: "~2 hrs",
    place: "Westbrook Brewing Co, Mount Pleasant, SC", verify: true, age21: true
  },
  {
    id: "two-blokes",
    title: "Pints at Two Blokes",
    desc: "A low-key Mount Pleasant brewery, about five minutes from the couch.",
    plan: ["Get one pint each", "Play a game or just talk", "Head home before it gets late"],
    tip: "A good first step if 'going out' feels like a lot tonight.",
    tier: "ease", budget: 1, energy: "lazy", time: "short", when: "night",
    area: "Mount Pleasant", cost: "~$25", duration: "~1.5 hrs",
    place: "Two Blokes Brewing, Mount Pleasant, SC", verify: true, age21: true
  },
  {
    id: "revelry-rooftop",
    title: "Revelry rooftop at sunset",
    desc: "A downtown brewery with a rooftop that's perfect at sunset.",
    plan: ["Get there an hour before sunset", "Grab a rooftop spot", "Walk to dinner nearby after"],
    tip: "The rooftop fills up on nice evenings, so go early.",
    tier: "ease", budget: 1, energy: "chill", time: "short", when: "night",
    area: "Downtown", cost: "~$25", duration: "~2 hrs",
    place: "Revelry Brewing Co, Charleston, SC", verify: true, age21: true
  },
  {
    id: "low-tide-angel-oak",
    title: "Angel Oak + Low Tide Brewing",
    desc: "See the giant Angel Oak, then get a pint at Low Tide on Johns Island.",
    plan: ["Visit the Angel Oak", "Drive a few minutes to Low Tide Brewing", "Get food from their truck or bring snacks"],
    tip: "The Angel Oak keeps limited hours, so go there first.",
    tier: "ease", budget: 1, energy: "chill", time: "half", when: "day",
    area: "Johns Island", cost: "~$25", duration: "~3–4 hrs",
    place: "Low Tide Brewing, Johns Island, SC", verify: true, age21: true
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
    place: "thrift store, Mount Pleasant, SC"
  },
  {
    id: "brewery-trivia",
    title: "Brewery trivia night",
    desc: "Lots of local spots run weekly trivia. A ridiculous team name is required.",
    plan: ["Find a trivia night near you", "Pick a team name", "Play as a team of two"],
    tip: "Arrive 20 minutes early to get a table.",
    tier: "ease", budget: 1, energy: "chill", time: "short", when: "night",
    area: "Mount Pleasant", cost: "~$25", duration: "~2 hrs",
    place: "trivia night, Mount Pleasant, SC", verify: true, age21: true
  },
  {
    id: "vendue-rooftop",
    title: "Rooftop drinks at The Vendue",
    desc: "A downtown rooftop bar with harbor views. Dress up a little.",
    plan: ["Get dressed up a little", "One drink each at the rooftop", "Walk Waterfront Park after"],
    tip: "Go at sunset for the harbor view.",
    tier: "ease", budget: 2, energy: "lazy", time: "short", when: "night",
    area: "Downtown", cost: "~$45", duration: "~1.5 hrs",
    place: "The Rooftop at The Vendue, Charleston, SC", verify: true, age21: true
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
    place: "The Alley, Charleston, SC", verify: true
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
    desc: "A massive, centuries-old live oak on Johns Island. Free, and genuinely impressive.",
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
    place: "coffee shops, Charleston, SC"
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
    tip: "No reviews and no menu peeking. That's half the fun.",
    tier: "ease", budget: 2, energy: "lazy", time: "short", when: "night",
    area: "Mount Pleasant", cost: "~$50", duration: "~1.5 hrs",
    place: "restaurants, Mount Pleasant, SC"
  },
  {
    id: "nice-dinner-downtown",
    title: "Dressed-up dinner downtown",
    desc: "A real reservation somewhere nice. Get dressed up and take your time.",
    plan: ["Book a table a few days ahead", "Get dressed up", "Walk the Battery after dinner"],
    tip: "Weeknight reservations are much easier to get than weekends.",
    tier: "ease", budget: 3, energy: "lazy", time: "short", when: "night",
    area: "Downtown", cost: "$100+", duration: "~2.5 hrs",
    place: "fine dining, Charleston, SC", verify: true
  },
  {
    id: "fancy-brunch",
    title: "Long fancy brunch",
    desc: "A slow, nice brunch downtown with no plans after.",
    plan: ["Book a brunch table downtown", "Order a little of everything", "Walk it off on King Street"],
    tip: "Sunday brunch spots book up; reserve a few days ahead.",
    tier: "ease", budget: 3, energy: "lazy", time: "short", when: "day",
    area: "Downtown", cost: "~$90", duration: "~2 hrs",
    place: "brunch, Charleston, SC", verify: true
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
    place: "Gibbes Museum of Art, Charleston, SC", verify: true
  },
  {
    id: "sc-aquarium",
    title: "South Carolina Aquarium",
    desc: "Sea turtles, a giant ocean tank, and a harbor view from the deck.",
    plan: ["Go on a weekday morning", "Don't skip the sea turtle care center", "Lunch by the harbor after"],
    tip: "Weekday mornings are the quietest.",
    tier: "ease", budget: 2, energy: "chill", time: "short", when: "day",
    area: "Downtown", cost: "~$35+ each", duration: "~2 hrs",
    place: "South Carolina Aquarium, Charleston, SC", verify: true
  },
  {
    id: "charleston-museum",
    title: "The Charleston Museum",
    desc: "Learn where you actually live. Pirates, history, and some strange old stuff.",
    plan: ["Each find the weirdest object in the museum", "Compare finds", "Grab lunch nearby"],
    tip: "Combo tickets include historic houses if you want to make a day of it.",
    tier: "ease", budget: 1, energy: "chill", time: "short", when: "day",
    area: "Downtown", cost: "~$15 each", duration: "~1.5 hrs",
    place: "The Charleston Museum, Charleston, SC", verify: true
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
    area: "Francis Marion Forest (~45 min)", cost: "Free", duration: "All day",
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
    plan: ["Book an evening ghost tour", "Walk the old streets after dark", "Get a drink after to calm down"],
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
    id: "oyster-festival",
    title: "Lowcountry Oyster Festival",
    desc: "A giant January oyster party. Wear clothes you don't care about.",
    plan: ["Buy tickets ahead", "Bring an oyster knife and gloves", "Pace yourselves"],
    tip: "Tickets go faster than you'd think.",
    tier: "send", budget: 2, energy: "chill", time: "half", when: "day",
    area: "Mount Pleasant", cost: "~$60+", duration: "~4 hrs",
    place: "Boone Hall Plantation, Mount Pleasant, SC", verify: true, months: [1]
  },
  {
    id: "stingrays-hockey",
    title: "Stingrays hockey game",
    desc: "Loud, cheap, and a freezing ice rink in the South.",
    plan: ["Get cheap seats", "Learn one chant", "Get late-night food after"],
    tip: "Cheap seats are fine. Every seat is close to the ice.",
    tier: "send", budget: 2, energy: "chill", time: "short", when: "night",
    area: "North Charleston", cost: "~$25 each", duration: "~2.5 hrs",
    place: "North Charleston Coliseum, North Charleston, SC", verify: true, months: [10, 11, 12, 1, 2, 3, 4]
  },
  {
    id: "ice-skating",
    title: "Go ice skating",
    desc: "Hold hands, fall down, get hot chocolate after.",
    plan: ["Check the public skate times", "Rent skates and hold hands", "Hot chocolate after"],
    tip: "Wear thick socks and gloves.",
    tier: "send", budget: 2, energy: "active", time: "short", when: "any",
    area: "North Charleston", cost: "~$15 each", duration: "~1.5 hrs",
    place: "Carolina Ice Palace, North Charleston, SC", verify: true, months: [11, 12, 1, 2]
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
    tip: "It's genuinely beautiful and a little spooky. Bring bug spray.",
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
    area: "Hunting Island (~2 hrs away)", cost: "~$30 + gas", duration: "All day",
    place: "Hunting Island State Park, SC", verify: true
  },
  {
    id: "savannah-day-trip",
    title: "Day trip to Savannah",
    desc: "Two hours south: wander the squares and River Street and eat too many pralines.",
    plan: ["Leave by 9am", "Walk the squares to Forsyth Park", "Dinner on River Street, then drive home"],
    tip: "Park once in a garage and walk everywhere.",
    tier: "send", budget: 3, energy: "chill", time: "full", when: "any",
    area: "Savannah (~2 hrs away)", cost: "~$100+", duration: "All day",
    place: "Forsyth Park, Savannah, GA"
  },
  {
    id: "beaufort-overnight",
    title: "Overnight in Beaufort",
    desc: "A tiny getaway: a night at an inn in a small, pretty waterfront town.",
    plan: ["Book a room at an inn or B&B", "Walk the waterfront park at sunset", "Slow breakfast before driving home"],
    tip: "Sunday-to-Monday nights are usually cheapest.",
    tier: "send", budget: 3, energy: "lazy", time: "full", when: "any",
    area: "Beaufort (~1.5 hrs away)", cost: "$150+", duration: "Overnight",
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
    place: "couples massage, Mount Pleasant, SC", verify: true
  },
  {
    id: "theatre-99",
    title: "Improv at Theatre 99",
    desc: "Charleston's improv comedy theater. Funnier than any Netflix special.",
    plan: ["Buy tickets ahead", "Dinner nearby first", "Shout a suggestion if you're brave"],
    tip: "Weekend shows sell out, so buy tickets early.",
    tier: "send", budget: 2, energy: "lazy", time: "short", when: "night",
    area: "Downtown", cost: "~$20–30 each", duration: "~1.5 hrs",
    place: "Theatre 99, Charleston, SC", verify: true
  },
  {
    id: "symphony",
    title: "Charleston Symphony concert",
    desc: "Get dressed up and hear a live orchestra. You'll feel very fancy.",
    plan: ["Pick a concert on the calendar", "Dinner downtown before", "Dress up"],
    tip: "Pick a program with a piece you already know. It makes the first time easier.",
    tier: "send", budget: 3, energy: "lazy", time: "short", when: "night",
    area: "Downtown", cost: "~$40–80 each", duration: "~2.5 hrs",
    place: "Charleston Symphony, Charleston, SC", verify: true
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
    id: "big-night-out",
    title: "Big night out downtown",
    desc: "Dinner, a show, and a rooftop nightcap. The full evening.",
    plan: ["Book dinner and show tickets", "Dinner first", "Show, then a rooftop nightcap"],
    tip: "Pick dinner within walking distance of the venue.",
    tier: "send", budget: 3, energy: "chill", time: "half", when: "night",
    area: "Downtown", cost: "$150+", duration: "~5 hrs",
    place: "King Street, Charleston, SC", age21: true
  },
  {
    id: "pour-house",
    title: "Live music at the Pour House",
    desc: "A James Island music venue with bigger shows inside and smaller sets on the deck.",
    plan: ["Check the lineup", "Pick a band you've never heard", "Grab food beforehand"],
    tip: "Deck shows are smaller and sometimes free.",
    tier: "send", budget: 1, energy: "chill", time: "short", when: "night",
    area: "James Island", cost: "Free–$25", duration: "~2.5 hrs",
    place: "The Charleston Pour House, Charleston, SC", verify: true
  },
  {
    id: "royal-american",
    title: "Live band at The Royal American",
    desc: "A divey, fun live-music bar on Morrison Drive. See a band you've never heard of.",
    plan: ["Check who's playing", "Get there for the opener", "Dance at least once"],
    tip: "Cover is usually cheap. Bring cash just in case.",
    tier: "send", budget: 1, energy: "chill", time: "short", when: "night",
    area: "Downtown (NoMo)", cost: "~$25", duration: "~2.5 hrs",
    place: "The Royal American, Charleston, SC", verify: true, age21: true
  },
  {
    id: "gin-joint",
    title: "Cocktails at The Gin Joint",
    desc: "A dim, cozy cocktail bar. Order a bartender's choice and trust the process.",
    plan: ["Dress up a little", "Order a bartender's choice each", "Swap halfway through"],
    tip: "Go early in the evening for a better shot at a seat.",
    tier: "send", budget: 3, energy: "lazy", time: "short", when: "night",
    area: "Downtown", cost: "~$60–90", duration: "~1.5 hrs",
    place: "The Gin Joint, Charleston, SC", verify: true, age21: true
  },
  {
    id: "firefly-distillery",
    title: "Firefly Distillery tasting",
    desc: "The home of sweet tea vodka, in North Charleston.",
    plan: ["Do a tasting", "Pick a favorite to take home", "Lunch nearby in Park Circle"],
    tip: "Have a designated driver or a ride home.",
    tier: "send", budget: 1, energy: "chill", time: "short", when: "day",
    area: "North Charleston", cost: "~$15 each", duration: "~1.5 hrs",
    place: "Firefly Distillery, North Charleston, SC", verify: true, age21: true
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
    place: "escape room, Mount Pleasant, SC", verify: true
  },
  {
    id: "dance-class",
    title: "One-night dance class",
    desc: "Salsa, swing, whatever's on tonight. Nobody's good at the start.",
    plan: ["Find a beginner drop-in class", "Wear shoes that can spin", "Practice one move in the kitchen after"],
    tip: "Drop-in beginner classes are designed for total beginners.",
    tier: "send", budget: 2, energy: "active", time: "short", when: "night",
    area: "Charleston area", cost: "~$20–40 each", duration: "~1.5 hrs",
    place: "dance lessons, Charleston, SC", verify: true
  },
  {
    id: "karaoke-bar",
    title: "Karaoke bar night",
    desc: "Real karaoke in front of strangers. One song each, minimum.",
    plan: ["Find a karaoke night", "Each sign up for one song", "Finish with a duet"],
    tip: "Weeknights have shorter song lists, so you'll sing sooner.",
    tier: "send", budget: 1, energy: "active", time: "short", when: "night",
    area: "Charleston area", cost: "~$25", duration: "~2.5 hrs",
    place: "karaoke bar, Charleston, SC", verify: true, age21: true
  },
  {
    id: "climbing-gym",
    title: "Try a climbing gym",
    desc: "Rent shoes, learn the basics, and spot each other on the bouldering walls.",
    plan: ["Book an intro session or day pass", "Start on the easiest routes", "Get food after; you'll be hungry"],
    tip: "Bouldering needs no ropes or experience. It's the easiest way to start.",
    tier: "send", budget: 2, energy: "active", time: "short", when: "any",
    area: "Charleston area", cost: "~$25–35 each", duration: "~2 hrs",
    place: "climbing gym, Charleston, SC", verify: true
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
    desc: "Watch an open mic. If you're brave, one of you signs up.",
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
    place: "pottery class, Charleston, SC", verify: true
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
    place: "Charleston Music Hall, Charleston, SC", verify: true
  },
  {
    id: "edisto-day-trip",
    title: "Edisto Beach day trip",
    desc: "A sleepy, old-school beach town about an hour away. Hunt for shells and fossils.",
    plan: ["Drive down Highway 174", "Beach and shell hunting", "Seafood on the way home"],
    tip: "The state park beach is great for finding fossilized shark teeth.",
    tier: "send", budget: 1, energy: "chill", time: "full", when: "day",
    area: "Edisto Beach (~1 hr away)", cost: "~$30 + gas", duration: "All day",
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
  }

  // Add your own ideas above this line (remember the comma after the previous } ).
];
