import confetti from 'canvas-confetti'

const colors = ['#ff5fa2', '#ff9ccc', '#ffd84d', '#8fe3cf', '#ffffff', '#b58cff']
const heart = confetti.shapeFromText({ text: '💗', scalar: 2 })
const base = { colors, zIndex: 100, disableForReducedMotion: true }
const rand = (a, b) => a + Math.random() * (b - a)

export const burst = (origin = { x: 0.5, y: 0.6 }) => {
  confetti({ ...base, particleCount: 90, spread: 80, startVelocity: 45, origin })
  confetti({ ...base, particleCount: 24, spread: 100, startVelocity: 35, scalar: 2, shapes: [heart], origin })
}

export const rain = (ms = 2200) => {
  const end = Date.now() + ms
  ;(function frame() {
    confetti({ ...base, particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 } })
    confetti({ ...base, particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 } })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

export const firework = () =>
  confetti({
    ...base, startVelocity: 30, spread: 360, ticks: 70, particleCount: 55,
    origin: { x: rand(0.1, 0.9), y: rand(0.1, 0.45) },
  })

export function fireworks(interval = 800) {
  const t = setInterval(firework, interval)
  return () => clearInterval(t)
}

export const haptic = (p = 15) => {
  try { navigator.vibrate?.(p) } catch { /* ignore */ }
}
