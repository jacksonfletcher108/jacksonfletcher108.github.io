const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const errs = []; p.on('pageerror', e => errs.push('pageerror ' + e.message)); p.on('console', m => { if (m.type() === 'warning' || m.type() === 'error') errs.push(m.text()); });
  const url = process.argv[2].startsWith('http') ? process.argv[2] : 'file://' + process.argv[2];
  await p.goto(url); await p.waitForTimeout(1200);
  const out = await p.evaluate(() => {
    const pools = ['chicken','ground beef','salmon','shrimp','tofu','eggs','black beans','chickpeas','steak','sausage','canned tuna','rotisserie chicken','lentils','pork chops','broccoli','bell pepper','onion','spinach','zucchini','carrots','mushrooms','tomatoes','cucumber','avocado','lettuce','sweet potatoes','potatoes','rice','pasta','ramen','tortillas','quinoa','soy sauce','garlic','ginger','honey','lemon','lime','marinara','canned tomatoes','coconut milk','curry paste','peanut butter','salsa','bbq sauce','pesto','parmesan','cheese','butter','feta','greek yogurt','banana','berries','milk','oats','cumin','paprika','gochujang','broth','chili crisp','mustard','teriyaki','buffalo sauce','balsamic','heavy cream'];
    const equips = ['stove','oven','air','grill','slow','blender'], vibes = ['comfort','light','quick','protein','gourmet'];
    const notes = ['', "I'm feeling sick", "it's super hot outside", 'zero dishes', 'needs to pack for lunch tomorrow', 'vegetarian', 'vegan', 'make it spicy', 'gluten free', 'low carb', 'breakfast', 'date night'];
    const R = () => Math.random();
    let ok = 0, none = 0, problems = [], glazeNoCook = 0, glazeTotal = 0;
    for (let i = 0; i < 800; i++) {
      const ings = pools.filter(() => R() < 0.17);
      const eq = equips.filter(() => R() < 0.5); if (!eq.length) eq.push('stove');
      const s = { ingredients: ings, equipment: eq, vibe: vibes[i % 5], notes: notes[i % notes.length], servings: 1 + (i % 6) };
      let r; try { r = window.Mise.generate(s); } catch (e) { problems.push('THROW ' + e.message + ' ' + JSON.stringify(s)); continue; }
      if (!r) { none++; continue; }
      ok++;
      const txt = JSON.stringify(r.steps) + r.title;
      if (/undefined|NaN|\bnull\b|\[object/.test(txt)) problems.push('BAD TEXT ' + r.title + ' :: ' + (txt.match(/.{50}(undefined|NaN|null|\[object).{30}/) || [''])[0]);
      if (r.steps.some(x => !x.h || !x.t || x.t.length < 15)) problems.push('THIN STEP ' + r.title + ' ' + JSON.stringify(r.steps.find(x => !x.h || !x.t || x.t.length < 15)));
      if (/  |\.\.|, \.| \.|\(\)|the the /.test(txt)) problems.push('TYPO ' + r.title + ' :: ' + (txt.match(/.{40}(  |\.\.|, \.| \.|\(\)|the the ).{30}/) || [''])[0]);
      if (r.steps[0].h !== 'Prep your ingredients' && !/Smoothie/.test(r.title)) problems.push('NO PREP ' + r.title);
      const mixed = r.steps.some(x => x.h === 'Make the sauce');
      if (mixed) { glazeTotal++; if (!r.steps.some(x => /Glaze|Thicken the sauce|Sauce and toss|Sauce it|Glaze on the grill|Warm the sauce/.test(x.h))) { glazeNoCook++; if (glazeNoCook < 4) problems.push('SAUCE NEVER USED ' + r.title + ' :: ' + r.steps.map(x => x.h).join(' > ')); } }
    }
    const full = s => { const r = window.Mise.generate(s); if (!r) return '(none)'; return [`## ${r.title}  (${r.total} min)`, `You'll need: ${r.tools.join(', ')}`, ...r.steps.map((x, i) => `${i + 1}. [${x.h}] ${x.t}${x.list ? '\n   - ' + x.list.join('\n   - ') : ''}`)].join('\n'); };
    return { ok, none, problems: problems.slice(0, 12), problemCount: problems.length, glaze: `${glazeTotal - glazeNoCook}/${glazeTotal} glaze sauces get cooked`,
      sample1: full({ ingredients: ['chicken','broccoli','rice','soy sauce','garlic','honey','ginger'], equipment: ['stove'], vibe: 'comfort' }),
      sample2: full({ ingredients: ['salmon','asparagus','potatoes','lemon','garlic','butter'], equipment: ['stove','oven'], vibe: 'gourmet', notes: 'date night' }) };
  });
  console.log('generated:', out.ok, ' no-recipe:', out.none, ' problems:', out.problemCount, ' |', out.glaze);
  out.problems.forEach(x => console.log('  !', x));
  console.log('\n' + out.sample1 + '\n\n' + out.sample2);
  console.log('\nconsole errors:', errs.filter(e => !/tailwindcss.com should not/.test(e)).slice(0, 8));
  await b.close();
})();
