'use client'
import { useState, useEffect } from 'react'

function formatPrice(price) {
  const p = parseFloat(price || 0)
  if (p < 10) return Math.ceil(p * 2) / 2
  return Math.ceil(p)
}

export default function RecentlyViewed({ currentIndex }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    try {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
      setItems(viewed.filter(p => p.index !== currentIndex).slice(0, 5))
    } catch {}
  }, [currentIndex])

  if (!items.length) return null

  return (
    <div style={{ borderTop: '1px solid #EDE6D9', paddingTop: '40px', marginTop: '40px' }}>
      <h3 style={{ fontFamily: 'Frank Ruhl Libre, serif', fontSize: '22px', fontWeight: '900', marginBottom: '20px' }}>
        צפית לאחרונה
      </h3>
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
        {items.map((item, i) => (
          <a key={i} href={`/products/${item.index}`} style={{ textDecoration: 'none', color: 'inherit', flexShrink: 0, width: '140px' }}>
            <div style={{ background: '#EDE6D9', width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '8px', borderRadius: '4px' }}>
              {item.image
                ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '40px' }}>📖</span>}
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#2C2416', lineHeight: 1.4, marginBottom: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {item.name}
            </div>
            <div style={{ fontSize: '14px', color: '#8B6914', fontWeight: '700' }}>₪{formatPrice(item.price)}</div>
          </a>
        ))}
      </div>
    </div>
  )
}
