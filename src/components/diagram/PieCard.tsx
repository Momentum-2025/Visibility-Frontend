/* eslint-disable @typescript-eslint/no-explicit-any */
// import React from "react";
import { Doughnut, Line } from 'react-chartjs-2'
import 'chart.js/auto'
import styles from './PieCard.module.css' // Add your CSS styling here

export function PieCard({
  data,
  averagesData = undefined,
  keys,
  labels,
  colors,
  totalKey,
  title,
  tooltipInfo,
}: PieCardProps) {
  if (data.length == 0) return

  // Compute averages as an object mapping {key: average}
  const averagesMap = averagesData ?? keys.reduce<Record<string, number>>((result, key) => {
    const sum = data.reduce((acc, entry) => acc + (Number(entry[key]) || 0), 0)
    result[key] = data.length ? Number((sum / data.length).toFixed(2)) : 0
    return result
  }, {})

  // When passing to the chart, convert to array in the desired order
  const pieData = {
    labels,
    datasets: [
      {
        data: keys.map((key) => averagesMap[key]), // array from mapping
        backgroundColor: colors,
        borderWidth: 0,
        cutout: '70%',
      },
    ],
  }

  // Pie value for the center
  // const pieTotal = keys.reduce(
  //   (sum, key) => sum + (Number(averagesMap[key]) || 0),
  //   0,
  // )

  // Miniline data (trends by totalKey over time)
  const lineData = {
  labels: data.map((entry) => entry.period),
  datasets: [
    {
      label: 'Total',
      data: data.map((entry) => Number(entry[totalKey]) || 0),
      fill: true,
      backgroundColor: (context: any) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        
        if (!chartArea) {
          return 'rgba(124, 111, 240, 0.15)';
        }
        
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, 'rgba(124, 111, 240, 1)');
        gradient.addColorStop(1, 'rgba(124, 111, 240, 0.05)');
        return gradient;
      },
      borderColor: '#7c6ff0',
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 0,
      tension: 0,
    },
  ],
};

  // Legend summary for sidebar (latest period, can include percentages, etc)
  const legendInfo = keys.map((key, i) => ({
    label: labels[i],
    color: colors[i],
    value: Number(averagesMap[key]) || 0,
  }))

  return (
    <div className={styles.PieCard}>
      <div className={styles.titleRow}>
        <span className={styles.title}>{title}</span>
        {tooltipInfo && <span className={styles.infoIcon}>i</span>}
        <span className={styles.subtitle}>(% of total)</span>
      </div>
      <div className={styles.contentRow}>
        <div className={styles.pieChart}>
          <Doughnut
            data={pieData}
            options={{
              plugins: {
                legend: { display: false },
                tooltip: { enabled: false },
              },
              cutout: '50%',
              maintainAspectRatio: false,
            }}
          />
          <div className={styles.pieInner}>
            <span className={styles.pieValue}>{averagesMap[totalKey]}%</span>
          </div>
        </div>
        <ul className={styles.legend}>
          {legendInfo.map((info) => (
            <li key={info.label} style={{ color: info.color }}>
              <span
                className={styles.legendDot}
                style={{ background: info.color }}
              />
              <span className={styles.legendLabel}>{info.label}</span>
              <span className={styles.legendValue}>{info.value}%</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.miniLineRow}>
        <div className={styles.miniLineChart}>
          <Line
            data={lineData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: { enabled: true},
                
              },
              scales: {
                x: {
                  display: false,
                  grid: { display: false },
                },
                y: {
                  display: false,
                  grid: { display: false },
                  beginAtZero: false,
                },
              },
              elements: {
                line: {
                  borderWidth: 2,
                },
              },
              interaction: {
                intersect: false,
                mode: 'index',
              },
            }}
            height={40}
          />
        </div>
        {/* <span className={styles.miniLineLabel}>Last 12 weeks</span> */}
        {/* Add trend up/down with color etc. if you want */}
      </div>
    </div>
  )
}

type ChartEntry = {
  period: string // ISO date
  [key: string]: number | string // All other props (percentages, counts, etc.)
}

type PieCardProps = {
  data: ChartEntry[] // The full series for the period
  averagesData: Record<string,number> | undefined
  keys: string[] // e.g. ['brand_percentage', 'competitor_percentage', ...]
  labels: string[] // Human-readable labels for each key
  colors: string[] // Array of HEX color strings for each key
  totalKey: string // e.g. 'total'
  title: string // Top card title, e.g. 'Presence'
  tooltipInfo?: string // Optional info text
}
