export function initNav(): void {
  const nav = document.getElementById('nav')
  if (!nav) return

  const onScroll = () => nav.classList.toggle('nav--solid', window.scrollY > 40)
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })

  // pill-highlight the section currently in view (her portfolio's nav pattern)
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-navlink]')]
  const sections = links
    .map((link) => document.querySelector<HTMLElement>(link.hash))
    .filter((s): s is HTMLElement => s !== null)

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        for (const link of links) {
          link.setAttribute('aria-current', String(link.hash === `#${entry.target.id}`))
        }
      }
    },
    { rootMargin: '-40% 0px -55% 0px' },
  )
  sections.forEach((s) => observer.observe(s))
}
