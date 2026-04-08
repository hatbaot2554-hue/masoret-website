'use client'

export default function ProductCard({ product, index }) {
  const image = product.image || ''
  const price = parseFloat(product.price || 0).toFixed(0)

  return (
    <a href={`/products/${index ?? 0}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div style={{ background: '#fff', border: '1px solid #EDE6D9', transition: 'all 0.25s', overflow: 'hidden' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#EDE6D9'; e.currentTarget.style.transform = 'translateY(0)' }}>
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
            ₪{price}
          </div>
          <div style={{ background: '#C9A84C', color: '#1A2332', padding: '10px', textAlign: 'center', fontSize: '13px', fontWeight: '500' }}>
            לפרטים והזמנה
          </div>
        </div>
      </div>
    </a>
  )
}
