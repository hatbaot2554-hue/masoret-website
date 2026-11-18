import assert from 'node:assert/strict'
import { messageParts } from '../app/lib/chatText.mjs'
const url = 'https://masoret-website.vercel.app/products/29'
assert.deepEqual(messageParts(`[${url}](${url})`), [{ text: url, url }])
assert.deepEqual(messageParts(`[Book](${url})`), [{ text: 'Book', url }])
assert.equal(messageParts(`${url}.`)[0].url, url)
assert.equal(messageParts('[unsafe](javascript:alert(1))').some(p => p.url), false)
assert.deepEqual(messageParts('**Book**'), [{text:'Book',bold:true}])
console.log('PASS: markdown links, named links, punctuation, unsafe schemes, bold')
