export default function MaintenanceScreen({ mode = 'maintenance', message = 'האתר בשיפוצים - תכף נחזור', activeUntil, activeName }) {
  const isShabbat = mode === 'shabbat'

  return (
    <main className={isShabbat ? 'maintenance-screen shabbat' : 'maintenance-screen'} dir="rtl">
      <div className="maintenance-panel">
        <img src="/brand/masoret-logo.svg" alt="מסורת" />
        {activeName && <span className="maintenance-kicker">{activeName}</span>}
        <h1>{message || (isShabbat ? 'אני אתר שומר שבת' : 'האתר בשיפוצים - תכף נחזור')}</h1>
        <p>
          {isShabbat
            ? 'האתר סגור זמנית לכבוד השבת ויחזור לפעילות לאחר הזמן שנקבע.'
            : 'אנחנו מבצעים עבודות תחזוקה קצרות כדי לשמור על אתר יציב ונעים יותר.'}
        </p>
        {activeUntil && (
          <small>חזרה משוערת: {new Date(activeUntil).toLocaleString('he-IL')}</small>
        )}
      </div>
    </main>
  )
}
