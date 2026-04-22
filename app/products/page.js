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

function buildPageHref(page, category, search) {
  let href = '/products?page=' + page
  if (category) href += '&category=' + encodeURIComponent(category)
  if (search) href += '&search=' + encodeURIComponent(search)
  return href
}

function Pagination({ page, totalPages, category, search }) {
  if (totalPages <= 1) return null

  const pages = []

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i)
    }
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  const btnBase = {
    minWidth: '40px', height: '40px', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center',
    border: '1.5px solid #EDE6D9', fontSize: '14px',
    fontFamily: 'Heebo, sans-serif', textDecoration: 'none',
    cursor: 'pointer', transition: 'all 0.15s', padding: '0 8px',
  }

  return (
    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginTop: '48px' }}>

      {page > 1 ? (
        <a href={buildPageHref(page - 1, category, search)}
          style={{ ...btnBase, background: 'transparent', color: '#C9A84C', borderColor: '#C9A84C' }}>
          → הקודם
        </a>
      ) : (
        <span style={{ ...btnBase, background: '#F8F4EE', color: '#CCC', borderColor: '#EDE6D9', cursor: 'default' }}>
          → הקודם
        </span>
      )}

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={'dots-' + i} style={{ ...btnBase, border: 'none', color: '#6B5C3E', cursor: 'default' }}>•••</span>
        ) : (
          <a key={p} href={buildPageHref(p, category, search)}
            style={{
              ...btnBase,
              background: p === page ? '#C9A84C' : '#fff',
              color: p === page ? '#1A2332' : '#2C2416',
              borderColor: p === page ? '#C9A84C' : '#EDE6D9',
              fontWeight: p === page ? '700' : '400',
            }}>
            {p}
          </a>
        )
      )}

      {page < totalPages ? (
        <a href={buildPageHref(page + 1, category, search)}
          style={{ ...btnBase, background: 'transparent', color: '#C9A84C', borderColor: '#C9A84C' }}>
          הבא ←
        </a>
      ) : (
        <span style={{ ...btnBase, background: '#F8F4EE', color: '#CCC', borderColor: '#EDE6D9', cursor: 'default' }}>
          הבא ←
        </span>
      )}

    </div>
  )
}

export default async function ProductsPage({ searchParams }) {
  const page = parseInt(searchParams?.page || '1')
  const category = searchParams?.category || ''
  const search = searchParams?.search || ''

  const all = await getAllProducts()
  const categoryTree = await getCategoryTree()

  const allWithIndex = all.map((p, i) => ({ ...p, index: i }))

  // סינון מוצרים — כולל חסרי מלאי (מוצגים בדף מוצר, רק נסתרים מהרשת הראשית)
  let filtered = allWithIndex.filter(p => p.in_stock !== false)

  if (category) {
    const parentItem = categoryTree.find(item => item.parent === category)
    if (parentItem && parentItem.children && parentItem.children.length > 0) {
      const allChildren = parentItem.children
      filtered = filtered.filter(p =>
        allChildren.includes(p.category) ||
        allChildren.includes(p.parent_category) ||
        allChildren.includes(p.child_category) ||
        (p.categories && p.categories.some(c => allChildren.includes(c))) ||
        p.category === category ||
        p.parent_category === category
      )
    } else {
      filtered = filtered.filter(p =>
        p.category === category ||
        p.parent_category === category ||
        p.child_category === category ||
        (p.categories && p.categories.includes(category))
      )
    }
  }

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(p =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    )
  }

  const perPage = 20
  const totalPages = Math.ceil(filtered.length / perPage)
  const start = (page - 1) * perPage
  const products = filtered.slice(start, start + perPage)

  const title = category || 'כל הספרים'
  const subtitle = search
    ? 'תוצאות חיפוש עבור "' + search + '" — ' + filtered.length + ' מוצרים'
    : category ? filtered.length + ' ספרים' : 'מבחר של למעלה מ-5,000 ספרי קודש ויהדות'

  return (
    <div style={{ padding: '48px 0' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 32px' }}>
        <h1 style={{ fontFamily: 'serif', fontSize: '40px', fontWeight: '900', marginBottom: '8px' }}>{title}</h1>
        <p style={{ color: '#6B5C3E', marginBottom: '40px' }}>{subtitle}</p>

        {products.length > 0 ? (
          <div>
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.index} product={product} index={product.index} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} category={category} search={search} />
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
  )
}
