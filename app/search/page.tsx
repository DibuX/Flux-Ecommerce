import { productRepository } from "@/lib/db/repositories/productRepository"
import { categoryRepository } from "@/lib/db/repositories/categoryRepository"
import SearchPageClient from "./SearchPageClient"
import type { Product, Category } from "@/lib/types"

interface SearchPageProps {
  searchParams: {
    q?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
  }
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""

  return {
    title: query ? `Búsqueda: ${query}` : "Búsqueda de Productos",
    description: `Resultados de búsqueda para "${query}" en flux`,
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Obtener productos según la búsqueda
  const query = searchParams.q || ""
  const products: Product[] = query
    ? await productRepository.searchProducts(query)
    : await productRepository.getAllProducts()

  // Obtener categorías para los filtros
  const categories: Category[] = await categoryRepository.getAllCategories()

  return (
    <SearchPageClient 
      initialProducts={products} 
      categories={categories} 
      searchParams={searchParams} 
    />
  )
}
