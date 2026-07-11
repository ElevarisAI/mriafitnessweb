// Screenshot harness: real viewports, multiple scroll positions.
// usage: node scripts/shoot.mjs <outdir> [width height] ...
import puppeteer from 'puppeteer-core'
import { mkdir } from 'node:fs/promises'

const OUT = process.argv[2] ?? 'shots'
await mkdir(OUT, { recursive: true })

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
})

for (const vp of VIEWPORTS) {
  const page = await browser.newPage()
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 })
  await page.goto('http://localhost:5199/', { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 2200)) // hero intro settles

  const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)
  const stops = [0, 0.14, 0.24, 0.34, 0.45, 0.58, 0.7, 0.82, 1]
  for (const stop of stops) {
    await page.evaluate((y) => scrollTo(0, y), Math.round(total * stop))
    await new Promise((r) => setTimeout(r, 900))
    await page.screenshot({ path: `${OUT}/${vp.name}-${String(Math.round(stop * 100)).padStart(3, '0')}.png` })
  }

  // horizontal overflow check
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
  console.log(`${vp.name}: scrollHeight=${total}, hOverflow=${overflow}px`)
  await page.close()
}

await browser.close()
console.log('done')
