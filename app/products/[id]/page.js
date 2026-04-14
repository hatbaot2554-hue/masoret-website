import ProductPageClient from './ProductPageClient'

async function getProduct(id) {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/hatbaot2554-hue/masoret-automation/refs/heads/main/products.json',
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    const all = await res.json()
    const idx = parseInt(id)
    if (!isNaN(idx) && idx >= 0 && idx < all.length) return { ...all[idx], index: idx }
    return null
  } catch {
    return null
  }
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id)
  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2>המוצר לא נמצא</h2>
        <a href="/products" style={{ display: 'inline-block', marginTop: '24px', background: '#C9A84C', color: '#1A2332', padding: '12px 28px', textDecoration: 'none' }}>
          חזרה לחנות
        </a>
      </div>
    )
  }
  return <ProductPageClient product={product} />
}
