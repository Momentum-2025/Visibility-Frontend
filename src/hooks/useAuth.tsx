/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
// src/hooks/useAuth.ts
import { useState, useEffect, createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import {
  handleEmailLogin,
  handleEmailLoginOtpVerification,
  handleLogin,
  handleSignup,
} from '../services/authService'
import { loadUserProjects } from '../services/contextService'
import { useProject } from '../contexts/ProjectContext'

interface User {
  email: string
  fullName?: string
  // other fields as needed
}

interface AuthContextType {
  user: User | null
  emailLogin: (email: string, otp?: string) => Promise<any>
  login: (
    email: string,
    password?: string,
    googleToken?: string,
  ) => Promise<void>
  signup: (email: string, password: string, fullName?: string) => Promise<void>
  logout: () => void
  googleLogin: (googleToken: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) setUser(JSON.parse(storedUser))
    setLoading(false)
  }, [])
  const { setCurrentProjectId, setProjects } = useProject()

  async function emailLogin(email: string, otp?: string) {
    let result
    if (otp) {
      result = await handleEmailLoginOtpVerification(email, otp)
    } else {
      result = await handleEmailLogin(email)
      return result.data.isNewUser
    }

    localStorage.setItem('token', JSON.stringify(result.data.token)) // use result.token
    localStorage.setItem('user', JSON.stringify(result.data?.user ?? { email: email, fullName:email.slice(0,email.length-10)}))
    // Save user/token to localStorage if needed
    const userProjects = await loadUserProjects() // implement this call

    if (userProjects.length > 0) {
      const lastUsedProjectId = userProjects[0].id // or your preferred logic
      setProjects(
        userProjects.map((b) => ({
          id: b.id ?? '',
          name: b.name,
        })),
      )
      setCurrentProjectId(lastUsedProjectId ?? '') // from useProject hook
    } else {
      // navigate('/context')
      // setCurrentProjectId('68d4012cb35966b61d4cf679')
    }
    setUser({ email: email, fullName:email.slice(0,email.length-10)})
  }

  async function login(email: string, password?: string, googleToken?: string) {
    // TODO: call authService.login and update user state
    const payload = { email, password, googleToken }
    const result = await handleLogin(payload)

    localStorage.setItem('token', JSON.stringify(result.token)) // use result.token
    localStorage.setItem('user', JSON.stringify(result.user))
    // Save user/token to localStorage if needed
    const userProjects = await loadUserProjects() // implement this call

    if (userProjects.length > 0) {
      const lastUsedProjectId = userProjects[0].id // or your preferred logic
      setProjects(
        userProjects.map((b) => ({
          id: b.id ?? '',
          name: b.name,
        })),
      )
      setCurrentProjectId(lastUsedProjectId ?? '') // from useProject hook
    } 
    else {
      // setCurrentProjectId('68d4012cb35966b61d4cf679')
    }
    setUser(result.user)
  }

  async function googleLogin(googleToken: string) {
    // call backend with Google token to authenticate or create user
    const payload = { email: '', password: undefined, googleToken }
    const result = await handleLogin(payload)

    setUser(result.user)
    localStorage.setItem('user', JSON.stringify(result.user))
    localStorage.setItem('token', JSON.stringify(result.token))
    // Save token if needed: localStorage.setItem('token', result.token)
  }

  async function signup(email: string, password: string, fullName?: string) {
    const payload = { email, password, fullName }
    // TODO: call authService.signup and update user state
    const result = await handleSignup(payload)
    setUser(result.user)
    localStorage.setItem('user', JSON.stringify(result.user))
    localStorage.setItem('token', JSON.stringify(result.token))
    // You may also want to store the token (result.token)
    // Save user/token to localStorage if needed
  }

  function logout() {
    setUser(null)
    setProjects([])
    setCurrentProjectId('')
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('currentProjectId')
    localStorage.removeItem('projects')
    // additional cleanup if needed
  }

  if (loading) {
    // Optionally render a spinner or empty element while loading user from storage
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider
      value={{ user, emailLogin, login, signup, logout, googleLogin }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
