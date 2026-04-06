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
import { useTheme } from '../../../shared/theme/use-theme';
import { formatCurrency } from '../../../shared/utils/format';

interface MarketChartProps {
  data: PricePoint[];
  symbol: string;
}

export function MarketChart({ data, symbol }: MarketChartProps) {
  const { theme } = useTheme();
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

  return (
    <div className="chart-container">
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
              }).format(new Date(value))
            }
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: chartAxis, fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
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
            formatter={(value) => formatCurrency(Number(value ?? 0))}
            labelFormatter={(value) =>
              `${symbol} · ${new Date(value).toLocaleString('es-CL')}`
            }
            labelStyle={{
              color: theme === 'light' ? '#10233a' : '#edf3fb',
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
