import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ThumbsUp, Check, Quote } from 'lucide-react'
import { supabase } from '../lib/supabase'
import StarRating from '../components/StarRating'
import FadeInSection from '../components/FadeInSection'

function ReviewCard({ review }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group rounded-2xl p-5 sm:p-6 shadow-[0_2px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_32px_rgba(0,0,0,0.15)] transition-all duration-500 h-full flex flex-col relative overflow-hidden"
      style={{ backgroundColor: '#523632' }}
    >
      <div className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundColor: 'rgba(201,161,92,0.15)' }}>
        <Quote className="w-4 h-4 text-gold" />
      </div>

      <div className="flex items-center gap-3 mb-3">
        {review.avatar ? (
          <img src={review.avatar} alt={review.customer_name} className="w-11 h-11 rounded-full object-cover ring-2 ring-gold/30 ring-offset-2 ring-offset-[#523632]" />
        ) : (
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-rose to-gold flex items-center justify-center ring-2 ring-gold/30 ring-offset-2 ring-offset-[#523632]">
            <span className="text-white text-sm font-bold">{review.customer_name?.[0]?.toUpperCase()}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display text-base font-bold text-white">{review.customer_name}</h3>
            {review.verified && (
              <span className="flex items-center gap-1 text-[9px] font-semibold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded-full">
                <Check className="w-2.5 h-2.5" /> Verified
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <StarRating rating={review.rating} size={13} />
            <span className="text-[11px] text-white/50">{new Date(review.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {(review.event || review.cake_name) && (
        <div className="mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(201,161,92,0.15)' }}>
            {review.event}{review.event && review.cake_name ? ' · ' : ''}{review.cake_name}
          </span>
        </div>
      )}

      <div className="flex-1 mb-3">
        <p className="text-[13px] text-white/75 leading-relaxed">
          {review.comment}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button className="flex items-center gap-1.5 text-xs text-white/50 hover:text-gold transition-colors duration-300">
          <ThumbsUp className="w-3.5 h-3.5" />
          <span className="font-medium">Helpful ({review.helpful || 0})</span>
        </button>
        {review.cake_id && (
          <Link
            to={`/cake/${review.cake_id}`}
            className="text-xs text-gold font-semibold hover:text-gold/70 transition-colors duration-300"
          >
            View Cake →
          </Link>
        )}
      </div>
    </motion.div>
  )
}

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ average: '0.0', total: 0, distribution: [] })

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false })
      if (error) throw error
      const reviewsData = data || []
      setReviews(reviewsData)

      const total = reviewsData.length
      const avg = total > 0 ? (reviewsData.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : '0.0'
      const distribution = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: reviewsData.filter(r => r.rating === star).length,
        percentage: total > 0 ? (reviewsData.filter(r => r.rating === star).length / total) * 100 : 0,
      }))
      setStats({ average: avg, total, distribution })
    } catch (err) {
      console.error('Fetch reviews error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream pt-24 sm:pt-28 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <FadeInSection className="text-center mb-14">
          <span className="text-xs font-semibold text-gold uppercase tracking-[0.25em] mb-4 block">Testimonials</span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-chocolate mb-5">
            Customer Reviews
          </h1>
          <p className="text-warm-gray text-lg max-w-2xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what our clients have to say about their experience with The Velvet Crumb.
          </p>
        </FadeInSection>

        {/* Stats */}
        <FadeInSection className="mb-14">
          <div className="bg-white rounded-[2rem] p-7 sm:p-10 shadow-[0_2px_24px_rgba(0,0,0,0.04)] border border-cream-dark/30">
            <div className="grid sm:grid-cols-2 gap-10 items-center">
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-4 justify-center sm:justify-start mb-3">
                  <span className="font-display text-6xl font-bold text-chocolate">{stats.average}</span>
                  <div>
                    <StarRating rating={parseFloat(stats.average)} size={22} />
                    <p className="text-sm text-warm-gray mt-1.5 font-medium">{stats.total} verified reviews</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {stats.distribution.map((d) => (
                  <div key={d.star} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-warm-gray w-8">{d.star} ★</span>
                    <div className="flex-1 h-2.5 bg-cream-dark rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${d.percentage}%` }}
                        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-gold to-gold/80 rounded-full"
                      />
                    </div>
                    <span className="text-xs font-medium text-warm-gray w-8 text-right">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* Reviews Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-warm-gray">No reviews yet. Be the first to leave a review!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {reviews.map((review) => (
              <FadeInSection key={review.id}>
                <ReviewCard review={review} />
              </FadeInSection>
            ))}
          </div>
        )}

        {/* CTA */}
        <FadeInSection className="mt-20">
          <div className="bg-gradient-to-br from-chocolate via-chocolate to-chocolate-light rounded-[2rem] p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">Share Your Experience</h2>
              <p className="text-white/60 max-w-lg mx-auto mb-9 text-lg leading-relaxed">
                Loved your cake? We'd love to hear about it. Your review helps us craft even sweeter experiences.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-gold text-chocolate px-9 py-4 rounded-full text-sm font-bold hover:bg-gold-light transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
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
