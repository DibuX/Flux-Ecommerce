"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/hooks/use-toast"
import { useCart } from "@/components/hooks/use-cart"

const checkoutSchema = z.object({
  firstName: z.string().min(2, "El nombre es requerido"),
  lastName: z.string().min(2, "El apellido es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(8, "Teléfono inválido"),
  address: z.string().min(5, "Dirección requerida"),
  city: z.string().min(2, "Ciudad requerida"),
  state: z.string().min(2, "Provincia/Estado requerido"),
  postalCode: z.string().min(4, "Código postal requerido"),
  country: z.string().min(2, "País requerido"),
  notes: z.string().optional(),
})

type CheckoutFormValues = z.infer<typeof checkoutSchema>

interface CheckoutFormProps {
  user: {
    name?: string | null
    email?: string | null
  }
}

export default function CheckoutForm({ user }: CheckoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { items, clearCart } = useCart()

  // Dividir el nombre completo en nombre y apellido
  const nameParts = user.name?.split(" ") || ["", ""]
  const firstName = nameParts[0] || ""
  const lastName = nameParts.slice(1).join(" ") || ""

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName,
      lastName,
      email: user.email || "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Argentina",
      notes: "",
    },
  })

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "No hay productos en tu carrito",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Aquí iría la lógica para procesar el pago y crear el pedido
      // Por ahora simulamos un proceso exitoso
      await new Promise((resolve) => setTimeout(resolve, 2000))

      clearCart()

      toast({
        title: "¡Pedido realizado!",
        description: "Tu pedido ha sido procesado correctamente",
      })

      router.push("/checkout/success")
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al procesar tu pedido",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold mb-4">Información de Contacto</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-1">
              Nombre
            </label>
            <Input id="firstName" {...register("firstName")} className={errors.firstName ? "border-destructive" : ""} />
            {errors.firstName && <p className="text-destructive text-sm mt-1">{errors.firstName.message}</p>}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-1">
              Apellido
            </label>
            <Input id="lastName" {...register("lastName")} className={errors.lastName ? "border-destructive" : ""} />
            {errors.lastName && <p className="text-destructive text-sm mt-1">{errors.lastName.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Teléfono
            </label>
            <Input id="phone" {...register("phone")} className={errors.phone ? "border-destructive" : ""} />
            {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold mb-4">Dirección de Envío</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">
              Dirección
            </label>
            <Input id="address" {...register("address")} className={errors.address ? "border-destructive" : ""} />
            {errors.address && <p className="text-destructive text-sm mt-1">{errors.address.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1">
                Ciudad
              </label>
              <Input id="city" {...register("city")} className={errors.city ? "border-destructive" : ""} />
              {errors.city && <p className="text-destructive text-sm mt-1">{errors.city.message}</p>}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium mb-1">
                Provincia/Estado
              </label>
              <Input id="state" {...register("state")} className={errors.state ? "border-destructive" : ""} />
              {errors.state && <p className="text-destructive text-sm mt-1">{errors.state.message}</p>}
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium mb-1">
                Código Postal
              </label>
              <Input
                id="postalCode"
                {...register("postalCode")}
                className={errors.postalCode ? "border-destructive" : ""}
              />
              {errors.postalCode && <p className="text-destructive text-sm mt-1">{errors.postalCode.message}</p>}
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-1">
                País
              </label>
              <Input id="country" {...register("country")} className={errors.country ? "border-destructive" : ""} />
              {errors.country && <p className="text-destructive text-sm mt-1">{errors.country.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-1">
              Notas adicionales (opcional)
            </label>
            <Textarea id="notes" {...register("notes")} rows={3} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold mb-4">Método de Pago</h2>

        <div className="space-y-4">
          <div className="flex items-center">
            <input type="radio" id="credit-card" name="payment-method" className="mr-2" defaultChecked />
            <label htmlFor="credit-card">Tarjeta de Crédito/Débito</label>
          </div>

          <div className="flex items-center">
            <input type="radio" id="paypal" name="payment-method" className="mr-2" />
            <label htmlFor="paypal">PayPal</label>
          </div>

          <div className="flex items-center">
            <input type="radio" id="mercado-pago" name="payment-method" className="mr-2" />
            <label htmlFor="mercado-pago">Mercado Pago</label>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full py-6 text-lg" disabled={isSubmitting}>
        {isSubmitting ? "Procesando..." : "Completar Compra"}
      </Button>
    </form>
  )
}
