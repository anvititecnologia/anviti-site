// Generates WebP versions of the site photos in public/images.
// Run after adding or replacing a photo: pnpm images
import sharp from 'sharp'

const images = [
  { file: 'anviti-mascote-escritorio.jpg', widths: [1024] },
  { file: 'site-anviti-laptop.jpg', widths: [640, 1200] },
  { file: 'display-nfc-avaliacao-google.jpg', widths: [600, 900] },
]

for (const { file, widths } of images) {
  const name = file.replace(/\.jpe?g$/, '')
  const { width: original } = await sharp(`public/images/${file}`).metadata()
  for (const width of widths) {
    const target = Math.min(width, original)
    const suffix = width === Math.max(...widths) ? '' : `-${width}`
    const out = `public/images/${name}${suffix}.webp`
    const info = await sharp(`public/images/${file}`).resize({ width: target }).webp({ quality: 80 }).toFile(out)
    console.log(`${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`)
  }
}
