import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import FadeInSection from '../components/FadeInSection'

const galleryFilters = ['All', 'Wedding', 'Birthday', 'Custom Design', 'Seasonal']

const galleryItems = [
  { id: 1, title: 'Garden Romance Wedding', category: 'Wedding', image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&h=800&fit=crop&q=80', description: 'Three-tier masterpiece with hand-piped floral details and cascading roses' },
  { id: 2, title: 'Galaxy Mirror Glaze', category: 'Custom Design', image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&h=800&fit=crop&q=80', description: 'Mirror-finish glaze with constellation details and edible gold stars' },
  { id: 3, title: 'Princess Castle', category: 'Birthday', image: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?w=800&h=800&fit=crop&q=80', description: 'Magical five-tier castle for a 5th birthday celebration' },
  { id: 4, title: 'Autumn Harvest', category: 'Seasonal', image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&h=800&fit=crop&q=80', description: 'Warm spice cake with caramel apple filling and fondant leaves' },
  { id: 5, title: 'Classic Elegance', category: 'Wedding', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=800&fit=crop&q=80', description: 'Elegant monochrome design with gold leaf accents' },
  { id: 6, title: 'Under the Sea', category: 'Birthday', image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b9?w=800&h=800&fit=crop&q=80', description: 'Underwater wonderland with fondant sea creatures and coral' },
  { id: 7, title: 'Sakura Blossom', category: 'Seasonal', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=800&fit=crop&q=80', description: 'Delicate cherry blossom branches on blush fondant' },
  { id: 8, title: 'Rustic Charm', category: 'Wedding', image: 'https://images.unsplash.com/photo-1616541823927-0a01beb3d53c?w=800&h=800&fit=crop&q=80', description: 'Naked cake with fresh greenery and wildflowers' },
  { id: 9, title: 'Art Deco Glamour', category: 'Custom Design', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=800&fit=crop&q=80', description: 'Geometric patterns in gold and emerald' },
  { id: 10, title: 'Winter Wonderland', category: 'Seasonal', image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=800&h=800&fit=crop&q=80', description: 'Snowflake details with silver shimmer frosting' },
  { id: 11, title: 'Superhero Academy', category: 'Birthday', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=800&fit=crop&q=80', description: 'Bold comic-book style with fondant masks and emblems' },
  { id: 12, title: 'Bohemian Dreams', category: 'Custom Design', image: 'https://images.unsplash.com/photo-1486427944544-d2c246c4df14?w=800&h=800&fit=crop&q=80', description: 'Macramé-inspired piping with terracotta and sage tones' },
]

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedIndex, setSelectedIndex] = useState(null)

  const filtered = activeFilter === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeFilter)

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
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-rose/5 to-cream-dark" />
        <div className="absolute top-20 right-20 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-medium text-gold uppercase tracking-[0.2em] mb-4 block">
            Our Work
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-chocolate mb-6">
            Cake Gallery
          </h1>
          <p className="text-lg text-charcoal/60 max-w-2xl mx-auto">
            A visual feast of our finest creations. Each cake is a unique story
            brought to life through artistry and passion.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 sticky top-20 z-40 bg-cream/90 backdrop-blur-md border-b border-cream-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {galleryFilters.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === cat
                    ? 'bg-chocolate text-white shadow-md'
                    : 'bg-white text-charcoal/60 hover:text-chocolate hover:bg-cream-dark'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid - Masonry-like */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filtered.map((item, i) => (
              <FadeInSection key={item.id} delay={Math.min(i * 80, 400)}>
                <button
                  onClick={() => setSelectedIndex(galleryItems.indexOf(item))}
                  className="group relative block w-full break-inside-avoid overflow-hidden rounded-3xl"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    style={{ aspectRatio: i % 3 === 0 ? '3/4' : '1/1' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-chocolate/80 via-chocolate/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-6">
                    <div className="text-left">
                      <span className="text-[10px] uppercase tracking-wider text-gold font-medium">{item.category}</span>
                      <h3 className="font-display text-xl font-bold text-white mt-1">{item.title}</h3>
                    </div>
                  </div>
                </button>
              </FadeInSection>
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
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={galleryItems[selectedIndex].image}
                  alt={galleryItems[selectedIndex].title}
                  className="w-full h-80 sm:h-96 object-cover"
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
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="py-16 bg-white/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInSection>
            <h2 className="font-display text-3xl font-bold text-chocolate mb-4">
              Inspired by What You See?
            </h2>
            <p className="text-warm-gray mb-8 leading-relaxed">
              Every cake in our gallery started as an idea — just like yours.
              Let's collaborate to create something uniquely yours.
            </p>
            <a
              href="/custom-orders"
              className="inline-flex items-center gap-2 bg-chocolate text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-chocolate-light transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            >
              Start Your Custom Order
            </a>
          </FadeInSection>
        </div>
      </section>
    </>
  )
}
