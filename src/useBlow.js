import { useCallback, useEffect, useRef, useState } from 'react'

// 마이크 입력의 저주파 에너지가 일정 시간 이상 크게 유지되면 "후~" 로 판단
const THRESHOLD = 0.35 // 0~1, 낮을수록 민감
const HOLD_MS = 350

export function useBlow(onBlow) {
  const [status, setStatus] = useState('idle') // idle | listening | denied | unsupported
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
      analyser.fftSize = 512
      ctx.createMediaStreamSource(stream).connect(analyser)
      const data = new Uint8Array(analyser.frequencyBinCount)
      let loudSince = 0
      let raf = 0

      const tick = () => {
        analyser.getByteFrequencyData(data)
        // 입김은 낮은 대역(약 0~1.5kHz)에 에너지가 몰림
        const bins = Math.max(1, Math.floor(data.length * 0.15))
        let sum = 0
        for (let i = 0; i < bins; i++) sum += data[i]
        const level = sum / bins / 255
        const now = performance.now()
        if (level > THRESHOLD) {
          loudSince ||= now
          if (now - loudSince > HOLD_MS) return cb.current()
        } else {
          loudSince = 0
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

  return { status, start, stop }
}
