import React, { useEffect, useState } from 'react'
import styles from './TopicSection.module.css'
import { deleteTopic, loadAllContextInfo, saveTopic } from '../../services/contextService'
import type { Topic } from '../../services/contextService'
import { useProject } from '../../contexts/ProjectContext'

const emptyTopic: Topic = { topic: '' }

export default function TopicSection() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [form, setForm] = useState<Topic>(emptyTopic)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const { currentProjectId } = useProject()

  useEffect(() => {
    if (currentProjectId)
      loadAllContextInfo().then((data) => {
        if(data) setTopics(data.filter(o => o.id == currentProjectId)[0].keyTopics)
      })
    setLoading(false)
  }, [currentProjectId])

  function handleField(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleAddTopic(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const newList = [...topics, form]
    await saveTopic(currentProjectId ?? '', form)
    setTopics(newList)
    setForm(emptyTopic)
    setShowForm(false)
    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 1200)
  }

  async function handleRemove(idx: string) {
    const newList = topics.filter((_t) => _t.topic !== idx)
    await deleteTopic(currentProjectId ?? '', idx)
    setTopics(newList)
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
        <h2>Key Topics</h2>
        <button className={styles.addBtn} onClick={() => setShowForm(true)}>
          + New Topic
        </button>
        {success && <span className={styles.success}>Saved!</span>}
      </div>
      {showForm && (
        <form className={styles.formGrid} onSubmit={handleAddTopic}>
          <input
            name="topic"
            value={form.topic}
            onChange={handleField}
            required
            className={styles.input}
            placeholder="Topic name"
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {topics?.map((t, idx) => (
            <tr key={idx}>
              <td>{t.topic}</td>
              <td>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleRemove(t.topic)}
                  title="Delete topic"
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
