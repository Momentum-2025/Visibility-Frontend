/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { PieCard } from '../components/diagram/PieCard'
import { useProject } from '../contexts/ProjectContext'
import AppLayout from '../layouts/AppLayout'
import {
  fetchCitations,
  mapCitationToChartEntries,
  type CitationResult,
} from '../services/dashboardService'
import styles from './CitationsPage.module.css'
import { usePromptFilters } from '../hooks/useFilters'
import { FilterModal } from '../components/filter/FilterModal'
import {
  convertTopDomainsToChartData,
  fetchDomainWise,
  type CitationStatsResponse,
} from '../services/citationsDataService'
import PromptDataTable from '../components/prompt/PromptTagWiseTable'
import { GenericLineChart } from '../components/diagram/GenericLineChart'

export default function CitationsPage() {
  const { currentProjectId } = useProject()
  const {
    filters,
    updateFilters,
    removeFilter,
    clearFilters,
    activeFiltersCount,
  } = usePromptFilters()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [citationsArray, setCitationArray] = useState<CitationResult | null>(
    null,
  )
  const [domainWiseData, setDomainWiseData] =
    useState<CitationStatsResponse | null>(null)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  const formatDateRange = () => {
    const start = new Date(filters.startDate)
    const end = new Date(filters.endDate)
    const diffWeeks = Math.floor(
      (end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000),
    )
    return `Last ${diffWeeks} weeks`
  }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([
      fetchCitations(currentProjectId ?? '', filters),
      fetchDomainWise(currentProjectId ?? '', filters),
    ])
      .then(([citations, domainWiseData]) => {
        if (!cancelled) {
          setCitationArray(citations || null)
          setDomainWiseData(domainWiseData || null)
        }
      })
      .catch(() => {
        setError('Could not load citations data. Try again later.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [currentProjectId, filters])

  return (
    <AppLayout>
      <div className={styles.citationsWrapper}>
        <div className={styles.headerRow}>
          <h1 className={styles.heading}>Citations</h1>
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

          {/* Filter Modal */}
          <FilterModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            currentFilters={filters}
            onApply={updateFilters}
          />
        </div>

        <section className={styles.metricTiles}>
          <PieCard
            data={mapCitationToChartEntries(citationsArray)} // your array of CitationEntry
            averagesData={
              {
                brand_percentage:
                  citationsArray?.ownBrandCitation.percentage || 0,
                competitor_percentage:
                  citationsArray?.competitorCitation.percentage || 0,
                third_party_percentage:
                  citationsArray?.thirdPartyCitation.percentage || 0,
              } as Record<string, number>
            }
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

          <GenericLineChart
            title="Top Domains (% of total)"
            data={convertTopDomainsToChartData([])}
            xKey="date"
            xFormatter={(d: any) => d}
            yFormatter={(v: any) => `${v}%`}
            series={(domainWiseData?.topCitedDomains || [])
              .map((o) => ({
                dataKey: o.domain,
                label: o.domain,
                color: stringToColor(o.domain+'123'),
                overallPercentage: o.percentage,
              }))
              .sort((a, b) => b.overallPercentage - a.overallPercentage)
              .slice(0, 5)}
          />
        </section>
        <section className={styles.dataSection}>
          <h2 className={styles.subHeading}>Domains</h2>
          <PromptDataTable
            data={
              domainWiseData?.domainWiseDetails.map((o) => ({
                itemId: o.domain,
                item: o.domain,
                totalResponses: o.totalOccurrences,
                totalVarietiesOfItem: o.promptCount,
                presenceData: [],
              })) || []
            }
            columns={[
              'Domain',
              'Data',
              'Brand Mentions',
              'Competitor Mentions',
              'Domain Topics',
            ]}
            onRowClick={() => {
              //   updateFilters({ promptId: filterKey })
            }}
          />
        </section>

        {loading && <div className={styles.loading}>Loading...</div>}
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </AppLayout>
  )
}

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
