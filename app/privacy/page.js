export default function PrivacyPage() {
  const sections = [
    {
      title: 'איזה מידע נאסף',
      items: [
        'בעת ביצוע הזמנה נאספים פרטים הדרושים לטיפול בהזמנה: שם, טלפון, מייל, כתובת, עיר ופרטי המוצרים.',
        'בעת פנייה דרך האתר או הצ׳אט עשויים להישמר פרטי הפנייה ותוכן ההודעה לצורך מתן שירות.',
        'האתר עשוי לשמור מידע טכני בסיסי הדרוש לתפעול, אבטחה ושיפור השירות.',
      ],
    },
    {
      title: 'שימוש במידע',
      items: [
        'המידע משמש לטיפול בהזמנות, שירות לקוחות, תיאום משלוחים, מניעת שימוש לרעה ושיפור האתר.',
        'לא יישלח דיוור שיווקי ללא הסכמה כנדרש בדין.',
        'פרטי הזמנה עשויים לעבור לספקי שירות הדרושים לביצוע ההזמנה, כגון משלוחים, תשלום ותפעול האתר.',
      ],
    },
    {
      title: 'זכויות משתמשים',
      items: [
        'ניתן לפנות בבקשה לעיון, תיקון או מחיקה של מידע אישי, בכפוף להוראות הדין ולצרכים עסקיים/חשבונאיים תקינים.',
        'בקשות בנושא פרטיות ניתן לשלוח לדוא״ל המופיע מטה.',
      ],
    },
  ]

  return (
    <div style={{ padding: '60px 0', background: '#F8F4EE', minHeight: '100vh' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 32px' }}>
        <h1 style={{ fontFamily: 'Frank Ruhl Libre, serif', fontSize: '36px', fontWeight: 900, marginBottom: '8px', color: '#1A2332' }}>
          מדיניות פרטיות
        </h1>
        <p style={{ color: '#6B5C3E', marginBottom: '32px', fontSize: '14px' }}>עודכן לאחרונה: 25.05.2026</p>
        <div style={{ background: '#fff', border: '1px solid #EDE6D9', borderRadius: '8px', padding: '40px', lineHeight: 2, color: '#2C2416', fontSize: '15px' }}>
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
            לפניות בנושא פרטיות: <a href="mailto:hatbaot2554@gmail.com" style={{ color: '#8B6914' }}>hatbaot2554@gmail.com</a>
          </div>
        </div>
      </div>
    </div>
  )
}
