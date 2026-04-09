'use client'

export default function ProductCard({ product, index }) {
  const image = product.image || ''
  const price = parseFloat(product.price || 0)
  const originalPrice = parseFloat(product.original_price || 0)
  const inStock = product.in_stock !== false
  const displayPrice = price > 1 ? price.toFixed(0) : (originalPrice * 1.15).toFixed(0)

  return (
    <a href={`/products/${index}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', opacity: inStock ? 1 : 0.7 }}>
      <div style={{ background: '#fff', border: '1px solid #EDE6D9', transition: 'all 0.25s', overflow: 'hidden', position: 'relative' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#EDE6D9'; e.currentTarget.style.transform = 'translateY(0)' }}>
        
        {!inStock && (
          <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#c0392b', color: '#fff', padding: '4px 10px', fontSize: '12px', fontWeight: '700', zIndex: 1 }}>
            חסר במלאי
          </div>
        )}
        
        <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#EDE6D9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {image ? (
            <img src={image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '48px' }}>📖</span>
          )}
        </div>
        
        <div style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </h3>
          <div style={{ fontFamily: 'serif', fontSize: '1.4rem', color: '#8B6914', fontWeight: '700', marginBottom: '12px' }}>
            ₪{displayPrice}
          </div>
          <div style={{ background: inStock ? '#C9A84C' : '#999', color: '#1A2332', padding: '10px', textAlign: 'center', fontSize: '13px', fontWeight: '500' }}>
            {inStock ? 'לפרטים והזמנה' : 'חסר במלאי'}
          </div>
        </div>
      </div>
    </a>
  )
}
