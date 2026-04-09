import OrderForm from '../../components/OrderForm'

async function getProduct(id) {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/hatbaot2554-hue/masoret-automation/refs/heads/main/products.json',
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    const all = await res.json()
    return all[parseInt(id)] || null
  } catch {
    return null
  }
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id)

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2>המוצר לא נמצא</h2>
        <a href="/products" style={{ display: 'inline-block', marginTop: '24px', background: '#C9A84C', color: '#1A2332', padding: '12px 28px', textDecoration: 'none' }}>חזרה לחנות</a>
      </div>
    )
  }

  return (
    <div style={{ padding: '56px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <p style={{ fontSize: '13px', color: '#6B5C3E', marginBottom: '32px' }}>
          <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>בית</a> {' > '}
          <a href="/products" style={{ color: 'inherit', textDecoration: 'none' }}>ספרים</a> {' > '}
          {product.name}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '64px' }}>
          <div style={{ background: '#EDE6D9', padding: '32px' }}>
            {product.image ? (
              <img src={product.image} alt={product.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
            ) : (
              <div style={{ aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>📖</div>
            )}
          </div>
          <div>
            <h1 style={{ fontFamily: 'serif', fontSize: '34px', fontWeight: '900', marginBottom: '16px', lineHeight: 1.3 }}>{product.name}</h1>
            {product.category && (
              <p style={{ fontSize: '13px', color: '#6B5C3E', marginBottom: '16px' }}>
                קטגוריה: <a href={`/products?category=${encodeURIComponent(product.category)}`} style={{ color: '#8B6914' }}>{product.category}</a>
              </p>
            )}
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontFamily: 'serif', fontSize: '2rem', color: '#8B6914', fontWeight: '700' }}>
                ₪{parseFloat(product.price).toFixed(0)}
              </span>
            </div>
            {product.description && (
              <div style={{ borderTop: '1px solid #EDE6D9', borderBottom: '1px solid #EDE6D9', padding: '20px 0', marginBottom: '32px', fontSize: '15px', lineHeight: 1.8, color: '#2C2416' }}>
                {product.description}
              </div>
            )}
            <OrderForm product={{ ...product, sourceProductId: product.url }} />
          </div>
        </div>
      </div>
    </div>
  )
}
