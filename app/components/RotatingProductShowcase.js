'use client'

import { useEffect, useMemo, useState } from 'react'
import ProductCard from './ProductCard'

export default function RotatingProductShowcase({ products }) {
  const [offset, setOffset] = useState(0)
  const safeProducts = Array.isArray(products) ? products : []

  useEffect(() => {
    if (safeProducts.length <= 10) return
    const timer = window.setInterval(() => {
      setOffset((current) => (current + 2) % safeProducts.length)
    }, 3500)
    return () => window.clearInterval(timer)
  }, [safeProducts.length])

  const visibleProducts = useMemo(() => {
    if (safeProducts.length <= 10) return safeProducts
    return Array.from({ length: 10 }, (_, index) => safeProducts[(offset + index) % safeProducts.length])
  }, [safeProducts, offset])

  return (
    <div className="rotating-products">
      <div className="products-grid rotating-products-grid" key={offset}>
        {visibleProducts.map((product) => (
          <ProductCard key={`${offset}-${product.index}`} product={product} index={product.index} />
        ))}
      </div>
    </div>
  )
}
