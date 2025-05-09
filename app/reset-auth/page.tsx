"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ResetAuthPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Reiniciando la autenticación...")

  useEffect(() => {
    async function resetAuth() {
      try {
        const response = await fetch("/api/auth/reset-auth")
        if (response.ok) {
          setStatus("success")
          setMessage("Autenticación reiniciada correctamente. Redirigiendo al inicio de sesión...")

          // Esperar 2 segundos antes de redirigir
          setTimeout(() => {
            router.push("/login")
          }, 2000)
        } else {
          setStatus("error")
          setMessage("Hubo un problema al reiniciar la autenticación. Por favor, inténtalo de nuevo.")
        }
      } catch (error) {
        setStatus("error")
        setMessage("Error al conectar con el servidor. Por favor, inténtalo de nuevo.")
      }
    }

    resetAuth()
  }, [router])

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold mb-8">Reinicio de Autenticación</h1>

      <div
        className={`p-4 rounded mb-6 ${
          status === "loading"
            ? "bg-yellow-100 text-yellow-800"
            : status === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
        }`}
      >
        <p>{message}</p>
      </div>

      {status === "error" && (
        <div className="mt-4">
          <Link href="/login" className="text-primary hover:underline">
            Ir a la página de inicio de sesión
          </Link>
        </div>
      )}
    </div>
  )
}
