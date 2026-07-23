import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Award, Heart, Users, Cake, Clock, Truck, Shield } from 'lucide-react'
import FadeInSection from '../components/FadeInSection'

const features = [
  { icon: <Cake className="w-6 h-6" />, title: 'Premium Ingredients', desc: 'We use only the finest locally-sourced butter, fresh eggs, and real vanilla to create cakes that taste as extraordinary as they look.' },
  { icon: <Heart className="w-6 h-6" />, title: 'Handcrafted with Love', desc: 'Every cake is personally crafted by our skilled artisans, ensuring each creation is a unique work of art made just for you.' },
  { icon: <Clock className="w-6 h-6" />, title: 'Freshly Baked Daily', desc: 'No pre-made mixes or frozen fillings. Each cake is baked fresh from scratch on the day of your celebration.' },
  { icon: <Truck className="w-6 h-6" />, title: 'Careful Delivery', desc: 'Our white-glove delivery service ensures your cake arrives in perfect condition, ready to dazzle your guests.' },
  { icon: <Shield className="w-6 h-6" />, title: 'Quality Guarantee', desc: 'We stand behind every cake we create. If you\'re not completely satisfied, we\'ll make it right.' },
  { icon: <Award className="w-6 h-6" />, title: 'Award-Winning Designs', desc: 'Our cakes have been featured in top bridal magazines and won multiple industry awards for excellence.' },
]

export default function Trust() {
  return (
    <>
      {/* Hero - Premium Why Choose Us */}
      <section className="relative min-h-screen w-full overflow-hidden pt-7 md:pt-0">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=1920&h=1080&fit=crop&q=80"
            alt="Premium cake design"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/75 backdrop-blur-[1px]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-5 sm:px-6 min-h-screen pt-16 pb-12 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-5 sm:mb-6 border border-white/20"
          >
            <Users className="w-4 h-4 text-gold" />
            <span className="text-xs font-medium text-white/90 uppercase tracking-wider">Why Choose Us</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-5 leading-[1.15] max-w-4xl"
          >
            Trusted by Thousands
          </motion.h1>

          {/* Decorative Line */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-5"
          >
            <div className="w-12 sm:w-16 h-px bg-gold/50" />
            <div className="w-2 h-2 rounded-full bg-gold" />
            <div className="w-12 sm:w-16 h-px bg-gold/50" />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/75 leading-relaxed text-[13px] sm:text-lg max-w-[28rem] sm:max-w-2xl mb-8 sm:mb-12"
          >
            Our commitment to quality and excellence has earned us the trust of over a thousand happy customers.
            Here's why families choose The Velvet Crumb for their most precious celebrations.
          </motion.p>

          {/* Feature Cards - 4 Premium Glassmorphism */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-5xl w-full">
            {features.slice(0, 4).map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-white/10 backdrop-blur-md rounded-3xl p-5 sm:p-7 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-500"
              >
                {/* Glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 to-rose/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-gold/25 to-gold/10 flex items-center justify-center text-gold flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {f.icon}
                  </div>

                  <div className="text-left">
                    {/* Title */}
                    <h3 className="font-display text-base sm:text-lg font-semibold text-white mb-1.5">{f.title}</h3>

                    {/* Description */}
                    <p className="text-white/55 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-chocolate to-chocolate-light" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose/10 rounded-full blur-3xl" />

              <div className="relative p-8 sm:p-12 lg:p-16 text-center">
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                  Ready to Experience<br />the Difference?
                </h2>
                <p className="text-white/60 max-w-xl mx-auto mb-8 sm:mb-10 text-base sm:text-lg">
                  Join over a thousand happy customers who trust The Velvet Crumb
                  for their most special celebrations.
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
                  <Link
                    to="/collection"
                    className="inline-flex items-center justify-center gap-2 bg-gold text-chocolate px-8 py-4 rounded-full text-sm font-semibold hover:bg-gold-light transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    Explore Our Cakes
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/custom-orders"
                    className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white px-8 py-4 rounded-full text-sm font-medium hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                  >
                    Start Your Order
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
