import axios from 'axios'
import api from './contextService' // your preconfigured axios instance
import type { PromptFilters } from '../hooks/useFilters'
import type { ChartPoint } from './dashboardService'

export interface CitationStatsValue {
  count: number
  percentage: number
}

export interface TopCitedDomain {
  domain: string
  count: number
  percentage: number
}

export interface DomainStats {
  domain: string
  promptCount: number
  totalOccurrences: number
}

export interface CitationStatsResponse {
  totalCitations: number
  ownBrand: CitationStatsValue
  thirdParty: CitationStatsValue
  competitors: CitationStatsValue
  topCitedDomains: TopCitedDomain[]
  domainWiseDetails: DomainStats[]
}

export async function fetchDomainWise(
  projectId: string,
  filters: PromptFilters,
): Promise<CitationStatsResponse | null> {
  try {
    const params: Record<string, string> = {}
    if (filters?.startDate) params['startDate'] = filters.startDate
    if (filters?.endDate) params['endDate'] = filters.endDate

    const response = await api.get<CitationStatsResponse>(`/api/Citation/context/${projectId}/dashboard`, {
      params,
    })
    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null
    }
    throw error
  }
}

export function convertTopDomainsToChartData(
  input: TopCitedDomain[],
): ChartPoint[] {
  return input.map((item) => {

    return {
      date: item.domain,
      count:item.count,
      percentage:item.percentage
    }
  })
}
