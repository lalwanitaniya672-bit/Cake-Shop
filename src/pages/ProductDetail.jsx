import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingBag, Heart, Share2, Minus, Plus, Check, Truck, Shield, Clock, Leaf } from 'lucide-react'
import { supabase } from '../lib/supabase'
import useCartStore from '../stores/cartStore'
import StarRating from '../components/StarRating'
import FadeInSection from '../components/FadeInSection'

export default function ProductDetail() {
  const { id } = useParams()
  const [cake, setCake] = useState(null)
  const [related, setRelated] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((s) => s.addItem)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedFlavor, setSelectedFlavor] = useState(null)
  const [addedToCart, setAddedToCart] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  useEffect(() => {
    fetchCake()
  }, [id])

  const fetchCake = async () => {
    setLoading(true)
    try {
      let result = await supabase.from('cakes').select('*').eq('slug', id).single()
      if (result.error || !result.data) {
        result = await supabase.from('cakes').select('*').eq('id', id).single()
      }
      const cakeData = result.data
      setCake(cakeData)

      if (cakeData) {
        const [relatedRes, reviewsRes] = await Promise.all([
          supabase.from('cakes').select('*').eq('category', cakeData.category).eq('is_active', true).neq('id', cakeData.id).limit(3),
          supabase.from('reviews').select('*').eq('cake_id', cakeData.id).eq('approved', true).order('created_at', { ascending: false }),
        ])
        setRelated(relatedRes.data || [])
        setReviews(reviewsRes.data || [])
      }
    } catch (err) {
      console.error('Fetch cake error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

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

  const images = cake.images && cake.images.length > 0 ? cake.images : (cake.image_url ? [cake.image_url] : [])
  const flavors = cake.flavours || []
  const ingredients = cake.ingredients || []
  const dietary = cake.dietary || []

  const handleAddToCart = () => {
    const customizations = { Weight: '1 KG' }
    if (selectedFlavor) customizations.Flavor = selectedFlavor
    addItem({
      id: cake.id,
      name: cake.name,
      price: cake.price,
      image: cake.image_url,
    }, quantity, customizations)
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
                {images.length > 0 && (
                  <img
                    src={images[selectedImage] || images[0]}
                    alt={cake.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
                {cake.badge && (
                  <span className="absolute top-4 left-4 bg-gold text-white text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full">
                    {cake.badge}
                  </span>
                )}
                {cake.original_price && (
                  <span className="absolute top-4 right-4 bg-rose text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    Save ₹{cake.original_price - cake.price}
                  </span>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, i) => (
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
              )}
            </motion.div>

            {/* Details */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              <div className="mb-2">
                <span className="text-xs font-medium text-gold uppercase tracking-[0.2em]">{cake.category}</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-chocolate mb-4">{cake.name}</h1>

              <div className="flex items-center gap-3 mb-6">
                <StarRating rating={cake.rating || 0} />
                <span className="text-sm text-warm-gray">{cake.rating || 0} ({cake.review_count || 0} reviews)</span>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-display text-3xl font-bold text-chocolate">₹{cake.price}</span>
                {cake.original_price && (
                  <span className="text-lg text-warm-gray line-through">₹{cake.original_price}</span>
                )}
              </div>

              <p className="text-charcoal/70 leading-relaxed mb-8">{cake.description}</p>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {cake.serves && (
                  <div className="bg-card rounded-xl p-4 border border-cream-dark/30">
                    <p className="text-xs text-warm-gray mb-1">Serves</p>
                    <p className="font-medium text-chocolate">{cake.serves}</p>
                  </div>
                )}
                {cake.prep_time && (
                  <div className="bg-card rounded-xl p-4 border border-cream-dark/30">
                    <p className="text-xs text-warm-gray mb-1">Lead Time</p>
                    <p className="font-medium text-chocolate">{cake.prep_time}</p>
                  </div>
                )}
              </div>

              {/* Flavors */}
              {flavors.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-chocolate mb-3">Available Flavors</p>
                  <div className="flex flex-wrap gap-2">
                    {flavors.map((flavor) => (
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
              )}

              {/* Ingredients */}
              {ingredients.length > 0 && (
                <div className="mb-8">
                  <p className="text-sm font-medium text-chocolate mb-3">Premium Ingredients</p>
                  <div className="flex flex-wrap gap-2">
                    {ingredients.map((ing) => (
                      <span key={ing} className="px-3 py-1.5 rounded-full bg-cream-dark text-xs text-charcoal/60">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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
                      {review.avatar ? (
                        <img src={review.avatar} alt={review.customer_name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose to-gold flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-bold">{review.customer_name?.[0]?.toUpperCase()}</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-chocolate text-sm">{review.customer_name}</h4>
                          <span className="text-xs text-warm-gray">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                        <StarRating rating={review.rating} size={14} />
                        <p className="text-sm text-charcoal/70 mt-3 leading-relaxed">{review.comment}</p>
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
            <div className="grid grid-cols-2 gap-3 md:hidden">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/cake/${item.slug}`}
                  className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 block border border-cream-dark/30"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  </div>
                  <div className="p-2.5">
                    <h3 className="font-display text-[11px] font-semibold text-chocolate group-hover:text-gold transition-colors line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-warm-gray mt-1">₹{item.price}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/cake/${item.slug}`}
                  className="group bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 block border border-cream-dark/30"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
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
