"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Plus, Minus } from "lucide-react"
import { useCart } from "@/components/hooks/use-cart"
import { formatPrice, getImageUrl } from "@/lib/utils"
import type { CartItem as CartItemType } from "@/contexts/cart-context"

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemove = () => {
    setIsRemoving(true)
    setTimeout(() => {
      removeItem(item.id)
    }, 300)
  }

  const decreaseQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1)
    } else {
      handleRemove()
    }
  }

  const increaseQuantity = () => {
    updateQuantity(item.id, item.quantity + 1)
  }

  return (
    <div className={`py-6 flex gap-4 transition-opacity duration-300 ${isRemoving ? "opacity-0" : "opacity-100"}`}>
      <div className="w-20 h-20 relative rounded-md overflow-hidden flex-shrink-0">
        <Image
          src={getImageUrl(item.image) || "/img/placeholder-product.jpg"}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-grow">
        <div className="flex justify-between">
          <div>
            <Link href={`/productos/${item.product_id}`} className="font-medium hover:text-primary">
              {item.name}
            </Link>
            <div className="text-sm text-muted-foreground mt-1">
              {item.size && <span className="mr-2">Talla: {item.size}</span>}
              {item.color && <span>Color: {item.color}</span>}
            </div>
          </div>
          <button onClick={handleRemove} className="text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        <div className="flex justify-between items-end mt-4">
          <div className="flex items-center border border-border rounded-md">
            <button
              onClick={decreaseQuantity}
              className="w-8 h-8 flex items-center justify-center border-r border-border"
            >
              <Minus size={14} />
            </button>
            <span className="w-10 text-center">{item.quantity}</span>
            <button
              onClick={increaseQuantity}
              className="w-8 h-8 flex items-center justify-center border-l border-border"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
        </div>
      </div>
    </div>
  )
}
