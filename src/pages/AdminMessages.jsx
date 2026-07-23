import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package, Users,
  LogOut, Menu, ChevronRight, Search, Filter, Trash2, Eye, RefreshCw,
  AlertCircle, Check, X as XIcon, Mail, Phone, Clock, ArrowUp, ArrowDown
} from 'lucide-react'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import { supabase } from '../lib/supabase'

const sidebarLinks = [
  { to: '/admin/cakes', label: 'Cakes', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Package },
  { to: '/admin/flavors', label: 'Flavors', icon: Package },
  { to: '/admin/customers', label: 'Customers', icon: Users },
]

const STATUS_OPTIONS = ['new', 'read', 'replied']
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

function MessageStatusBadge({ status }) {
  const styles = {
    new: 'bg-blue-100 text-blue-700',
    read: 'bg-amber-100 text-amber-700',
    replied: 'bg-green-100 text-green-700',
  }
  return <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${styles[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function MessageDetailModal({ message, onClose, onMarkRead, onMarkReplied }) {
  if (!message) return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-cream-dark/30">
          <h2 className="font-display text-xl font-bold text-chocolate">Message Details</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-cream flex items-center justify-center hover:bg-cream-dark transition-colors"><XIcon className="w-4 h-4 text-chocolate" /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Sender Info */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center flex-shrink-0">
              <span className="text-chocolate text-lg font-bold">{message.full_name?.[0]?.toUpperCase()}</span>
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-chocolate">{message.full_name}</p>
              <div className="flex items-center gap-2 mt-1"><Mail className="w-3 h-3 text-warm-gray" /><p className="text-xs text-warm-gray">{message.email}</p></div>
              {message.phone && <div className="flex items-center gap-2 mt-1"><Phone className="w-3 h-3 text-warm-gray" /><p className="text-xs text-warm-gray">{message.phone}</p></div>}
            </div>
          </div>

          {/* Subject */}
          {message.subject && (
            <div className="bg-cream/50 rounded-xl p-4">
              <p className="text-[10px] text-warm-gray mb-1">Subject</p>
              <p className="text-sm font-medium text-chocolate">{message.subject}</p>
            </div>
          )}

          {/* Message */}
          <div className="bg-cream/50 rounded-xl p-5">
            <p className="text-[10px] text-warm-gray mb-2">Message</p>
            <p className="text-sm text-charcoal/80 leading-relaxed whitespace-pre-wrap">{message.message}</p>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-cream/50 rounded-xl p-4 text-center">
              <p className="text-[10px] text-warm-gray mb-1">Status</p>
              <MessageStatusBadge status={message.status || (message.read ? 'read' : 'new')} />
            </div>
            <div className="bg-cream/50 rounded-xl p-4 text-center">
              <p className="text-[10px] text-warm-gray mb-1">Submitted</p>
              <p className="text-sm font-medium text-chocolate">{new Date(message.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {(!message.status || message.status === 'new') && (
              <button onClick={() => { onMarkRead(message.id); onClose() }} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-colors"><Eye className="w-4 h-4" />Mark as Read</button>
            )}
            {(!message.status || message.status !== 'replied') && (
              <button onClick={() => { onMarkReplied(message.id); onClose() }} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"><Check className="w-4 h-4" />Mark as Replied</button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function AdminMessages() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  useEffect(() => { fetchMessages() }, [])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setMessages(data || [])
    } catch (error) { console.error('Fetch messages error:', error) } finally { setLoading(false) }
  }

  const filteredMessages = useMemo(() => {
    let result = messages.filter((msg) => {
      const search = `${msg.full_name} ${msg.email} ${msg.phone || ''}`.toLowerCase()
      const matchesSearch = search.includes(searchQuery.toLowerCase())
      const msgStatus = msg.status || (msg.read ? 'read' : 'new')
      const matchesStatus = statusFilter === 'all' || msgStatus === statusFilter
      return matchesSearch && matchesStatus
    })
    result.sort((a, b) => sortOrder === 'newest'
      ? new Date(b.created_at) - new Date(a.created_at)
      : new Date(a.created_at) - new Date(b.created_at)
    )
    return result
  }, [messages, searchQuery, statusFilter, sortOrder])

  const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE)
  const paginatedMessages = filteredMessages.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  useEffect(() => { setCurrentPage(1) }, [searchQuery, statusFilter, sortOrder])

  const handleMarkRead = async (msgId) => {
    try {
      const { error } = await supabase.from('contact_messages').update({ read: true, status: 'read' }).eq('id', msgId)
      if (error) throw error
      setMessages(messages.map(m => m.id === msgId ? { ...m, read: true, status: 'read' } : m))
    } catch (error) { console.error('Mark read error:', error) }
  }

  const handleMarkReplied = async (msgId) => {
    try {
      const { error } = await supabase.from('contact_messages').update({ read: true, status: 'replied' }).eq('id', msgId)
      if (error) throw error
      setMessages(messages.map(m => m.id === msgId ? { ...m, read: true, status: 'replied' } : m))
    } catch (error) { console.error('Mark replied error:', error) }
  }

  const handleDelete = async (msgId) => {
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', msgId)
      if (error) throw error
      setMessages(messages.filter(m => m.id !== msgId))
      setShowDeleteConfirm(null)
    } catch (error) { console.error('Delete error:', error) }
  }

  const stats = useMemo(() => ({
    total: messages.length,
    new: messages.filter(m => !m.read && m.status !== 'read' && m.status !== 'replied').length,
    read: messages.filter(m => m.status === 'read' || (m.read && m.status !== 'replied')).length,
    replied: messages.filter(m => m.status === 'replied').length,
  }), [messages])

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur-sm border-b border-cream-dark/30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-card border border-cream-dark/30"><Menu className="w-5 h-5 text-chocolate" /></button>
            <h1 className="font-display text-xl font-bold text-chocolate">Messages</h1>
            <button onClick={fetchMessages} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-cream-dark/30 text-sm text-chocolate hover:bg-cream-dark transition-colors"><RefreshCw className="w-4 h-4" /><span className="hidden sm:inline">Refresh</span></button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[{ label: 'Total', value: stats.total, color: 'text-chocolate' },
              { label: 'New', value: stats.new, color: 'text-blue-600' },
              { label: 'Read', value: stats.read, color: 'text-amber-600' },
              { label: 'Replied', value: stats.replied, color: 'text-green-600' }
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
            <div className="relative"><Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" /><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="pl-10 pr-8 py-3 rounded-xl border border-cream-dark bg-card text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 appearance-none cursor-pointer"><option value="all">All Status</option>{STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}</select></div>
            <button onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-cream-dark bg-card text-sm text-chocolate hover:bg-cream-dark transition-colors">
              {sortOrder === 'newest' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
              {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
            </button>
          </div>

          {/* Messages Table */}
          <div className="bg-card rounded-2xl shadow-sm border border-cream-dark/30 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" /><p className="text-warm-gray text-sm mt-3">Loading messages...</p></div>
            ) : paginatedMessages.length === 0 ? (
              <div className="p-12 text-center"><Mail className="w-12 h-12 text-warm-gray/40 mx-auto mb-3" /><p className="text-warm-gray text-sm">No messages found</p></div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-cream-dark/30">
                        <th className="text-left px-4 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Contact</th>
                        <th className="text-left px-4 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Subject</th>
                        <th className="text-left px-4 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Message</th>
                        <th className="text-left px-4 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Status</th>
                        <th className="text-left px-4 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Date</th>
                        <th className="text-right px-4 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedMessages.map((msg) => {
                        const msgStatus = msg.status || (msg.read ? 'read' : 'new')
                        return (
                          <tr key={msg.id} className={`border-b border-cream-dark/20 last:border-0 hover:bg-cream/50 transition-colors ${msgStatus === 'new' ? 'bg-blue-50/30' : ''}`}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center flex-shrink-0"><span className="text-chocolate text-xs font-bold">{msg.full_name?.[0]?.toUpperCase()}</span></div>
                                <div>
                                  <p className="text-xs font-medium text-chocolate">{msg.full_name}</p>
                                  <p className="text-[10px] text-warm-gray">{msg.email}</p>
                                  {msg.phone && <p className="text-[10px] text-warm-gray">{msg.phone}</p>}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3"><p className="text-xs text-charcoal/70">{msg.subject || '-'}</p></td>
                            <td className="px-4 py-3 max-w-xs"><p className="text-xs text-charcoal/70 line-clamp-2">{msg.message}</p></td>
                            <td className="px-4 py-3"><MessageStatusBadge status={msgStatus} /></td>
                            <td className="px-4 py-3 text-[10px] text-warm-gray">{new Date(msg.created_at).toLocaleDateString()}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1.5">
                                {msgStatus === 'new' && (
                                  <button onClick={() => handleMarkRead(msg.id)} className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center hover:bg-amber-100 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                                )}
                                <button onClick={() => setSelectedMessage(msg)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"><Mail className="w-3.5 h-3.5" /></button>
                                <button onClick={() => setShowDeleteConfirm(msg.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-cream-dark/30">
                    <p className="text-xs text-warm-gray">Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredMessages.length)} of {filteredMessages.length} messages</p>
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

      <AnimatePresence>{selectedMessage && <MessageDetailModal message={selectedMessage} onClose={() => setSelectedMessage(null)} onMarkRead={handleMarkRead} onMarkReplied={handleMarkReplied} />}</AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><AlertCircle className="w-6 h-6 text-red-600" /></div>
                <h3 className="font-display text-lg font-bold text-chocolate mb-2">Delete this message?</h3>
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
