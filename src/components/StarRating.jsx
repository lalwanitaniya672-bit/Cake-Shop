import { Star, StarHalf } from 'lucide-react'

export default function StarRating({ rating, size = 16, showValue = false, className = '' }) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.5
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0)

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={size} className="fill-gold text-gold" />
      ))}
      {hasHalf && <StarHalf key="half" size={size} className="fill-gold text-gold" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} className="text-cream-dark" />
      ))}
      {showValue && (
        <span className="ml-1 text-sm text-warm-gray font-medium">{rating}</span>
      )}
    </div>
  )
}
