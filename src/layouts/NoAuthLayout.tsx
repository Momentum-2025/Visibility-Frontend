import React from 'react'
import styles from './NoAuthLayout.module.css'

export default function NoAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <div className={styles.backgroundPattern}></div>
        <div className={styles.contentWrapper}>
          <div className={styles.logoSection}>
            <div className={styles.logoIcon}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                <path d="M24 8 L24 24 L36 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="24" cy="24" r="3" fill="currentColor"/>
              </svg>
            </div>
            <h1 className={styles.heading}>Visibility AI</h1>
          </div>
          
          <div className={styles.taglineSection}>
            <h2 className={styles.mainTagline}>
              Be Found Where It Matters
            </h2>
            <p className={styles.subTagline}>
              Optimize your brand's presence in AI-powered search results
            </p>
          </div>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🎯</div>
              <div className={styles.featureText}>
                <h3>AI Result Analytics</h3>
                <p>Track how your products appear in ChatGPT, Perplexity, and more</p>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📊</div>
              <div className={styles.featureText}>
                <h3>Visibility Insights</h3>
                <p>Get actionable recommendations to improve your AI presence</p>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🚀</div>
              <div className={styles.featureText}>
                <h3>Competitive Edge</h3>
                <p>Stay ahead with real-time monitoring and benchmarking</p>
              </div>
            </div>
          </div>

          <div className={styles.statsSection}>
            <div className={styles.stat}>
              <div className={styles.statNumber}>67%</div>
              <div className={styles.statLabel}>Of users trust AI recommendations</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>3.2B</div>
              <div className={styles.statLabel}>AI searches per month</div>
            </div>
          </div>
        </div>
      </div>
      <main className={styles.content}>{children}</main>
    </div>
  )
}