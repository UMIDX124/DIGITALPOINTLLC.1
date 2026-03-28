'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const trustChips = ['8+ Years', 'No sales call', 'Co-Founder review', 'Clear next steps'];

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center">
      {/* Gradient background — deep cosmic */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #0d0815 0%, #150e24 40%, #1a0f2e 70%, #0d0815 100%)',
        }}
      />

      {/* Single subtle nebula — very restrained */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 30% 40%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)',
        }}
      />

      {/* Top glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(139, 92, 246, 0.1) 0%, transparent 60%)',
        }}
      />

      {/* Bottom fade to background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0d0815 0%, transparent 100%)' }}
      />

      {/* Main Content */}
      <div className="relative z-10 w-full px-5 pt-28 pb-20 sm:px-6 md:pt-32 md:pb-28">
        <div className="max-w-3xl mx-auto md:mx-0 md:ml-[12%] lg:ml-[14%]">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span className="text-violet-300 text-xs sm:text-sm">For companies spending $10k-$200k/month on ads</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight"
          >
            Your ad spend works.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Your tracking doesn&apos;t.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-[#a196b0] text-lg mt-6 max-w-xl leading-relaxed"
          >
            We&apos;ve been there — staring at dashboards that don&apos;t add up, burning budget on &ldquo;trust me, it&apos;s working.&rdquo; We build the systems that show you exactly what&apos;s driving revenue and what&apos;s draining it.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mt-10"
          >
            <Link href="/free-growth-audit" className="w-full sm:w-auto">
              <span
                className="relative flex sm:inline-flex w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white rounded-xl overflow-hidden group transition-all duration-200 hover:brightness-110 active:scale-[0.98] justify-center"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Find What&apos;s Broken
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </span>
            </Link>
            <Link
              href="/results"
              className="px-8 py-4 text-lg font-medium text-white/70 rounded-xl transition-all duration-200 hover:text-white hover:bg-white/5 block sm:inline-block text-center"
              style={{ border: '1px solid rgba(139, 92, 246, 0.2)' }}
            >
              See Case Studies
            </Link>
          </motion.div>

          {/* Founder note */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="text-[#5a4f6b] text-sm mt-10 italic max-w-lg"
          >
            &ldquo;Every audit starts with me or Anwaar personally reviewing your setup. No junior associate, no AI-only report. Real eyes on your real numbers.&rdquo;
            <span className="not-italic text-violet-400 ml-2">&mdash; Faizan, Co-Founder</span>
          </motion.p>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.55 }}
            className="flex flex-wrap gap-x-6 gap-y-2 mt-8"
          >
            {trustChips.map((chip) => (
              <span
                key={chip}
                className="flex items-center gap-2 text-[#5a4f6b] text-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50" />
                {chip}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
