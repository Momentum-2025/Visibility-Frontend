import axios from 'axios'
import api from './contextService' // your preconfigured axios instance

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

export interface CitationEntry {
  period: string
  total_responses: number
  total_sources: number
  brand_source_count: number
  competitor_source_count: number
  third_party_sources: number
  brand_percentage: number
  competitor_percentage: number
  third_party_percentage: number
}

type ChartEntry = {
  period: string
  [key: string]: number | string
}

export function mapCitationToChartEntries(
  citations: CitationEntry[],
): ChartEntry[] {
  return citations.map((citation) => ({
    period: citation.period,
    brand_percentage: citation.brand_percentage,
    competitor_percentage: citation.competitor_percentage,
    third_party_percentage: citation.third_party_percentage,
    total_responses: citation.total_responses,
    // Add any additional fields you want to expose for charts
  }))
}

export function mapPresenceToChartEntries(
  presenceData: PresenceEntry[],
): ChartEntry[] {
  return presenceData.map((presence) => ({
    period: presence.period,
    total_responses: presence.total_responses,
    present_percentage: presence.present_percentage,
    not_present: 100 - presence.present_percentage,
    present_count: presence.present_count,
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
    missing:position.missing || 0
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

interface DateRange {
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
    if (dateRange?.startDate) params['start-date'] = dateRange.startDate
    if (dateRange?.endDate) params['end-date'] = dateRange.endDate

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

export async function fetchCompetitorPresence(
  projectId: string,
  dateRange: DateRange,
): Promise<CompetitorPresence[] | null> {
  try {
    const params: Record<string, string> = {}
    if (dateRange.startDate) params['start-date'] = dateRange.startDate
    if (dateRange.endDate) params['end-date'] = dateRange.endDate

    const response = await api.get(`/competitor-presence/${projectId}`, {
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
    if (dateRange?.startDate) params['start-date'] = dateRange.startDate
    if (dateRange?.endDate) params['end-date'] = dateRange.endDate

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
    if (dateRange?.startDate) params['start-date'] = dateRange.startDate
    if (dateRange?.endDate) params['end-date'] = dateRange.endDate

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
  dateRange?: DateRange,
): Promise<CitationEntry[] | null> {
  try {
    const params: Record<string, string> = {}
    if (dateRange?.startDate) params['start-date'] = dateRange.startDate
    if (dateRange?.endDate) params['end-date'] = dateRange.endDate

    const response = await api.get(`/citations/${projectId}`, {
      params,
      headers: getAuthHeaders(),
    })
    return response.data
  } catch (error) {
    logApiError('fetchCitations', error)
    return null
  }
}
