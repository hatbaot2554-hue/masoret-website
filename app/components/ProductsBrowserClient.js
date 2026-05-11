'use client'

import { useMemo, useState } from 'react'
import ProductCard from './ProductCard'

function matchesProduct(product, query) {
  const q = String(query || '').trim().toLowerCase()
  if (!q) return true
  const fields = [
    product.name,
    product.sku,
    product.description,
    product.full_description,
    product.category,
    product.parent_category,
    product.child_category,
    ...(product.categories || []),
    ...(product.tags || []),
  ]
  return fields.some((field) => String(field || '').toLowerCase().includes(q))
}

function buildPageHref(page, category, search, sort) {
  let href = '/products?page=' + page
  if (category) href += '&category=' + encodeURIComponent(category)
  if (search) href += '&search=' + encodeURIComponent(search)
  if (sort) href += '&sort=' + sort
  return href
}

function Pagination({ page, totalPages, category, search, sort }) {
  if (totalPages <= 1) return null

  const pages = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  const btnBase = {
    minWidth: '40px',
    height: '40px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1.5px solid #EDE6D9',
    fontSize: '14px',
    fontFamily: 'Heebo, sans-serif',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s',
    padding: '0 8px',
  }

  return (
    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginTop: '48px' }}>
      {page > 1 ? (
        <a href={buildPageHref(page - 1, category, search, sort)} style={{ ...btnBase, background: 'transparent', color: '#C9A84C', borderColor: '#C9A84C' }}>→ הקודם</a>
      ) : (
        <span style={{ ...btnBase, background: '#F8F4EE', color: '#CCC', borderColor: '#EDE6D9', cursor: 'default' }}>→ הקודם</span>
      )}

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={'dots-' + i} style={{ ...btnBase, border: 'none', color: '#6B5C3E', cursor: 'default' }}>...</span>
        ) : (
          <a key={p} href={buildPageHref(p, category, search, sort)}
            style={{ ...btnBase, background: p === page ? '#C9A84C' : '#fff', color: p === page ? '#1A2332' : '#2C2416', borderColor: p === page ? '#C9A84C' : '#EDE6D9', fontWeight: p === page ? '700' : '400' }}>
            {p}
          </a>
        )
      )}

      {page < totalPages ? (
        <a href={buildPageHref(page + 1, category, search, sort)} style={{ ...btnBase, background: 'transparent', color: '#C9A84C', borderColor: '#C9A84C' }}>הבא ←</a>
      ) : (
        <span style={{ ...btnBase, background: '#F8F4EE', color: '#CCC', borderColor: '#EDE6D9', cursor: 'default' }}>הבא ←</span>
      )}
    </div>
  )
}

export default function ProductsBrowserClient({
  products,
  pageProducts,
  page,
  totalPages,
  category,
  search,
  sort,
}) {
  const [liveSearch, setLiveSearch] = useState('')
  const liveProducts = useMemo(
    () => products.filter((product) => matchesProduct(product, liveSearch)),
    [products, liveSearch]
  )
  const activeProducts = liveSearch.trim() ? liveProducts : pageProducts
  const showingLive = liveSearch.trim().length > 0

  return (
    <div>
      <div className="inline-product-search">
        <div>
          <strong>חיפוש בתוך הדף</strong>
          <span>{showingLive ? `${liveProducts.length} מוצרים תואמים` : 'הקלד אות או מילה ותראה מיד את כל המוצרים המתאימים'}</span>
        </div>
        <label>
          <span>חפש</span>
          <input
            value={liveSearch}
            onChange={(event) => setLiveSearch(event.target.value)}
            placeholder="לדוגמה: סידור, עוז והדר, כריכה, מחבר..."
            type="search"
          />
        </label>
      </div>

      {activeProducts.length > 0 ? (
        <div>
          <div className="products-grid">
            {activeProducts.map((product) => (
              <ProductCard key={product.index} product={product} index={product.index} />
            ))}
          </div>
          {!showingLive && <Pagination page={page} totalPages={totalPages} category={category} search={search} sort={sort} />}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px', background: '#F8F4EE', color: '#6B5C3E' }}>
          <p style={{ fontSize: '18px', marginBottom: '12px' }}>
            לא נמצאו מוצרים עבור "{liveSearch}"
          </p>
          <p style={{ fontSize: '14px' }}>נסה מילה קצרה יותר או כתיב אחר.</p>
        </div>
      )}
    </div>
  )
}
