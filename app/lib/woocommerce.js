// lib/woocommerce.js
// חיבור לאתר המקורי של אבא דרך WooCommerce REST API

const BASE_URL = process.env.SOURCE_WC_URL
const CK = process.env.SOURCE_WC_KEY
const CS = process.env.SOURCE_WC_SECRET
const MARKUP = parseFloat(process.env.PRICE_MARKUP || '1.15')

function authHeader() {
  const token = Buffer.from(`${CK}:${CS}`).toString('base64')
  return { Authorization: `Basic ${token}` }
}

// שליפת כל המוצרים עם מחיר מוגדל
export async function getProducts(page = 1, perPage = 20, category = '') {
  const params = new URLSearchParams({
    per_page: perPage,
    page,
    status: 'publish',
    ...(category && { category }),
  })

  const res = await fetch(
    `${BASE_URL}/wp-json/wc/v3/products?${params}`,
    {
      headers: authHeader(),
      next: { revalidate: 300 }, // מתרענן כל 5 דקות
    }
  )

  if (!res.ok) throw new Error('שגיאה בשליפת מוצרים')
  const products = await res.json()

  return products.map(applyMarkup)
}

// שליפת מוצר בודד לפי ID
export async function getProduct(id) {
  const res = await fetch(
    `${BASE_URL}/wp-json/wc/v3/products/${id}`,
    {
      headers: authHeader(),
      next: { revalidate: 300 },
    }
  )

  if (!res.ok) throw new Error('מוצר לא נמצא')
  const product = await res.json()
  return applyMarkup(product)
}

// שליפת קטגוריות
export async function getCategories() {
  const res = await fetch(
    `${BASE_URL}/wp-json/wc/v3/products/categories?per_page=100&hide_empty=true`,
    {
      headers: authHeader(),
      next: { revalidate: 3600 },
    }
  )

  if (!res.ok) throw new Error('שגיאה בשליפת קטגוריות')
  return res.json()
}

// יצירת הזמנה באתר המקורי עם פרטי הלקוח
export async function createOrderInSource(orderData) {
  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    items, // [{ product_id, quantity }]
    note,
  } = orderData

  const lineItems = items.map((item) => ({
    product_id: item.sourceProductId,
    quantity: item.quantity,
  }))

  const body = {
    payment_method: 'bacs',
    payment_method_title: 'העברה בנקאית',
    set_paid: false,
    billing: {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      address_1: address,
      city,
      country: 'IL',
    },
    shipping: {
      first_name: firstName,
      last_name: lastName,
      address_1: address,
      city,
      country: 'IL',
    },
    line_items: lineItems,
    customer_note: note || '',
  }

  const res = await fetch(`${BASE_URL}/wp-json/wc/v3/orders`, {
    method: 'POST',
    headers: {
      ...authHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'שגיאה ביצירת הזמנה')
  }

  return res.json()
}

// פונקציה פנימית: מוסיפה 15% למחיר
function applyMarkup(product) {
  return {
    ...product,
    // שומרים את ה-ID המקורי לצורך ההזמנה
    sourceProductId: product.id,
    price: markupPrice(product.price),
    regular_price: markupPrice(product.regular_price),
    sale_price: product.sale_price ? markupPrice(product.sale_price) : '',
  }
}

function markupPrice(priceStr) {
  if (!priceStr) return ''
  const num = parseFloat(priceStr)
  if (isNaN(num)) return priceStr
  return (num * MARKUP).toFixed(2)
}
