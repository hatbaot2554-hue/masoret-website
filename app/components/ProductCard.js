'use client'
import { useState } from 'react'
import { useCart } from './CartContext'
import { useWishlist } from './WishlistContext'
import { useLanguage } from './LanguageRuntime'
import { translateProductName } from '../lib/i18n'

function formatPrice(price) {
  const p = parseFloat(price || 0)
  if (p < 10) return Math.ceil(p * 2) / 2
  return Math.ceil(p)
}

export default function ProductCard({ product, index }) {
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  const { lang, t } = useLanguage()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const image = product.image || ''
  const finalPrice = formatPrice(product.price)
  const regularFinalPrice = formatPrice(product.regular_our_price || product.price)
  const hasDiscount = regularFinalPrice > finalPrice
  const inStock = product.in_stock !== false
  const wished = isInWishlist(index)
  const displayName = translateProductName(product, lang)
  const productUrl = '/products/' + index
  const requiresOptions = Boolean(
    (Array.isArray(product.variations) && product.variations.length > 0) ||
    (product.attribute_options &&
      Object.values(product.attribute_options).some(values =>
        Array.isArray(values) && values.filter(Boolean).length > 0
      ))
  )

  // תגית חכמה — נמכר ביותר אם index < 5, חדש אם index >= 5 && index < 10
  const smartBadge = index < 5 ? { label: t('🏆 נמכר ביותר', '🏆 Best seller'), bg: '#8B6914' }
    : index < 10 ? { label: t('✨ חדש', '✨ New'), bg: '#2980b9' }
    : null

  function handleAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    if (requiresOptions) {
      openProduct()
      return
    }
    addItem(product, quantity, {}, null, null)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)

    // שמירה ב-localStorage להיסטוריית צפייה
    try {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
      const filtered = viewed.filter(p => p.index !== index)
      filtered.unshift({ index, name: displayName, image: product.image, price: product.price })
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

  function rememberProductView() {
    try {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
      const filtered = viewed.filter(p => p.index !== index)
      filtered.unshift({ index, name: displayName, image: product.image, price: product.price })
      localStorage.setItem('recentlyViewed', JSON.stringify(filtered.slice(0, 10)))
    } catch {}
  }

  function openProduct() {
    rememberProductView()
    window.location.href = productUrl
  }

  function handleCardKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openProduct()
    }
  }

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={openProduct}
      onKeyDown={handleCardKeyDown}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block', cursor: 'pointer' }}>
      <div
        className="product-card"
        style={{ transition: 'all 0.25s', overflow: 'hidden', position: 'relative' }}
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

        <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: 'var(--color-cream-150)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px' }}>
          {image
            ? <img src={image} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} loading="lazy" />
            : <span style={{ fontSize: '48px' }}>📖</span>}
        </div>

        <div style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {displayName}
          </h3>

          <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {hasDiscount && (
              <span style={{ fontSize: '0.95rem', color: '#999', textDecoration: 'line-through' }}>₪{regularFinalPrice}</span>
            )}
            <span style={{ fontFamily: 'serif', fontSize: '1.4rem', color: '#8B6914', fontWeight: '700' }}>₪{finalPrice}</span>
          </div>

          {inStock ? (
            <div onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                <button onClick={e => handleQty(e, -1)}
                  style={{ width: '30px', height: '30px', border: '1px solid var(--color-border-light)', borderRadius: '10px', background: 'var(--color-cream-150)', color: 'var(--color-navy-900)', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <span style={{ fontWeight: '700', minWidth: '28px', textAlign: 'center', fontSize: '15px' }}>{quantity}</span>
                <button onClick={e => handleQty(e, 1)}
                  style={{ width: '30px', height: '30px', border: '1px solid var(--color-border-light)', borderRadius: '10px', background: 'var(--color-cream-150)', color: 'var(--color-navy-900)', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={handleAdd}
                  style={{ flex: 1, background: added ? 'var(--color-success-600)' : 'var(--color-cta-600)', color: '#fff', minHeight: '44px', padding: '11px 8px', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {requiresOptions
                    ? t('בחר אפשרויות', 'Choose options')
                    : added ? t('✓ נוסף!', '✓ Added!') : t('🛒 לסל', '🛒 Cart')}
                </button>
                <a href={productUrl} onClick={(e) => { e.stopPropagation(); rememberProductView() }}
                  style={{ flex: 1, background: 'transparent', color: 'var(--color-navy-900)', border: '1px solid var(--color-border-medium)', borderRadius: '12px', minHeight: '44px', padding: '10px 8px', textDecoration: 'none', fontSize: '13px', fontWeight: '700', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {t('פרטים', 'Details')}
                </a>
              </div>
            </div>
          ) : (
            <a href={productUrl} onClick={(e) => { e.stopPropagation(); rememberProductView() }}
              style={{ display: 'block', background: 'transparent', color: 'var(--color-navy-900)', border: '1px solid var(--color-border-medium)', borderRadius: '12px', minHeight: '44px', padding: '11px', textAlign: 'center', fontSize: '13px', fontWeight: '700', textDecoration: 'none' }}>
              {t('לפרטים ←', 'Details ←')}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
