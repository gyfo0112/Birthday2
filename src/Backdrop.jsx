import { Balloon, HeartShape, StarShape } from './art/index.jsx'
import { config } from './config.js'

const ITEMS = [
  { t: 'balloon', c: '#ff5fa2', x: '-2%', y: '14%', w: 54, d: 0 },
  { t: 'balloon', c: '#ffd84d', x: '88%', y: '10%', w: 48, d: 1.2 },
  { t: 'balloon', c: '#8fe3cf', x: '92%', y: '62%', w: 44, d: 0.6 },
  { t: 'balloon', c: '#b58cff', x: '2%', y: '70%', w: 46, d: 1.8 },
  { t: 'star', c: '#ffd84d', x: '16%', y: '8%', w: 26, d: 0.3 },
  { t: 'star', c: '#fff', x: '78%', y: '82%', w: 22, d: 1.1 },
  { t: 'star', c: '#8fe3cf', x: '6%', y: '44%', w: 20, d: 0.8 },
  { t: 'heart', c: '#ff5fa2', x: '82%', y: '36%', w: 24, d: 1.5 },
  { t: 'heart', c: '#fff', x: '24%', y: '90%', w: 22, d: 0.2 },
]

export default function Backdrop() {
  const text = `${config.marquee} ★ `.repeat(8)
  return (
    <>
      <div className="backdrop" aria-hidden="true">
        {ITEMS.map((it, i) => {
          const style = { left: it.x, top: it.y, width: it.w, animationDelay: `${it.d}s` }
          const C = it.t === 'balloon' ? Balloon : it.t === 'star' ? StarShape : HeartShape
          return <C key={i} color={it.c} className={`deco deco-${it.t}`} style={style} />
        })}
      </div>
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track"><span>{text}</span><span>{text}</span></div>
      </div>
    </>
  )
}
