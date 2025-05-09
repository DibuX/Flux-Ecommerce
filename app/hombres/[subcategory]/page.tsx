import { notFound } from "next/navigation"
import { productRepository } from "@/lib/db/repositories/productRepository"
import { categoryRepository } from "@/lib/db/repositories/categoryRepository"
import ProductGrid from "@/components/products/product-grid"
import SubcategoryHeader from "@/components/category/subcategory-header"
import CategoryFilters from "@/components/category/category-filters"
import type { Metadata } from "next"

interface SubcategoryPageProps {
  params: {
    subcategory: string
  }
}

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
  // Buscar la categoría principal
  const categories = await categoryRepository.getAllCategories()
  const menCategory = categories.find((c) => c.name.toLowerCase() === "hombre")

  if (!menCategory) {
    return {
      title: "Subcategoría no encontrada",
      description: "La subcategoría que buscas no existe",
    }
  }

  // Buscar la subcategoría
  const subcategories = await categoryRepository.getSubcategoriesByParentId(menCategory.id)
  const subcategory = subcategories.find((s) => s.name.toLowerCase() === params.subcategory.toLowerCase())

  if (!subcategory) {
    return {
      title: "Subcategoría no encontrada",
      description: "La subcategoría que buscas no existe",
    }
  }

  return {
    title: `${subcategory.name} para Hombres | Flux`,
    description: `Explora nuestra colección de ${subcategory.name.toLowerCase()} para hombres.`,
  }
}

export default async function MenSubcategoryPage({ params }: SubcategoryPageProps) {
  // Buscar la categoría principal
  const categories = await categoryRepository.getAllCategories()
  const menCategory = categories.find((c) => c.name.toLowerCase() === "hombre")

  if (!menCategory) {
    notFound()
  }

  // Buscar la subcategoría
  const subcategories = await categoryRepository.getSubcategoriesByParentId(menCategory.id)
  const subcategory = subcategories.find((s) => s.name.toLowerCase() === params.subcategory.toLowerCase())

  if (!subcategory) {
    notFound()
  }

  // Obtener productos de la subcategoría
  const products = await productRepository.getProductsBySubcategory(subcategory.id)

  // Datos de ejemplo para los filtros
  const mockFilters = [
    {
      name: "Marca",
      options: [
        { id: "adidas", name: "Adidas", count: 12 },
        { id: "nike", name: "Nike", count: 8 },
        { id: "puma", name: "Puma", count: 5 },
        { id: "reebok", name: "Reebok", count: 3 },
      ],
    },
    {
      name: "Talla",
      options: [
        { id: "s", name: "S", count: 10 },
        { id: "m", name: "M", count: 15 },
        { id: "l", name: "L", count: 12 },
        { id: "xl", name: "XL", count: 8 },
      ],
    },
    {
      name: "Color",
      options: [
        { id: "black", name: "Negro", count: 14 },
        { id: "white", name: "Blanco", count: 12 },
        { id: "blue", name: "Azul", count: 9 },
        { id: "red", name: "Rojo", count: 6 },
      ],
    },
    {
      name: "Precio",
      options: [
        { id: "0-50", name: "Menos de $50", count: 5 },
        { id: "50-100", name: "$50 - $100", count: 12 },
        { id: "100-150", name: "$100 - $150", count: 8 },
        { id: "150+", name: "Más de $150", count: 4 },
      ],
    },
  ]

  return (
    <div className="bg-white">
      {/* Banner de subcategoría */}
      <div className="relative h-[240px] overflow-hidden">
        <img
          src={`/placeholder.svg?height=600&width=1600&text=${subcategory.name}%20para%20Hombres`}
          alt={`${subcategory.name} para Hombres`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">{subcategory.name}</h1>
            <p className="text-white/80 mt-2 max-w-md">
              Descubre nuestra colección de {subcategory.name.toLowerCase()} para hombres
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <SubcategoryHeader
          categoryName="Hombres"
          categoryPath="/hombres"
          subcategoryName={subcategory.name}
          productCount={products.length}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          <CategoryFilters filters={mockFilters} />

          <div className="flex-grow">
            <ProductGrid products={products} />

            {products.length === 0 && (
              <div className="text-center py-12 border rounded-lg bg-gray-50">
                <h3 className="text-xl font-medium mb-2">No hay productos disponibles</h3>
                <p className="text-muted-foreground">
                  No se encontraron productos en esta categoría. Intenta con otra categoría o vuelve más tarde.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
