import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const footerLinks = {
  shop: [
    { to: '/collection', label: 'Cake Collection' },
    { to: '/custom-orders', label: 'Custom Orders' },
    { to: '/gallery', label: 'Gallery' },
  ],
  company: [
    { to: '/about', label: 'Our Story' },
    { to: '/reviews', label: 'Customer Reviews' },
    { to: '/contact', label: 'Get in Touch' },
  ],
}

const InstagramIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><circle cx="12" cy="12" r="4.5" />
  </svg>
)
const FacebookIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)
const TwitterIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)
const YoutubeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" />
  </svg>
)

const socialLinks = [
  { icon: InstagramIcon, href: 'https://instagram.com/thevelvetcrumb', label: 'Instagram', handle: '@thevelvetcrumb' },
  { icon: FacebookIcon, href: 'https://facebook.com/thevelvetcrumb', label: 'Facebook', handle: '/TheVelvetCrumb' },
  { icon: TwitterIcon, href: 'https://twitter.com/thevelvetcrumb', label: 'Twitter', handle: '@velvetcrumb' },
  { icon: YoutubeIcon, href: 'https://youtube.com/@thevelvetcrumb', label: 'YouTube', handle: '@thevelvetcrumb' },
]

export default function Footer() {
  return (
    <footer className="bg-chocolate text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose to-gold flex items-center justify-center">
                <span className="font-display text-white font-bold text-lg">V</span>
              </div>
              <span className="font-display text-xl font-semibold text-white tracking-wide">
                The Velvet Crumb
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Handcrafted with love since 2018. Every cake tells a story, every bite creates a memory.
              We use only the finest ingredients to bring your sweetest visions to life.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-gold/30 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 group"
                  aria-label={social.label}
                >
                  <span className="text-white/70 group-hover:text-white"><social.icon /></span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-2">
            <h4 className="font-display text-white text-sm font-semibold uppercase tracking-wider mb-6">
              Explore
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-display text-white text-sm font-semibold uppercase tracking-wider mb-6">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h4 className="font-display text-white text-sm font-semibold uppercase tracking-wider mb-6">
              Visit Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/60">42 Blossom Lane, Suite 100<br />Portland, OR 97205</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="tel:+15035550184" className="text-sm text-white/60 hover:text-gold transition-colors">(503) 555-0184</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="mailto:hello@thevelvetcrumb.com" className="text-sm text-white/60 hover:text-gold transition-colors">hello@thevelvetcrumb.com</a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/60">Mon–Fri: 8am – 7pm<br />Sat: 9am – 5pm</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-display text-white text-sm font-semibold mb-1">Stay Sweet</h4>
              <p className="text-xs text-white/50">Get exclusive offers, new cake reveals, and baking tips.</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 md:w-64 px-4 py-2.5 rounded-full bg-white/10 border border-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold/50 transition-colors"
              />
              <button className="px-6 py-2.5 rounded-full bg-gold text-chocolate text-sm font-semibold hover:bg-gold-light transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} The Velvet Crumb. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-white/40 hover:text-white/60 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-white/40 hover:text-white/60 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
