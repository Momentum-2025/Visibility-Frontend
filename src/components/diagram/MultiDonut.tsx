import React, { useRef, useEffect } from 'react'
import Chart from 'chart.js/auto'

interface MultiDonutProps {
  values: number[] // [7d, 4w, 12w]
  color: string
  title: string
}

const MultiDonut: React.FC<MultiDonutProps> = ({ values, color, title }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    // Cleanup previous chart instance on re-render
    // let chart: Chart | null = Chart.getChart(canvasRef.current)
    let chart= Chart.getChart(canvasRef.current)
    if (chart) chart.destroy()

    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            label: '7 days',
            data: [values[0], 100 - values[0]],
            backgroundColor: [color, '#e5e7eb'],
            borderWidth: 1,
            weight: 3, // Thicker ring
          },
          {
            label: '4 weeks',
            data: [values[1], 100 - values[1]],
            backgroundColor: [color, '#e5e7eb'],
            borderWidth: 1,
            weight: 3,
          },
          {
            label: '12 weeks',
            data: [values[2], 100 - values[2]],
            backgroundColor: [color, '#e5e7eb'],
            borderWidth: 1,
            weight: 3,
          },
        ],
      },
      options: {
        cutout: '40%', // This applies globally
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function (context) {
                const labels = ['7 days', '4 weeks', '12 weeks']
                return (
                  context.dataset.label +
                  ': ' +
                  values[labels.indexOf(context.dataset.label || '')] +
                  '%'
                )
              },
            },
          },
        },
        maintainAspectRatio: false,
      },
    })

    return () => {
      if (chart) chart.destroy()
    }
  }, [values, color])

  return (
    <div style={{ width: 220, height: 220, margin: 'auto' }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>
      <canvas
        ref={canvasRef}
        style={{
          width: '220px',
          height: '220px',
          display: 'block',
          margin: '0 auto',
        }}
      />
    </div>
  )
}

export default MultiDonut
