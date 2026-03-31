import { Search, Eye, Rocket } from 'lucide-react';
import { Section, Container, SectionHeader, FadeUp, GlassCard } from '@/components/ui-dp/AnimatedElements';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Diagnose',
    description: 'We review your ad accounts, tracking setup, and reporting. Tell you exactly what\'s missing and what it\'s costing you.',
    detail: '1-hour call. Clear written summary. No fluff.',
  },
  {
    number: '02',
    icon: Eye,
    title: 'Fix Visibility',
    description: 'We build or repair your attribution, dashboards, and CRM structure. You finally see what\'s actually driving revenue.',
    detail: 'Most systems are live within 2 weeks.',
  },
  {
    number: '03',
    icon: Rocket,
    title: 'Scale',
    description: 'With clear numbers, we execute. Media buying, creative testing, and remote team pods—all with proper tracking in place.',
    detail: 'You know what works. We scale that.',
  },
];

export function ProcessSection() {
  return (
    <Section className="relative overflow-hidden">
      {/* Subtle cosmic depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0815] via-[#110d1a] to-[#0d0815]" />
      <div className="absolute inset-0 cosmic-glow" />

      <Container className="relative z-10">
        <SectionHeader
          eyebrow="How We Start"
          title="Three steps. No guesswork."
          description="Most teams don't need more ads. They need to know which ads actually work."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <FadeUp key={step.number} delay={index * 0.1}>
              <div className="relative h-full">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-16 left-full w-full h-px z-0"
                    style={{
                      background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.1), transparent)',
                      width: 'calc(100% - 2rem)',
                      transform: 'translateX(-1rem)',
                    }}
                  />
                )}

                <GlassCard className="p-6 lg:p-8 h-full relative z-10">
                  {/* Step number */}
                  <div className="text-5xl font-display font-bold mb-4 text-zinc-800">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
                    <step.icon className="w-6 h-6 text-violet-400" />
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#a196b0] text-sm leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Detail */}
                  <div className="text-xs font-medium px-3 py-1.5 rounded-md inline-block bg-white/[0.04] border border-white/[0.06] text-zinc-400">
                    {step.detail}
                  </div>
                </GlassCard>
              </div>
            </FadeUp>
          ))}
        </div>
      </Container>
    </Section>
  );
}
