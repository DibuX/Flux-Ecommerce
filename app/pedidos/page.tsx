import { getServerSession } from "next-auth/next"
import { type Session } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Package } from "lucide-react"
import OrderHistory from "@/components/orders/order-history"

export const metadata = {
  title: "Mis Pedidos",
  description: "Historial de pedidos realizados",
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions) as Session & { user: { id: string } }

  // Si no está autenticado, redirigir a login
  if (!session) {
    redirect("/login?redirect=/pedidos")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <Package className="mr-2" /> Mis Pedidos
      </h1>

      {session?.user?.id && <OrderHistory userId={session.user.id} />}
    </div>
  )
}
