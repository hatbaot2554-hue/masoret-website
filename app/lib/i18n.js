export const LANGUAGES = {
  he: { code: 'he', dir: 'rtl', label: 'עברית' },
  en: { code: 'en', dir: 'ltr', label: 'English' },
}

const EXACT_TEXT = new Map([
  ['המרכז למסורת יהודית', 'Jewish Heritage Center'],
  ['ספרי קודש ויהדות', 'Jewish books and Judaica'],
  ['מאז תמיד', 'Since always'],
  ['משלוח חינם בהזמנה מעל ₪200 | שירות לקוחות: א׳-ה׳ 9:00-15:00', 'Free shipping over ₪200 | Customer service: Sun-Thu 9:00-15:00'],
  ['משלוח חינם מעל ₪200 | א׳-ה׳ 9:00-15:00', 'Free shipping over ₪200 | Sun-Thu 9:00-15:00'],
  ['ספרי קודש איכותיים — מהמדף שלנו לבית שלך', 'Quality Jewish books, from our shelves to your home'],
  ['ספרי קודש איכותיים —', 'Quality Jewish books —'],
  ['מהמדף שלנו לבית שלך', 'from our shelves to your home'],
  ['משלוח מהיר לכל הארץ, הטבעת הקדשה אישית, ושירות לקוחות שתמיד זמין לעזור. כי כל ספר קודש מגיע עם לב.', 'Fast shipping nationwide, personal dedication embossing, and customer service that is always ready to help. Every sacred book arrives with care.'],
  ['למעלה מ-5,000 ספרי קודש', 'Over 5,000 Jewish books'],
  ['כל הספרים', 'All books'],
  ['מעקב הזמנה', 'Track order'],
  ['צור קשר', 'Contact'],
  ['מועדפים', 'Wishlist'],
  ['עגלה', 'Cart'],
  ['אזור אישי', 'My account'],
  ['דף הבית', 'Home'],
  ['תקנון ותנאי שימוש', 'Terms and conditions'],
  ['ניווט מהיר', 'Quick navigation'],
  ['אמצעי תשלום', 'Payment options'],
  ['משלוח עד הבית', 'Home delivery'],
  ['הטבעה אישית', 'Personal embossing'],
  ['עד 6 תשלומים', 'Up to 6 payments'],
  ['שירות מעולה', 'Excellent service'],
  ['משלוח תוך 8 ימי עסקים', 'Delivery within 8 business days'],
  ['תשלום מאובטח', 'Secure payment'],
  ['איסוף עצמי זמין', 'Pickup available'],
  ['עד 6 תשלומים ללא ריבית', 'Up to 6 interest-free payments'],
  ['ביטול: 5% דמי ביטול', 'Cancellation fee: 5%'],
  ['לכל הספרים ←', 'All books ←'],
  ['רב-מכרים 🔥', 'Best sellers 🔥'],
  ['אוסף נבחר', 'Featured collection'],
  ['ספרים מומלצים', 'Recommended books'],
  ['הספרים הנמכרים והאהובים ביותר על הלקוחות שלנו', 'Our customers’ most popular and loved books'],
  ['חיפוש...', 'Search...'],
  ['חיפוש לפי שם או מק"ט...', 'Search by name or SKU...'],
  ['שם הספר או שם המחבר או חלק ממנו', 'Book title, author, or part of it'],
  ['חיפוש בתוך הדף', 'Search within this page'],
  ['מוצרים נמצאו', 'products found'],
  ['לא נמצאו מוצרים עבור', 'No products found for'],
  ['נסה מילה קצרה יותר או כתיב אחר.', 'Try a shorter word or a different spelling.'],
  ['שיחה', 'Chat'],
  ['AI יועץ קניות', 'AI shopping advisor'],
  ['שירות לקוחות', 'Customer service'],
  ['עזרה בהזמנות, מוצרים, משלוחים והחזרות', 'Help with orders, products, shipping and returns'],
  ['שלח', 'Send'],
  ['מספר הזמנה', 'Order number'],
  ['מייל להזמנה', 'Order email'],
  ['הוסף לסל', 'Add to cart'],
  ['לסל', 'Cart'],
  ['פרטים', 'Details'],
  ['תיאור הספר', 'Book description'],
  ['פרטי הספר', 'Book details'],
  ['אודות הספר', 'About this book'],
  ['מק"ט', 'SKU'],
  ['קטגוריה', 'Category'],
  ['מחבר', 'Author'],
  ['הוצאה', 'Publisher'],
  ['גודל', 'Size'],
  ['כריכה', 'Binding'],
  ['עמודים', 'Pages'],
  ['כמות', 'Quantity'],
  ['סה"כ', 'Total'],
  ['מבצע!', 'Sale!'],
  ['נוסף!', 'Added!'],
  ['נוסף לסל!', 'Added to cart!'],
  ['רכישה מהירה', 'Quick buy'],
  ['מוצר מאומת', 'Verified product'],
  ['ביקורות', 'reviews'],
  ['בית', 'Home'],
  ['ספרים', 'Books'],
  ['ספרי קודש ויודאיקה לבית היהודי', 'Jewish books and Judaica for the Jewish home'],
  ['ספרי קודש לבית, לישיבה ולמתנה', 'Jewish books for home, yeshiva and gifts'],
  ['במשלוח מהיר עד הבית', 'with fast delivery to your door'],
  ['מבחר גדול של ספרי קודש, סידורים, מחזורים, סטים מהודרים ומתנות יהודיות, עם שירות אנושי, אפשרות להטבעה אישית ותשלום מאובטח.', 'A wide selection of Jewish books, siddurim, machzorim, deluxe sets and Jewish gifts, with personal service, custom embossing and secure payment.'],
  ['חיפוש באתר', 'Site search'],
  ['חפש שם ספר, מחבר, הוצאה או נושא...', 'Search by book title, author, publisher or topic...'],
  ['חיפוש', 'Search'],
  ['לקניית ספרים', 'Shop books'],
  ['ספרים עם הטבעה אישית', 'Books with personal embossing'],
  ['מבחר גדול של ספרי קודש', 'A wide selection of Jewish books'],
  ['ספרים, סידורים, מחזורים, סטים מהודרים ומתנות יהודיות.', 'Books, siddurim, machzorim, deluxe sets and Jewish gifts.'],
  ['משלוח לכל הארץ', 'Nationwide delivery'],
  ['אפשרויות המשלוח מוצגות בצורה ברורה לפני סיום ההזמנה.', 'Shipping options are clearly shown before checkout.'],
  ['שירות אנושי וזמין', 'Personal, available service'],
  ['עזרה בבחירת ספר, מתנה או סט מתאים לכל צורך.', 'Help choosing the right book, gift or set for every need.'],
  ['אפשרות להטבעה אישית', 'Personal embossing available'],
  ['מתאים למזכרות, הקדשות ומתנות לאירועים.', 'Suitable for keepsakes, dedications and event gifts.'],
  ['קטגוריות', 'Categories'],
  ['מה תרצו למצוא?', 'What would you like to find?'],
  ['תתי קטגוריות', 'subcategories'],
  ['מוצרים נבחרים מתוך הקטלוג, בתצוגה מתחלפת ונוחה לסריקה.', 'Selected products from the catalog in an easy-to-scan rotating display.'],
  ['המוצרים בדרך אליך', 'Products are on the way'],
  ['הסריקה היומית תטען את הספרים בקרוב.', 'The daily sync will load the books soon.'],
  ['לכל הספרים', 'All books'],
  ['אמון ושירות', 'Trust and service'],
  ['למה לקנות אצלנו?', 'Why buy from us?'],
  ['מבחר רחב ומסודר', 'A wide, organized selection'],
  ['קטגוריות ברורות ותתי קטגוריות שמקלות למצוא בדיוק את הספר המתאים.', 'Clear categories and subcategories make it easy to find the right book.'],
  ['חוויית קנייה פשוטה', 'A simple shopping experience'],
  ['עמודי מוצר נקיים, כפתורי רכישה בולטים וסל קניות ברור.', 'Clean product pages, clear purchase buttons and an easy cart.'],
  ['תשלום מאובטח', 'Secure payment'],
  ['תהליך הזמנה נוח עם שמירה על פרטיות ותחושת ביטחון.', 'A convenient order process with privacy and confidence.'],
  ['מתאים לבית ולמתנה', 'For home and gifts'],
  ['ספרי קודש, יודאיקה, סידורים, מחזורים ומוצרים לאירועים.', 'Jewish books, Judaica, siddurim, machzorim and event items.'],
  ['שירות לפני ואחרי הקנייה', 'Service before and after purchase'],
  ['אפשרות לשאול, להתייעץ ולעקוב אחרי ההזמנה.', 'Ask questions, get advice and track your order.'],
  ['עיצוב נקי ומסורתי', 'Clean traditional design'],
  ['שפה חזותית רגועה, מכובדת ונוחה לקריאה בכל מסך.', 'A calm, respectful visual style that is easy to read on every screen.'],
  ['לקוחות מספרים', 'Customers share'],
  ['מה אומרים עלינו', 'What customers say'],
  ['תצוגה קצרה ונקייה של חוויות לקוחות.', 'A short, clean display of customer experiences.'],
  ['מחפש ספר מסוים?', 'Looking for a specific book?'],
  ['אפשר לחפש לפי שם הספר, מחבר, הוצאה או נושא, ואם צריך עזרה, אנחנו כאן.', 'You can search by book title, author, publisher or topic, and if you need help, we are here.'],
  ['לחנות המלאה', 'Full store'],
])

const TERM_TRANSLATIONS = [
  ['שולחן ערוך', 'Shulchan Aruch'],
  ['משנה ברורה', 'Mishnah Berurah'],
  ['משנה תורה', 'Mishneh Torah'],
  ['אור החיים', 'Or HaChaim'],
  ['בן איש חי', 'Ben Ish Chai'],
  ['ילקוט יוסף', 'Yalkut Yosef'],
  ['חפץ חיים', 'Chafetz Chaim'],
  ['משניות', 'Mishnayot'],
  ['משנה', 'Mishnah'],
  ['גמרא', 'Gemara'],
  ['ש"ס', 'Talmud set'],
  ['תלמוד', 'Talmud'],
  ['סידור', 'Siddur'],
  ['מחזור', 'Machzor'],
  ['תהילים', 'Tehillim'],
  ['תנ"ך', 'Tanach'],
  ['חומש', 'Chumash'],
  ['זוהר', 'Zohar'],
  ['קבלה', 'Kabbalah'],
  ['חסידות', 'Chassidut'],
  ['מוסר', 'Mussar'],
  ['הלכה', 'Halacha'],
  ['שו"ת', 'Responsa'],
  ['ראשונים', 'Rishonim'],
  ['אחרונים', 'Acharonim'],
  ['רמב"ם', 'Rambam'],
  ['רש"י', 'Rashi'],
  ['רמב"ן', 'Ramban'],
  ['הגדה', 'Haggadah'],
  ['מגילת רות', 'Megillat Ruth'],
  ['ראש השנה', 'Rosh Hashanah'],
  ['יום כיפור', 'Yom Kippur'],
  ['סוכות', 'Sukkot'],
  ['שבועות', 'Shavuot'],
  ['פסח', 'Pesach'],
  ['פורים', 'Purim'],
  ['חנוכה', 'Chanukah'],
  ['שבת', 'Shabbat'],
  ['פרשת השבוע', 'Weekly Torah portion'],
  ['מזכרות לאירועים', 'Event gifts'],
  ['כלי כסף', 'Silverware'],
  ['יודאיקה ומוצרי יהדות', 'Judaica and Jewish items'],
  ['תשמישי קדושה', 'Sacred articles'],
  ['סיפורים וגדולי ישראל', 'Stories and Jewish sages'],
  ['חידושים, מערכות, דקדוק', 'Novellae, study systems and grammar'],
  ['חגים ומועדים', 'Holidays'],
  ['מחשבה ומוסר', 'Jewish thought and Mussar'],
  ['גמרא ומשנה', 'Gemara and Mishnah'],
  ['תנ"ך ומפרשיו', 'Tanach and commentaries'],
  ['טור ושו"ע', 'Tur and Shulchan Aruch'],
  ['הלכה ושו"ת', 'Halacha and Responsa'],
  ['רמב"ם וספרי הראשונים', 'Rambam and Rishonim'],
  ['סידורים, מחזורים, חומשים ותהילים', 'Siddurim, Machzorim, Chumashim and Tehillim'],
  ['זוהר, קבלה וחסידות', 'Zohar, Kabbalah and Chassidut'],
  ['כריכה קשה', 'hardcover'],
  ['כריכה רכה', 'softcover'],
  ['כריכה', 'binding'],
  ['עור', 'leather'],
  ['סקאי', 'faux leather'],
  ['מפואר', 'deluxe'],
  ['מהודר', 'deluxe'],
  ['גדול', 'large'],
  ['קטן', 'small'],
  ['כיס', 'pocket'],
  ['סט', 'set'],
  ['חלק', 'volume'],
  ['עם', 'with'],
  ['ללא', 'without'],
  ['ביאור', 'commentary'],
  ['פירוש', 'commentary'],
  ['הרב', 'Rabbi'],
  ['רבי', 'Rabbi'],
  ['ספר', 'book'],
  ['ספרי', 'books'],
  ['מנוקד', 'vocalized'],
  ['חדש', 'new'],
  ['נמכר ביותר', 'best seller'],
]

const SORTED_TERMS = TERM_TRANSLATIONS.sort((a, b) => b[0].length - a[0].length)

const LETTERS = {
  א: 'a', ב: 'b', ג: 'g', ד: 'd', ה: 'h', ו: 'v', ז: 'z', ח: 'ch', ט: 't',
  י: 'y', כ: 'ch', ך: 'ch', ל: 'l', מ: 'm', ם: 'm', נ: 'n', ן: 'n', ס: 's',
  ע: 'a', פ: 'p', ף: 'f', צ: 'tz', ץ: 'tz', ק: 'k', ר: 'r', ש: 'sh', ת: 't',
}

export function stripHtml(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

export function translateText(value, lang = 'he') {
  const source = String(value || '')
  if (lang !== 'en' || !source) return source

  const clean = stripHtml(source)
  if (EXACT_TEXT.has(clean)) return EXACT_TEXT.get(clean)

  let translated = clean
  SORTED_TERMS.forEach(([he, en]) => {
    translated = translated.split(he).join(en)
  })

  translated = translated
    .replace(/מק"?ט/g, 'SKU')
    .replace(/ש["״]ח/g, 'NIS')
    .replace(/₪/g, '₪')
    .replace(/\s+/g, ' ')
    .trim()

  if (/[\u0590-\u05FF]/.test(translated)) {
    translated = transliterateHebrew(translated)
  }

  return translated || clean
}

export function translateProductName(product, lang = 'he') {
  return translateText(product?.name || '', lang)
}

export function translateCategoryName(name, lang = 'he') {
  return translateText(name || '', lang)
}

export function translateProductField(value, lang = 'he') {
  return translateText(stripHtml(value), lang)
}

export function transliterateHebrew(value) {
  return String(value || '')
    .split('')
    .map((char) => LETTERS[char] || char)
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
}
