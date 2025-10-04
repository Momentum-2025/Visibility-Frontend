import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate, Link } from 'react-router-dom'
import styles from './AuthPage.module.css'  // shared styles for consistency

const SignupPage: React.FC = () => {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signup(email, password, fullName)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.tile}>
        <h1 className={styles.title}>Sign Up</h1>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label>
            Full Name
            <input
              className={styles.input}
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              placeholder="John Doe"
              autoComplete="name"
            />
          </label>
          <label>
            Email
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="email@company.com"
              autoComplete="email"
            />
          </label>
          <label>
            Password
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </label>

          {error && <div className={styles.error}>{error}</div>}

          <button
            className={styles.submitBtn}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <div className={styles.bottomRow}>
          Already have an account?
          <Link to="/">Login here &rarr;</Link>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
