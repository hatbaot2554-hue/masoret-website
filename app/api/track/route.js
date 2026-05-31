import { NextResponse } from 'next/server'

const DASHBOARD_URL = 'https://masoret-dashboard.vercel.app'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const orderNumber = searchParams.get('order')?.trim()
  const contact = searchParams.get('contact')?.trim() || searchParams.get('email')?.trim()

  if (!orderNumber || !contact) {
    return NextResponse.json({ error: 'חסרים פרטים' }, { status: 400 })
  }

  try {
    const isEmail = contact.includes('@')
    const response = await fetch(
      isEmail
        ? `${DASHBOARD_URL}/api/orders?order=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(contact.toLowerCase())}`
        : `${DASHBOARD_URL}/api/orders?account=${encodeURIComponent(contact)}`,
      { cache: 'no-store' }
    )

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errData.error || 'הזמנה לא נמצאה' },
        { status: response.status }
      )
    }

    const data = await response.json()
    if (!isEmail) {
      const normalizedOrder = String(orderNumber).replace(/\s/g, '')
      const order = (data.orders || []).find((item) =>
        String(item.our_order_id || '').replace(/\D/g, '') === String(orderNumber).replace(/\D/g, '') ||
        String(item.external_order_id || '').replace(/\s/g, '') === normalizedOrder
      )
      if (!order) return NextResponse.json({ error: 'הזמנה לא נמצאה' }, { status: 404 })
      return NextResponse.json({ order })
    }
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
