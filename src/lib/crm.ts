/**
 * Alpha CRM webhook forwarding.
 *
 * All form submissions on digitalpointllc.com fan out to the Alpha Command Center
 * CRM at https://fu-corp-crm.vercel.app via authenticated webhooks.
 *
 * Configure via env:
 *   CRM_WEBHOOK_URL     — base URL of the CRM (no trailing slash)
 *   CRM_WEBHOOK_SECRET  — shared secret sent in the X-Webhook-Secret header
 *   LEAD_WEBHOOK_SECRET — HMAC signing key; body is signed with HMAC-SHA256
 *                        and sent in the X-Webhook-Signature header as
 *                        `sha256=<hex>`
 */

import { createHmac } from 'node:crypto';

const CRM_BASE =
  process.env.CRM_WEBHOOK_URL?.replace(/\/$/, '') ||
  'https://fu-corp-crm.vercel.app';

const SOURCE = 'digitalpointllc.com';
const BRAND = 'DPL';

type LeadPayload = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  service?: string | null;
  budget?: string | null;
  message?: string | null;
  formType: string;
  qualityScore?: number;
  [key: string]: unknown;
};

type TicketPayload = {
  subject: string;
  description: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical' | string;
  clientEmail: string;
  clientName: string;
  channel?: string;
  [key: string]: unknown;
};

function headers(body: string): HeadersInit {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  const secret = process.env.CRM_WEBHOOK_SECRET;
  if (secret) h['X-Webhook-Secret'] = secret;

  const signingKey = process.env.LEAD_WEBHOOK_SECRET;
  if (signingKey) {
    const signature = createHmac('sha256', signingKey).update(body).digest('hex');
    h['X-Webhook-Signature'] = `sha256=${signature}`;
  }

  return h;
}

/**
 * Forward a lead to the CRM. Fire-and-forget — never blocks the caller and
 * never throws. Failures are silently swallowed (CRM is non-critical).
 */
export function forwardLeadToCrm(payload: LeadPayload): void {
  const body = JSON.stringify({
    source: SOURCE,
    brand: BRAND,
    ...payload,
  });

  fetch(`${CRM_BASE}/api/webhook/lead`, {
    method: 'POST',
    headers: headers(body),
    body,
  }).catch((err) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[CRM webhook] lead forward failed:', err);
    }
  });
}

/**
 * Forward a support ticket to the CRM. Fire-and-forget.
 */
export function forwardTicketToCrm(payload: TicketPayload): void {
  const body = JSON.stringify({
    source: SOURCE,
    brand: BRAND,
    channel: payload.channel || 'WEBSITE_FORM',
    ...payload,
  });

  fetch(`${CRM_BASE}/api/webhook/ticket`, {
    method: 'POST',
    headers: headers(body),
    body,
  }).catch((err) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[CRM webhook] ticket forward failed:', err);
    }
  });
}
