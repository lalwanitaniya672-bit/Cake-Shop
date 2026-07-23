import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import FadeInSection from '../components/FadeInSection'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error: insertError } = await supabase.from('contact_messages').insert([{
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
      }])
      if (insertError) throw insertError
      setSubmitted(true)
    } catch (err) {
      console.error('Submit error:', err)
      setError('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 overflow-hidden" style={{ backgroundColor: '#523632' }}>
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-medium text-gold uppercase tracking-[0.2em] mb-4 block">Get in Touch</span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            We'd Love to Hear
            <span className="block">From You</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Questions, ideas, or just want to say hello?
            We're here and happy to chat about your next sweet creation.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInSection>
              <div className="bg-card rounded-3xl p-8 sm:p-10 shadow-sm border border-cream-dark/30">
                <h2 className="font-display text-2xl font-bold text-chocolate mb-2">Send Us a Message</h2>
                <p className="text-sm text-warm-gray mb-8">Fill out the form below and we'll get back to you shortly.</p>

                {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h3 className="font-display text-xl font-semibold text-chocolate mb-2">Message Sent!</h3>
                    <p className="text-warm-gray text-sm mb-6">We'll get back to you within 24 hours.</p>
                    <button onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }) }}
                      className="text-sm text-gold font-medium hover:text-gold-light transition-colors">
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">
                        {error}
                      </div>
                    )}
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
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs text-warm-gray mb-1.5">Phone</label>
                        <input name="phone" type="tel" value={formData.phone} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
                          placeholder="+91 12345 67890" />
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
                    </div>
                    <div>
                      <label className="block text-xs text-warm-gray mb-1.5">Message *</label>
                      <textarea name="message" value={formData.message} onChange={handleChange} required rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all resize-none"
                        placeholder="Tell us what's on your mind..." />
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full bg-chocolate text-white py-4 rounded-full text-sm font-semibold hover:bg-chocolate-light transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                      <Send className="w-4 h-4" />
                      {loading ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </FadeInSection>
        </div>
      </section>
    </>
  )
}
