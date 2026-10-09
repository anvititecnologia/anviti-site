import type { Metadata } from 'next'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { Logo } from '@/components/brand'
import { whatsappUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Página não encontrada | Anviti Tecnologia',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="hero-backdrop" aria-hidden="true" />
      <div className="not-found-card">
        <a href="/" aria-label="Anviti Tecnologia, voltar ao início"><Logo light /></a>
        <picture>
          <source type="image/webp" srcSet="/images/anviti-mascote-escritorio.webp" />
          <img className="not-found-mascot" src="/images/anviti-mascote-escritorio.jpg" alt="Mascote da Anviti acenando" />
        </picture>
        <p className="not-found-code">404</p>
        <h1>Ops! Essa página não existe.</h1>
        <p>O link pode ter mudado ou estar digitado errado. Mas não se preocupe: o mascote te leva de volta.</p>
        <div className="not-found-actions">
          <a className="button-primary" href="/"><ArrowLeft size={17} aria-hidden="true" />Voltar ao início</a>
          <a className="not-found-secondary" href={whatsappUrl('Olá! Vim pelo site da Anviti e não encontrei uma página.')} target="_blank" rel="noreferrer"><MessageCircle size={17} aria-hidden="true" />Falar no WhatsApp</a>
        </div>
      </div>
    </main>
  )
}
