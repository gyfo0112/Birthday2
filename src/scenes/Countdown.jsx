import { useEffect, useMemo, useState } from 'react'
import { config } from '../config.js'
import { getBirthdayState, getNow, remaining } from '../time.js'
import { burst, rain } from '../fx.js'
import { sfx } from '../sfx.js'
import { useEnter } from '../hooks.js'

const pad = (n) => String(n).padStart(2, '0')

export default function Countdown({ go }) {
  const ref = useEnter()
  const [now, setNow] = useState(getNow)
  useEffect(() => {
    const t = setInterval(() => setNow(getNow()), 1000)
    return () => clearInterval(t)
  }, [])

  const st = useMemo(() => getBirthdayState(now, config.birthday), [now])
  const dateLabel = st.target.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })

  useEffect(() => {
    if (st.mode !== 'today') return
    const t = setTimeout(() => { burst({ x: 0.5, y: 0.4 }); rain(1800); sfx.win() }, 700)
    return () => clearTimeout(t)
  }, [st.mode])

  const big = st.mode === 'today' ? 'D-DAY' : st.mode === 'before' ? `D-${st.days}` : `D+${st.days}`
  const head =
    st.mode === 'today' ? `오늘은 ${config.name}의 생일!` :
    st.mode === 'before' ? `${config.name}의 생일까지` :
    `${config.name}의 생일이 지났지만`
  const foot =
    st.mode === 'today' ? '세상에서 제일 행복한 날 🎉' :
    st.mode === 'before' ? '두근두근, 얼마 안 남았어!' :
    '축하는 지금부터 시작이야!'
  const r = remaining(now, st.target)

  return (
    <section className="scene" ref={ref}>
      <div className="pill sticker" data-in>{head}</div>
      <div className="dday-wrap" data-in>
        <div className={`dday sticker ${st.mode === 'today' ? 'dday-today' : ''}`}>
          <span className="dday-text">{big}</span>
          <span className="dday-date">📅 {dateLabel}</span>
        </div>
      </div>
      {st.mode === 'before' && (
        <div className="units" data-in>
          {[['일', r.d], ['시간', r.h], ['분', r.m], ['초', r.s]].map(([l, v]) => (
            <div className="unit sticker" key={l}>
              <b key={v}>{pad(v)}</b>
              <small>{l}</small>
            </div>
          ))}
        </div>
      )}
      <p className="sub" data-in>{foot}</p>
      <button className="btn" data-in onClick={() => go('cake')}>케이크 만들러 가기</button>
    </section>
  )
}
