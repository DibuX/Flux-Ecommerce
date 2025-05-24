export const dynamic = "force-dynamic";
import { productRepository } from "@/lib/db/repositories/productRepository"
import { categoryRepository } from "@/lib/db/repositories/categoryRepository"
import ProductGrid from "@/components/products/product-grid"
import type { Metadata } from "next"
import CategoryBanner from "@/components/category/category-banner"
import CategoryFeatures from "@/components/category/category-features"

export const metadata: Metadata = {
  title: "Moda para Mujeres | Flux",
  description: "Explora nuestra colección exclusiva para mujeres. Ropa, calzado y accesorios de las mejores marcas.",
}

export default async function WomenPage() {
  // Obtener la categoría de mujeres
  const categories = await categoryRepository.getAllCategories()
  const womenCategory = categories.find((c) => c.slug === "mujer")

  if (!womenCategory) {
    throw new Error("Categoría de mujeres no encontrada")
  }

  // Obtener productos de la categoría
  const products = await productRepository.getProductsByCategory(womenCategory.id)

  // Obtener subcategorías (lo cual no voy a agregar en este momento)
  const subcategories = await categoryRepository.getSubcategoriesByParentId(womenCategory.id)

  return (
    <>
      <div className="banner-wrapper">
        <img
          src="/img/banner-mujer3.png"
          alt="Nueva colección mujer"
          className="banner-image"
        />
        <div className="banner-text">
          <h1>Nueva Colección Mujer</h1>
          <p>Descubre las últimas tendencias en moda femenina</p>
        </div>
      </div>
  
      {/* Contenido principal */}
      <div className="mx-auto px-4 py-8">
        <CategoryFeatures />
  
        <div className="my-12">
          <ProductGrid
            products={products}
            title="Productos para Mujeres"
            subtitle={`${products.length} productos encontrados`}
          />
        </div>
      </div>
    </>
  );}
