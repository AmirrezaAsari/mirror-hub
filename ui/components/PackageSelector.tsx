'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { PackageType } from '@/types';

const packages: { id: PackageType; label: string; hint: string }[] = [
  { id: 'pip', label: 'pip', hint: 'Python' },
  { id: 'npm', label: 'npm', hint: 'Node.js' },
  { id: 'apt', label: 'apt', hint: 'Debian/Ubuntu' },
];

interface PackageSelectorProps {
  value: PackageType;
  onChange: (value: PackageType) => void;
  className?: string;
}

export function PackageSelector({ value, onChange, className }: PackageSelectorProps) {
  return (
    <div className={cn('inline-flex rounded-2xl border border-border bg-muted/30 p-1', className)}>
      {packages.map((pkg) => {
        const isActive = value === pkg.id;
        return (
          <button
            key={pkg.id}
            type="button"
            onClick={() => onChange(pkg.id)}
            className={cn(
              'relative rounded-xl px-5 py-2.5 text-sm font-medium transition-colors',
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {isActive && (
              <motion.span
                layoutId="package-selector"
                className="absolute inset-0 rounded-xl border border-border bg-background shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex flex-col items-center gap-0.5">
              <span>{pkg.label}</span>
              <span className="text-[10px] font-normal opacity-70">{pkg.hint}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
