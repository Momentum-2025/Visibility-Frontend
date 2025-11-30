import React, { useEffect, useState } from 'react'
import styles from './CompetitorSection.module.css'
import {
  loadAllContextInfo,
  saveCompetitor,
  deleteCompetitors,
} from '../../services/contextService'
import type { CompetitorInfo } from '../../services/contextService'
import { useProject } from '../../contexts/ProjectContext'

const emptyCompetitor: CompetitorInfo = {
  name: '',
  id: '',
  alternativeNames: null,
  websites: []
}

// Helper to convert array to comma-separated string for display
const arrayToString = (arr: string[] | null | undefined): string => {
  if (!arr || arr.length === 0) return ''
  return arr.join(', ')
}

// Helper to convert comma-separated string to array
const stringToArray = (str: string): string[] => {
  if (!str || str.trim() === '') return []
  return str
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0)
}

export default function CompetitorSection() {
  const [competitors, setCompetitors] = useState<CompetitorInfo[]>([])
  const [form, setForm] = useState<CompetitorInfo>(emptyCompetitor)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const { currentProjectId } = useProject()

  // Form state for string representations of array fields
  const [formValues, setFormValues] = useState({
    alternativeNames: '',
    websites: ''
  })

  useEffect(() => {
    if (currentProjectId)
      loadAllContextInfo().then((data) => {
        setCompetitors(data[0]?.competitors || [])
      })
    setLoading(false)
  }, [currentProjectId])

  function handleField(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target

    // Handle array fields separately
    if (name === 'alternativeNames' || name === 'websites') {
      setFormValues(prev => ({
        ...prev,
        [name]: value
      }))
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  async function handleAddCompetitor(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    // Convert string form values to arrays before saving
    const competitorToSave: CompetitorInfo = {
      ...form,
      alternativeNames: formValues.alternativeNames 
        ? stringToArray(formValues.alternativeNames) 
        : null,
      websites: stringToArray(formValues.websites)
    }

    competitorToSave.id = Date.now().toString();

    const newList = [...competitors, competitorToSave]
    await saveCompetitor(currentProjectId ?? '', competitorToSave)
    setCompetitors(newList)
    setForm(emptyCompetitor)
    setFormValues({ alternativeNames: '', websites: '' })
    setShowForm(false)
    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 1200)
  }

  async function handleRemove(idx: string) {
    const newList = competitors.filter((_c) => _c.id !== idx)
    await deleteCompetitors(currentProjectId ?? '', idx)
    setCompetitors(newList)
  }

  if (loading) return <section className={styles.card}>Loading...</section>
  if (!currentProjectId)
    return (
      <section className={styles.card}>
        Create your brand to add competitor
      </section>
    )

  return (
    <section className={styles.card}>
      <div className={styles.sectionHeader}>
        <h2>Competitors</h2>
        <button className={styles.addBtn} onClick={() => setShowForm(true)}>
          + New Competitor
        </button>
        {success && <span className={styles.success}>Saved!</span>}
      </div>
      {showForm && (
        <form className={styles.formGrid} onSubmit={handleAddCompetitor}>
          <input
            name="name"
            value={form.name}
            onChange={handleField}
            required
            className={styles.input}
            placeholder="Competitor name"
          />
          <input
            name="alternativeNames"
            value={formValues.alternativeNames}
            onChange={handleField}
            className={styles.input}
            placeholder="Alternative names (comma-separated)"
          />
          <input
            name="websites"
            value={formValues.websites}
            onChange={handleField}
            className={styles.input}
            placeholder="Website URLs (comma-separated)"
          />
          <div className={styles.formButtons}>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? 'Saving...' : 'Add'}
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => {
                setShowForm(false)
                setForm(emptyCompetitor)
                setFormValues({ alternativeNames: '', websites: '' })
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <table className={styles.tableGrid}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Alternative Names</th>
            <th>Websites</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {competitors?.map((c, idx) => (
            <tr key={idx}>
              <td>{c.name}</td>
              <td>{arrayToString(c.alternativeNames)}</td>
              <td>{arrayToString(c.websites)}</td>
              <td>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleRemove(c.id)}
                  title="Delete competitor"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}