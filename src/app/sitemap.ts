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
  ]
}
