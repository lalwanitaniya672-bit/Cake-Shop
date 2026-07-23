import { Link } from 'react-router-dom'

export default function SetupAdmin() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-8">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-cream-dark p-8">
        <h1 className="font-display text-2xl font-bold text-chocolate mb-2">Admin Setup</h1>
        <p className="text-warm-gray text-sm mb-6">
          Create the admin account in Supabase, then log in.
        </p>

        <div className="space-y-4 mb-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <strong>Step 1:</strong> Go to Supabase Dashboard → Authentication → Providers → Email → turn <strong>OFF</strong> &quot;Confirm email&quot;
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            <strong>Step 2:</strong> Go to Authentication → Users → <strong>Add User</strong><br />
            Email: <code className="bg-blue-100 px-1 rounded">admin@gmail.com</code><br />
            Password: set your own secure password<br />
            Check <strong>&quot;Auto Confirm User&quot;</strong>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
            <strong>Step 3:</strong> Turn &quot;Confirm email&quot; back ON (optional)
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-purple-800">
            <strong>Step 4:</strong> Go to <code className="bg-purple-100 px-1 rounded">/admin/login</code> and enter your password
          </div>
        </div>

        <Link
          to="/admin/login"
          className="block w-full text-center bg-chocolate text-white py-3 rounded-full text-sm font-semibold hover:bg-chocolate-light transition-all"
        >
          Go to Admin Login →
        </Link>

        <Link
          to="/login"
          className="block text-center text-warm-gray text-xs mt-4 hover:text-chocolate"
        >
          ← Back to customer login
        </Link>
      </div>
    </div>
  )
}
