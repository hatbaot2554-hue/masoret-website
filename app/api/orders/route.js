import { NextResponse } from 'next/server';

const DASHBOARD_URL = 'https://masoret-dashboard.vercel.app';

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, address, city, items, note } = body;

    if (!firstName || !lastName || !email || !phone || !address || !city || !items?.length) {
      return NextResponse.json({ error: 'יש למלא את כל שדות החובה' }, { status: 400 });
    }

    const orderData = {
      customer_name: `${firstName} ${lastName}`,
      customer_phone: phone,
      customer_email: email.toLowerCase(),
      customer_address: `${address}, ${city}`,
      items: items,
      total_price: items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0),
      payment_method: 'pending',
      notes: note || ''
    };

    const response = await fetch(`${DASHBOARD_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    const saved = await response.json();

    return NextResponse.json({
      success: true,
      ourOrderId: saved.id,
      message: 'ההזמנה התקבלה בהצלחה!'
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('order');
    const email = searchParams.get('email')?.toLowerCase();

    if (!orderNumber || !email) {
      return NextResponse.json({ error: 'חסרים פרטים' }, { status: 400 });
    }

    const response = await fetch(`${DASHBOARD_URL}/api/orders`);
    const orders = await response.json();
    const order = orders.find(o => o.id === orderNumber && o.customer_email === email);

    if (!order) {
      return NextResponse.json({ error: 'הזמנה לא נמצאה' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
