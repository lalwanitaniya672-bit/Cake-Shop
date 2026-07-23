import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import useAuthStore from '../stores/authStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const { signIn, signInWithGoogle, error, clearError } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo = location.state?.from || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setLoginError('')
    clearError()

    const result = await signIn(email, password)
    if (!result.error) {
      navigate(redirectTo, { replace: true })
    } else {
      setLoginError(result.error.message || 'Login failed')
    }
    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle()
    if (!result.error) navigate(redirectTo, { replace: true })
  }

  const displayError = loginError || error

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1920&h=1080&fit=crop&q=80')",
        }}
      />
      <div className="absolute inset-0 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4 sm:mx-6"
      >
        <div className="bg-transparent backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/30 p-8 sm:p-10">
          <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose to-gold flex items-center justify-center">
              <span className="font-display text-white font-bold text-lg">V</span>
            </div>
            <span className="font-display text-xl font-semibold text-white">The Velvet Crumb</span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-white text-center mb-2">Sign In</h1>
          <p className="text-white/60 text-center text-sm mb-8">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-gold font-medium hover:text-gold-light transition-colors">
              Create one
            </Link>
          </p>

          {displayError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-200 text-sm rounded-xl p-4 mb-6"
            >
              {displayError}
              <button onClick={() => { setLoginError(''); clearError() }} className="ml-2 underline text-red-300 hover:text-red-100">Dismiss</button>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@email.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/25 bg-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-white/25 bg-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-white/30 bg-white/15 text-gold focus:ring-gold/30" />
                Remember me
              </label>
              <a href="#" className="text-sm text-gold font-medium hover:text-gold-light transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-chocolate py-3.5 rounded-full text-sm font-bold hover:bg-gold-light transition-all duration-300 hover:shadow-xl hover:shadow-gold/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/15" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-transparent px-4 text-xs text-white/40">or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 border border-white/25 bg-white/10 backdrop-blur-sm py-3 rounded-xl text-sm font-medium text-white hover:bg-white/20 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>
        </div>
      </motion.div>
    </div>
  )
}
