import ReviewsCarousel from './components/ReviewsCarousel'
import RotatingProductShowcase from './components/RotatingProductShowcase'
import { CURATED_CATEGORIES } from './lib/curatedCategories'

export const dynamic = 'force-dynamic'

async function getProducts() {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/hatbaot2554-hue/masoret-automation/refs/heads/main/products.json',
      { cache: 'no-store' }
    )
    if (!res.ok) return []
    const all = await res.json()
    const withIndex = all.map((p, i) => ({ ...p, index: i }))
    return withIndex.filter(p => p.in_stock !== false).slice(0, 24)
  } catch {
    return []
  }
}

const trustItems = [
  ['מבחר גדול של ספרי קודש', 'ספרים, סידורים, מחזורים, סטים מהודרים ומתנות יהודיות.'],
  ['משלוח לכל הארץ', 'אפשרויות המשלוח מוצגות בצורה ברורה לפני סיום ההזמנה.'],
  ['שירות אנושי וזמין', 'עזרה בבחירת ספר, מתנה או סט מתאים לכל צורך.'],
  ['אפשרות להטבעה אישית', 'מתאים למזכרות, הקדשות ומתנות לאירועים.'],
]

const whyItems = [
  ['מבחר רחב ומסודר', 'קטגוריות ברורות ותתי קטגוריות שמקלות למצוא בדיוק את הספר המתאים.'],
  ['חוויית קנייה פשוטה', 'עמודי מוצר נקיים, כפתורי רכישה בולטים וסל קניות ברור.'],
  ['תשלום מאובטח', 'תהליך הזמנה נוח עם שמירה על פרטיות ותחושת ביטחון.'],
  ['מתאים לבית ולמתנה', 'ספרי קודש, יודאיקה, סידורים, מחזורים ומוצרים לאירועים.'],
  ['שירות לפני ואחרי הקנייה', 'אפשרות לשאול, להתייעץ ולעקוב אחרי ההזמנה.'],
  ['עיצוב נקי ומסורתי', 'שפה חזותית רגועה, מכובדת ונוחה לקריאה בכל מסך.'],
]

export default async function HomePage() {
  const products = await getProducts()
  const categoryCards = CURATED_CATEGORIES

  return (
    <>
      <section className="home-hero">
        <div className="home-hero-pattern" />
        <div className="home-shell home-hero-inner">
          <div className="home-hero-copy">
            <p className="home-kicker">ספרי קודש ויודאיקה לבית היהודי</p>
            <h1>
              ספרי קודש לבית, לישיבה ולמתנה
              <span>במשלוח מהיר עד הבית</span>
            </h1>
            <p className="home-hero-text">
              מבחר גדול של ספרי קודש, סידורים, מחזורים, סטים מהודרים ומתנות יהודיות, עם שירות אנושי,
              אפשרות להטבעה אישית ותשלום מאובטח.
            </p>

            <form className="home-search" action="/products">
              <label className="sr-only" htmlFor="home-search-input">חיפוש באתר</label>
              <input
                id="home-search-input"
                name="search"
                type="search"
                placeholder="חפש שם ספר, מחבר, הוצאה או נושא..."
              />
              <button type="submit">חיפוש</button>
            </form>

            <div className="home-hero-actions">
              <a className="home-button home-button-primary" href="/products">לקניית ספרים</a>
              <a className="home-button home-button-secondary" href="/products?category=ספרים%20עם%20הטבעה%20אישית">ספרים עם הטבעה אישית</a>
            </div>
          </div>

          <div className="home-trust-panel" aria-label="יתרונות הקנייה במסורת">
            {trustItems.map(([title, text]) => (
              <article key={title} className="home-trust-card">
                <span aria-hidden="true" />
                <h2>{title}</h2>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-trust-strip">
        <div className="home-shell">
          <span>תשלום מאובטח</span>
          <span>משלוח לכל הארץ</span>
          <span>שירות אנושי וזמין</span>
          <span>אפשרות להטבעה אישית</span>
        </div>
      </section>

      {categoryCards.length > 0 && (
        <section className="home-section home-categories-section">
          <div className="home-shell">
            <div className="home-section-heading">
              <p>קטגוריות</p>
              <h2>מה תרצו למצוא?</h2>
            </div>
            <div className="home-category-grid">
              {categoryCards.map((category) => (
                <a
                  key={category.name}
                  className="home-category-card"
                  href={`/products?category=${encodeURIComponent(category.name)}`}
                >
                  <span className="home-category-icon" aria-hidden="true">{category.icon}</span>
                  <strong>{category.name}</strong>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="home-section">
        <div className="home-shell">
          <div className="home-section-heading">
            <p>אוסף נבחר</p>
            <h2>ספרים מומלצים</h2>
            <span>מוצרים נבחרים מתוך הקטלוג, בתצוגה מתחלפת ונוחה לסריקה.</span>
          </div>

          {products.length > 0 ? (
            <RotatingProductShowcase products={products} />
          ) : (
            <div className="home-empty-products">
              <strong>המוצרים בדרך אליך</strong>
              <span>הסריקה היומית תטען את הספרים בקרוב.</span>
            </div>
          )}

          <div className="home-centered-action">
            <a className="home-button home-button-primary" href="/products">לכל הספרים</a>
          </div>
        </div>
      </section>

      <section className="home-section home-why-section">
        <div className="home-shell">
          <div className="home-section-heading">
            <p>אמון ושירות</p>
            <h2>למה לקנות אצלנו?</h2>
          </div>
          <div className="home-why-grid">
            {whyItems.map(([title, text]) => (
              <article key={title} className="home-why-card">
                <span aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-reviews-section">
        <div className="home-shell home-reviews-heading">
          <p>לקוחות מספרים</p>
          <h2>מה אומרים עלינו</h2>
          <span>תצוגה קצרה ונקייה של חוויות לקוחות.</span>
        </div>
        <ReviewsCarousel />
      </section>

      <section className="home-bottom-cta">
        <div className="home-shell">
          <h2>מחפש ספר מסוים?</h2>
          <p>אפשר לחפש לפי שם הספר, מחבר, הוצאה או נושא, ואם צריך עזרה, אנחנו כאן.</p>
          <a className="home-button home-button-dark" href="/products">לחנות המלאה</a>
        </div>
      </section>
    </>
  )
}
