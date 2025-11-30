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
  fetchCitations,
} from '../services/dashboardService'

import {
  mapCitationToChartEntries,
  type CitationResult,
  // type DashboardOverview,
} from '../services/dashboardService'
import { useProject } from '../contexts/ProjectContext'
import { PieCard } from '../components/diagram/PieCard'
import { GenericLineChart } from '../components/diagram/GenericLineChart'
import { usePromptFilters } from '../hooks/useFilters'
import { FilterModal } from '../components/filter/FilterModal'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  // const [stats, setStats] = useState<DashboardOverview | null>(null)
  const [overallPresence, setOverallPresence] =
    useState<PresenceApiResponse | null>(null)
  const [citationsArray, setCitationArray] = useState<CitationResult | null>(null)
  const [positionData, setPositionData] = useState<PositionEntry[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { currentProjectId } = useProject()
  const donutsRef = useRef<HTMLDivElement>(null)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const {
    filters,
    updateFilters,
    removeFilter,
    clearFilters,
    activeFiltersCount,
  } = usePromptFilters()
  // Format date range display
  const formatDateRange = () => {
    const start = new Date(filters.startDate)
    const end = new Date(filters.endDate)
    const diffWeeks = Math.floor(
      (end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000),
    )
    return `Last ${diffWeeks} weeks`
  }

  const navigate = useNavigate()
  if (!currentProjectId) {
    navigate('/context?isSignup=true')
  }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([
      // fetchDashboardOverview(currentProjectId ?? '', DASHBOARD_DATE_RANGE),
      fetchOverallPresence(currentProjectId ?? '', filters),
      fetchCitations(currentProjectId ?? '', filters),
      [],
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
            setCitationArray(citations || null)
            // setPresenceData(brandPresence || [])
            setPositionData(positionData || [])
            if (donutsRef.current) donutsRef.current.scrollLeft = 0
          }
        },
      )
      .catch(() => {
        setError('Could not load dashboard data. Try again later.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [currentProjectId, filters])

  function stringToColor(input: string): string {
    let hash = 0

    for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i)
      hash |= 0 // force 32-bit int
    }

    const index = Math.abs(hash) % GRAPH_COLORS.length
    return GRAPH_COLORS[index]
  }

  const GRAPH_COLORS = [
    '#ff7300ff', // blue
    '#d1722eff', // red
    '#b57637ff', // orange
    '#9c7b49ff', // green
    '#990099', // purple
    '#0099C6', // cyan
    '#DD4477', // pink
    '#66AA00', // lime
    '#B82E2E', // dark red
    '#316395', // steel blue
    '#994499', // violet
    '#22AA99', // teal
    '#AAAA11', // olive
    '#6633CC', // indigo
    '#E67300', // deep orange
    '#8B0707', // maroon
    '#651067', // dark purple
    '#329262', // forest green
    '#5574A6', // soft blue
    '#3B3EAC', // royal blue
  ]

  // function getRandomColor(): string {
  //   const r = Math.floor(Math.random() * 156) + 50
  //   const g = Math.floor(Math.random() * 156) + 50
  //   const b = Math.floor(Math.random() * 156) + 50

  //   return `rgb(${r}, ${g}, ${b})`
  // }

  return (
    <AppLayout>
      <div className={styles.dashboard}>
        <div className={styles.headerRow}>
          <h1 className={styles.heading}>Dashboard</h1>
          <button className={styles.saveBtn}>Save as PDF</button>
        </div>
        {/* Filter Section */}
        <div className={styles.filters}>
          {/* Date Range Filter */}
          <button
            className={styles.filterBtn}
            onClick={() => setIsFilterModalOpen(true)}
          >
            {formatDateRange()}
          </button>

          {/* Branded Filter */}
          {filters.branded !== undefined && (
            <button className={styles.filterBtn}>
              {filters.branded
                ? 'Branded prompts only'
                : 'Non-branded prompts only'}
              <span
                className={styles.closeX}
                onClick={(e) => {
                  e.stopPropagation()
                  removeFilter('branded')
                }}
              >
                ×
              </span>
            </button>
          )}

          {/* Platform Filter */}
          {filters.platforms && filters.platforms.length > 0 && (
            <button className={styles.filterBtn}>
              Platforms: {filters.platforms.join(', ')}
              <span
                className={styles.closeX}
                onClick={(e) => {
                  e.stopPropagation()
                  removeFilter('platforms')
                }}
              >
                ×
              </span>
            </button>
          )}

          {/* Tags Filter */}
          {filters.tags && filters.tags.length > 0 && (
            <button className={styles.filterBtn}>
              Tags: {filters.tags.join(', ')}
              <span
                className={styles.closeX}
                onClick={(e) => {
                  e.stopPropagation()
                  removeFilter('tags')
                }}
              >
                ×
              </span>
            </button>
          )}

          {/* Add Filter Button */}
          <button
            className={styles.filterBtn}
            onClick={() => setIsFilterModalOpen(true)}
          >
            Add filter {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>

          {/* Clear All Filters */}
          {activeFiltersCount > 0 && (
            <button className={styles.clearFiltersBtn} onClick={clearFilters}>
              Clear all
            </button>
          )}
        </div>

        {/* Filter Modal */}
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          currentFilters={filters}
          onApply={updateFilters}
        />

        {/* <div className={styles.filters}>
          <button className={styles.filterBtn} onClick={() => {updateFilters({startDate:Date.now().toString()})}}>Last 12 weeks</button>
          <button className={styles.filterBtn}>
            Non-branded prompts only <span className={styles.closeX}>×</span>
          </button>
          <button className={styles.filterBtn}>Add filter</button>
        </div> */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Prompts</div>
            <div className={styles.statValue}>
              {overallPresence?.ownPresenceCount ?? '--'}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Responses</div>
            <div className={styles.statValue}>
              {overallPresence?.totalResponses ?? '--'}
            </div>
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
            data={convertDayWiseToChartData(
              overallPresence?.dayWisePresence.sort(
                (o) => o.competitorPresencePercentages.value,
              ) || [],
            )}
            xKey="date"
            xFormatter={(d: any) => d}
            yFormatter={(v: any) => `${v}%`}
            series={Object.entries(overallPresence?.competitorDetails ?? {})
              .map(([key, comp]) => ({
                dataKey: key,
                label: key,
                color: stringToColor(key),
                overallPercentage: comp.presencePercentage,
              }))
              .sort((a, b) => b.overallPercentage - a.overallPercentage)
              .slice(0, 5)}
          />
        </section>

        <section className={styles.metricTiles}>
          <PieCard
            data={mapPresenceToChartEntries(
              overallPresence?.dayWisePresence || [],
            )} // your array of CitationEntry
            keys={['present_percentage', 'not_present']}
            labels={['Present', 'Not Present']}
            colors={['#fdba74', 'rgb(102,85,155)', '#6B7280']}
            totalKey="present_percentage"
            title="Presence"
            tooltipInfo="Percent of Brand Presence over period"
          />

          <PieCard
            data={mapCitationToChartEntries(citationsArray)} // your array of CitationEntry
            keys={[
              'brand_percentage',
              'competitor_percentage',
              'third_party_percentage',
            ]}
            labels={['Brand', 'Competitor', 'Third Party']}
            colors={['#fdba74', 'rgb(102,85,155)', '#fd7474ff']}
            totalKey="brand_percentage"
            title="Citations"
            tooltipInfo="Percent of sources over period"
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
        </section>
        {/* Add additional sections such as presence pie, position donut, etc. as needed */}
        {loading && <div className={styles.loading}>Loading...</div>}
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </AppLayout>
  )
}
