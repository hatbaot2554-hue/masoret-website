export default function AccessibilityStatementPage() {
  const updated = '25.05.2026'

  const sections = [
    {
      title: 'רמת הנגישות באתר',
      items: [
        'האתר פועל לשיפור התאמות הנגישות בהתאם לתקן הישראלי 5568, המבוסס על WCAG 2.0 ברמה AA.',
        'בוצעו התאמות בסיסיות לניווט מקלדת, ניגודיות צבעים, הדגשת קישורים, שינוי גודל טקסט, טקסט חלופי לתמונות מרכזיות ושפה/כיוון עמוד.',
        'ייתכנו אזורים או תכנים שמקורם במערכות חיצוניות או בתוכן מוצר משתנה שעדיין אינם מונגשים במלואם.',
      ],
    },
    {
      title: 'כלי נגישות באתר',
      items: [
        'באתר מופיע כפתור נגישות קבוע שמאפשר הגדלה והקטנה של טקסט, ניגודיות גבוהה, גווני אפור, הדגשת קישורים וסמן מוגדל.',
        'ניתן לנווט באתר באמצעות מקלדת. קישור “דלג לתוכן המרכזי” מופיע בתחילת העמוד בעת ניווט מקלדת.',
        'האתר מותאם למסכים שונים, כולל טלפון, טאבלט ומסכי מחשב.',
      ],
    },
    {
      title: 'פנייה בנושא נגישות',
      items: [
        'אם נתקלת בקושי נגישות באתר, נשמח לקבל פנייה ונפעל לתיקון בהקדם האפשרי.',
        'יש לציין בפנייה את כתובת העמוד, תיאור הבעיה, סוג הדפדפן והמכשיר, ואם נעשה שימוש בטכנולוגיה מסייעת.',
      ],
    },
  ]

  return (
    <div style={{ padding: '60px 0', background: '#F8F4EE', minHeight: '100vh' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 32px' }}>
        <h1 style={{ fontFamily: 'Frank Ruhl Libre, serif', fontSize: '36px', fontWeight: 900, marginBottom: '8px', color: '#1A2332' }}>
          הצהרת נגישות
        </h1>
        <p style={{ color: '#6B5C3E', marginBottom: '32px', fontSize: '14px' }}>עודכן לאחרונה: {updated}</p>

        <div style={{ background: '#fff', border: '1px solid #EDE6D9', borderRadius: '8px', padding: '40px', lineHeight: 2, color: '#2C2416', fontSize: '15px' }}>
          <p style={{ marginBottom: '24px' }}>
            המרכז למסורת יהודית רואה חשיבות רבה במתן שירות שוויוני ונגיש לכלל המשתמשים, ופועל לשיפור חוויית הגלישה עבור אנשים עם מוגבלות.
          </p>

          {sections.map((section) => (
            <section key={section.title} style={{ marginBottom: '30px' }}>
              <h2 style={{ fontFamily: 'Frank Ruhl Libre, serif', fontSize: '21px', color: '#1A2332', borderBottom: '2px solid #EDE6D9', paddingBottom: '8px', marginBottom: '12px' }}>
                {section.title}
              </h2>
              <ul style={{ paddingRight: '20px', margin: 0 }}>
                {section.items.map((item) => <li key={item} style={{ marginBottom: '8px' }}>{item}</li>)}
              </ul>
            </section>
          ))}

          <div style={{ background: '#F8F4EE', border: '1px solid #EDE6D9', borderRadius: '6px', padding: '16px', marginTop: '24px' }}>
            <strong>רכז נגישות ופניות:</strong>
            <br />
            דוא״ל: <a href="mailto:hatbaot2554@gmail.com" style={{ color: '#8B6914' }}>hatbaot2554@gmail.com</a>
          </div>
        </div>
      </div>
    </div>
  )
}
