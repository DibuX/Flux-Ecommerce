import { executeQuery } from "./mysql"
import fs from "fs"
import path from "path"

export async function setupNextAuthTables() {
  try {
    console.log("Configurando tablas para NextAuth...")

    // Leer el archivo SQL
    const sqlFilePath = path.join(process.cwd(), "next-auth-tables.sql")
    const sqlContent = fs.readFileSync(sqlFilePath, "utf8")

    // Aca divido el contenido en consultas individuales
    const queries = sqlContent
      .split(";")
      .filter((query) => query.trim() !== "")
      .map((query) => query.trim() + ";")

    // Ejecutar cada consulta
    for (const query of queries) {
      await executeQuery(query, [])
    }

    console.log("Tablas para NextAuth configuradas correctamente")
    return true
  } catch (error) {
    console.error("Error al configurar tablas para NextAuth:", error)
    return false
  }
}
