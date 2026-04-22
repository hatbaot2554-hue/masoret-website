'use client'
import { useState } from 'react'
import { useCart } from '../components/CartContext'

function formatPrice(price) {
  const p = parseFloat(price || 0)
  if (p < 10) return Math.ceil(p * 2) / 2
  return Math.ceil(p)
}

const UPSELL_ITEMS = [
  { name: 'סידור תפילה כיס', price: 29, emoji: '📖', desc: 'מתאים לנסיעות ויומיום' },
  { name: 'הגדה של פסח מהודרת', price: 49, emoji: '📜', desc: 'עם פירוש מורחב' },
  { name: 'תהילים כיס עם כריכה קשה', price: 39, emoji: '✡️', desc: 'כריכת עור מלאכותי' },
]

const SHIPPING_OPTIONS = [
  { id: 'home', label: 'משלוח עד הבית', price: 36, icon: '🏠' },
  { id: 'pickup', label: 'איסוף מנקודת מסירה', price: 22, icon: '📦' },
  { id: 'self', label: 'איסוף מהחנות (ללא תשלום)', price: 0, icon: '🏪', note: 'מנחם בגין 52, בני ברק' },
]

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, totalPrice } = useCart()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', note: '' })
  const [altForm, setAltForm] = useState({ firstName: '', lastName: '', address: '', city: '', phone: '' })
  const [showAltAddress, setShowAltAddress] = useState(false)
  const [shipping, setShipping] = useState('home')
  const [status, setStatus] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [orderId, setOrderId] = useState(null)
  const [dismissedUpsell, setDismissedUpsell] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const selectedShipping = SHIPPING_OPTIONS.find(s => s.id === shipping)
  const shippingPrice = selectedShipping?.price || 0
  const grandTotal = Math.ceil(totalPrice) + shippingPrice

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }) }
  function handleAltChange(e) { setAltForm({ ...altForm, [e.target.name]: e.target.value }) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!items.length) return
    if (!agreedToTerms) {
      alert('יש לאשר את תקנון האתר לפני ביצוע הזמנה')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    try {
      const utmSource = typeof window !== 'undefined'
        ? (new URLSearchParams(window.location.search).get('utm_source') || document.referrer || 'direct')
        : 'direct'

      const shippingNote = `משלוח: ${selectedShipping?.label} (₪${shippingPrice})${showAltAddress ? ` | כתובת משלוח: ${altForm.firstName} ${altForm.lastName}, ${altForm.address}, ${altForm.city}, ${altForm.phone}` : ''}`

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          note: [form.note, shippingNote].filter(Boolean).join(' | '),
          shippingMethod: shipping,
          shippingPrice,
          altAddress: showAltAddress ? altForm : null,
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

  const inputStyle = { width: '100%', padding: '11px 14px', border: '1px solid #EDE6D9', background: '#fff', fontSize: '15px', fontFamily: 'Heebo, sans-serif', color: '#2C2416', outline: 'none', borderRadius: '3px' }

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
        <a href="/products" style={{ background: '#8B6914', color: '#fff', padding: '14px 32px', textDecoration: 'none', fontSize: '15px', fontFamily: 'serif' }}>המשך לקנות</a>
      </div>
    )
  }

  if (!items.length) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
        <h2 style={{ fontFamily: 'serif', fontSize: '28px', marginBottom: '12px' }}>העגלה ריקה</h2>
        <p style={{ color: '#6B5C3E', marginBottom: '24px' }}>לא הוספת עדיין מוצרים לעגלה</p>
        <a href="/products" style={{ background: '#8B6914', color: '#fff', padding: '14px 32px', textDecoration: 'none', fontSize: '15px', fontFamily: 'serif' }}>לחנות</a>
      </div>
    )
  }

  return (
    <div style={{ padding: '48px 0' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{ fontFamily: 'serif', fontSize: '36px', fontWeight: '900', marginBottom: '32px' }}>עגלת קניות</h1>

        {/* UPSELL */}
        {!dismissedUpsell && (
          <div style={{ background: 'linear-gradient(135deg, #FFF8E8, #FFF3D0)', border: '1px solid #E8C97A', borderRadius: '8px', padding: '20px 24px', marginBottom: '28px', position: 'relative' }}>
            <button onClick={() => setDismissedUpsell(true)}
              style={{ position: 'absolute', top: '12px', left: '16px', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#999', lineHeight: 1 }}>✕</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '18px' }}>🔥</span>
              <span style={{ fontWeight: '700', color: '#8B6914', fontSize: '15px' }}>לקוחות שקנו גם:</span>
              <span style={{ background: '#e74c3c', color: '#fff', fontSize: '11px', padding: '2px 8px', borderRadius: '100px', fontWeight: '700' }}>10% הנחה עם ההזמנה</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {UPSELL_ITEMS.map((item, i) => {
                const discounted = Math.round(item.price * 0.9)
                return (
                  <div key={i} style={{ background: '#fff', border: '1px solid #EDE6D9', borderRadius: '6px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '28px' }}>{item.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '600', fontSize: '13px', color: '#2C2416', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: '#6B5C3E' }}>{item.desc}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                        <span style={{ fontSize: '13px', color: '#999', textDecoration: 'line-through' }}>₪{item.price}</span>
                        <span style={{ fontSize: '15px', color: '#8B6914', fontWeight: '700' }}>₪{discounted}</span>
                      </div>
                    </div>
                    <a href="/products" style={{ background: '#C9A84C', color: '#1A2332', border: 'none', padding: '8px 12px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', textDecoration: 'none', whiteSpace: 'nowrap', borderRadius: '4px' }}>
                      הוסף +
                    </a>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px', alignItems: 'start' }}>

          {/* פריטים */}
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
                    <div style={{ fontSize: '12px', color: '#8B6914', marginTop: '2px' }}>תוספת הטבעה: ₪{item.engravingExtra}</div>
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

          {/* טופס הזמנה */}
          <div style={{ background: '#F8F4EE', border: '1px solid #EDE6D9', padding: '24px', position: 'sticky', top: '24px', borderRadius: '4px' }}>
            <h3 style={{ fontFamily: 'serif', fontSize: '20px', marginBottom: '20px' }}>פרטי הזמנה</h3>
            <form onSubmit={handleSubmit}>

              {/* פרטים אישיים */}
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

              {/* כתובת אחרת */}
              <div style={{ marginBottom: '14px' }}>
                <button type="button" onClick={() => setShowAltAddress(!showAltAddress)}
                  style={{ background: 'none', border: 'none', color: '#8B6914', cursor: 'pointer', fontSize: '13px', fontWeight: '600', padding: '0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {showAltAddress ? '▲' : '▼'} לשלוח לכתובת אחרת?
                </button>
                {showAltAddress && (
                  <div style={{ marginTop: '12px', background: '#fff', border: '1px solid #EDE6D9', borderRadius: '4px', padding: '14px' }}>
                    <div style={{ fontSize: '12px', color: '#6B5C3E', marginBottom: '10px', fontWeight: '600' }}>פרטי כתובת המשלוח:</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <div>
                        <label style={{ fontSize: '11px', color: '#6B5C3E', display: 'block', marginBottom: '3px' }}>שם פרטי</label>
                        <input name="firstName" value={altForm.firstName} onChange={handleAltChange} style={{ ...inputStyle, fontSize: '13px', padding: '8px 10px' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', color: '#6B5C3E', display: 'block', marginBottom: '3px' }}>שם משפחה</label>
                        <input name="lastName" value={altForm.lastName} onChange={handleAltChange} style={{ ...inputStyle, fontSize: '13px', padding: '8px 10px' }} />
                      </div>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <label style={{ fontSize: '11px', color: '#6B5C3E', display: 'block', marginBottom: '3px' }}>כתובת</label>
                      <input name="address" value={altForm.address} onChange={handleAltChange} style={{ ...inputStyle, fontSize: '13px', padding: '8px 10px' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div>
                        <label style={{ fontSize: '11px', color: '#6B5C3E', display: 'block', marginBottom: '3px' }}>עיר</label>
                        <input name="city" value={altForm.city} onChange={handleAltChange} style={{ ...inputStyle, fontSize: '13px', padding: '8px 10px' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', color: '#6B5C3E', display: 'block', marginBottom: '3px' }}>טלפון</label>
                        <input name="phone" value={altForm.phone} onChange={handleAltChange} style={{ ...inputStyle, fontSize: '13px', padding: '8px 10px' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* אפשרויות משלוח */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', color: '#6B5C3E', display: 'block', marginBottom: '8px', fontWeight: '600' }}>אפשרות משלוח</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {SHIPPING_OPTIONS.map(opt => (
                    <label key={opt.id} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      background: shipping === opt.id ? '#fff' : '#fff',
                      border: `1.5px solid ${shipping === opt.id ? '#8B6914' : '#EDE6D9'}`,
                      borderRadius: '4px', padding: '10px 12px', cursor: 'pointer',
                    }}>
                      <input type="radio" name="shipping" value={opt.id} checked={shipping === opt.id}
                        onChange={() => setShipping(opt.id)} style={{ accentColor: '#8B6914' }} />
                      <span style={{ fontSize: '18px' }}>{opt.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#2C2416' }}>{opt.label}</div>
                        {opt.note && <div style={{ fontSize: '11px', color: '#6B5C3E' }}>{opt.note}</div>}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: opt.price === 0 ? '#27ae60' : '#8B6914' }}>
                        {opt.price === 0 ? 'חינם' : `₪${opt.price}`}
                      </div>
                    </label>
                  ))}
                </div>
                <p style={{ fontSize: '11px', color: '#999', marginTop: '6px' }}>* משלוח חריג עשוי להיות כרוך בתוספת תשלום</p>
              </div>

              {/* הערות */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', color: '#6B5C3E', display: 'block', marginBottom: '4px' }}>הערות להזמנה</label>
                <textarea name="note" value={form.note} onChange={handleChange} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              {/* סיכום מחירים */}
              <div style={{ borderTop: '1px solid #EDE6D9', paddingTop: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6B5C3E', marginBottom: '6px' }}>
                  <span>סכום מוצרים:</span>
                  <span>₪{Math.ceil(totalPrice)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6B5C3E', marginBottom: '12px' }}>
                  <span>משלוח ({selectedShipping?.label}):</span>
                  <span style={{ color: shippingPrice === 0 ? '#27ae60' : '#2C2416' }}>
                    {shippingPrice === 0 ? 'חינם' : `₪${shippingPrice}`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700', color: '#2C2416' }}>
                  <span>סה"כ לתשלום:</span>
                  <span style={{ color: '#8B6914', fontFamily: 'serif' }}>₪{grandTotal}</span>
                </div>
              </div>

              {/* אישור תקנון */}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '16px', cursor: 'pointer', fontSize: '12px', color: '#6B5C3E' }}>
                <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)}
                  style={{ marginTop: '2px', accentColor: '#8B6914', flexShrink: 0 }} />
                <span>
                  קראתי ואני מסכים/ה ל
                  <a href="/terms" target="_blank" style={{ color: '#8B6914', textDecoration: 'underline' }}>תקנון ותנאי השימוש</a>
                  {' '}של האתר
                </span>
              </label>

              {/* אמצעי אמון */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
                {['🔒 תשלום מאובטח', '📦 משלוח מהיר', '↩️ החזרה קלה'].map(t => (
                  <span key={t} style={{ fontSize: '11px', color: '#6B5C3E' }}>{t}</span>
                ))}
              </div>

              {status === 'error' && <p style={{ color: 'red', marginBottom: '12px', fontSize: '14px' }}>{errorMsg}</p>}
              <button type="submit" disabled={status === 'loading' || !agreedToTerms}
                style={{ width: '100%', padding: '16px', background: agreedToTerms ? '#8B6914' : '#ccc', color: '#fff', border: 'none', fontSize: '17px', fontFamily: 'serif', cursor: agreedToTerms ? 'pointer' : 'not-allowed', borderRadius: '3px', fontWeight: '700' }}>
                {status === 'loading' ? 'שולח...' : `בצע הזמנה — ₪${grandTotal} ⚡`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
