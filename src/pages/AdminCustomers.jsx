import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package, Users, Star, BarChart3,
  LogOut, Menu, ChevronRight, Search, Filter, Trash2, Eye, RefreshCw,
  AlertCircle, Check, X as XIcon, Mail, Phone, Clock, ArrowUp, ArrowDown,
  Ban, CheckCircle, ShoppingBag, MessageSquareText, Star as StarIcon
} from 'lucide-react'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import { supabase } from '../lib/supabase'

const sidebarLinks = [
  { to: '/admin/cakes', label: 'Cakes', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Package },
  { to: '/admin/flavors', label: 'Flavors', icon: Package },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
]

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

function StatusBadge({ active }) {
  return active
    ? <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-green-100 text-green-700">Active</span>
    : <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-red-100 text-red-700">Blocked</span>
}

function CustomerDetailModal({ customer, onClose, onBlock, onDelete, orders, customOrders, reviews, messages }) {
  const [activeTab, setActiveTab] = useState('overview')

  if (!customer) return null

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
    { id: 'custom', label: `Custom (${customOrders.length})`, icon: Package },
    { id: 'reviews', label: `Reviews (${reviews.length})`, icon: StarIcon },
    { id: 'messages', label: `Messages (${messages.length})`, icon: MessageSquareText },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-cream-dark/30">
          <h2 className="font-display text-xl font-bold text-chocolate">Customer Profile</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-cream flex items-center justify-center hover:bg-cream-dark transition-colors"><XIcon className="w-4 h-4 text-chocolate" /></button>
        </div>

        {/* Customer Header */}
        <div className="p-6 border-b border-cream-dark/30">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center flex-shrink-0">
              <span className="text-chocolate text-xl font-bold">{customer.full_name?.[0]?.toUpperCase()}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <p className="text-lg font-semibold text-chocolate">{customer.full_name}</p>
                <StatusBadge active={customer.is_active !== false} />
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs text-warm-gray">
                <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{customer.email}</span>
                {customer.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{customer.phone}</span>}
              </div>
              {customer.address && <p className="text-xs text-warm-gray mt-1">{customer.address}{customer.city ? `, ${customer.city}` : ''}{customer.state ? `, ${customer.state}` : ''}{customer.pincode ? ` - ${customer.pincode}` : ''}</p>}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-cream-dark/30 px-6 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-gold text-gold' : 'border-transparent text-warm-gray hover:text-chocolate'}`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-cream/50 rounded-xl p-4 text-center"><p className="text-[10px] text-warm-gray">Total Orders</p><p className="text-xl font-bold text-chocolate">{orders.length}</p></div>
                <div className="bg-cream/50 rounded-xl p-4 text-center"><p className="text-[10px] text-warm-gray">Total Spent</p><p className="text-xl font-bold text-chocolate">₹{orders.reduce((s, o) => s + (parseFloat(o.total) || 0), 0).toLocaleString()}</p></div>
                <div className="bg-cream/50 rounded-xl p-4 text-center"><p className="text-[10px] text-warm-gray">Custom Orders</p><p className="text-xl font-bold text-chocolate">{customOrders.length}</p></div>
                <div className="bg-cream/50 rounded-xl p-4 text-center"><p className="text-[10px] text-warm-gray">Reviews</p><p className="text-xl font-bold text-chocolate">{reviews.length}</p></div>
              </div>
              <div className="bg-cream/50 rounded-xl p-4">
                <p className="text-[10px] text-warm-gray mb-1">Registered</p>
                <p className="text-sm font-medium text-chocolate">{new Date(customer.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-3">
              {orders.length === 0 ? <p className="text-center text-warm-gray text-sm py-8">No orders yet</p> : orders.map(order => (
                <div key={order.id} className="bg-cream/50 rounded-xl p-4 flex items-center justify-between">
                  <div><p className="text-xs font-medium text-chocolate">{order.order_id}</p><p className="text-[10px] text-warm-gray">{new Date(order.created_at).toLocaleDateString()}</p></div>
                  <div className="text-right"><p className="text-sm font-semibold text-chocolate">₹{order.total}</p><span className={`text-[10px] px-2 py-0.5 rounded-full ${order.order_status === 'delivered' ? 'bg-green-100 text-green-700' : order.order_status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{order.order_status}</span></div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-3">
              {customOrders.length === 0 ? <p className="text-center text-warm-gray text-sm py-8">No custom orders</p> : customOrders.map(order => (
                <div key={order.id} className="bg-cream/50 rounded-xl p-4 flex items-center justify-between">
                  <div><p className="text-xs font-medium text-chocolate">{order.order_id}</p><p className="text-[10px] text-warm-gray">{order.cake_type} - {order.flavour}</p></div>
                  <div className="text-right"><p className="text-sm font-semibold text-chocolate">₹{order.final_price || order.estimated_price || '-'}</p><span className={`text-[10px] px-2 py-0.5 rounded-full ${order.order_status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{order.order_status}</span></div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-3">
              {reviews.length === 0 ? <p className="text-center text-warm-gray text-sm py-8">No reviews</p> : reviews.map(review => (
                <div key={review.id} className="bg-cream/50 rounded-xl p-4">
                  <div className="flex items-center gap-1 mb-2">{Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-gold fill-gold' : 'text-cream-dark'}`} />)}</div>
                  <p className="text-xs text-charcoal/70">{review.comment}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-3">
              {messages.length === 0 ? <p className="text-center text-warm-gray text-sm py-8">No messages</p> : messages.map(msg => (
                <div key={msg.id} className="bg-cream/50 rounded-xl p-4">
                  <p className="text-xs font-medium text-chocolate mb-1">{msg.subject || 'No subject'}</p>
                  <p className="text-xs text-charcoal/70 line-clamp-2">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-cream-dark/30 flex gap-3">
          <button onClick={() => { onBlock(customer.id, customer.is_active !== false); onClose() }} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-colors ${customer.is_active !== false ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
            {customer.is_active !== false ? <><Ban className="w-4 h-4" />Block Customer</> : <><CheckCircle className="w-4 h-4" />Unblock Customer</>}
          </button>
          <button onClick={() => { onDelete(customer.id); onClose() }} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200 transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function AdminCustomers() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customerData, setCustomerData] = useState({ orders: [], customOrders: [], reviews: [], messages: [] })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [loadingCustomer, setLoadingCustomer] = useState(false)

  useEffect(() => { fetchCustomers() }, [])

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setCustomers(data || [])
    } catch (error) { console.error('Fetch customers error:', error) } finally { setLoading(false) }
  }

  const filteredCustomers = useMemo(() => {
    let result = customers.filter((c) => {
      const search = `${c.full_name} ${c.email} ${c.phone || ''}`.toLowerCase()
      const matchesSearch = search.includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' && c.is_active !== false) || (statusFilter === 'blocked' && c.is_active === false)
      return matchesSearch && matchesStatus
    })
    result.sort((a, b) => sortOrder === 'newest'
      ? new Date(b.created_at) - new Date(a.created_at)
      : new Date(a.created_at) - new Date(b.created_at)
    )
    return result
  }, [customers, searchQuery, statusFilter, sortOrder])

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE)
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  useEffect(() => { setCurrentPage(1) }, [searchQuery, statusFilter, sortOrder])

  const loadCustomerData = async (customer) => {
    setLoadingCustomer(true)
    setSelectedCustomer(customer)
    try {
      const [ordersRes, customRes, reviewsRes, messagesRes] = await Promise.all([
        supabase.from('orders').select('*').eq('customer_email', customer.email).order('created_at', { ascending: false }),
        supabase.from('custom_orders').select('*').eq('customer_email', customer.email).order('created_at', { ascending: false }),
        supabase.from('reviews').select('*').eq('customer_name', customer.full_name).order('created_at', { ascending: false }),
        supabase.from('contact_messages').select('*').eq('email', customer.email).order('created_at', { ascending: false }),
      ])
      setCustomerData({
        orders: ordersRes.data || [],
        customOrders: customRes.data || [],
        reviews: reviewsRes.data || [],
        messages: messagesRes.data || [],
      })
    } catch (error) { console.error('Load customer data error:', error) }
    finally { setLoadingCustomer(false) }
  }

  const handleBlock = async (customerId, isCurrentlyActive) => {
    try {
      const { error } = await supabase.from('customers').update({ is_active: !isCurrentlyActive }).eq('id', customerId)
      if (error) throw error
      setCustomers(customers.map(c => c.id === customerId ? { ...c, is_active: !isCurrentlyActive } : c))
    } catch (error) { console.error('Block/unblock error:', error) }
  }

  const handleDelete = async (customerId) => {
    try {
      const { error } = await supabase.from('customers').delete().eq('id', customerId)
      if (error) throw error
      setCustomers(customers.filter(c => c.id !== customerId))
      setShowDeleteConfirm(null)
    } catch (error) { console.error('Delete error:', error) }
  }

  const stats = useMemo(() => ({
    total: customers.length,
    active: customers.filter(c => c.is_active !== false).length,
    blocked: customers.filter(c => c.is_active === false).length,
    thisMonth: customers.filter(c => { const d = new Date(c.created_at); const now = new Date(); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() }).length,
  }), [customers])

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur-sm border-b border-cream-dark/30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-card border border-cream-dark/30"><Menu className="w-5 h-5 text-chocolate" /></button>
            <h1 className="font-display text-xl font-bold text-chocolate">Customers</h1>
            <button onClick={fetchCustomers} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-cream-dark/30 text-sm text-chocolate hover:bg-cream-dark transition-colors"><RefreshCw className="w-4 h-4" /><span className="hidden sm:inline">Refresh</span></button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[{ label: 'Total', value: stats.total, color: 'text-chocolate' },
              { label: 'Active', value: stats.active, color: 'text-green-600' },
              { label: 'Blocked', value: stats.blocked, color: 'text-red-600' },
              { label: 'This Month', value: stats.thisMonth, color: 'text-gold' }
            ].map(s => (
              <div key={s.label} className="bg-card rounded-xl p-3 border border-cream-dark/30 text-center">
                <p className="text-[10px] text-warm-gray">{s.label}</p>
                <p className={`font-display text-xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" /><input type="text" placeholder="Search by name, email, or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-cream-dark bg-card text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" /></div>
            <div className="relative"><Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" /><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="pl-10 pr-8 py-3 rounded-xl border border-cream-dark bg-card text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 appearance-none cursor-pointer"><option value="all">All Status</option><option value="active">Active</option><option value="blocked">Blocked</option></select></div>
            <button onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-cream-dark bg-card text-sm text-chocolate hover:bg-cream-dark transition-colors">
              {sortOrder === 'newest' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
              {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
            </button>
          </div>

          {/* Table */}
          <div className="bg-card rounded-2xl shadow-sm border border-cream-dark/30 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" /><p className="text-warm-gray text-sm mt-3">Loading customers...</p></div>
            ) : paginatedCustomers.length === 0 ? (
              <div className="p-12 text-center"><Users className="w-12 h-12 text-warm-gray/40 mx-auto mb-3" /><p className="text-warm-gray text-sm">No customers found</p></div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-cream-dark/30">
                        <th className="text-left px-4 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Customer</th>
                        <th className="text-left px-4 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Status</th>
                        <th className="text-left px-4 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Joined</th>
                        <th className="text-right px-4 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCustomers.map((customer) => (
                        <tr key={customer.id} className="border-b border-cream-dark/20 last:border-0 hover:bg-cream/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center flex-shrink-0"><span className="text-chocolate text-sm font-bold">{customer.full_name?.[0]?.toUpperCase()}</span></div>
                              <div>
                                <p className="text-xs font-medium text-chocolate">{customer.full_name}</p>
                                <p className="text-[10px] text-warm-gray">{customer.email}</p>
                                {customer.phone && <p className="text-[10px] text-warm-gray">{customer.phone}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3"><StatusBadge active={customer.is_active !== false} /></td>
                          <td className="px-4 py-3 text-[10px] text-warm-gray">{new Date(customer.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1.5">
                              <button onClick={() => loadCustomerData(customer)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                              <button onClick={() => setShowDeleteConfirm(customer.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-cream-dark/30">
                    <p className="text-xs text-warm-gray">Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredCustomers.length)} of {filteredCustomers.length} customers</p>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-cream-dark text-chocolate hover:bg-cream-dark disabled:opacity-40 transition-colors">Prev</button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${currentPage === page ? 'bg-chocolate text-white' : 'border border-cream-dark text-chocolate hover:bg-cream-dark'}`}>{page}</button>
                      ))}
                      <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded-lg text-xs font-medium border border-cream-dark text-chocolate hover:bg-cream-dark disabled:opacity-40 transition-colors">Next</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <AnimatePresence>{selectedCustomer && <CustomerDetailModal customer={selectedCustomer} onClose={() => { setSelectedCustomer(null); setCustomerData({ orders: [], customOrders: [], reviews: [], messages: [] }) }} onBlock={handleBlock} onDelete={(id) => setShowDeleteConfirm(id)} orders={customerData.orders} customOrders={customerData.customOrders} reviews={customerData.reviews} messages={customerData.messages} />}</AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><AlertCircle className="w-6 h-6 text-red-600" /></div>
                <h3 className="font-display text-lg font-bold text-chocolate mb-2">Delete this customer?</h3>
                <p className="text-sm text-warm-gray mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-cream-dark text-sm font-medium text-chocolate hover:bg-cream-dark transition-colors">Cancel</button>
                  <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors">Delete</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
