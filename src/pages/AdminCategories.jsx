import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package, Users, BarChart3,
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
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
]

const ITEMS_PER_PAGE = 8

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

function CategoryFormModal({ category, onClose, onSave }) {
  const [form, setForm] = useState({
    name: '', slug: '', description: '', image_url: '', sort_order: 0, is_active: true,
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name || '', slug: category.slug || '', description: category.description || '',
        image_url: category.image_url || '', sort_order: category.sort_order || 0, is_active: category.is_active ?? true,
      })
      setImagePreview(category.image_url || '')
    }
  }, [category])

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (e) => {
    const name = e.target.value
    setForm({ ...form, name, slug: category ? form.slug : generateSlug(name) })
  }

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
    const fileName = `categories/${Date.now()}.${fileExt}`
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
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const categoryData = { name: form.name, slug, description: form.description, image_url: imageUrl, sort_order: parseInt(form.sort_order) || 0, is_active: form.is_active }
      setUploadProgress(90)
      if (category) {
        const { error } = await supabase.from('categories').update(categoryData).eq('id', category.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('categories').insert([categoryData])
        if (error) throw error
      }
      setUploadProgress(100)
      onSave()
    } catch (error) { console.error('Save category error:', error); alert('Failed to save category: ' + error.message) }
    finally { setUploading(false); setUploadProgress(0) }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-cream-dark/30">
          <h2 className="font-display text-xl font-bold text-chocolate">{category ? 'Edit Category' : 'Add New Category'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-cream flex items-center justify-center hover:bg-cream-dark transition-colors"><X className="w-4 h-4 text-chocolate" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-xs text-warm-gray mb-1 block">Category Image</label>
            <div className="relative border-2 border-dashed border-cream-dark rounded-2xl overflow-hidden">
              {imagePreview ? (
                <div className="relative"><img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" /><label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity"><div className="text-center text-white"><Upload className="w-6 h-6 mx-auto mb-1" /><span className="text-xs">Change Image</span></div><input type="file" accept="image/*" onChange={handleImageChange} className="hidden" /></label></div>
              ) : (
                <label className="flex flex-col items-center justify-center py-12 cursor-pointer"><Image className="w-10 h-10 text-warm-gray/40 mb-2" /><span className="text-sm text-warm-gray">Click to upload image</span><span className="text-xs text-warm-gray/60">PNG, JPG up to 5MB</span><input type="file" accept="image/*" onChange={handleImageChange} className="hidden" /></label>
              )}
            </div>
          </div>

          <div><label className="text-xs text-warm-gray mb-1 block">Category Name *</label><input type="text" value={form.name} onChange={handleNameChange} required className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" placeholder="e.g. Birthday Cakes" /></div>

          <div><label className="text-xs text-warm-gray mb-1 block">Slug</label><input type="text" value={form.slug} readOnly className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal/60 focus:outline-none" placeholder="Auto-generated from name" /></div>

          <div><label className="text-xs text-warm-gray mb-1 block">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none" placeholder="Describe this category..." /></div>

          <div><label className="text-xs text-warm-gray mb-1 block">Sort Order</label><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} min="0" className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" placeholder="0" /></div>

          <div><label className="text-xs text-warm-gray mb-1 block">Image URL (optional)</label><input type="text" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" placeholder="https://..." /></div>

          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded border-cream-dark text-chocolate focus:ring-gold/30" /><span className="text-sm text-charcoal">Active</span></label>

          {uploading && <div className="space-y-2"><div className="flex justify-between text-xs text-warm-gray"><span>Uploading...</span><span>{uploadProgress}%</span></div><div className="h-2 bg-cream rounded-full overflow-hidden"><motion.div className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} /></div></div>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-cream-dark text-sm font-medium text-chocolate hover:bg-cream-dark transition-colors">Cancel</button>
            <button type="submit" disabled={uploading} className="flex-1 py-3 rounded-xl bg-chocolate text-white text-sm font-medium hover:bg-chocolate-light transition-colors disabled:opacity-50">{uploading ? 'Saving...' : category ? 'Update Category' : 'Add Category'}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function CategoryCard({ category, onEdit, onDelete }) {
  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-card rounded-2xl shadow-sm border border-cream-dark/30 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-square overflow-hidden bg-cream">
        {category.image_url ? <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="text-5xl">📁</span></div>}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {!category.is_active && <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-semibold">Inactive</span>}
        </div>
        <div className="absolute top-2 right-2 flex gap-1.5">
          <button onClick={() => onEdit(category)} className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"><Pencil className="w-3.5 h-3.5 text-chocolate" /></button>
          <button onClick={() => onDelete(category)} className="w-8 h-8 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-sm font-bold text-chocolate leading-tight">{category.name}</h3>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${category.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{category.is_active ? 'Active' : 'Inactive'}</span>
        </div>
        <p className="text-xs text-warm-gray mb-2 line-clamp-2">{category.description || 'No description'}</p>
        <div className="flex items-center justify-between text-[10px] text-warm-gray">
          <span className="px-2 py-0.5 rounded-full bg-cream-dark text-charcoal/60 font-medium">{category.slug}</span>
          <span>{new Date(category.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function AdminCategories() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  useEffect(() => { fetchCategories() }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false })
      if (error) throw error
      setCategories(data || [])
    } catch (error) { console.error('Fetch categories error:', error) } finally { setLoading(false) }
  }

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const search = `${category.name} ${category.description} ${category.slug}`.toLowerCase()
      return search.includes(searchQuery.toLowerCase())
    })
  }, [categories, searchQuery])

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE)
  const paginatedCategories = filteredCategories.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  useEffect(() => { setCurrentPage(1) }, [searchQuery])

  const handleEdit = (category) => { setEditingCategory(category); setShowCategoryForm(true) }

  const handleDelete = async (categoryId) => {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', categoryId)
      if (error) throw error
      setCategories(categories.filter(c => c.id !== categoryId))
      setShowDeleteConfirm(null)
    } catch (error) { console.error('Delete category error:', error); alert('Failed to delete category: ' + error.message) }
  }

  const handleSave = () => { setShowCategoryForm(false); setEditingCategory(null); fetchCategories() }

  const stats = useMemo(() => ({
    total: categories.length, active: categories.filter(c => c.is_active).length, inactive: categories.filter(c => !c.is_active).length,
  }), [categories])

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur-sm border-b border-cream-dark/30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-card border border-cream-dark/30"><Menu className="w-5 h-5 text-chocolate" /></button>
            <h1 className="font-display text-xl font-bold text-chocolate">Categories</h1>
            <button onClick={() => { setEditingCategory(null); setShowCategoryForm(true) }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-chocolate text-white text-sm font-medium hover:bg-chocolate-light transition-colors"><Plus className="w-4 h-4" /><span className="hidden sm:inline">Add Category</span></button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[{ label: 'Total', value: stats.total, color: 'text-chocolate' },
              { label: 'Active', value: stats.active, color: 'text-green-600' },
              { label: 'Inactive', value: stats.inactive, color: 'text-red-600' }
            ].map(s => (
              <div key={s.label} className="bg-card rounded-xl p-3 border border-cream-dark/30 text-center">
                <p className="text-[10px] text-warm-gray">{s.label}</p>
                <p className={`font-display text-xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" /><input type="text" placeholder="Search categories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-cream-dark bg-card text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" /></div>
          </div>

          <div className="bg-card rounded-2xl shadow-sm border border-cream-dark/30 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" /><p className="text-warm-gray text-sm mt-3">Loading categories...</p></div>
            ) : paginatedCategories.length === 0 ? (
              <div className="p-12 text-center"><Package className="w-12 h-12 text-warm-gray/40 mx-auto mb-3" /><p className="text-warm-gray text-sm">No categories found</p></div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
                  <AnimatePresence>{paginatedCategories.map((category) => <CategoryCard key={category.id} category={category} onEdit={handleEdit} onDelete={(c) => setShowDeleteConfirm(c)} />)}</AnimatePresence>
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-cream-dark/30">
                    <p className="text-xs text-warm-gray">Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredCategories.length)} of {filteredCategories.length} categories</p>
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

      <AnimatePresence>{showCategoryForm && <CategoryFormModal category={editingCategory} onClose={() => { setShowCategoryForm(false); setEditingCategory(null) }} onSave={handleSave} />}</AnimatePresence>

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
