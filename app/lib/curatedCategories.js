export const CURATED_CATEGORIES = [
  {
    name: 'מחזורים',
    parent: 'מחזורים',
    icon: '◯',
    keywords: ['מחזור', 'מחזורים', 'ימים נוראים', 'ראש השנה', 'יום כיפור', 'יוהכ', 'סליחות'],
  },
  {
    name: 'סידורים',
    parent: 'סידורים',
    icon: '▤',
    keywords: ['סידור', 'סידורים', 'תפילה', 'תפילות', 'תהילים', 'כוונת הלב'],
  },
  {
    name: 'מוסר ואמונה',
    parent: 'מוסר ואמונה',
    icon: '☆',
    keywords: ['מוסר', 'אמונה', 'מחשבה', 'השקפה', 'בטחון', 'מסילת ישרים', 'חפץ חיים', 'חסידות', 'קבלה', 'זוהר', 'פרשת השבוע', 'תורה ומדע', 'חיזוק', 'לשון הקודש', 'דקדוק'],
  },
  {
    name: 'הלכה',
    parent: 'הלכה',
    icon: '▣',
    keywords: ['הלכה', 'הלכות', 'שו"ת', 'שולחן ערוך', 'שו"ע', 'משנה ברורה', 'ילקוט יוסף', 'פסקי', 'אורח חיים', 'יורה דעה'],
  },
  {
    name: 'גמרות וש"ס',
    parent: 'גמרות וש"ס',
    icon: '▦',
    keywords: ['גמרא', 'גמרות', 'ש"ס', 'שס', 'תלמוד', 'משנה', 'משניות', 'פרקי גמרא', 'מסכת'],
  },
  {
    name: 'הוצאות מובילות',
    parent: 'הוצאות מובילות',
    icon: '⬠',
    keywords: ['עוז והדר', 'מתיבתא', 'ארטסקרול', 'מכון ירושלים', 'מוסד הרב קוק', 'פלדהיים', 'יפה נוף', 'וגשל', 'אור החיים', 'פאר היהדות'],
  },
  {
    name: 'סטים מהודרים',
    parent: 'סטים מהודרים',
    icon: '▥',
    keywords: ['סט', 'סטים', 'כרכים', 'מהדורה', 'מהודר', 'מפואר', 'עור', 'סקאי', 'כריכה', 'מארז'],
  },
  {
    name: 'מתנות והקדשות',
    parent: 'מתנות והקדשות',
    icon: '▧',
    keywords: ['מתנה', 'מתנות', 'הקדשה', 'הטבעה', 'מזכרת', 'מזכרות', 'אירוע', 'חתונה', 'ברכון', 'זמירות', 'יודאיקה', 'כלי כסף', 'גביע', 'פמוט', 'מגנט', 'ברכת', 'תפילת', 'הפרשת חלה', 'תפילת הדרך', 'חמסה', 'קמיעות', 'סגולות', 'מזוזה', 'מזוזות', 'נטלה', 'נטלות', 'תמונה', 'תמונות', 'שילוט', 'בית כנסת', 'כלים לפסח', 'רזיאל'],
  },
  {
    name: 'בר מצווה',
    parent: 'בר מצווה',
    icon: '☆',
    keywords: ['בר מצווה', 'בר מצוה', 'תפילין', 'טלית', 'דרשה', 'חתן בר מצווה', 'נער בר מצווה'],
  },
  {
    name: 'ספרי ילדים',
    parent: 'ספרי ילדים',
    icon: '♙',
    keywords: ['ילדים', 'ילד', 'ילדי', 'נוער', 'סיפורים', 'סיפור', 'קומיקס', 'תלמידים', 'חינוך', 'גן', 'כתה', 'כיתה'],
  },
]

export function normalizeCategoryText(value) {
  return String(value || '')
    .replace(/[\u0591-\u05C7]/g, '')
    .replace(/[״"]/g, '"')
    .replace(/[׳']/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

export function isCuratedCategory(categoryName) {
  const normalized = normalizeCategoryText(categoryName)
  return CURATED_CATEGORIES.some((category) => normalizeCategoryText(category.name) === normalized)
}

function productSearchText(product) {
  return normalizeCategoryText([
    product?.name,
    product?.sku,
    product?.description,
    product?.full_description,
    product?.category,
    product?.parent_category,
    product?.child_category,
    product?.publisher,
    product?.brand,
    ...(product?.categories || []),
    ...(product?.tags || []),
  ].filter(Boolean).join(' '))
}

export function productMatchesCuratedCategory(product, categoryName) {
  const normalized = normalizeCategoryText(categoryName)
  const category = CURATED_CATEGORIES.find((item) => normalizeCategoryText(item.name) === normalized)
  if (!category) return false

  const text = productSearchText(product)
  const directMatch = category.keywords.some((keyword) => text.includes(normalizeCategoryText(keyword)))
  if (directMatch) return true

  const hasAnyCuratedMatch = CURATED_CATEGORIES.some((item) =>
    item.keywords.some((keyword) => text.includes(normalizeCategoryText(keyword)))
  )

  return !hasAnyCuratedMatch && category.name === 'מתנות והקדשות'
}
