/**
 * BottomSheet - Mobile Bottom Sheet Component
 * Мобильный bottom sheet с snap points и haptic feedback
 */

import { ReactNode, useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { X } from '@phosphor-icons/react'
import { useTelegram } from '@/hooks/useTelegram'
import { cn } from '@/lib/utils'

interface BottomSheetProps {
  /** Открыт ли sheet */
  isOpen: boolean
  /** Колбэк при закрытии */
  onClose: () => void
  /** Контент */
  children: ReactNode
  /** Snap points (0-1, где 1 = полная высота) */
  snapPoints?: number[]
  /** Начальная snap точка */
  initialSnap?: number
  /** Заголовок */
  title?: string
  /** Показывать ли кнопку закрытия */
  showClose?: boolean
  /** Можно ли закрыть свайпом вниз */
  swipeToClose?: boolean
  className?: string
}

/**
 * Bottom Sheet для мобильных устройств
 * 
 * @example
 * <BottomSheet
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Детали модуля"
 *   snapPoints={[0.4, 0.8]}
 * >
 *   <ModuleDetails />
 * </BottomSheet>
 */
export function BottomSheet({
  isOpen,
  onClose,
  children,
  snapPoints = [0.6, 0.9],
  initialSnap = 0,
  title,
  showClose = true,
  swipeToClose = true,
  className
}: BottomSheetProps) {
  const { haptic } = useTelegram()
  const [currentSnap, setCurrentSnap] = useState(initialSnap)
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Блокируем скролл body
      document.body.style.overflow = 'hidden'
      haptic.light()
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, haptic])

  const handleDragEnd = useCallback((_: any, info: PanInfo) => {
    const velocity = info.velocity.y
    const offset = info.offset.y

    // Быстрый свайп вниз - закрыть
    if (velocity > 500 && swipeToClose) {
      haptic.medium()
      onClose()
      return
    }

    // Быстрый свайп вверх - на следующий snap point
    if (velocity < -500 && currentSnap < snapPoints.length - 1) {
      haptic.light()
      setCurrentSnap(currentSnap + 1)
      return
    }

    // Медленный свайп - найти ближайший snap point
    const threshold = window.innerHeight * 0.1
    
    if (offset > threshold && currentSnap > 0) {
      haptic.light()
      setCurrentSnap(currentSnap - 1)
    } else if (offset > threshold && swipeToClose) {
      haptic.medium()
      onClose()
    } else if (offset < -threshold && currentSnap < snapPoints.length - 1) {
      haptic.light()
      setCurrentSnap(currentSnap + 1)
    }
  }, [currentSnap, snapPoints.length, swipeToClose, onClose, haptic])

  const heightPercentage = snapPoints[currentSnap] || 0.6

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            initial={{ y: '100%' }}
            animate={{ y: `${(1 - heightPercentage) * 100}%` }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50',
              'bg-white rounded-t-3xl shadow-2xl',
              'flex flex-col',
              className
            )}
            style={{ maxHeight: '95vh' }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
                {showClose && (
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} weight="bold" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
