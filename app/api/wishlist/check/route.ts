import { NextResponse } from "next/server"
import { db } from "@/lib/db/mysql"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, productId } = body

    if (!userId || !productId) {
      return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 })
    }

    // Hacemos la consulta y extraemos los resultados de `rows`
    const [rows] = await db.query(
      "SELECT * FROM favoritos WHERE id_usuario = ? AND id_producto = ?",
      [userId, productId]
    )

    // Verificamos si `rows` contiene resultados
    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json({ isFavorite: true })
    } else {
      return NextResponse.json({ isFavorite: false })
    }
  } catch (error) {
    console.error("Error al verificar favoritos:", error)
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 })
  }
}
