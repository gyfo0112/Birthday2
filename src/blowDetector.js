// "후~" 감지기. 마이크 저음역 에너지(level 0~1)를 프레임마다 넣으면
// 처음 잠깐 주변 소리를 기준으로 삼고, 기준보다 확실히 큰 소리가 이어지면 게이지(charge)가 차올라 촛불이 꺼진다.
// 기준값은 폰/환경마다 달라서 "절대값" 대신 "기준 대비 증가량"으로 판단한다.

export const CAL_MS = 600 // 처음 주변 소리를 듣는 시간
const CHARGE_THR = 0.28 // 기준보다 이만큼 커야 '불고 있음'으로 봄
const STRONG = 0.65 // 이 이상이면 기준과 상관없이 확실한 입김
const FULL_MS = 420 // 이 시간 동안 이어지면 꺼짐 (STRONG이면 더 빨리)
const DECAY = 1.6 // 멈췄을 때 게이지가 줄어드는 속도 배율
const BASE_CAP = 0.35 // 시작할 때 이미 불고 있어도 기준이 너무 높아지지 않게

const median = (a) => {
  const s = [...a].sort((x, y) => x - y)
  return s.length ? s[Math.floor(s.length / 2)] : 0
}

export function createBlowDetector() {
  let t = 0
  let ready = false
  let baseline = 0
  let charge = 0
  const cal = []

  return {
    // level: 0~1, dt: 지난 프레임 이후 ms
    push(level, dt) {
      t += dt
      if (!ready) {
        cal.push(level)
        if (t >= CAL_MS) {
          baseline = Math.min(median(cal), BASE_CAP)
          ready = true
        }
        return { ready, charge: 0, triggered: false, baseline }
      }
      const excess = level - baseline
      if (level >= STRONG || excess > CHARGE_THR) {
        charge += dt / (level >= STRONG ? FULL_MS * 0.6 : FULL_MS)
      } else {
        charge -= (dt / FULL_MS) * DECAY
        // 조용할 때는 기준선을 천천히 따라가서 주변 소음 변화에 적응
        if (excess < CHARGE_THR * 0.5) baseline += (level - baseline) * Math.min(1, dt / 2000)
      }
      charge = Math.max(0, Math.min(1, charge))
      return { ready, charge, triggered: charge >= 1, baseline }
    },
  }
}
