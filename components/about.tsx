import { Briefcase, Building2, Compass, Cpu, Lightbulb, Store, TrendingUp } from 'lucide-react'

const audience = [
  { icon: Lightbulb, label: 'Empreendedores' },
  { icon: Store, label: 'Comércios' },
  { icon: Briefcase, label: 'Prestadores de serviços' },
  { icon: Building2, label: 'Empresas de todos os portes' },
]

const aboutPoints = [
  { icon: Compass, title: 'Estratégia', text: 'Entendemos o seu negócio antes de propor qualquer solução.' },
  { icon: Cpu, title: 'Tecnologia', text: 'Ferramentas modernas, escolhidas para o momento da sua empresa.' },
  { icon: TrendingUp, title: 'Resultados', text: 'Soluções pensadas para fazer diferença no dia a dia.' },
]

export function About() {
  return (
    <section className="section about" id="sobre">
      <div className="container about-grid reveal">
        <div>
          <p className="eyebrow dark">SOBRE A ANVITI</p>
          <h2>Tecnologia, estratégia e criatividade trabalhando juntas.</h2>
          <div className="about-audience">
            <span>Para quem é</span>
            <ul>{audience.map(({ icon: Icon, label }) => <li key={label}><Icon size={16} aria-hidden="true" />{label}</li>)}</ul>
          </div>
        </div>
        <div>
          <p className="about-text">A Anviti Tecnologia ajuda empreendedores, comércios, prestadores de serviços e empresas de qualquer porte a modernizar sua presença, otimizar processos e oferecer experiências melhores aos seus clientes.</p>
          <div className="about-points">
            {aboutPoints.map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <span className="about-point-icon"><Icon size={20} aria-hidden="true" /></span>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
