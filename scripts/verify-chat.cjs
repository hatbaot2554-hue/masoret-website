const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('app/api/ai-chat/route.js', 'utf8').replace(/^import [^\n]*\n/gm, '').replace('export async function POST', 'async function POST');
const products = [
  {name:'סידור אישי',price:40,in_stock:true},
  {name:'סידור ישן',price:40,in_stock:true,needs_revalidation:true},
  {name:'סידור חסר',price:40,in_stock:false},
];
const context = vm.createContext({process:{env:{}},AbortSignal,console,fetch:async()=>({ok:true,json:async()=>products})});
vm.runInContext(source, context);
(async()=>{
  context.productHref = (await import('../app/lib/productIdentity.mjs')).productHref;
  assert.match(vm.runInContext("generalServiceReply('שלום')",context),/שלום/);
  assert.match(vm.runInContext("generalServiceReply('כמה עולה משלוח?')",context),/בסל/);
  assert.equal(vm.runInContext("generalServiceReply('מה מצב ההזמנה שלי?')",context),null);
  const result = await vm.runInContext("getRelevantProducts('סידור','advisor')",context);
  assert.equal(result.length,1);
  assert.equal(result[0].name,'סידור אישי');
  assert.equal((await vm.runInContext("getRelevantProducts('zzzzunlisted','advisor')",context)).length,0);
  assert.match(vm.runInContext("searchQuery([{role:'user',text:'סידור לאמא'},{role:'user',text:'ומה יותר זול?'}])",context),/סידור לאמא/);
  assert.doesNotMatch(vm.runInContext("fallbackReply('advisor','סידור', [{name:'סידור',price:40,url:'https://example.invalid'}],null)",context),/הבטוחה ביותר/);
  context.checkoutGuard = async () => 200;
  context.NextResponse = { json: data => data };
  context.fetch = async (url, options) => {
    assert.ok(!url.includes('/api/orders'), 'Anonymous chat must not read or write orders');
    assert.ok(!url.includes('/checkout'), 'Chat must not place supplier orders');
    return { ok: true, json: async () => products };
  };
  assert.equal(await context.getVerifiedOrder('12345', 'owner@example.invalid', ''), null);
  const response = await context.POST({ headers: new Headers(), json: async () => ({ mode: 'service', messages: [{ role: 'user', text: 'תזמין לי סידור עכשיו' }] }) });
  assert.equal(response.draftOrderCreated, false);
  assert.equal(response.actionExecuted, false);
  assert.match(response.reply, /cart/);
  console.log('PASS: service intent, history, pending-stock exclusion, unavailable exclusion, no-match, cautious fallback');
})().catch(e=>{console.error(e);process.exitCode=1});
