import type { Metadata } from 'next';
import { FreeAuditPage } from '@/components/sections/FreeAuditPage';

export const metadata: Metadata = {
  title: 'Free Paid Ads Audit',
  description:
    'Get a free paid ads audit from Digital Point LLC. We\'ve managed $50M+ in ad spend — we know exactly where your budget is leaking. Full account review delivered within 48 hours.',
  openGraph: {
    title: 'Free Paid Ads Audit — Digital Point LLC',
    description:
      'Know exactly where your ad budget is leaking. $50M+ ad spend managed, 200+ audits delivered. Free, actionable fix list within 48 hours.',
    url: 'https://www.digitalpointllc.com/free-audit',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Paid Ads Audit — Digital Point LLC',
    description:
      'Know exactly where your ad budget is leaking. Free audit delivered in 48 hours.',
  },
  alternates: {
    canonical: 'https://www.digitalpointllc.com/free-audit',
  },
};

export default function Page() {
  return <FreeAuditPage />;
}
