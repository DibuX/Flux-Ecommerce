import "./home-styles.css"
import Image from "next/image"
import Link from "next/link"
import { Truck, RotateCcw, Shield, Headphones, ArrowRight } from "lucide-react"
import ProductGrid from "@/components/products/product-grid"
import { productRepository } from "@/lib/db/repositories/productRepository"
import { categoryRepository } from "@/lib/db/repositories/categoryRepository"

export default async function Home() {
  // Obtener productos destacados
  const featuredProducts = await productRepository.getFeaturedProducts(8)
  console.log(`Productos obtenidos en Home: ${featuredProducts.length}`)

  // Obtener todas las categorías y seleccionar 4 aleatorias
  const allCategories = await categoryRepository.getAllCategories()
  console.log(`Categorías obtenidas en Home: ${allCategories.length}`)

  // Función para obtener 4 categorías aleatorias
  const getRandomCategories = (categories: any[], count: number) => {
    if (!categories || categories.length === 0) return []
    const shuffled = [...categories].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(count, categories.length))
  }

  const randomCategories = getRandomCategories(allCategories, 4)

  // Imágenes de categorías (para demostración)
  const categoryImages: Record<string, string> = {
    hombre: "/img/categoria-hombre.jpg",
    mujer: "/img/categoria-mujer.avif",
    calzado: "/img/categoria-calzado.avif",
    accesorios: "/img/categoria-accesorios.avif",
    deportes: "/img/categoria-deportes.png",
    niños: "/img/categoria-niños.avif",
    default: "/img/categoria-default.png",
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <video autoPlay muted loop>
          <source src="/img/publicidad-zapas.mp4" type="video/mp4" />
        </video>

        <div className="hero-content">
          <h1 className="hero-title">NUEVA COLECCIÓN</h1>
          <p className="hero-subtitle">Descubre lo último en moda y estilo</p>
          <div className="hero-buttons">
            <a href="#productos" className="btn btn-primary">
              Comprar Ahora
            </a>
            <Link href="/nuevas-llegadas" className="btn btn-outline-white">
              Ver Novedades
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="section trending-section">
        <div className="container">
          <div className="trending-grid">
            <div className="trending-card">
              <div className="trending-image">
                <Image src="/img/trending1.jpg" alt="Trending 1" width={600} height={400} />
                <div className="trending-overlay">
                  <h3>Colección Verano</h3>
                  <Link href="/verano" className="btn btn-outline-white">
                    Explorar
                  </Link>
                </div>
              </div>
            </div>
            <div className="trending-card">
              <div className="trending-image">
                <Image src="/img/trending2.png" alt="Trending 2" width={600} height={400} />
                <div className="trending-overlay">
                  <h3>Nuevas Zapatillas</h3>
                  <Link href="/calzado" className="btn btn-outline-white">
                    Explorar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Categorías Destacadas</h2>
            <p>Explora nuestras colecciones</p>
          </div>

          <div className="categories">
            {randomCategories.length > 0 ? (
              randomCategories.map((category) => (
                <div key={category.id} className="category-card">
                  <div style={{ position: "relative", width: "100%", height: "100%" }}>
                    <Image
                      src={categoryImages[category.slug as string] || categoryImages.default}
                      alt={category.name}
                      fill
                      className="category-img"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="category-overlay">
                    <h3 className="category-title">{category.name}</h3>
                    <Link href={`/${category.slug}`} className="btn btn-outline-white">
                      Ver Colección
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center w-full">
                <p>No hay categorías disponibles</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="productos" className="section section-bg">
        {featuredProducts.length > 0 ? (
          <ProductGrid
            products={featuredProducts}
            title="Productos Destacados"
            subtitle="Lo más vendido esta temporada"
            showViewAll={true}
          />
        ) : (
          <div className="container text-center">
            <h2>Productos Destacados</h2>
            <p>No hay productos disponibles en este momento.</p>
          </div>
        )}
      </section>

      {/* Banner Section */}
      <section className="banner-section">
        <div className="container">
          <div className="banner">
            <div className="banner-content">
              <h2>HASTA 50% DE DESCUENTO</h2>
              <p>En productos seleccionados. Oferta por tiempo limitado.</p>
              <Link href="/ofertas" className="btn btn-primary">
                Ver Ofertas <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div className="features">
            <div className="feature-item">
              <div className="feature-icon">
                <Truck size={40} />
              </div>
              <h4 className="feature-title">Envío Gratis</h4>
              <p className="feature-desc">En pedidos superiores a $99</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <RotateCcw size={40} />
              </div>
              <h4 className="feature-title">Devoluciones</h4>
              <p className="feature-desc">30 días para cambios</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <Shield size={40} />
              </div>
              <h4 className="feature-title">Pago Seguro</h4>
              <p className="feature-desc">Transacciones protegidas</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <Headphones size={40} />
              </div>
              <h4 className="feature-title">Soporte 24/7</h4>
              <p className="feature-desc">Atención al cliente</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-container">
            <div className="newsletter-content">
              <h3>Suscríbete a nuestro Newsletter</h3>
              <p>Recibe las últimas novedades y ofertas exclusivas directamente en tu correo.</p>
            </div>

            <form className="newsletter-form">
              <input type="email" placeholder="Tu correo electrónico" className="newsletter-input" required />
              <button type="submit" className="newsletter-btn">
                Suscribirse
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* About Us Link */}
      <div className="about-us-link text-center py-8">
        <Link href="/landing#about" className="btn btn-outline">
          Conoce más sobre nosotros <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>
    </>
  )
}
