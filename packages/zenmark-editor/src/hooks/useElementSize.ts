import { useEffect, useState } from 'react'

export function useElementSize<T extends HTMLElement>(ref: React.RefObject<T>) {
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const measure = () => {
      setSize({ width: el.offsetWidth, height: el.offsetHeight })
    }

    // Initial measure
    measure()

    const ro = new ResizeObserver(() => measure())
    ro.observe(el)

    return () => {
      try { ro.disconnect() } catch {}
    }
  }, [ref])

  return size
}

