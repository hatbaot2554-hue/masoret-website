'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'לא ניתן לשלוח פנייה כרגע')
      setSent(true)
      setForm({ name: '', phone: '', email: '', message: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { width: '100%', padding: '12px 14px', border: '1px solid #EDE6D9', background: '#fff', fontSize: '15px', fontFamily: 'Heebo, sans-serif', color: '#2C2416', outline: 'none' }

  return (
    <main dir="rtl" style={{ maxWidth: '760px', margin: '64px auto', padding: '0 24px' }}>
      <h1 style={{ fontFamily: 'serif', fontSize: '36px', fontWeight: 900, marginBottom: '10px', color: '#1A2332' }}>צור קשר</h1>
      <p style={{ color: '#6B5C3E', marginBottom: '28px' }}>השאירו פרטים ונחזור אליכם בהקדם.</p>

      <form onSubmit={submit} style={{ background: '#fff', border: '1px solid #EDE6D9', padding: '28px', display: 'grid', gap: '16px' }}>
        <label style={{ display: 'grid', gap: '6px', fontWeight: 700 }}>
          שם מלא
          <input value={form.name} onChange={(e) => update('name', e.target.value)} required style={inputStyle} />
        </label>
        <label style={{ display: 'grid', gap: '6px', fontWeight: 700 }}>
          טלפון
          <input value={form.phone} onChange={(e) => update('phone', e.target.value)} required style={inputStyle} />
        </label>
        <label style={{ display: 'grid', gap: '6px', fontWeight: 700 }}>
          מייל
          <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} style={inputStyle} />
        </label>
        <label style={{ display: 'grid', gap: '6px', fontWeight: 700 }}>
          הודעה
          <textarea value={form.message} onChange={(e) => update('message', e.target.value)} required rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
        </label>

        {sent && <div style={{ background: '#e8f8ef', color: '#166534', padding: '12px' }}>הפנייה נקלטה בהצלחה.</div>}
        {error && <div style={{ background: '#fdecec', color: '#b91c1c', padding: '12px' }}>{error}</div>}

        <button type="submit" disabled={loading} style={{ padding: '14px', border: 0, background: '#C9A84C', color: '#1A2332', fontWeight: 800, cursor: 'pointer', fontSize: '16px' }}>
          {loading ? 'שולח...' : 'שלח פנייה'}
        </button>
      </form>
    </main>
  )
}
