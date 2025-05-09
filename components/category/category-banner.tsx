interface CategoryBannerProps {
  title: string
  description: string
  imagePath: string
  category: string
}

export default function CategoryBanner({ imagePath, category }: CategoryBannerProps) {
  return (
    <div className="w-screen">
      <div className="h-[400px] w-full relative">
        <img
          src={imagePath || "/placeholder.svg"}
          alt={`${category} banner`}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}
