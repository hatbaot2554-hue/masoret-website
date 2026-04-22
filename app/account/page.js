'use client'
import { useState, useEffect } from 'react'

export default function AccountPage() {
  const [step, setStep] = useState('login')
  const [email, setEmail] = useState('')
  const [token, setToken] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('masoret_token')
    if (saved) {
      try {
        const data = JSON.parse(atob(saved))
        if (data.exp > Date.now()) {
          setToken(saved)
          setEmail(data.email)
          setStep('account')
          loadOrders(data.email)
        } else {
          localStorage.removeItem('masoret_token')
        }
      } catch {}
    }
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      localStorage.setItem('masoret_token', data.token)
      setToken(data.token)
      setStep('account')
      loadOrders(email)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadOrders(userEmail) {
    try {
      const res = await fetch('/api/orders?email=' + encodeURIComponent(userEmail))
      const data = await res.json()
      if (res.ok) setOrders(data.orders || [])
    } catch {}
  }

  function handleLogout() {
    localStorage.removeItem('masoret_token')
    setToken(null)
    setStep('login')
    setOrders([])
    setEmail('')
  }

  const statusColors = {
    'ממתין': '#f39c12', 'אושר': '#27ae60', 'נשלח': '#2980b9',
    'הושלם': '#27ae60', 'בוטל': '#e74c3c'
  }

  const inputStyle = { width: '100%', padding: '11px 14px', border: '1px solid #EDE6D9', background: '#fff', fontSize: '15px', fontFamily: 'Heebo, sans-serif', color: '#2C2416', outline: 'none' }

  if (step === 'login') {
    return (
      <div style={{ maxWidth: '480px', margin: '80px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👤</div>
          <h1 style={{ fontFamily: 'serif', fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>האזור האישי שלך</h1>
          <p style={{ color: '#6B5C3E' }}>הכנס את המייל שלך כדי לצפות בהזמנות</p>
        </div>
        <div style={{ background: '#fff', border: '1px solid #EDE6D9', padding: '32px' }}>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', color: '#6B5C3E', display: 'block', marginBottom: '6px', fontWeight: '600' }}>כתובת מייל</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} placeholder="your@email.com" />
            </div>
            {error && <p style={{ color: '#e74c3c', fontSize: '14px', marginBottom: '12px' }}>{error}</p>}
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '14px', background: '#C9A84C', color: '#1A2332', border: 'none', fontSize: '16px', fontFamily: 'serif', fontWeight: '700', cursor: 'pointer' }}>
              {loading ? 'מתחבר...' : 'כניסה לאזור האישי'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '900px', margin: '48px auto', padding: '0 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'serif', fontSize: '32px', fontWeight: '900', marginBottom: '4px' }}>שלום 👋</h1>
          <p style={{ color: '#6B5C3E' }}>{email}</p>
        </div>
        <button onClick={handleLogout}
          style={{ background: 'none', border: '1px solid #EDE6D9', padding: '8px 16px', cursor: 'pointer', fontSize: '14px', color: '#6B5C3E' }}>
          התנתק
        </button>
      </div>

      <h2 style={{ fontFamily: 'serif', fontSize: '24px', marginBottom: '20px' }}>ההזמנות שלי</h2>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#F8F4EE', color: '#6B5C3E' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <p style={{ fontSize: '18px', marginBottom: '8px' }}>עדיין אין הזמנות</p>
          <a href="/products" style={{ color: '#8B6914', textDecoration: 'none', fontWeight: '600' }}>לחנות →</a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(order => (
            <div key={order.id} style={{ background: '#fff', border: '1px solid #EDE6D9', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ fontFamily: 'serif', fontSize: '20px', fontWeight: '700', color: '#8B6914' }}>#{order.our_order_id}</div>
                  <div style={{ fontSize: '13px', color: '#999', marginTop: '2px' }}>{new Date(order.created_at).toLocaleDateString('he-IL')}</div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ background: statusColors[order.status] || '#999', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                    {order.status || 'ממתין'}
                  </span>
                  <span style={{ fontFamily: 'serif', fontSize: '18px', fontWeight: '700', color: '#2C2416' }}>₪{order.total_price}</span>
                </div>
              </div>
              {order.items && order.items.length > 0 && (
                <div style={{ borderTop: '1px solid #EDE6D9', paddingTop: '12px' }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#2C2416', marginBottom: '4px' }}>
                      <span>{item.name} × {item.quantity}</span>
                      <span style={{ color: '#8B6914' }}>₪{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
