import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

// 화면 진입 시 [data-in] 요소들이 차례로 통통 튀며 등장
export function useEnter() {
  const ref = useRef(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-in]', { y: 36, opacity: 0, scale: 0.92, duration: 0.7, stagger: 0.12, ease: 'back.out(1.6)' })
    }, ref)
    return () => ctx.revert()
  }, [])
  return ref
}
