import { executeQuery } from "../mysql"
import type { User, Address } from "../../types"
import { cache } from "react"
import bcrypt from "bcryptjs"

// Repositorio para usuarios
export const userRepository = {
  // Obtener un usuario por ID
  getUserById: cache(async (id: number): Promise<User | null> => {
    const users = await executeQuery<User>(
      `SELECT id_usuario as id, nombre as first_name, apellido as last_name, 
              email, fecha_registro as created_at, ultimo_login as last_login, 
              activo as is_active
       FROM usuarios
       WHERE id_usuario = ?`,
      [id],
    )

    return users.length > 0 ? users[0] : null
  }),

  // Obtener un usuario por email
  getUserByEmail: cache(async (email: string): Promise<User | null> => {
    const users = await executeQuery<User>(
      `SELECT id_usuario as id, nombre as first_name, apellido as last_name, 
              email, password, fecha_registro as created_at, ultimo_login as last_login, 
              activo as is_active
       FROM usuarios
       WHERE email = ?`,
      [email],
    )

    return users.length > 0 ? users[0] : null
  }),

  // Crear un nuevo usuario
  createUser: async (userData: {
    first_name: string
    last_name: string
    email: string
    password: string
  }): Promise<number> => {
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    const result = await executeQuery<{ insertId: number }>(
      `INSERT INTO usuarios (nombre, apellido, email, password, fecha_registro, ultimo_login, activo)
       VALUES (?, ?, ?, ?, NOW(), NOW(), 1)`,
      [userData.first_name, userData.last_name, userData.email, hashedPassword],
    )

    return result[0].insertId
  },

  // Actualizar un usuario
  updateUser: async (
    id: number,
    userData: {
      first_name?: string
      last_name?: string
      email?: string
      is_active?: boolean
    },
  ): Promise<boolean> => {
    const fields = []
    const values = []

    if (userData.first_name) {
      fields.push("nombre = ?")
      values.push(userData.first_name)
    }

    if (userData.last_name) {
      fields.push("apellido = ?")
      values.push(userData.last_name)
    }

    if (userData.email) {
      fields.push("email = ?")
      values.push(userData.email)
    }

    if (userData.is_active !== undefined) {
      fields.push("activo = ?")
      values.push(userData.is_active ? 1 : 0)
    }

    if (fields.length === 0) {
      return false
    }

    values.push(id)

    await executeQuery(`UPDATE usuarios SET ${fields.join(", ")} WHERE id_usuario = ?`, values)

    return true
  },

  // Obtener direcciones de un usuario
  getUserAddresses: cache(async (userId: number): Promise<Address[]> => {
    return executeQuery<Address>(
          
    `SELECT 
    d.id_direccion AS id,
    u.id_usuario AS user_id,
    u.nombre AS first_name,
    u.apellido AS last_name,
    d.calle,
    d.calle_numero,
    d.ciudad AS city,
    d.postal_code,
    d.pais AS country,
    d.predeterminada AS is_default
  FROM 
    direcciones d
  JOIN 
    usuarios u ON u.id_usuario = d.id_usuario
  WHERE 
    u.id_usuario = ?
  ORDER BY 
    d.predeterminada DESC, 
    d.id_direccion DESC`,
      [userId],
    )
  }),

  // Añadir una dirección
  addAddress: async (address: Omit<Address, "id">): Promise<number> => {
    const result = await executeQuery<{ insertId: number }>(
      `INSERT INTO direcciones (id_usuario, calle,
                              ciudad, codigo_postal, pais, predeterminada)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        address.user_id,
        address.calle,
        address.city,
        address.postal_code,
        address.country,
        address.is_default ? 1 : 0,
      ],
    )

    // Si es la dirección predeterminada, actualizar las demás
    if (address.is_default) {
      await executeQuery(
        `UPDATE direcciones SET es_predeterminada = 0 
         WHERE id_usuario = ? AND id_direccion != ?`,
        [address.user_id, result[0].insertId],
      )
    }

    return result[0].insertId
  },
}
