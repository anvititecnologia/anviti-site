import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-backdrop" aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">ESTRATÉGIA + TECNOLOGIA = RESULTADOS</p>
          <h1>Sua marca<br /><span>mais forte</span><br />no digital.</h1>
          <p className="hero-text">Soluções completas em tecnologia, desenvolvimento web e inovação digital para empresas de qualquer segmento, em todo o Brasil.</p>
          <a className="button-primary" href="#contato">Fale com a gente<ArrowRight size={17} aria-hidden="true" /></a>
        </div>
        <div className="hero-photo" role="img" aria-label="Mascote da Anviti, um camaleão azul de óculos e camisa da empresa, acenando no escritório" />
      </div>
    </section>
  )
}
