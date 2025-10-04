import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const RequireAuth: React.FC = () => {
  const { user } = useAuth()

  // If user not logged in, navigate to login page
  if (!user) {
    return <Navigate to="/" replace />
  }

  // Else render nested routes (or page content)
  return <Outlet />
}

export default RequireAuth
