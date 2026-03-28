'use client';

import Link from 'next/link';
import { BarChart3, Target, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

const resources = [
  {
    icon: BarChart3,
    title: 'The ROAS Optimization Framework',
    description: 'Our step-by-step playbook for improving return on ad spend',
    href: '/guides/cac-roas-guide',
  },
  {
    icon: Target,
    title: 'Marketing Attribution Blueprint',
    description: 'How to build attribution that actually tracks revenue',
    href: '/guides/marketing-attribution-complete-guide',
  },
  {
    icon: TrendingDown,
    title: 'CAC Reduction Checklist',
    description: '30-day action plan to reduce customer acquisition costs',
    href: '/guides/growth-systems-guide',
  },
] as const;

export function FreeResources() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-wide relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="text-sm font-medium uppercase tracking-wider mb-4 block text-violet-400">
            Free Resources
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Guides &amp; Frameworks
          </h2>
          <p className="text-zinc-400 text-lg mt-4 leading-relaxed">
            Actionable playbooks you can implement today — no email required
          </p>
        </div>

        {/* Resource cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {resources.map((resource, index) => {
            const Icon = resource.icon;

            return (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.08,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
              >
                <Link
                  href={resource.href}
                  className="group relative flex flex-col h-full rounded-xl overflow-hidden p-6 card-hover"
                  style={{
                    background: '#161618',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Icon */}
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-4 bg-white/[0.05] border border-white/[0.06]">
                      <Icon className="w-5 h-5 text-violet-400" />
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-lg font-semibold text-white mb-2 leading-snug group-hover:text-violet-400 transition-colors">
                      {resource.title}
                    </h3>

                    {/* Description */}
                    <p className="text-zinc-500 text-sm leading-relaxed flex-1 mb-5">
                      {resource.description}
                    </p>

                    {/* CTA */}
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-400 group-hover:text-violet-300 transition-colors">
                      Read Free Guide
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      >
                        &rarr;
                      </span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
