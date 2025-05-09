"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Heart, User, Search, Menu, X } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
  const { items } = useCart()
  const { user, status, logout } = useAuth()

  // Detectar scroll para cambiar estilos del navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Manejar búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        
        {/* LEFT: Logo */}
        <div className="navbar-left">
          <Link href="/" className="navbar-brand flux-logo navbar-logo">
            <span className="logo-text navbar-logo">FLUX</span>
            <span className="logo-dot navbar-logo">.</span>
          </Link>
        </div>
  
        {/* CENTER: Categorías */}
        <nav className="navbar-center">
          <ul className="navbar-nav">
            <Link href="/hombres" className={pathname.includes("/hombres") ? "active" : ""}>
              Hombres
            </Link>
            <Link href="/mujeres" className={pathname.includes("/mujeres") ? "active" : ""}>
              Mujeres
            </Link>
            <Link href="/ninos" className={pathname.includes("/ninos") ? "active" : ""}>
              Niños
            </Link>
            <Link href="/ofertas" className={pathname.includes("/ofertas") ? "active" : ""}>
              Ofertas
            </Link>
            <Link href="/nuevas-llegadas" className={`${pathname.includes("/nuevas-llegadas") ? "active" : ""} new-arrivals`}>
              Nuevas Llegadas
            </Link>
            <Link href="/landing#about" className={pathname.includes("/landing") ? "active" : ""}>
              Sobre Nosotros
            </Link>
          </ul>
        </nav>
  
        {/* RIGHT: Buscador + íconos */}
        <div className="navbar-right">
          <form onSubmit={handleSearch} className="navbar-search">
            <input
              type="search"
              placeholder="Buscar..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn" aria-label="Buscar">
              <Search size={18} />
            </button>
          </form>
  
          <div className="navbar-icons">
            {status === "authenticated" ? (
              <div className="dropdown">
                <button className="icon-btn"><User /></button>
                <div className="dropdown-menu">
                  <Link href="/perfil">Perfil</Link>
                  <Link href="/pedidos">Mis Pedidos</Link>
                  <Link href="/favoritos">Mis Favoritos</Link>
                  <button onClick={logout}>Cerrar Sesión</button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="icon-btn"><User /></Link>
            )}
            <Link href="/favoritos" className="icon-btn"><Heart /></Link>
            <Link href="/carrito" className="icon-btn">
              <ShoppingCart />
              {items.length > 0 && <span className="cart-count">{items.length}</span>}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
  
}
