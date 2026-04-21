'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('masoret_wishlist')
      if (saved) setItems(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('masoret_wishlist', JSON.stringify(items))
    } catch {}
  }, [items])

  function addItem(product) {
    setItems(prev => {
      if (prev.find(i => i.index === product.index)) return prev
      return [...prev, {
        index: product.index,
        name: product.name,
        image: product.image,
        price: product.price,
        regular_our_price: product.regular_our_price,
        sku: product.sku,
        in_stock: product.in_stock,
      }]
    })
  }

  function removeItem(index) {
    setItems(prev => prev.filter(i => i.index !== index))
  }

  function isInWishlist(index) {
    return items.some(i => i.index === index)
  }

  function toggleItem(product) {
    if (isInWishlist(product.index)) {
      removeItem(product.index)
    } else {
      addItem(product)
    }
  }

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, toggleItem, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  return useContext(WishlistContext)
}
