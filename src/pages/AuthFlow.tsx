/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
  type ChangeEvent,
  type ClipboardEvent,
} from 'react'
import styles from './AuthFlow.module.css'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import NoAuthLayout from '../layouts/NoAuthLayout'

// Simulated routing (in real app, use react-router-dom)
type Page = 'login' | 'otp' | 'success'

// Google OAuth configuration
const GOOGLE_CLIENT_ID =
  '152869943056-66kfsoinb9spa6vj5il5phcmu8i0nkre.apps.googleusercontent.com'
const GOOGLE_REDIRECT_URI = window.location.origin + '/auth/callback' // or your specific callback URL
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'

const AuthFlow: React.FC = () => {
  let isNewUser = false
  const [currentPage, setCurrentPage] = useState<Page>('login')
  const [isSignup, setIsSignup] = useState<boolean>(false)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const navigate = useNavigate()

  const { user, emailLogin, googleLogin } = useAuth()

  // Handle Google OAuth callback
  useEffect(() => {
    if (user != null) {
      navigate('/dashboard')
    }
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')

    if (error) {
      setError('Google sign-in was cancelled or failed')
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
      return
    }
    //console.log(code);
    if (code) {
      handleGoogleCallback(code)
    }
  }, [])

  // Handle Google Sign-In button click
  const handleGoogleSignIn = () => {
    // Generate random state for CSRF protection
    const state = generateRandomState()
    sessionStorage.setItem('google_oauth_state', state)

    // Build OAuth URL
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: 'code',
      scope: 'openid email profile',
      state: state,
      access_type: 'offline',
      prompt: 'select_account',
    })

    // Redirect to Google OAuth
    window.location.href = `${GOOGLE_AUTH_URL}?${params.toString()}`
  }

  // Handle the callback with authorization code
  const handleGoogleCallback = async (code: string) => {
    setIsLoading(true)
    setError('')

    try {
      // Verify state to prevent CSRF
      const urlParams = new URLSearchParams(window.location.search)
      const returnedState = urlParams.get('state')
      const savedState = sessionStorage.getItem('google_oauth_state')

      if (returnedState !== savedState) {
        throw new Error('Invalid state parameter')
      }

      // Send authorization code to your backend
      try {
        const response = await googleLogin(code)
        // if (response) {
        // Clean up
        sessionStorage.removeItem('google_oauth_state')
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        )

        // Navigate to success or dashboard
        setCurrentPage('success')
      } catch {
        throw new Error('Authentication failed')
      }
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed. Please try again.')
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    } finally {
      setIsLoading(false)
    }
  }

  // Generate random state for CSRF protection
  const generateRandomState = (): string => {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
      '',
    )
  }

  // LOGIN PAGE HANDLERS
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setError('')
  }

  const handleSignIn = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      isNewUser = (await emailLogin(email)) as boolean
      setIsSignup(isNewUser)
      const response = { success: true }

      if (response.success) {
        setCurrentPage('otp')
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // OTP PAGE HANDLERS
  const handleOtpChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (isNaN(Number(value))) return

    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6)

    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char
    })
    setOtp(newOtp)

    const nextIndex = Math.min(pastedData.length, 5)
    inputRefs.current[nextIndex]?.focus()
  }

  const handleVerify = async () => {
    const otpValue = otp.join('')

    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await emailLogin(email, otpValue)
      const response = { success: true }

      if (response.success) {
        setCurrentPage('success')
      } else {
        setError('Invalid OTP. Please try again.')
        setOtp(new Array(6).fill(''))
      }
    } catch (err) {
      setError('Verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setOtp(new Array(6).fill(''))
    setError('')
    inputRefs.current[0]?.focus()

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert('OTP has been resent to ' + email)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    setCurrentPage('login')
    setEmail('')
    setOtp(new Array(6).fill(''))
    setError('')
  }

  // RENDER LOGIN PAGE
  if (currentPage === 'login') {
    return (
      <NoAuthLayout>
        <div className={styles.container}>
          <div className={styles.card}>
            <h1 className={styles.title}>Sign in to Visibility AI</h1>
            <p className={styles.subtitle}>Welcome back! Sign in to continue</p>

            <button
              className={styles.googleButton}
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path
                  fill="#4285F4"
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                />
                <path
                  fill="#34A853"
                  d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"
                />
                <path
                  fill="#EA4335"
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                />
              </svg>
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>

            <div className={styles.divider}>
              <span>OR</span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="email@company.com"
                className={styles.input}
                onKeyPress={(e) => e.key === 'Enter' && handleSignIn()}
                disabled={isLoading}
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button
              onClick={handleSignIn}
              disabled={isLoading}
              className={styles.signInButton}
            >
              {isLoading ? 'Sending OTP...' : 'Sign in'}
            </button>
          </div>
        </div>
      </NoAuthLayout>
    )
  }

  // RENDER OTP PAGE
  if (currentPage === 'otp') {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <button onClick={handleBackToLogin} className={styles.backButton}>
            ← Back
          </button>

          <h1 className={styles.title}>Verify Your Email</h1>
          <p className={styles.subtitle}>We've sent a 6-digit code to</p>
          <p className={styles.email}>{email}</p>

          <div className={styles.otpContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={styles.otpInput}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            onClick={handleVerify}
            disabled={isLoading || otp.some((digit) => !digit)}
            className={styles.verifyButton}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>

          <div className={styles.resendContainer}>
            <span className={styles.resendText}>Didn't receive the code?</span>
            <button onClick={handleResend} className={styles.resendButton}>
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    )
  }

  // RENDER SUCCESS PAGE
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.successIcon}>✓</div>
        <h1 className={styles.title}>Verification Successful!</h1>
        <p className={styles.subtitle}>You have been successfully logged in</p>
        <button
          onClick={() =>
            navigate(isSignup ? `/context?isSignup=${isSignup}` : `/dashboard`)
          }
          className={styles.signInButton}
        >
          {isSignup ? 'Get Started' : 'Go to Dashboard'}
        </button>
      </div>
    </div>
  )
}

export default AuthFlow
