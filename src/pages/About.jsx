import { Link } from 'react-router-dom'
import FadeInSection from '../components/FadeInSection'

const values = [
  { icon: '🌾', title: 'Locally Sourced', desc: 'We partner with local farms for our butter, eggs, and seasonal fruits — freshness you can taste.' },
  { icon: '🎨', title: 'Artisan Crafted', desc: 'Every decoration is hand-piped, hand-placed, and hand-finished by our skilled cake artists.' },
  { icon: '💚', title: 'Conscious Baking', desc: 'We minimize waste, compost our kitchen scraps, and use recyclable packaging wherever possible.' },
  { icon: '✨', title: 'No Shortcuts', desc: 'We never use artificial preservatives, pre-made mixes, or frozen fillings. Ever.' },
]

const timeline = [
  { year: '2018', title: 'A Kitchen Dream', desc: 'Started baking from a tiny home kitchen with a passion for creating beauty through cake.' },
  { year: '2019', title: 'First Bakery Door', desc: 'Opened our small storefront on Blossom Lane with just two display cases and a dream.' },
  { year: '2021', title: 'Wedding Season Breakout', desc: 'Became the go-to boutique bakery for weddings across the region.' },
  { year: '2023', title: 'The Studio Expansion', desc: 'Expanded to a full production studio with a team of five talented bakers.' },
  { year: '2025', title: 'Still Growing', desc: 'Now serving hundreds of celebrations each year while keeping our boutique, personal touch.' },
]

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-blush/20 to-cream-dark" />
        <div className="absolute top-20 left-10 w-80 h-80 bg-rose/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-medium text-gold uppercase tracking-[0.2em] mb-4 block">Our Story</span>
            <h1 className="font-display text-5xl sm:text-6xl font-bold text-chocolate mb-6">
              Baked with Passion,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-dark to-gold">
                Served with Love
              </span>
            </h1>
            <p className="text-lg text-charcoal/60 leading-relaxed">
              The Velvet Crumb was born from a simple belief: that cake should be more than dessert —
              it should be the centerpiece of your most cherished moments.
            </p>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeInSection>
              <div className="relative">
                <div className="rounded-3xl overflow-hidden aspect-[4/5]">
                  <img
                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=750&fit=crop&q=80"
                    alt="Our founder in the kitchen"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl max-w-xs hidden sm:block">
                  <p className="font-display text-chocolate italic text-sm">
                    &ldquo;Cake is edible art. Every creation should make someone pause, smile, and feel truly special.&rdquo;
                  </p>
                  <p className="text-gold font-semibold text-sm mt-3">— Amara Osei, Founder</p>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={200}>
              <div>
                <span className="text-xs font-medium text-gold uppercase tracking-[0.2em] mb-4 block">Meet the Baker</span>
                <h2 className="font-display text-4xl font-bold text-chocolate mb-6">
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
                    Today, The Velvet Crumb is that vision realized — a place where premium
                    ingredients meet boundless creativity, and where every client becomes part
                    of our extended family.
                  </p>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-16">
            <span className="text-xs font-medium text-gold uppercase tracking-[0.2em] mb-4 block">What We Stand For</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-chocolate">Our Values</h2>
          </FadeInSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <FadeInSection key={v.title} delay={i * 100}>
                <div className="bg-cream rounded-3xl p-8 text-center hover:bg-white hover:shadow-lg transition-all duration-500 h-full">
                  <div className="text-4xl mb-6">{v.icon}</div>
                  <h3 className="font-display text-lg font-semibold text-chocolate mb-3">{v.title}</h3>
                  <p className="text-sm text-warm-gray leading-relaxed">{v.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Studio Gallery */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-16">
            <span className="text-xs font-medium text-gold uppercase tracking-[0.2em] mb-4 block">Behind the Scenes</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-chocolate">Inside Our Studio</h2>
          </FadeInSection>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop&q=80',
              'https://images.unsplash.com/photo-1486427944544-d2c246c4df14?w=400&h=300&fit=crop&q=80',
              'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop&q=80',
              'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=400&h=300&fit=crop&q=80',
            ].map((src, i) => (
              <FadeInSection key={i} delay={i * 100}>
                <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                  <img src={src} alt="Studio" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" loading="lazy" />
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-16">
            <span className="text-xs font-medium text-gold uppercase tracking-[0.2em] mb-4 block">Our Journey</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-chocolate">Sweet Milestones</h2>
          </FadeInSection>

          <div className="max-w-3xl mx-auto">
            {timeline.map((t, i) => (
              <FadeInSection key={t.year} delay={i * 100}>
                <div className={`flex gap-8 mb-12 ${i % 2 === 0 ? '' : 'flex-row-reverse text-right'}`}>
                  <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-rose/20 to-gold/20 flex items-center justify-center">
                    <span className="font-display text-lg font-bold text-chocolate">{t.year}</span>
                  </div>
                  <div className="pt-3">
                    <h3 className="font-display text-xl font-semibold text-chocolate mb-2">{t.title}</h3>
                    <p className="text-sm text-warm-gray leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="bg-gradient-to-br from-chocolate to-chocolate-light rounded-[2rem] p-12 sm:p-16 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
              <div className="relative">
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
                  Let's Create Together
                </h2>
                <p className="text-white/60 max-w-xl mx-auto mb-10 text-lg">
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
