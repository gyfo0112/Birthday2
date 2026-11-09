import gsap from 'gsap'

const audio = new Audio(`${import.meta.env.BASE_URL}song.mp3`)
audio.loop = true
audio.preload = 'auto'

export const bgm = {
  // 반드시 사용자 탭 핸들러 안에서 호출 (iOS 자동재생 제한)
  start() {
    audio.volume = 0
    audio.play().catch(() => {})
    gsap.to(audio, { volume: 0.55, duration: 2.5 })
  },
  setMuted(m) { audio.muted = m },
  // 권한 팝업 때문에 iOS가 오디오를 멈췄으면 다시 재생 시도
  ensure() { if (audio.paused && audio.volume > 0) audio.play().catch(() => {}) },
  // 소원 빌 때 BGM을 살짝 낮췄다가 되돌림
  duck(v) { gsap.to(audio, { volume: v, duration: 0.8 }) },
  restart() {
    audio.currentTime = 0
    this.start()
  },
}
