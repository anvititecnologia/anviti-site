import { ArrowRight, CodeXml, FileText, MessagesSquare, Rocket } from 'lucide-react'
import { whatsappUrl } from '@/lib/site'

const processSteps = [
  { icon: MessagesSquare, title: 'Conversa', text: 'Você conta a sua necessidade pelo WhatsApp e a gente entende o seu negócio.' },
  { icon: FileText, title: 'Proposta', text: 'Enviamos uma solução clara, com escopo, prazo e investimento definidos.' },
  { icon: CodeXml, title: 'Desenvolvimento', text: 'Criamos e configuramos tudo, com você acompanhando cada etapa.' },
  { icon: Rocket, title: 'Entrega e suporte', text: 'Colocamos no ar, explicamos como usar e seguimos por perto para ajustes.' },
]

export function Process() {
  return (
    <section className="section process" id="como-trabalhamos">
      <div className="container">
        <div className="center-heading reveal">
          <p className="eyebrow dark">COMO TRABALHAMOS</p>
          <h2>Do primeiro contato à entrega.</h2>
          <p className="process-intro">Um processo simples e transparente, para você saber exatamente o que acontece em cada etapa.</p>
        </div>
        <ol className="process-grid">
          {processSteps.map(({ icon: Icon, title, text }, index) => (
            <li className="process-step reveal" key={title} style={{ transitionDelay: `${index * 100}ms` }}>
              <div className="process-top">
                <span className="process-icon"><Icon size={22} aria-hidden="true" /></span>
                <span className="process-number">0{index + 1}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
        <div className="process-cta reveal">
          <a className="button-primary" href={whatsappUrl('Olá! Quero começar um projeto com a Anviti.')} target="_blank" rel="noreferrer">Começar pelo WhatsApp <ArrowRight size={17} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  )
}
