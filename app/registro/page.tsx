import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import RegisterForm from "@/components/auth/register-form"
import "@/app/auth-styles.css"

export const metadata = {
  title: "Registro | Flux",
  description: "Crea una cuenta en Flux",
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: { redirect?: string }
}) {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect(searchParams.redirect || "/")
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-logo">Flux</h1>
          <h2 className="auth-title">Crear Cuenta</h2>
          <p className="auth-subtitle">Regístrate para acceder a todas las funcionalidades</p>
        </div>

        <div className="auth-body">
          <RegisterForm redirectUrl={searchParams.redirect} />
        </div>

        <div className="auth-footer">
          <p>
            ¿Ya tienes una cuenta?{" "}
            <Link
              href={`/login${searchParams.redirect ? `?redirect=${searchParams.redirect}` : ""}`}
              className="auth-link"
            >
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
