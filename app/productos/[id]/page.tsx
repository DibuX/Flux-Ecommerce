import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, Truck, Shield, RotateCcw, ChevronRight, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { productRepository } from "@/lib/db/repositories/productRepository"
import { formatPrice, getImageUrl } from "@/lib/utils"
import AddToCartButton from "./add-to-cart-button"
import ProductReviews from "@/components/products/product-reviews"
import RelatedProducts from "@/components/products/related-products"
import { sizeRepository } from "@/lib/db/repositories/sizeRepository"

interface ProductPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await productRepository.getProductById(Number.parseInt(params.id))

  if (!product) {
    return {
      title: "Producto no encontrado",
      description: "El producto que buscas no existe",
    }
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description || "Descubre este producto en Flux",
      images: [
        {
          url: getImageUrl(product.image) || "/img/placeholder-product.jpg",
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await productRepository.getProductById(Number.parseInt(params.id))

  if (!product) {
    notFound()
  }

  // Obtener productos relacionados (misma categoría)
  const relatedProducts = await productRepository.getProductsByCategory(product.category_id)

  // Filtrar el producto actual de los relacionados y limitar a 4
  const filteredRelatedProducts = relatedProducts.filter((p) => p.id !== product.id).slice(0, 4)

  // Obtener todas las tallas disponibles
  const sizes = await sizeRepository.getAllSizes()
  const colors = [
    { id: 1, name: "Negro", code: "#000000" },
    { id: 2, name: "Blanco", code: "#FFFFFF" },
    { id: 3, name: "Rojo", code: "#FF0000" },
    { id: 4, name: "Azul", code: "#0000FF" },
  ]

  const additionalImages = [
    getImageUrl(product.image) || "/img/placeholder-product.jpg",
    "/img/products/product-detail-2.jpg",
    "/img/products/product-detail-3.jpg",
    "/img/products/product-detail-4.jpg",
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary">
          Inicio
        </Link>
        <ChevronRight size={14} className="mx-2" />
        <Link href={`/${product.category_slug}`} className="hover:text-primary">
          {product.category_name}
        </Link>
        <ChevronRight size={14} className="mx-2" />
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Imágenes del producto */}
        <div className="space-y-4">
          <div className="aspect-square relative rounded-lg overflow-hidden border border-border">
            <Image
              src={getImageUrl(product.image) || "/img/placeholder-product.jpg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {additionalImages.map((img, i) => (
              <div
                key={i}
                className="aspect-square relative rounded-lg overflow-hidden border border-border cursor-pointer hover:border-primary"
              >
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`${product.name} - vista ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Información del producto */}
        <div>
          <div className="mb-2">
            <span className="text-sm font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
              {product.category_name}
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className={i < 4 ? "text-warning fill-warning" : "text-gray-300"} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground ml-2">(24 reseñas)</span>
          </div>

          <div className="text-2xl font-bold mb-6">{formatPrice(product.price)}</div>

          <div className="prose prose-sm mb-6">
            <p>{product.description || "Sin descripción disponible"}</p>
          </div>

          {/* Selector de color */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Color</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color.id}
                  className="w-8 h-8 rounded-full border-2 border-transparent hover:border-primary focus:outline-none focus:border-primary"
                  style={{ backgroundColor: color.code }}
                  title={color.name}
                  aria-label={`Color ${color.name}`}
                />
              ))}
            </div>
          </div>

          {/* Selector de talla */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Talla</h3>
              <button className="text-sm text-primary hover:underline">Guía de tallas</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <Button
                  key={size.id}
                  variant={size.name === product.size ? "default" : "outline"}
                  className="w-12 h-12"
                >
                  {size.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-4 mb-8">
            <AddToCartButton product={product} className="flex-1" />
            <Button variant="outline" className="w-12 h-12 flex items-center justify-center">
              <Heart size={20} />
            </Button>
          </div>

          {/* Información adicional */}
          <div className="mt-8 space-y-4 border-t border-border pt-6">
            <div className="flex items-center">
              <Truck className="text-primary mr-3" size={20} />
              <div>
                <p className="font-medium">Envío gratis</p>
                <p className="text-sm text-muted-foreground">En pedidos superiores a $99</p>
              </div>
            </div>

            <div className="flex items-center">
              <RotateCcw className="text-primary mr-3" size={20} />
              <div>
                <p className="font-medium">Devoluciones gratuitas</p>
                <p className="text-sm text-muted-foreground">30 días para cambios o devoluciones</p>
              </div>
            </div>

            <div className="flex items-center">
              <Shield className="text-primary mr-3" size={20} />
              <div>
                <p className="font-medium">Garantía de calidad</p>
                <p className="text-sm text-muted-foreground">Productos 100% originales</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de información */}
      <div className="mt-16">
        <div className="border-b border-border">
          <div className="flex overflow-x-auto">
            <button className="px-6 py-3 font-medium border-b-2 border-primary text-primary">Descripción</button>
            <button className="px-6 py-3 font-medium text-muted-foreground">Especificaciones</button>
            <button className="px-6 py-3 font-medium text-muted-foreground">Reseñas (24)</button>
          </div>
        </div>

        <div className="py-6">
          <div className="prose max-w-none">
            <p>
              {product.description ||
                `El ${product.name} es un producto de alta calidad diseñado para ofrecer máximo confort y estilo. Fabricado con materiales premium que garantizan durabilidad y un acabado excepcional.`}
            </p>
            <p>Características principales:</p>
            <ul>
              <li>Diseño moderno y versátil</li>
              <li>Materiales de alta calidad</li>
              <li>Confort excepcional</li>
              <li>Durabilidad garantizada</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reseñas del producto */}
      <ProductReviews productId={product.id} />

      {/* Productos relacionados */}
      <RelatedProducts products={filteredRelatedProducts} />
    </div>
  )
}
