import { NextResponse } from 'next/server'

const DASHBOARD_URL = 'https://masoret-dashboard.vercel.app'

export async function POST(req) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'מייל חסר' }, { status: 400 })

  const token = Buffer.from(JSON.stringify({
    email: email.toLowerCase(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000
  })).toString('base64')

  return NextResponse.json({ token })
}
