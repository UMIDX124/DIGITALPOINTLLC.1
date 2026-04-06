'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Target,
  Building2,
  User,
  Sparkles,
} from 'lucide-react';
import {
  auditLeadSchema,
  PLATFORMS,
  AD_SPEND_RANGES,
  CHALLENGES,
  BUSINESS_TYPES,
  SOURCES,
  type AuditLeadInput,
} from '@/lib/validations/audit-lead';

const STEP_FIELDS: Record<number, (keyof AuditLeadInput)[]> = {
  1: ['name', 'email', 'company', 'phone'],
  2: ['platforms', 'adSpend', 'currentRoas', 'challenge'],
  3: ['industry', 'businessType', 'source', 'notes'],
};

const STORAGE_KEY = 'dpl_audit_lead_draft';
const TOTAL_STEPS = 3;

const stepMeta = [
  { num: 1, label: 'About You', icon: User },
  { num: 2, label: 'Your Ad Accounts', icon: Target },
  { num: 3, label: 'Your Business', icon: Building2 },
];

const defaultValues: AuditLeadInput = {
  name: '',
  email: '',
  company: '',
  phone: '',
  platforms: [],
  adSpend: '',
  currentRoas: '',
  challenge: '',
  industry: '',
  businessType: '',
  source: '',
  notes: '',
};

export function AuditLeadForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AuditLeadInput>({
    defaultValues,
    mode: 'onBlur',
    resolver: zodResolver(auditLeadSchema),
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    getValues,
    formState: { errors },
    reset,
  } = form;

  // Restore draft from sessionStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          Object.entries(parsed).forEach(([key, value]) => {
            if (key in defaultValues) {
              setValue(key as keyof AuditLeadInput, value as never);
            }
          });
        }
      }
    } catch {
      // ignore corrupt storage
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist draft as user types (debounced via watch subscription)
  useEffect(() => {
    const sub = watch((values) => {
      if (typeof window === 'undefined') return;
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      } catch {
        // ignore quota errors
      }
    });
    return () => sub.unsubscribe();
  }, [watch]);

  const nextStep = useCallback(async () => {
    const fields = STEP_FIELDS[step] || [];
    const valid = await trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }, [step, trigger]);

  const prevStep = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  const onSubmit = async (data: AuditLeadInput) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/audit-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.success) {
        setSubmitError(
          json.message || 'Something went wrong. Please try again.'
        );
        return;
      }

      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      setSubmitted(true);
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercent = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  if (submitted) {
    return <SuccessScreen name={getValues('name') || ''} onReset={() => {
      reset(defaultValues);
      setSubmitted(false);
      setStep(1);
    }} />;
  }

  return (
    <div className="w-full">
      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {stepMeta.map((s, idx) => {
            const active = step === s.num;
            const complete = step > s.num;
            const Icon = s.icon;
            return (
              <div key={s.num} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-300 shrink-0 ${
                      complete
                        ? 'bg-amber-400 border-amber-400 text-zinc-950'
                        : active
                        ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                        : 'bg-white/[0.02] border-white/10 text-zinc-600'
                    }`}
                  >
                    {complete ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-mono uppercase tracking-wider whitespace-nowrap ${
                      active
                        ? 'text-violet-300'
                        : complete
                        ? 'text-amber-400'
                        : 'text-zinc-600'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < stepMeta.length - 1 && (
                  <div className="flex-1 h-px mx-2 sm:mx-4 -mt-5 bg-white/[0.06] relative overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-amber-400"
                      initial={{ width: 0 }}
                      animate={{ width: step > s.num ? '100%' : '0%' }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="h-[3px] bg-white/[0.04] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-amber-400"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          <span>Step {step} / {TOTAL_STEPS}</span>
          <span>{Math.round(progressPercent)}% complete</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <motion.div
          key={`step-${step}`}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-5"
        >
          {step === 1 && (
            <div className="space-y-5">
              <StepHeader
                eyebrow="01 · About You"
                title="Who are we auditing for?"
                description="Basic intro so we know who we're talking to."
              />

              <FormField
                label="Full Name"
                required
                error={errors.name?.message}
                htmlFor="name"
              >
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  {...register('name')}
                  className={inputClass(!!errors.name)}
                />
              </FormField>

              <FormField
                label="Email"
                required
                error={errors.email?.message}
                htmlFor="email"
              >
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  {...register('email')}
                  className={inputClass(!!errors.email)}
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  label="Company / Brand"
                  error={errors.company?.message}
                  htmlFor="company"
                >
                  <input
                    id="company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Acme Co"
                    {...register('company')}
                    className={inputClass(!!errors.company)}
                  />
                </FormField>

                <FormField
                  label="Phone / WhatsApp"
                  error={errors.phone?.message}
                  htmlFor="phone"
                >
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+1 555 123 4567"
                    {...register('phone')}
                    className={inputClass(!!errors.phone)}
                  />
                </FormField>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <StepHeader
                eyebrow="02 · Ad Accounts"
                title="Tell us about your ad spend"
                description="Pick everything you're running right now."
              />

              <FormField
                label="Platforms"
                required
                error={errors.platforms?.message}
              >
                <Controller
                  control={control}
                  name="platforms"
                  render={({ field }) => (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {PLATFORMS.map((p) => {
                        const selected = field.value?.includes(p);
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => {
                              const next = selected
                                ? field.value.filter((v) => v !== p)
                                : [...(field.value || []), p];
                              field.onChange(next);
                            }}
                            className={`relative px-3 py-3 rounded-lg border text-sm font-medium transition-all ${
                              selected
                                ? 'bg-violet-600/15 border-violet-400 text-violet-100 shadow-[0_0_0_1px_rgba(167,139,250,0.4)]'
                                : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:border-white/20 hover:text-white'
                            }`}
                          >
                            {selected && (
                              <motion.span
                                layoutId={`platform-check-${p}`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center"
                              >
                                <CheckCircle2 className="w-3 h-3 text-zinc-950" />
                              </motion.span>
                            )}
                            {p}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </FormField>

              <FormField
                label="Monthly Ad Spend"
                required
                error={errors.adSpend?.message}
              >
                <Controller
                  control={control}
                  name="adSpend"
                  render={({ field }) => (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {AD_SPEND_RANGES.map((range) => {
                        const selected = field.value === range;
                        const highValue =
                          range.includes('$20K') || range.includes('$50K');
                        return (
                          <button
                            key={range}
                            type="button"
                            onClick={() => field.onChange(range)}
                            className={`relative px-4 py-3.5 rounded-lg border text-left font-medium transition-all ${
                              selected
                                ? highValue
                                  ? 'bg-amber-400/10 border-amber-400 text-amber-200 shadow-[0_0_0_1px_rgba(251,191,36,0.4)]'
                                  : 'bg-violet-600/15 border-violet-400 text-violet-100 shadow-[0_0_0_1px_rgba(167,139,250,0.4)]'
                                : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:border-white/20 hover:text-white'
                            }`}
                          >
                            <span className="font-mono text-sm">{range}</span>
                            {highValue && (
                              <span className="ml-2 text-[9px] uppercase tracking-wider text-amber-400/80">
                                High Priority
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </FormField>

              <FormField
                label="Current ROAS (if known)"
                error={errors.currentRoas?.message}
                htmlFor="currentRoas"
              >
                <input
                  id="currentRoas"
                  type="text"
                  placeholder="e.g. 2.4x, or 'not sure'"
                  {...register('currentRoas')}
                  className={inputClass(!!errors.currentRoas)}
                />
              </FormField>

              <FormField
                label="Biggest Challenge"
                required
                error={errors.challenge?.message}
                htmlFor="challenge"
              >
                <select
                  id="challenge"
                  {...register('challenge')}
                  className={selectClass(!!errors.challenge)}
                >
                  <option value="">Select your biggest challenge...</option>
                  {CHALLENGES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <StepHeader
                eyebrow="03 · Your Business"
                title="Context helps us deliver sharper insights"
                description="Last step — then we'll get to work."
              />

              <FormField
                label="Industry / Niche"
                error={errors.industry?.message}
                htmlFor="industry"
              >
                <input
                  id="industry"
                  type="text"
                  placeholder="e.g. Fitness apparel, B2B SaaS..."
                  {...register('industry')}
                  className={inputClass(!!errors.industry)}
                />
              </FormField>

              <FormField
                label="What are you selling?"
                required
                error={errors.businessType?.message}
                htmlFor="businessType"
              >
                <select
                  id="businessType"
                  {...register('businessType')}
                  className={selectClass(!!errors.businessType)}
                >
                  <option value="">Select business type...</option>
                  {BUSINESS_TYPES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="How did you hear about us?"
                error={errors.source?.message}
                htmlFor="source"
              >
                <select
                  id="source"
                  {...register('source')}
                  className={selectClass(!!errors.source)}
                >
                  <option value="">Select source (optional)...</option>
                  {SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Anything else?"
                error={errors.notes?.message}
                htmlFor="notes"
                hint={`${(watch('notes') || '').length}/1000`}
              >
                <textarea
                  id="notes"
                  rows={4}
                  maxLength={1000}
                  placeholder="Context, goals, access info, anything that'll help us..."
                  {...register('notes')}
                  className={`${inputClass(!!errors.notes)} resize-none font-sans`}
                />
              </FormField>
            </div>
          )}
        </motion.div>

        {submitError && (
          <div className="mt-5 px-4 py-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-sm">
            {submitError}
          </div>
        )}

        {/* Nav Buttons */}
        <div className="mt-8 flex items-center gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              disabled={isSubmitting}
              className="px-5 py-3 rounded-lg border border-white/10 bg-white/[0.02] text-zinc-400 hover:text-white hover:border-white/20 transition-colors flex items-center gap-2 font-medium disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex-1 px-6 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors flex items-center justify-center gap-2 shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)]"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_60px_-10px_rgba(251,191,36,0.7)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Request My Free Audit
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

/* ---------- Shared presentational helpers ---------- */

function StepHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-2">
      <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-amber-400/80 mb-1.5">
        {eyebrow}
      </div>
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
        {title}
      </h2>
      <p className="text-zinc-400 text-sm mt-1.5">{description}</p>
    </div>
  );
}

function FormField({
  label,
  required,
  error,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={htmlFor}
          className="block text-xs font-mono uppercase tracking-wider text-zinc-400"
        >
          {label} {required && <span className="text-amber-400">*</span>}
        </label>
        {hint && (
          <span className="text-[10px] font-mono text-zinc-600">{hint}</span>
        )}
      </div>
      {children}
      {error && (
        <p className="text-[11px] text-red-400 font-mono mt-1">{error}</p>
      )}
    </div>
  );
}

function inputClass(hasError: boolean): string {
  return `w-full px-4 py-3 rounded-lg bg-white/[0.02] border text-white placeholder-zinc-600 font-sans text-[15px] transition-colors focus:outline-none focus:ring-0 ${
    hasError
      ? 'border-red-500/50 focus:border-red-400'
      : 'border-white/10 focus:border-violet-400'
  }`;
}

function selectClass(hasError: boolean): string {
  return `w-full px-4 py-3 rounded-lg bg-white/[0.02] border text-white font-sans text-[15px] transition-colors focus:outline-none focus:ring-0 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%20fill%3D%22none%22%20stroke%3D%22%23a78bfa%22%20stroke-width%3D%221.5%22%3E%3Cpath%20d%3D%22M3%204.5L6%207.5L9%204.5%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center] pr-10 ${
    hasError
      ? 'border-red-500/50 focus:border-red-400'
      : 'border-white/10 focus:border-violet-400'
  }`;
}

/* ---------- Success screen ---------- */

function SuccessScreen({
  name,
  onReset,
}: {
  name: string;
  onReset: () => void;
}) {
  const firstName = name.split(' ')[0] || 'there';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="text-center py-8"
    >
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: 0.15,
        }}
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-[0_0_80px_-10px_rgba(251,191,36,0.8)]"
      >
        <CheckCircle2 className="w-10 h-10 text-zinc-950" strokeWidth={2.5} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-amber-400 mb-2">
          · Audit Request Confirmed ·
        </div>
        <h2 className="font-display text-3xl font-bold text-white mb-3">
          Your audit request is in, {firstName}
        </h2>
        <p className="text-zinc-400 max-w-md mx-auto mb-8">
          We&apos;ll review your accounts and get back within{' '}
          <span className="text-amber-400 font-semibold">48 hours</span> with
          your personalized audit.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-md mx-auto mb-8"
      >
        {[
          { step: '01', label: 'We review' },
          { step: '02', label: 'We audit' },
          { step: '03', label: 'You get fixes' },
        ].map((s) => (
          <div
            key={s.step}
            className="px-3 py-3 rounded-lg bg-white/[0.02] border border-white/10"
          >
            <div className="font-mono text-[10px] text-amber-400 tracking-wider">
              {s.step}
            </div>
            <div className="text-xs text-zinc-400 mt-1">{s.label}</div>
          </div>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        onClick={onReset}
        className="text-xs font-mono uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        Submit another request →
      </motion.button>
    </motion.div>
  );
}
