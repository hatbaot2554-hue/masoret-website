'use client'

import { useEffect, useMemo, useState } from 'react'
import ProductCard from './ProductCard'

export default function RotatingProductShowcase({ products }) {
  const [offset, setOffset] = useState(0)
  const safeProducts = Array.isArray(products) ? products : []
  const shouldRotate = safeProducts.length > 5

  useEffect(() => {
    if (!shouldRotate) return
    const timer = window.setInterval(() => {
      setOffset((current) => (current + 1) % safeProducts.length)
    }, 3500)
    return () => window.clearInterval(timer)
  }, [safeProducts.length, shouldRotate])

  const carouselProducts = useMemo(() => {
    if (!shouldRotate) return safeProducts
    return Array.from({ length: safeProducts.length }, (_, index) => (
      safeProducts[(offset + index) % safeProducts.length]
    ))
  }, [offset, safeProducts, shouldRotate])

  if (safeProducts.length === 0) return null

  return (
    <section className="product-showcase-carousel" aria-label="ספרים מומלצים">
      <div className="product-showcase-window">
        <div className="product-showcase-track" key={offset}>
          {carouselProducts.map((product, index) => (
            <div className="product-showcase-slide" key={`${product.index}-${offset}-${index}`}>
              <ProductCard product={product} index={product.index} />
            </div>
          ))}
        </div>
      </div>
      {shouldRotate && (
        <div className="product-showcase-dots" aria-hidden="true">
          {safeProducts.slice(0, Math.min(safeProducts.length, 8)).map((product, index) => (
            <span key={product.index} className={index === offset % Math.min(safeProducts.length, 8) ? 'active' : ''} />
          ))}
        </div>
      )}
    </section>
  )
}
