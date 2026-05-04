'use client'

import { useMemo, useRef, useState } from 'react'

const MODES = {
  service: {
    title: 'שירות לקוחות',
    subtitle: 'עזרה בהזמנות, מוצרים, משלוחים והחזרות',
    greeting: 'שלום, בשמחה אעזור. אפשר לשאול על מוצר, משלוח, החזרה או הזמנה קיימת.',
    placeholder: 'כתוב הודעה לשירות הלקוחות...',
    button: 'שירות',
  },
  advisor: {
    title: 'יועץ קניות AI',
    subtitle: 'המלצות ספרים ומתנות לפי צורך',
    greeting: 'שלום, אני יועץ הקניות AI של מסורת. למי הספר מיועד ומה הסגנון שאתה מחפש?',
    placeholder: 'לדוגמה: מתנה לבר מצווה / ספר הלכה לבית...',
    button: 'יועץ AI',
  },
}

function typingDelay(text) {
  return Math.min(1600, Math.max(550, String(text || '').length * 12))
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('service')
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

  const active = MODES[mode]
  const activeMessages = messages[mode]

  const quickPrompts = useMemo(() => mode === 'service'
    ? ['מה מצב ההזמנה שלי?', 'איך מבטלים הזמנה?', 'יש בעיה במוצר שקיבלתי', 'אפשר לשנות כתובת משלוח?']
    : ['מתנה לבר מצווה', 'ספר הלכה לבית', 'ספרי חסידות מומלצים', 'ספר לילד מתחיל'],
  [mode])

  function scrollDown() {
    setTimeout(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
    }, 30)
  }

  async function sendMessage(text = input) {
    const clean = text.trim()
    if (!clean || loading) return

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
        }),
      })
      const data = await res.json()
      const reply = data.reply || 'אני מצטער, הייתה תקלה רגעית. אפשר לנסות שוב?'
      await new Promise((resolve) => setTimeout(resolve, typingDelay(reply)))
      setMessages((prev) => ({ ...prev, [mode]: [...nextMessages, { role: 'assistant', text: reply }] }))
    } catch {
      setMessages((prev) => ({
        ...prev,
        [mode]: [...nextMessages, { role: 'assistant', text: 'אני מצטער, יש כרגע תקלה בחיבור. נסה שוב בעוד רגע.' }],
      }))
    } finally {
      setLoading(false)
      setTyping(false)
      scrollDown()
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode)
    setInput('')
    scrollDown()
  }

  return (
    <>
      <button
        type="button"
        className="ai-chat-launcher"
        onClick={() => setOpen((value) => !value)}
        aria-label="פתיחת צ׳אט שירות וייעוץ"
      >
        <span>שיחה</span>
      </button>

      {open && (
        <section className="ai-chat-panel" dir="rtl">
          <header className="ai-chat-head">
            <div>
              <strong>{active.title}</strong>
              <span>{active.subtitle}</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="סגירת צ׳אט">×</button>
          </header>

          <div className="ai-chat-tabs">
            {Object.entries(MODES).map(([key, item]) => (
              <button key={key} type="button" className={mode === key ? 'active' : ''} onClick={() => switchMode(key)}>
                {item.button}
              </button>
            ))}
          </div>

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
                  <p key={lineIndex}>{line}</p>
                ))}
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
            <button type="submit" disabled={loading || !input.trim()}>שלח</button>
          </form>
        </section>
      )}
    </>
  )
}
