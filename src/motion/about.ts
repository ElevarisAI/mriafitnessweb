import gsap from 'gsap'

// "Who I Am" manifesto inks in word by word as you scroll through it.
export function initAboutFill(): void {
  const el = document.querySelector<HTMLElement>('[data-fill]')
  if (!el) return

  const text = (el.textContent ?? '').trim()
  el.setAttribute('aria-label', text)
  el.textContent = ''
  const holder = document.createElement('span')
  holder.setAttribute('aria-hidden', 'true')
  for (const word of text.split(/\s+/)) {
    const span = document.createElement('span')
    span.className = 'word'
    span.textContent = word
    holder.append(span, document.createTextNode(' '))
  }
  el.append(holder)

  gsap.fromTo(
    el.querySelectorAll('.word'),
    { opacity: 0.22 },
    {
      opacity: 1,
      ease: 'none',
      stagger: 0.3,
      scrollTrigger: {
        trigger: el,
        start: 'top 78%',
        end: 'bottom 40%',
        scrub: 0.4,
      },
    },
  )
}
