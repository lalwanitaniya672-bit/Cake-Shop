import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, User, LogOut, Menu, X, ChevronDown, Lock, Shield } from 'lucide-react'
import useCartStore from '../stores/cartStore'
import useAuthStore from '../stores/authStore'

const allNavLinks = [
  { to: '/', label: 'Home', public: true },
  { to: '/about', label: 'About' },
  { to: '/trust', label: 'Why Us' },
  { to: '/collection', label: 'Collection' },
  { to: '/custom-orders', label: 'Custom Orders' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const totalItems = useCartStore((s) => s.getTotalItems())
  const { user, signOut } = useAuthStore()

  const navLinks = user ? allNavLinks : allNavLinks.filter((l) => l.public)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setShowUserMenu(false)
  }, [location])

  const handleLockedClick = (e) => {
    e.preventDefault()
    navigate('/login', { state: { from: '/', message: 'Please sign in to continue.' } })
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-cream shadow-[0_4px_30px_rgba(139,90,43,0.08)]'
          : 'bg-cream'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-chocolate via-chocolate-light to-gold flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-chocolate/20">
              <span className="font-display text-white font-bold text-lg">V</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold text-chocolate tracking-wide leading-tight">
                The Velvet Crumb
              </span>
              <span className="hidden sm:block text-[9px] uppercase tracking-[0.3em] text-gold font-semibold">
                Artisan Cake Boutique
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 bg-cream-dark rounded-full px-2 py-1.5 border border-cream-dark/50">
            {navLinks.map((link) => (
              user ? (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    location.pathname === link.to
                      ? 'text-chocolate bg-gradient-to-r from-gold/15 to-rose/10 shadow-sm'
                      : 'text-charcoal/60 hover:text-chocolate hover:bg-white/80'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-gradient-to-r from-gold to-rose"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ) : (
                <button
                  key={link.to}
                  onClick={handleLockedClick}
                  className="relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 text-charcoal/60 hover:text-chocolate hover:bg-white/80"
                >
                  {link.label}
                </button>
              )
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Cart - only for signed-in users */}
            {user && (
              <Link
                to="/cart"
                className="relative w-11 h-11 flex items-center justify-center rounded-full bg-cream-dark hover:bg-chocolate/10 border border-cream-dark/30 transition-all duration-300 hover:shadow-md"
              >
                <ShoppingBag className="w-5 h-5 text-chocolate" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-rose to-rose-dark text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-rose/30"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>
            )}

            {/* Admin Icon - Desktop */}
            <Link
              to="/admin/login"
              className="hidden lg:flex w-11 h-11 items-center justify-center rounded-full bg-cream-dark hover:bg-chocolate/10 border border-cream-dark/30 transition-all duration-300 hover:shadow-md group"
              title="Admin Panel"
            >
              <Shield className="w-5 h-5 text-chocolate group-hover:text-gold transition-colors" />
            </Link>

            {/* User Icon - Desktop */}
            <div className="hidden lg:block relative">
              {user ? (
                <>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-cream-dark hover:bg-chocolate/10 border border-cream-dark/30 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-chocolate to-gold flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {(user.user_metadata?.full_name || user.email)?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-charcoal/50 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-cream-dark/30 overflow-hidden"
                      >
                        <div className="p-4 border-b border-cream-dark/30 bg-gradient-to-r from-cream/50 to-white">
                          <p className="text-[10px] text-warm-gray uppercase tracking-wider">Signed in as</p>
                          <p className="text-sm font-medium text-chocolate truncate mt-0.5">{user.email}</p>
                        </div>
                        <button
                          onClick={() => { signOut(); setShowUserMenu(false) }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-chocolate hover:bg-cream/50 transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-warm-gray" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-r from-chocolate to-chocolate-light text-white hover:shadow-lg hover:shadow-chocolate/20 transition-all duration-300 hover:-translate-y-0.5"
                  title="Sign In"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-full bg-cream-dark hover:bg-chocolate/10 border border-cream-dark/30 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-5 h-5 text-chocolate" />
              ) : (
                <Menu className="w-5 h-5 text-chocolate" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-cream border-t border-cream-dark/30"
          >
            <div className="px-4 py-4 space-y-1">
              {allNavLinks.map((link) => (
                user ? (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      location.pathname === link.to
                        ? 'text-chocolate bg-gradient-to-r from-gold/15 to-rose/10 shadow-sm'
                        : 'text-charcoal/60 hover:text-chocolate hover:bg-cream-dark'
                    }`}
                  >
                    {location.pathname === link.to && (
                      <span className="w-1 h-1 rounded-full bg-gradient-to-r from-gold to-rose mr-3" />
                    )}
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.to}
                    onClick={handleLockedClick}
                    className="flex items-center w-full px-4 py-3.5 rounded-xl text-sm font-medium text-charcoal/60 hover:text-chocolate hover:bg-cream-dark transition-all duration-300"
                  >
                    {link.label}
                    <Lock className="w-3 h-3 ml-2 text-warm-gray/50" />
                  </button>
                )
              ))}
              <div className="pt-3 mt-3 border-t border-cream-dark/30 space-y-2">
                {user ? (
                  <>
                    <div className="px-4 py-3 bg-cream-dark rounded-xl">
                      <p className="text-[10px] text-warm-gray uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-medium text-chocolate truncate mt-0.5">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { signOut(); setIsOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-chocolate hover:bg-cream-dark rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-warm-gray" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-chocolate to-chocolate-light text-white text-sm font-medium hover:shadow-lg transition-all duration-300"
                    >
                      <User className="w-4 h-4" />
                      Sign In
                    </Link>
                    <Link
                      to="/admin/login"
                      className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-cream-dark bg-white text-chocolate text-sm font-medium hover:bg-cream-dark transition-all duration-300"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
