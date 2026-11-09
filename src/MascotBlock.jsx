import { Mascot } from './art/index.jsx'
import { config } from './config.js'

// 마스코트(이미지 또는 SVG) + 뒤쪽 흰 원 스티커. small이면 작게.
export default function MascotBlock({ small = false }) {
  return (
    <div className={`mascot-wrap ${small ? 'sm' : ''}`} data-in>
      {config.mascotImage ? (
        <>
          {config.mascotHalo && <span className="halo" />}
          <img className="mascot mascot-img bounce" src={`${import.meta.env.BASE_URL}${config.mascotImage}`} alt="" />
        </>
      ) : (
        <Mascot className="mascot bounce" />
      )}
    </div>
  )
}
