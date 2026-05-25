const CUSTOMER_DETAILS_KEY = 'masoret_customer_details'

const CUSTOMER_DETAIL_FIELDS = ['firstName', 'lastName', 'email', 'phone', 'address', 'city']

export function loadCustomerDetails() {
  if (typeof window === 'undefined') return {}
  try {
    const saved = JSON.parse(window.localStorage.getItem(CUSTOMER_DETAILS_KEY) || '{}')
    return CUSTOMER_DETAIL_FIELDS.reduce((details, field) => {
      if (typeof saved[field] === 'string' && saved[field].trim()) {
        details[field] = saved[field]
      }
      return details
    }, {})
  } catch {
    return {}
  }
}

export function saveCustomerDetails(form) {
  if (typeof window === 'undefined') return
  try {
    const details = CUSTOMER_DETAIL_FIELDS.reduce((nextDetails, field) => {
      const value = String(form?.[field] || '').trim()
      if (value) nextDetails[field] = value
      return nextDetails
    }, {})
    window.localStorage.setItem(CUSTOMER_DETAILS_KEY, JSON.stringify(details))
  } catch {}
}
