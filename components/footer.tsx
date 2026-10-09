import { ArrowUp, Mail, MapPin, MessageCircle } from 'lucide-react'
import { InstagramIcon, Logo } from '@/components/brand'
import { services } from '@/components/services'
import { contact, instagramUrl, navItems, whatsappUrl } from '@/lib/site'

export function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo light />
          <p>Soluções em tecnologia, desenvolvimento web e inovação digital para empresas de todo o Brasil.</p>
          <div className="socials">
            <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon /></a>
            <a href={whatsappUrl()} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={15} aria-hidden="true" /></a>
            <a href={`mailto:${contact.email}`} aria-label="E-mail"><Mail size={15} aria-hidden="true" /></a>
          </div>
        </div>
        <nav className="footer-col" aria-label="Navegação do rodapé">
          <p className="footer-heading">Navegação</p>
          <ul>{navItems.map(([label, id]) => <li key={id}><a href={`/#${id}`}>{label}</a></li>)}</ul>
        </nav>
        <div className="footer-col">
          <p className="footer-heading">Serviços</p>
          <ul>{services.map((service) => <li key={service.title}><a href="/#servicos">{service.title}</a></li>)}</ul>
        </div>
        <div className="footer-col">
          <p className="footer-heading">Contato</p>
          <ul className="footer-contact">
            <li><a href={whatsappUrl()} target="_blank" rel="noreferrer"><MessageCircle size={15} aria-hidden="true" />{contact.whatsappLabel}</a></li>
            <li><a href={`mailto:${contact.email}`}><Mail size={15} aria-hidden="true" />{contact.email}</a></li>
            <li><a href={instagramUrl} target="_blank" rel="noreferrer"><InstagramIcon size={15} />@{contact.instagram}</a></li>
            <li><span><MapPin size={15} aria-hidden="true" />Atendimento em todo o Brasil</span></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Anviti Tecnologia. Todos os direitos reservados. <a className="footer-legal" href="/politica-de-privacidade">Política de Privacidade</a></span>
        <span className="footer-slogan">Tecnologia que impulsiona o amanhã.</span>
        <a className="back-to-top" href="#"><ArrowUp size={14} aria-hidden="true" />Voltar ao topo</a>
      </div>
    </footer>
  )
}
