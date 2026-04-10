import { AboutPage } from '@/components/sections/AboutPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — Digital Point LLC',
  description: 'Learn about Digital Point LLC — 8+ years helping businesses scale with performance marketing, remote workforce, and operational systems.',
  openGraph: {
    title: 'About — Digital Point LLC',
    description: 'Learn about Digital Point LLC — 8+ years helping businesses scale with performance marketing, remote workforce, and operational systems.',
    url: 'https://www.digitalpointllc.com/about',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About — Digital Point LLC',
    description: 'Learn about Digital Point LLC — 8+ years helping businesses scale with performance marketing, remote workforce, and operational systems.',
  },
  alternates: { canonical: 'https://www.digitalpointllc.com/about' },
};

export default function About() {
  return <AboutPage />;
}
