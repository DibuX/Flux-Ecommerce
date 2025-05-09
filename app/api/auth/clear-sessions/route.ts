import { NextResponse } from "next/server"

export async function GET() {
  const cookieNames = ["next-auth.session-token", "next-auth.callback-url", "next-auth.csrf-token"]

  const response = NextResponse.json({
    success: true,
    message: "Sesiones limpiadas correctamente",
    clearedCookies: cookieNames,
  })

  for (const name of cookieNames) {
    response.cookies.delete(name)
  }

  return response
}
