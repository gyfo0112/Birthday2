// 효과음과 BGM이 함께 쓰는 하나의 AudioContext
let ctx = null

export function getCtx() {
  if (!ctx) {
    const C = window.AudioContext || window.webkitAudioContext
    if (!C) return null
    ctx = new C()
  }
  return ctx
}

export function resumeCtx() {
  const c = getCtx()
  if (c && c.state !== 'running') c.resume?.().catch(() => {})
  return c
}

// 권한 팝업/전화 등으로 iOS가 오디오를 중단(suspended/interrupted)시켰다면 다음 탭에서 다시 살린다
if (typeof document !== 'undefined') {
  document.addEventListener('pointerdown', () => {
    if (ctx && ctx.state !== 'running') ctx.resume?.().catch(() => {})
  }, { passive: true })
}
