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

async function getCategoryTree() {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/hatbaot2554-hue/masoret-automation/refs/heads/main/categories.json',
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
  const search = searchParams?.search || ''

  const [all, categoryTree] = await Promise.all([getAllProducts(), getCategoryTree()])
  const allWithIndex = all.map((p, i) => ({ ...p, index: i }))

  // סינון מוצרים — בודק גם category וגם parent_category וגם child_category
  let filtered = allWithIndex
  if (category) {
    filtered = filtered.filter(p =>
      p.category === category ||
      p.parent_category === category ||
      p.child_category === category ||
      (p.categories && p.categories.includes(category))
    )
  }
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    )
  }

  const perPage = 20
  const start = (page - 1) * perPage
  const products = filtered.slice(start, start + perPage)
  const hasMore = start + perPage < filtered.length

  // מוצא איזו קטגוריה ראשית פעילה
  const activeParent = categoryTree.find(item =>
    item.parent === category || (item.children && item.children.includes(category))
  )

  return (
    <div style={{ padding: '48px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{ fontFamily: 'serif', fontSize: '40px', fontWeight: '900', marginBottom: '8px' }}>
          {category || 'כל הספרים'}
        </h1>
        <p style={{ color: '#6B5C3E', marginBottom: '40px' }}>
          {search
            ? `תוצאות חיפוש עבור "${search}" — ${filtered.length} מוצרים`
            : `${filtered.length} ספרים`}
        </p>
        <div style={{ display: 'flex', gap: '40px' }}>

          {/* סיידבר קטגוריות */}
          <aside style={{ width: '220px', flexShrink: 0 }}>
            <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#2C2416' }}>קטגוריות</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="/products" style={{ color: !category ? '#8B6914' : '#6B5C3E', textDecoration: 'none', fontSize: '14px', fontWeight: !category ? '700' : '400' }}>
                  כל הספרים
                </a>
              </li>
              {categoryTree.map(item => (
                <li key={item.parent} style={{ marginBottom: '4px' }}>
                  {/* קטגוריה ראשית */}
                  
                    href={'/products?category=' + encodeURIComponent(item.parent)}
                    style={{
                      display: 'block',
                      color: category === item.parent ? '#8B6914' : '#2C2416',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: '700',
                      padding: '6px 0',
                      borderBottom: '1px solid #EDE6D9'
                    }}>
                    {item.parent}
                  </a>
                  {/* תתי קטגוריות — מוצגות תמיד אם הקטגוריה הראשית פעילה */}
                  {activeParent && activeParent.parent === item.parent && item.children && item.children.length > 0 && (
                    <ul style={{ listStyle: 'none', padding: '4px 0 4px 12px', margin: 0 }}>
                      {item.children.map(child => (
                        <li key={child} style={{ marginBottom: '4px' }}>
                          
                            href={'/products?category=' + encodeURIComponent(child)}
                            style={{
                              color: category === child ? '#8B6914' : '#6B5C3E',
                              textDecoration: 'none',
                              fontSize: '13px',
                              fontWeight: category === child ? '700' : '400'
                            }}>
                            {child}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </aside>

          {/* רשת מוצרים */}
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
                    <a href={'/products?page=' + (page - 1) + (category ? '&category=' + encodeURIComponent(category) : '') + (search ? '&search=' + encodeURIComponent(search) : '')}
                      style={{ background: 'transparent', color: '#C9A84C', border: '1.5px solid #C9A84C', padding: '10px 24px', textDecoration: 'none', fontSize: '14px' }}>
                      ← הקודם
                    </a>
                  )}
                  {hasMore && (
                    <a href={'/products?page=' + (page + 1) + (category ? '&category=' + encodeURIComponent(category) : '') + (search ? '&search=' + encodeURIComponent(search) : '')}
                      style={{ background: '#C9A84C', color: '#1A2332', padding: '10px 24px', textDecoration: 'none', fontSize: '14px' }}>
                      הבא →
                    </a>
                  )}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px', background: '#F8F4EE', color: '#6B5C3E' }}>
                <p style={{ fontSize: '18px', marginBottom: '12px' }}>
                  {search ? `לא נמצאו תוצאות עבור "${search}"` : 'לא נמצאו מוצרים בקטגוריה זו'}
                </p>
                <p style={{ fontSize: '14px' }}>
                  {search ? 'נסה מילות חיפוש אחרות' : 'נסה קטגוריה אחרת'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
