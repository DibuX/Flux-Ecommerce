import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { userRepository } from "@/lib/db/repositories/userRepository"
import { z } from "zod"

const addressSchema = z.object({
  user_id: z.string(),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  address_line1: z.string().min(5),
  address_line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postal_code: z.string().min(4),
  country: z.string().min(2),
  phone: z.string().min(8),
  is_default: z.boolean().optional(),
})

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

    // Verificar que el usuario solicitado sea el mismo que está autenticado
    if (userId !== session.user.id) {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 })
    }

    // Obtener direcciones del usuario
    const addresses = await userRepository.getUserAddresses(Number.parseInt(userId))

    return NextResponse.json({ addresses })
  } catch (error) {
    console.error("Error al obtener direcciones:", error)
    return NextResponse.json({ message: "Error al procesar la solicitud" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()

    // Validar datos
    const result = addressSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ message: "Datos inválidos" }, { status: 400 })
    }

    // Verificar que el usuario solicitado sea el mismo que está autenticado
    if (result.data.user_id !== session.user.id) {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 })
    }

    // Añadir dirección
    const addressId = await userRepository.addAddress({
      ...result.data,
      user_id: Number.parseInt(result.data.user_id),
      is_default: result.data.is_default || false,
    })

    return NextResponse.json({ id: addressId, message: "Dirección añadida correctamente" }, { status: 201 })
  } catch (error) {
    console.error("Error al añadir dirección:", error)
    return NextResponse.json({ message: "Error al procesar la solicitud" }, { status: 500 })
  }
}
