import React from 'react'
import styles from './AppLayout.module.css'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import UserSwitcher from '../components/profile/UserSwitcher'
import {
  TbHome,
  TbFileText,
  TbBulb,
  TbQuote,
  // TbClipboardCheck,
  // TbRobot,
  TbCommand,
  // TbUsers,
} from 'react-icons/tb'

// Update navItems:
const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: <TbHome size={22} /> },
  { label: 'Prompts', to: '/prompts', icon: <TbFileText size={22} /> },
  { label: 'Insights', to: '/insights', icon: <TbBulb size={22} /> },
  { label: 'Citations', to: '/citations', icon: <TbQuote size={22} /> },
  // {
  //   label: 'Site Audits',
  //   to: '/site-audits',
  //   icon: <TbClipboardCheck size={22} />,
  // },
  // { label: 'AI Referrals', to: '/ai-referrals', icon: <TbRobot size={22} /> },
  { label: 'Context', to: '/context', icon: <TbCommand size={22} /> },
  // { label: 'Team Members', to: '/team', icon: <TbUsers size={22} /> },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const handleLogout = () => {
    // Your logout logic here
    // e.g. clear auth tokens, redirect to login page
    logout()
    navigate('/')
  }
  return (
    <div className={styles.layout}>
      <nav className={styles.sidebar}>
        <NavLink to={'/dashboard'} className={styles.logo}>
          <TbBulb size={22} />
          AgentX
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
        {/* <div className={styles.upgrade}>
          <div className={styles.upgradeTitle}>Upgrade to Pro</div>
          <div className={styles.upgradeDesc}>Get 1 month free and unlock</div>
          <button className={styles.upgradeBtn}>Upgrade</button>
        </div> */}

        <div className={styles.bottomSection}>
          {/* <NavLink to="/help" className={styles.infoItem}>
            Help & information
          </NavLink> */}
          <button className={styles.logout} onClick={handleLogout}>
            Log out
          </button>
          <NavLink to="/profile" className={styles.profile}>
            <img src="/avatar.svg" className={styles.avatar} alt="user" />
            <span>akshay.krishnan@hevo...</span>
          </NavLink>
        </div>
      </nav>
      <main className={styles.content}>{children}</main>
    </div>
  )
}
