'use client'
import { useState } from 'react'
import { useCart } from '../../components/CartContext'
import OrderForm from '../../components/OrderForm'

function formatPrice(price) {
  const p = parseFloat(price || 0)
  if (p < 10) return Math.ceil(p * 2) / 2
  return Math.ceil(p)
}

export default function ProductPageClient({ product }) {
  const { addItem } = useCart()
  const [activeImg, setActiveImg] = useState(product.image || '')
  const [selectedVariation, setSelectedVariation] = useState(null)
  const [selectedAttrs, setSelectedAttrs] = useState({})
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const inStock = product.in_stock !== false
  const finalPrice = formatPrice(product.price)
  const regularFinalPrice = formatPrice(product.regular_our_price || product.price)
  const hasDiscount = regularFinalPrice > finalPrice

  const hasVariations = product.variations && product.variations.length > 0

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

  function handleAddToCart() {
    addItem(product, 1, selectedAttrs, selectedVariation)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const attributeOptions = getAttributeOptions()
  const activePrice = selectedVariation ? formatPrice(selectedVariation.price) : finalPrice
  const activeRegularPrice = selectedVariation ? formatPrice(selectedVariation.regular_our_price || selectedVariation.price) : regularFinalPrice

  return (
    <div style={{ padding: '40px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* breadcrumb */}
        <p style={{ fontSize: '13px', color: '#6B5C3E', marginBottom: '24px' }}>
          <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>בית</a>
          {' > '}
          <a href="/products" style={{ color: 'inherit', textDecoration: 'none' }}>ספרים</a>
          {' > '}
          {product.name}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '56px' }}>

          {/* תמונות */}
          <div>
            <div style={{ background: '#EDE6D9', padding: '24px', position: 'relative', marginBottom: '12px' }}>
              {!inStock && (
                <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#c0392b', color: '#fff', padding: '6px 14px', fontSize: '13px', fontWeight: '700' }}>
                  חסר במלאי
                </div>
              )}
              {activeImg ? (
                <img src={activeImg} alt={product.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
              ) : (
                <div style={{ aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>📖</div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.images.map((img, i) => (
                  <img key={i} src={img} alt={`${product.name} ${i + 1}`}
                    onClick={() => setActiveImg(img)}
                    style={{
                      width: '64px', height: '64px', objectFit: 'cover', cursor: 'pointer',
                      border: `2px solid ${activeImg === img ? '#8B6914' : '#EDE6D9'}`,
                      opacity: activeImg === img ? 1 : 0.7
                    }} />
                ))}
              </div>
            )}
          </div>

          {/* פרטי מוצר */}
          <div>
            {/* שם */}
            <h1 style={{ fontFamily: 'serif', fontSize: '32px', fontWeight: '900', marginBottom: '12px', lineHeight: 1.3 }}>
              {product.name}
            </h1>

            {/* תיאור קצר */}
            {product.description && (
              <p style={{ fontSize: '15px', color: '#2C2416', lineHeight: 1.8, marginBottom: '20px' }}>
                {product.description}
              </p>
            )}

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

            {/* מחיר */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              {activeRegularPrice > activePrice && (
                <span style={{ fontSize: '1.3rem', color: '#999', textDecoration: 'line-through' }}>₪{activeRegularPrice}</span>
              )}
              <span style={{ fontFamily: 'serif', fontSize: '2.2rem', color: '#8B6914', fontWeight: '700' }}>₪{activePrice}</span>
              {activeRegularPrice > activePrice && (
                <span style={{ background: '#e74c3c', color: '#fff', padding: '3px 10px', borderRadius: '4px', fontSize: '13px', fontWeight: '700' }}>מבצע!</span>
              )}
            </div>

            {/* כפתורי פעולה */}
            {inStock ? (
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleAddToCart}
                  style={{
                    flex: 1, minWidth: '160px', padding: '14px 20px', background: addedToCart ? '#27ae60' : '#fff',
                    color: addedToCart ? '#fff' : '#8B6914', border: '2px solid', borderColor: addedToCart ? '#27ae60' : '#8B6914',
                    fontSize: '15px', fontFamily: 'serif', cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}>
                  {addedToCart ? '✓ נוסף לסל!' : '🛒 הוסף לסל'}
                </button>
                <button
                  onClick={() => setShowOrderForm(!showOrderForm)}
                  style={{
                    flex: 1, minWidth: '160px', padding: '14px 20px', background: '#8B6914',
                    color: '#fff', border: 'none', fontSize: '15px', fontFamily: 'serif', cursor: 'pointer'
                  }}>
                  ⚡ לרכישה מהירה
                </button>
              </div>
            ) : (
              <div style={{ background: '#fff0f0', border: '1px solid #fcc', padding: '16px', textAlign: 'center', color: '#c0392b', fontSize: '15px', marginBottom: '24px' }}>
                המוצר כרגע חסר במלאי
              </div>
            )}

            {/* מק"ט */}
            {product.sku && (
              <p style={{ fontSize: '13px', color: '#999', marginBottom: '16px' }}>מק"ט: {product.sku}</p>
            )}

            {/* מידע משלוח */}
            <div style={{ background: '#F8F4EE', border: '1px solid #EDE6D9', borderRadius: '4px', padding: '16px', marginBottom: '24px', fontSize: '14px', color: '#2C2416', lineHeight: 2 }}>
              <div>📦 אספקה: 2-10 ימי עסקים (למעט מקרים חריגים)</div>
              <div>💳 עד 6 תשלומים ללא ריבית</div>
              <div>⭐ שירות לקוחות מעולה</div>
              <div>🏠 אפשרות לאיסוף עצמי, משלוח עד הבית או לנקודת חלוקה</div>
            </div>

            {/* טופס רכישה מהירה */}
            {showOrderForm && inStock && (
              <div style={{ borderTop: '2px solid #EDE6D9', paddingTop: '24px' }}>
                <OrderForm product={{
                  ...product,
                  price: activePrice,
                  regular_our_price: activeRegularPrice,
                  sourceProductId: product.product_id || product.url,
                  variations: product.variations,
                  attribute_labels: product.attribute_labels,
                }} preSelectedVariation={selectedVariation} preSelectedAttrs={selectedAttrs} />
              </div>
            )}

            {/* תיאור מפורט */}
            {product.full_description && (
              <div style={{ borderTop: '1px solid #EDE6D9', paddingTop: '24px', marginTop: '24px' }}>
                <h3 style={{ fontFamily: 'serif', fontSize: '20px', marginBottom: '12px', color: '#2C2416' }}>אודות הספר</h3>
                <div style={{ fontSize: '15px', lineHeight: 1.9, color: '#2C2416' }}>
                  {product.full_description}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
