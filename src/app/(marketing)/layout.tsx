import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import SupportChatbot from '@/components/ui-dp/SupportChatbot';
import { StickyCTABar } from '@/components/ui-dp/StickyCTABar';
import { ExitIntentModal } from '@/components/ui-dp/ExitIntentModal';

// Fewer stars (8), static, barely visible
const starPositions = Array.from({ length: 8 }, (_, i) => ({
  top: ((i * 23 + 11) % 100),
  left: ((i * 31 + 17) % 100),
}));

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(180deg, #0d0815 0%, #0a0610 100%)' }}
    >
      {/* Subtle cosmic glow at top */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)',
        }}
      />

      {/* Static stars — very subtle */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        {starPositions.map((star, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-white rounded-full"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>

      <SupportChatbot />
      <StickyCTABar />
      <ExitIntentModal />
    </div>
  );
}
