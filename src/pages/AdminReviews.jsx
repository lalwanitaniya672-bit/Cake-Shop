import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, ShoppingCart, Package, Users, MessageSquare, Star,
  LogOut, Menu, ChevronRight, Search, Filter, Trash2, Eye, RefreshCw,
  AlertCircle, Check, X as XIcon, Settings, ArrowUpDown, ArrowUp, ArrowDown
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
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

const STATUS_OPTIONS = ['pending', 'approved', 'rejected']
const RATING_OPTIONS = [5, 4, 3, 2, 1]
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

function StarRating({ rating, size = 'sm' }) {
  const sizeClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5'
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`${sizeClass} ${i < rating ? 'text-gold fill-gold' : 'text-cream-dark'}`} />
      ))}
    </div>
  )
}

function ReviewStatusBadge({ status }) {
  const styles = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }
  return <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${styles[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function ReviewDetailModal({ review, onClose, onApprove, onReject }) {
  if (!review) return null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-cream-dark/30">
          <h2 className="font-display text-xl font-bold text-chocolate">Review Details</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-cream flex items-center justify-center hover:bg-cream-dark transition-colors"><XIcon className="w-4 h-4 text-chocolate" /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose to-gold flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg font-bold">{review.customer_name?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p className="text-base font-semibold text-chocolate">{review.customer_name}</p>
              <p className="text-xs text-warm-gray">{review.location || 'India'}</p>
              <div className="mt-1"><StarRating rating={review.rating} size="md" /></div>
            </div>
          </div>

          {/* Review */}
          <div className="bg-cream/50 rounded-xl p-5">
            <p className="text-sm text-charcoal/80 leading-relaxed whitespace-pre-wrap">{review.comment}</p>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-cream/50 rounded-xl p-4 text-center">
              <p className="text-[10px] text-warm-gray mb-1">Status</p>
              <ReviewStatusBadge status={review.status || (review.approved ? 'approved' : 'pending')} />
            </div>
            <div className="bg-cream/50 rounded-xl p-4 text-center">
              <p className="text-[10px] text-warm-gray mb-1">Date</p>
              <p className="text-sm font-medium text-chocolate">{new Date(review.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Actions */}
          {(!review.status || review.status === 'pending') && (
            <div className="flex gap-3">
              <button onClick={() => { onApprove(review.id); onClose() }} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"><Check className="w-4 h-4" />Approve</button>
              <button onClick={() => { onReject(review.id); onClose() }} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"><XIcon className="w-4 h-4" />Reject</button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function AdminReviews() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState(0)
  const [sortOrder, setSortOrder] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedReview, setSelectedReview] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  useEffect(() => { fetchReviews() }, [])

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setReviews(data || [])
    } catch (error) { console.error('Fetch reviews error:', error) } finally { setLoading(false) }
  }

  const filteredReviews = useMemo(() => {
    let result = reviews.filter((review) => {
      const search = `${review.customer_name} ${review.comment}`.toLowerCase()
      const matchesSearch = search.includes(searchQuery.toLowerCase())
      const reviewStatus = review.status || (review.approved ? 'approved' : 'pending')
      const matchesStatus = statusFilter === 'all' || reviewStatus === statusFilter
      const matchesRating = ratingFilter === 0 || review.rating === ratingFilter
      return matchesSearch && matchesStatus && matchesRating
    })
    result.sort((a, b) => sortOrder === 'newest'
      ? new Date(b.created_at) - new Date(a.created_at)
      : new Date(a.created_at) - new Date(b.created_at)
    )
    return result
  }, [reviews, searchQuery, statusFilter, ratingFilter, sortOrder])

  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE)
  const paginatedReviews = filteredReviews.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  useEffect(() => { setCurrentPage(1) }, [searchQuery, statusFilter, ratingFilter, sortOrder])

  const handleApprove = async (reviewId) => {
    try {
      const { error } = await supabase.from('reviews').update({ approved: true, status: 'approved' }).eq('id', reviewId)
      if (error) throw error
      setReviews(reviews.map(r => r.id === reviewId ? { ...r, approved: true, status: 'approved' } : r))
    } catch (error) { console.error('Approve error:', error) }
  }

  const handleReject = async (reviewId) => {
    try {
      const { error } = await supabase.from('reviews').update({ approved: false, status: 'rejected' }).eq('id', reviewId)
      if (error) throw error
      setReviews(reviews.map(r => r.id === reviewId ? { ...r, approved: false, status: 'rejected' } : r))
    } catch (error) { console.error('Reject error:', error) }
  }

  const handleDelete = async (reviewId) => {
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', reviewId)
      if (error) throw error
      setReviews(reviews.filter(r => r.id !== reviewId))
      setShowDeleteConfirm(null)
    } catch (error) { console.error('Delete error:', error) }
  }

  const stats = useMemo(() => ({
    total: reviews.length,
    pending: reviews.filter(r => !r.approved && r.status !== 'rejected').length,
    approved: reviews.filter(r => r.approved || r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
    avgRating: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0',
  }), [reviews])

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur-sm border-b border-cream-dark/30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-card border border-cream-dark/30"><Menu className="w-5 h-5 text-chocolate" /></button>
            <h1 className="font-display text-xl font-bold text-chocolate">Reviews</h1>
            <button onClick={fetchReviews} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-cream-dark/30 text-sm text-chocolate hover:bg-cream-dark transition-colors"><RefreshCw className="w-4 h-4" /><span className="hidden sm:inline">Refresh</span></button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {[{ label: 'Total', value: stats.total, color: 'text-chocolate' },
              { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
              { label: 'Approved', value: stats.approved, color: 'text-green-600' },
              { label: 'Rejected', value: stats.rejected, color: 'text-red-600' },
              { label: 'Avg Rating', value: stats.avgRating, color: 'text-gold' }
            ].map(s => (
              <div key={s.label} className="bg-card rounded-xl p-3 border border-cream-dark/30 text-center">
                <p className="text-[10px] text-warm-gray">{s.label}</p>
                <p className={`font-display text-xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" /><input type="text" placeholder="Search by name or review..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-cream-dark bg-card text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" /></div>
            <div className="relative"><Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" /><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="pl-10 pr-8 py-3 rounded-xl border border-cream-dark bg-card text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 appearance-none cursor-pointer"><option value="all">All Status</option>{STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}</select></div>
            <select value={ratingFilter} onChange={(e) => setRatingFilter(Number(e.target.value))} className="px-4 py-3 rounded-xl border border-cream-dark bg-card text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 appearance-none cursor-pointer"><option value={0}>All Ratings</option>{RATING_OPTIONS.map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}</select>
            <button onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-cream-dark bg-card text-sm text-chocolate hover:bg-cream-dark transition-colors">
              {sortOrder === 'newest' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
              {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
            </button>
          </div>

          {/* Reviews Table */}
          <div className="bg-card rounded-2xl shadow-sm border border-cream-dark/30 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" /><p className="text-warm-gray text-sm mt-3">Loading reviews...</p></div>
            ) : paginatedReviews.length === 0 ? (
              <div className="p-12 text-center"><Star className="w-12 h-12 text-warm-gray/40 mx-auto mb-3" /><p className="text-warm-gray text-sm">No reviews found</p></div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-cream-dark/30">
                        <th className="text-left px-4 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Customer</th>
                        <th className="text-left px-4 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Rating</th>
                        <th className="text-left px-4 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Review</th>
                        <th className="text-left px-4 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Status</th>
                        <th className="text-left px-4 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Date</th>
                        <th className="text-right px-4 py-3 text-[10px] font-semibold text-warm-gray uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedReviews.map((review) => {
                        const reviewStatus = review.status || (review.approved ? 'approved' : 'pending')
                        return (
                          <tr key={review.id} className="border-b border-cream-dark/20 last:border-0 hover:bg-cream/50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose to-gold flex items-center justify-center flex-shrink-0"><span className="text-white text-xs font-bold">{review.customer_name?.[0]?.toUpperCase()}</span></div>
                                <div>
                                  <p className="text-xs font-medium text-chocolate">{review.customer_name}</p>
                                  <p className="text-[10px] text-warm-gray">{review.location || 'India'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3"><StarRating rating={review.rating} /></td>
                            <td className="px-4 py-3 max-w-xs"><p className="text-xs text-charcoal/70 line-clamp-2">{review.comment}</p></td>
                            <td className="px-4 py-3"><ReviewStatusBadge status={reviewStatus} /></td>
                            <td className="px-4 py-3 text-[10px] text-warm-gray">{new Date(review.created_at).toLocaleDateString()}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1.5">
                                {reviewStatus === 'pending' && (
                                  <button onClick={() => handleApprove(review.id)} className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors"><Check className="w-3.5 h-3.5" /></button>
                                )}
                                <button onClick={() => setSelectedReview(review)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                                <button onClick={() => setShowDeleteConfirm(review.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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
                    <p className="text-xs text-warm-gray">Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredReviews.length)} of {filteredReviews.length} reviews</p>
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

      <AnimatePresence>{selectedReview && <ReviewDetailModal review={selectedReview} onClose={() => setSelectedReview(null)} onApprove={handleApprove} onReject={handleReject} />}</AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><AlertCircle className="w-6 h-6 text-red-600" /></div>
                <h3 className="font-display text-lg font-bold text-chocolate mb-2">Delete this review?</h3>
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
