import { useEffect, useState, type RefObject } from 'react'

/** True while (or, with `once`, after) the element is visible in the viewport. */
export function useInView(ref: RefObject<Element | null>, { once = false, threshold = 0.35 } = {}) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) setInView(false)
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, once, threshold])
  return inView
}
