import { requestMotion } from './useShake.js'

// 시작 화면에서 한 번에 받아 둔 권한 결과. 이후 화면들이 이 값을 보고 UI를 맞춘다.
// 값: unknown(아직 안 물음) | granted | denied | unsupported
export const perms = { mic: 'unknown', motion: 'unknown' }

const isTouch = () => typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches

async function askMotion() {
  if (perms.motion !== 'unknown') return
  // 폰이 아니면(데스크톱) 흔들기는 의미가 없어서 묻지 않음
  if (!isTouch()) { perms.motion = 'unsupported'; return }
  const r = await requestMotion() // 호출 자체는 동기적으로 일어남 (탭 제스처 안)
  perms.motion = r === 'granted' ? 'granted' : r === 'unsupported' ? 'unsupported' : 'denied'
}

async function askMic() {
  if (perms.mic !== 'unknown') return
  if (!navigator.mediaDevices?.getUserMedia) { perms.mic = 'unsupported'; return }
  try {
    const s = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
    })
    s.getTracks().forEach((t) => t.stop()) // 권한만 받고 바로 끔 (마이크 표시가 길게 남지 않도록)
    perms.mic = 'granted'
  } catch {
    perms.mic = 'denied'
  }
}

// 반드시 사용자가 탭한 핸들러 안에서, await 없이 바로 호출할 것 (iOS 제한)
// 두 요청을 같은 탭 안에서 동시에 시작하고, 둘 다 끝나면 resolve
export function requestAll() {
  const motion = askMotion()
  const mic = askMic()
  return Promise.all([motion, mic]).catch(() => {})
}
