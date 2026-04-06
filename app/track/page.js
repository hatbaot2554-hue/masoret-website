'use client'

import { useState } from 'react'

const STEPS = [
  { key: 'processing',   label: 'בטיפול',         icon: '📋' },
  { key: 'shipped',      label: 'נשלח',            icon: '📦' },
  { key: 'in-transit',   label: 'בדרך',            icon: '🚚' },
  { key: 'delivered',    label: 'הגיע',            icon: '✅' },
]

const STEP_ORDER = ['processing', 'shipped', 'in-transit', 'out-for-delivery', 'delivered', 'completed']

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrder(null)

    try {
      const res = await fetch(`/api/track?order=${orderNumber}&email=${encodeURIComponent(email)}`)
      const data = await res.json()

      if (!res.ok || !data.order) {
        throw new Error('הזמנה לא נמצאה — בדוק את המספר והמייל')
      }

      setOrder(data.order)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function getStepIndex(status) {
    const clean = status?.replace('wc-', '') || ''
    const idx = STEP_ORDER.indexOf(clean)
    return idx === -1 ? 0 : idx
  }

  return (
    <div style={{ padding: '56px 0', minHeight: '60vh' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <h1 style={{
          fontFamily: 'Frank Ruhl Libre, serif',
          fontSize: '36px',
          fontWeight: '900',
          marginBottom: '8px',
        }}>
          מעקב הזמנה
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>
          הזן את מספר ההזמנה שלך ואת כתובת המייל לאיתור ההזמנה
        </p>

        {/* טופס חיפוש */}
        <form onSubmit={handleSearch} style={{ marginBottom: '40px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              מספר הזמנה
            </label>
            <input
              value={orderNumber}
              onChange={e => setOrderNumber(e.target.value)}
              placeholder="למשל: 847291"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid var(--cream-dark)',
                fontSize: '16px',
                fontFamily: 'Heebo, sans-serif',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              כתובת מייל
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="israel@example.com"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid var(--cream-dark)',
                fontSize: '16px',
                fontFamily: 'Heebo, sans-serif',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', fontSize: '16px', padding: '14px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '🔍 מחפש...' : 'חפש הזמנה'}
          </button>
        </form>

        {/* שגיאה */}
        {error && (
          <div className="alert-error" style={{ marginBottom: '24px' }}>
            ❌ {error}
          </div>
        )}

        {/* תוצאה */}
        {order && (
          <div style={{
            background: 'var(--white)',
            border: '1px solid var(--cream-dark)',
            padding: '28px',
          }}>
            {/* כותרת */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '24px',
              paddingBottom: '20px',
              borderBottom: '1px solid var(--cream-dark)',
            }}>
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>מספר הזמנה</p>
                <p style={{ fontSize: '22px', fontWeight: '700', fontFamily: 'Frank Ruhl Libre, serif' }}>
                  #{order.our_order_id}
                </p>
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>תאריך הזמנה</p>
                <p style={{ fontSize: '15px', fontWeight: '500' }}>{order.date}</p>
              </div>
            </div>

            {/* סטטוס נוכחי */}
            <div style={{
              background: order.status_color || '#1a6bbf',
              color: '#fff',
              padding: '14px 20px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <span style={{ fontSize: '20px' }}>
                {STEPS.find(s => order.status_he?.includes(s.label))?.icon || '📋'}
              </span>
              <div>
                <p style={{ fontSize: '12px', opacity: 0.85, marginBottom: '2px' }}>סטטוס נוכחי</p>
                <p style={{ fontSize: '18px', fontWeight: '700' }}>{order.status_he}</p>
              </div>
              <div style={{ marginRight: 'auto', fontSize: '12px', opacity: 0.75 }}>
                עודכן: {order.last_updated
                  ? new Date(order.last_updated).toLocaleString('he-IL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
                  : '—'}
              </div>
            </div>

            {/* שלבי התקדמות */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                {/* קו רקע */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  left: '20px',
                  height: '2px',
                  background: 'var(--cream-dark)',
                  zIndex: 0,
                }} />

                {STEPS.map((step, i) => {
                  const currentIdx = getStepIndex(order.raw_status)
                  const stepIdx = STEP_ORDER.indexOf(step.key)
                  const done = currentIdx >= stepIdx
                  const active = currentIdx === stepIdx

                  return (
                    <div key={step.key} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      position: 'relative',
                      zIndex: 1,
                      flex: 1,
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: done ? (order.status_color || '#1a6bbf') : 'var(--cream-dark)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        border: active ? `3px solid ${order.status_color || '#1a6bbf'}` : 'none',
                        transition: 'all 0.3s',
                      }}>
                        {done ? step.icon : '○'}
                      </div>
                      <span style={{
                        fontSize: '12px',
                        color: done ? 'var(--text)' : 'var(--text-muted)',
                        fontWeight: done ? '600' : '400',
                        textAlign: 'center',
                      }}>
                        {step.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* היסטוריה */}
            {order.history?.length > 0 && (
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '12px' }}>היסטוריית הזמנה</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[...order.history].reverse().map((h, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: i === 0 ? 'var(--cream-dark)' : 'transparent',
                      border: '1px solid var(--cream-dark)',
                      fontSize: '14px',
                    }}>
                      <span style={{ fontWeight: i === 0 ? '600' : '400' }}>{h.status}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{h.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* פרטי קשר */}
            <div style={{
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid var(--cream-dark)',
              fontSize: '13px',
              color: 'var(--text-muted)',
              textAlign: 'center',
            }}>
              שאלות? צור קשר:{' '}
              <a href="tel:077-323-4049" style={{ color: 'var(--gold-dark)', fontWeight: '600' }}>
                077-323-4049
              </a>
              {' '}א׳-ה׳ 9:00-15:00
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
