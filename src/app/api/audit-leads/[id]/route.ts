import { NextRequest, NextResponse } from 'next/server';
import { withDb } from '@/lib/db';
import { statusUpdateSchema } from '@/lib/validations/audit-lead';

function verifyAdminAuth(request: NextRequest): boolean {
  const cookie = request.cookies.get('dpl_admin_auth')?.value;
  if (!cookie) return false;
  const expected = Buffer.from(
    `${process.env.ADMIN_USER || 'admin'}:${process.env.ADMIN_PASS || 'change-me'}`
  ).toString('base64');
  return cookie === expected;
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminAuth(request)) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Missing lead id' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parsed = statusUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message || 'Invalid status',
        },
        { status: 400 }
      );
    }

    const updated = await withDb(async (prisma) =>
      prisma.lead.update({
        where: { id },
        data: { status: parsed.data.status },
      })
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Lead not found or database unavailable' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('audit-leads PATCH error:', error);
    }
    return NextResponse.json(
      { success: false, message: 'Update failed' },
      { status: 500 }
    );
  }
}
