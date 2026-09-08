import React, { useState, useRef, useEffect } from 'react'
import { Users, UserCheck, UserMinus, Search, MoreVertical, Plus, ArrowLeft, Upload, X, Edit, Trash2, RotateCw } from 'lucide-react'
import { registerAdmin, createSuperAdmin, getAllAdmins, getAdminById, updateAdmin, updateAdminStatus, deleteAdmin } from '../services/superAdminService'
import './AdminsManagement.css'


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

        const joinedDateFormatted = admin.createdAt || admin.joinedDate
          ? new Date(admin.createdAt || admin.joinedDate).toLocaleDateString('en-US', {
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
          lastLogin: admin.lastLogin || 'Never',
          checked: false,
          image: admin.profileImage || admin.image || defaultImage,
          activities: admin.activities || [
            { id: 101, title: 'Joined Admin Portal', description: 'Account Active', time: joinedDateFormatted }
          ],
          loginHistory: admin.loginHistory || [
            { id: 201, event: 'Logged In', timestamp: 'Recent' }
          ]
        }
      })

      setAdminsList(formatted)
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

  // Recent Activity Log state (shared/list feed)
  const [activities, setActivities] = useState([
    { id: 1, title: 'New Admin Added', subtitle: 'Ankit Sharma was added', time: '2 min ago' },
    { id: 2, title: 'Role Updated', subtitle: 'Priya Verma role changed', time: '15 min ago' },
    { id: 3, title: 'Admin Logged In', subtitle: 'Rohit Kumar logged in', time: '2 hours ago' },
    { id: 4, title: 'Permission Updated', subtitle: 'Manish Shah Permission updated', time: '3 hours ago' },
  ])

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
    isActive: true,
    imageFile: null,
    imagePreview: ''
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')

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

  // Handle Add Form Submission
  const handleAddSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim()) return

    setFormLoading(true)
    setFormError('')

    try {
      // Call Create Admin API (POST /api/superadmin/admins/register)
      const res = await registerAdmin({
        fullName: formData.name.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.phone.trim() || '9876543210',
        phone: formData.phone.trim() || '9876543210',
        password: formData.password || 'Password@123',
        role: 'ADMIN',
        gender: formData.gender || 'Male',
        status: formData.isActive ? 'ACTIVE' : 'INACTIVE'
      })

      const rawData = res?.data || res?.admin || {}
      const userObj = rawData.userId || rawData

      const defaultImage = formData.gender === 'Female'
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256&h=256'

      const newAdmin = {
        id: rawData._id || userObj._id || userObj.id || Date.now(),
        name: userObj.fullName || userObj.name || formData.name,
        email: userObj.email || formData.email,
        phone: userObj.mobile || userObj.phone || formData.phone || '9876543210',
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
        role: userObj.role || 'ADMIN',
        checked: false,
        image: formData.imagePreview || rawData.profileImage || defaultImage,
        activities: [
          { id: Date.now(), title: 'Admin Account Created', description: res?.message || 'Created via API (/api/superadmin/admins/register)', time: 'Just now' }
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
        time: 'Just now'
      }
      setActivities([newActivity, ...activities])

      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        gender: 'Male',
        isActive: true,
        imageFile: null,
        imagePreview: ''
      })
      setIsAdding(false)
      // Refresh list from API
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
        backendError = errData?.message || (typeof errData === 'string' ? errData : null) || error.message || 'Failed to create Admin. Please check server connection.'
      }

      setFormError(backendError)
    } finally {
      setFormLoading(false)
    }
  }

  // Open Edit Dialog
  const handleOpenEdit = (admin) => {
    setEditError('')
    setEditingAdmin({
      ...admin,
      id: admin.id || admin._id,
      name: admin.name || '',
      email: admin.email || '',
      phone: admin.phone && admin.phone !== 'N/A' ? admin.phone : '',
      role: admin.role || 'ADMIN',
      gender: admin.gender || 'Male',
      isActive: admin.status === 'active'
    })
  }

  // Save Edit Details Changes (PUT /api/superadmin/admins/update/:id)
  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editingAdmin?.name?.trim() || !editingAdmin?.email?.trim()) return

    const adminId = editingAdmin.id || editingAdmin._id
    if (!adminId) {
      setEditError('Admin ID is missing.')
      return
    }

    setEditLoading(true)
    setEditError('')

    try {
      const res = await updateAdmin(adminId, {
        name: editingAdmin.name.trim(),
        email: editingAdmin.email.trim(),
        phone: editingAdmin.phone ? editingAdmin.phone.trim() : '9876543210',
        role: editingAdmin.role || 'ADMIN',
      })

      const updatedData = res?.data || res?.admin || {}
      const updatedName = updatedData.name || updatedData.fullName || editingAdmin.name.trim()
      const updatedEmail = updatedData.email || editingAdmin.email.trim()
      const updatedPhone = updatedData.phone || updatedData.mobile || editingAdmin.phone
      const updatedRole = updatedData.role || editingAdmin.role || 'ADMIN'
      const updatedStatus = updatedData.status
        ? (updatedData.status.toString().toLowerCase() === 'active' ? 'active' : 'inactive')
        : (editingAdmin.isActive ? 'active' : 'inactive')

      const editActivity = {
        id: Date.now(),
        title: 'Admin Details Updated',
        description: res?.message || 'Updated via API (/api/superadmin/admins/update/:id)',
        time: 'Just now'
      }

      // Update list state
      setAdminsList(prevList => prevList.map((a) => {
        if (a.id === adminId) {
          const updatedAdmin = {
            ...a,
            name: updatedName,
            email: updatedEmail,
            phone: updatedPhone,
            role: updatedRole,
            gender: editingAdmin.gender || a.gender,
            status: updatedStatus,
            activities: [editActivity, ...(a.activities || [])]
          }
          return updatedAdmin
        }
        return a
      }))

      // Sync viewed admin profile details
      if (viewedAdmin && (viewedAdmin.id === adminId || viewedAdmin._id === adminId)) {
        setViewedAdmin(prev => ({
          ...prev,
          name: updatedName,
          email: updatedEmail,
          phone: updatedPhone,
          role: updatedRole,
          gender: editingAdmin.gender || prev.gender,
          status: updatedStatus,
          activities: [editActivity, ...(prev?.activities || [])]
        }))
      }

      const globalActivity = {
        id: Date.now(),
        title: 'Admin Details Updated',
        subtitle: `${updatedName} updated successfully`,
        time: 'Just now'
      }
      setActivities(prev => [globalActivity, ...prev])

      setEditingAdmin(null)
      // Refresh list to stay completely in sync with backend
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
        backendError = errData?.message || (typeof errData === 'string' ? errData : null) || error.message || 'Failed to update Admin.'
      }

      setEditError(backendError)
    } finally {
      setEditLoading(false)
    }
  }

  // Toggle inline status in row or profile (PATCH /api/superadmin/admins/status/:id/status)
  const handleToggleStatus = async (id) => {
    const targetAdmin = adminsList.find(a => a.id === id)
    if (!targetAdmin) return

    const currentStatus = targetAdmin.status?.toLowerCase() === 'active' ? 'ACTIVE' : 'INACTIVE'
    const newStatusBackend = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const newStatusLocal = newStatusBackend === 'ACTIVE' ? 'active' : 'inactive'

    try {
      const res = await updateAdminStatus(id, newStatusBackend)
      const resStatus = res?.data?.status
        ? (res.data.status.toString().toLowerCase() === 'active' ? 'active' : 'inactive')
        : newStatusLocal

      const newAct = {
        id: Date.now(),
        title: 'Status Toggled',
        description: res?.message || `Status changed to ${resStatus}`,
        time: 'Just now'
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
        subtitle: `${targetAdmin.name} is now ${resStatus}`,
        time: 'Just now'
      }
      setActivities(prev => [toggleActivity, ...prev])
    } catch (err) {
      console.error('Failed to toggle admin status:', err)
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to update admin status'
      alert(errMsg)
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
        time: 'Just now'
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
        time: 'Just now'
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
    // Add New Admin form
    return (
      <div className="admin-form-panel">
        <div className="form-workspace-header">
          <button
            className="back-circle-btn"
            aria-label="Back to Admin list"
            onClick={() => setIsAdding(false)}
          >
            <ArrowLeft style={{ width: '18px', height: '18px' }} />
          </button>
          <h2>Add New Admin</h2>
        </div>

        <form onSubmit={handleAddSubmit}>
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
              <label htmlFor="admin-name">Name *</label>
              <input
                id="admin-name"
                type="text"
                placeholder="Enter Name (e.g. Super Admin)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Email Address Field */}
            <div className="form-field-item">
              <label htmlFor="admin-email">Email Address *</label>
              <input
                id="admin-email"
                type="email"
                placeholder="Enter Email (e.g. admin@example.com)"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-field-item">
              <label htmlFor="admin-password">Password *</label>
              <input
                id="admin-password"
                type="password"
                placeholder="Enter Password (e.g. Admin@123)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            {/* Phone Field */}
            <div className="form-field-item">
              <label htmlFor="admin-phone">Phone</label>
              <input
                id="admin-phone"
                type="tel"
                placeholder="Enter Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            {/* Gender Field */}
            <div className="form-field-item">
              <label htmlFor="admin-gender">Gender *</label>
              <select
                id="admin-gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
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
              {formLoading ? 'Creating Admin...' : 'Add Admin'}
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
                  onClick={() => handleToggleStatus(viewedAdmin.id)}
                  title="Click to toggle status"
                >
                  {viewedAdmin.status}
                </span>
              </div>
            </div>

            <button
              className="btn-profile-edit"
              onClick={() => handleOpenEdit(viewedAdmin)}
            >
              <Edit style={{ width: '16px', height: '16px' }} />
              Edit
            </button>
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
                    <div className="activity-timestamp" style={{ fontSize: '11px', color: '#90a4ae', flexShrink: 0 }}>{act.time}</div>
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
                  <label htmlFor="edit-role">Role</label>
                  <select
                    id="edit-role"
                    value={editingAdmin.role || 'ADMIN'}
                    onChange={(e) => setEditingAdmin({ ...editingAdmin, role: e.target.value })}
                    disabled={editLoading}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="EDITOR">EDITOR</option>
                  </select>
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
            onClick={() => setIsAdding(true)}
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
          {activities.map((act) => (
            <div key={act.id} className="activity-item" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div className="activity-title" style={{ fontSize: '14px', fontWeight: '600' }}>{act.title}</div>
                <div style={{ fontSize: '12px', color: '#78909c' }}>{act.subtitle}</div>
              </div>
              <div className="activity-timestamp" style={{ fontSize: '12px', color: '#90a4ae' }}>{act.time}</div>
            </div>
          ))}
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
                <th style={{ width: '40px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    className="admins-table-checkbox"
                    checked={adminsList.length > 0 && adminsList.every(a => a.checked)}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Admins Name</th>
                <th>Email</th>
                <th>Joined On</th>
                <th>Last Login</th>
                <th>Status</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Action</th>
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
                paginatedAdmins.map((admin) => (
                  <tr key={admin.id}>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        className="admins-table-checkbox"
                        checked={admin.checked}
                        onChange={() => handleRowCheckbox(admin.id)}
                      />
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
                        onClick={() => handleToggleStatus(admin.id)}
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
            Showing {Math.min(startIndex + 1, totalItems)} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} entries
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
                <label htmlFor="edit-role">Role</label>
                <select
                  id="edit-role"
                  value={editingAdmin.role || 'ADMIN'}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, role: e.target.value })}
                  disabled={editLoading}
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="EDITOR">EDITOR</option>
                </select>
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
    </div>
  )
}

export default AdminsManagement

