"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/hooks/use-toast"
import { MapPin, Plus, Edit, Trash } from "lucide-react"
import type { Address } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"

const addressSchema = z.object({
  first_name: z.string().min(2, "El nombre es requerido"),
  last_name: z.string().min(2, "El apellido es requerido"),
  address_line1: z.string().min(5, "La dirección es requerida"),
  address_line2: z.string().optional(),
  city: z.string().min(2, "La ciudad es requerida"),
  state: z.string().min(2, "La provincia/estado es requerido"),
  postal_code: z.string().min(4, "El código postal es requerido"),
  country: z.string().min(2, "El país es requerido"),
  phone: z.string().min(8, "El teléfono es requerido"),
  is_default: z.boolean().optional(),
})

type AddressFormValues = z.infer<typeof addressSchema>

interface UserAddressesProps {
  addresses: Address[]
}

export default function UserAddresses({ addresses: initialAddresses }: UserAddressesProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "Argentina",
      phone: "",
      is_default: false,
    },
  })

  const onSubmit = async (data: AddressFormValues) => {
    if (!user) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/user/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          user_id: user.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al guardar dirección")
      }

      const result = await response.json()

      toast({
        title: "Dirección guardada",
        description: "Tu dirección ha sido guardada correctamente",
      })

      // Actualizar la lista de direcciones
      setAddresses([
        ...addresses,
        {
          ...data,
          id: result.id,
          user_id: Number.parseInt(user.id),
          street: data.address_line1,
          type: "shipping",
          is_default: data.is_default ?? false,
        },
      ]);    setIsAddingAddress(false)
      reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la dirección",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta dirección?")) {
      return
    }

    try {
      const response = await fetch(`/api/user/addresses/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar dirección")
      }

      toast({
        title: "Dirección eliminada",
        description: "La dirección ha sido eliminada correctamente",
      })

      // Actualizar la lista de direcciones
      setAddresses(addresses.filter((address) => address.id !== id))
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la dirección",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Mis Direcciones</h2>
        {!isAddingAddress && (
          <Button onClick={() => setIsAddingAddress(true)}>
            <Plus size={16} className="mr-2" />
            Añadir Dirección
          </Button>
        )}
      </div>

      {isAddingAddress ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium mb-1">
                Nombre
              </label>
              <Input
                id="first_name"
                {...register("first_name")}
                className={errors.first_name ? "border-destructive" : ""}
                disabled={isLoading}
              />
              {errors.first_name && <p className="text-destructive text-sm mt-1">{errors.first_name.message}</p>}
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium mb-1">
                Apellido
              </label>
              <Input
                id="last_name"
                {...register("last_name")}
                className={errors.last_name ? "border-destructive" : ""}
                disabled={isLoading}
              />
              {errors.last_name && <p className="text-destructive text-sm mt-1">{errors.last_name.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="address_line1" className="block text-sm font-medium mb-1">
              Dirección
            </label>
            <Input
              id="address_line1"
              {...register("address_line1")}
              className={errors.address_line1 ? "border-destructive" : ""}
              disabled={isLoading}
            />
            {errors.address_line1 && <p className="text-destructive text-sm mt-1">{errors.address_line1.message}</p>}
          </div>

          <div>
            <label htmlFor="address_line2" className="block text-sm font-medium mb-1">
              Dirección adicional (opcional)
            </label>
            <Input id="address_line2" {...register("address_line2")} disabled={isLoading} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1">
                Ciudad
              </label>
              <Input
                id="city"
                {...register("city")}
                className={errors.city ? "border-destructive" : ""}
                disabled={isLoading}
              />
              {errors.city && <p className="text-destructive text-sm mt-1">{errors.city.message}</p>}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium mb-1">
                Provincia/Estado
              </label>
              <Input
                id="state"
                {...register("state")}
                className={errors.state ? "border-destructive" : ""}
                disabled={isLoading}
              />
              {errors.state && <p className="text-destructive text-sm mt-1">{errors.state.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="postal_code" className="block text-sm font-medium mb-1">
                Código Postal
              </label>
              <Input
                id="postal_code"
                {...register("postal_code")}
                className={errors.postal_code ? "border-destructive" : ""}
                disabled={isLoading}
              />
              {errors.postal_code && <p className="text-destructive text-sm mt-1">{errors.postal_code.message}</p>}
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-1">
                País
              </label>
              <Input
                id="country"
                {...register("country")}
                className={errors.country ? "border-destructive" : ""}
                disabled={isLoading}
              />
              {errors.country && <p className="text-destructive text-sm mt-1">{errors.country.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Teléfono
            </label>
            <Input
              id="phone"
              {...register("phone")}
              className={errors.phone ? "border-destructive" : ""}
              disabled={isLoading}
            />
            {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone.message}</p>}
          </div>

          <div className="flex items-center">
            <input
              id="is_default"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              {...register("is_default")}
            />
            <label htmlFor="is_default" className="ml-2 block text-sm text-gray-900">
              Establecer como dirección predeterminada
            </label>
          </div>

          <div className="flex space-x-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Dirección"}
            </Button>
            <Button type="button" onClick={() => setIsAddingAddress(false)} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <MapPin size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No tienes direcciones guardadas</h3>
              <p className="text-muted-foreground mb-4">Añade una dirección para agilizar el proceso de compra</p>
              <Button onClick={() => setIsAddingAddress(true)}>
                <Plus size={16} className="mr-2" />
                Añadir Dirección
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div key={address.id} className="border border-border rounded-lg p-4 relative">
                  {address.is_default && (
                    <span className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                      Predeterminada
                    </span>
                  )}
                  <p className="font-medium">
                    {address.first_name} {address.last_name}
                  </p>
                  <p>{address.address_line1}</p>
                  {address.address_line2 && <p>{address.address_line2}</p>}
                  <p>
                    {address.city}, {address.state} {address.postal_code}
                  </p>
                  <p>{address.country}</p>
                  <p className="mt-1">Teléfono: {address.phone}</p>
                  <div className="mt-4 flex space-x-2">
                    <Button className="text-sm" onClick={() => setEditingAddressId(address.id || 0)}>
                      <Edit size={14} className="mr-1" />
                      Editar
                    </Button>
                    <Button
                      className="text-destructive text-sm"
                      onClick={() => handleDelete(address.id || 0)}
                    >
                      <Trash size={14} className="mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
