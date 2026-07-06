import Legal from '@/components/Legal';

export const metadata = {
  title: 'Terms of Service',
  description: 'The terms that govern use of the Rashi Worldwide website and B2B export services.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return <Legal type="terms" />;
}
