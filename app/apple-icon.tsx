import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#061536' }}>
        <svg width="180" height="180" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#FFFFFF" strokeWidth="3.5" />
          <path fill="#FFFFFF" fillRule="evenodd" d="M27 67 L41 30 L51.5 30 L65.5 67 L55.5 67 L52.4 58.2 L40.1 58.2 L37 67 Z M42.6 50.6 L50 50.6 L46.3 40 Z" />
          <circle cx="70.5" cy="61.5" r="5.7" fill="#0050F5" />
        </svg>
      </div>
    ),
    size,
  )
}
