import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/admin/auth
 * Body: { username, password }
 * Sets httpOnly cookie on success.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body || {};

    if (typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Missing credentials' },
        { status: 400 }
      );
    }

    const expectedUser = process.env.ADMIN_USER || 'admin';
    const expectedPass = process.env.ADMIN_PASS || 'change-me';

    if (username !== expectedUser || password !== expectedPass) {
      // constant-ish delay to blunt timing attacks
      await new Promise((r) => setTimeout(r, 300));
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = Buffer.from(`${expectedUser}:${expectedPass}`).toString(
      'base64'
    );

    const response = NextResponse.json({ success: true });
    response.cookies.set('dpl_admin_auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });
    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 }
    );
  }
}

/** DELETE — logout */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('dpl_admin_auth', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
  return response;
}
