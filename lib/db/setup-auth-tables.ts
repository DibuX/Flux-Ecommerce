import { executeQuery } from "./mysql"
import fs from "fs"
import path from "path"

export async function setupAuthTables() {
  try {
    console.log("Configurando tablas de autenticación...")

    // Leer el archivo SQL
    const sqlFilePath = path.join(process.cwd(), "db-auth-tables.sql")
    const sqlContent = fs.readFileSync(sqlFilePath, "utf8")

    // Dividir el contenido en consultas individuales
    const queries = sqlContent
      .split(";")
      .filter((query) => query.trim() !== "")
      .map((query) => query.trim() + ";")

    // Ejecutar cada consulta
    for (const query of queries) {
      await executeQuery(query, [])
    }

    console.log("Tablas de autenticación configuradas correctamente")
  } catch (error) {
    console.error("Error al configurar tablas de autenticación:", error)
    throw error
  }
}
