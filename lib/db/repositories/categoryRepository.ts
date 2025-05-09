import { executeQuery } from "../mysql"
import type { Category, Subcategory } from "../../types"
import { cache } from "react"

// Repositorio para categorías
export const categoryRepository = {
  // Obtener todas las categorías
  getAllCategories: cache(async (): Promise<Category[]> => {
    try {
      const categories = await executeQuery<Category>(`
        SELECT id_categoria as id, nombre as name, 
               LOWER(REPLACE(nombre, ' ', '-')) as slug,
               descripcion as description
        FROM categorias
        ORDER BY nombre ASC
      `)

      console.log(`Categorías obtenidas: ${categories.length}`)
      return categories
    } catch (error) {
      console.error("Error al obtener categorías:", error)
      return []
    }
  }),

  // Obtener una categoría por ID
  getCategoryById: cache(async (id: number): Promise<Category | null> => {
    const categories = await executeQuery<Category>(
      `SELECT id_categoria as id, nombre as name, 
              LOWER(REPLACE(nombre, ' ', '-')) as slug,
              descripcion as description
       FROM categorias
       WHERE id_categoria = ?`,
      [id],
    )

    return categories.length > 0 ? categories[0] : null
  }),

  // Obtener subcategorías por categoría padre
  getSubcategoriesByParentId: cache(async (parentId: number): Promise<Subcategory[]> => {
    return executeQuery<Subcategory>(
      `SELECT id_sub_categoria as id, nombre as name, 
              LOWER(REPLACE(nombre, ' ', '-')) as slug,
              id_categoria as category_id
       FROM sub_categorias
       WHERE id_categoria = ?
       ORDER BY nombre ASC`,
      [parentId],
    )
  }),
}
