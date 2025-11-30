import React, { useState } from 'react'
import styles from './AppLayout.module.css'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import UserSwitcher from '../components/profile/UserSwitcher'
import { TbHome, TbFileText, TbBulb, TbQuote, TbCommand } from 'react-icons/tb'
import ManageAccountModal from '../components/profile/ManageAccountModal'

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: <TbHome size={22} /> },
  { label: 'Prompts', to: '/prompts', icon: <TbFileText size={22} /> },
  { label: 'Insights', to: '/insights', icon: <TbBulb size={22} /> },
  { label: 'Citations', to: '/citations', icon: <TbQuote size={22} /> },
  { label: 'Context', to: '/context', icon: <TbCommand size={22} /> },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const urlParams = new URLSearchParams(window.location.search)
  const isNewUser = urlParams.get('isSignup')

  return (
    <div className={styles.layout}>
      {!isNewUser && (
        <>
          <nav className={styles.sidebar}>
            <NavLink to={'/dashboard'} className={styles.logo}>
              <TbBulb size={22} />
              Visibility Ai
            </NavLink>
            <UserSwitcher />
            <ul className={styles.menu}>
              {navItems.map(({ label, to, icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      isActive
                        ? `${styles.menuItem} ${styles.active}`
                        : styles.menuItem
                    }
                  >
                    <span className={styles.icon}>{icon}</span>
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className={styles.bottomSection}>
              <button className={styles.logout} onClick={handleLogout}>
                Log out
              </button>
              <button
                onClick={() => setShowModal(true)}
                className={styles.profile}
              >
                <div className={styles.avatar}>{(user?.email ?? 'U')[0]}</div>
                <span>{user?.email}</span>
              </button>
            </div>
          </nav>

          <ManageAccountModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            userEmail={user?.email}
            userName={user?.fullName}
            company="Hevo"
          />
        </>
      )}

      {isNewUser && (
        <div className={styles.newUserSideBar}>
          <div>
            <h2 className={styles.newUserSideBarHeading}>
              Welcome to Visibility AI
            </h2>
            <p
              className={styles.newUserSideBarSubHeading}
              style={{ marginTop: '12px' }}
            >
              AI search analytics for marketing teams
            </p>
          </div>

          <div>
            <h3
              className={styles.newUserSideBarHeading}
              style={{ fontSize: '18px', marginBottom: '16px' }}
            >
              Get Started
            </h3>
            <div className={styles.getStartedSection}>
              <div className={styles.newUserSideBarSubHeading}>
                Create Your Brand
              </div>
              <div className={styles.newUserSideBarSubHeading}>
                Add Your Competitors
              </div>
              <div className={styles.newUserSideBarSubHeading}>
                Add Your Key Topics
              </div>
              <div className={styles.newUserSideBarSubHeading}>
                Add Personas
              </div>
            </div>
          </div>
        </div>
      )}

      <main className={styles.content}>{children}</main>
    </div>
  )
}
