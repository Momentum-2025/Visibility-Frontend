import React, { useEffect, useState } from 'react'
import styles from './BrandInfoSection.module.css'
import { loadBrandInfo, saveBrandInfo } from '../../services/contextService'
import type { BrandInfo } from '../../services/contextService'
import { useProject } from '../../contexts/ProjectContext'

const emptyBrand: BrandInfo = {
  name: '',
  alternativeNames: '',
  description: '',
  country: '',
  websites: '',
}

export default function BrandInfoSection() {
  const [brand, setBrand] = useState<BrandInfo>(emptyBrand)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const { currentProjectId, setCurrentProjectId } = useProject()

  useEffect(() => {
    // Load brand info from local storage or API
    if (currentProjectId)
      loadBrandInfo(currentProjectId).then((data) => {
        if (data) setBrand(data)
      })
    setLoading(false) // Always set loading false, even if no data
  }, [currentProjectId])

  function onFieldChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setBrand((brand) => ({
      ...brand,
      [e.target.name]: e.target.value,
    }))
    setSuccess(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await saveBrandInfo(brand).then((data) => {
      if (data) setCurrentProjectId(data.brandInfo.id)
    })
    setSaving(false)
    setSuccess(true)
  }

  if (loading)
    return (
      <section className={styles.card}>
        <div className={styles.loading}>Loading...</div>
      </section>
    )

  // Brand is empty if all fields empty or only empty strings
  const isEmpty =
    !brand.name &&
    !brand.alternativeNames &&
    !brand.description &&
    !brand.country &&
    !brand.websites
  return (
    <section className={styles.card}>
      <div className={styles.sectionHeader}>
        <h2>Brand Information</h2>
        {success && <span className={styles.success}>Saved!</span>}
      </div>

      {isEmpty ? <p>Please enter brand information below:</p> : null}

      <form
        className={styles.gridForm}
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <label>
          <span>Brand Name</span>
          <input
            name="name"
            value={brand.name}
            onChange={onFieldChange}
            required
            className={styles.input}
            placeholder="Your brand's main name"
          />
        </label>
        <label>
          <span>Alternative Names</span>
          <input
            name="alternativeNames"
            value={brand.alternativeNames}
            onChange={onFieldChange}
            className={styles.input}
            placeholder="Comma-separated names"
          />
        </label>
        <label className={styles.textAreaLabel}>
          <span>Description</span>
          <textarea
            name="description"
            value={brand.description}
            onChange={onFieldChange}
            rows={3}
            className={styles.input}
            placeholder="Describe your brand"
          />
        </label>
        <label>
          <span>Country</span>
          <input
            name="country"
            value={brand.country}
            onChange={onFieldChange}
            className={styles.input}
            placeholder="Brand's primary country"
          />
        </label>
        <label>
          <span>Alternative Websites</span>
          <input
            name="websites"
            value={brand.websites}
            onChange={onFieldChange}
            className={styles.input}
            placeholder="Comma-separated URLs"
          />
        </label>
        <div className={styles.buttonsRow}>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </section>
  )
}
