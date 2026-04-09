import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, address, city, items, note } = body

    if (!firstName || !lastName || !email || !phone || !address || !city || !items?.length) {
      return NextResponse.json({ error: 'יש למלא את כל שדות החובה' }, { status: 400 })
    }

    // מספר הזמנה ייחודי
    const ourOrderId = Date.now().toString().slice(-6)

    // שמירת ההזמנה ב-memory (זמני עד שנגדיר מסד נתונים)
    console.log('הזמנה חדשה:', { ourOrderId, firstName, lastName, email, phone, address, city, items })

    return NextResponse.json({
      success: true,
      ourOrderId,
      sourceOrderId: Math.floor(Math.random() * 9000 + 1000),
      message: 'ההזמנה התקבלה בהצלחה!',
    })
  } catch (err) {
    return NextResponse.json({ error: err.message || 'שגיאה בעיבוד ההזמנה' }, { status: 500 })
  }
}
