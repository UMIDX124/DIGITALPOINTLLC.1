'use client';

import Link from 'next/link';
import { Section, Container, SectionHeader, FadeUp } from '@/components/ui-dp/AnimatedElements';
import { caseStudies } from '@/lib/case-studies';
import { ArrowRight } from 'lucide-react';

export function CaseStudiesPreview() {
  return (
    <Section className="relative overflow-hidden">
      <Container className="relative z-10">
        <SectionHeader
          eyebrow="Proven Results"
          title="Client Case Studies"
          description="Real strategies, real outcomes. Here's how we help growth-stage businesses scale."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {caseStudies.map((study, idx) => (
            <FadeUp key={study.slug} delay={idx * 0.1}>
              <div
                className="rounded-xl p-6 h-full flex flex-col card-hover"
                style={{
                  background: '#161618',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                {/* Industry tag */}
                <p className="text-zinc-600 text-xs uppercase tracking-wider mb-3">
                  {study.industry}
                </p>

                {/* Title */}
                <h3 className="font-display text-lg font-bold text-white mb-4">
                  {study.title}
                </h3>

                {/* Highlight metric */}
                <div
                  className="rounded-lg p-4 text-center mb-4 bg-white/[0.03] border border-white/[0.06]"
                >
                  <p className="font-display text-3xl font-bold text-white">
                    {study.highlightMetric}
                  </p>
                  <p className="text-zinc-500 text-xs mt-1">
                    {study.highlightLabel}
                  </p>
                </div>

                {/* Key results */}
                <div className="space-y-2 flex-1">
                  {study.results.map((r) => (
                    <div
                      key={r.label}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-zinc-500">{r.label}</span>
                      <span className="font-medium text-violet-400">
                        {r.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* CTA link */}
        <FadeUp delay={0.3}>
          <div className="text-center mt-10">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 font-medium transition-colors"
            >
              View All Case Studies
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeUp>
      </Container>
    </Section>
  );
}
