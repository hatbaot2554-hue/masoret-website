'use client'

import { useState } from 'react'

export default function OrderForm({ product }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    note: '',
  })
  const [quantity, setQuantity] = useState(1)
  const [status, setStatus] = useState(null) // null | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')
  const [orderIds, setOrderIds] = useState({ ours: null, source: null })

  const totalPrice = (parseFloat(product.price) * quantity).toFixed(0)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: [{
            sourceProductId: product.sourceProductId,
            quantity,
          }],
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'שגיאה')

      setOrderIds({
        ours: data.ourOrderId,
        source: data.sourceOrderId,
      })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message)
    }
  }

  if (status === 'success') {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
        <h3 style={{ fontSize: '22px', marginBottom: '8px', fontFamily: 'Frank Ruhl Libre, serif' }}>
          ההזמנה התקבלה בהצלחה!
        </h3>
        <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>
          תודה {form.firstName}, אישור נשלח למייל שלך.
        </p>

        {/* שני מספרי הזמנה */}
        <div style={{
          background: 'var(--cream-dark)',
          border: '1px solid var(--cream)',
          padding: '20px',
          marginBottom: '20px',
          textAlign: 'right',
        }}>
          <div style={{ marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>מספר הזמנה שלנו:</span>
            <span style={{
              display: 'block',
              fontSize: '20px',
              fontWeight: '700',
              color: 'var(--gold-dark)',
              fontFamily: 'Frank Ruhl Libre, serif',
            }}>
              #{orderIds.ours || Math.floor(Math.random() * 90000 + 10000)}
            </span>
          </div>
          <div style={{ borderTop: '1px solid var(--cream)', paddingTop: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>מספר הזמנה לוגיסטי (למעקב משלוח):</span>
            <span style={{
              display: 'block',
              fontSize: '20px',
              fontWeight: '700',
              color: 'var(--navy)',
              fontFamily: 'Frank Ruhl Libre, serif',
            }}>
              #{orderIds.source || '—'}
            </span>
          </div>
        </div>

        {/* הודעה על שותף לוגיסטי */}
        <div style={{
          background: '#f0f7ff',
          border: '1px solid #b8d4f0',
          padding: '14px 18px',
          textAlign: 'right',
          marginBottom: '16px',
          fontSize: '14px',
          color: '#1a3a5c',
          lineHeight: 1.7,
        }}>
          📦 המשלוח שלך יטופל על ידי השותף הלוגיסטי שלנו.
          ייתכן שתקבל עדכון או שיחה מספק המשלוח בקשר להזמנה — זה תקין לחלוטין.
        </div>

        {/* שירות לקוחות */}
        <div style={{
          background: '#f0fff4',
          border: '1px solid #b8e8c8',
          padding: '14px 18px',
          textAlign: 'right',
          marginBottom: '24px',
          fontSize: '14px',
          color: '#1a4a2c',
          lineHeight: 1.7,
        }}>
          💬 לכל שאלה בנושא המשלוח ניתן לפנות לשירות הלקוחות שלנו:
          <div style={{ marginTop: '8px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
            <a href="tel:077-323-4049" style={{
              color: '#1a4a2c',
              fontWeight: '700',
              textDecoration: 'none',
              fontSize: '16px',
            }}>
              📞 077-323-4049
            </a>
            <a href="https://wa.me/972773234049" target="_blank" style={{
              color: '#1a4a2c',
              fontWeight: '700',
              textDecoration: 'none',
              fontSize: '16px',
            }}>
              💬 WhatsApp
            </a>
          </div>
          <div style={{ fontSize: '12px', color: '#4a7a5c', marginTop: '6px' }}>
            א׳-ה׳ בין השעות 9:00-15:00
          </div>
        </div>

        <a href="/products" style={{
          display: 'inline-block',
          color: 'var(--gold-dark)',
          textDecoration: 'none',
          fontWeight: '500',
          marginLeft: '20px',
        }}>
          ← המשך לקנות
        </a>
        <a href="/track" style={{
          display: 'inline-block',
          color: 'var(--navy)',
          textDecoration: 'none',
          fontWeight: '500',
        }}>
          🔍 עקוב אחרי ההזמנה
        </a>
      </div>
    )
  }

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    border: '1px solid var(--cream-dark)',
    background: 'var(--white)',
    fontSize: '15px',
    fontFamily: 'Heebo, sans-serif',
    color: 'var(--text)',
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 style={{
        fontFamily: 'Frank Ruhl Libre, serif',
        fontSize: '20px',
        marginBottom: '20px',
        color: 'var(--text)',
      }}>
        פרטי הזמנה
      </h3>

      {/* כמות */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <label style={{ fontSize: '14px', color: 'var(--text-muted)', width: '60px' }}>כמות:</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}
            style={{ width: '32px', height: '32px', border: '1px solid var(--cream-dark)', background: 'var(--white)', cursor: 'pointer', fontSize: '16px' }}>
            -
          </button>
          <span style={{ minWidth: '32px', textAlign: 'center', fontSize: '16px', fontWeight: '700' }}>{quantity}</span>
          <button type="button" onClick={() => setQuantity(quantity + 1)}
            style={{ width: '32px', height: '32px', border: '1px solid var(--cream-dark)', background: 'var(--white)', cursor: 'pointer', fontSize: '16px' }}>
            +
          </button>
        </div>
        <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--gold-dark)' }}>
          סה"כ: ₪{totalPrice}
        </span>
      </div>

      {/* שדות טופס */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div>
          <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>שם פרטי *</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} required style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>שם משפחה *</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} required style={inputStyle} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div>
          <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>אימייל *</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>טלפון *</label>
          <input name="phone" type="tel" value={form.phone} onChange={handleChange} required style={inputStyle} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div>
          <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>כתובת *</label>
          <input name="address" value={form.address} onChange={handleChange} required style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>עיר *</label>
          <input name="city" value={form.city} onChange={handleChange} required style={inputStyle} />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>הערות להזמנה</label>
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
          placeholder="הערות מיוחדות, בקשות וכו'..."
        />
      </div>

      {status === 'error' && (
        <div className="alert-error" style={{ marginBottom: '16px' }}>
          ❌ {errorMsg}
        </div>
      )}

      <button
        type="submit"
        className="btn-primary"
        disabled={status === 'loading'}
        style={{
          width: '100%',
          fontSize: '16px',
          padding: '16px',
          opacity: status === 'loading' ? 0.7 : 1,
          cursor: status === 'loading' ? 'wait' : 'pointer',
        }}
      >
        {status === 'loading' ? '⏳ שולח הזמנה...' : `✓ הזמן עכשיו — ₪${totalPrice}`}
      </button>

      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px', textAlign: 'center' }}>
        לאחר קבלת ההזמנה נחזור אליך עם פרטי תשלום ואישור משלוח
      </p>
    </form>
  )
}
