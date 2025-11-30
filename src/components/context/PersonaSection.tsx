import React, { useEffect, useState } from 'react'
import styles from './PersonaSection.module.css'
import { loadAllContextInfo, savePersona } from '../../services/contextService'
import { deletePersona, type Persona } from '../../services/contextService'
import { useProject } from '../../contexts/ProjectContext'

const emptyPersona: Persona = { id: '', name: '', description: '', targetCountry: '' }

export default function PersonaSection() {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [form, setForm] = useState<Persona>(emptyPersona)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const { currentProjectId } = useProject()

  useEffect(() => {
    if (currentProjectId)
      loadAllContextInfo().then((data) => {
        if (data) setPersonas(data[0]?.personas || [])
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

    let newList: Persona[]
    if (editingIndex !== null) {
      // Update existing persona
      newList = personas.map((p, i) => (i === editingIndex ? form : p))
    } else {
      // Add new persona
      newList = [...personas, form]
    }

    await savePersona(currentProjectId ?? '', form)
    setPersonas(newList)
    setSaving(false)
    setShowForm(false)
    setForm(emptyPersona)
    setEditingIndex(null)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 1200)
  }

  function handleEdit(idx: number) {
    setForm(personas[idx])
    setEditingIndex(idx)
    setShowForm(true)
  }

  function handleCancel() {
    setShowForm(false)
    setForm(emptyPersona)
    setEditingIndex(null)
  }

  async function handleRemove(idx: string) {
    const newList = personas.filter((_p) => _p.id !== idx)
    // If removing the persona being edited, close the form
    if (editingIndex && personas[editingIndex].id === idx) {
      handleCancel()
    }
    await deletePersona(currentProjectId ?? '', idx)
    setPersonas(newList)
  }

  if (loading) return <section className={styles.card}>Loading...</section>

  if (!currentProjectId)
    return <section className={styles.card}>Create your brand to add persona</section>

  return (
    <section className={styles.card}>
      <div className={styles.sectionHeader}>
        <h2>Customer Personas</h2>
        <button 
          className={styles.addBtn} 
          onClick={() => {
            setForm(emptyPersona)
            setEditingIndex(null)
            setShowForm(true)
          }}
          disabled={showForm}
        >
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
            name="targetCountry"
            value={form.targetCountry}
            onChange={handleField}
            required
            className={styles.input}
            placeholder="Target Country"
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
              {saving ? 'Saving...' : editingIndex !== null ? 'Update' : 'Add'}
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={handleCancel}
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
          {personas?.map((p, idx) => (
            <tr key={idx}>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{p.targetCountry}</td>
              <td>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleEdit(idx)}
                  title="Edit persona"
                  style={{ marginRight: '8px' }}
                >
                  ✎
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleRemove(p.id)}
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