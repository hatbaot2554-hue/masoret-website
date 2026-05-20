'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
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

function shouldSkipNode(node) {
  const parent = node.parentElement
  if (!parent) return true
  if (parent.closest('[data-no-auto-translate]')) return true
  return ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE', 'NOSCRIPT'].includes(parent.tagName)
}

function applyClientTranslation(lang) {
  if (typeof document === 'undefined' || !document.body) return

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
    node.nodeValue = lang === 'en' ? translateText(original, 'en') : original
  })

  document.querySelectorAll('[placeholder], [aria-label], [title]').forEach((node) => {
    if (!originalAttributes.has(node)) originalAttributes.set(node, {})
    const attrs = originalAttributes.get(node)
    ;['placeholder', 'aria-label', 'title'].forEach((attr) => {
      if (!node.hasAttribute(attr)) return
      if (!attrs[attr]) attrs[attr] = node.getAttribute(attr)
      node.setAttribute(attr, lang === 'en' ? translateText(attrs[attr], 'en') : attrs[attr])
    })
  })
}

function applyDocumentLanguage(lang) {
  if (typeof document === 'undefined') return
  const config = LANGUAGES[lang] || LANGUAGES.he
  document.documentElement.lang = config.code
  document.documentElement.dir = config.dir
  document.body.dataset.lang = config.code
}

export function LanguageProvider({ children }) {
  const pathname = usePathname()
  const [lang, setLangState] = useState('he')
  const manualSwitchRef = useRef(false)

  useEffect(() => {
    const stored = window.localStorage.getItem('masoret_lang')
    if (stored === 'en') {
      manualSwitchRef.current = true
      setLangState('en')
    } else {
      applyDocumentLanguage('he')
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('masoret_lang', lang)
    applyDocumentLanguage(lang)
    if (!manualSwitchRef.current) return

    const firstPass = window.setTimeout(() => applyClientTranslation(lang), 300)
    const secondPass = window.setTimeout(() => applyClientTranslation(lang), 1200)
    return () => {
      window.clearTimeout(firstPass)
      window.clearTimeout(secondPass)
    }
  }, [lang, pathname])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') return
    if (!manualSwitchRef.current || lang !== 'en') return

    let scheduled = false
    const observer = new MutationObserver(() => {
      if (scheduled) return
      scheduled = true
      window.requestAnimationFrame(() => {
        scheduled = false
        applyClientTranslation('en')
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    return () => observer.disconnect()
  }, [lang])

  function setLang(nextLang) {
    manualSwitchRef.current = true
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
