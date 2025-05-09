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

    // Aquí comprobamos si `rows` tiene elementos (es decir, si el producto ya está en favoritos)
    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json({ message: "Ya está en favoritos" })
    }

    // Si no está en favoritos, lo insertamos
    await db.query(
      "INSERT INTO favoritos (id_usuario, id_producto) VALUES (?, ?)",
      [userId, productId]
    )

    return NextResponse.json({ message: "Añadido a favoritos correctamente" })
  } catch (error) {
    console.error("Error al añadir a favoritos:", error)
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 })
  }
}
