'use client'
import { useState } from 'react'
import { useCart } from './CartContext'
import { useWishlist } from './WishlistContext'

function formatPrice(price) {
  const p = parseFloat(price || 0)
  if (p < 10) return Math.ceil(p * 2) / 2
  return Math.ceil(p)
}

export default function ProductCard({ product, index }) {
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const image = product.image || ''
  const finalPrice = formatPrice(product.price)
  const regularFinalPrice = formatPrice(product.regular_our_price || product.price)
  const hasDiscount = regularFinalPrice > finalPrice
  const inStock = product.in_stock !== false
  const wished = isInWishlist(index)

  // תגית חכמה — נמכר ביותר אם index < 5, חדש אם index >= 5 && index < 10
  const smartBadge = index < 5 ? { label: '🏆 נמכר ביותר', bg: '#8B6914' }
    : index < 10 ? { label: '✨ חדש', bg: '#2980b9' }
    : null

  function handleAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, quantity, {}, null, null)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)

    // שמירה ב-localStorage להיסטוריית צפייה
    try {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
      const filtered = viewed.filter(p => p.index !== index)
      filtered.unshift({ index, name: product.name, image: product.image, price: product.price })
      localStorage.setItem('recentlyViewed', JSON.stringify(filtered.slice(0, 10)))
    } catch {}
  }

  function handleQty(e, delta) {
    e.preventDefault()
    e.stopPropagation()
    setQuantity(prev => Math.max(1, prev + delta))
  }

  function handleWishlist(e) {
    e.preventDefault()
    e.stopPropagation()
    toggleItem({ ...product, index })
  }

  return (
    <a href={'/products/' + index}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      onClick={() => {
        try {
          const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
          const filtered = viewed.filter(p => p.index !== index)
          filtered.unshift({ index, name: product.name, image: product.image, price: product.price })
          localStorage.setItem('recentlyViewed', JSON.stringify(filtered.slice(0, 10)))
        } catch {}
      }}>
      <div
        style={{ background: '#fff', border: '1px solid #EDE6D9', transition: 'all 0.25s', overflow: 'hidden', position: 'relative' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#EDE6D9'; e.currentTarget.style.transform = 'translateY(0)' }}>

        {/* תגית חכמה */}
        {smartBadge && (
          <div style={{ position: 'absolute', top: '12px', right: '12px', background: smartBadge.bg, color: '#fff', padding: '4px 10px', fontSize: '11px', fontWeight: '700', zIndex: 1, borderRadius: '3px' }}>
            {smartBadge.label}
          </div>
        )}

        {hasDiscount && inStock && (
          <div style={{ position: 'absolute', top: smartBadge ? '40px' : '12px', right: '12px', background: '#e74c3c', color: '#fff', padding: '4px 10px', fontSize: '11px', fontWeight: '700', zIndex: 1, borderRadius: '3px' }}>
            מבצע!
          </div>
        )}

        <button onClick={handleWishlist}
          style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2, fontSize: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
          {wished ? '❤️' : '🤍'}
        </button>

        <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#EDE6D9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {image
            ? <img src={image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
            : <span style={{ fontSize: '48px' }}>📖</span>}
        </div>

        <div style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </h3>

          <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {hasDiscount && (
              <span style={{ fontSize: '0.95rem', color: '#999', textDecoration: 'line-through' }}>₪{regularFinalPrice}</span>
            )}
            <span style={{ fontFamily: 'serif', fontSize: '1.4rem', color: '#8B6914', fontWeight: '700' }}>₪{finalPrice}</span>
          </div>

          {inStock ? (
            <div onClick={e => e.preventDefault()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                <button onClick={e => handleQty(e, -1)}
                  style={{ width: '28px', height: '28px', border: '1px solid #EDE6D9', background: '#fff', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <span style={{ fontWeight: '700', minWidth: '28px', textAlign: 'center', fontSize: '15px' }}>{quantity}</span>
                <button onClick={e => handleQty(e, 1)}
                  style={{ width: '28px', height: '28px', border: '1px solid #EDE6D9', background: '#fff', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={handleAdd}
                  style={{ flex: 1, background: added ? '#27ae60' : '#C9A84C', color: added ? '#fff' : '#1A2332', padding: '9px 6px', border: 'none', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {added ? '✓ נוסף!' : '🛒 לסל'}
                </button>
                <a href={'/products/' + index} onClick={e => e.stopPropagation()}
                  style={{ flex: 1, background: '#1A2332', color: '#C9A84C', padding: '9px 6px', textDecoration: 'none', fontSize: '12px', fontWeight: '600', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  פרטים
                </a>
              </div>
            </div>
          ) : (
            <a href={'/products/' + index} onClick={e => e.stopPropagation()}
              style={{ display: 'block', background: '#1A2332', color: '#C9A84C', padding: '10px', textAlign: 'center', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
              לפרטים ←
            </a>
          )}
        </div>
      </div>
    </a>
  )
}
