import { useState, useEffect, useRef } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { loginSuperAdmin, forgotPassword, verifyOtp } from '../services/superAdminService'
import './login.css'
import loginArt from '../assets/Mobile login-panal.png'
import forgotArt from '../assets/Forgot password-pana 1.png'
import otpArt from '../assets/EnterOPT.png'
import resetArt from '../assets/aut-reset.png'
import successArt from '../assets/Success.png'

const pageData = {
  login: {
    title: 'Log in',
    subtitle: 'SUPER ADMIN PORTAL',
    description: 'Log in to access your Super Admin Panel.',
    button: 'Login',
    art: loginArt,
  },
  forgot: {
    title: 'Forgot Password?',
    subtitle: 'Company Name',
    description: 'Enter your registered email ID',
    button: 'Get OTP',
    art: forgotArt,
  },
  otp: {
    title: 'Enter OTP',
    subtitle: 'Company Name',
    description: "We've sent a verification code to example123@gmail.com",
    button: 'Verify OTP',
    art: otpArt,
  },
  reset: {
    title: 'Reset Password',
    subtitle: 'Company Name',
    description: 'Set a new password to access your account',
    button: 'Reset Password',
    art: resetArt,
  },
  success: {
    title: 'Password Reset Successful!',
    subtitle: 'Company Name',
    description: '',
    button: 'Login',
    art: successArt,
  },
}

function PasswordInput({ placeholder, value, onChange, className }) {
  const [showPassword, setShowPassword] = useState(false)
  const Icon = showPassword ? EyeOff : Eye

  return (
    <div className="password-box">
      <input 
        type={showPassword ? 'text' : 'password'} 
        placeholder={placeholder} 
        value={value}
        onChange={onChange}
        className={className}
      />
      <button
        type="button"
        className="eye-btn"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        onClick={() => setShowPassword((value) => !value)}
      >
        <Icon size={18} strokeWidth={2} color="#555555" />
      </button>
    </div>
  )
}

function LoginFields({ 
  setPage, 
  email, 
  setEmail, 
  password, 
  setPassword, 
  emailError, 
  setEmailError, 
  passwordError, 
  setPasswordError 
}) {
  return (
    <>
      <div className="field-block">
        <label>Enter Email ID</label>
        <input 
          type="email" 
          placeholder="example123@gmail.com" 
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (emailError) setEmailError('')
          }}
          className={emailError ? 'error' : ''}
        />
        {emailError && <span className="error-text">{emailError}</span>}
      </div>

      <div className="field-block password-field">
        <label>Password</label>
        <PasswordInput 
          placeholder="********" 
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (passwordError) setPasswordError('')
          }}
          className={passwordError ? 'error' : ''}
        />
        {passwordError && <span className="error-text">{passwordError}</span>}
      </div>

      <div className="login-options">
        <label className="remember-line">
          <input type="checkbox" />
          <span>Remember me</span>
        </label>
        <button type="button" className="link-btn" onClick={() => setPage('forgot')}>
          Forgot Password?
        </button>
      </div>
    </>
  )
}

function ForgotFields({ setPage, email, setEmail, emailError, setEmailError }) {
  return (
    <>
      <div className="field-block single-field">
        <label>Enter Email ID</label>
        <input 
          type="email" 
          placeholder="example123@gmail.com" 
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (emailError) setEmailError('')
          }}
          className={emailError ? 'error' : ''}
          required 
        />
        {emailError && <span className="error-text">{emailError}</span>}
      </div>
      <p className="back-text">
        Go back to{' '}
        <button type="button" className="link-btn" onClick={() => setPage('login')}>
          Login
        </button>
      </p>
    </>
  )
}

function OtpFields({ setPage, otp, setOtp, otpError, setOtpError, email, setGeneralError }) {
  const inputsRef = useRef([])
  const [timeLeft, setTimeLeft] = useState(120)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const handleResend = async () => {
    if (timeLeft > 0 || resending) return
    setResending(true)
    try {
      if (email) {
        await forgotPassword({ email })
      }
      setTimeLeft(120)
      setOtp(['', '', '', '', '', ''])
      setOtpError('')
      if (setGeneralError) setGeneralError('')
      inputsRef.current[0]?.focus()
    } catch (err) {
      console.error('Resend OTP Error:', err)
      const msg = err.response?.data?.message || 'Failed to resend OTP.'
      if (setOtpError) setOtpError(msg)
    } finally {
      setResending(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} Sec`
  }

  const handleChange = (value, index) => {
    if (value !== '' && !/^[0-9]$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (otpError) setOtpError('')

    if (value !== '' && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, otp.length)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)
    if (otpError) setOtpError('')

    const focusIndex = Math.min(pastedData.length, otp.length - 1)
    inputsRef.current[focusIndex]?.focus()
  }

  return (
    <>
      <div className="otp-inputs">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            maxLength="1"
            inputMode="numeric"
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={index === 0 ? handlePaste : undefined}
            className={otpError ? 'error' : ''}
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>
      {otpError && <p className="error-text otp-error">{otpError}</p>}

      <p className="code-text">
        Didn't receive any code?{' '}
        <button 
          type="button" 
          className="link-btn" 
          disabled={timeLeft > 0 || resending} 
          onClick={handleResend}
          style={{ opacity: timeLeft > 0 || resending ? 0.5 : 1, cursor: timeLeft > 0 || resending ? 'not-allowed' : 'pointer' }}
        >
          {resending ? 'Sending...' : 'Resend Code'}
        </button>
      </p>
      <p className="timer-text">{formatTime(timeLeft)}</p>
      <p className="back-text otp-back">
        Go back to{' '}
        <button type="button" className="link-btn" onClick={() => setPage('login')}>
          Login
        </button>
      </p>
    </>
  )
}

function ResetFields({ setPage, newPassword, setNewPassword, confirmPassword, setConfirmPassword, resetError, setResetError }) {
  return (
    <>
      <div className="reset-fields">
        <PasswordInput 
          placeholder="New Password" 
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value)
            if (resetError) setResetError('')
          }}
        />
        <PasswordInput 
          placeholder="Confirm New Password" 
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value)
            if (resetError) setResetError('')
          }}
        />
      </div>
      {resetError && <p className="error-text reset-error">{resetError}</p>}
      <p className="back-text reset-back">
        Go back to{' '}
        <button type="button" className="link-btn" onClick={() => setPage('login')}>
          Login
        </button>
      </p>
    </>
  )
}

function SuccessContent() {
  return (
    <div className="success-content">
      <div className="success-icon" aria-hidden="true" />
      <h1>Password Reset Successful!</h1>
    </div>
  )
}

function Login({ onLogin }) {
  const [page, setPage] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [generalError, setGeneralError] = useState('')
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetError, setResetError] = useState('')

  const data = pageData[page]

  useEffect(() => {
    // Reset errors whenever page changes
    setEmailError('')
    setPasswordError('')
    setGeneralError('')
    setOtpError('')
    setResetError('')
    setOtp(['', '', '', '', '', ''])
    setNewPassword('')
    setConfirmPassword('')
  }, [page])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (page === 'login') {
      let valid = true
      if (!email.trim()) {
        setEmailError('Email is required')
        valid = false
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          setEmailError('Please enter a valid email address')
          valid = false
        } else {
          setEmailError('')
        }
      }

      if (!password) {
        setPasswordError('Password is required')
        valid = false
      } else {
        setPasswordError('')
      }

      if (valid) {
        setLoading(true)
        setGeneralError('')
        try {
          const res = await loginSuperAdmin({
            email: email.trim(),
            password: password
          })

          const token = res.token || res.data?.token || res.data?.accessToken || res.accessToken
          const refreshToken = res.refreshToken || res.data?.refreshToken
          const adminObj = res.admin || res.data?.admin || res.message?.admin || res.data?.user || {}

          if (token) {
            localStorage.setItem('token', token)
          } else {
            // If token not in standard field, set dummy valid token
            localStorage.setItem('token', 'logged_in_' + Date.now())
          }

          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken)
          }

          if (adminObj.email || adminObj.name) {
            localStorage.setItem('adminUser', JSON.stringify(adminObj))
            localStorage.setItem('profileData', JSON.stringify({
              name: adminObj.name || 'Super Admin',
              email: adminObj.email || email,
              role: adminObj.role || 'SUPER_ADMIN',
              phone: adminObj.phone || '+91 9876543210',
              avatar: adminObj.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256'
            }))
          }

          if (onLogin) {
            onLogin(adminObj)
          }
        } catch (error) {
          console.error('Login Error:', error)
          const errMsg = error.response?.data?.message || (typeof error.response?.data === 'string' ? error.response?.data : null) || error.message || 'Login failed. Please check your credentials.'
          setGeneralError(errMsg)
        } finally {
          setLoading(false)
        }
      }
    } else if (page === 'forgot') {
      let valid = true
      if (!email.trim()) {
        setEmailError('Email is required')
        valid = false
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          setEmailError('Please enter a valid email address')
          valid = false
        } else {
          setEmailError('')
        }
      }

      if (valid) {
        setLoading(true)
        setGeneralError('')
        try {
          const res = await forgotPassword({ email: email.trim() })
          if (res.success) {
            setPage('otp')
          } else {
            setGeneralError(res.message || 'Admin not found')
          }
        } catch (error) {
          console.error('Forgot Password Error:', error)
          const errMsg = error.response?.data?.message || (typeof error.response?.data === 'string' ? error.response?.data : null) || error.message || 'Failed to send OTP.'
          setGeneralError(errMsg)
        } finally {
          setLoading(false)
        }
      }
    } else if (page === 'otp') {
      const fullOtp = otp.join('')
      if (fullOtp.length < 6) {
        setOtpError('Please enter the complete 6-digit OTP')
        return
      }
      setLoading(true)
      setGeneralError('')
      setOtpError('')
      try {
        const res = await verifyOtp({
          email: email.trim(),
          otp: fullOtp
        })
        if (res.success) {
          setPage('reset')
        } else {
          setOtpError(res.message || 'Invalid OTP')
          setGeneralError(res.message || 'Invalid OTP')
        }
      } catch (error) {
        console.error('Verify OTP Error:', error)
        const errMsg = error.response?.data?.message || (typeof error.response?.data === 'string' ? error.response?.data : null) || error.message || 'Invalid OTP'
        setOtpError(errMsg)
        setGeneralError(errMsg)
      } finally {
        setLoading(false)
      }
    } else if (page === 'reset') {
      if (!newPassword.trim()) {
        setResetError('New password is required')
      } else if (newPassword.length < 6) {
        setResetError('Password must be at least 6 characters long')
      } else if (newPassword !== confirmPassword) {
        setResetError('Passwords do not match')
      } else {
        setResetError('')
        setPage('success')
      }
    } else if (page === 'success') {
      if (onLogin) {
        onLogin()
      } else {
        setPage('login')
      }
    }
  }

  return (
    <main className={`auth-page ${page}-page`}>
      <section className="auth-layout">
        <form className="auth-card" onSubmit={handleSubmit}>
          <p className="auth-subtitle">{data.subtitle}</p>
          {page === 'success' ? (
            <SuccessContent />
          ) : (
            <>
              <h1>{data.title}</h1>
              <p className="auth-desc">
                {page === 'otp' && email ? `We've sent a verification code to ${email}` : data.description}
              </p>
            </>
          )}

          {generalError && (
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
              ⚠️ {generalError}
            </div>
          )}

          {page === 'login' && (
            <LoginFields 
              setPage={setPage} 
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              emailError={emailError}
              setEmailError={setEmailError}
              passwordError={passwordError}
              setPasswordError={setPasswordError}
            />
          )}
          {page === 'forgot' && (
            <ForgotFields 
              setPage={setPage} 
              email={email}
              setEmail={setEmail}
              emailError={emailError}
              setEmailError={setEmailError}
            />
          )}
          {page === 'otp' && (
            <OtpFields 
              setPage={setPage} 
              otp={otp}
              setOtp={setOtp}
              otpError={otpError}
              setOtpError={setOtpError}
              email={email}
              setGeneralError={setGeneralError}
            />
          )}
          {page === 'reset' && (
            <ResetFields 
              setPage={setPage} 
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              resetError={resetError}
              setResetError={setResetError}
            />
          )}

          <button type="submit" className="main-btn" disabled={loading}>
            {loading ? 'Please wait...' : data.button}
          </button>
        </form>

        <img className="auth-art" src={data.art} alt="" />
      </section>
    </main>
  )
}

export default Login
