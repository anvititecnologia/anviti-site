import { Plus } from 'lucide-react'

const faqs = [
  {
    question: 'Quanto custa um site ou uma landing page?',
    answer: 'O valor depende do que o seu projeto precisa: quantidade de páginas, funcionalidades e integrações. Depois de uma conversa rápida, enviamos uma proposta com escopo, prazo e investimento definidos, sem compromisso.',
  },
  {
    question: 'Qual é o prazo de entrega?',
    answer: 'Depende do tamanho do projeto. O prazo fica definido na proposta, antes de começarmos, para você saber exatamente quando vai receber.',
  },
  {
    question: 'Como funciona a plaquinha NFC?',
    answer: 'A plaquinha tem um chip NFC e um QR Code. O cliente aproxima o celular ou lê o QR Code e é levado direto para a página de avaliação da sua empresa no Google, sem precisar procurar nada.',
  },
  {
    question: 'A plaquinha NFC funciona em qualquer celular?',
    answer: 'A leitura por aproximação funciona nos celulares com NFC, que são a maioria dos modelos atuais. Para os demais, o QR Code impresso na plaquinha faz o mesmo caminho.',
  },
  {
    question: 'Vocês atendem fora do Espírito Santo?',
    answer: 'Sim. O atendimento é 100% digital, então atendemos empresas de todo o Brasil.',
  },
  {
    question: 'Vocês dão suporte depois da entrega?',
    answer: 'Sim. Depois de colocar tudo no ar, explicamos como usar e seguimos por perto para os ajustes que forem necessários.',
  },
  {
    question: 'Como faço para pedir um orçamento?',
    answer: 'Pelo WhatsApp, pelo formulário no fim desta página ou pelo e-mail anviti.tecnologia@gmail.com. Respondemos com as próximas etapas e uma proposta para o seu projeto.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
}

export function Faq() {
  return (
    <section className="section faq" id="duvidas">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="container faq-grid">
        <div className="faq-intro reveal">
          <p className="eyebrow dark">PERGUNTAS FREQUENTES</p>
          <h2>Ficou com alguma dúvida?</h2>
          <p>Reunimos as perguntas que mais recebemos. Se a sua não estiver aqui, é só chamar no WhatsApp.</p>
        </div>
        <div className="faq-list reveal">
          {faqs.map(({ question, answer }) => (
            <details key={question}>
              <summary>{question}<Plus size={18} aria-hidden="true" /></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
