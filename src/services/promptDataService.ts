/* eslint-disable @typescript-eslint/no-explicit-any */
// PromptDataService.ts

import type { PromptFilters } from '../hooks/useFilters'
import api from './contextService'
import type { DateRange } from './dashboardService'
import type {
  PromptDisplayData,
  PromptInfo,
  TagPresenceSummaryList,
  TagAnalysisResponse,
  PromptWiseAnalysis,
} from './PromptDataModels'

export interface PromptTopic {
  id: number
  name: string
}

export interface PromptPersona {
  id: number
  name: string
  geo_country?: string | null
  geo_state?: string | null
  geo_city?: string | null
  geo_latitude?: number | null
  geo_longitude?: number | null
  location?: string | null
}

export interface SeedPrompt {
  id: number
  status: string
  text: string
  favorite: boolean
  branded: boolean
  persona: PromptPersona
  category: string
  topics: PromptTopic[]
  tags: string[]
  last_updated: string
  created_at: string
  platforms: string[]
}

export interface Observation {
  id: number
  seed_prompt: SeedPrompt
  platform: string
  observation_count: number
  created_at: string
  updated_at: string
}

export interface ObservationsResponse {
  total: number
  offset: number
  limit: number | null
  observations: Observation[]
}

export interface CompetitorEntry {
  name: string
  count: number
}

export interface ObservationCompetitorGroup {
  competitors: CompetitorEntry[]
  observation_count: number
}

// The main response type, where the property names are dynamic string IDs:
export type CompetitorMapResponse = {
  [observationId: string]: ObservationCompetitorGroup
}

export async function fetchPromptPageData(
  projectId: string,
  filters: PromptFilters,
): Promise<PromptDisplayData> {
  const result: Partial<PromptDisplayData> = {}
  if (projectId == '') {
    result.isEmpty = true;
    return result as PromptDisplayData
  }

  if (filters.promptId) {
    result.isPromptSpecificData = true
    result.promptSpecificData = await fetchPromptSpecificPromptStats(
      projectId,
      filters.promptId,
      filters.platforms[0],
      {
        startDate: filters.startDate,
        endDate: filters.endDate,
      },
    )
  } else if (filters.tags.length != 0) {
    result.isTagSpecificData = true
    result.tagSpecificData = await fetchTagSpecificPromptStats(
      projectId,
      filters.platforms[0],
      filters.tags[0],
      {
        startDate: filters.startDate,
        endDate: filters.endDate,
      },
    )
  } else if (filters.groupBy == 'prompt') {
    result.seedPromptData = await fetchPromptObservations(projectId)
  } else {
    result.isTagWiseData = true
    result.tagWiseData = await fetchTagWisePromptStats(projectId,filters.platforms[0], {
      startDate: filters.startDate,
      endDate: filters.endDate,
    })
  }

  return result as PromptDisplayData
}

export async function fetchPromptObservations(
  projectId: string,
): Promise<PromptInfo[]> {
  const response = await api.get<PromptInfo[]>(`/api/prompt/${projectId}`)
  return response.data
}

export async function fetchTagWisePromptStats(
  projectId: string,
  platform:string,
  dateRange?: DateRange,
): Promise<TagPresenceSummaryList> {
  const params: Record<string, unknown> = {}

  params['platform'] = platform
  if (dateRange?.startDate) params['startDate'] = dateRange.startDate
  if (dateRange?.endDate) params['endDate'] = dateRange.endDate

  const response = await api.get<TagPresenceSummaryList>(
    `/api/PresenceSummary/prompt-analysis/tagwise/${projectId}`,
    {
      params,
    },
  )
  return response.data
}

export async function fetchTagSpecificPromptStats(
  projectId: string,
  platform:string,
  tag: string,
  dateRange?: DateRange,
): Promise<TagAnalysisResponse | undefined> {
  const params: Record<string, unknown> = {}
  if (tag == null) {
    return undefined
  }

  params['platform'] = platform
  // params['tag'] = tag
  if (dateRange?.startDate) params['startDate'] = dateRange.startDate
  if (dateRange?.endDate) params['endDate'] = dateRange.endDate

  const response = await api.get<TagAnalysisResponse>(
    `/api/PresenceSummary/prompt-analysis/context/${projectId}/tag/${tag}`,
    {
      params,
    },
  )
  return response.data
}

export async function fetchPromptSpecificPromptStats(
  projectId: string,
  promptId: string,
  platform:string,
  dateRange?: DateRange,
): Promise<PromptWiseAnalysis | undefined> {
  const params: Record<string, unknown> = {}
  if (promptId == null) {
    return undefined
  }

  params['platform'] = platform
  if (dateRange?.startDate) params['startDate'] = dateRange.startDate
  if (dateRange?.endDate) params['endDate'] = dateRange.endDate

  const response = await api.get<PromptWiseAnalysis>(
    `/api/PresenceSummary/prompt-analysis/prompt/${promptId}`,
    {
      params,
    },
  )
  return response.data
}

//helper functions
interface PrompTableRow {
  id: string
  promptText: string
  tag: string
  platforms: string[] | []
  totalResponseCount: number | 0
  competitorCount: CompetitorMapResponse | null
}

export function mapObservationsToTableRows(
  prompts: PromptInfo[],
): PrompTableRow[] {
  const rowMap = new Map<string, PrompTableRow>()

  for (const prompt of prompts) {
    const key = prompt.id
    rowMap.set(key, {
      id: key,
      promptText: prompt.prompt,
      tag: prompt.tag,
      platforms: [], // below might not be used now
      totalResponseCount: 0,
      competitorCount: null,
    })
  }

  return Array.from(rowMap.values())
}
