import { useState, useEffect, useCallback } from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'
import './App.css'
import Login from './pages/Login'
import AdminLayout from './pages/AdminLayout'
import { isSessionValid, touchSession, clearSession } from './utils/sessionManager'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return isSessionValid()
  })
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = useCallback((text, type = 'success') => {
    setToastMessage({ text, type })
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev))
    }, 4000)
  }, [])

  const handleLogout = useCallback((reason = null) => {
    clearSession()
    setIsLoggedIn(false)
    if (reason && typeof reason === 'string') {
      showToast(reason, 'error')
    }
  }, [showToast])

  useEffect(() => {
    document.title = 'ShopNow4U - Superadmin Dashboard'
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link')
    link.type = 'image/png'
    link.rel = 'shortcut icon'
    link.href = '/favicon.png?v=3'
    document.head.appendChild(link)

    // Check if session has timed out (30 days)
    const checkSessionExpiry = () => {
      if (localStorage.getItem('token') || localStorage.getItem('adminToken')) {
        if (!isSessionValid()) {
          handleLogout('Your session has timed out after 30 days. Please log in again.')
        }
      }
    }

    // Touch session on active user interaction
    const handleUserActivity = () => {
      touchSession()
    }

    checkSessionExpiry()
    const sessionTimer = setInterval(checkSessionExpiry, 60000) // check every minute

    const handleSessionExpired = (e) => {
      handleLogout(e?.detail?.message || 'Your session has expired. Please log in again.')
    }
    const handleExplicitLogout = () => {
      handleLogout()
    }
    const handleAppToast = (e) => {
      if (e.detail?.text) {
        showToast(e.detail.text, e.detail.type || 'success')
      }
    }

    window.addEventListener('auth:session_expired', handleSessionExpired)
    window.addEventListener('auth:logout', handleExplicitLogout)
    window.addEventListener('app:toast', handleAppToast)
    window.addEventListener('focus', checkSessionExpiry)
    window.addEventListener('click', handleUserActivity, { passive: true })
    window.addEventListener('keydown', handleUserActivity, { passive: true })

    return () => {
      clearInterval(sessionTimer)
      window.removeEventListener('auth:session_expired', handleSessionExpired)
      window.removeEventListener('auth:logout', handleExplicitLogout)
      window.removeEventListener('app:toast', handleAppToast)
      window.removeEventListener('focus', checkSessionExpiry)
      window.removeEventListener('click', handleUserActivity)
      window.removeEventListener('keydown', handleUserActivity)
    }
  }, [handleLogout, showToast])

  const handleLoginSuccess = () => {
    touchSession()
    showToast('Login Successfully', 'success')
    setIsLoggedIn(true)
  }

  return (
    <>
      {toastMessage && (
        <div className={`product-toast-banner ${toastMessage.type}`} role="alert">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 style={{ width: '18px', height: '18px', flexShrink: 0 }} />
          ) : (
            <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
          )}
          <span>{toastMessage.text}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              padding: 0,
              marginLeft: '8px',
              display: 'flex',
              alignItems: 'center'
            }}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      )}
      {isLoggedIn ? (
        <AdminLayout onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLoginSuccess} showToast={showToast} />
      )}
    </>
  )
}

export default App

