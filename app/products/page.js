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

function Sidebar({ categoryTree, category }) {
  const activeParent = categoryTree.find(function(item) {
    return item.parent === category || (item.children && item.children.includes(category))
  })

  return (
    <aside style={{ width: '220px', flexShrink: 0 }}>
      <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#2C2416' }}>קטגוריות</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li style={{ marginBottom: '8px' }}>
          <a href="/products" style={{ color: !category ? '#8B6914' : '#6B5C3E', textDecoration: 'none', fontSize: '14px', fontWeight: !category ? '700' : '400' }}>
            כל הספרים
          </a>
        </li>
        {categoryTree.map(function(item) {
          var isActiveParent = activeParent && activeParent.parent === item.parent
          var parentColor = category === item.parent ? '#8B6914' : '#2C2416'
          var parentWeight = '700'
          return (
            <li key={item.parent} style={{ marginBottom: '4px' }}>
              
                href={'/products?category=' + encodeURIComponent(item.parent)}
                style={{
                  display: 'block',
                  color: parentColor,
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: parentWeight,
                  padding: '6px 0',
                  borderBottom: '1px solid #EDE6D9'
                }}>
                {item.parent}
              </a>
              {isActiveParent && item.children && item.children.length > 0 && (
                <ul style={{ listStyle: 'none', padding: '4px 0 4px 12px', margin: 0 }}>
                  {item.children.map(function(child) {
                    var childColor = category === child ? '#8B6914' : '#6B5C3E'
                    var childWeight = category === child ? '700' : '400'
                    return (
                      <li key={child} style={{ marginBottom: '4px' }}>
                        
                          href={'/products?category=' + encodeURIComponent(child)}
                          style={{ color: childColor, textDecoration: 'none', fontSize: '13px', fontWeight: childWeight }}>
                          {child}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export default async function ProductsPage({ searchParams }) {
  const page = parseInt(searchParams?.page || '1')
  const category = searchParams?.category || ''
  const search = searchParams?.search || ''

  const [all, categoryTree] = await Promise.all([getAllProducts(), getCategoryTree()])
  const allWithIndex = all.map(function(p, i) { return Object.assign({}, p, { index: i }) })

  var filtered = allWithIndex
  if (category) {
    filtered = filtered.filter(function(p) {
      return p.category === category ||
        p.parent_category === category ||
        p.child_category === category ||
        (p.categories && p.categories.includes(category))
    })
  }
  if (search) {
    var q = search.toLowerCase()
    filtered = filtered.filter(function(p) {
      return (p.name && p.name.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
    })
  }

  var perPage = 20
  var start = (page - 1) * perPage
  var products = filtered.slice(start, start + perPage)
  var hasMore = start + perPage < filtered.length

  return (
    <div style={{ padding: '48px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{ fontFamily: 'serif', fontSize: '40px', fontWeight: '900', marginBottom: '8px' }}>
          {category || 'כל הספרים'}
        </h1>
        <p style={{ color: '#6B5C3E', marginBottom: '40px' }}>
          {search ? 'תוצאות חיפוש עבור "' + search + '" — ' + filtered.length + ' מוצרים' : filtered.length + ' ספרים'}
        </p>
        <div style={{ display: 'flex', gap: '40px' }}>
          <Sidebar categoryTree={categoryTree} category={category} />
          <div style={{ flex: 1 }}>
            {products.length > 0 ? (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                  {products.map(function(product) {
                    return <ProductCard key={product.index} product={product} index={product.index} />
                  })}
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
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px', background: '#F8F4EE', color: '#6B5C3E' }}>
                <p style={{ fontSize: '18px', marginBottom: '12px' }}>
                  {search ? 'לא נמצאו תוצאות עבור "' + search + '"' : 'לא נמצאו מוצרים בקטגוריה זו'}
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
