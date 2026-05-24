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

export const PERSONAL_EMBOSSING_COLLECTION = {
  name: 'ספרים עם הטבעה אישית',
  parent: 'ספרים עם הטבעה אישית',
  icon: '◇',
  includeKeywords: [
    'מזכרות לאירועים',
    'חגים ומועדים',
    'סידור',
    'סידורים',
    'מחזור',
    'מחזורים',
  ],
  excludeKeywords: [
    'תשעה באב',
    'ט באב',
    'ט׳ באב',
    'בין המצרים',
    'קינות',
    'קינה',
    'שניים מקרא',
    'שנים מקרא',
    'אחד תרגום',
    'סידור לשליח ציבור',
    'סידור לשליח צבור',
    'שליח ציבור',
    'שליח צבור',
    'ש"ץ',
    'שץ',
  ],
}

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
  return [...CURATED_CATEGORIES, PERSONAL_EMBOSSING_COLLECTION].some((category) => normalizeCategoryText(category.name) === normalized)
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

function productCatalogText(product) {
  return normalizeCategoryText([
    product?.name,
    product?.sku,
    product?.category,
    product?.parent_category,
    product?.child_category,
    product?.publisher,
    product?.brand,
    ...(product?.categories || []),
    ...(product?.tags || []),
  ].filter(Boolean).join(' '))
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function includesKeyword(text, keyword) {
  const normalizedKeyword = normalizeCategoryText(keyword)
  if (!normalizedKeyword) return false
  if (normalizedKeyword.includes(' ')) return text.includes(normalizedKeyword)

  const pattern = new RegExp(`(^|[^\\u0590-\\u05FFa-z0-9])${escapeRegExp(normalizedKeyword)}(?=$|[^\\u0590-\\u05FFa-z0-9])`, 'i')
  return pattern.test(text)
}

export function productMatchesCuratedCategory(product, categoryName) {
  const normalized = normalizeCategoryText(categoryName)
  const category = [...CURATED_CATEGORIES, PERSONAL_EMBOSSING_COLLECTION].find((item) => normalizeCategoryText(item.name) === normalized)
  if (!category) return false

  if (category.name === PERSONAL_EMBOSSING_COLLECTION.name) {
    const text = productCatalogText(product)
    const excluded = category.excludeKeywords.some((keyword) => includesKeyword(text, keyword))
    if (excluded) return false
    return category.includeKeywords.some((keyword) => includesKeyword(text, keyword))
  }

  const text = productSearchText(product)
  const directMatch = category.keywords.some((keyword) => includesKeyword(text, keyword))
  if (directMatch) return true

  const hasAnyCuratedMatch = CURATED_CATEGORIES.some((item) =>
    item.keywords.some((keyword) => includesKeyword(text, keyword))
  )

  return !hasAnyCuratedMatch && category.name === 'מתנות והקדשות'
}
