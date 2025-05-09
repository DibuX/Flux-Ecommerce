import { type ClassValue, clsx } from "clsx"
/**
 * @param classes - Lista de clases CSS.
 * @returns
 */
export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Función para obtener la URL de una imagen
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return "/img/products/default-product.png"

  // Si la ruta ya comienza con http o https, devolverla tal cual
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  // Si la ruta comienza con /, es una ruta relativa a la carpeta public
  if (path.startsWith("/")) {
    return path
  }

  // De lo contrario, asumimos que es una ruta relativa a la carpeta public/img
  return `/img/${path}`
}

// Función para formatear el precio
export function formatPrice(price: number): string {
  return price.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  })
}

// Función para truncar texto
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

// Función para generar un ID único
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Función para obtener fecha formateada
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
