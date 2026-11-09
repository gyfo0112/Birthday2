import { useEffect, useMemo } from 'react'
import { config } from '../config.js'
import { getBirthdayState, getNow } from '../time.js'
import { burst, rain } from '../fx.js'
import { sfx } from '../sfx.js'
import { useEnter } from '../hooks.js'

// 생일 당일(D-DAY) 또는 지난 뒤(D+N)의 축하 장면. 생일 전에는 잠금 화면(Lock)이 먼저 나오므로 여기까지 오지 않는다.
export default function Countdown({ go }) {
  const ref = useEnter()
  const st = useMemo(() => getBirthdayState(getNow(), config.birthday), [])
  const dateLabel = st.target.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })

  useEffect(() => {
    if (st.mode !== 'today') return
    const t = setTimeout(() => { burst({ x: 0.5, y: 0.4 }); rain(1800); sfx.win() }, 700)
    return () => clearTimeout(t)
  }, [st.mode])

  const isToday = st.mode === 'today'
  const big = isToday ? 'D-DAY' : `D+${st.days}`
  const head = isToday ? `오늘은 ${config.name}의 생일!` : `${config.name}의 생일이 지났지만`
  const foot = isToday ? '세상에서 제일 행복한 날 🎉' : '축하는 지금부터 시작이야!'

  return (
    <section className="scene" ref={ref}>
      <div className="pill sticker" data-in>{head}</div>
      <div className="dday-wrap" data-in>
        <div className={`dday sticker ${isToday ? 'dday-today' : ''}`}>
          <span className="dday-text">{big}</span>
          <span className="dday-date">📅 {dateLabel}</span>
        </div>
      </div>
      <p className="sub" data-in>{foot}</p>
      <button className="btn" data-in onClick={() => go('cake')}>케이크 만들러 가기 ▶</button>
    </section>
  )
}
