'use client'
import { useState } from 'react'

export default function OrderForm({ product }) {
  const hasVariations = product.variations && product.variations.length > 0
  const [selectedVariation, setSelectedVariation] = useState(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', note: '' })
  const [quantity, setQuantity] = useState(1)
  const [status, setStatus] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [orderIds, setOrderIds] = useState({ ours: null })

  // מחיר לפי וריאציה שנבחרה או מחיר בסיסי
  const activePrice = selectedVariation
    ? parseFloat(selectedVariation.price || 0)
    : parseFloat(product.price || 0)
  const activeRegularPrice = selectedVariation
    ? parseFloat(selectedVariation.regular_our_price || selectedVariation.price || 0)
    : parseFloat(product.regular_our_price || product.price || 0)
  const activeCost = selectedVariation
    ? parseFloat(selectedVariation.original_price || 0)
    : parseFloat(product.original_price || 0)
  const activeInStock = selectedVariation ? selectedVariation.in_stock : true
  const totalPrice = (activePrice * quantity).toFixed(0)

  // קיבוץ אופציות לפי שם התכונה
  function getAttributeOptions() {
    if (!hasVariations) return {}
    const options = {}
    product.variations.forEach(v => {
      Object.entries(v.attributes || {}).forEach(([key, val]) => {
        if (!options[key]) options[key] = new Set()
        if (val) options[key].add(val)
      })
    })
    return options
  }

  const [selectedAttrs, setSelectedAttrs] = useState({})

  function handleAttrChange(attrKey, value) {
    const newAttrs = { ...selectedAttrs, [attrKey]: value }
    setSelectedAttrs(newAttrs)
    // מצא וריאציה תואמת
    const match = product.variations.find(v =>
      Object.entries(newAttrs).every(([k, val]) =>
        !v.attributes[k] || v.attributes[k] === val
      )
    )
    setSelectedVariation(match || null)
  }

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }) }

  async function handleSubmit(e) {
    e.preventDefault()
    // אם יש וריאציות — חובה לבחור
    if (hasVariations && !selectedVariation) {
      setErrorMsg('יש לבחור אפשרות לפני ההזמנה')
      return
    }
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
          items: [{
            sourceProductId: product.product_id || product.sourceProductId || product.url,
            variationId: selectedVariation?.variation_id || null,
            name: product.name || '',
            sku: selectedVariation?.sku || product.sku || '',
            selectedAttributes: selectedAttrs,
            price: activePrice,
            cost: activeCost,
            quantity,
          }],
          utm_source: utmSource
        }),
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
  const attributeOptions = getAttributeOptions()

  return (
    <form onSubmit={handleSubmit}>
      <h3 style={{ fontFamily: 'serif', fontSize: '20px', marginBottom: '20px', color: '#2C2416' }}>פרטי הזמנה</h3>

      {/* וריאציות */}
      {hasVariations && Object.entries(attributeOptions).map(([attrKey, values]) => (
        <div key={attrKey} style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '14px', color: '#6B5C3E', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
            {product.attribute_labels?.[attrKey] || attrKey.replace('attribute_', '')}:
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[...values].map(val => (
              <button key={val} type="button"
                onClick={() => handleAttrChange(attrKey, val)}
                style={{
                  padding: '8px 16px', border: '1px solid',
                  borderColor: selectedAttrs[attrKey] === val ? '#8B6914' : '#EDE6D9',
                  background: selectedAttrs[attrKey] === val ? '#8B6914' : '#fff',
                  color: selectedAttrs[attrKey] === val ? '#fff' : '#2C2416',
                  cursor: 'pointer', fontSize: '14px'
                }}>
                {val}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* אזהרה אם וריאציה לא במלאי */}
      {selectedVariation && !activeInStock && (
        <div style={{ background: '#fff0f0', border: '1px solid #fcc', padding: '10px 14px', marginBottom: '16px', color: '#c0392b', fontSize: '14px' }}>
          האפשרות שבחרת חסרה במלאי
        </div>
      )}

      {/* מחיר מעודכן לפי וריאציה */}
      {selectedVariation && (
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {activeRegularPrice > activePrice && (
            <span style={{ fontSize: '1.1rem', color: '#999', textDecoration: 'line-through' }}>₪{activeRegularPrice}</span>
          )}
          <span style={{ fontSize: '1.5rem', color: '#8B6914', fontWeight: '700' }}>₪{activePrice}</span>
          {activeRegularPrice > activePrice && (
            <span style={{ background: '#e74c3c', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>מבצע!</span>
          )}
        </div>
      )}

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
      <button type="submit"
        disabled={status === 'loading' || (selectedVariation && !activeInStock)}
        style={{ width: '100%', padding: '14px', background: '#8B6914', color: '#fff', border: 'none', fontSize: '16px', fontFamily: 'serif', cursor: 'pointer', opacity: (selectedVariation && !activeInStock) ? 0.5 : 1 }}>
        {status === 'loading' ? 'שולח...' : 'הזמן עכשיו'}
      </button>
    </form>
  )
}
