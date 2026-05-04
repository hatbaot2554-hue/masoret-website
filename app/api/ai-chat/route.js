import { NextResponse } from 'next/server'

const PRODUCTS_URL = 'https://raw.githubusercontent.com/hatbaot2554-hue/masoret-automation/main/products.json'
const DASHBOARD_URL = 'https://masoret-dashboard.vercel.app'
const SITE_URL = 'https://masoret-website.vercel.app'

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
    terms: ['תהילים', 'סידור', 'תפילה', 'שבת', 'אמונה', 'מוסר', 'חיזוק', 'נשים', 'בית', 'פרשה', 'מתנה'],
    avoid: ['שליח ציבור', 'חזן', 'גמרא', 'ישיבה', 'תפילין', 'נער', 'בר מצווה'],
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

function fallbackReply(mode, query, products, order) {
  if (mode === 'advisor') {
    const profile = advisorProfile(query)
    if (products.length) {
      const list = products.slice(0, 4).map((p, index) =>
        `${index + 1}. ${p.name} - ₪${p.price}\n   למה מתאים: ${profile?.reason || 'מתאים לפי החיפוש והקטגוריה שלו באתר.'}\n   קישור: ${p.url}`
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

async function callGemini({ mode, messages, products, order, query }) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return fallbackReply(mode, query, products, order)

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
    const reply = await callGemini({ mode, messages, products, order, query })

    return NextResponse.json({
      reply,
      products,
      orderFound: Boolean(order),
    })
  } catch (err) {
    return NextResponse.json({ error: err.message || 'שגיאה בצ׳אט' }, { status: 500 })
  }
}
