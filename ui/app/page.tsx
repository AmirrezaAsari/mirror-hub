'use client';

import { useState } from 'react';
import { AboutSection } from '@/features/about/AboutSection';
import { AnalyticsSection } from '@/features/analytics/AnalyticsSection';
import { HeroSection } from '@/features/hero/HeroSection';
import { LatestUpdateSection } from '@/features/latest-update/LatestUpdateSection';
import { ServiceNavigation } from '@/features/navigation/ServiceNavigation';
import type { PackageType, ServiceTab } from '@/types';

export default function HomePage() {
  const [packageType, setPackageType] = useState<PackageType>('pip');
  const [activeTab, setActiveTab] = useState<ServiceTab>('latest');

  return (
    <main className="min-h-screen">
      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              MH
            </div>
            <div>
              <p className="font-semibold">Mirror Hub</p>
              <p className="text-xs text-muted-foreground">مانیتورینگ میرور پکیج</p>
            </div>
          </div>
        </div>
      </header>

      <HeroSection />
      <ServiceNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <LatestUpdateSection packageType={packageType} onPackageChange={setPackageType} />
      <AnalyticsSection packageType={packageType} onPackageChange={setPackageType} />
      <AboutSection />

      <footer className="border-t border-border px-4 py-8 text-center text-sm text-muted-foreground">
        ساخته شده برای توسعه‌دهندگان ایرانی — Mirror Hub
      </footer>
    </main>
  );
}
