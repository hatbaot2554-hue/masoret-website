'use client'

import { useLanguage } from './LanguageRuntime'

const FEATURED_REVIEWS = [
  {
    name: 'יעקב מ׳',
    nameEn: 'Yaakov M.',
    city: 'בני ברק',
    cityEn: 'Bnei Brak',
    tag: 'סידור',
    tagEn: 'Siddur',
    initial: 'י',
    text: 'שירות מצוין. הספר הגיע ארוז יפה ובמהירות, וההטבעה האישית יצאה מדויק כפי שביקשנו.',
    textEn: 'Excellent service. The book arrived beautifully packed and quickly, and the personal embossing came out exactly as requested.',
  },
  {
    name: 'שרה ל׳',
    nameEn: 'Sarah L.',
    city: 'ירושלים',
    cityEn: 'Jerusalem',
    tag: 'סט בר מצווה',
    tagEn: 'Bar Mitzvah set',
    initial: 'ש',
    text: 'קיבלתי ייעוץ אמיתי לפני הקנייה. המוכר עזר לי לבחור את המהדורה הנכונה לבן שלי לבר מצווה.',
    textEn: 'I received real advice before buying. They helped me choose the right edition for my son’s Bar Mitzvah.',
  },
  {
    name: 'אברהם ב׳',
    nameEn: 'Avraham B.',
    city: 'אשדוד',
    cityEn: 'Ashdod',
    tag: 'מתנה',
    tagEn: 'Gift',
    initial: 'א',
    text: 'הזמנתי כמה ספרים עם הטבעה לחנות אביין. כל הספרים הגיעו מסודרים, באריזה הולמת. ממליץ.',
    textEn: 'I ordered several embossed books as gifts. Everything arrived neatly packed and respectfully presented. Recommended.',
  },
  {
    name: 'דוד ק׳',
    nameEn: 'David K.',
    city: 'חיפה',
    cityEn: 'Haifa',
    tag: 'מחזור',
    tagEn: 'Machzor',
    initial: 'ד',
    text: 'חיפשתי מחזור עם פירוש ספציפי שלא מצאתי בחנויות אחרות. כאן היה במלאי והגיע תוך יומיים.',
    textEn: 'I was looking for a machzor with a specific commentary that I could not find elsewhere. It was in stock here and arrived within two days.',
  },
  {
    name: 'מרים פ׳',
    nameEn: 'Miriam F.',
    city: 'מודיעין עילית',
    cityEn: 'Modi’in Illit',
    tag: 'תהילים',
    tagEn: 'Tehillim',
    initial: 'מ',
    text: 'מחירים הוגנים בלי הפתעות. הקנייה הייתה פשוטה, התשלום בתשלומים עבד חלק, וקיבלתי עדכון על המשלוח.',
    textEn: 'Fair prices with no surprises. Checkout was simple, installments worked smoothly, and I received shipping updates.',
  },
  {
    name: 'לאה צ׳',
    nameEn: 'Leah T.',
    city: 'ביתר עילית',
    cityEn: 'Beitar Illit',
    tag: 'סט מתנה',
    tagEn: 'Gift set',
    initial: 'ל',
    text: 'שירות לקוחות מצוין. התקשרתי לשאול שאלה לפני ההזמנה, ענו בסבלנות והסבירו את כל ההבדלים בין המהדורות.',
    textEn: 'Excellent customer service. I called with a question before ordering, and they patiently explained the differences between the editions.',
  },
]

export default function ReviewsCarousel() {
  const { isEnglish } = useLanguage()

  return (
    <div className="reviews-grid-wrap">
      <div className="reviews-grid">
        {FEATURED_REVIEWS.map((review) => (
          <article className="review-card-static" key={review.name}>
            <div className="review-stars" aria-label="5 כוכבים">★★★★★</div>
            <p className="review-text">"{isEnglish ? review.textEn : review.text}"</p>
            <div className="review-divider" />
            <div className="review-person">
              <span className="review-initial" aria-hidden="true">{review.initial}</span>
              <div>
                <strong>{isEnglish ? review.nameEn : review.name}</strong>
                <small>{isEnglish ? review.cityEn : review.city}</small>
              </div>
              <em>{isEnglish ? review.tagEn : review.tag}</em>
            </div>
          </article>
        ))}
      </div>
      <a className="reviews-more-link" href="/contact">{isEnglish ? 'All reviews' : 'לכל הביקורות ←'}</a>
    </div>
  )
}
