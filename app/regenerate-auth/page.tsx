"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function RegenerateAuthPage() {
  const [status, setStatus] = useState("Limpiando cookies...")
  const router = useRouter()

  useEffect(() => {
    const clearCookies = async () => {
      try {
        // Limpiar todas las cookies relacionadas con NextAuth
        document.cookie.split(";").forEach((c) => {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
        })

        setStatus("Cookies limpiadas. Regenerando secreto...")

        // Esperar un momento para asegurarse de que las cookies se han limpiado
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Llamar al endpoint para regenerar el secreto
        const response = await fetch("/api/regenerate-secret")
        const data = await response.json()

        if (data.success) {
          setStatus("Secreto regenerado correctamente. Redirigiendo...")

          // Esperar un momento antes de redirigir
          setTimeout(() => {
            router.push("/login")
          }, 2000)
        } else {
          setStatus("Error al regenerar el secreto. Intenta de nuevo.")
        }
      } catch (error) {
        console.error("Error:", error)
        setStatus("Error al regenerar el secreto. Intenta de nuevo.")
      }
    }

    clearCookies()
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">Regenerando autenticación</h1>
        <div className="mb-4 rounded-md bg-orange-100 p-4 text-orange-800">
          <p>{status}</p>
        </div>
        <div className="mt-4 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        </div>
      </div>
    </div>
  )
}
