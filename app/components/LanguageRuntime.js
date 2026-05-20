'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { LANGUAGES, translateText } from '../lib/i18n'

const LanguageContext = createContext({
  lang: 'he',
  isEnglish: false,
  setLang: () => {},
  toggleLang: () => {},
  t: (he, en) => he || en || '',
  translate: (value) => value || '',
})

function applyDocumentLanguage(lang) {
  if (typeof document === 'undefined') return
  const config = LANGUAGES[lang] || LANGUAGES.he
  document.documentElement.lang = config.code
  document.documentElement.dir = config.dir
  document.body.dataset.lang = config.code
}

function applyContentLanguage(lang) {
  if (typeof document === 'undefined') return
  document.querySelectorAll('[data-i18n-he][data-i18n-en]').forEach((node) => {
    const next = lang === 'en' ? node.dataset.i18nEn : node.dataset.i18nHe
    if (node.textContent !== next) node.textContent = next
  })

  document.querySelectorAll('[data-placeholder-he][data-placeholder-en]').forEach((node) => {
    const next = lang === 'en' ? node.dataset.placeholderEn : node.dataset.placeholderHe
    if (node.getAttribute('placeholder') !== next) node.setAttribute('placeholder', next)
  })
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('he')

  useEffect(() => {
    const stored = window.localStorage.getItem('masoret_lang')
    const initial = stored === 'en' ? 'en' : 'he'
    setLangState(initial)
    applyDocumentLanguage(initial)
  }, [])

  useEffect(() => {
    window.localStorage.setItem('masoret_lang', lang)
    applyDocumentLanguage(lang)

    const timer = window.setTimeout(() => applyContentLanguage(lang), 900)
    const observer = new MutationObserver(() => {
      window.clearTimeout(observer._masoretTimer)
      observer._masoretTimer = window.setTimeout(() => applyContentLanguage(lang), 120)
    })
    observer.observe(document.body, { childList: true, subtree: true })
    return () => {
      window.clearTimeout(timer)
      window.clearTimeout(observer._masoretTimer)
      observer.disconnect()
    }
  }, [lang])

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
    <div className="language-toggle" dir="ltr" aria-label="Language selector">
      <button type="button" className={lang === 'he' ? 'active' : ''} aria-pressed={lang === 'he'} onClick={() => setLang('he')}>
        {compact ? 'HE' : 'עברית'}
      </button>
      <button type="button" className={lang === 'en' ? 'active' : ''} aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
        EN
      </button>
    </div>
  )
}
