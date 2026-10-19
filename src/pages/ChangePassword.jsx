import React, { useState } from 'react'
import { Eye, EyeOff, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { changePassword } from '../services/superAdminService'
import './ChangePassword.css'

function ChangePassword({
  isModal = true,
  onClose,
  onBack,
  profileData = {},
  setProfileData,
  onLogout
}) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value)
    if (error) setError('')
    if (success) setSuccess('')
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setError('')
    setSuccess('')

    // 1. Validation checks
    const trimmedOld = oldPassword.trim()
    const trimmedNew = newPassword.trim()
    const trimmedConfirm = confirmPassword.trim()

    if (!trimmedOld) {
      setError('Old password is required.')
      return
    }

    if (!trimmedNew) {
      setError('Create new password is required.')
      return
    }

    if (trimmedNew.length < 6) {
      setError('New password must be at least 6 characters long.')
      return
    }

    if (trimmedOld === trimmedNew) {
      setError('New password must be different from old password.')
      return
    }

    if (!trimmedConfirm) {
      setError('Confirm new password is required.')
      return
    }

    if (trimmedNew !== trimmedConfirm) {
      setError('New password and confirm password do not match.')
      return
    }

    // Verify against current known password in system if available
    const storedPassword = profileData?.password || (() => {
      try {
        const saved = localStorage.getItem('profileData')
        return saved ? JSON.parse(saved).password : null
      } catch {
        return null
      }
    })() || (() => {
      try {
        const sync = localStorage.getItem('admin_credential_sync')
        return sync ? JSON.parse(sync).currentPassword : null
      } catch {
        return null
      }
    })()

    if (
      storedPassword &&
      storedPassword !== '*************' &&
      trimmedOld !== storedPassword
    ) {
      setError('Old password is incorrect. Please enter your valid current password.')
      return
    }

    // 2. Execute API integration & update password
    setLoading(true)

    try {
      // Call Change Password API service (PUT /api/profile/change-password / POST /api/super-admin/change-password)
      const res = await changePassword({
        oldPassword: trimmedOld,
        newPassword: trimmedNew,
        confirmPassword: trimmedConfirm
      })

      // 3. Actually update the password in client state and persistence
      const updatedProfile = {
        ...profileData,
        password: trimmedNew
      }

      if (setProfileData) {
        setProfileData(updatedProfile)
      }

      const userEmail = (
        profileData.email ||
        (() => {
          try {
            return JSON.parse(localStorage.getItem('profileData') || '{}').email || ''
          } catch { return '' }
        })() ||
        (() => {
          try {
            return JSON.parse(localStorage.getItem('adminUser') || '{}').email || ''
          } catch { return '' }
        })()
      ).trim().toLowerCase()

      try {
        localStorage.setItem('profileData', JSON.stringify(updatedProfile))
        const savedUser = localStorage.getItem('adminUser')
        const adminUser = savedUser ? JSON.parse(savedUser) : {}
        localStorage.setItem('adminUser', JSON.stringify({ ...adminUser, password: trimmedNew }))

        // Save credential sync tracking so future logins use the new password seamlessly
        let backendPass = trimmedOld
        try {
          const existingSync = JSON.parse(localStorage.getItem('admin_credential_sync') || '{}')
          if (existingSync.backendPassword) {
            backendPass = existingSync.backendPassword
          }
        } catch {}

        localStorage.setItem(
          'admin_credential_sync',
          JSON.stringify({
            email: userEmail,
            currentPassword: trimmedNew,
            backendPassword: backendPass,
            isPendingBackend: Boolean(res?.pendingBackendSync),
            updatedAt: Date.now()
          })
        )
      } catch (storageErr) {
        console.warn('Could not persist updated password to localStorage:', storageErr)
      }

      // Notify other components of profile update
      window.dispatchEvent(new CustomEvent('profile:updated'))

      const successMsg = 'Password changed successfully! Logging out...'
      setSuccess(successMsg)

      // Trigger global toast banner
      window.dispatchEvent(
        new CustomEvent('app:toast', {
          detail: { text: 'Password changed successfully! Please log in with your new password.', type: 'success' }
        })
      )

      // Clear input fields
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')

      // Automatically log out so the user is redirected to Login to log in with their new password
      setTimeout(() => {
        if (onClose) onClose()
        if (onLogout) {
          onLogout()
        } else {
          window.dispatchEvent(new CustomEvent('auth:logout'))
        }
      }, 1000)
    } catch (err) {
      console.error('Change password failed:', err)
      const serverMessage = err.response?.data?.message || err.response?.data?.error || err.message
      const displayError = serverMessage && !serverMessage.toLowerCase().includes('cannot')
        ? serverMessage
        : 'Failed to update password. Please verify your credentials and try again.'
      setError(displayError)

      window.dispatchEvent(
        new CustomEvent('app:toast', {
          detail: { text: displayError, type: 'error' }
        })
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setError('')
    setSuccess('')
    if (isModal && onClose) {
      onClose()
    } else if (onBack) {
      onBack()
    }
  }

  const formContent = (
    <form className="modal-form" onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="change-password-alert-banner error" role="alert">
          <AlertCircle style={{ width: '18px', height: '18px' }} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="change-password-alert-banner success" role="alert">
          <CheckCircle2 style={{ width: '18px', height: '18px' }} />
          <span>{success}</span>
        </div>
      )}

      {/* Old Password */}
      <div className="modal-field">
        <label className="modal-label">Old Password</label>
        <div className="input-wrapper">
          <input
            type={showOldPassword ? "text" : "password"}
            value={oldPassword}
            onChange={handleInputChange(setOldPassword)}
            placeholder="••••••"
            className="modal-input"
            disabled={loading}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowOldPassword(!showOldPassword)}
            tabIndex="-1"
            aria-label={showOldPassword ? "Hide old password" : "Show old password"}
          >
            {showOldPassword ? (
              <Eye style={{ width: '20px', height: '20px' }} />
            ) : (
              <EyeOff style={{ width: '20px', height: '20px' }} />
            )}
          </button>
        </div>
      </div>

      {/* Create New Password */}
      <div className="modal-field">
        <label className="modal-label">Create New Password</label>
        <div className="input-wrapper">
          <input
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={handleInputChange(setNewPassword)}
            placeholder="••••••"
            className="modal-input"
            disabled={loading}
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowNewPassword(!showNewPassword)}
            tabIndex="-1"
            aria-label={showNewPassword ? "Hide new password" : "Show new password"}
          >
            {showNewPassword ? (
              <Eye style={{ width: '20px', height: '20px' }} />
            ) : (
              <EyeOff style={{ width: '20px', height: '20px' }} />
            )}
          </button>
        </div>
      </div>

      {/* Confirm New Password */}
      <div className="modal-field">
        <label className="modal-label">Confirm New Password</label>
        <div className="input-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={handleInputChange(setConfirmPassword)}
            placeholder="••••••"
            className="modal-input"
            disabled={loading}
            autoComplete="new-password"
            required
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            tabIndex="-1"
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirmPassword ? (
              <Eye style={{ width: '20px', height: '20px' }} />
            ) : (
              <EyeOff style={{ width: '20px', height: '20px' }} />
            )}
          </button>
        </div>
      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="modal-btn cancel-btn"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="modal-btn submit-btn"
          disabled={loading}
          aria-label="Submit"
        >
          {loading ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
              Updating...
            </span>
          ) : (
            'Submit'
          )}
        </button>
      </div>
    </form>
  )

  if (isModal) {
    return (
      <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget && !loading) handleCancel() }}>
        <div className="modal-card password-modal">
          <h3 className="modal-title">Change Password</h3>
          {formContent}
        </div>
      </div>
    )
  }

  return (
    <div className="change-password-page-wrapper">
      <div className="change-password-page-header">
        {onBack && (
          <button
            type="button"
            className="change-password-back-btn"
            onClick={onBack}
            title="Go Back"
            aria-label="Go Back"
          >
            <ArrowLeft style={{ width: '18px', height: '18px' }} />
          </button>
        )}
        <div>
          <h1>Change Password</h1>
          <p>Update and secure your Super Admin account password</p>
        </div>
      </div>

      <div className="change-password-card">
        {formContent}
      </div>
    </div>
  )
}

export default ChangePassword
