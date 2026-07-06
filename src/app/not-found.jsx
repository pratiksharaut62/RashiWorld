import Link from 'next/link';

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - var(--nav-h))',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4rem 1.5rem',
        gap: '1rem',
      }}
    >
      <span className="eyebrow">Error 404</span>
      <h1 style={{ fontSize: '2.4rem' }}>Page not found</h1>
      <p style={{ color: 'var(--muted)', maxWidth: 420 }}>
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" className="btn btn-primary">Back to Home</Link>
        <Link href="/catalog" className="btn btn-outline">Browse Catalog</Link>
      </div>
    </div>
  );
}
