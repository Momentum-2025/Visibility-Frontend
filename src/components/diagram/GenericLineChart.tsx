/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import styles from './GenericLineChart.module.css';

export interface LineSeries<T> {
  dataKey: keyof T;
  label?: string;
  color?: string;
  strokeWidth?: number;
  overallPercentage?: number;
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
  const maxPercentage = Math.max(...series.map(s => s.overallPercentage || 0), 100);
  const hasOverallData = series.some(s => s.overallPercentage !== undefined);

  return (
    <div className={styles.chartWrapper}>
      {title && <h5 className={styles.chartTitle}>{title}</h5>}

      <div className={styles.chartContent}>
        {data.length > 0 && <div className={styles.lineChartSection}>
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 5 }} >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
              <XAxis
                dataKey={xKey as string}
                tickFormatter={xFormatter}
                stroke="#6b7280"
                style={{ fontSize: '12px', fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={yFormatter}
                width={45}
                stroke="#6b7280"
                style={{ fontSize: '12px', fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                labelFormatter={xFormatter}
                formatter={(value: any, name: string) => [yFormatter(Number(value)), name]}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  padding: '12px',
                }}
                labelStyle={{ fontWeight: 600, marginBottom: '4px', color: '#111827' }}
              />
              {series.map((s,idx) => (
                <Line
                  key={String(s.dataKey)}
                  type="linear"
                  dataKey={s.dataKey as string}
                  name={s.label ?? String(s.dataKey)}
                  stroke={s.color ?? '#3b82f6'}
                  strokeWidth={s.strokeWidth ?? (idx <2 ? 1.5 * 2.5 : 1.5)}
                  dot={false}
                  activeDot={{
                    r: 5,
                    strokeWidth: 2,
                    stroke: '#fff',
                    fill: s.color ?? '#3b82f6',
                  }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>}

        {hasOverallData && (
          <>
            {/* <div className={styles.dividerLine} /> */}
            
            <div className={styles.barChartSection}>
              <div className={styles.barChartContainer}>
                {series.map((s, idx) => (
                  <div key={idx} className={styles.barItem}>
                    <div className={styles.barConnection}>
                      <div 
                        className={styles.connectionDot}
                        style={{ backgroundColor: s.color ?? '#3b82f6' }}
                      />
                      {/* <div 
                        className={styles.connectionLine}
                        style={{ backgroundColor: s.color ?? '#3b82f6' }}
                      /> */}
                    </div>
                    <div className={styles.barContent}>
                      <div className={styles.barLabelSection}>
                        <div 
                          className={styles.barColorIndicator}
                          style={{ backgroundColor: s.color ?? '#3b82f6' }}
                        />
                        <div className={styles.barLabel}>{s.label ?? String(s.dataKey)}</div>
                        <span className={styles.barValue}>{s.overallPercentage?.toFixed(1)}%</span>
                      </div>
                      <div className={styles.barWrapper}>
                        <div
                          className={styles.barFill}
                          style={{
                            width: `${((s.overallPercentage || 0) / maxPercentage) * 100}%`,
                            backgroundColor: s.color ?? '#3b82f6',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}