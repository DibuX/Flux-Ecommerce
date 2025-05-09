"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function FixAuthPage() {
  const [status, setStatus] = useState("Iniciando limpieza de sesión...")
  const router = useRouter()

  useEffect(() => {
    async function clearCookies() {
      try {
        setStatus("Eliminando cookies de autenticación...")

        // Llamar al endpoint para limpiar todas las cookies
        const response = await fetch("/api/auth/clear-all-cookies")
        const data = await response.json()

        if (data.success) {
          setStatus("Cookies eliminadas correctamente. Redirigiendo al login en 3 segundos...")

          // Esperar 3 segundos y redirigir al login
          setTimeout(() => {
            router.push("/login")
          }, 3000)
        } else {
          setStatus("Error al eliminar cookies. Por favor, inténtalo de nuevo.")
        }
      } catch (error) {
        console.error("Error:", error)
        setStatus("Error inesperado. Por favor, inténtalo de nuevo.")
      }
    }

    clearCookies()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Reparando autenticación</h1>

        <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-md">
          <p className="text-orange-800">{status}</p>
        </div>

        <div className="animate-pulse flex justify-center">
          <div className="h-4 w-32 bg-orange-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}
