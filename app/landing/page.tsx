"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import "../landing-page.css"

export default function LandingPage() {
  const router = useRouter()

  useEffect(() => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
    const navMenu = document.querySelector(".nav-menu")

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", function (this: HTMLElement) {
        navMenu?.classList.toggle("active")

        // Toggle icon
        const icon = this.querySelector("i")
        if (icon?.classList.contains("fa-bars")) {
          icon.classList.remove("fa-bars")
          icon.classList.add("fa-times")
        } else {
          icon?.classList.remove("fa-times")
          icon?.classList.add("fa-bars")
        }
      })
    }

    // Navbar scroll effect
    const navbar = document.querySelector(".navbar")

    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        if (navbar) {
          navbar.setAttribute("style", "padding: 10px 0; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);")
        }
      } else {
        if (navbar) {
          navbar.setAttribute("style", "padding: 15px 0; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);")
        }
      }
    })

    // Back to top button
    const backToTopBtn = document.getElementById("backToTop")

    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn?.classList.add("active")
      } else {
        backToTopBtn?.classList.remove("active")
      }
    })

    backToTopBtn?.addEventListener("click", (e) => {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (this: HTMLAnchorElement, e) {
        e.preventDefault()

        const targetId = this.getAttribute("href")
        if (targetId === "#") return

        const targetElement = document.querySelector(targetId || "")
        if (targetElement) {
          const navbarHeight = (document.querySelector(".navbar") as HTMLElement)?.offsetHeight || 0
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })

          // Cerrar mobile menu si se abre
          if (navMenu?.classList.contains("active")) {
            navMenu.classList.remove("active")
            const menuIcon = mobileMenuBtn?.querySelector("i")
            menuIcon?.classList.remove("fa-times")
            menuIcon?.classList.add("fa-bars")
          }
        }
      })
    })

    const newsletterForm = document.getElementById("newsletter-form")

    if (newsletterForm) {
      newsletterForm.addEventListener("submit", (e: Event) => {
        e.preventDefault()
        const form = e.currentTarget as HTMLFormElement
        const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement
        const email = emailInput.value

        if (email) {
          // Simulación de envío
          console.log("Subscribed email:", email)
          emailInput.value = ""
          alert("¡Gracias por suscribirte a nuestro newsletter!")
        }
      })
    }

    // Add to cart functionality
    const addToCartBtns = document.querySelectorAll(".action-btn:nth-child(2)")
    const cartCount = document.querySelector(".cart-count")
    let count = 0

    addToCartBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()

        count++
        if (cartCount) cartCount.textContent = count.toString()

        // Create toast notification
        const toast = document.createElement("div")
        toast.className = "toast-notification"
        toast.innerHTML = `
          <div>Producto añadido al carrito</div>
          <button class="toast-close">&times;</button>
        `

        document.body.appendChild(toast)

        // Add styles for toast
        Object.assign(toast.style, {
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "white",
          color: "#333",
          padding: "15px 20px",
          borderRadius: "4px",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: "9999",
          minWidth: "300px",
          transform: "translateY(100px)",
          opacity: "0",
          transition: "all 0.3s ease",
        })

        // Show toast
        setTimeout(() => {
          toast.style.transform = "translateY(0)"
          toast.style.opacity = "1"
        }, 100)

        // Remove toast after 3 seconds
        setTimeout(() => {
          toast.style.transform = "translateY(100px)"
          toast.style.opacity = "0"
          setTimeout(() => {
            document.body.removeChild(toast)
          }, 300)
        }, 3000)

        // Close toast on click
        const closeBtn = toast.querySelector(".toast-close")
        closeBtn?.addEventListener("click", () => {
          toast.style.transform = "translateY(100px)"
          toast.style.opacity = "0"
          setTimeout(() => {
            document.body.removeChild(toast)
          }, 300)
        })
      })
    })

    // Wishlist functionality
    const wishlistBtns = document.querySelectorAll(".action-btn:nth-child(1)")

    wishlistBtns.forEach((btn) => {
      btn.addEventListener("click", function (this: HTMLButtonElement, e) {
        e.preventDefault()
        e.stopPropagation()

        // Toggle active state
        this.classList.toggle("active")

        if (this.classList.contains("active")) {
          this.style.backgroundColor = "#ff5722"
          this.style.color = "white"
          alert("Producto añadido a favoritos")
        } else {
          this.style.backgroundColor = "white"
          this.style.color = "black"
          alert("Producto eliminado de favoritos")
        }
      })
    })

    // Font Awesome
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    document.head.appendChild(link)

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", () => {})
      if (backToTopBtn) {
        backToTopBtn.removeEventListener("click", () => {})
      }
      document.head.removeChild(link)
    }
  }, [])

  return (
    <>
      {/* Header */}
      <header>
        <nav className="navbar">
          <div className="container">
            <Link href="/" className="navbar-brand flux-logo">
              <span className="logo-text">FLUX</span>
              <span className="logo-dot">.</span>
            </Link>
            <div className="mobile-menu-btn">
              <i className="fas fa-bars"></i>
            </div>
            <div className="nav-menu">
              <ul className="nav-links">
                <li>
                  <Link href="/">Inicio</Link>
                </li>
                <li>
                  <Link href="/#products">Productos</Link>
                </li>
                <li>
                  <a href="#about">Nosotros</a>
                </li>
                <li>
                  <a href="#contacto">Contacto</a>
                </li>
              </ul>
              <div className="nav-icons">
                <Link href="/login" className="nav-icon">
                  <i className="fa-regular fa-user"></i>
                </Link>
                <Link href="/favoritos" className="nav-icon">
                  <i className="fa-regular fa-heart"></i>
                </Link>
                <Link href="/carrito" className="nav-icon cart-icon">
                  <i className="fa-solid fa-cart-shopping"></i>
                  <span className="cart-count">0</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section id="home" className="hero-section">
          <div className="hero-bg" style={{ backgroundImage: "url('/img/banner-landing.png')" }}></div>
          <div className="hero-content">
            <h1 className="animate-fade-in">
              Descubre tu estilo con <span className="accent">Flux</span>
            </h1>
            <p className="animate-fade-in delay-1">
              Ropa urbana para los que marcan tendencia. Encuentra las mejores marcas y los diseños más exclusivos.
            </p>
            <div className="hero-buttons animate-fade-in delay-2">
              <Link href="/" className="btn primary-btn">
                Ver Colección <i className="fas fa-chevron-right"></i>
              </Link>
              <a href="#about" className="btn outline-btn">
                Conoce Más
              </a>
            </div>
          </div>
          <div className="scroll-indicator">
            <i className="fas fa-arrow-down"></i>
          </div>
        </section>

        {/* Brands Section */}
        <section className="brands-section">
          <div className="container">
            <div className="brands-container">
              <div className="brand-logo">
                <img src="/img/Nike-Logo.png" alt="Nike" />
              </div>
              <div className="brand-logo">
                <img src="/img/Adidas-Logo.jpg" alt="Adidas" />
              </div>
              <div className="brand-logo">
                <img src="/img/puma-logo.jpg" alt="Puma" />
              </div>
              <div className="brand-logo">
                <img src="/img/Reebok-Logo.jpg" alt="Reebok" />
              </div>
              <div className="brand-logo">
                <img src="/img/New-Balance-Logo.png" alt="New Balance" />
              </div>
            </div>
          </div>
        </section>

        {/* Productos */}
        <section id="productos" className="products-section">
          <div className="container">
            <div className="section-header">
              <h2>Productos Destacados</h2>
              <p>Descubre nuestras piezas más populares</p>
            </div>

            <div className="product-grid">
              <div className="product-card">
                <div className="product-image">
                  <img src="/img/air-force-1-07.png" alt="Air Force 1 07" />
                  <div className="product-actions">
                    <button className="action-btn">
                      <i className="fa-regular fa-heart"></i>
                    </button>
                    <button className="action-btn">
                      <i className="fa-solid fa-cart-shopping"></i>
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <div className="product-rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <span>(42)</span>
                  </div>
                  <h3>Air Force 1 07´</h3>
                  <p className="product-brand">Nike</p>
                  <p className="product-price">$104.99</p>
                </div>
              </div>

              <div className="product-card">
                <div className="product-image">
                  <img src="/img/air-force-low-1-retro.png" alt="Air Force 1 Low Retro" />
                  <div className="product-actions">
                    <button className="action-btn">
                      <i className="fa-regular fa-heart"></i>
                    </button>
                    <button className="action-btn">
                      <i className="fa-solid fa-cart-shopping"></i>
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <div className="product-rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="far fa-star"></i>
                    <span>(28)</span>
                  </div>
                  <h3>Air Force 1 Low Retro</h3>
                  <p className="product-brand">Nike</p>
                  <p className="product-price">$119.99</p>
                </div>
              </div>

              <div className="product-card">
                <div className="product-image">
                  <span className="product-tag new-tag">Nuevo</span>
                  <img src="/img/gazelle-bold-liberty.jpg" alt="Gazelle Bold Liberty" />
                  <div className="product-actions">
                    <button className="action-btn">
                      <i className="fa-regular fa-heart"></i>
                    </button>
                    <button className="action-btn">
                      <i className="fa-solid fa-cart-shopping"></i>
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <div className="product-rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <span>(56)</span>
                  </div>
                  <h3>Gazelle Bold Liberty</h3>
                  <p className="product-brand">Adidas</p>
                  <p className="product-price">$104.99</p>
                </div>
              </div>

              <div className="product-card">
                <div className="product-image">
                  <span className="product-tag sale-tag">-15%</span>
                  <img src="/img/adidas-moon-boot.jpg" alt="Adidas UltraBoot" />
                  <div className="product-actions">
                    <button className="action-btn">
                      <i className="fa-regular fa-heart"></i>
                    </button>
                    <button className="action-btn">
                      <i className="fa-solid fa-cart-shopping"></i>
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <div className="product-rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="far fa-star"></i>
                    <span>(34)</span>
                  </div>
                  <h3>Adidas UltraBoot</h3>
                  <p className="product-brand">Adidas</p>
                  <p className="product-price">
                    <span className="original-price">$139.99</span> $119.99
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link href="/" className="btn outline-dark-btn">
                Ver Todos los Productos <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about-section">
          <div className="container">
            <div className="about-grid">
              <div className="about-image">
                <img src="/img/about.png" alt="About Flux" />
                <div className="image-overlay">
                  <div className="overlay-content">
                    <h3>Nuestra Historia</h3>
                    <p>Desde 2015 marcando tendencia</p>
                  </div>
                </div>
              </div>

              <div className="about-content">
                <h2>Sobre Flux</h2>

                <p>
                  Flux es más que una marca, es un estilo de vida. Fusionamos prendas para aquellos que se atreven a ser
                  diferentes y expresar su individualidad a través de la moda urbana.
                </p>

                <p>
                  Nos adaptamos a tiempos de cambios, a las nuevas generaciones, y por eso te traemos los más exclusivos
                  productos de las mejores marcas para que crees tu propio estilo.
                </p>

                <div className="features-grid">
                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="fas fa-check"></i>
                    </div>
                    <div className="feature-text">
                      <h4>Calidad Premium</h4>
                      <p>Materiales de la más alta calidad</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="fas fa-check"></i>
                    </div>
                    <div className="feature-text">
                      <h4>Diseño Exclusivo</h4>
                      <p>Piezas únicas y limitadas</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="fas fa-check"></i>
                    </div>
                    <div className="feature-text">
                      <h4>Envío Rápido</h4>
                      <p>A todo el país en 24-48h</p>
                    </div>
                  </div>

                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="fas fa-check"></i>
                    </div>
                    <div className="feature-text">
                      <h4>Atención Personalizada</h4>
                      <p>Servicio al cliente 24/7</p>
                    </div>
                  </div>
                </div>

                <Link href="#" className="btn primary-btn">
                  Conoce Más Sobre Nosotros <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <div className="container">
            <div className="section-header">
              <h2>Lo Que Dicen Nuestros Clientes</h2>
              <p>Experiencias reales de compradores satisfechos</p>
            </div>

            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="testimonial-text">
                  "Increíble calidad en todos los productos que he comprado. El servicio al cliente es excepcional y los
                  envíos siempre llegan antes de lo esperado."
                </p>
                <div className="testimonial-author">
                  <img src="/img/testimonial-1.jpg" alt="María García" />
                  <div>
                    <h4>María García</h4>
                    <p>Cliente desde 2020</p>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="testimonial-text">
                  "Las zapatillas que compré son exactamente como se veían en la web. Muy cómodas y de excelente
                  calidad. Definitivamente volveré a comprar."
                </p>
                <div className="testimonial-author">
                  <img src="/img/testimonial-2.jpg" alt="Juan Pérez" />
                  <div>
                    <h4>Juan Pérez</h4>
                    <p>Cliente desde 2021</p>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="far fa-star"></i>
                </div>
                <p className="testimonial-text">
                  "Me encanta la variedad de productos y las últimas tendencias que siempre tienen disponibles. La ropa
                  es de excelente calidad y el proceso de compra es muy sencillo."
                </p>
                <div className="testimonial-author">
                  <img src="/img/testimonial-3.jpg" alt="Laura Rodríguez" />
                  <div>
                    <h4>Laura Rodríguez</h4>
                    <p>Cliente desde 2019</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section id="contacto" className="newsletter-section">
          <div className="container">
            <div className="newsletter-content">
              <h2>Mantente Conectado</h2>
              <p>
                Suscríbete a nuestro newsletter para recibir las últimas novedades, tendencias y ofertas exclusivas.
              </p>

              <form id="newsletter-form">
                <div className="form-group">
                  <input type="email" placeholder="Tu correo electrónico" required />
                  <button type="submit">Suscribirse</button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-grid">
              <div className="cta-content">
                <h2>¿Listo para renovar tu estilo?</h2>
                <p>Explora nuestra colección y encuentra las prendas que mejor expresan tu personalidad.</p>
                <Link href="/" className="btn primary-btn">
                  Comprar Ahora <i className="fas fa-arrow-right"></i>
                </Link>
              </div>

              <div className="cta-benefits">
                <h3>Ventajas Flux</h3>
                <ul>
                  <li>
                    <i className="fas fa-check"></i> Envío gratuito en pedidos +$99
                  </li>
                  <li>
                    <i className="fas fa-check"></i> Devoluciones sin costo por 30 días
                  </li>
                  <li>
                    <i className="fas fa-check"></i> Atención al cliente 24/7
                  </li>
                  <li>
                    <i className="fas fa-check"></i> Descuentos exclusivos para suscriptores
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Back to Top Button */}
      <a href="#" className="back-to-top" id="backToTop">
        <i className="fas fa-arrow-up"></i>
      </a>
    </>
  )
}
