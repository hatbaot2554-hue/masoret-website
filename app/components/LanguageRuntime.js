'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const LanguageContext = createContext({
  lang: 'he',
  isEnglish: false,
  setLang: () => {},
  toggleLang: () => {},
  t: (he, en) => he || en || '',
})

const TEXT_MAP = {
  'המרכז למסורת יהודית': 'Jewish Heritage Center',
  'ספרי קודש ויהדות': 'Jewish books and Judaica',
  'מאז תמיד': 'Since always',
  'משלוח חינם בהזמנה מעל ₪200 | שירות לקוחות: א׳-ה׳ 9:00-15:00': 'Free shipping over ₪200 | Customer service: Sun-Thu 9:00-15:00',
  'משלוח חינם מעל ₪200 | א׳-ה׳ 9:00-15:00': 'Free shipping over ₪200 | Sun-Thu 9:00-15:00',
  'ספרי קודש איכותיים — מהמדף שלנו לבית שלך': 'Quality Jewish books, from our shelves to your home',
  'ספרי קודש איכותיים —': 'Quality Jewish books —',
  'מהמדף שלנו לבית שלך': 'from our shelves to your home',
  'משלוח מהיר לכל הארץ, הטבעת הקדשה אישית, ושירות לקוחות שתמיד זמין לעזור. כי כל ספר קודש מגיע עם לב.': 'Fast shipping nationwide, personal dedication embossing, and customer service that is always ready to help. Every sacred book arrives with care.',
  'למעלה מ-5,000 ספרי קודש': 'Over 5,000 Jewish books',
  'כל הספרים': 'All books',
  'מעקב הזמנה': 'Track order',
  'צור קשר': 'Contact',
  'מועדפים': 'Wishlist',
  'עגלה': 'Cart',
  'אזור אישי': 'My account',
  'דף הבית': 'Home',
  'תקנון ותנאי שימוש': 'Terms and conditions',
  'ניווט מהיר': 'Quick navigation',
  'אמצעי תשלום': 'Payment options',
  'משלוח עד הבית': 'Home delivery',
  'הטבעה אישית': 'Personal embossing',
  'עד 6 תשלומים': 'Up to 6 payments',
  'שירות מעולה': 'Excellent service',
  'משלוח תוך 8 ימי עסקים': 'Delivery within 8 business days',
  'תשלום מאובטח': 'Secure payment',
  'איסוף עצמי זמין': 'Pickup available',
  'עד 6 תשלומים ללא ריבית': 'Up to 6 interest-free payments',
  'ביטול: 5% דמי ביטול': 'Cancellation fee: 5%',
  'לכל הספרים ←': 'All books ←',
  'רב-מכרים 🔥': 'Best sellers 🔥',
  'אוסף נבחר': 'Featured collection',
  'ספרים מומלצים': 'Recommended books',
  'הספרים הנמכרים והאהובים ביותר על הלקוחות שלנו': 'Our customers’ most popular and loved books',
  'חיפוש...': 'Search...',
  'חיפוש לפי שם או מק"ט...': 'Search by name or SKU...',
  'שם הספר או שם המחבר או חלק ממנו': 'Book title, author, or part of it',
  'חיפוש בתוך הדף': 'Search within this page',
  'מוצרים נמצאו': 'products found',
  'לא נמצאו מוצרים עבור': 'No products found for',
  'נסה מילה קצרה יותר או כתיב אחר.': 'Try a shorter word or a different spelling.',
  'שיחה': 'Chat',
  'AI יועץ קניות': 'AI shopping advisor',
  'שירות לקוחות': 'Customer service',
  'עזרה בהזמנות, מוצרים, משלוחים והחזרות': 'Help with orders, products, shipping and returns',
  'שלח': 'Send',
  'מספר הזמנה': 'Order number',
  'מייל להזמנה': 'Order email',
  'הוסף לסל': 'Add to cart',
  'תיאור הספר': 'Book description',
  'פרטי הספר': 'Book details',
}

const sortedTranslations = Object.entries(TEXT_MAP).sort((a, b) => b[0].length - a[0].length)
const originalTextNodes = new WeakMap()
const originalAttributes = new WeakMap()

function translateValue(value) {
  return sortedTranslations.reduce((next, [he, en]) => next.split(he).join(en), String(value || ''))
}

function shouldSkipNode(node) {
  const parent = node.parentElement
  if (!parent) return true
  return ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE'].includes(parent.tagName)
}

function translateTextNodes(root, lang) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (shouldSkipNode(node)) return NodeFilter.FILTER_REJECT
      if (!String(node.nodeValue || '').trim()) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })

  const nodes = []
  while (walker.nextNode()) nodes.push(walker.currentNode)

  nodes.forEach((node) => {
    if (!originalTextNodes.has(node)) originalTextNodes.set(node, node.nodeValue)
    const original = originalTextNodes.get(node)
    node.nodeValue = lang === 'en' ? translateValue(original) : original
  })
}

function translateAttributes(root, lang) {
  root.querySelectorAll('input[placeholder], textarea[placeholder], [aria-label], [title]').forEach((element) => {
    if (!originalAttributes.has(element)) originalAttributes.set(element, {})
    const originals = originalAttributes.get(element)

    ;['placeholder', 'aria-label', 'title'].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return
      if (!originals[attribute]) originals[attribute] = element.getAttribute(attribute)
      const original = originals[attribute]
      element.setAttribute(attribute, lang === 'en' ? translateValue(original) : original)
    })
  })
}

function applyLanguage(lang) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl'
  document.body.dataset.lang = lang
  document.title = lang === 'en' ? translateValue(document.title) : 'מסורת - המרכז למסורת יהודית'
  translateTextNodes(document.body, lang)
  translateAttributes(document.body, lang)
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('he')

  useEffect(() => {
    window.localStorage.removeItem('masoret_lang')
    setLangState('he')
    applyLanguage('he')
  }, [])

  useEffect(() => {
    applyLanguage(lang)

    const observer = new MutationObserver(() => applyLanguage(lang))
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [lang])

  function setLang(nextLang) {
    const normalized = nextLang === 'en' ? 'en' : 'he'
    setLangState(normalized)
  }

  const value = useMemo(() => ({
    lang,
    isEnglish: lang === 'en',
    setLang,
    toggleLang: () => setLang(lang === 'en' ? 'he' : 'en'),
    t: (he, en) => (lang === 'en' ? en : he),
  }), [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}

export function LanguageToggle({ compact = false }) {
  const { lang, setLang } = useLanguage()

  return (
    <div className="language-toggle" dir="ltr" aria-label="Language selector">
      <button type="button" className={lang === 'he' ? 'active' : ''} aria-pressed={lang === 'he'} onClick={() => setLang('he')}>
        {compact ? 'עב' : 'עברית'}
      </button>
      <button type="button" className={lang === 'en' ? 'active' : ''} aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
        EN
      </button>
    </div>
  )
}
