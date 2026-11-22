import {
  GroundedEvidenceSection,
  HeroSection,
  LiveCopilotSection,
  ProcessingModesSection,
} from '@/components/marketing/sections/hero';
import { CTASection, HowItWorksSection } from '@/components/marketing/sections/how-it-works';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <LiveCopilotSection />
        <GroundedEvidenceSection />
        <ProcessingModesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
