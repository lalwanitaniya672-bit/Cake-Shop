import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package, Users,
  LogOut, Menu, ChevronRight, Search, Filter, Trash2, Eye, RefreshCw,
  AlertCircle, Plus, Pencil, Upload, Image, X, EyeOff, ChevronDown
} from 'lucide-react'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import { supabase } from '../lib/supabase'

const sidebarLinks = [
  { to: '/admin/cakes', label: 'Cakes', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Package },
  { to: '/admin/flavors', label: 'Flavors', icon: Package },
  { to: '/admin/customers', label: 'Customers', icon: Users },
]

const CATEGORIES = ['Birthday', 'Wedding', 'Anniversary', 'Premium', 'Classic', 'Seasonal', 'Custom']
const ITEMS_PER_PAGE = 12

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

function CakeFormModal({ cake, onClose, onSave }) {
  const [form, setForm] = useState({
    name: '', price: '', description: '', category: '', flavours: '', serves: '', image_url: '', badge: '', is_active: true, is_featured: false,
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    if (cake) {
      setForm({
        name: cake.name || '', price: cake.price || '', description: cake.description || '', category: cake.category || '',
        flavours: Array.isArray(cake.flavours) ? cake.flavours.join(', ') : cake.flavours || '', serves: cake.serves || '',
        image_url: cake.image_url || '', badge: cake.badge || '', is_active: cake.is_active ?? true, is_featured: cake.is_featured ?? false,
      })
      setImagePreview(cake.image_url || '')
    }
  }, [cake])

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { alert('Image must be less than 5MB'); return }
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (ev) => setImagePreview(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async () => {
    if (!imageFile) return form.image_url
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `cakes/${Date.now()}.${fileExt}`
    const { error } = await supabase.storage.from('cake-images').upload(fileName, imageFile, { cacheControl: '3600', upsert: false })
    if (error) throw error
    const { data: { publicUrl } } = supabase.storage.from('cake-images').getPublicUrl(fileName)
    return publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    setUploadProgress(0)
    try {
      let imageUrl = form.image_url
      if (imageFile) { setUploadProgress(30); imageUrl = await uploadImage(); setUploadProgress(70) }
      const flavoursArray = form.flavours.split(',').map(f => f.trim()).filter(f => f)
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const cakeData = { name: form.name, slug, price: parseFloat(form.price), description: form.description, category: form.category, flavours: flavoursArray, serves: form.serves, image_url: imageUrl, badge: form.badge, is_active: form.is_active, is_featured: form.is_featured }
      setUploadProgress(90)
      if (cake) {
        const { error } = await supabase.from('cakes').update(cakeData).eq('id', cake.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('cakes').insert([cakeData])
        if (error) throw error
      }
      setUploadProgress(100)
      onSave()
    } catch (error) { console.error('Save cake error:', error); alert('Failed to save cake: ' + error.message) }
    finally { setUploading(false); setUploadProgress(0) }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-chocolate rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="font-display text-xl font-bold text-white">{cake ? 'Edit Cake' : 'Add New Cake'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"><X className="w-4 h-4 text-white" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-xs text-white/60 mb-1 block">Cake Image</label>
            <div className="relative border-2 border-dashed border-white/20 rounded-2xl overflow-hidden">
              {imagePreview ? (
                <div className="relative"><img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" /><label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity"><div className="text-center text-white"><Upload className="w-6 h-6 mx-auto mb-1" /><span className="text-xs">Change Image</span></div><input type="file" accept="image/*" onChange={handleImageChange} className="hidden" /></label></div>
              ) : (
                <label className="flex flex-col items-center justify-center py-12 cursor-pointer"><Image className="w-10 h-10 text-white/30 mb-2" /><span className="text-sm text-white/50">Click to upload image</span><span className="text-xs text-white/30">PNG, JPG up to 5MB</span><input type="file" accept="image/*" onChange={handleImageChange} className="hidden" /></label>
              )}
            </div>
          </div>

          <div><label className="text-xs text-white/60 mb-1 block">Cake Name *</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-white/10 bg-chocolate-light text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold/30 placeholder-white/30" placeholder="e.g. Red Velvet Dream" /></div>

          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs text-white/60 mb-1 block">Price (₹) *</label><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="0" step="0.01" className="w-full px-4 py-3 rounded-xl border border-white/10 bg-chocolate-light text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold/30 placeholder-white/30" placeholder="1299" /></div>
            <div><label className="text-xs text-white/60 mb-1 block">Serves</label><input type="text" value={form.serves} onChange={(e) => setForm({ ...form, serves: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-white/10 bg-chocolate-light text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold/30 placeholder-white/30" placeholder="8-10 people" /></div>
          </div>

          <div><label className="text-xs text-white/60 mb-1 block">Category *</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-white/10 bg-chocolate-light text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold/30 appearance-none"><option value="">Select Category</option>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>

          <div><label className="text-xs text-white/60 mb-1 block">Flavours (comma separated)</label><input type="text" value={form.flavours} onChange={(e) => setForm({ ...form, flavours: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-white/10 bg-chocolate-light text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold/30 placeholder-white/30" placeholder="e.g. Classic, Strawberry, Blueberry" /></div>

          <div><label className="text-xs text-white/60 mb-1 block">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border border-white/10 bg-chocolate-light text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none placeholder-white/30" placeholder="Describe this cake..." /></div>

          <div><label className="text-xs text-white/60 mb-1 block">Badge (optional)</label><input type="text" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-white/10 bg-chocolate-light text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold/30 placeholder-white/30" placeholder="e.g. Bestseller, New, Premium" /></div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded border-white/20 bg-chocolate-light text-gold focus:ring-gold/30" /><span className="text-sm text-white/80">In Stock</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 rounded border-white/20 bg-chocolate-light text-gold focus:ring-gold/30" /><span className="text-sm text-white/80">Featured</span></label>
          </div>

          {uploading && <div className="space-y-2"><div className="flex justify-between text-xs text-white/50"><span>Uploading...</span><span>{uploadProgress}%</span></div><div className="h-2 bg-chocolate-light rounded-full overflow-hidden"><motion.div className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} /></div></div>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/15 text-sm font-medium text-white/70 hover:bg-white/10 transition-colors">Cancel</button>
            <button type="submit" disabled={uploading} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-chocolate text-sm font-semibold hover:shadow-lg hover:shadow-gold/20 transition-all disabled:opacity-50">{uploading ? 'Saving...' : cake ? 'Update Cake' : 'Add Cake'}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function CakeCard({ cake, onEdit, onDelete }) {
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-card rounded-2xl shadow-sm border border-cream-dark/30 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-square overflow-hidden bg-cream">
        {cake.image_url ? <img src={cake.image_url} alt={cake.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="text-5xl">🎂</span></div>}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {!cake.is_active && <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-semibold">Out of Stock</span>}
          {cake.badge && <span className="px-2 py-0.5 rounded-full bg-gold text-chocolate text-[10px] font-semibold">{cake.badge}</span>}
        </div>
        <div className="absolute top-2 right-2 flex gap-1.5">
          <button onClick={() => onEdit(cake)} className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"><Pencil className="w-3.5 h-3.5 text-chocolate" /></button>
          <button onClick={() => onDelete(cake)} className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-sm font-bold text-chocolate leading-tight">{cake.name}</h3>
          <span className="text-sm font-bold text-chocolate whitespace-nowrap">₹{cake.price}</span>
        </div>
        <p className="text-xs text-warm-gray mb-2 line-clamp-2">{cake.description}</p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cream-dark text-charcoal/60 font-medium">{cake.category}</span>
          {cake.flavours && <span className="text-[10px] text-warm-gray">{cake.flavours.length} flavour(s)</span>}
        </div>
        <div className="flex items-center justify-between text-[10px] text-warm-gray">
          <span>{cake.serves || '-'}</span>
          <span>{new Date(cake.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function AdminCakes() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [cakes, setCakes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showCakeForm, setShowCakeForm] = useState(false)
  const [editingCake, setEditingCake] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  useEffect(() => { fetchCakes() }, [])

  const fetchCakes = async () => {
    try {
      const { data, error } = await supabase.from('cakes').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setCakes(data || [])
    } catch (error) { console.error('Fetch cakes error:', error) } finally { setLoading(false) }
  }

  const filteredCakes = useMemo(() => {
    return cakes.filter((cake) => {
      const search = `${cake.name} ${cake.description} ${cake.category}`.toLowerCase()
      const matchesSearch = search.includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || cake.category === categoryFilter
      const matchesStock = stockFilter === 'all' || (stockFilter === 'in_stock' && cake.is_active) || (stockFilter === 'out_of_stock' && !cake.is_active)
      return matchesSearch && matchesCategory && matchesStock
    })
  }, [cakes, searchQuery, categoryFilter, stockFilter])

  const totalPages = Math.ceil(filteredCakes.length / ITEMS_PER_PAGE)
  const paginatedCakes = filteredCakes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  useEffect(() => { setCurrentPage(1) }, [searchQuery, categoryFilter, stockFilter])

  const handleEdit = (cake) => { setEditingCake(cake); setShowCakeForm(true) }

  const handleDelete = async (cakeId) => {
    try {
      const { error } = await supabase.from('cakes').delete().eq('id', cakeId)
      if (error) throw error
      setCakes(cakes.filter(c => c.id !== cakeId))
      setShowDeleteConfirm(null)
    } catch (error) { console.error('Delete cake error:', error); alert('Failed to delete cake: ' + error.message) }
  }

  const handleSave = () => { setShowCakeForm(false); setEditingCake(null); fetchCakes() }

  const categories = [...new Set(cakes.map(c => c.category).filter(Boolean))]
  const stats = useMemo(() => ({
    total: cakes.length, inStock: cakes.filter(c => c.is_active).length, outOfStock: cakes.filter(c => !c.is_active).length, featured: cakes.filter(c => c.is_featured).length,
  }), [cakes])

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur-sm border-b border-cream-dark/30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-card border border-cream-dark/30"><Menu className="w-5 h-5 text-chocolate" /></button>
            <h1 className="font-display text-xl font-bold text-chocolate">Cakes</h1>
            <button onClick={() => { setEditingCake(null); setShowCakeForm(true) }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-chocolate text-white text-sm font-medium hover:bg-chocolate-light transition-colors"><Plus className="w-4 h-4" /><span className="hidden sm:inline">Add Cake</span></button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[{ label: 'Total', value: stats.total, color: 'text-chocolate' },
              { label: 'In Stock', value: stats.inStock, color: 'text-green-600' },
              { label: 'Out of Stock', value: stats.outOfStock, color: 'text-red-600' },
              { label: 'Featured', value: stats.featured, color: 'text-gold' }
            ].map(s => (
              <div key={s.label} className="bg-card rounded-xl p-3 border border-cream-dark/30 text-center">
                <p className="text-[10px] text-warm-gray">{s.label}</p>
                <p className={`font-display text-xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" /><input type="text" placeholder="Search cakes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-cream-dark bg-card text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" /></div>
            <div className="relative"><Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" /><select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="pl-10 pr-8 py-3 rounded-xl border border-cream-dark bg-card text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 appearance-none cursor-pointer"><option value="all">All Categories</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="px-4 py-3 rounded-xl border border-cream-dark bg-card text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 appearance-none cursor-pointer"><option value="all">All Stock</option><option value="in_stock">In Stock</option><option value="out_of_stock">Out of Stock</option></select>
          </div>

          <div className="bg-card rounded-2xl shadow-sm border border-cream-dark/30 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" /><p className="text-warm-gray text-sm mt-3">Loading cakes...</p></div>
            ) : paginatedCakes.length === 0 ? (
              <div className="p-12 text-center"><Package className="w-12 h-12 text-warm-gray/40 mx-auto mb-3" /><p className="text-warm-gray text-sm">No cakes found</p></div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
                  <AnimatePresence>{paginatedCakes.map((cake) => <CakeCard key={cake.id} cake={cake} onEdit={handleEdit} onDelete={(c) => setShowDeleteConfirm(c)} />)}</AnimatePresence>
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-cream-dark/30">
                    <p className="text-xs text-warm-gray">Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredCakes.length)} of {filteredCakes.length} cakes</p>
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

      <AnimatePresence>{showCakeForm && <CakeFormModal cake={editingCake} onClose={() => { setShowCakeForm(false); setEditingCake(null) }} onSave={handleSave} />}</AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><AlertCircle className="w-6 h-6 text-red-600" /></div>
                <h3 className="font-display text-lg font-bold text-chocolate mb-2">Delete "{showDeleteConfirm.name}"?</h3>
                <p className="text-sm text-warm-gray mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-cream-dark text-sm font-medium text-chocolate hover:bg-cream-dark transition-colors">Cancel</button>
                  <button onClick={() => handleDelete(showDeleteConfirm.id)} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors">Delete</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
