"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface CartItem {
  id: number
  product_id: number
  name: string
  price: number
  image: string
  quantity: number
  size?: string
  color?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("flux-cart")
      if (storedCart) {
        const parsed = JSON.parse(storedCart)
        if (Array.isArray(parsed)) {
          setItems(parsed)
        } else {
          console.warn("Cart data is not an array, clearing localStorage.")
          localStorage.removeItem("flux-cart")
          setItems([])
        }
      }
    } catch (error) {
      console.error("Error parsing cart data from localStorage:", error)
      setItems([])
    }
    setIsLoaded(true)
  }, [])

  // Guardar el carrito en localStorage cuando cambia
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("flux-cart", JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.product_id === item.product_id && i.size === item.size
      )

      if (existingItem) {
        return prevItems.map((i) =>
          i.id === existingItem.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      } else {
        return [...prevItems, item]
      }
    })
  }

  const removeItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
  }

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }

  return context
}
