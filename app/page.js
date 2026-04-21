import ProductCard from './components/ProductCard'

async function getProducts() {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/hatbaot2554-hue/masoret-automation/refs/heads/main/products.json',
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return []
    const all = await res.json()
    return all.slice(0, 10).map((p, i) => ({ ...p, index: i }))
  } catch {
    return []
  }
}

export default async function HomePage() {
  const products = await getProducts()
  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, #1A2332 0%, #243040 100%)', color: '#fff', padding: '100px 0 80px' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', letterSpacing: '0.2em', color: '#C9A84C', marginBottom: '20px' }}>✦ מסורת • קדושה • השראה ✦</p>
          <h1 style={{ fontFamily: 'serif', fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: '900', lineHeight: 1.2, marginBottom: '24px' }}>המרכז למסורת יהודית</h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.75)', maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.8 }}>מבחר של למעלה מ-5,000 ספרי קודש, הלכה, חסידות ומחשבה יהודית. משלוח מהיר לכל הארץ.</p>
          <a href="/products" style={{ background: '#C9A84C', color: '#1A2332', padding: '14px 36px', textDecoration: 'none', fontSize: '16px', fontWeight: '500', display: 'inline-block' }}>לכל הספרים ←</a>
        </div>
      </section>
      <section style={{ padding: '72px 0' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '900', fontFamily: 'serif' }}>ספרים מומלצים</h2>
          </div>
          {products.length > 0 ? (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.index} product={product} index={product.index} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px', background: '#F8F4EE', color: '#6B5C3E' }}>
              <p style={{ fontSize: '18px', marginBottom: '12px' }}>המוצרים בדרך אליך...</p>
              <p style={{ fontSize: '14px' }}>הסריקה היומית תטען את כל הספרים בקרוב</p>
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <a href="/products" style={{ background: '#C9A84C', color: '#1A2332', padding: '14px 36px', textDecoration: 'none', fontSize: '16px', fontWeight: '500', display: 'inline-block' }}>לכל הספרים ←</a>
          </div>
        </div>
      </section>
    </>
  )
}
