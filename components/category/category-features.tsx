import { Truck, ShieldCheck, RotateCcw, CreditCard } from "lucide-react"

export default function CategoryFeatures() {
  const features = [
    {
      icon: <Truck className="h-8 w-8 text-white" />,
      title: "Envío Gratis",
      description: "En compras superiores a $10.000",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-white" />,
      title: "Garantía de Calidad",
      description: "Productos originales garantizados",
    },
    {
      icon: <RotateCcw className="h-8 w-8 text-white" />,
      title: "Devoluciones Sencillas",
      description: "30 días para cambios y devoluciones",
    },
    {
      icon: <CreditCard className="h-8 w-8 text-white" />,
      title: "Pago Seguro",
      description: "Múltiples métodos de pago",
    },
  ]

  return (
    <div className="bg-black text-white rounded-xl py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center space-y-3">
            <div className="bg-gray-800 p-4 rounded-full">{feature.icon}</div>
            <h3 className="text-lg font-bold">{feature.title}</h3>
            <p className="text-sm text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
