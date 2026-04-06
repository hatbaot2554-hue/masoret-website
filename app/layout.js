import './globals.css'

export const metadata = {
  title: 'המרכז למסורת יהודית — ספרי קודש ויהדות',
  description: 'מבחר עשיר של ספרי קודש, יהדות ומסורת. משלוח מהיר לכל הארץ.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <header style={{background:'var(--navy)',borderBottom:'2px solid var(--gold)'}}>
          <div style={{background:'var(--gold)',color:'var(--navy)',textAlign:'center',fontSize:'13px',fontWeight:'500',padding:'6px'}}>
            משלוח חינם בהזמנה מעל ₪200 | שירות לקוחות: א׳-ה׳ 9:00-15:00
          </div>
          <div style={{maxWidth:'1200px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 24px'}}>
            <a href="/" style={{textDecoration:'none'}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end'}}>
                <span style={{fontFamily:'serif',fontSize:'26px',fontWeight:'900',color:'var(--gold)',lineHeight:1.1}}>המרכז למסורת יהודית</span>
                <span style={{fontSize:'12px',color:'rgba(255,255,255,0.6)'}}>ספרי קודש ויהדות • מאז תמיד</span>
              </div>
            </a>
            <nav style={{display:'flex',gap:'32px'}}>
              <a href="/products" style={{color:'rgba(255,255,255,0.8)',textDecoration:'none',fontSize:'15px'}}>כל הספרים</a>
              <a href="/track" style={{color:'rgba(255,255,255,0.8)',textDecoration:'none',fontSize:'15px'}}>מעקב הזמנה</a>
              <a href="/contact" style={{color:'rgba(255,255,255,0.8)',textDecoration:'none',fontSize:'15px'}}>צור קשר</a>
            </nav>
            <a href="/cart" style={{background:'var(--gold)',color:'var(--navy)',padding:'10px 20px',textDecoration:'none',fontSize:'14px',fontWeight:'500'}}>🛒 עגלה</a>
          </div>
        </header>
        <main>{children}</main>
        <footer style={{background:'var(--navy)',borderTop:'2px solid var(--gold)',color:'rgba(255,255,255,0.7)',padding:'32px 0 24px',marginTop:'80px'}}>
          <div style={{maxWidth:'1200px',margin:'0 auto',padding:'0 24px',textAlign:'center',fontSize:'13px',color:'rgba(255,255,255,0.4)'}}>
            © 2024 המרכז למסורת יהודית — כל הזכויות שמורות
          </div>
        </footer>
      </body>
    </html>
  )
}
