import assert from 'node:assert/strict'
import { productHref, findSourceProduct } from '../app/lib/productIdentity.mjs'
import { priceOrderItems } from '../app/lib/orderPricing.mjs'
const a = { product_id: 10, sku: '20', name: 'First', price: 30, original_price: 20, in_stock: true }
const b = { product_id: 20, name: 'Second', price: 30, original_price: 20, in_stock: true }
assert.equal(productHref(a), '/products/source/10')
assert.equal(findSourceProduct([a, b], '20').name, 'Second')
assert.equal(findSourceProduct([b, a], '20').name, 'Second')
assert.equal(findSourceProduct([a], '20'), null)
assert.equal(productHref({ index: 0, name: 'Old cart' }), '/products?search=Old%20cart')
assert.throws(() => priceOrderItems([{ sourceProductIndex: 0, quantity: 1, price: 30 }], [b, a]))
assert.equal(priceOrderItems([{ sourceProductIndex: 0, sourceProductId: 10, quantity: 1, price: 30 }], [b, a]).items[0].name, 'First')
console.log('Stable product identity tests passed')
