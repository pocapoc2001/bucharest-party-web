import { useEffect, useRef } from 'react'
import { signOut } from '/src/lib/auth'

/**
 * Logs out the user after `idleMs` of no activity.
 * Activity = mouse, keyboard, touch, scroll.
 */
export function useIdleLogout({ idleMs = 10 * 60 * 1000, onLogout } = {}) {
  const timerRef = useRef(null)

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(async () => {
      try {
        await signOut()
      } finally {
        onLogout?.()
      }
    }, idleMs)
  }

  useEffect(() => {
    // Start timer immediately
    resetTimer()

    const events = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
      'click',
    ]

    const handleActivity = () => resetTimer()

    events.forEach((e) => window.addEventListener(e, handleActivity, { passive: true }))

    // Extra: when tab becomes visible again, reset timer
    const handleVisibility = () => {
      if (!document.hidden) resetTimer()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      events.forEach((e) => window.removeEventListener(e, handleActivity))
      document.removeEventListener('visibilitychange', handleVisibility)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idleMs])
}