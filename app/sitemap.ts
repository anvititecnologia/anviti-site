import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://anviti.com.br', changeFrequency: 'monthly', priority: 1 },
    { url: 'https://anviti.com.br/politica-de-privacidade', changeFrequency: 'yearly', priority: 0.3 },
  ]
}
