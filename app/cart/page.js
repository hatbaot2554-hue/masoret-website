'use client'
import { useState } from 'react'
import { useCart } from '../components/CartContext'

function formatPrice(price) {
  const p = parseFloat(price || 0)
  if (p < 10) return Math.ceil(p * 2) / 2
  return Math.ceil(p)
}

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, totalPrice } = useCart()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', note: '' })
  const [status, setStatus] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [orderId, setOrderId] = useState(null)

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!items.length) return
    setStatus('loading')
    setErrorMsg('')
    try {
      const utmSource = typeof window !== 'undefined'
        ? (new URLSearchParams(window.location.search).get('utm_source') || document.referrer || 'direct')
        : 'direct'

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map(i => ({
            sourceProductId: i.product_id || i.key,
            name: i.name,
            sku: i.sku || '',
            selectedAttributes: i.selectedAttrs,
            price: formatPrice(i.price) + (i.engravingExtra || 0),
            cost: parseFloat(i.original_price || 0),
            quantity: i.quantity,
            engraving: i.engravingData || null,
          })),
          utm_source: utmSource
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'שגיאה')
      setOrderId(data.ourOrderId)
      clearCart()
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message)
    }
  }

  const inputStyle = { width: '100%', padding: '11px 14px', border: '1px solid #EDE6D9', background: '#fff', fontSize: '15px', fontFamily: 'Heebo, sans-serif', color: '#2C2416', outline: 'none' }

  if (status === 'success') {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ fontFamily: 'serif', fontSize: '28px', marginBottom: '12px' }}>ההזמנה התקבלה!</h2>
        <p style={{ color: '#6B5C3E', marginBottom: '24px' }}>תודה {form.firstName}, אישור נשלח למייל שלך.</p>
        <div style={{ background: '#F8F4EE', border: '1px solid #EDE6D9', padding: '24px', marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', color: '#6B5C3E', marginBottom: '4px' }}>מספר הזמנה:</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#8B6914', fontFamily: 'serif' }}>#{orderId}</div>
        </div>
        <a href="/products" style={{ background: '#8B6914', color: '#fff', padding: '14px 32px', textDecoration: 'none', fontSize: '15px', fontFamily: 'serif' }}>
          המשך לקנות
        </a>
      </div>
    )
  }

  if (!items.length) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
        <h2 style={{ fontFamily: 'serif', fontSize: '28px', marginBottom: '12px' }}>העגלה ריקה</h2>
        <p style={{ color: '#6B5C3E', marginBottom: '24px' }}>לא הוספת עדיין מוצרים לעגלה</p>
        <a href="/products" style={{ background: '#8B6914', color: '#fff', padding: '14px 32px', textDecoration: 'none', fontSize: '15px', fontFamily: 'serif' }}>
          לחנות
        </a>
      </div>
    )
  }

  return (
    <div style={{ padding: '48px 0' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{ fontFamily: 'serif', fontSize: '36px', fontWeight: '900', marginBottom: '32px' }}>עגלת קניות</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>

          <div>
            {items.map(item => (
              <div key={item.key} style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '16px', padding: '20px 0', borderBottom: '1px solid #EDE6D9', alignItems: 'center' }}>
                <div style={{ background: '#EDE6D9', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '32px' }}>📖</span>}
                </div>
                <div>
                  <a href={`/products/${item.index}`} style={{ textDecoration: 'none', color: '#2C2416', fontWeight: '600', fontSize: '15px' }}>{item.name}</a>
                  {item.sku && <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>מק"ט: {item.sku}</div>}
                  {Object.keys(item.selectedAttrs || {}).filter(k => k !== 'הטבעה').length > 0 && (
                    <div style={{ fontSize: '12px', color: '#6B5C3E', marginTop: '4px' }}>
                      {Object.entries(item.selectedAttrs).filter(([k]) => k !== 'הטבעה').map(([k, v]) => v).join(' | ')}
                    </div>
                  )}
                  {item.selectedAttrs?.הטבעה && (
                    <div style={{ fontSize: '12px', color: '#8B6914', marginTop: '4px', background: '#FFF8E8', padding: '4px 8px', borderRadius: '3px' }}>
                      ✍️ {item.selectedAttrs.הטבעה}
                    </div>
                  )}
                  {item.engravingExtra > 0 && (
                    <div style={{ fontSize: '12px', color: '#8B6914', marginTop: '2px' }}>
                      תוספת הטבעה: ₪{item.engravingExtra}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <button type="button" onClick={() => updateQty(item.key, item.quantity - 1)} style={{ width: '28px', height: '28px', border: '1px solid #EDE6D9', background: '#fff', cursor: 'pointer' }}>-</button>
                    <span style={{ fontWeight: '700', minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                    <button type="button" onClick={() => updateQty(item.key, item.quantity + 1)} style={{ width: '28px', height: '28px', border: '1px solid #EDE6D9', background: '#fff', cursor: 'pointer' }}>+</button>
                  </div>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: 'serif', fontSize: '1.3rem', color: '#8B6914', fontWeight: '700' }}>
                    ₪{formatPrice(item.price * item.quantity) + (item.engravingExtra || 0)}
                  </div>
                  <button type="button" onClick={() => removeItem(item.key)} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: '13px', marginTop: '8px' }}>הסר</button>
                </div>
              </div>
            ))}
            <div style={{ textAlign: 'left', marginTop: '16px' }}>
              <button type="button" onClick={clearCart} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '13px' }}>נקה עגלה</button>
            </div>
          </div>

          <div style={{ background: '#F8F4EE', border: '1px solid #EDE6D9', padding: '24px', position: 'sticky', top: '24px' }}>
            <h3 style={{ fontFamily: 'serif', fontSize: '20px', marginBottom: '20px' }}>פרטי הזמנה</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#6B5C3E', display: 'block', marginBottom: '4px' }}>שם פרטי *</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#6B5C3E', display: 'block', marginBottom: '4px' }}>שם משפחה *</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} required style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '12px', color: '#6B5C3E', display: 'block', marginBottom: '4px' }}>אימייל *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '12px', color: '#6B5C3E', display: 'block', marginBottom: '4px' }}>טלפון *</label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} required style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#6B5C3E', display: 'block', marginBottom: '4px' }}>כתובת *</label>
                  <input name="address" value={form.address} onChange={handleChange} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#6B5C3E', display: 'block', marginBottom: '4px' }}>עיר *</label>
                  <input name="city" value={form.city} onChange={handleChange} required style={inputStyle} />
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', color: '#6B5C3E', display: 'block', marginBottom: '4px' }}>הערות</label>
                <textarea name="note" value={form.note} onChange={handleChange} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ borderTop: '1px solid #EDE6D9', paddingTop: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700', color: '#2C2416' }}>
                  <span>סה"כ:</span>
                  <span style={{ color: '#8B6914', fontFamily: 'serif' }}>₪{Math.ceil(totalPrice)}</span>
                </div>
              </div>
              {status === 'error' && <p style={{ color: 'red', marginBottom: '12px', fontSize: '14px' }}>{errorMsg}</p>}
              <button type="submit" disabled={status === 'loading'} style={{ width: '100%', padding: '14px', background: '#8B6914', color: '#fff', border: 'none', fontSize: '16px', fontFamily: 'serif', cursor: 'pointer' }}>
                {status === 'loading' ? 'שולח...' : 'בצע הזמנה'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
