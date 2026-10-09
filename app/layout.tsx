import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '600', '700', '800'], variable: '--font-montserrat', display: 'swap' })

const siteUrl = 'https://anviti.com.br'
const description = 'Sites, landing pages, tecnologia NFC e soluções de TI para empresas de qualquer segmento, com atendimento 100% digital em todo o Brasil.'

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Anviti Tecnologia',
  url: siteUrl,
  description,
  email: 'anviti.tecnologia@gmail.com',
  telephone: '+55 27 99583-0403',
  areaServed: 'BR',
  sameAs: ['https://instagram.com/anviti.tecnologia'],
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Anviti Tecnologia | Sua marca mais forte no digital',
  description,
  keywords: ['desenvolvimento de sites', 'landing page', 'tecnologia NFC', 'avaliações Google', 'automação WhatsApp', 'soluções de TI', 'Anviti Tecnologia'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'Anviti Tecnologia',
    title: 'Anviti Tecnologia | Sua marca mais forte no digital',
    description,
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
