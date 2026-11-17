import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { identifier, code } = await req.json()
    const response = await fetch('https://masoret-dashboard.vercel.app/api/customer-auth', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, code }), signal: AbortSignal.timeout(15000),
    })
    return NextResponse.json(await response.json(), { status: response.status })
  } catch { return NextResponse.json({ error: 'לא ניתן להתחבר כרגע' }, { status: 503 }) }
}
