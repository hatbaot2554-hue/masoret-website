import ProductCard from '../components/ProductCard'

async function getAllProducts() {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/hatbaot2554-hue/masoret-automation/refs/heads/main/products.json',
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

export default async function ProductsPage({ searchParams }) {
  const page = parseInt(searchParams?.page || '1')
  const category = searchParams?.category || ''
  const all = await getAllProducts()

  // כל מוצר מקבל את האינדקס האמיתי שלו ברשימה הכללית
  const allWithIndex = all.map((p, i) => ({ ...p, index: i }))
  const filtered = category ? allWithIndex.filter(p => p.category === category) : allWithIndex
  const perPage = 20
  const start = (page - 1) * perPage
  const products = filtered.slice(start, start + perPage)
  const categories = [...new Set(all.map(p => p.category).filter(Boolean))]
  const hasMore = start + perPage < filtered.length

  return (
    <div style={{ padding: '48px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{ fontFamily: 'serif', fontSize: '40px', fontWeight: '900', marginBottom: '8px' }}>כל הספרים</h1>
        <p style={{ color: '#6B5C3E', marginBottom: '40px' }}>מבחר של למעלה מ-5,000 ספרי קודש ויהדות</p>
        <div style={{ display: 'flex', gap: '40px' }}>
          <aside style={{ width: '200px', flexShrink: 0 }}>
            <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>קטגוריות</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="/products" style={{ color: !category ? '#8B6914' : '#6B5C3E', textDecoration: 'none', fontSize: '14px', fontWeight: !category ? '700' : '400' }}>כל הספרים</a>
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
                  {products.map((product) => (
                    <ProductCard key={product.index} product={product} index={product.index} />
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  {page > 1 && (
                    <a href={`/products?page=${page - 1}${category ? `&category=${encodeURIComponent(category)}` : ''}`}
                      style={{ background: 'transparent', color: '#C9A84C', border: '1.5px solid #C9A84C', padding: '10px 24px', textDecoration: 'none', fontSize: '14px' }}>← הקודם</a>
                  )}
                  {hasMore && (
                    <a href={`/products?page=${page + 1}${category ? `&category=${encodeURIComponent(category)}` : ''}`}
                      style={{ background: '#C9A84C', color: '#1A2332', padding: '10px 24px', textDecoration: 'none', fontSize: '14px' }}>הבא →</a>
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
