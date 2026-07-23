import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package, Users, Star, BarChart3,
  LogOut, Menu, X, ChevronRight, TrendingUp, Clock, CheckCircle, AlertCircle,
  Search, Bell, Eye, ShoppingCart, Calendar
} from 'lucide-react'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import { supabase } from '../lib/supabase'

const sidebarLinks = [
  { to: '/admin/cakes', label: 'Cakes', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Package },
  { to: '/admin/flavors', label: 'Flavors', icon: Package },
  { to: '/admin/customers', label: 'Customers', icon: Users },
]

function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation()
  const { admin, signOut } = useAdminAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: '#4A2E2A' }}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                <span className="font-display text-chocolate font-bold text-lg">V</span>
              </div>
              <div>
                <span className="font-display text-lg font-semibold text-white block leading-tight">Admin Panel</span>
                <span className="text-[10px] text-white/50 uppercase tracking-wider">The Velvet Crumb</span>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive ? 'bg-gold/20 text-gold' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                <span className="text-chocolate text-sm font-bold">
                  {admin?.adminData?.full_name?.[0] || admin?.email?.[0]?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{admin?.adminData?.full_name || 'Admin'}</p>
                <p className="text-[11px] text-white/50 truncate">{admin?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

function StatCard({ title, value, icon: Icon, color, trend, trendValue, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="bg-card rounded-2xl p-5 shadow-sm border border-cream-dark/30 hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-warm-gray mb-1">{title}</p>
          <p className="font-display text-2xl font-bold text-chocolate">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className={`w-3 h-3 ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`} />
              <span className={`text-[10px] font-medium ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  )
}

function MiniChart({ data, color, height = 40 }) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-0.5" style={{ height }}>
      {data.map((value, i) => (
        <div
          key={i}
          className="flex-1 rounded-t transition-all duration-300"
          style={{
            height: `${(value / max) * 100}%`,
            backgroundColor: color,
            opacity: 0.3 + (i / data.length) * 0.7,
          }}
        />
      ))}
    </div>
  )
}

function OrderStatusBadge({ status }) {
  const styles = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    preparing: 'bg-purple-100 text-purple-700',
    ready: 'bg-emerald-100 text-emerald-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  )
}

function ChartBar({ label, value, maxValue, color }) {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-warm-gray w-8 text-right">{label}</span>
      <div className="flex-1 h-6 bg-cream rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] font-medium text-chocolate w-10">{value}</span>
    </div>
  )
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalCakes: 0,
    totalReviews: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [monthlyRevenue, setMonthlyRevenue] = useState([])
  const [ordersByStatus, setOrdersByStatus] = useState({})
  const [notifications, setNotifications] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, customersRes, cakesRes, reviewsRes] = await Promise.all([
        supabase.from('orders').select('*'),
        supabase.from('customers').select('*'),
        supabase.from('cakes').select('*'),
        supabase.from('reviews').select('*'),
      ])

      const orders = ordersRes.data || []
      const customers = customersRes.data || []
      const cakes = cakesRes.data || []
      const reviews = reviewsRes.data || []

      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.order_status === 'pending').length,
        completedOrders: orders.filter(o => o.order_status === 'delivered').length,
        cancelledOrders: orders.filter(o => o.order_status === 'cancelled').length,
        totalRevenue: orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0),
        totalCustomers: customers.length,
        totalCakes: cakes.length,
        totalReviews: reviews.length,
      })

      setRecentOrders(orders.slice(0, 8))

      setNotifications(orders.filter(o => o.order_status === 'pending').length)

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const currentYear = new Date().getFullYear()
      const revenueByMonth = months.map((month, i) => {
        const monthOrders = orders.filter(o => {
          const d = new Date(o.created_at)
          return d.getMonth() === i && d.getFullYear() === currentYear
        })
        return {
          month,
          revenue: monthOrders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0),
        }
      })
      setMonthlyRevenue(revenueByMonth)

      const statusCounts = {}
      orders.forEach(o => {
        statusCounts[o.order_status] = (statusCounts[o.order_status] || 0) + 1
      })
      setOrdersByStatus(statusCounts)
    } catch (error) {
      console.error('Dashboard fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue), 1)
  const maxStatusCount = Math.max(...Object.values(ordersByStatus), 1)

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-72">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur-sm border-b border-cream-dark/30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-card border border-cream-dark/30"
              >
                <Menu className="w-5 h-5 text-chocolate" />
              </button>
              <h1 className="font-display text-xl font-bold text-chocolate">Dashboard</h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-cream-dark/30 w-64">
                <Search className="w-4 h-4 text-warm-gray" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm text-charcoal focus:outline-none w-full placeholder:text-warm-gray/60"
                />
              </div>

              {/* Notifications */}
              <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-card border border-cream-dark/30 hover:bg-cream-dark transition-colors">
                <Bell className="w-5 h-5 text-chocolate" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              {/* View Store */}
              <a
                href="/"
                target="_blank"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-cream-dark/30 text-sm text-chocolate hover:bg-cream-dark transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Store
              </a>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />
                <p className="text-warm-gray text-sm mt-3">Loading dashboard...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <StatCard
                  title="Total Orders"
                  value={stats.totalOrders}
                  icon={ShoppingCart}
                  color="bg-blue-100 text-blue-600"
                  onClick={() => window.location.href = '/admin/orders'}
                />
                <StatCard
                  title="Revenue"
                  value={`₹${stats.totalRevenue.toLocaleString()}`}
                  icon={TrendingUp}
                  color="bg-emerald-100 text-emerald-600"
                />
                <StatCard
                  title="Customers"
                  value={stats.totalCustomers}
                  icon={Users}
                  color="bg-purple-100 text-purple-600"
                />
                <StatCard
                  title="Cakes"
                  value={stats.totalCakes}
                  icon={Package}
                  color="bg-amber-100 text-amber-600"
                  onClick={() => window.location.href = '/admin/cakes'}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <StatCard
                  title="Pending"
                  value={stats.pendingOrders}
                  icon={Clock}
                  color="bg-amber-100 text-amber-600"
                  onClick={() => window.location.href = '/admin/orders'}
                />
                <StatCard
                  title="Completed"
                  value={stats.completedOrders}
                  icon={CheckCircle}
                  color="bg-green-100 text-green-600"
                />
                <StatCard
                  title="Cancelled"
                  value={stats.cancelledOrders}
                  icon={AlertCircle}
                  color="bg-red-100 text-red-600"
                />
                <StatCard
                  title="Reviews"
                  value={stats.totalReviews}
                  icon={Star}
                  color="bg-rose-100 text-rose-600"
                  onClick={() => window.location.href = '/admin/reviews'}
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Monthly Revenue Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-2xl p-6 shadow-sm border border-cream-dark/30"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-display text-sm font-bold text-chocolate">Monthly Revenue</h3>
                      <p className="text-[11px] text-warm-gray mt-0.5">Revenue trend this year</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {monthlyRevenue.slice(0, 6).map((item, i) => (
                      <ChartBar
                        key={i}
                        label={item.month}
                        value={`₹${(item.revenue / 1000).toFixed(1)}k`}
                        maxValue={maxRevenue}
                        color="#10B981"
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Orders by Status Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card rounded-2xl p-6 shadow-sm border border-cream-dark/30"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-display text-sm font-bold text-chocolate">Orders Overview</h3>
                      <p className="text-[11px] text-warm-gray mt-0.5">Orders by status</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(ordersByStatus).map(([status, count], i) => {
                      const colors = {
                        pending: '#F59E0B',
                        confirmed: '#3B82F6',
                        preparing: '#8B5CF6',
                        ready: '#10B981',
                        delivered: '#22C55E',
                        cancelled: '#EF4444',
                      }
                      return (
                        <ChartBar
                          key={status}
                          label={status.slice(0, 4)}
                          value={count}
                          maxValue={maxStatusCount}
                          color={colors[status] || '#6B7280'}
                        />
                      )
                    })}
                    {Object.keys(ordersByStatus).length === 0 && (
                      <p className="text-center text-warm-gray text-sm py-4">No orders yet</p>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Recent Orders Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl shadow-sm border border-cream-dark/30 overflow-hidden"
              >
                <div className="flex items-center justify-between p-6 border-b border-cream-dark/30">
                  <h2 className="font-display text-base font-bold text-chocolate">Recent Orders</h2>
                  <Link
                    to="/admin/orders"
                    className="text-xs text-gold font-medium hover:text-gold/70 transition-colors"
                  >
                    View All →
                  </Link>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="p-12 text-center">
                    <Package className="w-10 h-10 text-warm-gray/40 mx-auto mb-3" />
                    <p className="text-warm-gray text-sm">No orders yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-cream-dark/30">
                          <th className="text-left px-6 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Customer</th>
                          <th className="text-left px-6 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Items</th>
                          <th className="text-left px-6 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Amount</th>
                          <th className="text-left px-6 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Status</th>
                          <th className="text-left px-6 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => {
                          const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items
                          const itemCount = Array.isArray(items) ? items.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0
                          return (
                            <tr key={order.id} className="border-b border-cream-dark/20 last:border-0 hover:bg-cream/50 transition-colors">
                              <td className="px-6 py-3">
                                <p className="text-sm font-medium text-chocolate">{order.customer_name}</p>
                                <p className="text-[10px] text-warm-gray">{order.customer_phone}</p>
                              </td>
                              <td className="px-6 py-3">
                                <p className="text-sm text-charcoal/70">{itemCount} item(s)</p>
                              </td>
                              <td className="px-6 py-3 text-sm font-semibold text-chocolate">₹{order.total}</td>
                              <td className="px-6 py-3">
                                <OrderStatusBadge status={order.order_status} />
                              </td>
                              <td className="px-6 py-3 text-[11px] text-warm-gray">
                                {new Date(order.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
