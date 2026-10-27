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
    { key: "budget", label: "Budget",      options: [[0, "Free"], [1, "$"], [2, "$$"], [3, "$$$"]] },
    { key: "energy", label: "Energy",      options: [["lazy", "Lazy"], ["chill", "Chill"], ["active", "Active"]] },
    { key: "time",   label: "Time",        options: [["short", "Under 2h"], ["half", "Half day"], ["full", "Full day"]] },
    { key: "tier",   label: "Setting",     options: [["in", "Stay in"], ["ease", "Ease out"], ["send", "Full send"]] },
    { key: "when",   label: "Time of day", options: [["day", "Day"], ["night", "Night"]] }
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
    info:     '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.2"/>'
  };
  const icon = (name, cls = "i") =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

  const MONTH = new Date().getMonth() + 1;
  const IDEAS = (Array.isArray(window.DATE_IDEAS) ? window.DATE_IDEAS : [])
    .filter(i => i && i.id && i.title && TIERS[i.tier]);

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
    current: null,
    recent: [],
    spinning: false
  };

  /* ---------- Helpers ---------- */
  const $ = sel => document.querySelector(sel);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const byId = id => IDEAS.find(i => i.id === id);
  const inSeason = i => !i.months || i.months.includes(MONTH);

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
  function matches(idea) {
    if (!inSeason(idea)) return false;
    const f = state.filters;
    if (f.budget != null && idea.budget !== f.budget) return false;
    if (f.energy && idea.energy !== f.energy) return false;
    if (f.time && idea.time !== f.time) return false;
    if (f.tier && idea.tier !== f.tier) return false;
    if (f.when && idea.when !== "any" && idea.when !== f.when) return false;
    return true;
  }
  const pool = () => IDEAS.filter(matches);

  function weightOf(idea) {
    let w = 1;
    if (idea.months) w *= 2.5;                                    // in-season specials show up more
    if (state.recent.includes(idea.id)) w *= 0.1;                 // avoid repeats
    if (state.history.some(h => h.ideaId === idea.id)) w *= 0.6;  // done before
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
    $("#filter-rows").innerHTML = FILTERS.map(f => {
      const cur = state.filters[f.key];
      const opts = [[null, "Any"], ...f.options];
      return `
        <div class="f-row">
          <span class="f-label">${f.label}</span>
          <div class="seg" role="group" aria-label="${f.label}">
            ${opts.map(([v, label]) => `
              <button class="${(cur == null ? null : cur) === v ? "on" : ""}" aria-pressed="${(cur == null ? null : cur) === v}"
                data-key="${f.key}" data-val='${JSON.stringify(v)}'>${label}</button>`).join("")}
          </div>
        </div>`;
    }).join("");
    $("#clear-filters").hidden = !Object.values(state.filters).some(v => v != null);
    renderCount();
  }

  function renderCount() {
    const list = pool();
    const seasonal = list.filter(i => i.months).length;
    const el = $("#pick-count");
    $("#pick-btn").disabled = !list.length;
    if (!IDEAS.length) {
      el.textContent = "Couldn't read ideas.js. Check it for a missing comma.";
    } else if (!list.length) {
      el.textContent = "Nothing matches these filters. Try loosening one.";
    } else {
      el.textContent = `${list.length} idea${list.length === 1 ? "" : "s"} match` +
        (seasonal ? ` · ${seasonal} in season` : "");
    }
  }

  $("#filter-rows").addEventListener("click", e => {
    const b = e.target.closest("button[data-key]");
    if (!b) return;
    state.filters[b.dataset.key] = JSON.parse(b.dataset.val);
    store.set("filters", state.filters);
    renderFilters();
  });

  $("#clear-filters").addEventListener("click", () => {
    state.filters = {};
    store.set("filters", state.filters);
    renderFilters();
  });

  $("#pick-btn").addEventListener("click", () => spin());

  /* ---------- The idea card ---------- */
  function headHTML(idea, titleClass) {
    return `
      <div class="card-head">
        <span class="setting"><span class="dot"></span>${TIERS[idea.tier].label}</span>
        <div class="title-window"><h2 class="card-title ${titleClass || ""}">${esc(idea.title)}</h2></div>`;
  }

  function cardHTML(idea) {
    const badges = [];
    if (idea.months) badges.push(`<span class="badge season">In season</span>`);
    if (idea.age21) badges.push(`<span class="badge adult">21+</span>`);
    badges.push(`<span class="badge">${BUDGET[idea.budget] || ""}</span>`);
    badges.push(`<span class="badge">${esc(idea.energy.charAt(0).toUpperCase() + idea.energy.slice(1))}</span>`);

    return headHTML(idea) + `
        <p class="card-desc">${esc(idea.desc)}</p>
        <div class="badges">${badges.join("")}</div>
      </div>
      <div class="details in">
        <dl class="group facts">
          <div class="fact"><dt>Cost</dt><dd>${esc(idea.cost || BUDGET[idea.budget])}</dd></div>
          <div class="fact"><dt>Takes</dt><dd>${esc(idea.duration || "")}</dd></div>
          <div class="fact"><dt>Where</dt><dd>${esc(idea.area || "")}</dd></div>
          <div class="fact"><dt>Best</dt><dd>${WHEN[idea.when] || WHEN.any}</dd></div>
        </dl>
        ${idea.verify ? `<p class="note">${icon("info", "i-sm")}<span>This is a real business. Places close and change hours, so check before you go.</span></p>` : ""}
        ${idea.place ? `<button class="btn btn-secondary" id="dir-btn">${icon("nav")}Directions</button>` : ""}
      </div>`;
  }

  function showIdea(idea) {
    state.current = idea;
    state.recent = [idea.id, ...state.recent.filter(id => id !== idea.id)].slice(0, 8);
    const card = $("#card");
    card.dataset.tier = idea.tier;
    card.innerHTML = cardHTML(idea);
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
    const list = pool();
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
      else setTimeout(() => { state.spinning = false; showIdea(final); }, 220);
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
    const q = encodeURIComponent(idea.place);
    openSheet(`
      <h2>Directions</h2>
      <p class="sub">${esc(idea.place)}</p>
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
    ["pick", "saved", "history"].forEach(s => { $("#screen-" + s).hidden = s !== name; });
  }
  document.querySelector(".tabbar").addEventListener("click", e => {
    const tab = e.target.closest(".tab");
    if (tab) switchTab(tab.dataset.tab);
  });

  /* ---------- Start ---------- */
  renderHeader();
  renderFilters();
  renderSaved();
  renderHistory();

  if ("serviceWorker" in navigator && location.protocol === "https:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
