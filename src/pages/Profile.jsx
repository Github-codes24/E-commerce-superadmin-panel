import React, { useState } from 'react'
import { Phone, Mail, Lock, Shield, Camera } from 'lucide-react'
import './Profile.css'


function Profile({ profileData, setProfileData }) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempData, setTempData] = useState({ ...profileData })

  const handleEditClick = () => {
    setTempData({ ...profileData })
    setIsEditing(true)
  }

  const handleCancelClick = () => {
    setIsEditing(false)
  }

  const handleSaveClick = (e) => {
    e.preventDefault()
    setProfileData({ ...tempData })
    setIsEditing(false)
  }

  const handleInputChange = (field, value) => {
    setTempData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="profile-panel-container">
      <div className="profile-header-meta">
        <h1>Profile</h1>
        <p>Manage Your Profile</p>
      </div>

      <div className="profile-card-details">
        {/* Profile Card Main Row */}
        <div className="profile-identity-row">
          <div className="profile-identity-left">
            <img 
              src={profileData.avatar} 
              alt={profileData.name} 
              className="profile-large-avatar"
              onError={(e) => {
                // fallback if image fails to load
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
              <div className="info-box-value">{profileData.phone}</div>
            </div>
          </div>

          <div className="info-box-field email">
            <div className="info-box-icon-container">
              <Mail />
            </div>
            <div className="info-box-content">
              <div className="info-box-label">Email Address</div>
              <div className="info-box-value">{profileData.email}</div>
            </div>
          </div>

          <div className="info-box-field password">
            <div className="info-box-icon-container">
              <Lock />
            </div>
            <div className="info-box-content">
              <div className="info-box-label">Password</div>
              <div className="info-box-value">{profileData.password}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Info Popup Modal */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-card edit-profile-modal">
            <h3 className="modal-title">Edit Profile Info</h3>
            
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

            <div className="modal-field">
              <label className="modal-label">Full Name</label>
              <input 
                type="text" 
                value={tempData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="modal-input"
                required
              />
            </div>

            <div className="modal-field">
              <label className="modal-label">Email ID</label>
              <input 
                type="email" 
                value={tempData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="modal-input"
                required
              />
            </div>

            <div className="modal-field">
              <label className="modal-label">Mobile Number</label>
              <input 
                type="tel" 
                value={tempData.phone}
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
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="modal-btn submit-btn" 
                onClick={handleSaveClick}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
