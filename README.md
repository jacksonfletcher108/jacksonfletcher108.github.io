# Supper (formerly Mise)

Source for the meal planner at https://jacksonfletcher108.github.io/mise/

- `index.html`: the whole app (ingredient knowledge, recipe engine, UI). Uses the Tailwind play CDN while editing; open it directly in a browser.
- `build.sh`: compiles Tailwind, inlines it, swaps in `head.html` (title, icons, manifest links), and writes the result to `$SITE/mise/index.html`. Set `SITE` at the top to your local clone of the site repo.
- `tests/`: Playwright checks. `node tests/mise-test3.js /path/to/index.html 1500` generates 1,500 random fridges and flags broken wording, unused sauces and failed rescales.
