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

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('he')

  useEffect(() => {
    applyDocumentLanguage('he')
  }, [])

  useEffect(() => {
    window.localStorage.setItem('masoret_lang', lang)
    applyDocumentLanguage(lang)
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
