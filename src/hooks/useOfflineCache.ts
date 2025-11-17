/**
 * useOfflineCache - Offline Cache Hook
 * Кэширование данных в localStorage с TTL для офлайн работы
 */

import { useState, useEffect, useCallback } from 'react'

interface CacheOptions {
  /** Time to live в миллисекундах (по умолчанию 1 час) */
  ttl?: number
  /** Ключ для хранения в localStorage */
  key: string
}

interface CachedData<T> {
  data: T
  timestamp: number
}

/**
 * Хук для кэширования данных с TTL
 * 
 * @example
 * const { data, setData, isExpired, clearCache } = useOfflineCache<Module>({
 *   key: 'module-1',
 *   ttl: 3600000 // 1 час
 * })
 */
export function useOfflineCache<T>({ key, ttl = 3600000 }: CacheOptions) {
  const [data, setDataState] = useState<T | null>(null)
  const [isExpired, setIsExpired] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Загрузка из cache при монтировании
  useEffect(() => {
    try {
      const cached = localStorage.getItem(key)
      if (cached) {
        const parsed: CachedData<T> = JSON.parse(cached)
        const now = Date.now()
        const age = now - parsed.timestamp

        if (age < ttl) {
          // Cache валиден
          setDataState(parsed.data)
          setIsExpired(false)
        } else {
          // Cache истек
          setIsExpired(true)
          localStorage.removeItem(key)
        }
      }
    } catch (error) {
      console.error('Cache load error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [key, ttl])

  // Сохранение в cache
  const setData = useCallback((newData: T) => {
    try {
      const cached: CachedData<T> = {
        data: newData,
        timestamp: Date.now()
      }
      localStorage.setItem(key, JSON.stringify(cached))
      setDataState(newData)
      setIsExpired(false)
    } catch (error) {
      console.error('Cache save error:', error)
    }
  }, [key])

  // Очистка cache
  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(key)
      setDataState(null)
      setIsExpired(false)
    } catch (error) {
      console.error('Cache clear error:', error)
    }
  }, [key])

  // Проверка актуальности
  const checkExpiration = useCallback(() => {
    try {
      const cached = localStorage.getItem(key)
      if (cached) {
        const parsed: CachedData<T> = JSON.parse(cached)
        const now = Date.now()
        const age = now - parsed.timestamp
        return age >= ttl
      }
      return true
    } catch {
      return true
    }
  }, [key, ttl])

  return {
    /** Закэшированные данные */
    data,
    /** Сохранить данные в cache */
    setData,
    /** Истек ли cache */
    isExpired,
    /** Загружается ли cache */
    isLoading,
    /** Очистить cache */
    clearCache,
    /** Проверить актуальность */
    checkExpiration
  }
}
