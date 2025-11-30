import axios from 'axios'
import api from './contextService' // your preconfigured axios instance
import type { PromptFilters } from '../hooks/useFilters'
//new
export interface CompetitorDetail {
  presenceCount: number
  denominatorCount: number
  presencePercentage: number
}

export interface DayWisePresence {
  date: string // ISO string from API
  competitorPresencePercentages: Record<string, number>
  ownCompanyPresencePercentage: number
}

export interface PresenceApiResponse {
  totalResponses: number
  ownPresenceCount: number
  ownPresencePercentage: number
  competitorDetails: Record<string, CompetitorDetail>
  dayWisePresence: DayWisePresence[]
}

export interface ChartPoint {
  date: string
  [key: string]: number | string // for dynamic competitor keys + "own"
}

/**
 * Converts DayWisePresence[] to a format consumable by GenericLineChart.
 *
 * Example output:
 * [
 *   { date: "2025-10-14", Airbyte: 36.53, Fivetran: 67.66, own: 22.1 },
 *   { date: "2025-10-15", Airbyte: 38.12, Fivetran: 65.77, own: 21.9 },
 * ]
 */
export function convertDayWiseToChartData(
  input: DayWisePresence[],
): ChartPoint[] {
  return input.map((item) => {
    const competitors = item.competitorPresencePercentages

    return {
      date: new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      ...competitors,
      own: item.ownCompanyPresencePercentage,
    }
  })
}

//new
export interface Platform {
  id: string
  logoUrl: string
}

export interface DashboardOverview {
  prompts: number
  responses: number
  platforms: Platform[]
}

export interface CompetitorPresence {
  Key: string
  IsCompetitor: boolean
  presence7Days: number
  presence4Weeks: number
  presence12Weeks: number
}

export interface PositionEntry {
  period: string
  top: number
  middle: number
  bottom: number
  total: number
  missing?: number
}

export interface PresenceEntry {
  period: string
  total_responses: number
  present_count: number
  present_percentage: number
}

export interface CitationBreakdown {
  count: number;
  total: number;
  percentage: number;
}

export interface CitationResult {
  totalCitations: number;
  ownBrandCitation: CitationBreakdown;
  thirdPartyCitation: CitationBreakdown;
  competitorCitation: CitationBreakdown;
  dayWiseOwnBrandData:{date:string,percentage:number}[]
}


export type ChartEntry = {
  period: string
  [key: string]: number | string
}

export function mapCitationToChartEntries(
  citation: CitationResult | null,
): ChartEntry[] {
  return citation?.dayWiseOwnBrandData.map((citation) =>({
    period: citation?.date,
    brand_percentage: citation?.percentage.toString(),
  })) || [];
}

export function mapDashboardPresenceToChartEntries(
  presenceData: DayWisePresence[],
): ChartEntry[] {
  return presenceData.map((presence) => ({
    period: presence.date,
    total_responses: 0,
    present_percentage: presence.ownCompanyPresencePercentage,
    not_present: 100 - presence.ownCompanyPresencePercentage,
    present_count: 0,
    // Add any additional fields you want to expose for charts
  }))
}

export function mapPositionToChartEntries(
  positionData: PositionEntry[],
): ChartEntry[] {
  return positionData.map((position) => ({
    period: position.period,
    top: position.top,
    middle: position.middle,
    bottom: position.bottom,
    total: position.total,
    missing: position.missing || 0,
    // Add any additional fields you want to expose for charts
  }))
}

function logApiError(apiName: string, error: unknown) {
  if (axios.isAxiosError(error)) {
    console.error(
      `[${apiName}] Axios error:`,
      error.message,
      error.response?.data,
    )
  } else {
    console.error(`[${apiName}] Unknown error:`, error)
  }
}

export interface DateRange {
  startDate?: string
  endDate?: string
}

// Get token from localStorage or context (use your own auth management)
function getAuthToken(): string | null {
  return localStorage.getItem('authToken')
}

// Helper to build headers (always include Bearer token)
function getAuthHeaders() {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchDashboardOverview(
  projectId: string,
  dateRange?: DateRange,
): Promise<DashboardOverview | null> {
  try {
    const params: Record<string, string> = {}
    if (dateRange?.startDate) params['startDate'] = dateRange.startDate
    if (dateRange?.endDate) params['endDate'] = dateRange.endDate

    const response = await api.get(`/dashboard-overview/${projectId}`, {
      params,
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error) {
    logApiError('fetchDashboardOverview', error)
    return null
  }
}

export async function fetchOverallPresence(
  projectId: string,
  filters: PromptFilters,
): Promise<PresenceApiResponse | null> {
  try {
    const params: Record<string, string> = {}
    if (filters.startDate) params['startDate'] = filters.startDate
    if (filters.endDate) params['endDate'] = filters.endDate
    params['contextId'] = projectId

    const response = await api.get(`/api/PresenceSummary/overall`, {
      params,
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error) {
    logApiError('fetchCompetitorPresence', error)
    return null
  }
}

export async function fetchPosition(
  projectId: string,
  dateRange?: DateRange,
): Promise<PositionEntry[] | null> {
  try {
    const params: Record<string, string> = {}
    if (dateRange?.startDate) params['startDate'] = dateRange.startDate
    if (dateRange?.endDate) params['endDate'] = dateRange.endDate

    const response = await api.get(`/position/${projectId}`, {
      params,
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error) {
    logApiError('fetchPosition', error)
    return null
  }
}

export async function fetchPresence(
  projectId: string,
  dateRange?: DateRange,
): Promise<PresenceEntry[] | null> {
  try {
    const params: Record<string, string> = {}
    if (dateRange?.startDate) params['startDate'] = dateRange.startDate
    if (dateRange?.endDate) params['endDate'] = dateRange.endDate

    const response = await api.get(`/presence/${projectId}`, {
      params,
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error) {
    logApiError('fetchPresence', error)
    return null
  }
}

export async function fetchCitations(
  projectId: string,
  filters?: PromptFilters,
): Promise<CitationResult | null> {
  try {
    const params: Record<string, unknown> = {}
    const dateRange = { startDate:filters?.startDate, endDate: filters?.endDate}
    if (dateRange?.startDate) params['startDate'] = dateRange.startDate
    if (dateRange?.endDate) params['endDate'] = dateRange.endDate
    params['tag'] = filters?.tags[0]
    params['platform'] = filters?.platforms[0]
    if(filters?.promptId) params['promptId'] = filters?.promptId

    const response = await api.get(`/api/Citation/context/${projectId}/stats`, {
      params,
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error) {
    logApiError('fetchCitations', error)
    return null
  }
}
