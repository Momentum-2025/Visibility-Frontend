import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate, Link } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import type { CredentialResponse } from '@react-oauth/google'
import styles from './AuthPage.module.css' // refined and shared style

const LoginPage: React.FC = () => {
  const { login, googleLogin } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/verify-otp', { 
          state: { 
            email,
            timestamp: Date.now() // optional: for OTP expiry
          } 
        });
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    if (credentialResponse.credential) {
      try {
        await googleLogin(credentialResponse.credential)
        navigate('/dashboard')
      } catch (err: any) {
        setError(err.message || 'Google login failed')
      }
    }
  }

  const handleGoogleLoginError = () => {
    setError('Google login failed')
  }

  return (
    <div className={styles.container}>
      <div className={styles.tile}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Sign in to Visibility AI</h1>
          <h5 className={styles.subTitle}>Welcome back! Sign in to continue</h5>
        </div>

        <div className={styles.socialRow}>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            width="100%"
          />
        </div>
        <div className={styles.dividerRow}>
          <hr />
          <span>OR</span>
          <hr />
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label>
            Email
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="email@company.com"
            />
          </label>


          {/* <div className={styles.optionsRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <Link to="/forgot" className={styles.forgot}>Forgot password</Link>
          </div> */}

          {error && <div className={styles.error}>{error}</div>}

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        {/* <div className={styles.bottomRow}>
          Don't have an account yet?
          <Link to="/signup">Sign up for free &rarr;</Link>
        </div> */}
      </div>
    </div>
  )
}

export default LoginPage
