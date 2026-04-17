'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useCart } from './CartContext'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { totalItems } = useCart()
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [categoryTree, setCategoryTree] = useState([])
  const [activeParent, setActiveParent] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const searchRef = useRef(null)
  const catRef = useRef(null)
  const leaveTimer = useRef(null)
  const scrollTimer = useRef(null)
  const catBarRef = useRef(null)
  const isHoveringMenu = useRef(false)

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/hatbaot2554-hue/masoret-automation/refs/heads/main/products.json')
      .then(r => r.json())
      .then(data => setAllProducts(data.map((p, i) => ({ ...p, index: i }))))
      .catch(() => {})

    fetch('https://raw.githubusercontent.com/hatbaot2554-hue/masoret-automation/refs/heads/main/categories.json')
      .then(r => r.json())
      .then(data => setCategoryTree(data))
      .catch(() => {})

    function checkMobile() {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return function() { window.removeEventListener('resize', checkMobile) }
  }, [])

  useEffect(() => {
    if (categoryTree.length === 0) return
    scrollTimer.current = setInterval(function() {
      if (catBarRef.current && !isHoveringMenu.current) {
        var bar = catBarRef.current
        var itemWidth = 140
        bar.scrollLeft = bar.scrollLeft - itemWidth
        if (bar.scrollLeft <= 0) {
          bar.scrollLeft = bar.scrollWidth
        }
      }
    }, 2000)
    return function() { clearInterval(scrollTimer.current) }
  }, [categoryTree])

  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false)
      if (catRef.current && !catRef.current.contains(e.target)) setActiveParent(null)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (!search.trim() || search.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    const q = search.toLowerCase()
    const results = allProducts.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    ).slice(0, 8)
    setSuggestions(results)
    setShowSuggestions(true)
  }, [search, allProducts])

  function highlight(text, query) {
    if (!text || !query) return text
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <mark key={i} style={{ background: '#C9A84C', color: '#1A2332', padding: '0 1px', borderRadius: '2px' }}>{part}</mark>
        : part
    )
  }

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) {
      setShowSuggestions(false)
      router.push('/products?search=' + encodeURIComponent(search.trim()))
    }
  }

  function handleSelect(product) {
    setShowSuggestions(false)
    setSearch('')
    router.push('/products/' + product.index)
  }

  function handleMenuEnter(parentName) {
    isHoveringMenu.current = true
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
    setActiveParent(parentName)
  }

  function handleMenuLeave() {
    isHoveringMenu.current = false
    leaveTimer.current = setTimeout(function() {
      setActiveParent(null)
    }, 200)
  }

  // מובייל — תפריט המבורגר
  if (isMobile) {
    return (
      <header style={{ background: 'var(--navy)', borderBottom: '2px solid var(--gold)' }}>
        <div style={{ background: 'var(--gold)', color: 'var(--navy)', textAlign: 'center', fontSize: '12px', fontWeight: '500', padding: '5px' }}>
          משלוח חינם מעל ₪200 | א׳-ה׳ 9:00-15:00
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: '24px', cursor: 'pointer' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
          <a href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'serif', fontSize: '18px', fontWeight: '900', color: 'var(--gold)' }}>המרכז למסורת יהודית</span>
          </a>
          <a href="/cart" style={{ color: 'var(--gold)', textDecoration: 'none', fontSize: '20px', position: 'relative' }}>
            🛒
            {totalItems > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#c0392b', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                {totalItems}
              </span>
            )}
          </a>
        </div>
        <div style={{ padding: '0 16px 8px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex' }}>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder='חיפוש...'
              style={{ flex: 1, padding: '8px 12px', border: 'none', fontSize: '14px', fontFamily: 'Heebo, sans-serif', outline: 'none', background: 'rgba(255,255,255,0.95)', color: '#2C2416', direction: 'rtl' }} />
            <button type="submit" style={{ background: 'var(--gold)', color: 'var(--navy)', border: 'none', padding: '8px 12px', cursor: 'pointer' }}>🔍</button>
          </form>
        </div>
        {menuOpen && (
          <div style={{ background: '#1A2332', padding: '8px 0', borderTop: '1px solid rgba(201,168,76,0.3)' }}>
            <a href="/products" style={{ display: 'block', padding: '12px 20px', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>כל הספרים</a>
            {categoryTree.map(function(item) {
              return (
                <div key={item.parent}>
                  <a href={'/products?category=' + encodeURIComponent(item.parent)}
                    style={{ display: 'block', padding: '12px 20px', color: 'var(--gold)', textDecoration: 'none', fontSize: '14px', fontWeight: '700', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {item.parent}
                  </a>
                  {item.children && item.children.map(function(child) {
                    return (
                      <a key={child} href={'/products?category=' + encodeURIComponent(child)}
                        style={{ display: 'block', padding: '10px 36px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        {child}
                      </a>
                    )
                  })}
                </div>
              )
            })}
            <a href="/track" style={{ display: 'block', padding: '12px 20px', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>מעקב הזמנה</a>
            <a href="/contact" style={{ display: 'block', padding: '12px 20px', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '15px' }}>צור קשר</a>
          </div>
        )}
      </header>
    )
  }

  // דסקטופ
  return (
    <header style={{ background: 'var(--navy)', borderBottom: '2px solid var(--gold)' }}>
      <div style={{ background: 'var(--gold)', color: 'var(--navy)', textAlign: 'center', fontSize: '13px', fontWeight: '500', padding: '6px' }}>
        משלוח חינם בהזמנה מעל ₪200 | שירות לקוחות: א׳-ה׳ 9:00-15:00
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', gap: '24px', flexWrap: 'wrap' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontFamily: 'serif', fontSize: '26px', fontWeight: '900', color: 'var(--gold)', lineHeight: 1.1 }}>המרכז למסורת יהודית</span>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>ספרי קודש ויהדות • מאז תמיד</span>
          </div>
        </a>

        <div ref={searchRef} style={{ flex: 1, minWidth: '200px', maxWidth: '420px', position: 'relative' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex' }}>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder='חיפוש לפי שם או מק"ט...'
              style={{ flex: 1, padding: '9px 14px', border: 'none', fontSize: '14px', fontFamily: 'Heebo, sans-serif', outline: 'none', background: 'rgba(255,255,255,0.95)', color: '#2C2416', direction: 'rtl', borderRadius: '0' }} />
            <button type="submit" style={{ background: 'var(--gold)', color: 'var(--navy)', border: 'none', padding: '9px 16px', cursor: 'pointer', fontSize: '16px', fontWeight: '700' }}>🔍</button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', right: 0, left: 0, background: '#fff', border: '1px solid #EDE6D9', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 1000, maxHeight: '400px', overflowY: 'auto' }}>
              {suggestions.map(product => (
                <div key={product.index} onClick={() => handleSelect(product)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f0ebe0' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#F8F4EE' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}>
                  <div style={{ width: '44px', height: '44px', flexShrink: 0, background: '#EDE6D9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {product.image ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '20px' }}>📖</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#2C2416', lineHeight: 1.3, direction: 'rtl' }}>{highlight(product.name, search)}</div>
                    {product.sku && <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>מק&quot;ט: {highlight(product.sku, search)}</div>}
                  </div>
                  <div style={{ fontFamily: 'serif', fontSize: '15px', color: '#8B6914', fontWeight: '700', flexShrink: 0 }}>₪{Math.ceil(parseFloat(product.price || 0))}</div>
                </div>
              ))}
              <div onClick={handleSearch}
                style={{ padding: '10px 14px', textAlign: 'center', fontSize: '13px', color: '#8B6914', cursor: 'pointer', fontWeight: '600', background: '#F8F4EE', borderTop: '1px solid #EDE6D9' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#EDE6D9' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F8F4EE' }}>
                לכל התוצאות עבור &quot;{search}&quot; ←
              </div>
            </div>
          )}
        </div>

        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="/products" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '15px' }}>כל הספרים</a>
          <a href="/track" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '15px' }}>מעקב הזמנה</a>
          <a href="/contact" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '15px' }}>צור קשר</a>
          <a href="/cart" style={{ background: 'var(--gold)', color: 'var(--navy)', padding: '10px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🛒
            {totalItems > 0 && (
              <span style={{ background: '#c0392b', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' }}>
                {totalItems}
              </span>
            )}
            עגלה
          </a>
        </nav>
      </div>

      {categoryTree.length > 0 && (
        <div ref={catRef} style={{ background: 'rgba(0,0,0,0.25)', borderTop: '1px solid rgba(201,168,76,0.3)', position: 'relative' }}>
          <div ref={catBarRef}
            style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {categoryTree.map(function(item) {
              var isActive = activeParent === item.parent
              var hasChildren = item.children && item.children.length > 0
              return React.createElement('div', {
                key: item.parent,
                style: { position: 'static', flexShrink: 0 },
                onMouseEnter: function() { handleMenuEnter(item.parent) },
                onMouseLeave: handleMenuLeave
              },
                React.createElement('a', {
                  href: '/products?category=' + encodeURIComponent(item.parent),
                  style: { display: 'block', padding: '12px 16px', color: isActive ? 'var(--gold)' : 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '14px', fontWeight: '500', borderBottom: isActive ? '2px solid var(--gold)' : '2px solid transparent', whiteSpace: 'nowrap' }
                }, item.parent, hasChildren ? ' ▾' : ''),
                isActive && hasChildren ? React.createElement('div', {
                  style: { position: 'fixed', background: '#fff', border: '1px solid #EDE6D9', boxShadow: '0 6px 20px rgba(0,0,0,0.15)', zIndex: 9999, minWidth: '200px' },
                  onMouseEnter: function() { handleMenuEnter(item.parent) },
                  onMouseLeave: handleMenuLeave
                },
                  item.children.map(function(child) {
                    return React.createElement('a', {
                      key: child,
                      href: '/products?category=' + encodeURIComponent(child),
                      style: { display: 'block', padding: '10px 18px', color: '#2C2416', textDecoration: 'none', fontSize: '14px', borderBottom: '1px solid #f0ebe0' },
                      onMouseEnter: function(e) { e.currentTarget.style.background = '#F8F4EE'; e.currentTarget.style.color = '#8B6914' },
                      onMouseLeave: function(e) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#2C2416' }
                    }, child)
                  })
                ) : null
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}
