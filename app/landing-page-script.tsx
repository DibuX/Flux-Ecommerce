"use client"

import { useEffect } from "react"

export default function LandingPageScript() {
  useEffect(() => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
    const navMenu = document.querySelector(".nav-menu")

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", () => {
        navMenu?.classList.toggle("active")

        // Toggle icon
        const icon = mobileMenuBtn.querySelector("i")
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

    const handleScroll = () => {
      if (window.scrollY > 50) {
        if (navbar) {
          navbar.setAttribute("style", "padding: 10px 0; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);")
        }
      } else {
        if (navbar) {
          navbar.setAttribute("style", "padding: 15px 0; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);")
        }
      }

      // Back to top button visibility
      const backToTopBtn = document.getElementById("backToTop")
      if (window.scrollY > 300) {
        backToTopBtn?.classList.add("active")
      } else {
        backToTopBtn?.classList.remove("active")
      }
    }

    window.addEventListener("scroll", handleScroll)

    // Back to top button click
    const backToTopBtn = document.getElementById("backToTop")

    if (backToTopBtn) {
      backToTopBtn.addEventListener("click", (e) => {
        e.preventDefault()
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      })
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click",  (e) => {
        const href = (e.currentTarget as HTMLAnchorElement).getAttribute("href")
        if (href === "#") return

        e.preventDefault()

        const targetId = href
        if (!targetId) return

        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          const navbarHeight = document.querySelector(".navbar")?.clientHeight || 0
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })

          // Close mobile menu if open
          if (navMenu?.classList.contains("active")) {
            navMenu.classList.remove("active")
            const menuIcon = mobileMenuBtn?.querySelector("i")
            if (menuIcon) {
              menuIcon.classList.remove("fa-times")
              menuIcon.classList.add("fa-bars")
            }
          }
        }
      })
    })

    // Add to cart functionality (demo)
    const addToCartBtns = document.querySelectorAll(".action-btn:nth-child(2)")
    const cartCount = document.querySelector(".cart-count")
    let count = 0

    addToCartBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()

        count++
        if (cartCount) {
          cartCount.textContent = count.toString()
        }

        // Create and show toast notification
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
        if (closeBtn) {
          closeBtn.addEventListener("click", () => {
            toast.style.transform = "translateY(100px)"
            toast.style.opacity = "0"
            setTimeout(() => {
              document.body.removeChild(toast)
            }, 300)
          })
        }
      })
    })

    // Wishlist functionality (demo)
    const wishlistBtns = document.querySelectorAll(".action-btn:nth-child(1)")

    wishlistBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()

        // Toggle active state
        const button = e.currentTarget as HTMLButtonElement
        button.classList.toggle("active")

        if (button.classList.contains("active")) {
          button.style.backgroundColor = "#ff5722"
          button.style.color = "white"

          // Show toast
          alert("Producto añadido a favoritos")
        } else {
          button.style.backgroundColor = "white"
          button.style.color = "black"

          // Show toast
          alert("Producto eliminado de favoritos")
        }
      })
    })

    // Newsletter form submission
    const newsletterForm = document.getElementById("newsletter-form")

    if (newsletterForm) {
      newsletterForm.addEventListener("submit", function (e) {
        e.preventDefault()
        const emailInput = this.querySelector('input[type="email"]')
        if (emailInput) {
          const email = (emailInput as HTMLInputElement).value
          if (email) {
            // In a real application, you would send this to your server
            console.log("Subscribed email:", email);

            // Clear input
            (emailInput as HTMLInputElement).value = ""

            // Show success message
            alert("¡Gracias por suscribirte a nuestro newsletter!")
          }
        }
      })
    }

    return () => {
      window.removeEventListener("scroll", handleScroll)

      // Clean up other event listeners if needed
      if (backToTopBtn) {
        backToTopBtn.removeEventListener("click", () => {})
      }
    }
  }, [])

  return null
}
