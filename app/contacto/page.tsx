import ContactForm from "@/components/contact/contact-form"
import "./contact-styles.css"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export const metadata = {
  title: "Contacto",
  description: "Ponte en contacto con nosotros para cualquier consulta o sugerencia",
}

export default function ContactPage() {
  return (
    <main>
      <section className="contact-hero">
        <div className="contact-hero-overlay"></div>
        <div className="contact-hero-content">
          <h1>Contacto</h1>
          <p>Estamos aquí para ayudarte</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-container">
            <div className="contact-info">
              <h2>Información de Contacto</h2>
              <p>
                Completa el formulario y nuestro equipo te responderá a la brevedad. También puedes contactarnos
                directamente utilizando la información a continuación.
              </p>

              <div className="contact-details">
                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <MapPin />
                  </div>
                  <div>
                    <h3>Nuestra Ubicación</h3>
                    <p>Av. Corrientes 1234, CABA, Argentina</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <Phone />
                  </div>
                  <div>
                    <h3>Teléfono</h3>
                    <p>+54 11 5678-9012</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <Mail />
                  </div>
                  <div>
                    <h3>Email</h3>
                    <p>info@flux-store.com</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <Clock />
                  </div>
                  <div>
                    <h3>Horario de Atención</h3>
                    <p>Lunes a Viernes: 9:00 - 20:00</p>
                    <p>Sábados: 10:00 - 14:00</p>
                  </div>
                </div>
              </div>

              <div className="social-contact">
                <h3>Síguenos</h3>
                <div className="social-links">
                  <a href="#" className="social-link">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-form-container">
              <h2>Envíanos un Mensaje</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="section map-section">
        <div className="container">
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.9911118440134!2d-58.38383492425657!3d-34.60373887295426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccac630121623%3A0x53386f2ac88991a9!2sAv.%20Corrientes%201234%2C%20C1043AAZ%20CABA!5e0!3m2!1ses-419!2sar!4v1683900456188!5m2!1ses-419!2sar"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  )
}
