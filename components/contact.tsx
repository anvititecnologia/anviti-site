'use client'

import { ArrowRight, Mail, MessageCircle } from 'lucide-react'
import { InstagramIcon } from '@/components/brand'
import { contact, instagramUrl, whatsappUrl } from '@/lib/site'

function formatPhone(value: string) {
  let digits = value.replace(/\D/g, '')
  if (digits.length > 11 && digits.startsWith('55')) digits = digits.slice(2)
  digits = digits.slice(0, 11)
  if (digits.length <= 2) return digits.length ? `(${digits}` : ''
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
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

export function Contact() {
  return (
    <section className="contact-section" id="contato">
      <div className="container contact-grid reveal">
        <div>
          <p className="eyebrow">VAMOS CONVERSAR?</p>
          <h2>O próximo passo<br />pode ser o seu <span>maior resultado.</span></h2>
          <p>Conte com a Anviti para tirar sua ideia do papel, modernizar seu negócio ou resolver sua próxima demanda de tecnologia.</p>
          <ul className="contact-details">
            <li><a href={whatsappUrl()} target="_blank" rel="noreferrer"><span className="contact-icon"><MessageCircle size={18} aria-hidden="true" /></span><span><small>WhatsApp</small><strong>{contact.whatsappLabel}</strong></span></a></li>
            <li><a href={`mailto:${contact.email}`}><span className="contact-icon"><Mail size={18} aria-hidden="true" /></span><span><small>E-mail</small><strong>{contact.email}</strong></span></a></li>
            <li><a href={instagramUrl} target="_blank" rel="noreferrer"><span className="contact-icon"><InstagramIcon size={18} /></span><span><small>Instagram</small><strong>@{contact.instagram}</strong></span></a></li>
          </ul>
        </div>
        <form onSubmit={sendContactForm}>
          <label>Nome<input name="nome" required autoComplete="name" placeholder="Seu nome" /></label>
          <label>Empresa<input name="empresa" autoComplete="organization" placeholder="Nome da empresa" /></label>
          <label>E-mail<input name="email" required type="email" autoComplete="email" placeholder="seu@email.com" /></label>
          <label>WhatsApp<input name="whatsapp" type="tel" inputMode="numeric" autoComplete="tel" maxLength={15} placeholder="(00) 00000-0000" onChange={(e) => { e.currentTarget.value = formatPhone(e.currentTarget.value) }} /></label>
          <label className="field-full">Serviço de interesse
            <select name="servico" defaultValue="">
              <option value="" disabled>Selecione uma opção</option>
              <option>Desenvolvimento Web / Landing Page</option>
              <option>Tecnologia NFC</option>
              <option>Automação de processos</option>
              <option>Suporte e soluções de TI</option>
              <option>Outro projeto</option>
            </select>
          </label>
          <label className="field-full">Mensagem<textarea name="mensagem" rows={4} placeholder="Conte um pouco sobre o seu projeto" /></label>
          <div className="form-submit">
            <button className="button-primary" type="submit">Solicitar orçamento <ArrowRight size={17} aria-hidden="true" /></button>
            <p><MessageCircle size={15} aria-hidden="true" />Você será direcionado ao WhatsApp com a mensagem pronta.</p>
          </div>
        </form>
      </div>
    </section>
  )
}
