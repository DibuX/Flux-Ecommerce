import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { executeQuery } from "@/lib/db/mysql"

// Obtener lista de favoritos
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ message: "ID de usuario requerido" }, { status: 400 })
    }

    if (String(userId) !== String(session.user.id)) {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 })
    }

    const items = await executeQuery(
      `SELECT p.id_producto as id, p.nombre as name, p.descripcion as description, 
              p.precio as price, p.img_principal as image, p.id_categoria as category_id, 
              p.id_marca as brand_id, p.stock, p.fecha_alta as created_at
       FROM favoritos f
       JOIN productos p ON f.id_producto = p.id_producto
       WHERE f.id_usuario = ?
       ORDER BY f.fecha_agregado DESC`,
      [userId],
    )

    return NextResponse.json({ items })
  } catch (error) {
    console.error("Error al obtener favoritos:", error)
    return NextResponse.json({ message: "Error al procesar la solicitud" }, { status: 500 })
  }
}

// Añadir a favoritos
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const { userId, productId } = await request.json()

    if (!userId || !productId) {
      return NextResponse.json({ message: "Datos incompletos" }, { status: 400 })
    }

    if (String(userId) !== String(session.user.id)) {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 })
    }

    const existingItems = await executeQuery(
      "SELECT id FROM favoritos WHERE id_usuario = ? AND id_producto = ?",
      [userId, productId]
    )

    if (existingItems.length > 0) {
      return NextResponse.json({ message: "El producto ya está en favoritos" }, { status: 409 })
    }

    await executeQuery(
      "INSERT INTO favoritos (id_usuario, id_producto, fecha_agregado) VALUES (?, ?, NOW())",
      [userId, productId]
    )

    return NextResponse.json({ message: "Producto añadido a favoritos" }, { status: 201 })
  } catch (error) {
    console.error("Error al añadir a favoritos:", error)
    return NextResponse.json({ message: "Error al procesar la solicitud" }, { status: 500 })
  }
}

// Eliminar de favoritos
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const { userId, productId } = await request.json()

    if (!userId || !productId) {
      return NextResponse.json({ message: "Datos incompletos" }, { status: 400 })
    }

    if (String(userId) !== String(session.user.id)) {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 })
    }

    await executeQuery(
      "DELETE FROM favoritos WHERE id_usuario = ? AND id_producto = ?",
      [userId, productId]
    )

    return NextResponse.json({ message: "Producto eliminado de favoritos" })
  } catch (error) {
    console.error("Error al eliminar de favoritos:", error)
    return NextResponse.json({ message: "Error al procesar la solicitud" }, { status: 500 })
  }
}
