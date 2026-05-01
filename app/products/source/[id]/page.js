import { redirect } from 'next/navigation'

async function getProducts() {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/hatbaot2554-hue/masoret-automation/refs/heads/main/products.json',
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

function normalize(value) {
  return String(value || '').trim()
}

function productMatches(product, id) {
  const target = normalize(id)
  if (!target) return false

  if (normalize(product.product_id) === target) return true
  if (normalize(product.sku) === target) return true
  if (normalize(product.url) === target) return true

  if (Array.isArray(product.variations)) {
    return product.variations.some((variation) =>
      normalize(variation.variation_id) === target ||
      normalize(variation.sku) === target
    )
  }

  return false
}

export default async function SourceProductRedirectPage({ params }) {
  const sourceId = decodeURIComponent(params.id || '')
  const products = await getProducts()
  const index = products.findIndex((product) => productMatches(product, sourceId))

  if (index >= 0) {
    redirect(`/products/${index}`)
  }

  redirect(`/products?search=${encodeURIComponent(sourceId)}`)
}
