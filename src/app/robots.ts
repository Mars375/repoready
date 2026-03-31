import { MetadataRoute } from 'next'

const BASE_URL = 'https://repoready.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/history'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
