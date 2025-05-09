import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container" style={{ padding: "4rem 1rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1rem" }}>404</h1>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Página no encontrada</h2>
      <p style={{ color: "var(--muted-foreground)", marginBottom: "2rem", maxWidth: "500px", margin: "0 auto 2rem" }}>
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <Link href="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  )
}
