import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ShoppingBag, Heart, Share2, Minus, Plus, Check, Truck, Shield, Clock, Leaf } from 'lucide-react'
import { getCakeById, getRelatedCakes } from '../data/cakes'
import { getReviewsByCakeId } from '../data/reviews'
import useCartStore from '../stores/cartStore'
import StarRating from '../components/StarRating'
import FadeInSection from '../components/FadeInSection'

export default function ProductDetail() {
  const { id } = useParams()
  const cake = getCakeById(id)
  const addItem = useCartStore((s) => s.addItem)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedFlavor, setSelectedFlavor] = useState(null)
  const [addedToCart, setAddedToCart] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  if (!cake) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎂</div>
          <h1 className="font-display text-2xl font-bold text-chocolate mb-2">Cake Not Found</h1>
          <Link to="/collection" className="text-gold font-medium hover:text-gold-light">Back to Collection</Link>
        </div>
      </div>
    )
  }

  const related = getRelatedCakes(cake.id, cake.category)
  const reviews = getReviewsByCakeId(cake.id)

  const handleAddToCart = () => {
    const customizations = { Weight: '1 KG' }
    if (selectedFlavor) {
      customizations.Flavor = selectedFlavor
    }
    addItem(cake, quantity, customizations)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="pt-24 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-warm-gray">
          <Link to="/collection" className="hover:text-chocolate transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Collection
          </Link>
          <span>/</span>
          <span className="text-chocolate font-medium">{cake.name}</span>
        </div>
      </div>

      {/* Product */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Images */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="relative rounded-3xl overflow-hidden bg-cream-dark aspect-square mb-4">
                <img
                  src={cake.images[selectedImage]}
                  alt={cake.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {cake.badge && (
                  <span className="absolute top-4 left-4 bg-gold text-white text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full">
                    {cake.badge}
                  </span>
                )}
                {cake.originalPrice && (
                  <span className="absolute top-4 right-4 bg-rose text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    Save ₹{cake.originalPrice - cake.price}
                  </span>
                )}
              </div>
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {cake.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === i ? 'border-gold' : 'border-transparent hover:border-cream-dark'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Details */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <div className="mb-2">
                <span className="text-xs font-medium text-gold uppercase tracking-[0.2em]">{cake.category}</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-chocolate mb-4">{cake.name}</h1>

              <div className="flex items-center gap-3 mb-6">
                <StarRating rating={cake.rating} />
                <span className="text-sm text-warm-gray">{cake.rating} ({cake.reviewCount} reviews)</span>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-display text-3xl font-bold text-chocolate">₹{cake.price}</span>
                {cake.originalPrice && (
                  <span className="text-lg text-warm-gray line-through">₹{cake.originalPrice}</span>
                )}
              </div>

              <p className="text-charcoal/70 leading-relaxed mb-8">{cake.description}</p>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-card rounded-xl p-4 border border-cream-dark/30">
                  <p className="text-xs text-warm-gray mb-1">Serves</p>
                  <p className="font-medium text-chocolate">{cake.serves}</p>
                </div>
                <div className="bg-card rounded-xl p-4 border border-cream-dark/30">
                  <p className="text-xs text-warm-gray mb-1">Lead Time</p>
                  <p className="font-medium text-chocolate">{cake.prepTime}</p>
                </div>
              </div>

              {/* Flavors */}
              <div className="mb-6">
                <p className="text-sm font-medium text-chocolate mb-3">Available Flavors</p>
                <div className="flex flex-wrap gap-2">
                  {cake.flavors.map((flavor) => (
                    <button
                      key={flavor}
                      type="button"
                      onClick={() => setSelectedFlavor(flavor === selectedFlavor ? null : flavor)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                        selectedFlavor === flavor
                          ? 'bg-chocolate text-white border-chocolate shadow-md'
                          : 'bg-card text-charcoal/70 border-cream-dark/50 hover:border-chocolate/40 hover:text-chocolate'
                      }`}
                    >
                      {selectedFlavor === flavor && <Check className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />}
                      {flavor}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-8">
                <p className="text-sm font-medium text-chocolate mb-3">Premium Ingredients</p>
                <div className="flex flex-wrap gap-2">
                  {cake.ingredients.map((ing) => (
                    <span key={ing} className="px-3 py-1.5 rounded-full bg-cream-dark text-xs text-charcoal/60">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quantity + Add to Cart */}
              <div className="flex items-center gap-3 sm:gap-4 mb-6">
                <div className="flex items-center border border-cream-dark rounded-full flex-shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-11 flex items-center justify-center text-chocolate hover:bg-cream-dark/50 rounded-l-full transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold text-chocolate">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-11 h-11 flex items-center justify-center text-chocolate hover:bg-cream-dark/50 rounded-r-full transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <motion.button
                  onClick={handleAddToCart}
                  whileTap={{ scale: 0.97 }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    addedToCart
                      ? 'bg-green-500 text-white'
                      : 'bg-chocolate text-white hover:bg-chocolate-light hover:shadow-xl hover:-translate-y-0.5'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span className="hidden sm:inline">Add to Cart - </span>
                      <span className="sm:hidden">Add to Cart</span>
                      <span className="hidden sm:inline">₹{cake.price * quantity}</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-300 ${
                    wishlisted
                      ? 'border-rose bg-rose/10 text-rose'
                      : 'border-cream-dark text-charcoal/70 hover:border-rose hover:text-rose'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose' : ''}`} />
                  {wishlisted ? 'Saved' : 'Wishlist'}
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border border-cream-dark text-charcoal/70 hover:border-gold hover:text-gold transition-all duration-300">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-cream-dark">
                <div className="text-center">
                  <Truck className="w-5 h-5 text-gold mx-auto mb-2" />
                  <p className="text-[11px] text-warm-gray">Free Delivery</p>
                </div>
                <div className="text-center">
                  <Shield className="w-5 h-5 text-gold mx-auto mb-2" />
                  <p className="text-[11px] text-warm-gray">Fresh Guarantee</p>
                </div>
                <div className="text-center">
                  <Leaf className="w-5 h-5 text-gold mx-auto mb-2" />
                  <p className="text-[11px] text-warm-gray">Natural Ingredients</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="py-16 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <h2 className="font-display text-2xl font-bold text-chocolate mb-8">Customer Reviews</h2>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-card rounded-2xl p-6 shadow-sm border border-cream-dark/30">
                    <div className="flex items-start gap-4">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-chocolate text-sm">{review.name}</h4>
                          <span className="text-xs text-warm-gray">{review.date}</span>
                        </div>
                        <StarRating rating={review.rating} size={14} />
                        <p className="text-sm text-charcoal/70 mt-3 leading-relaxed">{review.text}</p>
                        {review.verified && (
                          <span className="inline-flex items-center gap-1 mt-2 text-xs text-green-600">
                            <Check className="w-3 h-3" /> Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeInSection>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <h2 className="font-display text-2xl font-bold text-chocolate mb-8">You May Also Like</h2>
            </FadeInSection>
            {/* Mobile Grid */}
            <div className="grid grid-cols-2 gap-3 md:hidden">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/cake/${item.id}`}
                  className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 block border border-cream-dark/30"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2.5">
                    <h3 className="font-display text-[11px] font-semibold text-chocolate group-hover:text-gold transition-colors line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-warm-gray mt-1">₹{item.price}</p>
                  </div>
                </Link>
              ))}
            </div>
            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((item) => (
                  <Link
                    key={item.id}
                    to={`/cake/${item.id}`}
                    className="group bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 block border border-cream-dark/30"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-lg font-semibold text-chocolate group-hover:text-gold transition-colors">{item.name}</h3>
                      <p className="text-sm text-warm-gray mt-1">₹{item.price}</p>
                    </div>
                  </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
