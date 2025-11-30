import axios from 'axios'
import { AxiosHeaders } from 'axios'

// Use a base API URL for all context/dash endpoints

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    'http://visbility-api-env.eba-mhv4cxvg.ap-south-1.elasticbeanstalk.com',
})

// Helper to get auth token
function getAuthToken() {
  return localStorage.getItem('token') // or your actual auth token method
}

// Axios interceptor or helper to add Authorization header to requests
api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    if (config.headers) {
      // If headers exist, set Authorization
      const headers = new AxiosHeaders(config.headers)
      const cleanToken = token.trim().replace(/^"(.*)"$/, '$1')
      headers.set('Authorization', `Bearer ${cleanToken}`, true)
      config.headers = headers
    } else {
      // If no headers, create new AxiosHeaders with Authorization
      config.headers = new AxiosHeaders({
        Authorization: `Bearer ${token}`,
      })
    }
  }
  return config
})

export default api

// export interface BrandInfo {
//   id?: string
//   name: string
//   alternativeNames: string
//   description: string
//   country: string
//   websites: string
// }

export interface Persona {
  id: string
  name: string
  description: string
  targetCountry: string
}

export interface Competitor {
  name: string
  alternativeNames: string
  websites: string
}

export interface Topic {
  topic: string
}

// ContextData no longer includes userId
export interface ContextData {
  brandInfo: BrandInfo
  personas: Persona[]
  competitors: Competitor[]
  topics: Topic[]
}

//new
export interface CompetitorInfo {
  id: string
  name: string
  alternativeNames: string[] | null
  websites: string[]
}

export interface BrandInfo {
  id: string
  name: string
  description: string
  website: string
  locationId: number
  createdBy: string
  createdOn: string
  updatedBy: string
  updatedOn: string
  competitors: CompetitorInfo[]
  alternativeNames: string[]
  alternativeWebsite: string[]
  personas: Persona[]
  keyTopics: Topic[]
}

//new

// Create brand and context all in one call, returns projectId in response
export async function createContextWithBrand(data: ContextData) {
  const response = await api.post('/context/brand', data.brandInfo)
  return response.data // includes projectId, brandInfo with id
}

export async function saveBrandInfo(brandInfo: BrandInfo) {
  if (brandInfo.id == '') {
    const response = await api.post(`/api/context/brandinfo`, brandInfo)
    return response.data
  } else {
    const response = await api.put(`/api/context/brandinfo/${brandInfo.id}`, brandInfo)
    return response.data
  }
}

export async function loadAllContextInfo(): Promise<BrandInfo[]> {
  try {
    const response = await api.get<BrandInfo[]>(`/api/Context/byuser`)
    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return []
    }
    throw error
  }
}

export async function loadBrandInfo(
  projectId: string,
): Promise<BrandInfo | null> {
  try {
    const response = await api.get<BrandInfo>(`/api/context/brand/${projectId}`)
    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null
    }
    throw error
  }
}

export async function loadUserProjects(
): Promise<BrandInfo[] | []> {
  try {
    const response = await api.get<BrandInfo[]>(`api/context/byuser`)
    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return []
    }
    throw error
  }
}

export async function savePersona(projectId: string, personas: Persona) {
  const response = await api.post(
    `/api/context/personas/${projectId}`,
    personas,
  )
  return response.data
}

export async function deletePersona(projectId: string, personaId: string) {
  const response = await api.delete(
    `/api/context/personas/${projectId}/${personaId}`
  )
  return response.data
}

export async function loadPersonas(projectId: string): Promise<Persona[]> {
  const response = await api.get(`/api/context/personas/${projectId}`)
  return response.data
}

export async function deleteCompetitors(
  projectId: string,
  competitorId:string,
) {
  const response = await api.delete(
    `/api/Context/competitors/${projectId}/${competitorId}`
  )
  return response.data
}

export async function saveCompetitor(
  projectId: string,
  competitor: CompetitorInfo,
) {
  const response = await api.post(
    `/api/Context/competitors/${projectId}`,
    competitor,
  )
  return response.data
}

export async function loadCompetitors(
  projectId: string,
): Promise<Competitor[]> {
  const response = await api.get(`/api/context/competitors/${projectId}`)
  return response.data
}

export async function saveTopic(projectId: string, topic: Topic) {
  const response = await api.post(`/api/context/keytopics/${projectId}`, topic)
  return response.data
}

export async function deleteTopic(projectId: string, topic: string) {
  const response = await api.delete(`/api/context/keytopics/${projectId}/${topic}`)
  return response.data
}

export async function loadTopics(projectId: string): Promise<Topic[]> {
  const response = await api.get(`/api/context/topics/${projectId}`)
  return response.data
}
