import { NextResponse } from "next/server"

export async function GET() {
  // Lista de todas las posibles cookies de NextAuth
  const cookiesToClear = [
    "next-auth.session-token",
    "next-auth.callback-url",
    "next-auth.csrf-token",
    "__Secure-next-auth.session-token",
    "__Secure-next-auth.callback-url",
    "__Secure-next-auth.csrf-token",
    "__Host-next-auth.csrf-token",
    "next-auth.pkce.code_verifier",
  ]

  // Crear una respuesta
  const response = NextResponse.json(
    { success: true, message: "Todas las cookies han sido eliminadas" },
    { status: 200 },
  )

  // Eliminar cada cookie
  for (const cookieName of cookiesToClear) {
    response.cookies.delete(cookieName)
  }

  return response
}
