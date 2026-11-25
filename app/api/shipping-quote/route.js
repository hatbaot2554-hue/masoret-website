import { NextResponse } from 'next/server'
import { getShippingFromSource } from '../../lib/shippingQuote.mjs'

export async function POST(request) {
  try {
    const { items, city } = await request.json()
    return NextResponse.json(await getShippingFromSource(items, city))
  } catch {
    return NextResponse.json({ error: 'לא ניתן לאמת את מחיר המשלוח כרגע. נסו שוב מאוחר יותר.' }, { status: 503 })
  }
}
