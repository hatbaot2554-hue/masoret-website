import OrderForm from '../../components/OrderForm'

function formatPrice(price) {
  const p = parseFloat(price || 0)
  if (p < 10) return Math.ceil(p * 2) / 2
  return Math.ceil(p)
}

async function getProduct(id) {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/hatbaot2554-hue/masoret-automation/refs/heads/main/products.json',
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    const all = await res.json()
    const idx = parseInt(id)
    if (!isNaN(idx) && idx >= 0 && idx < all.length) return all[idx]
    return null
  } catch {
    return null
  }
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id)
  const inStock = product?.in_stock !== false

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2>המוצר לא נמצא</h2>
        <a href="/products" style={{ display: 'inline-block', marginTop: '24px', background: '#C9A84C', color: '#1A2332', padding: '12px 28px', textDecoration: 'none' }}>
          חזרה לחנות
        </a>
      </div>
    )
  }

  const finalPrice = formatPrice(product.price)
  const regularFinalPrice = formatPrice(product.regular_our_price || product.price)
  const hasDiscount = regularFinalPrice > finalPrice

  return (
    <div style={{ padding: '56px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <p style={{ fontSize: '13px', color: '#6B5C3E', marginBottom: '32px' }}>
          <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>בית</a>
          {' > '}
          <a href="/products" style={{ color: 'inherit', textDecoration: 'none' }}>ספרים</a>
          {' > '}
          {product.name}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '64px' }}>
          <div style={{ background: '#EDE6D9', padding: '32px', position: 'relative' }}>
            {!inStock && (
              <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#c0392b', color: '#fff', padding: '6px 14px', fontSize: '13px', fontWeight: '700' }}>
                חסר במלאי
              </div>
            )}
            {product.image ? (
              <img src={product.image} alt={product.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
            ) : (
              <div style={{ aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>📖</div>
            )}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                {product.images.slice(1).map((img, i) => (
                  <img key={i} src={img} alt={`${product.name} ${i + 2}`}
                    style={{ width: '64px', height: '64px', objectFit: 'cover', border: '1px solid #C9A84C', cursor: 'pointer' }} />
                ))}
              </div>
            )}
          </div>
          <div>
            <h1 style={{ fontFamily: 'serif', fontSize: '34px', fontWeight: '900', marginBottom: '16px', lineHeight: 1.3 }}>
              {product.name}
            </h1>
            {product.sku && (
              <p style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>מק"ט: {product.sku}</p>
            )}
            {product.category && (
              <p style={{ fontSize: '13px', color: '#6B5C3E', marginBottom: '16px' }}>
                קטגוריה: <a href={`/products?category=${encodeURIComponent(product.category)}`} style={{ color: '#8B6914' }}>{product.category}</a>
              </p>
            )}
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {hasDiscount && (
                  <span style={{ fontSize: '1.3rem', color: '#999', textDecoration: 'line-through' }}>
                    ₪{regularFinalPrice}
                  </span>
                )}
                <span style={{ fontFamily: 'serif', fontSize: '2rem', color: '#8B6914', fontWeight: '700' }}>
                  ₪{finalPrice}
                </span>
                {hasDiscount && (
                  <span style={{ background: '#e74c3c', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '13px', fontWeight: '600' }}>
                    מבצע!
                  </span>
                )}
              </div>
              {!inStock && (
                <span style={{ background: '#fff0f0', color: '#c0392b', padding: '4px 10px', fontSize: '13px', fontWeight: '600', border: '1px solid #fcc' }}>
                  חסר במלאי
                </span>
              )}
            </div>
            {product.description && (
              <div style={{ borderTop: '1px solid #EDE6D9', borderBottom: '1px solid #EDE6D9', padding: '20px 0', marginBottom: '32px', fontSize: '15px', lineHeight: 1.8, color: '#2C2416' }}>
                {product.description}
              </div>
            )}
            {inStock ? (
              <OrderForm product={{
                ...product,
                price: finalPrice,
                regular_our_price: regularFinalPrice,
                sourceProductId: product.product_id || product.url
              }} />
            ) : (
              <div style={{ background: '#fff0f0', border: '1px solid #fcc', padding: '20px', textAlign: 'center', color: '#c0392b', fontSize: '16px' }}>
                המוצר כרגע חסר במלאי — נשמח לעדכן אותך כשיחזור
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
