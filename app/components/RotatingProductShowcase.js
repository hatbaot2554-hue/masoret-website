'use client'

import { useEffect, useMemo, useState } from 'react'
import ProductCard from './ProductCard'

const ROW_SIZE = 5

function productKey(product, index, prefix) {
  return `${prefix}-${product?.index ?? index}-${index}`
}

function pickRow(products, start) {
  if (!products.length) return []
  return Array.from(
    { length: Math.min(ROW_SIZE, products.length) },
    (_, index) => products[(start + index) % products.length]
  )
}

export default function RotatingProductShowcase({ products }) {
  const [offset, setOffset] = useState(0)
  const safeProducts = Array.isArray(products) ? products.filter(Boolean) : []
  const topProducts = safeProducts.slice(0, ROW_SIZE)
  const carouselPool = safeProducts.length > ROW_SIZE ? safeProducts.slice(ROW_SIZE) : safeProducts
  const bottomStart = safeProducts.length > ROW_SIZE * 2 ? ROW_SIZE * 2 : ROW_SIZE
  const bottomProducts = safeProducts.slice(bottomStart, bottomStart + ROW_SIZE)
  const shouldRotate = carouselPool.length > ROW_SIZE

  const centerProducts = useMemo(
    () => pickRow(carouselPool, shouldRotate ? offset : 0),
    [carouselPool, offset, shouldRotate]
  )

  useEffect(() => {
    if (!shouldRotate) return
    const timer = window.setInterval(() => {
      setOffset((current) => (current + 1) % carouselPool.length)
    }, 3500)
    return () => window.clearInterval(timer)
  }, [carouselPool.length, shouldRotate])

  function moveCarousel(direction) {
    if (!carouselPool.length) return
    setOffset((current) => (current + direction + carouselPool.length) % carouselPool.length)
  }

  if (safeProducts.length === 0) return null

  return (
    <section className="product-showcase" aria-label="ספרים מומלצים">
      <div className="product-showcase-row">
        {topProducts.map((product, index) => (
          <ProductCard key={productKey(product, index, 'top')} product={product} index={product.index} />
        ))}
      </div>

      <div className="product-showcase-focus">
        {shouldRotate && (
          <button
            type="button"
            className="product-showcase-arrow product-showcase-arrow-prev"
            onClick={() => moveCarousel(-1)}
            aria-label="מוצרים קודמים"
          >
            ‹
          </button>
        )}

        <div className="product-showcase-row product-showcase-row-featured" key={offset}>
          {centerProducts.map((product, index) => (
            <ProductCard key={productKey(product, index, 'center')} product={product} index={product.index} />
          ))}
        </div>

        {shouldRotate && (
          <button
            type="button"
            className="product-showcase-arrow product-showcase-arrow-next"
            onClick={() => moveCarousel(1)}
            aria-label="מוצרים הבאים"
          >
            ›
          </button>
        )}
      </div>

      {shouldRotate && (
        <div className="product-showcase-dots" aria-hidden="true">
          {carouselPool.slice(0, Math.min(carouselPool.length, 8)).map((product, index) => (
            <span key={product.index ?? index} className={index === offset % Math.min(carouselPool.length, 8) ? 'active' : ''} />
          ))}
        </div>
      )}

      {bottomProducts.length > 0 && (
        <div className="product-showcase-row">
          {bottomProducts.map((product, index) => (
            <ProductCard key={productKey(product, index, 'bottom')} product={product} index={product.index} />
          ))}
        </div>
      )}
    </section>
  )
}
