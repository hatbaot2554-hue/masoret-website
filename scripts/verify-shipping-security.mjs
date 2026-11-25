import assert from 'node:assert/strict';
import { validateOrderShipping, ShippingValidationError } from '../app/lib/orderShipping.mjs';
import { shippingRates, getShippingFromSource } from '../app/lib/shippingQuote.mjs';

const items = [{ sourceProductId: 10, variationId: 11, quantity: 2 }];
const address = { city: 'Destination' };
const quote = async (rows, city) => {
  assert.deepEqual(rows, [{ productId: 11, quantity: 2 }]);
  assert.equal(city, address.city);
  return { home_delivery: 38, pickup_point: 23 };
};
const run = (body, provider = quote) => validateOrderShipping(body, items, address, provider);
assert.deepEqual(await run({ shippingMethod: 'home', shippingPrice: 38 }), { method: 'home', amount: 38 });
assert.deepEqual(await run({ shippingMethod: 'pickup', shippingPrice: 23 }), { method: 'pickup', amount: 23 });
assert.deepEqual(await run({ shippingMethod: 'self', shippingPrice: 0 }, () => { throw Error('Must not contact provider'); }), { method: 'self', amount: 0 });
for (const price of [0, -1, null, undefined, '38', NaN, Infinity, 23, 39]) {
  await assert.rejects(run({ shippingMethod: 'home', shippingPrice: price }), ShippingValidationError);
}
for (const method of [undefined, '', 'free', '__proto__']) {
  await assert.rejects(run({ shippingMethod: method, shippingPrice: 0 }), ShippingValidationError);
}
await assert.rejects(run({ shippingMethod: 'home', shippingPrice: 38 }, async () => ({ home_delivery: null })), ShippingValidationError);
await assert.rejects(run({ shippingMethod: 'home', shippingPrice: 38 }, async () => { throw Error('Provider offline'); }), /Provider offline/);
console.log('PASS: canonical product/variation and destination, delivery methods, tampering, missing rates and provider outage. No real orders.');

const rate = { name: 'home delivery', method_id: 'flat_rate', currency_code: 'ILS', currency_minor_unit: 2, price: '6900', taxes: '0' };
const pack = (...rates) => ({ shipping_rates: rates });
assert.deepEqual(shippingRates({ shipping_rates: [pack(rate)] }), { home_delivery: 69, pickup_point: null, source: 'live' });
assert.equal(shippingRates({ shipping_rates: [pack(rate), pack(rate)] }).home_delivery, 138);
assert.throws(() => shippingRates({ shipping_rates: [pack({ ...rate, currency_code: 'USD' })] }));
assert.throws(() => shippingRates({ shipping_rates: [pack(rate, rate)] }));
assert.throws(() => shippingRates({ shipping_rates: [] }));
assert.throws(() => shippingRates({ shipping_rates: [pack({ ...rate, price: '-1' })] }));
const originalFetch = globalThis.fetch;
try {
  const paths = [];
  globalThis.fetch = async (url, options) => {
    paths.push(url);
    assert.ok(!url.includes('checkout'));
    return { ok: true, headers: new Headers({ 'cart-token': 'test-only' }), json: async () => ({
      items: options.method === 'GET' ? [] : [{ id: 10, quantity: 2 }], shipping_rates: [pack(rate)],
    }) };
  };
  assert.equal((await getShippingFromSource([{ productId: 10, quantity: 2 }], 'Test')).home_delivery, 69);
  assert.equal(paths.length, 3);
  await assert.rejects(getShippingFromSource([{ productId: 10, quantity: 3 }], 'Test'), /mismatch/);
} finally { globalThis.fetch = originalFetch; }
console.log('PASS: structured supplier rates, taxes/currency, duplicate/missing rates, exact cart and quantity checks.');
