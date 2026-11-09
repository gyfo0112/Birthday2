// 미리보기용: ?now=2026-11-12&key=키 처럼 붙이면 그 날짜로 시뮬레이션 (시계는 계속 흘러감)
// 키가 없으면 무시된다 (윤서가 우연히/장난으로 잠금을 우회하지 못하도록)
export const PREVIEW_KEY = 'yunseo-preview'

const fake = (() => {
  try {
    const q = new URLSearchParams(location.search)
    const v = q.get('now')
    if (!v || q.get('key') !== PREVIEW_KEY) return 0
    const t = new Date(v.length <= 10 ? `${v}T12:00:00` : v).getTime()
    return Number.isNaN(t) ? 0 : t - Date.now()
  } catch {
    return 0
  }
})()

export const getNow = () => new Date(Date.now() + fake)

const DAY = 86400000
const midnight = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

// before: 생일 0시 이전(잠금) / today: 당일 / after: 지난 뒤
export function getBirthdayState(now, { year, month, day }) {
  const target = new Date(year ?? now.getFullYear(), month - 1, day)
  const diff = Math.round((target - midnight(now)) / DAY)
  if (diff === 0) return { mode: 'today', days: 0, target }
  if (diff > 0) return { mode: 'before', days: diff, target }
  return { mode: 'after', days: -diff, target }
}

export function remaining(now, target) {
  let ms = Math.max(0, target - now)
  const d = Math.floor(ms / DAY); ms -= d * DAY
  const h = Math.floor(ms / 3600000); ms -= h * 3600000
  const m = Math.floor(ms / 60000); ms -= m * 60000
  const s = Math.floor(ms / 1000)
  return { d, h, m, s }
}
