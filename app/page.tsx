import { MessageCircle } from 'lucide-react'
import { About } from '@/components/about'
import { CleanAnchorLinks } from '@/components/clean-anchor-links'
import { Contact } from '@/components/contact'
import { Faq } from '@/components/faq'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Process } from '@/components/process'
import { RevealOnScroll } from '@/components/reveal-on-scroll'
import { Services } from '@/components/services'
import { Why } from '@/components/why'
import { whatsappUrl } from '@/lib/site'

export default function Page() {
  return (
    <main>
      <Header />
      <Hero />
      <Services />
      <Why />
      <About />
      <Process />
      <Faq />
      <Contact />
      <a className="whatsapp-float" href={whatsappUrl('Olá, gostaria de solicitar um orçamento para um projeto com a Anviti Tecnologia.')} target="_blank" rel="noreferrer" aria-label="Conversar no WhatsApp">
        <MessageCircle size={26} aria-hidden="true" />
      </a>
      <Footer />
      <RevealOnScroll />
      <CleanAnchorLinks />
    </main>
  )
}
