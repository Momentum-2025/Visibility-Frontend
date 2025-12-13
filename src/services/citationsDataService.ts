import axios from 'axios'
import api from './contextService' // your preconfigured axios instance
import type { PageFilters } from '../hooks/useFilters'
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

export interface CitationDisplayData {
  isEmpty: boolean
  isDomainWiseData: boolean
  isDomainSpecificData: boolean
  isPromptSpecificData: boolean
  domainWiseData?: CitationStatsResponse | null
  domainSpecificData: DomainStats[]
}

export async function fetchCitationsTableData(
  projectId: string,
  filters: PageFilters,
): Promise<CitationDisplayData | null> {
  const result: Partial<CitationDisplayData> = {}
  if (filters.domain) {
    result.domainSpecificData = await fetchDomainSpecificData(
      projectId,
      filters,
    )
  } else {
    result.domainWiseData = await fetchDomainWise(projectId, filters)
  }

  return result as CitationDisplayData
}

export async function fetchDomainWise(
  projectId: string,
  filters: PageFilters,
): Promise<CitationStatsResponse | null> {
  try {
    const params: Record<string, string> = {}
    if (filters?.startDate) params['startDate'] = filters.startDate
    if (filters?.endDate) params['endDate'] = filters.endDate

    const response = await api.get<CitationStatsResponse>(
      `/api/Citation/context/${projectId}/dashboard/${filters.groupCitBy ?? 'domain'}`,
      {
        params,
      },
    )
    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null
    }
    throw error
  }
}

export async function fetchDomainSpecificData(
  projectId: string,
  filters: PageFilters,
): Promise<DomainStats[] | []> {
  try {
    const params: Record<string, string> = {}
    if (filters?.startDate) params['startDate'] = filters.startDate
    if (filters?.endDate) params['endDate'] = filters.endDate

    const response = await api.get<DomainStats[]>(
      `/api/Citation/context/${projectId}/domain/${filters.domain}`,
      {
        params,
      },
    )
    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return []
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
      count: item.count,
      percentage: item.percentage,
    }
  })
}
