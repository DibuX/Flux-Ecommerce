import { MinusIcon } from "lucide-react"

interface FilterOption {
  id: string
  name: string
  count: number
}

interface FilterGroup {
  name: string
  options: FilterOption[]
}

interface CategoryFiltersProps {
  filters: FilterGroup[]
}

export default function CategoryFilters({ filters }: CategoryFiltersProps) {
  return (
    <div className="w-full lg:w-64 flex-shrink-0">
      <div className="sticky top-24">
        <h3 className="font-semibold text-lg mb-4">Filtros</h3>

        {filters.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm uppercase tracking-wide">{group.name}</h4>
              <button className="text-orange-500 hover:text-orange-600">
                <MinusIcon size={16} />
              </button>
            </div>

            <div className="space-y-2">
              {group.options.map((option) => (
                <label key={option.id} className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 border rounded flex items-center justify-center group-hover:border-orange-500">
                    {/* <CheckIcon size={12} className="text-orange-500" /> */}
                  </div>
                  <span className="text-sm flex-grow">{option.name}</span>
                  <span className="text-xs text-muted-foreground">({option.count})</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md text-sm font-medium transition-colors mt-4">
          Aplicar Filtros
        </button>
        <button className="w-full text-sm text-muted-foreground hover:text-gray-900 py-2 mt-2">Limpiar Filtros</button>
      </div>
    </div>
  )
}
