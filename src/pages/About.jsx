import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import FadeInSection from '../components/FadeInSection'

const timeline = [
  { year: '2018', title: 'A Kitchen Dream', desc: 'Started baking from a tiny home kitchen with a passion for creating beauty through cake.' },
  { year: '2020', title: 'First Signature Collection', desc: 'Introduced our premium handcrafted cake collection.' },
  { year: '2022', title: '1000+ Happy Customers', desc: 'Celebrated over 1000 satisfied customers and memorable celebrations.' },
  { year: '2024', title: 'The Velvet Crumb', desc: 'Expanded with custom cakes, online orders, and luxury cake experiences.' },
]

export default function About() {
  const [readMore, setReadMore] = useState(false)
  const expandedRef = useRef(null)

  const handleReadMore = useCallback(() => {
    const next = !readMore
    setReadMore(next)
    if (next) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          expandedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        })
      })
    }
  }, [readMore])

  return (
    <>
      {/* Hero - Fullscreen Premium */}
      <section className="relative min-h-screen w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=1920&h=1080&fit=crop&q=80"
            alt="Luxury artisan cake"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Dark Overlay - warm tones for elegance */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#3E2723]/50 via-[#3E2723]/45 to-[#3E2723]/55 backdrop-blur-[1px]" />

        {/* Content - offset by navbar height (h-16 lg:h-20) */}
        <div className="relative z-10 flex flex-col items-center text-center px-5 sm:px-6 min-h-screen pt-16 pb-5 sm:pt-20 sm:pb-6 lg:pt-24 lg:pb-8">
          {/* Cupcake Icon */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-1.5 sm:mb-3"
          >
            <svg className="w-9 h-9 sm:w-12 sm:h-12 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M12 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="currentColor" opacity="0.3"/>
              <path d="M6 14c0-2 2-4 6-4s6 2 6 4v2H6v-2z"/>
              <path d="M4 16h16v4c0 1-1 2-2 2H6c-1 0-2-1-2-2v-4z"/>
              <path d="M12 4v2"/>
              <circle cx="12" cy="3" r="1"/>
            </svg>
          </motion.div>

          {/* Decorative Line */}
          <div className="flex items-center gap-3 sm:gap-4 mb-1.5 sm:mb-3">
            <div className="w-8 sm:w-12 h-px bg-gold/50" />
            <span className="text-gold text-[10px] sm:text-xs font-medium uppercase tracking-[0.3em]">About Us</span>
            <div className="w-8 sm:w-12 h-px bg-gold/50" />
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-[26px] sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 sm:mb-5 leading-[1.18] max-w-4xl"
          >
            Crafting Sweet Moments with Every Slice
          </motion.h1>

          {/* Heart Decorative */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-5"
          >
            <div className="w-10 sm:w-16 h-px bg-gold/40" />
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gold" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <div className="w-10 sm:w-16 h-px bg-gold/40" />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-white/80 leading-[1.5] sm:leading-relaxed text-[13px] sm:text-lg max-w-[28rem] sm:max-w-2xl mb-3.5 sm:mb-8"
          >
            At The Velvet Crumb, every cake is handcrafted with premium ingredients,
            creativity, and love. From birthdays to weddings and every special celebration,
            we create desserts that turn beautiful moments into unforgettable memories.
          </motion.p>

          {/* Feature Icons Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-10 mb-3.5 sm:mb-8 max-w-3xl w-full"
          >
            <div className="flex flex-col items-center gap-1.5 sm:gap-2">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L8 8l-6 1 4.5 4-1 6L12 16l6.5 3-1-6L22 9l-6-1L12 2z"/>
              </svg>
              <span className="text-white/90 text-[10px] sm:text-sm">Premium Ingredients</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 sm:gap-2">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                <path d="M4 12h16v2c0 2-2 4-6 4H10c-4 0-6-2-6-4v-2z"/>
                <path d="M12 2v4"/>
              </svg>
              <span className="text-white/90 text-[10px] sm:text-sm">Custom Cake Designs</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 sm:gap-2">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                <path d="M6 14c0-2 2-4 6-4s6 2 6 4v2H6v-2z"/>
                <path d="M4 16h16v4c0 1-1 2-2 2H6c-1 0-2-1-2-2v-4z"/>
              </svg>
              <span className="text-white/90 text-[10px] sm:text-sm">Freshly Baked Every Day</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 sm:gap-2">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gold" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span className="text-white/90 text-[10px] sm:text-sm">Crafted with Love</span>
            </div>
          </motion.div>

          {/* Read More Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            onClick={handleReadMore}
            className="group flex items-center gap-2.5 sm:gap-3 bg-gradient-to-r from-rose/80 to-rose-dark/80 hover:from-rose hover:to-rose-dark text-white px-7 py-3.5 sm:px-10 sm:py-5 rounded-full font-medium transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 backdrop-blur-sm"
          >
            <span className="text-xs sm:text-sm uppercase tracking-wider">Read More</span>
            <svg
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${readMore ? 'rotate-90' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.button>

          {/* Expanded Content */}
          <div ref={expandedRef}>
            <AnimatePresence>
              {readMore && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 sm:mt-8 max-w-2xl text-white/70 text-sm sm:text-base leading-relaxed space-y-3 sm:space-y-4">
                    <p>
                      Founded in 2018 by Amara Osei, our studio was born from a simple belief:
                      that cake should be more than dessert. It should tell a story, evoke emotion,
                      and create memories that last a lifetime.
                    </p>
                    <p>
                      After studying pastry arts in Paris and apprenticing at a Michelin-starred
                      patisserie, she returned home with a vision: to create a bakery where every
                      cake was a one-of-a-kind work of art.
                    </p>
                    <p>
                      Today, The Velvet Crumb is that vision realized - a place where premium
                      ingredients meet boundless creativity, and where every client becomes part
                      of our extended family.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Glassmorphism Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-3 sm:mt-8 w-full max-w-2xl"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-3 sm:p-8">
              <div className="grid grid-cols-3 gap-2 sm:gap-8">
                <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                      <path d="M4 12h16v2c0 2-2 4-6 4H10c-4 0-6-2-6-4v-2z"/>
                      <path d="M12 2v4"/>
                    </svg>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-display text-sm sm:text-2xl font-bold text-white">2500+</p>
                    <p className="text-white/60 text-[8px] sm:text-sm">Cakes Crafted</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-display text-sm sm:text-2xl font-bold text-white">1000+</p>
                    <p className="text-white/60 text-[8px] sm:text-sm">Happy Customers</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-gold" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-display text-sm sm:text-2xl font-bold text-white">5★</p>
                    <p className="text-white/60 text-[8px] sm:text-sm">Customer Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Founder - Premium Two-Column (Reversed) */}
      <section className="pt-4 pb-3 sm:pt-6 sm:pb-5 lg:pt-8 lg:pb-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="max-w-3xl">
              <span className="text-xs font-medium text-gold uppercase tracking-[0.2em] mb-4 block">Meet the Baker</span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-chocolate mb-6 leading-tight">
                A Life Shaped by Flour & Butter
              </h2>
              <div className="space-y-4 text-charcoal/60 leading-relaxed">
                <p>
                  Amara's love affair with baking began in her grandmother's kitchen in Accra,
                  where she learned that the best recipes come with a generous helping of patience
                  and a pinch of storytelling.
                </p>
                <p>
                  After studying pastry arts in Paris and apprenticing at a Michelin-starred
                  patisserie, she returned home with a vision: to create a bakery where every
                  cake was a one-of-a-kind work of art.
                </p>
                <p>
                  Today, The Velvet Crumb is that vision realized - a place where premium
                  ingredients meet boundless creativity, and where every client becomes part
                  of our extended family.
                </p>
              </div>

              {/* Quote */}
              <div className="mt-8 bg-cream rounded-2xl p-6 border border-cream-dark/30">
                <p className="font-display text-chocolate italic text-base leading-relaxed">
                  &ldquo;Cake is edible art. Every creation should make someone pause, smile, and feel truly special.&rdquo;
                </p>
                <p className="text-gold font-semibold text-sm mt-3">- Amara Osei, Founder</p>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Timeline */}
      <section className="pt-5 sm:pt-7 lg:pt-9 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-12 sm:mb-16">
            <span className="text-xs font-medium text-gold uppercase tracking-[0.2em] mb-4 block">Our Journey</span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-chocolate">Sweet Milestones</h2>
          </FadeInSection>

          <div className="max-w-3xl mx-auto relative">
            {/* Vertical Line */}
            <div className="absolute left-6 sm:left-10 top-0 bottom-0 w-px bg-gradient-to-b from-gold/30 via-rose/30 to-gold/30" />

            {timeline.map((t, i) => (
              <motion.div
                key={t.year}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative flex gap-4 sm:gap-8 mb-8 sm:mb-10 pl-0"
              >
                {/* Year Circle */}
                <div className="flex-shrink-0 w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-rose/20 to-gold/20 flex items-center justify-center relative z-10 border-4 border-cream">
                  <span className="font-display text-sm sm:text-lg font-bold text-chocolate">{t.year}</span>
                </div>

                {/* Content */}
                <div className="pt-2 sm:pt-4 flex-1">
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-chocolate mb-1.5 sm:mb-2">{t.title}</h3>
                  <p className="text-sm text-warm-gray leading-relaxed">{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="bg-gradient-to-br from-chocolate to-chocolate-light rounded-[2rem] p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose/10 rounded-full blur-3xl" />
              <div className="relative">
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                  Let's Create Together
                </h2>
                <p className="text-white/60 max-w-xl mx-auto mb-8 sm:mb-10 text-base sm:text-lg">
                  Your celebration deserves something extraordinary. Let's make it happen.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-gold text-chocolate px-8 py-4 rounded-full text-sm font-semibold hover:bg-gold-light transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
    </>
  )
}
