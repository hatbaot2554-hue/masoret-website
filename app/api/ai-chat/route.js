import { NextResponse } from 'next/server'

const PRODUCTS_URL = 'https://raw.githubusercontent.com/hatbaot2554-hue/masoret-automation/main/products.json'
const DASHBOARD_URL = 'https://masoret-dashboard.vercel.app'
const SITE_URL = 'https://masoret-website.vercel.app'
const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses'
const DEFAULT_ADVISOR_MODEL = 'gpt-5.1'
const DEFAULT_SERVICE_MODEL = 'gpt-5-mini'

const POLICY_TEXT = `
המרכז למסורת יהודית מוכר ספרי קודש, יהדות, הלכה, חסידות ומחשבה.
משלוחים: בדרך כלל עד 8 ימי עסקים, בהתאם לזמינות ולשיטת המשלוח.
ביטול עסקה: עד 14 יום לפי דין, דמי ביטול 5% או עד 100 ש"ח לפי הנמוך.
מוצר פגום: מבקשים מהלקוח תמונה ותיאור ברור ומעבירים לטיפול דחוף.
הטבעה: קיימות אפשרויות הטבעה על ספרים בודדים או גלופה לכמות.
שינוי הזמנה: יש לאמת מספר הזמנה ומייל. אין להבטיח שינוי שבוצע עד שהמערכת מאשרת או עד שטיפול אנושי מאשר.
הנחות: אפשר להציע הנחה מתונה עד 5% כשיש סיבה שירותית או כדי לסייע בסגירת רכישה.
`

const ADVISOR_PROFILES = [
  {
    keys: ['אמא', 'אימי', 'אמא שלי', 'אמא שלי', 'אישה', 'נשים', 'אמא יקרה', 'לאמא'],
    label: 'מתנה לאמא',
    terms: ['תהילים', 'סידור', 'תפילה', 'שבת', 'אמונה', 'מוסר', 'חיזוק', 'נשים', 'בת ישראל', 'בית', 'פרשה', 'מתנה'],
    avoid: ['שליח ציבור', 'חזן', 'בית כנסת', 'גמרא', 'ישיבה', 'תפילין', 'נער', 'בר מצווה'],
    reason: 'מתאים כמתנה מכובדת ושימושית לאמא: תפילה, תהילים, חיזוק, שבת או ספר יפה לבית.',
  },
  {
    keys: ['בר מצווה', 'ברמצווה', 'בר-מצווה', 'נער', 'תפילין'],
    label: 'מתנה לבר מצווה',
    terms: ['תפילין', 'סידור', 'תהילים', 'הלכה', 'משנה', 'גמרא', 'סט', 'אוצר', 'מתנה', 'עוז והדר'],
    avoid: ['נשים', 'אמא', 'ילדים קטנים'],
    reason: 'מתאים לנער שמתחיל לבנות ספרייה אישית וללימוד יומי.',
  },
  {
    keys: ['חתונה', 'זוג', 'בית חדש', 'מארח', 'שבת', 'מתנה לבית'],
    label: 'מתנה לבית יהודי',
    terms: ['סידור', 'חומש', 'תהילים', 'הלכה', 'שבת', 'בית', 'סט', 'כריכה', 'עוז והדר'],
    avoid: ['שליח ציבור', 'חזן'],
    reason: 'מתאים לבית, לשולחן שבת ולמתנה מכובדת שנשארת לאורך זמן.',
  },
  {
    keys: ['ילד', 'ילדה', 'ילדים', 'מתחיל', 'קריאה', 'גן', 'חיידר'],
    label: 'ספר לילדים',
    terms: ['ילדים', 'סיפורים', 'פרשה', 'תהילים', 'סידור', 'אותיות', 'קומיקס', 'מנוקד'],
    avoid: ['שליח ציבור', 'חזן', 'גמרא עיונית', 'קבלה'],
    reason: 'מתאים להתחלה נעימה, קריאה קלה וחיבור רגשי לתורה ולמצוות.',
  },
  {
    keys: ['הלכה', 'הלכות', 'בית', 'יומי', 'לימוד יומי'],
    label: 'ספר הלכה לבית',
    terms: ['הלכה', 'משנה ברורה', 'שולחן ערוך', 'קיצור', 'ילקוט יוסף', 'שמירת שבת', 'בית'],
    avoid: ['שליח ציבור', 'חזן'],
    reason: 'מתאים לשימוש קבוע בבית ולבירור הלכה למעשה.',
  },
  {
    keys: ['חסידות', 'חסידי', 'מחשבה', 'אמונה', 'מוסר', 'חיזוק'],
    label: 'חסידות ומחשבה',
    terms: ['חסידות', 'תניא', 'מוסר', 'אמונה', 'מחשבה', 'שיחות', 'ליקוטי'],
    avoid: ['שליח ציבור', 'חזן'],
    reason: 'מתאים ללימוד מעורר, חיזוק פנימי ומתנה עם אופי רוחני.',
  },
]

function cleanText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function lastUserText(messages) {
  const last = [...(messages || [])].reverse().find((message) => message.role === 'user')
  return cleanText(last?.text || '')
}

function advisorProfile(query) {
  const q = query.toLowerCase()
  return ADVISOR_PROFILES.find((profile) => profile.keys.some((key) => q.includes(key))) || null
}

function expandedAdvisorQuery(query) {
  const profile = advisorProfile(query)
  if (!profile) return query
  return `${query} ${profile.terms.join(' ')}`
}

function scoreProduct(product, query) {
  const q = expandedAdvisorQuery(query).toLowerCase()
  const profile = advisorProfile(query)
  const text = [
    product.name,
    product.description,
    product.full_description,
    product.category,
    product.parent_category,
    product.child_category,
    ...(product.categories || []),
    ...(product.tags || []),
  ].join(' ').toLowerCase()

  let score = 0
  for (const word of q.split(/\s+/).filter(Boolean)) {
    if (word.length < 2) continue
    if (text.includes(word)) score += 2
    if (String(product.name || '').toLowerCase().includes(word)) score += 3
  }
  if (profile?.terms.some((term) => String(product.name || '').includes(term))) score += 6
  if (profile?.terms.some((term) => String(product.category || '').includes(term) || String(product.parent_category || '').includes(term))) score += 4
  if (profile?.label === 'מתנה לאמא') {
    if (text.includes('בת ישראל') || text.includes('נשים')) score += 26
    if (String(product.name || '').includes('תהילים')) score += 9
    if (String(product.name || '').includes('סידור') && !text.includes('בית כנסת')) score += 7
  }
  if (q.includes('סידור') && String(product.name || '').trim().startsWith('סידור')) score += 8
  if (profile?.avoid?.some((term) => text.includes(term))) score -= 30
  if (!query.includes('שליח ציבור') && !query.includes('חזן') && text.includes('שליח ציבור')) score -= 40
  if (product.in_stock !== false) score += 1
  return score
}

async function getRelevantProducts(query) {
  try {
    const res = await fetch(PRODUCTS_URL, { next: { revalidate: 1800 } })
    if (!res.ok) return []
    const products = await res.json()
    if (!Array.isArray(products)) return []
    const scored = products
      .map((product, index) => ({ ...product, index, score: scoreProduct(product, query) }))
      .filter((product) => product.score > 0)
      .sort((a, b) => b.score - a.score)

    return scored.slice(0, 10).map((product) => ({
      index: product.index,
      name: product.name,
      description: cleanText(product.description || product.full_description || '').slice(0, 260),
      price: product.price,
      regular_price: product.regular_our_price || product.regular_price,
      category: product.category || product.parent_category,
      in_stock: product.in_stock !== false,
      stock_text: product.stock_text || '',
      sku: product.sku || product.product_id || '',
      image: product.image || product.images?.[0]?.src || '',
      url: `${SITE_URL}/products/${product.index}`,
    }))
  } catch {
    return []
  }
}

async function getVerifiedOrder(orderNumber, email) {
  if (!orderNumber || !email) return null
  try {
    const res = await fetch(
      `${DASHBOARD_URL}/api/orders?order=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`,
      { cache: 'no-store' }
    )
    if (!res.ok) return null
    const data = await res.json()
    if (!data?.order) return null
    const order = data.order
    return {
      number: order.our_order_id || orderNumber,
      status: order.status_he || order.status || '',
      date: order.date || '',
      total: order.total_price,
      items: Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]'),
      notes: order.notes || '',
    }
  } catch {
    return null
  }
}

function generateOrderId(dbId) {
  if (dbId) {
    const numeric = String(dbId).replace(/\D/g, '')
    return numeric.slice(-5).padStart(5, '0')
  }
  return String(Date.now()).slice(-5)
}

function conversationText(messages) {
  return (messages || []).map((message) => cleanText(message.text || '')).join('\n')
}

function isOrderIntent(text) {
  const normalized = cleanText(text).toLowerCase()
  if (['להזמין', 'הזמנה', 'רוצה לקנות', 'לקנות', 'רכישה', 'תזמין', 'תזמינו'].some((term) => normalized.includes(term))) {
    return true
  }
  return /(?:להזמין|הזמנה|רוצה לקנות|לקנות|רכישה|תזמין|תזמינו|order|buy)/i.test(text)
}

function isExplicitOrderRequest(text) {
  const normalized = cleanText(text).toLowerCase()
  const terms = [
    '\u05dc\u05d4\u05d6\u05de\u05d9\u05df',
    '\u05d4\u05d6\u05de\u05e0\u05d4',
    '\u05dc\u05e7\u05e0\u05d5\u05ea',
    '\u05e8\u05d5\u05e6\u05d4 \u05dc\u05e7\u05e0\u05d5\u05ea',
    '\u05e8\u05db\u05d9\u05e9\u05d4',
    '\u05ea\u05d6\u05de\u05d9\u05df',
    '\u05ea\u05d6\u05de\u05d9\u05e0\u05d5',
    'order',
    'buy',
  ]
  return terms.some((term) => normalized.includes(term))
}

function isProductInfoQuestion(text) {
  const normalized = cleanText(text).toLowerCase()
  const terms = [
    '\u05db\u05de\u05d4',
    '\u05de\u05d7\u05d9\u05e8',
    '\u05de\u05dc\u05d0\u05d9',
    '\u05d9\u05e9 \u05dc\u05db\u05dd',
    '\u05de\u05e9\u05dc\u05d5\u05d7',
    '\u05d4\u05d7\u05d6\u05e8\u05d4',
    '\u05d1\u05d9\u05d8\u05d5\u05dc',
    '\u05e9\u05d9\u05e0\u05d5\u05d9',
    '\u05de\u05e6\u05d1',
  ]
  return terms.some((term) => normalized.includes(term))
}

function isSafeOrderConversation(messages) {
  return (messages || []).some((message) => {
    if (message?.role !== 'assistant') return false
    const text = cleanText(message.text || '')
    return text.includes('\u05d6\u05d4 \u05d4\u05de\u05d5\u05e6\u05e8') ||
      (text.includes('\u05de\u05e7') && text.includes('\u05e7\u05d9\u05e9\u05d5\u05e8') && text.includes('\u05de\u05d7\u05d9\u05e8'))
  })
}

function isPlainPositiveConfirmation(text) {
  const normalized = cleanText(text || '').toLowerCase()
  return [
    '\u05db\u05df',
    '\u05e0\u05db\u05d5\u05df',
    '\u05d6\u05d4 \u05d6\u05d4',
    '\u05d6\u05d4 \u05d4\u05de\u05d5\u05e6\u05e8',
    '\u05de\u05d0\u05e9\u05e8',
    '\u05de\u05d0\u05e9\u05e8\u05ea',
    '\u05d0\u05d9\u05e9\u05d5\u05e8',
    'yes',
    'ok',
  ].includes(normalized) ||
    (normalized.includes('\u05db\u05df') && normalized.length <= 18)
}

function labeledValue(text, labels) {
  const escaped = labels.map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  const match = String(text || '').match(new RegExp(`(?:^|[\\n|])\\s*(?:${escaped})\\s*[:=\\-]\\s*([^\\n|]+)`, 'i'))
  return cleanText(match?.[1] || '')
}

function extractEmail(text) {
  return labeledValue(text, ['מייל', 'אימייל', 'email']) ||
    cleanText(String(text || '').match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || '')
}

function extractPhone(text) {
  return labeledValue(text, ['טלפון', 'נייד', 'phone']) ||
    cleanText(String(text || '').match(/(?:\+?972|0)(?:[\s-]?\d){8,9}/)?.[0] || '')
}

function extractQuantity(text) {
  const value = labeledValue(text, ['כמות', 'quantity', 'qty']) ||
    cleanText(String(text || '').match(/(?:^|[\s|])(?:כמות|quantity|qty)\s*[:=]?\s*(\d{1,2})(?:\s|$)/i)?.[1] || '')
  const quantity = Number(value || 1)
  return Number.isFinite(quantity) && quantity > 0 ? Math.min(quantity, 20) : 1
}

function extractSku(text) {
  return labeledValue(text, ['מקט', 'מק"ט', 'sku']) ||
    cleanText(String(text || '').match(/(?:מק"?ט|מקט|sku)\s*[:#=\-]?\s*([A-Za-z0-9-]+)/i)?.[1] || '')
}

function isOrderableCatalogProduct(product) {
  const name = cleanText(product.name || '').toLowerCase()
  if (!name) return false
  if (['משלוח', 'shipping', 'delivery'].includes(name)) return false
  if (name.includes('משלוח') && Number(product.price || 0) <= 80) return false
  return true
}

function meaningfulProductWords(text) {
  const stopWords = new Set([
    'אני', 'רוצה', 'להזמין', 'הזמנה', 'לקנות', 'רכישה', 'תזמין', 'תזמינו',
    'את', 'של', 'לי', 'עם', 'מוצר', 'ספר', 'אחד', 'אחת', 'בבקשה',
    'order', 'buy', 'product',
  ])
  return cleanText(text)
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}"׳״-]/gu, ''))
    .filter((word) => word.length >= 3 && !stopWords.has(word))
}

async function getProductsCatalog() {
  try {
    const res = await fetch(PRODUCTS_URL, { next: { revalidate: 1800 } })
    if (!res.ok) return []
    const products = await res.json()
    return Array.isArray(products) ? products : []
  } catch {
    return []
  }
}

async function findSafeOrderProduct(text) {
  const catalog = await getProductsCatalog()
  if (!catalog.length) return null

  const sku = extractSku(text)
  const productName = labeledValue(text, ['מוצר', 'שם מוצר', 'ספר', 'product'])
  const query = cleanText(productName || text).toLowerCase()

  const exact = catalog.find((product) => {
    const productSku = String(product.sku || product.product_id || product.id || '').toLowerCase()
    const productId = String(product.product_id || product.id || '').toLowerCase()
    return sku && (productSku === sku.toLowerCase() || productId === sku.toLowerCase())
  })
  if (exact) return { product: exact, index: catalog.indexOf(exact) }

  const named = catalog.find((product) => {
    const name = String(product.name || '').toLowerCase()
    return name && (name.includes(query) || query.includes(name))
  })
  if (named) return { product: named, index: catalog.indexOf(named) }

  const importantWords = meaningfulProductWords(productName || text)
  const scored = catalog
    .filter(isOrderableCatalogProduct)
    .map((product, index) => {
      const name = String(product.name || '').toLowerCase()
      const wordHits = importantWords.filter((word) => name.includes(word)).length
      const allImportantWordsInName = importantWords.length > 0 && wordHits === importantWords.length
      return {
        product,
        index,
        score: scoreProduct(product, productName || text) + (wordHits * 18) + (allImportantWordsInName ? 60 : 0),
      }
    })
    .filter((entry) => entry.score > 0 && (importantWords.length === 0 || importantWords.some((word) => String(entry.product.name || '').toLowerCase().includes(word))))
    .sort((a, b) => b.score - a.score)

  return scored[0] ? { product: scored[0].product, index: scored[0].index } : null
}

function productToOrderItem(product, index, quantity) {
  const price = Number(product.price || product.our_price || product.regular_our_price || product.regular_price || 0)
  const cost = Number(product.cost || product.cost_price || product.purchase_price || 0)

  return {
    sku: product.sku || product.product_id || product.id || '',
    cost,
    name: product.name || '',
    image: product.image || product.images?.[0]?.src || '',
    price,
    quantity,
    engraving: null,
    sketchFile: null,
    sourceProductId: String(product.product_id || product.id || ''),
    selectedAttributes: {},
    sourceProductIndex: index,
  }
}

function missingSafeOrderFields(fields) {
  const missing = []
  if (!fields.productFound) missing.push('product')
  if (!fields.name) missing.push('name')
  if (!fields.phone) missing.push('phone')
  if (!fields.email) missing.push('email')
  if (!fields.address) missing.push('address')
  if (!fields.city) missing.push('city')
  return missing
}

function safeOrderFormatReply(missing) {
  return `בשמחה. כדי לפתוח הזמנה דרך הצ'אט בצורה בטוחה, כתוב לי את הפרטים בפורמט הזה:

מקט: 
שם:
טלפון:
מייל:
כתובת:
עיר:
כמות:

חסר כרגע: ${missing.join(', ')}.
אני אשאל אותך שאלה אחת בכל פעם ונתקדם בזהירות.`
}

function safeOrderQuestion(missing) {
  const next = missing[0]
  if (next === 'product' || next.includes('מק') || next.includes('מוצר')) {
    return 'בשמחה. איזה מוצר תרצה להזמין? אפשר לכתוב שם מוצר רגיל, ואני אציג לך את המוצר שמצאתי לאישור.'
  }
  if (next === 'name' || next.includes('שם')) {
    return 'מעולה. על איזה שם לרשום את ההזמנה?'
  }
  if (next === 'phone' || next.includes('טלפון')) {
    return 'מה מספר הטלפון לעדכונים על ההזמנה?'
  }
  if (next === 'email' || next.includes('מייל')) {
    return 'מה כתובת המייל לשליחת עדכונים וקישור תשלום?'
  }
  if (next === 'address' || next.includes('כתובת')) {
    return 'לאיזו כתובת לשלוח את ההזמנה?'
  }
  if (next === 'city' || next.includes('עיר')) {
    return 'באיזו עיר נמצאת הכתובת?'
  }
  const questions = {
    '׳׳§"׳˜ ׳׳• ׳©׳ ׳׳•׳¦׳¨ ׳׳“׳•׳™׳§': 'בשמחה. כדי להתחיל הזמנה דרך הצ׳אט, איזה מוצר תרצה להזמין? אפשר לשלוח שם מוצר או מק״ט.',
    '׳©׳ ׳׳׳': 'מעולה. על איזה שם לרשום את ההזמנה?',
    '׳˜׳׳₪׳•׳': 'מה מספר הטלפון לעדכונים על ההזמנה?',
    '׳׳™׳™׳': 'מה כתובת המייל לשליחת עדכונים וקישור תשלום?',
    '׳›׳×׳•׳‘׳×': 'לאיזו כתובת לשלוח את ההזמנה?',
    '׳¢׳™׳¨': 'באיזו עיר נמצאת הכתובת?',
  }
  return questions[next] || `חסר לי עוד פרט אחד כדי להמשיך: ${next}.`
}

function isProductConfirmationAccepted(messages) {
  const positiveReplies = [
    '\u05db\u05df',
    '\u05e0\u05db\u05d5\u05df',
    '\u05d6\u05d4 \u05d6\u05d4',
    '\u05d6\u05d4 \u05d4\u05de\u05d5\u05e6\u05e8',
    '\u05de\u05d0\u05e9\u05e8',
    '\u05de\u05d0\u05e9\u05e8\u05ea',
    '\u05d0\u05d9\u05e9\u05d5\u05e8',
    'yes',
    'ok',
  ]
  const isPositiveReply = (value) => {
    const text = cleanText(value || '').toLowerCase()
    return isPlainPositiveConfirmation(text) ||
      positiveReplies.includes(text) ||
      (text.includes('\u05db\u05df') && (
        text.includes('\u05d6\u05d4') ||
        text.includes('\u05d4\u05de\u05d5\u05e6\u05e8') ||
        text.includes('\u05e0\u05db\u05d5\u05df') ||
        text.length <= 12
      ))
  }

  let productPromptAt = -1
  for (let index = 0; index < messages.length; index += 1) {
    const text = cleanText(messages[index]?.text || '')
    if (messages[index]?.role === 'assistant' && (
      text.includes(`${SITE_URL}/products/`) ||
      text.includes('\u05de\u05e6\u05d0\u05ea\u05d9 \u05d0\u05ea \u05d4\u05de\u05d5\u05e6\u05e8') ||
      text.includes('\u05d6\u05d4 \u05d4\u05de\u05d5\u05e6\u05e8') ||
      (text.includes('\u05e7\u05d9\u05e9\u05d5\u05e8') && text.includes('\u05ea\u05de\u05d5\u05e0\u05d4'))
    )) {
      productPromptAt = index
    }
  }
  if (productPromptAt >= 0) {
    const replies = messages.slice(productPromptAt + 1).filter((message) => message.role === 'user')
    if (replies.some((message) => isPositiveReply(message.text))) return true
  }
  if (isSafeOrderConversation(messages) && (messages || []).some((message) => message.role === 'user' && isPositiveReply(message.text))) {
    return true
  }

  let plainAskedAt = -1
  for (let index = 0; index < messages.length; index += 1) {
    const text = cleanText(messages[index]?.text || '')
    if (messages[index]?.role === 'assistant' && (
      text.includes('\u05d6\u05d4 \u05d4\u05de\u05d5\u05e6\u05e8') ||
      text.includes('\u05de\u05e6\u05d0\u05ea\u05d9 \u05d0\u05ea \u05d4\u05de\u05d5\u05e6\u05e8')
    )) {
      plainAskedAt = index
    }
  }
  if (plainAskedAt >= 0) {
    const replies = messages.slice(plainAskedAt + 1).filter((message) => message.role === 'user')
    if (replies.some((message) => {
      const text = cleanText(message.text || '').toLowerCase()
      return ['\u05db\u05df', '\u05e0\u05db\u05d5\u05df', '\u05d6\u05d4 \u05d6\u05d4', '\u05d6\u05d4 \u05d4\u05de\u05d5\u05e6\u05e8', '\u05de\u05d0\u05e9\u05e8', '\u05de\u05d0\u05e9\u05e8\u05ea', '\u05d0\u05d9\u05e9\u05d5\u05e8'].includes(text) ||
        (text.includes('\u05db\u05df') && (text.includes('\u05d6\u05d4') || text.includes('\u05d4\u05de\u05d5\u05e6\u05e8') || text.includes('\u05e0\u05db\u05d5\u05df')))
    })) {
      return true
    }
  }
  let askedAt = -1
  for (let index = 0; index < messages.length; index += 1) {
    if (messages[index]?.role === 'assistant' && /זה המוצר/.test(cleanText(messages[index]?.text || ''))) {
      askedAt = index
    }
  }
  const userReplies = messages.slice(Math.max(askedAt + 1, 0)).filter((message) => message.role === 'user')
  return userReplies.some((message) => {
    const text = cleanText(message.text || '').toLowerCase()
    if (isPositiveReply(text)) return true
    if (['כן', 'נכון', 'זה זה', 'זה המוצר', 'מאשר', 'מאשרת', 'אישור'].includes(text)) return true
    if (text.includes('כן') && (text.includes('זה') || text.includes('המוצר') || text.includes('נכון'))) return true
    return /^(כן|נכון|זה זה|זה המוצר|מאשר|מאשרת|אישור|כן זה)$/i.test(text) || /כן.*(זה|המוצר|נכון)/i.test(text)
  })
}

function inferSequentialOrderFields(messages) {
  const fields = {}
  for (let index = 0; index < messages.length - 1; index += 1) {
    const assistantText = cleanText(messages[index]?.text || '')
    const nextMessage = messages[index + 1]
    if (messages[index]?.role !== 'assistant' || nextMessage?.role !== 'user') continue
    const answer = cleanText(nextMessage.text || '')
    if (!answer) continue
    if (assistantText.includes('\u05e2\u05dc \u05d0\u05d9\u05d6\u05d4 \u05e9\u05dd') || assistantText.includes('\u05e9\u05dd \u05dc\u05e8\u05e9\u05d5\u05dd')) fields.name = answer
    if (assistantText.includes('\u05de\u05e1\u05e4\u05e8 \u05d4\u05d8\u05dc\u05e4\u05d5\u05df') || assistantText.includes('\u05d8\u05dc\u05e4\u05d5\u05df \u05dc\u05e2\u05d3\u05db\u05d5\u05e0\u05d9\u05dd')) fields.phone = answer
    if (assistantText.includes('\u05db\u05ea\u05d5\u05d1\u05ea \u05d4\u05de\u05d9\u05d9\u05dc') || assistantText.includes('\u05de\u05d9\u05d9\u05dc \u05dc\u05e9\u05dc\u05d9\u05d7\u05ea')) fields.email = answer
    if (assistantText.includes('\u05dc\u05d0\u05d9\u05d6\u05d5 \u05db\u05ea\u05d5\u05d1\u05ea') || assistantText.includes('\u05db\u05ea\u05d5\u05d1\u05ea \u05dc\u05e9\u05dc\u05d5\u05d7')) fields.address = answer
    if (assistantText.includes('\u05d1\u05d0\u05d9\u05d6\u05d5 \u05e2\u05d9\u05e8') || assistantText.includes('\u05e2\u05d9\u05e8 \u05e0\u05de\u05e6\u05d0\u05ea')) fields.city = answer

    if (/על איזה שם|שם לרשום/.test(assistantText)) fields.name = answer
    if (/מספר הטלפון|טלפון לעדכונים/.test(assistantText)) fields.phone = answer
    if (/כתובת המייל|מייל לשליחת/.test(assistantText)) fields.email = answer
    if (/לאיזו כתובת|כתובת לשלוח/.test(assistantText)) fields.address = answer
    if (/באיזו עיר|עיר נמצאת/.test(assistantText)) fields.city = answer
  }
  return fields
}

function safeOrderProductConfirmation(product, index) {
  const sku = product.sku || product.product_id || product.id || ''
  const image = product.image || product.images?.[0]?.src || ''
  const url = `${SITE_URL}/products/${index}`
  return [
    'מצאתי את המוצר הזה להזמנה:',
    `${product.name || 'מוצר באתר'}`,
    sku ? `מק״ט: ${sku}` : '',
    product.price ? `מחיר: ₪${product.price}` : '',
    `קישור: ${url}`,
    image ? `תמונה: ${image}` : '',
    '',
    'זה המוצר שהתכוונת אליו? כתוב כן, או שלח שם/מק״ט אחר ואדייק את זה.'
  ].filter(Boolean).join('\n')
}

function safeOrderSuccessReply(orderId, firstName, lastName, quantity, itemName) {
  return `פתחתי עבורך הזמנה מספר #${orderId}.

ההזמנה נרשמה על ${firstName}${lastName ? ` ${lastName}` : ''} עבור ${quantity} × ${itemName}.
אחרי בדיקה תקבל קישור לתשלום או עדכון המשך.`
}

async function createSafeAiOrder({ messages, force = false }) {
  const text = conversationText(messages)
  const userText = (messages || [])
    .filter((message) => message.role === 'user')
    .map((message) => cleanText(message.text || ''))
    .join('\n')
  if (!force && !isOrderIntent(text)) return null

  const latestText = lastUserText(messages)
  const continuingOrder = isSafeOrderConversation(messages)
  const productPromptAlreadyShown = continuingOrder && text.includes(`${SITE_URL}/products/`)
  const latestRejectsProduct = latestText.includes('\u05dc\u05d0') ||
    latestText.includes('\u05d0\u05d7\u05e8') ||
    latestText.includes('\u05ea\u05e7\u05df') ||
    latestText.includes('\u05d8\u05e2\u05d5\u05ea')
  const productConfirmed = isProductConfirmationAccepted(messages) ||
    (continuingOrder && (messages || []).some((message) => message.role === 'user' && isPlainPositiveConfirmation(message.text))) ||
    (productPromptAlreadyShown && !latestRejectsProduct)
  const found = continuingOrder || productConfirmed
    ? await findSafeOrderProduct(text)
    : await findSafeOrderProduct(latestText) || await findSafeOrderProduct(text)
  const name = labeledValue(text, ['שם', 'שם מלא', 'לקוח', 'customer'])
  const sequentialFields = inferSequentialOrderFields(messages)
  const phone = extractPhone(text) || sequentialFields.phone || ''
  const email = extractEmail(text) || sequentialFields.email || ''
  const address = labeledValue(text, ['כתובת', 'address'])
  const city = labeledValue(text, ['עיר', 'city'])
  const quantity = extractQuantity(userText)
  const note = labeledValue(text, ['הערות', 'הערה', 'note'])

  const orderName = name || sequentialFields.name || ''
  const orderAddress = address || sequentialFields.address || ''
  const orderCity = city || sequentialFields.city || ''

  const fields = {
    productFound: Boolean(found?.product),
    name: orderName,
    phone,
    email,
    address: orderAddress,
    city: orderCity,
  }
  const missing = missingSafeOrderFields(fields)
  if (found?.product && !productConfirmed) {
    return {
      handled: true,
      created: false,
      reply: safeOrderProductConfirmation(found.product, found.index),
      products: [{
        index: found.index,
        name: found.product.name,
        price: found.product.price,
        sku: found.product.sku || found.product.product_id || found.product.id || '',
        image: found.product.image || found.product.images?.[0]?.src || '',
        url: `${SITE_URL}/products/${found.index}`,
      }],
      needsProductConfirmation: true,
    }
  }
  if (missing.length) {
    return {
      handled: true,
      created: false,
      reply: safeOrderQuestion(missing),
    }
  }

  const [firstName, ...lastNameParts] = orderName.split(/\s+/)
  const item = productToOrderItem(found.product, found.index, quantity)
  const customerPrice = Number(item.price || 0) * quantity
  const costPrice = Number(item.cost || 0) * quantity

  const response = await fetch(`${DASHBOARD_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer_name: orderName,
      customer_phone: phone,
      customer_email: email.toLowerCase(),
      customer_address: `${orderAddress}, ${orderCity}`,
      items: [item],
      total_price: customerPrice,
      cost_price: costPrice,
      profit: customerPrice - costPrice,
      payment_method: 'pending',
      notes: [
        'AI_CHAT_SAFE_ORDER',
        'נוצר דרך הצ׳אט כהזמנה לבדיקה ואישור. לא חויב תשלום.',
        note ? `הערת לקוח: ${note}` : '',
      ].filter(Boolean).join(' | '),
      source: 'ai_chat_safe',
      utm_source: SITE_URL,
    }),
  })

  if (!response.ok) {
    return {
      handled: true,
      created: false,
      reply: 'ניסיתי לפתוח הזמנה זמנית, אבל הייתה תקלה בשמירה. אפשר לנסות שוב בעוד רגע.',
    }
  }

  const saved = await response.json()
  const orderId = generateOrderId(saved?.id)
  const lastName = lastNameParts.join(' ')

  return {
    handled: true,
    created: true,
    orderId,
    reply: safeOrderSuccessReply(orderId, firstName, lastName, quantity, item.name),
  }
}

function fallbackReply(mode, query, products, order) {
  if (mode === 'advisor') {
    const profile = advisorProfile(query)
    if (products.length) {
      const list = products.slice(0, 4).map((p, index) =>
        `${index + 1}. ${p.name} - ₪${p.price}\n   למי מתאים: ${suitabilityReason(p, query, profile)}\n   קישור: ${p.url}`
      ).join('\n')
      return `אלו הבחירות שהייתי מציע עכשיו:\n${list}\n\nהבחירה הבטוחה ביותר בעיניי: ${products[0].name}.`
    }
    return 'הייתי מתחיל מאחד משלושה כיוונים: ספר הלכה שימושי לבית, סידור/תהילים למתנה, או ספר חסידות ומחשבה. אפשר לחפש באתר לפי המילה המרכזית שכתבת, ואני אמשיך לדייק לפי התוצאות.'
  }

  if (order) {
    return `בדקתי את ההזמנה #${order.number}. הסטטוס כרגע: ${order.status || 'בטיפול'}.\nאם תרצה שינוי, כתוב לי בדיוק מה לשנות ואכין בקשת טיפול מסודרת.`
  }

  if (products.length) {
    const list = products.slice(0, 4).map((p) =>
      `• ${p.name} - ${p.in_stock ? 'במלאי' : (p.stock_text || 'לא במלאי')} - ₪${p.price}\n  ${p.url}`
    ).join('\n')
    return `בדקתי לפי מה שכתבת. אלו המוצרים שמצאתי:\n${list}\n\nאם התכוונת לדגם מסוים, כתוב לי מילה מהשם או מק"ט ואבדוק יותר מדויק.`
  }

  return 'בשמחה, אני כאן לעזור. אם זו שאלה על הזמנה קיימת, כתוב מספר הזמנה ומייל כדי שאוכל לבדוק. אם זו שאלה על מוצר, כתוב לי את שם הספר או מה אתה מחפש.'
}

function suitabilityReason(product, query, profile) {
  const name = String(product.name || '')
  const text = [
    product.name,
    product.description,
    product.category,
    product.stock_text,
  ].join(' ')

  if (profile?.label === 'מתנה לאמא') {
    if (text.includes('בת ישראל') || text.includes('נשים')) {
      return 'מתאים במיוחד לאמא או לאישה, כי זה מוצר שמכוון לשימוש אישי של נשים ולא לסדר תפילה ציבורי.'
    }
    if (name.includes('תהילים')) {
      return 'מתאים כמתנה אישית ומכובדת לאמא, במיוחד למי שמתחברת לתפילה, בקשות וחיזוק יומי.'
    }
    if (name.includes('סידור')) {
      return 'מתאים לאמא אם רוצים מתנה שימושית לתפילה יומיומית, ועדיף לבחור נוסח וגודל לפי ההרגל שלה.'
    }
    if (text.includes('שבת') || text.includes('בית')) {
      return 'מתאים לבית ולשולחן שבת, ולכן זו מתנה שימושית יותר ממשהו שמיועד ללימוד ישיבתי.'
    }
  }

  if (profile?.label === 'מתנה לבר מצווה') {
    return 'מתאים לנער שמתחיל לבנות ספרייה אישית, עם מוצר שימושי ללימוד או לתפילה.'
  }
  if (profile?.label === 'ספר לילדים') {
    return 'מתאים לילדים או למתחילים בגלל אופי קל ונגיש יותר.'
  }
  if (profile?.label === 'ספר הלכה לבית') {
    return 'מתאים למי שרוצה ספר שימושי לבירור הלכה בבית ולא רק ללימוד עיוני.'
  }
  if (profile?.label === 'חסידות ומחשבה') {
    return 'מתאים למי שמחפש חיזוק, אמונה או לימוד פנימי יותר.'
  }

  return profile?.reason || 'מתאים לפי שם המוצר, הקטגוריה וההתאמה לחיפוש באתר.'
}

function openAiModelForMode(mode) {
  if (mode === 'advisor') return process.env.OPENAI_ADVISOR_MODEL || process.env.OPENAI_MODEL || DEFAULT_ADVISOR_MODEL
  return process.env.OPENAI_SERVICE_MODEL || process.env.OPENAI_MODEL || DEFAULT_SERVICE_MODEL
}

async function callOpenAIModel({ mode, systemText, historyText, query }) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const model = openAiModelForMode(mode)
  const res = await fetch(OPENAI_RESPONSES_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      instructions: systemText,
      input: `היסטוריית השיחה:\n${historyText}\n\nהודעה אחרונה: ${query}`,
      reasoning: {
        effort: 'low',
      },
      text: {
        verbosity: mode === 'advisor' ? 'medium' : 'low',
      },
      max_output_tokens: mode === 'advisor' ? 900 : 650,
    }),
  })

  if (!res.ok) return null
  const data = await res.json()
  const directText = data.output_text
  const nestedText = data.output
    ?.flatMap((item) => item.content || [])
    ?.map((part) => part.text || '')
    ?.join('')
    ?.trim()

  return String(directText || nestedText || '').trim()
}

async function callGemini({ mode, messages, products, order, query }) {
  const apiKey = process.env.GEMINI_API_KEY

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash'
  const role = mode === 'advisor' ? 'AI יועץ קניות' : 'שירות לקוחות של המרכז למסורת יהודית'
  const disclosureRule = mode === 'advisor'
    ? 'אתה מוצג בגלוי כ-AI יועץ קניות.'
    : 'אתה שירות לקוחות דיגיטלי של האתר. הסגנון טבעי, חם ולא רובוטי, אבל אם שואלים ישירות האם אתה מערכת אוטומטית, אל תשקר.'

  const advisorRules = mode === 'advisor'
    ? `
כללים ליועץ קניות:
1. תן קודם המלצה מעשית וברורה. אל תענה בעיקר בשאלות.
2. החזר 3-4 מוצרים מתוך רשימת המוצרים הרלוונטיים, עם הסבר למי כל אחד מתאים.
3. לפני כל מוצר שאתה מציע, בדוק שהמוצר מתאים לאדם או לצורך שבשאלה. אל תמליץ על מוצר ייעודי לקהל אחר, גם אם יש התאמת מילים בשם.
4. אם הלקוח שואל על מתנה לאדם מסוים, הסבר בקצרה מי בדרך כלל ייהנה מהמוצר ולמה הוא מתאים לאותו אדם.
5. אל תכתוב שוב ושוב "אם תגיד לי למי הספר מיועד..." כתבנית קבועה.
6. מותר לשאול שאלת דיוק אחת בלבד בסוף, וגם זה רק אחרי שנתת המלצות.
7. אם מוצר לא מתאים בדיוק, אמור שהוא "הכי קרוב" והסבר למה.
`
    : ''

  const systemText = `
אתה ${role}. ענה בעברית בלבד, בנימוס, בקצרה יחסית, בטון אישי וחם.
${disclosureRule}
${advisorRules}
כלל חשוב לשירות לקוחות: אל תזכיר ללקוח "אתר מקורי", "נשלח לאתר המקורי", "שליחה בתהליך", "מאושר לשליחה", "טיוטת AI", "אוטומציה פנימית" או שמות של מערכות פנימיות. דבר רק בשפה חיצונית רגילה של חנות: ההזמנה בתהליך, ההזמנה בעיבוד, ההזמנה נרשמה, או תקבל עדכון המשך.
אסור להמציא סטטוס הזמנה, מחיר, מלאי או פעולה שבוצעה.
אם אתה שירות לקוחות והשאלה היא על מוצר, מלאי, מחיר, משלוח, החזרה או מדיניות: ענה ישירות לפי המוצרים והמדיניות. אל תבקש מספר הזמנה אלא אם השאלה באמת דורשת בדיקת הזמנה קיימת או שינוי הזמנה קיימת.
אם יש כמה מוצרים דומים לשאלה, הצג כמה אפשרויות עם קישור ישיר לכל מוצר, מחיר ומצב מלאי.
אם מבקשים שינוי הזמנה, ביטול, הוספה או הורדת מוצר: בקש אימות מספר הזמנה ומייל אם חסר, הסבר שתכין בקשת טיפול, ואל תגיד שהשינוי בוצע בפועל.
אם יש הזמנה מאומתת בהקשר, אפשר להתייחס לסטטוס שלה בלי לחשוף מידע מעבר למה שנדרש.
אם יש מוצרים רלוונטיים, המלץ עם שם, מחיר וקישור ישיר מלא למוצר.
מדיניות האתר:
${POLICY_TEXT}
פרופיל התאמה שזוהה:
${advisorProfile(query)?.label || 'לא זוהה פרופיל מיוחד'}
מוצרים רלוונטיים:
${JSON.stringify(products, null, 2)}
הזמנה מאומתת, אם קיימת:
${order ? JSON.stringify(order, null, 2) : 'אין הזמנה מאומתת'}
`

  const historyText = (messages || [])
    .slice(-8)
    .map((message) => `${message.role === 'user' ? 'לקוח' : 'נציג'}: ${cleanText(message.text)}`)
    .join('\n')

  const body = {
    systemInstruction: {
      parts: [{ text: systemText }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: `היסטוריית השיחה:\n${historyText}\n\nהודעה אחרונה: ${query}` }],
      },
    ],
    generationConfig: {
      temperature: mode === 'advisor' ? 0.45 : 0.45,
      maxOutputTokens: 750,
    },
  }

  const openAiReply = await callOpenAIModel({ mode, systemText, historyText, query })
  if (openAiReply) return openAiReply

  if (!apiKey) return fallbackReply(mode, query, products, order)

  const res = await fetch(
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
}

export async function POST(request) {
  try {
    const body = await request.json()
    const mode = body.mode === 'advisor' ? 'advisor' : 'service'
    const messages = Array.isArray(body.messages) ? body.messages : []
    const query = lastUserText(messages)
    const products = await getRelevantProducts(query)
    const order = mode === 'service' ? await getVerifiedOrder(body.orderNumber, body.email) : null
    const explicitOrderIntent = mode === 'service' && isExplicitOrderRequest(query)
    const productOrderCandidate = mode === 'service' && products.length > 0 && query && !isProductInfoQuestion(query)
    const continuingSafeOrder = mode === 'service' && isSafeOrderConversation(messages)
    const safeOrder = await createSafeAiOrder({
      messages,
      force: mode === 'service' && (
        explicitOrderIntent ||
        productOrderCandidate ||
        continuingSafeOrder ||
        isExplicitOrderRequest(conversationText(messages))
      ),
    })

    if (safeOrder?.handled) {
      return NextResponse.json({
        reply: safeOrder.reply,
        products: safeOrder.products || products,
        orderFound: Boolean(order),
        safeMode: true,
        actionExecuted: false,
        draftOrderCreated: Boolean(safeOrder.created),
        draftOrderId: safeOrder.orderId || null,
        needsProductConfirmation: Boolean(safeOrder.needsProductConfirmation),
        debugVersion: 'safe-order-v8',
      })
    }

    if ((explicitOrderIntent || productOrderCandidate) && products[0]) {
      return NextResponse.json({
        reply: safeOrderProductConfirmation(products[0], products[0].index),
        products: [products[0]],
        orderFound: Boolean(order),
        safeMode: true,
        actionExecuted: false,
        draftOrderCreated: false,
        draftOrderId: null,
        needsProductConfirmation: true,
        debugVersion: 'safe-order-v8-fallback-confirmation',
      })
    }

    const reply = await callGemini({ mode, messages, products, order, query })

    return NextResponse.json({
      reply,
      products,
      orderFound: Boolean(order),
      safeMode: true,
      actionExecuted: false,
      debugVersion: 'safe-order-v8',
    })
  } catch (err) {
    return NextResponse.json({ error: err.message || 'שגיאה בצ׳אט' }, { status: 500 })
  }
}
