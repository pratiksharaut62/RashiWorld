import Link from 'next/link';
import { SITE } from '@/lib/site';
import '@/styles/shell.css';

const Footer = () => {
  const waMessage = encodeURIComponent('Hello Rashi Worldwide, I have a Product inquiry.');
  return (
    <footer className="app-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <span className="footer-logo">Rashi Worldwide</span>
          <p className="footer-blurb">
            Elite apparel exporter — premium manufacturing, verified export lots,
            and reliable worldwide logistics.
          </p>
        </div>
        <div className="footer-cols">
          <nav className="footer-nav" aria-label="Explore">
            <span className="footer-col-title">Explore</span>
            <Link href="/catalog">Catalog</Link>
            <Link href="/services">Export Services</Link>
            <Link href="/clients">Clients</Link>
            <Link href="/faq">FAQ</Link>
          </nav>
          <nav className="footer-nav" aria-label="Company">
            <span className="footer-col-title">Company</span>
            <Link href="/contact">Contact</Link>
            <a
              href={`https://wa.me/${SITE.whatsapp}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </nav>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Rashi Worldwide. All rights reserved.</p>
        <span className="footer-tagline">anything · anytime · anywhere</span>
      </div>
    </footer>
  );
};

export default Footer;
