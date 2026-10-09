import { ArrowRight, Layers, MapPin, Puzzle, Zap } from 'lucide-react'
import { whatsappUrl } from '@/lib/site'

const pillars = [
  { icon: Zap, title: 'Agilidade', text: 'Respostas rápidas e soluções diretas, sem burocracia.' },
  { icon: Layers, title: 'Versatilidade técnica', text: 'Tecnologia, web, automação e suporte em um só parceiro.' },
  { icon: Puzzle, title: 'Soluções completas', text: 'Do digital ao físico, conectamos ideias à realidade.' },
  { icon: MapPin, title: 'Atendimento nacional', text: 'Parceria próxima e 100% digital para todo o Brasil.' },
]

export function Why() {
  return (
    <section className="why">
      <div className="container why-grid">
        <div className="reveal">
          <p className="eyebrow">POR QUE ESCOLHER A ANVITI?</p>
          <h2>Tecnologia que<br />impulsiona o seu negócio.</h2>
          <a className="button-primary why-cta" href={whatsappUrl('Olá! Quero conversar sobre uma solução de tecnologia para o meu negócio.')} target="_blank" rel="noreferrer">Fale com a gente <ArrowRight size={17} aria-hidden="true" /></a>
        </div>
        <div className="pillars">
          {pillars.map(({ icon: Icon, title, text }, index) => (
            <div className="pillar reveal" key={title} style={{ transitionDelay: `${index * 100}ms` }}>
              <Icon size={22} />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
