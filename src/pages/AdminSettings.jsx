import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package, Users, BarChart3,
  LogOut, Menu, ChevronRight, Settings, Save, RotateCcw, Upload, Image,
  X, Check, AlertCircle, Clock, Phone, Mail, Globe, Palette, User, Lock
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

function SettingsSection({ title, icon: Icon, children }) {
  return (
    <div className="bg-card rounded-2xl shadow-sm border border-cream-dark/30 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-cream-dark/30">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-chocolate to-chocolate-light flex items-center justify-center"><Icon className="w-4 h-4 text-white" /></div>
        <h2 className="font-display text-sm font-bold text-chocolate">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

function ImageUpload({ currentImage, onUpload, label }) {
  const [preview, setPreview] = useState(currentImage || '')
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { alert('Image must be less than 2MB'); return }
    setUploading(true)
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(file)

    const fileExt = file.name.split('.').pop()
    const fileName = `settings/${Date.now()}.${fileExt}`
    const { data, error } = await supabase.storage.from('site-assets').upload(fileName, file, { cacheControl: '3600', upsert: false })
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('site-assets').getPublicUrl(fileName)
      onUpload(publicUrl)
    }
    setUploading(false)
  }

  return (
    <div>
      <label className="text-xs text-warm-gray mb-1 block">{label}</label>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-xl border-2 border-dashed border-cream-dark overflow-hidden bg-cream flex items-center justify-center">
          {preview ? <img src={preview} alt="" className="w-full h-full object-cover" /> : <Image className="w-8 h-8 text-warm-gray/40" />}
        </div>
        <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-cream-dark bg-cream text-sm text-chocolate hover:bg-cream-dark cursor-pointer transition-colors">
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Upload'}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      </div>
    </div>
  )
}

export default function AdminSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState(null)
  const { admin } = useAdminAuth()

  const [settings, setSettings] = useState({
    shop_name: 'The Velvet Crumb',
    shop_tagline: 'Artisan Cakes & Pastries',
    shop_logo: '',
    shop_favicon: '',
    phone: '+91 8767438990',
    whatsapp: '+91 8767438990',
    email: 'hello@thevelvetcrumb.com',
    address: 'Mumbai, Maharashtra, India',
    google_maps: '',
    opening_time: '09:00',
    closing_time: '21:00',
    weekly_holiday: 'Monday',
    instagram: '',
    facebook: '',
    youtube: '',
    pinterest: '',
    hero_title: 'Handcrafted with Love',
    hero_subtitle: 'Premium artisan cakes for every celebration',
    hero_image: '',
    currency: 'INR',
    delivery_charge: '0',
    default_weight: '1 KG',
    default_payment: 'cod',
    admin_name: '',
    admin_email: '',
  })

  const [profilePhoto, setProfilePhoto] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => { fetchSettings() }, [])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').limit(1).single()
      if (data) {
        setSettings(prev => ({
          ...prev,
          shop_name: data.shop_name || prev.shop_name,
          shop_tagline: data.shop_tagline || prev.shop_tagline,
          shop_logo: data.shop_logo || prev.shop_logo,
          phone: data.phone || prev.phone,
          whatsapp: data.whatsapp || prev.whatsapp,
          email: data.email || prev.email,
          address: data.address || prev.address,
        }))
      }
    } catch (e) { console.log('No settings found, using defaults') }

    if (admin?.adminData) {
      setSettings(prev => ({
        ...prev,
        admin_name: admin.adminData.full_name || '',
        admin_email: admin?.email || '',
      }))
      setProfilePhoto(admin.adminData.avatar_url || '')
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data: existing } = await supabase.from('site_settings').select('id').limit(1)
      const settingsData = { ...settings, updated_at: new Date().toISOString() }
      delete settingsData.admin_name
      delete settingsData.admin_email

      if (existing?.length > 0) {
        await supabase.from('site_settings').update(settingsData).eq('id', existing[0].id)
      } else {
        await supabase.from('site_settings').insert([settingsData])
      }

      if (admin?.id) {
        await supabase.from('admins').update({ full_name: settings.admin_name }).eq('id', admin.id)
      }

      showNotification('Settings saved successfully!', 'success')
    } catch (error) {
      console.error('Save settings error:', error)
      showNotification('Failed to save settings', 'error')
    }
    setSaving(false)
  }

  const handlePasswordChange = async () => {
    if (!newPassword) { showNotification('Enter a new password', 'error'); return }
    if (newPassword !== confirmPassword) { showNotification('Passwords do not match', 'error'); return }
    if (newPassword.length < 6) { showNotification('Password must be at least 6 characters', 'error'); return }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setNewPassword('')
      setConfirmPassword('')
      showNotification('Password updated successfully!', 'success')
    } catch (error) {
      showNotification('Failed to update password: ' + error.message, 'error')
    }
  }

  const handleReset = () => {
    setSettings({
      shop_name: 'The Velvet Crumb', shop_tagline: 'Artisan Cakes & Pastries', shop_logo: '', shop_favicon: '',
      phone: '+91 8767438990', whatsapp: '+91 8767438990', email: 'hello@thevelvetcrumb.com', address: 'Mumbai, Maharashtra, India', google_maps: '',
      opening_time: '09:00', closing_time: '21:00', weekly_holiday: 'Monday',
      instagram: '', facebook: '', youtube: '', pinterest: '',
      hero_title: 'Handcrafted with Love', hero_subtitle: 'Premium artisan cakes for every celebration', hero_image: '',
      currency: 'INR', delivery_charge: '0', default_weight: '1 KG', default_payment: 'cod',
      admin_name: settings.admin_name, admin_email: settings.admin_email,
    })
    showNotification('Settings reset to defaults', 'success')
  }

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const updateField = (field, value) => setSettings(prev => ({ ...prev, [field]: value }))

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur-sm border-b border-cream-dark/30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-card border border-cream-dark/30"><Menu className="w-5 h-5 text-chocolate" /></button>
            <h1 className="font-display text-xl font-bold text-chocolate">Settings</h1>
            <div className="flex items-center gap-2">
              <button onClick={handleReset} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-cream-dark/30 text-sm text-chocolate hover:bg-cream-dark transition-colors"><RotateCcw className="w-4 h-4" /><span className="hidden sm:inline">Reset</span></button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-chocolate text-white text-sm font-medium hover:bg-chocolate-light transition-colors disabled:opacity-50"><Save className="w-4 h-4" /><span className="hidden sm:inline">{saving ? 'Saving...' : 'Save All'}</span></button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* General Settings */}
          <SettingsSection title="General Settings" icon={Globe}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className="text-xs text-warm-gray mb-1 block">Shop Name</label><input type="text" value={settings.shop_name} onChange={(e) => updateField('shop_name', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" /></div>
              <div><label className="text-xs text-warm-gray mb-1 block">Tagline</label><input type="text" value={settings.shop_tagline} onChange={(e) => updateField('shop_tagline', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" /></div>
            </div>
            <div className="mt-5"><ImageUpload currentImage={settings.shop_logo} onUpload={(url) => updateField('shop_logo', url)} label="Shop Logo" /></div>
          </SettingsSection>

          {/* Contact Settings */}
          <SettingsSection title="Contact Settings" icon={Phone}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className="text-xs text-warm-gray mb-1 block">Phone Number</label><input type="tel" value={settings.phone} onChange={(e) => updateField('phone', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" /></div>
              <div><label className="text-xs text-warm-gray mb-1 block">WhatsApp Number</label><input type="tel" value={settings.whatsapp} onChange={(e) => updateField('whatsapp', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" /></div>
              <div><label className="text-xs text-warm-gray mb-1 block">Email Address</label><input type="email" value={settings.email} onChange={(e) => updateField('email', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" /></div>
              <div><label className="text-xs text-warm-gray mb-1 block">Shop Address</label><input type="text" value={settings.address} onChange={(e) => updateField('address', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" /></div>
              <div className="sm:col-span-2"><label className="text-xs text-warm-gray mb-1 block">Google Maps Embed URL</label><input type="url" value={settings.google_maps} onChange={(e) => updateField('google_maps', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" placeholder="https://www.google.com/maps/embed?..." /></div>
            </div>
          </SettingsSection>

          {/* Business Hours */}
          <SettingsSection title="Business Hours" icon={Clock}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div><label className="text-xs text-warm-gray mb-1 block">Opening Time</label><input type="time" value={settings.opening_time} onChange={(e) => updateField('opening_time', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" /></div>
              <div><label className="text-xs text-warm-gray mb-1 block">Closing Time</label><input type="time" value={settings.closing_time} onChange={(e) => updateField('closing_time', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" /></div>
              <div><label className="text-xs text-warm-gray mb-1 block">Weekly Holiday</label><select value={settings.weekly_holiday} onChange={(e) => updateField('weekly_holiday', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 appearance-none"><option>Sunday</option><option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option><option>Saturday</option></select></div>
            </div>
          </SettingsSection>

          {/* Social Media */}
          <SettingsSection title="Social Media" icon={Palette}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { field: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
                { field: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/...' },
                { field: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/...' },
                { field: 'pinterest', label: 'Pinterest', placeholder: 'https://pinterest.com/...' },
              ].map(s => (
                <div key={s.field}><label className="text-xs text-warm-gray mb-1 block">{s.label}</label><input type="url" value={settings[s.field]} onChange={(e) => updateField(s.field, e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" placeholder={s.placeholder} /></div>
              ))}
            </div>
          </SettingsSection>

          {/* Homepage Settings */}
          <SettingsSection title="Homepage Settings" icon={Palette}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className="text-xs text-warm-gray mb-1 block">Hero Title</label><input type="text" value={settings.hero_title} onChange={(e) => updateField('hero_title', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" /></div>
              <div><label className="text-xs text-warm-gray mb-1 block">Hero Subtitle</label><input type="text" value={settings.hero_subtitle} onChange={(e) => updateField('hero_subtitle', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" /></div>
            </div>
            <div className="mt-5"><ImageUpload currentImage={settings.hero_image} onUpload={(url) => updateField('hero_image', url)} label="Hero Background Image" /></div>
          </SettingsSection>

          {/* Website Settings */}
          <SettingsSection title="Website Settings" icon={Settings}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div><label className="text-xs text-warm-gray mb-1 block">Currency</label><select value={settings.currency} onChange={(e) => updateField('currency', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 appearance-none"><option value="INR">₹ INR</option><option value="USD">$ USD</option></select></div>
              <div><label className="text-xs text-warm-gray mb-1 block">Delivery Charge (₹)</label><input type="number" value={settings.delivery_charge} onChange={(e) => updateField('delivery_charge', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" /></div>
              <div><label className="text-xs text-warm-gray mb-1 block">Default Weight</label><input type="text" value={settings.default_weight} onChange={(e) => updateField('default_weight', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" /></div>
              <div><label className="text-xs text-warm-gray mb-1 block">Default Payment</label><select value={settings.default_payment} onChange={(e) => updateField('default_payment', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30 appearance-none"><option value="cod">COD</option><option value="online">Online</option></select></div>
            </div>
          </SettingsSection>

          {/* Admin Profile */}
          <SettingsSection title="Admin Profile" icon={User}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className="text-xs text-warm-gray mb-1 block">Full Name</label><input type="text" value={settings.admin_name} onChange={(e) => updateField('admin_name', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" /></div>
              <div><label className="text-xs text-warm-gray mb-1 block">Email</label><input type="email" value={settings.admin_email} disabled className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream/50 text-sm text-warm-gray cursor-not-allowed" /></div>
            </div>
            <div className="mt-5"><ImageUpload currentImage={profilePhoto} onUpload={(url) => setProfilePhoto(url)} label="Profile Photo" /></div>
          </SettingsSection>

          {/* Change Password */}
          <SettingsSection title="Change Password" icon={Lock}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className="text-xs text-warm-gray mb-1 block">New Password</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" placeholder="Min 6 characters" /></div>
              <div><label className="text-xs text-warm-gray mb-1 block">Confirm Password</label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-cream text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/30" placeholder="Confirm new password" /></div>
            </div>
            <div className="mt-5">
              <button onClick={handlePasswordChange} className="px-6 py-3 rounded-xl bg-chocolate text-white text-sm font-medium hover:bg-chocolate-light transition-colors">Update Password</button>
            </div>
          </SettingsSection>
        </main>
      </div>

      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-6 right-6 z-50">
            <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg ${notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
              {notification.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
