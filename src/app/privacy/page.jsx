import Legal from '@/components/Legal';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How Rashi Worldwide collects, uses and protects your information.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return <Legal type="privacy" />;
}
