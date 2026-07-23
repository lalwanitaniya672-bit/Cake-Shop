import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react'
import FadeInSection from '../components/FadeInSection'

const galleryItems = [
  { id: 1, title: 'Garden Romance Wedding', category: 'Wedding', image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&h=800&fit=crop&q=80', description: 'Three-tier masterpiece with hand-piped floral details and cascading roses' },
  { id: 2, title: 'Galaxy Mirror Glaze', category: 'Custom Design', image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&h=800&fit=crop&q=80', description: 'Mirror-finish glaze with constellation details and edible gold stars' },
  { id: 3, title: 'Princess Castle', category: 'Birthday', image: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?w=800&h=800&fit=crop&q=80', description: 'Magical five-tier castle for a 5th birthday celebration' },
  { id: 4, title: 'Autumn Harvest', category: 'Seasonal', image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&h=800&fit=crop&q=80', description: 'Warm spice cake with caramel apple filling and fondant leaves' },
  { id: 5, title: 'Classic Elegance', category: 'Wedding', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=800&fit=crop&q=80', description: 'Elegant monochrome design with gold leaf accents' },
  { id: 6, title: 'Under the Sea', category: 'Birthday', image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800&h=800&fit=crop&q=80', description: 'Underwater wonderland with fondant sea creatures and coral' },
  { id: 7, title: 'Sakura Blossom', category: 'Seasonal', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=800&fit=crop&q=80', description: 'Delicate cherry blossom branches on blush fondant' },
  { id: 8, title: 'Rustic Charm', category: 'Wedding', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=800&fit=crop&q=80', description: 'Naked cake with fresh greenery and wildflowers' },
  { id: 9, title: 'Art Deco Glamour', category: 'Custom Design', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=800&fit=crop&q=80', description: 'Geometric patterns in gold and emerald' },
  { id: 10, title: 'Winter Wonderland', category: 'Seasonal', image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=800&h=800&fit=crop&q=80', description: 'Snowflake details with silver shimmer frosting' },
  { id: 11, title: 'Superhero Academy', category: 'Birthday', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=800&fit=crop&q=80', description: 'Bold comic-book style with fondant masks and emblems' },
  { id: 12, title: 'Bohemian Dreams', category: 'Custom Design', image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=800&h=800&fit=crop&q=80', description: 'Macramé-inspired piping with terracotta and sage tones' },
]

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [showFilterSheet, setShowFilterSheet] = useState(false)

  const categories = useMemo(() => [
    { id: 'All', name: 'All', count: galleryItems.length },
    { id: 'Wedding', name: 'Wedding', count: galleryItems.filter(i => i.category === 'Wedding').length },
    { id: 'Birthday', name: 'Birthday', count: galleryItems.filter(i => i.category === 'Birthday').length },
    { id: 'Custom Design', name: 'Custom Design', count: galleryItems.filter(i => i.category === 'Custom Design').length },
    { id: 'Seasonal', name: 'Seasonal', count: galleryItems.filter(i => i.category === 'Seasonal').length },
  ], [])

  const filtered = useMemo(() => {
    let result = activeFilter === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter)

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      )
    }

    if (sortBy === 'price-low') {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      result = [...result].sort((a, b) => b.price - a.price)
    }

    return result
  }, [activeFilter, searchQuery, sortBy])

  const handlePrev = () => {
    if (selectedIndex === null) return
    const currentFilteredIndex = filtered.findIndex(item => item.id === galleryItems[selectedIndex].id)
    const prevIndex = (currentFilteredIndex - 1 + filtered.length) % filtered.length
    setSelectedIndex(galleryItems.indexOf(filtered[prevIndex]))
  }

  const handleNext = () => {
    if (selectedIndex === null) return
    const currentFilteredIndex = filtered.findIndex(item => item.id === galleryItems[selectedIndex].id)
    const nextIndex = (currentFilteredIndex + 1) % filtered.length
    setSelectedIndex(galleryItems.indexOf(filtered[nextIndex]))
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, #6A4943 0%, #5A3A32 100%)' }}>
        <div className="absolute top-20 right-20 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-medium text-gold uppercase tracking-[0.2em] mb-4 block">
            Our Work
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Cake Gallery
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            A visual feast of our finest creations. Each cake is a unique story
            brought to life through artistry and passion.
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
                  onClick={() => setActiveFilter(cat.id)}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeFilter === cat.id
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
                  placeholder="Search gallery..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 pl-9 pr-3 py-2.5 rounded-xl border border-cream-dark bg-white text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                />
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
                {activeFilter === 'All' ? 'All' : categories.find(c => c.id === activeFilter)?.name}
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
                        setActiveFilter(cat.id)
                        setShowFilterSheet(false)
                      }}
                      className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all duration-300 ${
                        activeFilter === cat.id
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

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedIndex(galleryItems.indexOf(item))}
                className="group bg-card rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col border border-cream-dark/30 cursor-pointer"
              >
                <div className="relative h-36 sm:h-48 lg:h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-chocolate/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-3 sm:p-5 lg:p-6 flex flex-col flex-1 text-center">
                  <span className="text-[10px] sm:text-xs lg:text-sm uppercase tracking-wider text-gold font-semibold mb-1 sm:mb-1.5">
                    {item.category}
                  </span>
                  <h3 className="font-display text-[15px] sm:text-xl lg:text-[28px] font-bold text-chocolate group-hover:text-gold transition-colors duration-300 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-warm-gray leading-relaxed mt-1 sm:mt-2 flex-1 hidden sm:block">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-chocolate/80 backdrop-blur-sm"
            onClick={() => setSelectedIndex(null)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev() }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-cream-dark/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={galleryItems[selectedIndex].image}
                  alt={galleryItems[selectedIndex].title}
                  className="w-full h-60 sm:h-80 lg:h-96 object-cover"
                />
                <button
                  onClick={() => setSelectedIndex(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                >
                  <X className="w-5 h-5 text-charcoal" />
                </button>
              </div>
              <div className="p-8">
                <span className="text-xs uppercase tracking-wider text-gold font-medium">
                  {galleryItems[selectedIndex].category}
                </span>
                <h3 className="font-display text-2xl font-bold text-chocolate mt-1 mb-3">
                  {galleryItems[selectedIndex].title}
                </h3>
                <p className="text-warm-gray leading-relaxed">
                  {galleryItems[selectedIndex].description}
                </p>
              </div>
            </motion.div>

            <button
              onClick={(e) => { e.stopPropagation(); handleNext() }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="pt-2 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInSection>
            <a
              href="/custom-orders"
              className="inline-flex items-center gap-2 bg-gold text-chocolate px-8 py-4 rounded-full text-sm font-medium hover:bg-gold-light transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            >
              Design a Custom Cake
            </a>
          </FadeInSection>
        </div>
      </section>
    </>
  )
}
