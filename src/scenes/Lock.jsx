import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { GiftBox, Padlock } from '../art/index.jsx'
import { config } from '../config.js'
import { getBirthdayState, getNow, remaining } from '../time.js'
import { burst, haptic, rain } from '../fx.js'
import { sfx } from '../sfx.js'
import { useEnter } from '../hooks.js'
import { markLockSeen, markUnlockShown } from '../lockState.js'

const pad = (n) => String(n).padStart(2, '0')

// 생일 0시 전까지 보여주는 잠금 화면. 0시가 되면 자물쇠가 풀리며 축하 연출 후 "열어보기" 버튼이 나타난다.
export default function Lock({ onUnlocked, onOpen, ceremony = false }) {
  const ref = useEnter()
  const box = useRef(null)
  const [now, setNow] = useState(getNow)
  const st = getBirthdayState(now, config.birthday)
  const locked = st.mode === 'before'
  // ceremony: 예전에 잠긴 걸 봤던 사람이 0시 이후에 다시 열었을 때 자물쇠 풀리는 연출을 (한 번만) 보여줌
  const ceremonyOnce = useRef(ceremony && !locked)
  const [view, setView] = useState(locked ? 'locked' : ceremonyOnce.current ? 'opening' : 'unlocked') // locked | opening | unlocked
  const [padOpen, setPadOpen] = useState(false)
  const [tease, setTease] = useState(-1)

  useEffect(() => {
    const t = setInterval(() => setNow(getNow()), 1000)
    return () => clearInterval(t)
  }, [])

  const onUnlockedRef = useRef(onUnlocked)
  onUnlockedRef.current = onUnlocked

  // 잠긴 화면을 보여줄 때마다 "잠금을 봤다"고 기억
  useEffect(() => { if (locked) markLockSeen() }, [locked])

  // 자물쇠가 풀리는 연출 (폭죽, 소리, 진동)
  const celebrate = () => {
    setPadOpen(true)
    markUnlockShown()
    onUnlockedRef.current?.()
    sfx.win(); haptic([30, 50, 30, 50, 80])
    burst({ x: 0.5, y: 0.4 }); rain(2200)
    gsap.fromTo(box.current, { rotation: -6 }, { rotation: 0, duration: 0.9, ease: 'elastic.out(1,.3)' })
  }

  // (1) 0시를 화면 앞에서 기다리다가 풀리는 순간
  useEffect(() => {
    if (locked || view !== 'locked') return
    setView('opening')
    celebrate()
  }, [locked, view])

  // (2) 0시 이후에 다시 열었을 때: 닫힌 자물쇠를 잠깐 보여준 뒤 풀림
  useEffect(() => {
    if (!ceremonyOnce.current) return
    const t = setTimeout(celebrate, 700)
    return () => clearTimeout(t)
  }, [])

  // 자물쇠가 풀린 뒤 연출을 잠깐 보여주고 "열어보기" 화면으로 (위 효과들과 분리해야 상태가 바뀌어도 타이머가 지워지지 않음)
  useEffect(() => {
    if (!padOpen) return
    const t = setTimeout(() => setView('unlocked'), 1800)
    return () => clearTimeout(t)
  }, [padOpen])

  // 잠긴 선물상자를 탭하면 흔들리며 맛보기 문구
  const poke = () => {
    if (view !== 'locked') return
    sfx.tap(); haptic(25)
    setTease((i) => (i + 1) % config.lockTeasers.length)
    gsap.fromTo(box.current, { rotation: -9 }, { rotation: 0, duration: 0.7, ease: 'elastic.out(1,.25)' })
  }

  const r = remaining(now, st.target)
  const dateLabel = st.target.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })

  if (view === 'unlocked') {
    return (
      <section className="scene" ref={ref}>
        <h1 className="title" data-in>{config.unlockTitle}</h1>
        <div className="dday-wrap" data-in>
          <div className="dday sticker dday-today">
            <span className="dday-text">D-DAY</span>
            <span className="dday-date">📅 {dateLabel}</span>
          </div>
        </div>
        <p className="sub" data-in>{config.unlockSub(config.name)}</p>
        <button className="btn" data-in onClick={onOpen}>{config.unlockButton}</button>
      </section>
    )
  }

  return (
    <section className="scene" ref={ref}>
      <h1 className="title sm" data-in>{padOpen ? config.unlockTitle : config.lockTitle}</h1>
      <div className="pill sticker" data-in>{config.lockOpensAt(st.target.getMonth() + 1, st.target.getDate())}</div>
      <div className="gift-stage lock-gift" data-in>
        <button className="gift-btn" ref={box} onClick={poke} aria-label="선물상자">
          <GiftBox />
        </button>
        <Padlock open={padOpen} />
      </div>
      <div className="lock-count sticker" data-in>
        <span className="lock-d">{locked ? `D-${st.days}` : 'D-DAY'}</span>
        <div className="units">
          {[['시간', r.d * 24 + r.h], ['분', r.m], ['초', r.s]].map(([l, v]) => (
            <div className="unit sticker" key={l}>
              <b key={v}>{pad(v)}</b>
              <small>{l}</small>
            </div>
          ))}
        </div>
      </div>
      {view === 'opening' ? (
        <p className="sub pop-in">{config.unlockSub(config.name)}</p>
      ) : (
        <>
          {tease >= 0 ? <p key={tease} className="sub pop-in">{config.lockTeasers[tease]}</p> : <p className="sub">선물상자를 탭해봐</p>}
          <p className="lock-hint">{config.lockHint}</p>
        </>
      )}
    </section>
  )
}
