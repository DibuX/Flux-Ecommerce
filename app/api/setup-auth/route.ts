import { NextResponse } from "next/server"
import { setupAuthTables } from "@/lib/db/setup-auth-tables"

export async function GET() {
  try {
    await setupAuthTables()
    return NextResponse.json({ success: true, message: "Tablas de autenticación configuradas correctamente" })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { success: false, message: "Error al configurar tablas de autenticación", error: String(error) },
      { status: 500 },
    )
  }
}
