import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, ShoppingCart, Package, Users, MessageSquare, Star,
  LogOut, Menu, ChevronRight, TrendingUp, Download, FileText, RefreshCw,
  BarChart3, PieChart, Activity, Calendar, Award, Users as UsersIcon
} from 'lucide-react'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import { supabase } from '../lib/supabase'

const sidebarLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/cakes', label: 'Cakes', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Package },
  { to: '/admin/flavors', label: 'Flavors', icon: Package },
  { to: '/admin/custom-orders', label: 'Custom Orders', icon: Package },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
]

function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation()
  const { admin, signOut } = useAdminAuth()
  const navigate = useNavigate()
  const handleSignOut = async () => { await signOut(); navigate('/admin/login') }

  return (
    <>
      <AnimatePresence>{isOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}</AnimatePresence>
      <aside className={`fixed top-0 left-0 h-full w-72 z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ backgroundColor: '#4A2E2A' }}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center"><span className="font-display text-chocolate font-bold text-lg">V</span></div>
              <div><span className="font-display text-lg font-semibold text-white block leading-tight">Admin Panel</span><span className="text-[10px] text-white/50 uppercase tracking-wider">The Velvet Crumb</span></div>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const isActive = location.pathname === link.to
              return <Link key={link.to} to={link.to} onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isActive ? 'bg-gold/20 text-gold' : 'text-white/60 hover:text-white hover:bg-white/5'}`}><link.icon className="w-5 h-5" />{link.label}{isActive && <ChevronRight className="w-4 h-4 ml-auto" />}</Link>
            })}
          </nav>
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center"><span className="text-chocolate text-sm font-bold">{admin?.adminData?.full_name?.[0] || admin?.email?.[0]?.toUpperCase()}</span></div>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white truncate">{admin?.adminData?.full_name || 'Admin'}</p><p className="text-[11px] text-white/50 truncate">{admin?.email}</p></div>
            </div>
            <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"><LogOut className="w-5 h-5" />Sign Out</button>
          </div>
        </div>
      </aside>
    </>
  )
}

function StatCard({ title, value, icon: Icon, color, sub }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-5 border border-cream-dark/30 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] text-warm-gray uppercase tracking-wider">{title}</p>
          <p className="font-display text-2xl font-bold text-chocolate mt-1">{value}</p>
          {sub && <p className="text-[10px] text-warm-gray mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
      </div>
    </motion.div>
  )
}

function BarChart({ data, maxValue, color }) {
  return (
    <div className="space-y-2">
      {data.map((item, i) => {
        const pct = maxValue > 0 ? (item.value / maxValue) * 100 : 0
        return (
          <div key={i} className="flex items-center gap-3">
            <span className="text-[10px] text-warm-gray w-12 text-right truncate">{item.label}</span>
            <div className="flex-1 h-6 bg-cream rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className="h-full rounded-full" style={{ backgroundColor: color }} />
            </div>
            <span className="text-[10px] font-medium text-chocolate w-12">{item.display || item.value}</span>
          </div>
        )
      })}
    </div>
  )
}

function PieChartSimple({ segments, total }) {
  const colors = ['#C9A15C', '#5A3A32', '#D48BA2', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B']
  let cumAngle = 0

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {segments.map((seg, i) => {
            const pct = total > 0 ? (seg.value / total) * 100 : 0
            const dashArray = `${pct * 3.14} ${314 - pct * 3.14}`
            const offset = -cumAngle * 3.14
            cumAngle += pct
            return <circle key={i} cx="50" cy="50" r="50" fill="none" stroke={colors[i % colors.length]} strokeWidth="20" strokeDasharray={dashArray} strokeDashoffset={offset} />
          })}
        </svg>
      </div>
      <div className="space-y-2 flex-1">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
            <span className="text-xs text-charcoal/70 flex-1">{seg.label}</span>
            <span className="text-xs font-medium text-chocolate">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReportCard({ title, icon: Icon, children, onExport, exportLabel }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl shadow-sm border border-cream-dark/30 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-cream-dark/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-chocolate to-chocolate-light flex items-center justify-center"><Icon className="w-4 h-4 text-white" /></div>
          <h3 className="font-display text-sm font-bold text-chocolate">{title}</h3>
        </div>
        {onExport && <button onClick={onExport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-cream-dark text-chocolate hover:bg-cream-dark transition-colors"><Download className="w-3 h-3" />{exportLabel || 'Export'}</button>}
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  )
}

export default function AdminReports() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [cakes, setCakes] = useState([])
  const [customOrders, setCustomOrders] = useState([])

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [ordersRes, customersRes, cakesRes, customRes] = await Promise.all([
        supabase.from('orders').select('*'),
        supabase.from('customers').select('*'),
        supabase.from('cakes').select('*'),
        supabase.from('custom_orders').select('*'),
      ])
      setOrders(ordersRes.data || [])
      setCustomers(customersRes.data || [])
      setCakes(cakesRes.data || [])
      setCustomOrders(customRes.data || [])
    } catch (error) { console.error('Fetch error:', error) }
    finally { setLoading(false) }
  }

  const stats = useMemo(() => {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const weekAgo = new Date(now.getTime() - 7 * 86400000)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const todayOrders = orders.filter(o => o.created_at?.startsWith(today))
    const weekOrders = orders.filter(o => new Date(o.created_at) >= weekAgo)
    const monthOrders = orders.filter(o => new Date(o.created_at) >= monthStart)
    const yearOrders = orders.filter(o => new Date(o.created_at).getFullYear() === now.getFullYear())

    return {
      totalRevenue: orders.reduce((s, o) => s + (parseFloat(o.total) || 0), 0),
      totalOrders: orders.length,
      completedOrders: orders.filter(o => o.order_status === 'delivered').length,
      pendingOrders: orders.filter(o => o.order_status === 'pending').length,
      cancelledOrders: orders.filter(o => o.order_status === 'cancelled').length,
      totalCustomers: customers.length,
      todayRevenue: todayOrders.reduce((s, o) => s + (parseFloat(o.total) || 0), 0),
      weekRevenue: weekOrders.reduce((s, o) => s + (parseFloat(o.total) || 0), 0),
      monthRevenue: monthOrders.reduce((s, o) => s + (parseFloat(o.total) || 0), 0),
      yearRevenue: yearOrders.reduce((s, o) => s + (parseFloat(o.total) || 0), 0),
      todayOrders: todayOrders.length,
      weekOrders: weekOrders.length,
      monthOrders: monthOrders.length,
      yearOrders: yearOrders.length,
    }
  }, [orders, customers])

  const monthlyRevenue = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const year = new Date().getFullYear()
    return months.map((m, i) => {
      const val = orders.filter(o => { const d = new Date(o.created_at); return d.getMonth() === i && d.getFullYear() === year }).reduce((s, o) => s + (parseFloat(o.total) || 0), 0)
      return { label: m, value: val, display: `₹${(val / 1000).toFixed(1)}k` }
    })
  }, [orders])

  const ordersPerMonth = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const year = new Date().getFullYear()
    return months.map((m, i) => {
      const val = orders.filter(o => { const d = new Date(o.created_at); return d.getMonth() === i && d.getFullYear() === year }).length
      return { label: m, value: val, display: val.toString() }
    })
  }, [orders])

  const orderStatusData = useMemo(() => [
    { label: 'Pending', value: stats.pendingOrders },
    { label: 'Confirmed', value: orders.filter(o => o.order_status === 'confirmed').length },
    { label: 'Preparing', value: orders.filter(o => o.order_status === 'preparing').length },
    { label: 'Delivered', value: stats.completedOrders },
    { label: 'Cancelled', value: stats.cancelledOrders },
  ], [orders, stats])

  const bestSellingCakes = useMemo(() => {
    const cakeCount = {}
    orders.forEach(o => {
      const items = typeof o.items === 'string' ? JSON.parse(o.items) : o.items
      if (Array.isArray(items)) {
        items.forEach(item => {
          if (!cakeCount[item.name]) cakeCount[item.name] = { name: item.name, qty: 0, revenue: 0 }
          cakeCount[item.name].qty += item.quantity || 1
          cakeCount[item.name].revenue += (item.price || 0) * (item.quantity || 1)
        })
      }
    })
    return Object.values(cakeCount).sort((a, b) => b.qty - a.qty).slice(0, 10)
  }, [orders])

  const topCustomers = useMemo(() => {
    const custData = {}
    orders.forEach(o => {
      if (!custData[o.customer_email]) custData[o.customer_email] = { name: o.customer_name, email: o.customer_email, orders: 0, spent: 0 }
      custData[o.customer_email].orders++
      custData[o.customer_email].spent += parseFloat(o.total) || 0
    })
    return Object.values(custData).sort((a, b) => b.spent - a.spent).slice(0, 10)
  }, [orders])

  const customCakeStats = useMemo(() => {
    const flavors = {}, sizes = {}, designs = {}
    customOrders.forEach(o => {
      if (o.flavour) flavors[o.flavour] = (flavors[o.flavour] || 0) + 1
      if (o.cake_size) sizes[o.cake_size] = (sizes[o.cake_size] || 0) + 1
      if (o.design_style) designs[o.design_style] = (designs[o.design_style] || 0) + 1
    })
    const topFlavor = Object.entries(flavors).sort((a, b) => b[1] - a[1])[0]
    const topSize = Object.entries(sizes).sort((a, b) => b[1] - a[1])[0]
    const topDesign = Object.entries(designs).sort((a, b) => b[1] - a[1])[0]
    return { total: customOrders.length, topFlavor: topFlavor?.[0] || '-', topSize: topSize?.[0] || '-', topDesign: topDesign?.[0] || '-' }
  }, [customOrders])

  const exportCSV = (headers, rows, filename) => {
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  const exportOrdersCSV = () => {
    const headers = ['Order ID', 'Customer', 'Phone', 'Items', 'Total', 'Payment', 'Status', 'Date']
    const rows = orders.map(o => [o.order_id, o.customer_name, o.customer_phone, JSON.stringify(o.items), o.total, o.payment_method, o.order_status, new Date(o.created_at).toLocaleDateString()])
    exportCSV(headers, rows, `orders-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const exportCustomersCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'City', 'Registered']
    const rows = customers.map(c => [c.full_name, c.email, c.phone || '', c.city || '', new Date(c.created_at).toLocaleDateString()])
    exportCSV(headers, rows, `customers-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const maxMonthlyRevenue = Math.max(...monthlyRevenue.map(m => m.value), 1)
  const maxOrdersPerMonth = Math.max(...ordersPerMonth.map(m => m.value), 1)

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:ml-72 flex items-center justify-center min-h-screen">
          <div className="text-center"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" /><p className="text-warm-gray text-sm mt-3">Loading reports...</p></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur-sm border-b border-cream-dark/30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-card border border-cream-dark/30"><Menu className="w-5 h-5 text-chocolate" /></button>
            <h1 className="font-display text-xl font-bold text-chocolate">Reports & Analytics</h1>
            <button onClick={fetchData} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-cream-dark/30 text-sm text-chocolate hover:bg-cream-dark transition-colors"><RefreshCw className="w-4 h-4" /><span className="hidden sm:inline">Refresh</span></button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={TrendingUp} color="bg-emerald-100 text-emerald-600" />
            <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} color="bg-blue-100 text-blue-600" />
            <StatCard title="Completed" value={stats.completedOrders} icon={Package} color="bg-green-100 text-green-600" />
            <StatCard title="Pending" value={stats.pendingOrders} icon={Activity} color="bg-amber-100 text-amber-600" />
            <StatCard title="Cancelled" value={stats.cancelledOrders} icon={PieChart} color="bg-red-100 text-red-600" />
            <StatCard title="Customers" value={stats.totalCustomers} icon={UsersIcon} color="bg-purple-100 text-purple-600" />
          </div>

          {/* Revenue Report */}
          <ReportCard title="Revenue Report" icon={TrendingUp}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-cream/50 rounded-xl p-4 text-center"><p className="text-[10px] text-warm-gray">Today</p><p className="text-lg font-bold text-chocolate">₹{stats.todayRevenue.toLocaleString()}</p></div>
              <div className="bg-cream/50 rounded-xl p-4 text-center"><p className="text-[10px] text-warm-gray">This Week</p><p className="text-lg font-bold text-chocolate">₹{stats.weekRevenue.toLocaleString()}</p></div>
              <div className="bg-cream/50 rounded-xl p-4 text-center"><p className="text-[10px] text-warm-gray">This Month</p><p className="text-lg font-bold text-chocolate">₹{stats.monthRevenue.toLocaleString()}</p></div>
              <div className="bg-cream/50 rounded-xl p-4 text-center"><p className="text-[10px] text-warm-gray">This Year</p><p className="text-lg font-bold text-chocolate">₹{stats.yearRevenue.toLocaleString()}</p></div>
            </div>
          </ReportCard>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportCard title="Monthly Revenue" icon={BarChart3}>
              <BarChart data={monthlyRevenue} maxValue={maxMonthlyRevenue} color="#10B981" />
            </ReportCard>
            <ReportCard title="Orders Per Month" icon={Activity}>
              <BarChart data={ordersPerMonth} maxValue={maxOrdersPerMonth} color="#3B82F6" />
            </ReportCard>
          </div>

          {/* Order Status */}
          <ReportCard title="Order Status Distribution" icon={PieChart}>
            <PieChartSimple segments={orderStatusData} total={stats.totalOrders} />
          </ReportCard>

          {/* Best Selling Cakes */}
          <ReportCard title="Best Selling Cakes" icon={Award} onExport={exportOrdersCSV} exportLabel="Export Orders">
            {bestSellingCakes.length === 0 ? (
              <p className="text-center text-warm-gray text-sm py-8">No order data yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-cream-dark/30"><th className="text-left px-4 py-2 text-[10px] font-semibold text-warm-gray uppercase">#</th><th className="text-left px-4 py-2 text-[10px] font-semibold text-warm-gray uppercase">Cake</th><th className="text-left px-4 py-2 text-[10px] font-semibold text-warm-gray uppercase">Qty Sold</th><th className="text-left px-4 py-2 text-[10px] font-semibold text-warm-gray uppercase">Revenue</th></tr></thead>
                  <tbody>{bestSellingCakes.map((cake, i) => (
                    <tr key={i} className="border-b border-cream-dark/20 last:border-0"><td className="px-4 py-3 text-xs font-medium text-chocolate">{i + 1}</td><td className="px-4 py-3 text-xs text-charcoal/70">{cake.name}</td><td className="px-4 py-3 text-xs font-medium text-chocolate">{cake.qty}</td><td className="px-4 py-3 text-xs font-semibold text-chocolate">₹{cake.revenue.toLocaleString()}</td></tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </ReportCard>

          {/* Custom Cake Report */}
          <ReportCard title="Custom Cake Report" icon={Package}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-cream/50 rounded-xl p-4 text-center"><p className="text-[10px] text-warm-gray">Total Orders</p><p className="text-lg font-bold text-chocolate">{customCakeStats.total}</p></div>
              <div className="bg-cream/50 rounded-xl p-4 text-center"><p className="text-[10px] text-warm-gray">Top Flavor</p><p className="text-sm font-bold text-chocolate">{customCakeStats.topFlavor}</p></div>
              <div className="bg-cream/50 rounded-xl p-4 text-center"><p className="text-[10px] text-warm-gray">Top Size</p><p className="text-sm font-bold text-chocolate">{customCakeStats.topSize}</p></div>
              <div className="bg-cream/50 rounded-xl p-4 text-center"><p className="text-[10px] text-warm-gray">Top Design</p><p className="text-sm font-bold text-chocolate">{customCakeStats.topDesign}</p></div>
            </div>
          </ReportCard>

          {/* Top Customers */}
          <ReportCard title="Top Customers" icon={UsersIcon} onExport={exportCustomersCSV} exportLabel="Export Customers">
            {topCustomers.length === 0 ? (
              <p className="text-center text-warm-gray text-sm py-8">No customer data yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-cream-dark/30"><th className="text-left px-4 py-2 text-[10px] font-semibold text-warm-gray uppercase">#</th><th className="text-left px-4 py-2 text-[10px] font-semibold text-warm-gray uppercase">Customer</th><th className="text-left px-4 py-2 text-[10px] font-semibold text-warm-gray uppercase">Orders</th><th className="text-left px-4 py-2 text-[10px] font-semibold text-warm-gray uppercase">Total Spent</th></tr></thead>
                  <tbody>{topCustomers.map((c, i) => (
                    <tr key={i} className="border-b border-cream-dark/20 last:border-0"><td className="px-4 py-3 text-xs font-medium text-chocolate">{i + 1}</td><td className="px-4 py-3"><p className="text-xs font-medium text-chocolate">{c.name}</p><p className="text-[10px] text-warm-gray">{c.email}</p></td><td className="px-4 py-3 text-xs font-medium text-chocolate">{c.orders}</td><td className="px-4 py-3 text-xs font-semibold text-chocolate">₹{c.spent.toLocaleString()}</td></tr>
                  ))}</tbody>
                </table>
              </div>
            )}
          </ReportCard>
        </main>
      </div>
    </div>
  )
}
