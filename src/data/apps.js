import { Heart, ChefHat, WalletCards, Hammer } from 'lucide-react'

export const SITE = 'https://jacksonfletcher108.github.io'
const shot = name => `${import.meta.env.BASE_URL}shots/${name}.jpg`

/**
 * The apps, in the order they appear. `why` is the one-line reason I built it.
 * `details` are short facts, not marketing. Screenshots live in public/shots.
 */
export const APPS = [
  {
    id: 'datenight',
    name: 'Date Night',
    kind: 'Date planner',
    status: 'live',
    url: `${SITE}/`,
    icon: Heart,
    color: '#f0596b',
    shot: shot('datenight'),
    summary: 'Set a budget, an energy level and how much time you have, and it suggests a real date around Charleston, with a plan, the cost and the drive.',
    why: 'I wanted a faster way to pick plans than scrolling through lists.',
    details: ['236 ideas, refreshed daily', 'Drive times from Mount Pleasant or North Charleston', 'Checks the forecast and favors rain-proof plans'],
  },
  {
    id: 'supper',
    name: 'Supper',
    kind: 'Meal planner',
    status: 'live',
    url: `${SITE}/mise/`,
    icon: ChefHat,
    color: '#e9a23b',
    shot: shot('supper'),
    summary: 'Type in what\'s in your fridge and it writes a full recipe from it, step by step, with a cook mode and timers for when you\'re at the stove.',
    why: 'I wanted dinner ideas that start from what\'s already in the kitchen.',
    details: ['261 ingredients and 38 kinds of dishes', 'Understands notes like "no mushrooms" or "under 20 minutes"', 'Can open from an NFC tag on the fridge'],
    nfc: true,
  },
  {
    id: 'tally',
    name: 'Tally',
    kind: 'Budget planner',
    status: 'live',
    url: `${SITE}/budget/`,
    icon: WalletCards,
    color: '#3ecf8e',
    shot: shot('tally'),
    summary: 'Answer three quick questions and it builds a monthly budget for you. After that it tells you what you can spend today, and logging a purchase takes one tap.',
    why: 'I wanted to know what I can spend today, not just what I spent last month.',
    details: ['Guided setup, including how often you get paid', 'What\'s left in each category at a glance', 'Try a change on your savings goal, then apply it'],
  },
  {
    id: 'next',
    name: 'Next up',
    kind: 'In progress',
    status: 'building',
    url: null,
    icon: Hammer,
    color: '#a993f5',
    summary: 'I\'m deciding what to build next. Here\'s the shortlist. Vote for the one you\'d actually use, or suggest something.',
    why: 'I\'d rather build the thing people will use.',
    details: [],
  },
]

export const TOOLS = [
  { name: 'React', what: 'Tally and this page are React apps.' },
  { name: 'Vite', what: 'Builds each one into a small, fast site.' },
  { name: 'Tailwind CSS', what: 'Styling for Supper, Tally and this page.' },
  { name: 'JavaScript', what: 'Date Night and Supper are plain JavaScript, no framework.' },
  { name: 'Open-Meteo', what: 'Weather data for Date Night.' },
  { name: 'GitHub Pages', what: 'Free hosting. Everything works offline and can go on your home screen.' },
]
