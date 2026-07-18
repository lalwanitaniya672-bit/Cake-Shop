import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ThumbsUp, Check, Filter } from 'lucide-react'
import reviews, { getReviewStats } from '../data/reviews'
import StarRating from '../components/StarRating'
import FadeInSection from '../components/FadeInSection'

export default function Reviews() {
  const [filter, setFilter] = useState('all')
  const stats = getReviewStats()

  const filtered = filter === 'all'
    ? reviews
    : reviews.filter((r) => r.event.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeInSection className="text-center mb-12">
          <span className="text-xs font-medium text-gold uppercase tracking-[0.2em] mb-4 block">Testimonials</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-chocolate mb-4">Customer Reviews</h1>
          <p className="text-warm-gray max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say about their experience with The Velvet Crumb.
          </p>
        </FadeInSection>

        {/* Stats */}
        <FadeInSection className="mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="grid sm:grid-cols-2 gap-8 items-center">
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-3 justify-center sm:justify-start mb-2">
                  <span className="font-display text-5xl font-bold text-chocolate">{stats.average}</span>
                  <div>
                    <StarRating rating={stats.average} size={20} />
                    <p className="text-sm text-warm-gray mt-1">{stats.total} reviews</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {stats.distribution.map((d) => (
                  <div key={d.star} className="flex items-center gap-3">
                    <span className="text-sm text-warm-gray w-8">{d.star} ★</span>
                    <div className="flex-1 h-2 bg-cream-dark rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${d.percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full bg-gold rounded-full"
                      />
                    </div>
                    <span className="text-xs text-warm-gray w-8 text-right">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* Filters */}
        <FadeInSection className="mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="w-4 h-4 text-warm-gray" />
            {['all', 'wedding', 'birthday', 'corporate'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filter === f
                    ? 'bg-chocolate text-white'
                    : 'bg-white text-charcoal/60 hover:text-chocolate border border-cream-dark'
                }`}
              >
                {f === 'all' ? 'All Reviews' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </FadeInSection>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((review, i) => (
            <FadeInSection key={review.id} delay={i * 80}>
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-500 h-full"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-chocolate">{review.name}</h3>
                      {review.verified && (
                        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <Check className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={review.rating} size={14} />
                      <span className="text-xs text-warm-gray">· {review.date}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-xs text-gold font-medium bg-gold/10 px-3 py-1 rounded-full">
                    {review.event} · {review.cakeName}
                  </span>
                </div>

                <p className="text-sm text-charcoal/70 leading-relaxed mb-4">{review.text}</p>

                {review.images.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {review.images.map((img, j) => (
                      <img key={j} src={img} alt="Review" className="w-16 h-16 rounded-lg object-cover" />
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-cream-dark">
                  <button className="flex items-center gap-2 text-sm text-warm-gray hover:text-gold transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({review.helpful})
                  </button>
                  <Link
                    to={`/cake/${review.cakeId}`}
                    className="text-sm text-gold font-medium hover:text-gold-light transition-colors"
                  >
                    View Cake →
                  </Link>
                </div>
              </motion.div>
            </FadeInSection>
          ))}
        </div>

        {/* CTA */}
        <FadeInSection className="mt-16">
          <div className="bg-gradient-to-br from-chocolate to-chocolate-light rounded-[2rem] p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="font-display text-3xl font-bold text-white mb-4">Share Your Experience</h2>
              <p className="text-white/60 max-w-md mx-auto mb-8">
                Loved your cake? We'd love to hear about it. Your review helps us craft even sweeter experiences.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-gold text-chocolate px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-gold-light transition-all duration-300"
              >
                Leave a Review
              </Link>
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  )
}
