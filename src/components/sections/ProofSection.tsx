import { Section, Container, SectionHeader, FadeUp, GlassCard } from '@/components/ui-dp/AnimatedElements';

const caseStudies = [
  {
    company: 'B2B SaaS Company',
    situation: 'Spending $45k/month on ads. No idea which channels drove demos.',
    action: 'Built full attribution stack. Connected CRM to ad platforms. Created weekly reporting cadence.',
    result: '+127% MRR in 8 months. CAC cut by 34%.',
    metric: '+127%',
    metricLabel: 'MRR Growth',
  },
  {
    company: 'E-commerce Brand',
    situation: 'ROAS hovering at 1.2x. Founder managing all campaigns personally.',
    action: 'Took over media buying. Built creative testing system. Deployed remote ad ops team.',
    result: 'ROAS jumped to 3.1x. Founder hours freed up by 20/week.',
    metric: '3.1x',
    metricLabel: 'ROAS',
  },
  {
    company: 'Marketing Agency',
    situation: 'Client reporting took 15 hours/week. Numbers never matched across platforms.',
    action: 'Built unified dashboard. Automated data pulls. Created client-ready reports.',
    result: 'Reporting time cut to 2 hours. Zero client disputes on numbers.',
    metric: '-87%',
    metricLabel: 'Reporting Time',
  },
  {
    company: 'Coaching Business',
    situation: 'High ticket sales. Leads came in but no visibility on source or quality.',
    action: 'Implemented call tracking. Built lead scoring. Connected ads to actual enrollments.',
    result: 'Cut wasted spend by $12k/month. Doubled qualified lead volume.',
    metric: '2x',
    metricLabel: 'Qualified Leads',
  },
];

export function ProofSection() {
  return (
    <Section className="relative overflow-hidden">
      <Container className="relative z-10">
        <SectionHeader
          eyebrow="Results"
          title="What happens when you can see clearly."
          description="Real problems. Real fixes. Measurable outcomes."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {caseStudies.map((study, index) => (
            <FadeUp key={study.company} delay={index * 0.1}>
              <GlassCard className="p-6 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-xs font-medium text-violet-400 px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">
                    {study.company}
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl font-bold text-white">
                      {study.metric}
                    </div>
                    <div className="text-zinc-500 text-xs">{study.metricLabel}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-zinc-600 text-xs uppercase tracking-wide mb-1">Situation</div>
                    <p className="text-zinc-300 text-sm">{study.situation}</p>
                  </div>
                  <div>
                    <div className="text-zinc-600 text-xs uppercase tracking-wide mb-1">What We Did</div>
                    <p className="text-zinc-300 text-sm">{study.action}</p>
                  </div>
                  <div>
                    <div className="text-zinc-600 text-xs uppercase tracking-wide mb-1">Result</div>
                    <p className="text-violet-400 text-sm font-medium">{study.result}</p>
                  </div>
                </div>
              </GlassCard>
            </FadeUp>
          ))}
        </div>
      </Container>
    </Section>
  );
}
