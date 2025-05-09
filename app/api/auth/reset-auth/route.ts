import { NextResponse } from "next/server"

export async function GET() {
  const response = NextResponse.json({
    success: true,
    message: "Autenticación reiniciada. Por favor, inicia sesión nuevamente.",
  })

  // Eliminar todas las cookies relacionadas con NextAuth
  const cookiesToClear = [
    "next-auth.session-token",
    "next-auth.callback-url",
    "next-auth.csrf-token",
    "__Secure-next-auth.session-token",
    "__Secure-next-auth.callback-url",
    "__Secure-next-auth.csrf-token",
    "__Host-next-auth.csrf-token",
  ]

  cookiesToClear.forEach((name) => {
    
    response.cookies.set({
      name,
      value: "",
      expires: new Date(0),
      path: "/",
    })
  })

  return response
}
