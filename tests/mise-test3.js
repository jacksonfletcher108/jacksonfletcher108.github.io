const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const errs = []; p.on('pageerror', e => errs.push('pageerror ' + e.message)); p.on('console', m => { if (m.type() === 'warning' || m.type() === 'error') errs.push(m.text()); });
  const url = process.argv[2].startsWith('http') ? process.argv[2] : 'file://' + process.argv[2];
  await p.goto(url); await p.waitForTimeout(1200);
  const out = await p.evaluate((N) => {
    const ING = window.Mise.ING;
    const pools = Object.keys(ING).filter(k => !['salt','pepper','olive oil','water'].includes(k));
    const equips = ['stove','oven','air','grill','slow','blender','micro'], vibes = ['comfort','light','quick','protein','gourmet'];
    const notes = ['', "I'm feeling sick", "it's super hot outside", 'zero dishes', 'needs to pack for lunch tomorrow', 'vegetarian', 'vegan', 'make it spicy', 'gluten free', 'low carb', 'breakfast', 'date night', 'no mushrooms, allergic to nuts', 'under 20 minutes', 'I hate onions and peppers', 'high protein', 'kid friendly', 'no pork or shellfish', 'healthy', 'dairy free'];
    const R = () => Math.random();
    let ok = 0, none = 0, problems = [], tids = {}, glazeNoCook = 0, glazeTotal = 0, rebOk = 0, rebTot = 0;
    for (let i = 0; i < N; i++) {
      const ings = pools.filter(() => R() < 0.09);
      const eq = equips.filter(() => R() < 0.5); if (!eq.length) eq.push('stove');
      const note = notes[i % notes.length];
      const stars = R() < 0.3 ? ings.filter(() => R() < 0.2) : [];
      const s = { ingredients: ings, equipment: eq, vibe: vibes[i % 5], notes: note, servings: 1 + (i % 6), stars };
      let r; try { r = window.Mise.generate(s); } catch (e) { problems.push('THROW ' + e.message + ' ' + e.stack.split('\n')[1]); continue; }
      if (!r) { none++; continue; }
      ok++; tids[r.tid] = (tids[r.tid] || 0) + 1;
      const txt = JSON.stringify(r.steps) + r.title + JSON.stringify(r.need) + JSON.stringify(r.have);
      if (/undefined|NaN|\bnull\b|\[object/.test(txt)) problems.push('BAD TEXT ' + r.tid + ' ' + r.title + ' :: ' + (txt.match(/.{60}(undefined|NaN|null|\[object).{30}/) || [''])[0]);
      if (r.steps.some(x => !x.h || !x.t || x.t.length < 15)) problems.push('THIN STEP ' + r.tid + ' ' + r.title + ' ' + JSON.stringify(r.steps.find(x => !x.h || !x.t || x.t.length < 15)));
      if (/  |\.\.|, \.| \.|\(\)|the the |\bundefined\b/.test(txt)) problems.push('TYPO ' + r.tid + ' ' + r.title + ' :: ' + (txt.match(/.{40}(  |\.\.|, \.| \.|\(\)|the the ).{30}/) || [''])[0]);
      if (r.steps[0].h !== 'Prep your ingredients' && !/Smoothie/.test(r.title)) problems.push('NO PREP ' + r.tid + ' ' + r.title);
      if (/ 1 cups|1 cloves|\b0 (cup|tbsp|tsp)/.test(txt)) problems.push('QTY ' + r.title + ' :: ' + txt.match(/.{30}( 1 cups|1 cloves|\b0 (cup|tbsp|tsp)).{20}/)[0]);
      const m = window.Mise.parseMods(note);
      if (m.avoid) { const bad = [...r.have, ...r.need].filter(x => m.avoid.includes(x.key)); if (bad.length) problems.push('AVOID ' + note + ' -> ' + r.title + ' uses ' + bad.map(x => x.key)); }
      if (/vegetarian|vegan/.test(note) && [...r.have, ...r.need].some(x => ['meat','poultry','seafood'].includes((ING[x.key] || {}).kind))) problems.push('DIET ' + note + ' ' + r.title);
      const mixed = r.steps.some(x => x.h === 'Make the sauce');
      if (mixed) { glazeTotal++; if (!r.steps.some(x => /Glaze|Thicken the sauce|Sauce and toss|Sauce it|Glaze on the grill|Warm the sauce|Simmer in sauce/.test(x.h))) { glazeNoCook++; if (glazeNoCook < 5) problems.push('SAUCE NEVER USED ' + r.tid + ' ' + r.title + ' :: ' + r.steps.map(x => x.h).join(' > ')); } }
      if (i % 4 === 0) { rebTot++; const rb = window.Mise.rebuild(r, r.servings === 6 ? 2 : r.servings + 1); if (rb) rebOk++; }
    }
    return { ok, none, problems: problems.slice(0, 25), problemCount: problems.length, tids, glaze: `${glazeTotal - glazeNoCook}/${glazeTotal}`, reb: `${rebOk}/${rebTot}` };
  }, Number(process.argv[3] || 1500));
  console.log('generated:', out.ok, ' none:', out.none, ' problems:', out.problemCount, ' glaze cooked', out.glaze, ' rescale ok', out.reb);
  console.log(JSON.stringify(out.tids));
  out.problems.forEach(x => console.log('  !', x));
  console.log('console errors:', errs.filter(e => !/tailwindcss.com should not/.test(e)).slice(0, 8));
  await b.close();
})();
