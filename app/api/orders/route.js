import { NextResponse } from 'next/server'

// שמירה זמנית ב-memory (עד שנגדיר מסד נתונים)
const orders = new Map()

export async function POST(request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, address, city, items, note } = body

    if (!firstName || !lastName || !email || !phone || !address || !city || !items?.length) {
      return NextResponse.json({ error: 'יש למלא את כל שדות החובה' }, { status: 400 })
    }

    const ourOrderId = Date.now().toString().slice(-6)

    orders.set(ourOrderId, {
      our_order_id: ourOrderId,
      email: email.toLowerCase(),
      name: `${firstName} ${lastName}`,
      phone,
      address: `${address}, ${city}`,
      date: new Date().toLocaleDateString('he-IL'),
      status_he: 'בטיפול',
      items,
      note,
    })

    return NextResponse.json({
      success: true,
      ourOrderId,
      sourceOrderId: Math.floor(Math.random() * 9000 + 1000),
      message: 'ההזמנה התקבלה בהצלחה!',
    })
  } catch (err) {
    return NextResponse.json({ error: err.message || 'שגיאה' }, { status: 500 })
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const orderNumber = searchParams.get('order')
  const email = searchParams.get('email')?.toLowerCase()

  if (!orderNumber || !email) {
    return NextResponse.json({ error: 'חסרים פרטים' }, { status: 400 })
  }

  const order = orders.get(orderNumber)
  if (!order || order.email !== email) {
    return NextResponse.json({ error: 'הזמנה לא נמצאה' }, { status: 404 })
  }

  return NextResponse.json({ order })
}
