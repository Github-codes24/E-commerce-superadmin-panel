import { useState, useEffect } from 'react'
import './App.css'
import Login from './pages/Login'
import AdminLayout from './pages/AdminLayout'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem('token'))
  })

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('adminToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('adminUser')
    setIsLoggedIn(false)
  }

  useEffect(() => {
    const handleSessionExpired = () => {
      handleLogout()
    }
    window.addEventListener('auth:session_expired', handleSessionExpired)
    return () => {
      window.removeEventListener('auth:session_expired', handleSessionExpired)
    }
  }, [])

  if (isLoggedIn) {
    return <AdminLayout onLogout={handleLogout} />
  }

  return (
    <Login onLogin={() => setIsLoggedIn(true)} />
  )
}

export default App

