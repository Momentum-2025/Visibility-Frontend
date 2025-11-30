/* eslint-disable @typescript-eslint/no-explicit-any */
// components/context/AddPromptsSection.tsx
import React, { useState, useRef } from 'react'
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'
import { useProject } from '../../contexts/ProjectContext'
import { uploadPromptFile } from '../../services/fileService'
import styles from './AddPromptsSection.module.css'

interface UploadStatus {
  status: 'idle' | 'uploading' | 'success' | 'error'
  message?: string
  fileName?: string
}

export default function AddPromptsSection() {
  const { currentProjectId } = useProject()
  const [file, setFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ status: 'idle' })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase()
      if (fileExtension === 'csv' || fileExtension === 'xlsx') {
        setFile(selectedFile)
        setUploadStatus({ status: 'idle' })
      } else {
        setUploadStatus({
          status: 'error',
          message: 'Please select a CSV or XLSX file',
        })
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setUploadStatus({ status: 'idle' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus({
        status: 'error',
        message: 'Please select a file first',
      })
      return
    }

    if (!currentProjectId) {
      setUploadStatus({
        status: 'error',
        message: 'No project selected',
      })
      return
    }

    setUploadStatus({ status: 'uploading', fileName: file.name })

    try {
      const response = await uploadPromptFile(file, currentProjectId)

      if (response.status) {
        setUploadStatus({
          status: 'success',
          message: 'File uploaded successfully!',
          fileName: file.name,
        })
        // Reset after 3 seconds
        setTimeout(() => {
          setFile(null)
          setUploadStatus({ status: 'idle' })
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        }, 3000)
      } else {
        throw new Error(response.statusText || 'Upload failed')
      }
    } catch (error: any) {
      console.error('Error uploading file:', error)
      setUploadStatus({
        status: 'error',
        message: error.message || 'Failed to upload file. Please try again.',
      })
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      const fileExtension = droppedFile.name.split('.').pop()?.toLowerCase()
      if (fileExtension === 'csv' || fileExtension === 'xlsx') {
        setFile(droppedFile)
        setUploadStatus({ status: 'idle' })
      } else {
        setUploadStatus({
          status: 'error',
          message: 'Please select a CSV or XLSX file',
        })
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Upload Prompts</h2>
        <p className={styles.subtitle}>
          Upload a CSV or XLSX file containing prompts to add them to your project
        </p>
      </div>

      <div
        className={`${styles.uploadArea} ${file ? styles.hasFile : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {!file ? (
          <>
            <Upload className={styles.uploadIcon} size={48} />
            <p className={styles.uploadText}>
              Drag and drop your file here, or click to browse
            </p>
            <p className={styles.uploadSubtext}>Supported formats: CSV, XLSX</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileSelect}
              className={styles.fileInput}
              id="file-upload-input"
            />
            <label htmlFor="file-upload-input" className={styles.browseButton}>
              Browse Files
            </label>
          </>
        ) : (
          <div className={styles.filePreview}>
            <FileText className={styles.fileIcon} size={48} />
            <div className={styles.fileInfo}>
              <p className={styles.fileName}>{file.name}</p>
              <p className={styles.fileSize}>
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button
              onClick={handleRemoveFile}
              className={styles.removeButton}
              aria-label="Remove file"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>

      {uploadStatus.status === 'uploading' && (
        <div className={styles.statusMessage}>
          <div className={styles.spinner}></div>
          <p>Uploading {uploadStatus.fileName}...</p>
        </div>
      )}

      {uploadStatus.status === 'success' && (
        <div className={`${styles.statusMessage} ${styles.success}`}>
          <CheckCircle size={20} />
          <p>{uploadStatus.message}</p>
        </div>
      )}

      {uploadStatus.status === 'error' && (
        <div className={`${styles.statusMessage} ${styles.error}`}>
          <AlertCircle size={20} />
          <p>{uploadStatus.message}</p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploadStatus.status === 'uploading'}
        className={styles.uploadButton}
      >
        {uploadStatus.status === 'uploading' ? 'Uploading...' : 'Upload Prompts'}
      </button>

      <div className={styles.infoSection}>
        <h3 className={styles.infoTitle}>File Format Requirements</h3>
        <ul className={styles.infoList}>
          <li>CSV or XLSX format</li>
          <li>First row should contain column headers</li>
          <li>Include columns for prompt text, tags, and platform (if applicable)</li>
          <li>Maximum file size: 10MB</li>
        </ul>
      </div>
    </div>
  )
}