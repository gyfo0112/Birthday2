import gsap from 'gsap'
import { getCtx, resumeCtx } from './audioCtx.js'

const audio = new Audio(`${import.meta.env.BASE_URL}song.mp3`)
audio.loop = true
audio.preload = 'auto'

// 노래 파일 자체가 평균 -20dB로 작게 녹음돼 있어서(순간 최대치는 거의 꽉 참) 게인을 키우고,
// 찌그러지지 않도록 리미터(DynamicsCompressor)를 거친다. 측정: 평균 -25dB -> -14dB, 최대치 -0.9dB
const LEVEL = 1.25 // 평소 BGM 크기 (게인). 평균 약 -16dB (1.6이면 -14dB로 조금 크게 들려서 낮춤)
const DUCK = 0.36 // 소원 빌 때 줄이는 비율
const FADE_IN = 2 // 로딩 화면에서 서서히 커지는 시간(초)

// 아이폰 사파리는 audio.volume 값을 무시한다(항상 최대). 그래서 볼륨은
// WebAudio 게인 노드로 조절한다: <audio> -> Gain -> 리미터 -> 스피커
let gain = null
let started = false
let target = 0 // 음소거가 아닐 때 내야 하는 크기 (페이드인/덕킹으로 바뀜)
let muted = false

// 현재 상태(target, muted)에 맞춰 게인을 맞춘다. 음소거면 0.
function apply(sec) {
  const v = muted ? 0 : target
  if (gain) rampTo(v, sec)
  else gsap.to(audio, { volume: Math.min(1, v), duration: sec })
}

function graph() {
  if (gain) return gain
  const c = getCtx()
  if (!c) return null
  try {
    const src = c.createMediaElementSource(audio)
    gain = c.createGain()
    gain.gain.value = 0
    const limiter = c.createDynamicsCompressor()
    limiter.threshold.value = -10
    limiter.knee.value = 3
    limiter.ratio.value = 20
    limiter.attack.value = 0.003
    limiter.release.value = 0.2
    src.connect(gain).connect(limiter).connect(c.destination)
  } catch {
    gain = null
  }
  return gain
}

function rampTo(v, sec) {
  const c = getCtx()
  const g = gain.gain
  g.cancelScheduledValues(c.currentTime)
  g.setValueAtTime(g.value, c.currentTime)
  g.linearRampToValueAtTime(v, c.currentTime + sec)
}

export const bgm = {
  // 첫 탭에서 호출: 소리 없이 재생만 시작해 둔다 (iOS는 탭 안에서 재생을 시작해야 이후에 소리를 낼 수 있음)
  prime() {
    resumeCtx()
    if (!started) {
      started = true
      if (graph()) {
        audio.volume = 1 // 볼륨은 게인으로만 조절
        gain.gain.setValueAtTime(0, getCtx().currentTime)
      } else {
        audio.volume = 0 // WebAudio를 못 쓰는 환경: 예전 방식(아이폰에서는 효과 없음)
      }
    }
    audio.play().catch(() => {})
  },
  // 로딩 화면이 시작될 때 호출: 노래가 서서히 커지기 시작
  fadeIn() {
    if (!started) return
    this.ensure()
    target = LEVEL
    apply(FADE_IN)
  },
  // 음소거: 아이폰 사파리는 WebAudio를 거치면 audio.muted를 무시할 수 있어서, 게인을 0으로 내려서 끈다
  setMuted(m) {
    muted = m
    audio.muted = m
    apply(0.05)
  },
  // 권한 팝업 때문에 iOS가 오디오를 멈췄으면 다시 재생 시도
  ensure() {
    if (!started) return
    resumeCtx()
    if (audio.paused) audio.play().catch(() => {})
  },
  // 소원 빌 때 BGM을 줄였다가(true) 되돌림(false)
  duck(on) {
    target = on ? LEVEL * DUCK : LEVEL
    apply(0.8) // 음소거 중이면 계속 0으로 유지됨
  },
  // 확인용: 현재 BGM 크기
  level() { return gain ? gain.gain.value : audio.volume },
  state() { return { ctx: getCtx()?.state, paused: audio.paused, t: audio.currentTime, viaGain: !!gain, elVolume: audio.volume } },
}

if (typeof window !== 'undefined') window.__bgm = bgm
