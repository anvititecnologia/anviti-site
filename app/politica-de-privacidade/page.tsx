import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/brand'
import { CleanAnchorLinks } from '@/components/clean-anchor-links'
import { Footer } from '@/components/footer'
import { contact } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Política de Privacidade | Anviti Tecnologia',
  description: 'Como a Anviti Tecnologia trata os dados pessoais de quem visita o site e entra em contato.',
  alternates: { canonical: '/politica-de-privacidade' },
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <header className="legal-header">
        <div className="container legal-header-inner">
          <a href="/" aria-label="Anviti Tecnologia, voltar ao início"><Logo light /></a>
          <a className="legal-back" href="/"><ArrowLeft size={16} aria-hidden="true" />Voltar ao site</a>
        </div>
      </header>
      <main className="legal">
        <article className="container legal-content">
          <p className="eyebrow dark">LGPD</p>
          <h1>Política de Privacidade</h1>
          <p className="legal-updated">Última atualização: 9 de outubro de 2026</p>

          <p>Esta política explica como a Anviti Tecnologia trata os dados pessoais de quem visita este site e entra em contato com a gente, de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).</p>

          <h2>1. Quem é o responsável pelos dados</h2>
          <p>A Anviti Tecnologia é a responsável pelo tratamento dos dados descritos aqui. Para qualquer assunto sobre privacidade, fale com a gente pelo e-mail <a href={`mailto:${contact.email}`}>{contact.email}</a>.</p>

          <h2>2. Quais dados coletamos</h2>
          <p><strong>Dados que você nos envia.</strong> Ao usar o formulário de contato, você informa nome, empresa, e-mail, WhatsApp, serviço de interesse e uma mensagem. O site não armazena essas informações: ao enviar, ele monta uma mensagem com elas e abre o WhatsApp para você mandar à Anviti. Os dados só chegam até nós se você enviar essa mensagem.</p>
          <p><strong>Dados de navegação.</strong> Podemos usar uma ferramenta de estatísticas (Vercel Web Analytics) que conta visitas de forma anônima e agregada, como páginas acessadas, tipo de dispositivo e país. Ela não usa cookies e não identifica você.</p>
          <p>O site não usa cookies de publicidade, e as fontes e imagens são carregadas do próprio site, sem chamadas a serviços de terceiros.</p>

          <h2>3. Para que usamos os dados</h2>
          <ul>
            <li>Responder ao seu contato e entender a sua necessidade;</li>
            <li>Enviar propostas, orçamentos e informações sobre os serviços que você pediu;</li>
            <li>Prestar o atendimento e o suporte combinados;</li>
            <li>Entender, de forma anônima, como o site é usado, para melhorá-lo.</li>
          </ul>
          <p>O tratamento se baseia no seu pedido de contato e na execução de procedimentos preliminares a um contrato (art. 7º, V, da LGPD) e, no caso das estatísticas anônimas, no legítimo interesse em manter o site funcionando bem (art. 7º, IX).</p>

          <h2>4. Com quem os dados são compartilhados</h2>
          <p>Não vendemos nem alugamos dados pessoais. As mensagens que você envia passam pelo WhatsApp, serviço da Meta, que tem sua própria política de privacidade. O site também é hospedado por um provedor de infraestrutura, que pode registrar dados técnicos de acesso, como o endereço IP, para manter o serviço seguro.</p>

          <h2>5. Por quanto tempo guardamos</h2>
          <p>Guardamos as conversas e os dados de contato pelo tempo necessário para atender ao seu pedido e manter o relacionamento comercial, ou pelo prazo exigido por lei. Depois disso, os dados são excluídos.</p>

          <h2>6. Seus direitos</h2>
          <p>Você pode, a qualquer momento, pedir:</p>
          <ul>
            <li>Confirmação de que tratamos seus dados e acesso a eles;</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
            <li>Exclusão dos dados, quando não houver obrigação legal de mantê-los;</li>
            <li>Informações sobre com quem os dados foram compartilhados;</li>
            <li>Revogação do consentimento, quando ele for a base do tratamento.</li>
          </ul>
          <p>Para isso, envie um e-mail para <a href={`mailto:${contact.email}`}>{contact.email}</a>. Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).</p>

          <h2>7. Segurança</h2>
          <p>Adotamos medidas razoáveis para proteger os dados contra acesso não autorizado, perda ou alteração, e o site usa conexão segura (HTTPS).</p>

          <h2>8. Alterações nesta política</h2>
          <p>Esta política pode ser atualizada. A data da última atualização fica sempre no topo desta página.</p>
        </article>
      </main>
      <Footer />
      <CleanAnchorLinks />
    </>
  )
}
