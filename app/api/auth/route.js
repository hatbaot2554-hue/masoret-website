import { NextResponse } from 'next/server'

export async function POST(req) {
  const { email, identifier } = await req.json()
  const login = String(identifier || email || '').trim()
  if (!login) return NextResponse.json({ error: 'יש להזין מייל או טלפון' }, { status: 400 })

  const token = Buffer.from(JSON.stringify({
    identifier: login.toLowerCase(),
    email: login.includes('@') ? login.toLowerCase() : '',
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000
  })).toString('base64')

  return NextResponse.json({ token })
}
