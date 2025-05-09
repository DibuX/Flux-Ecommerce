import { notFound } from "next/navigation"
import { productRepository } from "@/lib/db/repositories/productRepository"
import { categoryRepository } from "@/lib/db/repositories/categoryRepository"
import ProductGrid from "@/components/products/product-grid"

interface CategoryPageProps {
  params: {
    category: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  // Buscar la categoría por slug
  const categories = await categoryRepository.getAllCategories()
  const category = categories.find((c) => c.slug === params.category)

  if (!category) {
    return {
      title: "Categoría no encontrada",
      description: "La categoría que buscas no existe",
    }
  }

  return {
    title: `${category.name.charAt(0).toUpperCase() + category.name.slice(1)} | Flux`,
    description: `Explora nuestra colección de productos para ${category.name}`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Buscar la categoría por slug
  const categories = await categoryRepository.getAllCategories()
  const category = categories.find((c) => c.slug === params.category)

  if (!category) {
    notFound()
  }

  // Obtener productos de la categoría
  const products = await productRepository.getProductsByCategory(category.id)

  // Obtener subcategorías de la categoría
  const subcategories = await categoryRepository.getSubcategoriesByParentId(category.id)

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 capitalize">{category.name}</h1>
      <p className="text-muted-foreground mb-8">
        Explora nuestra colección de productos para {category.name.toLowerCase()}
      </p>

      {subcategories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Subcategorías</h2>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((subcategory) => (
              <a
                key={subcategory.id}
                href={`/${category.slug}/${subcategory.slug}`}
                className="px-4 py-2 bg-muted rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                {subcategory.name}
              </a>
            ))}
          </div>
        </div>
      )}

      <ProductGrid
        products={products}
        title={`Productos para ${category.name}`}
        subtitle={`${products.length} productos encontrados`}
      />
    </div>
  )
}
