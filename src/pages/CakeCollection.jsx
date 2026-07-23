import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import cakes, { categories } from '../data/cakes'
import FadeInSection from '../components/FadeInSection'
import StarRating from '../components/StarRating'

export default function CakeCollection() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [showFilterSheet, setShowFilterSheet] = useState(false)

  let filtered = activeCategory === 'all'
    ? cakes
    : cakes.filter((c) => c.category === activeCategory)

  if (searchQuery) {
    filtered = filtered.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  if (sortBy === 'price-low') filtered = [...filtered].sort((a, b) => a.price - b.price)
  if (sortBy === 'price-high') filtered = [...filtered].sort((a, b) => b.price - a.price)
  if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating)

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 md:pt-32 pb-12 md:pb-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, #6A4943 0%, #5A3A32 100%)' }}>
        <div className="absolute top-20 right-10 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <span className="text-xs font-medium text-gold uppercase tracking-[0.2em] mb-4 block">
            Our Creations
          </span>
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Cake Collection
          </h1>
          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto">
            From timeless wedding tiers to playful birthday showstoppers,
            discover our curated collection of signature cakes.
          </p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-3 md:py-6 sticky top-20 md:top-20 z-40 bg-cream border-b border-cream-dark/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Desktop Filters */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat.id
                      ? 'bg-chocolate text-white shadow-md'
                      : 'bg-white text-charcoal/60 hover:text-chocolate hover:bg-cream-dark'
                  }`}
                >
                  {cat.name}
                  <span className="ml-1.5 text-xs opacity-60">({cat.count})</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                <input
                  type="text"
                  placeholder="Search cakes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 pl-9 pr-3 py-2.5 rounded-xl border border-cream-dark bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                />
              </div>
              <div className="relative">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-9 pr-8 py-2.5 rounded-xl border border-cream-dark bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 appearance-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          <div className="md:hidden">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilterSheet(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-cream-dark text-xs font-medium text-chocolate"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {activeCategory === 'all' ? 'All Cakes' : categories.find(c => c.id === activeCategory)?.name}
              </button>
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-warm-gray" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-2 py-2 rounded-xl border border-cream-dark bg-white text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                />
              </div>
              <div className="relative">
                <SlidersHorizontal className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-warm-gray pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-6 pr-5 py-2 rounded-xl border border-cream-dark bg-white text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 appearance-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low</option>
                  <option value="price-high">Price: High</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Bottom Sheet */}
      <AnimatePresence>
        {showFilterSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 md:hidden"
              onClick={() => setShowFilterSheet(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 md:hidden max-h-[70vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-cream-dark">
                <h3 className="font-display text-lg font-semibold text-chocolate">Filter by Category</h3>
                <button
                  onClick={() => setShowFilterSheet(false)}
                  className="w-8 h-8 rounded-full bg-cream flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-chocolate" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id)
                        setShowFilterSheet(false)
                      }}
                      className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all duration-300 ${
                        activeCategory === cat.id
                          ? 'bg-chocolate text-white shadow-md'
                          : 'bg-cream text-charcoal/70 hover:bg-cream-dark'
                      }`}
                    >
                      {cat.name}
                      <span className="ml-1 text-xs opacity-60">({cat.count})</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🎂</div>
              <h3 className="font-display text-xl font-semibold text-chocolate mb-2">No cakes found</h3>
              <p className="text-warm-gray text-sm">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <>
              {/* Mobile Grid */}
              <div className="grid grid-cols-2 gap-3 md:hidden">
                {filtered.map((cake) => (
                  <Link
                    key={cake.id}
                    to={`/cake/${cake.id}`}
                    className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1 h-full flex flex-col border border-cream-dark/30 cursor-pointer"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={cake.image}
                        alt={cake.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-chocolate/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {cake.badge && (
                        <span className="absolute top-1.5 left-1.5 bg-gold text-white text-[8px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
                          {cake.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-2.5 flex flex-col flex-1 text-center">
                      <h3 className="font-display text-[15px] font-bold text-chocolate group-hover:text-gold transition-colors duration-300 leading-tight line-clamp-1">
                        {cake.name}
                      </h3>
                      <div className="mt-auto pt-1">
                        <span className="font-display text-[17px] font-bold text-chocolate">₹{cake.price}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Desktop Grid */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((cake) => (
                  <Link
                    key={cake.id}
                    to={`/cake/${cake.id}`}
                    className="group bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col border border-cream-dark/30 cursor-pointer"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={cake.image}
                        alt={cake.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-chocolate/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {cake.badge && (
                          <span className="bg-gold text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                            {cake.badge}
                          </span>
                        )}
                        {cake.originalPrice && (
                          <span className="bg-rose text-white text-[10px] font-semibold px-3 py-1.5 rounded-full">
                            Sale
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1 text-center">
                      <span className="text-[10px] uppercase tracking-wider text-gold font-medium mb-1">
                        {cake.category}
                      </span>
                      <h3 className="font-display text-[22px] font-bold text-chocolate group-hover:text-gold transition-colors duration-300 leading-tight">
                        {cake.name}
                      </h3>
                      <span className="font-display text-[28px] font-bold text-chocolate block mt-1">₹{cake.price}</span>
                      {cake.originalPrice && (
                        <span className="text-xs text-warm-gray line-through">₹{cake.originalPrice}</span>
                      )}
                      <p className="text-sm text-warm-gray leading-relaxed mb-3 mt-2 flex-1">
                        {cake.shortDescription}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="pt-2 pb-12">
        <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <FadeInSection>
            <Link
              to="/custom-orders"
              className="inline-flex items-center gap-2 bg-gold text-chocolate px-8 py-4 rounded-full text-sm font-medium hover:bg-gold-light transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            >
              Design a Custom Cake
            </Link>
          </FadeInSection>
        </div>
      </section>
    </>
  )
}
