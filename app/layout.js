import './globals.css'
import { CartProvider } from './components/CartContext'
import { WishlistProvider } from './components/WishlistContext'
import Header from './components/Header'
import AccessibilityWidget from './components/AccessibilityWidget'

export const metadata = {
  title: 'המרכז למסורת יהודית — ספרי קודש ויהדות',
  description: 'מבחר עשיר של ספרי קודש, יהדות ומסורת. משלוח מהיר לכל הארץ.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <CartProvider>
          <WishlistProvider>
            <Header />
            <main>{children}</main>
            <footer style={{ background: 'var(--navy)', borderTop: '2px solid var(--gold)', color: 'rgba(255,255,255,0.7)', padding: '48px 0 24px', marginTop: '80px' }}>
              <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '32px' }}>
                  <div>
                    <div style={{ color: '#C9A84C', fontFamily: 'Frank Ruhl Libre, serif', fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>המרכז למסורת יהודית</div>
                    <div style={{ fontSize: '13px', lineHeight: 2, color: 'rgba(255,255,255,0.6)' }}>
                      מבחר של למעלה מ-5,000 ספרי קודש, הלכה, חסידות ומחשבה יהודית.<br />
                      משלוח מהיר לכל הארץ.
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#C9A84C', fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>ניווט מהיר</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {[
                        { href: '/', label: 'דף הבית' },
                        { href: '/products', label: 'כל הספרים' },
                        { href: '/cart', label: 'עגלת קניות' },
                        { href: '/account', label: 'אזור אישי' },
                        { href: '/terms', label: 'תקנון ותנאי שימוש' },
                      ].map(({ href, label }) => (
                        <a key={href} href={href} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px' }}>{label}</a>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#C9A84C', fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>צור קשר</div>
                    <div style={{ fontSize: '13px', lineHeight: 2, color: 'rgba(255,255,255,0.6)' }}>
                      <div>📧 hatbaot2554@gmail.com</div>
                      <div>📦 משלוח תוך 8 ימי עסקים</div>
                      <div>↩️ ביטול: 5% דמי ביטול</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#C9A84C', fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>אמצעי תשלום</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 2 }}>
                      <div>💳 עד 6 תשלומים ללא ריבית</div>
                      <div>🔒 תשלום מאובטח</div>
                      <div>🏠 איסוף עצמי זמין</div>
                    </div>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                  © 2024 המרכז למסורת יהודית — כל הזכויות שמורות |{' '}
                  <a href="/terms" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>תקנון ותנאי שימוש</a>
                </div>
              </div>
            </footer>
            <AccessibilityWidget />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  )
}
