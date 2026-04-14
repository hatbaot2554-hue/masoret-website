'use client'
import { useState, useEffect, useRef } from 'react'
import { useCart } from './CartContext'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { totalItems } = useCart()
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const wrapperRef = useRef(null)

  // טעינת מוצרים פעם אחת
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/hatbaot2554-hue/masoret-automation/refs/heads/main/products.json')
      .then(r => r.json())
      .then(data => setAllProducts(data.map((p, i) => ({ ...p, index: i }))))
      .catch(() => {})
  }, [])

  // סגירה בלחיצה מחוץ
  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // חיפוש חי
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
      router.push(`/products?search=${encodeURIComponent(search.trim())}`)
    }
  }

  function handleSelect(product) {
    setShowSuggestions(false)
    setSearch('')
    router.push(`/products/${product.index}`)
  }

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

        {/* שורת חיפוש עם הצעות */}
        <div ref={wrapperRef} style={{ flex: 1, minWidth: '200px', maxWidth: '420px', position: 'relative' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex' }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder='חיפוש לפי שם או מק"ט...'
              style={{
                flex: 1, padding: '9px 14px', border: 'none',
                fontSize: '14px', fontFamily: 'Heebo, sans-serif',
                outline: 'none', background: 'rgba(255,255,255,0.95)',
                color: '#2C2416', direction: 'rtl', borderRadius: '0'
              }}
            />
            <button type="submit" style={{
              background: 'var(--gold)', color: 'var(--navy)', border: 'none',
              padding: '9px 16px', cursor: 'pointer', fontSize: '16px', fontWeight: '700'
            }}>🔍</button>
          </form>

          {/* רשימת הצעות */}
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, left: 0,
              background: '#fff', border: '1px solid #EDE6D9',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 1000,
              maxHeight: '400px', overflowY: 'auto'
            }}>
              {suggestions.map(product => (
                <div
                  key={product.index}
                  onClick={() => handleSelect(product)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f0ebe0',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8F4EE'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  {/* תמונה */}
                  <div style={{ width: '44px', height: '44px', flexShrink: 0, background: '#EDE6D9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {product.image
                      ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '20px' }}>📖</span>
                    }
                  </div>

                  {/* פרטים */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#2C2416', lineHeight: 1.3, direction: 'rtl' }}>
                      {highlight(product.name, search)}
                    </div>
                    {product.sku && (
                      <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                        מק"ט: {highlight(product.sku, search)}
                      </div>
                    )}
                  </div>

                  {/* מחיר */}
                  <div style={{ fontFamily: 'serif', fontSize: '15px', color: '#8B6914', fontWeight: '700', flexShrink: 0 }}>
                    ₪{Math.ceil(parseFloat(product.price || 0))}
                  </div>
                </div>
              ))}

              {/* כפתור לכל התוצאות */}
              <div
                onClick={handleSearch}
                style={{
                  padding: '10px 14px', textAlign: 'center', fontSize: '13px',
                  color: '#8B6914', cursor: 'pointer', fontWeight: '600',
                  background: '#F8F4EE', borderTop: '1px solid #EDE6D9'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#EDE6D9'}
                onMouseLeave={e => e.currentTarget.style.background = '#F8F4EE'}
              >
                לכל התוצאות עבור "{search}" ←
              </div>
            </div>
          )}
        </div>

        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="/products" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '15px' }}>כל הספרים</a>
          <a href="/track" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '15px' }}>מעקב הזמנה</a>
          <a href="/contact" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '15px' }}>צור קשר</a>
          <a href="/cart" style={{
            background: 'var(--gold)', color: 'var(--navy)', padding: '10px 20px',
            textDecoration: 'none', fontSize: '14px', fontWeight: '700',
            display: 'flex', alignItems: 'center', gap: '6px', position: 'relative'
          }}>
            🛒
            {totalItems > 0 && (
              <span style={{
                background: '#c0392b', color: '#fff', borderRadius: '50%',
                width: '20px', height: '20px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '11px', fontWeight: '700'
              }}>{totalItems}</span>
            )}
            עגלה
          </a>
        </nav>
      </div>
    </header>
  )
}
