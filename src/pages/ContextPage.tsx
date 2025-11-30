import React, { useState } from 'react'
import BrandInfoSection from '../components/context/BrandInfoSection'
import PersonaSection from '../components/context/PersonaSection'
import CompetitorSection from '../components/context/CompetitorSection'
import TopicSection from '../components/context/TopicSection'
import ExportCsvButton from '../components/context/ExportCsvButton'
import AddPromptsSection from '../components/prompt/AddPromptsSection'
import styles from './ContextPage.module.css'
import AppLayout from '../layouts/AppLayout'
import { useNavigate } from 'react-router-dom'

export default function ContextPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('brand')
  const urlParams = new URLSearchParams(window.location.search)
  const isNewUser = urlParams.get('isSignup')
  
  const tabs = [
    { id: 'brand', label: 'Brand Info' },
    { id: 'persona', label: 'Persona' },
    { id: 'competitor', label: 'Competitors' },
    { id: 'topic', label: 'Topics' },
    { id: 'prompts', label: 'Add Prompts' },
    { id: 'export', label: 'Exports' },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'brand':
        return <BrandInfoSection />
      case 'persona':
        return <PersonaSection />
      case 'competitor':
        return <CompetitorSection />
      case 'topic':
        return <TopicSection />
      case 'prompts':
        return <AddPromptsSection />
      case 'export':
        return <ExportCsvButton />
      default:
        return null
    }
  }

  return (
    <AppLayout>
      <div className={styles.contextWrapper}>
        <div className={styles.header}>
          <h1 className={styles.heading}>Context</h1>
        </div>

        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            {tabs
              .filter((o) => !isNewUser || (isNewUser && o.id !== 'export'))
              .map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
          </div>

          <div className={styles.tabContent}>{renderTabContent()}</div>
        </div>

        {isNewUser && (
          <div>
            <button
              key={''}
              className={`${styles.nextBtn}`}
              onClick={() => {
                if (activeTab === 'prompts') {
                  navigate('/dashboard')
                } else {
                  setActiveTab(
                    tabs[
                      tabs.indexOf(tabs.filter((o) => o.id === activeTab)[0]) + 1
                    ].id,
                  )
                }
              }}
            >
              {activeTab === 'prompts' ? 'Go To Dashboard' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}