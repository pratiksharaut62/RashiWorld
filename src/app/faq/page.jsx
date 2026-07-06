import Link from 'next/link';
import { SITE } from '@/lib/site';
import '@/styles/static-page.css';

export const metadata = {
  title: 'FAQ',
  description:
    'Answers to common questions about ordering from Rashi Worldwide — MOQ, private label, sampling, shipping, payment terms and quality control.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'FAQ | Rashi Worldwide',
    description: 'Common questions about MOQ, private label, sampling, shipping and payment terms.',
    url: '/faq',
  },
};

const faqs = [
  { q: 'What is your minimum order quantity (MOQ)?', a: 'MOQ varies by product and lot. Each item lists its own MOQ on the product page. For mixed or custom orders, message us and we\'ll confirm the minimum for your specific requirement.' },
  { q: 'Do you offer private label / OEM manufacturing?', a: 'Yes. We produce to your brand specifications — including custom labels, tags, packaging and design support. Share your tech pack or reference and we\'ll quote accordingly.' },
  { q: 'Can I get a sample before placing a bulk order?', a: 'Absolutely. We provide pre-production samples so you can approve fabric, fit and finish before confirming a bulk order.' },
  { q: 'Which countries do you ship to?', a: 'We export worldwide and currently serve buyers across 25+ countries. We handle FOB, CIF and door-to-door shipping by sea or air, with full export documentation.' },
  { q: 'What are your payment terms?', a: 'We offer transparent, tiered terms depending on order size and buyer history. Details are shared with your quote. All B2B transactions are handled through secure channels.' },
  { q: 'How long does production and delivery take?', a: 'Lead times depend on quantity and customization. Typical stock lots ship quickly; custom production timelines are confirmed at the quote stage.' },
  { q: 'How do quality checks work?', a: 'Every export lot goes through multi-stage inspection — inline and final AQL checks — with photo documentation provided before dispatch.' },
  { q: 'How do I request a quote?', a: 'Browse the catalog and tap "Submit Bulk Inquiry" on any product, or message us directly on WhatsApp with your product, quantity and destination.' },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function FAQPage() {
  const waLink = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    'Hello Rashi Worldwide, I have a question about ordering.'
  )}`;

  return (
    <div className="static-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <header className="static-hero">
        <h1>Frequently Asked Questions</h1>
        <p className="hero-desc">Answers to what buyers ask us most before their first order.</p>
      </header>

      <div className="static-body">
        <div className="faq-list">
          {faqs.map((f, i) => (
            <details className="faq-item" key={i}>
              <summary>{f.q}</summary>
              <div className="faq-answer">{f.a}</div>
            </details>
          ))}
        </div>

        <div className="cta-band">
          <h2>Didn&apos;t find your answer?</h2>
          <p>Our team replies fast on WhatsApp.</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Ask on WhatsApp</a>
            <Link href="/contact" className="btn btn-outline">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
