import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await page.goto('http://localhost:5199/', { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 1200))
// with reduced motion, everything must be visible without any scrolling/animation
const visible = await page.evaluate(() => {
  const els = ['.hero-title', '.hero-sub', '.lock-title', '.plan-lead', '.how-step', '.about-copy p']
  return els.map((sel) => {
    const el = document.querySelector(sel)
    if (!el) return `${sel}: MISSING`
    const s = getComputedStyle(el)
    return `${sel}: opacity=${s.opacity} visibility=${s.visibility}`
  })
})
console.log(visible.join('\n'))
const pinSpacers = await page.evaluate(() => document.querySelectorAll('.pin-spacer').length)
console.log('pin-spacers (should be 0 under reduced motion):', pinSpacers)
await page.screenshot({ path: process.argv[2] })
await browser.close()
