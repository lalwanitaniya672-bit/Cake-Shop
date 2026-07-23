import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'
import useAuthStore from '../stores/authStore'
import FadeInSection from '../components/FadeInSection'
import StarRating from '../components/StarRating'

const heroSlides = [
  { image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1600&h=1200&fit=crop&q=80', name: 'Dark Chocolate Truffle', subtitle: 'Our signature bestseller' },
  { image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1600&h=1200&fit=crop&q=80', name: 'Strawberry Bliss', subtitle: 'Fresh berry delight' },
  { image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=1600&h=1200&fit=crop&q=80', name: 'Vanilla Dream', subtitle: 'Classic elegance' },
  { image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=1600&h=1200&fit=crop&q=80', name: 'Red Velvet Royale', subtitle: 'A timeless favorite' },
]

export default function Home() {
  const [featuredCakes, setFeaturedCakes] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const handleLockedClick = (e) => {
    e.preventDefault()
    navigate('/login', { state: { from: '/', message: 'Please sign in to continue.' } })
  }

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000)
    return () => clearInterval(timer)
  }, [nextSlide])

  useEffect(() => {
    fetchFeaturedCakes()
  }, [])

  const fetchFeaturedCakes = async () => {
    try {
      const { data, error } = await supabase
        .from('cakes')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(9)
      if (error) throw error
      setFeaturedCakes(data || [])
    } catch (err) {
      console.error('Fetch featured cakes error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Hero - Fullscreen */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide}
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].name}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
            />
          </AnimatePresence>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 backdrop-blur-[1px]" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 sm:px-12 lg:px-16 h-full pt-16 lg:pt-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20"
          >
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-xs font-medium text-white/90 uppercase tracking-wider">
              Artisan Cake Boutique
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 leading-tight max-w-3xl"
          >
            Where Every Cake
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold via-rose to-gold">
              Tells a Story
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/80 leading-relaxed text-base sm:text-lg max-w-xl mb-8"
          >
            Welcome to The Velvet Crumb - where passion meets precision. We craft bespoke
            cakes that transform your sweetest celebrations into unforgettable memories.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mb-10"
          >
            {user ? (
              <Link
                to="/collection"
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-gold-light text-chocolate px-8 py-4 rounded-full text-sm font-semibold hover:shadow-xl hover:shadow-gold/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                Explore Collection
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            ) : (
              <button
                onClick={handleLockedClick}
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-gold-light text-chocolate px-8 py-4 rounded-full text-sm font-semibold hover:shadow-xl hover:shadow-gold/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                Explore Collection
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            )}
            {user ? (
              <Link
                to="/custom-orders"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-white/20 transition-all duration-300"
              >
                Order Now
              </Link>
            ) : (
              <button
                onClick={handleLockedClick}
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-white/20 transition-all duration-300"
              >
                Order Now
              </button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
          >
            <div className="flex -space-x-3">
              {['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&q=80',
                'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&q=80',
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&q=80',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&q=80',
              ].map((src, i) => (
                <img key={i} src={src} alt="" className="w-9 h-9 rounded-full border-2 border-white/30 object-cover" />
              ))}
            </div>
            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-1 sm:gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-xs text-white/70 text-center sm:text-left">Trusted by 2,500+ happy clients</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Cakes */}
      <section className="pt-12 pb-4 md:pt-20 md:pb-6 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-8 md:mb-14">
            <span className="text-xs font-medium text-gold uppercase tracking-[0.2em] mb-3 block">
              Signature Collection
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-chocolate mb-4">
              Our Finest Creations
            </h2>
            <p className="text-warm-gray max-w-2xl mx-auto text-sm sm:text-base">
              Each cake is a labor of love, meticulously crafted to delight both the eyes and the palate.
            </p>
          </FadeInSection>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            </div>
          ) : featuredCakes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-warm-gray">No featured cakes yet. Add some from the admin panel.</p>
            </div>
          ) : (
            <>
              {/* Mobile Grid */}
              <div className="grid grid-cols-2 gap-3 md:hidden">
                {featuredCakes.map((cake) => (
                  user ? (
                    <Link
                      key={cake.id}
                      to={`/cake/${cake.slug}`}
                      className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 block border border-cream-dark/30"
                    >
                      <div className="relative h-36 overflow-hidden">
                        <img
                          src={cake.image_url}
                          alt={cake.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        {cake.badge && (
                          <span className="absolute top-1.5 left-1.5 bg-gold text-white text-[8px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            {cake.badge}
                          </span>
                        )}
                      </div>
                      <div className="p-2.5 text-center">
                        <h3 className="font-display text-[15px] font-bold text-chocolate group-hover:text-gold transition-colors duration-300 leading-tight line-clamp-1">
                          {cake.name}
                        </h3>
                        <div className="flex justify-center mt-1.5">
                          <span className="font-display text-[17px] font-bold text-chocolate">₹{cake.price}</span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <button
                      key={cake.id}
                      onClick={handleLockedClick}
                      className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 block border border-cream-dark/30 text-left"
                    >
                      <div className="relative h-36 overflow-hidden">
                        <img
                          src={cake.image_url}
                          alt={cake.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        {cake.badge && (
                          <span className="absolute top-1.5 left-1.5 bg-gold text-white text-[8px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            {cake.badge}
                          </span>
                        )}
                      </div>
                      <div className="p-2.5 text-center">
                        <h3 className="font-display text-[15px] font-bold text-chocolate group-hover:text-gold transition-colors duration-300 leading-tight line-clamp-1">
                          {cake.name}
                        </h3>
                        <div className="flex justify-center mt-1.5">
                          <span className="font-display text-[17px] font-bold text-chocolate">₹{cake.price}</span>
                        </div>
                      </div>
                    </button>
                  )
                ))}
              </div>

              {/* Desktop Grid */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCakes.map((cake) => (
                  user ? (
                    <Link
                      key={cake.id}
                      to={`/cake/${cake.slug}`}
                      className="group bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 block border border-cream-dark/30"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={cake.image_url}
                          alt={cake.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        {cake.badge && (
                          <span className="absolute top-4 left-4 bg-gold text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                            {cake.badge}
                          </span>
                        )}
                      </div>
                      <div className="p-6 text-center">
                        <span className="text-xs uppercase tracking-wider text-gold font-semibold">{cake.category}</span>
                        <h3 className="font-display text-[28px] font-bold text-chocolate group-hover:text-gold transition-colors duration-300 leading-tight mt-1.5">
                          {cake.name}
                        </h3>
                        <span className="font-display text-[28px] font-bold text-chocolate block mt-1">₹{cake.price}</span>
                        <p className="text-[15px] text-charcoal/60 leading-relaxed mt-2">{cake.short_description}</p>
                      </div>
                    </Link>
                  ) : (
                    <button
                      key={cake.id}
                      onClick={handleLockedClick}
                      className="group bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 block border border-cream-dark/30 text-left"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={cake.image_url}
                          alt={cake.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        {cake.badge && (
                          <span className="absolute top-4 left-4 bg-gold text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                            {cake.badge}
                          </span>
                        )}
                      </div>
                      <div className="p-6 text-center">
                        <span className="text-xs uppercase tracking-wider text-gold font-semibold">{cake.category}</span>
                        <h3 className="font-display text-[28px] font-bold text-chocolate group-hover:text-gold transition-colors duration-300 leading-tight mt-1.5">
                          {cake.name}
                        </h3>
                        <span className="font-display text-[28px] font-bold text-chocolate block mt-1">₹{cake.price}</span>
                        <p className="text-[15px] text-charcoal/60 leading-relaxed mt-2">{cake.short_description}</p>
                      </div>
                    </button>
                  )
                ))}
              </div>
            </>
          )}

          <FadeInSection className="text-center mt-8">
            {user ? (
              <Link
                to="/collection"
                className="inline-flex items-center gap-2 bg-chocolate text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-chocolate-light transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
              >
                View Full Collection
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            ) : (
              <button
                onClick={handleLockedClick}
                className="inline-flex items-center gap-2 bg-chocolate text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-chocolate-light transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
              >
                View Full Collection
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            )}
          </FadeInSection>
        </div>
      </section>

      {/* CTA */}
      <section className="pt-2 pb-12 md:pt-4 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=1600&h=600&fit=crop&q=80"
                  alt="Bakery background"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-chocolate/90 via-chocolate/80 to-chocolate/70 backdrop-blur-[2px]" />

              <div className="relative p-8 sm:p-12 lg:p-16 text-center">
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                  Ready to Create<br />Something Sweet?
                </h2>
                <p className="text-white/70 max-w-xl mx-auto mb-8 sm:mb-10 text-base sm:text-lg">
                  Whether it's a towering wedding cake or a charming birthday treat,
                  we'd love to bring your vision to life.
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
                  {user ? (
                    <Link
                      to="/custom-orders"
                      className="inline-flex items-center justify-center gap-2 bg-gold text-chocolate px-8 py-4 rounded-full text-sm font-semibold hover:bg-gold-light transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                    >
                      Start Your Order
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      onClick={handleLockedClick}
                      className="inline-flex items-center justify-center gap-2 bg-gold text-chocolate px-8 py-4 rounded-full text-sm font-semibold hover:bg-gold-light transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                    >
                      Start Your Order
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  {user ? (
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white px-8 py-4 rounded-full text-sm font-medium hover:border-white/40 hover:bg-white/10 transition-all duration-300"
                    >
                      Get in Touch
                    </Link>
                  ) : (
                    <button
                      onClick={handleLockedClick}
                      className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white px-8 py-4 rounded-full text-sm font-medium hover:border-white/40 hover:bg-white/10 transition-all duration-300"
                    >
                      Get in Touch
                    </button>
                  )}
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
    </>
  )
}
