import { useEffect, useState } from 'react'

/**
 * Lightweight key-value hook for local persistence.
 * Replaces @github/spark/hooks useKV
 * 
 * Persists value in localStorage under the given key.
 * 
 * @param key - localStorage key
 * @param initial - initial value if key doesn't exist
 * @returns [value, setValue] tuple
 */
export function useKV<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore write errors (e.g., storage quota exceeded)
      console.warn(`[useKV] Failed to save to localStorage: ${key}`)
    }
  }, [key, value])

  return [value, setValue]
}
