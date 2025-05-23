// Tipos para la aplicación

// Producto
export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category_id: number
  brand_id: number
  brand_name?: string
  stock: number
  created_at: string
  size?: string
  discount_percent?: number
}

// Categoría
export interface Category {
  id: number
  name: string
  slug: string
  description?: string
}

// Subcategoría
export interface Subcategory {
  id: number
  name: string
  slug: string
  category_id: number
}

// Item del carrito
export interface CartItem {
  id: number
  product_id: number
  name: string
  price: number
  image: string
  quantity: number
  size?: string
}

// Usuario
export interface User {
  id: string | number
  name?: string
  email: string
  first_name?: string
  last_name?: string
  created_at?: string
  emailVerified?: Date | null
  image?: string | null
}

// Dirección
export interface Address {
  id?: number
  user_id: number
  city: string
  calle: string
  calle_numero: string
  postal_code: string
  country: string
  type?: "shipping" | "billing" | "both"
  is_default?: boolean
}

// Método de pago
export interface PaymentMethod {
  id: number
  name: string
}

// Pedido
export interface Order {
  id: number
  user_id: number
  date: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  payment_method_id: number
  shipping_address_id?: Address
  billing_address_id?: Address
  items: OrderItem[]
  created_at: string
}

// Item de pedido
export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  size_id: number
  quantity: number
  unit_price: number
  product_name: string
  product_image?: string
}

// Talla
export interface Size {
  id: number
  name: string
}
