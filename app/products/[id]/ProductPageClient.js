'use client'
import { useState } from 'react'
import { useCart } from '../../components/CartContext'

function formatPrice(price) {
  const p = parseFloat(price || 0)
  if (p < 10) return Math.ceil(p * 2) / 2
  return Math.ceil(p)
}

const ENGRAVING_PRICING_TEXT = `• הקדשה על ספרים בודדים - 15 ש"ח לספר
- גלופה עד 100 ספרים - 170 ש"ח לכל הכמות. תישלח אליכם סקיצה לאישור.
- מעל 100 ספרים - כל ספר נוסף 1 ש"ח
- לא לשכוח להוסיף לסל גם את כמות הספרים לרכישה
- במידה ובחרתם בהטבעת גלופה, ואתם רוכשים כמה סוגי מוצרים, נא להוסיף בהערת הרכישה על אלו מוצרים תרצו להטביע.`

export default function ProductPageClient({ product }) {
  const { addItem } = useCart()
  const [activeImg, setActiveImg] = useState(product.image || '')
  const [selectedVariation, setSelectedVariation] = useState(null)
  const [selectedAttrs, setSelectedAttrs] = useState({})
  const [addedToCart, setAddedToCart] = useState(false)
  const [engravingError, setEngravingError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [orderStatus, setOrderStatus] = useState(null)
  const [orderError, setOrderError] = useState('')
  const [orderId, setOrderId] = useState(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', city: '', note: '' })
  const [showQuickBuy, setShowQuickBuy] = useState(false)

  const [engravingType, setEngravingType] = useState('none')
  const [letterColor, setLetterColor] = useState('לשיקול דעתו של המטביע')
  const [engravingText, setEngravingText] = useState('')
  const [engravingQty, setEngravingQty] = useState(1)
  const [bulkType, setBulkType] = useState('')
  const [sketchText, setSketchText] = useState('')
  const [sketchFile, setSketchFile] = useState(null)
  const [extraQty, setExtraQty] = useState(1)
  const MAX_CHARS = 21

  const inStock = product.in_stock !== false
  const finalPrice = formatPrice(product.price)
  const regularFinalPrice = formatPrice(product.regular_our_price || product.price)
  const hasVariations = product.variations && product.variations.length > 0

  const engravingExtra = (() => {
    if (engravingType === 'single') return engravingQty * 15
    if (engravingType === 'bulk') {
      if (bulkType === 'up100') return 170
      if (bulkType === 'over100') return 170 + extraQty
    }
    return 0
  })()

  const attributeOptions = (() => {
    if (!hasVariations) return {}
    const options = {}
    product.variations.forEach(v => {
      Object.entries(v.attributes || {}).forEach(([key, val]) => {
        if (!options[key]) options[key] = new Set()
        if (val) options[key].add(val)
      })
    })
    return options
  })()

  const activePrice = selectedVariation ? formatPrice(selectedVariation.price) : finalPrice
  const activeRegularPrice = selectedVariation ? formatPrice(selectedVariation.regular_our_price || selectedVariation.price) : regularFinalPrice
  const totalPrice = activePrice * quantity + engravingExtra

  function handleAttrChange(attrKey, value) {
    const newAttrs = { ...selectedAttrs, [attrKey]: value }
    setSelectedAttrs(newAttrs)
    const match = product.variations.find(v =>
      Object.entries(newAttrs).every(([k, val]) => !v.attributes[k] || v.attributes[k] === val)
    )
    setSelectedVariation(match || null)
  }

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

  function validateEngraving() {
    if (engravingType === 'single' && !engravingText.trim()) {
      setEngravingError('יש להזין טקסט להטבעה')
      return false
    }
    if (engravingType === 'bulk' && !bulkType) {
      setEngravingError('יש לבחור סוג גלופה')
      return false
    }
    setEngravingError('')
    return true
  }

  function handleAddToCart() {
    if (!validateEngraving()) return
    const engravingNote = buildEngravingNote()
    const engravingData = engravingType !== 'none' ? {
      type: engravingType, letterColor, text: engravingText, qty: engravingQty,
      bulkType, sketchText, extraQty, extraCost: engravingExtra, note: engravingNote,
    } : null
    const attrsWithEngraving = {
      ...selectedAttrs,
      ...(engravingNote ? { הטבעה: engravingNote } : {})
    }
    addItem(
      { ...product, price: activePrice, original_price: product.original_price },
      quantity, attrsWithEngraving, selectedVariation, engravingData
    )
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  async function handleQuickBuy(e) {
    e.preventDefault()
    if (!validateEngraving()) return
    setOrderStatus('loading')
    setOrderError('')
    try {
      const engravingNote = buildEngravingNote()
      const fullNote = [form.note, engravingNote].filter(Boolean).join(' | ')
      const utmSource = typeof window !== 'undefined'
        ? (new URLSearchParams(window.location.search).get('utm_source') || document.referrer || 'direct')
        : 'direct'
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          note: fullNote,
          items: [{
            sourceProductId: product.product_id || product.url,
            variationId: selectedVariation?.variation_id || null,
            name: product.name || '',
            sku: selectedVariation?.sku || product.sku || '',
            selectedAttributes: selectedAttrs,
            price: activePrice + engravingExtra,
            cost: parseFloat(product.original_price || 0),
            quantity,
            engraving: engravingType !== 'none' ? {
              type: engravingType, letterColor, text: engravingText,
              qty: engravingQty, bulkType, sketchText, extraQty, extraCost: engravingExtra,
            } : null,
          }],
          utm_source: utmSource
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'שגיאה')
      setOrderId(data.ourOrderId)
      setOrderStatus('success')
    } catch (err) {
      setOrderStatus('error')
      setOrderError(err.message)
    }
  }

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }) }

  const inputStyle = { width: '100%', padding: '11px 14px', border: '1px solid #EDE6D9', background: '#fff', fontSize: '15px', fontFamily: 'Heebo, sans-serif', color: '#2C2416', outline: 'none' }
  const sectionStyle = { background: '#F8F4EE', border: '1px solid #EDE6D9', borderRadius: '4px', padding: '16px', marginBottom: '16px' }
  const colorBtnStyle = (val) => ({ padding: '8px 16px', border: '1px solid', cursor: 'pointer', fontSize: '14px', borderColor: letterColor === val ? '#8B6914' : '#EDE6D9', background: letterColor === val ? '#8B6914' : '#fff', color: letterColor === val ? '#fff' : '#2C2416' })
  const typeBtnStyle = (val) => ({ padding: '8px 16px', border: '1px solid', cursor: 'pointer', fontSize: '14px', borderColor: engravingType === val ? '#8B6914' : '#EDE6D9', background: engravingType === val ? '#8B6914' : '#fff', color: engravingType === val ? '#fff' : '#2C2416' })
  const bulkBtnStyle = (val) => ({ padding: '8px 16px', border: '1px solid', cursor: 'pointer', fontSize: '14px', borderColor: bulkType === val ? '#8B6914' : '#EDE6D9', background: bulkType === val ? '#8B6914' : '#fff', color: bulkType === val ? '#fff' : '#2C2416' })

  if (orderStatus === 'success') {
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

  return (
    <div style={{ padding: '40px 0' }}>
      {lightboxOpen && (
        <div onClick={() => setLightboxOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}>
          <button onClick={() => setLightboxOpen(false)}
            style={{ position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', color: '#fff', fontSize: '32px', cursor: 'pointer' }}>✕</button>
          <img src={activeImg} alt={product.name}
            style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }}
            onClick={e => e.stopPropagation()} />
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <p style={{ fontSize: '13px', color: '#6B5C3E', marginBottom: '24px' }}>
          <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>בית</a>{' > '}
          <a href="/products" style={{ color: 'inherit', textDecoration: 'none' }}>ספרים</a>{' > '}
          {product.name}
        </p>

        <div className="product-layout">
          <div>
            <div className="zoom-container"
              style={{ background: '#EDE6D9', padding: '24px', position: 'relative', marginBottom: '12px' }}
              onMouseMove={e => {
                const rect = e.currentTarget.getBoundingClientRect()
                e.currentTarget.style.setProperty('--zoom-x', ((e.clientX - rect.left) / rect.width * 100) + '%')
                e.currentTarget.style.setProperty('--zoom-y', ((e.clientY - rect.top) / rect.height * 100) + '%')
              }}
              onClick={() => setLightboxOpen(true)}>
              {!inStock && <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#c0392b', color: '#fff', padding: '6px 14px', fontSize: '13px', fontWeight: '700', zIndex: 2 }}>חסר במלאי</div>}
              {activeImg
                ? <img src={activeImg} alt={product.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
                : <div style={{ aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>📖</div>}
            </div>
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.images.map((img, i) => (
                  <img key={i} src={img} alt={`${product.name} ${i + 1}`} onClick={() => setActiveImg(img)}
                    style={{ width: '64px', height: '64px', objectFit: 'cover', cursor: 'pointer', border: `2px solid ${activeImg === img ? '#8B6914' : '#EDE6D9'}`, opacity: activeImg === img ? 1 : 0.7 }} />
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 style={{ fontFamily: 'serif', fontSize: '32px', fontWeight: '900', marginBottom: '12px', lineHeight: 1.3 }}>{product.name}</h1>

            {product.description && <p style={{ fontSize: '15px', color: '#2C2416', lineHeight: 1.8, marginBottom: '20px' }}>{product.description}</p>}

            {hasVariations && Object.entries(attributeOptions).map(([attrKey, values]) => (
              <div key={attrKey} style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', color: '#6B5C3E', display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  {product.attribute_labels?.[attrKey] || attrKey.replace('attribute_', '')}:
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[...values].map(val => (
                    <button key={val} type="button" onClick={() => handleAttrChange(attrKey, val)}
                      style={{ padding: '8px 16px', border: '1px solid', cursor: 'pointer', fontSize: '14px', borderColor: selectedAttrs[attrKey] === val ? '#8B6914' : '#EDE6D9', background: selectedAttrs[attrKey] === val ? '#8B6914' : '#fff', color: selectedAttrs[attrKey] === val ? '#fff' : '#2C2416' }}>
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* מחיר */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              {activeRegularPrice > activePrice && <span style={{ fontSize: '1.3rem', color: '#999', textDecoration: 'line-through' }}>₪{activeRegularPrice}</span>}
              <span style={{ fontFamily: 'serif', fontSize: '2.2rem', color: '#8B6914', fontWeight: '700' }}>₪{activePrice}</span>
              {activeRegularPrice > activePrice && <span style={{ background: '#e74c3c', color: '#fff', padding: '3px 10px', borderRadius: '4px', fontSize: '13px', fontWeight: '700' }}>מבצע!</span>}
            </div>

            {/* ✅ כמות — אחרי מחיר, לפני הטבעה */}
            {inStock && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', background: '#F8F4EE', padding: '12px 16px', borderRadius: '4px' }}>
                <label style={{ fontSize: '14px', color: '#6B5C3E', fontWeight: '600' }}>כמות:</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ width: '36px', height: '36px', border: '1px solid #EDE6D9', background: '#fff', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                  <span style={{ minWidth: '36px', textAlign: 'center', fontSize: '18px', fontWeight: '700' }}>{quantity}</span>
                  <button type="button" onClick={() => setQuantity(quantity + 1)}
                    style={{ width: '36px', height: '36px', border: '1px solid #EDE6D9', background: '#fff', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>
                <div style={{ fontSize: '16px', color: '#8B6914', fontWeight: '700' }}>
                  סה"כ: ₪{totalPrice}
                </div>
              </div>
            )}

            {/* הטבעה */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '14px', color: '#6B5C3E', display: 'block', marginBottom: '8px', fontWeight: '600' }}>הטבעת הקדשה:</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => { setEngravingType('none'); setEngravingText(''); setEngravingQty(1); setBulkType(''); setSketchText(''); setExtraQty(1); setLetterColor('לשיקול דעתו של המטביע'); setEngravingError('') }} style={typeBtnStyle('none')}>ללא</button>
                <button type="button" onClick={() => { setEngravingType('single'); setEngravingError('') }} style={typeBtnStyle('single')}>הטבעה על ספרים בודדים (עד 13)</button>
                <button type="button" onClick={() => { setEngravingType('bulk'); setEngravingError('') }} style={typeBtnStyle('bulk')}>הטבעת כמות (14 ומעלה)</button>
              </div>

              {(engravingType === 'single' || engravingType === 'bulk') && (
                <div style={{ ...sectionStyle, marginTop: '12px' }}>
                  <div style={{ background: '#fff8e8', border: '1px solid #f0d080', borderRadius: '4px', padding: '14px', marginBottom: '16px', fontSize: '13px', lineHeight: 2, color: '#2C2416', whiteSpace: 'pre-line' }}>
                    <strong>מחירון:</strong>{'\n'}{ENGRAVING_PRICING_TEXT}
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '14px', color: '#6B5C3E', display: 'block', marginBottom: '8px', fontWeight: '600' }}>צבע אותיות:</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {['כסף', 'זהב', 'לשיקול דעתו של המטביע'].map(c => (
                        <button key={c} type="button" onClick={() => setLetterColor(c)} style={colorBtnStyle(c)}>{c}</button>
                      ))}
                    </div>
                  </div>
                  {engravingType === 'single' && (
                    <>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '14px', color: '#6B5C3E', display: 'block', marginBottom: '4px', fontWeight: '600' }}>הוספת טקסט להטבעה: <span style={{ color: '#e74c3c' }}>*</span></label>
                        <input type="text" value={engravingText} maxLength={MAX_CHARS}
                          onChange={e => { setEngravingText(e.target.value); setEngravingError('') }}
                          style={{ ...inputStyle, border: `1px solid ${engravingError && !engravingText.trim() ? '#e74c3c' : '#EDE6D9'}` }}
                          placeholder="הזן טקסט להטבעה (חובה)" />
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>{MAX_CHARS - engravingText.length} תווים נותרו</div>
                      </div>
                      <div>
                        <label style={{ fontSize: '14px', color: '#6B5C3E', display: 'block', marginBottom: '4px', fontWeight: '600' }}>כמות ספרים להטבעה:</label>
                        <input type="number" min="1" max="13" value={engravingQty}
                          onChange={e => setEngravingQty(Math.max(1, Math.min(13, parseInt(e.target.value) || 1)))}
                          style={{ ...inputStyle, width: '100px' }} />
                        <div style={{ fontSize: '13px', color: '#8B6914', marginTop: '4px', fontWeight: '600' }}>{engravingQty * 15} ש"ח</div>
                      </div>
                    </>
                  )}
                  {engravingType === 'bulk' && (
                    <>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '14px', color: '#6B5C3E', display: 'block', marginBottom: '8px', fontWeight: '600' }}>בחר: <span style={{ color: '#e74c3c' }}>*</span></label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button type="button" onClick={() => { setBulkType('up100'); setEngravingError('') }} style={bulkBtnStyle('up100')}>הטבעת גלופה עד 100 ספרים</button>
                          <button type="button" onClick={() => { setBulkType('over100'); setEngravingError('') }} style={bulkBtnStyle('over100')}>הטבעת גלופה מעל 100 ספרים</button>
                        </div>
                        {bulkType && <div style={{ fontSize: '13px', color: '#8B6914', marginTop: '6px', fontWeight: '600' }}>170.00 ש"ח</div>}
                      </div>
                      {bulkType && (
                        <>
                          <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '14px', color: '#6B5C3E', display: 'block', marginBottom: '4px', fontWeight: '600' }}>הוספת טקסט לסקיצה:</label>
                            <input type="text" value={sketchText} onChange={e => setSketchText(e.target.value)} style={inputStyle} placeholder="הזן טקסט לסקיצה" />
                          </div>
                          <div style={{ marginBottom: '16px' }}>
                            <label style={{ fontSize: '14px', color: '#6B5C3E', display: 'block', marginBottom: '4px', fontWeight: '600' }}>יש לך סקיצה מוכנה?</label>
                            <input type="file" accept="image/*,.pdf,.ai,.eps,.svg,.png,.jpg,.jpeg" onChange={e => setSketchFile(e.target.files[0] || null)} style={{ fontSize: '14px', color: '#2C2416' }} />
                          </div>
                          {bulkType === 'over100' && (
                            <div>
                              <label style={{ fontSize: '14px', color: '#6B5C3E', display: 'block', marginBottom: '4px', fontWeight: '600' }}>כמות נוספת מלבד ה-100:</label>
                              <input type="number" min="1" value={extraQty} onChange={e => setExtraQty(Math.max(1, parseInt(e.target.value) || 1))} style={{ ...inputStyle, width: '100px' }} />
                              <div style={{ fontSize: '13px', color: '#8B6914', marginTop: '4px', fontWeight: '600' }}>{extraQty} ש"ח</div>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
              {engravingError && <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '8px', fontWeight: '600' }}>⚠️ {engravingError}</div>}
            </div>

            {/* כפתורי פעולה */}
            {inStock ? (
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button onClick={handleAddToCart}
                  style={{ flex: 2, minWidth: '200px', padding: '16px 24px', background: addedToCart ? '#27ae60' : '#C9A84C', color: '#1A2332', border: 'none', fontSize: '17px', fontFamily: 'serif', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', boxShadow: addedToCart ? 'none' : '0 4px 12px rgba(201,168,76,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {addedToCart ? '✓ נוסף לסל!' : '🛒 הוסף לסל'}
                </button>
                <button onClick={() => setShowQuickBuy(!showQuickBuy)}
                  style={{ flex: 1, minWidth: '140px', padding: '16px 20px', background: showQuickBuy ? '#8B6914' : '#1A2332', color: '#C9A84C', border: '2px solid #C9A84C', fontSize: '15px', fontFamily: 'serif', cursor: 'pointer' }}>
                  ⚡ רכישה מהירה
                </button>
              </div>
            ) : (
              <div style={{ background: '#fff0f0', border: '1px solid #fcc', padding: '16px', textAlign: 'center', color: '#c0392b', fontSize: '15px', marginBottom: '24px' }}>
                המוצר כרגע חסר במלאי
              </div>
            )}

            {product.sku && <p style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>מק"ט: {product.sku}</p>}

            <div style={{ background: '#F8F4EE', border: '1px solid #EDE6D9', borderRadius: '4px', padding: '16px', marginBottom: '24px', fontSize: '14px', color: '#2C2416', lineHeight: 2 }}>
              <div>📦 אספקה: 2-10 ימי עסקים (למעט מקרים חריגים)</div>
              <div>💳 עד 6 תשלומים ללא ריבית</div>
              <div>⭐ שירות לקוחות מעולה</div>
              <div>🏠 אפשרות לאיסוף עצמי, משלוח עד הבית או לנקודת חלוקה</div>
            </div>

            {showQuickBuy && inStock && (
              <div style={{ borderTop: '2px solid #EDE6D9', paddingTop: '24px' }}>
                <h3 style={{ fontFamily: 'serif', fontSize: '20px', marginBottom: '20px', color: '#2C2416' }}>פרטי הזמנה</h3>
                <div style={{ background: '#F8F4EE', border: '1px solid #EDE6D9', borderRadius: '4px', padding: '14px', marginBottom: '20px', fontSize: '14px' }}>
                  <div style={{ fontWeight: '700', color: '#8B6914', marginBottom: '6px' }}>סיכום:</div>
                  <div>📚 {quantity} יח׳ × ₪{activePrice} = ₪{activePrice * quantity}</div>
                  {engravingType !== 'none' && <div>✍️ הטבעה: ₪{engravingExtra}</div>}
                  <div style={{ fontWeight: '700', color: '#8B6914', marginTop: '6px', fontSize: '16px' }}>סה"כ: ₪{totalPrice}</div>
                </div>
                <form onSubmit={handleQuickBuy}>
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
                  {orderStatus === 'error' && <p style={{ color: 'red', marginBottom: '12px' }}>{orderError}</p>}
                  <button type="submit" disabled={orderStatus === 'loading'}
                    style={{ width: '100%', padding: '14px', background: '#8B6914', color: '#fff', border: 'none', fontSize: '16px', fontFamily: 'serif', cursor: 'pointer' }}>
                    {orderStatus === 'loading' ? 'שולח...' : 'הזמן עכשיו ⚡'}
                  </button>
                </form>
              </div>
            )}

            {product.full_description && (
              <div style={{ borderTop: '1px solid #EDE6D9', paddingTop: '24px', marginTop: '24px' }}>
                <h3 style={{ fontFamily: 'serif', fontSize: '20px', marginBottom: '12px', color: '#2C2416' }}>אודות הספר</h3>
                <div style={{ fontSize: '15px', lineHeight: 1.9, color: '#2C2416' }}>{product.full_description}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
