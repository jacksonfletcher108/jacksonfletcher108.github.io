/* Date Night: app logic. The ideas live in ideas.js. */
(function () {
  "use strict";

  /* ---------- Setup ---------- */
  const TIERS = {
    in:   { label: "Stay in, upgraded" },
    ease: { label: "Ease out" },
    send: { label: "Full send" }
  };
  const WHEN = { day: "Daytime", night: "Evening", any: "Anytime" };
  const BUDGET = ["Free", "$", "$$", "$$$"];

  const FILTERS = [
    { key: "budget", label: "Max budget",      options: [[0, "Free"], [1, "$"], [2, "$$"], [3, "$$$"]] },
    { key: "energy", label: "Energy",      options: [["lazy", "Lazy"], ["chill", "Chill"], ["active", "Active"]] },
    { key: "time",   label: "Time",        options: [["short", "Under 2h"], ["half", "Half day"], ["full", "Full day"]] },
    { key: "tier",   label: "Setting",     options: [["in", "Stay in"], ["ease", "Ease out"], ["send", "Full send"]] },
    { key: "when",   label: "Time of day", options: [["day", "Day"], ["night", "Night"]] },
    { key: "drive",  label: "Max drive",   options: [[15, "15 min"], [30, "30 min"], [45, "45 min"]] },
    { key: "rainy",  label: "Weather",     options: [[true, "Rain-proof only"]] }
  ];

  /* ---------- Where you two are ---------- */
  const ORIGINS = {
    mtp:    { label: "Mt P",        name: "Mount Pleasant",   at: [32.8323, -79.8284] },
    nchas:  { label: "N. Chas",     name: "North Charleston", at: [32.8546, -79.9748] },
    sville: { label: "Summerville", name: "Summerville",      at: [33.0185, -80.1756] },
    mid:    { label: "Middle",      name: "both of you" }
  };

  // Rough centers for each area, checked in this order
  const AREA_COORDS = [
    ["daniel island", 32.865, -79.905], ["park circle", 32.873, -79.980], ["north charleston", 32.8546, -79.9748],
    ["old village", 32.785, -79.862], ["patriots point", 32.790, -79.907], ["mount pleasant", 32.8323, -79.8284],
    ["sullivan", 32.763, -79.836], ["isle of palms", 32.786, -79.785], ["folly", 32.655, -79.940],
    ["james island", 32.737, -79.957], ["johns island", 32.717, -80.081], ["wadmalaw", 32.670, -80.210],
    ["kiawah", 32.610, -80.080], ["seabrook", 32.580, -80.170], ["west ashley", 32.800, -80.020],
    ["downtown", 32.7795, -79.9311], ["harbor", 32.7795, -79.9311], ["summerville", 33.0185, -80.1756],
    ["ravenel", 32.790, -80.200], ["moncks corner", 33.196, -80.013], ["ridgeville", 33.030, -80.430],
    ["awendaw", 32.990, -79.620], ["mcclellanville", 33.087, -79.460], ["francis marion", 33.100, -79.750],
    ["edisto", 32.490, -80.300], ["beaufort", 32.430, -80.670], ["hunting island", 32.370, -80.440],
    ["savannah", 32.080, -81.090], ["congaree", 33.830, -80.820], ["columbia", 34.000, -81.030],
    ["myrtle beach", 33.690, -78.890], ["asheville", 35.595, -82.551]
  ];

  const ICONS = {
    shuffle:  '<path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="m15 15 6 6"/><path d="m4 4 5 5"/>',
    bookmark: '<path d="M6.5 3.5h11v17l-5.5-3.8-5.5 3.8z"/>',
    bookmarkFill: '<path d="M6.5 3.5h11v17l-5.5-3.8-5.5 3.8z" fill="currentColor"/>',
    clock:    '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    x:        '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    repeat:   '<path d="M20 11a8 8 0 0 0-14.2-4.8L4 8"/><path d="M4 3.5V8h4.5"/><path d="M4 13a8 8 0 0 0 14.2 4.8L20 16"/><path d="M20 20.5V16h-4.5"/>',
    check:    '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    heart:    '<path d="M12 19.5s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 6.9a4.2 4.2 0 0 1 7.5 2.4c0 5.6-7.5 10.2-7.5 10.2z"/>',
    heartFill:'<path d="M12 19.5s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 6.9a4.2 4.2 0 0 1 7.5 2.4c0 5.6-7.5 10.2-7.5 10.2z" fill="currentColor"/>',
    nav:      '<path d="M20 4 4 10.5l6.8 2.7L13.5 20z"/>',
    info:     '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.2"/>',
    list:     '<path d="M9 6.5h11M9 12h11M9 17.5h11"/><path d="M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01" stroke-width="2.6"/>',
    plus:     '<path d="M12 5v14M5 12h14"/>',
    search:   '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    share:    '<path d="M12 3.5v11"/><path d="m7.5 8 4.5-4.5L16.5 8"/><path d="M7 11.5H5.5v9h13v-9H17"/>',
    sync:     '<path d="M4 9a8 8 0 0 1 14-3l2 2"/><path d="M20 3.5V8h-4.5"/><path d="M20 15a8 8 0 0 1-14 3l-2-2"/><path d="M4 20.5V16h4.5"/>',
    rain:     '<path d="M7 15a4 4 0 0 1-.5-8 5.5 5.5 0 0 1 10.6 1.5A3.3 3.3 0 0 1 17 15z"/><path d="M8 18l-1 2.5M12 18l-1 2.5M16 18l-1 2.5"/>'
  };
  const icon = (name, cls = "i") =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

  const MONTH = new Date().getMonth() + 1;

  function coordsOf(idea) {
    if (idea._at !== undefined) return idea._at;
    const area = (idea.area || "").toLowerCase();
    const hit = AREA_COORDS.find(([name]) => area.includes(name));
    idea._at = hit ? [hit[1], hit[2]] : null;   // null = at home, or spots all over
    return idea._at;
  }

  function miles(a, b) {
    const rad = d => d * Math.PI / 180;
    const dLat = rad(b[0] - a[0]), dLng = rad(b[1] - a[1]);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
    return 3959 * 2 * Math.asin(Math.sqrt(h));
  }

  // Straight-line miles to rough drive minutes (bridges and water make local trips longer)
  function minutesBetween(a, b) {
    const m = miles(a, b);
    return Math.round(m <= 30 ? 4 + m * 1.7 : 10 + m * 1.35);
  }

  // Drive minutes from a starting point; null when it doesn't apply
  function driveFrom(idea, from) {
    const at = coordsOf(idea);
    if (!at) return null;
    if (from === "mid") return Math.max(minutesBetween(ORIGINS.mtp.at, at), minutesBetween(ORIGINS.nchas.at, at));
    return minutesBetween(ORIGINS[from].at, at);
  }

  const fmtMin = m => m >= 90 ? `~${Math.round(m / 30) / 2} hrs` : `~${Math.max(5, Math.round(m / 5) * 5)} min`;
  const isRainy = idea => idea.tier === "in" || !!idea.rainy;
  const BUILT_IN = (Array.isArray(window.DATE_IDEAS) ? window.DATE_IDEAS : [])
    .filter(i => i && i.id && i.title && TIERS[i.tier]);
  let IDEAS = BUILT_IN;

  /* ---------- Storage (on this phone only) ---------- */
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem("dn." + key);
        return v ? JSON.parse(v) : fallback;
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem("dn." + key, JSON.stringify(value)); } catch (e) {}
    }
  };

  const state = {
    filters: store.get("filters", {}),
    saved: store.get("saved", []),
    history: store.get("history", []),
    custom: store.get("custom", []),   // ideas you added in the app
    browseTier: null,
    browseUseFilters: true,
    current: null,
    recent: [],
    spinning: false
  };

  function rebuildIdeas() {
    IDEAS = BUILT_IN.concat(state.custom.filter(i => i && i.id && i.title && TIERS[i.tier]));
  }
  rebuildIdeas();

  /* ---------- Helpers ---------- */
  const $ = sel => document.querySelector(sel);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const byId = id => IDEAS.find(i => i.id === id);
  // Dated events show up 30 days ahead and disappear after they end; others use months
  const DAY = 864e5;
  const parseDay = str => { const [y, m, d] = str.split("-").map(Number); return new Date(y, m - 1, d); };
  const TODAY = new Date(); TODAY.setHours(0, 0, 0, 0);
  const isDated = i => !!(i.start || i.end);
  function inSeason(i) {
    if (isDated(i)) {
      const start = parseDay(i.start || i.end), end = parseDay(i.end || i.start);
      return TODAY >= start - 30 * DAY && TODAY <= end;
    }
    return !i.months || i.months.includes(MONTH);
  }
  const daysUntil = i => Math.round((parseDay(i.start || i.end) - TODAY) / DAY);
  function dateLabel(i) {
    const f = d => parseDay(d).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    if (!i.end || i.end === i.start) return f(i.start || i.end);
    if (daysUntil(i) <= 0) return `Now through ${f(i.end)}`;
    return `${f(i.start)} – ${f(i.end)}`;
  }

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.remove("show"), 1800);
  }

  // Buttons marked data-icon get their icon placed before their label
  document.querySelectorAll("[data-icon]").forEach(el => {
    el.insertAdjacentHTML("afterbegin", icon(el.dataset.icon));
  });

  /* ---------- Filtering & picking ---------- */
  function fits(idea, key, val) {
    if (key === "budget") return idea.budget <= val;          // budget means "up to"
    if (key === "when") return idea.when === "any" || idea.when === val;
    if (key === "drive") { const d = driveFrom(idea, state.filters.from || "mid"); return d == null || d <= val; }
    if (key === "rainy") return isRainy(idea);
    return idea[key] === val;
  }

  // Filters an idea doesn't fit (empty = perfect match)
  const misses = idea => FILTERS.filter(f => state.filters[f.key] != null && !fits(idea, f.key, state.filters[f.key]));
  const seasonal = () => IDEAS.filter(inSeason);
  const pool = () => seasonal().filter(i => !misses(i).length);

  // When nothing fits every filter, use the ideas that miss the fewest
  function closest() {
    const all = seasonal();
    const fewest = Math.min(...all.map(i => misses(i).length));
    return all.filter(i => misses(i).length === fewest);
  }

  function weightOf(idea) {
    let w = 1;
    if (idea.months) w *= 2.5;                                    // in-season specials show up more
    if (isDated(idea) && daysUntil(idea) <= 14) w *= 3;           // events coming up soon
    if (state.recent.includes(idea.id)) w *= 0.1;                 // avoid repeats
    if (state.history.some(h => h.ideaId === idea.id)) w *= 0.6;  // done before
    if (state.filters.drive != null && idea.tier !== "in" && !coordsOf(idea)) w *= 0.2; // prefer real nearby places
    return w;
  }

  function pickFrom(list, excludeId) {
    const options = list.length > 1 ? list.filter(i => i.id !== excludeId) : list;
    const total = options.reduce((s, i) => s + weightOf(i), 0);
    let r = Math.random() * total;
    for (const i of options) {
      r -= weightOf(i);
      if (r <= 0) return i;
    }
    return options[options.length - 1];
  }

  /* ---------- Pick screen ---------- */
  function renderHeader() {
    const d = new Date();
    $("#today").textContent = d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
    $("#month-label").textContent = d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  }

  function renderFilters() {
    const segRow = (key, label, opts, cur) => `
        <div class="f-row">
          <span class="f-label">${label}</span>
          <div class="seg" role="group" aria-label="${label}">
            ${opts.map(([v, text]) => `
              <button class="${(cur == null ? null : cur) === v ? "on" : ""}" aria-pressed="${(cur == null ? null : cur) === v}"
                data-key="${key}" data-val='${JSON.stringify(v)}'>${text}</button>`).join("")}
          </div>
        </div>`;
    $("#filter-rows").innerHTML = FILTERS.map(f => {
      let html = segRow(f.key, f.label, [[null, "Any"], ...f.options], state.filters[f.key]);
      if (f.key === "drive" && state.filters.drive != null) {
        html += segRow("from", "Starting from", Object.entries(ORIGINS).map(([k, o]) => [k, o.label]), state.filters.from || "mid")
          .replace('class="f-row"', 'class="f-row sub-row"');
      }
      return html;
    }).join("");
    $("#clear-filters").hidden = !FILTERS.some(f => state.filters[f.key] != null);
    renderPresets();
    renderCount();
  }

  function renderCount() {
    const list = pool();
    const inSeasonCount = list.filter(i => i.months || isDated(i)).length;
    const el = $("#pick-count");
    $("#pick-btn").disabled = !IDEAS.length;
    if (!IDEAS.length) {
      el.textContent = "Couldn't read ideas.js. Check it for a missing comma.";
    } else if (!list.length) {
      el.textContent = "No perfect match for all of these. You'll get the closest one.";
    } else {
      el.textContent = `${list.length} idea${list.length === 1 ? "" : "s"} match` +
        (inSeasonCount ? ` · ${inSeasonCount} in season` : "");
    }
  }

  $("#filter-rows").addEventListener("click", e => {
    const b = e.target.closest("button[data-key]");
    if (!b) return;
    state.filters[b.dataset.key] = JSON.parse(b.dataset.val);
    store.set("filters", state.filters);
    renderFilters();
    renderBrowse();
  });

  /* ---------- Quick picks ---------- */
  const PRESETS = [
    { label: "Weeknight",  f: { time: "short", budget: 2, when: "night", drive: 30, from: "mid" } },
    { label: "Rainy day",  f: { rainy: true } },
    { label: "Under $30",  f: { budget: 1 } },
    { label: "Near N. Chas", f: { drive: 15, from: "nchas", tier: "ease" } },
    { label: "Near Mt P",  f: { drive: 15, from: "mtp", tier: "ease" } },
    { label: "After work (Summerville)", f: { time: "short", when: "night", drive: 15, from: "sville" } },
    { label: "Big weekend", f: { tier: "send", time: "full" } },
    { label: "Free",       f: { budget: 0 } }
  ];
  const sameFilters = (a, b) => {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    return [...keys].every(k => (a[k] == null ? null : a[k]) === (b[k] == null ? null : b[k]));
  };
  function renderPresets() {
    $("#presets").innerHTML = PRESETS.map((p, i) =>
      `<button class="chip ${sameFilters(state.filters, p.f) ? "on" : ""}" data-preset="${i}">${p.label}</button>`).join("");
  }
  $("#presets").addEventListener("click", e => {
    const b = e.target.closest("[data-preset]");
    if (!b) return;
    const p = PRESETS[Number(b.dataset.preset)];
    state.filters = sameFilters(state.filters, p.f) ? {} : { ...p.f };   // tap again to clear
    store.set("filters", state.filters);
    renderFilters();
    renderBrowse();
  });

  $("#clear-filters").addEventListener("click", () => {
    state.filters = {};
    store.set("filters", state.filters);
    renderFilters();
    renderBrowse();
  });

  $("#pick-btn").addEventListener("click", () => spin());

  /* ---------- The idea card ---------- */
  function headHTML(idea, titleClass) {
    return `
      <div class="card-head">
        <span class="setting"><span class="dot"></span>${TIERS[idea.tier].label}</span>
        <div class="title-window"><h2 class="card-title ${titleClass || ""}">${esc(idea.title)}</h2></div>`;
  }

  function cardHTML(idea, showMisses) {
    const missed = showMisses ? misses(idea) : [];
    const badges = [];
    if (idea.custom) badges.push(`<span class="badge yours">Your idea</span>`);
    if (isDated(idea)) badges.push(`<span class="badge season">${esc(dateLabel(idea))}</span>`);
    else if (idea.months) badges.push(`<span class="badge season">In season</span>`);
    if (idea.age21) badges.push(`<span class="badge adult">21+</span>`);
    if (isRainy(idea) && idea.tier !== "in") badges.push(`<span class="badge">Rain-proof</span>`);
    badges.push(`<span class="badge">${BUDGET[idea.budget] || ""}</span>`);
    badges.push(`<span class="badge">${esc(idea.energy.charAt(0).toUpperCase() + idea.energy.slice(1))}</span>`);

    return headHTML(idea) + `
        <p class="card-desc">${esc(idea.desc)}</p>
        <div class="badges">${badges.join("")}</div>
      </div>
      <div class="details in">
        ${missed.length ? `<p class="note miss">${icon("info", "i-sm")}<span>Closest match. Nothing fit every filter, so this one ignores your <b>${missed.map(f => f.label.toLowerCase()).join(" and ")}</b> setting.</span></p>` : ""}
        ${idea.plan && idea.plan.length ? `
        <section>
          <h3 class="section-label pad">The plan</h3>
          <ol class="group plan">${idea.plan.map(step => `<li>${esc(step)}</li>`).join("")}</ol>
        </section>` : ""}
        <dl class="group facts">
          <div class="fact"><dt>Cost</dt><dd>${esc(idea.cost || BUDGET[idea.budget])}</dd></div>
          <div class="fact"><dt>Takes</dt><dd>${esc(idea.duration || "")}</dd></div>
          <div class="fact"><dt>Where</dt><dd>${esc(idea.area || "")}</dd></div>
          <div class="fact"><dt>Drive</dt><dd>${driveText(idea)}</dd></div>
          <div class="fact"><dt>Best</dt><dd>${WHEN[idea.when] || WHEN.any}</dd></div>
        </dl>
        ${idea.tip ? `<p class="tip"><b>Tip</b>${esc(idea.tip)}</p>` : ""}
        ${idea.verify ? `<p class="note">${icon("info", "i-sm")}<span>This is a real business. Places close and change hours, so check before you go.</span></p>` : ""}
        ${idea.place ? `<button class="btn btn-secondary" id="dir-btn">${icon("nav")}Directions</button>` : ""}
        ${idea.custom ? `<button class="text-btn danger-text" id="del-custom">Delete this idea</button>` : ""}
      </div>`;
  }

  function driveText(idea) {
    if (idea.tier === "in") return "None, you're home";
    if (!coordsOf(idea)) return "Spots all over town";
    return `${fmtMin(driveFrom(idea, "mtp"))} from Mt P<br>${fmtMin(driveFrom(idea, "nchas"))} from N. Chas`;
  }

  function showIdea(idea, fromPick) {
    state.current = idea;
    state.recent = [idea.id, ...state.recent.filter(id => id !== idea.id)].slice(0, 8);
    const card = $("#card");
    card.dataset.tier = idea.tier;
    card.innerHTML = cardHTML(idea, fromPick);
    updateSaveBtn();
    setActionsDisabled(false);
  }

  function emptyCard() {
    const card = $("#card");
    card.dataset.tier = "ease";
    card.innerHTML = `
      <div class="empty">
        ${icon("shuffle")}
        <h3>No matches</h3>
        <p>Nothing fits all of those filters right now.</p>
        <button class="btn btn-secondary" id="empty-clear">Reset filters</button>
      </div>`;
    state.current = null;
    setActionsDisabled(true);
  }

  function setActionsDisabled(off) {
    ["#act-reroll", "#act-save", "#act-done"].forEach(s => { $(s).disabled = off; });
  }

  function updateSaveBtn() {
    const saved = !!state.current && state.saved.includes(state.current.id);
    const b = $("#act-save");
    b.innerHTML = icon(saved ? "bookmarkFill" : "bookmark");
    b.classList.toggle("saved", saved);
    b.setAttribute("aria-label", saved ? "Saved" : "Save for later");
  }

  /* Shuffle: titles roll past and slow down, then the pick settles in */
  function spin() {
    if (state.spinning) return;
    $("#result").hidden = false;
    const exact = pool();
    const list = exact.length ? exact : closest();
    if (!list.length) { emptyCard(); return; }

    const final = pickFrom(list, state.current && state.current.id);
    const card = $("#card");
    state.spinning = true;
    setActionsDisabled(true);

    let delay = 55;
    let last = null;
    const step = () => {
      let fake = list[Math.floor(Math.random() * list.length)];
      if (list.length > 1 && fake === last) fake = list[(list.indexOf(fake) + 1) % list.length];
      last = fake;
      card.dataset.tier = fake.tier;
      card.innerHTML = headHTML(fake, "tick") +
        `</div><div class="skeleton"><span></span><span></span><span></span></div>`;
      delay *= 1.16;
      if (delay < 280) setTimeout(step, delay);
      else setTimeout(() => { state.spinning = false; showIdea(final, true); }, 220);
    };
    step();
  }

  function closeResult() {
    if (!state.spinning) $("#result").hidden = true;
  }

  $("#close-result").addEventListener("click", closeResult);
  $("#act-reroll").addEventListener("click", spin);

  $("#card").addEventListener("click", e => {
    if (e.target.closest("#dir-btn")) openDirections(state.current);
    if (e.target.closest("#del-custom")) confirmDeleteCustom(state.current);
    if (e.target.closest("#empty-clear")) {
      state.filters = {};
      store.set("filters", state.filters);
      renderFilters();
      spin();
    }
  });

  $("#act-save").addEventListener("click", () => {
    const idea = state.current;
    if (!idea) return;
    if (state.saved.includes(idea.id)) {
      state.saved = state.saved.filter(id => id !== idea.id);
      toast("Removed from Saved");
    } else {
      state.saved = [idea.id, ...state.saved];
      toast("Saved");
    }
    store.set("saved", state.saved);
    updateSaveBtn();
    renderSaved();
  });

  $("#act-done").addEventListener("click", () => {
    if (state.current) openLogSheet(state.current);
  });

  /* ---------- Bottom sheet ---------- */
  function openSheet(html) {
    $("#sheet").innerHTML = html;
    $("#sheet").hidden = false;
    $("#sheet-backdrop").hidden = false;
  }
  function closeSheet() {
    $("#sheet").hidden = true;
    $("#sheet-backdrop").hidden = true;
  }
  $("#sheet-backdrop").addEventListener("click", closeSheet);

  function openDirections(idea) {
    if (!idea || !idea.place) return;
    // Ideas without one fixed spot search near the starting point you picked
    const from = state.filters.drive != null && ORIGINS[state.filters.from] && ORIGINS[state.filters.from].at ? ORIGINS[state.filters.from] : null;
    const place = from && !coordsOf(idea) ? idea.place.replace(/,[^,]+, SC$/, `, ${from.name}, SC`) : idea.place;
    const q = encodeURIComponent(place);
    openSheet(`
      <h2>Directions</h2>
      <p class="sub">${esc(place)}</p>
      <div class="sheet-actions">
        <a class="btn btn-primary" href="https://maps.apple.com/?q=${q}" target="_blank" rel="noopener">Open in Apple Maps</a>
        <a class="btn btn-secondary" href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener">Open in Google Maps</a>
        <button class="btn btn-secondary" data-close>Cancel</button>
      </div>
    `);
  }

  function openLogSheet(idea) {
    let rating = 0;
    openSheet(`
      <h2>How was it?</h2>
      <p class="sub">${esc(idea.title)}</p>
      <div class="rating" id="rating" role="group" aria-label="Rating">
        ${[1, 2, 3, 4, 5].map(n => `<button data-r="${n}" aria-label="${n} of 5">${icon("heart")}</button>`).join("")}
      </div>
      <label class="field-label" for="note">Note (optional)</label>
      <textarea id="note" maxlength="280" placeholder="Best part, funniest moment…"></textarea>
      <div class="sheet-actions">
        <button class="btn btn-green" id="log-save" disabled>Save to history</button>
        <button class="btn btn-secondary" data-close>Cancel</button>
      </div>
    `);
    $("#rating").addEventListener("click", e => {
      const b = e.target.closest("button");
      if (!b) return;
      rating = Number(b.dataset.r);
      [...$("#rating").children].forEach((el, i) => {
        el.classList.toggle("on", i < rating);
        el.innerHTML = icon(i < rating ? "heartFill" : "heart");
      });
      $("#log-save").disabled = false;
    });
    $("#log-save").addEventListener("click", () => {
      state.history.unshift({
        id: Date.now(),
        ideaId: idea.id,
        title: idea.title,
        tier: idea.tier,
        area: idea.area || "",
        rating,
        note: $("#note").value.trim(),
        at: new Date().toISOString()
      });
      store.set("history", state.history);
      closeSheet();
      $("#result").hidden = true;
      renderHistory();
      switchTab("history");
      toast(idea.tier === "in" ? "Added to history" : "Added. That's a night out.");
    });
  }

  $("#sheet").addEventListener("click", e => {
    if (e.target.closest("[data-close]")) closeSheet();
    if (e.target.closest("a.btn")) setTimeout(closeSheet, 300);
  });

  /* ---------- Browse screen ---------- */
  const TIME_LABEL = { short: "Under 2 hrs", half: "Half day", full: "Full day" };

  function renderBrowseTier() {
    const opts = [[null, "All"], ["in", "Stay in"], ["ease", "Ease out"], ["send", "Full send"], ["custom", "Ours"]];
    $("#browse-tier").innerHTML = opts.map(([v, label]) =>
      `<button class="${state.browseTier === v ? "on" : ""}" aria-pressed="${state.browseTier === v}" data-val='${JSON.stringify(v)}'>${label}</button>`).join("");
  }

  function browseDrive(i) {
    const d = driveFrom(i, state.filters.from || "mid");
    return d == null ? "" : ` · ${fmtMin(d)}`;
  }

  function renderBrowse() {
    renderBrowseTier();
    const q = $("#browse-q").value.trim().toLowerCase();
    const t = state.browseTier;
    const anyFilters = FILTERS.some(f => state.filters[f.key] != null);
    const list = seasonal()
      .filter(i => !(state.browseUseFilters && anyFilters) || !misses(i).length)
      .filter(i => !t || (t === "custom" ? i.custom : i.tier === t))
      .filter(i => !q || [i.title, i.desc, i.area, i.place].join(" ").toLowerCase().includes(q))
      .sort((a, b) => a.title.localeCompare(b.title));
    $("#browse-count").textContent = `${seasonal().length} ideas right now`;
    const toggle = anyFilters
      ? `<button class="text-btn" id="browse-filter-toggle">${state.browseUseFilters ? "Show all ideas" : "Use my filters"}</button>` : "";
    const extras = !q && !t ? browseExtras() : "";
    const updated = window.DATE_IDEAS_UPDATED
      ? `<p class="list-meta updated">Ideas last updated ${parseDay(window.DATE_IDEAS_UPDATED).toLocaleDateString(undefined, { month: "long", day: "numeric" })}</p>` : "";
    $("#browse-list").innerHTML = extras + (list.length ? `
      <div class="list-meta"><span>${list.length} ${list.length === 1 ? "idea" : "ideas"}${anyFilters && state.browseUseFilters ? " match your filters" : ""}</span>${toggle}</div>
      <div class="group list">
        ${list.map(i => `
          <button class="row row-btn" data-tier="${i.tier}" data-open="${esc(i.id)}">
            <span class="dot"></span>
            <span class="row-main">
              <span class="row-title">${esc(i.title)}</span>
              <span class="row-sub">${esc(i.area || "Anywhere")} · ${esc(BUDGET[i.budget] || "")} · ${TIME_LABEL[i.time] || ""}${browseDrive(i)}</span>
            </span>
          </button>`).join("")}
      </div>` : `
      <div class="empty">
        ${icon(t === "custom" ? "plus" : "search")}
        <h3>${t === "custom" && !q ? "No ideas of your own yet" : "Nothing found"}</h3>
        <p>${t === "custom" && !q ? "Tap “Add idea” to add a place or plan the app doesn't know about." : "Try a different word, like a neighborhood or “beach”."}</p>
        ${toggle}
      </div>`) + updated;
  }

  const rowHTML = (i, sub) => `
          <button class="row row-btn" data-tier="${i.tier}" data-open="${esc(i.id)}">
            <span class="dot"></span>
            <span class="row-main">
              <span class="row-title">${esc(i.title)}</span>
              <span class="row-sub">${sub}</span>
            </span>
          </button>`;

  // Same three ideas all day, new ones tomorrow
  function todaysThree() {
    let seed = TODAY.getFullYear() * 400 + TODAY.getMonth() * 32 + TODAY.getDate();
    const rand = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const picks = [];
    ["in", "ease", "send"].forEach(tier => {
      const options = seasonal().filter(i => i.tier === tier && !i.custom);
      if (options.length) picks.push(options[Math.floor(rand() * options.length)]);
    });
    return picks;
  }

  function browseExtras() {
    const soon = seasonal().filter(isDated).sort((a, b) => daysUntil(a) - daysUntil(b));
    let html = "";
    if (soon.length) {
      html += `<section class="browse-section"><h2 class="section-label pad">Happening soon</h2><div class="group list">
        ${soon.map(i => rowHTML(i, `${esc(dateLabel(i))} · ${esc(i.area || "")}`)).join("")}</div></section>`;
    }
    html += `<section class="browse-section"><h2 class="section-label pad">Today's three</h2><div class="group list">
      ${todaysThree().map(i => rowHTML(i, `${TIERS[i.tier].label} · ${esc(i.area || "")}`)).join("")}</div></section>`;
    return html;
  }

  $("#browse-q").addEventListener("input", renderBrowse);
  $("#browse-tier").addEventListener("click", e => {
    const b = e.target.closest("button[data-val]");
    if (!b) return;
    state.browseTier = JSON.parse(b.dataset.val);
    renderBrowse();
  });
  $("#browse-list").addEventListener("click", e => {
    if (e.target.closest("#browse-filter-toggle")) {
      state.browseUseFilters = !state.browseUseFilters;
      renderBrowse();
      return;
    }
    const row = e.target.closest("[data-open]");
    const idea = row && byId(row.dataset.open);
    if (idea) { $("#result").hidden = false; showIdea(idea); }
  });

  /* ---------- Add your own idea ---------- */
  const FORM_SEGS = [
    { key: "tier",   label: "Setting", options: [["in", "Stay in"], ["ease", "Ease out"], ["send", "Full send"]], def: "ease" },
    { key: "budget", label: "Budget",  options: [[0, "Free"], [1, "$"], [2, "$$"], [3, "$$$"]], def: 1 },
    { key: "energy", label: "Energy",  options: [["lazy", "Lazy"], ["chill", "Chill"], ["active", "Active"]], def: "chill" },
    { key: "time",   label: "Time",    options: [["short", "Under 2h"], ["half", "Half day"], ["full", "Full day"]], def: "short" },
    { key: "when",   label: "Best",    options: [["any", "Anytime"], ["day", "Day"], ["night", "Night"]], def: "any" }
  ];

  function openAddSheet() {
    const form = {};
    FORM_SEGS.forEach(f => { form[f.key] = f.def; });
    const segsHTML = () => FORM_SEGS.map(f => `
      <div class="form-row">
        <span class="field-label">${f.label}</span>
        <div class="seg" data-form="${f.key}">
          ${f.options.map(([v, label]) => `<button type="button" class="${form[f.key] === v ? "on" : ""}" data-val='${JSON.stringify(v)}'>${label}</button>`).join("")}
        </div>
      </div>`).join("");

    openSheet(`
      <h2>Add an idea</h2>
      <p class="sub">It saves on this phone and shows up in your picks.</p>
      <label class="field-label" for="f-title">Name</label>
      <input class="field" id="f-title" maxlength="60" placeholder="Taco Tuesday at our spot" autocomplete="off">
      <label class="field-label" for="f-desc">What's the plan? (optional)</label>
      <textarea class="field" id="f-desc" maxlength="200" placeholder="Get the al pastor, then walk to the pier"></textarea>
      <div id="f-segs">${segsHTML()}</div>
      <label class="field-label" for="f-place">Place for directions (optional)</label>
      <input class="field" id="f-place" maxlength="100" placeholder="Name and town, e.g. Shem Creek, Mount Pleasant" autocomplete="off">
      <div class="sheet-actions">
        <button class="btn btn-primary" id="f-save" disabled>Add idea</button>
        <button class="btn btn-secondary" data-close>Cancel</button>
      </div>
    `);

    $("#f-title").addEventListener("input", e => { $("#f-save").disabled = !e.target.value.trim(); });
    $("#f-segs").addEventListener("click", e => {
      const b = e.target.closest("button[data-val]");
      if (!b) return;
      form[b.parentElement.dataset.form] = JSON.parse(b.dataset.val);
      $("#f-segs").innerHTML = segsHTML();
    });
    $("#f-save").addEventListener("click", () => {
      const title = $("#f-title").value.trim();
      if (!title) return;
      const place = $("#f-place").value.trim();
      const idea = {
        id: "custom-" + Date.now(),
        custom: true,
        title,
        desc: $("#f-desc").value.trim(),
        tier: form.tier, budget: form.budget, energy: form.energy, time: form.time, when: form.when,
        area: place ? place.split(",")[0] : "Anywhere",
        cost: BUDGET[form.budget],
        duration: TIME_LABEL[form.time],
        place: place || undefined
      };
      state.custom.push(idea);
      store.set("custom", state.custom);
      rebuildIdeas();
      closeSheet();
      state.browseTier = "custom";
      $("#browse-q").value = "";
      renderBrowse();
      renderCount();
      toast("Idea added");
    });
  }
  $("#add-idea").addEventListener("click", openAddSheet);

  function confirmDeleteCustom(idea) {
    if (!idea || !idea.custom) return;
    openSheet(`
      <h2>Delete this idea?</h2>
      <p class="sub">${esc(idea.title)} will be removed from this phone. Your history stays.</p>
      <div class="sheet-actions">
        <button class="btn btn-danger" id="confirm-del-custom">Delete</button>
        <button class="btn btn-secondary" data-close>Keep it</button>
      </div>
    `);
    $("#confirm-del-custom").addEventListener("click", () => {
      state.custom = state.custom.filter(i => i.id !== idea.id);
      state.saved = state.saved.filter(id => id !== idea.id);
      store.set("custom", state.custom);
      store.set("saved", state.saved);
      rebuildIdeas();
      closeSheet();
      $("#result").hidden = true;
      renderBrowse();
      renderSaved();
      renderCount();
      toast("Idea deleted");
    });
  }

  /* ---------- Today's weather & sunset (free Open-Meteo forecast, no account) ---------- */
  function loadWeather() {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=32.84&longitude=-79.90" +
      "&daily=temperature_2m_max,precipitation_probability_max,sunset&temperature_unit=fahrenheit&timezone=America%2FNew_York&forecast_days=1";
    fetch(url).then(r => r.ok ? r.json() : Promise.reject()).then(data => {
      const d = data.daily;
      const temp = Math.round(d.temperature_2m_max[0]);
      const rain = d.precipitation_probability_max[0];
      const sunset = new Date(d.sunset[0]).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
      const w = $("#weather");
      w.textContent = `High of ${temp}° · ${rain}% chance of rain · Sunset ${sunset}`;
      w.hidden = false;
      if (rain >= 50) {
        const b = $("#rain-banner");
        b.innerHTML = `${icon("rain")}<span>Rain likely today.</span><button class="text-btn" id="rain-go">Show rain-proof ideas</button>`;
        b.hidden = false;
      }
    }).catch(() => {});
  }
  $("#rain-banner").addEventListener("click", e => {
    if (!e.target.closest("#rain-go")) return;
    state.filters = { rainy: true };
    store.set("filters", state.filters);
    renderFilters();
    renderBrowse();
  });

  /* ---------- Share an idea ---------- */
  function shareText(idea) {
    const lines = [`Date idea: ${idea.title}`];
    if (idea.desc) lines.push(idea.desc);
    if (idea.plan && idea.plan.length) lines.push("", ...idea.plan.map((p, i) => `${i + 1}. ${p}`));
    lines.push("", `${idea.area || ""} · ${idea.cost || BUDGET[idea.budget]} · ${idea.duration || ""}`);
    return lines.join("\n");
  }
  async function copyText(text, msg) {
    try { await navigator.clipboard.writeText(text); toast(msg); }
    catch (e) { toast("Couldn't copy. Try again."); }
  }
  $("#share-idea").addEventListener("click", async () => {
    const idea = state.current;
    if (!idea || state.spinning) return;
    const text = shareText(idea);
    if (navigator.share) {
      try { await navigator.share({ title: idea.title, text, url: location.origin + location.pathname }); return; }
      catch (e) { if (e && e.name === "AbortError") return; }
    }
    copyText(text, "Copied. Paste it in a text.");
  });

  /* ---------- Sync between two phones (a copy-paste code, no accounts) ---------- */
  const encode = obj => "DN1." + btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
  const decode = code => JSON.parse(decodeURIComponent(escape(atob(code.trim().replace(/^DN1\./, "")))));

  function openSyncSheet() {
    const code = encode({ s: state.saved, h: state.history, c: state.custom });
    openSheet(`
      <h2>Sync your phones</h2>
      <p class="sub">Send your code to the other phone, then paste theirs here. Saved ideas, history, and your own ideas get combined. Nothing gets deleted.</p>
      <div class="sheet-actions">
        <button class="btn btn-primary" id="sync-send">${icon("share")}Send my code</button>
      </div>
      <label class="field-label sync-label" for="sync-in">Paste their code</label>
      <textarea class="field" id="sync-in" placeholder="DN1.…" autocomplete="off" spellcheck="false"></textarea>
      <div class="sheet-actions">
        <button class="btn btn-green" id="sync-merge" disabled>Combine</button>
        <button class="btn btn-secondary" data-close>Done</button>
      </div>
    `);
    $("#sync-send").addEventListener("click", async () => {
      const text = `Here's my Date Night code. Open the app, go to Saved, tap Sync, and paste it:\n\n${code}`;
      if (navigator.share) {
        try { await navigator.share({ text }); return; }
        catch (e) { if (e && e.name === "AbortError") return; }
      }
      copyText(code, "Code copied. Text it over.");
    });
    $("#sync-in").addEventListener("input", e => { $("#sync-merge").disabled = !e.target.value.includes("DN1."); });
    $("#sync-merge").addEventListener("click", () => {
      const raw = $("#sync-in").value;
      const match = raw.match(/DN1\.[A-Za-z0-9+/=]+/);
      let data;
      try { data = decode(match ? match[0] : raw); } catch (e) { toast("That code didn't work. Copy the whole thing."); return; }
      const before = state.saved.length + state.history.length + state.custom.length;
      (data.s || []).forEach(id => { if (!state.saved.includes(id)) state.saved.push(id); });
      (data.h || []).forEach(h => { if (h && !state.history.some(x => String(x.id) === String(h.id))) state.history.push(h); });
      state.history.sort((a, b) => new Date(b.at) - new Date(a.at));
      (data.c || []).forEach(c => { if (c && c.id && !state.custom.some(x => x.id === c.id)) state.custom.push(c); });
      store.set("saved", state.saved);
      store.set("history", state.history);
      store.set("custom", state.custom);
      rebuildIdeas();
      renderSaved(); renderHistory(); renderBrowse(); renderCount();
      closeSheet();
      const added = state.saved.length + state.history.length + state.custom.length - before;
      toast(added ? `Combined. ${added} new item${added === 1 ? "" : "s"}.` : "Already in sync");
    });
  }
  document.querySelectorAll(".sync-btn").forEach(b => b.addEventListener("click", openSyncSheet));

  /* ---------- Saved screen ---------- */
  function renderSaved() {
    const ideas = state.saved.map(byId).filter(Boolean);
    $("#saved-list").innerHTML = ideas.length ? `
      <div class="group list">
        ${ideas.map(i => `
          <div class="row" data-tier="${i.tier}">
            <button class="row-open" data-open="${esc(i.id)}">
              <span class="dot"></span>
              <span class="row-main">
                <p class="row-title">${esc(i.title)}</p>
                <p class="row-sub">${esc(i.area)} · ${esc(i.cost || BUDGET[i.budget])}</p>
              </span>
            </button>
            <button class="row-x" data-unsave="${esc(i.id)}" aria-label="Remove">${icon("x", "i-sm")}</button>
          </div>`).join("")}
      </div>` : `
      <div class="empty">
        ${icon("bookmark")}
        <h3>Nothing saved yet</h3>
        <p>When an idea looks good but tonight isn't the night, tap the bookmark.</p>
      </div>`;
  }

  $("#saved-list").addEventListener("click", e => {
    const open = e.target.closest("[data-open]");
    const unsave = e.target.closest("[data-unsave]");
    if (unsave) {
      state.saved = state.saved.filter(id => id !== unsave.dataset.unsave);
      store.set("saved", state.saved);
      renderSaved();
    } else if (open) {
      const idea = byId(open.dataset.open);
      if (idea) { $("#result").hidden = false; showIdea(idea); }
    }
  });

  /* ---------- History screen ---------- */
  function weekKey(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // back to Monday
    return d.getTime();
  }

  // Weeks in a row (Mon–Sun) with at least one night out
  function weekStreak(outDates) {
    const weeks = new Set(outDates.map(h => weekKey(h.at)));
    const monday = new Date(weekKey(new Date()));
    if (!weeks.has(monday.getTime())) monday.setDate(monday.getDate() - 7); // this week isn't over yet
    let streak = 0;
    while (weeks.has(monday.getTime())) {
      streak++;
      monday.setDate(monday.getDate() - 7);
    }
    return streak;
  }

  function hearts(n) {
    return `<span class="hearts" aria-label="${n} of 5">${[1, 2, 3, 4, 5]
      .map(i => `<span class="${i <= n ? "" : "off"}">${icon("heartFill", "i-sm")}</span>`).join("")}</span>`;
  }

  function renderHistory() {
    const now = new Date();
    const thisMonth = state.history.filter(h => {
      const d = new Date(h.at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const outMonth = thisMonth.filter(h => h.tier !== "in").length;
    const streak = weekStreak(state.history.filter(h => h.tier !== "in"));

    $("#stats").innerHTML = `
      <div class="stat out"><b>${outMonth}</b><span>Nights out</span></div>
      <div class="stat"><b>${thisMonth.length}</b><span>All dates</span></div>
      <div class="stat streak"><b>${streak}</b><span>Week streak</span></div>`;

    $("#cheer").textContent =
      outMonth === 0 ? "No pressure. One sunset counts." :
      outMonth === 1 ? "One night out this month. Nice start." :
      outMonth <= 3  ? "You're getting out more." :
                       "Busy month. Well done, you two.";

    $("#history-list").innerHTML = state.history.length ? `
      <div class="section-head"><h2 class="section-label">Past dates</h2></div>
      <div class="group list">
        ${state.history.map(h => `
          <div class="row" data-tier="${esc(h.tier)}">
            <span class="dot"></span>
            <div class="row-main">
              <p class="row-title">${esc(h.title)}</p>
              <p class="row-sub">${new Date(h.at).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} ${hearts(h.rating)}</p>
              ${h.note ? `<p class="row-note">${esc(h.note)}</p>` : ""}
            </div>
            <button class="row-x" data-del="${h.id}" aria-label="Delete">${icon("x", "i-sm")}</button>
          </div>`).join("")}
      </div>` : `
      <div class="empty">
        ${icon("clock")}
        <h3>No dates yet</h3>
        <p>Pick one, go do it, then tap “We did it” to log it here.</p>
      </div>`;
  }

  $("#history-list").addEventListener("click", e => {
    const del = e.target.closest("[data-del]");
    if (!del) return;
    const entry = state.history.find(h => String(h.id) === del.dataset.del);
    if (!entry) return;
    openSheet(`
      <h2>Delete this date?</h2>
      <p class="sub">${esc(entry.title)} will be removed from your history.</p>
      <div class="sheet-actions">
        <button class="btn btn-danger" id="confirm-del">Delete</button>
        <button class="btn btn-secondary" data-close>Keep it</button>
      </div>
    `);
    $("#confirm-del").addEventListener("click", () => {
      state.history = state.history.filter(h => h !== entry);
      store.set("history", state.history);
      closeSheet();
      renderHistory();
    });
  });

  /* ---------- Tabs ---------- */
  function switchTab(name) {
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === name));
    ["pick", "browse", "saved", "history"].forEach(s => { $("#screen-" + s).hidden = s !== name; });
  }
  document.querySelector(".tabbar").addEventListener("click", e => {
    const tab = e.target.closest(".tab");
    if (tab) switchTab(tab.dataset.tab);
  });

  /* ---------- Start ---------- */
  renderHeader();
  renderFilters();
  renderBrowse();
  loadWeather();
  renderSaved();
  renderHistory();

  if ("serviceWorker" in navigator && location.protocol === "https:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
