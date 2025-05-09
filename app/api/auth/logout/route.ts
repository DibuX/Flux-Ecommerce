import { NextResponse } from "next/server"

export async function GET() {
  // Clear the auth cookie by setting it to expire in the past
  const response = NextResponse.json({ success: true, message: "Logged out successfully" }, { status: 200 })

  // Set the cookie to expire in the past
  response.cookies.set("next-auth.session-token", "", {
    expires: new Date(0),
    path: "/",
  })

  // Also clear the csrf token cookie if it exists
  response.cookies.set("next-auth.csrf-token", "", {
    expires: new Date(0),
    path: "/",
  })

  return response
}
