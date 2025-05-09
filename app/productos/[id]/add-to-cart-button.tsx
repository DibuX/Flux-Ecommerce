"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Minus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/hooks/use-cart"
import { useToast } from "@/components/hooks/use-toast"
import type { Product } from "@/lib/types"

interface AddToCartButtonProps {
  product: Product
  className?: string
}

export default function AddToCartButton({ product, className = "" }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)

    // Simular un pequeño retraso para la animación
    setTimeout(() => {
      addItem({
        id: Date.now(),
        product_id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        size: product.size,
      })

      toast({
        title: "Producto añadido",
        description: `${product.name} se ha añadido a tu carrito`,
        action: (
          <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white">
            <Check size={16} />
          </div>
        ),
      })

      setIsAdding(false)
    }, 500)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center border border-border rounded-md">
        <button
          onClick={decreaseQuantity}
          className="w-10 h-10 flex items-center justify-center border-r border-border"
          disabled={quantity <= 1}
        >
          <Minus size={16} className={quantity <= 1 ? "text-muted-foreground" : ""} />
        </button>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
          className="w-12 h-10 text-center border-none focus:outline-none"
          min="1"
        />
        <button
          onClick={increaseQuantity}
          className="w-10 h-10 flex items-center justify-center border-l border-border"
        >
          <Plus size={16} />
        </button>
      </div>

      <Button onClick={handleAddToCart} className="w-full py-6 text-base font-medium" disabled={isAdding}>
        {isAdding ? (
          "Añadiendo..."
        ) : (
          <>
            <ShoppingCart className="mr-2" size={18} /> Añadir al Carrito
          </>
        )}
      </Button>
    </div>
  )
}
