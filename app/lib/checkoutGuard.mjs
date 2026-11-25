import crypto from 'node:crypto';

export async function checkoutGuard(request, scope) {
  const secret = process.env.DASHBOARD_ORDERS_API_SECRET;
  if (!secret) return 503;
  // Vercel supplies this header; never accept a browser-provided client identifier.
  const ip = request.headers.get('x-vercel-forwarded-for') || request.headers.get('x-forwarded-for') || 'unknown';
  const client = crypto.createHmac('sha256', secret).update(ip.split(',')[0].trim()).digest('hex');
  try {
    const response = await fetch('https://masoret-dashboard.vercel.app/api/checkout-guard', {
      method: 'POST', cache: 'no-store', signal: AbortSignal.timeout(10000),
      headers: { 'Content-Type': 'application/json', 'x-dashboard-orders-secret': secret },
      body: JSON.stringify({ client, scope }),
    });
    if (response.status === 429) return 429;
    if (!response.ok || (await response.json()).allowed !== true) return 503;
    return 200;
  } catch { return 503; }
}
