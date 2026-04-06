import { getProducts, getCategories } from './lib/woocommerce'
import ProductCard from './components/ProductCard'

export default async function HomePage() {
  let products = []
  let categories = []

  try {
    [products, categories] = await Promise.all([
      getProducts(1, 8),
      getCategories(),
    ])
  } catch (e) {
    console.error('Error loading homepage:', e)
  }

  return (
    <>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)',
        color: 'var(--white)',
        padding: '100px 0 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* קישוט רקע */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(201,168,76,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(201,168,76,0.05) 0%, transparent 40%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <p style={{
            fontSize: '13px',
            letterSpacing: '0.2em',
            color: 'var(--gold)',
            marginBottom: '20px',
            textTransform: 'uppercase',
          }}>
            ✦ מסורת • קדושה • השראה ✦
          </p>
          <h1 style={{
            fontFamily: 'Frank Ruhl Libre, serif',
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: '900',
            lineHeight: 1.2,
            marginBottom: '24px',
            color: 'var(--white)',
          }}>
            המרכז למסורת יהודית
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.75)',
            maxWidth: '560px',
            margin: '0 auto 40px',
            lineHeight: 1.8,
          }}>
            מבחר של למעלה מ-5,000 ספרי קודש, הלכה, חסידות ומחשבה יהודית.
            משלוח מהיר לכל הארץ.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <a href="/products" className="btn-primary" style={{ fontSize: '16px', padding: '14px 36px' }}>
              לכל הספרים ←
            </a>
            <a href="/categories" className="btn-outline" style={{ fontSize: '16px', padding: '14px 36px', color: 'var(--gold)', borderColor: 'var(--gold)' }}>
              לפי קטגוריה
            </a>
          </div>
        </div>
      </section>

      {/* יתרונות */}
      <section style={{ background: 'var(--cream-dark)', padding: '32px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0',
          }}>
            {[
              { icon: '📦', text: 'משלוח חינם מעל ₪200' },
              { icon: '📚', text: 'מעל 5,000 כותרים' },
              { icon: '⚡', text: 'שליחה עד 3 ימי עסקים' },
              { icon: '🔒', text: 'תשלום מאובטח' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 24px',
                borderRight: i > 0 ? '1px solid var(--cream)' : 'none',
              }}>
                <span style={{ fontSize: '22px' }}>{item.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* מוצרים מובחרים */}
      <section style={{ padding: '72px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ color: 'var(--gold-dark)', fontSize: '13px', letterSpacing: '0.15em', marginBottom: '8px' }}>
              ✦ מבחר עדכני ✦
            </p>
            <h2 style={{ fontSize: '36px', fontWeight: '900' }}>ספרים מומלצים</h2>
          </div>

          {products.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
            }}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
              <p>⚠️ לא ניתן לטעון מוצרים כרגע. יש להגדיר את מפתחות ה-API בקובץ .env.local</p>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <a href="/products" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', fontSize: '16px' }}>
              לכל הספרים ←
            </a>
          </div>
        </div>
      </section>

      {/* קטגוריות */}
      {categories.length > 0 && (
        <section style={{ background: 'var(--navy)', padding: '72px 0' }}>
          <div className="container">
            <h2 style={{
              color: 'var(--gold)',
              fontSize: '32px',
              textAlign: 'center',
              marginBottom: '40px',
            }}>
              קטגוריות
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '16px',
            }}>
              {categories.slice(0, 8).map((cat) => (
                <a
                  key={cat.id}
                  href={`/products?category=${cat.id}`}
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(201,168,76,0.3)',
                    color: 'var(--white)',
                    padding: '20px 16px',
                    textDecoration: 'none',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    display: 'block',
                  }}
                >
                  <div style={{ fontSize: '22px', marginBottom: '8px' }}>📖</div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>{cat.name}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                    {cat.count} ספרים
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
