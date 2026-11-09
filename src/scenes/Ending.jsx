import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { SunBurst } from '../art/index.jsx'
import { config } from '../config.js'
import { burst, firework, fireworks, haptic } from '../fx.js'
import { sfx } from '../sfx.js'

const COLORS = ['#fff', '#ffd84d', '#ff5fa2', '#8fe3cf', '#b58cff']

export default function Ending({ onReplay }) {
  const root = useRef(null)

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

  const again = () => { firework(); firework(); burst(); sfx.boom(); haptic([30, 40, 30]) }

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
      <div className="row" data-in>
        <button className="btn" onClick={again}>{config.againButton}</button>
        <button className="btn ghost" onClick={onReplay}>{config.replayButton}</button>
      </div>
    </section>
  )
}
