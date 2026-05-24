export const CURATED_CATEGORIES = [
  { name: 'מחזורים', parent: 'מחזורים', icon: '◯' },
  { name: 'סידורים', parent: 'סידורים', icon: '▤' },
  { name: 'מוסר ואמונה', parent: 'מוסר ואמונה', icon: '☆' },
  { name: 'הלכה', parent: 'הלכה', icon: '▣' },
  { name: 'גמרות וש"ס', parent: 'גמרות וש"ס', icon: '▦' },
  { name: 'הוצאות מובילות', parent: 'הוצאות מובילות', icon: '⌂' },
  { name: 'סטים מהודרים', parent: 'סטים מהודרים', icon: '▥' },
  { name: 'מתנות והקדשות', parent: 'מתנות והקדשות', icon: '▧' },
  { name: 'בר מצווה', parent: 'בר מצווה', icon: '☆' },
  { name: 'ספרי ילדים', parent: 'ספרי ילדים', icon: '♙' },
]

export const PERSONAL_EMBOSSING_COLLECTION = {
  name: 'ספרים עם הטבעה אישית',
  parent: 'ספרים עם הטבעה אישית',
  icon: '‡',
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

const LEADING_PUBLISHERS = ['עוז והדר', 'חושן', 'פאר היהדות', 'ברזני', 'עטרת']

const PRIMARY_CATEGORY_RULES = [
  {
    name: 'בר מצווה',
    keywords: ['בר מצווה', 'בר מצוה', 'תפילין', 'טלית', 'דרשה', 'חתן בר מצווה', 'נער בר מצווה'],
  },
  {
    name: 'ספרי ילדים',
    keywords: [
      'ילדים',
      'ילד',
      'ילדי',
      'ילדות',
      'נוער',
      'סיפורי צדיקים',
      'סיפורים לילדים',
      'קומיקס',
      'תלמידים',
      'חינוך',
      'גן',
      'כתה',
      'כיתה',
      'חומשים לתלמידים',
      'משניות לתלמידים',
      'פרקי גמרא לתלמידים',
    ],
  },
  {
    name: 'מחזורים',
    keywords: ['מחזור', 'מחזורים', 'מחזורי'],
  },
  {
    name: 'סידורים',
    keywords: ['סידור', 'סידורים', 'סידורי', 'סידורים לבת ישראל', 'סידורים מבוארים', 'סידורים מנחה וערבית', 'כוונת הלב'],
  },
  {
    name: 'הלכה',
    keywords: [
      'הלכה',
      'הלכות',
      'שו"ת',
      'שולחן ערוך',
      'שו"ע',
      'משנה ברורה',
      'ילקוט יוסף',
      'פסקי',
      'אורח חיים',
      'יורה דעה',
      'משנה תורה להרמב"ם',
      'רמב"ם',
      'חושן משפט',
      'אבן העזר',
    ],
  },
  {
    name: 'גמרות וש"ס',
    keywords: [
      'גמרא',
      'גמרות',
      'ש"ס',
      'שס',
      'תלמוד',
      'מסכת',
      'מסכתות',
      'משניות',
      'פרקי גמרא',
      'גמרא כרכים בודדים',
      'מפרשי הש"ס',
      'תלמוד ירושלמי',
      'משניות כרכים בודדים',
    ],
  },
  {
    name: 'מוסר ואמונה',
    keywords: [
      'מוסר',
      'אמונה',
      'מחשבה',
      'השקפה',
      'בטחון',
      'מסילת ישרים',
      'חפץ חיים',
      'חסידות',
      'קבלה',
      'זוהר',
      'פרשת השבוע',
      'תורה ומדע',
      'חיזוק',
      'לשון הקודש',
      'דקדוק',
      'ספרי קבלה',
      'ספרי חסידות',
      'ספרי מוסר',
      'ספרי מחשבה',
      'ספרי אמונה',
    ],
  },
]

const DELUXE_SET_KEYWORDS = ['סט', 'סטים', 'כרכים', 'מהדורה', 'מהודר', 'מפואר', 'עור', 'כריכה', 'מארז', 'יוקרתי']
const DELUXE_SET_STRONG_KEYWORDS = ['סט', 'סטים', 'כרכים', 'מארז']
const DELUXE_PREMIUM_KEYWORDS = ['עור', 'מהודר', 'מפואר', 'יוקרתי']

const GIFT_KEYWORDS = [
  'מתנה',
  'מתנות',
  'הקדשה',
  'הטבעה',
  'מזכרת',
  'מזכרות',
  'אירוע',
  'חתונה',
  'ברכון',
  'זמירות',
  'יודאיקה',
  'כלי כסף',
  'גביע',
  'פמוט',
  'מגנט',
  'ברכת',
  'הפרשת חלה',
  'תפילת הדרך',
  'חמסה',
  'קמיעות',
  'סגולות',
  'מזוזה',
  'מזוזות',
  'נטלה',
  'נטלות',
  'תמונה',
  'תמונות',
  'שילוט',
  'בית כנסת',
  'כלים לפסח',
  'רזיאל',
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
  return [...CURATED_CATEGORIES, PERSONAL_EMBOSSING_COLLECTION].some((category) => normalizeCategoryText(category.name) === normalized)
}

function catalogText(product) {
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

function searchableText(product) {
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

function includesAny(text, keywords) {
  return keywords.some((keyword) => includesKeyword(text, keyword))
}

function productPrice(product) {
  const rawValue = product?.price ?? product?.regular_price ?? product?.sale_price ?? product?.our_price ?? 0
  const normalizedValue = String(rawValue).replace(/[^\d.]/g, '')
  return Number(normalizedValue || 0)
}

export function primaryCuratedCategory(product) {
  const text = catalogText(product)

  for (const rule of PRIMARY_CATEGORY_RULES) {
    if (includesAny(text, rule.keywords)) return rule.name
  }

  const price = productPrice(product)
  const strongSetMatch = includesAny(text, DELUXE_SET_STRONG_KEYWORDS)
  const premiumMatch = includesAny(text, DELUXE_PREMIUM_KEYWORDS) && price >= 180
  if (includesAny(text, DELUXE_SET_KEYWORDS) && (strongSetMatch || premiumMatch)) {
    return 'סטים מהודרים'
  }

  if (includesAny(text, GIFT_KEYWORDS)) return 'מתנות והקדשות'

  return ''
}

function matchesLeadingPublisher(product) {
  return includesAny(catalogText(product), LEADING_PUBLISHERS)
}

function matchesPersonalEmbossing(product) {
  const text = catalogText(product)
  const excluded = PERSONAL_EMBOSSING_COLLECTION.excludeKeywords.some((keyword) => includesKeyword(text, keyword))
  if (excluded) return false
  return PERSONAL_EMBOSSING_COLLECTION.includeKeywords.some((keyword) => includesKeyword(text, keyword))
}

export function productMatchesCuratedCategory(product, categoryName) {
  const normalized = normalizeCategoryText(categoryName)
  const category = [...CURATED_CATEGORIES, PERSONAL_EMBOSSING_COLLECTION].find((item) => normalizeCategoryText(item.name) === normalized)
  if (!category) return false

  if (category.name === PERSONAL_EMBOSSING_COLLECTION.name) return matchesPersonalEmbossing(product)
  if (category.name === 'הוצאות מובילות') return matchesLeadingPublisher(product)

  return primaryCuratedCategory(product) === category.name
}
