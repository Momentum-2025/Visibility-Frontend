/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { X, Upload } from 'lucide-react'
import { useProject } from '../../contexts/ProjectContext'
import { uploadPromptFile } from '../../services/fileService'

interface AddPromptProps {
  isOpen: boolean
  onClose: () => void
}

const AddPromptModal = ({ isOpen, onClose }: AddPromptProps) => {
  const [activeTab, setActiveTab] = useState('manual')
  const [promptText, setPromptText] = useState('')
  const [tags, setTags] = useState('')
  // const [platform, setPlatform] = useState('')
  const [file, setFile] = useState<any>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { currentProjectId } = useProject()

  const handleManualSubmit = () => {
    // console.log({ promptText, tags, platform })
    onClose()
  }

  const handleFileChange = (e: { target: { files: any[]; value: string } }) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase()
      if (fileExtension === 'csv' || fileExtension === 'xlsx') {
        setFile(selectedFile)
      } else {
        alert('Please select a CSV or XLSX file')
        e.target.value = ''
      }
    }
  }

  const handleFileSubmit = async () => {
    if (!file) {
      alert('Please select a file')
      return
    }

    setIsUploading(true)

    try {
      uploadPromptFile(file, currentProjectId ?? '')
        .then((res) => {
          if (res.status) {
            console.log('upload success')
            onClose()
          }
        })
        .catch(() => {
          console.log('Error while file upload')
          alert('Upload failed. Please try again.')
        })
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('An error occurred during upload')
    } finally {
      setIsUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
            Add New Prompt
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
          }}
        >
          <button
            onClick={() => setActiveTab('manual')}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              backgroundColor: activeTab === 'manual' ? 'white' : 'transparent',
              borderBottom:
                activeTab === 'manual'
                  ? '2px solid rgb(102,85,155)'
                  : '2px solid transparent',
              color: activeTab === 'manual' ? 'rgb(102,85,155)' : '#6b7280',
              fontWeight: activeTab === 'manual' ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Manual Entry
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              backgroundColor: activeTab === 'upload' ? 'white' : 'transparent',
              borderBottom:
                activeTab === 'upload'
                  ? '2px solid #3b82f6'
                  : '2px solid transparent',
              color: activeTab === 'upload' ? '#3b82f6' : '#6b7280',
              fontWeight: activeTab === 'upload' ? '600' : '400',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Upload File
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'manual' ? (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                  }}
                >
                  Prompt Text
                </label>
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  style={{
                    width: '95%',
                    minHeight: '120px',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                  placeholder="Enter your prompt text..."
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                  }}
                >
                  Tags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  style={{
                    width: '95%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                  placeholder="Enter tags (comma separated)"
                />
              </div>

              {/* <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '500',
                  }}
                >
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  style={{
                    width: '95%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                >
                  <option value="">Select a platform</option>
                  <option value="web">Web</option>
                  <option value="mobile">Mobile</option>
                  <option value="api">API</option>
                </select>
              </div> */}
            </>
          ) : (
            <div>
              <div
                style={{
                  border: '2px dashed #d1d5db',
                  borderRadius: '8px',
                  padding: '40px 20px',
                  textAlign: 'center',
                  backgroundColor: '#f9fafb',
                }}
              >
                <Upload
                  size={48}
                  style={{ margin: '0 auto 16px', color: '#9ca3af' }}
                />
                <p
                  style={{
                    marginBottom: '8px',
                    fontWeight: '500',
                    color: '#374151',
                  }}
                >
                  Upload CSV or XLSX file
                </p>
                <p
                  style={{
                    marginBottom: '16px',
                    fontSize: '14px',
                    color: '#6b7280',
                  }}
                >
                  Select a file containing prompts to upload
                </p>
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={() => handleFileChange}
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    backgroundColor: 'rgb(102,85,155)',
                    color: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  Choose File
                </label>
                {file && (
                  <p
                    style={{
                      marginTop: '16px',
                      fontSize: '14px',
                      color: '#059669',
                      fontWeight: '500',
                    }}
                  >
                    Selected: {file.name}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            padding: '20px',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Cancel
          </button>
          <button
            onClick={
              activeTab === 'manual' ? handleManualSubmit : handleFileSubmit
            }
            disabled={isUploading}
            style={{
              padding: '8px 16px',
              border: 'none',
              backgroundColor: isUploading ? '#9ca3af' : 'rgb(102,85,155)',
              color: 'white',
              borderRadius: '4px',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            {isUploading
              ? 'Uploading...'
              : activeTab === 'manual'
                ? 'Add Prompt'
                : 'Upload File'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddPromptModal
// // Demo wrapper
// export default function App() {
//   const [isModalOpen, setIsModalOpen] = useState(true);

//   return (
//     <div style={{ padding: '20px' }}>
//       <button
//         onClick={() => setIsModalOpen(true)}
//         style={{
//           padding: '10px 20px',
//           backgroundColor: '#3b82f6',
//           color: 'white',
//           border: 'none',
//           borderRadius: '4px',
//           cursor: 'pointer',
//           fontSize: '16px',
//         }}
//       >
//         Open Modal
//       </button>
//       <AddPromptModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//       />
//     </div>
//   );
// }
