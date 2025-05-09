import { executeQuery } from "../mysql";
import type { PaymentMethod } from "../../types"; // Importa PaymentMethod
import { cache } from "react";

// Repositorio para métodos de pago
export const paymentMethodRepository = {
  // Obtener todos los métodos de pago
  getAllPaymentMethods: cache(async (): Promise<PaymentMethod[]> => {
    return executeQuery<PaymentMethod>(`
      SELECT id_metodo as id, nombre as name
      FROM metodos_pago
      ORDER BY nombre ASC
    `);
  }),

  // Obtener un método de pago por ID
  getPaymentMethodById: cache(async (id: number): Promise<PaymentMethod | null> => {
    const methods = await executeQuery<PaymentMethod>(
      `SELECT id_metodo as id, nombre as name
       FROM metodos_pago
       WHERE id_metodo = ?`,
      [id],
    );

    return methods.length > 0 ? methods[0] : null;
  }),
};