'use client';

import { NavBar } from '@/components/landing/NavBar';
import { HeroSection } from '@/components/landing/HeroSection';
import { MarqueeTicker } from '@/components/landing/MarqueeTicker';
import { FeatureCards } from '@/components/landing/FeatureCards';
import { ChatPreview } from '@/components/landing/ChatPreview';
import { CTAStrip } from '@/components/landing/CTAStrip';
import { Footer } from '@/components/landing/Footer';
import { GuestGuard } from '@/components/auth/GuestGuard';

export default function LandingPage() {
  return (
    <GuestGuard>
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] font-ui antialiased">
        <NavBar />
        <main>
          <HeroSection />
          <MarqueeTicker />
          <FeatureCards />
          <ChatPreview />
          <CTAStrip />
        </main>
        <Footer />
      </div>
    </GuestGuard>
  );
}