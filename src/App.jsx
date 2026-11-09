import { useCallback, useRef, useState } from 'react'
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

export default function App() {
  const [scene, setScene] = useState('loader')
  const [round, setRound] = useState(0)
  const [muted, setMuted] = useState(false)
  const wipe = useRef(null)
  const busy = useRef(false)
  const started = useRef(false)

  // 원형 와이프로 장면 전환
  const go = useCallback((next, after) => {
    if (busy.current) return
    busy.current = true
    sfx.whoosh()
    gsap.timeline({ onComplete: () => { busy.current = false } })
      .fromTo(wipe.current, { clipPath: 'circle(0% at 50% 55%)' }, { clipPath: 'circle(150% at 50% 55%)', duration: 0.55, ease: 'power3.in' })
      .add(() => { after?.(); setScene(next) })
      .to(wipe.current, { clipPath: 'circle(0% at 50% 45%)', duration: 0.6, ease: 'power3.out' }, '+=0.1')
  }, [])

  const start = () => {
    sfx.unlock(); sfx.tap(); haptic(15)
    if (!started.current) { started.current = true; bgm.start() }
    go('gift')
  }

  const replay = () => go('loader', () => setRound((r) => r + 1))

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
        {scene === 'cake' && <CakeScene go={go} />}
        {scene === 'letter' && <Letter go={go} />}
        {scene === 'end' && <Ending onReplay={replay} />}
      </div>
      <button className={`mute ${muted ? 'off' : ''}`} onClick={toggleMute} aria-label={muted ? '소리 켜기' : '소리 끄기'}>
        <SoundIcon muted={muted} />
      </button>
      <div className="wipe" ref={wipe} aria-hidden="true" />
    </main>
  )
}
