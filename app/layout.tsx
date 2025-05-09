import "./globals.css"
import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import ClientProviders from "@/components/Providers"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

// Metadatos de la página
export const metadata: Metadata = {
  title: {
    default: "Flux | Tienda de Ropa",
    template: "%s | Flux",
  },
  description: "Tienda de ropa con las mejores marcas y precios",
  keywords: ["ropa", "moda", "zapatillas", "adidas", "nike", "flux", "ecommerce"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={poppins.variable} suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
