'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { LANGUAGES, translateText } from '../lib/i18n'

const LanguageContext = createContext({
  lang: 'he',
  isEnglish: false,
  setLang: () => {},
  toggleLang: () => {},
  t: (he, en) => he || en || '',
  translate: (value) => value || '',
})

const originalTextNodes = new WeakMap()
const originalAttributes = new WeakMap()
const STORAGE_KEY = 'masoret_lang'

function shouldSkipNode(node) {
  const parent = node.parentElement
  if (!parent) return true
  if (parent.closest('[data-no-auto-translate], [data-dynamic-text]')) return true
  return ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE', 'NOSCRIPT'].includes(parent.tagName)
}

function applyClientTranslation(lang) {
  if (typeof document === 'undefined' || !document.body) return

  document.querySelectorAll('[data-i18n-he][data-i18n-en]').forEach((node) => {
    const nextText = lang === 'en' ? node.getAttribute('data-i18n-en') : node.getAttribute('data-i18n-he')
    if (node.textContent !== nextText) node.textContent = nextText
  })

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
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
    const nextText = lang === 'en' ? translateText(original, 'en') : original
    if (node.nodeValue !== nextText) node.nodeValue = nextText
  })

  document.querySelectorAll('[placeholder], [aria-label], [title]').forEach((node) => {
    if (!originalAttributes.has(node)) originalAttributes.set(node, {})
    const attrs = originalAttributes.get(node)
    ;['placeholder', 'aria-label', 'title'].forEach((attr) => {
      if (!node.hasAttribute(attr)) return
      if (!attrs[attr]) attrs[attr] = node.getAttribute(attr)
      const nextAttr = lang === 'en' ? translateText(attrs[attr], 'en') : attrs[attr]
      if (node.getAttribute(attr) !== nextAttr) node.setAttribute(attr, nextAttr)
    })
  })
}

function applyDocumentLanguage(lang) {
  if (typeof document === 'undefined') return
  const config = LANGUAGES[lang] || LANGUAGES.he
  document.documentElement.lang = config.code
  document.documentElement.dir = config.dir
  document.body.dataset.lang = config.code
  document.cookie = `${STORAGE_KEY}=${config.code}; path=/; max-age=31536000; SameSite=Lax`
}

export function LanguageProvider({ children }) {
  const pathname = usePathname()
  const [lang, setLangState] = useState('he')

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'en') {
      setLangState('en')
    } else {
      applyDocumentLanguage('he')
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang)
    applyDocumentLanguage(lang)

    const immediatePass = window.setTimeout(() => applyClientTranslation(lang), 0)
    const firstPass = window.setTimeout(() => applyClientTranslation(lang), 250)
    const secondPass = window.setTimeout(() => applyClientTranslation(lang), 1200)
    return () => {
      window.clearTimeout(immediatePass)
      window.clearTimeout(firstPass)
      window.clearTimeout(secondPass)
    }
  }, [lang, pathname])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') return
    if (lang !== 'en') return

    let scheduled = false
    const observer = new MutationObserver(() => {
      if (scheduled) return
      scheduled = true
      window.requestAnimationFrame(() => {
        scheduled = false
        applyClientTranslation(lang)
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => observer.disconnect()
  }, [lang, pathname])

  function setLang(nextLang) {
    setLangState(nextLang === 'en' ? 'en' : 'he')
  }

  const value = useMemo(() => ({
    lang,
    isEnglish: lang === 'en',
    setLang,
    toggleLang: () => setLang(lang === 'en' ? 'he' : 'en'),
    t: (he, en) => (lang === 'en' ? (en || translateText(he, 'en')) : he),
    translate: (value) => translateText(value, lang),
  }), [lang])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}

export function LanguageToggle({ compact = false }) {
  const { lang, setLang } = useLanguage()

  return (
    <div className="language-toggle" dir="ltr" aria-label="Language selector" data-no-auto-translate>
      <button type="button" className={lang === 'he' ? 'active' : ''} aria-pressed={lang === 'he'} onClick={() => setLang('he')}>
        {compact ? 'HE' : 'עברית'}
      </button>
      <button type="button" className={lang === 'en' ? 'active' : ''} aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
        EN
      </button>
    </div>
  )
}
