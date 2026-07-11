// Duplicates the track content until it can loop seamlessly (translateX(-50%) in CSS).
export function initMarquee(): void {
  const marquee = document.querySelector<HTMLElement>('[data-marquee]')
  const track = marquee?.querySelector<HTMLElement>('.marquee-track')
  if (!marquee || !track) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const append = (nodes: Element[]) => {
    for (const node of nodes) {
      const clone = node.cloneNode(true) as HTMLElement
      clone.setAttribute('aria-hidden', 'true')
      track.append(clone)
    }
  }

  // grow to at least the container width, then double it so the track is
  // exactly two identical halves — translateX(-50%) then loops seamlessly
  const original = [...track.children]
  let guard = 0
  while (track.scrollWidth < marquee.offsetWidth && guard < 10) {
    append(original)
    guard++
  }
  append([...track.children])
}
