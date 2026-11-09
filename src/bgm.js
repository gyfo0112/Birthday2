import gsap from 'gsap'
import { getCtx, resumeCtx } from './audioCtx.js'

const audio = new Audio(`${import.meta.env.BASE_URL}song.mp3`)
audio.loop = true
audio.preload = 'auto'

// 노래 파일 자체가 평균 -20dB로 작게 녹음돼 있어서(순간 최대치는 거의 꽉 참) 게인을 키우고,
// 찌그러지지 않도록 리미터(DynamicsCompressor)를 거친다. 측정: 평균 -25dB -> -14dB, 최대치 -0.9dB
const LEVEL = 1.6 // 평소 BGM 크기 (게인)
const DUCK = 0.36 // 소원 빌 때 줄이는 비율
const FADE_IN = 2 // 로딩 화면에서 서서히 커지는 시간(초)

// 아이폰 사파리는 audio.volume 값을 무시한다(항상 최대). 그래서 볼륨은
// WebAudio 게인 노드로 조절한다: <audio> -> Gain -> 리미터 -> 스피커
let gain = null
let started = false

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
    if (gain) rampTo(LEVEL, FADE_IN)
    else gsap.to(audio, { volume: Math.min(1, LEVEL), duration: FADE_IN })
  },
  setMuted(m) { audio.muted = m },
  // 권한 팝업 때문에 iOS가 오디오를 멈췄으면 다시 재생 시도
  ensure() {
    if (!started) return
    resumeCtx()
    if (audio.paused) audio.play().catch(() => {})
  },
  // 소원 빌 때 BGM을 줄였다가(true) 되돌림(false)
  duck(on) {
    const v = on ? LEVEL * DUCK : LEVEL
    if (gain) rampTo(v, 0.8)
    else gsap.to(audio, { volume: Math.min(1, v), duration: 0.8 })
  },
  // 확인용: 현재 BGM 크기
  level() { return gain ? gain.gain.value : audio.volume },
  state() { return { ctx: getCtx()?.state, paused: audio.paused, t: audio.currentTime, viaGain: !!gain, elVolume: audio.volume } },
}

if (typeof window !== 'undefined') window.__bgm = bgm
