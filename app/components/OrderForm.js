'use client'
import { useState } from 'react'

export default function OrderForm({ product }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', note: '' })
  const [quantity, setQuantity] = useState(1)
  const [status, setStatus] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [orderIds, setOrderIds] = useState({ ours: null })

  const price = parseFloat(product.price || 0)
  const totalPrice = (price * quantity).toFixed(0)

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }) }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items: [{ sourceProductId: product.sourceProductId, quantity }] }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'שגיאה')
      setOrderIds({ ours: data.ourOrderId })
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
        <h3 style={{ fontSize: '22px', marginBottom: '8px', fontFamily: 'serif' }}>ההזמנה התקבלה בהצלחה!</h3>
        <p style={{ marginBottom: '24px', color: '#6B5C3E' }}>תודה {form.firstName}, אישור נשלח למייל שלך.</p>
        <div style={{ background: '#F8F4EE', border: '1px solid #EDE6D9', padding: '20px', marginBottom: '20px', textAlign: 'right' }}>
          <span style={{ fontSize: '13px', color: '#6B5C3E' }}>מספר הזמנה:</span>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#8B6914', fontFamily: 'serif' }}>#{orderIds.ours}</div>
        </div>
        <div style={{ background: '#f0f7ff', border: '1px solid #b8d4f0', padding: '14px 18px', textAlign: 'right', marginBottom: '24px', fontSize: '14px', color: '#1a3a5c', lineHeight: 1.7 }}>
          📦 המשלוח שלך יטופל על ידי השותף הלוגיסטי שלנו.
        </div>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <a href="/products" style={{ color: '#8B6914', textDecoration: 'none', fontWeight: '500' }}>← המשך לקנות</a>
          <a href={`/track?order=${orderIds.ours}&email=${encodeURIComponent(form.email)}`} style={{ color: '#1A2332', textDecoration: 'none', fontWeight: '500' }}>🔍 עקוב אחרי ההזמנה</a>
        </div>
      </div>
    )
  }

  const inputStyle = { width: '100%', padding: '11px 14px', border: '1px solid #EDE6D9', background: '#fff', fontSize: '15px', fontFamily: 'Heebo, sans-serif', color: '#2C2416', outline: 'none' }

  return (
    <form onSubmit={handleSubmit}>
      <h3 style={{ fontFamily: 'serif', fontSize: '20px', marginBottom: '20px', color: '#2C2416' }}>פרטי הזמנה</h3>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <label style={{ fontSize: '14px', color: '#6B5C3E', width: '60px' }}>כמות:</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '32px', height: '32px', border: '1px solid #EDE6D9', background: '#fff', cursor: 'pointer', fontSize: '16px' }}>-</button>
          <span style={{ minWidth: '32px', textAlign: 'center', fontSize: '16px', fontWeight: '700' }}>{quantity}</span>
          <button type="button" onClick={() => setQuantity(quantity + 1)} style={{ width: '32px', height: '32px', border: '1px solid #EDE6D9', background: '#fff', cursor: 'pointer', fontSize: '16px' }}>+</button>
        </div>
        <span style={{ fontSize: '18px', fontWeight: '700', color: '#8B6914' }}>סה"כ: ₪{totalPrice}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div>
          <label style={{ fontSize: '13px', color: '#6B5C3E', display: 'block', marginBottom: '4px' }}>שם פרטי *</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} required style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: '13px', color: '#6B5C3E', display: 'block', marginBottom: '4px' }}>שם משפחה *</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} required style={inputStyle} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div>
          <label style={{ fontSize: '13px', color: '#6B5C3E', display: 'block', marginBottom: '4px' }}>אימייל *</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: '13px', color: '#6B5C3E', display: 'block', marginBottom: '4px' }}>טלפון *</label>
          <input name="phone" type="tel" value={form.phone} onChange={handleChange} required style={inputStyle} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div>
          <label style={{ fontSize: '13px', color: '#6B5C3E', display: 'block', marginBottom: '4px' }}>כתובת *</label>
          <input name="address" value={form.address} onChange={handleChange} required style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: '13px', color: '#6B5C3E', display: 'block', marginBottom: '4px' }}>עיר *</label>
          <input name="city" value={form.city} onChange={handleChange} required style={inputStyle} />
        </div>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '13px', color: '#6B5C3E', display: 'block', marginBottom: '4px' }}>הערות</label>
        <textarea name="note" value={form.note} onChange={handleChange} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
      {status === 'error' && <p style={{ color: 'red', marginBottom: '12px' }}>{errorMsg}</p>}
      <button type="submit" disabled={status === 'loading'} style={{ width: '100%', padding: '14px', background: '#8B6914', color: '#fff', border: 'none', fontSize: '16px', fontFamily: 'serif', cursor: 'pointer' }}>
        {status === 'loading' ? 'שולח...' : 'הזמן עכשיו'}
      </button>
    </form>
  )
}
