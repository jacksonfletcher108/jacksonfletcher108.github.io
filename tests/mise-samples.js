const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + process.argv[2]); await p.waitForTimeout(1000);
  const want = process.argv[3].split(',');
  const out = await p.evaluate((want) => {
    const fr = {
      burgers: [['ground beef','buns','cheese','lettuce','tomatoes','onion','pickles','mayo','ketchup','mustard'], ['stove']],
      meatballs: [['ground beef','panko','eggs','parmesan','marinara','pasta','garlic'], ['stove','oven']],
      pizza: [['pizza dough','marinara','mozzarella','pepperoni','mushrooms','basil'], ['oven']],
      melt: [['bread','cheese','deli turkey','tomatoes','butter'], ['stove']],
      enchiladas: [['tortillas','chicken','enchilada sauce','cheese','onion','sour cream'], ['stove','oven']],
      nachos: [['tortilla chips','cheese','ground beef','salsa','sour cream','jalapeño','taco seasoning'], ['stove','oven']],
      lettucewraps: [['ground chicken','lettuce','hoisin','soy sauce','water chestnuts','carrots','garlic','ginger'], ['stove']],
      stuffedpeppers: [['bell pepper','ground turkey','rice','marinara','mozzarella','onion','garlic','italian seasoning'], ['stove','oven']],
      pastabake: [['pasta','marinara','mozzarella','ricotta','sausage','spinach'], ['stove','oven']],
      mac: [['pasta','cheese','milk','butter','flour','bacon'], ['stove']],
      hash: [['potatoes','sausage','onion','bell pepper','eggs'], ['stove','micro']],
      griddle: [['flour','eggs','milk','butter','baking powder','berries','maple syrup'], ['stove']],
      oats: [['oats','milk','banana','peanut butter','cinnamon'], ['micro']],
      risotto: [['arborio rice','broth','mushrooms','parmesan','butter','shallots','garlic'], ['stove']],
      fajitas: [['chicken','bell pepper','onion','tortillas','taco seasoning','lime','sour cream'], ['stove']],
      sandwich: [['canned tuna','mayo','celery','bread','lettuce','lemon'], []],
      pulled: [['pork shoulder','bbq sauce','buns','onion','paprika','cabbage'], ['slow','stove']],
      gnocchi: [['gnocchi','tomatoes','zucchini','sausage','pesto','parmesan'], ['oven']],
      mug: [['eggs','spinach','cheese','ham','milk'], ['micro']],
      wings: [['chicken wings','buffalo sauce','butter','celery','ranch','baking powder'], ['air','stove']],
      tikka: [['chicken','curry powder','greek yogurt','rice','garlic','ginger','lemon','spinach'], ['stove','air']],
      scallops: [['scallops','asparagus','lemon','butter','garlic','farro'], ['stove']],
      allergy: [['chicken','broccoli','rice','soy sauce','peanut butter','garlic','lime'], ['stove'], 'allergic to nuts, under 30 minutes']
    };
    return want.map(id => {
      const [ings, eq, notes] = fr[id];
      let best = null;
      for (let i = 0; i < 60 && !best; i++) { const r = window.Mise.generate({ ingredients: ings, equipment: eq.length ? eq : ['stove'], vibe: 'comfort', notes: notes || '', servings: 2 }); if (r && (r.tid === id || !Object.keys({burgers:1,meatballs:1,pizza:1,melt:1,enchiladas:1,nachos:1,lettucewraps:1,stuffedpeppers:1,pastabake:1,mac:1,hash:1,griddle:1,oats:1,risotto:1,fajitas:1,sandwich:1,pulled:1,gnocchi:1,mug:1,wings:1}).includes(id))) best = r; }
      if (!best) return `## ${id}: NOT GENERATED`;
      const r = best;
      return [`## [${r.tid}] ${r.title} (${r.total} min) mods=${r.mods}`, r.desc, 'HAVE: ' + r.have.map(i => `${i.label} ${i.amt}`).join('; '), 'NEED: ' + r.need.map(i => `${i.label} ${i.amt}${i.sub ? ' [or ' + i.sub + ']' : ''}`).join('; '), 'OPT: ' + r.optional.map(i => i.label).join(', '), 'TOOLS: ' + r.tools.join(', '),
        ...r.steps.map((x, i) => `${i + 1}. [${x.h}] ${x.t}${x.list ? '\n   - ' + x.list.join('\n   - ') : ''}`), 'PRO: ' + r.pro].join('\n');
    }).join('\n\n');
  }, want);
  console.log(out); await b.close();
})();
