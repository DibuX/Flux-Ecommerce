"use client"

import type React from "react"
import { useMemo, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Eye, ShoppingCart, Star } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/components/hooks/use-toast"
import { formatPrice } from "@/lib/utils"
import { useSession } from "next-auth/react"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
  isNew?: boolean
  isSale?: boolean
  isBestseller?: boolean
}

export default function ProductCard({
  product,
  isNew = false,
  isSale = false,
  isBestseller = false,
}: ProductCardProps) {
  if (!product || !product.id) {
    console.error("ProductCard recibió un producto inválido:", product)
    return null
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    })
  }

  const [isHovered, setIsHovered] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()
  const { data: session } = useSession()
  const [isFavorite, setIsFavorite] = useState(false)

  const finalPrice = useMemo(() => {
    if (isSale) {
      const discount = 0.2
      return product.price * (1 - discount)
    }
    return product.price
  }, [isSale, product.price])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: Date.now(),
      product_id: product.id,
      name: product.name,
      price: finalPrice,
      image: product.image,
      quantity: 1,
      size: product.size,
    })
  }

  const handleToggleFavorite = async () => {
    if (!session) {
      toast({
        title: "Error",
        description: "Necesitas iniciar sesión para agregar productos a favoritos",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/wishlist/add", {
        method: isFavorite ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          productId: product.id,
        }),
      })

      if (response.ok) {
        // Cambiar el estado solo después de que la respuesta sea exitosa
        setIsFavorite((prevState) => !prevState)
        toast({
          title: isFavorite ? "Producto eliminado" : "Producto añadido",
          description: isFavorite
            ? "El producto ha sido eliminado de tus favoritos"
            : "El producto ha sido añadido a tus favoritos",
        })
      } else {
        toast({
          title: "Error",
          description: "Hubo un problema al actualizar tus favoritos",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al gestionar favoritos:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el producto en tus favoritos",
        variant: "destructive",
      })
    }
  }

  // Verificar si el producto ya está en favoritos cuando el componente se monta
  useEffect(() => {
    if (session) {
      const checkFavoriteStatus = async () => {
        try {
          const response = await fetch("/api/wishlist/check", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: session.user.id,
              productId: product.id,
            }),
          })

          const data = await response.json()

          if (response.ok && data.isFavorite) {
            setIsFavorite(true)
          }
        } catch (error) {
          console.error("Error al verificar el estado de favoritos:", error)
        }
      }

      checkFavoriteStatus()
    }
  }, [session, product.id])

  const imageUrl = product.image && product.image.startsWith("/")
    ? product.image
    : `/img/default-product.png`

  return (
    <div className="product-card">
      <div
        className="product-img-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/productos/${product.id}`}>
          <div style={{ position: "relative", width: "100%", height: "250px" }}>
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={product.name}
              fill
              className="product-img"
              style={{ objectFit: "cover" }}
            />
          </div>
        </Link>

        <div className="product-actions">
          <button className="action-btn" onClick={handleToggleFavorite}>
            <Heart size={18} color={isFavorite ? "red" : "gray"} />
          </button>
          <button className="action-btn">
            <Eye size={18} />
          </button>
        </div>

        {isNew && <span className="product-tag tag-new">Nuevo</span>}
        {isBestseller && <span className="product-tag tag-bestseller">Top Ventas</span>}
      </div>

      <div className="product-info">
        <div className="product-brand">{product.brand_name || "Marca"}</div>
        <Link href={`/productos/${product.id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>

        <div className="product-rating">
          <div className="rating-stars">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className={i < 4 ? "filled" : ""} />
            ))}
          </div>
        </div>

        <div className="product-price">
          {isSale ? (
            <>
              <span className="original-price">{formatPrice(product.price)}</span>
              <span className="current-price">{formatPrice(finalPrice)}</span>
            </>
          ) : (
            <span className="current-price">{formatPrice(product.price)}</span>
          )}
        </div>

        <button onClick={handleAddToCart} className="add-to-cart">
          <ShoppingCart size={18} />
          <span>Añadir al Carrito</span>
        </button>
      </div>
    </div>
  )
}
