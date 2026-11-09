import { useEffect, useState } from 'react'
import gsap from 'gsap'
import MascotBlock from '../MascotBlock.jsx'
import { config } from '../config.js'
import { bgm } from '../bgm.js'
import { useEnter } from '../hooks.js'

// 진행바가 다 차면 버튼 없이 자동으로 다음 장면으로 넘어간다 (탭은 앞의 권한 화면에서 이미 받음)
export default function Loader({ onDone }) {
  const ref = useEnter()
  const [pct, setPct] = useState(0)

  // 로딩 화면이 보이기 시작하면 노래도 함께 서서히 시작
  useEffect(() => { bgm.fadeIn() }, [])

  useEffect(() => {
    const o = { v: 0 }
    let alive = true
    let timer = 0
    const tw = gsap.to(o, {
      v: 100, duration: 2.2, ease: 'power1.inOut',
      onUpdate: () => setPct(Math.round(o.v)),
      onComplete: () => {
        const fonts = document.fonts?.ready ?? Promise.resolve()
        Promise.race([fonts, new Promise((r) => setTimeout(r, 1500))]).then(() => {
          if (alive) timer = setTimeout(() => alive && onDone(), 450) // 100%를 잠깐 보여준 뒤 이동
        })
      },
    })
    return () => { alive = false; clearTimeout(timer); tw.kill() }
  }, [onDone])

  return (
    <section className="scene" ref={ref}>
      <MascotBlock />
      <h1 className="title" data-in>{config.loaderTitle}</h1>
      <div className="bar sticker" data-in>
        <div className="bar-fill" style={{ width: `${pct}%` }} />
        <span className="bar-text">{pct}%</span>
      </div>
    </section>
  )
}
