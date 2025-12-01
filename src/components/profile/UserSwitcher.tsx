import { useState } from 'react'
import styles from './UserSwitcher.module.css'
import { useProject, type Project } from '../../contexts/ProjectContext'

export default function UserSwitcher() {
  const { projects, setCurrentProjectId, currentProjectId } = useProject()
  const [currentProfile, setCurrentProfile] = useState<Project>(
    projects.filter((o) => o.id == currentProjectId)[0] ?? projects[0],
  )
  const [dropdownOpen, setDropdownOpen] = useState(false)

  function handleSwitch(profile: Project) {
    setCurrentProjectId(profile.id)
    setCurrentProfile(profile)
    setDropdownOpen(false)
  }

  return (
    <div className={styles.navProfile}>
      <div className={styles.profileAvatar}>{currentProfile?.name[0]}</div>
      <button
        className={styles.profileName}
        onClick={() => setDropdownOpen((v) => !v)}
      >
        {currentProfile?.name}
        <span className={styles.dropdownArrow}>&#9662;</span>
      </button>
      {dropdownOpen && (
        <div className={styles.profileDropdown}>
          {projects.map((profile: { id: string; name: string }) => (
            <button key={profile.id} onClick={() => handleSwitch(profile)}>
              {profile.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
