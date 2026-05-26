import { NextResponse } from 'next/server'

const DASHBOARD_URL = 'https://masoret-dashboard.vercel.app'
const DASHBOARD_ORDERS_API_SECRET = process.env.DASHBOARD_ORDERS_API_SECRET || ''

export async function POST(request) {
  try {
    const body = await request.json()
    const response = await fetch(`${DASHBOARD_URL}/api/coupons/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(DASHBOARD_ORDERS_API_SECRET ? { 'x-dashboard-orders-secret': DASHBOARD_ORDERS_API_SECRET } : {}),
      },
      body: JSON.stringify(body),
    })
    const data = await response.json().catch(() => ({}))
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'לא ניתן לבדוק קופון כרגע' }, { status: 500 })
  }
}
