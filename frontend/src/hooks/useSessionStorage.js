// Persist a JSON-serialisable value in sessionStorage with React state sync.
import { useCallback, useState } from 'react'

/**
 * @template T
 * @param {string} key
 * @param {T} initialValue
 * @returns {[T, (value: T) => void, () => void]}
 */
export function useSessionStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.sessionStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  const setStoredValue = useCallback(
    (newValue) => {
      setValue(newValue)
      try {
        if (newValue === null || newValue === undefined) {
          window.sessionStorage.removeItem(key)
        } else {
          window.sessionStorage.setItem(key, JSON.stringify(newValue))
        }
      } catch {
        // Ignore storage write failures (e.g. private mode quota).
      }
    },
    [key],
  )

  const clear = useCallback(() => {
    setValue(initialValue)
    try {
      window.sessionStorage.removeItem(key)
    } catch {
      // Ignore.
    }
  }, [key, initialValue])

  return [value, setStoredValue, clear]
}
