import { NextRequest, NextResponse } from 'next/server';
import { forwardTicketToCrm } from '@/lib/crm';

// ─── Rate limiting ──────────────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour
let cleanupCounter = 0;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  if (++cleanupCounter % 100 === 0) {
    for (const [key, val] of rateLimitMap) {
      if (now > val.resetTime) rateLimitMap.delete(key);
    }
  }
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  if (record.count >= RATE_LIMIT) return false;
  record.count++;
  return true;
}

function sanitize(input: string | undefined | null): string {
  if (!input) return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
    .slice(0, 5000);
}

const ALLOWED_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'] as const;
type Priority = (typeof ALLOWED_PRIORITIES)[number];

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    const subject = sanitize(body.subject);
    const description = sanitize(body.description);
    const name = sanitize(body.name);
    const email = sanitize(body.email);
    const priority: Priority = ALLOWED_PRIORITIES.includes(body.priority)
      ? (body.priority as Priority)
      : 'Medium';

    if (!subject || !description || !name || !email) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }

    forwardTicketToCrm({
      subject,
      description,
      priority,
      clientEmail: email,
      clientName: name,
      channel: 'WEBSITE_FORM',
    });

    return NextResponse.json({
      success: true,
      message: 'Support ticket received. Our team will respond shortly.',
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Support ticket error:', error);
    }
    return NextResponse.json(
      { success: false, message: 'An error occurred while creating your ticket' },
      { status: 500 }
    );
  }
}
