import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../contexts/AdminAuthContext'

export default function ProtectedAdminRoute({ children }) {
  const { admin, loading: adminLoading } = useAdminAuth()

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-chocolate to-gold flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="font-display text-white font-bold text-2xl">V</span>
          </div>
          <p className="text-warm-gray text-sm">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (admin) {
    return children
  }

  return <Navigate to="/admin/login" replace />
}
