import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../stores/authStore'

export default function RequireAuth({ children }) {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  if (user) return children

  return <Navigate to="/login" state={{ from: location.pathname, message: 'Please sign in to continue.' }} replace />
}
