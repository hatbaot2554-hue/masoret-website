import { NextResponse } from 'next/server'
import { getShippingFromSource } from '../../lib/shippingQuote.mjs'
import { checkoutGuard } from '../../lib/checkoutGuard.mjs'

export async function POST(request) {
  try {
    const guard = await checkoutGuard(request, 'shipping')
    if (guard !== 200) return NextResponse.json({ error: 'לא ניתן לחשב משלוח כרגע. נסו שוב בעוד כמה דקות.' }, { status: guard })
    const { items, city } = await request.json()
    return NextResponse.json(await getShippingFromSource(items, city))
  } catch {
    return NextResponse.json({ error: 'לא ניתן לאמת את מחיר המשלוח כרגע. נסו שוב מאוחר יותר.' }, { status: 503 })
  }
}
