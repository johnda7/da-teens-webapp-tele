/**
 * useTelegramStorage - Hook for Telegram CloudStorage API
 * 
 * Простое и надежное хранилище для персонализации:
 * - Хранение прогресса каждого пользователя
 * - Синхронизация между устройствами
 * - Бесплатно и встроено в Telegram
 * 
 * @example
 * const [progress, setProgress] = useTelegramStorage<UserProgress>('user-progress', {
 *   completedLessons: [],
 *   totalXP: 0
 * })
 */

import { useState, useEffect, useCallback } from 'react'
import { useTelegram } from './useTelegram'

export function useTelegramStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => Promise<void>, boolean] {
  const { tg } = useTelegram()
  const [value, setValue] = useState<T>(defaultValue)
  const [isLoading, setIsLoading] = useState(true)

  // Load from CloudStorage on mount
  useEffect(() => {
    if (!tg?.CloudStorage) {
      setIsLoading(false)
      return
    }

    const loadData = async () => {
      try {
        tg.CloudStorage.getItem(key, (error, result) => {
          if (error) {
            console.error(`[TelegramStorage] Error loading ${key}:`, error)
            setValue(defaultValue)
          } else if (result) {
            try {
              const parsed = JSON.parse(result) as T
              setValue(parsed)
            } catch (e) {
              console.error(`[TelegramStorage] Error parsing ${key}:`, e)
              setValue(defaultValue)
            }
          } else {
            setValue(defaultValue)
          }
          setIsLoading(false)
        })
      } catch (error) {
        console.error(`[TelegramStorage] Error in loadData:`, error)
        setValue(defaultValue)
        setIsLoading(false)
      }
    }

    loadData()
  }, [key, tg])

  // Save to CloudStorage
  const saveValue = useCallback(
    async (newValue: T) => {
      if (!tg?.CloudStorage) {
        setValue(newValue)
        return
      }

      try {
        const serialized = JSON.stringify(newValue)
        
        tg.CloudStorage.setItem(key, serialized, (error) => {
          if (error) {
            console.error(`[TelegramStorage] Error saving ${key}:`, error)
          } else {
            setValue(newValue)
          }
        })
      } catch (error) {
        console.error(`[TelegramStorage] Error serializing ${key}:`, error)
        setValue(newValue)
      }
    },
    [key, tg]
  )

  return [value, saveValue, isLoading]
}

/**
 * Helper: Get all keys from CloudStorage
 */
export function useTelegramStorageKeys(): [string[], boolean] {
  const { tg } = useTelegram()
  const [keys, setKeys] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!tg?.CloudStorage) {
      setIsLoading(false)
      return
    }

    tg.CloudStorage.getKeys((error, result) => {
      if (error) {
        console.error('[TelegramStorage] Error loading keys:', error)
      } else {
        setKeys(result || [])
      }
      setIsLoading(false)
    })
  }, [tg])

  return [keys, isLoading]
}

/**
 * Helper: Remove key from CloudStorage
 */
export function useTelegramStorageRemove() {
  const { tg } = useTelegram()

  return useCallback(
    async (key: string) => {
      if (!tg?.CloudStorage) return

      tg.CloudStorage.removeItem(key, (error) => {
        if (error) {
          console.error(`[TelegramStorage] Error removing ${key}:`, error)
        }
      })
    },
    [tg]
  )
}
