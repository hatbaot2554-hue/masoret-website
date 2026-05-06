import { NextResponse } from 'next/server'

const PRODUCTS_URL = 'https://raw.githubusercontent.com/hatbaot2554-hue/masoret-automation/main/products.json'
const DASHBOARD_URL = process.env.DASHBOARD_URL || 'https://masoret-dashboard.vercel.app'

function configured(name) {
  return Boolean(process.env[name]?.trim())
}

function check(key, label, scope, status, detail, extra = {}) {
  return { key, label, scope, status, detail, ...extra }
}

async function catalogCheck() {
  try {
    const response = await fetch(PRODUCTS_URL, { cache: 'no-store' })
    if (!response.ok) {
      return check(
        'PRODUCTS_CATALOG',
        'קטלוג מוצרים',
        'אתר הלקוחות',
        'error',
        `לא ניתן למשוך את קובץ המוצרים. תשובת השרת: ${response.status}.`
      )
    }

    const products = await response.json()
    if (!Array.isArray(products)) {
      return check('PRODUCTS_CATALOG', 'קטלוג מוצרים', 'אתר הלקוחות', 'error', 'קובץ המוצרים לא חזר כרשימה תקינה.')
    }

    const inStock = products.filter((product) => product.in_stock !== false).length
    const withImages = products.filter((product) => product.image || product.images?.length).length

    return check(
      'PRODUCTS_CATALOG',
      'קטלוג מוצרים',
      'אתר הלקוחות',
      products.length > 0 ? 'ok' : 'warning',
      `נטענו ${products.length.toLocaleString('he-IL')} מוצרים. ${inStock.toLocaleString('he-IL')} זמינים במלאי, ${withImages.toLocaleString('he-IL')} עם תמונה.`,
      { count: products.length, inStock, withImages }
    )
  } catch (error) {
    return check(
      'PRODUCTS_CATALOG',
      'קטלוג מוצרים',
      'אתר הלקוחות',
      'error',
      error instanceof Error ? error.message : 'בדיקת קטלוג המוצרים נכשלה.'
    )
  }
}

async function dashboardOrdersCheck() {
  try {
    const response = await fetch(`${DASHBOARD_URL}/api/orders`, { cache: 'no-store' })
    if ([200, 400, 401, 405].includes(response.status)) {
      return check(
        'DASHBOARD_ORDERS_API',
        'חיבור הזמנות ללוח הבקרה',
        'אתר הלקוחות',
        'ok',
        'אתר הלקוחות מצליח להגיע ל־API של ההזמנות בלוח הבקרה.'
      )
    }

    return check(
      'DASHBOARD_ORDERS_API',
      'חיבור הזמנות ללוח הבקרה',
      'אתר הלקוחות',
      'warning',
      `ה־API של ההזמנות ענה בתשובה ${response.status}. צריך לבדוק לפני הזמנות אמת.`
    )
  } catch (error) {
    return check(
      'DASHBOARD_ORDERS_API',
      'חיבור הזמנות ללוח הבקרה',
      'אתר הלקוחות',
      'error',
      error instanceof Error ? error.message : 'בדיקת חיבור ההזמנות נכשלה.'
    )
  }
}

function openAiCheck() {
  const hasKey = configured('OPENAI_API_KEY')
  return check(
    'OPENAI_API_KEY',
    'OpenAI לשירות AI',
    'אתר הלקוחות',
    hasKey ? 'ok' : 'missing',
    hasKey
      ? `מפתח OpenAI מוגדר. מודל שירות: ${process.env.OPENAI_SERVICE_MODEL || process.env.OPENAI_MODEL || 'ברירת מחדל'}. מודל ייעוץ: ${process.env.OPENAI_ADVISOR_MODEL || process.env.OPENAI_MODEL || 'ברירת מחדל'}.`
      : 'לא נמצא מפתח OpenAI באתר הלקוחות.'
  )
}

function geminiCheck() {
  const hasKey = configured('GEMINI_API_KEY')
  return check(
    'GEMINI_API_KEY',
    'Gemini לשירות AI',
    'אתר הלקוחות',
    hasKey ? 'ok' : 'missing',
    hasKey
      ? `מפתח Gemini מוגדר. מודל: ${process.env.GEMINI_MODEL || 'gemini-1.5-flash'}.`
      : 'לא נמצא מפתח Gemini באתר הלקוחות.'
  )
}

export async function GET() {
  const checks = [
    await catalogCheck(),
    await dashboardOrdersCheck(),
    openAiCheck(),
    geminiCheck(),
    check(
      'AI_PROVIDER',
      'ספק AI פעיל',
      'אתר הלקוחות',
      configured('OPENAI_API_KEY') || configured('GEMINI_API_KEY') ? 'ok' : 'missing',
      configured('OPENAI_API_KEY')
        ? 'המערכת תנסה OpenAI קודם, ואם אין תשובה תוכל להשתמש בגיבוי לפי הקוד הקיים.'
        : configured('GEMINI_API_KEY')
          ? 'המערכת תשתמש ב־Gemini כספק AI.'
          : 'לא מוגדר ספק AI באתר הלקוחות.'
    ),
  ]

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    safe: true,
    message: 'הבדיקה לא מחזירה ערכי מפתחות, רק מצב כללי של אתר הלקוחות.',
    checks,
  })
}
