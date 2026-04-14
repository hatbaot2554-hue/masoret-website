'use client'
import { useState } from 'react'
import { useCart } from './CartContext'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { totalItems } = useCart()
  const [search, setSearch] = useState('')
  const router = useRouter()

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`)
    }
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

        {/* שורת חיפוש */}
        <form onSubmit={handleSearch} style={{ flex: 1, minWidth: '200px', maxWidth: '400px', display: 'flex', gap: '0' }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='חיפוש לפי שם או מק"ט...'
            style={{
              flex: 1, padding: '9px 14px', border: 'none', borderRadius: '0',
              fontSize: '14px', fontFamily: 'Heebo, sans-serif', outline: 'none',
              background: 'rgba(255,255,255,0.95)', color: '#2C2416', direction: 'rtl'
            }}
          />
          <button type="submit" style={{
            background: 'var(--gold)', color: 'var(--navy)', border: 'none',
            padding: '9px 16px', cursor: 'pointer', fontSize: '16px', fontWeight: '700'
          }}>🔍</button>
        </form>

        <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="/products" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '15px' }}>כל הספרים</a>
          <a href="/track" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '15px' }}>מעקב הזמנה</a>
          <a href="/contact" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '15px' }}>צור קשר</a>
          <a href="/cart" style={{ background: 'var(--gold)', color: 'var(--navy)', padding: '10px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '700', position: 'relative', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
