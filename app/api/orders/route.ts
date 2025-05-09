import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { executeQuery } from "@/lib/db/mysql"
import type { Order, OrderItem, Address } from "@/lib/types"

// Obtener pedidos del usuario
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const orderId = searchParams.get("orderId")

    if (!userId) {
      return NextResponse.json({ message: "ID de usuario requerido" }, { status: 400 })
    }

    // Verificar que el usuario solicitado sea el mismo que está autenticado
    if (userId !== session.user.id) {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 })
    }

    // Si se solicita un pedido específico
    if (orderId) {
      const orderData = await executeQuery(
        `SELECT id_pedido as id, id_usuario as user_id, estado as status, 
                total, fecha_creacion as created_at, fecha_actualizacion as updated_at
         FROM pedidos
         WHERE id_pedido = ? AND id_usuario = ?`,
        [orderId, userId],
      )

      if (orderData.length === 0) {
        return NextResponse.json({ message: "Pedido no encontrado" }, { status: 404 })
      }

      const order = orderData[0] as Order

      // Obtener dirección de envío
      const shippingAddressData = await executeQuery(
        `SELECT id_direccion as id, id_usuario as user_id, nombre as first_name, 
                apellido as last_name, direccion as address_line1, direccion_adicional as address_line2,
                ciudad as city, estado as state, codigo_postal as postal_code, 
                pais as country, telefono as phone, es_predeterminada as is_default
         FROM direcciones
         WHERE id_direccion = (
           SELECT id_direccion_envio FROM pedidos WHERE id_pedido = ?
         )`,
        [orderId],
      )

      // Obtener dirección de facturación
      const billingAddressData = await executeQuery(
        `SELECT id_direccion as id, id_usuario as user_id, nombre as first_name, 
                apellido as last_name, direccion as address_line1, direccion_adicional as address_line2,
                ciudad as city, estado as state, codigo_postal as postal_code, 
                pais as country, telefono as phone, es_predeterminada as is_default
         FROM direcciones
         WHERE id_direccion = (
           SELECT id_direccion_facturacion FROM pedidos WHERE id_pedido = ?
         )`,
        [orderId],
      )

      // Obtener items del pedido
      const orderItems = await executeQuery(
        `SELECT id_detalle_pedido as id, id_pedido as order_id, id_producto as product_id,
                nombre_producto as name, precio as price, cantidad as quantity,
                talla as size, color
         FROM detalles_pedido
         WHERE id_pedido = ?`,
        [orderId],
      )

      order.shipping_address = shippingAddressData[0] as Address
      order.billing_address = billingAddressData[0] as Address
      order.items = orderItems as OrderItem[]

      return NextResponse.json({ order })
    }

    // Obtener todos los pedidos del usuario
    const orders = await executeQuery(
      `SELECT id_pedido as id, id_usuario as user_id, estado as status, 
              total, fecha_creacion as created_at, fecha_actualizacion as updated_at
       FROM pedidos
       WHERE id_usuario = ?
       ORDER BY fecha_creacion DESC`,
      [userId],
    )

    // Para cada pedido, obtener información básica
    const ordersWithDetails = await Promise.all(
      orders.map(async (order: Order) => {
        // Obtener dirección de envío básica
        const shippingAddressData = await executeQuery(
          `SELECT nombre as first_name, apellido as last_name
           FROM direcciones
           WHERE id_direccion = (
             SELECT id_direccion_envio FROM pedidos WHERE id_pedido = ?
           )`,
          [order.id],
        )

        // Obtener cantidad de items
        const itemCountData = await executeQuery(
          `SELECT COUNT(*) as count
           FROM detalles_pedido
           WHERE id_pedido = ?`,
          [order.id],
        )

        return {
          ...order,
          shipping_name:
            shippingAddressData.length > 0
              ? `${(shippingAddressData[0] as { first_name: string; last_name: string }).first_name} ${(shippingAddressData[0] as { first_name: string; last_name: string }).last_name}`
              : "N/A",
          item_count: (itemCountData[0] as { count: number }).count,
        }
      }),
    )

    return NextResponse.json({ orders: ordersWithDetails })
  } catch (error) {
    console.error("Error al obtener pedidos:", error)
    return NextResponse.json({ message: "Error al procesar la solicitud" }, { status: 500 })
  }
}
