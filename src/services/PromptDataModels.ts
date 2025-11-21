import type { ChartEntry } from "./dashboardService";
// new
export interface PromptInfo {
  id: string;
  contextId: string;
  prompt: string;
  tag: string;
}

export interface PresenceItem {
  companyName: string;
  presenceCount: number;
  presencePercentage: number;
  isOwnCompany: boolean;
}

export interface TagPresenceSummary {
  tag: string;
  totalResponses: number;
  totalPrompts: number;
  presenceData: PresenceItem[];
}

export interface TableRowData{
  item:string;
  totalResponses:number;
  totalVarietiesOfItem:number;
  presenceData: PresenceItem[];
}

export type TagPresenceSummaryList = TagPresenceSummary[];

export interface PromptDisplayData {
  isTagWiseData: boolean;
  isTagSpecificData: boolean;
  tagWiseData: TagPresenceSummaryList;
  tagSpecificData: TagAnalysisResponse;
  seedPromptData:PromptInfo[]
}

export interface PromptWiseAnalysis {
  promptId: string;
  promptText: string;
  totalResponses: number;
  presenceData: PresenceItem[];
}

export interface TagWiseDayWisePresence {
  date: string; // ISO date string
  totalResponses: number;
  ownPresenceCount: number;
  ownPresencePercentage: number;
}

export interface TagAnalysisResponse {
  tag: string;
  totalPrompts: number;
  totalResponses: number;
  promptWiseAnalysis: PromptWiseAnalysis[];
  tagWiseDayWisePresence: TagWiseDayWisePresence[];
}


export function mapPresenceToChartEntries(
  presenceData: TagWiseDayWisePresence[],
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