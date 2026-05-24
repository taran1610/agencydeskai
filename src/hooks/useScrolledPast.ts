import { useSyncExternalStore } from 'react'

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener('scroll', onStoreChange, { passive: true })
  return () => window.removeEventListener('scroll', onStoreChange)
}

export const useScrolledPast = (thresholdPx: number) =>
  useSyncExternalStore(
    subscribe,
    () => window.scrollY > thresholdPx,
    () => false,
  )
