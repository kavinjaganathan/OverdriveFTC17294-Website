// Normalised scroll progress (0..1) of the left content panel (the real scroll container,
// not window). A plain mutable object read by the 3D scene, so scrolling never causes React renders.
export const scrollProgress = { current: 0 }
const listeners = new Set()

export const subscribeProgress = (fn) => { listeners.add(fn); return () => listeners.delete(fn) }

export function updateProgress(el) {
  const max = el.scrollHeight - el.clientHeight
  const next = max > 1 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0
  if (next === scrollProgress.current) return
  scrollProgress.current = next
  listeners.forEach((fn) => fn())
}
