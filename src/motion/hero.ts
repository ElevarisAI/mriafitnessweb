import gsap from 'gsap'

export function initHero(): void {
  const lines = document.querySelectorAll('.hero-line > span')
  const media = document.querySelector('.hero-media img')
  if (!lines.length || !media) return

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  tl.from(media, { scale: 1.05, duration: 1.6 }, 0)
    .from(lines, { yPercent: 110, duration: 0.9, stagger: 0.12 }, 0.15)
    .from(['.hero-sub', '.hero-actions'], { y: 24, autoAlpha: 0, duration: 0.7, stagger: 0.1 }, 0.65)
}
