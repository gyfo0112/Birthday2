import { useCallback, useEffect, useRef, useState } from 'react'
import { createBlowDetector } from './blowDetector.js'

const GAUGE_EVERY_MS = 70 // 게이지 화면 갱신 주기 (너무 자주 리렌더하지 않도록)

// 마이크로 "후~" 를 감지한다. gauge: { ready, charge(0~1) } 를 화면에 보여줄 수 있다.
export function useBlow(onBlow) {
  const [status, setStatus] = useState('idle') // idle | listening | denied | unsupported
  const [gauge, setGauge] = useState({ ready: false, charge: 0 })
  const cleanup = useRef(() => {})
  const cb = useRef(onBlow)
  cb.current = onBlow

  const stop = useCallback(() => {
    cleanup.current()
    cleanup.current = () => {}
  }, [])

  const start = useCallback(async () => {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!navigator.mediaDevices?.getUserMedia || !AC) return setStatus('unsupported')
    // iOS 사파리: AudioContext는 탭 제스처 안(await 이전)에서 만들고 resume 해야 소리/분석이 동작함
    const ctx = new AC()
    ctx.resume?.()
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      })
      if (ctx.state === 'suspended') ctx.resume?.()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 1024
      analyser.smoothingTimeConstant = 0.55
      ctx.createMediaStreamSource(stream).connect(analyser)
      const data = new Uint8Array(analyser.frequencyBinCount)

      // 입김(바람 소리)은 약 80Hz~1.2kHz 대역에 에너지가 몰림
      const binHz = ctx.sampleRate / analyser.fftSize
      const i0 = Math.max(1, Math.ceil(80 / binHz))
      const i1 = Math.max(i0 + 1, Math.floor(1200 / binHz))

      const det = createBlowDetector()
      let raf = 0
      let last = performance.now()
      let lastUi = 0

      const tick = () => {
        const now = performance.now()
        const dt = Math.min(100, now - last)
        last = now
        analyser.getByteFrequencyData(data)
        let sum = 0
        for (let i = i0; i <= i1; i++) sum += data[i]
        const level = sum / (i1 - i0 + 1) / 255

        const r = det.push(level, dt)
        if (now - lastUi > GAUGE_EVERY_MS) {
          lastUi = now
          setGauge({ ready: r.ready, charge: r.charge })
        }
        if (r.triggered) {
          setGauge({ ready: true, charge: 1 })
          return cb.current()
        }
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)

      cleanup.current = () => {
        cancelAnimationFrame(raf)
        stream.getTracks().forEach((t) => t.stop())
        ctx.close()
      }
      setStatus('listening')
    } catch {
      ctx.close?.()
      setStatus('denied')
    }
  }, [])

  useEffect(() => stop, [stop])

  return { status, gauge, start, stop }
}
