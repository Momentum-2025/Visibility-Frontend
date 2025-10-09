// PromptDataService.ts

import api, { type Topic } from './contextService'

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

export async function fetchPromptObservations(
//   offset = 0,
//   limit: number | null = null,
): Promise<ObservationsResponse> {
//   const params: Record<string, unknown> = { offset }
//   if (limit !== null) params.limit = limit

  const response = await api.get<ObservationsResponse>('/prompt-observations')
  return response.data
}

//helper functions
interface PrompTableRow {
  id:number,
  promptText:string,
  topics:Topic[],
  platforms:string[],
  totalResponseCount:number,
  competitorCount:CompetitorMapResponse
}

export function mapObservationsToTableRows(observations: Observation[]): PrompTableRow[] {
  const rowMap = new Map<number, PrompTableRow>()

  for (const obs of observations) {
    const key = obs.seed_prompt.id
    if (!rowMap.has(key)) {
      rowMap.set(key, {
        id: key,
        promptText: obs.seed_prompt.text,
        topics: obs.seed_prompt.topics,
        platforms: [obs.platform],
        totalResponseCount: obs.observation_count,
        competitorCount: {} // Fill later as required
      })
    } else {
      const row = rowMap.get(key)!
      // Add unique platforms
      if (!row.platforms.includes(obs.platform)) {
        row.platforms.push(obs.platform)
      }
      // Sum response counts
      row.totalResponseCount += obs.observation_count
    }
  }

  return Array.from(rowMap.values())
}