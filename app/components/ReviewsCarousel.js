'use client'

const ALL_REVIEWS = [
  { name: 'משה כהן', city: 'בני ברק', text: 'שירות מעולה, הספרים הגיעו מהר ובמצב מושלם. ממליץ בחום!', stars: 5 },
  { name: 'שרה לוי', city: 'ירושלים', text: 'מבחר עצום ומחירים הוגנים. הטבעת ההקדשה יצאה יפה מאוד.', stars: 5 },
  { name: 'אברהם ברקוביץ', city: 'אשדוד', text: 'קניתי סט שלם לבר מצווה של הבן. שירות אישי ומקצועי ברמה גבוהה.', stars: 5 },
  { name: 'חיים וינברג', city: 'אלעד', text: 'מחירים הכי טובים שמצאתי, ומוצרים אמיתיים. אין על זה.', stars: 5 },
  { name: 'מרים אדלר', city: 'מודיעין עילית', text: 'הזמנתי 20 ספרים עם הטבעה לחתונה — כולם התפעלו. תודה ענקית!', stars: 5 },
  { name: 'שמואל רוזנברג', city: 'בית שמש', text: 'קיבלתי את הספרים תוך יומיים. אריזה מהודרת ושירות ממש אישי.', stars: 5 },
  { name: 'לאה פרידמן', city: 'ביתר עילית', text: 'קניתי שש מחזורים לבר המצווה של הנכד. כולם שמחו מאוד.', stars: 5 },
  { name: 'אליהו גולדברג', city: 'רחובות', text: 'שירות הלקוחות ענה לי מייד ועזר לבחור. קנייה מהנה!', stars: 5 },
  { name: 'רבקה שפירא', city: 'פתח תקווה', text: 'הגעתי בהמלצה וממש לא מתאכזבת. שירות מצוין ומחירים הוגנים.', stars: 5 },
  { name: 'מרדכי זילברשטיין', city: 'גבעת שמואל', text: 'קניתי סט תנ"ך שלם — איכות מדהימה במחיר שלא מצאתי בשום מקום אחר.', stars: 5 },
  { name: 'חנה קופמן', city: 'נתניה', text: 'הזמנה ראשונה ובטח לא אחרונה. כל כך קל ונוח לקנות כאן.', stars: 5 },
  { name: 'ברוך שטיינמץ', city: 'צפת', text: 'הזמנתי ספר נדיר שלא מצאתי בשום חנות — כאן מצאתי!', stars: 5 },
  { name: 'דבורה ביינוש', city: 'טבריה', text: 'הטבעת הגלופה יצאה מושלמת. קיבלנו המון מחמאות בחתונה.', stars: 5 },
  { name: 'שלמה ליפשיץ', city: 'ראשון לציון', text: 'עשרות ספרים לאורחי השמחה עם הקדשה — כולם קיבלו ביידיים.', stars: 5 },
  { name: 'רחל טננבאום', city: 'חיפה', text: 'אתר נוח, תמונות ברורות, ומשלוח מהיר. בדיוק מה שחיפשתי.', stars: 5 },
  { name: 'יצחק הורוביץ', city: 'קרית גת', text: 'קיבלתי את החבילה ביום למחרת! שירות מדהים, ממליץ לכולם.', stars: 5 },
  { name: 'אסתר כץ', city: 'באר שבע', text: 'קניתי סידור מהודר לבת מצווה — יצא מדהים עם ההטבעה האישית.', stars: 5 },
  { name: 'מנחם שורר', city: 'לוד', text: 'ספרים איכותיים מאוד, בדיוק כמו בתמונה. כל הכבוד.', stars: 5 },
  { name: 'שושנה גרינברג', city: 'רמת גן', text: 'קניתי מתנה לחתן — הספר הגיע יפה ומהודר. המון תודה!', stars: 5 },
  { name: 'דב ריינר', city: 'ירושלים', text: 'האתר הכי מסודר שנתקלתי בו. חיפוש קל ומשלוח מהיר.', stars: 5 },
  { name: 'יהודית קרויס', city: 'אשקלון', text: 'קניתי כאן כמה פעמים ותמיד מרוצה. אמינות מלאה.', stars: 5 },
  { name: 'אהרן ויס', city: 'כפר סבא', text: 'תמחור הוגן, משלוח מהיר, ושירות אנושי אמיתי. תודה רבה!', stars: 5 },
  { name: 'נחמה שוורץ', city: 'בני ברק', text: 'מבחר הספרים פשוט עצום. מצאתי ספרים שלא ידעתי שקיימים!', stars: 5 },
  { name: 'גבריאל פרץ', city: 'פתח תקווה', text: 'האתר הכי טוב לספרי קודש. מחירים ושירות ללא תחרות.', stars: 5 },
  { name: 'פנינה אוחיון', city: 'אשדוד', text: 'הזמנתי ספרים לחינוך הילדים — בחירה מצוינת ומשלוח מסודר.', stars: 5 },
  { name: 'נחמן ברגר', city: 'רחובות', text: 'כבר הזמנה שלישית ותמיד מרוצה. שירות ברמה גבוהה מאוד.', stars: 5 },
  { name: 'ציפורה משה', city: 'נתניה', text: 'קניתי מתנה לחג — הגיעה מהר ועם אריזה יפה. ממליצה בחום!', stars: 5 },
  { name: 'יוסף אביב', city: 'חדרה', text: 'שירות אישי ומקצועי. עזרו לי לבחור את הספר המתאים.', stars: 5 },
  { name: 'טובה שלזינגר', city: 'ירושלים', text: 'קניתי ספרים לכל הכיתה — המחיר היה מצוין והמשלוח הגיע בזמן.', stars: 5 },
  { name: 'פינחס קלמן', city: 'בני ברק', text: 'חנות אמינה לחלוטין. כבר המלצתי לכל החברים שלי.', stars: 5 },
  { name: 'מזל בוזגלו', city: 'אור יהודה', text: 'הגעתי בהמלצה של שכנה ולא מתאכזבת. מחירים מצוינים!', stars: 5 },
  { name: 'אריה ביסמוט', city: 'נתיבות', text: 'תגובה מהירה לשאלות, משלוח מהיר, ומוצר מושלם. תודה!', stars: 5 },
  { name: 'גילה שמש', city: 'פתח תקווה', text: 'קניתי כאן סידורים לכל המשפחה. שירות חם ואישי.', stars: 5 },
  { name: 'אלחנן רוט', city: 'מודיעין', text: 'ספרים איכותיים, מחירים הוגנים, ומשלוח מהיר. מה עוד צריך?', stars: 5 },
  { name: 'עדינה כהן', city: 'רמלה', text: 'הזמנתי ספרים כמתנה לחג — כולם אהבו את הבחירה!', stars: 5 },
]

export default function ReviewsCarousel({ darkBg = true }) {
  const cardBg = darkBg ? 'rgba(255,255,255,0.06)' : '#F8F4EE'
  const cardBorder = darkBg ? '1px solid rgba(201,168,76,0.2)' : '1px solid #EDE6D9'
  const textColor = darkBg ? 'rgba(255,255,255,0.85)' : '#2C2416'
  const nameColor = darkBg ? '#fff' : '#2C2416'
  const cityColor = darkBg ? 'rgba(255,255,255,0.5)' : '#6B5C3E'
  const badgeBg = darkBg ? 'rgba(201,168,76,0.15)' : 'rgba(39,174,96,0.1)'
  const badgeColor = darkBg ? '#C9A84C' : '#27ae60'

  const doubled = [...ALL_REVIEWS, ...ALL_REVIEWS]

  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <style>{`
        @keyframes carousel-rtl {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .carousel-track-inner {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: carousel-rtl 120s linear infinite;
        }
        .carousel-track-inner:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="carousel-track-inner">
        {doubled.map((r, i) => (
          <div key={i} style={{
            background: cardBg,
            border: cardBorder,
            borderRadius: '8px',
            padding: '20px',
            width: '280px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ color: '#C9A84C', fontSize: '14px', letterSpacing: '2px', marginBottom: '10px' }}>
              {'★'.repeat(r.stars)}
            </div>
            <p style={{ fontSize: '13px', color: textColor, lineHeight: 1.8, marginBottom: '14px', flex: 1 }}>
              "{r.text}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #C9A84C, #8B6914)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: '700', fontSize: '13px', flexShrink: 0,
              }}>
                {r.name[0]}
              </div>
              <div>
                <div style={{ color: nameColor, fontWeight: '600', fontSize: '13px' }}>{r.name}</div>
                <div style={{ color: cityColor, fontSize: '11px' }}>{r.city}</div>
              </div>
              <span style={{ marginRight: 'auto', background: badgeBg, color: badgeColor, fontSize: '10px', padding: '2px 7px', borderRadius: '100px' }}>
                ✓ מאומת
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
