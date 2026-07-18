import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const isSupabaseConfigured =
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('your-project')

const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,

  initialize: async () => {
    try {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem('velvet-crumb-user')
        set({ user: stored ? JSON.parse(stored) : null, loading: false })
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      set({ user: session?.user || null, loading: false })

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user || null, loading: false })
      })
    } catch {
      set({ loading: false })
    }
  },

  signUp: async (email, password, fullName) => {
    set({ error: null })

    if (!isSupabaseConfigured) {
      const existing = localStorage.getItem('velvet-crumb-users')
      const users = existing ? JSON.parse(existing) : []
      if (users.find((u) => u.email === email)) {
        set({ error: 'An account with this email already exists.' })
        return { error: { message: 'An account with this email already exists.' } }
      }
      const user = {
        id: crypto.randomUUID(),
        email,
        user_metadata: { full_name: fullName },
        created_at: new Date().toISOString(),
      }
      users.push({ ...user, password })
      localStorage.setItem('velvet-crumb-users', JSON.stringify(users))
      localStorage.setItem('velvet-crumb-user', JSON.stringify(user))
      set({ user })
      return { data: { user } }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) {
      set({ error: error.message })
      return { error }
    }
    set({ user: data.user })
    return { data }
  },

  signIn: async (email, password) => {
    set({ error: null })

    if (!isSupabaseConfigured) {
      const existing = localStorage.getItem('velvet-crumb-users')
      const users = existing ? JSON.parse(existing) : []
      const found = users.find((u) => u.email === email && u.password === password)
      if (!found) {
        set({ error: 'Invalid email or password.' })
        return { error: { message: 'Invalid email or password.' } }
      }
      const { password: _, ...user } = found
      localStorage.setItem('velvet-crumb-user', JSON.stringify(user))
      set({ user })
      return { data: { user } }
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      set({ error: error.message })
      return { error }
    }
    set({ user: data.user })
    return { data }
  },

  signInWithGoogle: async () => {
    set({ error: null })

    if (!isSupabaseConfigured) {
      const user = {
        id: crypto.randomUUID(),
        email: 'demo@example.com',
        user_metadata: { full_name: 'Demo User' },
        created_at: new Date().toISOString(),
      }
      localStorage.setItem('velvet-crumb-user', JSON.stringify(user))
      set({ user })
      return { data: { user } }
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    })
    if (error) set({ error: error.message })
    return { error }
  },

  signOut: async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    }
    localStorage.removeItem('velvet-crumb-user')
    set({ user: null })
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore
