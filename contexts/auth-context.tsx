"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, signOut, useSession } from "next-auth/react"

interface User {
  id: string
  name?: string | null
  email?: string | null
}

interface AuthContextType {
  user: User | null
  status: "loading" | "authenticated" | "unauthenticated"
  signIn: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>
  signUp: (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")

  useEffect(() => {
    if (sessionStatus === "loading") {
      setStatus("loading")
      return
    }

    // Solo actualizar el estado si realmente hay un cambio
    const newUser = session?.user
      ? {
          id: session.user.id as string,
          name: session.user.name,
          email: session.user.email,
        }
      : null

    const newStatus = session?.user ? "authenticated" : "unauthenticated"

    if (JSON.stringify(user) !== JSON.stringify(newUser)) {
      setUser(newUser)
    }

    if (status !== newStatus) {
      setStatus(newStatus)
    }
  }, [session, sessionStatus, user, status])

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: credentials.email,
        password: credentials.password,
      })

      if (result?.error) {
        return { success: false, error: "Credenciales inválidas" }
      }

      // Don't navigate here, let the component handle navigation
      return { success: true }
    } catch (error) {
      return { success: false, error: "Error al iniciar sesión" }
    }
  }

  const register = async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.message || "Error al registrar usuario" }
      }

      // Iniciar sesión automáticamente después del registro
      await signIn("credentials", {
        redirect: false,
        email: userData.email,
        password: userData.password,
      })

      // Don't navigate here, let the component handle navigation
      return { success: true }
    } catch (error) {
      return { success: false, error: "Error al registrar usuario" }
    }
  }

  const logout = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        signIn: login,
        signUp: register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
