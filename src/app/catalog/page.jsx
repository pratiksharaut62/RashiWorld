import CatalogClient from '@/components/CatalogClient';
import { fetchStocks } from '@/lib/stocks';

export const revalidate = 300;

export const metadata = {
  title: 'Catalog',
  description:
    'Browse the full Rashi Worldwide export catalog — verified apparel lots filterable by category, brand and fabric. Request a bulk quote in a tap.',
  alternates: { canonical: '/catalog' },
  openGraph: {
    title: 'Catalog | Rashi Worldwide',
    description: 'Browse the full Rashi Worldwide export catalog of verified apparel lots.',
    url: '/catalog',
  },
};

export default async function CatalogPage() {
  const stocks = await fetchStocks();
  return <CatalogClient initialStocks={stocks} />;
}
