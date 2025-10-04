import axios from 'axios'
import { AxiosHeaders } from 'axios'

// Use a base API URL for all context/dash endpoints

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
})

// Helper to get auth token
function getAuthToken() {
  return localStorage.getItem('token') // or your actual auth token method
}

// Axios interceptor or helper to add Authorization header to requests
api.interceptors.request.use(config => {
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

export default api;

export interface BrandInfo {
  id?: string
  name: string
  alternativeNames: string
  description: string
  country: string
  websites: string
}

export interface Persona {
  name: string
  description: string
  countries: string
}

export interface Competitor {
  name: string
  alternativeNames: string
  websites: string
}

export interface Topic {
  name: string
}

// ContextData no longer includes userId
export interface ContextData {
  brandInfo: BrandInfo
  personas: Persona[]
  competitors: Competitor[]
  topics: Topic[]
}

// Create brand and context all in one call, returns projectId in response
export async function createContextWithBrand(data: ContextData) {
  const response = await api.post('/context/brand', data.brandInfo)
  return response.data // includes projectId, brandInfo with id
}

export async function saveBrandInfo(brandInfo: BrandInfo) {
  const response = await api.post(`/context/brand`, brandInfo)
  return response.data
}

export async function loadBrandInfo(projectId: string): Promise<BrandInfo | null> {
  try {
    const response = await api.get<BrandInfo>(`/context/brand/${projectId}`)
    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null
    }
    throw error
  }
}

export async function loadUserProjects(): Promise<BrandInfo[] | []> {
  try {
    const response = await api.get<BrandInfo[]>(`/context/brands`)
    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return []
    }
    throw error
  }
}

export async function savePersonas(projectId: string, personas: Persona[]) {
  const response = await api.post(`/context/personas/${projectId}`, personas)
  return response.data
}

export async function loadPersonas(projectId: string): Promise<Persona[]> {
  const response = await api.get(`/context/personas/${projectId}`)
  return response.data
}

export async function saveCompetitors(projectId: string, competitors: Competitor[]) {
  const response = await api.post(`/context/competitors/${projectId}`, competitors)
  return response.data
}

export async function loadCompetitors(projectId: string): Promise<Competitor[]> {
  const response = await api.get(`/context/competitors/${projectId}`)
  return response.data
}

export async function saveTopics(projectId: string, topics: Topic[]) {
  const response = await api.post(`/context/topics/${projectId}`, topics)
  return response.data
}

export async function loadTopics(projectId: string): Promise<Topic[]> {
  const response = await api.get(`/context/topics/${projectId}`)
  return response.data
}
