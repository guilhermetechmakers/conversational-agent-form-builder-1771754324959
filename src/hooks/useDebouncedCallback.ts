import { useRef, useCallback, useEffect } from 'react'

/**
 * Returns a debounced version of the callback that delays invocation
 * until after `delay` ms have elapsed since the last call.
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): T {
  const callbackRef = useRef(callback)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastArgsRef = useRef<Parameters<T>>()
  const lastThisRef = useRef<unknown>()

  useEffect(() => {
    callbackRef.current = callback
  })

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      lastArgsRef.current = args
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null
        callbackRef.current.apply(lastThisRef.current, lastArgsRef.current ?? [])
      }, delay)
    },
    [delay]
  ) as T

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return debounced
}
