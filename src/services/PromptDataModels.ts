import type { JSX } from 'react'
import type { ChartEntry } from './dashboardService'
// new
export interface PromptInfo {
  id: string
  contextId: string
  prompt: string
  tag: string
}

export interface PresenceItem {
  companyName: string
  presenceCount: number
  presencePercentage: number
  isOwnCompany: boolean
}

export interface TagPresenceSummary {
  tag: string
  totalResponses: number
  totalPrompts: number
  presenceData: PresenceItem[]
}

export interface TableRowData {
  itemLogo?:JSX.Element
  itemId: string
  item: string
  totalResponses: (number | string)[]
  totalVarietiesOfItem: (number | string)[]
  ownPresencePercentage:number
  presenceData: PresenceItem[] | []
}

export type TagPresenceSummaryList = TagPresenceSummary[]

export interface PromptDisplayData {
  isEmpty: boolean
  isTagWiseData: boolean
  isTagSpecificData: boolean
  isPromptSpecificData: boolean
  tagWiseData: TagPresenceSummaryList
  tagSpecificData: TagAnalysisResponse
  seedPromptData: PromptInfo[]
  promptSpecificData: PromptWiseAnalysis
}

export interface PromptWiseAnalysis {
  promptId: string
  promptText: string
  totalResponses: number
  presenceData: PresenceItem[]
  dailyResponseData?: DayWisePresence[],
  platformWiseData:PromptWiseData[]
}

export interface DayWisePresence {
  date: string // ISO date string
  totalResponses: number
  ownPresenceCount: number
  ownPresencePercentage: number
}

export interface TagAnalysisResponse {
  tag: string
  totalPrompts: number
  totalResponses: number
  promptWiseAnalysis: PromptWiseAnalysis[]
  tagWiseDayWisePresence: DayWisePresence[]
}

export interface PromptWiseData {
  platform: string
  totalResponses: number
  ownPresenceCount: number
  ownPresencePercentage: number
  competitorPresence: PresenceItem[]
}

export function mapPresenceToChartEntries(
  presenceData: DayWisePresence[],
): ChartEntry[] {
  return presenceData.map((presence) => ({
    period: presence.date,
    total_responses: 0,
    present_percentage: presence.ownPresencePercentage,
    not_present: 100 - presence.ownPresencePercentage,
    present_count: presence.ownPresenceCount,
    // Add any additional fields you want to expose for charts
  }))
}
