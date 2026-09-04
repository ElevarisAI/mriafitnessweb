import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initNav } from './motion/nav'
import { initMarquee } from './motion/marquee'
import { initHero } from './motion/hero'
import { initLock } from './motion/lock'
import { initReveals } from './motion/reveals'
import { initParallax } from './motion/parallax'
import { initAboutFill } from './motion/about'
import { initForm, initWaitlist } from './form'

gsap.registerPlugin(ScrollTrigger)

initNav()
initMarquee()
initForm()
initWaitlist()

// All GSAP motion is gated on reduced-motion; without JS or with it reduced,
// every section renders fully visible (initial states are set from JS only).
const mm = gsap.matchMedia()
mm.add('(prefers-reduced-motion: no-preference)', () => {
  initHero()
  initLock()
  initReveals()
  initParallax()
  initAboutFill()
})
