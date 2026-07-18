import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Phone, Mail, Send, CheckCircle } from 'lucide-react'
import FadeInSection from '../components/FadeInSection'

const contactInfo = [
  { icon: MapPin, title: 'Visit Us', lines: ['42 Blossom Lane, Suite 100', 'Portland, OR 97205'] },
  { icon: Clock, title: 'Hours', lines: ['Mon–Fri: 8am – 7pm', 'Saturday: 9am – 5pm', 'Sunday: Closed'] },
  { icon: Phone, title: 'Call Us', lines: ['(503) 555-0184', 'For urgent inquiries'] },
  { icon: Mail, title: 'Email Us', lines: ['hello@thevelvetcrumb.com', 'We reply within 24 hours'] },
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true) }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-blush/20 to-cream-dark" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-rose/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-medium text-gold uppercase tracking-[0.2em] mb-4 block">
            Get in Touch
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-chocolate mb-6">
            We'd Love to Hear<br />From You
          </h1>
          <p className="text-lg text-charcoal/60 max-w-2xl mx-auto">
            Questions, ideas, or just want to say hello?
            We're here and happy to chat about your next sweet creation.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, i) => (
              <FadeInSection key={info.title} delay={i * 100}>
                <div className="bg-white rounded-3xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-500 h-full">
                  <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-chocolate mb-3">{info.title}</h3>
                  <div className="space-y-1">
                    {info.lines.map((line, j) => (
                      <p key={j} className="text-sm text-warm-gray">{line}</p>
                    ))}
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <FadeInSection>
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm">
                <h2 className="font-display text-2xl font-bold text-chocolate mb-2">Send Us a Message</h2>
                <p className="text-sm text-warm-gray mb-8">Fill out the form below and we'll get back to you shortly.</p>

                {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="font-display text-xl font-semibold text-chocolate mb-2">Message Sent!</h3>
                    <p className="text-warm-gray text-sm mb-6">We'll get back to you within 24 hours.</p>
                    <button onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }) }}
                      className="text-sm text-gold font-medium hover:text-gold-light transition-colors">
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs text-warm-gray mb-1.5">Name *</label>
                        <input name="name" value={formData.name} onChange={handleChange} required
                          className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                          placeholder="Your name" />
                      </div>
                      <div>
                        <label className="block text-xs text-warm-gray mb-1.5">Email *</label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} required
                          className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                          placeholder="you@email.com" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-warm-gray mb-1.5">Subject *</label>
                      <select name="subject" value={formData.subject} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all">
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="order">Order Question</option>
                        <option value="custom">Custom Cake Request</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-warm-gray mb-1.5">Message *</label>
                      <textarea name="message" value={formData.message} onChange={handleChange} required rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all resize-none"
                        placeholder="Tell us what's on your mind..." />
                    </div>
                    <button type="submit"
                      className="w-full bg-chocolate text-white py-4 rounded-full text-sm font-semibold hover:bg-chocolate-light transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </FadeInSection>

            {/* Google Map */}
            <FadeInSection delay={200}>
              <div className="h-full min-h-[400px] lg:min-h-0 rounded-3xl overflow-hidden shadow-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2795.8!2d-122.6784!3d45.5152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDMwJzU0LjciTiAxMjLCsDQwJzQyLjIiVw!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '400px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="The Velvet Crumb Location"
                  className="rounded-3xl"
                />
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Social + CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInSection>
            <h2 className="font-display text-3xl font-bold text-chocolate mb-4">
              Follow Our Sweet Journey
            </h2>
            <p className="text-warm-gray mb-8 leading-relaxed">
              Stay inspired with behind-the-scenes peeks, new cake reveals,
              and a daily dose of sugar on social media.
            </p>
            <div className="flex justify-center gap-4">
              {[
                { name: 'Instagram', icon: '📸', handle: '@thevelvetcrumb' },
                { name: 'Pinterest', icon: '📌', handle: '/thevelvetcrumb' },
                { name: 'Facebook', icon: '👥', handle: '/TheVelvetCrumb' },
              ].map((social) => (
                <a key={social.name} href="#" className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center min-w-[120px]">
                  <div className="text-2xl mb-2">{social.icon}</div>
                  <p className="text-sm font-semibold text-chocolate">{social.name}</p>
                  <p className="text-[10px] text-warm-gray mt-1">{social.handle}</p>
                </a>
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>
    </>
  )
}
