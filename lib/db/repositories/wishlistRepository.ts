import { executeQuery } from "../mysql"
import type { Product } from "../../types"

// Repositorio para lista de deseos
export const wishlistRepository = {
  // Obtener productos en la lista de deseos de un usuario
  getUserWishlist: async (userId: number): Promise<Product[]> => {
    return executeQuery<Product>(
      `SELECT p.id_producto as id, p.nombre as name, p.descripcion as description, 
              p.precio as price, p.img_principal as image, p.id_categoria as category_id, 
              p.id_marca as brand_id, p.stock, p.fecha_alta as created_at, p.talla as size
       FROM favoritos f
       JOIN productos p ON f.id_producto = p.id_producto
       WHERE f.id_usuario = ?
       ORDER BY f.fecha_agregado DESC`,
      [userId],
    )
  },

  // Verificar si un producto está en la lista de deseos
  isProductInWishlist: async (userId: number, productId: number): Promise<boolean> => {
    const result = await executeQuery<{ count: number }>(
      `SELECT COUNT(*) as count
       FROM favoritos
       WHERE id_usuario = ? AND id_producto = ?`,
      [userId, productId],
    )

    return result[0].count > 0
  },

  // Añadir un producto a la lista de deseos
  addToWishlist: async (userId: number, productId: number): Promise<boolean> => {
    try {
      await executeQuery(
        `INSERT INTO favoritos (id_usuario, id_producto, fecha_agregado)
         VALUES (?, ?, NOW())`,
        [userId, productId],
      )
      return true
    } catch (error) {
      // Si ya existe, ignorar el error
      return false
    }
  },

  // Eliminar un producto de la lista de deseos
  removeFromWishlist: async (userId: number, productId: number): Promise<boolean> => {
    try {
      await executeQuery(
        `DELETE FROM favoritos
         WHERE id_usuario = ? AND id_producto = ?`,
        [userId, productId],
      )
      return true
    } catch (error) {
      // Manejar errores si la consulta falla
      console.error("Error al eliminar de la lista de deseos:", error)
      return false
    }
  },
}