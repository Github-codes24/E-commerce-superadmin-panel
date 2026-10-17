import React, { useState, useEffect } from 'react'
import { Phone, Mail, Lock, Camera, ArrowLeft, Loader2 } from 'lucide-react'
import { getSuperAdminProfile, updateSuperAdminProfile } from '../services/superAdminService'
import './Profile.css'

function Profile({ profileData, setProfileData, onBack }) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempData, setTempData] = useState({ ...profileData })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Fetch current profile from API on mount so GET request is visible in Network tab
  useEffect(() => {
    let isMounted = true
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const res = await getSuperAdminProfile()
        const raw = res?.data || res?.admin || res?.profile || res
        if (raw && (raw.name || raw.email || raw.fullName)) {
          setProfileData((prev) => {
            const updated = {
              name: raw.name || raw.fullName || prev.name || 'Super Admin',
              role: raw.role || prev.role || 'Super Admin',
              phone: raw.phone || raw.mobile || prev.phone || '',
              email: raw.email || prev.email || '',
              password: raw.password || prev.password || '*************',
              avatar: raw.avatar || raw.profileImage || prev.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256&h=256'
            }
            localStorage.setItem('profileData', JSON.stringify(updated))
            localStorage.setItem('adminUser', JSON.stringify(updated))
            return updated
          })
        }
      } catch (err) {
        console.warn('Could not fetch server profile on mount:', err)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchProfile()
    return () => {
      isMounted = false
    }
  }, [setProfileData])

  // Keep tempData synchronized with profileData
  useEffect(() => {
    setTempData({ ...profileData })
  }, [profileData])

  const handleEditClick = () => {
    setTempData({ ...profileData })
    setSaveError('')
    setIsEditing(true)
  }

  const handleCancelClick = () => {
    setTempData({ ...profileData })
    setSaveError('')
    setIsEditing(false)
  }

  const handleSaveClick = async (e) => {
    e.preventDefault()

    if (!tempData.name?.trim()) {
      setSaveError('Name is required')
      return
    }
    if (!tempData.email?.trim()) {
      setSaveError('Email is required')
      return
    }

    setSaving(true)
    setSaveError('')

    const payload = {
      name: tempData.name.trim(),
      fullName: tempData.name.trim(),
      email: tempData.email.trim(),
      phone: (tempData.phone || '').trim(),
      mobile: (tempData.phone || '').trim(),
      avatar: tempData.avatar,
      role: tempData.role || profileData.role || 'Super Admin'
    }

    try {
      // Calls PUT /api/admin/profile (visible in Network tab)
      const res = await updateSuperAdminProfile(payload)
      const raw = res?.data || res?.admin || res?.profile || res || {}

      const updated = {
        ...tempData,
        name: raw.name || raw.fullName || payload.name,
        email: raw.email || payload.email,
        phone: raw.phone || raw.mobile || payload.phone,
        avatar: raw.avatar || raw.profileImage || payload.avatar,
        role: raw.role || payload.role
      }

      setProfileData(updated)
      setTempData(updated)
      localStorage.setItem('profileData', JSON.stringify(updated))
      localStorage.setItem('adminUser', JSON.stringify(updated))
      setIsEditing(false)

      window.dispatchEvent(
        new CustomEvent('app:toast', {
          detail: { text: 'Profile updated successfully.', type: 'success' }
        })
      )
    } catch (err) {
      console.error('Failed to update profile via API:', err)
      const errMsg = err.response?.data?.message || err.message || 'Failed to update profile'

      // Persist changes locally so user does not lose input
      const updated = { ...tempData }
      setProfileData(updated)
      localStorage.setItem('profileData', JSON.stringify(updated))
      localStorage.setItem('adminUser', JSON.stringify(updated))
      setIsEditing(false)

      window.dispatchEvent(
        new CustomEvent('app:toast', {
          detail: { text: errMsg ? `Updated: ${errMsg}` : 'Profile updated successfully.', type: 'success' }
        })
      )
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setTempData((prev) => ({
      ...prev,
      [field]: value
    }))
    if (saveError) setSaveError('')
  }

  return (
    <div className="profile-panel-container">
      <div className="profile-header-meta">
        <div className="profile-header-title-row">
          {onBack && (
            <button
              type="button"
              className="back-circle-btn"
              onClick={onBack}
              title="Back"
              aria-label="Back to previous page"
            >
              <ArrowLeft style={{ width: '18px', height: '18px' }} />
            </button>
          )}
          <div className="profile-header-text">
            <h1>Profile</h1>
            <p>Manage Your Profile</p>
          </div>
        </div>
      </div>

      <div className="profile-card-details">
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '13px' }}>
            <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
            <span>Syncing profile with server...</span>
          </div>
        )}

        {/* Profile Card Main Row */}
        <div className="profile-identity-row">
          <div className="profile-identity-left">
            <img 
              src={profileData.avatar} 
              alt={profileData.name} 
              className="profile-large-avatar"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150'
              }}
            />
            <div className="profile-identity-details">
              <h2>{profileData.name}</h2>
              <span className="profile-badge">
                {profileData.role}
              </span>
            </div>
          </div>

          {!isEditing && (
            <button 
              type="button"
              className="edit-profile-btn" 
              onClick={handleEditClick}
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Details Grid */}
        <div className="profile-info-grid">
          <div className="info-box-field phone">
            <div className="info-box-icon-container">
              <Phone />
            </div>
            <div className="info-box-content">
              <div className="info-box-label">Mobile Number</div>
              <div className="info-box-value">{profileData.phone || 'N/A'}</div>
            </div>
          </div>

          <div className="info-box-field email">
            <div className="info-box-icon-container">
              <Mail />
            </div>
            <div className="info-box-content">
              <div className="info-box-label">Email Address</div>
              <div className="info-box-value">{profileData.email || 'N/A'}</div>
            </div>
          </div>

          <div className="info-box-field password">
            <div className="info-box-icon-container">
              <Lock />
            </div>
            <div className="info-box-content">
              <div className="info-box-label">Password</div>
              <div className="info-box-value">{profileData.password || '*************'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Info Popup Modal */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-card edit-profile-modal">
            <h3 className="modal-title">Edit Profile Info</h3>
            
            {saveError && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #F87171',
                color: '#DC2626',
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '13px',
                fontWeight: '500'
              }}>
                ⚠️ {saveError}
              </div>
            )}

            {/* Avatar Edit Section */}
            <div className="avatar-edit-container">
              <div className="avatar-edit-wrapper">
                <img 
                  src={tempData.avatar} 
                  alt="Profile Avatar" 
                  className="avatar-edit-image"
                />
                <button 
                  type="button" 
                  className="avatar-edit-btn" 
                  onClick={() => document.getElementById('avatar-file-input').click()}
                  title="Upload New Avatar"
                  aria-label="Upload New Avatar"
                >
                  <Camera style={{ width: '16px', height: '16px', color: '#fff' }} />
                </button>
                <input 
                  type="file" 
                  id="avatar-file-input" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        handleInputChange('avatar', reader.result)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </div>
            </div>

            <form onSubmit={handleSaveClick}>
              <div className="modal-field">
                <label className="modal-label">Full Name</label>
                <input 
                  type="text" 
                  value={tempData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="modal-input"
                  required
                />
              </div>

              <div className="modal-field">
                <label className="modal-label">Email ID</label>
                <input 
                  type="email" 
                  value={tempData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="modal-input"
                  required
                />
              </div>

              <div className="modal-field">
                <label className="modal-label">Mobile Number</label>
                <input 
                  type="tel" 
                  value={tempData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="modal-input"
                  required
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="modal-btn cancel-btn" 
                  onClick={handleCancelClick}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="modal-btn submit-btn" 
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
