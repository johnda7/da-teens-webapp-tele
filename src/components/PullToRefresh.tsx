/**
 * PullToRefresh - Pull-to-Refresh Component
 * Мобильный паттерн для обновления данных
 */

import { ReactNode, useCallback, useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowClockwise } from '@phosphor-icons/react'
import { useTelegram } from '@/hooks/useTelegram'

interface PullToRefreshProps {
  children: ReactNode
  onRefresh: () => Promise<void> | void
  /** Минимальная дистанция для триггера (px) */
  threshold?: number
  /** Показывать ли индикатор загрузки */
  showLoader?: boolean
  className?: string
}

/**
 * Pull-to-Refresh компонент для мобильных устройств
 * 
 * @example
 * <PullToRefresh onRefresh={async () => await loadData()}>
 *   <DashboardContent />
 * </PullToRefresh>
 */
export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  showLoader = true,
  className = ''
}: PullToRefreshProps) {
  const { haptic } = useTelegram()
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [canPull, setCanPull] = useState(false)
  const startY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const container = containerRef.current
    if (!container) return

    // Проверяем, что скролл в самом верху
    const isAtTop = container.scrollTop === 0
    if (isAtTop) {
      setCanPull(true)
      startY.current = e.touches[0].clientY
    }
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!canPull || isRefreshing) return

    const currentY = e.touches[0].clientY
    const distance = Math.max(0, currentY - startY.current)

    if (distance > 0) {
      // Prevent default only when pulling down
      e.preventDefault()
      
      // Rubber band effect (замедление по мере оттягивания)
      const rubberBand = Math.min(distance / 2, threshold * 1.5)
      setPullDistance(rubberBand)

      // Haptic feedback при достижении threshold
      if (rubberBand >= threshold && pullDistance < threshold) {
        haptic.medium()
      }
    }
  }, [canPull, isRefreshing, threshold, pullDistance, haptic])

  const handleTouchEnd = useCallback(async () => {
    if (!canPull || isRefreshing) return

    if (pullDistance >= threshold) {
      // Триггер обновления
      setIsRefreshing(true)
      haptic.success()

      try {
        await onRefresh()
      } catch (error) {
        console.error('Refresh error:', error)
        haptic.error()
      } finally {
        setIsRefreshing(false)
      }
    }

    setPullDistance(0)
    setCanPull(false)
  }, [canPull, isRefreshing, pullDistance, threshold, onRefresh, haptic])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  const progress = Math.min(pullDistance / threshold, 1)
  const shouldTrigger = progress >= 1

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-auto ${className}`}
      style={{ height: '100%' }}
    >
      {/* Pull Indicator */}
      <AnimatePresence>
        {(pullDistance > 0 || isRefreshing) && showLoader && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center py-4"
          >
            <motion.div
              animate={{
                rotate: isRefreshing ? 360 : 0,
                scale: shouldTrigger ? 1.2 : 1
              }}
              transition={{
                rotate: {
                  duration: 1,
                  repeat: isRefreshing ? Infinity : 0,
                  ease: 'linear'
                },
                scale: { duration: 0.2 }
              }}
              className={`
                rounded-full p-2 backdrop-blur-sm border shadow-lg
                ${shouldTrigger 
                  ? 'bg-blue-500/90 border-blue-400 text-white' 
                  : 'bg-white/90 border-gray-200 text-gray-600'
                }
              `}
            >
              <ArrowClockwise 
                size={24} 
                weight={shouldTrigger ? 'bold' : 'regular'}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <motion.div
        animate={{
          y: isRefreshing ? 60 : pullDistance > 0 ? pullDistance / 2 : 0
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  )
}
