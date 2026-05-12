import './globals.css'
import { CartProvider } from './components/CartContext'
import { WishlistProvider } from './components/WishlistContext'
import Header from './components/Header'
import AccessibilityWidget from './components/AccessibilityWidget'
import AIChatWidget from './components/AIChatWidget'
import { LanguageProvider } from './components/LanguageRuntime'

export const metadata = {
  title: 'המרכז למסורת יהודית — ספרי קודש ויהדות',
  description: 'מבחר עשיר של ספרי קודש, יהדות ומסורת. משלוח מהיר לכל הארץ.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <LanguageProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              <main>{children}</main>
              <footer className="site-footer">
                <div className="site-footer-inner">
                  <section>
                    <h3 data-i18n-he="המרכז למסורת יהודית" data-i18n-en="Jewish Heritage Center">המרכז למסורת יהודית</h3>
                    <p data-i18n-he="מבחר של למעלה מ-5,000 ספרי קודש, הלכה, חסידות ומחשבה יהודית. משלוח מהיר לכל הארץ." data-i18n-en="A selection of over 5,000 Jewish books, Halacha, Chassidut and Jewish thought. Fast shipping nationwide.">
                      מבחר של למעלה מ-5,000 ספרי קודש, הלכה, חסידות ומחשבה יהודית. משלוח מהיר לכל הארץ.
                    </p>
                  </section>
                  <section>
                    <h3 data-i18n-he="ניווט מהיר" data-i18n-en="Quick navigation">ניווט מהיר</h3>
                    <a href="/" data-i18n-he="דף הבית" data-i18n-en="Home">דף הבית</a>
                    <a href="/products" data-i18n-he="כל הספרים" data-i18n-en="All books">כל הספרים</a>
                    <a href="/cart" data-i18n-he="עגלה" data-i18n-en="Cart">עגלה</a>
                    <a href="/account" data-i18n-he="אזור אישי" data-i18n-en="My account">אזור אישי</a>
                    <a href="/terms" data-i18n-he="תקנון ותנאי שימוש" data-i18n-en="Terms and conditions">תקנון ותנאי שימוש</a>
                  </section>
                  <section>
                    <h3 data-i18n-he="צור קשר" data-i18n-en="Contact">צור קשר</h3>
                    <p>hatbaot2554@gmail.com</p>
                    <p data-i18n-he="משלוח תוך 8 ימי עסקים" data-i18n-en="Delivery within 8 business days">משלוח תוך 8 ימי עסקים</p>
                    <p data-i18n-he="ביטול: 5% דמי ביטול" data-i18n-en="Cancellation fee: 5%">ביטול: 5% דמי ביטול</p>
                  </section>
                  <section>
                    <h3 data-i18n-he="אמצעי תשלום" data-i18n-en="Payment options">אמצעי תשלום</h3>
                    <p data-i18n-he="עד 6 תשלומים ללא ריבית" data-i18n-en="Up to 6 interest-free payments">עד 6 תשלומים ללא ריבית</p>
                    <p data-i18n-he="תשלום מאובטח" data-i18n-en="Secure payment">תשלום מאובטח</p>
                    <p data-i18n-he="איסוף עצמי זמין" data-i18n-en="Pickup available">איסוף עצמי זמין</p>
                  </section>
                </div>
                <div className="site-footer-bottom">
                  © 2024 המרכז למסורת יהודית — כל הזכויות שמורות
                </div>
              </footer>
              <AIChatWidget />
              <AccessibilityWidget />
            </WishlistProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
