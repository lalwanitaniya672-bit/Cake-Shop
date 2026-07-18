import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import useAuthStore from './stores/authStore'

import Home from './pages/Home'
import About from './pages/About'
import CakeCollection from './pages/CakeCollection'
import ProductDetail from './pages/ProductDetail'
import CustomOrders from './pages/CustomOrders'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Reviews from './pages/Reviews'

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose to-gold flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="font-display text-white font-bold text-2xl">V</span>
        </div>
        <p className="text-warm-gray text-sm">Loading...</p>
      </div>
    </div>
  )
}

function ProtectedRoutes() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/collection" element={<CakeCollection />} />
          <Route path="/cake/:id" element={<ProductDetail />} />
          <Route path="/custom-orders" element={<CustomOrders />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🎂</div>
                <h1 className="font-display text-4xl font-bold text-chocolate mb-2">404</h1>
                <p className="text-warm-gray mb-6">This page doesn't exist yet.</p>
                <a href="/" className="inline-flex items-center gap-2 bg-chocolate text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-chocolate-light transition-all">
                  Go Home
                </a>
              </div>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

export default function App() {
  const initialize = useAuthStore((s) => s.initialize)
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const location = useLocation()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (loading) {
    return <AuthLoadingScreen />
  }

  return (
    <div className="min-h-screen bg-cream">
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />
        <Route path="/*" element={user ? <ProtectedRoutes /> : <Navigate to="/login" state={{ from: location.pathname }} replace />} />
      </Routes>
    </div>
  )
}
