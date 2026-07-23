import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { initiatePayment, isRazorpayConfigured } from '../services/razorpayService'
import { saveOrder, generateOrderId, isSupabaseConfigured } from '../services/supabaseService'

export default function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  const orderData = location.state

  useEffect(() => {
    if (!orderData) {
      navigate('/custom-orders')
    }
  }, [orderData, navigate])

  if (!orderData) return null

  const handlePayment = async () => {
    setIsProcessing(true)
    setError('')

    const orderId = generateOrderId()

    if (!isRazorpayConfigured()) {
      // Demo mode - simulate payment
      const result = await saveOrder({
        orderId,
        paymentId: `pay_demo_${Date.now()}`,
        ...orderData,
      })

      if (result.success) {
        navigate('/order-confirmation', {
          state: {
            orderId,
            paymentId: `pay_demo_${Date.now()}`,
            ...orderData,
          },
        })
      }
      setIsProcessing(false)
      return
    }

    const result = await initiatePayment({
      amount: orderData.totalAmount,
      orderId,
      customerName: orderData.name,
      customerEmail: orderData.email,
      customerPhone: orderData.phone,
      onSuccess: async (response) => {
        await saveOrder({
          orderId,
          paymentId: response.razorpay_payment_id,
          ...orderData,
        })
        navigate('/order-confirmation', {
          state: {
            orderId,
            paymentId: response.razorpay_payment_id,
            ...orderData,
          },
        })
      },
      onFailure: (errorMsg) => {
        setError(errorMsg || 'Payment failed. Please try again.')
      },
    })

    setIsProcessing(false)
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8F2] via-[#F8EBDD] to-[#F3E3D3]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#E8C79A]/8 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-medium text-gold uppercase tracking-[0.2em] mb-4 block">
            Secure Checkout
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-chocolate mb-6">
            Payment Summary
          </h1>
        </div>
      </section>

      {/* Payment Content */}
      <section className="py-12 sm:py-16 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-3xl p-6 sm:p-8 shadow-sm border border-cream-dark/30"
            >
              <h2 className="font-display text-xl font-bold text-chocolate mb-6">Order Summary</h2>

              {/* Customer Details */}
              <div className="mb-6 pb-6 border-b border-cream-dark/30">
                <h3 className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">Customer Details</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-charcoal"><span className="text-warm-gray">Name:</span> {orderData.name}</p>
                  <p className="text-charcoal"><span className="text-warm-gray">Email:</span> {orderData.email}</p>
                  <p className="text-charcoal"><span className="text-warm-gray">Phone:</span> {orderData.phone}</p>
                </div>
              </div>

              {/* Cake Details */}
              <div className="mb-6 pb-6 border-b border-cream-dark/30">
                <h3 className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">Cake Details</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-charcoal"><span className="text-warm-gray">Cake Type:</span> {orderData.cakeType}</p>
                  {orderData.occasion && <p className="text-charcoal"><span className="text-warm-gray">Occasion:</span> {orderData.occasion}</p>}
                  <p className="text-charcoal"><span className="text-warm-gray">Event Date:</span> {orderData.eventDate}</p>
                  <p className="text-charcoal"><span className="text-warm-gray">Cake Size:</span> {orderData.cakeSize}</p>
                  <p className="text-charcoal"><span className="text-warm-gray">Number of Cakes:</span> {orderData.numberOfCakes}</p>
                  <p className="text-charcoal"><span className="text-warm-gray">Flavor:</span> {orderData.flavor}</p>
                  <p className="text-charcoal"><span className="text-warm-gray">Design Style:</span> {orderData.designStyle}</p>
                  {orderData.specialInstructions && (
                    <p className="text-charcoal"><span className="text-warm-gray">Special Instructions:</span> {orderData.specialInstructions}</p>
                  )}
                </div>
              </div>

              {/* Price Breakdown */}
              <div>
                <h3 className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">Price Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-warm-gray">Base Price</span>
                    <span className="text-charcoal">₹{orderData.basePrice}</span>
                  </div>
                  {orderData.flavorCharge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-warm-gray">Flavor Extra</span>
                      <span className="text-charcoal">+₹{orderData.flavorCharge}</span>
                    </div>
                  )}
                  {orderData.designCharge > 0 && (
                    <div className="flex justify-between">
                      <span className="text-warm-gray">Design Style</span>
                      <span className="text-charcoal">+₹{orderData.designCharge}</span>
                    </div>
                  )}
                  {orderData.numberOfCakes > 1 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-warm-gray">Price per Cake</span>
                        <span className="text-charcoal">₹{orderData.perCakePrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-warm-gray">Number of Cakes</span>
                        <span className="text-charcoal">× {orderData.numberOfCakes}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Payment Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Total Card */}
              <div className="bg-gradient-to-br from-[#FFF8F2] via-[#F8EBDD] to-[#F3E3D3] rounded-3xl p-6 sm:p-8 border border-[rgba(212,175,55,0.15)] shadow-[0_8px_32px_rgba(139,69,19,0.08)]">
                <h3 className="text-xs font-semibold text-chocolate uppercase tracking-wider mb-4">Total Amount</h3>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold text-chocolate">Estimated Price</span>
                  <span className="font-display text-4xl font-bold text-[#D4B06A]">₹{orderData.totalAmount}</span>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-chocolate text-white py-4 rounded-full text-sm font-semibold hover:bg-chocolate-light transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Payment'}
                </button>

                <p className="text-[10px] text-warm-gray text-center mt-4">
                  {isRazorpayConfigured()
                    ? 'Secure payment powered by Razorpay'
                    : 'Demo mode - No real payment will be charged'}
                </p>
              </div>

              {/* Payment Methods */}
              <div className="bg-card rounded-3xl p-6 shadow-sm border border-cream-dark/30">
                <h3 className="text-xs font-semibold text-chocolate uppercase tracking-wider mb-4">Accepted Payment Methods</h3>
                <div className="grid grid-cols-3 gap-3 text-center text-xs text-warm-gray">
                  <div className="p-2 bg-cream/50 rounded-lg">UPI</div>
                  <div className="p-2 bg-cream/50 rounded-lg">Google Pay</div>
                  <div className="p-2 bg-cream/50 rounded-lg">PhonePe</div>
                  <div className="p-2 bg-cream/50 rounded-lg">Paytm</div>
                  <div className="p-2 bg-cream/50 rounded-lg">Cards</div>
                  <div className="p-2 bg-cream/50 rounded-lg">Net Banking</div>
                </div>
              </div>

              {/* Back Link */}
              <div className="text-center">
                <Link to="/custom-orders" className="text-sm text-warm-gray hover:text-chocolate transition-colors">
                  ← Back to Order Form
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
