import { executeQuery, executeTransaction } from "../mysql";
import type { Order, OrderItem, Address, PaymentMethod } from "../../types";
import { cache } from "react";
import { ResultSetHeader } from 'mysql2';

export const orderRepository = {
  getUserOrders: cache(async (userId: number): Promise<Order[]> => {
    return executeQuery<Order>(
      `SELECT id_pedido as id, id_usuario as user_id, estado as status, 
              total, fecha_creacion as created_at, fecha_actualizacion as updated_at
       FROM pedidos
       WHERE id_usuario = ?
       ORDER BY fecha_creacion DESC`,
      [userId],
    );
  }),

  getOrderById: cache(async (id: number): Promise<Order | null> => {
    const orders = await executeQuery<Order>(
      `SELECT id_pedido as id, id_usuario as user_id, estado as status, 
              total, fecha_creacion as created_at, fecha_actualizacion as updated_at
       FROM pedidos
       WHERE id_pedido = ?`,
      [id],
    );

    if (orders.length === 0) {
      return null;
    }

    const order = orders[0];

    const items = await executeQuery<OrderItem>(
      `SELECT id_detalle_pedido as id, id_pedido as order_id, id_producto as product_id,
              nombre_producto as name, precio as price, cantidad as quantity,
              talla as size, color
       FROM detalles_pedido
       WHERE id_pedido = ?`,
      [id],
    );

    const shippingAddresses = await executeQuery<Address>(
      `SELECT id_direccion as id, id_usuario as user_id, nombre as first_name, 
              apellido as last_name, direccion as address_line1, direccion_adicional as address_line2,
              ciudad as city, estado as state, codigo_postal as postal_code, 
              pais as country, telefono as phone, es_predeterminada as is_default
       FROM direcciones
       WHERE id_direccion = (
         SELECT id_direccion_envio FROM pedidos WHERE id_pedido = ?
       )`,
      [id],
    );

    const billingAddresses = await executeQuery<Address>(
      `SELECT id_direccion as id, id_usuario as user_id, nombre as first_name, 
              apellido as last_name, direccion as address_line1, direccion_adicional as address_line2,
              ciudad as city, estado as state, codigo_postal as postal_code, 
              pais as country, telefono as phone, es_predeterminada as is_default
       FROM direcciones
       WHERE id_direccion = (
         SELECT id_direccion_facturacion FROM pedidos WHERE id_pedido = ?
       )`,
      [id],
    );

    const paymentMethods = await executeQuery<{ name: string }>(
      `SELECT nombre as name
       FROM metodos_pago
       WHERE id_metodo = (
         SELECT id_metodo_pago FROM pedidos WHERE id_pedido = ?
       )`,
      [id],
    );

    order.items = items;
    order.shipping_address = shippingAddresses[0] || null;
    order.billing_address = billingAddresses[0] || null;
    order.payment_method = paymentMethods[0]?.name || "Desconocido"; // Usamos el tipo string

    return order;
  }),

  createOrder: async (orderData: {
    user_id: number;
    total: number;
    shipping_address_id: number;
    billing_address_id: number;
    payment_method_id: number;
    items: Array<{
      product_id: number;
      name: string;
      price: number;
      quantity: number;
      size?: string;
      color?: string;
    }>;
  }): Promise<number> => {
    return executeTransaction(async (connection) => {
      const [orderResult] = await connection.execute<ResultSetHeader>(
        `INSERT INTO pedidos (id_usuario, estado, total, fecha_creacion, fecha_actualizacion,
                                    id_direccion_envio, id_direccion_facturacion, id_metodo_pago)
         VALUES (?, 'pendiente', ?, NOW(), NOW(), ?, ?, ?)`,
        [
          orderData.user_id,
          orderData.total,
          orderData.shipping_address_id,
          orderData.billing_address_id,
          orderData.payment_method_id,
        ],
      );

      const orderId = (orderResult[0] as ResultSetHeader).insertId;

      for (const item of orderData.items) {
        await connection.execute(
          `INSERT INTO detalles_pedido (id_pedido, id_producto, nombre_producto, precio, cantidad, talla, color)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [orderId, item.product_id, item.name, item.price, item.quantity, item.size || null, item.color || null],
        );
      }

      return orderId;
    });
  },

  updateOrderStatus: async (id: number, status: string): Promise<boolean> => {
    await executeQuery(
      `UPDATE pedidos SET estado = ?, fecha_actualizacion = NOW()
       WHERE id_pedido = ?`,
      [status, id],
    );

    return true;
  },
};