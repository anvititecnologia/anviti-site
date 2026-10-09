import { ImageResponse } from 'next/og'

export const alt = 'Anviti Tecnologia — Sua marca mais forte no digital'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '72px 80px', background: '#061536', color: 'white', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 56, fontWeight: 800, letterSpacing: 6 }}>ANVITI<span style={{ color: '#0050F5' }}>.</span></div>
          <div style={{ fontSize: 18, letterSpacing: 14, marginTop: 4 }}>TECNOLOGIA</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -3 }}>
          <div>Sua marca</div>
          <div style={{ color: '#0050F5' }}>mais forte</div>
          <div>no digital.</div>
        </div>
        <div style={{ fontSize: 24, color: '#cdd9ef' }}>Sites, tecnologia NFC e soluções de TI para todo o Brasil</div>
      </div>
    ),
    size,
  )
}
