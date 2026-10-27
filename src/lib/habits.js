import { Dices, Cigarette, Leaf, Wine, Sparkles } from 'lucide-react'

/**
 * The habits people pick from most, plus "something else".
 * Helplines checked October 2026: NCPG moved to 1-800-MY-RESET in 2025; 1-800-QUIT-NOW is the national
 * quitline that routes to each state's line; SAMHSA's helpline covers drugs and alcohol.
 */
export const HABITS = {
  gambling: { label: 'Gambling', icon: Dices, color: '#f59e0b', verb: 'betting', placeholder: 'Bets, scratch-offs, apps…' },
  smoking: { label: 'Smoking / vaping', icon: Cigarette, color: '#fb7185', verb: 'smoking', placeholder: 'Cigarettes, vapes, pods…' },
  cannabis: { label: 'Cannabis', icon: Leaf, color: '#4ade80', verb: 'smoking weed', placeholder: 'Flower, carts, edibles…' },
  alcohol: { label: 'Alcohol', icon: Wine, color: '#a78bfa', verb: 'drinking', placeholder: 'Bars, liquor store…' },
  custom: { label: 'Something else', icon: Sparkles, color: '#38bdf8', verb: 'it', placeholder: 'Takeout, shopping, energy drinks…' },
}

export const HELPLINES = {
  gambling: [{ name: 'National Problem Gambling Helpline', detail: 'Call or text, 24/7, free and confidential', phone: '1-800-697-3738', display: '1-800-MY-RESET', url: 'https://www.ncpgambling.org/chat/' }],
  smoking: [{ name: 'Quitline (1-800-QUIT-NOW)', detail: 'Free coaching from your state\'s quitline', phone: '1-800-784-8669', display: '1-800-784-8669', url: 'https://smokefree.gov' }],
  cannabis: [{ name: 'SAMHSA National Helpline', detail: 'Free, confidential, 24/7 treatment referral', phone: '1-800-662-4357', display: '1-800-662-HELP', url: 'https://www.samhsa.gov/find-help/helplines/national-helpline' }],
  alcohol: [{ name: 'SAMHSA National Helpline', detail: 'Free, confidential, 24/7 treatment referral', phone: '1-800-662-4357', display: '1-800-662-HELP', url: 'https://www.samhsa.gov/find-help/helplines/national-helpline' }],
  custom: [{ name: 'SAMHSA National Helpline', detail: 'Free, confidential, 24/7 referral and support', phone: '1-800-662-4357', display: '1-800-662-HELP', url: 'https://www.samhsa.gov/find-help/helplines/national-helpline' }],
}
export const CRISIS = { name: '988 Suicide & Crisis Lifeline', detail: 'If you\'re in crisis or thinking about hurting yourself: call or text, 24/7', phone: '988', display: '988' }

export const meta = h => HABITS[h.type] || HABITS.custom
export const nameOf = h => (h.type === 'custom' || !HABITS[h.type] ? h.name || 'My habit' : HABITS[h.type].label)
