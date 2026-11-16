import { HeroSection, CapabilitiesSection, PracticeSection, LiveCopilotSection, DesktopExplanationSection } from '@/components/marketing/sections/hero';
import { HowItWorksSection, BenefitsSection, TrustSection, PricingPreviewSection, FAQPreviewSection, CTASection } from '@/components/marketing/sections/how-it-works';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <CapabilitiesSection />
        <PracticeSection />
        <LiveCopilotSection />
        <DesktopExplanationSection />
        <HowItWorksSection />
        <BenefitsSection />
        <TrustSection />
        <PricingPreviewSection />
        <FAQPreviewSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
