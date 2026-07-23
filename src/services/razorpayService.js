// TODO: Add your Razorpay credentials to .env file
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || ''

export const isRazorpayConfigured = () => {
  return RAZORPAY_KEY_ID !== ''
}

// Load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

// Initialize Razorpay payment
export const initiatePayment = async ({ amount, orderId, customerName, customerEmail, customerPhone, onSuccess, onFailure }) => {
  if (!isRazorpayConfigured()) {
    return { success: false, error: 'Payment gateway is not configured yet.' }
  }

  const scriptLoaded = await loadRazorpayScript()
  if (!scriptLoaded) {
    return { success: false, error: 'Failed to load payment gateway.' }
  }

  return new Promise((resolve) => {
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      name: 'The Velvet Crumb',
      description: `Order ${orderId}`,
      order_id: orderId,
      handler: function (response) {
        onSuccess(response)
        resolve({ success: true, data: response })
      },
      prefill: {
        name: customerName || '',
        email: customerEmail || '',
        contact: customerPhone || '',
      },
      notes: {
        order_id: orderId,
      },
      theme: {
        color: '#D4B06A',
      },
      modal: {
        ondismiss: function () {
          onFailure('Payment cancelled by user')
          resolve({ success: false, error: 'Payment cancelled' })
        },
      },
    }

    try {
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response) {
        onFailure(response.error?.description || 'Payment failed')
        resolve({ success: false, error: response.error?.description || 'Payment failed' })
      })
      rzp.open()
    } catch (error) {
      onFailure('Failed to initialize payment')
      resolve({ success: false, error: error.message })
    }
  })
}

// Generate Razorpay order (server-side call in production)
// In test mode, we simulate this
export const createRazorpayOrder = async (amount) => {
  if (!isRazorpayConfigured()) {
    return { success: false, error: 'Payment gateway is not configured yet.' }
  }

  // In production, this should be a server-side API call
  // For demo purposes, we generate a mock order ID
  const mockOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  return {
    success: true,
    data: {
      id: mockOrderId,
      amount: amount * 100,
      currency: 'INR',
    },
  }
}
