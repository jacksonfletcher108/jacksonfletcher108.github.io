import { Heart, MapPin, CloudRain, CalendarHeart, ChefHat, WalletCards, Hammer, Nfc, MessageSquareText, Timer, Gauge, LineChart, SlidersHorizontal, Lightbulb, Smartphone } from 'lucide-react'

export const SITE = 'https://jacksonfletcher108.github.io'

/**
 * Everything on the fridge. `note` is the handwritten "why I made it" line,
 * so keep it in my own words. `tilt` is how crooked the card hangs (degrees).
 */
export const APPS = [
  {
    id: 'datenight',
    short: 'Date Night',
    name: 'Date Night',
    kicker: 'For the two of us',
    tagline: 'Set the vibe and the budget, and it picks a real Charleston date for tonight.',
    note: 'Made so we stop going back and forth on what to do.',
    status: 'live',
    url: `${SITE}/`,
    icon: Heart,
    color: '#e5484d',
    paper: '#fff4f3',
    tilt: -1.6,
    pin: 'magnet',
    features: [
      { icon: MapPin, text: 'Close to home: filters by drive time' },
      { icon: CloudRain, text: 'Checks the weather for rainy-day plans' },
      { icon: CalendarHeart, text: 'From "Stay in" to "Full send"' },
    ],
    stats: [['236', 'date ideas'], ['7', 'filters'], ['daily', 'new picks']],
  },
  {
    id: 'kitchen',
    short: 'Mise',
    name: 'Mise',
    kicker: 'What\'s for dinner',
    tagline: 'Tell it what\'s in the fridge and it writes a recipe you can actually make, step by step.',
    note: 'Made because the answer to "what\'s for dinner" is usually already in here.',
    status: 'live',
    url: `${SITE}/mise/`,
    icon: ChefHat,
    color: '#e8962e',
    paper: '#fff8ec',
    tilt: 1.2,
    pin: 'tape',
    features: [
      { icon: MessageSquareText, text: 'Gets notes like "no mushrooms" or "under 20 min"' },
      { icon: Timer, text: 'Cook mode with timers built in' },
      { icon: Nfc, text: 'Opens with a tap on the fridge' },
    ],
    stats: [['261', 'ingredients'], ['38', 'dishes'], ['40', 'sauces']],
  },
  {
    id: 'budget',
    short: 'Ledgerly',
    name: 'Ledgerly',
    kicker: 'Money, minus the stress',
    tagline: 'Plan the month in a minute, log spending in one tap, and see what\'s safe to spend today.',
    note: 'Made to know what I can spend before payday, not after.',
    status: 'live',
    url: `${SITE}/budget/`,
    icon: WalletCards,
    color: '#2f8f6f',
    paper: '#f1fbf6',
    tilt: -0.8,
    pin: 'magnet',
    features: [
      { icon: Gauge, text: 'Safe-to-spend for today' },
      { icon: LineChart, text: 'Where the month is headed' },
      { icon: SlidersHorizontal, text: '"What if I cut takeout?" sliders' },
    ],
    stats: [['6', 'categories'], ['4', 'what-ifs'], ['1 tap', 'to log']],
  },
  {
    id: 'next',
    short: 'Next up',
    name: 'Next up',
    kicker: 'On the workbench',
    tagline: 'Something new is in the works. Help me pick what it should be.',
    note: 'Vote on what I make next!',
    status: 'building',
    url: null,
    icon: Hammer,
    color: '#7c5cd6',
    paper: '#fbfaf5',
    tilt: 1.8,
    pin: 'tape',
    features: [
      { icon: Lightbulb, text: 'A short list of ideas to vote on' },
      { icon: Smartphone, text: 'Same deal: works on your phone, no sign-up' },
    ],
    stats: [],
  },
]

export const TOOLS = [
  { id: 'react', name: 'React', what: 'Ledgerly and this page are built out of small React pieces: cards, charts, sliders.', used: ['budget', 'hub'] },
  { id: 'vite', name: 'Vite', what: 'Runs everything while I build, then packs it into a tiny site.', used: ['budget', 'hub'] },
  { id: 'tailwind', name: 'Tailwind CSS', what: 'How Mise, Ledgerly and this page get their look.', used: ['kitchen', 'budget', 'hub'] },
  { id: 'js', name: 'Plain JavaScript', what: 'Date Night and Mise run on hand-written JavaScript, no framework.', used: ['datenight', 'kitchen'] },
  { id: 'meteo', name: 'Open-Meteo', what: 'Free weather data, so Date Night knows when it\'s going to rain.', used: ['datenight'] },
  { id: 'pages', name: 'GitHub Pages', what: 'Free hosting. Every app lives on this one site, works offline, and can go on your home screen.', used: ['datenight', 'kitchen', 'budget', 'hub'] },
]
