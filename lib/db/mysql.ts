import mysql from "mysql2/promise"
import "server-only"

// Configuración de la conexión a MySQL
const dbConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "12345678",
  database: process.env.MYSQL_DATABASE || "flux",
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Pool de conexiones para mejor rendimiento
let pool: mysql.Pool

// Inicializar el pool de conexiones
function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig)
  }
  return pool
}

// Función para ejecutar consultas SQL
export async function executeQuery<T>(query: string, params: any[] = []): Promise<T[]> {
  try {
    const pool = getPool()
    const [rows] = await pool.query(query, params)
    return rows as T[]
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error)
    throw new Error("Error al ejecutar la consulta en la base de datos")
  }
}

// Función para ejecutar una transacción
export async function executeTransaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
  const pool = getPool()
  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()
    const result = await callback(connection)
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    console.error("Error en la transacción:", error)
    throw error
  } finally {
    connection.release()
  }
}

const db = getPool()
export { db }
