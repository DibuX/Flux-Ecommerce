import { NextResponse } from "next/server"
import { setupNextAuthTables } from "@/lib/db/setup-next-auth-tables"

export async function GET() {
  try {
    const success = await setupNextAuthTables()
    if (success) {
      return NextResponse.json({ success: true, message: "Tablas para NextAuth configuradas correctamente" })
    } else {
      return NextResponse.json({ success: false, message: "Error al configurar tablas para NextAuth" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { success: false, message: "Error al configurar tablas para NextAuth", error: String(error) },
      { status: 500 },
    )
  }
}
