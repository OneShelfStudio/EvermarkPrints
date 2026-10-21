import { MetadataRoute } from 'next'
import { EVERMARK_CATALOG } from '@/lib/catalog'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://evermarkprints.com'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...EVERMARK_CATALOG.map((p) => ({
      url: `${baseUrl}/create/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    })),
    {
      url: `${baseUrl}/track`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/refunds`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}
