import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function SetupAdmin() {
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [details, setDetails] = useState(null)

  const handleCreateAdmin = async () => {
    setStatus('loading')
    setMessage('Creating admin account...')
    setDetails(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@gmail.com',
        password: 'admin1',
        options: {
          data: { full_name: 'Super Admin', role: 'super_admin' },
        },
      })

      if (error) {
        setStatus('error')
        setMessage(error.message)
        setDetails(error)
        return
      }

      if (data.user?.identities?.length === 0) {
        setStatus('error')
        setMessage('User already exists. Try signing in at /login')
        return
      }

      if (data.user) {
        const userId = data.user.id

        await supabase.from('admins').upsert({
          id: userId,
          email: 'admin@gmail.com',
          full_name: 'Super Admin',
          role: 'super_admin',
          is_active: true,
        }, { onConflict: 'id' })

        setStatus('success')
        setMessage('Admin account created successfully!')
        setDetails({ userId: data.user.id, email: data.user.email })
      }
    } catch (err) {
      setStatus('error')
      setMessage(err.message || 'Unknown error')
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-8">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-cream-dark p-8">
        <h1 className="font-display text-2xl font-bold text-chocolate mb-2">Admin Setup</h1>
        <p className="text-warm-gray text-sm mb-6">
          Creates the admin account in Supabase Authentication.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
          <strong>Before clicking:</strong> Go to Supabase Dashboard → Authentication → Providers → Email →
          turn <strong>OFF</strong> &quot;Confirm email&quot;. This prevents signup emails from being sent.
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <span className="w-6 h-6 rounded-full bg-chocolate text-white flex items-center justify-center text-xs font-bold">1</span>
            <span>Disable email confirmation in Supabase Dashboard</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="w-6 h-6 rounded-full bg-chocolate text-white flex items-center justify-center text-xs font-bold">2</span>
            <span>Click &quot;Create Admin Account&quot; below</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="w-6 h-6 rounded-full bg-chocolate text-white flex items-center justify-center text-xs font-bold">3</span>
            <span>Verify user in Authentication → Users</span>
          </div>
        </div>

        <button
          onClick={handleCreateAdmin}
          disabled={status === 'loading'}
          className="w-full bg-chocolate text-white py-3 rounded-full text-sm font-semibold hover:bg-chocolate-light transition-all disabled:opacity-50 mb-4"
        >
          {status === 'loading' ? 'Creating...' : 'Create Admin Account'}
        </button>

        {message && (
          <div className={`rounded-xl p-4 text-sm ${
            status === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
            status === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
            'bg-blue-50 border border-blue-200 text-blue-800'
          }`}>
            <p className="font-medium">{message}</p>
            {details && (
              <pre className="mt-2 text-xs overflow-auto">{JSON.stringify(details, null, 2)}</pre>
            )}
          </div>
        )}

        {status === 'success' && (
          <Link
            to="/login"
            className="block w-full text-center bg-gold text-chocolate py-3 rounded-full text-sm font-semibold hover:bg-gold-light transition-all mt-4"
          >
            Go to Login →
          </Link>
        )}
      </div>
    </div>
  )
}
