"use client"

import { useCart } from "@/components/hooks/use-cart"
import CartItem from "./cart-item"
import EmptyCart from "./empty-cart"

export default function CartItems() {
  const { items } = useCart()
  
  if (items.length === 0) {
    return <EmptyCart />
  }
  
  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <div className="flex justify-between pb-4 border-b border-border mb-4 font-medium">
        <div>Producto</div>
        <div className="text-right">Subtotal</div>
      </div>
      
      <div className="divide-y divide-border">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
