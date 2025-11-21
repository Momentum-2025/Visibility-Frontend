/* eslint-disable @typescript-eslint/no-explicit-any */
// PromptsPage.tsx
import { useEffect, useState } from 'react'
import AppLayout from '../layouts/AppLayout'
import styles from './PromptsPage.module.css'
import {
  mapPresenceToChartEntries,
  type PromptDisplayData,
} from '../services/PromptDataModels'
import { fetchPromptPageData } from '../services/promptDataService'
import { useProject } from '../contexts/ProjectContext'
import PromptTagWiseTable from '../components/prompt/PromptTagWiseTable'
import { PromptObservationsTable } from '../components/prompt/PromptObservationsTable'
import { usePromptFilters } from '../hooks/useFilters'
import { FilterModal } from '../components/filter/FilterModal'
import { PieCard } from '../components/diagram/PieCard'
import { GenericLineChart } from '../components/diagram/GenericLineChart'

export default function PromptsPage() {
  const { currentProjectId } = useProject()
  const {
    filters,
    updateFilters,
    removeFilter,
    clearFilters,
    activeFiltersCount,
  } = usePromptFilters()

  // State
  const [promptData, setPromptData] = useState<PromptDisplayData>()

  const [loading, setLoading] = useState(true)
  const [obsLoading, setObsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [obsError, setObsError] = useState<string | null>(null)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  // Fetch data when filters or project changes
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([fetchPromptPageData(currentProjectId ?? '', filters)])
      .then(([promptData]) => {
        if (!cancelled) {
          setPromptData(promptData)
        }
      })
      .catch((err) => {
        setError('Could not load summary for prompts data. Try again later.')
        setObsError('Could not load prompt obs data. Try again later.')
        console.log(err)
      })
      .finally(() => {
        if (!cancelled) {
          setObsLoading(false)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [currentProjectId, filters]) // Re-fetch when filters change

  // Format date range display
  const formatDateRange = () => {
    const start = new Date(filters.startDate)
    const end = new Date(filters.endDate)
    const diffWeeks = Math.floor(
      (end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000),
    )
    return `Last ${diffWeeks} weeks`
  }

  const HandleOnClick = (tag:string) => {
    return `Last ${tag} weeks`
  }

  return (
    <AppLayout>
      <div className={styles.wrapper}>
        <div className={styles.headerRow}>
          <h1 className={styles.heading}>Prompts</h1>
          <button className={styles.saveBtn}>Export</button>
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

        {/* Stats Section */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Prompts</div>
            <div className={styles.statValue}>
              {promptData?.tagWiseData?.reduce(
                (sum, o) => sum + o.totalPrompts,
                0,
              ) ??
                promptData?.tagSpecificData.totalPrompts ??
                '--'}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Responses</div>
            <div className={styles.statValue}>
              {promptData?.tagWiseData?.reduce(
                (sum, o) => sum + o.totalResponses,
                0,
              ) ??
                promptData?.tagSpecificData?.totalResponses ??
                '--'}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Platforms</div>
            <div className={styles.platforms}>
              <span key={0} className={styles.platformIcon}>
                <img
                  src={'logoUrl'}
                  alt={'0'}
                  className={styles.platformLogo}
                />
              </span>
            </div>
          </div>
        </div>

        {promptData?.isTagSpecificData && (
          <section className={styles.metricTiles}>
            <PieCard
              data={mapPresenceToChartEntries(
                promptData?.tagSpecificData.tagWiseDayWisePresence || [],
              )} // your array of CitationEntry
              keys={['present_percentage', 'not_present']}
              labels={['Present', 'Not Present']}
              colors={['#22c55e', '#ef4444', '#3b82f6']}
              totalKey="present_percentage"
              title="Presence"
              tooltipInfo="Percent of Brand Presence over period"
            />

            <GenericLineChart
              title="Tag Presence (% of total)"
              data={promptData.tagSpecificData.tagWiseDayWisePresence.map(
                (o) => ({ date: o.date, "Own":o.ownPresencePercentage }),
              )}
              xKey="date"
              xFormatter={(d: any) => d}
              yFormatter={(v: any) => `${v}%`}
              series={[
                { dataKey: 'Own', label: 'Own', color: '#0ea5e9' },
              ]}
            />
          </section>
        )}

        {/* Data Section */}
        <section className={styles.dataSection}>
          <h2 className={styles.subHeading}>Prompts</h2>
          {obsLoading && <div>Loading...</div>}
          {obsError && <div>{obsError}</div>}
          {promptData?.isTagWiseData && (
            <PromptTagWiseTable
              data={promptData?.tagWiseData.map((o) => ({
                item: o.tag,
                totalResponses: o.totalResponses,
                totalVarietiesOfItem: o.totalPrompts,
                presenceData: o.presenceData,
              }
            ))} onRowClick={(tag:string) => {updateFilters({tags:[tag]})}}
            />
          )}
          {promptData?.seedPromptData && (
            <PromptObservationsTable
              data={promptData.seedPromptData}
              columns={['Tag', 'Data', 'Presence', 'Citation', 'Competiti']}
            />
          )}

          {promptData?.isTagSpecificData && (
            <PromptTagWiseTable
              data={
                promptData?.tagSpecificData.promptWiseAnalysis.map((o) => ({
                  item: o.promptText,
                  totalResponses: o.totalResponses,
                  totalVarietiesOfItem: 0,
                  presenceData: o.presenceData,
                })) || []
              }
              columns={['Prompt', 'Data', 'Presence', 'Citation', 'Competitors']}
            />
          )}
        </section>

        {loading && <div className={styles.loading}>Loading...</div>}
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </AppLayout>
  )
}
