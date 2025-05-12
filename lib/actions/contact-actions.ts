"use server"

import { executeQuery } from "@/lib/db/mysql"
import { sendNotificationEmail } from "@/lib/services/email-service"

interface ContactFormData {
  nombre: string
  email: string
  telefono?: string
  asunto: string
  mensaje: string
}

export async function sendContactMessage(formData: ContactFormData) {
  try {
    // Validar datos
    if (!formData.nombre || !formData.email || !formData.asunto || !formData.mensaje) {
      return {
        success: false,
        error: "Todos los campos marcados con * son obligatorios",
      }
    }

    // Insertar en la base de datos
    await executeQuery(
      `INSERT INTO mensajes_contacto (nombre, email, telefono, asunto, mensaje, fecha_envio, estado) 
       VALUES (?, ?, ?, ?, ?, NOW(), 'pendiente')`,
      [formData.nombre, formData.email, formData.telefono || null, formData.asunto, formData.mensaje],
    )

    // Enviar email de notificación
    const emailResult = await sendNotificationEmail(formData)

    if (!emailResult.success) {
      console.error("No se pudo enviar el email de notificación:", emailResult.error)
      // Continuamos con el proceso aunque el email falle
    }

    // Si llegamos aquí, la inserción fue exitosa
    return {
      success: true,
      emailSent: emailResult.success,
    }
  } catch (error) {
    console.error("Error al guardar mensaje de contacto:", error)
    return {
      success: false,
      error: "Ocurrió un error al procesar tu solicitud",
    }
  }
}
