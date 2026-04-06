'use client'

export default function ProductCard({ product }) {
  const image = product.images?.[0]?.src || '/placeholder.jpg'
  const price = product.price
  const regularPrice = product.regular_price
  const onSale = product.sale_price && product.sale_price !== product.regular_price

  return (
    <a
      href={`/products/${product.id}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <div className="product-card">
        {/* תמונה */}
        <div style={{
          aspectRatio: '3/4',
          overflow: 'hidden',
          background: 'var(--cream-dark)',
          position: 'relative',
        }}>
          <img
            src={image}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s',
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
          {onSale && (
            <span style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'var(--gold)',
              color: 'var(--navy)',
              padding: '4px 10px',
              fontSize: '12px',
              fontWeight: '700',
            }}>
              מבצע
            </span>
          )}
        </div>

        {/* פרטים */}
        <div style={{ padding: '16px' }}>
          <h3 style={{
            fontSize: '15px',
            fontWeight: '700',
            marginBottom: '8px',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {product.name}
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="price">₪{parseFloat(price).toFixed(0)}</span>
            {onSale && (
              <span style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                textDecoration: 'line-through',
              }}>
                ₪{parseFloat(regularPrice).toFixed(0)}
              </span>
            )}
          </div>

          <button
            className="btn-primary"
            style={{ width: '100%', marginTop: '12px', fontSize: '13px', padding: '10px' }}
            onClick={(e) => {
              e.preventDefault()
              window.location.href = `/products/${product.id}`
            }}
          >
            לפרטים והזמנה
          </button>
        </div>
      </div>
    </a>
  )
}
