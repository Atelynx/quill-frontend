import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { PricePoint } from '../../../shared/api/types';
import { formatCurrency } from '../../../shared/utils/format';

interface MarketChartProps {
  data: PricePoint[];
  symbol: string;
  currency: 'CLP' | 'USD';
  sourceCurrency: 'CLP' | 'USD';
  rate: number;
}

export function MarketChart({ data, symbol, currency, sourceCurrency, rate }: MarketChartProps) {
  const styles = getComputedStyle(document.documentElement);
  const chartGrid =
    styles.getPropertyValue('--chart-grid').trim() || 'rgba(19, 35, 60, 0.08)';
  const chartAxis = styles.getPropertyValue('--chart-axis').trim() || '#5d7389';
  const chartLine = styles.getPropertyValue('--chart-line').trim() || '#1b7f5d';
  const tooltipBackground =
    styles.getPropertyValue('--tooltip-bg').trim() ||
    'rgba(255, 255, 255, 0.96)';
  const tooltipBorder =
    styles.getPropertyValue('--tooltip-border').trim() ||
    'rgba(16, 35, 58, 0.12)';
  const tooltipShadow =
    styles.getPropertyValue('--tooltip-shadow').trim() ||
    '0 18px 34px rgba(16, 35, 58, 0.12)';
  const tooltipText =
    'rgba(16, 35, 58, 1)';

  return (
    <div className="h-[300px] w-full rounded-[calc(var(--main-page-radius-md)-2px)] p-[0.35rem_0.25rem_0_0] [background:var(--gradient-chart)] max-[720px]:h-[220px]">
      <ResponsiveContainer height={280} width="100%">
        <LineChart data={data}>
          <CartesianGrid stroke={chartGrid} vertical={false} />
          <XAxis
            axisLine={{ stroke: chartGrid }}
            dataKey="createdAt"
            tick={{ fill: chartAxis, fontSize: 12 }}
            tickFormatter={(value) =>
              new Intl.DateTimeFormat('es-CL', {
                hour: '2-digit',
                day: '2-digit',
                month: '2-digit',
              }).format(new Date(String(value)))
            }
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: chartAxis, fontSize: 12 }}
            tickFormatter={(value) =>
              formatCurrency(Number(value), { currency, sourceCurrency, rate })
            }
            tickLine={false}
            width={80}
          />
          <Tooltip
            contentStyle={{
              background: tooltipBackground,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: '16px',
              boxShadow: tooltipShadow,
              color: chartAxis,
            }}
            cursor={{ stroke: chartGrid, strokeDasharray: '4 4' }}
            formatter={(value) =>
              formatCurrency(Number(value ?? 0), { currency, sourceCurrency, rate })
            }
            labelFormatter={(value) =>
              `${symbol} · ${new Date(String(value)).toLocaleString('es-CL')}`
            }
            labelStyle={{
              color: tooltipText,
              fontWeight: 700,
            }}
          />
          <Line
            activeDot={{
              fill: chartLine,
              r: 4,
              stroke: tooltipBackground,
              strokeWidth: 2,
            }}
            dataKey="price"
            dot={false}
            stroke={chartLine}
            strokeWidth={3.2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
