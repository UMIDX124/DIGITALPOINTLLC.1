import { Quote } from 'lucide-react';
import { Section, Container, SectionHeader, FadeUp, GlassCard } from '@/components/ui-dp/AnimatedElements';

const testimonials = [
  {
    quote: "They built the tracking we'd been avoiding for two years. Now I actually know where to spend.",
    author: 'Sarah Chen',
    title: 'CEO, B2B SaaS',
    metric: '+127% MRR',
    metricLabel: 'Revenue growth in 6 months',
    initials: 'SC',
  },
  {
    quote: "Got execution capacity without the hiring headaches. They own outcomes, not just tasks.",
    author: 'Marcus Thompson',
    title: 'Founder, E-commerce',
    metric: '3.1x ROAS',
    metricLabel: 'Return on ad spend',
    initials: 'MT',
  },
  {
    quote: "We went from 'no idea where leads come from' to full attribution in 3 weeks.",
    author: 'Jennifer Walsh',
    title: 'CMO, Agency',
    metric: '-41% CAC',
    metricLabel: 'Customer acquisition cost reduction',
    initials: 'JW',
  },
];

export function TestimonialsSection() {
  return (
    <Section className="relative overflow-hidden">
      <Container className="relative z-10">
        <SectionHeader
          eyebrow="Client Results"
          title="What clarity looks like."
          description="Founders who stopped guessing and started knowing."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <FadeUp key={testimonial.author} delay={index * 0.1}>
              <GlassCard className="p-6 h-full flex flex-col">
                {/* Result badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md self-start mb-5 bg-white/[0.04] border border-white/[0.06]">
                  <span className="text-sm font-bold text-white">
                    {testimonial.metric}
                  </span>
                  <span className="text-zinc-500 text-xs">{testimonial.metricLabel}</span>
                </div>

                <Quote className="w-8 h-8 text-zinc-700 mb-4" />

                <p className="text-zinc-300 text-sm leading-relaxed mb-6 flex-grow">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="pt-4 border-t border-white/[0.06] flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-zinc-400 bg-zinc-800 border border-white/[0.06]">
                    {testimonial.initials}
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">{testimonial.author}</div>
                    <div className="text-zinc-500 text-xs">{testimonial.title}</div>
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
