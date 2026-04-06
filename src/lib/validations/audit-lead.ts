import { z } from 'zod';

export const PLATFORMS = [
  'Meta Ads',
  'Google Ads',
  'YouTube Ads',
  'TikTok Ads',
  'Other',
] as const;

export const AD_SPEND_RANGES = [
  'Under $1K/mo',
  '$1K-$5K/mo',
  '$5K-$20K/mo',
  '$20K-$50K/mo',
  '$50K+/mo',
] as const;

export const CHALLENGES = [
  'High CPA',
  'Low ROAS',
  'Poor Attribution/Tracking',
  "Can't Scale Profitably",
  'Current Agency Underperforming',
  'Starting From Scratch',
] as const;

export const BUSINESS_TYPES = [
  'E-commerce / DTC',
  'SaaS / Software',
  'Local Service',
  'Lead Generation',
  'B2B',
  'Info Products / Courses',
  'Other',
] as const;

export const SOURCES = [
  'Google Search',
  'LinkedIn',
  'Referral',
  'Podcast',
  'Twitter/X',
  'Blog Article',
  'Other',
] as const;

export const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Audit Sent',
  'Converted',
  'Not Interested',
] as const;

export const auditLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  email: z.string().email('Please enter a valid email'),
  company: z.string().max(200).optional().or(z.literal('')),
  phone: z.string().max(50).optional().or(z.literal('')),
  platforms: z
    .array(z.string())
    .min(1, 'Select at least one platform')
    .max(10),
  adSpend: z.string().min(1, 'Please select an ad spend range'),
  currentRoas: z.string().max(100).optional().or(z.literal('')),
  challenge: z.string().min(1, 'Please select a challenge'),
  industry: z.string().max(200).optional().or(z.literal('')),
  businessType: z.string().min(1, 'Please select what you are selling'),
  source: z.string().max(200).optional().or(z.literal('')),
  notes: z.string().max(1000).optional().or(z.literal('')),
});

export type AuditLeadInput = z.infer<typeof auditLeadSchema>;

// Status update schema for admin dashboard
export const statusUpdateSchema = z.object({
  status: z.enum(LEAD_STATUSES),
});

/**
 * Simple 0-100 quality score heuristic used by the CRM webhook and
 * admin dashboard for high-value highlighting.
 */
export function scoreLead(adSpend: string): number {
  if (adSpend.includes('$50K')) return 90;
  if (adSpend.includes('$20K')) return 75;
  if (adSpend.includes('$5K')) return 55;
  if (adSpend.includes('$1K')) return 40;
  return 25;
}

export function isHighValue(adSpend: string): boolean {
  return adSpend.includes('$20K') || adSpend.includes('$50K');
}
