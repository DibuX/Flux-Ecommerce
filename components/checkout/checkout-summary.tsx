"use client"

import { useCart } from "@/components/hooks/use-cart"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"
import { getImageUrl } from "@/lib/utils"

export default function CheckoutSummary() {
  const { items, subtotal } = useCart()
  const shipping = subtotal > 99 ? 0 : 10
  const total = subtotal + shipping

  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>

      <div className="divide-y divide-border">
        {items.map((item) => (
          <div key={item.id} className="py-3 flex items-center">
            <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
              <Image
                src={getImageUrl(item.image) || "/placeholder.svg"}
                alt={item.name}
                fill
                className="object-cover"
              />
              <span className="absolute top-0 right-0 bg-secondary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {item.quantity}
              </span>
            </div>

            <div className="ml-4 flex-grow">
              <h4 className="font-medium text-sm">{item.name}</h4>
              <p className="text-xs text-muted-foreground">{item.size && `Talla: ${item.size}`}</p>
            </div>

            <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Envío</span>
          <span>{shipping === 0 ? "Gratis" : formatPrice(shipping)}</span>
        </div>

        <div className="flex justify-between font-bold pt-2 border-t border-border mt-2">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        <p className="text-xs text-muted-foreground">Impuestos incluidos</p>
      </div>
    </div>
  )
}
