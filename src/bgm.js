import gsap from 'gsap'
import { getCtx, resumeCtx } from './audioCtx.js'

const audio = new Audio(`${import.meta.env.BASE_URL}song.mp3`)
audio.loop = true
audio.preload = 'auto'

const LEVEL = 0.55 // 평소 BGM 크기
const FADE_IN = 2.5 // 처음 서서히 커지는 시간(초)

// 아이폰 사파리는 audio.volume 값을 무시한다(항상 최대). 그래서 볼륨은
// WebAudio 게인 노드로 조절한다: <audio> -> Gain -> 스피커
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
    src.connect(gain).connect(c.destination)
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
  // 반드시 사용자 탭 핸들러 안에서 호출 (iOS 자동재생 제한)
  start() {
    started = true
    resumeCtx()
    if (graph()) {
      audio.volume = 1 // 볼륨은 게인으로만 조절
      gain.gain.setValueAtTime(0, getCtx().currentTime)
      rampTo(LEVEL, FADE_IN)
    } else {
      // WebAudio를 못 쓰는 환경: 예전 방식(아이폰에서는 효과 없음)
      audio.volume = 0
      gsap.to(audio, { volume: LEVEL, duration: FADE_IN })
    }
    audio.play().catch(() => {})
  },
  setMuted(m) { audio.muted = m },
  // 권한 팝업 때문에 iOS가 오디오를 멈췄으면 다시 재생 시도
  ensure() {
    if (!started) return
    resumeCtx()
    if (audio.paused) audio.play().catch(() => {})
  },
  // 소원 빌 때 BGM을 살짝 낮췄다가 되돌림
  duck(v) {
    if (gain) rampTo(v, 0.8)
    else gsap.to(audio, { volume: v, duration: 0.8 })
  },
  restart() {
    audio.currentTime = 0
    this.start()
  },
  // 확인용: 현재 BGM 크기(0~1)
  level() { return gain ? gain.gain.value : audio.volume },
  state() { return { ctx: getCtx()?.state, paused: audio.paused, t: audio.currentTime, viaGain: !!gain, elVolume: audio.volume } },
}

if (typeof window !== 'undefined') window.__bgm = bgm
