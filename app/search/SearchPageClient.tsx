"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ProductFilters from "@/components/products/product-filters"
import SearchBar from "@/components/products/search-bar"
import ProductCard from "@/components/products/product-card"
import { Filter, SlidersHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import type { Product, Category } from "@/lib/types"

interface SearchPageClientProps {
  initialProducts: Product[]
  categories: Category[]
  searchParams: {
    q?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
  }
}

export default function SearchPageClient({ initialProducts, categories, searchParams }: SearchPageClientProps) {
  const router = useRouter()
  const queryParams = useSearchParams()
  
  const query = searchParams.q || ""
  const categoryParam = searchParams.category || ""
  const minPriceParam = searchParams.minPrice || ""
  const maxPriceParam = searchParams.maxPrice || ""
  const sortParam = searchParams.sort || ""

  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
  const [isFilterMobileOpen, setIsFilterMobileOpen] = useState(false)

  // Aplicar filtros cuando cambien los parámetros
  useEffect(() => {
    // Filtrar productos
    const filtered = products.filter((product) => {
      // Filtro por categoría
      if (categoryParam && product.category_id.toString() !== categoryParam) {
        return false
      }

      // Filtro por precio mínimo
      if (minPriceParam && product.price < Number.parseFloat(minPriceParam)) {
        return false
      }

      // Filtro por precio máximo
      if (maxPriceParam && product.price > Number.parseFloat(maxPriceParam)) {
        return false
      }

      return true
    })

    // Ordenar productos
    const sorted = [...filtered]

    if (sortParam) {
      switch (sortParam) {
        case "price-asc":
          sorted.sort((a, b) => a.price - b.price)
          break
        case "price-desc":
          sorted.sort((a, b) => b.price - a.price)
          break
        case "name-asc":
          sorted.sort((a, b) => a.name.localeCompare(b.name))
          break
        case "name-desc":
          sorted.sort((a, b) => b.name.localeCompare(a.name))
          break
        case "newest":
          sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          break
      }
    }

    setFilteredProducts(sorted)
  }, [products, categoryParam, minPriceParam, maxPriceParam, sortParam])

  // Manejar cambio de ordenamiento
  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(queryParams.toString())
    
    if (value && value !== "newest") {
      params.set("sort", value)
    } else {
      params.delete("sort")
    }
    
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{query ? `Resultados para "${query}"` : "Todos los Productos"}</h1>

      <div className="mb-8">
        <SearchBar defaultValue={query} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filtros para pantallas grandes */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <ProductFilters
              categories={categories}
              selectedCategory={categoryParam}
              minPrice={minPriceParam}
              maxPrice={maxPriceParam}
              sort={sortParam}
            />
          </div>
        </div>

        {/* Botón de filtros para móviles */}
        <div className="lg:hidden mb-4 w-full">
          <Button 
            className="outline w-full flex items-center justify-center" 
            onClick={() => setIsFilterMobileOpen(!isFilterMobileOpen)}
          >
            <Filter size={18} className="mr-2" />
            <span>Filtrar y Ordenar</span>
          </Button>
          
          {isFilterMobileOpen && (
            <div className="mt-4">
              <ProductFilters
                categories={categories}
                selectedCategory={categoryParam}
                minPrice={minPriceParam}
                maxPrice={maxPriceParam}
                sort={sortParam}
              />
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">{filteredProducts.length} productos encontrados</p>

                <div className="hidden lg:flex items-center">
                  <span className="mr-2 text-sm">Ordenar por:</span>
                  <select
                    className="border border-border rounded-md px-2 py-1 text-sm"
                    value={sortParam || "newest"}
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    <option value="newest">Más recientes</option>
                    <option value="price-asc">Precio: menor a mayor</option>
                    <option value="price-desc">Precio: mayor a menor</option>
                    <option value="name-asc">Nombre: A-Z</option>
                    <option value="name-desc">Nombre: Z-A</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <SlidersHorizontal size={48} className="mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No se encontraron productos</h2>
              <p className="text-muted-foreground mb-6">Intenta con otros términos de búsqueda o ajusta los filtros.</p>
              <Button
                className="outline"
                onClick={() => {
                  router.push("/search")
                }}
              >
                Ver todos los productos
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
