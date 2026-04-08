import fs from 'fs'
import path from 'path'
import ProductCard from '../components/ProductCard'

function getProducts(category = '', page = 1) {
  try {
    const filePath = path.join(process.cwd(), 'products.json')
    if (!fs.existsSync(filePath)) return { products: [], categories: [] }
    const all = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const filtered = category ? all.filter(p => p.category === category) : all
    const perPage = 20
    const start = (page - 1) * perPage
    const categories = [...new Set(all.map(p => p.category).filter(Boolean))]
    return {
      products: filtered.slice(start, start + perPage),
      categories,
      total: filtered.length,
      hasMore: start + perPage < filtered.length,
    }
  } catch {
    return { products: [], categories: [], total: 0, hasMore: false }
  }
}

export default function ProductsPage({ searchParams }) {
  const page = parseInt(searchParams?.page || '1')
  const category = searchParams?.category || ''
  const { products, categories, hasMore } = getProducts(category, page)

  return (
    <div style={{ padding: '48px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{ fontFamily: 'serif', fontSize: '40px', fontWeight: '900', marginBottom: '8px' }}>
          כל הספרים
        </h1>
        <p style={{ color: '#6B5C3E', marginBottom: '40px' }}>מבחר של למעלה מ-5,000 ספרי קודש ויהדות</p>

        <div style={{ display: 'flex', gap: '40px' }}>
          <aside style={{ width: '200px', flexShrink: 0 }}>
            <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>קטגוריות</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="/products" style={{ color: !category ? '#8B6914' : '#6B5C3E', textDecoration: 'none', fontSize: '14px', fontWeight: !category ? '700' : '400' }}>
                  כל הספרים
                </a>
              </li>
              {categories.map((cat, i) => (
                <li key={i} style={{ marginBottom: '8px' }}>
                  <a href={`/products?category=${encodeURIComponent(cat)}`}
                    style={{ color: category === cat ? '#8B6914' : '#6B5C3E', textDecoration: 'none', fontSize: '14px', fontWeight: category === cat ? '700' : '400' }}>
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <div style={{ flex: 1 }}>
            {products.length > 0 ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                  {products.map((product, i) => (
                    <ProductCard key={i} product={product} />
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  {page > 1 && (
                    <a href={`/products?page=${page - 1}${category ? `&category=${encodeURIComponent(category)}` : ''}`}
                      style={{ background: 'transparent', color: '#C9A84C', border: '1.5px solid #C9A84C', padding: '10px 24px', textDecoration: 'none', fontSize: '14px' }}>
                      ← הקודם
                    </a>
                  )}
                  {hasMore && (
                    <a href={`/products?page=${page + 1}${category ? `&category=${encodeURIComponent(category)}` : ''}`}
                      style={{ background: '#C9A84C', color: '#1A2332', padding: '10px 24px', textDecoration: 'none', fontSize: '14px' }}>
                      הבא →
                    </a>
                  )}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px', background: '#F8F4EE', color: '#6B5C3E' }}>
                <p style={{ fontSize: '18px', marginBottom: '12px' }}>המוצרים בדרך אליך...</p>
                <p style={{ fontSize: '14px' }}>הסריקה היומית תטען את כל הספרים בקרוב</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
