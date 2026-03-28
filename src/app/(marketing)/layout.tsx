import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import SupportChatbot from '@/components/ui-dp/SupportChatbot';
import { StickyCTABar } from '@/components/ui-dp/StickyCTABar';
import { ExitIntentModal } from '@/components/ui-dp/ExitIntentModal';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
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
