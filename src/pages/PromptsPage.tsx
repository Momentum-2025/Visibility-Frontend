import { useEffect, useState } from 'react'
import AppLayout from '../layouts/AppLayout'
import styles from './PromptsPage.module.css'
import {
  fetchDashboardOverview,
  // fetchCompetitorPresence,
  fetchCitations,
  type PresenceEntry,
  mapPresenceToChartEntries,
  fetchPresence,
  // type PositionEntry,
  // fetchPosition,
  // mapPositionToChartEntries,
} from '../services/dashboardService'
import { fetchPromptObservations } from '../services/promptDataService'
import type { Observation } from '../services/promptDataService'

import {
  mapCitationToChartEntries,
  type CitationEntry,
  // type CompetitorPresence,
  type DashboardOverview,
} from '../services/dashboardService'
import { useProject } from '../contexts/ProjectContext'
import { PieCard } from '../components/diagram/PieCard'
import { PromptObservationsTable } from '../components/prompt/PromptObservationsTable'

const DASHBOARD_DATE_RANGE = { startDate: '2025-07-01', endDate: '2025-09-23' }

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardOverview | null>(null)
  // const [competitivePresence, setCompetitivePresence] = useState<
  //   CompetitorPresence[]
  // >([])
  const [citationsArray, setCitationArray] = useState<CitationEntry[]>([])
  const [presenceData, setPresenceData] = useState<PresenceEntry[]>([])
  // const [ setPositionData] = useState<PositionEntry[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { currentProjectId } = useProject()
  const [observations, setObservations] = useState<Observation[]>([])
  const [obsLoading, setObsLoading] = useState<boolean>(true)
  const [obsError, setObsError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setObsLoading(true)
    setObsError(null)
    setError(null)
    Promise.all([
      fetchDashboardOverview(currentProjectId ?? '', DASHBOARD_DATE_RANGE),
      // fetchCompetitorPresence(currentProjectId ?? '', DASHBOARD_DATE_RANGE),
      fetchCitations(currentProjectId ?? '', DASHBOARD_DATE_RANGE),
      fetchPresence(currentProjectId ?? '', DASHBOARD_DATE_RANGE),
      // fetchPosition(currentProjectId ?? '', DASHBOARD_DATE_RANGE)
      fetchPromptObservations()
    ])
      .then(([overview, citations, brandPresence, prompts]) => {
        if (!cancelled) {
          setStats(overview)
          // setCompetitivePresence(competitorPresence || [])
          setCitationArray(citations || [])
          setPresenceData(brandPresence || [])
          // setPositionData(positionData || [])
          setObservations(prompts.observations)
        }
      })
      .catch((err) => {
        setError('Could not load summary for prompts data. Try again later.')
        setObsError('Could not load promt obs data. Try again later.')
        console.log(err)
      })
      .finally(() => {
        if (!cancelled) 
          setObsLoading(false)
          setLoading(false)
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
      <div className={styles.wrapper}>
        <div className={styles.headerRow}>
          <h1 className={styles.heading}>Prompts</h1>
          <button className={styles.saveBtn}>Export</button>
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
            <div className={styles.statValue}>{stats?.prompts ?? '--'}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Responses</div>
            <div className={styles.statValue}>{stats?.responses ?? '--'}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Platforms</div>
            <div className={styles.platforms}>
              {stats?.platforms?.map((p, i) => (
                <span key={i} className={styles.platformIcon}>
                  {p.logoUrl ? (
                    <img
                      src={p.logoUrl}
                      alt={p.id}
                      className={styles.platformLogo}
                    />
                  ) : (
                    p.id
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        <section className={styles.metricTiles}>
          <PieCard
            data={mapCitationToChartEntries(citationsArray)} // your array of CitationEntry
            keys={[
              'brand_percentage',
              'competitor_percentage',
              'third_party_percentage',
            ]}
            labels={['Brand', 'Competitor', 'Third Party']}
            colors={['#22c55e', '#ef4444', '#3b82f6']}
            totalKey="brand_percentage"
            title="Citations"
            tooltipInfo="Percent of sources over period"
          />

          <PieCard
            data={mapPresenceToChartEntries(presenceData)} // your array of CitationEntry
            keys={['present_percentage', 'not_present']}
            labels={['Present', 'Not Present']}
            colors={['#22c55e', '#ef4444', '#3b82f6']}
            totalKey="present_percentage"
            title="Presence"
            tooltipInfo="Percent of Brand Presence over period"
          />

        </section>

        <section className={styles.dataSection}>
          <h2 className={styles.subHeading}>Prompt Observations</h2>
          {obsLoading && <div>Loading...</div>}
          {obsError && <div>{obsError}</div>}
          <PromptObservationsTable data={observations} />
        </section>

        {/* Add additional sections such as presence pie, position donut, etc. as needed */}
        {loading && <div className={styles.loading}>Loading...</div>}
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </AppLayout>
  )
}
