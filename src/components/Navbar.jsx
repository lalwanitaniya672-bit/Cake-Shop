import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, User, LogOut, Menu, X, ChevronDown } from 'lucide-react'
import useCartStore from '../stores/cartStore'
import useAuthStore from '../stores/authStore'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/collection', label: 'Collection' },
  { to: '/custom-orders', label: 'Custom Orders' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()
  const totalItems = useCartStore((s) => s.getTotalItems())
  const { user, signOut } = useAuthStore()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setShowUserMenu(false)
  }, [location])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-chocolate/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose to-gold flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <span className="font-display text-white font-bold text-lg">V</span>
            </div>
            <div>
              <span className="font-display text-xl font-semibold text-chocolate tracking-wide">
                The Velvet Crumb
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-[0.25em] text-warm-gray font-medium">
                Artisan Cake Boutique
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  location.pathname === link.to
                    ? 'text-chocolate bg-gold/10'
                    : 'text-charcoal/70 hover:text-chocolate hover:bg-cream-dark/50'
                }`}
              >
                {link.label}
                {location.pathname === link.to && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/cart"
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-cream-dark/50 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-chocolate" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>

            {/* User Menu */}
            <div className="hidden lg:block relative">
              {user ? (
                <>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-cream-dark/50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose to-gold flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {(user.user_metadata?.full_name || user.email)?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-charcoal/50" />
                  </button>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-cream-dark/50 overflow-hidden"
                      >
                        <div className="p-3 border-b border-cream-dark/50">
                          <p className="text-xs text-warm-gray">Signed in as</p>
                          <p className="text-sm font-medium text-chocolate truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={() => { signOut(); setShowUserMenu(false) }}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-chocolate hover:bg-cream-dark/30 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-chocolate text-white text-sm font-medium hover:bg-chocolate-light transition-colors"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-cream-dark/50 hover:bg-cream-dark transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5 text-chocolate" /> : <Menu className="w-5 h-5 text-chocolate" />}
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
            className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-md border-t border-cream-dark/50"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.to
                      ? 'text-chocolate bg-gold/10'
                      : 'text-charcoal/70 hover:text-chocolate hover:bg-cream-dark/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-cream-dark/50">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2">
                      <p className="text-xs text-warm-gray">Signed in as</p>
                      <p className="text-sm font-medium text-chocolate truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { signOut(); setIsOpen(false) }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-chocolate hover:bg-cream-dark/30 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="block text-center px-4 py-3 rounded-xl bg-chocolate text-white text-sm font-medium hover:bg-chocolate-light transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
