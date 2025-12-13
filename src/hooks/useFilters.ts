/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useFilters.ts
import { useSearchParams } from 'react-router-dom'
import { useMemo, useCallback } from 'react'

export interface FilterConfig<T> {
  defaultValues: T
  serialize?: (filters: T) => Record<string, string>
  deserialize?: (params: URLSearchParams) => T
}

export function useFilters<T extends Record<string, any>>(
  config: FilterConfig<T>
) {
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Destructure and memoize just the parts we need
  const defaultValues = useMemo(() => config.defaultValues, [])
  const serialize = config.serialize
  const deserialize = config.deserialize

  // Parse filters from URL
  const filters = useMemo(() => {
    if (deserialize) {
      return deserialize(searchParams)
    }

    // Default deserialization
    const parsed: any = { ...defaultValues }
    
    searchParams.forEach((value, key) => {
      if (key in defaultValues) {
        const defaultValue = defaultValues[key]
        
        // Handle different types
        if (typeof defaultValue === 'boolean') {
          parsed[key] = value === 'true'
        } else if (Array.isArray(defaultValue)) {
          parsed[key] = value.split(',').filter(Boolean)
        } else if (typeof defaultValue === 'number') {
          parsed[key] = Number(value)
        } else {
          parsed[key] = value
        }
      }
    })
    
    return parsed as T
  }, [searchParams, defaultValues, deserialize])

  // Update filters - use setSearchParams callback form to avoid stale closure
  const updateFilters = useCallback(
    (updates: Partial<T>) => {
      setSearchParams((currentParams) => {
        // Re-parse current filters from params
        const currentFilters: any = { ...defaultValues }
        currentParams.forEach((value, key) => {
          if (key in defaultValues) {
            const defaultValue = defaultValues[key]
            if (typeof defaultValue === 'boolean') {
              currentFilters[key] = value === 'true'
            } else if (Array.isArray(defaultValue)) {
              currentFilters[key] = value.split(',').filter(Boolean)
            } else if (typeof defaultValue === 'number') {
              currentFilters[key] = Number(value)
            } else {
              currentFilters[key] = value
            }
          }
        })
        
        const newFilters = { ...currentFilters, ...updates }
        
        let serialized: Record<string, string>
        
        if (serialize) {
          serialized = serialize(newFilters)
        } else {
          // Default serialization
          serialized = {}
          Object.entries(newFilters).forEach(([key, value]) => {
            if (value === undefined || value === null) return
            
            if (Array.isArray(value)) {
              if (value.length > 0) {
                serialized[key] = value.join(',')
              }
            } else if (typeof value === 'boolean') {
              serialized[key] = String(value)
            } else {
              serialized[key] = String(value)
            }
          })
        }
        
        return new URLSearchParams(serialized)
      })
    },
    [defaultValues, serialize, setSearchParams]
  )

  // Remove a specific filter
  const removeFilter = useCallback(
    (key: keyof T) => {
      updateFilters({ [key]: defaultValues[key] } as Partial<T>)
    },
    [defaultValues, updateFilters]
  )

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams())
  }, [setSearchParams])

  // Check if filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).some(
      (key) => filters[key] !== defaultValues[key]
    )
  }, [filters, defaultValues])

  // Get active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.keys(filters).filter(
      (key) => {
        const value = filters[key]
        const defaultValue = defaultValues[key]
        
        if (Array.isArray(value)) {
          return value.length > 0 && value !== defaultValue
        }
        return value !== defaultValue
      }
    ).length
  }, [filters, defaultValues])

  return {
    filters,
    updateFilters,
    removeFilter,
    clearFilters,
    hasActiveFilters,
    activeFiltersCount,
  }
}

// Example usage with PromptFilters
export interface PageFilters {
  startDate: string
  endDate: string
  branded?: boolean
  platforms: string[]
  tags: string[]
  sortBy?: string
  sortOrder: 'asc' | 'desc'
  promptId?:string,
  groupPromptsBy?:string,
  groupCitBy?:string
  domain?:string
}

export const usePromptFilters = () => {
  const config = useMemo(() => ({
    defaultValues: {
      startDate: '2025-10-01',
      endDate: '2025-12-01',
      branded: undefined,
      platforms: [],
      tags: [],
      sortBy: undefined,
      sortOrder: 'desc' as const,
      groupPromptsBy:undefined,
      groupCitBy:undefined,
      promptId:undefined,
      domain:undefined
    },
  }), [])

  return useFilters<PageFilters>(config)
}