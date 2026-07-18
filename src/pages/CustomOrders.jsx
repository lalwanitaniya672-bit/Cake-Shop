import { useState } from 'react'
import { useInView } from '../hooks/useInView'

function FadeInSection({ children, className = '', delay = 0 }) {
  const [ref, isInView] = useInView()
  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

const cakeTypes = ['Wedding Cake', 'Birthday Cake', 'Anniversary Cake', 'Baby Shower Cake', 'Graduation Cake', 'Corporate Event', 'Dessert Table', 'Other']
const sizes = ['Small (10-15 servings)', 'Medium (20-30 servings)', 'Large (40-50 servings)', 'Grand (60+ servings)', 'Not sure yet']
const flavors = ['Classic Vanilla', 'Rich Chocolate', 'Red Velvet', 'Lemon Zest', 'Carrot Spice', 'Pistachio', 'Strawberry', 'Coconut', 'Salted Caramel', 'Other (specify below)']
const budgetRanges = ['Under $150', '$150–$250', '$250–$400', '$400–$600', '$600+', 'Flexible']

export default function CustomOrders() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', cakeType: '', occasion: '', date: '',
    size: '', flavor: '', design: '', budget: '', details: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-gold/5 to-cream-dark" />
        <div className="absolute top-20 left-10 w-80 h-80 bg-rose/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-medium text-gold uppercase tracking-[0.2em] mb-4 block">
            Made for You
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-chocolate mb-6">
            Custom Cake Orders
          </h1>
          <p className="text-lg text-charcoal/60 max-w-2xl mx-auto">
            Tell us about your dream cake and we'll bring it to life.
            Every order is a unique collaboration between you and our artisans.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { num: '1', title: 'Tell Us Everything', desc: 'Fill out the form below with your vision, preferences, and any inspiration you have.', icon: '📝' },
              { num: '2', title: 'We Design Together', desc: "Our team will reach out within 24 hours to refine your design and provide a detailed quote.", icon: '🎨' },
              { num: '3', title: 'Enjoy Every Bite', desc: 'We craft, deliver, and set up your masterpiece. All you need to do is celebrate!', icon: '🎉' },
            ].map((step, i) => (
              <FadeInSection key={step.num} delay={i * 150}>
                <div className="text-center p-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose/15 to-gold/15 flex items-center justify-center mx-auto mb-5 text-2xl">
                    {step.icon}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-chocolate mb-2">{step.title}</h3>
                  <p className="text-sm text-warm-gray leading-relaxed">{step.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <FadeInSection>
              <div className="bg-white rounded-3xl p-12 shadow-sm text-center">
                <div className="text-6xl mb-6">💌</div>
                <h2 className="font-display text-3xl font-bold text-chocolate mb-4">
                  Thank You, {formData.name || 'Friend'}!
                </h2>
                <p className="text-warm-gray leading-relaxed max-w-md mx-auto mb-8">
                  We've received your order request and will be in touch within 24 hours
                  to discuss your cake in detail. In the meantime, feel free to browse
                  our collection for more inspiration.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', cakeType: '', occasion: '', date: '', size: '', flavor: '', design: '', budget: '', details: '' }) }}
                  className="bg-cream hover:bg-cream-dark text-chocolate px-6 py-3 rounded-full text-sm font-medium transition-all duration-300"
                >
                  Submit Another Order
                </button>
              </div>
            </FadeInSection>
          ) : (
            <FadeInSection>
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm">
                <h2 className="font-display text-2xl font-bold text-chocolate mb-8">
                  Tell Us About Your Dream Cake
                </h2>

                {/* Contact Info */}
                <div className="mb-10">
                  <h3 className="text-sm font-semibold text-chocolate uppercase tracking-wider mb-4">Your Details</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-warm-gray mb-1.5">Full Name *</label>
                      <input name="name" value={formData.name} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-xs text-warm-gray mb-1.5">Email *</label>
                      <input name="email" type="email" value={formData.email} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all" placeholder="you@email.com" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-warm-gray mb-1.5">Phone Number</label>
                      <input name="phone" type="tel" value={formData.phone} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all" placeholder="(555) 123-4567" />
                    </div>
                  </div>
                </div>

                {/* Cake Details */}
                <div className="mb-10">
                  <h3 className="text-sm font-semibold text-chocolate uppercase tracking-wider mb-4">Cake Details</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-warm-gray mb-1.5">Cake Type *</label>
                      <select name="cakeType" value={formData.cakeType} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all">
                        <option value="">Select a type</option>
                        {cakeTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-warm-gray mb-1.5">Occasion / Theme</label>
                      <input name="occasion" value={formData.occasion} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all" placeholder="e.g., Enchanted Garden" />
                    </div>
                    <div>
                      <label className="block text-xs text-warm-gray mb-1.5">Event Date *</label>
                      <input name="date" type="date" value={formData.date} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs text-warm-gray mb-1.5">Size *</label>
                      <select name="size" value={formData.size} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all">
                        <option value="">Select a size</option>
                        {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-warm-gray mb-1.5">Flavor Preference *</label>
                      <select name="flavor" value={formData.flavor} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all">
                        <option value="">Choose a flavor</option>
                        {flavors.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-warm-gray mb-1.5">Budget Range</label>
                      <select name="budget" value={formData.budget} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all">
                        <option value="">Select range</option>
                        {budgetRanges.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Design Vision */}
                <div className="mb-10">
                  <h3 className="text-sm font-semibold text-chocolate uppercase tracking-wider mb-4">Your Vision</h3>
                  <div>
                    <label className="block text-xs text-warm-gray mb-1.5">Design Inspiration</label>
                    <textarea name="design" value={formData.design} onChange={handleChange} rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all resize-none"
                      placeholder="Describe colors, style, decorations, or share Pinterest/Instagram links..." />
                  </div>
                  <div className="mt-4">
                    <label className="block text-xs text-warm-gray mb-1.5">Anything Else?</label>
                    <textarea name="details" value={formData.details} onChange={handleChange} rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all resize-none"
                      placeholder="Dietary restrictions, allergens, special requests..." />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-chocolate text-white py-4 rounded-full text-sm font-semibold hover:bg-chocolate-light transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                >
                  Submit Order Request
                </button>
                <p className="text-xs text-warm-gray text-center mt-4">
                  We'll respond within 24 hours. No payment required until design is approved.
                </p>
              </form>
            </FadeInSection>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-chocolate">
              Common Questions
            </h2>
          </FadeInSection>

          <div className="space-y-4">
            {[
              { q: 'How far in advance should I order?', a: 'We recommend ordering at least 2 weeks in advance for standard cakes, and 4-6 weeks for wedding cakes. Rush orders may be available for an additional fee.' },
              { q: 'Do you offer tastings?', a: 'Yes! We offer complimentary tastings for wedding cake orders. For other celebrations, we offer tasting boxes for $30 (credited toward your final order).' },
              { q: 'Can you accommodate dietary restrictions?', a: 'Absolutely. We offer gluten-free, dairy-free, vegan, and nut-free options. Just let us know your needs when placing your order.' },
              { q: 'Do you deliver?', a: 'Yes, we deliver within a 30-mile radius. Delivery and setup fees vary by distance and cake complexity. We also offer pickup from our studio.' },
              { q: 'What if I need to change my order?', a: 'Design changes can be made up to 7 days before your event. Date changes are subject to availability. Contact us as soon as possible.' },
            ].map((faq, i) => (
              <FadeInSection key={faq.q} delay={i * 100}>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h4 className="font-display font-semibold text-chocolate mb-2">{faq.q}</h4>
                  <p className="text-sm text-warm-gray leading-relaxed">{faq.a}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
