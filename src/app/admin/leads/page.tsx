import { cookies } from 'next/headers';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { AdminLeadsDashboard } from '@/components/admin/AdminLeadsDashboard';

export const dynamic = 'force-dynamic';

async function isAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('dpl_admin_auth')?.value;
  if (!token) return false;
  const expected = Buffer.from(
    `${process.env.ADMIN_USER || 'admin'}:${process.env.ADMIN_PASS || 'change-me'}`
  ).toString('base64');
  return token === expected;
}

export default async function AdminLeadsPage() {
  const authed = await isAuthed();

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <AdminLoginForm />
      </div>
    );
  }

  return <AdminLeadsDashboard />;
}
