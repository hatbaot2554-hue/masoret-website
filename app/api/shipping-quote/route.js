import { NextResponse } from 'next/server'

const SOURCE_URL = 'https://www.seferkodesh.co.il'

const cache = new Map()

function buildCacheKey(items) {
  return items
    .map(i => `${i.productId}:${i.quantity}`)
    .sort()
    .join('|')
}

async function getShippingFromSource(items, city = 'תל אביב') {
  const cacheKey = buildCacheKey(items)

  if (cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey)
    if (Date.now() - timestamp < 30 * 60 * 1000) {
      console.log('Cache hit:', cacheKey)
      return { ...data, cached: true }
    }
    cache.delete(cacheKey)
  }

  let cookies = ''

  const sessionRes = await fetch(`${SOURCE_URL}/`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml',
    },
    redirect: 'follow',
  })

  const setCookie = sessionRes.headers.get('set-cookie')
  if (setCookie) {
    cookies = setCookie.split(',').map(c => c.split(';')[0].trim()).join('; ')
  }

  await fetch(`${SOURCE_URL}/?wc-ajax=remove_all_cart_items`, {
    method: 'POST',
    headers: { 'Cookie': cookies, 'Content-Type': 'application/x-www-form-urlencoded' },
  }).catch(() => {})

  for (const item of items) {
    const formData = new URLSearchParams({
      'product_id': item.productId,
      'quantity': item.quantity,
      'add-to-cart': item.productId,
    })

    const addRes = await fetch(`${SOURCE_URL}/?wc-ajax=add_to_cart`, {
      method: 'POST',
      headers: {
        'Cookie': cookies,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: formData.toString(),
    })

    const newCookie = addRes.headers.get('set-cookie')
    if (newCookie) {
      const newParts = newCookie.split(',').map(c => c.split(';')[0].trim())
      const existing = cookies.split('; ').filter(c => !newParts.some(nc => nc.split('=')[0] === c.split('=')[0]))
      cookies = [...existing, ...newParts].join('; ')
    }
  }

  const cartPageRes = await fetch(`${SOURCE_URL}/cart/`, {
    headers: { 'Cookie': cookies, 'User-Agent': 'Mozilla/5.0' },
  })
  const cartHtml = await cartPageRes.text()

  const nonceMatch = cartHtml.match(/woocommerce_cart_nonce['":\s]+['"]([a-f0-9]+)['"]/)
  const nonce = nonceMatch ? nonceMatch[1] : ''

  const shippingData = new URLSearchParams({
    'security': nonce,
    'country': 'IL',
    'state': '',
    'postcode': '',
    'city': city,
    'woocommerce-shipping-calculator-nonce': nonce,
    'calc_shipping': '1',
  })

  const shippingRes = await fetch(`${SOURCE_URL}/?wc-ajax=update_order_review`, {
    method: 'POST',
    headers: {
      'Cookie': cookies,
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': 'Mozilla/5.0',
    },
    body: shippingData.toString(),
  })

  let shippingJson = null
  try {
    shippingJson = await shippingRes.json()
  } catch {
    // לא JSON
  }

  let home_delivery = null
  let pickup_point = null

  if (shippingJson) {
    const fragments = shippingJson.fragments || {}
    const shippingHtml = Object.values(fragments).join(' ')

    const priceMatches = [...shippingHtml.matchAll(/data-title="([^"]*)"[^>]*>.*?<span[^>]*>([\d,.]+)/gs)]

    for (const match of priceMatches) {
      const label = match[1].toLowerCase()
      const price = parseFloat(match[2].replace(',', ''))

      if (label.includes('עד הבית') || label.includes('home') || label.includes('door')) {
        home_delivery = price
      } else if (label.includes('נקודת') || label.includes('pickup') || label.includes('point')) {
        pickup_point = price
      }
    }

    if (home_delivery === null || pickup_point === null) {
      const allPrices = [...shippingHtml.matchAll(/(\d+\.?\d*)\s*₪/g)]
        .map(m => parseFloat(m[1]))
        .filter(p => p > 0)
        .sort((a, b) => b - a)

      if (allPrices.length >= 2) {
        home_delivery = home_delivery ?? allPrices[0]
        pickup_point = pickup_point ?? allPrices[1]
      } else if (allPrices.length === 1) {
        home_delivery = home_delivery ?? allPrices[0]
        pickup_point = pickup_point ?? allPrices[0]
      }
    }
  }

  const result = {
    home_delivery: home_delivery ?? 38,
    pickup_point: pickup_point ?? 23,
    cached: false,
    source: shippingJson ? 'live' : 'fallback',
  }

  cache.set(cacheKey, { data: result, timestamp: Date.now() })

  return result
}

export async function POST(req) {
  try {
    const { items, city } = await req.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'חסרים פרטי מוצרים' }, { status: 400 })
    }

    let lastError = null
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const result = await getShippingFromSource(items, city || 'תל אביב')
        return NextResponse.json(result)
      } catch (err) {
        lastError = err
        console.error(`ניסיון ${attempt} נכשל:`, err.message)
        if (attempt < 3) await new Promise(r => setTimeout(r, 1000 * attempt))
      }
    }

    console.error('כל הניסיונות נכשלו, מחזיר fallback:', lastError)
    return NextResponse.json({
      home_delivery: 38,
      pickup_point: 23,
      source: 'fallback',
      error: 'לא הצלחנו לחשב משלוח בזמן אמת',
    })

  } catch (err) {
    console.error('שגיאה כללית:', err)
    return NextResponse.json({ error: 'שגיאה פנימית' }, { status: 500 })
  }
}
