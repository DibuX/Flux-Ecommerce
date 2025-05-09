import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Heart } from "lucide-react"
import WishlistItems from "@/components/wishlist/wishlist-items"
import Link from "next/link"

export const metadata = {
  title: "Mis Favoritos",
  description: "Productos guardados en tu lista de deseos",
}

export default async function WishlistPage() {
  let session

  try {
    session = await getServerSession(authOptions)
  } catch (error) {
    console.error("Error al obtener la sesión:", error)
    // En vez de redirigirte, Te muestra un error con un Link a login
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-8">Error de sesión</h1>
        <p className="mb-4">Ha ocurrido un error con tu sesión. Por favor, inicia sesión nuevamente.</p>
        <Link
          href="/api/auth/logout?callbackUrl=/login"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          Iniciar sesión
        </Link>
      </div>
    )
  }

  // Si no está autenticado, redirigir a login
  if (!session) {
    redirect("/login?redirect=/favoritos")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <Heart className="mr-2" /> Mis Favoritos
      </h1>

      <WishlistItems userId={String(session.user.id)} />
    </div>
  )
}
