'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  TrendingDown,
  Target,
  FileWarning,
  Check,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { AuditLeadForm } from '@/components/AuditLeadForm';

/* ---------- Animated counter ---------- */

function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        setDisplay(
          decimals > 0
            ? latest.toFixed(decimals)
            : Math.round(latest).toLocaleString()
        );
      },
    });
    return () => controls.stop();
  }, [inView, value, decimals]);

  return (
    <span ref={ref} className="tabular-nums font-mono">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ---------- Main page ---------- */

export function FreeAuditPage() {
  // useMotionValue doesn't trigger React re-renders on change
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const auroraBg = useTransform(
    [mouseX, mouseY],
    ([x, y]) =>
      `radial-gradient(circle 500px at ${x}% ${y}%, rgba(251,191,36,0.04), transparent 40%)`
  );

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background:
          'radial-gradient(ellipse 70% 40% at 50% -5%, rgba(139,92,246,0.08) 0%, transparent 55%), linear-gradient(180deg, #0a0610 0%, #0d0d0d 100%)',
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
        mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
      }}
    >
      {/* Grid overlay — Bloomberg terminal vibe */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 70%)',
        }}
      />

      {/* Aurora glow that follows cursor */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{ background: auroraBg }}
      />

      {/* Scan-line grain */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* HERO */}
      <section className="relative pt-20 pb-10 lg:pt-28 lg:pb-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-amber-400/20 bg-amber-400/5 mb-6"
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-amber-400 opacity-60 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-amber-400" />
              </span>
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-amber-300">
                Audit · Accepting new requests
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[0.95] tracking-tight"
            >
              Get a{' '}
              <span className="relative">
                <span className="relative z-10 text-amber-400">free</span>
                <span className="absolute inset-x-0 bottom-1 h-3 bg-amber-400/15 -rotate-1 z-0" />
              </span>
              <br />
              paid ads audit
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-6 text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-2xl"
            >
              Know exactly where your ad budget is leaking. We&apos;ve managed{' '}
              <span className="text-white font-semibold">$50M+</span> in ad
              spend — we know what to look for.
            </motion.p>

            {/* Headline metric — Bloomberg-style */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 inline-flex items-baseline gap-4 px-5 py-4 rounded-xl bg-gradient-to-br from-amber-500/[0.08] to-transparent border border-amber-400/20"
            >
              <div>
                <div className="font-display text-5xl sm:text-6xl font-bold text-amber-400 leading-none">
                  <AnimatedNumber value={50} prefix="$" suffix="M+" />
                </div>
                <div className="mt-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                  Ad Spend Under Management
                </div>
              </div>
              <div className="h-14 w-px bg-white/10" />
              <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                <TrendingDown className="w-3.5 h-3.5 rotate-180" />
                <span>LIVE</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="relative py-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-2">
              · Sound familiar? ·
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              If any of this hits a nerve, we should talk.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: TrendingDown,
                title: 'Paying for clicks that never convert?',
                desc: 'Traffic is up, but the checkout numbers haven&apos;t moved in months.',
              },
              {
                icon: Target,
                title: 'ROAS keeps dropping, no clue why?',
                desc: 'Campaigns feel like a black box — guessing what changed, hoping it works.',
              },
              {
                icon: FileWarning,
                title: 'Agency reports that say a lot but mean nothing?',
                desc: 'Pretty dashboards, zero answers. Impressions aren&apos;t a strategy.',
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 hover:border-amber-400/30 transition-all"
              >
                <div className="absolute top-4 right-4 text-[10px] font-mono text-zinc-700 tracking-wider">
                  0{i + 1}
                </div>
                <div className="w-11 h-11 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 group-hover:bg-amber-500/10 group-hover:border-amber-400/30 transition-colors">
                  <card.icon className="w-5 h-5 text-red-400 group-hover:text-amber-400 transition-colors" />
                </div>
                <h3
                  className="font-display text-lg font-semibold text-white mb-2 leading-snug"
                  dangerouslySetInnerHTML={{ __html: card.title }}
                />
                <p
                  className="text-sm text-zinc-400 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: card.desc }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU GET + FORM — two-column */}
      <section className="relative py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12">
            {/* LEFT — What they get */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="lg:sticky lg:top-24 self-start"
            >
              <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-400 mb-3">
                · What you get ·
              </div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white leading-tight">
                A real audit.<br />
                Not a sales pitch.
              </h2>
              <p className="text-zinc-400 mt-4 leading-relaxed">
                No fluff template. No 30-page PDF nobody reads. A focused,
                actionable fix list delivered fast.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  {
                    title: 'Full account review',
                    desc: 'Meta, Google, YouTube — we open the hood and check everything.',
                  },
                  {
                    title: 'Attribution & tracking diagnosis',
                    desc: 'We find the gaps between what you spend and what you measure.',
                  },
                  {
                    title: 'Actionable fix list',
                    desc: 'No fluff — just exactly what to change, in priority order.',
                  },
                  {
                    title: 'Delivered within 48 hours',
                    desc: "Not 'next month'. Two days. On your desk.",
                  },
                ].map((item, i) => (
                  <motion.li
                    key={item.title}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex gap-3"
                  >
                    <div className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
                      <Check className="w-3 h-3 text-zinc-950" strokeWidth={3} />
                    </div>
                    <div>
                      <div className="text-white font-semibold">
                        {item.title}
                      </div>
                      <div className="text-sm text-zinc-500 mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>

              {/* Inline trust signals */}
              <div className="mt-10 flex items-center gap-5 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-500" />
                  <span className="text-xs text-zinc-500 font-mono">
                    48 HR DELIVERY
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-zinc-500" />
                  <span className="text-xs text-zinc-500 font-mono">
                    NDA AVAILABLE
                  </span>
                </div>
              </div>
            </motion.div>

            {/* RIGHT — Form in "terminal" container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.15 }}
              id="audit-form"
              className="relative"
            >
              {/* Glow */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-violet-500/20 via-amber-400/10 to-transparent blur-xl opacity-60 pointer-events-none" />

              <div className="relative rounded-2xl bg-[rgba(10,6,16,0.85)] backdrop-blur-xl border border-white/10 overflow-hidden">
                {/* Terminal header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/[0.02]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
                  </div>
                  <div className="text-[10px] font-mono text-zinc-600 tracking-wider">
                    DPL · AUDIT · REQUEST
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400/70 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    SECURE
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <AuditLeadForm />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRUST STATS BAR */}
      <section className="relative py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-6 text-center">
            · Track record ·
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: 50, prefix: '$', suffix: 'M+', label: 'Ad Spend Managed' },
              { value: 200, suffix: '+', label: 'Audits Delivered' },
              { value: 4.2, suffix: 'x', label: 'Avg ROAS', decimal: true },
              { value: 3, label: 'Platforms', suffix: '' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative p-6 rounded-xl bg-white/[0.02] border border-white/10 hover:border-amber-400/30 transition-colors group"
              >
                <div className="font-display text-4xl sm:text-5xl font-bold text-white leading-none">
                  {stat.decimal ? (
                    <>
                      <span className="font-mono tabular-nums">
                        {stat.value}
                      </span>
                      <span className="text-amber-400">{stat.suffix}</span>
                    </>
                  ) : (
                    <span className="text-white">
                      <AnimatedNumber
                        value={stat.value}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                      />
                    </span>
                  )}
                </div>
                <div className="mt-2 text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                  {stat.label}
                </div>
                <div className="absolute top-3 right-3 text-[9px] font-mono text-zinc-700 tracking-wider">
                  0{i + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-16 pb-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
              Stop guessing.<br />
              Start knowing.
            </h2>
            <p className="text-zinc-400 mt-4 max-w-xl mx-auto">
              The audit is free. The fixes are on you. But at least you&apos;ll
              know exactly what they are.
            </p>
            <button
              onClick={() => {
                document
                  .getElementById('audit-form')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="mt-8 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold transition-all shadow-[0_0_60px_-10px_rgba(251,191,36,0.6)]"
            >
              Request Free Audit ↑
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
