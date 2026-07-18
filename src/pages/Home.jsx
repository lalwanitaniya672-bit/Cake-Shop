import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Truck, Clock, Shield, ChevronRight } from 'lucide-react'
import { getFeaturedCakes } from '../data/cakes'
import reviews from '../data/reviews'
import FadeInSection from '../components/FadeInSection'
import StarRating from '../components/StarRating'

const stats = [
  { number: '2,500+', label: 'Cakes Crafted' },
  { number: '7', label: 'Years of Joy' },
  { number: '100%', label: 'Premium Ingredients' },
  { number: '4.9★', label: 'Customer Rating' },
]

const processSteps = [
  { step: '01', title: 'Consultation', desc: 'Share your vision, theme, and flavor preferences with our cake designers.', icon: '💬' },
  { step: '02', title: 'Design', desc: 'We create detailed sketches and flavor profiles tailored to your occasion.', icon: '✏️' },
  { step: '03', title: 'Craft', desc: 'Our artisans handcraft your cake using premium, locally-sourced ingredients.', icon: '👨‍🍳' },
  { step: '04', title: 'Deliver', desc: 'Careful delivery and setup to ensure your cake arrives picture-perfect.', icon: '🚚' },
]

export default function Home() {
  const featuredCakes = getFeaturedCakes()
  const topReviews = reviews.slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-blush/30 to-cream-dark" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-rose/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-gold/10 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-xs font-medium text-gold uppercase tracking-wider">
                Handcrafted with Love
              </span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-chocolate leading-[1.1] mb-6">
              Cakes That
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-dark to-gold">
                Tell Stories
              </span>
            </h1>

            <p className="text-lg text-charcoal/60 max-w-lg mb-10 leading-relaxed">
              Every layer holds a promise of perfection. From intimate celebrations to grand weddings,
              we craft edible masterpieces that make your sweetest moments unforgettable.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/collection"
                className="group inline-flex items-center gap-2 bg-chocolate text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-chocolate-light transition-all duration-300 hover:shadow-xl hover:shadow-chocolate/20 hover:-translate-y-0.5"
              >
                Explore Our Cakes
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/custom-orders"
                className="inline-flex items-center gap-2 border-2 border-chocolate/20 text-chocolate px-8 py-4 rounded-full text-sm font-medium hover:border-chocolate/40 hover:bg-chocolate/5 transition-all duration-300"
              >
                Design Your Own
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-chocolate/10">
              <div className="flex -space-x-2">
                {['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&q=80',
                ].map((src, i) => (
                  <img key={i} src={src} alt="" className="w-9 h-9 rounded-full border-2 border-cream object-cover" />
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-xs text-warm-gray mt-0.5">Loved by 2,500+ happy clients</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative w-80 h-80 sm:w-[420px] sm:h-[420px]">
              <div className="absolute inset-0 bg-gradient-to-br from-rose/20 to-gold/20 rounded-3xl rotate-6" />
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&q=80"
                  alt="Beautiful chocolate cake"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="font-display text-2xl font-bold">Dark Chocolate Truffle</p>
                  <p className="text-sm text-white/80 mt-1">Our signature bestseller</p>
                </div>
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                    <Star className="w-4 h-4 text-gold fill-gold" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-chocolate">4.9 Rating</p>
                    <p className="text-[10px] text-warm-gray">2,500+ reviews</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-chocolate">Free Delivery</p>
                    <p className="text-[10px] text-warm-gray">Orders $150+</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-6 h-6 text-chocolate/30 rotate-90" />
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <FadeInSection key={stat.label} delay={i * 100} className="text-center">
                <div className="font-display text-3xl sm:text-4xl font-bold text-chocolate mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-warm-gray font-medium">{stat.label}</div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cakes */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-16">
            <span className="text-xs font-medium text-gold uppercase tracking-[0.2em] mb-4 block">
              Signature Collection
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-chocolate mb-4">
              Our Finest Creations
            </h2>
            <p className="text-warm-gray max-w-2xl mx-auto">
              Each cake in our signature collection is a labor of love, meticulously crafted
              to delight both the eyes and the palate.
            </p>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredCakes.map((cake, i) => (
              <FadeInSection key={cake.id} delay={i * 150}>
                <Link
                  to={`/cake/${cake.id}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 block"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={cake.image}
                      alt={cake.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-chocolate/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {cake.badge && (
                      <span className="absolute top-4 left-4 bg-gold text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                        {cake.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] uppercase tracking-wider text-gold font-medium">{cake.category}</span>
                    </div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-display text-xl font-semibold text-chocolate group-hover:text-gold transition-colors duration-300">
                        {cake.name}
                      </h3>
                      <span className="font-display text-lg font-semibold text-gold">${cake.price}</span>
                    </div>
                    <p className="text-sm text-warm-gray leading-relaxed mb-3">{cake.shortDescription}</p>
                    <div className="flex items-center gap-2">
                      <StarRating rating={cake.rating} size={12} />
                      <span className="text-xs text-warm-gray">({cake.reviewCount})</span>
                    </div>
                  </div>
                </Link>
              </FadeInSection>
            ))}
          </div>

          <FadeInSection className="text-center mt-12">
            <Link
              to="/collection"
              className="inline-flex items-center gap-2 text-chocolate font-medium hover:text-gold transition-colors duration-300 group"
            >
              View Full Collection
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </FadeInSection>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-chocolate text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 right-20 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-rose/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-16">
            <span className="text-xs font-medium text-gold uppercase tracking-[0.2em] mb-4 block">
              How We Work
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
              From Dream to Table
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Every creation begins with a conversation and ends with a celebration.
            </p>
          </FadeInSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((item, i) => (
              <FadeInSection key={item.step} delay={i * 150}>
                <div className="text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 text-2xl group-hover:bg-gold/20 group-hover:border-gold/30 transition-all duration-300">
                    {item.icon}
                  </div>
                  <div className="text-gold/50 font-display text-sm font-semibold mb-2">Step {item.step}</div>
                  <h3 className="font-display text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-16">
            <span className="text-xs font-medium text-gold uppercase tracking-[0.2em] mb-4 block">
              Sweet Words
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-chocolate mb-4">
              What Our Clients Say
            </h2>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-8">
            {topReviews.map((t, i) => (
              <FadeInSection key={t.id} delay={i * 150}>
                <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-500 h-full flex flex-col">
                  <StarRating rating={t.rating} className="mb-4" />
                  <p className="text-charcoal/70 leading-relaxed flex-1 mb-6 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="pt-6 border-t border-cream-dark flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-display font-semibold text-chocolate text-sm">{t.name}</p>
                      <p className="text-xs text-warm-gray">{t.event} · {t.date}</p>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>

          <FadeInSection className="text-center mt-8">
            <Link
              to="/reviews"
              className="inline-flex items-center gap-2 text-chocolate font-medium hover:text-gold transition-colors group"
            >
              Read All Reviews
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </FadeInSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="relative bg-gradient-to-br from-chocolate to-chocolate-light rounded-[2rem] p-12 sm:p-16 overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose/10 rounded-full blur-3xl" />

              <div className="relative">
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
                  Ready to Create<br />Something Sweet?
                </h2>
                <p className="text-white/60 max-w-xl mx-auto mb-10 text-lg">
                  Whether it's a towering wedding cake or a charming birthday treat,
                  we'd love to bring your vision to life.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    to="/custom-orders"
                    className="inline-flex items-center gap-2 bg-gold text-chocolate px-8 py-4 rounded-full text-sm font-semibold hover:bg-gold-light transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Start Your Order
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 border-2 border-white/20 text-white px-8 py-4 rounded-full text-sm font-medium hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                  >
                    Get in Touch
                  </Link>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
    </>
  )
}
