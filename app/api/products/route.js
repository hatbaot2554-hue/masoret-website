// app/api/products/route.js
import { getProducts } from '../../lib/woocommerce'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || 1
  const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get('per_page') || '50', 10) || 50))
  const category = searchParams.get('category') || ''

  try {
    const products = await getProducts(page, perPage, category)
    return NextResponse.json(products)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
