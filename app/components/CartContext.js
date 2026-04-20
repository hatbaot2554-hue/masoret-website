'use client'
import { createContext, useContext, useState, useEffect } from 'react'
const CartContext = createContext(null)
export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  useEffect(() => {
    try {
      const saved = localStorage.getItem('masoret_cart')
      if (saved) setItems(JSON.parse(saved))
    } catch {}
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem('masoret_cart', JSON.stringify(items))
    } catch {}
  }, [items])
  function addItem(product, quantity = 1, selectedAttrs = {}, selectedVariation = null, engravingData = null) {
    const key = `${product.index ?? product.url}_${JSON.stringify(selectedAttrs)}`
    const engravingExtra = engravingData ? (engravingData.extraCost || 0) : 0
    setItems(prev => {
      const existing = prev.find(i => i.key === key)
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i)
      }
      return [...prev, {
        key,
        index: product.index,
        name: product.name,
        image: product.image,
        price: selectedVariation ? parseFloat(selectedVariation.price) : parseFloat(product.price),
        original_price: selectedVariation ? parseFloat(selectedVariation.original_price) : parseFloat(product.original_price),
        sku: selectedVariation?.sku || product.sku || '',
        product_id: selectedVariation?.variation_id || product.product_id || '',
        selectedAttrs,
        quantity,
        engravingExtra,
        engravingData,
      }]
    })
  }
  function removeItem(key) {
    setItems(prev => prev.filter(i => i.key !== key))
  }
  function updateQty(key, quantity) {
    if (quantity < 1) return removeItem(key)
    setItems(prev => prev.map(i => i.key === key ? { ...i, quantity } : i))
  }
  function clearCart() {
    setItems([])
  }
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + (i.price * i.quantity) + (i.engravingExtra || 0), 0)
  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}
export function useCart() {
  return useContext(CartContext)
}
