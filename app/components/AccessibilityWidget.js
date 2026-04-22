'use client'
import { useState, useEffect } from 'react'

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false)
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)
  const [grayscale, setGrayscale] = useState(false)
  const [underlineLinks, setUnderlineLinks] = useState(false)
  const [bigCursor, setBigCursor] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    html.style.fontSize = fontSize + '%'
  }, [fontSize])

  useEffect(() => {
    document.body.style.filter = [
      highContrast ? 'contrast(1.5)' : '',
      grayscale ? 'grayscale(1)' : '',
    ].filter(Boolean).join(' ') || ''
  }, [highContrast, grayscale])

  useEffect(() => {
    const style = document.getElementById('a11y-links')
    if (underlineLinks) {
      if (!style) {
        const s = document.createElement('style')
        s.id = 'a11y-links'
        s.textContent = 'a { text-decoration: underline !important; }'
        document.head.appendChild(s)
      }
    } else {
      style?.remove()
    }
  }, [underlineLinks])

  useEffect(() => {
    document.body.style.cursor = bigCursor ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'%3E%3Cpath d=\'M8 0 L8 24 L12 20 L16 28 L19 27 L15 19 L20 19 Z\' fill=\'black\' stroke=\'white\' stroke-width=\'1\'/%3E%3C/svg%3E") 0 0, auto' : ''
  }, [bigCursor])

  function reset() {
    setFontSize(100)
    setHighContrast(false)
    setGrayscale(false)
    setUnderlineLinks(false)
    setBigCursor(false)
  }

  const btnStyle = (active) => ({
    width: '100%', padding: '10px 14px', border: '1px solid',
    borderColor: active ? '#8B6914' : '#EDE6D9',
    background: active ? '#8B6914' : '#fff',
    color: active ? '#fff' : '#2C2416',
    cursor: 'pointer', fontSize: '13px', fontFamily: 'Heebo, sans-serif',
    borderRadius: '4px', textAlign: 'right', display: 'flex',
    alignItems: 'center', gap: '8px', transition: 'all 0.15s',
  })

  return (
    <>
      {/* כפתור נגישות */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="תפריט נגישות"
        style={{
          position: 'fixed', bottom: '80px', left: '16px', zIndex: 99998,
          width: '52px', height: '52px', borderRadius: '50%',
          background: '#1A2332', color: '#C9A84C',
          border: '2px solid #C9A84C', cursor: 'pointer',
          fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}>
        ♿
      </button>

      {/* תפריט */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '144px', left: '16px', zIndex: 99998,
          background: '#fff', border: '1px solid #EDE6D9', borderRadius: '8px',
          padding: '16px', width: '220px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontWeight: '700', fontSize: '14px', color: '#1A2332' }}>נגישות</span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#999' }}>✕</button>
          </div>

          {/* גודל טקסט */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '12px', color: '#6B5C3E', marginBottom: '6px' }}>גודל טקסט</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => setFontSize(f => Math.max(80, f - 10))}
                style={{ flex: 1, padding: '8px', border: '1px solid #EDE6D9', background: '#fff', cursor: 'pointer', fontSize: '16px', borderRadius: '4px' }}>A−</button>
              <button onClick={() => setFontSize(100)}
                style={{ flex: 1, padding: '8px', border: '1px solid #EDE6D9', background: '#F8F4EE', cursor: 'pointer', fontSize: '12px', borderRadius: '4px' }}>{fontSize}%</button>
              <button onClick={() => setFontSize(f => Math.min(140, f + 10))}
                style={{ flex: 1, padding: '8px', border: '1px solid #EDE6D9', background: '#fff', cursor: 'pointer', fontSize: '18px', borderRadius: '4px' }}>A+</button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button onClick={() => setHighContrast(!highContrast)} style={btnStyle(highContrast)}>
              <span>🔆</span> ניגודיות גבוהה
            </button>
            <button onClick={() => setGrayscale(!grayscale)} style={btnStyle(grayscale)}>
              <span>⚫</span> גווני אפור
            </button>
            <button onClick={() => setUnderlineLinks(!underlineLinks)} style={btnStyle(underlineLinks)}>
              <span>🔗</span> הדגשת קישורים
            </button>
            <button onClick={() => setBigCursor(!bigCursor)} style={btnStyle(bigCursor)}>
              <span>🖱️</span> סמן גדול
            </button>
          </div>

          <button onClick={reset} style={{ width: '100%', marginTop: '10px', padding: '8px', background: 'none', border: '1px solid #EDE6D9', cursor: 'pointer', fontSize: '12px', color: '#6B5C3E', borderRadius: '4px' }}>
            איפוס הכל
          </button>
        </div>
      )}
    </>
  )
}
