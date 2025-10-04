// src/components/AuthForm.tsx
import React, { useState } from 'react'

interface Props {
  isSignup?: boolean
  onSubmit: (formData: { email: string; password: string; fullName?: string }) => void
}

const AuthForm: React.FC<Props> = ({ isSignup = false, onSubmit }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSignup) {
      onSubmit({ email, password, fullName })
    } else {
      onSubmit({ email, password })
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {isSignup && (
        <label>
          Full Name
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required={isSignup}
          />
        </label>
      )}
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
    </form>
  )
}

export default AuthForm