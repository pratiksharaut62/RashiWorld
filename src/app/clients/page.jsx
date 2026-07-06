import Link from 'next/link';
import '@/styles/static-page.css';

export const metadata = {
  title: 'Our Clients & Reach',
  description:
    'Rashi Worldwide is trusted by importers, wholesalers and distributors across 25+ countries. See the markets we serve and what buyers say.',
  alternates: { canonical: '/clients' },
  openGraph: {
    title: 'Our Clients & Reach | Rashi Worldwide',
    description: 'Trusted by importers, wholesalers and distributors across 25+ countries.',
    url: '/clients',
  },
};

const regions = [
  'United States', 'United Kingdom', 'UAE', 'Saudi Arabia', 'Germany',
  'France', 'Canada', 'Australia', 'South Africa', 'Nigeria',
  'Kenya', 'Singapore', 'Malaysia', 'Spain', 'Italy',
];

const testimonials = [
  { quote: 'Consistent quality and honest lead times. Rashi Worldwide has become our go-to sourcing partner for seasonal lots.', author: 'Wholesale Importer', role: 'Dubai, UAE' },
  { quote: 'The sampling process saved us from costly mistakes. What we approved is exactly what we received in bulk.', author: 'Retail Buyer', role: 'London, UK' },
  { quote: 'Reliable packing and documentation made customs clearance painless. Highly professional export team.', author: 'Distributor', role: 'Lagos, Nigeria' },
];

export default function ClientsPage() {
  return (
    <div className="static-page">
      <header className="static-hero">
        <h1>Our Clients &amp; Reach</h1>
        <p className="hero-desc">
          Trusted by importers, wholesalers and distributors across 25+ countries.
        </p>
      </header>

      <div className="static-body">
        <div className="stats-strip">
          <div className="stat"><div className="stat-num">25+</div><div className="stat-label">Countries</div></div>
          <div className="stat"><div className="stat-num">500+</div><div className="stat-label">Orders Shipped</div></div>
          <div className="stat"><div className="stat-num">10+</div><div className="stat-label">Years Trading</div></div>
          <div className="stat"><div className="stat-num">98%</div><div className="stat-label">Repeat Buyers</div></div>
        </div>

        <h2 className="section-title">Markets We Serve</h2>
        <p className="section-subtitle">Exporting to buyers across five continents.</p>
        <div className="region-tags">
          {regions.map((r) => (<span className="region-tag" key={r}>{r}</span>))}
        </div>

        <h2 className="section-title">What Buyers Say</h2>
        <p className="section-subtitle">A few words from our long-standing partners.</p>
        <div className="testimonial-grid">
          {testimonials.map((t, i) => (
            <div className="testimonial" key={i}>
              <p className="testimonial-quote">{t.quote}</p>
              <div className="testimonial-author">{t.author}</div>
              <div className="testimonial-role">{t.role}</div>
            </div>
          ))}
        </div>

        <div className="cta-band">
          <h2>Join our global buyer network</h2>
          <p>Start with a single lot — scale as you grow.</p>
          <Link href="/catalog" className="btn btn-primary">Browse Catalog</Link>
        </div>
      </div>
    </div>
  );
}
