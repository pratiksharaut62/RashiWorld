// Central site config used across metadata, sitemap, robots and JSON-LD.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://rashiworldwide.com'
).replace(/\/$/, '');

export const SITE = {
  name: 'Rashi Worldwide',
  shortName: 'Rashi Worldwide',
  title: 'Rashi Worldwide — Premium Apparel Export',
  description:
    'Rashi Worldwide is an elite apparel exporter — premium manufacturing, verified export lots, private-label / OEM production and reliable worldwide logistics.',
  url: SITE_URL,
  locale: 'en_US',
  ogImage: '/logo.jpg',
  twitter: '@rashiworldwide',
  keywords: [
    'apparel export',
    'garment exporter',
    'wholesale clothing',
    'private label manufacturing',
    'OEM apparel',
    'bulk clothing supplier',
    'export lots',
    'Rashi Worldwide',
  ],
  phone: '+917709008441',
  whatsapp: '917709008441',
  instagram: 'rashiworldwide.17',
};

/** Organization JSON-LD for the site (used on the home page / layout). */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}${SITE.ogImage}`,
    description: SITE.description,
    sameAs: [`https://instagram.com/${SITE.instagram}`],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE.phone,
      contactType: 'sales',
      areaServed: 'Worldwide',
      availableLanguage: ['English'],
    },
  };
}
