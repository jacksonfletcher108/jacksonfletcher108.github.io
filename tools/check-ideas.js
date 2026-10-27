/* Checks ideas.js before publishing.  Run:  node tools/check-ideas.js
   Exits with an error if anything would break the app. */
const path = require("path");
global.window = {};
try {
  require(path.join(__dirname, "..", "ideas.js"));
} catch (e) {
  console.error("ERROR: ideas.js doesn't load (usually a missing comma or quote):", e.message);
  process.exit(1);
}
const ideas = window.DATE_IDEAS || [];
const errors = [], warnings = [];
const ENUMS = { tier: ["in", "ease", "send"], energy: ["lazy", "chill", "active"], time: ["short", "half", "full"], when: ["day", "night", "any"] };
const REQUIRED = ["id", "title", "desc", "tier", "budget", "energy", "time", "when", "area", "cost", "duration"];
const isDay = s => /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s));
const today = new Date(); today.setHours(0, 0, 0, 0);
const seen = new Set();

if (!/^\d{4}-\d{2}-\d{2}$/.test(window.DATE_IDEAS_UPDATED || "")) errors.push("DATE_IDEAS_UPDATED is missing or not YYYY-MM-DD");

ideas.forEach((i, n) => {
  const name = i && i.id ? i.id : `#${n}`;
  REQUIRED.forEach(f => { if (i[f] === undefined || i[f] === "") errors.push(`${name}: missing ${f}`); });
  if (seen.has(i.id)) errors.push(`${name}: duplicate id`);
  seen.add(i.id);
  for (const k in ENUMS) if (!ENUMS[k].includes(i[k])) errors.push(`${name}: ${k} must be one of ${ENUMS[k].join(", ")}`);
  if (![0, 1, 2, 3].includes(i.budget)) errors.push(`${name}: budget must be 0–3`);
  if (i.plan !== undefined && (!Array.isArray(i.plan) || !i.plan.length)) errors.push(`${name}: plan must be a list of steps`);
  if (i.months !== undefined && (!Array.isArray(i.months) || i.months.some(m => m < 1 || m > 12))) errors.push(`${name}: months must be 1–12`);
  ["start", "end"].forEach(f => { if (i[f] !== undefined && !isDay(i[f])) errors.push(`${name}: ${f} must be YYYY-MM-DD`); });
  if (i.start && i.end && i.end < i.start) errors.push(`${name}: end is before start`);
  const last = i.end || i.start;
  if (last && new Date(last + "T23:59:59") < today) warnings.push(`${name}: event ended ${last}; remove it or update the dates`);
  if (/[—]/.test([i.title, i.desc, i.tip, ...(i.plan || [])].join(" "))) warnings.push(`${name}: uses an em dash`);
});

// Every pair of filters should have at least 3 ideas this month
const month = today.getMonth() + 1;
const live = ideas.filter(i => (i.start || i.end)
  ? today >= new Date(new Date(i.start || i.end) - 30 * 864e5) && today <= new Date((i.end || i.start) + "T23:59:59")
  : !i.months || i.months.includes(month));
const F = { budget: [0, 1, 2, 3], energy: ENUMS.energy, time: ENUMS.time, tier: ENUMS.tier, when: ["day", "night"] };
const fits = (i, k, v) => k === "budget" ? i.budget <= v : k === "when" ? (i.when === "any" || i.when === v) : i[k] === v;
const keys = Object.keys(F);
for (let a = 0; a < keys.length; a++) for (let b = a + 1; b < keys.length; b++)
  for (const va of F[keys[a]]) for (const vb of F[keys[b]]) {
    const n = live.filter(i => fits(i, keys[a], va) && fits(i, keys[b], vb)).length;
    if (n < 3) warnings.push(`only ${n} ideas for ${keys[a]}=${va} + ${keys[b]}=${vb} this month`);
  }

console.log(`${ideas.length} ideas, ${live.length} showing this month, updated ${window.DATE_IDEAS_UPDATED}`);
warnings.forEach(w => console.log("warning:", w));
errors.forEach(e => console.error("ERROR:", e));
if (errors.length) { console.error(`${errors.length} error(s). Don't publish.`); process.exit(1); }
console.log("OK to publish.");
