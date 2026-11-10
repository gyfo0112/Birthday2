import { createElement } from 'react'
import { CakeStatic } from './art/index.jsx'
import { config } from './config.js'
import { getBirthdayState, getNow } from './time.js'

const W = 1080
const H = 1350
const INK = '#3b1f3a'
const FONT = "Jua, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif"

const loadImage = (src) =>
  new Promise((res, rej) => {
    const i = new Image()
    i.onload = () => res(i)
    i.onerror = rej
    i.src = src
  })

function roundRect(g, x, y, w, h, r) {
  g.beginPath()
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
}

function stickerText(g, text, x, y, size, color, stroke = 26) {
  g.font = `${size}px ${FONT}`
  g.textAlign = 'center'
  g.lineJoin = 'round'
  g.lineWidth = stroke
  g.strokeStyle = INK
  g.fillStyle = INK
  g.strokeText(text, x, y + 9)
  g.fillText(text, x, y + 9)
  g.strokeText(text, x, y)
  g.fillStyle = color
  g.fillText(text, x, y)
}

// 윤서가 꾸민 케이크가 담긴 4:5 카드 이미지(PNG)를 만든다
export async function makeCardBlob(placed) {
  const { renderToStaticMarkup } = await import('react-dom/server')
  const cakeW = 860
  const cakeH = Math.round((cakeW * 316) / 320)

  let svg = renderToStaticMarkup(createElement(CakeStatic, { placed, count: config.candleCount }))
  svg = svg
    .replace(/<svg/, `<svg xmlns="http://www.w3.org/2000/svg" width="${cakeW}" height="${cakeH}"`)
    .replace(/(<svg[^>]*>)/, '$1<style>.ol{stroke:#3b1f3a;stroke-width:4;stroke-linejoin:round;stroke-linecap:round}</style>')
  const img = await loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`)

  try {
    await Promise.race([document.fonts?.load(`100px Jua`), new Promise((r) => setTimeout(r, 1500))])
  } catch { /* 폰트 없으면 기본 글꼴 */ }

  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')

  // 배경
  const grad = g.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, '#ffc2dc')
  grad.addColorStop(1, '#ff9ccc')
  g.fillStyle = grad
  g.fillRect(0, 0, W, H)
  g.fillStyle = 'rgba(255,255,255,.5)'
  for (let y = 120, r = 0; y < H; y += 64, r++) {
    for (let x = r % 2 ? 64 : 32; x < W; x += 64) {
      g.beginPath()
      g.arc(x, y, 6, 0, Math.PI * 2)
      g.fill()
    }
  }

  // 상단 띠
  g.fillStyle = INK
  g.fillRect(0, 0, W, 78)
  g.fillStyle = '#ffd84d'
  g.font = `34px ${FONT}`
  g.textAlign = 'left'
  g.textBaseline = 'middle'
  if ('letterSpacing' in g) g.letterSpacing = '6px'
  g.fillText(`${config.marquee} ★ ${config.marquee} ★ ${config.marquee}`, 20, 42)
  if ('letterSpacing' in g) g.letterSpacing = '0px'
  g.textBaseline = 'alphabetic'

  // 제목
  const lines = config.giftTitle.split('\n')
  lines.forEach((line, i) => stickerText(g, line, W / 2, 230 + i * 130, 118, '#ffffff'))

  // 케이크 + 팻말 글자
  const x0 = (W - cakeW) / 2
  const y0 = 410
  g.drawImage(img, x0, y0, cakeW, cakeH)
  const s = cakeW / 320
  g.save()
  g.translate(x0 + 68 * s, y0 + 268 * s)
  g.rotate((-5 * Math.PI) / 180)
  g.font = `${21 * s}px ${FONT}`
  g.textAlign = 'center'
  g.fillStyle = INK
  g.fillText(config.name, 0, 7 * s)
  g.restore()

  // 하단 날짜 스티커
  const { target } = getBirthdayState(getNow(), config.birthday)
  const label = `${target.getFullYear()}. ${target.getMonth() + 1}. ${target.getDate()}  ·  ${config.name}의 생일`
  g.font = `40px ${FONT}`
  const tw = g.measureText(label).width + 90
  roundRect(g, (W - tw) / 2 + 5, 1250 + 7, tw, 70, 35)
  g.fillStyle = INK
  g.fill()
  roundRect(g, (W - tw) / 2, 1250, tw, 70, 35)
  g.fillStyle = '#fff'
  g.fill()
  g.lineWidth = 6
  g.strokeStyle = INK
  g.stroke()
  g.fillStyle = INK
  g.textAlign = 'center'
  g.fillText(label, W / 2, 1250 + 49)

  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('toBlob failed'))), 'image/png'))
}

// 공유 시트(아이폰: "이미지 저장") 우선, 안 되면 다운로드
export async function deliverCard(blob) {
  const file = new File([blob], 'yoonseo-birthday-cake.png', { type: 'image/png' })
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: `${config.name} 생일 케이크` })
      return 'shared'
    } catch (e) {
      if (e?.name === 'AbortError') return 'cancel'
    }
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'yoonseo-birthday-cake.png'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
  return 'downloaded'
}
