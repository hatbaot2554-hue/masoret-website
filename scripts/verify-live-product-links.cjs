const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async () => {
  const base = process.env.TEST_SITE_URL || 'https://masoret-website.vercel.app';
  const response = await fetch('https://raw.githubusercontent.com/hatbaot2554-hue/masoret-automation/main/products.json');
  assert.ok(response.ok);
  const products = await response.json();
  const samples = products.filter(p => p.product_id && p.in_stock && !p.needs_revalidation).slice(0, 2);
  assert.equal(samples.length, 2);
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage();
    for (const product of samples) {
      const path = `/products/source/${product.source_product_id || product.product_id}`;
      const result = await page.goto(base + path, { waitUntil: 'domcontentloaded', timeout: 60000 });
      assert.equal(result.status(), 200);
      assert.equal(new URL(page.url()).pathname, path);
      const heading = (await page.locator('h1').first().innerText()).replace(/\s+/g, ' ').trim();
      assert.equal(heading, product.name.replace(/\s+/g, ' ').trim());
      console.log('PASS source ID:', product.product_id, 'matches product heading without index redirect');
    }
    await page.goto(base + '/products/0', { waitUntil: 'domcontentloaded' });
    assert.equal(new URL(page.url()).pathname, '/products');
    const invalid = await page.goto(base + '/products/source/nonexistent-test-identity', { waitUntil: 'domcontentloaded' });
    assert.equal(invalid.status(), 404);
    console.log('PASS ambiguous legacy link and nonexistent ID cannot open another product');
    const health = await (await fetch(base + '/api/system-health')).json();
    assert.equal(health.checks.find(c => c.key === 'CATALOG_SYNC').status, 'error');
    console.log('PASS incomplete catalog visibly reported as an error');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
