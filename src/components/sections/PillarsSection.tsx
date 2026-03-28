import { TrendingUp, Settings, Users, ArrowRight } from 'lucide-react';
import { Section, Container, SectionHeader, FadeUp, GlassCard, SignalPoint } from '@/components/ui-dp/AnimatedElements';
import Link from 'next/link';

const pillars = [
  {
    icon: TrendingUp,
    title: 'Performance Marketing',
    description: 'We run your paid acquisition. Meta, Google, YouTube. But only after tracking is in place—so we know what actually works.',
    features: ['Media buying', 'Creative testing', 'CAC & ROAS tracking', 'Landing pages'],
    link: '/performance-marketing',
  },
  {
    icon: Settings,
    title: 'Systems & Reporting',
    description: 'Attribution. Dashboards. CRM structure. The invisible infrastructure that lets you make decisions with confidence.',
    features: ['Attribution setup', 'Custom dashboards', 'CRM integration', 'Automation'],
    link: '/systems-reporting',
  },
  {
    icon: Users,
    title: 'Remote Workforce',
    description: 'Trained specialists who execute without constant oversight. Media buyers, analysts, creatives—all managed for you.',
    features: ['Role-specific talent', 'Pod structure', 'QA built-in', 'Weekly reporting'],
    link: '/remote-workforce',
  },
];

export function PillarsSection() {
  return (
    <Section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#110d1a] via-[#150e24] to-[#0d0815]" />

      <Container className="relative z-10">
        <SectionHeader
          eyebrow="What We Build"
          title="Three parts. One system."
          description="Marketing without tracking is gambling. Execution without ownership is chaos. We fix both."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar, index) => (
            <FadeUp key={pillar.title} delay={index * 0.1}>
              <Link href={pillar.link} className="block w-full text-left">
                <GlassCard className="p-8 h-full group cursor-pointer">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-105" style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
                    <pillar.icon className="w-7 h-7 text-violet-400" />
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-xl font-bold mb-3 text-white">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#a196b0] text-sm leading-relaxed mb-6">
                    {pillar.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {pillar.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-zinc-500 text-sm">
                        <SignalPoint size="sm" pulse={false} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="flex items-center text-violet-400 text-sm font-medium group-hover:text-violet-300 transition-colors">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </GlassCard>
              </Link>
            </FadeUp>
          ))}
        </div>
      </Container>
    </Section>
  );
}
