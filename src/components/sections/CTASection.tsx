import { ArrowRight, Mail, Linkedin } from 'lucide-react';
import { Section, Container, FadeUp } from '@/components/ui-dp/AnimatedElements';
import Link from 'next/link';

export function CTASection() {
  return (
    <Section className="relative overflow-hidden">
      {/* Subtle top glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 40% at 50% 0%, rgba(139, 92, 246, 0.06) 0%, transparent 60%)',
        }}
      />

      <Container className="relative z-10">
        <FadeUp>
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-8 bg-white/[0.04] border border-white/[0.06]">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              <span className="text-zinc-400 text-sm">Free. No pitch. Just clarity.</span>
            </div>

            {/* Heading */}
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              Know exactly what&apos;s{' '}
              <span className="text-zinc-400">blocking your growth</span>.
            </h2>

            {/* Description */}
            <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
              One call. We review your setup, tell you what&apos;s missing, and give you a clear path forward. Even if you never work with us.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/free-growth-audit" className="w-full sm:w-auto">
                <span className="flex sm:inline-flex w-full sm:w-auto justify-center px-8 py-4 text-lg font-semibold text-white rounded-lg overflow-hidden group transition-all duration-200 hover:brightness-110 active:scale-[0.98] bg-violet-600">
                  <span className="flex items-center justify-center gap-2">
                    Get Your Growth Audit
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </span>
              </Link>
            </div>

            {/* What you get */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-12">
              {[
                'Attribution gaps identified',
                'Reporting blindspots exposed',
                'Clear next steps',
              ].map((item) => (
                <span key={item} className="flex items-center gap-2 text-zinc-500 text-sm">
                  <span className="w-1 h-1 rounded-full bg-zinc-600" />
                  {item}
                </span>
              ))}
            </div>

            {/* Contact info */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <a
                href="mailto:info@digitalpointllc.com"
                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                info@digitalpointllc.com
              </a>
              <a
                href="https://linkedin.com/company/digitalpointllc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
          </div>
        </FadeUp>
      </Container>
    </Section>
  );
}
