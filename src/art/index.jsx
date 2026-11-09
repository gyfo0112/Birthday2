// 모든 일러스트는 SVG. 두꺼운 외곽선(.ol) + 파스텔 채우기 = 스티커 느낌

export const INK = '#3b1f3a'

export function Mascot({ className = '' }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <ellipse cx="100" cy="188" rx="46" ry="7" fill={INK} opacity=".18" />
      {/* 발 */}
      <ellipse className="ol" cx="74" cy="174" rx="16" ry="10" fill="#ff7fb5" />
      <ellipse className="ol" cx="126" cy="174" rx="16" ry="10" fill="#ff7fb5" />
      {/* 팔 */}
      <ellipse className="ol" cx="30" cy="122" rx="13" ry="18" fill="#ff8fc0" transform="rotate(25 30 122)" />
      <ellipse className="ol" cx="170" cy="122" rx="13" ry="18" fill="#ff8fc0" transform="rotate(-25 170 122)" />
      {/* 몸 */}
      <path
        className="ol"
        fill="#ff8fc0"
        d="M100 52 C150 52 176 88 176 124 C176 160 144 180 100 180 C56 180 24 160 24 124 C24 88 50 52 100 52Z"
      />
      <ellipse cx="70" cy="86" rx="14" ry="7" fill="#fff" opacity=".55" transform="rotate(-25 70 86)" />
      {/* 얼굴 */}
      <circle cx="74" cy="118" r="8" fill={INK} />
      <circle cx="126" cy="118" r="8" fill={INK} />
      <circle cx="77" cy="115" r="3" fill="#fff" />
      <circle cx="129" cy="115" r="3" fill="#fff" />
      <ellipse cx="56" cy="136" rx="11" ry="7" fill="#ff5fa2" opacity=".7" />
      <ellipse cx="144" cy="136" rx="11" ry="7" fill="#ff5fa2" opacity=".7" />
      <path className="ol" fill="#fff" d="M88 134 Q100 156 112 134 Z" />
      {/* 고깔모자 */}
      <g transform="rotate(-8 100 50)">
        <path className="ol" fill="#ffd84d" d="M100 6 L68 62 Q100 72 132 62 Z" />
        <path d="M82 38 L118 38" stroke="#ff5fa2" strokeWidth="6" strokeLinecap="round" />
        <path d="M74 52 L126 52" stroke="#8fe3cf" strokeWidth="6" strokeLinecap="round" />
        <circle className="ol" cx="100" cy="8" r="9" fill="#fff" />
      </g>
    </svg>
  )
}

export function Balloon({ color = '#ff5fa2', className = '', style }) {
  return (
    <svg viewBox="0 0 60 110" className={className} style={style} aria-hidden="true">
      <path d="M30 80 Q24 94 32 108" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path className="ol" fill={color} d="M30 4 C52 4 58 24 54 40 C50 58 38 72 30 78 C22 72 10 58 6 40 C2 24 8 4 30 4Z" />
      <path className="ol" fill={color} d="M30 78 L24 88 L36 88 Z" />
      <ellipse cx="20" cy="26" rx="6" ry="10" fill="#fff" opacity=".5" transform="rotate(15 20 26)" />
    </svg>
  )
}

export function StarShape({ color = '#ffd84d', className = '', style }) {
  return (
    <svg viewBox="-24 -24 48 48" className={className} style={style} aria-hidden="true">
      <Star color={color} />
    </svg>
  )
}

export function HeartShape({ color = '#ff5fa2', className = '', style }) {
  return (
    <svg viewBox="-24 -24 48 48" className={className} style={style} aria-hidden="true">
      <Heart color={color} />
    </svg>
  )
}

export function SunBurst({ className = '' }) {
  const rays = Array.from({ length: 16 }, (_, i) => {
    const a1 = (i / 16) * Math.PI * 2
    const a2 = ((i + 0.5) / 16) * Math.PI * 2
    const R = 150
    return (
      <path
        key={i}
        d={`M0 0 L${Math.cos(a1) * R} ${Math.sin(a1) * R} L${Math.cos(a2) * R} ${Math.sin(a2) * R} Z`}
        fill={i % 2 ? '#fff6c2' : '#ffe680'}
      />
    )
  })
  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden="true">
      <g>{rays}</g>
    </svg>
  )
}

export function GiftBox({ lidRef }) {
  return (
    <svg viewBox="0 0 240 240" className="gift-svg" aria-hidden="true">
      <ellipse cx="120" cy="226" rx="86" ry="9" fill={INK} opacity=".18" />
      <rect className="ol" x="30" y="104" width="180" height="116" rx="10" fill="#ff5fa2" />
      {[[56, 140], [84, 190], [170, 150], [190, 196], [148, 200], [52, 196]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="6" fill="#fff" opacity=".45" />
      ))}
      <rect className="ol" x="34" y="96" width="172" height="16" rx="6" fill="#c93a78" />
      <rect className="ol" x="106" y="104" width="28" height="116" fill="#ffd84d" />
      <g ref={lidRef} className="gift-lid">
        <rect className="ol" x="20" y="68" width="200" height="42" rx="10" fill="#ff8fc0" />
        <rect className="ol" x="106" y="68" width="28" height="42" fill="#ffd84d" />
        <path className="ol" fill="#ffd84d" d="M120 66 C88 14 52 44 120 66Z" />
        <path className="ol" fill="#ffd84d" d="M120 66 C152 14 188 44 120 66Z" />
        <circle className="ol" cx="120" cy="64" r="10" fill="#ffc400" />
      </g>
    </svg>
  )
}

/* ---------- 토핑 (원점 중심 ±22) ---------- */
function Star({ color = '#ffd84d' }) {
  return (
    <g>
      <path className="ol" fill={color} d="M0 -20 L6 -7 L20 -6 L9 3 L13 17 L0 10 L-13 17 L-9 3 L-20 -6 L-6 -7Z" />
      <circle cx="-4" cy="-6" r="2.5" fill="#fff" opacity=".7" />
    </g>
  )
}
function Heart({ color = '#ff5fa2' }) {
  return (
    <g>
      <path className="ol" fill={color} d="M0 17 C-26 0 -15 -20 0 -8 C15 -20 26 0 0 17Z" />
      <ellipse cx="-9" cy="-6" rx="3.5" ry="2.5" fill="#fff" opacity=".7" transform="rotate(-30 -9 -6)" />
    </g>
  )
}
function Strawberry() {
  return (
    <g>
      <path className="ol" fill="#ff4d6d" d="M0 20 C-20 8 -19 -10 -9 -13 C-4 -14 0 -11 0 -11 C0 -11 4 -14 9 -13 C19 -10 20 8 0 20Z" />
      <path className="ol" fill="#5bd68a" d="M-9 -13 L-5 -21 L0 -15 L5 -21 L9 -13 Z" />
      {[[-8, -3], [6, -4], [-2, 4], [8, 6], [-9, 8], [1, 13]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="1.8" ry="2.6" fill="#ffe08a" />
      ))}
    </g>
  )
}
function Cherry() {
  return (
    <g>
      <path d="M-8 6 Q-4 -12 6 -20 M9 8 Q8 -10 6 -20" stroke="#3a9d5d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path className="ol" fill="#5bd68a" d="M6 -20 Q16 -26 20 -16 Q10 -12 6 -20Z" />
      <circle className="ol" cx="-8" cy="10" r="10" fill="#e8274b" />
      <circle className="ol" cx="10" cy="12" r="10" fill="#ff4d6d" />
      <ellipse cx="-11" cy="7" rx="2.5" ry="3.5" fill="#fff" opacity=".6" />
      <ellipse cx="7" cy="9" rx="2.5" ry="3.5" fill="#fff" opacity=".6" />
    </g>
  )
}
function Macaron() {
  return (
    <g>
      <ellipse className="ol" cx="0" cy="-7" rx="19" ry="9" fill="#8fe3cf" />
      <rect x="-17" y="-4" width="34" height="8" rx="4" fill="#fff6fa" stroke={INK} strokeWidth="3.5" />
      <ellipse className="ol" cx="0" cy="8" rx="19" ry="9" fill="#8fe3cf" />
      <ellipse cx="-8" cy="-9" rx="5" ry="2" fill="#fff" opacity=".6" />
    </g>
  )
}

function Cookie() {
  return (
    <g>
      <circle className="ol" r="17" fill="#e8b27a" />
      {[[-6, -7, 3], [7, -3, 3], [-2, 7, 3], [9, 9, 2.4], [-11, 4, 2.4]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#6b3f26" />
      ))}
    </g>
  )
}
function Donut() {
  return (
    <g>
      <circle className="ol" r="19" fill="#ffc78e" />
      <circle className="ol" r="15" fill="#ff7fb5" />
      <circle className="ol" r="5.5" fill="#ffd6e8" />
      {[[-9, -6, 20], [8, -8, -30], [10, 6, 50], [-3, 11, 80], [-11, 5, 10]].map(([x, y, r], i) => (
        <rect key={i} x={x - 3} y={y - 1} width="6" height="2.6" rx="1.3" transform={`rotate(${r} ${x} ${y})`} fill={['#ffd84d', '#8fe3cf', '#fff', '#b58cff', '#ffd84d'][i]} />
      ))}
    </g>
  )
}
function Lollipop() {
  return (
    <g>
      <rect className="ol" x="-2.5" y="4" width="5" height="19" rx="2" fill="#fff" />
      <circle className="ol" cx="0" cy="-7" r="14" fill="#ff9ccc" />
      <path d="M0 -7 m-2 0 a2 2 0 1 1 4 0 a5 5 0 1 1 -9 0 a8 8 0 1 1 14 0" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </g>
  )
}
function Flower() {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} className="ol" strokeWidth="3" cx="0" cy="-11" r="8" fill="#fff" transform={`rotate(${a})`} />
      ))}
      <circle className="ol" strokeWidth="3" r="6.5" fill="#ffd84d" />
    </g>
  )
}
function Bow() {
  return (
    <g>
      <path className="ol" fill="#b58cff" d="M-2 14 L-10 22 L-12 12 Z" />
      <path className="ol" fill="#b58cff" d="M2 14 L10 22 L12 12 Z" />
      <path className="ol" fill="#b58cff" d="M0 0 C-10 -16 -24 -10 -21 0 C-24 10 -10 16 0 0Z" />
      <path className="ol" fill="#b58cff" d="M0 0 C10 -16 24 -10 21 0 C24 10 10 16 0 0Z" />
      <circle className="ol" r="5" fill="#d9c2ff" />
    </g>
  )
}
function Blueberry() {
  return (
    <g>
      {[[-8, 6], [8, 7], [0, -8]].map(([x, y], i) => (
        <g key={i}>
          <circle className="ol" cx={x} cy={y} r="10" fill="#6d7bff" />
          <circle cx={x - 3} cy={y - 3} r="2.4" fill="#fff" opacity=".6" />
          <path d={`M${x - 3} ${y + 1} L${x} ${y + 4} L${x + 3} ${y + 1}`} stroke="#3a3f99" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      ))}
    </g>
  )
}
function Candy() {
  return (
    <g>
      <path className="ol" fill="#ff9ccc" d="M-9 0 L-21 -10 L-21 10 Z" />
      <path className="ol" fill="#ff9ccc" d="M9 0 L21 -10 L21 10 Z" />
      <ellipse className="ol" rx="12" ry="10" fill="#8fe3cf" />
      <path d="M-4 -9 L-7 9 M4 -9 L1 9" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".8" />
    </g>
  )
}

export const TOPPINGS = {
  strawberry: Strawberry,
  cherry: Cherry,
  star: Star,
  heart: Heart,
  macaron: Macaron,
  cookie: Cookie,
  donut: Donut,
  lollipop: Lollipop,
  flower: Flower,
  bow: Bow,
  blueberry: Blueberry,
  candy: Candy,
}

export function ToppingIcon({ type }) {
  const T = TOPPINGS[type]
  return (
    <svg viewBox="-24 -24 48 48" className="tray-icon" aria-hidden="true">
      <T />
    </svg>
  )
}

/* ---------- 케이크 ---------- */
function frost(x0, x1, ty, n, drip) {
  const w = (x1 - x0) / n
  let d = `M${x0} ${ty - 2} H${x1} V${ty + 8}`
  for (let i = 0; i < n; i++) d += ` a${w / 2} ${i % 2 ? drip * 0.6 : drip} 0 0 1 ${-w} 0`
  return `${d} Z`
}

// 토핑이 놓일 자리 (viewBox 좌표)
export const SLOTS = [
  [160, 224], [115, 224], [205, 224], [70, 224], [250, 224],
  [160, 150], [112, 150], [208, 150],
  [92, 84], [228, 84],
]
export const CANDLE_BASE_Y = 100

export function Cake({ children, svgRef }) {
  return (
    <svg ref={svgRef} viewBox="0 0 320 316" className="cake-svg" aria-hidden="true">
      <defs>
        <clipPath id="clipBot"><rect x="35" y="170" width="250" height="95" rx="20" /></clipPath>
        <clipPath id="clipTop"><rect x="75" y="100" width="170" height="72" rx="18" /></clipPath>
      </defs>
      <ellipse className="ol" cx="160" cy="272" rx="150" ry="22" fill="#fff" />
      <ellipse cx="160" cy="272" rx="120" ry="13" fill="#ffd6e8" opacity=".6" />
      {/* 아랫단 */}
      <rect x="35" y="170" width="250" height="95" rx="20" fill="#ffb3d4" />
      <g clipPath="url(#clipBot)"><path className="ol" fill="#fff6fa" d={frost(35, 285, 170, 8, 24)} /></g>
      <rect className="ol" x="35" y="170" width="250" height="95" rx="20" fill="none" />
      {/* 윗단 */}
      <rect x="75" y="100" width="170" height="72" rx="18" fill="#fff0f6" />
      <g clipPath="url(#clipTop)"><path className="ol" fill="#ff7fb5" d={frost(75, 245, 100, 6, 22)} /></g>
      <rect className="ol" x="75" y="100" width="170" height="72" rx="18" fill="none" />
      {children}
    </svg>
  )
}

export function candleX(i, n) {
  const span = Math.min(110, (n - 1) * 36)
  return n === 1 ? 160 : 160 - span / 2 + (span / (n - 1)) * i
}

export function CandleShape({ lit = true }) {
  return (
    <g>
      <rect className="ol" x="-6" y="-42" width="12" height="42" rx="3" fill="#fff" />
      <path d="M-6 -30 L6 -36 M-6 -18 L6 -24 M-6 -6 L6 -12" stroke="#ff5fa2" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M0 -42 L0 -47" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      {lit && (
        <g className="flame">
          <path className="ol" fill="#ffd84d" d="M0 -78 C11 -64 13 -55 0 -47 C-13 -55 -11 -64 0 -78Z" />
          <path fill="#ff9a3d" d="M0 -68 C5 -61 6 -56 0 -51 C-6 -56 -5 -61 0 -68Z" />
        </g>
      )}
    </g>
  )
}

/* ---------- 편지 봉투 ---------- */
export function EnvBack() {
  return (
    <svg viewBox="0 0 280 190" className="env-layer" aria-hidden="true">
      <rect className="ol" x="2" y="2" width="276" height="186" rx="16" fill="#ff7fb5" />
    </svg>
  )
}
export function EnvFront() {
  return (
    <svg viewBox="0 0 280 190" className="env-layer" aria-hidden="true">
      <path className="ol" fill="#ff9ccc" d="M2 18 Q2 2 18 2 L140 100 L262 2 Q278 2 278 18 L278 172 Q278 188 262 188 L18 188 Q2 188 2 172Z" />
    </svg>
  )
}
export function EnvFlap() {
  return (
    <svg viewBox="0 0 280 190" className="env-layer" aria-hidden="true">
      <path className="ol" fill="#ff5fa2" d="M4 14 Q4 4 16 4 L264 4 Q276 4 276 14 Q276 22 268 28 L148 112 Q140 118 132 112 L12 28 Q4 22 4 14Z" />
    </svg>
  )
}
export function Seal() {
  return (
    <svg viewBox="-24 -24 48 48" className="env-seal" aria-hidden="true">
      <g className="seal-in">
        <circle className="ol" r="19" fill="#ffd84d" />
        <g transform="scale(.55)"><Heart color="#ff5fa2" /></g>
      </g>
    </svg>
  )
}

export function SoundIcon({ muted }) {
  return (
    <svg viewBox="0 0 40 40" width="26" height="26" aria-hidden="true">
      <path className="ol" strokeWidth="3.5" fill="#fff" d="M6 15 H12 L20 8 V32 L12 25 H6 Z" />
      {muted ? (
        <path d="M26 15 L36 25 M36 15 L26 25" stroke="#ff2f7f" strokeWidth="4" strokeLinecap="round" />
      ) : (
        <>
          <path d="M26 14 Q30 20 26 26" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M30 9 Q38 20 30 31" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

// 나무 팻말 (접시 왼쪽 앞에 꽂힘)
export function SignBoard({ name }) {
  return (
    <g transform="translate(68 268) rotate(-5)">
      <rect className="ol" x="-4.5" y="14" width="9" height="30" rx="2" fill="#e9b97f" />
      <rect className="ol" x="-42" y="-16" width="84" height="32" rx="7" fill="#ffe2b8" />
      <path d="M-34 -8 H-14 M16 9 H34 M-30 9 H-12" stroke="#e5b07a" strokeWidth="2" strokeLinecap="round" />
      {[[-35, -9], [35, -9], [-35, 9], [35, 9]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.2" fill="#b57a45" />
      ))}
      <text x="0" y="7" textAnchor="middle" className="cake-label">{name}</text>
    </g>
  )
}
