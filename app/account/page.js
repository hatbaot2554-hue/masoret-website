'use client'
import { useMemo, useState, useEffect } from 'react'

function firstNameOf(name) {
  return String(name || '').trim().split(/\s+/)[0] || 'לקוח'
}

function normalizeName(name) {
  return String(name || '').trim().replace(/\s+/g, ' ')
}

function orderItems(order) {
  if (Array.isArray(order.items)) return order.items
  try {
    return JSON.parse(order.items || '[]')
  } catch {
    return []
  }
}

export default function AccountPage() {
  const [step, setStep] = useState('login')
  const [identifier, setIdentifier] = useState('')
  const [token, setToken] = useState(null)
  const [orders, setOrders] = useState([])
  const [selectedName, setSelectedName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('masoret_token')
    if (!saved) return
    try {
      const data = JSON.parse(atob(saved))
      const savedIdentifier = data.identifier || data.email || ''
      if (data.exp > Date.now() && savedIdentifier) {
        setToken(saved)
        setIdentifier(savedIdentifier)
        setStep('account')
        loadOrders(savedIdentifier)
      } else {
        localStorage.removeItem('masoret_token')
      }
    } catch {}
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    const clean = identifier.trim()
    if (!clean) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: clean })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      localStorage.setItem('masoret_token', data.token)
      setToken(data.token)
      setStep('account')
      await loadOrders(clean)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadOrders(value) {
    try {
      const res = await fetch('/api/orders?account=' + encodeURIComponent(value), { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'לא נמצאו הזמנות')
      const nextOrders = data.orders || []
      setOrders(nextOrders)
      const names = Array.from(new Set(nextOrders.map((order) => normalizeName(order.customer_name)).filter(Boolean)))
      setSelectedName(names.length === 1 ? names[0] : '')
    } catch (err) {
      setOrders([])
      setSelectedName('')
      setError(err.message || 'לא ניתן לטעון הזמנות כרגע')
    }
  }

  function handleLogout() {
    localStorage.removeItem('masoret_token')
    setToken(null)
    setStep('login')
    setOrders([])
    setSelectedName('')
    setIdentifier('')
  }

  const customerNames = useMemo(
    () => Array.from(new Set(orders.map((order) => normalizeName(order.customer_name)).filter(Boolean))),
    [orders]
  )

  const visibleOrders = useMemo(() => {
    if (!selectedName) return orders
    return orders.filter((order) => normalizeName(order.customer_name) === selectedName)
  }, [orders, selectedName])

  const greetingName = selectedName || customerNames[0] || ''

  const statusColors = {
    'הזמנה בתהליך': '#f39c12',
    'הזמנה בעיבוד': '#8B6914',
    'בטיפול': '#f39c12',
    'נשלח': '#2980b9',
    'הושלם': '#27ae60',
    'נמסר': '#27ae60',
    'בוטל': '#e74c3c',
  }

  const inputStyle = { width: '100%', padding: '11px 14px', border: '1px solid #EDE6D9', background: '#fff', fontSize: '15px', fontFamily: 'Heebo, sans-serif', color: '#2C2416', outline: 'none' }

  if (step === 'login') {
    return (
      <div style={{ maxWidth: '480px', margin: '80px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'serif', fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>האזור האישי שלך</h1>
          <p style={{ color: '#6B5C3E' }}>הכנס מייל או מספר טלפון כדי לצפות בכל ההזמנות שלך</p>
        </div>
        <div style={{ background: '#fff', border: '1px solid #EDE6D9', padding: '32px' }}>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', color: '#6B5C3E', display: 'block', marginBottom: '6px', fontWeight: '600' }}>מייל או טלפון</label>
              <input value={identifier} onChange={e => setIdentifier(e.target.value)} required style={inputStyle} placeholder="your@email.com / 0500000000" />
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'serif', fontSize: '32px', fontWeight: '900', marginBottom: '4px' }}>
            שלום {firstNameOf(greetingName)}
          </h1>
          <p style={{ color: '#6B5C3E' }}>כל ההזמנות שנמצאו לפי הפרטים שהזנת</p>
        </div>
        <button onClick={handleLogout}
          style={{ background: 'none', border: '1px solid #EDE6D9', padding: '8px 16px', cursor: 'pointer', fontSize: '14px', color: '#6B5C3E' }}>
          התנתק
        </button>
      </div>

      {customerNames.length > 1 && (
        <div style={{ background: '#F8F4EE', border: '1px solid #EDE6D9', padding: '18px', marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>מצאתי כמה שמות על הפרטים האלה. למי להיכנס?</label>
          <select value={selectedName} onChange={(e) => setSelectedName(e.target.value)} style={inputStyle}>
            <option value="">כל השמות</option>
            {customerNames.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
      )}

      <h2 style={{ fontFamily: 'serif', fontSize: '24px', marginBottom: '20px' }}>ההזמנות שלי</h2>

      {visibleOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#F8F4EE', color: '#6B5C3E' }}>
          <p style={{ fontSize: '18px', marginBottom: '8px' }}>לא נמצאו הזמנות לפרטים האלה</p>
          <a href="/products" style={{ color: '#8B6914', textDecoration: 'none', fontWeight: '600' }}>לחנות</a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {visibleOrders.map(order => {
            const items = orderItems(order)
            const status = order.status_he || order.customer_status || order.status || 'הזמנה בתהליך'
            return (
              <div key={order.id} style={{ background: '#fff', border: '1px solid #EDE6D9', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ fontFamily: 'serif', fontSize: '20px', fontWeight: '700', color: '#8B6914' }}>#{order.our_order_id}</div>
                    <div style={{ fontSize: '13px', color: '#999', marginTop: '2px' }}>{new Date(order.created_at).toLocaleDateString('he-IL')}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ background: statusColors[status] || '#8B6914', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
                      {status}
                    </span>
                    <span style={{ fontFamily: 'serif', fontSize: '18px', fontWeight: '700', color: '#2C2416' }}>₪{order.total_price}</span>
                  </div>
                </div>
                {items.length > 0 && (
                  <div style={{ borderTop: '1px solid #EDE6D9', paddingTop: '12px' }}>
                    {items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#2C2416', marginBottom: '4px', gap: '12px' }}>
                        <span>{item.name} × {item.quantity || 1}</span>
                        <span style={{ color: '#8B6914' }}>₪{Number(item.price || 0) * Number(item.quantity || 1)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
