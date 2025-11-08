import { useEffect, useState } from 'react'

// Lightweight key-value hook for local persistence.
// Persists value in localStorage under the given key.
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
      // ignore write errors (e.g., storage quota)
    }
  }, [key, value])

  return [value, setValue]
}
