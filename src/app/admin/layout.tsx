import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'linear-gradient(180deg, #0a0610 0%, #0d0d0d 100%)',
      }}
    >
      {children}
    </div>
  );
}
