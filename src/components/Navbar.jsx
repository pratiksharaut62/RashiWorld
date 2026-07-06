'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE } from '@/lib/site';
import './Navbar.css';

const links = [
  { href: '/', label: 'Home', exact: true },
  { href: '/catalog', label: 'Catalog' },
  { href: '/services', label: 'Services' },
  { href: '/clients', label: 'Clients' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock background scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const isActive = (href, exact) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  const waLink = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    'Hello Rashi Worldwide, I have a Product inquiry.'
  )}`;

  return (
    <nav className="nav">
      <Link href="/" className="nav-brand-group" aria-label="Rashi Worldwide home">
        <div className="nav-logo">
          <img src="/logo.jpg" alt="Rashi Worldwide Logo" />
        </div>
        <span className="brand-text">Rashi Worldwide</span>
      </Link>

      {/* Desktop menu */}
      <ul className="ul">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className={isActive(l.href, l.exact) ? 'nav-link active' : 'nav-link'}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile hamburger trigger */}
      <button
        type="button"
        className={`menu-toggle ${isOpen ? 'is-open' : ''}`}
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu-panel"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile slide-in panel + backdrop */}
      <div
        className={`mobile-menu-backdrop ${isOpen ? 'is-open' : ''}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <div
        id="mobile-menu-panel"
        className={`mobile-menu-panel ${isOpen ? 'is-open' : ''}`}
        aria-hidden={!isOpen}
      >
        <ul className="mobile-menu-list">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={isActive(l.href, l.exact) ? 'mobile-nav-link active' : 'mobile-nav-link'}
                onClick={() => setIsOpen(false)}
                tabIndex={isOpen ? 0 : -1}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary mobile-menu-cta"
          onClick={() => setIsOpen(false)}
          tabIndex={isOpen ? 0 : -1}
        >
          Chat on WhatsApp
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
