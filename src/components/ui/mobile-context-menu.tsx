/**
 * MobileContextMenu - Mobile Context Menu Component
 * Long-press контекстное меню для мобильных устройств (отдельно от Radix ContextMenu)
 */

import { ReactNode, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTelegram } from '@/hooks/useTelegram'
import { cn } from '@/lib/utils'

export interface MobileContextMenuItem {
  id: string
  label: string
  icon?: ReactNode
  onClick: () => void
  destructive?: boolean
  disabled?: boolean
}

interface MobileContextMenuProps {
  children: ReactNode
  items: MobileContextMenuItem[]
  longPressDuration?: number
  className?: string
}

/**
 * Мобильное контекстное меню с long-press
 */
export function MobileContextMenu({
  children,
  items,
  longPressDuration = 500,
  className
}: MobileContextMenuProps) {
  const { haptic } = useTelegram()
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const timerRef = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    timerRef.current = window.setTimeout(() => {
      haptic.medium()
      setPosition({ x: touch.clientX, y: touch.clientY })
      setIsOpen(true)
    }, longPressDuration)
  }

  const handleTouchEnd = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const handleItemClick = (item: MobileContextMenuItem) => {
    if (item.disabled) return
    haptic.light()
    item.onClick()
    setIsOpen(false)
  }

  return (
    <>
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchEnd}
        className={cn('touch-none', className)}
      >
        {children}
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed z-50 bg-white rounded-2xl shadow-2xl overflow-hidden min-w-[200px]"
              style={{
                top: Math.min(position.y, window.innerHeight - 300),
                left: Math.min(position.x, window.innerWidth - 220),
              }}
            >
              <div className="py-2">
                {items.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    disabled={item.disabled}
                    className={cn(
                      'w-full px-4 py-3 flex items-center gap-3 transition-colors text-left',
                      item.destructive ? 'text-red-600 hover:bg-red-50' : 'text-gray-900 hover:bg-gray-100',
                      item.disabled && 'opacity-50 cursor-not-allowed',
                      index !== items.length - 1 && 'border-b border-gray-100'
                    )}
                  >
                    {item.icon && <span className="text-lg">{item.icon}</span>}
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
