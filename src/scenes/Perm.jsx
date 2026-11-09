import MascotBlock from '../MascotBlock.jsx'
import { config } from '../config.js'
import { useEnter } from '../hooks.js'

// 첫 화면: 마이크/모션 권한 안내. 어느 쪽을 눌러도 로딩 화면으로 넘어간다.
export default function Perm({ onAllow, onSkip, busy }) {
  const ref = useEnter()
  return (
    <section className="scene" ref={ref}>
      <MascotBlock small />
      <h1 className="title sm" data-in>{config.permTitle}</h1>
      <div className="perm-chips" data-in>
        {config.permChips.map((c, i) => (
          <span key={c} className={`chip sticker ${i % 2 ? 'r' : 'l'}`}>{c}</span>
        ))}
      </div>
      <p className="perm-note" data-in>{config.permNotice}</p>
      <div className="stack" data-in>
        <button className="btn" onClick={onAllow} disabled={busy}>{busy ? config.permBusy : config.permAllow}</button>
        <button className="btn ghost" onClick={onSkip} disabled={busy}>{config.permSkip}</button>
      </div>
    </section>
  )
}
