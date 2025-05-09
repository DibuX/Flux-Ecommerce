import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Pedido Completado",
  description: "Tu pedido ha sido procesado correctamente",
}

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="text-success w-20 h-20" />
        </div>

        <h1 className="text-3xl font-bold mb-4">¡Gracias por tu compra!</h1>

        <p className="text-lg mb-8">
          Tu pedido ha sido procesado correctamente. Hemos enviado un correo electrónico con los detalles de tu compra.
        </p>

        <div className="bg-white rounded-lg border border-border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Detalles del Pedido</h2>

          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Número de Pedido:</span>
            <span className="font-medium">#FL-{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Fecha:</span>
            <span className="font-medium">{new Date().toLocaleDateString()}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Estado:</span>
            <span className="font-medium text-success">Confirmado</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Método de Pago:</span>
            <span className="font-medium">Tarjeta de Crédito</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/pedidos">
            <Button className="border border-gray-300 text-gray-700">Ver Mis Pedidos</Button>
          </Link>

          <Link href="/">
            <Button>Continuar Comprando</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
