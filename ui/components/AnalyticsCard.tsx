'use client';

import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn, formatMs } from '@/lib/utils';
import type { HistoryDataPoint, MirrorAnalytics } from '@/types';

interface AnalyticsCardProps {
  mirror: MirrorAnalytics;
  history?: HistoryDataPoint[];
}

function TrendIcon({ trend }: { trend: MirrorAnalytics['trend'] }) {
  if (trend === 'up') return <ArrowUpRight className="h-4 w-4 text-success" />;
  if (trend === 'down') return <ArrowDownRight className="h-4 w-4 text-error" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

export function AnalyticsCard({ mirror, history = [] }: AnalyticsCardProps) {
  const chartData = history.map((point) => ({
    hour: new Intl.DateTimeFormat('fa-IR', { hour: '2-digit' }).format(new Date(point.hour)),
    response: point.averageResponseTimeMs,
    success: point.successRate,
  }));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>{mirror.name}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">گزارش ۲۴ ساعته</p>
        </div>
        <Badge
          variant={
            mirror.trend === 'up' ? 'success' : mirror.trend === 'down' ? 'error' : 'outline'
          }
          className="gap-1"
        >
          <TrendIcon trend={mirror.trend} />
          {mirror.trend === 'up' ? 'بهبود' : mirror.trend === 'down' ? 'افت' : 'پایدار'}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Metric label="نرخ موفقیت" value={`${mirror.successRate}%`} progress={mirror.successRate} />
          <Metric
            label="میانگین پاسخ"
            value={formatMs(mirror.averageResponseTimeMs)}
          />
          <Metric
            label="شاخص پایداری"
            value={`${mirror.consistencyIndex}%`}
            progress={mirror.consistencyIndex}
          />
          <Metric label="قطعی" value={`${mirror.downtimeMinutes} دقیقه`} />
        </div>

        {chartData.length > 0 && (
          <div className="h-36 w-full rounded-xl border border-border bg-muted/20 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" width={32} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="response"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Metric({
  label,
  value,
  progress,
}: {
  label: string;
  value: string;
  progress?: number;
}) {
  return (
    <div className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn('text-sm font-semibold')}>{value}</p>
      {progress !== undefined && <Progress value={progress} />}
    </div>
  );
}
