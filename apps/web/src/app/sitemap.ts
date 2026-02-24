import type { MetadataRoute } from 'next';

const BASE_URL = 'https://visitborsa.ro';

async function fetchIds(endpoint: string): Promise<string[]> {
  try {
    const apiUrl = (process.env.API_URL || 'http://localhost:3001').trim().replace(/\/+$/, '');
    const res = await fetch(`${apiUrl}/api/${endpoint}?page=1&limit=500`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []).map((item: { id: string }) => item.id);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [propertyIds, serviceIds, restaurantIds, attractionIds] = await Promise.all([
    fetchIds('properties'),
    fetchIds('services'),
    fetchIds('restaurants'),
    fetchIds('attractions'),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/cazari`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/servicii`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/restaurante`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/de-vizitat`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/despre-borsa`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/partia-olimpica`, changeFrequency: 'weekly', priority: 0.7 },
  ];

  const propertyPages: MetadataRoute.Sitemap = propertyIds.map((id) => ({
    url: `${BASE_URL}/cazari/${id}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const servicePages: MetadataRoute.Sitemap = serviceIds.map((id) => ({
    url: `${BASE_URL}/servicii/${id}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const restaurantPages: MetadataRoute.Sitemap = restaurantIds.map((id) => ({
    url: `${BASE_URL}/restaurante/${id}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const attractionPages: MetadataRoute.Sitemap = attractionIds.map((id) => ({
    url: `${BASE_URL}/de-vizitat/${id}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...propertyPages, ...servicePages, ...restaurantPages, ...attractionPages];
}
