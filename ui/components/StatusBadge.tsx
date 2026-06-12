import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'default';
  pulse?: boolean;
  className?: string;
}

export function StatusBadge({
  label,
  variant = 'default',
  pulse = false,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium',
        variant === 'success' && 'border-success/20 bg-success/10 text-success',
        variant === 'warning' && 'border-warning/20 bg-warning/10 text-warning',
        variant === 'error' && 'border-error/20 bg-error/10 text-error',
        variant === 'default' && 'border-border bg-muted/50 text-muted-foreground',
        className,
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
      )}
      {label}
    </span>
  );
}
