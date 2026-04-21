'use client'
import { useWishlist } from '../components/WishlistContext'
import { useCart } from '../components/CartContext'
import { useState } from 'react'

function formatPrice(price) {
  const p = parseFloat(price || 0)
  if (p < 10) return Math.ceil(p * 2) / 2
  return Math.ceil(p)
}

export default function WishlistPage() {
  const { items, removeItem } = useWishlist()
  const { addItem } = useCart()
  const [addedMap, setAddedMap] = useState({})

  function handleAdd(product) {
    addItem(product, 1, {}, null, null)
    setAddedMap(prev => ({ ...prev, [product.index]: true }))
    setTimeout(() => setAddedMap(prev => ({ ...prev, [product.index]: false })), 2000)
  }

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🤍</div>
        <h2 style={{ fontFamily: 'serif', fontSize: '28px', marginBottom: '12px' }}>רשימת המועדפים ריקה</h2>
        <p style={{ color: '#6B5C3E', marginBottom: '24px' }}>לחץ על ❤️ על כל מוצר שתרצה לשמור לקנייה עתידית</p>
        <a href="/products" style={{ background: '#C9A84C', color: '#1A2332', padding: '14px 32px', textDecoration: 'none', fontSize: '15px', fontFamily: 'serif', fontWeight: '700' }}>
          לכל הספרים
        </a>
      </div>
    )
  }

  return (
    <div style={{ padding: '48px 0' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 32px' }}>
        <h1 style={{ fontFamily: 'serif', fontSize: '40px', fontWeight: '900', marginBottom: '8px' }}>המועדפים שלי</h1>
        <p style={{ color: '#6B5C3E', marginBottom: '40px' }}>{items.length} ספרים שמורים</p>

        <div className="products-grid">
          {items.map(product => {
            const finalPrice = formatPrice(product.price)
            const regularFinalPrice = formatPrice(product.regular_our_price || product.price)
            const hasDiscount = regularFinalPrice > finalPrice
            const inStock = product.in_stock !== false
            const isAdded = addedMap[product.index]

            return (
              <div key={product.index}
                style={{ background: '#fff', border: '1px solid #EDE6D9', overflow: 'hidden', position: 'relative' }}>

                <button onClick={() => removeItem(product.index)}
                  style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2, fontSize: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                  ❤️
                </button>

                <a href={'/products/' + product.index} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#EDE6D9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {product.image
                      ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '48px' }}>📖</span>}
                  </div>
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {product.name}
                    </h3>
                    <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {hasDiscount && <span style={{ fontSize: '0.95rem', color: '#999', textDecoration: 'line-through' }}>₪{regularFinalPrice}</span>}
                      <span style={{ fontFamily: 'serif', fontSize: '1.4rem', color: '#8B6914', fontWeight: '700' }}>₪{finalPrice}</span>
                      {hasDiscount && <span style={{ background: '#e74c3c', color: '#fff', padding: '2px 8px', fontSize: '11px', fontWeight: '700' }}>מבצע!</span>}
                    </div>
                  </div>
                </a>

                <div style={{ padding: '0 16px 16px', display: 'flex', gap: '6px' }}>
                  {inStock ? (
                    <>
                      <button onClick={() => handleAdd(product)}
                        style={{ flex: 1, background: isAdded ? '#27ae60' : '#C9A84C', color: isAdded ? '#fff' : '#1A2332', padding: '10px 6px', border: 'none', fontSize: '12px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>
                        {isAdded ? '✓ נוסף!' : '🛒 הוסף לסל'}
                      </button>
                      <a href={'/products/' + product.index}
                        style={{ flex: 1, background: '#1A2332', color: '#C9A84C', padding: '10px 6px', textDecoration: 'none', fontSize: '12px', fontWeight: '600', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        פרטים
                      </a>
                    </>
                  ) : (
                    <div style={{ flex: 1, background: '#999', color: '#fff', padding: '10px', textAlign: 'center', fontSize: '13px' }}>חסר במלאי</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
