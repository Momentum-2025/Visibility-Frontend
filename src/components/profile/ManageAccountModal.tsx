import React, { useState } from 'react';
import { X, User, Shield,
    // Mail, Building, Key, Bell, 
    // Trash2 
} from 'lucide-react';
import styles from './ManageAccountModal.module.css';

interface ManageAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userName?: string;
  company?: string;
}

export default function ManageAccountModal({ 
  isOpen, 
  onClose, 
  userEmail = 'vsntraveldiary@gmail.com',
  userName = 'Vishnu',
//   company = 'Hevo'
}: ManageAccountModalProps) {
  const [activeTab, setActiveTab] = useState('profile');

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className={styles.overlay} onClick={onClose} />

      {/* Modal */}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2>Manage Account</h2>
            <p>{userEmail}</p>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {[
            { id: 'profile', label: 'Profile', icon: <User size={18} /> },
            // { id: 'security', label: 'Security', icon: <Shield size={18} /> },
            // { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={styles.content}>
          {activeTab === 'profile' && (
            <div className={styles.profileSection}>
              {/* Profile Photo */}
              <div className={styles.profilePhotoSection}>
                <div className={styles.avatar}>
                  {(userName || userEmail)[0].toUpperCase()}
                </div>
                {/* <div>
                  <button className={styles.photoButton}>
                    Change Photo
                  </button>
                  <p className={styles.photoHint}>
                    JPG, PNG or GIF. Max size 2MB
                  </p>
                </div> */}
              </div>

              {/* Display Data */}
              <div className={styles.formFields}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Full Name</label>
                  <div className={styles.displayValue}>{userName}</div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address</label>
                  <div className={styles.displayValue}>{userEmail}</div>
                </div>

                {/* <div className={styles.formGroup}>
                  <label className={styles.label}>Company</label>
                  <div className={styles.displayValue}>{company}</div>
                </div> */}

                {/* <div className={styles.formGroup}>
                  <label className={styles.label}>Role</label>
                  <div className={styles.displayValue}>Marketing Manager</div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Member Since</label>
                  <div className={styles.displayValue}>November 2024</div>
                </div> */}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className={styles.securitySection}>
              <div className={styles.warningBox}>
                <Shield size={20} color="#d97706" className={styles.warningIcon} />
                <div>
                  <p className={styles.warningTitle}>Security Notice</p>
                  <p className={styles.warningText}>
                    You're signed in with Google. Password management is handled by your Google account.
                  </p>
                </div>
              </div>

              <div className={styles.settingCard}>
                <div className={styles.settingInfo}>
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <button className={styles.primaryButton}>Enable</button>
              </div>

              <div className={styles.settingCard}>
                <div className={styles.settingInfo}>
                  <h4>Active Sessions</h4>
                  <p>Manage your active sessions across devices</p>
                </div>
                <button className={styles.secondaryButton}>View All</button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className={styles.notificationsSection}>
              {[
                {
                  title: 'Email Notifications',
                  desc: 'Receive email updates about your account activity',
                  enabled: true,
                },
                {
                  title: 'Visibility Changes',
                  desc: 'Get notified when your brand visibility changes significantly',
                  enabled: true,
                },
                {
                  title: 'Weekly Reports',
                  desc: 'Receive weekly summary of your AI presence',
                  enabled: false,
                },
                {
                  title: 'Competitor Updates',
                  desc: 'Alerts when competitors make significant moves',
                  enabled: true,
                },
                {
                  title: 'Product Updates',
                  desc: 'News about new features and improvements',
                  enabled: false,
                },
              ].map((item, i) => (
                <div key={i} className={styles.notificationCard}>
                  <div className={styles.notificationInfo}>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                  <label className={styles.toggleSwitch}>
                    <input type="checkbox" defaultChecked={item.enabled} />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {/* <div className={styles.footer}>
          <button className={styles.deleteButton}>
            <Trash2 size={16} />
            Delete Account
          </button>
          <div className={styles.footerActions}>
            <button onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button className={styles.saveButton}>
              Save Changes
            </button>
          </div>
        </div> */}
      </div>
    </>
  );
}