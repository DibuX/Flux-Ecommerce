"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { SessionProvider } from "next-auth/react"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Toaster } from "@/components/ui/toaster"

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  // Asegurarnos de que el header y footer no aparezcan en login y registro
  // La lógica ya existe, pero vamos a verificar que funcione correctamente

  const pathname = usePathname()

  // Verificar que la condición incluya login y registro
  const hideLayout = pathname === "/login" || pathname === "/registro" || pathname === "/landing"

  return (
    <SessionProvider>
      <AuthProvider>
        <CartProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            {!hideLayout && <Navbar />}
            <main className="flex-grow">{children}</main>
            {!hideLayout && <Footer />}
            <Toaster />
          </ThemeProvider>
        </CartProvider>
      </AuthProvider>
    </SessionProvider>
  )
}
