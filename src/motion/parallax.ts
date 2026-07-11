import gsap from 'gsap'

// Gentle scroll drift for [data-parallax] media; the attribute value sets the
// amplitude in percent (default 6).
export function initParallax(): void {
  for (const el of document.querySelectorAll<HTMLElement>('[data-parallax]')) {
    const amp = Number(el.dataset.parallax) || 6
    gsap.fromTo(
      el,
      { yPercent: -amp },
      {
        yPercent: amp,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    )
  }
}
