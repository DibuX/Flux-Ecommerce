import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { formatPrice, getImageUrl } from "@/lib/utils"
import type { Product } from "@/lib/types"

interface RelatedProductsProps {
  products: Product[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null
  }

  return (
    <section className="mt-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Productos Relacionados</h2>
        <Link href="/productos" className="text-primary flex items-center hover:underline">
          Ver Todos <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/productos/${product.id}`} className="group">
            <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
              <Image
                src={getImageUrl(product.image) || "/img/placeholder-product.jpg"}
                alt={product.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <h3 className="font-medium group-hover:text-primary transition-colors">{product.name}</h3>
            <p className="text-muted-foreground text-sm mb-1">{product.category_name}</p>
            <p className="font-bold">{formatPrice(product.price)}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
