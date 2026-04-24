import { NextResponse } from 'next/server'

const DASHBOARD_URL = 'https://masoret-dashboard.vercel.app'

export async function POST(req) {
  const { email, productIndex, productName } = await req.json()
  if (!email || productIndex === undefined) {
    return NextResponse.json({ error: 'חסר מידע' }, { status: 400 })
  }
  try {
    const res = await fetch(`${DASHBOARD_URL}/api/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, productIndex, productName })
    })
    if (!res.ok) throw new Error('שגיאה')
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
