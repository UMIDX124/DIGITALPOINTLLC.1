'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode, memo } from 'react';
import { cn } from '@/lib/utils';

interface FadeUpProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function FadeUp({ children, className, delay = 0, duration = 0.4 }: FadeUpProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3, delay }}
      className={className}
      style={{ willChange: 'opacity' }}
    >
      {children}
    </motion.div>
  );
}

interface ScaleInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScaleIn({ children, className, delay = 0 }: ScaleInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ children, className, staggerDelay = 0.08 }: StaggerContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={staggerItem} className={className} style={{ willChange: 'transform, opacity' }}>
      {children}
    </motion.div>
  );
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

/** Cosmic card — purple-tinted dark background */
export const GlassCard = memo(function GlassCard({ children, className, hover = true, ...rest }: GlassCardProps) {
  return (
    <div
      {...rest}
      className={cn(
        'relative rounded-xl overflow-hidden',
        hover && 'card-hover',
        className
      )}
      style={{
        background: 'rgba(19, 12, 30, 0.7)',
        border: '1px solid rgba(139, 92, 246, 0.1)',
      }}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
});

interface MetricDisplayProps {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const MetricDisplay = memo(function MetricDisplay({ value, label, prefix, suffix, className }: MetricDisplayProps) {
  return (
    <div className={cn('text-center', className)}>
      <div className="font-display text-3xl md:text-4xl font-bold text-white tabular-nums">
        {prefix && <span className="text-violet-400">{prefix}</span>}
        {value}
        {suffix && <span className="text-zinc-400 text-xl">{suffix}</span>}
      </div>
      <p className="text-zinc-500 text-sm mt-1">{label}</p>
    </div>
  );
});

interface SignalPointProps {
  className?: string;
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const SignalPoint = memo(function SignalPoint({ className, size = 'md' }: SignalPointProps) {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={cn(
        'inline-block rounded-full bg-violet-500',
        sizeClasses[size],
        className
      )}
    />
  );
});

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: 'none' | 'gradient' | 'grid' | 'cosmic';
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section
      id={id}
      className={cn('section-padding relative', className)}
    >
      {children}
    </section>
  );
}

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'narrow' | 'wide' | 'full';
}

export function Container({ children, className, size = 'wide' }: ContainerProps) {
  const sizeClasses = {
    narrow: 'container-narrow',
    wide: 'container-wide',
    full: 'w-full px-4 sm:px-6 lg:px-8',
  };

  return <div className={cn(sizeClasses[size], className)}>{children}</div>;
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({ eyebrow, title, description, align = 'center', className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-12 md:mb-16', align === 'center' && 'text-center max-w-3xl mx-auto', className)}>
      {eyebrow && (
        <span
          className="text-sm font-medium uppercase tracking-wider mb-4 block"
          style={{
            background: 'linear-gradient(90deg, #c4b5fd, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
        {title}
      </h2>
      {description && (
        <p className="text-[#a196b0] text-lg mt-4 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
