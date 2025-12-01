import { useState } from 'react'
import { exportContextData } from '../../services/fileService'
import styles from './ExportSection.module.css'

export default function ExportCsvButton() {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    try {
      setIsExporting(true)
      await exportContextData()
    } catch (error) {
      console.error('Export failed:', error)
      // Optionally show error notification
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button 
      className={styles.exportButton}
      onClick={handleExport}
      disabled={isExporting}
    >
      <span className={styles.exportText}>
        {isExporting ? 'Exporting...' : 'Prompts (CSV)'}
      </span>
      <span className={styles.exportSubtext}>
        Export your current prompts for review.
      </span>
      <svg 
        className={styles.exportIcon} 
        width="20" 
        height="20" 
        viewBox="0 0 20 20" 
        fill="none"
      >
        <path 
          d="M13 10L10 13M10 13L7 10M10 13V3M3 17H17" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}