import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { SunBurst } from '../art/index.jsx'
import { config } from '../config.js'
import { burst, firework, fireworks, haptic } from '../fx.js'
import { sfx } from '../sfx.js'
import { deliverCard, makeCardBlob } from '../saveCard.js'
import { motionNeedsPermission, requestMotion, useShake } from '../useShake.js'

const COLORS = ['#fff', '#ffd84d', '#ff5fa2', '#8fe3cf', '#b58cff']

export default function Ending({ cake = [], onReplay }) {
  const root = useRef(null)
  const blobP = useRef(null)
  const [msg, setMsg] = useState('')
  // off: 데스크톱/미지원, ask: 아이폰(권한 필요), on: 바로 사용 가능, denied: 거부됨
  const [motion, setMotion] = useState(() => {
    const touch = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches
    if (!touch || typeof DeviceMotionEvent === 'undefined') return 'off'
    return motionNeedsPermission() ? 'ask' : 'on'
  })
  const enableShake = () => {
    sfx.tap()
    requestMotion().then((r) => setMotion(r === 'granted' ? 'on' : 'denied'))
  }

  // 공유 시트는 버튼 탭 직후에만 열 수 있어서(iOS) 이미지를 미리 만들어 둔다
  useEffect(() => {
    const t = setTimeout(() => {
      blobP.current = makeCardBlob(cake)
      blobP.current.catch(() => {})
    }, 1500)
    return () => clearTimeout(t)
  }, [cake])

  const save = async () => {
    sfx.tap(); haptic(15)
    setMsg(config.saveBusy)
    try {
      blobP.current ||= makeCardBlob(cake)
      const r = await deliverCard(await blobP.current)
      setMsg(r === 'cancel' ? '' : config.saveDone)
    } catch {
      blobP.current = null
      setMsg(config.saveFail)
    }
    setTimeout(() => setMsg(''), 2600)
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ltr', { y: -160, opacity: 0, rotation: () => gsap.utils.random(-40, 40), duration: 0.9, stagger: 0.05, ease: 'bounce.out', delay: 0.2 })
      gsap.from('[data-in]', { y: 30, opacity: 0, duration: 0.7, stagger: 0.15, delay: 1.2, ease: 'back.out(1.6)' })
    }, root)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const t = setTimeout(() => { burst(); sfx.boom() }, 500)
    const stop = fireworks(900)
    return () => { clearTimeout(t); stop() }
  }, [])

  const again = useCallback(() => { firework(); firework(); burst(); sfx.boom(); haptic([30, 40, 30]) }, [])
  useShake(motion === 'on', again)

  return (
    <section className="scene" ref={root}>
      <div className="rays rays-end"><SunBurst className="rays-svg" /></div>
      <div className="end-title">
        {config.endTitle.map((word, w) => (
          <div className="end-word" key={word}>
            {[...word].map((ch, i) => (
              <span key={i} className="ltr" style={{ color: COLORS[(i + w * 2) % COLORS.length], '--r': `${((i * 7 + w * 3) % 9) - 4}deg` }}>{ch}</span>
            ))}
          </div>
        ))}
      </div>
      <p className="end-name" data-in>{config.name}야 💗</p>
      <p className="sub" data-in>{config.endSub}</p>
      {motion === 'on' && <p className="sub pulse" data-in>{config.shakeHint}</p>}
      <div className="toast-slot">{msg && <p className="toast pop-in">{msg}</p>}</div>
      <div className="row" data-in>
        <button className="btn" onClick={again}>{config.againButton}</button>
        <button className="btn mint" onClick={save}>{config.saveButton}</button>
        {motion === 'ask' && <button className="btn ghost" onClick={enableShake}>{config.shakeButton}</button>}
        <button className="btn ghost" onClick={onReplay}>{config.replayButton}</button>
      </div>
    </section>
  )
}
