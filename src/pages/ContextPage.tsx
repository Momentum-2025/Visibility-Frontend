import React from 'react'
import BrandInfoSection from '../components/context/BrandInfoSection'
import PersonaSection from '../components/context/PersonaSection'
import CompetitorSection from '../components/context/CompetitorSection'
import TopicSection from '../components/context/TopicSection'
import ExportCsvButton from '../components/context/ExportCsvButton'
import styles from './ContextPage.module.css'
import AppLayout from '../layouts/AppLayout'

export default function ContextPage() {
  return (
    <AppLayout>
      <div className={styles.contextWrapper}>
        <h1 className={styles.heading}>Context Overview</h1>
        <div className={styles.sections}>
          <BrandInfoSection />
          <PersonaSection />
          <CompetitorSection />
          <TopicSection />
          <ExportCsvButton />
        </div>
      </div>
    </AppLayout>
  )
}
