import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: 'https://anviti.com.br', changeFrequency: 'monthly', priority: 1 }]
}
