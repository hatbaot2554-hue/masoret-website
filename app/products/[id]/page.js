import { getProduct } from '../../lib/woocommerce'
import OrderForm from '../../components/OrderForm'

export default async function ProductPage({ params }) {
  let product = null

  try {
    product = await getProduct(params.id)
  } catch (e) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>המוצר לא נמצא</h2>
        <a href="/products" className="btn-primary" style={{ display: 'inline-block', marginTop: '24px', textDecoration: 'none' }}>
          חזרה לחנות
        </a>
      </div>
    )
  }

  const image = product.images?.[0]?.src || '/placeholder.jpg'
  const description = product.description?.replace(/<[^>]*>/g, '') || ''

  return (
    <div style={{ padding: '56px 0' }}>
      <div className="container">
        {/* Breadcrumb */}
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>
          <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>בית</a>
          {' > '}
          <a href="/products" style={{ color: 'inherit', textDecoration: 'none' }}>ספרים</a>
          {' > '}
          {product.name}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '64px' }}>
          {/* תמונה */}
          <div>
            <div style={{
              background: 'var(--cream-dark)',
              padding: '32px',
              marginBottom: '16px',
            }}>
              <img
                src={image}
                alt={product.name}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>

          {/* פרטים + הזמנה */}
          <div>
            <h1 style={{
              fontFamily: 'Frank Ruhl Libre, serif',
              fontSize: '34px',
              fontWeight: '900',
              marginBottom: '16px',
              lineHeight: 1.3,
            }}>
              {product.name}
            </h1>

            <div style={{ marginBottom: '24px' }}>
              <span className="price" style={{ fontSize: '2rem' }}>
                ₪{parseFloat(product.price).toFixed(0)}
              </span>
              {product.sale_price && product.sale_price !== product.regular_price && (
                <span style={{
                  fontSize: '16px',
                  color: 'var(--text-muted)',
                  textDecoration: 'line-through',
                  marginRight: '12px',
                }}>
                  ₪{parseFloat(product.regular_price).toFixed(0)}
                </span>
              )}
            </div>

            <div style={{
              borderTop: '1px solid var(--cream-dark)',
              borderBottom: '1px solid var(--cream-dark)',
              padding: '20px 0',
              marginBottom: '32px',
              fontSize: '15px',
              lineHeight: 1.8,
              color: 'var(--text)',
            }}>
              {description.slice(0, 400)}{description.length > 400 ? '...' : ''}
            </div>

            {/* טופס הזמנה */}
            <OrderForm product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}
