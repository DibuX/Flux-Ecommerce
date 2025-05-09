"use client"

import Link from "next/link"
import { ShoppingCart } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <ShoppingCart size={32} className="text-muted-foreground" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Parece que aún no has añadido ningún producto a tu carrito de compras.
      </p>
      
      <Link href="/productos">
        <Button>Explorar Productos</Button>
      </Link>
    </div>
  )
}
