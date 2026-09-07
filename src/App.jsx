import { useState } from 'react'
import './App.css'
import Login from './pages/Login'
import AdminLayout from './pages/AdminLayout'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem('token'))
  })

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('adminUser')
    setIsLoggedIn(false)
  }

  if (isLoggedIn) {
    return <AdminLayout onLogout={handleLogout} />
  }

  return (
    <Login onLogin={() => setIsLoggedIn(true)} />
  )
}

export default App

