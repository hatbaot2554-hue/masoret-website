const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const tree = JSON.parse(fs.readFileSync('../masoret-automation-audit/categories.json', 'utf8'));
  const first = tree.find(node => String(node.id).startsWith('menu:'));
  const url = '/products?category=' + encodeURIComponent('source:' + first.id);
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const output = path.resolve('../output/catalog-audit');
  fs.mkdirSync(output, { recursive: true });
  try {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto('https://masoret-website.vercel.app' + url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.getByRole('heading', { level: 1, name: first.name, exact: true }).waitFor({ timeout: 45000 });
      if (viewport.width < 900) {
        await page.getByRole('button', { name: '\u2630', exact: true }).click();
        const group = page.locator('header a').filter({ hasText: first.name }).first();
        await group.locator('..').getByRole('button').click();
      } else {
        await page.locator('header a').filter({ hasText: first.name }).first().hover();
      }
      const child = first.nodes[0];
      const link = page.locator('header a[href="/products?category=' + encodeURIComponent('source:' + child.id) + '"]').first();
      await link.waitFor({ state: 'visible', timeout: 15000 });
      assert.equal(await link.textContent(), child.name);
      await page.screenshot({ path: path.join(output, 'categories-' + viewport.width + '.png') });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2);
      if (overflow) console.log(await page.evaluate(() => [...document.querySelectorAll('body *')].map(el => ({tag:el.tagName,cls:el.className,width:el.getBoundingClientRect().width,left:el.getBoundingClientRect().left,text:el.textContent?.slice(0,50)})).filter(el => el.width > innerWidth + 2).slice(0,20)));
      assert.equal(overflow, false, 'Horizontal page overflow');
      assert.deepEqual(errors, []);
      console.log('PASS navigation and category heading', viewport.width);
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
