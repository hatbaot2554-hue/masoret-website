import { NextResponse } from 'next/server';

const DASHBOARD_URL = process.env.DASHBOARD_API_URL || 'https://masoret-dashboard.vercel.app';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(`${DASHBOARD_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'שגיאה';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
