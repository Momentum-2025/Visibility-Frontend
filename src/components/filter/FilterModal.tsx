// components/FilterModal.tsx
import React, { useState } from 'react'
import styles from './FilterModal.module.css'
import type { PageFilters } from '../../hooks/useFilters'

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  currentFilters: PageFilters
  onApply: (filters: Partial<PageFilters>) => void
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  currentFilters,
  onApply,
}) => {
  const [localFilters, setLocalFilters] = useState<Partial<PageFilters>>({})

  if (!isOpen) return null

  const handleApply = () => {
    onApply(localFilters)
    onClose()
  }

  const handleReset = () => {
    setLocalFilters({})
  }
  const platformLabels: Record<string, string> = {
    openai: 'ChatGPT',
    google: 'Google Ai Overviews',
    perplexity: 'Perplexity',
  }
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add Filters</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          {/* Date Range Filter */}
          <div className={styles.filterGroup}>
            <label className={styles.label}>Date Range</label>
            <div className={styles.dateInputs}>
              <input
                type="date"
                className={styles.input}
                value={localFilters.startDate || currentFilters.startDate}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    startDate: e.target.value,
                  })
                }
              />
              <span className={styles.dateSeparator}>to</span>
              <input
                type="date"
                className={styles.input}
                value={localFilters.endDate || currentFilters.endDate}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, endDate: e.target.value })
                }
              />
            </div>
          </div>

          {/* Branded Filter */}
          {/* <div className={styles.filterGroup}>
            <label className={styles.label}>Prompt Type</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="branded"
                  checked={
                    (localFilters.branded ?? currentFilters.branded) ===
                    undefined
                  }
                  onChange={() =>
                    setLocalFilters({ ...localFilters, branded: undefined })
                  }
                />
                All prompts
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="branded"
                  checked={
                    (localFilters.branded ?? currentFilters.branded) === false
                  }
                  onChange={() =>
                    setLocalFilters({ ...localFilters, branded: false })
                  }
                />
                Non-branded only
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="branded"
                  checked={
                    (localFilters.branded ?? currentFilters.branded) === true
                  }
                  onChange={() =>
                    setLocalFilters({ ...localFilters, branded: true })
                  }
                />
                Branded only
              </label>
            </div>
          </div> */}
          {/* Platforms Filter */}
          <div className={styles.filterGroup}>
            <label className={styles.label}>Platforms</label>
            <div className={styles.checkboxGroup}>
              {['openai', 'google', 'perplexity'].map((platform) => (
                <label
                  key={platform}
                  className={styles.checkboxLabel}
                >
                  <input
                    type="checkbox"
                    checked={
                      (localFilters.platforms ||
                        currentFilters.platforms)[0] === platform
                    }
                    onChange={(e) => {
                      const updated = e.target.checked ? [platform] : []
                      setLocalFilters({ ...localFilters, platforms: updated })
                    }}
                  />

                  {platformLabels[platform]}
                </label>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          <div className={styles.filterGroup}>
            <label className={styles.label}>Tags</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter tags separated by commas"
              value={(localFilters.tags || currentFilters.tags).join(', ')}
              onChange={(e) => {
                const tags = e.target.value
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
                setLocalFilters({ ...localFilters, tags })
              }}
            />
          </div>

          {/* Sort Filter */}
          {/* <div className={styles.filterGroup}>
            <label className={styles.label}>Sort By</label>
            <div className={styles.sortInputs}>
              <select
                className={styles.select}
                value={localFilters.sortBy || currentFilters.sortBy || ''}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, sortBy: e.target.value })
                }
              >
                <option value="">None</option>
                <option value="date">Date</option>
                <option value="responses">Responses</option>
                <option value="presence">Presence</option>
                <option value="citations">Citations</option>
              </select>
              <select
                className={styles.select}
                value={localFilters.sortOrder || currentFilters.sortOrder}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    sortOrder: e.target.value as 'asc' | 'desc',
                  })
                }
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div> */}
        </div>

        <div className={styles.footer}>
          <button className={styles.resetBtn} onClick={handleReset}>
            Reset
          </button>
          <div className={styles.footerActions}>
            <button className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button className={styles.applyBtn} onClick={handleApply}>
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
