// app/api/orders/route.js
// כשלקוח מזמין באתר החדש — הקוד הזה שולח את ההזמנה אוטומטית לאתר המקורי

import { createOrderInSource } from '../../lib/woocommerce'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

function saveOrder(ourOrderId, sourceOrderId, orderData) {
  const ordersPath = path.join(process.cwd(), 'orders.json')
  let orders = {}
  if (fs.existsSync(ordersPath)) {
    orders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'))
  }
  orders[ourOrderId] = {
    our_order_id: ourOrderId,
    source_order_id: sourceOrderId,
    email: orderData.email,
    name: `${orderData.firstName} ${orderData.lastName}`,
    phone: orderData.phone,
    date: new Date().toLocaleDateString('he-IL'),
    raw_status: 'processing',
    status_he: 'בטיפול',
    status_color: '#1a6bbf',
    our_status: 'processing',
    last_updated: new Date().toISOString(),
    history: [{ status: 'בטיפול', date: new Date().toLocaleString('he-IL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) }],
  }
  fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2), 'utf-8')
}

export async function POST(request) {
  try {
    const body = await request.json()

    const { firstName, lastName, email, phone, address, city, items, note } = body

    // בדיקת שדות חובה
    if (!firstName || !lastName || !email || !phone || !address || !city || !items?.length) {
      return NextResponse.json(
        { error: 'יש למלא את כל שדות החובה' },
        { status: 400 }
      )
    }

    // שליחת הזמנה לאתר המקורי
    const sourceOrder = await createOrderInSource({
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      items,
      note,
    })

    // מספר הזמנה שלנו — מספר רץ פשוט
    const ourOrderId = Date.now().toString().slice(-6)

    // שמירת ההזמנה לקובץ (לצורך מעקב סטטוס)
    saveOrder(ourOrderId, sourceOrder.id, { firstName, lastName, email, phone, address, city })

    return NextResponse.json({
      success: true,
      ourOrderId,
      sourceOrderId: sourceOrder.id,
      message: 'ההזמנה התקבלה בהצלחה!',
    })
  } catch (err) {
    console.error('Order error:', err)
    return NextResponse.json(
      { error: err.message || 'שגיאה בעיבוד ההזמנה' },
      { status: 500 }
    )
  }
}
