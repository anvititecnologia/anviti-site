import { ArrowRight, Check, CircleCheck, FileSpreadsheet, MessageCircle, MonitorSmartphone, SmartphoneNfc, Workflow, Wrench } from 'lucide-react'
import { whatsappUrl } from '@/lib/site'

export const services = [
  {
    icon: MonitorSmartphone,
    eyebrow: 'PRESENÇA DIGITAL',
    title: 'Desenvolvimento Web',
    text: 'Sites e landing pages profissionais, responsivos e focados em conversão, com automação do atendimento via WhatsApp.',
    photo: { src: '/images/site-anviti-laptop.jpg', webp: '/images/site-anviti-laptop-640.webp 640w, /images/site-anviti-laptop.webp 1200w', alt: 'Laptop exibindo o site da Anviti Tecnologia com o mascote camaleão' },
    items: ['Sites institucionais e landing pages', 'Layout responsivo para celular', 'Páginas focadas em conversão', 'Atendimento automatizado no WhatsApp'],
    cta: 'Quero um site',
    message: 'Olá! Quero um site ou landing page para a minha empresa.',
  },
  {
    icon: SmartphoneNfc,
    eyebrow: 'INOVAÇÃO NO FÍSICO',
    title: 'Tecnologia NFC',
    text: 'Plaquinhas e displays inteligentes para avaliações no Google e experiências digitais no ponto de venda.',
    photo: { src: '/images/display-nfc-avaliacao-google.jpg', webp: '/images/display-nfc-avaliacao-google-600.webp 600w, /images/display-nfc-avaliacao-google.webp 900w', alt: 'Display de mesa com NFC e QR Code para avaliação no Google, produzido pela Anviti' },
    items: ['Plaquinhas NFC personalizadas', 'Displays para o ponto de venda', 'Acesso direto às avaliações no Google', 'Experiências digitais por aproximação'],
    cta: 'Quero plaquinhas NFC',
    message: 'Olá! Tenho interesse nas plaquinhas e displays NFC da Anviti.',
  },
  {
    icon: Wrench,
    eyebrow: 'SUPORTE SOB DEMANDA',
    title: 'Soluções de TI',
    text: 'Automações, melhorias de processos e suporte digital personalizado para sua empresa operar com mais eficiência.',
    photo: null,
    items: ['Automação de processos', 'Melhoria de rotinas e fluxos', 'Suporte digital sob demanda', 'Atendimento personalizado'],
    cta: 'Falar sobre TI',
    message: 'Olá! Preciso de ajuda com automação, processos ou suporte de TI.',
  },
]

function AutomationMockup() {
  const steps = [
    { icon: MessageCircle, title: 'Novo pedido', detail: 'Recebido no WhatsApp', status: 'Recebido' },
    { icon: Workflow, title: 'Automação Anviti', detail: 'Organizando os dados', status: 'Ativo', active: true },
    { icon: FileSpreadsheet, title: 'Registro e aviso', detail: 'Planilha e e-mail', status: 'Concluído' },
  ]
  return (
    <div className="it-mockup" aria-hidden="true">
      <div className="it-window">
        <div className="it-window-bar"><span /><span /><span /><b>Fluxo de atendimento</b></div>
        <ol className="it-flow">
          {steps.map(({ icon: Icon, title, detail, status, active }) => (
            <li key={title} className={active ? 'is-active' : undefined}>
              <i><Icon size={15} /></i>
              <div><strong>{title}</strong><small>{detail}</small></div>
              <em>{status}</em>
            </li>
          ))}
        </ol>
      </div>
      <div className="it-toast"><CircleCheck size={18} /><div><strong>Chamado resolvido</strong><small>Suporte de TI</small></div></div>
    </div>
  )
}

export function Services() {
  return (
    <section className="section services" id="servicos">
      <div className="container">
        <div className="section-intro reveal">
          <div>
            <p className="eyebrow dark">NOSSOS SERVIÇOS</p>
            <h2>Mais visibilidade,<br />mais oportunidades.</h2>
          </div>
          <p>Da presença online à inovação no ponto de venda, a Anviti resolve demandas de tecnologia com agilidade, versatilidade e uma comunicação simples.</p>
        </div>
        <div className="services-grid">
          {services.map(({ icon: Icon, ...service }, index) => (
            <article className="service-card reveal" key={service.title} style={{ transitionDelay: `${index * 120}ms` }}>
              <div className="icon-box"><Icon size={25} /></div>
              <p className="eyebrow dark">{service.eyebrow}</p>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <ul className="service-items">
                {service.items.map((item) => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}
              </ul>
              <a className="service-cta" href={whatsappUrl(service.message)} target="_blank" rel="noreferrer">{service.cta}<ArrowRight size={16} aria-hidden="true" /></a>
              <div className={`mockup-frame ${service.photo ? 'mockup-frame-photo' : 'mockup-frame-it'}`}>
                {service.photo ? (
                  <picture>
                    <source type="image/webp" srcSet={service.photo.webp} sizes="(max-width: 640px) 100vw, 400px" />
                    <img className="mockup-photo" src={service.photo.src} alt={service.photo.alt} loading="lazy" decoding="async" />
                  </picture>
                ) : <AutomationMockup />}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
