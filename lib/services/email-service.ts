import { Resend } from "resend"

// Inicializar Resend con tu API key
const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailData {
  nombre: string
  email: string
  telefono?: string
  asunto: string
  mensaje: string
}

export async function sendNotificationEmail(data: EmailData) {
  try {
    // Verificar que las variables de entorno estén configuradas
    if (!process.env.EMAIL_TO || !process.env.RESEND_API_KEY) {
      console.error("Faltan variables de entorno para el envío de emails")
      return { success: false, error: "Configuración de email incompleta" }
    }

    // Crear el contenido del email
    const htmlContent = `
      <h1>Nuevo mensaje de contacto</h1>
      <p><strong>Nombre:</strong> ${data.nombre}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Teléfono:</strong> ${data.telefono || "No proporcionado"}</p>
      <p><strong>Asunto:</strong> ${data.asunto}</p>
      <h2>Mensaje:</h2>
      <p>${data.mensaje.replace(/\n/g, "<br>")}</p>
      <hr>
      <p>Este mensaje fue enviado desde el formulario de contacto de Flux.</p>
    `

    // Enviar el email con Resend
    const { data: emailData, error } = await resend.emails.send({
      from: "Flux Contacto <onboarding@resend.dev>",
      to: [process.env.EMAIL_TO || "nico.roggiano02@gmail.com"],
      subject: `Nuevo mensaje de contacto: ${data.asunto}`,
      html: htmlContent,
      replyTo: data.email,
    })

    if (error) {
      console.error("Error al enviar email:", error)
      return { success: false, error }
    }

    console.log("Email enviado con ID:", emailData?.id)
    return { success: true, messageId: emailData?.id }
  } catch (error: unknown) {
    console.error("Error al enviar email de notificación:", error)
    return { success: false, error }
  }
}
