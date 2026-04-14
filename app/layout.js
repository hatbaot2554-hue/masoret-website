import './globals.css'
import { CartProvider } from './components/CartContext'
import Header from './components/Header'

export const metadata = {
  title: 'המרכז למסורת יהודית — ספרי קודש ויהדות',
  description: 'מבחר עשיר של ספרי קודש, יהדות ומסורת. משלוח מהיר לכל הארץ.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <footer style={{ background: 'var(--navy)', borderTop: '2px solid var(--gold)', color: 'rgba(255,255,255,0.7)', padding: '32px 0 24px', marginTop: '80px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
              © 2024 המרכז למסורת יהודית — כל הזכויות שמורות
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  )
}
