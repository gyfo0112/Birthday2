import { PREVIEW_KEY } from './time.js'

// 윤서 폰(브라우저)에 남기는 두 가지 표시
//  - lockSeen: 잠금 화면을 본 적이 있음
//  - unlockShown: 자물쇠가 풀리는 연출을 이미 봤음 (한 번만 보여주기 위해)
const SEEN = 'yunseo:lockSeen'
const SHOWN = 'yunseo:unlockShown'

const get = (k) => { try { return localStorage.getItem(k) === '1' } catch { return false } }
const set = (k) => { try { localStorage.setItem(k, '1') } catch { /* 저장 불가 환경이면 연출 없이 진행 */ } }

// 테스트용: ?reset=1&key=키 로 열면 표시를 지운다 (키가 없으면 무시)
try {
  const q = new URLSearchParams(location.search)
  if (q.get('reset') === '1' && q.get('key') === PREVIEW_KEY) {
    localStorage.removeItem(SEEN)
    localStorage.removeItem(SHOWN)
  }
} catch { /* ignore */ }

export const markLockSeen = () => set(SEEN)
export const markUnlockShown = () => set(SHOWN)

// 잠금 화면을 본 적이 있고, 풀리는 연출은 아직 못 봤다면 (생일 0시 이후에 다시 열었을 때) 연출을 보여준다
export const needsUnlockCeremony = () => get(SEEN) && !get(SHOWN)
