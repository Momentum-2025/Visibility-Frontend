/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './contextService'

export async function uploadPromptFile(file: any, projectId: string) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('ContextId', projectId)
  //console.log(file)
  // Replace with your actual backend endpoint
  const response = await api.post('/api/Prompt/bulk-upload', formData)

  return response
}

export async function exportContextData(): Promise<void> {
  try {
    const response = await api.get('/context/export', {
      responseType: 'blob',
    })

    // Create a download link
    const url = window.URL.createObjectURL(response.data)
    const link = document.createElement('a')
    link.href = url

    // Set filename from response header or use default
    const contentDisposition = response.headers['content-disposition']
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
      : `context-export-${new Date().toISOString().split('T')[0]}.csv`

    link.download = filename

    // Trigger download
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting context data:', error)
    throw error
  }
}

// Alternative function if you want to export as JSON
export async function exportContextDataAsJson(): Promise<void> {
  try {
    const response = await api.get('/context/export', {
      params: { format: 'json' },
    })

    const data = response.data

    // Convert to JSON blob
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `context-export-${new Date().toISOString().split('T')[0]}.json`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting context data as JSON:', error)
    throw error
  }
}
