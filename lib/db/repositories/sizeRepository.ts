import { executeQuery } from "../mysql"
import type { Size } from "../../types"
import { cache } from "react"

// Repositorio para tallas
export const sizeRepository = {
  // Obtener todas las tallas
  getAllSizes: cache(async (): Promise<Size[]> => {
    return executeQuery<Size>(`
      SELECT id_tallas as id, nombre as name
      FROM talles
      ORDER BY id_tallas ASC
    `)
  }),

  // Obtener una talla por ID
  getSizeById: cache(async (id: number): Promise<Size | null> => {
    const sizes = await executeQuery<Size>(
      `SELECT id_tallas as id, nombre as name
       FROM talles
       WHERE id_tallas = ?`,
      [id],
    )

    return sizes.length > 0 ? sizes[0] : null
  }),
}
