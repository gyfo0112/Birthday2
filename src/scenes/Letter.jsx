import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { EnvBack, EnvFlap, EnvFront, Seal } from '../art/index.jsx'
import { config } from '../config.js'
import { haptic, rain } from '../fx.js'
import { sfx } from '../sfx.js'
import { useEnter } from '../hooks.js'

const FULL = config.letter.lines.join('\n')

export default function Letter({ go }) {
  const ref = useEnter()
  const env = useRef(null)
  const flap = useRef(null)
  const card = useRef(null)
  const wobble = useRef(null)
  const [phase, setPhase] = useState('closed') // closed | opening | typing | done
  const [n, setN] = useState(0)

  useEffect(() => {
    const tw = gsap.to(env.current, { rotation: 2.5, y: -6, duration: 0.7, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    wobble.current = tw
    gsap.set(card.current, { opacity: 0 })
    return () => tw.kill()
  }, [])

  const open = () => {
    if (phase !== 'closed') return
    setPhase('opening')
    wobble.current?.kill()
    sfx.tap(); haptic(20)
    const tl = gsap.timeline({ onComplete: () => setPhase('typing') })
    tl.to(env.current, { rotation: 0, y: 0, duration: 0.2 })
      .to(env.current.querySelector('.env-seal'), { scale: 0, rotation: 90, transformOrigin: '50% 50%', duration: 0.25, ease: 'back.in(2)' }, '<')
      .to(flap.current, { rotationX: 180, duration: 0.55, ease: 'power2.inOut' })
      .set(flap.current, { zIndex: 0 }, '-=0.3')
      .add(() => { sfx.pling(2); rain(1200) }, '-=0.1')
      .to(env.current, { y: 150, opacity: 0, duration: 0.6, ease: 'power2.in' }, '>-0.05')
      .fromTo(card.current, { y: 90, scale: 0.4, opacity: 0, rotation: -6 }, { y: 0, scale: 1, opacity: 1, rotation: 0, duration: 0.9, ease: 'back.out(1.5)' }, '<0.1')
  }

  useEffect(() => {
    if (phase !== 'typing') return
    const t = setInterval(() => {
      setN((v) => {
        if (v >= FULL.length) return v
        if (v % 3 === 0) sfx.blip()
        return v + 1
      })
    }, 55)
    return () => clearInterval(t)
  }, [phase])

  useEffect(() => {
    if (phase === 'typing' && n >= FULL.length) {
      sfx.pling(3)
      setPhase('done')
    }
  }, [n, phase])

  const skip = () => { if (phase === 'typing') setN(FULL.length) }

  return (
    <section className="scene" ref={ref}>
      <h2 className="title sm" data-in>{phase === 'closed' ? config.letter.openHint : config.letter.title}</h2>

      <div className="letter-stage" data-in>
        <div className="env" ref={env} onClick={open} role="button" aria-label="편지 열기">
          <EnvBack />
          <div className="env-front"><EnvFront /></div>
          <div className="env-flap" ref={flap}><EnvFlap /></div>
          <Seal />
        </div>

        <article className="paper" ref={card} onClick={skip}>
          <span className="tape" />
          <div className="paper-text">
            <p className="ghost-text" aria-hidden="true">{FULL}</p>
            <p className="typed">{FULL.slice(0, n)}<i className="caret" /></p>
          </div>
          <p className={`sign ${phase === 'done' ? 'show' : ''}`}>{config.letter.sign}</p>
        </article>
      </div>

      <div className="slot-h">
        {phase === 'done' && <button className="btn pop-in" onClick={() => go('end')}>{config.letter.next}</button>}
      </div>
    </section>
  )
}
