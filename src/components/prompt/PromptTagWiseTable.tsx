/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import type { TableRowData } from '../../services/PromptDataModels'
import styles from './PromptTagWiseTable.module.css'

interface TagPresenceTableProps {
  columns?: string[]
  data: TableRowData[]
  onRowClick?: (filterKey: string) => any
}

const PromptDataTable: React.FC<TagPresenceTableProps> = ({
  columns = ['Tags', 'Data', 'Presence', 'Citations', 'Competitors'],
  data,
  onRowClick,
}) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const [detailData, setDetailData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleRowClick = async (item: TableRowData, index: number) => {
    // If clicking the same row, collapse it
    if (expandedRow === index) {
      setExpandedRow(null)
      setDetailData(null)
      return
    }

    // Expand the new row
    setExpandedRow(index)
    setLoading(true)
    setDetailData(null)

    try {
      // Call the API function passed as prop
      if (onRowClick) {
        const data = await onRowClick(item.itemId)
        setDetailData(data)
      }
    } catch (error) {
      console.error('Error loading detail data:', error)
      setDetailData({ error: 'Failed to load data' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        {/* Header */}
        <div className={styles.tableHeader}>
          <div className={styles.headerCell}>{columns[0]}</div>
          <div className={styles.headerCell}>{columns[1]}</div>
          <div className={styles.headerCell}>{columns[2]}</div>
          <div className={styles.headerCell}>{columns[3]}</div>
          <div className={styles.headerCell}>{columns[4]}</div>
        </div>

        {/* Rows */}
        {data.map((item, index) => (
          <React.Fragment key={index}>
            {/* Main Row */}
            <div
              className={`${styles.tableRow} ${expandedRow === index ? styles.rowExpanded : ''}`}
              onClick={() => handleRowClick(item, index)}
            >
              {/* Tags Column */}
              <div className={styles.cell}>
                <span className={styles.tagText}>{item.item || 'No info'}</span>
              </div>

              {/* Data Column */}
              <div className={styles.cell}>
                <div className={styles.dataColumn}>
                  {item.totalVarietiesOfItem > 0 && (
                    <div className={styles.dataItem}>
                      <span className={styles.dataValue}>
                        {item.totalVarietiesOfItem}
                      </span>
                      <span className={styles.dataLabel}>prompts</span>
                    </div>
                  )}
                  <div className={styles.dataItem}>
                    <span className={styles.dataValue}>
                      {item.totalResponses}
                    </span>
                    <span className={styles.dataLabel}>responses</span>
                  </div>
                </div>
              </div>

              {/* Presence Column */}
              <div className={styles.cell}>
                <div className={styles.metricColumn}>
                  {/* <div className={styles.chartContainer}>
                    <svg width="80" height="30" className={styles.chart}>
                      <polyline
                        points="0,15 10,12 20,18 30,8 40,14 50,10 60,16 70,12 80,15"
                        fill="none"
                        stroke="#ec4899"
                        strokeWidth="2"
                      />
                    </svg>
                  </div> */}
                  <div className={styles.metricStats}>
                    <span className={styles.metricValue}>
                      {item.presenceData[0]?.presencePercentage || 32}%
                    </span>
                    <span className={styles.metricChange}>-21%</span>
                  </div>
                </div>
              </div>

              {/* Citations Column */}
              <div className={styles.cell}>
                <div className={styles.metricColumn}>
                  {/* <div className={styles.chartContainer}>
                    <svg width="80" height="30" className={styles.chart}>
                      <polyline
                        points="0,20 10,18 20,15 30,22 40,12 50,8 60,5 70,3 80,6"
                        fill="none"
                        stroke="#ec4899"
                        strokeWidth="2"
                      />
                    </svg>
                  </div> */}
                  <div className={styles.metricStats}>
                    <span className={styles.metricValue}>15%</span>
                    <span className={styles.metricChange}>-57%</span>
                  </div>
                </div>
              </div>

              {/* Competitors Column */}
              <div className={styles.cell}>
                <div className={styles.competitorsColumn}>
                  {item.presenceData.slice(0, 3).map((presence, idx) => (
                    <div key={idx} className={styles.competitorItem}>
                      <span className={styles.competitorName}>
                        {presence.companyName}
                      </span>
                      <span className={styles.competitorPercentage}>
                        ({presence.presencePercentage}%)
                      </span>
                    </div>
                  ))}
                  {item.presenceData.length > 3 && (
                    <span className={styles.competitorMore}>
                      +{item.presenceData.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Detail Row */}
            {expandedRow === index && (
              <div className={styles.detailRow}>
                <div className={styles.detailContent}>
                  {loading ? (
                    <div className={styles.loadingState}>
                      <div className={styles.spinner}></div>
                      <span>Loading details...</span>
                    </div>
                  ) : detailData?.error ? (
                    <div className={styles.errorState}>
                      <span>❌ {detailData.error}</span>
                    </div>
                  ) : detailData ? (
                    <div className={styles.detailTable}>
                      <h3 className={styles.detailTitle}>
                        Detailed Information for "{item.item || 'No tags'}"
                      </h3>
                      {/* Render your detail data here */}
                      <pre className={styles.detailData}>{detailData}</pre>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default PromptDataTable
