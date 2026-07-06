import '@/styles/static-page.css';

// NOTE: Boilerplate template copy. Rashi Worldwide should have these reviewed
// and customised by legal counsel before relying on them.
const LAST_UPDATED = 'January 2026';
const CONTACT_EMAIL = 'contact@rashiworldwide.com';

const docs = {
  privacy: {
    title: 'Privacy Policy',
    intro: 'This Privacy Policy explains how Rashi Worldwide collects, uses and protects information when you use our website and B2B services.',
    sections: [
      { h: 'Information We Collect', p: 'We collect only the information you choose to share when contacting us — such as your name, business name, phone number, email and order enquiry details. We do not run a checkout, so no payment card data is collected on this site.' },
      { h: 'How We Use Information', p: 'Your information is used solely to respond to enquiries, prepare quotes, process orders and provide export-related support. We do not sell or rent your information to third parties.' },
      { h: 'Communication Channels', p: 'Enquiries are primarily handled via WhatsApp, phone and email. Messages you send through these channels are subject to the respective provider’s own privacy terms.' },
      { h: 'Cookies & Analytics', p: 'The website may use basic cookies or analytics to understand traffic and improve the experience. You can disable cookies in your browser at any time.' },
      { h: 'Data Retention', p: 'We retain enquiry and order records only as long as necessary for business, accounting and legal purposes.' },
      { h: 'Your Rights', p: 'You may request access to, correction of, or deletion of the personal information you have shared with us by contacting us directly.' },
      { h: 'Contact', p: `For any privacy questions, reach us at ${CONTACT_EMAIL}.` },
    ],
  },
  terms: {
    title: 'Terms of Service',
    intro: 'These Terms govern your use of the Rashi Worldwide website and the B2B export services described on it.',
    sections: [
      { h: 'Nature of Service', p: 'Rashi Worldwide is a business-to-business apparel exporter. Product listings, MOQs and specifications are provided for wholesale enquiry purposes and are subject to availability and confirmation.' },
      { h: 'Quotes & Orders', p: 'Prices, lead times and stock shown on this site are indicative. A binding agreement is formed only once an order is confirmed in writing between both parties, including agreed pricing, quantity and terms.' },
      { h: 'Product Information', p: 'We aim to describe products accurately, but colours, measurements and assortments may vary slightly. Samples are available on request to confirm specifications before bulk orders.' },
      { h: 'Payment & Shipping', p: 'Payment terms, incoterms (e.g. FOB/CIF) and delivery timelines are agreed per order. Shipping, customs duties and import compliance in the destination country are the buyer’s responsibility unless otherwise agreed.' },
      { h: 'Intellectual Property', p: 'All content on this website — including logos, text and imagery — is the property of Rashi Worldwide and may not be reused without permission.' },
      { h: 'Limitation of Liability', p: 'To the extent permitted by law, Rashi Worldwide is not liable for indirect or consequential losses arising from the use of this website or reliance on indicative information.' },
      { h: 'Contact', p: `Questions about these Terms can be sent to ${CONTACT_EMAIL}.` },
    ],
  },
};

const Legal = ({ type = 'privacy' }) => {
  const doc = docs[type] || docs.privacy;

  return (
    <div className="static-page">
      <header className="static-hero">
        <h1>{doc.title}</h1>
        <p className="hero-desc">{doc.intro}</p>
        <p className="legal-updated">Last updated: {LAST_UPDATED}</p>
      </header>

      <div className="static-body">
        <div className="legal-content">
          {doc.sections.map((s, i) => (
            <section key={i}>
              <h2>{s.h}</h2>
              <p>{s.p}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Legal;
