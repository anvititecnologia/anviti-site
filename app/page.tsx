'use client'

import { useState } from 'react'
import { ArrowRight, BarChart3, CheckCircle2, Globe2, HeartHandshake, Mail, Menu, Megaphone, MessageCircle, Rocket, ShieldCheck, Target, X } from 'lucide-react'

const navy = '#061536'
const blue = '#0050F5'
const services = [
  { icon: Globe2, eyebrow: 'PRESENÇA DIGITAL', title: 'Desenvolvimento Web', text: 'Sites e landing pages profissionais, responsivos e focados em conversão, com automação do atendimento via WhatsApp.', type: 'laptop' },
  { icon: Target, eyebrow: 'INOVAÇÃO NO FÍSICO', title: 'Tecnologia NFC', text: 'Plaquinhas e displays inteligentes para avaliações no Google e experiências digitais no ponto de venda.', type: 'phone' },
  { icon: ShieldCheck, eyebrow: 'SUPORTE SOB DEMANDA', title: 'Soluções de TI', text: 'Automações, melhorias de processos e suporte digital personalizado para sua empresa operar com mais eficiência.', type: 'chart' },
]
const pillars = [
  [Rocket, 'Agilidade', 'Respostas rápidas e soluções diretas, sem burocracia.'],
  [ShieldCheck, 'Versatilidade técnica', 'Tecnologia, web, automação e suporte em um só parceiro.'],
  [Target, 'Soluções completas', 'Do digital ao físico, conectamos ideias à realidade.'],
  [HeartHandshake, 'Atendimento nacional', 'Parceria próxima e 100% digital para todo o Brasil.'],
]
const navItems = [['Início', 'inicio'], ['Serviços', 'servicos'], ['Sobre', 'sobre'], ['Resultados', 'resultados'], ['Contato', 'contato']]
const results = [['100%', 'atendimento digital'], ['BR', 'cobertura nacional'], ['2 frentes', 'digital e físico'], ['1 parceiro', 'para várias demandas de TI']]

function InstagramIcon({ size = 15 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
}
function Logo({ light = false }: { light?: boolean }) {
  return <div className={`brand-logo ${light ? 'brand-logo-light' : ''}`} aria-label="Anviti Tecnologia"><strong>ANVITI<span>.</span></strong><small>TECNOLOGIA</small></div>
}
function ButtonLink({ children, href = '#contato' }: { children: React.ReactNode; href?: string }) {
  return <a className="button-primary" href={href}>{children}<ArrowRight size={17} aria-hidden="true" /></a>
}
function openQuoteWhatsApp() {
  const message = encodeURIComponent('Olá, gostaria de solicitar um orçamento para um projeto com a Anviti Tecnologia.')
  window.open(`https://wa.me/5527995830403?text=${message}`, '_blank', 'noopener,noreferrer')
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
  window.open(`https://wa.me/5527995830403?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer')
}
function Mockup({ type }: { type: string }) {
  if (type === 'phone') return <div className="mockup-phone"><div className="phone-notch" /><div className="phone-top"><span>9:41</span><span>•••</span></div><div className="phone-logo">A<span>.</span></div><p>Conteúdo<br /><b>que conecta<br />sua marca.</b></p><div className="phone-actions">♡　◯　⌑</div></div>
  if (type === 'laptop') return <div className="mockup-laptop"><div className="laptop-screen"><Logo light /><div className="screen-line" /><b>Seu negócio<br /><em>no próximo nível.</em></b><span className="screen-button">Fale conosco</span></div><div className="laptop-base" /></div>
  return <div className="mockup-chart"><div className="chart-head"><span>Resultados que<br /><b>impulsionam.</b></span><BarChart3 size={22} /></div><svg viewBox="0 0 240 95" role="img" aria-label="Gráfico de crescimento"><path d="M0 76 C30 62, 43 74, 63 55 S98 66, 119 40 S158 53, 178 25 S214 32, 240 8" fill="none" stroke={blue} strokeWidth="4" /><path d="M0 76 C30 62, 43 74, 63 55 S98 66, 119 40 S158 53, 178 25 S214 32, 240 8 V95 H0Z" fill="rgba(0,80,245,.16)" /></svg><div className="chart-stats"><span>Alcance <b>+248%</b></span><span>Cliques <b>+312%</b></span></div></div>
}

export default function Page() {
  const [open, setOpen] = useState(false)
  return <main>
    <section className="hero" id="inicio">
      <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
      <header className="navbar container"><a href="#inicio"><Logo light /></a><nav className={open ? 'nav-links nav-open' : 'nav-links'}>{navItems.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}</nav><button className="button-primary" type="button" onClick={openQuoteWhatsApp}>Solicite um orçamento <ArrowRight size={17} aria-hidden="true" /></button><button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Fechar menu' : 'Abrir menu'}>{open ? <X /> : <Menu />}</button></header>
      <div className="container hero-grid"><div className="hero-copy"><p className="eyebrow">ESTRATÉGIA + TECNOLOGIA = RESULTADOS</p><h1>Sua marca<br /><span>mais forte</span><br />no digital.</h1><p className="hero-text">Soluções completas em tecnologia, desenvolvimento web e inovação digital para empresas de qualquer segmento, em todo o Brasil.</p><ButtonLink>Fale com a gente</ButtonLink></div><div className="hero-visual hero-image-visual"><img src="/images/anviti-hero-cutout.png" alt="Laptop, tablet e celular com interfaces digitais da Anviti" /></div></div>
    </section>

    <section className="section services" id="servicos"><div className="container"><div className="section-intro"><div><p className="eyebrow dark">NOSSOS SERVIÇOS</p><h2>Mais visibilidade,<br />mais oportunidades.</h2></div><p>Da presença online à inovação no ponto de venda, a Anviti resolve demandas de tecnologia com agilidade, versatilidade e uma comunicação simples.</p></div><div className="services-grid">{services.map(({ icon: Icon, ...service }) => <article className="service-card" key={service.title}><div className="icon-box"><Icon size={25} /></div><p className="eyebrow dark">{service.eyebrow}</p><h3>{service.title}<ArrowRight size={18} /></h3><p>{service.text}</p><Mockup type={service.type} /></article>)}</div></div></section>

    <section className="why"><div className="container why-grid"><div><p className="eyebrow">POR QUE ESCOLHER A ANVITI?</p><h2>Tecnologia que<br />impulsiona o seu negócio.</h2></div><div className="pillars">{pillars.map(([Icon, title, text], index) => <div className="pillar" key={title as string}><Icon size={30} /><span>0{index + 1}</span><h3>{title as string}</h3><p>{text as string}</p></div>)}</div></div></section>

    <section className="section about" id="sobre"><div className="container about-grid"><div><p className="eyebrow dark">SOBRE A ANVITI</p><h2>Tecnologia, estratégia e criatividade trabalhando juntas.</h2></div><div><p className="about-text">A Anviti Tecnologia ajuda empreendedores, comércios, prestadores de serviços e empresas de qualquer porte a modernizar sua presença, otimizar processos e oferecer experiências melhores aos seus clientes.</p><div className="about-points"><div><b>01</b><strong>ESTRATÉGIA</strong></div><div><b>02</b><strong>TECNOLOGIA</strong></div><div><b>03</b><strong>RESULTADOS</strong></div></div></div></div></section>

    <section className="section results" id="resultados"><div className="container"><div className="center-heading"><p className="eyebrow dark">RESULTADOS QUE FALAM POR SI</p><h2>Empresas que crescem com a Anviti.</h2></div><div className="results-grid">{results.map(([number, label]) => <div className="result" key={label}><strong>{number}</strong><span>{label}</span></div>)}</div></div></section>

    <section className="contact-section" id="contato"><div className="container contact-grid"><div><p className="eyebrow">VAMOS CONVERSAR?</p><h2>O próximo passo<br />pode ser o seu <span>maior resultado.</span></h2><p>Conte com a Anviti para tirar sua ideia do papel, modernizar seu negócio ou resolver sua próxima demanda de tecnologia.</p><div className="contact-details"><a href="https://wa.me/5527995830403" target="_blank" rel="noreferrer">WhatsApp: (27) 99583-0403</a><a href="mailto:anviti.tecnologia@gmail.com">anviti.tecnologia@gmail.com</a><a href="https://instagram.com/anviti.tecnologia" target="_blank" rel="noreferrer">@anviti.tecnologia</a></div></div><form onSubmit={sendContactForm}><label>Nome<input name="nome" required autoComplete="name" placeholder="Como podemos chamar você?" /></label><label>Empresa<input name="empresa" autoComplete="organization" placeholder="Nome da empresa" /></label><label>E-mail<input name="email" required type="email" autoComplete="email" placeholder="seu@email.com" /></label><label>WhatsApp<input name="whatsapp" type="tel" autoComplete="tel" placeholder="(00) 00000-0000" /></label><label>Serviço de interesse<select name="servico" defaultValue=""><option value="" disabled>Selecione uma opção</option><option>Desenvolvimento Web / Landing Page</option><option>Tecnologia NFC</option><option>Automação de processos</option><option>Suporte e soluções de TI</option><option>Outro projeto</option></select></label><label>Mensagem<textarea name="mensagem" rows={4} placeholder="Conte um pouco sobre o seu projeto" /></label><button className="button-primary" type="submit">Solicitar orçamento <ArrowRight size={17} /></button></form></div></section>

    <button className="whatsapp-float" type="button" onClick={openQuoteWhatsApp} aria-label="Conversar no WhatsApp"><MessageCircle size={26} aria-hidden="true" /></button>

    <footer><div className="container footer-top"><Logo light /><div className="footer-links">{navItems.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</div><div className="socials"><a href="https://instagram.com/anviti.tecnologia" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon /></a><a href="https://wa.me/5527995830403" target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={15} aria-hidden="true" /></a><a href="mailto:anviti.tecnologia@gmail.com" aria-label="E-mail"><Mail size={15} aria-hidden="true" /></a></div><p className="footer-tag">TECNOLOGIA QUE IMPULSIONA<br />O AMANHÃ.</p></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Anviti Tecnologia. Todos os direitos reservados.</span><span>Feito para crescer.</span></div></footer>
  </main>
}
