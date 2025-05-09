"use client"

import { useEffect } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear all cookies and local storage
    document.cookie.split(";").forEach((cookie) => {
      const [name] = cookie.trim().split("=")
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`
    })

    localStorage.clear()
    sessionStorage.clear()

    // Sign out using NextAuth
    signOut({ redirect: false }).then(() => {
      // Redirect to home page after logout
      router.push("/")
    })
  }, [router])

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-2xl font-bold mb-4">Cerrando sesión...</h1>
      <p>Por favor espera mientras cerramos tu sesión.</p>
    </div>
  )
}
