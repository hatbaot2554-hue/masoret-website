# -*- coding: utf-8 -*-
from pathlib import Path

route = Path('app/api/ai-chat/route.js')
text = route.read_text(encoding='utf-8')
changed = False

if 'function geminiModelCandidates()' not in text:
    anchor = "const DEFAULT_SERVICE_MODEL = 'gpt-5-mini'\n"
    insert = anchor + """
const GEMINI_FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.0-flash']

function geminiModelCandidates() {
  return [process.env.GEMINI_MODEL, ...GEMINI_FALLBACK_MODELS]
    .map((model) => String(model || '').trim())
    .filter((model, index, models) => model && models.indexOf(model) === index)
}
"""
    if anchor not in text:
        raise RuntimeError('constants anchor not found')
    text = text.replace(anchor, insert, 1)
    changed = True

if 'function isSensitiveServiceAction' not in text:
    safe_functions = """
function isSensitiveServiceAction(query) {
  const q = cleanText(query).toLowerCase()
  return [
    'לבטל הזמנה', 'ביטול הזמנה', 'תבטל', 'שנה כתובת', 'לשנות כתובת', 'להחליף כתובת',
    'להוסיף מוצר', 'להוריד מוצר', 'להחליף מוצר', 'תחייב', 'תשלום', 'החזר כספי', 'זיכוי',
    'תשלח מחדש', 'שלח מחדש', 'תיצור הזמנה', 'תזמין לי'
  ].some((term) => q.includes(term))
}

function safeServiceActionReply(query, order) {
  const orderLine = order
    ? `מצאתי את ההזמנה #${order.number}. הסטטוס כרגע: ${order.status || 'בטיפול'}.`
    : 'כדי להכין בקשת טיפול להזמנה קיימת צריך מספר הזמנה ומייל של ההזמנה.'

  return `${orderLine}\n\nמטעמי בטיחות אני לא מבצע שינוי בפועל מתוך הצ'אט בלבד. אני יכול להכין בקשת טיפול מסודרת לצוות/ללוח הבקרה, ורק אחרי אישור במערכת הפעולה תבוצע.\n\nכתוב לי בדיוק מה תרצה לשנות, ואם מדובר בהזמנה קיימת צרף מספר הזמנה ומייל.`
}
"""
    marker = "async function callGemini({ mode, messages, products, order, query }) {"
    if marker not in text:
        raise RuntimeError('callGemini marker not found')
    text = text.replace(marker, safe_functions + '\n' + marker, 1)
    changed = True

if "process.env.GEMINI_MODEL || 'gemini-1.5-flash'" in text:
    text = text.replace("  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash'\n", "  const model = geminiModelCandidates()[0]\n", 1)
    changed = True

old_fetch = """  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )

  if (!res.ok) return fallbackReply(mode, query, products, order)
  const data = await res.json()
  return data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim() ||
    fallbackReply(mode, query, products, order)
"""
new_fetch = """  for (const candidateModel of geminiModelCandidates()) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${candidateModel}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      )

      if (!res.ok) continue
      const data = await res.json()
      const reply = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim()
      if (reply) return reply
    } catch {
      // Try the next supported Gemini model before falling back to deterministic text.
    }
  }

  return fallbackReply(mode, query, products, order)
"""
if old_fetch in text:
    text = text.replace(old_fetch, new_fetch, 1)
    changed = True

old_post = """    const products = await getRelevantProducts(query)
    const order = mode === 'service' ? await getVerifiedOrder(body.orderNumber, body.email) : null
    const reply = await callGemini({ mode, messages, products, order, query })
"""
new_post = """    const products = await getRelevantProducts(query)
    const order = mode === 'service' ? await getVerifiedOrder(body.orderNumber, body.email) : null

    if (mode === 'service' && isSensitiveServiceAction(query)) {
      return NextResponse.json({
        reply: safeServiceActionReply(query, order),
        products,
        orderFound: Boolean(order),
        safeMode: true,
        actionExecuted: false,
      })
    }

    const modelReply = await callGemini({ mode, messages, products, order, query })
    const reply = mode === 'advisor' && products.length > 0 && cleanText(modelReply).length < 180
      ? fallbackReply(mode, query, products, order)
      : modelReply
"""
if old_post in text:
    text = text.replace(old_post, new_post, 1)
    changed = True
elif 'const reply = await callGemini({ mode, messages, products, order, query })' in text:
    text = text.replace(
        "    const reply = await callGemini({ mode, messages, products, order, query })\n",
        "    const modelReply = await callGemini({ mode, messages, products, order, query })\n    const reply = mode === 'advisor' && products.length > 0 && cleanText(modelReply).length < 180\n      ? fallbackReply(mode, query, products, order)\n      : modelReply\n",
        1,
    )
    changed = True

old_response = """      reply,
      products,
      orderFound: Boolean(order),
"""
new_response = """      reply,
      products,
      orderFound: Boolean(order),
      safeMode: true,
      actionExecuted: false,
"""
if old_response in text and 'actionExecuted: false' not in text:
    text = text.replace(old_response, new_response, 1)
    changed = True

if not changed:
    print('AI safe mode and short reply fallback already present; nothing to do.')
    raise SystemExit(0)

route.write_text(text, encoding='utf-8')
print('AI safe mode patch applied.')
