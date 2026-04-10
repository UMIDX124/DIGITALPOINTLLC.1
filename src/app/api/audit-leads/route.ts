import { NextRequest, NextResponse } from 'next/server';
import { withDb } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { auditLeadSchema, scoreLead } from '@/lib/validations/audit-lead';
import {
  buildAdminAuditEmail,
  buildLeadAutoReply,
} from '@/lib/email-templates/audit-lead';
import { forwardLeadToCrm } from '@/lib/crm';
import { checkRateLimit } from '@/lib/ratelimit';

/* ---------- POST handler ---------- */

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (!await checkRateLimit(ip, 'audit-leads', 3, 60 * 60 * 1000)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests. Please try again in an hour.',
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = auditLeadSchema.safeParse(body);

    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        {
          success: false,
          message: first?.message || 'Invalid form data',
          errors: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const platformsStr = data.platforms.join(',');

    // Persist to DB (best-effort — SQLite may be unavailable on serverless)
    const lead = await withDb(async (prisma) =>
      prisma.lead.create({
        data: {
          name: data.name,
          email: data.email,
          company: data.company || null,
          phone: data.phone || null,
          platforms: platformsStr,
          adSpend: data.adSpend,
          currentRoas: data.currentRoas || null,
          challenge: data.challenge,
          industry: data.industry || null,
          businessType: data.businessType,
          source: data.source || null,
          notes: data.notes || null,
          status: 'New',
        },
      })
    );

    const leadId = lead?.id || `pending-${Date.now()}`;

    // Build rich email payload
    const emailPayload = {
      id: leadId,
      name: data.name,
      email: data.email,
      company: data.company || null,
      phone: data.phone || null,
      platforms: data.platforms,
      adSpend: data.adSpend,
      currentRoas: data.currentRoas || null,
      challenge: data.challenge,
      industry: data.industry || null,
      businessType: data.businessType,
      source: data.source || null,
      notes: data.notes || null,
    };

    // Fire-and-forget emails — never block the user response.
    // SMTP failures and timeouts shouldn't turn a 2s request into a 30s one.
    (async () => {
      try {
        const admin = buildAdminAuditEmail(emailPayload);
        await sendEmail({
          to: process.env.ADMIN_EMAIL || 'info@digitalpointllc.com',
          subject: admin.subject,
          html: admin.html,
          replyTo: data.email,
        });
      } catch {
        // silent — already logged inside sendEmail in dev
      }
    })();

    (async () => {
      try {
        const auto = buildLeadAutoReply(emailPayload);
        await sendEmail({
          to: data.email,
          subject: auto.subject,
          html: auto.html,
        });
      } catch {
        // silent
      }
    })();

    forwardLeadToCrm({
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      company: data.company || data.name,
      service: 'Performance Marketing',
      budget: data.adSpend,
      message: `Challenge: ${data.challenge}. Platforms: ${data.platforms.join(', ')}. ROAS: ${data.currentRoas || 'N/A'}. ${data.notes || ''}`.trim(),
      formType: 'AUDIT_REQUEST',
      qualityScore: scoreLead(data.adSpend),
    });

    return NextResponse.json({
      success: true,
      id: leadId,
      message: 'Audit request received successfully',
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('audit-leads POST error:', error);
    }
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while processing your request',
      },
      { status: 500 }
    );
  }
}

/* ---------- GET — list leads (admin only, basic-auth protected) ---------- */

function verifyAdminAuth(request: NextRequest): boolean {
  const cookie = request.cookies.get('dpl_admin_auth')?.value;
  if (!cookie) return false;
  const expected = Buffer.from(
    `${process.env.ADMIN_USER || 'admin'}:${process.env.ADMIN_PASS || 'change-me'}`
  ).toString('base64');
  return cookie === expected;
}

export async function GET(request: NextRequest) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const platform = searchParams.get('platform');
  const adSpend = searchParams.get('adSpend');
  const search = searchParams.get('search');
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const pageSize = 20;

  const where: Record<string, unknown> = {};
  if (status && status !== 'all') where.status = status;
  if (adSpend && adSpend !== 'all') where.adSpend = { contains: adSpend };
  if (platform && platform !== 'all')
    where.platforms = { contains: platform };
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { company: { contains: search } },
    ];
  }

  const result = await withDb(async (prisma) => {
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.lead.count({ where }),
    ]);
    return { leads, total };
  });

  if (!result) {
    return NextResponse.json({
      success: true,
      leads: [],
      total: 0,
      page,
      pageSize,
      message: 'Database unavailable',
    });
  }

  return NextResponse.json({
    success: true,
    leads: result.leads,
    total: result.total,
    page,
    pageSize,
  });
}
