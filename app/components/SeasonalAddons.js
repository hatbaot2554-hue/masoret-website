'use client'

import { useEffect, useMemo, useState } from 'react'
import ProductCard from './ProductCard'

const PRODUCT_SOURCE = 'https://raw.githubusercontent.com/hatbaot2554-hue/masoret-automation/refs/heads/main/products.json'

function normalize(value) {
  return String(value || '').toLowerCase()
}

function getHebrewSeason(date) {
  try {
    const parts = new Intl.DateTimeFormat('he-u-ca-hebrew', {
      month: 'long',
      day: 'numeric',
    }).formatToParts(date)
    const day = Number(parts.find((part) => part.type === 'day')?.value || 1)
    const month = parts.find((part) => part.type === 'month')?.value || ''
    return { day, month }
  } catch {
    return { day: date.getDate(), month: '' }
  }
}

function currentSeason() {
  const { day, month } = getHebrewSeason(new Date())

  if (month.includes('סיוון') && day <= 12) {
    return {
      title: 'מתאים במיוחד לשבועות',
      keywords: ['רות', 'מגילת רות', 'שבועות', 'תהילים', 'תיקון ליל שבועות'],
    }
  }
  if (month.includes('אלול') || (month.includes('תשרי') && day <= 22)) {
    return {
      title: 'מתאים לימים הנוראים',
      keywords: ['ראש השנה', 'מחזור', 'סליחות', 'תהילים', 'יום כיפור', 'שופר'],
    }
  }
  if (month.includes('כסלו') || month.includes('טבת')) {
    return {
      title: 'מתאים לימי חנוכה והחורף',
      keywords: ['חנוכה', 'תהילים', 'סידור', 'ילדים', 'אור'],
    }
  }
  if (month.includes('אדר')) {
    return {
      title: 'מתאים לפורים',
      keywords: ['מגילה', 'אסתר', 'פורים', 'תהילים', 'ילדים'],
    }
  }
  if (month.includes('ניסן')) {
    return {
      title: 'מתאים לפסח',
      keywords: ['הגדה', 'פסח', 'מחזור', 'תהילים'],
    }
  }
  if (month.includes('אב')) {
    return {
      title: 'מתאים לימי בין המצרים',
      keywords: ['איכה', 'קינות', 'תהילים', 'חורבן'],
    }
  }
  return {
    title: 'מוצרים שמשלימים את הקניה',
    keywords: ['תהילים', 'סידור', 'חומש', 'משנה ברורה', 'ילדים'],
  }
}

function scoreProduct(product, keywords) {
  const text = normalize([
    product.name,
    product.sku,
    product.description,
    product.full_description,
    product.category,
    product.parent_category,
    product.child_category,
    ...(product.categories || []),
    ...(product.tags || []),
  ].join(' '))

  return keywords.reduce((score, keyword) => (
    text.includes(normalize(keyword)) ? score + 1 : score
  ), 0)
}

export default function SeasonalAddons({ currentIndex }) {
  const [products, setProducts] = useState([])
  const season = useMemo(() => currentSeason(), [])

  useEffect(() => {
    fetch(PRODUCT_SOURCE)
      .then((response) => response.ok ? response.json() : [])
      .then((data) => {
        const withIndex = Array.isArray(data) ? data.map((product, index) => ({ ...product, index })) : []
        setProducts(withIndex)
      })
      .catch(() => setProducts([]))
  }, [])

  const suggestions = useMemo(() => {
    return products
      .filter((product) => product.in_stock !== false && product.index !== currentIndex)
      .map((product) => ({ product, score: scoreProduct(product, season.keywords) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.product.index - b.product.index)
      .slice(0, 4)
      .map((item) => item.product)
  }, [currentIndex, products, season.keywords])

  if (suggestions.length === 0) return null

  return (
    <section className="seasonal-addons" aria-label="המלצות להשלמת הקניה">
      <div className="seasonal-addons-heading">
        <span>השלמה חכמה לסל</span>
        <h2>{season.title}</h2>
      </div>
      <div className="seasonal-addons-grid">
        {suggestions.map((product) => (
          <ProductCard key={product.index} product={product} index={product.index} />
        ))}
      </div>
    </section>
  )
}
