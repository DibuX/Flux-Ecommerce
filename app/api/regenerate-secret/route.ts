import { NextResponse } from "next/server"
import { randomBytes } from "crypto"

export async function GET() {
  try {
    // Generar un nuevo secreto
    const newSecret = randomBytes(32).toString("hex")


    return NextResponse.json({
      success: true,
      message: "Secreto regenerado correctamente",
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { success: false, message: "Error al regenerar el secreto", error: String(error) },
      { status: 500 },
    )
  }
}
