// 테스트용: ?now=2026-11-12 처럼 붙이면 그 날짜로 시뮬레이션 (시계는 계속 흘러감)
const fake = (() => {
  try {
    const v = new URLSearchParams(location.search).get('now')
    if (!v) return 0
    const t = new Date(v.length <= 10 ? `${v}T12:00:00` : v).getTime()
    return Number.isNaN(t) ? 0 : t - Date.now()
  } catch {
    return 0
  }
})()

export const getNow = () => new Date(Date.now() + fake)

const DAY = 86400000
const midnight = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

// before: 생일 전 / today: 당일 / after: 지난 지 60일 이내
export function getBirthdayState(now, { month, day }) {
  let y = now.getFullYear()
  let target = new Date(y, month - 1, day)
  const diff = Math.round((target - midnight(now)) / DAY)
  if (diff === 0) return { mode: 'today', days: 0, target }
  if (diff > 0) return { mode: 'before', days: diff, target }
  if (-diff <= 60) return { mode: 'after', days: -diff, target }
  y += 1
  target = new Date(y, month - 1, day)
  return { mode: 'before', days: Math.round((target - midnight(now)) / DAY), target }
}

export function remaining(now, target) {
  let ms = Math.max(0, target - now)
  const d = Math.floor(ms / DAY); ms -= d * DAY
  const h = Math.floor(ms / 3600000); ms -= h * 3600000
  const m = Math.floor(ms / 60000); ms -= m * 60000
  const s = Math.floor(ms / 1000)
  return { d, h, m, s }
}
