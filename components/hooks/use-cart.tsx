"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem } from "@/lib/types"

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: CartItem) => {
        const { items } = get()
        const existingItem = items.find((i) => i.product_id === item.product_id && i.size === item.size)

        if (existingItem) {
          set({
            items: items.map((i) => (i.id === existingItem.id ? { ...i, quantity: i.quantity + item.quantity } : i)),
          })
        } else {
          set({ items: [...items, item] })
        }
      },

      removeItem: (id: number) => {
        const { items } = get()
        set({ items: items.filter((item) => item.id !== id) })
      },

      updateQuantity: (id: number, quantity: number) => {
        const { items } = get()

        if (quantity <= 0) {
          set({ items: items.filter((item) => item.id !== id) })
          return
        }

        set({
          items: items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      get totalItems() {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      get subtotal() {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
    }),
    {
      name: "flux-cart",
      skipHydration: true,
    },
  ),
)
