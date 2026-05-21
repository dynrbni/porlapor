import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const COLORS = {
  pending: '#F59E0B',
  inProgress: '#3B82F6',
  resolved: '#10B981',
  rejected: '#EF4444',
};

export interface AdminAgencySummaryDatum {
  name: string;
  pending: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  total: number;
}

interface AdminAgencySummaryChartProps {
  data: AdminAgencySummaryDatum[];
  className?: string;
}

const formatLabel = (value: string) => (value.length > 14 ? `${value.slice(0, 14)}...` : value);

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number | string; dataKey?: string | number }>;
  label?: string | number;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  const payloadItems = (payload ?? []) as Array<{ name?: string; value?: number | string; dataKey?: string | number }>;
  if (!active || payloadItems.length === 0) return null;

  const total = payloadItems.reduce((sum, entry) => {
    const value = typeof entry.value === 'number' ? entry.value : Number(entry.value ?? 0);
    return sum + value;
  }, 0);
  const labelText = typeof label === 'string' ? label : String(label ?? '');

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 shadow-lg">
      <p className="text-sm font-semibold text-white">{labelText}</p>
      <p className="text-slate-400">Total: {total}</p>
      <div className="mt-2 space-y-1">
        {payloadItems.map((entry) => (
          <div key={String(entry.dataKey)} className="flex items-center justify-between gap-2">
            <span className="text-slate-300">{entry.name}</span>
            <span className="text-slate-100 font-semibold">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AdminAgencySummaryChart({ data, className }: AdminAgencySummaryChartProps) {
  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: COLORS.pending }} />
          Menunggu
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: COLORS.inProgress }} />
          Proses
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: COLORS.resolved }} />
          Selesai
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: COLORS.rejected }} />
          Ditolak
        </span>
      </div>
      <div className="mt-4 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <XAxis
              dataKey="name"
              tickFormatter={formatLabel}
              tick={{ fill: '#64748B', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval={0}
              height={40}
            />
            <YAxis
              tick={{ fill: '#64748B', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={28}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar name="Menunggu" dataKey="pending" stackId="a" fill={COLORS.pending} radius={[4, 4, 0, 0]} />
            <Bar name="Proses" dataKey="inProgress" stackId="a" fill={COLORS.inProgress} radius={[4, 4, 0, 0]} />
            <Bar name="Selesai" dataKey="resolved" stackId="a" fill={COLORS.resolved} radius={[4, 4, 0, 0]} />
            <Bar name="Ditolak" dataKey="rejected" stackId="a" fill={COLORS.rejected} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
