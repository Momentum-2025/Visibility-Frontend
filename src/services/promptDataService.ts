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

  if (filters.tags.length != 0) {
    result.isTagSpecificData = true
    result.tagSpecificData = await fetchTagSpecificPromptStats(
      projectId,
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
    result.tagWiseData = await fetchTagWisePromptStats(projectId, {
      startDate: filters.startDate,
      endDate: filters.endDate,
    })
    console.log('got data')
    console.log(result.tagWiseData)
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
  dateRange?: DateRange,
): Promise<TagPresenceSummaryList> {
  const params: Record<string, unknown> = {}
  params['contextId'] = projectId
  if (dateRange?.startDate) params['startDate'] = dateRange.startDate
  if (dateRange?.endDate) params['endDate'] = dateRange.endDate

  const response = await api.get<TagPresenceSummaryList>(
    `/api/PresenceSummary/tags`,
    {
      params,
    },
  )
  return response.data
}

export async function fetchTagSpecificPromptStats(
  projectId: string,
  tag: string,
  dateRange?: DateRange,
): Promise<TagAnalysisResponse | undefined> {
  const params: Record<string, unknown> = {}
  if (tag == null) {
    return undefined
  }

  params['contextId'] = projectId
  params['tag'] = tag
  if (dateRange?.startDate) params['startDate'] = dateRange.startDate
  if (dateRange?.endDate) params['endDate'] = dateRange.endDate

  const response = await api.get<TagAnalysisResponse>(
    `/api/PresenceSummary/prompt-analysis`,
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
