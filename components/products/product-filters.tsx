"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { Category } from "@/lib/types"

interface ProductFiltersProps {
  categories: Category[]
  selectedCategory?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
}

export default function ProductFilters({
  categories,
  selectedCategory,
  minPrice,
  maxPrice,
  sort,
}: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice ? Number.parseFloat(minPrice) : 0,
    maxPrice ? Number.parseFloat(maxPrice) : 100000,
  ])
  const [selectedSort, setSelectedSort] = useState(sort || "newest")
  const [selectedCat, setSelectedCat] = useState(selectedCategory || "")

  // Actualizar los filtros cuando cambian los props
  useEffect(() => {
    setPriceRange([minPrice ? Number.parseFloat(minPrice) : 0, maxPrice ? Number.parseFloat(maxPrice) : 100000])
    setSelectedSort(sort || "newest")
    setSelectedCat(selectedCategory || "")
  }, [minPrice, maxPrice, sort, selectedCategory])

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Mantener la búsqueda actual
    const currentQuery = params.get("q")
    if (currentQuery) {
      params.set("q", currentQuery)
    }

    // Aplicar categoría
    if (selectedCat) {
      params.set("category", selectedCat)
    } else {
      params.delete("category")
    }

    // Aplicar rango de precios
    if (priceRange[0] > 0) {
      params.set("minPrice", priceRange[0].toString())
    } else {
      params.delete("minPrice")
    }

    if (priceRange[1] < 100000) {
      params.set("maxPrice", priceRange[1].toString())
    } else {
      params.delete("maxPrice")
    }

    // Aplicar ordenamiento
    if (selectedSort && selectedSort !== "newest") {
      params.set("sort", selectedSort)
    } else {
      params.delete("sort")
    }

    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Mantener solo la búsqueda actual
    const currentQuery = params.get("q")
    params.delete("category")
    params.delete("minPrice")
    params.delete("maxPrice")
    params.delete("sort")

    if (currentQuery) {
      params.set("q", currentQuery)
      router.push(`/search?${params.toString()}`)
    } else {
      router.push("/search")
    }
  }

  const hasActiveFilters = selectedCat || priceRange[0] > 0 || priceRange[1] < 100000 || selectedSort !== "newest"

  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Filtros</h2>
        {hasActiveFilters && (
          <Button
            className="variant-ghost text-muted-foreground hover:text-foreground text-sm"
            onClick={clearFilters}
          >
            <X size={16} className="mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Categorías */}
        <div>
          <h3 className="font-medium mb-3">Categorías</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="cat-all"
                name="category"
                value=""
                checked={selectedCat === ""}
                onChange={() => setSelectedCat("")}
                className="mr-2"
              />
              <label htmlFor="cat-all" className="text-sm">
                Todas las categorías
              </label>
            </div>

            {categories.map((category) => (
              <div key={category.id} className="flex items-center">
                <input
                  type="radio"
                  id={`cat-${category.id}`}
                  name="category"
                  value={category.id.toString()}
                  checked={selectedCat === category.id.toString()}
                  onChange={() => setSelectedCat(category.id.toString())}
                  className="mr-2"
                />
                <label htmlFor={`cat-${category.id}`} className="text-sm">
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Rango de precios */}
        <div>
          <h3 className="font-medium mb-3">Precio</h3>
            <div className="px-2">
            <Slider
              defaultValue={priceRange}
              min={0}
              max={100000}
              step={100}
              value={priceRange}
              onValueChange={(value: number[]) => setPriceRange(value as [number, number])}
              className="mb-6"
            />

            <div className="flex justify-between text-sm">
              <span>${priceRange[0].toLocaleString()}</span>
              <span>${priceRange[1].toLocaleString()}</span>
            </div>
            </div>
        </div>

        {/* Ordenamiento */}
        <div>
          <h3 className="font-medium mb-3">Ordenar por</h3>
          <select
            className="w-full border border-border rounded-md px-3 py-2 text-sm"
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
          >
            <option value="newest">Más recientes</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="name-asc">Nombre: A-Z</option>
            <option value="name-desc">Nombre: Z-A</option>
          </select>
        </div>

        <Button onClick={applyFilters} className="w-full">
          Aplicar Filtros
        </Button>
      </div>
    </div>
  )
}
