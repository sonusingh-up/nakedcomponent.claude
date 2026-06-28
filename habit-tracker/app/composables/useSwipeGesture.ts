/**
 * Pointer-based swipe handling for a single card.
 * Right swipe = accept, left swipe = reject. Below threshold springs back.
 */
export function useSwipeGesture(opts: {
  threshold?: number
  onAccept: () => void
  onReject: () => void
}) {
  const threshold = opts.threshold ?? 110

  const x = ref(0)
  const y = ref(0)
  const dragging = ref(false)
  const leaving = ref<'left' | 'right' | null>(null)

  let startX = 0
  let startY = 0
  let startT = 0

  function down(e: PointerEvent) {
    if (leaving.value) return
    dragging.value = true
    startX = e.clientX
    startY = e.clientY
    startT = Date.now()
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  function move(e: PointerEvent) {
    if (!dragging.value) return
    x.value = e.clientX - startX
    y.value = (e.clientY - startY) * 0.4 // dampen vertical drift
  }

  function up() {
    if (!dragging.value) return
    dragging.value = false
    const dt = Date.now() - startT
    const velocity = Math.abs(x.value) / Math.max(dt, 1)

    if (x.value > threshold || (x.value > 40 && velocity > 0.5)) return fly('right')
    if (x.value < -threshold || (x.value < -40 && velocity > 0.5)) return fly('left')

    // Spring back to center.
    x.value = 0
    y.value = 0
  }

  /** Animate the card off-screen, then fire the matching callback. */
  function fly(dir: 'left' | 'right') {
    if (leaving.value) return
    leaving.value = dir
    x.value = dir === 'right' ? 700 : -700
    y.value = 40
    window.setTimeout(() => {
      dir === 'right' ? opts.onAccept() : opts.onReject()
      // Reset instantly (no transition) for the next card.
      leaving.value = null
      x.value = 0
      y.value = 0
    }, 260)
  }

  const rotation = computed(() => x.value / 18)
  const tilt = computed(() => Math.min(Math.abs(x.value) / threshold, 1)) // 0..1 intent

  const style = computed(() => ({
    transform: `translate(${x.value}px, ${y.value}px) rotate(${rotation.value}deg)`,
    transition:
      dragging.value && !leaving.value
        ? 'none'
        : 'transform 260ms var(--ease-out)',
  }))

  const handlers = {
    onPointerdown: down,
    onPointermove: move,
    onPointerup: up,
    onPointercancel: up,
  }

  return { x, y, dragging, leaving, tilt, style, handlers, fly }
}
