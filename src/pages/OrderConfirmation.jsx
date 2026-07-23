import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function OrderConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const orderData = location.state

  useEffect(() => {
    if (!orderData) {
      navigate('/custom-orders')
    }
  }, [orderData, navigate])

  if (!orderData) return null

  // Calculate estimated delivery (7 days from now)
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 7)
  const formattedDelivery = deliveryDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8F2] via-[#F8EBDD] to-[#F3E3D3]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#E8C79A]/8 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl mb-6">🎉</div>
            <span className="text-xs font-medium text-gold uppercase tracking-[0.2em] mb-4 block">
              Payment Successful
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-chocolate mb-6">
              Thank You for Your Order!
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Confirmation Content */}
      <section className="py-12 sm:py-16 bg-white/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-3xl p-6 sm:p-10 shadow-sm border border-cream-dark/30"
          >
            {/* Order ID */}
            <div className="text-center mb-8 pb-8 border-b border-cream-dark/30">
              <p className="text-xs text-warm-gray uppercase tracking-wider mb-2">Order ID</p>
              <p className="font-display text-2xl sm:text-3xl font-bold text-chocolate">{orderData.orderId}</p>
              {orderData.paymentId && (
                <p className="text-xs text-warm-gray mt-2">Payment ID: {orderData.paymentId}</p>
              )}
            </div>

            {/* Customer Details */}
            <div className="mb-8 pb-8 border-b border-cream-dark/30">
              <h3 className="text-xs font-semibold text-gold uppercase tracking-wider mb-4">Customer Details</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-warm-gray mb-1">Name</p>
                  <p className="text-charcoal font-medium">{orderData.name}</p>
                </div>
                <div>
                  <p className="text-warm-gray mb-1">Phone</p>
                  <p className="text-charcoal font-medium">{orderData.phone}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-warm-gray mb-1">Email</p>
                  <p className="text-charcoal font-medium">{orderData.email}</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mb-8 pb-8 border-b border-cream-dark/30">
              <h3 className="text-xs font-semibold text-gold uppercase tracking-wider mb-4">Order Summary</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-warm-gray mb-1">Cake Type</p>
                  <p className="text-charcoal font-medium">{orderData.cakeType}</p>
                </div>
                {orderData.occasion && (
                  <div>
                    <p className="text-warm-gray mb-1">Occasion</p>
                    <p className="text-charcoal font-medium">{orderData.occasion}</p>
                  </div>
                )}
                <div>
                  <p className="text-warm-gray mb-1">Event Date</p>
                  <p className="text-charcoal font-medium">{orderData.eventDate}</p>
                </div>
                <div>
                  <p className="text-warm-gray mb-1">Cake Size</p>
                  <p className="text-charcoal font-medium">{orderData.cakeSize}</p>
                </div>
                <div>
                  <p className="text-warm-gray mb-1">Number of Cakes</p>
                  <p className="text-charcoal font-medium">{orderData.numberOfCakes}</p>
                </div>
                <div>
                  <p className="text-warm-gray mb-1">Flavor</p>
                  <p className="text-charcoal font-medium">{orderData.flavor}</p>
                </div>
                <div>
                  <p className="text-warm-gray mb-1">Design Style</p>
                  <p className="text-charcoal font-medium">{orderData.designStyle}</p>
                </div>
                {orderData.specialInstructions && (
                  <div className="sm:col-span-2">
                    <p className="text-warm-gray mb-1">Special Instructions</p>
                    <p className="text-charcoal font-medium">{orderData.specialInstructions}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Total & Delivery */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="text-center sm:text-left">
                <p className="text-xs text-warm-gray uppercase tracking-wider mb-1">Estimated Delivery</p>
                <p className="font-display text-lg font-semibold text-chocolate">{formattedDelivery}</p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-xs text-warm-gray uppercase tracking-wider mb-1">Total Paid</p>
                <p className="font-display text-3xl font-bold text-[#D4B06A]">₹{orderData.totalAmount}</p>
              </div>
            </div>
          </motion.div>

          {/* Thank You Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-warm-gray mb-8 max-w-md mx-auto">
              We've received your order and will begin crafting your masterpiece.
              You'll receive updates via email and phone.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/collection"
                className="inline-flex items-center justify-center gap-2 bg-chocolate text-white px-8 py-4 rounded-full text-sm font-semibold hover:bg-chocolate-light transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                Continue Shopping
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 border-2 border-chocolate/20 text-chocolate px-8 py-4 rounded-full text-sm font-medium hover:border-chocolate/40 hover:bg-chocolate/5 transition-all duration-300"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
