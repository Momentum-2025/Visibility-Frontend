// PromptObservationsTable.tsx

import React from 'react'
import styles from './PromptObservationsTable.module.css'
import type {Observation} from '../../services/promptDataService'
import {mapObservationsToTableRows} from '../../services/promptDataService'
// import { TbStar, TbStarFilled } from 'react-icons/tb'

interface Props {
  data: Observation[] 
}

export const PromptObservationsTable: React.FC<Props> = ({ data }) => {
  // Helper: mock progress and citation visuals — replace with actual sparkline or progress as needed
  const renderPresence = (percent: number) => (
    <div className={styles.presenceBarWrapper}>
      <div className={styles.presenceBar} style={{ width: `${percent}%` }} />
    </div>
  )

   const rowData = mapObservationsToTableRows(data)
  return (
    <div className={styles.promptTableWrapper}>
      <table className={styles.promptTable}>
        <thead>
          <tr>
            <th></th>
            <th>Seed Prompt</th>
            <th>Data</th>
            <th>Presence</th>
            <th>Citations</th>
            <th>Competitors</th>
          </tr>
        </thead>
        <tbody>
          {rowData.map((row, idx) => (
            <tr key={row.id} className={styles.tableRow}>
              <td>
                <input type="checkbox" />
                {/* <button
                  className={styles.starBtn}
                  aria-label="Favorite"
                  tabIndex={-1}
                >
                  {obs.seed_prompt.favorite ? (
                    <TbStarFilled className={styles.starIconFilled} />
                  ) : (
                    <TbStar className={styles.starIcon} />
                  )}
                </button> */}
              </td>
              <td>
                <div className={styles.promptText}>
                  {row.promptText}
                </div>
                {/* <div className={styles.promptMeta}>
                  <span className={styles.promptDot} />
                  <span className={styles.promptCategory}>
                    {obs.seed_prompt.category || 'Awareness'}
                  </span>
                </div> */}
              </td>
              <td>
                <div>
                  <span className={styles.numBold}>{row.platforms.length}</span>
                  <span className={styles.dataLabel}>variants</span>
                </div>
                <div>
                  <span className={styles.numMed}>{row.totalResponseCount}</span>{" "}
                  <span className={styles.dataLabel}>responses</span>
                </div>
              </td>
              <td>
                Loading
              </td>
              <td>
                {/* Mock: insert SVG or trend line or value as needed */}
                <div className={styles.citationTrend}>--</div>
                <div className={styles.citationPercent}>
                  {32 + idx * 8}%
                </div>
              </td>
              <td>
                Competitors
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
