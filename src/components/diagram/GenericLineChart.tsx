/* eslint-disable @typescript-eslint/no-explicit-any */
import "./GenericLineChart.css";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export interface LineSeries<T> {
  dataKey: keyof T;
  label?: string;
  color?: string;
  strokeWidth?: number;
}

export interface GenericLineChartProps<T extends Record<string, any>> {
  data: T[];
  xKey: keyof T;
  series: LineSeries<T>[];
  xFormatter?: (value: any) => string;
  yFormatter?: (value: number) => string;
  height?: number;
  title?: string;
}

export function GenericLineChart<T extends Record<string, any>>({
  data,
  xKey,
  series,
  xFormatter = (v) => v,
  yFormatter = (v) => `${v}%`,
  height = 260,
  title,
}: GenericLineChartProps<T>) {
  return (
    <div className="generic-chart-container">
      {title && <div className="generic-chart-title">{title}</div>}

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={xKey as string}
              tickFormatter={xFormatter}
            />
            <YAxis tickFormatter={yFormatter} width={40} />

            <Tooltip
              labelFormatter={xFormatter}
              formatter={(value: any) => [yFormatter(Number(value))]}
            />

            <Legend />

            {series.map((s) => (
              <Line
                key={String(s.dataKey)}
                type="monotone"
                dataKey={s.dataKey as string}
                name={s.label ?? String(s.dataKey)}
                stroke={s.color ?? "#3b82f6"}
                strokeWidth={s.strokeWidth ?? 2}
                dot={true}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
