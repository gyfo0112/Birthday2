import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { CandleShape, Cake, CANDLE_BASE_Y, SLOTS, SignBoard, TOPPINGS, ToppingIcon, candleX } from '../art/index.jsx'
import { config } from '../config.js'
import { burst, haptic, rain } from '../fx.js'
import { sfx } from '../sfx.js'
import { useBlow } from '../useBlow.js'
import { useEnter } from '../hooks.js'

const TYPES = Object.keys(TOPPINGS)

function Topping({ type, slot }) {
  const g = useRef(null)
  const T = TOPPINGS[type]
  useLayoutEffect(() => {
    const tw = gsap.from(g.current, { y: -170, scale: 0.3, rotation: -50, opacity: 0, duration: 0.8, ease: 'bounce.out' })
    return () => tw.kill()
  }, [])
  return (
    <g transform={`translate(${SLOTS[slot][0]} ${SLOTS[slot][1]})`}>
      <g ref={g}><g transform="scale(.85)"><T /></g></g>
    </g>
  )
}

// 케이크가 완성되면 팻말이 위에서 툭 떨어져 꽂힘
function Sign({ name }) {
  const g = useRef(null)
  useLayoutEffect(() => {
    const tw = gsap.from(g.current, { y: -280, rotation: -14, opacity: 0, duration: 0.95, delay: 0.25, ease: 'bounce.out' })
    const t = setTimeout(() => { sfx.drop(); haptic(12) }, 250 + 330)
    return () => { tw.kill(); clearTimeout(t) }
  }, [])
  return <g ref={g}><SignBoard name={name} /></g>
}

function Candle({ x, i, out, onTap }) {
  const g = useRef(null)
  useLayoutEffect(() => {
    const tw = gsap.from(g.current, { y: -60, opacity: 0, duration: 0.5, delay: i * 0.18, ease: 'back.out(2)' })
    return () => tw.kill()
  }, [i])
  const flameRef = useRef(null)
  useEffect(() => {
    if (!out || !flameRef.current) return
    const f = flameRef.current.querySelector('.flame')
    if (f) gsap.to(f, { scale: 0, opacity: 0, duration: 0.25, transformOrigin: '50% 100%' })
  }, [out])
  return (
    <g transform={`translate(${x} ${CANDLE_BASE_Y})`} className="candle" onClick={onTap}>
      <g ref={g}>
        <rect x="-20" y="-84" width="40" height="88" fill="transparent" />
        <g ref={flameRef}><CandleShape lit /></g>
        {out && <circle className="smoke" cx="0" cy="-60" r="5" fill="#fff" opacity=".8" />}
      </g>
    </g>
  )
}

export default function CakeScene({ go }) {
  const ref = useEnter()
  const cake = useRef(null)
  const [placed, setPlaced] = useState([])
  const [phase, setPhase] = useState('decorate') // decorate | lighting | blow | done
  const [out, setOut] = useState(() => Array(config.candleCount).fill(false))
  const outRef = useRef(out)
  outRef.current = out

  const { status, start, stop } = useBlow(() => blowAll())

  const add = (type) => {
    if (phase !== 'decorate' || placed.length >= SLOTS.length) return
    sfx.drop(); haptic(12)
    const next = [...placed, { id: placed.length, type, slot: placed.length }]
    setPlaced(next)
    gsap.fromTo(cake.current, { scaleY: 0.96 }, { scaleY: 1, duration: 0.6, ease: 'elastic.out(1,.35)', transformOrigin: '50% 100%' })
    if (next.length === SLOTS.length) setTimeout(finish, 700)
  }

  const finish = () => {
    setPhase((p) => {
      if (p !== 'decorate') return p
      sfx.whoosh()
      for (let i = 0; i < config.candleCount; i++) setTimeout(() => sfx.pling(i), 500 + i * 180)
      setTimeout(() => setPhase('blow'), 500 + config.candleCount * 180 + 600)
      return 'lighting'
    })
  }

  const win = () => {
    stop()
    setPhase('done')
    sfx.win(); haptic([30, 50, 30, 50, 80])
    burst({ x: 0.5, y: 0.5 }); rain(2000)
    setTimeout(() => go('letter'), 2600)
  }

  const blowOne = (i) => {
    if (phase !== 'blow' || outRef.current[i]) return
    sfx.puff(); haptic(20)
    const next = outRef.current.map((v, k) => (k === i ? true : v))
    outRef.current = next
    setOut(next)
    if (next.every(Boolean)) win()
  }

  function blowAll() {
    if (outRef.current.every(Boolean)) return
    sfx.puff()
    const next = outRef.current.map(() => true)
    outRef.current = next
    setOut(next)
    win()
  }

  const lit = phase !== 'decorate'
  const showCount = placed.length

  return (
    <section className="scene" ref={ref}>
      <h2 className="title sm" data-in>
        {phase === 'decorate' && (showCount ? '맛있게 꾸미는 중 🍓' : config.decorateHint)}
        {phase === 'lighting' && config.lightingText}
        {phase === 'blow' && config.blowHint}
        {phase === 'done' && config.wishText}
      </h2>

      <div className="cake-wrap" data-in>
        <div ref={cake} className="cake-inner">
          <Cake>
            {placed.map((p) => <Topping key={p.id} type={p.type} slot={p.slot} />)}
            {lit && <Sign name={config.name} />}
            {lit && out.map((o, i) => (
              <Candle key={i} i={i} x={candleX(i, config.candleCount)} out={o} onTap={() => blowOne(i)} />
            ))}
          </Cake>
        </div>
      </div>

      <div className="controls" data-in>
        {phase === 'decorate' && (
          <>
            <div className="tray sticker">
              {TYPES.map((t) => (
                <button key={t} className="tray-btn" onClick={() => add(t)} aria-label={t}>
                  <ToppingIcon type={t} />
                </button>
              ))}
            </div>
            <div className="slot-h">
              {showCount > 0 && <button className="btn" onClick={finish}>{config.decorateDone}</button>}
            </div>
          </>
        )}
        {phase === 'blow' && (
          <div className="stack">
            {status === 'listening' && <p className="sub pulse">{config.micListening}</p>}
            {(status === 'denied' || status === 'unsupported') && <p className="sub">{config.micFail}</p>}
            <div className="row">
              {status === 'idle' && <button className="btn" onClick={start}>{config.micButton}</button>}
              <button className="btn ghost" onClick={blowAll}>{config.blowAllButton}</button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
