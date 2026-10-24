import { useState, useEffect } from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'
import './App.css'
import Login from './pages/Login'
import AdminLayout from './pages/AdminLayout'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem('token'))
  })
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type })
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev))
    }, 4000)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('adminToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('adminUser')
    setIsLoggedIn(false)
  }

  useEffect(() => {
    document.title = 'ShopNow4U - Superadmin Dashboard'
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link')
    link.type = 'image/png'
    link.rel = 'shortcut icon'
    link.href = '/favicon.png?v=3'
    document.head.appendChild(link)

    const handleSessionExpired = () => {
      handleLogout()
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
    return () => {
      window.removeEventListener('auth:session_expired', handleSessionExpired)
      window.removeEventListener('auth:logout', handleExplicitLogout)
      window.removeEventListener('app:toast', handleAppToast)
    }
  }, [])

  const handleLoginSuccess = () => {
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

