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
  'ספרי קודש ויהדות': 'Jewish books and sacred texts',
  'מאז תמיד': 'Since always',
  'משלוח חינם בהזמנה מעל ₪200 | שירות לקוחות: א׳-ה׳ 9:00-15:00': 'Free shipping over ₪200 | Customer service: Sun-Thu 9:00-15:00',
  'משלוח חינם מעל ₪200 | א׳-ה׳ 9:00-15:00': 'Free shipping over ₪200 | Sun-Thu 9:00-15:00',
  'כל הספרים': 'All books',
  'מעקב הזמנה': 'Track order',
  'צור קשר': 'Contact',
  'מועדפים': 'Wishlist',
  'עגלה': 'Cart',
  'אזור אישי': 'My account',
  'חיפוש...': 'Search...',
  'חיפוש לפי שם או מק"ט...': 'Search by name or SKU...',
  'דף הבית': 'Home',
  'תקנון ותנאי שימוש': 'Terms and conditions',
  'ניווט מהיר': 'Quick navigation',
  'אמצעי תשלום': 'Payment options',
  'משלוח תוך 8 ימי עסקים': 'Delivery within 8 business days',
  'תשלום מאובטח': 'Secure payment',
  'איסוף עצמי זמין': 'Pickup available',
  'עד 6 תשלומים ללא ריבית': 'Up to 6 interest-free payments',
  'ביטול: 5% דמי ביטול': 'Cancellation fee: 5%',
  'שיחה': 'Chat',
  'שירות לקוחות': 'Customer service',
  'עזרה בהזמנות, מוצרים, משלוחים והחזרות': 'Help with orders, products, shipping and returns',
  'AI יועץ קניות': 'AI shopping advisor',
  'המלצות ספרים ומתנות לפי צורך': 'Book and gift recommendations',
  'שלח': 'Send',
  'מספר הזמנה': 'Order number',
  'מייל להזמנה': 'Order email',
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function translateText(value) {
  const normalized = normalizeText(value)
  if (TEXT_MAP[normalized]) return value.replace(normalized, TEXT_MAP[normalized])
  return value
}

function translatePlaceholders(root) {
  root.querySelectorAll('input[placeholder], textarea[placeholder]').forEach((element) => {
    const placeholder = element.getAttribute('placeholder')
    const translated = translateText(placeholder)
    if (translated !== placeholder) element.setAttribute('placeholder', translated)
  })
}

function translateTextNodes(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement
      if (!parent) return NodeFilter.FILTER_REJECT
      if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT
      const text = normalizeText(node.nodeValue)
      if (!text || !TEXT_MAP[text]) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })

  const nodes = []
  while (walker.nextNode()) nodes.push(walker.currentNode)
  nodes.forEach((node) => {
    node.nodeValue = translateText(node.nodeValue)
  })
}

function applyLanguage(lang) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl'
  document.body.dataset.lang = lang

  if (lang === 'en') {
    translateTextNodes(document.body)
    translatePlaceholders(document.body)
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('he')

  useEffect(() => {
    const saved = window.localStorage.getItem('masoret_lang')
    const initial = saved === 'en' ? 'en' : 'he'
    setLangState(initial)
    applyLanguage(initial)
  }, [])

  useEffect(() => {
    applyLanguage(lang)
    if (lang !== 'en') return

    const observer = new MutationObserver(() => applyLanguage('en'))
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [lang])

  function setLang(nextLang) {
    const normalized = nextLang === 'en' ? 'en' : 'he'
    window.localStorage.setItem('masoret_lang', normalized)
    setLangState(normalized)
    if (normalized === 'he') window.location.reload()
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
      <button type="button" className={lang === 'he' ? 'active' : ''} onClick={() => setLang('he')}>
        {compact ? 'עב' : 'עברית'}
      </button>
      <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>
        EN
      </button>
    </div>
  )
}
