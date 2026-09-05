import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/* "What's included" disclosure rows. The markup is native <details>, so with JS
   off (or reduced motion) it opens and closes on its own; this module only adds
   the height tween, the cascade-in, and one-open-at-a-time. */

const DURATION = 0.4

const panelOf = (item: HTMLDetailsElement) =>
  item.querySelector<HTMLElement>('[data-acc-panel]')

export function initAccordion(): void {
  const group = document.querySelector<HTMLElement>('[data-accordion]')
  if (!group) return

  const items = Array.from(group.querySelectorAll<HTMLDetailsElement>('details'))
  if (!items.length) return

  function collapse(item: HTMLDetailsElement): void {
    const panel = panelOf(item)
    if (!panel) return
    gsap.to(panel, {
      height: 0,
      autoAlpha: 0,
      duration: DURATION,
      ease: 'power2.inOut',
      onComplete: () => {
        item.open = false
        gsap.set(panel, { clearProps: 'all' })
        ScrollTrigger.refresh()
      },
    })
  }

  function expand(item: HTMLDetailsElement): void {
    const panel = panelOf(item)
    if (!panel) return
    item.open = true
    gsap.fromTo(
      panel,
      { height: 0, autoAlpha: 0 },
      {
        height: 'auto',
        autoAlpha: 1,
        duration: DURATION,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(panel, { clearProps: 'height,visibility,opacity' })
          ScrollTrigger.refresh()
        },
      },
    )
  }

  for (const item of items) {
    const summary = item.querySelector('summary')
    summary?.addEventListener('click', (event) => {
      event.preventDefault()
      const panel = panelOf(item)
      if (panel && gsap.isTweening(panel)) return

      if (item.open) {
        collapse(item)
        return
      }
      // one at a time, so the section never grows back into a wall of text
      for (const other of items) {
        if (other !== item && other.open) collapse(other)
      }
      expand(item)
    })
  }

  gsap.from(items, {
    y: 18,
    autoAlpha: 0,
    duration: 0.6,
    stagger: 0.07,
    ease: 'power3.out',
    scrollTrigger: { trigger: group, start: 'top 88%', once: true },
  })
}
