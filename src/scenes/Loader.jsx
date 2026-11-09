import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Mascot } from '../art/index.jsx'
import { config } from '../config.js'
import { useEnter } from '../hooks.js'

export default function Loader({ onStart }) {
  const ref = useEnter()
  const btn = useRef(null)
  const [pct, setPct] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const o = { v: 0 }
    let alive = true
    const tw = gsap.to(o, {
      v: 100, duration: 2.2, ease: 'power1.inOut',
      onUpdate: () => setPct(Math.round(o.v)),
      onComplete: () => {
        const fonts = document.fonts?.ready ?? Promise.resolve()
        Promise.race([fonts, new Promise((r) => setTimeout(r, 1500))]).then(() => alive && setReady(true))
      },
    })
    return () => { alive = false; tw.kill() }
  }, [])

  useLayoutEffect(() => {
    if (ready && btn.current) gsap.fromTo(btn.current, { scale: 0, rotation: -12 }, { scale: 1, rotation: 0, duration: 0.7, ease: 'elastic.out(1,.5)' })
  }, [ready])

  return (
    <section className="scene" ref={ref}>
      <div data-in>
        {config.mascotImage
          ? <img className="mascot mascot-img bounce" src={`${import.meta.env.BASE_URL}${config.mascotImage}`} alt="" />
          : <Mascot className="mascot bounce" />}
      </div>
      <h1 className="title" data-in>{config.loaderTitle}</h1>
      <div className="bar sticker" data-in>
        <div className="bar-fill" style={{ width: `${pct}%` }} />
        <span className="bar-text">{pct}%</span>
      </div>
      <div className="slot-h">
        {ready && (
          <button ref={btn} className="btn" onClick={onStart}>{config.loaderButton}</button>
        )}
      </div>
    </section>
  )
}
