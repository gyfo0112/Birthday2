// 외부 파일 없이 WebAudio로 만든 효과음
let ctx
let muted = false

function ac() {
  if (muted) return null
  if (!ctx) {
    const C = window.AudioContext || window.webkitAudioContext
    if (!C) return null
    ctx = new C()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone({ freq, to, dur = 0.12, type = 'sine', vol = 0.18, delay = 0 }) {
  const c = ac()
  if (!c) return
  const t = c.currentTime + delay
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(c.destination)
  o.start(t)
  o.stop(t + dur + 0.02)
}

function noise({ dur = 0.2, vol = 0.2, freq = 1200, to, delay = 0 }) {
  const c = ac()
  if (!c) return
  const t = c.currentTime + delay
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  const src = c.createBufferSource()
  src.buffer = buf
  const f = c.createBiquadFilter()
  f.type = 'bandpass'
  f.frequency.setValueAtTime(freq, t)
  if (to) f.frequency.exponentialRampToValueAtTime(to, t + dur)
  const g = c.createGain()
  g.gain.setValueAtTime(vol, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(f).connect(g).connect(c.destination)
  src.start(t)
}

const NOTES = [523.25, 659.25, 783.99, 1046.5, 1318.5]

export const sfx = {
  setMuted: (m) => { muted = m },
  unlock: () => { ac() },
  tap: () => tone({ freq: 660, to: 880, dur: 0.09, type: 'triangle', vol: 0.16 }),
  blip: () => tone({ freq: 1200 + Math.random() * 300, dur: 0.035, type: 'square', vol: 0.04 }),
  whoosh: () => noise({ dur: 0.5, vol: 0.18, freq: 400, to: 3000 }),
  pop: () => {
    tone({ freq: 500, to: 120, dur: 0.18, type: 'sine', vol: 0.3 })
    noise({ dur: 0.12, vol: 0.25, freq: 2500 })
  },
  drop: () => {
    tone({ freq: 340, to: 180, dur: 0.14, type: 'sine', vol: 0.25 })
    tone({ freq: 700, to: 900, dur: 0.1, type: 'triangle', vol: 0.1, delay: 0.1 })
  },
  pling: (i = 0) => tone({ freq: NOTES[i % NOTES.length], dur: 0.35, type: 'triangle', vol: 0.16 }),
  puff: () => noise({ dur: 0.25, vol: 0.12, freq: 900, to: 300 }),
  win: () => NOTES.forEach((f, i) => tone({ freq: f, dur: 0.4, type: 'triangle', vol: 0.18, delay: i * 0.09 })),
  boom: () => {
    noise({ dur: 0.4, vol: 0.3, freq: 300, to: 80 })
    noise({ dur: 0.3, vol: 0.15, freq: 4000, to: 1000, delay: 0.05 })
  },
}
