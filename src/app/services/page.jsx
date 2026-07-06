import Link from 'next/link';
import { SITE } from '@/lib/site';
import '@/styles/static-page.css';

export const metadata = {
  title: 'Export Services',
  description:
    'End-to-end apparel export from Rashi Worldwide — private-label / OEM manufacturing, sampling, quality control, packing, freight and flexible B2B terms.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Export Services | Rashi Worldwide',
    description: 'Private-label manufacturing to worldwide logistics — full apparel export services.',
    url: '/services',
  },
};

const Icon = ({ children }) => (
  <span className="feature-icon">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  </span>
);

const services = [
  { title: 'Private Label & OEM', desc: 'Custom manufacturing to your brand specs — labels, tags, packaging and design support for bespoke apparel lines.', icon: <><path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><circle cx="7" cy="7" r="1.5" /></> },
  { title: 'Sampling & Development', desc: 'Fast pre-production samples so you approve fabric, fit and finish before committing to a bulk order.', icon: <><path d="M9 2v6l-4 8a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 16l-4-8V2" /><line x1="9" y1="2" x2="15" y2="2" /></> },
  { title: 'Quality Control', desc: 'Multi-stage inspection — inline and final AQL checks — with photo documentation on every export lot.', icon: <><path d="M9 12l2 2 4-4" /><path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" /></> },
  { title: 'Packing & Assortment', desc: 'Ratio-packed cartons, custom assortments, barcoding and export-grade packaging built for long-haul freight.', icon: <><path d="M21 8 12 3 3 8l9 5 9-5z" /><path d="M3 8v8l9 5 9-5V8" /><line x1="12" y1="13" x2="12" y2="21" /></> },
  { title: 'Freight & Logistics', desc: 'FOB, CIF and door-to-door shipping by sea or air, with consolidated documentation and customs support.', icon: <><path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7z" /><circle cx="5.5" cy="18.5" r="2" /><circle cx="18.5" cy="18.5" r="2" /></> },
  { title: 'Flexible Terms', desc: 'Transparent MOQs, tiered pricing and secure B2B payment options tailored to first-time and repeat buyers.', icon: <><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></> },
];

const steps = [
  { h: 'Enquire', p: 'Send your requirement — product, quantity and destination — via WhatsApp or the catalog.' },
  { h: 'Quote & Sample', p: 'We share pricing, lead time and a sample for approval.' },
  { h: 'Confirm & Produce', p: 'Order is confirmed and moves into production with QC at every stage.' },
  { h: 'Ship Worldwide', p: 'Packed, documented and dispatched to your port or door.' },
];

export default function ServicesPage() {
  const waLink = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    'Hello Rashi Worldwide, I would like to know more about your export services.'
  )}`;

  return (
    <div className="static-page">
      <header className="static-hero">
        <h1>Export Services</h1>
        <p className="hero-desc">
          End-to-end apparel export — from private-label manufacturing to worldwide delivery.
        </p>
      </header>

      <div className="static-body">
        <div className="feature-grid">
          {services.map((s) => (
            <div className="feature-card" key={s.title}>
              <Icon>{s.icon}</Icon>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="section-title">How We Work</h2>
        <p className="section-subtitle">Four simple steps from enquiry to delivery.</p>
        <div className="process-steps">
          {steps.map((s) => (
            <div className="process-step" key={s.h}>
              <h4>{s.h}</h4>
              <p>{s.p}</p>
            </div>
          ))}
        </div>

        <div className="stats-strip">
          <div className="stat"><div className="stat-num">10+</div><div className="stat-label">Years</div></div>
          <div className="stat"><div className="stat-num">25+</div><div className="stat-label">Countries</div></div>
          <div className="stat"><div className="stat-num">100%</div><div className="stat-label">QC Checked</div></div>
          <div className="stat"><div className="stat-num">24/7</div><div className="stat-label">Support</div></div>
        </div>

        <div className="cta-band">
          <h2>Ready to source your next lot?</h2>
          <p>Tell us what you need — we&apos;ll reply with pricing and lead times.</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Enquire on WhatsApp</a>
            <Link href="/catalog" className="btn btn-outline">Browse Catalog</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
