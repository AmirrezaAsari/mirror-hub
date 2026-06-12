'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CopyCommandButtonProps {
  command: string;
  className?: string;
}

export function CopyCommandButton({ command, className }: CopyCommandButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <code className="hidden max-w-[280px] truncate rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground lg:block">
        {command}
      </code>
      <Button variant="outline" size="sm" onClick={handleCopy} aria-label="کپی دستور">
        {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
        {copied ? 'کپی شد' : 'کپی'}
      </Button>
    </div>
  );
}
