import { Heart, MapPin, CloudRain, CalendarHeart, ChefHat, WalletCards, FlaskConical, Nfc, MessageSquareText, Timer, Gauge, LineChart, SlidersHorizontal, Sparkles, Lightbulb, Wrench } from 'lucide-react'

export const SITE = 'https://jacksonfletcher108.github.io'

/**
 * Each app: what it is, where it lives, and how the card should look.
 * `glow` is an RGB triple used for the hover spotlight; `accent` drives tags and buttons.
 */
export const APPS = [
  {
    id: 'datenight',
    short: 'Date Night',
    name: 'Date Night',
    alias: 'Charleston · Date Picker',
    tagline: 'Can\'t decide what to do tonight? Set the vibe and get a real Charleston plan.',
    status: 'live',
    url: `${SITE}/`,
    icon: Heart,
    accent: '#fb7185',
    accent2: '#db2777',
    glow: '251 113 133',
    tags: ['Charleston', 'Weather-aware', 'Daily refresh', 'PWA'],
    features: [
      { icon: MapPin, text: 'Filters by drive time from Mount Pleasant or North Charleston' },
      { icon: CloudRain, text: 'Checks the forecast and leans toward rain-proof plans' },
      { icon: CalendarHeart, text: 'Budget, energy, time and setting, from "Stay in" to "Full send"' },
    ],
    stats: [
      { value: '236', label: 'date ideas' },
      { value: '7', label: 'filters' },
      { value: 'Daily', label: 'updates' },
    ],
    stack: ['JavaScript', 'CSS', 'PWA', 'Open-Meteo', 'Claude Code'],
  },
  {
    id: 'kitchen',
    short: 'Kitchen',
    name: 'Streamline Kitchen',
    alias: 'Mise · Meal Prepper',
    tagline: 'Tell it what\'s in the fridge. Get a real recipe, step by step.',
    status: 'live',
    url: `${SITE}/mise/`,
    icon: ChefHat,
    accent: '#f59e0b',
    accent2: '#84cc16',
    glow: '245 158 11',
    tags: ['NFC launch', 'Context-aware', 'Cook mode', 'PWA'],
    features: [
      { icon: Nfc, text: 'Tap an NFC tag on the fridge to open it instantly' },
      { icon: MessageSquareText, text: 'Reads notes like "I\'m sick", "under 20 minutes" or "no mushrooms"' },
      { icon: Timer, text: 'Full-screen cook mode with built-in step timers' },
    ],
    stats: [
      { value: '260+', label: 'ingredients' },
      { value: '38', label: 'dish types' },
      { value: '40', label: 'sauce styles' },
    ],
    stack: ['JavaScript', 'Tailwind CSS', 'PWA', 'Claude Code'],
  },
  {
    id: 'budget',
    short: 'Budgeter',
    name: 'Interactive Budgeter',
    alias: 'Ledgerly · Financial Simulator',
    tagline: 'Set up a month in a minute, log spending in a tap, and test "what if" before you commit.',
    status: 'live',
    url: `${SITE}/budget/`,
    icon: WalletCards,
    accent: '#34d399',
    accent2: '#818cf8',
    glow: '52 211 153',
    tags: ['Zero-friction setup', 'Scenario planning', 'Charts', 'PWA'],
    features: [
      { icon: Gauge, text: 'Daily safe-to-spend that updates as you log' },
      { icon: LineChart, text: 'Planned vs. actual and a month-end cash-flow projection' },
      { icon: SlidersHorizontal, text: 'What-if sliders that move your savings goal date live' },
    ],
    stats: [
      { value: '6', label: 'categories' },
      { value: '4', label: 'what-if levers' },
      { value: '1 tap', label: 'to log' },
    ],
    stack: ['React', 'Vite', 'Tailwind CSS', 'Recharts', 'Lucide', 'Claude Code'],
  },
  {
    id: 'sandbox',
    short: 'Sandbox',
    name: 'AI Project Sandbox',
    alias: 'Next build · In the lab',
    tagline: 'The space for whatever gets built next. Ideas get prototyped here before they ship.',
    status: 'building',
    url: null,
    icon: FlaskConical,
    accent: '#a78bfa',
    accent2: '#f472b6',
    glow: '167 139 250',
    tags: ['Prototype', 'Coming soon'],
    features: [
      { icon: Lightbulb, text: 'Idea board for the next tool' },
      { icon: Wrench, text: 'Built the same way: fast, mobile-first, no sign-in' },
      { icon: Sparkles, text: 'Ships here first, then gets its own card' },
    ],
    stats: [
      { value: '—', label: 'users' },
      { value: 'v0', label: 'version' },
      { value: 'Soon', label: 'launch' },
    ],
    stack: ['React', 'Vite', 'Tailwind CSS', 'Claude Code'],
  },
]

export const TECH = [
  { id: 'react', name: 'React', role: 'UI components and state', used: ['budget', 'hub', 'sandbox'], color: '#61dafb',
    detail: 'Ledgerly and this hub are React apps. Each screen is a small component: cards, modals, charts, sliders.' },
  { id: 'vite', name: 'Vite', role: 'Dev server and production builds', used: ['budget', 'hub', 'sandbox'], color: '#bd34fe',
    detail: 'Instant reloads while building, then a tiny static bundle that GitHub Pages can host for free.' },
  { id: 'tailwind', name: 'Tailwind CSS', role: 'Styling and design tokens', used: ['kitchen', 'budget', 'hub', 'sandbox'], color: '#38bdf8',
    detail: 'Every app uses Tailwind. Mise compiles it down to a single inline stylesheet so the page loads in one request.' },
  { id: 'claude', name: 'Claude Code', role: 'Pair-programming in the terminal', used: ['datenight', 'kitchen', 'budget', 'hub', 'sandbox'], color: '#d97757',
    detail: 'Used to plan, write, test and ship each app: components, recipe logic, layout checks on phone and desktop, and deploys.' },
  { id: 'pages', name: 'GitHub Pages', role: 'Hosting', used: ['datenight', 'kitchen', 'budget', 'hub'], color: '#e2e8f0',
    detail: 'Free static hosting. Each app lives in its own folder on the same site, with offline support and home-screen install.' },
  { id: 'meteo', name: 'Open-Meteo', role: 'Live weather data', used: ['datenight'], color: '#fbbf24',
    detail: 'Date Night checks the Charleston forecast so a rainy evening surfaces plans that work indoors.' },
]
