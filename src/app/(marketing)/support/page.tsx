import type { Metadata } from 'next';
import { SupportTicketForm } from '@/components/sections/SupportTicketForm';

export const metadata: Metadata = {
  title: 'Submit a Support Ticket',
  description:
    'Open a support ticket with the Digital Point LLC team. Our specialists respond within one business day.',
  alternates: {
    canonical: 'https://www.digitalpointllc.com/support',
  },
};

export default function SupportPage() {
  return (
    <main className="relative pt-32 pb-20 min-h-screen">
      <div className="container-wide max-w-3xl">
        <header className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-400/20 text-violet-300 text-sm mb-6">
            Client Support
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Submit a Support Ticket
          </h1>
          <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto">
            Existing client? Tell us what&apos;s happening and we&apos;ll route your ticket to
            the right specialist. Most issues get a same-day response.
          </p>
        </header>

        <SupportTicketForm />
      </div>
    </main>
  );
}
