import './globals.css'
import { CartProvider } from './components/CartContext'
import { WishlistProvider } from './components/WishlistContext'
import Header from './components/Header'
import AccessibilityWidget from './components/AccessibilityWidget'
import AIChatWidget from './components/AIChatWidget'
import { LanguageProvider } from './components/LanguageRuntime'

const languageFallbackScript = `
(function () {
  if (window.__masoretLanguageFallback) return;
  window.__masoretLanguageFallback = true;

  var map = {
    'המרכז למסורת יהודית': 'Jewish Heritage Center',
    'ספרי קודש ויהדות': 'Jewish books and Judaica',
    'מאז תמיד': 'Since always',
    'משלוח חינם בהזמנה מעל ₪200 | שירות לקוחות: א׳-ה׳ 9:00-15:00': 'Free shipping over ₪200 | Customer service: Sun-Thu 9:00-15:00',
    'משלוח חינם מעל ₪200 | א׳-ה׳ 9:00-15:00': 'Free shipping over ₪200 | Sun-Thu 9:00-15:00',
    'ספרי קודש איכותיים — מהמדף שלנו לבית שלך': 'Quality Jewish books, from our shelves to your home',
    'ספרי קודש איכותיים —': 'Quality Jewish books —',
    'מהמדף שלנו לבית שלך': 'from our shelves to your home',
    'משלוח מהיר לכל הארץ, הטבעת הקדשה אישית, ושירות לקוחות שתמיד זמין לעזור. כי כל ספר קודש מגיע עם לב.': 'Fast shipping nationwide, personal dedication embossing, and customer service that is always ready to help. Every sacred book arrives with care.',
    'למעלה מ-5,000 ספרי קודש': 'Over 5,000 Jewish books',
    'כל הספרים': 'All books',
    'מעקב הזמנה': 'Track order',
    'צור קשר': 'Contact',
    'מועדפים': 'Wishlist',
    'עגלה': 'Cart',
    'אזור אישי': 'My account',
    'דף הבית': 'Home',
    'תקנון ותנאי שימוש': 'Terms and conditions',
    'ניווט מהיר': 'Quick navigation',
    'אמצעי תשלום': 'Payment options',
    'משלוח עד הבית': 'Home delivery',
    'הטבעה אישית': 'Personal embossing',
    'עד 6 תשלומים': 'Up to 6 payments',
    'שירות מעולה': 'Excellent service',
    'לכל הספרים ←': 'All books ←',
    'רב-מכרים 🔥': 'Best sellers 🔥',
    'אוסף נבחר': 'Featured collection',
    'ספרים מומלצים': 'Recommended books',
    'הספרים הנמכרים והאהובים ביותר על הלקוחות שלנו': 'Our customers’ most popular and loved books',
    'חיפוש...': 'Search...',
    'חיפוש לפי שם או מק"ט...': 'Search by name or SKU...',
    'שם הספר או שם המחבר או חלק ממנו': 'Book title, author, or part of it',
    'שיחה': 'Chat',
    'AI יועץ קניות': 'AI shopping advisor',
    'שירות לקוחות': 'Customer service',
    'שלח': 'Send'
  };
  var entries = Object.keys(map).sort(function (a, b) { return b.length - a.length; }).map(function (key) { return [key, map[key]]; });
  var originalText = new WeakMap();
  var originalAttrs = new WeakMap();

  function translate(value) {
    return entries.reduce(function (next, item) { return next.split(item[0]).join(item[1]); }, String(value || ''));
  }

  function apply(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
    document.body.dataset.lang = lang;

    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentElement;
        if (!parent || !String(node.nodeValue || '').trim()) return NodeFilter.FILTER_REJECT;
        if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE'].indexOf(parent.tagName) !== -1) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      if (!originalText.has(node)) originalText.set(node, node.nodeValue);
      var source = originalText.get(node);
      node.nodeValue = lang === 'en' ? translate(source) : source;
    });

    document.querySelectorAll('input[placeholder], textarea[placeholder], [aria-label], [title]').forEach(function (element) {
      if (!originalAttrs.has(element)) originalAttrs.set(element, {});
      var originals = originalAttrs.get(element);
      ['placeholder', 'aria-label', 'title'].forEach(function (attr) {
        if (!element.hasAttribute(attr)) return;
        if (!originals[attr]) originals[attr] = element.getAttribute(attr);
        element.setAttribute(attr, lang === 'en' ? translate(originals[attr]) : originals[attr]);
      });
    });

    document.querySelectorAll('[data-masoret-lang]').forEach(function (button) {
      var active = button.getAttribute('data-masoret-lang') === lang;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  document.addEventListener('click', function (event) {
    var button = event.target && event.target.closest ? event.target.closest('[data-masoret-lang]') : null;
    if (!button) return;
    event.preventDefault();
    apply(button.getAttribute('data-masoret-lang') === 'en' ? 'en' : 'he');
  }, true);
})();
`

const fullSiteTranslateScript = `
(function () {
  if (window.__masoretFullSiteTranslate) return;
  window.__masoretFullSiteTranslate = true;

  function setTranslateCookie(value) {
    var expires = 'expires=Fri, 31 Dec 9999 23:59:59 GMT';
    document.cookie = 'googtrans=' + value + ';path=/;' + expires;
    document.cookie = 'googtrans=' + value + ';path=/;domain=' + window.location.hostname + ';' + expires;
    if (window.location.hostname.split('.').length > 2) {
      var rootDomain = '.' + window.location.hostname.split('.').slice(-2).join('.');
      document.cookie = 'googtrans=' + value + ';path=/;domain=' + rootDomain + ';' + expires;
    }
  }

  function clearTranslateCookie() {
    ['googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT',
     'googtrans=;path=/;domain=' + window.location.hostname + ';expires=Thu, 01 Jan 1970 00:00:00 GMT',
     'googtrans=;path=/;domain=.' + window.location.hostname.split('.').slice(-2).join('.') + ';expires=Thu, 01 Jan 1970 00:00:00 GMT'
    ].forEach(function (cookie) { document.cookie = cookie; });
  }

  function ensureTranslateContainer() {
    var container = document.getElementById('google_translate_element');
    if (!container) {
      container = document.createElement('div');
      container.id = 'google_translate_element';
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = '1px';
      container.style.height = '1px';
      container.style.overflow = 'hidden';
      document.body.appendChild(container);
    }
    return container;
  }

  function activateEnglishSelect() {
    var combo = document.querySelector('.goog-te-combo');
    if (!combo) return false;
    combo.value = 'en';
    combo.dispatchEvent(new Event('change'));
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    document.body.dataset.lang = 'en';
    document.querySelectorAll('[data-masoret-lang]').forEach(function (button) {
      var active = button.getAttribute('data-masoret-lang') === 'en';
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    return true;
  }

  function loadGoogleTranslate() {
    ensureTranslateContainer();
    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement({
        pageLanguage: 'iw',
        includedLanguages: 'en,iw,he',
        autoDisplay: false
      }, 'google_translate_element');
      var tries = 0;
      var timer = setInterval(function () {
        tries += 1;
        if (activateEnglishSelect() || tries > 30) clearInterval(timer);
      }, 300);
    };
    if (!document.querySelector('script[src*="translate_a/element.js"]')) {
      var script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }
  }

  function translateToEnglish() {
    setTranslateCookie('/iw/en');
    loadGoogleTranslate();
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (activateEnglishSelect() || tries > 40) clearInterval(timer);
    }, 250);
  }

  function restoreHebrew() {
    clearTranslateCookie();
    window.location.reload();
  }

  document.addEventListener('click', function (event) {
    var button = event.target && event.target.closest ? event.target.closest('[data-masoret-lang]') : null;
    if (!button) return;
    event.preventDefault();
    var lang = button.getAttribute('data-masoret-lang');
    if (lang === 'en') {
      translateToEnglish();
    } else {
      restoreHebrew();
    }
  }, true);

  if (document.cookie.indexOf('googtrans=/iw/en') !== -1 || document.cookie.indexOf('googtrans=/he/en') !== -1) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', translateToEnglish);
    } else {
      translateToEnglish();
    }
  }
})();
`

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
              <AIChatWidget />
              <AccessibilityWidget />
            </WishlistProvider>
          </CartProvider>
        </LanguageProvider>
        <script dangerouslySetInnerHTML={{ __html: languageFallbackScript }} />
        <script dangerouslySetInnerHTML={{ __html: fullSiteTranslateScript }} />
      </body>
    </html>
  )
}
