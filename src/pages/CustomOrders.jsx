import { useState, useMemo } from 'react'
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

const cakeTypes = [
  'Birthday Cake', 'Anniversary Cake', 'Wedding Cake', 'Engagement Cake',
  'Baby Shower Cake', 'Graduation Cake', 'Corporate Cake', 'Photo Cake',
  'Theme Cake', 'Cartoon Cake', 'Eggless Cake', 'Custom Cake'
]

const occasions = [
  'Birthday', 'Anniversary', 'Wedding', 'Baby Shower', 'Engagement',
  'Graduation', 'Farewell', 'Housewarming', 'Valentines Day',
  'Mothers Day', 'Fathers Day', 'Christmas', 'New Year', 'Custom Theme'
]

const sizes = [
  { label: '0.5 KG', value: '0.5', price: 400 },
  { label: '1 KG', value: '1', price: 700 },
  { label: '1.5 KG', value: '1.5', price: 1000 },
  { label: '2 KG', value: '2', price: 1300 },
  { label: '2.5 KG', value: '2.5', price: 1600 },
  { label: '3 KG', value: '3', price: 1900 },
  { label: '4 KG', value: '4', price: 2500 },
  { label: '5 KG', value: '5', price: 3200 },
  { label: 'Custom Weight', value: 'custom', price: 0 },
]

const flavors = [
  { label: 'Chocolate', value: 'chocolate', surcharge: 0 },
  { label: 'Vanilla', value: 'vanilla', surcharge: 0 },
  { label: 'Black Forest', value: 'black-forest', surcharge: 50 },
  { label: 'White Forest', value: 'white-forest', surcharge: 50 },
  { label: 'Butterscotch', value: 'butterscotch', surcharge: 50 },
  { label: 'Pineapple', value: 'pineapple', surcharge: 50 },
  { label: 'Strawberry', value: 'strawberry', surcharge: 70 },
  { label: 'Blueberry', value: 'blueberry', surcharge: 80 },
  { label: 'Coffee', value: 'coffee', surcharge: 80 },
  { label: 'Red Velvet', value: 'red-velvet', surcharge: 120 },
  { label: 'KitKat', value: 'kitkat', surcharge: 150 },
  { label: 'Oreo', value: 'oreo', surcharge: 150 },
  { label: 'Ferrero Rocher', value: 'ferrero-rocher', surcharge: 250 },
  { label: 'Rasmalai', value: 'rasmalai', surcharge: 250 },
  { label: 'Fruit Cake', value: 'fruit-cake', surcharge: 100 },
  { label: 'Mixed Fruit', value: 'mixed-fruit', surcharge: 120 },
  { label: 'Custom Flavor', value: 'custom-flavor', surcharge: 300 },
]

const designs = [
  { label: 'Minimal', value: 'minimal', surcharge: 0 },
  { label: 'Floral', value: 'floral', surcharge: 0 },
  { label: 'Cartoon', value: 'cartoon', surcharge: 0 },
  { label: 'Buttercream', value: 'buttercream', surcharge: 0 },
  { label: 'Drip Cake', value: 'drip-cake', surcharge: 0 },
  { label: 'Bento Cake', value: 'bento-cake', surcharge: 0 },
  { label: 'Heart Shape', value: 'heart-shape', surcharge: 0 },
  { label: 'Photo Cake', value: 'photo-cake', surcharge: 200 },
  { label: 'Fondant', value: 'fondant', surcharge: 500 },
  { label: '2 Tier', value: '2-tier', surcharge: 800 },
  { label: '3 Tier', value: '3-tier', surcharge: 1500 },
  { label: 'Pinata Cake', value: 'pinata-cake', surcharge: 300 },
  { label: 'Number Cake', value: 'number-cake', surcharge: 250 },
  { label: 'Pull Me Up Cake', value: 'pull-me-up', surcharge: 350 },
  { label: 'Vintage Cake', value: 'vintage', surcharge: 400 },
  { label: 'Custom Design', value: 'custom-design', surcharge: 600 },
]

const cakeQuantities = [
  { label: '1 Cake', value: '1' },
  { label: '2 Cakes', value: '2' },
  { label: '3 Cakes', value: '3' },
  { label: '4 Cakes', value: '4' },
  { label: '5 Cakes', value: '5' },
  { label: 'Custom Quantity', value: 'custom' },
]

export default function CustomOrders() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', cakeType: '', occasion: '', date: '',
    size: '', flavor: '', design: '', quantity: '1', customQuantity: '', details: '',
  })

  const priceBreakdown = useMemo(() => {
    let basePrice = 0
    let flavorCharge = 0
    let designCharge = 0

    const sizeOption = sizes.find(s => s.value === formData.size)
    const flavorOption = flavors.find(f => f.value === formData.flavor)
    const designOption = designs.find(d => d.value === formData.design)

    if (sizeOption) basePrice = sizeOption.price
    if (flavorOption) flavorCharge = flavorOption.surcharge
    if (designOption) designCharge = designOption.surcharge

    const perCakePrice = basePrice + flavorCharge + designCharge
    const numCakes = formData.quantity === 'custom' ? (parseInt(formData.customQuantity) || 1) : parseInt(formData.quantity) || 1
    const total = perCakePrice * numCakes

    return { basePrice, flavorCharge, designCharge, perCakePrice, numCakes, total }
  }, [formData.size, formData.flavor, formData.design, formData.quantity, formData.customQuantity])

  const isFormValid = useMemo(() => {
    const hasQuantity = formData.quantity !== 'custom' || (formData.quantity === 'custom' && formData.customQuantity)
    return formData.name && formData.phone && formData.email && formData.cakeType && formData.date && formData.size && formData.flavor && formData.design && hasQuantity
  }, [formData.name, formData.phone, formData.email, formData.cakeType, formData.date, formData.size, formData.flavor, formData.design, formData.quantity, formData.customQuantity])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isFormValid) return

    const sizeLabel = sizes.find(s => s.value === formData.size)?.label || formData.size
    const numCakes = formData.quantity === 'custom' ? (parseInt(formData.customQuantity) || 1) : parseInt(formData.quantity) || 1
    const flavorLabel = flavors.find(f => f.value === formData.flavor)?.label || formData.flavor
    const designLabel = designs.find(d => d.value === formData.design)?.label || formData.design

    const message = `Hello Superlicious Cakes,

I would like to place a custom cake order.

👤 Customer: ${formData.name} | ${formData.phone}

🎂 Order Details:
${formData.cakeType} | ${sizeLabel} | ${flavorLabel} | ${designLabel}

📅 Date: ${formData.date} | Qty: ${numCakes}

📝 Note: ${formData.details || 'No Special Instructions'}

💰 Price: ₹${priceBreakdown.total}

💳 Payment: COD

Please confirm my order. Thank You!`

    const whatsappUrl = `https://wa.me/918767438990?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')

    setSubmitted(true)
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8F2] via-[#F8EBDD] to-[#F3E3D3]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#E8C79A]/8 rounded-full blur-3xl" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-medium text-gold uppercase tracking-[0.2em] mb-4 block">
            Made for You
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-chocolate mb-6">
            Custom Cake Orders
          </h1>
          <p className="text-lg text-charcoal/60 max-w-2xl mx-auto">
            Tell us about your dream cake and we'll bring it to life.
            Every order is a unique collaboration between you and our artisans.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">

            {/* Connecting Line - Desktop Only */}
            <div className="hidden lg:block absolute top-[72px] left-[calc(16.67%+40px)] right-[calc(16.67%+40px)] h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

            {[
              {
                num: '01',
                title: 'Tell Us Everything',
                desc: 'Fill out the form below with your vision, preferences, and any inspiration you have.',
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="url(#goldGradient1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <defs>
                      <linearGradient id="goldGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#D4B06A" />
                        <stop offset="100%" stopColor="#C9A96E" />
                      </linearGradient>
                    </defs>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                ),
              },
              {
                num: '02',
                title: 'We Design Together',
                desc: 'Our team will reach out within 24 hours to refine your design and provide a detailed quote.',
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="url(#goldGradient2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <defs>
                      <linearGradient id="goldGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#D4B06A" />
                        <stop offset="100%" stopColor="#C9A96E" />
                      </linearGradient>
                    </defs>
                    <circle cx="13.5" cy="6.5" r="2.5" />
                    <circle cx="17.5" cy="10.5" r="2.5" />
                    <circle cx="8.5" cy="7.5" r="2.5" />
                    <circle cx="6.5" cy="12.5" r="2.5" />
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                  </svg>
                ),
              },
              {
                num: '03',
                title: 'Enjoy Every Bite',
                desc: 'We craft, deliver, and set up your masterpiece. All you need to do is celebrate!',
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="url(#goldGradient3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <defs>
                      <linearGradient id="goldGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#D4B06A" />
                        <stop offset="100%" stopColor="#C9A96E" />
                      </linearGradient>
                    </defs>
                    <path d="M5.8 11.3L2 22l10.7-3.79" />
                    <path d="M4 3h.01" />
                    <path d="M22 8h.01" />
                    <path d="M15 2h.01" />
                    <path d="M22 20h.01" />
                    <path d="M22 2L12 12" />
                    <path d="M9.5 11.5L2 22l10.7-3.79" />
                  </svg>
                ),
              },
            ].map((step, i) => (
              <FadeInSection key={step.num} delay={i * 150}>
                <div className="group relative rounded-3xl p-8 sm:p-10 text-center border border-white/10 shadow-lg transition-all duration-[0.4s] ease-out hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02] cursor-default" style={{ backgroundColor: '#523632' }}>
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white border-2 border-gold/30 flex items-center justify-center shadow-md">
                    <span className="font-display text-xs font-bold text-[#D4B06A]">{step.num}</span>
                  </div>

                  {/* Icon Container */}
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 transition-all duration-[0.4s] animate-[pulse_2s_ease-in-out_1]" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                    {step.icon}
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-4">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-[280px] mx-auto">
                    {step.desc}
                  </p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8F2] via-[#F8EBDD] to-[#F3E3D3]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-[#E8C79A]/8 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <FadeInSection>
              <div className="bg-card rounded-3xl p-8 sm:p-12 shadow-sm text-center border border-cream-dark/30">
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
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', cakeType: '', occasion: '', date: '', size: '', flavor: '', design: '', quantity: '1', customQuantity: '', details: '' }) }}
                  className="bg-cream hover:bg-cream-dark text-chocolate px-6 py-3 rounded-full text-sm font-medium transition-all duration-300"
                >
                  Submit Another Order
                </button>
              </div>
            </FadeInSection>
          ) : (
            <FadeInSection>
              <form onSubmit={handleSubmit} className="bg-card rounded-3xl p-8 sm:p-12 shadow-sm border border-cream-dark/30">
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
                      <label className="block text-xs text-warm-gray mb-1.5">Phone Number *</label>
                      <input name="phone" type="tel" value={formData.phone} onChange={handleChange} required
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
                      <select name="occasion" value={formData.occasion} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all">
                        <option value="">Select occasion</option>
                        {occasions.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-warm-gray mb-1.5">Event Date *</label>
                      <input name="date" type="date" value={formData.date} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs text-warm-gray mb-1.5">Cake Size (KG) *</label>
                      <select name="size" value={formData.size} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all">
                        <option value="">Select size</option>
                        {sizes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-warm-gray mb-1.5">Flavor Preference *</label>
                      <select name="flavor" value={formData.flavor} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all">
                        <option value="">Choose a flavor</option>
                        {flavors.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-warm-gray mb-1.5">Design Style *</label>
                      <select name="design" value={formData.design} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all">
                        <option value="">Select design</option>
                        {designs.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-warm-gray mb-1.5">Number of Cakes *</label>
                      <select name="quantity" value={formData.quantity} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all">
                        {cakeQuantities.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}
                      </select>
                    </div>
                    {formData.quantity === 'custom' && (
                      <div>
                        <label className="block text-xs text-warm-gray mb-1.5">Custom Quantity *</label>
                        <input name="customQuantity" type="number" min="1" max="100" value={formData.customQuantity} onChange={handleChange} required
                          className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all" placeholder="Enter number of cakes" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Estimation */}
                {priceBreakdown.total > 0 && (
                  <div className="mb-10 bg-gradient-to-r from-gold/10 to-rose/10 rounded-2xl p-6 border border-gold/20">
                    <h3 className="text-xs font-semibold text-chocolate uppercase tracking-wider mb-4">Estimated Price</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-warm-gray">Base Price ({formData.size ? sizes.find(s => s.value === formData.size)?.label : ''})</span>
                        <span className="text-charcoal font-medium">₹{priceBreakdown.basePrice}</span>
                      </div>
                      {priceBreakdown.flavorCharge > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-warm-gray">Flavor Extra</span>
                          <span className="text-charcoal font-medium">+₹{priceBreakdown.flavorCharge}</span>
                        </div>
                      )}
                      {priceBreakdown.designCharge > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-warm-gray">Design Style</span>
                          <span className="text-charcoal font-medium">+₹{priceBreakdown.designCharge}</span>
                        </div>
                      )}
                      {priceBreakdown.numCakes > 1 && (
                        <>
                          <div className="border-t border-gold/10 pt-2 mt-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-warm-gray">Price per Cake</span>
                              <span className="text-charcoal font-medium">₹{priceBreakdown.perCakePrice}</span>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-warm-gray">Number of Cakes</span>
                            <span className="text-charcoal font-medium">× {priceBreakdown.numCakes}</span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="border-t border-gold/20 pt-3 flex justify-between items-center">
                      <span className="text-sm font-semibold text-chocolate">Total Estimated Price</span>
                      <span className="font-display text-3xl font-bold text-[#D4B06A]">₹{priceBreakdown.total}</span>
                    </div>
                    <p className="text-[10px] text-warm-gray mt-3">Final price may vary based on customization details.</p>
                  </div>
                )}

                {/* Design Vision */}
                <div className="mb-10">
                  <h3 className="text-sm font-semibold text-chocolate uppercase tracking-wider mb-4">Your Vision</h3>
                  <div>
                    <label className="block text-xs text-warm-gray mb-1.5">Design Description</label>
                    <textarea name="designDesc" value={formData.designDesc || ''} onChange={handleChange} rows={3}
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
                  disabled={!isFormValid}
                  className="w-full bg-chocolate text-white py-4 rounded-full text-sm font-semibold hover:bg-chocolate-light transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Order Confirm
                </button>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="text-xs text-warm-gray">Payment Method:</span>
                  <span className="text-xs font-semibold text-chocolate bg-cream-dark px-3 py-1 rounded-full">Cash on Delivery (COD)</span>
                </div>
                <p className="text-xs text-warm-gray text-center mt-2">
                  {isFormValid ? 'Click to confirm your order via WhatsApp' : 'Please fill all required fields'}
                </p>
              </form>
            </FadeInSection>
          )}
        </div>
      </section>
    </>
  )
}
