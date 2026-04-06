// app/api/products/route.js
import { getProducts } from '../../lib/woocommerce'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || 1
  const category = searchParams.get('category') || ''

  try {
    const products = await getProducts(page, 20, category)
    return NextResponse.json(products)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
