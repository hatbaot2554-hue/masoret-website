'use client'
import { useState } from 'react'

function formatPrice(price) {
  const p = parseFloat(price || 0)
  if (p < 10) return Math.ceil(p * 2) / 2
  return Math.ceil(p)
}

const ENGRAVING_PRICING_TEXT = `מחירון:
- הקדשה על ספרים בודדים - 15 ש"ח לספר
- גלופה עד 100 ספרים - 170 ש"ח לכל הכמות. תישלח אליכם סקיצה לאישור.
- מעל 100 ספרים - כל ספר נוסף 1 ש"ח
- לא לשכוח להוסיף לסל גם את כמות הספרים לרכישה
- במידה ובחרתם בהטבעת גלופה, ואתם רוכשים כמה סוגי מוצרים, נא להוסיף בהערת הרכישה על אלו מוצרים תרצו להטביע.`

export default function OrderForm({ product }) {
  const hasVariations = product.variations && product.variations.length > 0
  const [selectedVariation, setSelectedVariation] = useState(null)
  const [selectedAttrs, setSelectedAttrs] = useState({})
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', note: '' })
  const [quantity, setQuantity] = useState(1)
  const [status, setStatus] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [orderIds, setOrderIds] = useState({ ours: null })

  // הטבעה
  const [engravingType, setEngravingType] = useState('none') // none | single | bulk
  const [letterColor, setLetterColor] = useState('')
  const [engravingText, setEngravingText] = useState('')
  const [engravingQty, setEngravingQty] = useState(1)
  const [bulkType, setBulkType] = useState('') // up100 | over100
  const [sketchText, setSketchText] = useState('')
  const [sketchFile, setSketchFile] = useState(null)
  const [extraQty, setExtraQty] = useState(1)

  const MAX_CHARS = 21

  const activePrice = selectedVariation
    ? formatPrice(selectedVariation.price)
    : formatPrice(product.price)
  const activeRegularPrice = selectedVariation
    ? formatPrice(selectedVariation.regular_our_price || selectedVariation.price)
    : formatPrice(product.regular_our_price || product.price)
  const activeCost = selectedVariation
    ? parseFloat(selectedVariation.original_price || 0)
    : parseFloat(product.original_price || 0)
  const activeInStock = selectedVariation ? selectedVariation.in_stock : true

  // חישוב תוספת הטבעה
  const engravingExtra = (() => {
    if (engravingType === 'single') return engravingQty * 15
    if (engravingType === 'bulk') {
      if (bulkType === 'up100') return 170
      if (bulkType === 'over100') return 170 + extraQty
    }
    return 0
  })()

  const totalPrice = Math.ceil(activePrice * quantity) + engravingExtra

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

  function handleAttrChange(attrKey, value) {
    const newAttrs = { ...selectedAttrs, [attrKey]: value }
    setSelectedAttrs(newAttrs)
    const match = product.variations.find(v =>
      Object.entries(newAttrs).every(([k, val]) =>
        !v.attributes[k] || v.attributes[k] === val
      )
    )
    setSelectedVariation(match || null)
  }

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }) }

  function buildEngravingNote() {
    if (engravingType === 'none') return ''
    let note = 'הטבעת הקדשה: '
    if (engravingType === 'single') {
      note += `ספרים בודדים | צבע: ${letterColor} | טקסט: "${engravingText}" | כמות: ${engravingQty}`
    } else if (engravingType === 'bulk') {
      note += `גלופה | צבע: ${letterColor} | סוג: ${bulkType === 'up100' ? 'עד 100' : 'מעל 100'}`
      if (sketchText) note += ` | טקסט לסקיצה: "${sketchText}"`
      if (bulkType === 'over100') note += ` | כמות נוספת: ${extraQty}`
    }
    return note
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (hasVariations && !selectedVariation) {
      setErrorMsg('יש לבחור אפשרות לפני ההזמנה')
      return
    }
    if (engravingType === 'single' && !letterColor) {
      setErrorMsg('יש לבחור צבע אותיות להטבעה')
      return
    }
    if (engravingType === 'bulk' && (!letterColor || !bulkType)) {
      setErrorMsg('יש לבחור צבע אותיות וסוג גלופה')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    try {
      const utmSource = typeof window !== 'undefined'
        ? (new URLSearchParams(window.location.search).get('utm_source') || document.referrer || 'direct')
        : 'direct'

      const engravingNote = buildEngravingNote()
      const fullNote = [form.note, engravingNote].filter(Boolean).join(' | ')

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          note: fullNote,
          items: [{
            sourceProductId: product.product_id || product.sourceProductId || product.url,
            variationId: selectedVariation?.variation_id || null,
            name: product.name || '',
            sku: selectedVariation?.sku || product.sku || '',
            selectedAttributes: selectedAttrs,
            price: activePrice,
            cost: activeCost,
            quantity,
            engraving: engravingType !== 'none' ? {
              type: engravingType,
              letterColor,
              text: engravingText,
              qty: engravingQty,
              bulkType,
              sketchText,
              extraQty,
              extraCost: engravingExtra,
            } : null,
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
  const sectionStyle = { background: '#F8F4EE', border: '1px solid #EDE6D9', borderRadius: '4px', padding: '16px', marginBottom: '16px' }
  const colorBtnStyle = (val) => ({
    padding: '8px 16px', border: '1px solid', cursor: 'pointer', fontSize: '14px',
    borderColor: letterColor === val ? '#8B6914' : '#EDE6D9',
    background: letterColor === val ? '#8B6914' : '#fff',
    color: letterColor === val ? '#fff' : '#2C2416',
  })
  const typeBtnStyle = (val) => ({
    padding: '8px 16px', border: '1px solid', cursor: 'pointer', fontSize: '14px',
    borderColor: engravingType === val ? '#8B6914' : '#EDE6D9',
    background: engravingType === val ? '#8B6914' : '#fff',
    color: engravingType === val ? '#fff' : '#2C2416',
  })
  const bulkBtnStyle = (val) => ({
    padding: '8px 16px', border: '1px solid', cursor: 'pointer', fontSize: '14px',
    borderColor: bulkType === val ? '#8B6914' : '#EDE6D9',
    background: bulkType === val ? '#8B6914' : '#fff',
    color: bulkType === val ? '#fff' : '#2C2416',
  })

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
              <button key={val} type="button" onClick={() => handleAttrChange(attrKey, val)}
                style={{
                  padding: '8px 16px', border: '1px solid', cursor: 'pointer', fontSize: '14px',
                  borderColor: selectedAttrs[attrKey] === val ? '#8B6914' : '#EDE6D9',
                  background: selectedAttrs[attrKey] === val ? '#8B6914' : '#fff',
                  color: selectedAttrs[attrKey] === val ? '#fff' : '#2C2416',
                }}>
                {val}
              </button>
            ))}
          </div>
        </div>
      ))}

      {selectedVariation && !activeInStock && (
        <div style={{ background: '#fff0f0', border: '1px solid #fcc', padding: '10px 14px', marginBottom: '16px', color: '#c0392b', fontSize: '14px' }}>
          האפשרות שבחרת חסרה במלאי
        </div>
      )}

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

      {/* הטבעת הקדשה */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '14px', color: '#6B5C3E', display: 'block', marginBottom: '8px', fontWeight: '600' }}>הטבעת הקדשה:</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => { setEngravingType('none'); setLetterColor(''); setEngravingText(''); setEngravingQty(1); setBulkType(''); setSketchText(''); setExtraQty(1) }} style={typeBtnStyle('none')}>ללא</button>
          <button type="button" onClick={() => setEngravingType('single')} style={typeBtnStyle('single')}>הטבעה על ספרים בודדים (עד 13)</button>
          <button type="button" onClick={() => setEngravingType('bulk')} style={typeBtnStyle('bulk')}>הטבעת כמות (14 ומעלה)</button>
        </div>
      </div>

      {/* תוכן לפי סוג הטבעה */}
      {(engravingType === 'single' || engravingType === 'bulk') && (
        <div style={sectionStyle}>
          {/* מחירון */}
          <div style={{ background: '#fff8e8', border: '1px solid #f0d080', borderRadius: '4px', padding: '14px', marginBottom: '16px', fontSize: '13px', lineHeight: 2, color: '#2C2416', whiteSpace: 'pre-line' }}>
            <strong>מחירון:</strong>{'\n'}
            {ENGRAVING_PRICING_TEXT.split('\n').slice(1).join('\n')}
          </div>

          {/* צבע אותיות */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '14px', color: '#6B5C3E', display: 'block', marginBottom: '8px', fontWeight: '600' }}>צבע אותיות:</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['כסף', 'זהב', 'לשיקול דעתו של המטביע'].map(c => (
                <button key={c} type="button" onClick={() => setLetterColor(c)} style={colorBtnStyle(c)}>{c}</button>
              ))}
            </div>
          </div>

          {/* שדות ספציפיים לסוג */}
          {engravingType === 'single' && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', color: '#6B5C3E', display: 'block', marginBottom: '4px', fontWeight: '600' }}>הוספת טקסט להטבעה:</label>
                <input
                  type="text"
                  value={engravingText}
                  maxLength={MAX_CHARS}
                  onChange={e => setEngravingText(e.target.value)}
                  style={inputStyle}
                  placeholder="הזן טקסט להטבעה"
                />
                <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>{MAX_CHARS - engravingText.length} תווים נותרו</div>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '14px', color: '#6B5C3E', display: 'block', marginBottom: '4px', fontWeight: '600' }}>כמות ספרים להטבעה:</label>
                <input
                  type="number"
                  min="1"
                  max="13"
                  value={engravingQty}
                  onChange={e => setEngravingQty(Math.max(1, Math.min(13, parseInt(e.target.value) || 1)))}
                  style={{ ...inputStyle, width: '100px' }}
                />
                <div style={{ fontSize: '13px', color: '#8B6914', marginTop: '4px', fontWeight: '600' }}>
                  {engravingQty * 15} ש"ח
                </div>
              </div>
            </>
          )}

          {engravingType === 'bulk' && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', color: '#6B5C3E', display: 'block', marginBottom: '8px', fontWeight: '600' }}>בחר:</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => setBulkType('up100')} style={bulkBtnStyle('up100')}>הטבעת גלופה עד 100 ספרים</button>
                  <button type="button" onClick={() => setBulkType('over100')} style={bulkBtnStyle('over100')}>הטבעת גלופה מעל 100 ספרים</button>
                </div>
                {bulkType && (
                  <div style={{ fontSize: '13px', color: '#8B6914', marginTop: '6px', fontWeight: '600' }}>170.00 ש"ח</div>
                )}
              </div>

              {bulkType && (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '14px', color: '#6B5C3E', display: 'block', marginBottom: '4px', fontWeight: '600' }}>הוספת טקסט לסקיצה:</label>
                    <input
                      type="text"
                      value={sketchText}
                      onChange={e => setSketchText(e.target.value)}
                      style={inputStyle}
                      placeholder="הזן טקסט לסקיצה"
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '14px', color: '#6B5C3E', display: 'block', marginBottom: '4px', fontWeight: '600' }}>יש לך סקיצה מוכנה? תוכל להעלות אותה כאן:</label>
                    <input
                      type="file"
                      accept="image/*,.pdf,.ai,.eps,.svg,.png,.jpg,.jpeg"
                      onChange={e => setSketchFile(e.target.files[0] || null)}
                      style={{ fontSize: '14px', color: '#2C2416' }}
                    />
                  </div>

                  {bulkType === 'over100' && (
                    <div style={{ marginBottom: '8px' }}>
                      <label style={{ fontSize: '14px', color: '#6B5C3E', display: 'block', marginBottom: '4px', fontWeight: '600' }}>כמות נוספת מלבד ה-100:</label>
                      <input
                        type="number"
                        min="1"
                        value={extraQty}
                        onChange={e => setExtraQty(Math.max(1, parseInt(e.target.value) || 1))}
                        style={{ ...inputStyle, width: '100px' }}
                      />
                      <div style={{ fontSize: '13px', color: '#8B6914', marginTop: '4px', fontWeight: '600' }}>
                        {extraQty} ש"ח
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* כמות */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <label style={{ fontSize: '14px', color: '#6B5C3E', width: '60px' }}>כמות:</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '32px', height: '32px', border: '1px solid #EDE6D9', background: '#fff', cursor: 'pointer', fontSize: '16px' }}>-</button>
          <span style={{ minWidth: '32px', textAlign: 'center', fontSize: '16px', fontWeight: '700' }}>{quantity}</span>
          <button type="button" onClick={() => setQuantity(quantity + 1)} style={{ width: '32px', height: '32px', border: '1px solid #EDE6D9', background: '#fff', cursor: 'pointer', fontSize: '16px' }}>+</button>
        </div>
        <span style={{ fontSize: '18px', fontWeight: '700', color: '#8B6914' }}>סה"כ: ₪{totalPrice}</span>
      </div>

      {/* פרטים אישיים */}
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
