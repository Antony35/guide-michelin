export function useCursor() {
  const cursorX = ref(-100)
  const cursorY = ref(-100)
  const trailX = ref(-100)
  const trailY = ref(-100)
  const isVisible = ref(false)

  let animationFrameId = 0

  function updatePosition(event: MouseEvent) {
    cursorX.value = event.clientX
    cursorY.value = event.clientY
    if (!isVisible.value) isVisible.value = true
  }

  function animateTrail() {
    trailX.value += (cursorX.value - trailX.value) * 0.1
    trailY.value += (cursorY.value - trailY.value) * 0.1
    animationFrameId = requestAnimationFrame(animateTrail)
  }

  onMounted(() => {
    window.addEventListener('mousemove', updatePosition)
    animateTrail()
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', updatePosition)
    cancelAnimationFrame(animationFrameId)
  })

  return { cursorX, cursorY, trailX, trailY, isVisible }
}
