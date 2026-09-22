import React, { useState, useRef, useEffect } from 'react'
import { Users, UserCheck, UserMinus, Search, MoreVertical, Plus, ArrowLeft, Upload, X, Edit, Trash2, RotateCw, Key, CheckCircle, Shield, CheckSquare, Square } from 'lucide-react'
import { registerAdmin, createSuperAdmin, getAllAdmins, getAdminById, updateAdmin, updateAdminStatus, deleteAdmin, assignPermissions, getAllPermissions, getPermissionsByAdminId, updatePermissions, deletePermissions, checkModulePermission } from '../services/superAdminService'
import './AdminsManagement.css'

const PERMISSION_MODULES = [
  { key: 'VENDOR_MANAGEMENT', label: 'Vendor Management', actions: ['VIEW', 'ADD', 'EDIT', 'DELETE'] },
  { key: 'PRODUCT_MANAGEMENT', label: 'Product Management', actions: ['VIEW', 'ADD', 'EDIT', 'DELETE'] },
  { key: 'CUSTOMER_MANAGEMENT', label: 'Customer Management', actions: ['VIEW', 'ADD', 'EDIT', 'DELETE'] },
  { key: 'ORDER_MANAGEMENT', label: 'Order Management', actions: ['VIEW', 'EDIT', 'CANCEL_ORDER', 'CHANGE_ORDER_STATUS'] }
]

function AdminsManagement() {
  // Admin List Data from API
  const [adminsList, setAdminsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState(null)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false)
  const [bulkDeleteError, setBulkDeleteError] = useState('')

  // Status Change Confirmation Modal state
  const [statusConfirmAdmin, setStatusConfirmAdmin] = useState(null)
  const [statusToggleLoading, setStatusToggleLoading] = useState(false)
  const [statusToggleError, setStatusToggleError] = useState('')

  // Assign Permissions Modal state
  const [permissionAdmin, setPermissionAdmin] = useState(null)
  const [adminPermissions, setAdminPermissions] = useState({})
  const [permissionLoading, setPermissionLoading] = useState(false)
  const [permissionError, setPermissionError] = useState('')
  const [permissionSuccessMsg, setPermissionSuccessMsg] = useState('')

  // Fetch All Admins from Backend API
  const fetchAdmins = async () => {
    try {
      setLoading(true)
      setFetchError(null)
      const res = await getAllAdmins()

      // Handle { success: true, message: "...", data: [...] } or array formats
      const adminsArray = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.admins)
        ? res.admins
        : Array.isArray(res)
        ? res
        : []

      const formatted = adminsArray.map((admin, index) => {
        const rawId = admin.id || admin._id || admin.userId?._id || admin.userId?.id || `admin-${index}`
        const rawName = admin.name || admin.fullName || admin.userId?.fullName || admin.userId?.name || 'Admin'
        const rawEmail = admin.email || admin.userId?.email || ''
        const rawPhone = admin.phone || admin.mobile || admin.userId?.phone || admin.userId?.mobile || 'N/A'
        const rawGender = admin.gender || admin.userId?.gender || 'Male'
        const rawRole = admin.role || admin.userId?.role || 'ADMIN'
        const rawStatus = (admin.status || (admin.isActive !== undefined ? (admin.isActive ? 'ACTIVE' : 'INACTIVE') : 'ACTIVE')).toString().toLowerCase()
        const isActive = rawStatus === 'active'

        const rawCreatedAt = admin.createdAt || admin.userId?.createdAt || admin.joinedDate || admin.updatedAt || null
        const rawTimestamp = rawCreatedAt ? new Date(rawCreatedAt).getTime() : null

        const joinedDateFormatted = rawCreatedAt
          ? new Date(rawCreatedAt).toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })
          : 'N/A'

        const defaultImage = rawGender === 'Female'
          ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256'

        return {
          id: rawId,
          name: rawName,
          email: rawEmail,
          phone: rawPhone,
          gender: rawGender,
          role: rawRole,
          status: isActive ? 'active' : 'inactive',
          joinedDate: joinedDateFormatted,
          createdAt: rawCreatedAt,
          timestamp: rawTimestamp,
          lastLogin: admin.lastLogin || 'Never',
          checked: false,
          image: admin.profileImage || admin.image || defaultImage,
          activities: admin.activities || [
            { id: 101, title: 'Joined Admin Portal', description: 'Account Active', time: joinedDateFormatted, timestamp: rawTimestamp }
          ],
          loginHistory: admin.loginHistory || [
            { id: 201, event: 'Logged In', timestamp: 'Recent' }
          ]
        }
      })

      // Sort admins newest first based on createdAt / timestamp
      formatted.sort((a, b) => {
        const timeA = a.timestamp || 0
        const timeB = b.timestamp || 0
        return timeB - timeA
      })

      setAdminsList(formatted)

      // Build real activities feed from backend admins & any stored activities
      let localActivities = []
      try {
        const stored = localStorage.getItem('recent_admin_activities')
        if (stored) localActivities = JSON.parse(stored)
      } catch (e) {
        console.warn('Could not parse local activities', e)
      }

      const adminCreationActivities = formatted
        .filter(a => a.name)
        .map((a, idx) => ({
          id: `admin-created-${a.id || idx}`,
          title: 'New Admin Added',
          subtitle: `${a.name} was added`,
          timestamp: a.timestamp || a.createdAt
        }))

      const combined = [...localActivities, ...adminCreationActivities]
      const uniqueActivities = []
      const seen = new Set()

      for (const act of combined) {
        const key = act.subtitle || act.title
        if (!seen.has(key)) {
          seen.add(key)
          uniqueActivities.push(act)
        }
      }

      uniqueActivities.sort((a, b) => {
        const timeA = typeof a.timestamp === 'number' ? a.timestamp : new Date(a.timestamp || 0).getTime()
        const timeB = typeof b.timestamp === 'number' ? b.timestamp : new Date(b.timestamp || 0).getTime()
        return timeB - timeA
      })

      if (uniqueActivities.length > 0) {
        setActivities(uniqueActivities.slice(0, 5))
      }
    } catch (err) {
      console.error('Failed to fetch admins:', err)
      setFetchError(err?.response?.data?.message || err?.message || 'Failed to fetch admins')
    } finally {
      setLoading(false)
    }
  }

  // Fetch Single Admin By ID
  const handleViewAdmin = async (admin) => {
    setViewedAdmin(admin)
    setProfileLoading(true)
    setProfileError(null)

    const adminId = admin.id || admin._id
    if (!adminId) {
      setProfileLoading(false)
      return
    }

    try {
      const res = await getAdminById(adminId)
      const data = res?.data || res?.admin || res

      if (data) {
        const rawId = data.id || data._id || data.userId?._id || data.userId?.id || admin.id
        const rawName = data.name || data.fullName || data.userId?.fullName || data.userId?.name || admin.name
        const rawEmail = data.email || data.userId?.email || admin.email
        const rawPhone = data.phone || data.mobile || data.userId?.phone || data.userId?.mobile || admin.phone || 'N/A'
        const rawGender = data.gender || data.userId?.gender || admin.gender || 'Male'
        const rawRole = data.role || data.userId?.role || admin.role || 'ADMIN'
        const rawStatus = (data.status || (data.isActive !== undefined ? (data.isActive ? 'ACTIVE' : 'INACTIVE') : admin.status || 'ACTIVE')).toString().toLowerCase()
        const isActive = rawStatus === 'active'

        const joinedDateFormatted = data.createdAt || data.joinedDate
          ? new Date(data.createdAt || data.joinedDate).toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })
          : admin.joinedDate || 'N/A'

        const defaultImage = rawGender === 'Female'
          ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256'

        setViewedAdmin({
          ...admin,
          id: rawId,
          name: rawName,
          email: rawEmail,
          phone: rawPhone,
          gender: rawGender,
          role: rawRole,
          status: isActive ? 'active' : 'inactive',
          joinedDate: joinedDateFormatted,
          lastLogin: data.lastLogin || admin.lastLogin || 'Never',
          image: data.profileImage || data.image || admin.image || defaultImage,
          activities: data.activities || admin.activities,
          loginHistory: data.loginHistory || admin.loginHistory
        })
      }
    } catch (err) {
      console.error('Failed to fetch admin by id:', err)
      setProfileError(err?.response?.data?.message || err?.message || 'Failed to fetch admin details')
    } finally {
      setProfileLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  // Helper to dynamically calculate and format elapsed time
  const formatElapsedTime = (timestamp, fallbackTime) => {
    if (!timestamp && !fallbackTime) return 'Just now'

    const targetTime = typeof timestamp === 'number'
      ? timestamp
      : (timestamp ? new Date(timestamp).getTime() : null)

    if (!targetTime || isNaN(targetTime)) {
      return fallbackTime || 'Just now'
    }

    const diffMs = Date.now() - targetTime
    const diffSec = Math.max(0, Math.floor(diffMs / 1000))

    if (diffSec < 45) {
      return 'Just now'
    }

    const diffMin = Math.floor(diffSec / 60)
    if (diffMin === 1) {
      return '1 min ago'
    }
    if (diffMin < 60) {
      return `${diffMin} mins ago`
    }

    const diffHours = Math.floor(diffMin / 60)
    if (diffHours === 1) {
      return '1 hour ago'
    }
    if (diffHours < 24) {
      return `${diffHours} hours ago`
    }

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) {
      return '1 day ago'
    }
    if (diffDays < 7) {
      return `${diffDays} days ago`
    }

    return new Date(targetTime).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // Periodic timer to auto-refresh elapsed time displays every 30 seconds
  const [, setTick] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(t => t + 1)
    }, 30000)
    return () => clearInterval(timer)
  }, [])

  // Recent Activity Log state (shared/list feed)
  const [activities, setActivities] = useState(() => {
    try {
      const stored = localStorage.getItem('recent_admin_activities')
      if (stored) return JSON.parse(stored)
    } catch (_) {}
    return []
  })

  // Navigation and overlay states
  const [isAdding, setIsAdding] = useState(false)
  const [viewedAdmin, setViewedAdmin] = useState(null) // currently viewed admin profile (object or null)
  const [editingAdmin, setEditingAdmin] = useState(null) // stores copy of admin currently being edited
  const [deletingAdminId, setDeletingAdminId] = useState(null) // ID of admin selected for deletion
  const [activeActionMenuId, setActiveActionMenuId] = useState(null) // ID of admin row with open action dropdown
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false) // Bulk delete modal state

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter])

  // Add Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: 'Male',
    role: 'ADMIN',
    isActive: true,
    imageFile: null,
    imagePreview: ''
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [nameError, setNameError] = useState('')
  const [phoneError, setPhoneError] = useState('')

  const fileInputRef = useRef(null)

  // Close row dropdown menus when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveActionMenuId(null)
    }
    window.addEventListener('click', handleOutsideClick)
    return () => {
      window.removeEventListener('click', handleOutsideClick)
    }
  }, [])

  // Derive stats
  const totalCount = adminsList.length
  const activeCount = adminsList.filter((a) => a.status === 'active').length
  const inactiveCount = adminsList.filter((a) => a.status === 'inactive').length

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked
    setAdminsList(adminsList.map((a) => ({ ...a, checked: isChecked })))
  }

  const handleRowCheckbox = (id) => {
    setAdminsList(
      adminsList.map((a) => (a.id === id ? { ...a, checked: !a.checked } : a))
    )
  }

  // File selectors
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle Unified Form Submission (Add / Edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setNameError('')
    setPhoneError('')

    const trimmedName = formData.name.trim()
    const nameRegex = /^[a-zA-Z]+([a-zA-Z\s]*[a-zA-Z]+)?$/

    if (!trimmedName) {
      const msg = 'Name is required.'
      setFormError(msg)
      setNameError(msg)
      return
    }

    if (!/^[a-zA-Z\s]+$/.test(trimmedName)) {
      const msg = 'Please enter a valid name. Only alphabets and spaces are allowed.'
      setFormError(msg)
      setNameError(msg)
      return
    }

    if (trimmedName.length < 2) {
      const msg = 'Name must be at least 2 characters long.'
      setFormError(msg)
      setNameError(msg)
      return
    }

    if (trimmedName.length > 50) {
      const msg = 'Name cannot exceed 50 characters.'
      setFormError(msg)
      setNameError(msg)
      return
    }

    if (!formData.email.trim()) {
      setFormError('Email address is required.')
      return
    }

    const trimmedPhone = formData.phone.trim()
    if (!trimmedPhone) {
      const msg = 'Phone number is required.'
      setFormError(msg)
      setPhoneError(msg)
      return
    }

    if (!/^\d{10}$/.test(trimmedPhone)) {
      const msg = 'Please enter a valid 10-digit phone number.'
      setFormError(msg)
      setPhoneError(msg)
      return
    }

    if (!editingAdmin && !formData.password.trim()) {
      setFormError('Password is required.')
      return
    }

    setFormLoading(true)

    if (editingAdmin) {
      const adminId = editingAdmin.id || editingAdmin._id
      try {
        const updatePayload = {
          name: formData.name.trim(),
          fullName: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role || 'ADMIN',
          gender: formData.gender || 'Male',
          status: formData.isActive ? 'ACTIVE' : 'INACTIVE',
          isActive: formData.isActive
        }
        const cleanPhone = (formData.phone || '').trim()
        if (cleanPhone && cleanPhone !== 'N/A') {
          updatePayload.phone = cleanPhone
          updatePayload.mobile = cleanPhone
        }
        if (formData.password && formData.password.trim()) {
          updatePayload.password = formData.password.trim()
        }

        const res = await updateAdmin(adminId, updatePayload)

        const updatedData = res?.data || res?.admin || {}
        const updatedName = updatedData.name || updatedData.fullName || formData.name.trim()
        const updatedEmail = updatedData.email || formData.email.trim()
        const updatedPhone = updatedData.phone || updatedData.mobile || formData.phone
        const updatedRole = updatedData.role || formData.role || 'ADMIN'
        const updatedStatus = updatedData.status
          ? (updatedData.status.toString().toLowerCase() === 'active' ? 'active' : 'inactive')
          : (formData.isActive ? 'active' : 'inactive')

        const editActivity = {
          id: Date.now(),
          title: 'Admin Details Updated',
          description: res?.message || 'Updated via API (/api/superadmin/admins/update/:id)',
          timestamp: Date.now()
        }

        setAdminsList(prevList => prevList.map((a) => {
          if (a.id === adminId) {
            return {
              ...a,
              name: updatedName,
              email: updatedEmail,
              phone: updatedPhone,
              role: updatedRole,
              gender: formData.gender || a.gender,
              status: updatedStatus,
              image: formData.imagePreview || a.image,
              activities: [editActivity, ...(a.activities || [])]
            }
          }
          return a
        }))

        const globalActivity = {
          id: Date.now(),
          title: 'Admin Details Updated',
          subtitle: `${updatedName} updated successfully`,
          timestamp: Date.now()
        }
        setActivities(prev => [globalActivity, ...prev])

        setEditingAdmin(null)
        setIsAdding(false)
        setFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          gender: 'Male',
          role: 'ADMIN',
          isActive: true,
          imageFile: null,
          imagePreview: ''
        })
        await fetchAdmins()
      } catch (error) {
        console.error('Update Admin Error:', error)
        const errData = error.response?.data
        let backendError = ''
        if (errData?.errors) {
          if (Array.isArray(errData.errors)) {
            backendError = errData.errors.map(err => {
              const field = err.field || (err.path ? (Array.isArray(err.path) ? err.path.join('.') : err.path) : '')
              const fieldPrefix = field ? `${field}: ` : ''
              return `${fieldPrefix}${err.msg || err.message || (typeof err === 'string' ? err : JSON.stringify(err))}`
            }).join(', ')
          } else if (typeof errData.errors === 'object') {
            backendError = Object.entries(errData.errors).map(([key, val]) => `${key}: ${typeof val === 'object' ? JSON.stringify(val) : val}`).join(', ')
          } else {
            backendError = String(errData.errors)
          }
        }
        if (!backendError) {
          const rawMsg = errData?.message || (typeof errData === 'string' ? errData : null) || error.message || 'Failed to update Admin.'
          if (rawMsg.toLowerCase().includes('already exists') || rawMsg.toLowerCase().includes('duplicate')) {
            backendError = (!formData.phone || !formData.phone.trim()) ? 'This email already exists.' : 'This email or mobile number already exists.'
          } else {
            backendError = rawMsg
          }
        }
        setFormError(backendError)
      } finally {
        setFormLoading(false)
      }
    } else {
      try {
        const createPayload = {
          fullName: formData.name.trim(),
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password || 'Password@123',
          role: formData.role || 'ADMIN',
          gender: formData.gender || 'Male',
          status: formData.isActive ? 'ACTIVE' : 'INACTIVE',
          isActive: formData.isActive
        }
        const cleanPhone = (formData.phone || '').trim()
        if (cleanPhone && cleanPhone !== 'N/A') {
          createPayload.mobile = cleanPhone
          createPayload.phone = cleanPhone
        }

        const res = await registerAdmin(createPayload)

        const rawData = res?.data || res?.admin || {}
        const userObj = rawData.userId || rawData

        const defaultImage = formData.gender === 'Female'
          ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256&h=256'

        const newAdmin = {
          id: rawData._id || userObj._id || userObj.id || Date.now(),
          name: userObj.fullName || userObj.name || formData.name,
          email: userObj.email || formData.email,
          phone: userObj.mobile || userObj.phone || formData.phone || 'N/A',
          gender: rawData.gender || formData.gender || 'Male',
          joinedDate: userObj.createdAt || rawData.createdAt
            ? new Date(userObj.createdAt || rawData.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
            : new Date().toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            }),
          lastLogin: 'Never',
          status: userObj.isActive !== undefined ? (userObj.isActive ? 'active' : 'inactive') : (formData.isActive ? 'active' : 'inactive'),
          role: userObj.role || formData.role || 'ADMIN',
          checked: false,
          image: formData.imagePreview || rawData.profileImage || defaultImage,
          activities: [
            { id: Date.now(), title: 'Admin Account Created', description: res?.message || 'Created via API (/api/superadmin/admins/register)', timestamp: Date.now() }
          ],
          loginHistory: [
            { id: Date.now() + 1, event: 'Account Initialized', timestamp: new Date().toLocaleString() }
          ]
        }

        setAdminsList([newAdmin, ...adminsList])

        const newActivity = {
          id: Date.now(),
          title: 'New Admin Created',
          subtitle: `${formData.name} was created successfully`,
          timestamp: Date.now()
        }
        setActivities(prev => [newActivity, ...prev])

        setFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          gender: 'Male',
          role: 'ADMIN',
          isActive: true,
          imageFile: null,
          imagePreview: ''
        })
        setIsAdding(false)
        await fetchAdmins()
      } catch (error) {
        console.error('Create Admin Error:', error)
        const errData = error.response?.data
        let backendError = ''
        if (errData?.errors) {
          if (Array.isArray(errData.errors)) {
            backendError = errData.errors.map(e => {
              const field = e.field || (e.path ? (Array.isArray(e.path) ? e.path.join('.') : e.path) : '')
              const fieldPrefix = field ? `${field}: ` : ''
              return `${fieldPrefix}${e.msg || e.message || (typeof e === 'string' ? e : JSON.stringify(e))}`
            }).join(', ')
          } else if (typeof errData.errors === 'object') {
            backendError = Object.entries(errData.errors).map(([key, val]) => `${key}: ${typeof val === 'object' ? JSON.stringify(val) : val}`).join(', ')
          } else {
            backendError = String(errData.errors)
          }
        }
        if (!backendError) {
          const rawMsg = errData?.message || (typeof errData === 'string' ? errData : null) || error.message || 'Failed to create Admin. Please check server connection.'
          if (rawMsg.toLowerCase().includes('already exists') || rawMsg.toLowerCase().includes('duplicate')) {
            backendError = (!formData.phone || !formData.phone.trim()) ? 'This email already exists.' : 'This email or mobile number already exists.'
          } else {
            backendError = rawMsg
          }
        }
        setFormError(backendError)
      } finally {
        setFormLoading(false)
      }
    }
  }

  // Open Add Admin Mode
  const handleOpenAdd = () => {
    setFormError('')
    setNameError('')
    setPhoneError('')
    setEditError('')
    setEditingAdmin(null)
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      gender: 'Male',
      role: 'ADMIN',
      isActive: true,
      imageFile: null,
      imagePreview: ''
    })
    if (viewedAdmin) {
      setViewedAdmin(null)
    }
    setIsAdding(true)
  }

  // Open Edit Mode (Full-Page View)
  const handleOpenEdit = (admin) => {
    setFormError('')
    setNameError('')
    setPhoneError('')
    setEditError('')
    setEditingAdmin(admin)
    setFormData({
      name: admin.name || admin.fullName || '',
      email: admin.email || '',
      password: '',
      phone: admin.phone && admin.phone !== 'N/A' ? admin.phone : '',
      role: admin.role || 'ADMIN',
      gender: admin.gender || 'Male',
      isActive: admin.status === 'active',
      imageFile: null,
      imagePreview: admin.image || ''
    })
    if (viewedAdmin) {
      setViewedAdmin(null)
    }
    setIsAdding(true)
  }

  // Request status change (opens user-friendly confirmation modal)
  const handleRequestToggleStatus = (id) => {
    const targetAdmin = adminsList.find(a => a.id === id)
    if (!targetAdmin) return

    const isCurrentlyActive = targetAdmin.status?.toLowerCase() === 'active'
    const newStatusBackend = isCurrentlyActive ? 'INACTIVE' : 'ACTIVE'
    const newStatusLocal = isCurrentlyActive ? 'inactive' : 'active'
    const action = isCurrentlyActive ? 'deactivate' : 'activate'

    setStatusToggleError('')
    setStatusConfirmAdmin({
      id,
      name: targetAdmin.name,
      currentStatus: isCurrentlyActive ? 'active' : 'inactive',
      newStatusBackend,
      newStatusLocal,
      action
    })
  }

  // Confirm status change execution (PATCH /api/superadmin/admins/status/:id/status)
  const handleConfirmToggleStatus = async () => {
    if (!statusConfirmAdmin) return
    const { id, newStatusBackend, newStatusLocal, action } = statusConfirmAdmin
    const targetAdmin = adminsList.find(a => a.id === id)

    try {
      setStatusToggleLoading(true)
      setStatusToggleError('')
      const res = await updateAdminStatus(id, newStatusBackend)
      const resStatus = res?.data?.status
        ? (res.data.status.toString().toLowerCase() === 'active' ? 'active' : 'inactive')
        : newStatusLocal

      const newAct = {
        id: Date.now(),
        title: 'Status Toggled',
        description: res?.message || `Status changed to ${resStatus}`,
        timestamp: Date.now()
      }

      setAdminsList(prevList => prevList.map(admin => {
        if (admin.id === id) {
          const updatedAdmin = {
            ...admin,
            status: resStatus,
            activities: [newAct, ...(admin.activities || [])]
          }
          if (viewedAdmin && viewedAdmin.id === id) {
            setViewedAdmin(updatedAdmin)
          }
          return updatedAdmin
        }
        return admin
      }))

      if (viewedAdmin && viewedAdmin.id === id) {
        setViewedAdmin(prev => ({
          ...prev,
          status: resStatus,
          activities: [newAct, ...(prev?.activities || [])]
        }))
      }

      const toggleActivity = {
        id: Date.now(),
        title: 'Status Toggled',
        subtitle: `${targetAdmin?.name || 'Admin'} is now ${resStatus}`,
        timestamp: Date.now()
      }
      setActivities(prev => [toggleActivity, ...prev])
      setStatusConfirmAdmin(null)
    } catch (err) {
      console.error('Failed to toggle admin status:', err)
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to update admin status'
      setStatusToggleError(errMsg)
    } finally {
      setStatusToggleLoading(false)
    }
  }

  // Bulk status update (PATCH /api/superadmin/admins/status/:id/status)
  const handleBulkStatusChange = async (newStatus) => {
    const selectedAdmins = adminsList.filter(a => a.checked)
    if (selectedAdmins.length === 0) return

    const newStatusBackend = newStatus.toUpperCase()
    const newStatusLocal = newStatus.toLowerCase()

    try {
      await Promise.all(
        selectedAdmins.map(admin => updateAdminStatus(admin.id, newStatusBackend))
      )

      const selectedIds = selectedAdmins.map(a => a.id)
      const adminNames = selectedAdmins.map(a => a.name).join(', ')

      const bulkAct = {
        id: Date.now(),
        title: `Bulk Status Update`,
        description: `Status updated to ${newStatusLocal} via API`,
        timestamp: Date.now()
      }

      setAdminsList(prevList => prevList.map(admin => {
        if (selectedIds.includes(admin.id)) {
          const updatedAdmin = {
            ...admin,
            status: newStatusLocal,
            activities: [bulkAct, ...(admin.activities || [])]
          }
          return updatedAdmin
        }
        return admin
      }))

      if (viewedAdmin && selectedIds.includes(viewedAdmin.id)) {
        setViewedAdmin(prev => ({
          ...prev,
          status: newStatusLocal,
          activities: [bulkAct, ...(prev?.activities || [])]
        }))
      }

      const globalBulkActivity = {
        id: Date.now(),
        title: 'Bulk Status Update',
        subtitle: `Updated status to ${newStatusLocal} for: ${adminNames}`,
        timestamp: Date.now()
      }
      setActivities(prev => [globalBulkActivity, ...prev])
    } catch (err) {
      console.error('Failed to update bulk admin status:', err)
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to update status for selected admins'
      alert(errMsg)
      await fetchAdmins()
    }
  }

  // Bulk delete execution (DELETE /api/superadmin/admins/delete/:id)
  const handleBulkDeleteConfirm = async () => {
    const selectedAdmins = adminsList.filter(a => a.checked)
    if (selectedAdmins.length === 0) return

    const selectedIds = selectedAdmins.map(a => a.id)
    const adminNames = selectedAdmins.map(a => a.name).join(', ')

    setBulkDeleteLoading(true)
    setBulkDeleteError('')

    try {
      await Promise.all(
        selectedAdmins.map(admin => deleteAdmin(admin.id))
      )

      setAdminsList(prevList => prevList.filter(admin => !selectedIds.includes(admin.id)))

      if (viewedAdmin && selectedIds.includes(viewedAdmin.id)) {
        setViewedAdmin(null)
      }

      const globalBulkActivity = {
        id: Date.now(),
        title: 'Bulk Admins Deleted',
        subtitle: `Deleted: ${adminNames}`,
        time: 'Just now'
      }
      setActivities(prev => [globalBulkActivity, ...prev])
      setShowBulkDeleteConfirm(false)
    } catch (err) {
      console.error('Failed to bulk delete admins:', err)
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to delete selected admins'
      setBulkDeleteError(errMsg)
      await fetchAdmins()
    } finally {
      setBulkDeleteLoading(false)
    }
  }

  // Confirm and Execute Deletion (DELETE /api/superadmin/admins/delete/:id)
  const handleDeleteConfirm = async () => {
    if (!deletingAdminId) return
    const adminToDelete = adminsList.find((a) => a.id === deletingAdminId)
    const adminName = adminToDelete?.name || 'Admin'

    setDeleteLoading(true)
    setDeleteError('')

    try {
      const res = await deleteAdmin(deletingAdminId)

      setAdminsList(prevList => prevList.filter((a) => a.id !== deletingAdminId))

      const deleteActivity = {
        id: Date.now(),
        title: 'Admin Account Deleted',
        subtitle: res?.message || `${adminName} was deleted`,
        time: 'Just now'
      }
      setActivities(prev => [deleteActivity, ...prev])

      // If deleting the currently viewed profile admin, reset profile navigation state
      if (viewedAdmin && (viewedAdmin.id === deletingAdminId || viewedAdmin._id === deletingAdminId)) {
        setViewedAdmin(null)
      }

      setDeletingAdminId(null)
    } catch (err) {
      console.error('Failed to delete admin:', err)
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to delete admin'
      setDeleteError(errMsg)
    } finally {
      setDeleteLoading(false)
    }
  }

  // Open Assign Permissions Modal
  const handleOpenPermissions = async (admin) => {
    setPermissionAdmin(admin)
    setPermissionError('')
    setPermissionSuccessMsg('')

    // Default template initialization
    const initialPerms = {}
    PERMISSION_MODULES.forEach(mod => {
      initialPerms[mod.key] = {}
      mod.actions.forEach(act => {
        initialPerms[mod.key][act] = ['VIEW', 'ADD', 'EDIT'].includes(act)
      })
    })

    setAdminPermissions(initialPerms)

    const adminId = admin?.id || admin?._id
    if (adminId) {
      try {
        setPermissionLoading(true)
        const res = await getPermissionsByAdminId(adminId)
        const rawData = res?.data || res?.permissions || res?.admin?.permissions || res

        const permList = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData?.permissions)
          ? rawData.permissions
          : []

        if (permList.length > 0) {
          const loadedPerms = {}
          PERMISSION_MODULES.forEach(mod => {
            loadedPerms[mod.key] = {}
            mod.actions.forEach(act => {
              loadedPerms[mod.key][act] = false
            })
          })

          permList.forEach(item => {
            const modKey = item.module || item.moduleName || item.name
            if (loadedPerms[modKey]) {
              const actions = Array.isArray(item.actions) ? item.actions : []
              actions.forEach(act => {
                const actUpper = String(act).toUpperCase()
                loadedPerms[modKey][actUpper] = true
              })
            }
          })
          setAdminPermissions(loadedPerms)
        }
      } catch (err) {
        console.log('Failed to fetch admin permissions by ID, using template:', err)
      } finally {
        setPermissionLoading(false)
      }
    }
  }

  // Toggle single action in Assign Permissions modal
  const handleTogglePermissionAction = (moduleKey, action) => {
    setAdminPermissions(prev => ({
      ...prev,
      [moduleKey]: {
        ...prev[moduleKey],
        [action]: !prev[moduleKey]?.[action]
      }
    }))
  }

  // Toggle all actions in Assign Permissions modal
  const handleToggleAllPermissions = (enable = true) => {
    const updated = {}
    PERMISSION_MODULES.forEach(mod => {
      updated[mod.key] = {}
      mod.actions.forEach(act => {
        updated[mod.key][act] = enable
      })
    })
    setAdminPermissions(updated)
  }

  // Save Permissions via POST /api/superadmin/permissions/assign
  const handleSavePermissions = async (e) => {
    if (e) e.preventDefault()
    if (!permissionAdmin) return

    const adminId = permissionAdmin.id || permissionAdmin._id
    if (!adminId) {
      setPermissionError('Admin ID is missing.')
      return
    }

    setPermissionLoading(true)
    setPermissionError('')
    setPermissionSuccessMsg('')

    try {
      const formattedPermissions = PERMISSION_MODULES.map(m => {
        const activeActions = m.actions.filter(a => adminPermissions[m.key]?.[a])
        return {
          module: m.key,
          actions: activeActions
        }
      }).filter(p => p.actions.length > 0)

      let res
      try {
        res = await assignPermissions({ adminId, permissions: formattedPermissions })
      } catch (postErr) {
        if (postErr.response?.status === 409 || (postErr.response?.status === 400 && (postErr.response?.data?.message?.toLowerCase().includes('exist') || postErr.response?.data?.message?.toLowerCase().includes('update')))) {
          res = await updatePermissions(adminId, { permissions: formattedPermissions })
        } else {
          throw postErr
        }
      }

      const successMsg = res?.message || 'Permissions assigned successfully.'
      setPermissionSuccessMsg(successMsg)

      const permAct = {
        id: Date.now(),
        title: 'Permissions Updated',
        description: `${permissionAdmin.name}: Updated ${formattedPermissions.length} module permissions`,
        time: 'Just now'
      }

      setActivities(prev => [{
        id: Date.now(),
        title: 'Permissions Assigned',
        subtitle: `${permissionAdmin.name} permissions updated`,
        time: 'Just now'
      }, ...prev])

      setAdminsList(prevList => prevList.map(a => {
        if (a.id === adminId) {
          return {
            ...a,
            activities: [permAct, ...(a.activities || [])]
          }
        }
        return a
      }))

      if (viewedAdmin && (viewedAdmin.id === adminId || viewedAdmin._id === adminId)) {
        setViewedAdmin(prev => ({
          ...prev,
          activities: [permAct, ...(prev?.activities || [])]
        }))
      }

      setTimeout(() => {
        setPermissionAdmin(null)
      }, 1500)
    } catch (err) {
      console.error('Failed to assign permissions:', err)
      const rawMsg = err?.response?.data?.message || err?.message || 'Failed to assign permissions.'
      const lower = rawMsg.toLowerCase()
      if (lower.includes('jwt expired') || lower.includes('token expired') || lower.includes('unauthorized') || err?.response?.status === 401) {
        setPermissionError('Your login session has expired. Please log in again to renew your access.')
      } else {
        setPermissionError(rawMsg)
      }
    } finally {
      setPermissionLoading(false)
    }
  }

  // Delete / Reset Permissions (DELETE /api/superadmin/permissions/delete/:adminId)
  const handleDeleteAdminPermissions = async () => {
    if (!permissionAdmin) return
    const adminId = permissionAdmin.id || permissionAdmin._id
    if (!adminId) return

    if (!window.confirm(`Are you sure you want to delete permissions for ${permissionAdmin.name}?`)) {
      return
    }

    setPermissionLoading(true)
    setPermissionError('')
    setPermissionSuccessMsg('')

    try {
      const res = await deletePermissions(adminId)
      const successMsg = res?.message || 'Permissions deleted successfully.'
      setPermissionSuccessMsg(successMsg)

      // Clear all modal checkboxes
      const cleared = {}
      PERMISSION_MODULES.forEach(mod => {
        cleared[mod.key] = {}
        mod.actions.forEach(act => {
          cleared[mod.key][act] = false
        })
      })
      setAdminPermissions(cleared)

      const delPermAct = {
        id: Date.now(),
        title: 'Permissions Deleted',
        description: `${permissionAdmin.name}: Permissions reset via API`,
        time: 'Just now'
      }
      setActivities(prev => [{
        id: Date.now(),
        title: 'Permissions Deleted',
        subtitle: `${permissionAdmin.name} permissions reset`,
        time: 'Just now'
      }, ...prev])

      setAdminsList(prevList => prevList.map(a => {
        if (a.id === adminId) {
          return {
            ...a,
            activities: [delPermAct, ...(a.activities || [])]
          }
        }
        return a
      }))

      if (viewedAdmin && (viewedAdmin.id === adminId || viewedAdmin._id === adminId)) {
        setViewedAdmin(prev => ({
          ...prev,
          activities: [delPermAct, ...(prev?.activities || [])]
        }))
      }

      setTimeout(() => {
        setPermissionAdmin(null)
      }, 1500)
    } catch (err) {
      console.error('Failed to delete permissions:', err)
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to delete permissions.'
      setPermissionError(errMsg)
    } finally {
      setPermissionLoading(false)
    }
  }

  // Filter list
  const filteredAdmins = adminsList.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' ? true : admin.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Pagination index slicing
  const totalItems = filteredAdmins.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAdmins = filteredAdmins.slice(startIndex, startIndex + itemsPerPage)

  // Mock profile specific activity logs
  const profileActivities = [
    { id: 101, title: 'Approved New Vendor Request', description: 'Techno India', time: 'May 22, 2026 11:23 PM' },
    { id: 102, title: 'Resolved Refund Request', description: 'Order #ORD00087', time: 'May 18, 2026 12:40 AM' },
    { id: 103, title: 'Cancelled Order #ORD08234', description: 'Order #ORD08234', time: 'Apr 28, 2026 03:15 PM' },
    { id: 104, title: 'Blocked Customer @JohnDoe', description: 'John Doe', time: 'Mar 02, 2026 04:30 PM' }
  ]

  // Mock profile specific login history logs
  const profileLoginHistory = [
    { id: 201, event: 'Logged In', timestamp: '18 May 2026, 11:31 AM' },
    { id: 202, event: 'Logged Out', timestamp: '14 May 2026, 12:01 AM' },
    { id: 203, event: 'Logged In', timestamp: '02 May 2026, 09:30 PM' },
    { id: 204, event: 'Logged In', timestamp: '02 May 2026, 08:30 PM' },
    { id: 205, event: 'Logged In', timestamp: '02 May 2026, 09:30 PM' }
  ]

  // Render sub-views conditionally
  if (isAdding) {
    // Add / Edit Admin workspace form
    return (
      <div className="admin-form-panel">
        <div className="form-workspace-header">
          <button
            className="back-circle-btn"
            aria-label="Back to Admin list"
            onClick={() => {
              setIsAdding(false)
              setEditingAdmin(null)
              setFormError('')
            }}
          >
            <ArrowLeft style={{ width: '18px', height: '18px' }} />
          </button>
          <h2>{editingAdmin ? 'Edit Admin' : 'Add New Admin'}</h2>
        </div>

        <form onSubmit={handleFormSubmit} autoComplete="off">
          {/* Hidden dummy fields to prevent browser from autofilling stored credentials */}
          <input type="text" name="fake_username_prevent_autofill" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />
          <input type="password" name="fake_password_prevent_autofill" style={{ display: 'none' }} tabIndex="-1" autoComplete="new-password" />

          {formError && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #F87171',
              color: '#DC2626',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              ⚠️ {formError}
            </div>
          )}

          <div className="form-fields-grid">
            {/* File Upload Box */}
            <div className="form-field-full">
              <span className="image-upload-label">Upload Images</span>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleImageChange}
              />
              {formData.imagePreview ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="uploaded-preview-img"
                  />
                  <button
                    type="button"
                    className="btn-cancel-red"
                    style={{ padding: '8px 16px', fontSize: '12px' }}
                    onClick={() => setFormData(prev => ({ ...prev, imageFile: null, imagePreview: '' }))}
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="image-upload-box" onClick={handleImageClick}>
                  <Upload className="upload-icon-cloud" />
                  <span className="upload-primary-text">Upload Image</span>
                  <span className="upload-secondary-text">PNG / JPG up to 10 MB</span>
                </div>
              )}
            </div>

            {/* Name Field */}
            <div className="form-field-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label htmlFor="admin-name" style={{ margin: 0 }}>Name *</label>
                <span style={{ fontSize: '12px', color: formData.name.length >= 50 ? '#DC2626' : '#90a4ae', fontWeight: formData.name.length >= 50 ? '600' : '400' }}>
                  {formData.name.length}/50
                </span>
              </div>
              <input
                id="admin-name"
                name="admin_name_field"
                type="text"
                placeholder="Enter Name (e.g. Super Admin)"
                value={formData.name}
                maxLength={50}
                onKeyDown={(e) => {
                  if (formData.name.length >= 50 && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    setNameError('Name cannot exceed 50 characters.')
                  }
                }}
                onChange={(e) => {
                  const rawVal = e.target.value
                  let error = ''
                  if (rawVal.length > 50) {
                    error = 'Name cannot exceed 50 characters.'
                  }
                  const sanitized = rawVal.replace(/[^a-zA-Z\s]/g, '')
                  if (rawVal !== sanitized && !error) {
                    error = 'Only alphabets and spaces are allowed for Name.'
                  }
                  setNameError(error)
                  setFormData({ ...formData, name: sanitized.slice(0, 50) })
                  if (formError) setFormError('')
                }}
                autoComplete="off"
                required
              />
              {nameError && (
                <span style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'block', fontWeight: '500' }}>
                  ⚠️ {nameError}
                </span>
              )}
            </div>

            {/* Email Address Field */}
            <div className="form-field-item">
              <label htmlFor="admin-email">Email Address *</label>
              <input
                id="admin-email"
                name="admin_email_field"
                type="email"
                placeholder="Enter Email (e.g. admin@example.com)"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  if (formError) setFormError('')
                }}
                autoComplete="new-password"
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-field-item">
              <label htmlFor="admin-password">
                {editingAdmin ? 'Password (Leave blank to keep unchanged)' : 'Password *'}
              </label>
              <input
                id="admin-password"
                name="admin_password_field"
                type="password"
                placeholder={editingAdmin ? "Enter New Password (optional)" : "Enter Password (e.g. Admin@123)"}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value })
                  if (formError) setFormError('')
                }}
                autoComplete="new-password"
                required={!editingAdmin}
              />
            </div>

            {/* Phone Field */}
            <div className="form-field-item">
              <label htmlFor="admin-phone">Phone Number *</label>
              <input
                id="admin-phone"
                name="admin_phone_field"
                type="tel"
                placeholder="Enter 10-digit Phone Number (e.g. 9876543210)"
                value={formData.phone}
                maxLength={10}
                onChange={(e) => {
                  const rawVal = e.target.value
                  const digitsOnly = rawVal.replace(/\D/g, '').slice(0, 10)
                  if (rawVal && rawVal !== digitsOnly) {
                    setPhoneError('Only digits (0-9) are allowed for Phone Number.')
                  } else {
                    setPhoneError('')
                  }
                  setFormData({ ...formData, phone: digitsOnly })
                  if (formError) setFormError('')
                }}
                autoComplete="off"
                required
              />
              {phoneError && (
                <span style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'block', fontWeight: '500' }}>
                  ⚠️ {phoneError}
                </span>
              )}
            </div>

            {/* Gender Field */}
            <div className="form-field-item">
              <label htmlFor="admin-gender">Gender *</label>
              <select
                id="admin-gender"
                name="admin_gender_field"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Role Field */}
            <div className="form-field-item">
              <label htmlFor="admin-role">Role *</label>
              <select
                id="admin-role"
                name="admin_role_field"
                value={formData.role || 'ADMIN'}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              >
                <option value="ADMIN">ADMIN</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                <option value="MANAGER">MANAGER</option>
                <option value="EDITOR">EDITOR</option>
              </select>
            </div>

            <div className="status-toggle-wrapper">
              <div
                className={`status-toggle-container ${formData.isActive ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
              >
                <div className="status-toggle-pill">
                  <span className="status-toggle-text">
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons Row */}
          <div className="form-actions-row">
            <button
              type="button"
              className="btn-cancel-red"
              onClick={() => {
                setFormError('')
                setIsAdding(false)
                setEditingAdmin(null)
              }}
              disabled={formLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-add-green"
              disabled={formLoading}
            >
              {formLoading
                ? (editingAdmin ? 'Saving Changes...' : 'Creating Admin...')
                : (editingAdmin ? 'Save Changes' : 'Add Admin')}
            </button>
          </div>
        </form>
      </div>
    )
  }

  if (viewedAdmin) {
    // Admin profile details view
    return (
      <div className="admin-profile-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header section with back chevron button */}
        <div className="form-workspace-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              className="back-circle-btn"
              aria-label="Back to Admin list"
              onClick={() => {
                setProfileError(null)
                setViewedAdmin(null)
              }}
            >
              <ArrowLeft style={{ width: '18px', height: '18px' }} />
            </button>
            <h2>Admins Profile</h2>
          </div>
          {profileLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '13px' }}>
              <RotateCw style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
              <span>Fetching latest profile...</span>
            </div>
          )}
        </div>

        {profileError && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #F87171',
            color: '#DC2626',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>⚠️ {profileError}</span>
            <button
              onClick={() => handleViewAdmin(viewedAdmin)}
              style={{
                backgroundColor: '#DC2626',
                color: '#fff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Profile Card details */}
        <div className="admin-profile-card">
          <div className="admin-profile-row">
            <div className="admin-profile-left">
              <img
                src={viewedAdmin.image || 'https://via.placeholder.com/150'}
                alt={viewedAdmin.name}
                className="admin-profile-avatar"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150'
                }}
              />
              <div className="admin-profile-info">
                <h3>{viewedAdmin.name}</h3>
                <span
                  className={`admin-status-badge clickable ${viewedAdmin.status}`}
                  style={{ width: 'fit-content', cursor: 'pointer' }}
                  onClick={() => handleRequestToggleStatus(viewedAdmin.id)}
                  title="Click to toggle status"
                >
                  {viewedAdmin.status}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                className="btn-profile-edit"
                style={{ backgroundColor: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => handleOpenPermissions(viewedAdmin)}
              >
                <Key style={{ width: '16px', height: '16px' }} />
                Permissions
              </button>
              <button
                className="btn-profile-edit"
                onClick={() => handleOpenEdit(viewedAdmin)}
              >
                <Edit style={{ width: '16px', height: '16px' }} />
                Edit
              </button>
            </div>
          </div>

          <div className="admin-details-fields-grid">
            <div className="admin-detail-item">
              <span className="label">Name</span>
              <span className="value">{viewedAdmin.name}</span>
            </div>
            <div className="admin-detail-item">
              <span className="label">Email Address</span>
              <span className="value">{viewedAdmin.email}</span>
            </div>
            <div className="admin-detail-item">
              <span className="label">Phone</span>
              <span className="value">{viewedAdmin.phone || 'N/A'}</span>
            </div>
            <div className="admin-detail-item">
              <span className="label">Gender</span>
              <span className="value">{viewedAdmin.gender || 'Select'}</span>
            </div>
            <div className="admin-detail-item">
              <span className="label">Role</span>
              <span className="value">{viewedAdmin.role || 'ADMIN'}</span>
            </div>
            <div className="admin-detail-item">
              <span className="label">Joined Date</span>
              <span className="value">{viewedAdmin.joinedDate || '12 Jan 2025'}</span>
            </div>
            <div className="admin-detail-item">
              <span className="label">Last Login</span>
              <span className="value">{viewedAdmin.lastLogin || 'Never'}</span>
            </div>
          </div>
        </div>

        {/* Two-column lists bottom section */}
        <div className="dashboard-grid-columns">
          {/* Activity Log Card */}
          <div className="dashboard-card-panel">
            <div className="panel-header-row" style={{ borderBottom: '1px solid #f1f3f4', paddingBottom: '12px', marginBottom: '16px' }}>
              <h2 className="panel-title" style={{ fontSize: '16px' }}>Activity log</h2>
            </div>

            <div className="activities-list">
              {viewedAdmin.activities && viewedAdmin.activities.length > 0 ? (
                viewedAdmin.activities.map((act) => (
                  <div key={act.id} className="activity-item" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div className="activity-title" style={{ fontSize: '14px', fontWeight: '600' }}>{act.title}</div>
                      <span className="activity-log-green-tag">{act.description}</span>
                    </div>
                    <div className="activity-timestamp" style={{ fontSize: '11px', color: '#90a4ae', flexShrink: 0 }}>
                      {formatElapsedTime(act.timestamp, act.time)}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '16px', color: '#90a4ae', fontSize: '13px' }}>
                  No recent activities logged.
                </div>
              )}
            </div>
          </div>

          {/* Login History Card */}
          <div className="history-logs-card">
            <div className="panel-header-row" style={{ borderBottom: '1px solid #f1f3f4', paddingBottom: '12px', marginBottom: '16px' }}>
              <h2 className="panel-title" style={{ fontSize: '16px' }}>Login History</h2>
            </div>

            <div className="activities-list">
              {viewedAdmin.loginHistory && viewedAdmin.loginHistory.length > 0 ? (
                viewedAdmin.loginHistory.map((hist) => (
                  <div key={hist.id} className="activity-item" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#37474f' }}>{hist.event}</span>
                    <span style={{ fontSize: '12px', color: '#78909c' }}>{hist.timestamp}</span>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '16px', color: '#90a4ae', fontSize: '13px' }}>
                  No login history found.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    )
  }

  // Default List View
  const stats = [
    {
      id: 'total',
      filterVal: 'all',
      label: 'Total Admins',
      value: totalCount,
      icon: Users,
      background: '#ffecb3',
      color: '#3b82f6',
    },
    {
      id: 'active',
      filterVal: 'active',
      label: 'Active Admins',
      value: activeCount,
      icon: UserCheck,
      background: '#c8e6c9',
      color: '#2ecc71',
    },
    {
      id: 'inactive',
      filterVal: 'inactive',
      label: 'Inactive Admins',
      value: inactiveCount,
      icon: UserMinus,
      background: '#ffcdd2',
      color: '#f43f5e',
    },
  ]

  return (
    <div className="admins-management-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title Header with Add and Refresh buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Admins</h1>
          <p style={{ color: '#607d8b', fontSize: '13px' }}>
            Manage and Monitor all administrator who have access to the system.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="edit-profile-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: '#f8fafc',
              color: '#334155',
              border: '1px solid #cbd5e1',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            onClick={fetchAdmins}
            disabled={loading}
            title="Refresh list"
          >
            <RotateCw style={{ width: '16px', height: '16px', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            className="edit-profile-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
            onClick={handleOpenAdd}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            Add New Admin
          </button>
        </div>
      </div>

      {fetchError && (
        <div style={{
          backgroundColor: '#FEF2F2',
          border: '1px solid #F87171',
          color: '#DC2626',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>⚠️ {fetchError}</span>
          <button
            onClick={fetchAdmins}
            style={{
              backgroundColor: '#DC2626',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {stats.map((stat) => {
          const Icon = stat.icon
          const isActive = statusFilter === stat.filterVal
          return (
            <div
              key={stat.id}
              className={`stat-card clickable ${isActive ? 'active-filter' : ''}`}
              style={{ backgroundColor: stat.background, color: stat.color }}
              onClick={() => setStatusFilter(stat.filterVal)}
              title={`Click to filter by ${stat.label}`}
            >
              <div
                className="stat-icon-wrapper"
                style={{ backgroundColor: 'rgba(255,255,255,0.7)', color: stat.color }}
              >
                <Icon />
              </div>
              <div className="stat-value" style={{ fontSize: '24px', fontWeight: '700' }}>{stat.value}</div>
              <div className="stat-label" style={{ color: '#546e7a', fontWeight: '500' }}>{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Recent Admin Activity Panel */}
      <div className="dashboard-card-panel">
        <div className="panel-header-row" style={{ borderBottom: '1px solid #f1f3f4', paddingBottom: '12px', marginBottom: '16px' }}>
          <h2 className="panel-title" style={{ fontSize: '16px' }}>Recent Admin Activity</h2>
        </div>

        <div className="activities-list">
          {activities.length > 0 ? (
            activities.map((act) => (
              <div key={act.id} className="activity-item" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div className="activity-title" style={{ fontSize: '14px', fontWeight: '600' }}>{act.title}</div>
                  <div style={{ fontSize: '12px', color: '#78909c' }}>{act.subtitle}</div>
                </div>
                <div className="activity-timestamp" style={{ fontSize: '12px', color: '#90a4ae', fontWeight: '500' }}>
                  {formatElapsedTime(act.timestamp, act.time)}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '16px', color: '#90a4ae', fontSize: '13px' }}>
              No recent admin activity recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* Admins Table Card */}
      <div className="dashboard-card-panel" style={{ paddingBottom: adminsList.some(a => a.checked) ? '80px' : '24px' }}>
        {/* Table Filters */}
        <div className="table-filter-bar">
          <div className="table-search-wrapper">
            <Search />
            <input
              type="text"
              placeholder="Search Admin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="status-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Admins Table */}
        <div className="admins-table-wrapper">
          <table className="admins-table">
            <thead>
              <tr>
                <th style={{ width: '60px', textAlign: 'center' }}>Sr.No.</th>
                <th>Admins Name</th>
                <th>Email</th>
                <th>Joined On</th>
                <th>Last Login</th>
                <th>Status</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <RotateCw style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                      <span>Loading administrators...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedAdmins.length > 0 ? (
                paginatedAdmins.map((admin, idx) => (
                  <tr key={admin.id}>
                    <td style={{ textAlign: 'center', fontWeight: '500', color: '#64748b' }}>
                      {startIndex + idx + 1}
                    </td>
                    <td>
                      <div className="table-admin-name-cell">
                        <img
                          src={admin.image || 'https://via.placeholder.com/150'}
                          alt={admin.name}
                          className="table-admin-avatar"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150'
                          }}
                        />
                        <span
                          className="table-link-name"
                          onClick={() => handleViewAdmin(admin)}
                        >
                          {admin.name}
                        </span>
                      </div>
                    </td>
                    <td>{admin.email}</td>
                    <td>{admin.joinedDate || 'Jun 15, 2026'}</td>
                    <td>{admin.lastLogin}</td>
                    <td>
                      <span
                        className={`admin-status-badge clickable ${admin.status}`}
                        onClick={() => handleRequestToggleStatus(admin.id)}
                        title="Click to toggle status"
                      >
                        {admin.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className="action-menu-wrapper">
                          <button
                            className="table-action-btn"
                            aria-label="Open Actions"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveActionMenuId(activeActionMenuId === admin.id ? null : admin.id)
                            }}
                          >
                            <MoreVertical style={{ width: '16px', height: '16px' }} />
                          </button>

                          {/* Action Context Menu */}
                          {activeActionMenuId === admin.id && (
                            <div className="action-menu-dropdown" onClick={(e) => e.stopPropagation()}>
                              <button
                                className="action-dropdown-item"
                                onClick={() => {
                                  handleRequestToggleStatus(admin.id)
                                  setActiveActionMenuId(null)
                                }}
                              >
                                {admin.status === 'active' ? (
                                  <>
                                    <UserMinus style={{ width: '14px', height: '14px', color: '#dc2626' }} />
                                    <span>Deactivate</span>
                                  </>
                                ) : (
                                  <>
                                    <UserCheck style={{ width: '14px', height: '14px', color: '#16a34a' }} />
                                    <span>Activate</span>
                                  </>
                                )}
                              </button>
                              <button
                                className="action-dropdown-item"
                                onClick={() => {
                                  handleOpenPermissions(admin)
                                  setActiveActionMenuId(null)
                                }}
                              >
                                <Key style={{ width: '14px', height: '14px', color: '#166534' }} />
                                Permissions
                              </button>
                              <button
                                className="action-dropdown-item"
                                onClick={() => {
                                  handleOpenEdit(admin)
                                  setActiveActionMenuId(null)
                                }}
                              >
                                <Edit style={{ width: '14px', height: '14px' }} />
                                Edit
                              </button>
                              <button
                                className="action-dropdown-item delete"
                                onClick={() => {
                                  setDeletingAdminId(admin.id)
                                  setActiveActionMenuId(null)
                                }}
                              >
                                <Trash2 style={{ width: '14px', height: '14px' }} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#90a4ae' }}>
                    No administrators found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Entries and Pagination */}
        <div className="offers-table-footer">
          <div className="footer-entries-text">
            Showing {Math.min(startIndex + 1, totalItems)} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} Entries
          </div>
          <div className="offers-pagination">
            <button
              className="pag-btn"
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={`pag-btn ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}
            <button
              className="pag-btn"
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bulk Actions Bar */}
      <div className={`bulk-actions-bar ${adminsList.some(a => a.checked) ? 'show' : ''}`}>
        <span className="bulk-actions-count">
          {adminsList.filter(a => a.checked).length} selected
        </span>
        <button className="bulk-action-btn activate" onClick={() => handleBulkStatusChange('active')}>
          <UserCheck style={{ width: '16px', height: '16px' }} />
          Activate
        </button>
        <button className="bulk-action-btn deactivate" onClick={() => handleBulkStatusChange('inactive')}>
          <UserMinus style={{ width: '16px', height: '16px' }} />
          Deactivate
        </button>
        <button className="bulk-action-btn delete" onClick={() => setShowBulkDeleteConfirm(true)}>
          <Trash2 style={{ width: '16px', height: '16px' }} />
          Delete
        </button>
      </div>

      {/* Bulk Delete Confirmation Modal Overlay */}
      {showBulkDeleteConfirm && (
        <div className="modal-overlay" onClick={() => !bulkDeleteLoading && setShowBulkDeleteConfirm(false)}>
          <div className="delete-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-title">Delete Selected Admins</div>
            <div className="delete-modal-subtitle">
              Are you sure you want to delete the {adminsList.filter(a => a.checked).length} selected admin accounts? This action cannot be undone.
            </div>

            {bulkDeleteError && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #F87171',
                color: '#DC2626',
                padding: '8px 12px',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '13px',
                fontWeight: '500'
              }}>
                ⚠️ {bulkDeleteError}
              </div>
            )}

            <div className="delete-modal-buttons">
              <button
                type="button"
                className="btn-delete-cancel"
                onClick={() => {
                  setBulkDeleteError('')
                  setShowBulkDeleteConfirm(false)
                }}
                disabled={bulkDeleteLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-delete-confirm"
                onClick={handleBulkDeleteConfirm}
                disabled={bulkDeleteLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  opacity: bulkDeleteLoading ? 0.7 : 1,
                  cursor: bulkDeleteLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {bulkDeleteLoading && <RotateCw style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />}
                {bulkDeleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal Overlay */}
      {editingAdmin && (
        <div className="modal-overlay" onClick={() => !editLoading && setEditingAdmin(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f3f4', paddingBottom: '12px' }}>
              <h2 className="modal-title" style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Edit Admin Details</h2>
              <button
                style={{ background: 'none', border: 'none', cursor: editLoading ? 'not-allowed' : 'pointer', color: '#78909c', display: 'flex', padding: '4px' }}
                onClick={() => !editLoading && setEditingAdmin(null)}
                disabled={editLoading}
                aria-label="Close modal"
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            {editError && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #F87171',
                color: '#DC2626',
                padding: '10px 14px',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '13px',
                fontWeight: '500'
              }}>
                ⚠️ {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="modal-form">
              <div className="modal-field">
                <label htmlFor="edit-name">Name *</label>
                <input
                  id="edit-name"
                  type="text"
                  value={editingAdmin.name}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, name: e.target.value })}
                  required
                  disabled={editLoading}
                />
              </div>

              <div className="modal-field">
                <label htmlFor="edit-email">Email Address *</label>
                <input
                  id="edit-email"
                  type="email"
                  value={editingAdmin.email}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, email: e.target.value })}
                  required
                  disabled={editLoading}
                />
              </div>

              <div className="modal-field">
                <label htmlFor="edit-phone">Phone</label>
                <input
                  id="edit-phone"
                  type="tel"
                  placeholder="e.g. 9876543211"
                  value={editingAdmin.phone}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, phone: e.target.value })}
                  disabled={editLoading}
                />
              </div>

              <div className="modal-field">
                <label htmlFor="edit-gender">Gender</label>
                <select
                  id="edit-gender"
                  value={editingAdmin.gender || 'Male'}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, gender: e.target.value })}
                  disabled={editLoading}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="modal-field">
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '4px', display: 'block' }}>Status</span>
                <div
                  className={`status-toggle-container ${editingAdmin.isActive ? 'active' : ''}`}
                  onClick={() => !editLoading && setEditingAdmin(prev => ({ ...prev, isActive: !prev.isActive }))}
                  style={{ opacity: editLoading ? 0.7 : 1, cursor: editLoading ? 'not-allowed' : 'pointer' }}
                >
                  <div className="status-toggle-pill">
                    <span className="status-toggle-text">
                      {editingAdmin.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-buttons" style={{ marginTop: '20px', gap: '12px' }}>
                <button
                  type="button"
                  className="btn-cancel-red"
                  style={{ width: '50%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', cursor: editLoading ? 'not-allowed' : 'pointer' }}
                  onClick={() => setEditingAdmin(null)}
                  disabled={editLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-changes-btn"
                  disabled={editLoading}
                  style={{
                    width: '50%',
                    padding: '12px 24px',
                    backgroundColor: '#a8d572',
                    color: '#0e1e05',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: editLoading ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--admin-font)',
                    opacity: editLoading ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {editLoading && <RotateCw style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />}
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Permissions Modal Overlay */}
      {permissionAdmin && (
        <div className="modal-overlay" onClick={() => !permissionLoading && setPermissionAdmin(null)}>
          <div
            className="modal-box"
            style={{ maxWidth: '750px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f3f4', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2e7d32' }}>
                  <Key size={20} />
                </div>
                <div>
                  <h2 className="modal-title" style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>
                    Assign Permissions
                  </h2>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Admin: <strong>{permissionAdmin.name}</strong> ({permissionAdmin.email})
                  </span>
                </div>
              </div>
              <button
                style={{ background: 'none', border: 'none', cursor: permissionLoading ? 'not-allowed' : 'pointer', color: '#78909c', display: 'flex', padding: '4px' }}
                onClick={() => !permissionLoading && setPermissionAdmin(null)}
                disabled={permissionLoading}
                aria-label="Close modal"
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            {/* Quick Controls */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', cursor: 'pointer', fontWeight: '600' }}
                  onClick={() => handleToggleAllPermissions(true)}
                  disabled={permissionLoading}
                >
                  <CheckSquare size={14} />
                  Select All
                </button>
                <button
                  type="button"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', cursor: 'pointer', fontWeight: '600' }}
                  onClick={() => handleToggleAllPermissions(false)}
                  disabled={permissionLoading}
                >
                  <Square size={14} />
                  Clear All
                </button>
              </div>
            </div>

            {/* Feedback Alerts */}
            {permissionSuccessMsg && (
              <div style={{
                backgroundColor: '#ECFDF5',
                border: '1px solid #6EE7B7',
                color: '#065F46',
                padding: '10px 14px',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle size={16} />
                <span>{permissionSuccessMsg}</span>
              </div>
            )}

            {permissionError && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #F87171',
                color: '#DC2626',
                padding: '10px 14px',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '13px',
                fontWeight: '500'
              }}>
                ⚠️ {permissionError}
              </div>
            )}

            {/* Module Permissions Grid */}
            <form onSubmit={handleSavePermissions} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{ flex: 1, overflowY: 'auto', paddingRight: '6px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {PERMISSION_MODULES.map((mod) => {
                  const currentModPerms = adminPermissions[mod.key] || {}
                  const activeCount = mod.actions.filter(a => currentModPerms[a]).length
                  const allActive = activeCount === mod.actions.length

                  return (
                    <div
                      key={mod.key}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '12px',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '6px', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Shield size={16} color="#166534" />
                          <strong style={{ fontSize: '14px', color: '#1e293b' }}>{mod.label}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newStatus = !allActive
                            setAdminPermissions(prev => ({
                              ...prev,
                              [mod.key]: mod.actions.reduce((acc, a) => ({ ...acc, [a]: newStatus }), {})
                            }))
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: allActive ? '#059669' : '#64748b',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          {allActive ? 'Deselect Module' : 'Select All'}
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {mod.actions.map((act) => {
                          const isChecked = !!currentModPerms[act]
                          return (
                            <label
                              key={act}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                border: isChecked ? '1px solid #a3cc66' : '1px solid #e2e8f0',
                                backgroundColor: isChecked ? '#f7fee7' : '#f8fafc',
                                color: isChecked ? '#365314' : '#64748b',
                                fontSize: '12px',
                                fontWeight: isChecked ? '600' : '500',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleTogglePermissionAction(mod.key, act)}
                                disabled={permissionLoading}
                                style={{ cursor: 'pointer', accentColor: '#65a30d' }}
                              />
                              <span>{act}</span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Action Buttons */}
              <div className="modal-buttons" style={{ marginTop: '16px', gap: '10px', paddingTop: '12px', borderTop: '1px solid #f1f3f4', display: 'flex', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn-cancel-red"
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', cursor: permissionLoading ? 'not-allowed' : 'pointer' }}
                  onClick={() => setPermissionAdmin(null)}
                  disabled={permissionLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-changes-btn"
                  disabled={permissionLoading}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    backgroundColor: '#a3cc66',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: permissionLoading ? 'not-allowed' : 'pointer',
                    opacity: permissionLoading ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {permissionLoading ? (
                    <>
                      <RotateCw style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Key style={{ width: '16px', height: '16px' }} />
                      <span>Save Permissions</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Overlay */}
      {deletingAdminId && (
        <div className="modal-overlay" onClick={() => !deleteLoading && setDeletingAdminId(null)}>
          <div className="delete-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-title">Delete Admin</div>
            <div className="delete-modal-subtitle">Are you sure you want to delete this administrator? This action cannot be undone.</div>

            {deleteError && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #F87171',
                color: '#DC2626',
                padding: '8px 12px',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '13px',
                fontWeight: '500'
              }}>
                ⚠️ {deleteError}
              </div>
            )}

            <div className="delete-modal-buttons">
              <button
                type="button"
                className="btn-delete-cancel"
                onClick={() => {
                  setDeleteError('')
                  setDeletingAdminId(null)
                }}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-delete-confirm"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  opacity: deleteLoading ? 0.7 : 1,
                  cursor: deleteLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {deleteLoading && <RotateCw style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />}
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Status Toggle Confirmation Modal Overlay */}
      {statusConfirmAdmin && (
        <div className="modal-overlay" onClick={() => !statusToggleLoading && setStatusConfirmAdmin(null)}>
          <div className="delete-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-title">
              {statusConfirmAdmin.action === 'deactivate' ? 'Deactivate Admin' : 'Activate Admin'}
            </div>
            <div className="delete-modal-subtitle" style={{ fontSize: '14px', lineHeight: '1.5', color: '#4b5563', margin: '12px 0 20px 0' }}>
              Are you sure you want to {statusConfirmAdmin.action} this admin?
            </div>

            {statusToggleError && (
              <div style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #F87171',
                color: '#DC2626',
                padding: '8px 12px',
                borderRadius: '6px',
                marginBottom: '16px',
                fontSize: '13px',
                fontWeight: '500'
              }}>
                ⚠️ {statusToggleError}
              </div>
            )}

            <div className="delete-modal-buttons">
              <button
                type="button"
                className="btn-delete-cancel"
                onClick={() => {
                  setStatusToggleError('')
                  setStatusConfirmAdmin(null)
                }}
                disabled={statusToggleLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-delete-confirm"
                onClick={handleConfirmToggleStatus}
                disabled={statusToggleLoading}
                style={{
                  backgroundColor: statusConfirmAdmin.action === 'deactivate' ? '#e11d48' : '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  opacity: statusToggleLoading ? 0.7 : 1,
                  cursor: statusToggleLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {statusToggleLoading && <RotateCw style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />}
                {statusToggleLoading
                  ? (statusConfirmAdmin.action === 'deactivate' ? 'Deactivating...' : 'Activating...')
                  : (statusConfirmAdmin.action === 'deactivate' ? 'Yes, Deactivate' : 'Yes, Activate')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminsManagement

