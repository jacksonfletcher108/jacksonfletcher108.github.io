import { Heart, MapPin, CloudRain, CalendarHeart, ChefHat, WalletCards, Hammer, Nfc, MessageSquareText, Timer, Gauge, LineChart, SlidersHorizontal, Lightbulb, Smartphone, Vote } from 'lucide-react'

export const SITE = 'https://jacksonfletcher108.github.io'

/**
 * Each app: what it is, where it lives, and how its card looks.
 * `why` is the one-line reason I built it. `glow` is an RGB triple for the hover light.
 */
export const APPS = [
  {
    id: 'datenight',
    short: 'Date Night',
    name: 'Date Night',
    alias: 'Date planner',
    tagline: 'Pick a budget, an energy level and a time, and it suggests a real date around Charleston.',
    why: 'I wanted a faster way to pick plans than scrolling through lists.',
    status: 'live',
    url: `${SITE}/`,
    icon: Heart,
    accent: '#fb7185',
    accent2: '#db2777',
    glow: '251 113 133',
    tags: ['Charleston', 'Weather-aware', 'Updated daily'],
    features: [
      { icon: MapPin, text: 'Filters by drive time from Mount Pleasant or North Charleston' },
      { icon: CloudRain, text: 'Checks the forecast and favors rain-proof plans' },
      { icon: CalendarHeart, text: 'Ranges from a night in to a full day out' },
    ],
    stats: [
      { value: '236', label: 'date ideas' },
      { value: '7', label: 'filters' },
      { value: 'Daily', label: 'updates' },
    ],
  },
  {
    id: 'kitchen',
    short: 'Mise',
    name: 'Mise',
    alias: 'Meal planner',
    tagline: 'Enter what\'s in the fridge and it writes a full recipe, step by step, with what you already have.',
    why: 'I wanted dinner ideas that start from what\'s already in the kitchen.',
    status: 'live',
    url: `${SITE}/mise/`,
    icon: ChefHat,
    accent: '#f59e0b',
    accent2: '#84cc16',
    glow: '245 158 11',
    tags: ['NFC tag', 'Cook mode', 'Works offline'],
    features: [
      { icon: MessageSquareText, text: 'Understands notes like "under 20 minutes" or "no mushrooms"' },
      { icon: Timer, text: 'Full-screen cook mode with step timers' },
      { icon: Nfc, text: 'Opens with a tap on an NFC tag on the fridge' },
    ],
    stats: [
      { value: '261', label: 'ingredients' },
      { value: '38', label: 'dish types' },
      { value: '40', label: 'sauce styles' },
    ],
  },
  {
    id: 'budget',
    short: 'Ledgerly',
    name: 'Ledgerly',
    alias: 'Budget planner',
    tagline: 'Set up a monthly budget in a minute, log spending in one tap, and test changes before you make them.',
    why: 'I wanted to know what I can spend today, not just what I spent last month.',
    status: 'live',
    url: `${SITE}/budget/`,
    icon: WalletCards,
    accent: '#34d399',
    accent2: '#818cf8',
    glow: '52 211 153',
    tags: ['Quick setup', 'What-if planning', 'Charts'],
    features: [
      { icon: Gauge, text: 'A daily safe-to-spend amount that updates as you log' },
      { icon: LineChart, text: 'Planned vs. actual and a month-end projection' },
      { icon: SlidersHorizontal, text: 'Sliders that show how a change moves your savings goal' },
    ],
    stats: [
      { value: '6', label: 'categories' },
      { value: '4', label: 'what-if levers' },
      { value: '1 tap', label: 'to log' },
    ],
  },
  {
    id: 'next',
    short: 'Next up',
    name: 'Next up',
    alias: 'In progress',
    tagline: 'I\'m deciding what to build next. Take a look at the shortlist and vote for the one you\'d use.',
    why: 'I\'d rather build the thing people will actually use.',
    whyLabel: 'Why it\'s here',
    status: 'building',
    url: null,
    icon: Hammer,
    accent: '#a78bfa',
    accent2: '#f472b6',
    glow: '167 139 250',
    tags: ['Shortlist', 'Coming soon'],
    features: [
      { icon: Lightbulb, text: 'A shortlist of ideas for the next app' },
      { icon: Vote, text: 'Vote, or add an idea of your own' },
      { icon: Smartphone, text: 'Same as the others: phone-first, no account' },
    ],
    stats: [],
  },
]

export const TECH = [
  { id: 'react', name: 'React', role: 'Interface components', used: ['budget', 'hub', 'next'], color: '#61dafb',
    detail: 'Ledgerly and this page are React apps, built from small components like cards, charts and sliders.' },
  { id: 'vite', name: 'Vite', role: 'Build tooling', used: ['budget', 'hub', 'next'], color: '#bd34fe',
    detail: 'Fast reloads while I work, then a small static bundle for hosting.' },
  { id: 'tailwind', name: 'Tailwind CSS', role: 'Styling', used: ['kitchen', 'budget', 'hub', 'next'], color: '#38bdf8',
    detail: 'Used for Mise, Ledgerly and this page. Mise compiles it into one inline stylesheet so it loads in a single request.' },
  { id: 'js', name: 'JavaScript', role: 'App logic', used: ['datenight', 'kitchen'], color: '#facc15',
    detail: 'Date Night and Mise are written in plain JavaScript, no framework. Mise\'s recipes come from a hand-written set of cooking rules.' },
  { id: 'pages', name: 'GitHub Pages', role: 'Hosting', used: ['datenight', 'kitchen', 'budget', 'hub'], color: '#e2e8f0',
    detail: 'Every app lives on this one site, works offline, and can be added to a phone\'s home screen.' },
  { id: 'meteo', name: 'Open-Meteo', role: 'Weather data', used: ['datenight'], color: '#fb923c',
    detail: 'Date Night checks the Charleston forecast so rainy evenings surface indoor plans.' },
]
