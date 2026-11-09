import confetti from 'canvas-confetti'

// 흰색은 핑크 배경 위에서 하얀 네모로 보여서 제외, 이모지 비트맵 대신 벡터 모양 사용
const colors = ['#ff5fa2', '#ff3d8b', '#ffd84d', '#8fe3cf', '#b58cff', '#ff9a3d']
const heart = confetti.shapeFromPath({
  path: 'M167 72c19-38 37-56 75-56 42 0 76 33 76 75 0 76-76 151-151 227C89 242 14 167 14 91c0-42 34-75 76-75 38 0 57 18 77 56z',
})
const star = confetti.shapeFromPath({ path: 'M50 0 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z' })
const base = { colors, zIndex: 100, disableForReducedMotion: true, shapes: ['circle', star, heart] }
const rand = (a, b) => a + Math.random() * (b - a)

export const burst = (origin = { x: 0.5, y: 0.6 }) => {
  confetti({ ...base, particleCount: 90, spread: 80, startVelocity: 45, origin })
  confetti({ ...base, particleCount: 24, spread: 100, startVelocity: 35, scalar: 1.6, shapes: [heart], origin })
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

// 토핑 탭 등 작은 반짝임 (화면 좌표 -> 0~1 비율로 변환해서 사용)
export const sparkle = (origin) =>
  confetti({
    ...base, particleCount: 12, spread: 70, startVelocity: 20, gravity: 0.7,
    scalar: 0.8, ticks: 45, origin, shapes: ['circle', star],
  })
