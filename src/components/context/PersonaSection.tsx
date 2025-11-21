import React, { useEffect, useState } from 'react'
import styles from './PersonaSection.module.css'
import { loadAllContextInfo, savePersonas } from '../../services/contextService'
import type { Persona } from '../../services/contextService'
import { useProject } from '../../contexts/ProjectContext'

const emptyPersona: Persona = { name: '', description: '', countries: '' }

export default function PersonaSection() {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [form, setForm] = useState<Persona>(emptyPersona)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const { currentProjectId } = useProject()

  useEffect(() => {
    if (currentProjectId)
      loadAllContextInfo('system').then((data) => {
        setPersonas(data[0].personas)
      })
    setLoading(false)
  }, [currentProjectId])

  function handleField(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleAddPersona(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const newList = [...personas, form]
    await savePersonas(currentProjectId ?? '', newList)
    setPersonas(newList)
    setSaving(false)
    setShowForm(false)
    setForm(emptyPersona)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 1200)
  }

  async function handleRemove(idx: number) {
    const newList = personas.filter((_p, i) => i !== idx)
    await savePersonas(currentProjectId ?? '', newList)
    setPersonas(newList)
  }

  if (loading) return <section className={styles.card}>Loading...</section>

  if(!currentProjectId)
    return <section className={styles.card}>Create your brand to add persona</section>

  return (
    <section className={styles.card}>
      <div className={styles.sectionHeader}>
        <h2>Customer Personas</h2>
        <button className={styles.addBtn} onClick={() => setShowForm(true)}>
          + New Persona
        </button>
        {success && <span className={styles.success}>Saved!</span>}
      </div>

      {showForm && (
        <form className={styles.formGrid} onSubmit={handleAddPersona}>
          <input
            name="name"
            value={form.name}
            onChange={handleField}
            required
            className={styles.input}
            placeholder="Persona name"
          />
          <input
            name="countries"
            value={form.countries}
            onChange={handleField}
            className={styles.input}
            placeholder="Countries (comma-separated)"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleField}
            rows={2}
            required
            className={styles.input}
            placeholder="Description"
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
            <th>Description</th>
            <th>Countries</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {personas.map((p, idx) => (
            <tr key={idx}>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{p.countries}</td>
              <td>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleRemove(idx)}
                  title="Delete persona"
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
