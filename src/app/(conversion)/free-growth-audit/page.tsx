import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

// Legacy URL — permanently redirected to /free-audit
export const metadata: Metadata = {
  title: 'Free Paid Ads Audit',
  description:
    'Get a free paid ads audit from Digital Point LLC. We\'ve managed $50M+ in ad spend.',
  alternates: {
    canonical: 'https://www.digitalpointllc.com/free-audit',
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  redirect('/free-audit');
}
