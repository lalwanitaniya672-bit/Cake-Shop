import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CreditCard, Lock, Check, ArrowLeft, MapPin, Truck } from 'lucide-react'
import useCartStore from '../stores/cartStore'
import useAuthStore from '../stores/authStore'

export default function Checkout() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.user_metadata?.full_name?.split(' ')[0] || '',
    lastName: user?.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    nameOnCard: '',
    specialInstructions: '',
    saveInfo: false,
  })

  const subtotal = getTotalPrice()
  const shipping = subtotal > 150 ? 0 : 15
  const total = subtotal + shipping

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setOrderPlaced(true)
    clearCart()
  }

  if (items.length === 0 && !orderPlaced) {
    navigate('/cart')
    return null
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl font-bold text-chocolate mb-3">Order Confirmed!</h1>
          <p className="text-warm-gray mb-2">
            Thank you for your order. We'll start crafting your cakes with care.
          </p>
          <p className="text-sm text-warm-gray mb-8">
            Order confirmation has been sent to <strong>{formData.email}</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/collection"
              className="inline-flex items-center justify-center gap-2 bg-chocolate text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-chocolate-light transition-all"
            >
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 border border-cream-dark text-chocolate px-8 py-3.5 rounded-full text-sm font-medium hover:bg-cream-dark/30 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-warm-gray hover:text-chocolate transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <h1 className="font-display text-3xl font-bold text-chocolate mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[
            { num: 1, label: 'Shipping', icon: MapPin },
            { num: 2, label: 'Payment', icon: CreditCard },
            { num: 3, label: 'Review', icon: Check },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center">
              <button
                onClick={() => s.num < step && setStep(s.num)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  step === s.num
                    ? 'bg-chocolate text-white'
                    : step > s.num
                    ? 'bg-green-100 text-green-700'
                    : 'bg-cream-dark text-warm-gray'
                }`}
              >
                {step > s.num ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <s.icon className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < 2 && <div className={`w-8 sm:w-16 h-0.5 mx-2 ${step > s.num ? 'bg-green-300' : 'bg-cream-dark'}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
                  <h2 className="font-display text-xl font-bold text-chocolate mb-6">Shipping Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-charcoal/70 mb-1.5">First Name *</label>
                      <input name="firstName" value={formData.firstName} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal/70 mb-1.5">Last Name *</label>
                      <input name="lastName" value={formData.lastName} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal/70 mb-1.5">Email *</label>
                      <input name="email" type="email" value={formData.email} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal/70 mb-1.5">Phone *</label>
                      <input name="phone" type="tel" value={formData.phone} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-charcoal/70 mb-1.5">Address *</label>
                      <input name="address" value={formData.address} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal/70 mb-1.5">City *</label>
                      <input name="city" value={formData.city} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-charcoal/70 mb-1.5">State *</label>
                        <input name="state" value={formData.state} onChange={handleChange} required
                          className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal/70 mb-1.5">ZIP *</label>
                        <input name="zip" value={formData.zip} onChange={handleChange} required
                          className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all" />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-charcoal/70 mb-1.5">Special Instructions</label>
                      <textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all resize-none"
                        placeholder="Delivery time preferences, gate code, etc." />
                    </div>
                  </div>
                  <button type="button" onClick={() => setStep(2)}
                    className="mt-6 w-full bg-chocolate text-white py-3.5 rounded-full text-sm font-semibold hover:bg-chocolate-light transition-all duration-300">
                    Continue to Payment
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-bold text-chocolate">Payment Details</h2>
                    <div className="flex items-center gap-1 text-xs text-warm-gray">
                      <Lock className="w-3 h-3" />
                      Secure
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-charcoal/70 mb-1.5">Card Number *</label>
                      <input name="cardNumber" value={formData.cardNumber} onChange={handleChange} required placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal/70 mb-1.5">Name on Card *</label>
                      <input name="nameOnCard" value={formData.nameOnCard} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-charcoal/70 mb-1.5">Expiry *</label>
                        <input name="expiry" value={formData.expiry} onChange={handleChange} required placeholder="MM/YY"
                          className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-charcoal/70 mb-1.5">CVV *</label>
                        <input name="cvv" value={formData.cvv} onChange={handleChange} required placeholder="123"
                          className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setStep(1)}
                      className="px-6 py-3.5 rounded-full border border-cream-dark text-sm font-medium text-chocolate hover:bg-cream-dark/30 transition-all">
                      Back
                    </button>
                    <button type="button" onClick={() => setStep(3)}
                      className="flex-1 bg-chocolate text-white py-3.5 rounded-full text-sm font-semibold hover:bg-chocolate-light transition-all duration-300">
                      Review Order
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm">
                  <h2 className="font-display text-xl font-bold text-chocolate mb-6">Review Your Order</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-cream/50">
                      <MapPin className="w-5 h-5 text-gold mt-0.5" />
                      <div>
                        <p className="font-medium text-chocolate text-sm">Shipping to</p>
                        <p className="text-sm text-warm-gray">
                          {formData.firstName} {formData.lastName}<br />
                          {formData.address}<br />
                          {formData.city}, {formData.state} {formData.zip}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-cream/50">
                      <CreditCard className="w-5 h-5 text-gold mt-0.5" />
                      <div>
                        <p className="font-medium text-chocolate text-sm">Payment</p>
                        <p className="text-sm text-warm-gray">•••• •••• •••• {formData.cardNumber.slice(-4)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-cream/50">
                      <Truck className="w-5 h-5 text-gold mt-0.5" />
                      <div>
                        <p className="font-medium text-chocolate text-sm">Delivery</p>
                        <p className="text-sm text-warm-gray">Estimated 3-5 business days</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)}
                      className="px-6 py-3.5 rounded-full border border-cream-dark text-sm font-medium text-chocolate hover:bg-cream-dark/30 transition-all">
                      Back
                    </button>
                    <button type="submit"
                      className="flex-1 bg-green-600 text-white py-3.5 rounded-full text-sm font-semibold hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4" />
                      Place Order — ${total.toFixed(2)}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h3 className="font-display font-bold text-chocolate mb-4">Your Order</h3>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-chocolate truncate">{item.name}</p>
                        <p className="text-xs text-warm-gray">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-chocolate">${item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-cream-dark pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-warm-gray">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-warm-gray">Delivery</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-chocolate pt-2 border-t border-cream-dark">
                    <span>Total</span>
                    <span className="font-display">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
