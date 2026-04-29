import { NextResponse } from 'next/server'

const DASHBOARD_URL = 'https://masoret-dashboard.vercel.app'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const orderNumber = searchParams.get('order')?.trim()
  const email = searchParams.get('email')?.trim().toLowerCase()

  if (!orderNumber || !email) {
    return NextResponse.json({ error: 'חסרים פרטים' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `${DASHBOARD_URL}/api/orders?order=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`,
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
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
