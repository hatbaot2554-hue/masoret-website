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

const REVIEWS = [
  { name: 'משה כהן', city: 'בני ברק', text: 'שירות מעולה, הספרים הגיעו מהר ובמצב מושלם. ממליץ בחום!', stars: 5 },
  { name: 'יעקב לוי', city: 'ירושלים', text: 'מבחר עצום ומחירים הוגנים. הטבעת ההקדשה יצאה יפה מאוד.', stars: 5 },
  { name: 'אברהם ברקוביץ', city: 'אשדוד', text: 'קניתי סט שלם לבר מצווה של הבן. שירות אישי ומקצועי ברמה גבוהה.', stars: 5 },
  { name: 'דוד שפירא', city: 'פתח תקווה', text: 'הזמנתי גלופה על 50 ספרים — התוצאה פשוט מדהימה. תודה רבה!', stars: 5 },
]

function StarRating({ count = 5 }) {
  return (
    <div style={{ color: '#C9A84C', fontSize: '16px', letterSpacing: '2px' }}>
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </div>
  )
}

export default async function HomePage() {
  const products = await getProducts()
  return (
    <>
      {/* ===== HERO ===== */}
      <section style={{
        background: 'linear-gradient(135deg, #1A2332 0%, #243040 100%)',
        color: '#fff',
        padding: '80px 0 70px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* רקע דקורטיבי */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'repeating-linear-gradient(45deg, #C9A84C 0, #C9A84C 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 32px', position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>

            {/* טקסט */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)',
                borderRadius: '100px', padding: '6px 16px', marginBottom: '24px',
              }}>
                <span style={{ color: '#C9A84C', fontSize: '12px', letterSpacing: '0.15em', fontWeight: '500' }}>✦ למעלה מ-5,000 ספרי קודש ✦</span>
              </div>

              <h1 style={{
                fontFamily: 'Frank Ruhl Libre, serif',
                fontSize: 'clamp(32px, 5vw, 60px)',
                fontWeight: '900', lineHeight: 1.2, marginBottom: '20px',
              }}>
                ספרי קודש איכותיים —<br />
                <span style={{ color: '#C9A84C' }}>מהמדף שלנו לבית שלך</span>
              </h1>

              <p style={{
                fontSize: '17px', color: 'rgba(255,255,255,0.78)',
                maxWidth: '480px', lineHeight: 1.9, marginBottom: '32px',
              }}>
                משלוח מהיר לכל הארץ, הטבעת הקדשה אישית, ושירות לקוחות שתמיד זמין לעזור. כי כל ספר קודש מגיע עם לב.
              </p>

              {/* Trust signals */}
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '36px' }}>
                {[
                  { icon: '🚚', text: 'משלוח עד הבית' },
                  { icon: '✍️', text: 'הטבעה אישית' },
                  { icon: '💳', text: 'עד 6 תשלומים' },
                  { icon: '⭐', text: 'שירות מעולה' },
                ].map(({ icon, text }) => (
                  <div key={text} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    fontSize: '14px', color: 'rgba(255,255,255,0.85)',
                  }}>
                    <span>{icon}</span><span>{text}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href="/products" style={{
                  background: '#C9A84C', color: '#1A2332',
                  padding: '15px 36px', textDecoration: 'none',
                  fontSize: '16px', fontWeight: '700',
                  fontFamily: 'Frank Ruhl Libre, serif',
                  display: 'inline-block', transition: 'all 0.2s',
                  boxShadow: '0 4px 20px rgba(201,168,76,0.4)',
                }}>
                  לכל הספרים ←
                </a>
                <a href="/products?category=bestsellers" style={{
                  background: 'transparent', color: '#C9A84C',
                  padding: '15px 28px', textDecoration: 'none',
                  fontSize: '15px', border: '1.5px solid rgba(201,168,76,0.5)',
                  display: 'inline-block',
                }}>
                  רב-מכרים 🔥
                </a>
              </div>
            </div>

            {/* סטטיסטיקות */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { num: '5,000+', label: 'ספרי קודש', icon: '📚' },
                { num: '2,000+', label: 'לקוחות מרוצים', icon: '😊' },
                { num: '4.9★', label: 'דירוג ממוצע', icon: '⭐' },
                { num: '48 שעות', label: 'זמן משלוח ממוצע', icon: '🚀' },
              ].map(({ num, label, icon }) => (
                <div key={label} style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: '8px', padding: '24px 20px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
                  <div style={{ fontSize: '28px', fontWeight: '900', color: '#C9A84C', fontFamily: 'Frank Ruhl Libre, serif', lineHeight: 1 }}>{num}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '6px' }}>{label}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section style={{
        background: '#1A2332', borderBottom: '1px solid rgba(201,168,76,0.2)',
        padding: '14px 0',
      }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
            {[
              '🔒 תשלום מאובטח',
              '📦 משלוח לכל הארץ',
              '↩️ החזרה קלה',
              '☎️ שירות אנושי',
            ].map(t => (
              <span key={t} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', letterSpacing: '0.05em' }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== מוצרים מומלצים ===== */}
      <section style={{ padding: '72px 0' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontSize: '12px', letterSpacing: '0.2em', color: '#8B6914', marginBottom: '8px', textTransform: 'uppercase' }}>אוסף נבחר</p>
            <h2 style={{ fontSize: '36px', fontWeight: '900', fontFamily: 'Frank Ruhl Libre, serif', marginBottom: '12px' }}>ספרים מומלצים</h2>
            <p style={{ color: '#6B5C3E', fontSize: '15px' }}>הספרים הנמכרים והאהובים ביותר על הלקוחות שלנו</p>
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
            <a href="/products" style={{
              background: '#C9A84C', color: '#1A2332',
              padding: '14px 40px', textDecoration: 'none',
              fontSize: '16px', fontWeight: '700',
              fontFamily: 'Frank Ruhl Libre, serif',
              display: 'inline-block',
              boxShadow: '0 4px 16px rgba(201,168,76,0.35)',
            }}>
              לכל הספרים ←
            </a>
          </div>
        </div>
      </section>

      {/* ===== המלצות לקוחות ===== */}
      <section style={{ background: '#1A2332', padding: '72px 0' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ fontSize: '12px', letterSpacing: '0.2em', color: '#C9A84C', marginBottom: '8px' }}>✦ לקוחות מספרים ✦</p>
            <h2 style={{ fontSize: '36px', fontWeight: '900', fontFamily: 'Frank Ruhl Libre, serif', color: '#fff', marginBottom: '8px' }}>מה אומרים עלינו</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{ color: '#C9A84C', fontSize: '20px' }}>★★★★★</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>4.9 מתוך 5 — על בסיס 200+ ביקורות</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: '8px', padding: '24px',
              }}>
                <StarRating count={r.stars} />
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', lineHeight: 1.8, margin: '12px 0 16px' }}>
                  "{r.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #C9A84C, #8B6914)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: '700', fontSize: '14px',
                  }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>{r.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{r.city}</div>
                  </div>
                  <div style={{ marginRight: 'auto' }}>
                    <span style={{ background: 'rgba(201,168,76,0.15)', color: '#C9A84C', fontSize: '11px', padding: '3px 8px', borderRadius: '100px' }}>✓ קנייה מאומתת</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA תחתון ===== */}
      <section style={{ background: 'linear-gradient(135deg, #C9A84C 0%, #8B6914 100%)', padding: '60px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '0 32px' }}>
          <h2 style={{ fontFamily: 'Frank Ruhl Libre, serif', fontSize: '36px', color: '#1A2332', marginBottom: '16px', fontWeight: '900' }}>
            מחפש ספר מסוים?
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(26,35,50,0.8)', marginBottom: '28px', lineHeight: 1.8 }}>
            מעל 5,000 כותרים — תמיד תמצא את מה שחיפשת. ואם לא, נעזור לך למצוא.
          </p>
          <a href="/products" style={{
            background: '#1A2332', color: '#C9A84C',
            padding: '16px 44px', textDecoration: 'none',
            fontSize: '17px', fontWeight: '700',
            fontFamily: 'Frank Ruhl Libre, serif',
            display: 'inline-block',
            boxShadow: '0 6px 24px rgba(26,35,50,0.35)',
          }}>
            לחנות המלאה ←
          </a>
        </div>
      </section>
    </>
  )
}
