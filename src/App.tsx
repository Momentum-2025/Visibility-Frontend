import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import { AuthProvider } from './hooks/useAuth'
import RequireAuth from './components/RequireAuth'
import ContextPage from './pages/ContextPage'
import { ProjectProvider } from './contexts/ProjectContext'

function App() {
  return (
    <ProjectProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/context" element={<ContextPage />} />
            </Route>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ProjectProvider>
  )
}

export default App
