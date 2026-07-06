import { notFound } from 'next/navigation';
import StockDetails from '@/components/StockDetails';
import { fetchStockBySlug, fetchStockSlugs } from '@/lib/stocks';
import { SITE, SITE_URL } from '@/lib/site';

export const revalidate = 300;

// Pre-render known product pages at build; new ones render on-demand (ISR).
export async function generateStaticParams() {
  const slugs = await fetchStockSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const stock = await fetchStockBySlug(slug);

  if (!stock) {
    return { title: 'Product not found' };
  }

  const title = stock.title || 'Export Lot';
  const description =
    (stock.description && stock.description.slice(0, 155)) ||
    `${title} — verified export lot from Rashi Worldwide.${stock.moq ? ` MOQ: ${stock.moq}.` : ''}`;
  const url = `/stockDetails/${slug}`;
  const image = stock.image && stock.image.startsWith('http') ? stock.image : SITE.ogImage;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title: `${title} | ${SITE.name}`,
      description,
      url,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE.name}`,
      description,
      images: [image],
    },
  };
}

function productJsonLd(stock, slug) {
  const image = stock.image && stock.image.startsWith('http') ? stock.image : `${SITE_URL}${SITE.ogImage}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: stock.title,
    description: stock.description || `${stock.title} — verified export lot from Rashi Worldwide.`,
    image: [image],
    sku: String(stock.id ?? slug),
    ...(stock.brand ? { brand: { '@type': 'Brand', name: stock.brand } } : {}),
    ...(stock.fabric ? { material: stock.fabric } : {}),
    offers: {
      '@type': 'Offer',
      availability:
        stock.status === 'Hidden'
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
      priceCurrency: 'USD',
      price: '0',
      url: `${SITE_URL}/stockDetails/${slug}`,
      seller: { '@type': 'Organization', name: SITE.name },
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const stock = await fetchStockBySlug(slug);

  if (!stock) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(stock, slug)) }}
      />
      <StockDetails stock={stock} />
    </>
  );
}
