import { getProducts, getCategories } from '../lib/woocommerce'
import ProductCard from '../components/ProductCard'

export default async function ProductsPage({ searchParams }) {
  const page = parseInt(searchParams?.page || '1')
  const category = searchParams?.category || ''

  let products = []
  let categories = []

  try {
    [products, categories] = await Promise.all([
      getProducts(page, 20, category),
      getCategories(),
    ])
  } catch (e) {
    console.error(e)
  }

  return (
    <div style={{ padding: '48px 0' }}>
      <div className="container">
        <h1 style={{
          fontFamily: 'Frank Ruhl Libre, serif',
          fontSize: '40px',
          fontWeight: '900',
          marginBottom: '8px',
        }}>
          כל הספרים
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>
          מבחר של למעלה מ-5,000 ספרי קודש ויהדות
        </p>

        <div style={{ display: 'flex', gap: '40px' }}>
          {/* סינון קטגוריות */}
          <aside style={{ width: '220px', flexShrink: 0 }}>
            <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--text)' }}>קטגוריות</h3>
            <ul style={{ listStyle: 'none' }}>
              <li style={{ marginBottom: '8px' }}>
                <a
                  href="/products"
                  style={{
                    color: !category ? 'var(--gold-dark)' : 'var(--text-muted)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: !category ? '700' : '400',
                  }}
                >
                  כל הספרים
                </a>
              </li>
              {categories.map((cat) => (
                <li key={cat.id} style={{ marginBottom: '8px' }}>
                  <a
                    href={`/products?category=${cat.id}`}
                    style={{
                      color: category === String(cat.id) ? 'var(--gold-dark)' : 'var(--text-muted)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: category === String(cat.id) ? '700' : '400',
                      transition: 'color 0.2s',
                    }}
                  >
                    {cat.name} ({cat.count})
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* רשת מוצרים */}
          <div style={{ flex: 1 }}>
            {products.length > 0 ? (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '20px',
                  marginBottom: '40px',
                }}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* דפדוף */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  {page > 1 && (
                    <a
                      href={`/products?page=${page - 1}${category ? `&category=${category}` : ''}`}
                      className="btn-outline"
                      style={{ textDecoration: 'none' }}
                    >
                      ← הקודם
                    </a>
                  )}
                  <a
                    href={`/products?page=${page + 1}${category ? `&category=${category}` : ''}`}
                    className="btn-primary"
                    style={{ textDecoration: 'none' }}
                  >
                    הבא →
                  </a>
                </div>
              </>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '80px',
                background: 'var(--cream-dark)',
                color: 'var(--text-muted)',
              }}>
                <p style={{ fontSize: '18px', marginBottom: '12px' }}>⚠️ לא ניתן לטעון מוצרים</p>
                <p style={{ fontSize: '14px' }}>יש להגדיר את מפתחות ה-API בקובץ .env.local</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
