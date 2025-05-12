"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { sendContactMessage } from "@/lib/actions/contact-actions"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido"
    }

    if (!formData.asunto.trim()) {
      newErrors.asunto = "El asunto es requerido"
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = "El mensaje es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const result = await sendContactMessage(formData)

      if (result.success) {
        setSubmitSuccess(true)
        setEmailSent(result.emailSent || false)
        setFormData({
          nombre: "",
          email: "",
          telefono: "",
          asunto: "",
          mensaje: "",
        })
      } else {
        setSubmitError(result.error || "Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.")
      }
    } catch (error) {
      setSubmitError("Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {submitSuccess && (
        <div className="form-success">
          <p>¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.</p>
          {emailSent ? (
            <p className="mt-2">Se ha enviado una notificación por email al administrador.</p>
          ) : (
            <p className="mt-2">Nota: No se pudo enviar la notificación por email, pero tu mensaje ha sido guardado.</p>
          )}
        </div>
      )}

      {submitError && (
        <div className="form-error" style={{ marginBottom: "1rem", padding: "1rem" }}>
          <p>{submitError}</p>
        </div>
      )}

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">
              Nombre Completo *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="form-input"
              value={formData.nombre}
              onChange={handleChange}
            />
            {errors.nombre && <span className="form-error">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="telefono" className="form-label">
              Teléfono (opcional)
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              className="form-input"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="asunto" className="form-label">
              Asunto *
            </label>
            <input
              type="text"
              id="asunto"
              name="asunto"
              className="form-input"
              value={formData.asunto}
              onChange={handleChange}
            />
            {errors.asunto && <span className="form-error">{errors.asunto}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="mensaje" className="form-label">
            Mensaje *
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            className="form-textarea"
            value={formData.mensaje}
            onChange={handleChange}
          ></textarea>
          {errors.mensaje && <span className="form-error">{errors.mensaje}</span>}
        </div>

        <button type="submit" className="form-submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
        </button>
      </form>
    </>
  )
}
