import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { userRepository } from "@/lib/db/repositories/userRepository"
import { z } from "zod"

const userUpdateSchema = z.object({
  first_name: z.string().min(2).optional(),
  last_name: z.string().min(2).optional(),
  email: z.string().email().optional(),
})

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    // Verificar que el usuario solicitado sea el mismo que está autenticado
    if (params.id !== session.user.id) {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 })
    }

    const body = await request.json()

    // Validar datos
    const result = userUpdateSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ message: "Datos inválidos" }, { status: 400 })
    }

    // Actualizar usuario
    await userRepository.updateUser(Number.parseInt(params.id), result.data)

    return NextResponse.json({ message: "Usuario actualizado correctamente" })
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    return NextResponse.json({ message: "Error al procesar la solicitud" }, { status: 500 })
  }
}
