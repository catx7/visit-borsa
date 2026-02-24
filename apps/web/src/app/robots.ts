import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/api/', '/login', '/register', '/confirm-email'],
      },
    ],
    sitemap: 'https://visitborsa.ro/sitemap.xml',
  };
}
