// ============================================================
// Landing Page — Root Component
// ============================================================
import { PageLayout } from '@/components/layout/PageLayout';
import { HeroSection } from './HeroSection';
import { StatsSection, FeaturesSection } from './FeaturesSection';
import { HowItWorksSection } from './HowItWorksSection';
import { TestimonialsSection, CTASection } from './CTASection';

export default function LandingPage() {
  return (
    <PageLayout headerTransparent={false} showFooter mainClassName="bg-[#110e07]">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </PageLayout>
  );
}
