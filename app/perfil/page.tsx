import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { userRepository } from "@/lib/db/repositories/userRepository"
import { User, Settings } from "lucide-react"
import UserProfile from "@/components/profile/user-profile"
import UserAddresses from "@/components/profile/user-addresses"

export const metadata = {
  title: "Mi Perfil",
  description: "Gestiona tu información personal y direcciones",
}

export default async function ProfilePage() { 
  const session = await getServerSession(authOptions)

  // Si no está autenticado, redirigir a login
  if (!session) {
    redirect("/login?redirect=/perfil")
  }

  // Obtener información del usuario
  const user = await userRepository.getUserById(Number.parseInt(session.user.id))

  // Obtener direcciones del usuario
  const addresses = await userRepository.getUserAddresses(Number.parseInt(session.user.id))

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <User className="mr-2" /> Mi Perfil
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-border p-6 sticky top-24">
            <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.[0]}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">
                  {user?.name}
                </h2>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              <a href="#profile" className="flex items-center px-3 py-2 rounded-md bg-muted text-foreground">
                <User size={18} className="mr-2" />
                <span>Información Personal</span>
              </a>
              <a href="#addresses" className="flex items-center px-3 py-2 rounded-md hover:bg-muted text-foreground">
                <Settings size={18} className="mr-2" />
                <span>Direcciones</span>
              </a>
            </nav>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <section id="profile">
            <UserProfile user={user} />
          </section>

          <section id="addresses">
            <UserAddresses addresses={addresses} />
          </section>
        </div>
      </div>
    </div>
  )
}
