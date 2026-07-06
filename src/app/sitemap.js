import { SITE_URL } from '@/lib/site';
import { fetchStockSlugs } from '@/lib/stocks';

export default async function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { path: '/', priority: 1.0, changeFrequency: 'daily' },
    { path: '/catalog', priority: 0.9, changeFrequency: 'daily' },
    { path: '/services', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/clients', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/faq', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.7, changeFrequency: 'yearly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  ].map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const slugs = await fetchStockSlugs();
  const productRoutes = slugs.map((slug) => ({
    url: `${SITE_URL}/stockDetails/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
