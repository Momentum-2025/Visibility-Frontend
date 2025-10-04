import React, { useEffect, useState } from 'react'
import styles from './CompetitorSection.module.css'
import { loadCompetitors, saveCompetitors } from '../../services/contextService'
import type { Competitor } from '../../services/contextService'
import { useProject } from '../../contexts/ProjectContext'

const emptyCompetitor: Competitor = {
  name: '',
  alternativeNames: '',
  websites: '',
}

export default function CompetitorSection() {
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [form, setForm] = useState<Competitor>(emptyCompetitor)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const { currentProjectId } = useProject()

  useEffect(() => {
    if (currentProjectId)
      loadCompetitors(currentProjectId ?? '').then((data) => {
        setCompetitors(data)
      })
    setLoading(false)
  }, [currentProjectId])

  function handleField(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleAddCompetitor(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const newList = [...competitors, form]
    await saveCompetitors(currentProjectId ?? '', newList)
    setCompetitors(newList)
    setForm(emptyCompetitor)
    setShowForm(false)
    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 1200)
  }

  async function handleRemove(idx: number) {
    const newList = competitors.filter((_c, i) => i !== idx)
    await saveCompetitors(currentProjectId ?? '', newList)
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
            value={form.alternativeNames}
            onChange={handleField}
            className={styles.input}
            placeholder="Alternative names"
          />
          <input
            name="websites"
            value={form.websites}
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
              onClick={() => setShowForm(false)}
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
          {competitors.map((c, idx) => (
            <tr key={idx}>
              <td>{c.name}</td>
              <td>{c.alternativeNames}</td>
              <td>{c.websites}</td>
              <td>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleRemove(idx)}
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
