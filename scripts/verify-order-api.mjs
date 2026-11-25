import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { priceOrderItems, OrderValidationError } from '../app/lib/orderPricing.mjs';
import { validateOrderShipping, ShippingValidationError } from '../app/lib/orderShipping.mjs';
let stored, catalogUnavailable = false, guardStatus = 200;
const catalog = [{ product_id: 10, name: 'Book', price: 20, original_price: 12, in_stock: true }];
const context = vm.createContext({
  priceOrderItems, OrderValidationError, validateOrderShipping, ShippingValidationError,
  getShippingFromSource: async () => ({ home_delivery: 38, pickup_point: 23 }),
  checkoutGuard: async () => guardStatus,
  AbortSignal, URL, console: { error() {} },
  process: { env: { DASHBOARD_ORDERS_API_SECRET: 'test-only' } },
  NextResponse: { json: (data, init = {}) => ({ data, status: init.status || 200 }) },
  async fetch(url, options) {
    if (url.includes('raw.githubusercontent.com')) return { ok: !catalogUnavailable, json: async () => catalog };
    assert.equal(url, 'https://masoret-dashboard.vercel.app/api/orders');
    stored = JSON.parse(options.body);
    return { ok: true, json: async () => ({ id: 12345 }) };
  },
});
const source = fs.readFileSync('app/api/orders/route.js', 'utf8')
  .replace(/\r\n/g, '\n')
  .replace(/^import .*\n/gm, '').replace(/export async function /g, 'async function ');
vm.runInContext(source, context);
const body = {
  firstName: 'Test', lastName: 'Only', email: 'test@example.invalid', phone: '0000000000', address: 'Test', city: 'Test',
  shippingMethod: 'home', shippingPrice: 38,
  items: [{ sourceProductId: 10, sourceProductIndex: 0, quantity: 2, price: 20, cost: 0, name: 'Wrong' }],
};
const run = body => context.POST({ headers: new Headers({ 'idempotency-key': '00000000-0000-4000-8000-000000000001' }), json: async () => body });
assert.equal((await run(body)).status, 200);
assert.equal(stored.total_price, 40);
assert.equal(stored.cost_price, 24);
assert.equal(stored.items[0].name, 'Book');
stored = null;
assert.equal((await run({ ...body, shippingPrice: 0 })).status, 409);
assert.equal(stored, null);
assert.equal((await run({ ...body, shippingMethod: 'invented' })).status, 409);
assert.equal(stored, null);
assert.equal((await run({ ...body, items: [{ ...body.items[0], price: 0 }] })).status, 409);
assert.equal(stored, null);
catalogUnavailable = true;
assert.equal((await run(body)).status, 500);
assert.equal(stored, null);
guardStatus = 429;
assert.equal((await run(body)).status, 429);
guardStatus = 503;
assert.equal((await run(body)).status, 503);
assert.equal(stored, null);
console.log('PASS: route uses authoritative pricing; tampered price and unavailable catalog never create an order. All network mocked.');
