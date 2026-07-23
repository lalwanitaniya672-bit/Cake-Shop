import { Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import { AdminAuthProvider } from './contexts/AdminAuthContext'

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
import AdminCategories from './pages/AdminCategories'
import AdminFlavors from './pages/AdminFlavors'
import SetupAdmin from './pages/SetupAdmin'

function PublicRoutes() {
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
  return (
    <div className="min-h-screen bg-cream">
      <ScrollToTop />
      <AdminAuthProvider>
        <Routes>
          {/* Customer auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin login */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/setup-admin" element={<SetupAdmin />} />

          {/* Admin panel */}
          <Route path="/admin/cakes" element={<ProtectedAdminRoute><AdminCakes /></ProtectedAdminRoute>} />
          <Route path="/admin/categories" element={<ProtectedAdminRoute><AdminCategories /></ProtectedAdminRoute>} />
          <Route path="/admin/flavors" element={<ProtectedAdminRoute><AdminFlavors /></ProtectedAdminRoute>} />
          <Route path="/admin/customers" element={<ProtectedAdminRoute><AdminCustomers /></ProtectedAdminRoute>} />
          <Route path="/admin" element={<Navigate to="/admin/cakes" replace />} />

          {/* Public routes */}
          <Route path="/*" element={<PublicRoutes />} />
        </Routes>
      </AdminAuthProvider>
    </div>
  )
}
