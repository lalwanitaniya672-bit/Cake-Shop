import { useState, useEffect, createContext, useContext } from 'react'

const AdminAuthContext = createContext(undefined)

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') {
      setAdmin({ role: 'super_admin' })
    }
    setLoading(false)
  }, [])

  const signIn = async (_email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (password === '123456789') {
          localStorage.setItem('admin_auth', 'true')
          setAdmin({ role: 'super_admin' })
          resolve({ success: true })
        } else {
          reject(new Error('Invalid password'))
        }
      }, 500)
    })
  }

  const signOut = async () => {
    localStorage.removeItem('admin_auth')
    setAdmin(null)
  }

  return (
    <AdminAuthContext.Provider value={{ admin, loading, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
