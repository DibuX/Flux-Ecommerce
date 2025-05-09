"use client"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
          <Link href="/" className="navbar-brand flux-logo">
              <span className="footer-logo">FLUX</span>
              <span className="logo-dot footer-logo">.</span>
            </Link>
            <p className="footer-about">
              Somos una tienda de moda comprometida con la calidad y el estilo. Ofrecemos las mejores marcas a precios
              competitivos.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <Facebook size={18} />
              </a>
              <a href="#" className="social-link">
                <Twitter size={18} />
              </a>
              <a href="#" className="social-link">
                <Instagram size={18} />
              </a>
              <a href="#" className="social-link">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div>
            <h5 className="footer-title">Comprar</h5>
            <ul className="footer-links">
              <li>
                <Link href="/hombres">Hombres</Link>
              </li>
              <li>
                <Link href="/mujeres">Mujeres</Link>
              </li>
              <li>
                <Link href="/ninos">Niños</Link>
              </li>
              <li>
                <Link href="/accesorios">Accesorios</Link>
              </li>
              <li>
                <Link href="/nuevas-llegadas">Nuevas Llegadas</Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="footer-title">Información</h5>
            <ul className="footer-links">
              <li>
                <Link href="/landing#about">Sobre Nosotros</Link>
              </li>
              <li>
                <Link href="/contacto">Contacto</Link>
              </li>
              <li>
                <Link href="/terminos">Términos y Condiciones</Link>
              </li>
              <li>
                <Link href="/privacidad">Política de Privacidad</Link>
              </li>
              <li>
                <Link href="/faq">Preguntas Frecuentes</Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="footer-title">Mi Cuenta</h5>
            <ul className="footer-links">
              <li>
                <Link href="/login">Iniciar Sesión</Link>
              </li>
              <li>
                <Link href="/carrito">Ver Carrito</Link>
              </li>
              <li>
                <Link href="/favoritos">Lista de Deseos</Link>
              </li>
              <li>
                <Link href="/pedidos">Seguir Pedido</Link>
              </li>
              <li>
                <Link href="/ayuda">Ayuda</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">&copy; {currentYear} Flux. Todos los derechos reservados.</p>
          <div className="payment-methods">
            <img src="/img-icons/icons8-visa-48.png" alt="Visa" className="payment-method" />
            <img src="/img-icons/icons8-mastercard-48.png" alt="Mastercard" className="payment-method" />
            <img src="/img-icons/icons8-american-express-48.png" alt="American Express" className="payment-method" />
            <img src="/img-icons/icons8-paypal-logo-48.png" alt="PayPal" className="payment-method" />
          </div>
        </div>
      </div>
    </footer>
  )
}
