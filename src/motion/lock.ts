import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Signature moment: "Locked & Lean." starts loose — letters scattered, drifting —
// and locks tight into its final setting as you scrub through the pinned stage.
export function initLock(): void {
  const stage = document.querySelector<HTMLElement>('[data-lock-stage]')
  const title = document.querySelector<HTMLElement>('[data-lock-title]')
  if (!stage || !title) return

  // split into per-character spans (title keeps its aria-label for readers)
  const text = title.textContent ?? ''
  title.textContent = ''
  const holder = document.createElement('span')
  holder.setAttribute('aria-hidden', 'true')
  const chars: HTMLSpanElement[] = []
  for (const ch of text) {
    const span = document.createElement('span')
    if (ch === ' ') {
      span.innerHTML = '&nbsp;'
    } else {
      span.className = 'char'
      span.textContent = ch
      chars.push(span)
    }
    holder.append(span)
  }
  title.append(holder)

  const mid = (chars.length - 1) / 2
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: 'top top',
      end: '+=120%',
      pin: true,
      scrub: 0.5,
    },
  })

  tl.from(chars, {
    x: (i) => (i - mid) * 26,
    y: (i) => (i % 2 ? 1 : -1) * (14 + (i % 3) * 8),
    opacity: 0.4,
    ease: 'power3.out',
    stagger: { each: 0.012, from: 'edges' },
    duration: 0.85,
  }).fromTo(title, { scale: 1.015 }, { scale: 1, ease: 'power2.inOut', duration: 0.15 }, '>-0.05')

  // Tagline: not part of the scrubbed timeline — it fades up on its own only
  // once the lock-in has essentially settled (near the end of the pin), a beat
  // after the heading. Retriggers with the scrub if you scroll back up.
  const sub = document.querySelector<HTMLElement>('[data-lock-sub]')
  if (!sub) return
  gsap.set(sub, { opacity: 0, y: 16 })
  let shown = false
  const reveal = () => {
    if (shown) return
    shown = true
    gsap.to(sub, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', delay: 0.2, overwrite: true })
  }
  const hide = () => {
    if (!shown) return
    shown = false
    gsap.to(sub, { opacity: 0, y: 16, duration: 0.3, ease: 'power2.in', overwrite: true })
  }
  ScrollTrigger.create({
    trigger: stage,
    start: 'top top',
    end: '+=120%',
    onUpdate: (self) => {
      if (self.progress >= 0.95) reveal()
      else if (self.progress <= 0.9) hide()
    },
    onLeave: reveal,
    onLeaveBack: hide,
  })
}
