'use client';

import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RefreshButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function RefreshButton({
  onClick,
  isLoading = false,
  disabled = false,
  className,
}: RefreshButtonProps) {
  return (
    <Button
      variant="secondary"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn('min-w-[140px]', className)}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCw className="h-4 w-4" />
      )}
      {isLoading ? 'در حال به‌روزرسانی...' : 'به‌روزرسانی'}
    </Button>
  );
}
