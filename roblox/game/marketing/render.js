const { chromium } = require('playwright');
(async () => {
  const [dir, out] = [process.argv[2], process.argv[3]];
  const browser = await chromium.launch();
  const jobs = [["icon", 512, 512, "icon.png"], ["thumb-a", 1920, 1080, "thumbnail-a.png"], ["thumb-b", 1920, 1080, "thumbnail-b.png"]];
  for (const [kind, w, h, name] of jobs) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await page.goto(`file://${dir}/art.html?kind=${kind}`);
    await page.waitForSelector('body[data-ready="1"]');
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${out}/${name}`, clip: { x: 0, y: 0, width: w, height: h } });
    await page.close();
  }
  await browser.close();
})();
