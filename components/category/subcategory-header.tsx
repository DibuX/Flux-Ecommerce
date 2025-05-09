import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface SubcategoryHeaderProps {
  categoryName: string
  categoryPath: string
  subcategoryName: string
  productCount: number
}

export default function SubcategoryHeader({
  categoryName,
  categoryPath,
  subcategoryName,
  productCount,
}: SubcategoryHeaderProps) {
  return (
    <div className="mb-12">
      <div className="border-b pb-6 mb-8">
        <Link
          href={categoryPath}
          className="text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1 mb-4 text-sm font-medium"
        >
          <ChevronLeft size={16} />
          <span>Volver a {categoryName}</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold capitalize">{subcategoryName}</h1>
            <p className="text-muted-foreground mt-2">
              {productCount} {productCount === 1 ? "producto" : "productos"} disponibles
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Ordenar por:</span>
            <select className="border rounded-md px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="newest">Más recientes</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="name">Nombre</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
