import { createClient } from '@supabase/supabase-js'

// TODO: Add your Supabase credentials to .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

let supabase = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export const isSupabaseConfigured = () => {
  return supabase !== null && supabaseUrl !== '' && supabaseAnonKey !== ''
}

// Generate Order ID: TVC-YYYYMMDD-XXXX
export const generateOrderId = () => {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `TVC-${date}-${random}`
}

// Save order to Supabase
export const saveOrder = async (orderData) => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Order saved locally only.')
    const localOrders = JSON.parse(localStorage.getItem('tv-orders') || '[]')
    const order = {
      ...orderData,
      id: orderData.orderId,
      created_at: new Date().toISOString(),
    }
    localOrders.push(order)
    localStorage.setItem('tv-orders', JSON.stringify(localOrders))
    return { success: true, data: order, local: true }
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        order_id: orderData.orderId,
        razorpay_payment_id: orderData.paymentId,
        customer_name: orderData.name,
        phone: orderData.phone,
        email: orderData.email,
        cake_type: orderData.cakeType,
        occasion: orderData.occasion,
        event_date: orderData.eventDate,
        cake_size: orderData.cakeSize,
        number_of_cakes: orderData.numberOfCakes,
        flavor: orderData.flavor,
        design_style: orderData.designStyle,
        special_instructions: orderData.specialInstructions,
        total_amount: orderData.totalAmount,
        payment_status: 'Paid',
        order_status: 'Pending',
      }])
      .select()

    if (error) throw error
    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Supabase error:', error)
    // Fallback to local storage
    const localOrders = JSON.parse(localStorage.getItem('tv-orders') || '[]')
    const order = { ...orderData, id: orderData.orderId, created_at: new Date().toISOString() }
    localOrders.push(order)
    localStorage.setItem('tv-orders', JSON.stringify(localOrders))
    return { success: true, data: order, local: true }
  }
}

// Get order by ID
export const getOrder = async (orderId) => {
  if (!isSupabaseConfigured()) {
    const localOrders = JSON.parse(localStorage.getItem('tv-orders') || '[]')
    const order = localOrders.find(o => o.order_id === orderId || o.id === orderId)
    return { success: true, data: order }
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Supabase error:', error)
    return { success: false, error: error.message }
  }
}
