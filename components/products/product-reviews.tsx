"use client"

import { useState } from "react"
import { Star, User, ThumbsUp, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ProductReviewsProps {
  productId: number
}

// Datos simulados de reseñas
const mockReviews = [
  {
    id: 1,
    user: "María García",
    rating: 5,
    date: "15/03/2023",
    title: "Excelente producto",
    comment: "Muy cómodo y de excelente calidad. Totalmente recomendado.",
    likes: 12,
    replies: 2,
  },
  {
    id: 2,
    user: "Juan Pérez",
    rating: 4,
    date: "02/02/2023",
    title: "Buena relación calidad-precio",
    comment: "Buen producto por el precio. La talla es exacta y el material es de buena calidad.",
    likes: 8,
    replies: 1,
  },
  {
    id: 3,
    user: "Ana Rodríguez",
    rating: 5,
    date: "28/01/2023",
    title: "Superó mis expectativas",
    comment: "Increíble producto, mejor de lo que esperaba. El envío fue rápido y llegó en perfectas condiciones.",
    likes: 15,
    replies: 0,
  },
]

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews] = useState(mockReviews)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)

  // Calcular rating promedio
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-8">Reseñas de Clientes</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="bg-muted p-6 rounded-lg">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < Math.round(averageRating) ? "text-warning fill-warning" : "text-gray-300"}
                />
              ))}
            </div>
            <div className="text-sm text-muted-foreground">Basado en {reviews.length} reseñas</div>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((review) => review.rating === star).length
              const percentage = (count / reviews.length) * 100
              return (
                <div key={star} className="flex items-center text-sm">
                  <div className="w-8">{star}</div>
                  <Star size={14} className="text-warning fill-warning mr-2" />
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-warning h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <div className="w-8 text-right">{count}</div>
                </div>
              )
            })}
          </div>

          <Button onClick={() => setShowReviewForm(!showReviewForm)} className="w-full mt-6">
            Escribir una Reseña
          </Button>
        </div>

        <div className="lg:col-span-2">
          {showReviewForm && (
            <div className="bg-white p-6 rounded-lg border border-border mb-6">
              <h3 className="font-bold mb-4">Escribe tu Reseña</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Calificación</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      className={`cursor-pointer ${
                        star <= (hoveredRating || rating) ? "text-warning fill-warning" : "text-gray-300"
                      }`}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="review-title" className="block text-sm font-medium mb-2">
                  Título
                </label>
                <input
                  id="review-title"
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-md"
                  placeholder="Resume tu experiencia"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="review-comment" className="block text-sm font-medium mb-2">
                  Comentario
                </label>
                <Textarea id="review-comment" placeholder="Comparte tu experiencia con este producto" rows={4} />
              </div>

              <div className="flex gap-2">
                <Button>Enviar Reseña</Button>
                <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-border pb-6">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
                      <User size={20} />
                    </div>
                    <div>
                      <div className="font-medium">{review.user}</div>
                      <div className="text-sm text-muted-foreground">{review.date}</div>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? "text-warning fill-warning" : "text-gray-300"}
                      />
                    ))}
                  </div>
                </div>

                <h4 className="font-medium mb-2">{review.title}</h4>
                <p className="text-muted-foreground mb-4">{review.comment}</p>

                <div className="flex gap-4 text-sm">
                  <button className="flex items-center text-muted-foreground hover:text-foreground">
                    <ThumbsUp size={14} className="mr-1" /> Útil ({review.likes})
                  </button>
                  <button className="flex items-center text-muted-foreground hover:text-foreground">
                    <MessageSquare size={14} className="mr-1" /> Responder ({review.replies})
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button variant="outline">Ver Todas las Reseñas</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
