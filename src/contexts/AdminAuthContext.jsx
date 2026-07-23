import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { isAdminEmail } from '../lib/adminSetup'

const AdminAuthContext = createContext(undefined)

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkAdminRole = useCallback(async (user) => {
    if (!user) {
      setAdmin(null)
      setLoading(false)
      return
    }

    if (!isAdminEmail(user.email)) {
      setAdmin(null)
      setLoading(false)
      return
    }

    const adminPayload = {
      ...user,
      adminData: {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || 'Admin',
        role: 'super_admin',
        is_active: true,
      },
    }

    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (data) {
        setAdmin({ ...user, adminData: data })
        setLoading(false)
        return
      }

      if (error) {
        console.warn('Admin table query error (will use email fallback):', error.message)
      }

      const { error: insertError } = await supabase
        .from('admins')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || 'Admin',
          role: 'super_admin',
          is_active: true,
        }, { onConflict: 'id' })

      if (insertError) {
        console.warn('Admin record upsert failed (using email fallback):', insertError.message)
      }

      setAdmin(adminPayload)
    } catch (error) {
      console.error('Admin check error:', error)
      setAdmin(adminPayload)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAdminRole(session?.user || null)
    }).catch(() => {
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        checkAdminRole(session?.user || null)
      }
    )

    return () => subscription.unsubscribe()
  }, [checkAdminRole])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    if (data.user) {
      await checkAdminRole(data.user)
    }

    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
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
