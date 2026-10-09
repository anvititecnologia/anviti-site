export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className={`brand-logo ${light ? 'brand-logo-light' : ''}`} aria-label="Anviti Tecnologia">
      <strong>ANVITI<span>.</span></strong>
      <small>TECNOLOGIA</small>
    </div>
  )
}

export function InstagramIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}
