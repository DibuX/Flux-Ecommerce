"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <Heart size={32} className="text-muted-foreground" />
      </div>

      <h2 className="text-2xl font-bold mb-2">Tu lista de favoritos está vacía</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Guarda tus productos favoritos para verlos más tarde o comprarlos cuando estés listo.
      </p>

      <Link href="/">
        <Button>Explorar Productos</Button>
      </Link>
    </div>
  )
}
