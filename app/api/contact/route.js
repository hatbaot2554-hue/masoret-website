import { NextResponse } from 'next/server'

const DASHBOARD_URL = 'https://masoret-dashboard.vercel.app'

export async function POST(request) {
  try {
    const body = await request.json()
    const response = await fetch(`${DASHBOARD_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await response.json().catch(() => ({}))
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'לא ניתן לשלוח פנייה כרגע' }, { status: 500 })
  }
}
