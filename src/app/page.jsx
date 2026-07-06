import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import Storefront from '@/components/Storefront';
import { fetchStocks } from '@/lib/stocks';
import { fetchHeroSlides } from '@/lib/hero';
import { SITE } from '@/lib/site';
import '@/styles/storefront.css';
import '@/styles/static-page.css';

// Revalidate every 5 minutes so new stock / hero slides appear without a rebuild.
export const revalidate = 300;

export const metadata = {
  title: 'Rashi Worldwide — Premium Apparel Export',
  description:
    'Discover verified export lots from Rashi Worldwide — premium apparel manufacturing, private-label / OEM production and reliable worldwide logistics.',
  alternates: { canonical: '/' },
};

const Icon = ({ children }) => (
  <span className="feature-icon">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  </span>
);

const valueProps = [
  {
    title: 'Verified Export Lots',
    desc: 'Every lot is inspected and documented before it\'s listed — what you see is what ships.',
    icon: <><path d="M9 12l2 2 4-4" /><path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" /></>,
  },
  {
    title: 'Private Label & OEM',
    desc: 'Custom manufacturing to your brand spec — labels, tags, and packaging included.',
    icon: <><path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><circle cx="7" cy="7" r="1.5" /></>,
  },
  {
    title: 'Flexible MOQ',
    desc: 'Transparent minimums and tiered pricing for first-time and repeat bulk buyers.',
    icon: <><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></>,
  },
  {
    title: 'Worldwide Logistics',
    desc: 'FOB, CIF and door-to-door shipping with full export documentation, handled end-to-end.',
    icon: <><path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7z" /><circle cx="5.5" cy="18.5" r="2" /><circle cx="18.5" cy="18.5" r="2" /></>,
  },
];

const testimonials = [
  { quote: 'Consistent quality and honest lead times. Rashi Worldwide has become our go-to sourcing partner for seasonal lots.', author: 'Wholesale Importer', role: 'Dubai, UAE' },
  { quote: 'The sampling process saved us from costly mistakes. What we approved is exactly what we received in bulk.', author: 'Retail Buyer', role: 'London, UK' },
];

export default async function HomePage() {
  const [stocks, heroSlides] = await Promise.all([fetchStocks(), fetchHeroSlides()]);
  const waLink = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    'Hello Rashi Worldwide, I have a Product inquiry.'
  )}`;

  return (
    <>
      {/* Hero — slider fed from the admin dashboard, static fallback if empty */}
      <HeroSlider slides={heroSlides} />

      {/* Static value propositions — always render, independent of live stock */}
      <section className="value-props-section">
        <div className="static-body">
          <h2 className="section-title">Why Rashi Worldwide</h2>
          <p className="section-subtitle">Trusted apparel sourcing, built for global buyers.</p>
          <div className="feature-grid">
            {valueProps.map((v) => (
              <div className="feature-card" key={v.title}>
                <Icon>{v.icon}</Icon>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live product grid — one section of the page, not the whole page */}
      <Storefront initialStocks={stocks} />

      <div className="static-body">
        <div className="stats-strip">
          <div className="stat"><div className="stat-num">10+</div><div className="stat-label">Years</div></div>
          <div className="stat"><div className="stat-num">25+</div><div className="stat-label">Countries</div></div>
          <div className="stat"><div className="stat-num">500+</div><div className="stat-label">Orders Shipped</div></div>
          <div className="stat"><div className="stat-num">98%</div><div className="stat-label">Repeat Buyers</div></div>
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
        <p style={{ textAlign: 'center', marginTop: '-1rem', marginBottom: '2rem' }}>
          <Link href="/clients" style={{ color: 'var(--brand)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
            See more clients &amp; markets we serve →
          </Link>
        </p>

        <div className="cta-band">
          <h2>Start Sourcing Today</h2>
          <p>Tell us what you need and we&apos;ll reply with pricing and lead times.</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Enquire on WhatsApp</a>
            <Link href="/services" className="btn btn-outline">Explore Export Services</Link>
          </div>
        </div>
      </div>
    </>
  );
}
