import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import LoginForm from "@/components/auth/login-form"
import "@/app/auth-styles.css"

export const metadata = {
  title: "Iniciar Sesión | Flux",
  description: "Accede a tu cuenta de Flux",
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string; error?: string }
}) {
  let session

  try {
    session = await getServerSession(authOptions)
  } catch (error) {
    console.error("Error al obtener la sesión:", error)
    // Continuar sin loguear
    session = null
  }

  if (session) {
    redirect(searchParams.redirect || "/")
  }

  const error = searchParams.error ?? null
  const redirectUrl = searchParams.redirect ?? "/"

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-logo">Flux</h1>
          <h2 className="auth-title">Iniciar Sesión</h2>
          <p className="auth-subtitle">Ingresa tus credenciales para acceder a tu cuenta</p>
          {error && <p className="error-message mt-2">Error: {error}</p>}
        </div>

        <div className="auth-body">
          <LoginForm redirectUrl={redirectUrl} />
        </div>

        <div className="auth-footer">
          <p>
            ¿No tienes una cuenta?{" "}
            <Link
              href={`/registro${redirectUrl ? `?redirect=${redirectUrl}` : ""}`}
              className="auth-link"
            >
              Regístrate
            </Link>
          </p>
          <p className="mt-2 text-sm">
            <Link href="/reset-auth" className="text-gray-500 hover:text-primary">
              ¿Problemas para iniciar sesión? Reiniciar autenticación
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
