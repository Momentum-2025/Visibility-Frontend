/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import styles from './BrandInfoSection.module.css'
import {
  loadAllContextInfo,
  saveBrandInfo,
} from '../../services/contextService'
import type { BrandInfo } from '../../services/contextService'
import { useProject } from '../../contexts/ProjectContext'
import { APP_NAME } from '../../utils/common'
import { useCountries } from '../../hooks/useCountries'

const emptyBrand: BrandInfo = {
  name: '',
  description: '',
  id: '',
  website: '',
  country: '',
  createdBy: '',
  createdOn: '',
  updatedBy: '',
  updatedOn: '',
  competitors: [],
  alternativeNames: [],
  alternativeWebsite: [],
  personas: [],
  keyTopics: [],
}

// Helper to convert array to comma-separated string for display
const arrayToString = (arr: string[] | undefined): string => {
  return arr && arr.length > 0 ? arr.join(', ') : ''
}

// Helper to convert comma-separated string to array
const stringToArray = (str: string): string[] => {
  return str
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

export default function BrandInfoSection() {
  const { data: countries, isLoading } = useCountries()
  const [brand, setBrand] = useState<BrandInfo>(emptyBrand)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const { currentProjectId, setCurrentProjectId, projects, setProjects } =
    useProject()

  // Form state for string representations of array fields
  const [formValues, setFormValues] = useState({
    alternativeNames: '',
    alternativeWebsite: '',
  })

  useEffect(() => {
    document.title = `Context | ${APP_NAME}`
    //console.log(currentProjectId);
    // Load brand info from local storage or API
    if (currentProjectId && currentProjectId != '') {
      loadAllContextInfo().then((data) => {
        const currentBrand = data.filter((o) => o.id == currentProjectId)[0]
        if (data && currentBrand) {
          setBrand(currentBrand)
          // Convert arrays to strings for form display
          setFormValues({
            alternativeNames: arrayToString(currentBrand.alternativeNames),
            alternativeWebsite: arrayToString(currentBrand.alternativeWebsite),
          })
        }
      })
    }
    setLoading(false)
  }, [currentProjectId])

  function onFieldChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target

    // Handle array fields separately
    if (name === 'alternativeNames' || name === 'alternativeWebsite') {
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }))
    } else {
      setBrand((brand) => ({
        ...brand,
        [name]: value,
      }))
    }
    setSuccess(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    // Convert string form values to arrays before saving
    const brandToSave: BrandInfo = {
      ...brand,
      alternativeNames: stringToArray(formValues.alternativeNames),
      alternativeWebsite: stringToArray(formValues.alternativeWebsite),
      id: currentProjectId ?? '',
    }

    await saveBrandInfo(brandToSave).then((data) => {
      if (data && (!currentProjectId || currentProjectId == '')) {
        setCurrentProjectId(data.message)
        projects.push({
          id: data.message,
          name: brandToSave.name,
        })
      } else {
        setCurrentProjectId(brandToSave.id)
        setProjects(projects)
      }
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
    !brand ||
    (!brand.name &&
      !formValues.alternativeNames &&
      !brand.description &&
      !brand.country &&
      !brand.website)

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
            value={brand?.name}
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
            value={formValues.alternativeNames}
            onChange={onFieldChange}
            className={styles.input}
            placeholder="Comma-separated names"
          />
        </label>
        <label className={styles.textAreaLabel}>
          <span>Description</span>
          <textarea
            name="description"
            value={brand?.description}
            onChange={onFieldChange}
            rows={3}
            className={styles.input}
            placeholder="Describe your brand"
          />
        </label>
        <label>
          <span>Country</span>
          {isLoading && <div>Loading Countries..</div>}
          <select
          name='country'
            value={brand.country ?? ''}
            onChange={(e) => onFieldChange(e)}
            className={styles.input}
            disabled={isLoading}
          >
            <option value="" disabled>
              {isLoading ? 'Loading...' : 'Select Country'}
            </option>
            {countries?.map((country: any) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Website</span>
          <input
            name="website"
            value={brand?.website}
            onChange={onFieldChange}
            className={styles.input}
            placeholder="https://example.com"
          />
        </label>
        <label>
          <span>Alternative Websites</span>
          <input
            name="alternativeWebsite"
            value={formValues.alternativeWebsite}
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
