import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, Package, Users, Star,
  LogOut, Menu, ChevronRight, Search, Filter, Trash2, Eye, RefreshCw,
  AlertCircle, Clock, CheckCircle, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown,
  X, Phone, Mail, CreditCard, Calendar
} from 'lucide-react'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import { supabase } from '../lib/supabase'

const sidebarLinks = [
  { to: '/admin/cakes', label: 'Cakes', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Package },
  { to: '/admin/flavors', label: 'Flavors', icon: Package },
  { to: '/admin/customers', label: 'Customers', icon: Users },
]

const ORDER_STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']
const ITEMS_PER_PAGE = 10

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

function OrderStatusBadge({ status }) {
  const styles = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    preparing: 'bg-purple-100 text-purple-700',
    ready: 'bg-emerald-100 text-emerald-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }
  return <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${styles[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function OrderDetailModal({ order, onClose, onUpdateStatus }) {
  if (!order) return null
  const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-cream-dark/30">
          <div>
            <h2 className="font-display text-xl font-bold text-chocolate">Order Details</h2>
            <p className="text-xs text-warm-gray mt-0.5">{order.order_id}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-cream flex items-center justify-center hover:bg-cream-dark transition-colors"><X className="w-4 h-4 text-chocolate" /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-cream/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2"><Mail className="w-4 h-4 text-warm-gray" /><span className="text-xs text-warm-gray">Customer</span></div>
              <p className="text-sm font-semibold text-chocolate">{order.customer_name}</p>
              <p className="text-xs text-warm-gray">{order.customer_email}</p>
            </div>
            <div className="bg-cream/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2"><Phone className="w-4 h-4 text-warm-gray" /><span className="text-xs text-warm-gray">Phone</span></div>
              <p className="text-sm font-semibold text-chocolate">{order.customer_phone}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs text-warm-gray mb-2">Order Items</p>
            <div className="bg-cream/50 rounded-xl p-4 space-y-3">
              {Array.isArray(items) && items.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-chocolate">{item.name}</p>
                    <p className="text-[10px] text-warm-gray">
                      {item.flavor && `Flavor: ${item.flavor}`}
                      {item.flavor && item.weight && ' | '}
                      {item.weight && `Weight: ${item.weight}`}
                      {item.quantity && ` | Qty: ${item.quantity}`}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-chocolate">₹{item.price * (item.quantity || 1)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-cream/50 rounded-xl p-4 text-center">
              <p className="text-[10px] text-warm-gray mb-1">Subtotal</p>
              <p className="text-sm font-semibold text-chocolate">₹{order.subtotal || order.total}</p>
            </div>
            <div className="bg-cream/50 rounded-xl p-4 text-center">
              <p className="text-[10px] text-warm-gray mb-1">Shipping</p>
              <p className="text-sm font-semibold text-chocolate">₹{order.shipping || 0}</p>
            </div>
            <div className="bg-cream/50 rounded-xl p-4 text-center">
              <p className="text-[10px] text-warm-gray mb-1">Total</p>
              <p className="text-sm font-bold text-chocolate">₹{order.total}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex items-center gap-2 text-sm text-charcoal/70">
            <CreditCard className="w-4 h-4" />
            <span>Payment: <span className="font-medium text-chocolate uppercase">{order.payment_method}</span></span>
          </div>

          {/* Update Status */}
          <div>
            <p className="text-xs text-warm-gray mb-2">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {ORDER_STATUSES.map((status) => (
                <button
                  key={status}
                  onClick={() => onUpdateStatus(order.id, status)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    order.order_status === status ? 'bg-chocolate text-white' : 'bg-cream text-charcoal/60 hover:bg-cream-dark border border-cream-dark'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function AdminOrders() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setOrders(data || [])
    } catch (error) { console.error('Fetch orders error:', error) } finally { setLoading(false) }
  }

  const filteredOrders = useMemo(() => {
    let result = orders.filter((order) => {
      const search = `${order.order_id} ${order.customer_name} ${order.customer_phone}`.toLowerCase()
      const matchesSearch = search.includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || order.order_status === statusFilter
      return matchesSearch && matchesStatus
    })
    result.sort((a, b) => sortOrder === 'newest'
      ? new Date(b.created_at) - new Date(a.created_at)
      : new Date(a.created_at) - new Date(b.created_at)
    )
    return result
  }, [orders, searchQuery, statusFilter, sortOrder])

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  useEffect(() => { setCurrentPage(1) }, [searchQuery, statusFilter, sortOrder])

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase.from('orders').update({ order_status: newStatus }).eq('id', orderId)
      if (error) throw error
      setOrders(orders.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o))
      if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, order_status: newStatus })
    } catch (error) { console.error('Update status error:', error) }
  }

  const handleDeleteOrder = async (orderId) => {
    try {
      const { error } = await supabase.from('orders').delete().eq('id', orderId)
      if (error) throw error
      setOrders(orders.filter(o => o.id !== orderId))
      setShowDeleteConfirm(null)
    } catch (error) { console.error('Delete order error:', error) }
  }

  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter(o => o.order_status === 'pending').length,
    confirmed: orders.filter(o => o.order_status === 'confirmed').length,
    preparing: orders.filter(o => o.order_status === 'preparing').length,
    delivered: orders.filter(o => o.order_status === 'delivered').length,
    cancelled: orders.filter(o => o.order_status === 'cancelled').length,
  }), [orders])

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur-sm border-b border-cream-dark/30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-card border border-cream-dark/30"><Menu className="w-5 h-5 text-chocolate" /></button>
            <h1 className="font-display text-xl font-bold text-chocolate">Orders</h1>
            <button onClick={fetchOrders} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-cream-dark/30 text-sm text-chocolate hover:bg-cream-dark transition-colors"><RefreshCw className="w-4 h-4" /><span className="hidden sm:inline">Refresh</span></button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Stats */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
            {[{ label: 'Total', value: stats.total, color: 'text-chocolate' },
              { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
              { label: 'Confirmed', value: stats.confirmed, color: 'text-blue-600' },
              { label: 'Preparing', value: stats.preparing, color: 'text-purple-600' },
              { label: 'Delivered', value: stats.delivered, color: 'text-green-600' },
              { label: 'Cancelled', value: stats.cancelled, color: 'text-red-600' }
            ].map(s => (
              <div key={s.label} className="bg-card rounded-xl p-3 border border-cream-dark/30 text-center">
                <p className="text-[10px] text-warm-gray">{s.label}</p>
                <p className={`font-display text-xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" /><input type="text" placeholder="Search by ID, name, or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-cream-dark bg-card text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" /></div>
            <div className="relative"><Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" /><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="pl-10 pr-8 py-3 rounded-xl border border-cream-dark bg-card text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 appearance-none cursor-pointer"><option value="all">All Status</option>{ORDER_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}</select></div>
            <button onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-cream-dark bg-card text-sm text-chocolate hover:bg-cream-dark transition-colors">
              {sortOrder === 'newest' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
              {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
            </button>
          </div>

          {/* Table */}
          <div className="bg-card rounded-2xl shadow-sm border border-cream-dark/30 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" /><p className="text-warm-gray text-sm mt-3">Loading orders...</p></div>
            ) : paginatedOrders.length === 0 ? (
              <div className="p-12 text-center"><ShoppingCart className="w-12 h-12 text-warm-gray/40 mx-auto mb-3" /><p className="text-warm-gray text-sm">No orders found</p></div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-cream-dark/30">
                        <th className="text-left px-4 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Order ID</th>
                        <th className="text-left px-4 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Customer</th>
                        <th className="text-left px-4 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Items</th>
                        <th className="text-left px-4 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Total</th>
                        <th className="text-left px-4 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Payment</th>
                        <th className="text-left px-4 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Status</th>
                        <th className="text-left px-4 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Date</th>
                        <th className="text-right px-4 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedOrders.map((order) => {
                        const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items
                        const itemCount = Array.isArray(items) ? items.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0
                        return (
                          <tr key={order.id} className="border-b border-cream-dark/20 last:border-0 hover:bg-cream/50 transition-colors">
                            <td className="px-4 py-3 text-xs font-medium text-chocolate">{order.order_id}</td>
                            <td className="px-4 py-3">
                              <p className="text-xs font-medium text-chocolate">{order.customer_name}</p>
                              <p className="text-[10px] text-warm-gray">{order.customer_phone}</p>
                            </td>
                            <td className="px-4 py-3 text-xs text-charcoal/70">{itemCount} item(s)</td>
                            <td className="px-4 py-3 text-xs font-semibold text-chocolate">₹{order.total}</td>
                            <td className="px-4 py-3 text-[10px] text-warm-gray uppercase">{order.payment_method}</td>
                            <td className="px-4 py-3"><OrderStatusBadge status={order.order_status} /></td>
                            <td className="px-4 py-3 text-[10px] text-warm-gray">{new Date(order.created_at).toLocaleDateString()}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1.5">
                                <button onClick={() => setSelectedOrder(order)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                                <button onClick={() => setShowDeleteConfirm(order.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-cream-dark/30">
                    <p className="text-xs text-warm-gray">
                      Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders
                    </p>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-cream-dark text-chocolate hover:bg-cream-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Prev</button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${currentPage === page ? 'bg-chocolate text-white' : 'border border-cream-dark text-chocolate hover:bg-cream-dark'}`}>{page}</button>
                      ))}
                      <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-cream-dark text-chocolate hover:bg-cream-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Next</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <AnimatePresence>{selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdateStatus={handleUpdateStatus} />}</AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><AlertCircle className="w-6 h-6 text-red-600" /></div>
                <h3 className="font-display text-lg font-bold text-chocolate mb-2">Delete this order?</h3>
                <p className="text-sm text-warm-gray mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-cream-dark text-sm font-medium text-chocolate hover:bg-cream-dark transition-colors">Cancel</button>
                  <button onClick={() => handleDeleteOrder(showDeleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors">Delete</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
