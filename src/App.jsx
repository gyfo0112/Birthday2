import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Backdrop from './Backdrop.jsx'
import Loader from './scenes/Loader.jsx'
import Gift from './scenes/Gift.jsx'
import Countdown from './scenes/Countdown.jsx'
import CakeScene from './scenes/CakeScene.jsx'
import Letter from './scenes/Letter.jsx'
import Ending from './scenes/Ending.jsx'
import { SoundIcon } from './art/index.jsx'
import { bgm } from './bgm.js'
import { sfx } from './sfx.js'
import { haptic } from './fx.js'

const SCENES = ['loader', 'gift', 'count', 'cake', 'letter', 'end']

export default function App() {
  const [scene, setScene] = useState('loader')
  const [round, setRound] = useState(0)
  const [muted, setMuted] = useState(false)
  const [cake, setCake] = useState([])
  const wipe = useRef(null)
  const busy = useRef(false)
  const started = useRef(false)
  const pending = useRef(null)
  const current = useRef('loader')

  // 원형 와이프로 장면 전환 (전환 중에 들어온 요청은 끝난 뒤 이어서 처리)
  const runRef = useRef(null)
  runRef.current = (next, after) => {
    if (busy.current) { pending.current = [next, after]; return }
    busy.current = true
    sfx.whoosh()
    gsap.timeline({
      onComplete: () => {
        busy.current = false
        const p = pending.current
        pending.current = null
        if (p) runRef.current(...p)
      },
    })
      .fromTo(wipe.current, { clipPath: 'circle(0% at 50% 55%)' }, { clipPath: 'circle(150% at 50% 55%)', duration: 0.55, ease: 'power3.in' })
      .add(() => { after?.(); current.current = next; setScene(next) })
      .to(wipe.current, { clipPath: 'circle(0% at 50% 45%)', duration: 0.6, ease: 'power3.out' }, '+=0.1')
  }
  const transition = useCallback((next, after) => runRef.current(next, after), [])

  // 버튼으로 앞으로 갈 때는 히스토리를 쌓아서, 뒤로가기가 이전 장면으로 돌아가게 함
  const go = useCallback((next, after) => {
    if (busy.current) return
    history.pushState({ s: next }, '')
    transition(next, after)
  }, [transition])

  useEffect(() => {
    history.replaceState({ s: 'loader' }, '')
    const onPop = (e) => {
      const s = e.state?.s
      if (SCENES.includes(s) && s !== current.current) transition(s)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [transition])

  const start = () => {
    sfx.unlock(); sfx.tap(); haptic(15)
    if (!started.current) { started.current = true; bgm.start() }
    go('gift')
  }

  const replay = () => go('loader', () => { setCake([]); setRound((r) => r + 1) })

  const toggleMute = () => {
    const m = !muted
    setMuted(m)
    bgm.setMuted(m)
    sfx.setMuted(m)
  }

  return (
    <main className="stage">
      <Backdrop />
      <div className="scene-host" key={round}>
        {scene === 'loader' && <Loader onStart={start} />}
        {scene === 'gift' && <Gift go={go} />}
        {scene === 'count' && <Countdown go={go} />}
        {scene === 'cake' && <CakeScene go={go} onCake={setCake} />}
        {scene === 'letter' && <Letter go={go} />}
        {scene === 'end' && <Ending cake={cake} onReplay={replay} />}
      </div>
      <button className={`mute ${muted ? 'off' : ''}`} onClick={toggleMute} aria-label={muted ? '소리 켜기' : '소리 끄기'}>
        <SoundIcon muted={muted} />
      </button>
      <div className="wipe" ref={wipe} aria-hidden="true" />
    </main>
  )
}
