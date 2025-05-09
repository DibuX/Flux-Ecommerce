import ProductCard from "./product-card"
import type { Product } from "@/lib/types"
import Link from "next/link"

interface ProductGridProps {
  products: Product[]
  title?: string
  subtitle?: string
  showViewAll?: boolean
  viewAllLink?: string
}

function getProductFlags(id: number) {
  return {
    isNew: id % 3 === 0,      
    isSale: id % 5 === 0,
    isBestseller: id % 7 === 0,
  }
}

export default function ProductGrid({
  products,
  title,
  subtitle,
  showViewAll = false,
  viewAllLink = "/productos",
}: ProductGridProps) {
  console.log(`ProductGrid recibió ${products.length} productos`)

  return (
    <section className="section">
      <div className="container">
        {(title || subtitle) && (
          <div className="section-title">
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}

        <div className="products-grid">
          {products && products.length > 0 ? (
            products.map((product) => {
              const { isNew, isSale, isBestseller } = getProductFlags(product.id)

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  isNew={isNew}
                  isSale={isSale}
                  isBestseller={isBestseller}
                />
              )
            })
          ) : (
            <p className="text-center w-full">No hay productos disponibles</p>
          )}
        </div>

        {showViewAll && products && products.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link href={viewAllLink} className="btn btn-outline">
              Ver Todos los Productos
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
