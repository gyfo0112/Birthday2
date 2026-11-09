import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { GiftBox, SunBurst } from '../art/index.jsx'
import { config } from '../config.js'
import { burst, haptic } from '../fx.js'
import { sfx } from '../sfx.js'
import { useEnter } from '../hooks.js'

export default function Gift({ go, skipCount = false }) {
  const ref = useEnter()
  const lid = useRef(null)
  const box = useRef(null)
  const rays = useRef(null)
  const wobble = useRef(null)
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.1, delay: 1 })
    tl.to(box.current, { rotation: -7, duration: 0.07 })
      .to(box.current, { rotation: 7, duration: 0.07, repeat: 5, yoyo: true })
      .to(box.current, { rotation: 0, duration: 0.1 })
      .to(box.current, { y: -18, duration: 0.18, ease: 'power2.out' }, '<')
      .to(box.current, { y: 0, duration: 0.3, ease: 'bounce.out' })
    wobble.current = tl
    return () => tl.kill()
  }, [])

  const open = () => {
    if (opened) return
    setOpened(true)
    wobble.current?.kill()
    sfx.pop(); haptic([20, 40, 30])
    gsap.timeline()
      .to(box.current, { rotation: 0, y: 0, scaleX: 1.12, scaleY: 0.88, duration: 0.12, transformOrigin: '50% 100%' })
      .to(box.current, { scaleX: 1, scaleY: 1, duration: 0.5, ease: 'elastic.out(1,.4)' })
      .to(lid.current, { y: -200, x: -40, rotation: -35, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.05)
      .fromTo(rays.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.4)' }, 0.1)
    setTimeout(() => { burst({ x: 0.5, y: 0.45 }); sfx.win() }, 150)
  }

  return (
    <section className="scene" ref={ref}>
      <h2 className="title" data-in key={opened ? 'a' : 'b'}>
        {opened ? config.giftTitle : config.giftHint}
      </h2>
      <div className="gift-stage" data-in>
        <div className="rays" ref={rays} style={{ opacity: 0 }}><SunBurst className="rays-svg" /></div>
        <button className="gift-btn" ref={box} onClick={open} aria-label="선물 열기">
          <GiftBox lidRef={lid} />
        </button>
      </div>
      <div className="slot-h">
        {opened && (
          <div className="stack">
            <p className="sub pop-in">{config.giftSub}</p>
            <button className="btn pop-in" style={{ animationDelay: '1.2s' }} onClick={() => go(skipCount ? 'cake' : 'count')}>다음 ▶</button>
          </div>
        )}
      </div>
    </section>
  )
}
