/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'
import AppLayout from '../layouts/AppLayout'
import styles from './DashboardPage.module.css'
import {
  // fetchDashboardOverview,
  fetchOverallPresence,
  // fetchCitations,
  mapPresenceToChartEntries,
  type PositionEntry,
  // fetchPosition,
  mapPositionToChartEntries,
  type PresenceApiResponse,
  convertDayWiseToChartData,
} from '../services/dashboardService'

import {
  mapCitationToChartEntries,
  type CitationEntry,
  // type DashboardOverview,
} from '../services/dashboardService'
import { useProject } from '../contexts/ProjectContext'
import { PieCard } from '../components/diagram/PieCard'
import { GenericLineChart } from '../components/diagram/GenericLineChart'

const DASHBOARD_DATE_RANGE = { startDate: '2025-10-01', endDate: '2025-12-01' }

export default function DashboardPage() {
  // const [stats, setStats] = useState<DashboardOverview | null>(null)
  const [overallPresence, setOverallPresence] =
    useState<PresenceApiResponse | null>(null)
  const [citationsArray, setCitationArray] = useState<CitationEntry[]>([])
  const [positionData, setPositionData] = useState<PositionEntry[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { currentProjectId } = useProject()
  const donutsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([
      // fetchDashboardOverview(currentProjectId ?? '', DASHBOARD_DATE_RANGE),
      fetchOverallPresence(currentProjectId ?? '', DASHBOARD_DATE_RANGE),[],[]
      // fetchCitations(currentProjectId ?? '', DASHBOARD_DATE_RANGE),
      // fetchPresence(currentProjectId ?? '', DASHBOARD_DATE_RANGE),
      // fetchPosition(currentProjectId ?? '', DASHBOARD_DATE_RANGE),
    ])
      .then(
        ([
          // overview,
          competitorPresence,
          citations,
          // brandPresence,
          positionData,
        ]) => {
          if (!cancelled) {
            // setStats(overview)
            setOverallPresence(competitorPresence)
            setCitationArray(citations || [])
            // setPresenceData(brandPresence || [])
            setPositionData(positionData || [])
            if (donutsRef.current) donutsRef.current.scrollLeft = 0
          }
        },
      )
      .catch((err) => {
        setError('Could not load dashboard data. Try again later.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [currentProjectId])

  // const colors = ['#22c55e', '#ef4444', '#3b82f6', '#f59e0b', '#10b981']

  // function getRandomColor(isCompetitor: boolean): string {
  //   if (isCompetitor) return '#947f44ff'
  //   return '#438a5dff'
  // }

  return (
    <AppLayout>
      <div className={styles.dashboard}>
        <div className={styles.headerRow}>
          <h1 className={styles.heading}>Dashboard</h1>
          <button className={styles.saveBtn}>Save as PDF</button>
        </div>
        <div className={styles.filters}>
          <button className={styles.filterBtn}>Last 12 weeks</button>
          <button className={styles.filterBtn}>
            Non-branded prompts only <span className={styles.closeX}>×</span>
          </button>
          <button className={styles.filterBtn}>Add filter</button>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Prompts</div>
            <div className={styles.statValue}>{overallPresence?.ownPresenceCount ?? '--'}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Responses</div>
            <div className={styles.statValue}>{overallPresence?.totalResponses ?? '--'}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Platforms</div>
            <div className={styles.platforms}>
              {/* {platforms?.map((p, i) => ( */}
                <span key={0} className={styles.platformIcon}>
                  {/* {'logoUrl' ? ( */}
                    <img
                      src={'logoUrl'}
                      alt={'0'}
                      className={styles.platformLogo}
                    />
                  {/* ) : ( */}
                    {/* p.id */}
                  {/* )} */}
                </span>
              {/* ))} */}
            </div>
          </div>
        </div>

        <section className={styles.compPresenceSection}>
          <GenericLineChart
              title="Competitive Presence (% of total)"
              data={convertDayWiseToChartData(overallPresence?.dayWisePresence || [])}
              xKey="date"
              xFormatter={(d: any) => d}
              yFormatter={(v: any) => `${v}%`}
              series={[
                { dataKey: 'Airbyte', label: 'Airbyte', color: '#15739eff' },
                { dataKey: 'Fivetran', label: 'Fivetran', color: '#2e4c9fff' },
                { dataKey: 'Matillion', label: 'Matillion', color: '#2f8d78ff' },
                { dataKey: 'Stitch', label: 'Stitch', color: '#8b4091ff' },
                { dataKey: 'Talend', label: 'Talend', color: '#934646ff' },
              ]}
            />
        </section>

        <section className={styles.metricTiles}>
          <PieCard
            data={mapCitationToChartEntries(citationsArray)} // your array of CitationEntry
            keys={[
              'brand_percentage',
              'competitor_percentage',
              'third_party_percentage',
            ]}
            labels={['Brand', 'Competitor', 'Third Party']}
            colors={['#3f9591ff', '#c28a55ff', '#5a8ad8ff']}
            totalKey="brand_percentage"
            title="Citations"
            tooltipInfo="Percent of sources over period"
          />

          <PieCard
            data={mapPresenceToChartEntries(overallPresence?.dayWisePresence || [])} // your array of CitationEntry
            keys={['present_percentage', 'not_present']}
            labels={['Present', 'Not Present']}
            colors={['#3f9591ff', '#c28a55ff', '#5a8ad8ff']}
            totalKey="present_percentage"
            title="Presence"
            tooltipInfo="Percent of Brand Presence over period"
          />

          <PieCard
            data={mapPositionToChartEntries(positionData)} // your array of CitationEntry
            keys={['top', 'middle', 'bottom', 'missing']}
            labels={['Top', 'Middle', 'Bottom', 'Missing']}
            colors={['#3f9591ff', '#c28a55ff', '#5a8ad8ff']}
            totalKey="top"
            title="Position"
            tooltipInfo="Position of brand over period"
          />

          <PieCard
            data={mapPresenceToChartEntries(overallPresence?.dayWisePresence || [])} // your array of CitationEntry
            keys={['present_percentage', 'not_present']}
            labels={['Present', 'Not Present']}
            colors={['#3f9591ff', '#c28a55ff', '#5a8ad8ff']}
            totalKey="present_percentage"
            title="Presence"
            tooltipInfo="Percent of Brand Presence over period"
          />
        </section>
        {/* Add additional sections such as presence pie, position donut, etc. as needed */}
        {loading && <div className={styles.loading}>Loading...</div>}
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </AppLayout>
  )
}
