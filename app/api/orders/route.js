import { NextResponse } from 'next/server';
const DASHBOARD_URL = 'https://masoret-dashboard.vercel.app';
const DASHBOARD_ORDERS_API_SECRET = process.env.DASHBOARD_ORDERS_API_SECRET || '';

function generateOrderId(dbId) {
  if (dbId) {
    const numeric = String(dbId).replace(/\D/g, '')
    // ✅ תיקון: לוקחים רק 5 ספרות אחרונות ומוודאים מינימום 5
    return numeric.slice(-5).padStart(5, '0')
  }
  return String(Date.now()).slice(-5)
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, address, city, items, note, source, utm_source } = body;

    if (!firstName || !lastName || !email || !phone || !address || !city || !items?.length) {
      return NextResponse.json({ error: 'יש למלא את כל שדות החובה' }, { status: 400 });
    }

    const customerPrice = items.reduce((sum, item) => sum + (parseFloat(item.price || 0) * (item.quantity || 1)), 0);
    const costPrice = items.reduce((sum, item) => sum + (parseFloat(item.cost || 0) * (item.quantity || 1)), 0);

    const orderData = {
      customer_name: `${firstName} ${lastName}`,
      customer_phone: phone,
      customer_email: email.toLowerCase(),
      customer_address: `${address}, ${city}`,
      items: items,
      total_price: customerPrice,
      cost_price: costPrice,
      profit: customerPrice - costPrice,
      payment_method: 'pending',
      notes: note || '',
      source: source || 'direct',
      utm_source: utm_source || ''
    };

    const response = await fetch(`${DASHBOARD_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(DASHBOARD_ORDERS_API_SECRET ? { 'x-dashboard-orders-secret': DASHBOARD_ORDERS_API_SECRET } : {}),
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      throw new Error(errData.error || `שגיאה מהשרת (${response.status})`)
    }

    const saved = await response.json();

    if (!saved?.id) {
      throw new Error('לא התקבל מזהה הזמנה מהשרת')
    }

    const orderId = generateOrderId(saved.id)

    return NextResponse.json({
      success: true,
      ourOrderId: orderId,
      fullId: saved.id,
      message: 'ההזמנה התקבלה בהצלחה!'
    });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'לא ניתן ליצור הזמנה כרגע. נסה שוב מאוחר יותר.' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const account = searchParams.get('account')?.trim();
    const orderNumber = searchParams.get('order')?.trim();
    const email = searchParams.get('email')?.trim().toLowerCase();
    const contact = searchParams.get('contact')?.trim();

    if (account) {
      const response = await fetch(
        `${DASHBOARD_URL}/api/orders?account=${encodeURIComponent(account)}`,
        {
          cache: 'no-store',
          headers: {
            ...(DASHBOARD_ORDERS_API_SECRET ? { 'x-dashboard-orders-secret': DASHBOARD_ORDERS_API_SECRET } : {}),
          },
        }
      );
      const data = await response.json().catch(() => ({}));
      return NextResponse.json(data, { status: response.status });
    }

    const lookupValue = contact || email
    if (!orderNumber || !lookupValue) {
      return NextResponse.json({ error: 'חסרים פרטים' }, { status: 400 });
    }

    const isEmail = lookupValue.includes('@')

    if (!isEmail) {
      const response = await fetch(
        `${DASHBOARD_URL}/api/orders?account=${encodeURIComponent(lookupValue)}`,
        {
          cache: 'no-store',
          headers: {
            ...(DASHBOARD_ORDERS_API_SECRET ? { 'x-dashboard-orders-secret': DASHBOARD_ORDERS_API_SECRET } : {}),
          },
        }
      )
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        return NextResponse.json({ error: data.error || 'הזמנה לא נמצאה' }, { status: response.status })
      }
      const order = (data.orders || []).find((item) => String(item.our_order_id || '').replace(/\D/g, '') === String(orderNumber).replace(/\D/g, ''))
      if (!order) return NextResponse.json({ error: 'הזמנה לא נמצאה' }, { status: 404 })
      return NextResponse.json({ order })
    }

    const response = await fetch(
      `${DASHBOARD_URL}/api/orders?order=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(lookupValue)}`,
      {
        cache: 'no-store',
        headers: {
          ...(DASHBOARD_ORDERS_API_SECRET ? { 'x-dashboard-orders-secret': DASHBOARD_ORDERS_API_SECRET } : {}),
        },
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errData.error || 'הזמנה לא נמצאה' },
        { status: response.status }
      )
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'לא ניתן לבדוק הזמנה כרגע.' }, { status: 500 });
  }
}
