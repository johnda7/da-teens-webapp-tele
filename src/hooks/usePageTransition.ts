/**
 * usePageTransition - Page Transition Hook
 * Анимации переходов между страницами/табами
 */

import { useEffect, useState } from 'react'
import { useTelegram } from './useTelegram'

export type TransitionDirection = 'left' | 'right' | 'up' | 'down' | 'fade'

interface PageTransitionOptions {
  /** Направление анимации */
  direction?: TransitionDirection
  /** Длительность (ms) */
  duration?: number
  /** Trigger haptic при переходе */
  haptic?: boolean
}

/**
 * Хук для анимации переходов между страницами
 * Возвращает классы и стили для framer-motion
 * 
 * @example
 * const { variants, transition } = usePageTransition({
 *   direction: 'left',
 *   duration: 300
 * })
 * 
 * <motion.div
 *   initial="initial"
 *   animate="animate"
 *   exit="exit"
 *   variants={variants}
 *   transition={transition}
 * >
 *   {content}
 * </motion.div>
 */
export function usePageTransition({
  direction = 'fade',
  duration = 300,
  haptic: enableHaptic = true
}: PageTransitionOptions = {}) {
  const { haptic } = useTelegram()
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (isTransitioning && enableHaptic) {
      haptic.light()
    }
  }, [isTransitioning, enableHaptic, haptic])

  // Варианты анимации для framer-motion
  const variants = {
    left: {
      initial: { x: '100%', opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: '-100%', opacity: 0 }
    },
    right: {
      initial: { x: '-100%', opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: '100%', opacity: 0 }
    },
    up: {
      initial: { y: '100%', opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: '-100%', opacity: 0 }
    },
    down: {
      initial: { y: '-100%', opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: '100%', opacity: 0 }
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    }
  }[direction]

  const transition = {
    type: 'tween',
    duration: duration / 1000,
    ease: 'easeInOut'
  }

  return {
    /** Варианты для motion.div */
    variants,
    /** Настройки transition */
    transition,
    /** Идет ли сейчас переход */
    isTransitioning,
    /** Установить состояние перехода */
    setIsTransitioning
  }
}

/**
 * Хелпер для табов с анимацией
 */
export function useTabTransition(currentTab: string) {
  const [prevTab, setPrevTab] = useState(currentTab)
  const [direction, setDirection] = useState<'left' | 'right'>('left')

  useEffect(() => {
    // Определяем направление на основе порядка табов
    const tabs = ['dashboard', 'checkin', 'cohort', 'badges', 'profile']
    const prevIndex = tabs.indexOf(prevTab)
    const currentIndex = tabs.indexOf(currentTab)

    if (currentIndex > prevIndex) {
      setDirection('left')
    } else if (currentIndex < prevIndex) {
      setDirection('right')
    }

    setPrevTab(currentTab)
  }, [currentTab, prevTab])

  return usePageTransition({ direction, duration: 250 })
}
