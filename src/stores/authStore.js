import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  initialize: () => {
    const stored = localStorage.getItem('velvet-crumb-user')
    set({ user: stored ? JSON.parse(stored) : null, loading: false })
  },

  signUp: async (email, password, fullName) => {
    set({ error: null })
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
  },

  signIn: async (email, password) => {
    set({ error: null })
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
  },

  signInWithGoogle: async () => {
    const user = {
      id: crypto.randomUUID(),
      email: 'demo@example.com',
      user_metadata: { full_name: 'Demo User' },
      created_at: new Date().toISOString(),
    }
    localStorage.setItem('velvet-crumb-user', JSON.stringify(user))
    set({ user })
    return { data: { user } }
  },

  signOut: async () => {
    localStorage.removeItem('velvet-crumb-user')
    set({ user: null })
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore
