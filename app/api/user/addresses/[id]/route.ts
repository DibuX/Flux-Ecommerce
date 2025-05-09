import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { executeQuery } from "@/lib/db/mysql"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    // Verificar que la dirección pertenezca al usuario autenticado
    const addresses = await executeQuery(
      `SELECT id_direccion FROM direcciones WHERE id_direccion = ? AND id_usuario = ?`,
      [params.id, session.user.id],
    )

    if (addresses.length === 0) {
      return NextResponse.json({ message: "Dirección no encontrada o no autorizada" }, { status: 404 })
    }

    // Eliminar dirección
    await executeQuery(`DELETE FROM direcciones WHERE id_direccion = ?`, [params.id])

    return NextResponse.json({ message: "Dirección eliminada correctamente" })
  } catch (error) {
    console.error("Error al eliminar dirección:", error)
    return NextResponse.json({ message: "Error al procesar la solicitud" }, { status: 500 })
  }
}
