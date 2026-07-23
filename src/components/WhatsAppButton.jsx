import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [hasMoved, setHasMoved] = useState(false)
  const dragRef = useRef(null)
  const startPos = useRef({ x: 0, y: 0 })
  const startMouse = useRef({ x: 0, y: 0 })
  const phoneNumber = '918767438990'
  const message = 'Hi! I\'d like to inquire about ordering a cake from The Velvet Crumb.'

  // Load saved position on mount
  useEffect(() => {
    const saved = localStorage.getItem('whatsapp-btn-position')
    if (saved) {
      const parsed = JSON.parse(saved)
      const maxX = window.innerWidth - 56
      const maxY = window.innerHeight - 56
      setPosition({
        x: Math.max(-maxX, Math.min(0, parsed.x)),
        y: Math.max(-maxY, Math.min(0, parsed.y))
      })
    }
  }, [])

  // Save position to localStorage
  const savePosition = useCallback((pos) => {
    localStorage.setItem('whatsapp-btn-position', JSON.stringify(pos))
  }, [])

  // Get client position from mouse or touch event
  const getClientPos = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    return { x: e.clientX, y: e.clientY }
  }

  // Handle drag start
  const handleDragStart = useCallback((e) => {
    if (e.target.closest('a') || e.target.closest('button[data-popup]')) return
    e.preventDefault()
    setIsDragging(true)
    setHasMoved(false)
    const clientPos = getClientPos(e)
    startMouse.current = clientPos
    startPos.current = { ...position }
  }, [position])

  // Handle drag move
  const handleDragMove = useCallback((e) => {
    if (!isDragging) return
    e.preventDefault()
    const clientPos = getClientPos(e)
    const deltaX = clientPos.x - startMouse.current.x
    const deltaY = clientPos.y - startMouse.current.y

    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      setHasMoved(true)
    }

    const maxX = 0
    const minX = -(window.innerWidth - 56)
    const maxY = 0
    const minY = -(window.innerHeight - 56)

    const newX = Math.max(minX, Math.min(maxX, startPos.current.x + deltaX))
    const newY = Math.max(minY, Math.min(maxY, startPos.current.y + deltaY))

    setPosition({ x: newX, y: newY })
  }, [isDragging])

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      savePosition(position)
    }
  }, [isDragging, position, savePosition])

  // Add global event listeners for drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove)
      window.addEventListener('mouseup', handleDragEnd)
      window.addEventListener('touchmove', handleDragMove, { passive: false })
      window.addEventListener('touchend', handleDragEnd)
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove)
      window.removeEventListener('mouseup', handleDragEnd)
      window.removeEventListener('touchmove', handleDragMove)
      window.removeEventListener('touchend', handleDragEnd)
    }
  }, [isDragging, handleDragMove, handleDragEnd])

  // Handle click - only if no drag occurred
  const handleClick = () => {
    if (!hasMoved) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div
      ref={dragRef}
      className="fixed z-50 select-none"
      style={{
        bottom: 24 - position.y,
        right: 24 - position.x,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-popup
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-20 right-0 w-[calc(100vw-3rem)] max-w-80 bg-white rounded-2xl shadow-2xl overflow-hidden mb-2"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <div className="bg-[#25D366] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <WhatsAppIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">The Velvet Crumb</p>
                  <p className="text-white/80 text-xs">Usually replies instantly</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#ECE5DD]">
              <div className="bg-white rounded-lg p-3 shadow-sm max-w-[85%]">
                <p className="text-sm text-gray-800">
                  Hi there! 👋 Welcome to The Velvet Crumb. How can we help you today?
                </p>
                <p className="text-[10px] text-gray-400 mt-1 text-right">Just now</p>
              </div>
            </div>

            <div className="p-3 border-t">
              <a
                href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#25D366] hover:bg-[#128C7E] text-white text-center py-3 rounded-xl text-sm font-semibold transition-colors duration-300"
              >
                Start Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleClick}
        className="w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 transition-colors duration-300"
        whileHover={{ scale: isDragging ? 1 : 1.1 }}
        whileTap={{ scale: isDragging ? 1 : 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <WhatsAppIcon className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
