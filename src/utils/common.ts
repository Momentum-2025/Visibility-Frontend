export const APP_NAME = 'Visibility'
export const platformLabels: Record<string, string> = {
  openai: 'ChatGPT',
  google: 'Google Ai Overviews',
  perplexity: 'Perplexity',
}

export interface Platform {
  id: 'openai' | 'gemini' | 'perplexity'
  name: string
  logoUrl: string
}

export const platforms: Platform[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    logoUrl: '/logos/openai.png',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    logoUrl: '/logos/gemini.png',
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    logoUrl: '/logos/perplexity.png',
  },
]

export function stringToColor(input: string): string {
  let hash = 0

  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i)
    hash |= 0 // force 32-bit int
  }

  const index = Math.abs(hash) % GRAPH_COLORS.length
  return GRAPH_COLORS[index]
}

const GRAPH_COLORS = [
  '#ff7300ff', // blue
  '#d1722eff', // red
  '#b57637ff', // orange
  '#9c7b49ff', // green
  '#990099', // purple
  '#0099C6', // cyan
  '#DD4477', // pink
  '#66AA00', // lime
  '#B82E2E', // dark red
  '#316395', // steel blue
  '#994499', // violet
  '#22AA99', // teal
  '#AAAA11', // olive
  '#6633CC', // indigo
  '#E67300', // deep orange
  '#8B0707', // maroon
  '#651067', // dark purple
  '#329262', // forest green
  '#5574A6', // soft blue
  '#3B3EAC', // royal blue
]
