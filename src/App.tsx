import './App.css'
import { HashRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import { AuthProvider } from './hooks/useAuth'
import RequireAuth from './components/RequireAuth'
import ContextPage from './pages/ContextPage'
import { ProjectProvider } from './contexts/ProjectContext'
import PromptsPage from './pages/PromptsPage'
import OtpVerification from './pages/OtpVerificationPage'
import AuthFlow from './pages/AuthFlow'
import LandingPage from './pages/LandingPage'
import CitationsPage from './pages/CitationsPage'
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <ProjectProvider>
      <AuthProvider>
    
        <HashRouter>
          <Routes>
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/context" element={<ContextPage />} />
              <Route path="/prompts" element={<PromptsPage />} />
              <Route path="/citations" element={<CitationsPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/otp-verification" element={<OtpVerification />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={<AuthFlow />} />
            <Route path="/auth/callback" element={<AuthFlow />} />
            <Route path="/landing" element={<LandingPage />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ProjectProvider>
    </QueryClientProvider>
  )
}

export default App
