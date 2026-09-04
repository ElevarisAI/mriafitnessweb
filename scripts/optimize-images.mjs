import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ASSETS = fileURLToPath(new URL('../assets/', import.meta.url))
const OUT = fileURLToPath(new URL('../public/img/', import.meta.url))

// slug -> { file, widths }
const MAP = {
  hero: { file: 'Hero.jpg', widths: [960, 1600, 2400] },
  plan: { file: 'dfuns 2025-11-18 030406.054.jpg', widths: [640, 960, 1600] },
  stretch: { file: '0371 - lojo.jpg', widths: [640, 960, 1600] },
  beach: { file: 'dfuns 2025-11-18 112758.429.JPEG', widths: [960, 1600, 2400] },
  about: { file: 'photo.png', widths: [640, 960, 1600] },
  whoiam: { file: 'whoiam-portrait.jpg', widths: [640, 960, 1600] },
}

await mkdir(OUT, { recursive: true })

for (const [slug, { file, widths }] of Object.entries(MAP)) {
  const src = path.join(ASSETS, file)
  const meta = await sharp(src).metadata()
  console.log(`${slug}: ${file} ${meta.width}x${meta.height}`)
  for (const w of widths) {
    const base = sharp(src).rotate().resize({ width: w, withoutEnlargement: true })
    await base.clone().avif({ quality: 60 }).toFile(path.join(OUT, `${slug}-${w}.avif`))
    await base.clone().webp({ quality: 75 }).toFile(path.join(OUT, `${slug}-${w}.webp`))
    await base.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(OUT, `${slug}-${w}.jpg`))
  }
}
console.log('done')
