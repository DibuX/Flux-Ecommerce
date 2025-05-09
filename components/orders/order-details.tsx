import Image from "next/image"
import Link from "next/link"
import { formatPrice, getImageUrl } from "@/lib/utils"
import type { Order } from "@/lib/types"

export interface OrderItem {
  id: string
  name: string
  product_id: string
  unit_price: number
  quantity: number
  size?: string
  image?: string 
}

interface OrderDetailsProps {
  order: Order
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "processing":
        return "Procesando"
      case "shipped":
        return "Enviado"
      case "delivered":
        return "Entregado"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg border border-border p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">Pedido #{order.id}</h2>
            <p className="text-muted-foreground">Realizado el {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(order.status)}`}>
              {getStatusText(order.status)}
            </span>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="font-semibold mb-4">Productos</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center py-2">
                <div className="w-16 h-16 relative flex-shrink-0">
                  <Image
                    src={getImageUrl(item.image || "") || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="ml-4 flex-grow">
                  <Link href={`/productos/${item.product_id}`} className="font-medium hover:text-primary">
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {item.size && `Talla: ${item.size}`}
                  </p>
                  <p className="text-sm">
                    {formatPrice(item.unit_price)} x {item.quantity}
                  </p>
                </div>
                <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Información de Envío</h3>
          <address className="not-italic">
            <p className="font-medium">
                {order.shipping_address ? (
                  <>
                  <p>{order.shipping_address.address_line1}</p>
                  {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                  <p>
                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                  </p>
                  <p>{order.shipping_address.country}</p>
                  <p className="mt-2">Teléfono: {order.shipping_address.phone}</p>
                  </>
                ) : (
                  <p>No shipping address available</p>
                )}
              {order.shipping_address_id ? `Shipping Address ID: ${order.shipping_address_id}` : "No shipping address available"}
            </p>
            <p>{order.shipping_address.address_line1}</p>
            {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
            <p>
              {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
            </p>
            <p>{order.shipping_address.country}</p>
            <p className="mt-2">Teléfono: {order.shipping_address.phone}</p>
          </address>
        </div>

        <div className="bg-white rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Resumen del Pedido</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.total * 0.79)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Envío</span>
              <span>{formatPrice(order.total * 0.05)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Impuestos</span>
              <span>{formatPrice(order.total * 0.16)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-bold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
