import ProductCard from '../components/ProductCard'
import Sidebar from './Sidebar'

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

  const all = await getAllProducts()
  const categoryTree = await getCategoryTree()

  const allWithIndex = all.map(function(p, i) { return Object.assign({}, p, { index: i }) })

  var filtered = allWithIndex
  if (category) {
    filtered = filtered.filter(function(p) {
      return p.category === category ||
        p.parent_category === category ||
        p.child_category === category ||
        (p.categories && p.categories.indexOf(category) !== -1)
    })
  }
  if (search) {
    var q = search.toLowerCase()
    filtered = filtered.filter(function(p) {
      return (p.name && p.name.toLowerCase().indexOf(q) !== -1) ||
        (p.sku && p.sku.toLowerCase().indexOf(q) !== -1) ||
        (p.description && p.description.toLowerCase().indexOf(q) !== -1)
    })
  }

  var perPage = 20
  var start = (page - 1) * perPage
  var products = filtered.slice(start, start + perPage)
  var hasMore = start + perPage < filtered.length

  var title = category || 'כל הספרים'
  var subtitle = search
    ? 'תוצאות חיפוש עבור "' + search + '" — ' + filtered.length + ' מוצרים'
    : filtered.length + ' ספרים'

  var prevHref = '/products?page=' + (page - 1) + (category ? '&category=' + encodeURIComponent(category) : '') + (search ? '&search=' + encodeURIComponent(search) : '')
  var nextHref = '/products?page=' + (page + 1) + (category ? '&category=' + encodeURIComponent(category) : '') + (search ? '&search=' + encodeURIComponent(search) : '')

  return (
    <div style={{ padding: '48px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{ fontFamily: 'serif', fontSize: '40px', fontWeight: '900', marginBottom: '8px' }}>{title}</h1>
        <p style={{ color: '#6B5C3E', marginBottom: '40px' }}>{subtitle}</p>
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
                    <a href={prevHref} style={{ background: 'transparent', color: '#C9A84C', border: '1.5px solid #C9A84C', padding: '10px 24px', textDecoration: 'none', fontSize: '14px' }}>
                      ← הקודם
                    </a>
                  )}
                  {hasMore && (
                    <a href={nextHref} style={{ background: '#C9A84C', color: '#1A2332', padding: '10px 24px', textDecoration: 'none', fontSize: '14px' }}>
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
