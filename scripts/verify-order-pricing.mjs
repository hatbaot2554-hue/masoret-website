import assert from 'node:assert/strict';
import { priceOrderItems, engravingPrice } from '../app/lib/orderPricing.mjs';
const catalog = [{ product_id: 10, name: 'Test', price: 20, original_price: 12, in_stock: true }];
const item = { sourceProductId: 10, sourceProductIndex: 0, quantity: 2, price: 20, cost: 0, name: 'Fake' };
const result = priceOrderItems([item], catalog);
assert.equal(result.subtotal, 40);
assert.equal(result.cost, 24);
assert.equal(result.items[0].name, 'Test');
for (const change of [{ price: 0 }, { price: 1 }, { quantity: -1 }, { quantity: 1.5 }, { sourceProductId: 999 }, { variationId: 99 }]) {
  assert.throws(() => priceOrderItems([{ ...item, ...change }], catalog));
}
for (const change of [{ in_stock: false }, { needs_revalidation: true }, { source_catalog_missing: true }]) {
  assert.throws(() => priceOrderItems([item], [{ ...catalog[0], ...change }]));
}
assert.equal(priceOrderItems([{ ...item, sourceProductIndex: 999 }], catalog).items[0].sourceProductIndex, 0);
assert.equal(priceOrderItems([{ ...item, price: 35, engraving: { type: 'single', qty: 2, text: 'Test', extraCost: 0 } }], catalog).subtotal, 70);
assert.equal(engravingPrice({ type: 'bulk', bulkType: 'up100' }, 100), 170);
assert.throws(() => engravingPrice({ type: 'bulk', bulkType: 'up100' }, 101));
assert.equal(engravingPrice({ type: 'bulk', bulkType: 'over100', extraQty: 5 }, 105), 175);
const variable = [{ ...catalog[0], variations: [{ variation_id: 7, price: 25, original_price: 14, in_stock: true }] }];
assert.throws(() => priceOrderItems([item], variable));
assert.equal(priceOrderItems([{ ...item, variationId: 7, price: 25 }], variable).subtotal, 50);
console.log('PASS: authoritative price/cost/name, changed prices, quantities, missing product, stale index, stock, pending verification, variants and engraving.');
