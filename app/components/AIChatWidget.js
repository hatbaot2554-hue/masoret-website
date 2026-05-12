'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from './LanguageRuntime'
import { translateProductName } from '../lib/i18n'

const MODES = {
  service: {
    title: 'שירות לקוחות',
    subtitle: 'עזרה בהזמנות, מוצרים, משלוחים והחזרות',
    greeting: 'שלום, בשמחה אעזור. אפשר לכתוב לי על הזמנה קיימת, מוצר באתר, משלוח, ביטול או החזרה.',
    placeholder: 'כתוב הודעה לשירות הלקוחות...',
    launcher: 'שיחה',
    launcherClass: 'service',
  },
  advisor: {
    title: 'AI יועץ קניות',
    subtitle: 'המלצות ספרים ומתנות לפי צורך',
    greeting: 'שלום, אני AI יועץ הקניות של מסורת. כתוב מה מחפשים, ואחזיר כמה אפשרויות מתאימות עם הסבר קצר.',
    placeholder: 'לדוגמה: מתנה לבר מצווה / ספר הלכה לבית...',
    launcher: 'AI יועץ קניות',
    launcherClass: 'advisor',
  },
}

const EN_MODES = {
  service: {
    title: 'Customer service',
    subtitle: 'Help with orders, products, shipping and returns',
    greeting: 'Hi, I will be happy to help. You can ask about an existing order, a product, shipping, cancellation or returns.',
    placeholder: 'Write a message to customer service...',
    launcher: 'Chat',
    launcherClass: 'service',
  },
  advisor: {
    title: 'AI shopping advisor',
    subtitle: 'Book and gift recommendations by need',
    greeting: 'Hi, I am Masoret’s AI shopping advisor. Tell me what you are looking for, and I will suggest suitable options with a short explanation.',
    placeholder: 'For example: a bar mitzvah gift / a halacha book for home...',
    launcher: 'AI shopping advisor',
    launcherClass: 'advisor',
  },
}

function typingDelay(text) {
  return Math.min(1500, Math.max(450, String(text || '').length * 10))
}

function renderMessageLine(line) {
  const parts = String(line).split(/(https?:\/\/[^\s]+)/g)

  return parts.map((part, index) => {
    if (!/^https?:\/\//.test(part)) return part

    const cleanUrl = part.replace(/[.,;:!?)]$/, '')
    const suffix = part.slice(cleanUrl.length)

    return (
      <span key={`${cleanUrl}-${index}`}>
        <a href={cleanUrl} target="_blank" rel="noopener noreferrer">
          {cleanUrl}
        </a>
        {suffix}
      </span>
    )
  })
}

export default function AIChatWidget() {
  const { isEnglish } = useLanguage()
  const modeCopy = isEnglish ? EN_MODES : MODES
  const [openMode, setOpenMode] = useState(null)
  const [messages, setMessages] = useState({
    service: [{ role: 'assistant', text: MODES.service.greeting }],
    advisor: [{ role: 'assistant', text: MODES.advisor.greeting }],
  })
  const [input, setInput] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [typing, setTyping] = useState(false)
  const listRef = useRef(null)

  const mode = openMode || 'service'
  const active = modeCopy[mode]
  const activeMessages = messages[mode]

  useEffect(() => {
    setMessages((prev) => ({
      service: prev.service.length === 1 && prev.service[0].role === 'assistant'
        ? [{ role: 'assistant', text: modeCopy.service.greeting }]
        : prev.service,
      advisor: prev.advisor.length === 1 && prev.advisor[0].role === 'assistant'
        ? [{ role: 'assistant', text: modeCopy.advisor.greeting }]
        : prev.advisor,
    }))
  }, [isEnglish])

  const quickPrompts = useMemo(() => {
    if (mode === 'service') {
      return isEnglish
        ? ['What is my order status?', 'Can I change the shipping address?', 'How do I cancel an order?', 'I received a damaged item']
        : ['מה מצב ההזמנה שלי?', 'אפשר לשנות כתובת משלוח?', 'איך מבטלים הזמנה?', 'קיבלתי מוצר פגום']
    }
    return isEnglish
      ? ['A bar mitzvah gift', 'A halacha book for home', 'Recommended Chassidut books', 'A gift for a Shabbat host']
      : ['מתנה לבר מצווה', 'ספר הלכה לבית', 'ספרי חסידות מומלצים', 'מתנה למארח שבת']
  }, [mode, isEnglish])

  function scrollDown() {
    setTimeout(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
    }, 30)
  }

  function openChat(nextMode) {
    setOpenMode((current) => (current === nextMode ? null : nextMode))
    setInput('')
    scrollDown()
  }

  async function sendMessage(text = input) {
    const clean = text.trim()
    if (!clean || loading || !openMode) return

    const nextMessages = [...activeMessages, { role: 'user', text: clean }]
    setMessages((prev) => ({ ...prev, [mode]: nextMessages }))
    setInput('')
    setLoading(true)
    setTyping(true)
    scrollDown()

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          messages: nextMessages,
          orderNumber: orderNumber.trim(),
          email: email.trim(),
          language: isEnglish ? 'en' : 'he',
        }),
      })
      const data = await res.json()
      const reply = data.reply || (isEnglish ? 'There was a temporary issue. Can you try again?' : 'הייתה תקלה רגעית. אפשר לנסות שוב?')
      await new Promise((resolve) => setTimeout(resolve, typingDelay(reply)))
      setMessages((prev) => ({
        ...prev,
        [mode]: [
          ...nextMessages,
          {
            role: 'assistant',
            text: reply,
            products: data.needsProductConfirmation ? (data.products || []).slice(0, 3) : [],
          },
        ],
      }))
    } catch {
      setMessages((prev) => ({
        ...prev,
        [mode]: [...nextMessages, { role: 'assistant', text: isEnglish ? 'There is a connection issue right now. Please try again in a moment.' : 'יש כרגע תקלה בחיבור. נסה שוב בעוד רגע.' }],
      }))
    } finally {
      setLoading(false)
      setTyping(false)
      scrollDown()
    }
  }

  return (
    <>
      <div className="ai-chat-launchers">
        <button
          type="button"
          className={`ai-chat-launcher ${modeCopy.service.launcherClass}`}
          onClick={() => openChat('service')}
          aria-label="פתיחת שיחת שירות לקוחות"
        >
          <span className="chat-bubble-icon" aria-hidden="true" />
          <span>{modeCopy.service.launcher}</span>
        </button>
        <button
          type="button"
          className={`ai-chat-launcher ${modeCopy.advisor.launcherClass}`}
          onClick={() => openChat('advisor')}
          aria-label="פתיחת AI יועץ קניות"
        >
          <span>{modeCopy.advisor.launcher}</span>
        </button>
      </div>

      {openMode && (
        <section className={`ai-chat-panel ${mode}`} dir={isEnglish ? 'ltr' : 'rtl'}>
          <header className="ai-chat-head">
            <div>
              <strong>{active.title}</strong>
              <span>{active.subtitle}</span>
            </div>
            <button type="button" onClick={() => setOpenMode(null)} aria-label="סגירת צ׳אט">×</button>
          </header>

          {mode === 'service' && (
            <div className="ai-chat-order">
              <input value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="מספר הזמנה" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="מייל להזמנה" type="email" />
            </div>
          )}

          <div className="ai-chat-messages" ref={listRef}>
            {activeMessages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`ai-message ${message.role}`}>
                {message.text.split('\n').map((line, lineIndex) => (
                  <p key={lineIndex}>{renderMessageLine(line)}</p>
                ))}
                {Array.isArray(message.products) && message.products.length > 0 && (
                  <div style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
                    {message.products.map((product) => (
                      <a
                        key={product.url || product.index}
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'inherit', textDecoration: 'none', border: '1px solid #EDE6D9', background: '#fff', padding: '8px' }}
                      >
                        {product.image && <img src={product.image} alt={isEnglish ? translateProductName(product, 'en') : (product.name || 'מוצר')} style={{ width: '54px', height: '54px', objectFit: 'cover', flexShrink: 0 }} />}
                        <span style={{ display: 'grid', gap: '3px' }}>
                          <strong style={{ fontSize: '13px' }}>{isEnglish ? translateProductName(product, 'en') : product.name}</strong>
                          {product.sku && <small style={{ color: '#6B5C3E' }}>{isEnglish ? 'SKU' : 'מק״ט'}: {product.sku}</small>}
                          {product.price && <small style={{ color: '#8B6914', fontWeight: 700 }}>₪{product.price}</small>}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="ai-message assistant typing">
                <span />
                <span />
                <span />
              </div>
            )}
          </div>

          <div className="ai-chat-quick">
            {quickPrompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => sendMessage(prompt)} disabled={loading}>
                {prompt}
              </button>
            ))}
          </div>

          <form
            className="ai-chat-form"
            onSubmit={(event) => {
              event.preventDefault()
              sendMessage()
            }}
          >
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={active.placeholder} />
            <button type="submit" disabled={loading || !input.trim()}>{isEnglish ? 'Send' : 'שלח'}</button>
          </form>
        </section>
      )}
    </>
  )
}
