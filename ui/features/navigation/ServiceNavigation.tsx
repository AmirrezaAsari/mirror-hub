'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ServiceTab } from '@/types';

interface ServiceNavigationProps {
  activeTab: ServiceTab;
  onTabChange: (tab: ServiceTab) => void;
}

export function ServiceNavigation({ activeTab, onTabChange }: ServiceNavigationProps) {
  const handleChange = (value: string) => {
    const tab = value as ServiceTab;
    onTabChange(tab);
    const targetId = tab === 'latest' ? 'latest-update' : 'analytics';
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="sticky top-0 z-20 border-b border-border/60 bg-background/80 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl justify-center">
        <Tabs value={activeTab} onValueChange={handleChange}>
          <TabsList>
            <TabsTrigger value="latest">آخرین وضعیت</TabsTrigger>
            <TabsTrigger value="analytics">گزارش ۲۴ ساعته</TabsTrigger>
          </TabsList>
          <TabsContent value="latest" />
          <TabsContent value="analytics" />
        </Tabs>
      </div>
    </section>
  );
}
