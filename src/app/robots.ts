import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/render-master', '/merchant-feed.xml'],
      disallow: ['/api/', '/success'],
    },
    sitemap: 'https://www.evermarkprints.com/sitemap.xml',
  }
}
