// app/api/track/route.js
// מחזיר סטטוס הזמנה לפי מספר הזמנה + מייל

import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const orderNumber = searchParams.get('order')?.trim()
  const email = searchParams.get('email')?.trim().toLowerCase()

  if (!orderNumber || !email) {
    return NextResponse.json({ error: 'חסרים פרטים' }, { status: 400 })
  }

  try {
    // קריאת קובץ ההזמנות (מתעדכן אוטומטית על ידי track_orders.py)
    const ordersPath = path.join(process.cwd(), 'orders.json')

    if (!fs.existsSync(ordersPath)) {
      return NextResponse.json({ error: 'הזמנה לא נמצאה' }, { status: 404 })
    }

    const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'))
    const order = orders[orderNumber]

    if (!order) {
      return NextResponse.json({ error: 'הזמנה לא נמצאה' }, { status: 404 })
    }

    // אימות מייל
    if (order.email?.toLowerCase() !== email) {
      return NextResponse.json({ error: 'פרטים לא תואמים' }, { status: 403 })
    }

    return NextResponse.json({ order })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
