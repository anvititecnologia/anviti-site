'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Briefcase, Building2, Check, CircleCheck, CodeXml, Compass, Cpu, FileSpreadsheet, FileText, Layers, Lightbulb, Mail, MapPin, Menu, MessageCircle, MessagesSquare, MonitorSmartphone, Puzzle, Quote, Rocket, SmartphoneNfc, Star, Store, TrendingUp, Workflow, Wrench, X, Zap } from 'lucide-react'

const services = [
  { icon: MonitorSmartphone, eyebrow: 'PRESENÇA DIGITAL', title: 'Desenvolvimento Web', text: 'Sites e landing pages profissionais, responsivos e focados em conversão, com automação do atendimento via WhatsApp.', photo: { src: '/images/site-anviti-laptop.jpg', alt: 'Laptop exibindo o site da Anviti Tecnologia com o mascote camaleão' }, items: ['Sites institucionais e landing pages', 'Layout responsivo para celular', 'Páginas focadas em conversão', 'Atendimento automatizado no WhatsApp'], cta: 'Quero um site', message: 'Olá! Quero um site ou landing page para a minha empresa.' },
  { icon: SmartphoneNfc, eyebrow: 'INOVAÇÃO NO FÍSICO', title: 'Tecnologia NFC', text: 'Plaquinhas e displays inteligentes para avaliações no Google e experiências digitais no ponto de venda.', photo: { src: '/images/display-nfc-avaliacao-google.jpg', alt: 'Display de mesa com NFC e QR Code para avaliação no Google, produzido pela Anviti' }, items: ['Plaquinhas NFC personalizadas', 'Displays para o ponto de venda', 'Acesso direto às avaliações no Google', 'Experiências digitais por aproximação'], cta: 'Quero plaquinhas NFC', message: 'Olá! Tenho interesse nas plaquinhas e displays NFC da Anviti.' },
  { icon: Wrench, eyebrow: 'SUPORTE SOB DEMANDA', title: 'Soluções de TI', text: 'Automações, melhorias de processos e suporte digital personalizado para sua empresa operar com mais eficiência.', photo: null, items: ['Automação de processos', 'Melhoria de rotinas e fluxos', 'Suporte digital sob demanda', 'Atendimento personalizado'], cta: 'Falar sobre TI', message: 'Olá! Preciso de ajuda com automação, processos ou suporte de TI.' },
]
const pillars = [
  [Zap, 'Agilidade', 'Respostas rápidas e soluções diretas, sem burocracia.'],
  [Layers, 'Versatilidade técnica', 'Tecnologia, web, automação e suporte em um só parceiro.'],
  [Puzzle, 'Soluções completas', 'Do digital ao físico, conectamos ideias à realidade.'],
  [MapPin, 'Atendimento nacional', 'Parceria próxima e 100% digital para todo o Brasil.'],
]
const audience = [[Lightbulb, 'Empreendedores'], [Store, 'Comércios'], [Briefcase, 'Prestadores de serviços'], [Building2, 'Empresas de todos os portes']] as const
const aboutPoints = [
  [Compass, 'Estratégia', 'Entendemos o seu negócio antes de propor qualquer solução.'],
  [Cpu, 'Tecnologia', 'Ferramentas modernas, escolhidas para o momento da sua empresa.'],
  [TrendingUp, 'Resultados', 'Soluções pensadas para fazer diferença no dia a dia.'],
] as const
const processSteps = [
  [MessagesSquare, 'Conversa', 'Você conta a sua necessidade pelo WhatsApp e a gente entende o seu negócio.'],
  [FileText, 'Proposta', 'Enviamos uma solução clara, com escopo, prazo e investimento definidos.'],
  [CodeXml, 'Desenvolvimento', 'Criamos e configuramos tudo, com você acompanhando cada etapa.'],
  [Rocket, 'Entrega e suporte', 'Colocamos no ar, explicamos como usar e seguimos por perto para ajustes.'],
] as const
type Testimonial = { quote: string; name: string; company: string; service: string }
// Depoimentos reais de clientes. Enquanto estiver vazia, o site publicado esconde a seção e o link do menu.
const testimonials: Testimonial[] = []
// Exemplos fictícios de layout, exibidos só no ambiente de desenvolvimento (localhost). Nunca vão para o site publicado.
const previewTestimonials: Testimonial[] = [
  { quote: 'O site ficou rápido, bonito e funciona muito bem no celular. Agora os clientes chegam pelo WhatsApp já sabendo o que querem, e o atendimento ficou bem mais organizado.', name: 'Mariana Duarte', company: 'Studio Bella Forma', service: 'Desenvolvimento Web' },
  { quote: 'Colocamos o display NFC no balcão e as avaliações no Google começaram a aparecer na mesma semana. É só aproximar o celular, o cliente não precisa procurar nada.', name: 'Rafael Monteiro', company: 'Café da Praça', service: 'Tecnologia NFC' },
  { quote: 'Automatizaram o registro dos pedidos que chegavam pelo WhatsApp e hoje a equipe não perde mais tempo copiando dados em planilha. Atendimento rápido e sem complicação.', name: 'Carla Nogueira', company: 'Nogueira Distribuidora', service: 'Soluções de TI' },
]
const isPreview = testimonials.length === 0 && process.env.NODE_ENV === 'development'
const shownTestimonials = testimonials.length ? testimonials : isPreview ? previewTestimonials : []
const navItems = [['Início', 'inicio'], ['Serviços', 'servicos'], ['Sobre', 'sobre'], ...(shownTestimonials.length ? [['Depoimentos', 'depoimentos']] : []), ['Contato', 'contato']]

function InstagramIcon({ size = 15 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
}
function Logo({ light = false }: { light?: boolean }) {
  return <div className={`brand-logo ${light ? 'brand-logo-light' : ''}`} aria-label="Anviti Tecnologia"><strong>ANVITI<span>.</span></strong><small>TECNOLOGIA</small></div>
}
function ButtonLink({ children, href = '#contato' }: { children: React.ReactNode; href?: string }) {
  return <a className="button-primary" href={href}>{children}<ArrowRight size={17} aria-hidden="true" /></a>
}
function whatsappUrl(message: string) {
  return `https://wa.me/5527995830403?text=${encodeURIComponent(message)}`
}
function openQuoteWhatsApp() {
  window.open(whatsappUrl('Olá, gostaria de solicitar um orçamento para um projeto com a Anviti Tecnologia.'), '_blank', 'noopener,noreferrer')
}
function sendContactForm(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  const data = new FormData(e.currentTarget)
  const field = (name: string) => String(data.get(name) ?? '').trim()
  const lines = [
    `Olá, sou ${field('nome') || 'um cliente'}${field('empresa') ? ` da empresa ${field('empresa')}` : ''}.`,
    `Tenho interesse em: ${field('servico') || 'uma solução de tecnologia'}.`,
    field('mensagem'),
    `E-mail: ${field('email')}`,
    field('whatsapp') && `WhatsApp: ${field('whatsapp')}`,
  ].filter(Boolean)
  window.open(whatsappUrl(lines.join('\n')), '_blank', 'noopener,noreferrer')
}
function AutomationMockup() {
  const steps = [
    { icon: MessageCircle, title: 'Novo pedido', detail: 'Recebido no WhatsApp', status: 'Recebido' },
    { icon: Workflow, title: 'Automação Anviti', detail: 'Organizando os dados', status: 'Ativo', active: true },
    { icon: FileSpreadsheet, title: 'Registro e aviso', detail: 'Planilha e e-mail', status: 'Concluído' },
  ]
  return <div className="it-mockup" aria-hidden="true">
    <div className="it-window">
      <div className="it-window-bar"><span /><span /><span /><b>Fluxo de atendimento</b></div>
      <ol className="it-flow">{steps.map(({ icon: Icon, title, detail, status, active }) => <li key={title} className={active ? 'is-active' : undefined}><i><Icon size={15} /></i><div><strong>{title}</strong><small>{detail}</small></div><em>{status}</em></li>)}</ol>
    </div>
    <div className="it-toast"><CircleCheck size={18} /><div><strong>Chamado resolvido</strong><small>Suporte de TI</small></div></div>
  </div>
}

export default function Page() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) }
    }), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    document.documentElement.classList.add('reveal-ready')
    return () => observer.disconnect()
  }, [])
  return <main>
    <section className="hero" id="inicio">
      <header className={`navbar container ${scrolled ? 'navbar-scrolled' : ''}`}><a href="#inicio"><Logo light /></a><nav className={open ? 'nav-links nav-open' : 'nav-links'}>{navItems.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}</nav><button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Fechar menu' : 'Abrir menu'}>{open ? <X /> : <Menu />}</button></header>
      <div className="container hero-grid"><div className="hero-copy"><p className="eyebrow">ESTRATÉGIA + TECNOLOGIA = RESULTADOS</p><h1>Sua marca<br /><span>mais forte</span><br />no digital.</h1><p className="hero-text">Soluções completas em tecnologia, desenvolvimento web e inovação digital para empresas de qualquer segmento, em todo o Brasil.</p><ButtonLink>Fale com a gente</ButtonLink></div><div className="hero-photo" role="img" aria-label="Mascote da Anviti, um camaleão azul de óculos e camisa da empresa, acenando no escritório" /></div>
    </section>

    <section className="section services" id="servicos"><div className="container"><div className="section-intro reveal"><div><p className="eyebrow dark">NOSSOS SERVIÇOS</p><h2>Mais visibilidade,<br />mais oportunidades.</h2></div><p>Da presença online à inovação no ponto de venda, a Anviti resolve demandas de tecnologia com agilidade, versatilidade e uma comunicação simples.</p></div><div className="services-grid">{services.map(({ icon: Icon, ...service }, index) => <article className="service-card reveal" key={service.title} style={{ transitionDelay: `${index * 120}ms` }}><div className="icon-box"><Icon size={25} /></div><p className="eyebrow dark">{service.eyebrow}</p><h3>{service.title}</h3><p>{service.text}</p><ul className="service-items">{service.items.map((item) => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}</ul><a className="service-cta" href={whatsappUrl(service.message)} target="_blank" rel="noreferrer">{service.cta}<ArrowRight size={16} aria-hidden="true" /></a><div className={`mockup-frame ${service.photo ? 'mockup-frame-photo' : 'mockup-frame-it'}`}>{service.photo ? <img className="mockup-photo" src={service.photo.src} alt={service.photo.alt} loading="lazy" /> : <AutomationMockup />}</div></article>)}</div></div></section>

    <section className="why"><div className="container why-grid"><div className="reveal"><p className="eyebrow">POR QUE ESCOLHER A ANVITI?</p><h2>Tecnologia que<br />impulsiona o seu negócio.</h2><a className="button-primary why-cta" href={whatsappUrl('Olá! Quero conversar sobre uma solução de tecnologia para o meu negócio.')} target="_blank" rel="noreferrer">Fale com a gente <ArrowRight size={17} aria-hidden="true" /></a></div><div className="pillars">{pillars.map(([Icon, title, text], index) => <div className="pillar reveal" key={title as string} style={{ transitionDelay: `${index * 100}ms` }}><Icon size={22} /><h3>{title as string}</h3><p>{text as string}</p></div>)}</div></div></section>

    <section className="section about" id="sobre"><div className="container about-grid reveal"><div><p className="eyebrow dark">SOBRE A ANVITI</p><h2>Tecnologia, estratégia e criatividade trabalhando juntas.</h2><div className="about-audience"><span>Para quem é</span><ul>{audience.map(([Icon, label]) => <li key={label}><Icon size={16} aria-hidden="true" />{label}</li>)}</ul></div></div><div><p className="about-text">A Anviti Tecnologia ajuda empreendedores, comércios, prestadores de serviços e empresas de qualquer porte a modernizar sua presença, otimizar processos e oferecer experiências melhores aos seus clientes.</p><div className="about-points">{aboutPoints.map(([Icon, title, text]) => <div key={title}><span className="about-point-icon"><Icon size={20} aria-hidden="true" /></span><strong>{title}</strong><p>{text}</p></div>)}</div></div></div></section>

    <section className="section process" id="como-trabalhamos"><div className="container"><div className="center-heading reveal"><p className="eyebrow dark">COMO TRABALHAMOS</p><h2>Do primeiro contato à entrega.</h2><p className="process-intro">Um processo simples e transparente, para você saber exatamente o que acontece em cada etapa.</p></div><ol className="process-grid">{processSteps.map(([Icon, title, text], index) => <li className="process-step reveal" key={title} style={{ transitionDelay: `${index * 100}ms` }}><div className="process-top"><span className="process-icon"><Icon size={22} aria-hidden="true" /></span><span className="process-number">0{index + 1}</span></div><h3>{title}</h3><p>{text}</p></li>)}</ol><div className="process-cta reveal"><a className="button-primary" href={whatsappUrl('Olá! Quero começar um projeto com a Anviti.')} target="_blank" rel="noreferrer">Começar pelo WhatsApp <ArrowRight size={17} aria-hidden="true" /></a></div></div></section>

    {shownTestimonials.length > 0 && <section className="section testimonials" id="depoimentos"><div className="container"><div className="center-heading reveal"><p className="eyebrow dark">DEPOIMENTOS</p><h2>Quem confia na Anviti.</h2></div><div className="testimonials-grid">{shownTestimonials.map((item, index) => <figure className="testimonial reveal" key={index} style={{ transitionDelay: `${index * 100}ms` }}>{isPreview && <span className="testimonial-badge">Exemplo</span>}<Quote className="testimonial-quote" size={28} aria-hidden="true" /><div className="testimonial-stars" aria-hidden="true">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={15} />)}</div><blockquote>{item.quote}</blockquote><figcaption><span className="testimonial-avatar" aria-hidden="true">{item.name.split(' ').map((word) => word[0]).slice(0, 2).join('').toUpperCase()}</span><span><strong>{item.name}</strong><small>{item.company} · {item.service}</small></span></figcaption></figure>)}</div></div></section>}

    <section className="contact-section" id="contato"><div className="container contact-grid reveal"><div><p className="eyebrow">VAMOS CONVERSAR?</p><h2>O próximo passo<br />pode ser o seu <span>maior resultado.</span></h2><p>Conte com a Anviti para tirar sua ideia do papel, modernizar seu negócio ou resolver sua próxima demanda de tecnologia.</p><ul className="contact-details"><li><a href="https://wa.me/5527995830403" target="_blank" rel="noreferrer"><span className="contact-icon"><MessageCircle size={18} aria-hidden="true" /></span><span><small>WhatsApp</small><strong>(27) 99583-0403</strong></span></a></li><li><a href="mailto:anviti.tecnologia@gmail.com"><span className="contact-icon"><Mail size={18} aria-hidden="true" /></span><span><small>E-mail</small><strong>anviti.tecnologia@gmail.com</strong></span></a></li><li><a href="https://instagram.com/anviti.tecnologia" target="_blank" rel="noreferrer"><span className="contact-icon"><InstagramIcon size={18} /></span><span><small>Instagram</small><strong>@anviti.tecnologia</strong></span></a></li></ul></div><form onSubmit={sendContactForm}><label>Nome<input name="nome" required autoComplete="name" placeholder="Seu nome" /></label><label>Empresa<input name="empresa" autoComplete="organization" placeholder="Nome da empresa" /></label><label>E-mail<input name="email" required type="email" autoComplete="email" placeholder="seu@email.com" /></label><label>WhatsApp<input name="whatsapp" type="tel" autoComplete="tel" placeholder="(00) 00000-0000" /></label><label className="field-full">Serviço de interesse<select name="servico" defaultValue=""><option value="" disabled>Selecione uma opção</option><option>Desenvolvimento Web / Landing Page</option><option>Tecnologia NFC</option><option>Automação de processos</option><option>Suporte e soluções de TI</option><option>Outro projeto</option></select></label><label className="field-full">Mensagem<textarea name="mensagem" rows={4} placeholder="Conte um pouco sobre o seu projeto" /></label><div className="form-submit"><button className="button-primary" type="submit">Solicitar orçamento <ArrowRight size={17} aria-hidden="true" /></button><p><MessageCircle size={15} aria-hidden="true" />Você será direcionado ao WhatsApp com a mensagem pronta.</p></div></form></div></section>

    <button className="whatsapp-float" type="button" onClick={openQuoteWhatsApp} aria-label="Conversar no WhatsApp"><MessageCircle size={26} aria-hidden="true" /></button>

    <footer><div className="container footer-top"><Logo light /><div className="footer-links">{navItems.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</div><div className="socials"><a href="https://instagram.com/anviti.tecnologia" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon /></a><a href="https://wa.me/5527995830403" target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={15} aria-hidden="true" /></a><a href="mailto:anviti.tecnologia@gmail.com" aria-label="E-mail"><Mail size={15} aria-hidden="true" /></a></div><p className="footer-tag">TECNOLOGIA QUE IMPULSIONA<br />O AMANHÃ.</p></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Anviti Tecnologia. Todos os direitos reservados.</span><span>Feito para crescer.</span></div></footer>
  </main>
}
