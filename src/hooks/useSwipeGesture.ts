/**
 * useSwipeGesture - Swipe Detection Hook
 * Детекция свайпов для навигации между табами и контентом
 */

import { useEffect, useRef, useState } from 'react'
import { useTelegram } from './useTelegram'

interface SwipeGestureOptions {
  /** Колбэк при свайпе влево */
  onSwipeLeft?: () => void
  /** Колбэк при свайпе вправо */
  onSwipeRight?: () => void
  /** Колбэк при свайпе вверх */
  onSwipeUp?: () => void
  /** Колбэк при свайпе вниз */
  onSwipeDown?: () => void
  /** Минимальная дистанция для детекции свайпа (px) */
  minSwipeDistance?: number
  /** Максимальная длительность свайпа (ms) */
  maxSwipeTime?: number
}

/**
 * Хук для детекции свайп-жестов
 * 
 * @example
 * const swipeRef = useSwipeGesture({
 *   onSwipeLeft: () => nextTab(),
 *   onSwipeRight: () => prevTab(),
 *   minSwipeDistance: 80
 * })
 * 
 * return <div ref={swipeRef}>...</div>
 */
export function useSwipeGesture<T extends HTMLElement = HTMLDivElement>({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  minSwipeDistance = 60,
  maxSwipeTime = 500
}: SwipeGestureOptions = {}) {
  const { haptic } = useTelegram()
  const elementRef = useRef<T>(null)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      setTouchStart({
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now()
      })
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart) return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchStart.x
      const deltaY = touch.clientY - touchStart.y
      const deltaTime = Date.now() - touchStart.time

      // Проверяем время свайпа
      if (deltaTime > maxSwipeTime) {
        setTouchStart(null)
        return
      }

      // Определяем направление (горизонтальное vs вертикальное)
      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)

      // Горизонтальный свайп
      if (absX > absY && absX > minSwipeDistance) {
        if (deltaX > 0 && onSwipeRight) {
          haptic.light()
          onSwipeRight()
        } else if (deltaX < 0 && onSwipeLeft) {
          haptic.light()
          onSwipeLeft()
        }
      }
      // Вертикальный свайп
      else if (absY > absX && absY > minSwipeDistance) {
        if (deltaY > 0 && onSwipeDown) {
          haptic.light()
          onSwipeDown()
        } else if (deltaY < 0 && onSwipeUp) {
          haptic.light()
          onSwipeUp()
        }
      }

      setTouchStart(null)
    }

    const handleTouchCancel = () => {
      setTouchStart(null)
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })
    element.addEventListener('touchcancel', handleTouchCancel, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchend', handleTouchEnd)
      element.removeEventListener('touchcancel', handleTouchCancel)
    }
  }, [touchStart, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, minSwipeDistance, maxSwipeTime, haptic])

  return elementRef
}
