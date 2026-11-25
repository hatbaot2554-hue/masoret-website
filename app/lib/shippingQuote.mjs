const CART_URL = 'https://www.seferkodesh.co.il/wp-json/wc/store/v1/cart';

export function shippingRates(cart) {
  if (cart.errors?.length || !cart.shipping_rates?.length) throw new Error('Shipping rates unavailable');
  const result = { home_delivery: 0, pickup_point: 0, source: 'live' };
  for (const pack of cart.shipping_rates) {
    const rates = pack.shipping_rates || [];
    for (const [key, pattern] of [['home_delivery', /עד הבית|home delivery/i], ['pickup_point', /נקודת|נקודות|pickup point/i]]) {
      const matches = rates.filter(rate => rate.method_id !== 'local_pickup' && pattern.test(rate.name));
      if (matches.length !== 1) { result[key] = null; continue; }
      const rate = matches[0];
      if (rate.currency_code !== 'ILS' || rate.currency_minor_unit !== 2 ||
          !/^\d+$/.test(String(rate.price)) || !/^\d+$/.test(String(rate.taxes))) throw new Error('Invalid shipping currency or price');
      const amount = (Number(rate.price) + Number(rate.taxes)) / 100;
      if (!Number.isSafeInteger(Number(rate.price)) || !Number.isSafeInteger(Number(rate.taxes))) throw new Error('Invalid shipping amount');
      if (result[key] !== null) result[key] += amount;
    }
  }
  if (result.home_delivery === null && result.pickup_point === null) throw new Error('No supported shipping rates');
  return result;
}

export async function getShippingFromSource(items, city) {
  if (!Array.isArray(items) || !items.length || items.length > 100 ||
      items.some(i => !/^\d+$/.test(String(i.productId)) || !Number.isSafeInteger(Number(i.productId)) || Number(i.productId) < 1 || !Number.isInteger(i.quantity) || i.quantity < 1 || i.quantity > 10000) ||
      typeof city !== 'string' || !city.trim() || city.length > 120) throw new Error('Invalid shipping request');
  const expected = new Map();
  for (const item of items) expected.set(Number(item.productId), (expected.get(Number(item.productId)) || 0) + item.quantity);
  const signal = AbortSignal.timeout(45000);
  let token;
  async function request(path, body) {
    const response = await fetch(CART_URL + path, {
      method: body ? 'POST' : 'GET', cache: 'no-store', signal,
      headers: { 'Content-Type': 'application/json', ...(token ? { 'Cart-Token': token } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!response.ok) throw new Error('Shipping provider unavailable');
    token = response.headers.get('cart-token') || token;
    const cart = await response.json();
    if (cart.errors?.length) throw new Error('Shipping provider rejected cart');
    return cart;
  }
  // A fresh, isolated cart is used only to quote shipping. Never call checkout.
  const initial = await request('');
  if (!token || !Array.isArray(initial.items) || initial.items.length) throw new Error('Invalid shipping session');
  for (const [id, quantity] of expected) await request('/add-item', { id, quantity });
  const cart = await request('/update-customer', { shipping_address: { country: 'IL', city: city.trim() } });
  const actual = new Map();
  for (const item of cart.items || []) actual.set(item.id, (actual.get(item.id) || 0) + item.quantity);
  if (actual.size !== expected.size || [...expected].some(([id, qty]) => actual.get(id) !== qty)) throw new Error('Shipping cart mismatch');
  return shippingRates(cart);
}
