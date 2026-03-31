'use client';

import { memo } from 'react';
import { FadeUp } from '@/components/ui-dp/AnimatedElements';

const metrics = [
  { value: '8+', label: 'Years in Market' },
  { value: '$50M+', label: 'Ad Spend Managed' },
  { value: '200+', label: 'Audits Delivered' },
  { value: '4.2x', label: 'Avg Client ROAS' },
];

const Metric = memo(function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-3xl md:text-4xl font-bold text-white mb-1">
        {value}
      </div>
      <div className="text-zinc-500 text-sm">{label}</div>
    </div>
  );
});

export function ProofBar() {
  return (
    <section
      className="relative py-12 md:py-16 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(13,8,21,0) 0%, rgba(139,92,246,0.03) 50%, rgba(13,8,21,0) 100%)',
        borderTop: '1px solid rgba(139, 92, 246, 0.06)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.06)',
      }}
    >
      <div className="container-wide relative z-10">
        <FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center">
            {metrics.map((metric) => (
              <Metric key={metric.label} value={metric.value} label={metric.label} />
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
