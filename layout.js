import './globals.css'

export const metadata = {
  title: 'המרכז למסורת יהודית — ספרי קודש ויהדות',
  description: 'מבחר עשיר של ספרי קודש, יהדות ומסורת. משלוח מהיר לכל הארץ.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

function Header() {
  return (
    <header style={{
      background: 'var(--navy)',
      borderBottom: '2px solid var(--gold)',
    }}>
      {/* פס עליון */}
      <div style={{
        background: 'var(--gold)',
        color: 'var(--navy)',
        textAlign: 'center',
        fontSize: '13px',
        fontWeight: '500',
        padding: '6px',
        letterSpacing: '0.05em',
      }}>
        משלוח חינם בהזמנה מעל ₪200 | שירות לקוחות: א׳-ה׳ 9:00-15:00
      </div>

      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px',
      }}>
        {/* לוגו */}
        <a href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{
              fontFamily: 'Frank Ruhl Libre, serif',
              fontSize: '26px',
              fontWeight: '900',
              color: 'var(--gold)',
              lineHeight: 1.1,
            }}>
              המרכז למסורת יהודית
            </span>
            <span style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '0.08em',
            }}>
              ספרי קודש ויהדות • מאז תמיד
            </span>
          </div>
        </a>

        {/* ניווט */}
        <nav style={{ display: 'flex', gap: '32px' }}>
          {[
            { label: 'כל הספרים', href: '/products' },
            { label: 'קטגוריות', href: '/categories' },
            { label: 'מעקב הזמנה', href: '/track' },
            { label: 'צור קשר', href: '/contact' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: '400',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--gold)'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.8)'}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* עגלה */}
        <a href="/cart" style={{
          background: 'var(--gold)',
          color: 'var(--navy)',
          padding: '10px 20px',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          🛒 עגלת קניות
        </a>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer style={{
      background: 'var(--navy)',
      borderTop: '2px solid var(--gold)',
      color: 'rgba(255,255,255,0.7)',
      padding: '48px 0 24px',
      marginTop: '80px',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '48px',
          marginBottom: '40px',
        }}>
          <div>
            <h3 style={{ color: 'var(--gold)', marginBottom: '16px', fontSize: '18px' }}>
              המרכז למסורת יהודית
            </h3>
            <p style={{ fontSize: '14px', lineHeight: 1.8 }}>
              מבחר עשיר של ספרי קודש, הלכה, חסידות ומחשבה יהודית. 
              איכות ומסורת בכל ספר.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'var(--gold)', marginBottom: '16px' }}>קטגוריות</h4>
            <ul style={{ listStyle: 'none', fontSize: '14px', lineHeight: 2.2 }}>
              <li><a href="/products?category=halacha" style={{ color: 'inherit', textDecoration: 'none' }}>ספרי הלכה</a></li>
              <li><a href="/products?category=chasidut" style={{ color: 'inherit', textDecoration: 'none' }}>חסידות</a></li>
              <li><a href="/products?category=machshava" style={{ color: 'inherit', textDecoration: 'none' }}>מחשבת ישראל</a></li>
              <li><a href="/products?category=shas" style={{ color: 'inherit', textDecoration: 'none' }}>ש"ס ותלמוד</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'var(--gold)', marginBottom: '16px' }}>פרטי קשר</h4>
            <ul style={{ listStyle: 'none', fontSize: '14px', lineHeight: 2.2 }}>
              <li>📞 שירות לקוחות: א׳-ה׳ 9:00-15:00</li>
              <li>📦 משלוח לכל הארץ</li>
              <li>✉️ info@masoret-yehudit.co.il</li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.15)',
          paddingTop: '20px',
          textAlign: 'center',
          fontSize: '13px',
          color: 'rgba(255,255,255,0.4)',
        }}>
          © 2024 המרכז למסורת יהודית — כל הזכויות שמורות
        </div>
      </div>
    </footer>
  )
}
