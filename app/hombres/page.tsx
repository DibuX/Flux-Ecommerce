import { productRepository } from "@/lib/db/repositories/productRepository"
import { categoryRepository } from "@/lib/db/repositories/categoryRepository"
import ProductGrid from "@/components/products/product-grid"
import type { Metadata } from "next"
import CategoryBanner from "@/components/category/category-banner"
import CategoryFeatures from "@/components/category/category-features"

export const metadata: Metadata = {
  title: "Moda para Hombres | Flux",
  description: "Explora nuestra colección exclusiva para hombres. Ropa, calzado y accesorios de las mejores marcas.",
}

export default async function MenPage() {
  // Obtener la categoría de hombres
  const categories = await categoryRepository.getAllCategories()
  const menCategory = categories.find((c) => c.slug === "hombre")

  if (!menCategory) {
    throw new Error("Categoría de hombres no encontrada")
  }

  // Obtener productos de la categoría
  const products = await productRepository.getProductsByCategory(menCategory.id)

  // Obtener subcategorías (lo cual no voy a agregar en este momento)
  const subcategories = await categoryRepository.getSubcategoriesByParentId(menCategory.id)

  return (
    <>
      <div className="banner-wrapper">
        <img
          src="/img/banner-hombre.png"
          alt="Nueva colección hombre"
          className="banner-image"
        />
        <div className="banner-text">
          <h1>Nueva Colección Hombre</h1>
          <p>Descubrí lo último en moda masculina</p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto px-4 py-8">
        <CategoryFeatures />

        <div className="my-12">
          <ProductGrid
            products={products}
            title="Productos para Hombres"
            subtitle={`${products.length} productos encontrados`}
          />
        </div>
      </div>
    </>
  )
}
