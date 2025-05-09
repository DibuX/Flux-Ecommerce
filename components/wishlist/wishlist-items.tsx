"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/hooks/use-toast"
import { useCart } from "@/components/hooks/use-cart"
import { formatPrice, getImageUrl } from "@/lib/utils"
import { Product } from "@/lib/types"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import EmptyWishlist from "./empty-wishlist"
import { Button } from "@/components/ui/button"

interface WishlistItemsProps {
  userId: string
}

export default function WishlistItems({ userId }: WishlistItemsProps) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch(`/api/wishlist?userId=${userId}`)

        if (!response.ok) {
          throw new Error("Error al cargar la lista de favoritos")
        }

        const data = await response.json()
        setWishlistItems(data.items)
      } catch (error) {
        console.error("Error al cargar la lista de favoritos:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar tu lista de favoritos",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchWishlist()
  }, [userId, toast])

  const removeFromWishlist = async (productId: number) => {
    try {
      const response = await fetch(`/api/wishlist`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, productId }),
      })

      if (!response.ok) {
        throw new Error("Error al eliminar el producto de favoritos")
      }

      setWishlistItems((prev) => prev.filter((item) => item.id !== productId))

      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado de tu lista de favoritos",
      })
    } catch (error) {
      console.error("Error al eliminar de favoritos:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto de tu lista de favoritos",
        variant: "destructive",
      })
    }
  }

  const addToCart = (product: Product) => {
    addItem({
      id: Date.now(),
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })

    toast({
      title: "Producto añadido",
      description: `${product.name} ha sido añadido a tu carrito`,
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return <EmptyWishlist />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishlistItems.map((product) => (
        <div key={product.id} className="product-card">
          <div className="relative">
            <Image
              src={getImageUrl(product.image) || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={300}
              className="object-cover rounded"
            />
            <div className="absolute top-2 right-2">
              <Button variant="outline" size="sm" onClick={() => removeFromWishlist(product.id)}>
                <Trash2 size={16} />
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <Link href={`/productos/${product.id}`} className="font-medium hover:text-primary">
              {product.name}
            </Link>
            <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>

            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={() => addToCart(product)}>
                <ShoppingCart size={16} className="mr-1" />
                <span>Añadir al Carrito</span>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
