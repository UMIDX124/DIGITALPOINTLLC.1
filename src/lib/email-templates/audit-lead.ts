import { escapeHtml } from '@/lib/email';

interface AuditLeadData {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  platforms: string[];
  adSpend: string;
  currentRoas?: string | null;
  challenge: string;
  industry?: string | null;
  businessType: string;
  source?: string | null;
  notes?: string | null;
}

const isHighValue = (adSpend: string): boolean =>
  adSpend.includes('$20K') || adSpend.includes('$50K');

const BRAND = {
  bg: '#0a0610',
  card: '#13091f',
  border: '#1f1733',
  textHigh: '#f4f0f9',
  textMid: '#a196b0',
  textLow: '#6b6578',
  violet: '#a78bfa',
  amber: '#fbbf24',
  emerald: '#34d399',
  red: '#f87171',
};

/** Admin notification — sent to info@digitalpointllc.com or ADMIN_EMAIL */
export function buildAdminAuditEmail(lead: AuditLeadData): {
  subject: string;
  html: string;
} {
  const highValue = isHighValue(lead.adSpend);
  const platformsJoined = lead.platforms.join(', ');

  const subject = `New Audit Request: ${lead.name} — ${lead.adSpend} on ${platformsJoined}`;

  const platformBadges = lead.platforms
    .map(
      (p) => `
      <span style="display:inline-block;padding:5px 10px;margin:2px 4px 2px 0;border-radius:6px;background:rgba(167,139,250,0.15);border:1px solid rgba(167,139,250,0.3);color:${BRAND.violet};font-size:12px;font-weight:600;font-family:'SF Mono',Monaco,monospace;">${escapeHtml(p)}</span>`
    )
    .join('');

  const highValueBanner = highValue
    ? `
    <div style="background:linear-gradient(90deg,${BRAND.amber},#f59e0b);color:${BRAND.bg};padding:14px 20px;border-radius:10px;margin-bottom:20px;font-weight:700;font-size:14px;letter-spacing:0.5px;">
      🔥 HIGH VALUE LEAD — ${escapeHtml(lead.adSpend)}
    </div>`
    : '';

  const row = (label: string, value: string | null | undefined, mono = false) =>
    value
      ? `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid ${BRAND.border};color:${BRAND.textLow};font-size:11px;text-transform:uppercase;letter-spacing:1px;font-family:'SF Mono',Monaco,monospace;width:40%;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="padding:12px 0;border-bottom:1px solid ${BRAND.border};color:${BRAND.textHigh};font-size:14px;${mono ? "font-family:'SF Mono',Monaco,monospace;" : ''}">${escapeHtml(value)}</td>
      </tr>`
      : '';

  const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>New Audit Request</title></head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:640px;margin:0 auto;padding:32px 20px;">
    ${highValueBanner}

    <div style="background:${BRAND.card};border:1px solid ${BRAND.border};border-radius:16px;padding:32px;">
      <div style="font-size:10px;font-family:'SF Mono',Monaco,monospace;letter-spacing:2px;color:${BRAND.amber};text-transform:uppercase;margin-bottom:8px;">· DPL · AUDIT · REQUEST ·</div>

      <h1 style="margin:0 0 6px 0;color:${BRAND.textHigh};font-size:26px;font-weight:700;">New Audit Request</h1>
      <p style="margin:0 0 28px 0;color:${BRAND.textMid};font-size:14px;">From <strong style="color:${BRAND.textHigh};">${escapeHtml(lead.name)}</strong>${lead.company ? ` at ${escapeHtml(lead.company)}` : ''}</p>

      <!-- Ad spend HERO -->
      <div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.25);border-radius:12px;padding:24px;margin-bottom:24px;text-align:center;">
        <div style="font-size:10px;font-family:'SF Mono',Monaco,monospace;letter-spacing:1.5px;color:${BRAND.textLow};text-transform:uppercase;margin-bottom:6px;">Monthly Ad Spend</div>
        <div style="font-size:38px;font-weight:800;color:${BRAND.amber};font-family:'SF Mono',Monaco,monospace;line-height:1;">${escapeHtml(lead.adSpend)}</div>
      </div>

      <!-- Platforms -->
      <div style="margin-bottom:24px;">
        <div style="font-size:10px;font-family:'SF Mono',Monaco,monospace;letter-spacing:1.5px;color:${BRAND.textLow};text-transform:uppercase;margin-bottom:10px;">Platforms</div>
        <div>${platformBadges}</div>
      </div>

      <!-- Details table -->
      <table style="width:100%;border-collapse:collapse;">
        ${row('Name', lead.name)}
        ${row('Email', lead.email, true)}
        ${row('Company', lead.company)}
        ${row('Phone', lead.phone, true)}
        ${row('Current ROAS', lead.currentRoas)}
        ${row('Biggest Challenge', lead.challenge)}
        ${row('Business Type', lead.businessType)}
        ${row('Industry', lead.industry)}
        ${row('Source', lead.source)}
      </table>

      ${
        lead.notes
          ? `
      <div style="margin-top:24px;padding:16px;background:rgba(167,139,250,0.05);border-left:3px solid ${BRAND.violet};border-radius:0 8px 8px 0;">
        <div style="font-size:10px;font-family:'SF Mono',Monaco,monospace;letter-spacing:1.5px;color:${BRAND.textLow};text-transform:uppercase;margin-bottom:6px;">Additional Notes</div>
        <div style="color:${BRAND.textHigh};font-size:14px;line-height:1.6;">${escapeHtml(lead.notes).replace(/\n/g, '<br>')}</div>
      </div>`
          : ''
      }

      <!-- Actions -->
      <div style="margin-top:28px;padding-top:24px;border-top:1px solid ${BRAND.border};">
        <a href="mailto:${escapeHtml(lead.email)}" style="display:inline-block;padding:12px 24px;background:${BRAND.violet};color:${BRAND.bg};border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;margin-right:8px;">Reply to ${escapeHtml(lead.name.split(' ')[0])}</a>
      </div>

      <div style="margin-top:20px;color:${BRAND.textLow};font-size:11px;font-family:'SF Mono',Monaco,monospace;">
        Lead ID: ${escapeHtml(lead.id)}
      </div>
    </div>

    <div style="text-align:center;margin-top:20px;color:${BRAND.textLow};font-size:11px;">
      Digital Point LLC · Lead Capture System
    </div>
  </div>
</body></html>`;

  return { subject, html };
}

/** Lead auto-reply */
export function buildLeadAutoReply(lead: AuditLeadData): {
  subject: string;
  html: string;
} {
  const firstName = lead.name.split(' ')[0];
  const platformsText = lead.platforms.join(', ');

  const subject = `Got it ${firstName} — your free audit is being prepared`;

  const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Your Audit Request</title></head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:${BRAND.card};border:1px solid ${BRAND.border};border-radius:16px;padding:40px 32px;">

      <!-- Logo/brand -->
      <div style="text-align:center;margin-bottom:28px;">
        <div style="font-size:10px;font-family:'SF Mono',Monaco,monospace;letter-spacing:2px;color:${BRAND.amber};text-transform:uppercase;">· Digital Point LLC ·</div>
      </div>

      <!-- Success mark -->
      <div style="text-align:center;margin-bottom:24px;">
        <div style="display:inline-block;width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,${BRAND.amber},#f59e0b);line-height:64px;font-size:32px;">✓</div>
      </div>

      <h1 style="margin:0 0 12px 0;color:${BRAND.textHigh};font-size:28px;font-weight:700;text-align:center;line-height:1.2;">
        Got it, ${escapeHtml(firstName)}
      </h1>
      <p style="margin:0 0 28px 0;color:${BRAND.textMid};font-size:16px;text-align:center;">
        Your audit request is in. Here&#x27;s what happens next.
      </p>

      <!-- Summary -->
      <div style="background:rgba(167,139,250,0.05);border:1px solid rgba(167,139,250,0.2);border-radius:12px;padding:20px;margin-bottom:24px;">
        <div style="font-size:10px;font-family:'SF Mono',Monaco,monospace;letter-spacing:1.5px;color:${BRAND.textLow};text-transform:uppercase;margin-bottom:6px;">Request Summary</div>
        <div style="color:${BRAND.textHigh};font-size:14px;line-height:1.7;">
          We&#x27;ve received your audit request for <strong style="color:${BRAND.violet};">${escapeHtml(platformsText)}</strong>.
        </div>
      </div>

      <!-- Timeline -->
      <div style="margin-bottom:28px;">
        <div style="font-size:10px;font-family:'SF Mono',Monaco,monospace;letter-spacing:1.5px;color:${BRAND.amber};text-transform:uppercase;margin-bottom:14px;">What Happens Next</div>

        <div style="display:flex;align-items:flex-start;margin-bottom:14px;">
          <div style="width:24px;height:24px;border-radius:6px;background:${BRAND.violet};color:${BRAND.bg};font-weight:700;font-size:12px;text-align:center;line-height:24px;font-family:'SF Mono',Monaco,monospace;margin-right:12px;flex-shrink:0;">01</div>
          <div>
            <div style="color:${BRAND.textHigh};font-weight:600;font-size:14px;">Our team reviews your accounts</div>
            <div style="color:${BRAND.textMid};font-size:13px;margin-top:2px;">Within 48 hours. No delays, no queue.</div>
          </div>
        </div>

        <div style="display:flex;align-items:flex-start;margin-bottom:14px;">
          <div style="width:24px;height:24px;border-radius:6px;background:${BRAND.violet};color:${BRAND.bg};font-weight:700;font-size:12px;text-align:center;line-height:24px;font-family:'SF Mono',Monaco,monospace;margin-right:12px;flex-shrink:0;">02</div>
          <div>
            <div style="color:${BRAND.textHigh};font-weight:600;font-size:14px;">We prepare your access instructions</div>
            <div style="color:${BRAND.textMid};font-size:13px;margin-top:2px;">Have your ad account access ready — we&#x27;ll send you exactly what we need.</div>
          </div>
        </div>

        <div style="display:flex;align-items:flex-start;">
          <div style="width:24px;height:24px;border-radius:6px;background:${BRAND.amber};color:${BRAND.bg};font-weight:700;font-size:12px;text-align:center;line-height:24px;font-family:'SF Mono',Monaco,monospace;margin-right:12px;flex-shrink:0;">03</div>
          <div>
            <div style="color:${BRAND.textHigh};font-weight:600;font-size:14px;">You get a focused fix list</div>
            <div style="color:${BRAND.textMid};font-size:13px;margin-top:2px;">No fluff template. Just what to change, in priority order.</div>
          </div>
        </div>
      </div>

      <!-- Pitch -->
      <div style="background:linear-gradient(135deg,rgba(251,191,36,0.08),rgba(167,139,250,0.04));border:1px solid rgba(251,191,36,0.2);border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
        <p style="margin:0;color:${BRAND.textHigh};font-size:15px;line-height:1.6;font-style:italic;">
          &ldquo;We&#x27;ve managed <strong style="color:${BRAND.amber};">$50M+</strong> in ad spend across <strong style="color:${BRAND.amber};">200+</strong> accounts — we know exactly what to look for.&rdquo;
        </p>
      </div>

      <!-- WhatsApp CTA -->
      <div style="text-align:center;margin-bottom:8px;">
        <div style="font-size:11px;color:${BRAND.textLow};margin-bottom:10px;">Need to reach us urgently?</div>
        <a href="https://wa.me/15551234567" style="display:inline-block;padding:12px 22px;background:${BRAND.emerald};color:${BRAND.bg};border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Message us on WhatsApp</a>
      </div>
    </div>

    <div style="text-align:center;margin-top:24px;color:${BRAND.textLow};font-size:11px;line-height:1.6;">
      Digital Point LLC · <a href="https://www.digitalpointllc.com" style="color:${BRAND.textMid};text-decoration:none;">digitalpointllc.com</a><br>
      You received this because you requested a free audit at digitalpointllc.com/free-audit
    </div>
  </div>
</body></html>`;

  return { subject, html };
}
