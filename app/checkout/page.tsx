import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import CheckoutForm from "@/components/checkout/checkout-form"
import CheckoutSummary from "@/components/checkout/checkout-summary"

export const metadata = {
  title: "Checkout",
  description: "Completa tu compra",
}

export default async function CheckoutPage() {
  // Verificar si el usuario está autenticado
  const session = await getServerSession(authOptions)
  
  // Si no está autenticado, redirigir a login
  if (!session) {
    redirect("/login?redirect=/checkout")
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {session?.user && <CheckoutForm user={{ name: session.user.name, email: session.user.email }} />}
        </div>
        
        <div className="lg:col-span-1">
          <CheckoutSummary />
        </div>
      </div>
    </div>
  )
}
