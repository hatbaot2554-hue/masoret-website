'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function TrackContent() {
  const searchParams = useSearchParams()
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '')
  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (searchParams.get('order') && searchParams.get('email')) {
      handleSearch(null, searchParams.get('order'), searchParams.get('email'))
    }
  }, [])

  async function handleSearch(e, preOrder, preEmail) {
    if (e) e.preventDefault()
    const orderNum = preOrder || orderNumber
    const emailVal = preEmail || email
    if (!orderNum || !emailVal) return

    setLoading(true)
    setError('')
    setOrder(null)
    setSearched(true)

    try {
      const res = await fetch(`/api/orders?order=${orderNum}&email=${encodeURIComponent(emailVal)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'הזמנה לא נמצאה')
      setOrder(data.order)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '56px 0', minHeight: '60vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{ fontFamily: 'serif', fontSize: '36px', fontWeight: '900', marginBottom: '8px' }}>מעקב הזמנה</h1>
        <p style={{ color: '#6B5C3E', marginBottom: '40px' }}>הזן את מספר ההזמנה וכתובת המייל לאיתור ההזמנה</p>

        <form onSubmit={handleSearch} style={{ marginBottom: '40px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', color: '#6B5C3E', display: 'block', marginBottom: '6px' }}>מספר הזמנה</label>
            <input value={orderNumber} onChange={e => setOrderNumber(e.target.value)}
              placeholder="למשל: 847291" required
              style={{ width: '100%', padding: '12px 14px', border: '1px solid #EDE6D9', fontSize: '16px', fontFamily: 'Heebo, sans-serif', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', color: '#6B5C3E', display: 'block', marginBottom: '6px' }}>כתובת מייל</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="israel@example.com" required
              style={{ width: '100%', padding: '12px 14px', border: '1px solid #EDE6D9', fontSize: '16px', fontFamily: 'Heebo, sans-serif', outline: 'none' }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', background: '#C9A84C', color: '#1A2332', border: 'none', padding: '14px', fontSize: '16px', fontWeight: '500', cursor: loading ? 'wait' : 'pointer', fontFamily: 'Heebo, sans-serif' }}>
            {loading ? '🔍 מחפש...' : 'חפש הזמנה'}
          </button>
        </form>

        {error && (
          <div style={{ background: '#fff5f5', border: '1px solid #ef5350', color: '#b71c1c', padding: '16px 20px', marginBottom: '24px' }}>
            ❌ {error}
          </div>
        )}

        {order && (
          <div style={{ background: '#fff', border: '1px solid #EDE6D9', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #EDE6D9' }}>
              <div>
                <p style={{ fontSize: '13px', color: '#6B5C3E', marginBottom: '4px' }}>מספר הזמנה</p>
                <p style={{ fontSize: '22px', fontWeight: '700', fontFamily: 'serif' }}>#{order.our_order_id}</p>
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '13px', color: '#6B5C3E', marginBottom: '4px' }}>תאריך</p>
                <p style={{ fontSize: '15px', fontWeight: '500' }}>{order.date}</p>
              </div>
            </div>
            <div style={{ background: '#1a6bbf', color: '#fff', padding: '14px 20px', marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', opacity: 0.85, marginBottom: '2px' }}>סטטוס נוכחי</p>
              <p style={{ fontSize: '18px', fontWeight: '700' }}>{order.status_he || 'בטיפול'}</p>
            </div>
            <div style={{ fontSize: '14px', color: '#6B5C3E', textAlign: 'center' }}>
              לשאלות ניתן לפנות לצ'אט שירות הלקוחות שלנו
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div style={{ padding: '80px', textAlign: 'center' }}>טוען...</div>}>
      <TrackContent />
    </Suspense>
  )
}
