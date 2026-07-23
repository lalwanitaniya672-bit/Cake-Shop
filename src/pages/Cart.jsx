import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Tag, User, Phone } from 'lucide-react'
import useCartStore from '../stores/cartStore'

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore()
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [showForm, setShowForm] = useState(false)
  const subtotal = getTotalPrice()
  const shipping = subtotal > 150 ? 0 : 15
  const total = subtotal + shipping

  const handleOrderConfirm = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      setShowForm(true)
      return
    }

    const productLines = items.map(item => {
      const customizations = Object.keys(item.customizations).length > 0
        ? Object.entries(item.customizations).map(([k, v]) => `${k}: ${v}`).join(', ')
        : 'Standard'
      return `${item.name} | ${customizations} | Qty: ${item.quantity} | ₹${item.price * item.quantity}`
    }).join('\n')

    const message = `Hello Superlicious Cakes,

I would like to place a custom cake order.

👤 Customer: ${customerName} | ${customerPhone}

🎂 Order Details:
${productLines}

📅 Date: As soon as possible | Qty: ${items.reduce((sum, item) => sum + item.quantity, 0)} items

📝 Note: No Special Instructions

💰 Price: ₹${total.toFixed(2)}

💳 Payment: COD

Please confirm my order. Thank You!`

    const whatsappUrl = `https://wa.me/918767438990?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    clearCart()
    setCustomerName('')
    setCustomerPhone('')
    setShowForm(false)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-cream-dark rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-warm-gray" />
          </div>
          <h1 className="font-display text-3xl font-bold text-chocolate mb-3">Your Cart is Empty</h1>
          <p className="text-warm-gray mb-8">
            Looks like you haven't added any cakes yet. Browse our collection to find your perfect treat.
          </p>
          <Link
            to="/collection"
            className="inline-flex items-center gap-2 bg-chocolate text-white px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-chocolate-light transition-all duration-300"
          >
            Browse Collection
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-chocolate">Your Cart</h1>
            <p className="text-warm-gray text-sm mt-1">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-warm-gray hover:text-rose transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.id}-${JSON.stringify(item.customizations)}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-card rounded-2xl p-4 sm:p-6 shadow-sm flex gap-4 sm:gap-6 border border-cream-dark/30"
                >
                  <Link to={`/cake/${item.id}`} className="flex-shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link to={`/cake/${item.id}`} className="font-display font-semibold text-chocolate hover:text-gold transition-colors">
                          {item.name}
                        </Link>
                        {Object.keys(item.customizations).length > 0 && (
                          <p className="text-xs text-warm-gray mt-1">
                            {Object.entries(item.customizations).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id, item.customizations)}
                        className="text-warm-gray hover:text-rose transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-cream-dark rounded-full">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.customizations)}
                          className="w-10 h-10 flex items-center justify-center text-chocolate hover:bg-cream-dark/50 rounded-l-full transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center text-sm font-semibold text-chocolate">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.customizations)}
                          className="w-10 h-10 flex items-center justify-center text-chocolate hover:bg-cream-dark/50 rounded-r-full transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="font-display font-semibold text-chocolate">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 shadow-sm sticky top-24 border border-cream-dark/30">
              <h2 className="font-display text-lg font-bold text-chocolate mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray">Subtotal</span>
                  <span className="text-chocolate font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray">Delivery</span>
                  <span className="text-chocolate font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₹${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-warm-gray">Free delivery on orders over ₹150</p>
                )}
              </div>

              <div className="border-t border-cream-dark pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-semibold text-chocolate">Total</span>
                  <span className="font-display text-xl font-bold text-chocolate">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="flex gap-2 mb-6">
                <div className="flex-1 relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                  <input
                    type="text"
                    placeholder="Promo code"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30"
                  />
                </div>
                <button className="px-4 py-2.5 rounded-xl border border-chocolate text-chocolate text-sm font-medium hover:bg-chocolate hover:text-white transition-all">
                  Apply
                </button>
              </div>

              {/* Customer Details Form */}
              {showForm && (
                <div className="mb-6 space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-cream-dark bg-cream/50 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30"
                    />
                  </div>
                </div>
              )}

              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="block w-full text-center bg-chocolate text-white py-3.5 rounded-full text-sm font-semibold hover:bg-chocolate-light transition-all duration-300 hover:shadow-xl"
                >
                  Order Confirm
                </button>
              ) : (
                <button
                  onClick={handleOrderConfirm}
                  disabled={!customerName.trim() || !customerPhone.trim()}
                  className="block w-full text-center bg-chocolate text-white py-3.5 rounded-full text-sm font-semibold hover:bg-chocolate-light transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Order Confirm via WhatsApp
                </button>
              )}

              <Link
                to="/collection"
                className="flex items-center justify-center gap-2 mt-4 text-sm text-warm-gray hover:text-chocolate transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
