/**
 * useShare - Web Share API Hook
 * Шаринг контента через нативные возможности устройства
 */

import { useState, useCallback } from 'react'
import { useTelegram } from './useTelegram'

interface ShareData {
  /** Заголовок */
  title?: string
  /** Текст */
  text?: string
  /** URL */
  url?: string
  /** Файлы (для поддерживающих устройств) */
  files?: File[]
}

interface UseShareOptions {
  /** Колбэк при успешном шаринге */
  onSuccess?: () => void
  /** Колбэк при ошибке */
  onError?: (error: string) => void
  /** Fallback метод если Web Share API не поддерживается */
  fallback?: (data: ShareData) => void
}

/**
 * Хук для шаринга контента через Web Share API
 * 
 * @example
 * const { share, isSharing, isSupported } = useShare({
 *   onSuccess: () => toast.success('Поделились!')
 * })
 * 
 * const handleShare = () => {
 *   share({
 *     title: 'Мои достижения',
 *     text: 'Я получил 10 наград в DA Teens!',
 *     url: window.location.href
 *   })
 * }
 */
export function useShare({
  onSuccess,
  onError,
  fallback
}: UseShareOptions = {}) {
  const { haptic } = useTelegram()
  const [isSharing, setIsSharing] = useState(false)

  // Проверка поддержки Web Share API
  const isSupported = typeof navigator !== 'undefined' && 
    'share' in navigator

  // Проверка поддержки файлов
  const canShareFiles = isSupported && 
    navigator.canShare && 
    navigator.canShare({ files: [] })

  const share = useCallback(async (data: ShareData) => {
    if (!isSupported) {
      // Fallback для неподдерживающих устройств
      if (fallback) {
        fallback(data)
      } else {
        // Default fallback - копирование в буфер
        if (data.url) {
          try {
            await navigator.clipboard.writeText(data.url)
            haptic.success()
            if (onSuccess) onSuccess()
          } catch {
            const errorMsg = 'Не удалось скопировать ссылку'
            if (onError) onError(errorMsg)
            haptic.error()
          }
        }
      }
      return
    }

    setIsSharing(true)

    try {
      // Проверяем возможность шаринга файлов
      if (data.files && data.files.length > 0) {
        if (!canShareFiles) {
          throw new Error('Шаринг файлов не поддерживается')
        }
        
        const canShare = navigator.canShare({ files: data.files })
        if (!canShare) {
          throw new Error('Невозможно поделиться этими файлами')
        }
      }

      await navigator.share(data)
      
      haptic.success()
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      // Пользователь отменил шаринг - не считаем это ошибкой
      if (error.name === 'AbortError') {
        console.log('Share cancelled by user')
      } else {
        console.error('Share error:', error)
        haptic.error()
        if (onError) {
          onError(error.message || 'Ошибка при попытке поделиться')
        }
      }
    } finally {
      setIsSharing(false)
    }
  }, [isSupported, canShareFiles, haptic, onSuccess, onError, fallback])

  return {
    /** Функция для шаринга */
    share,
    /** Идет ли процесс шаринга */
    isSharing,
    /** Поддерживается ли Web Share API */
    isSupported,
    /** Можно ли шарить файлы */
    canShareFiles
  }
}

/**
 * Хелпер для быстрого шаринга достижений
 */
export function useShareAchievement() {
  return useShare({
    onSuccess: () => console.log('Achievement shared!'),
    fallback: (data) => {
      // Fallback: открываем Telegram Share
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(data.url || '')}&text=${encodeURIComponent(data.text || '')}`
      window.open(telegramUrl, '_blank')
    }
  })
}
