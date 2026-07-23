import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import useAuthStore from './stores/authStore'

import Home from './pages/Home'
import About from './pages/About'
import Trust from './pages/Trust'
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
import PaymentPage from './pages/PaymentPage'
import OrderConfirmation from './pages/OrderConfirmation'
import AdminLogin from './pages/AdminLogin'
import AdminCakes from './pages/AdminCakes'
import AdminCustomers from './pages/AdminCustomers'
import AdminReports from './pages/AdminReports'
import AdminCategories from './pages/AdminCategories'
import AdminFlavors from './pages/AdminFlavors'
import SetupAdmin from './pages/SetupAdmin'

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
          <Route path="/trust" element={<Trust />} />
          <Route path="/collection" element={<CakeCollection />} />
          <Route path="/cake/:id" element={<ProductDetail />} />
          <Route path="/custom-orders" element={<CustomOrders />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl sm:text-6xl mb-4">🎂</div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-chocolate mb-2">404</h1>
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
      <AdminAuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />

          {/* Admin login — password only, always available */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/setup-admin" element={<SetupAdmin />} />

          {/* Admin panel — protected */}
          <Route path="/admin/cakes" element={<ProtectedAdminRoute><AdminCakes /></ProtectedAdminRoute>} />
          <Route path="/admin/categories" element={<ProtectedAdminRoute><AdminCategories /></ProtectedAdminRoute>} />
          <Route path="/admin/flavors" element={<ProtectedAdminRoute><AdminFlavors /></ProtectedAdminRoute>} />
          <Route path="/admin/customers" element={<ProtectedAdminRoute><AdminCustomers /></ProtectedAdminRoute>} />
          <Route path="/admin/reports" element={<ProtectedAdminRoute><AdminReports /></ProtectedAdminRoute>} />
          <Route path="/admin" element={<Navigate to="/admin/cakes" replace />} />

          {/* Customer catch-all */}
          <Route path="/*" element={
            user
              ? <ProtectedRoutes />
              : <Navigate to="/login" state={{ from: location.pathname }} replace />
          } />
        </Routes>
      </AdminAuthProvider>
    </div>
  )
}
