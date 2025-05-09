"use client"

import { useState, useEffect } from "react"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/hooks/use-toast"
import type { Order } from "@/lib/types"
import EmptyOrders from "./empty-orders"
import OrderDetails from "./order-details"

interface OrderHistoryProps {
  userId: string
}

export default function OrderHistory({ userId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders?userId=${userId}`)

        if (!response.ok) {
          throw new Error("Error al cargar los pedidos")
        }

        const data = await response.json()
        setOrders(data.orders)
      } catch (error) {
        console.error("Error al cargar los pedidos:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar tus pedidos",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [userId, toast])

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

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (orders.length === 0) {
    return <EmptyOrders />
  }

  if (selectedOrder) {
    return (
      <div>
        <Button variant="outline" onClick={() => setSelectedOrder(null)} className="mb-6">
          ← Volver a mis pedidos
        </Button>
        <OrderDetails order={selectedOrder} />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-4">Pedido</th>
              <th className="text-left py-4 px-4">Fecha</th>
              <th className="text-left py-4 px-4">Estado</th>
              <th className="text-left py-4 px-4">Total</th>
              <th className="text-center py-4 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border">
                <td className="py-4 px-4 font-medium">#{order.id}</td>
                <td className="py-4 px-4">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="py-4 px-4 font-medium">{formatPrice(order.total)}</td>
                <td className="py-4 px-4 text-center">
                  <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                    Ver detalles
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
