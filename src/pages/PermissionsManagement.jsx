import React, { useState, useEffect } from 'react'
import {
  Shield,
  User,
  Users,
  ShoppingBag,
  Pencil,
  X,
  Trash2,
  CheckCircle,
  AlertCircle,
  LayoutDashboard,
  BarChart2,
  Package,
  FolderTree,
  Key,
  Percent,
  DollarSign,
  CreditCard,
  RotateCw,
  CheckSquare,
  Square
} from 'lucide-react'
import { assignPermissions, getAllPermissions, getPermissionsByAdminId, updatePermissions, deletePermissions, checkModulePermission, getAllAdmins } from '../services/superAdminService'
import './PermissionsManagement.css'

/* ─────────────────────────────────────────
   Original Default Permissions & Modules
───────────────────────────────────────── */
const ACTIONS = ['view', 'add', 'edit', 'delete', 'approve', 'reject', 'activate', 'deactivate']

const ADMIN_MODULES = [
  'Dashboard',
  'Reports',
  'Admins Management',
  'Vendors Management',
  'Customers Management',
  'Product Management',
  'Category Management',
  'Orders Management',
  'Permissions Management',
  'Offers & Coupons',
  'Commission Management',
  'Payment Monitoring'
]

const VENDOR_MODULES = [
  'Dashboard',
  'Products',
  'Orders',
  'Profile'
]

export const ALLOWED_BACKEND_MODULES = [
  'VENDOR_MANAGEMENT',
  'CUSTOMER_MANAGEMENT',
  'ORDER_MANAGEMENT',
  'PRODUCT_MANAGEMENT'
]

export const ALLOWED_BACKEND_ACTIONS = [
  'VIEW',
  'ADD',
  'EDIT',
  'DELETE',
  'CANCEL_ORDER',
  'CHANGE_ORDER_STATUS'
]

const MODULE_CODE_MAP = {
  'Vendors Management': 'VENDOR_MANAGEMENT',
  'Customers Management': 'CUSTOMER_MANAGEMENT',
  'Orders Management': 'ORDER_MANAGEMENT',
  'Product Management': 'PRODUCT_MANAGEMENT',
  'Admins Management': 'ADMIN_MANAGEMENT',
  'Category Management': 'CATEGORY_MANAGEMENT',
  'Permissions Management': 'PERMISSION_MANAGEMENT',
  'Offers & Coupons': 'OFFERS_COUPONS',
  'Commission Management': 'COMMISSION_MANAGEMENT',
  'Payment Monitoring': 'PAYMENT_MONITORING',
  'Dashboard': 'DASHBOARD',
  'Reports': 'REPORTS',
  'Products': 'PRODUCTS',
  'Orders': 'ORDERS',
  'Profile': 'PROFILE'
}

const VALID_ACTIONS_MAP = {
  // Backend Supported Core Modules
  'Vendors Management': ['view', 'add', 'edit', 'delete'],
  'Customers Management': ['view', 'add', 'edit', 'delete'],
  'Product Management': ['view', 'add', 'edit', 'delete'],
  'Orders Management': ['view', 'edit', 'cancel_order', 'change_order_status'],
  
  // Additional UI Management Modules
  'Admins Management': ['view', 'add', 'edit', 'delete'],
  'Category Management': ['view', 'add', 'edit', 'delete'],
  'Permissions Management': ['view', 'add', 'edit', 'delete'],
  'Offers & Coupons': ['view', 'add', 'edit', 'delete'],
  'Commission Management': ['view', 'add', 'edit', 'delete'],
  'Payment Monitoring': ['view'],
  'Dashboard': ['view'],
  'Reports': ['view'],
  
  // Vendor Modules
  'Products': ['view', 'add', 'edit', 'delete'],
  'Orders': ['view', 'edit'],
  'Profile': ['view', 'edit']
}

const INITIAL_ROLES = [
  { name: 'Admin', description: 'Super Administrator with full portal access control.' },
  { name: 'Vendor', description: 'Seller account with access to products, orders and profile.' },
  { name: 'Customer', description: 'Customer portal access.' }
]

const DEFAULT_PERMISSIONS = {
  Admin: {
    'Dashboard': { view: true, add: false, edit: false, delete: false, approve: false, reject: false, activate: false, deactivate: false },
    'Reports': { view: true, add: false, edit: false, delete: false, approve: false, reject: false, activate: false, deactivate: false },
    'Admins Management': { view: true, add: true, edit: true, delete: true, approve: false, reject: false, activate: true, deactivate: true },
    'Vendors Management': { view: true, add: true, edit: true, delete: true, approve: true, reject: true, activate: true, deactivate: true },
    'Customers Management': { view: true, add: true, edit: true, delete: true, approve: false, reject: false, activate: true, deactivate: true },
    'Product Management': { view: true, add: true, edit: true, delete: true, approve: false, reject: false, activate: true, deactivate: true },
    'Category Management': { view: true, add: true, edit: true, delete: true, approve: false, reject: false, activate: false, deactivate: false },
    'Orders Management': { view: true, add: false, edit: true, delete: false, approve: false, reject: false, activate: false, deactivate: false },
    'Permissions Management': { view: true, add: true, edit: true, delete: true, approve: false, reject: false, activate: false, deactivate: false },
    'Offers & Coupons': { view: true, add: true, edit: true, delete: true, approve: false, reject: false, activate: true, deactivate: true },
    'Commission Management': { view: true, add: true, edit: true, delete: true, approve: false, reject: false, activate: false, deactivate: false },
    'Payment Monitoring': { view: true, add: false, edit: false, delete: false, approve: false, reject: false, activate: false, deactivate: false }
  },
  Vendor: {
    'Dashboard': { view: true, add: false, edit: false, delete: false, approve: false, reject: false, activate: false, deactivate: false },
    'Products': { view: true, add: true, edit: true, delete: true, approve: false, reject: false, activate: false, deactivate: false },
    'Orders': { view: true, add: false, edit: true, delete: false, approve: false, reject: false, activate: false, deactivate: false },
    'Profile': { view: true, add: false, edit: true, delete: false, approve: false, reject: false, activate: false, deactivate: false }
  },
  Customer: {
    'Dashboard': { view: true, add: false, edit: false, delete: false, approve: false, reject: false, activate: false, deactivate: false }
  }
}

// Columns mapped to role keys
const COLUMN_ROLES = ['Admins', 'Vendors', 'Customers']
const ROLES_MAPPING = {
  'Admins': 'Admin',
  'Vendors': 'Vendor',
  'Customers': 'Customer'
}

function PermissionsManagement() {
  const [permissions, setPermissions] = useState(() => {
    try {
      const saved = localStorage.getItem('zyvora_permissions')
      return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS))
    } catch {
      return JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS))
    }
  })

  const [validActionsMap, setValidActionsMap] = useState(() => {
    try {
      const saved = localStorage.getItem('zyvora_valid_actions_map')
      return saved ? JSON.parse(saved) : VALID_ACTIONS_MAP
    } catch {
      return VALID_ACTIONS_MAP
    }
  })

  // Admins List from API
  const [adminsList, setAdminsList] = useState([])
  const [selectedAdminId, setSelectedAdminId] = useState('')
  const [loadingAdmins, setLoadingAdmins] = useState(false)

  // API assignment & fetch states
  const [loadingPermissions, setLoadingPermissions] = useState(false)
  const [fetchPermissionsError, setFetchPermissionsError] = useState(null)
  const [isAssigning, setIsAssigning] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [assignError, setAssignError] = useState('')

  // List of active modules to display as rows (All modules from ADMIN_MODULES)
  const displayModules = ADMIN_MODULES

  // Drawer / Side panel state
  const [editingModule, setEditingModule] = useState(null)
  const [tempActions, setTempActions] = useState([])
  const [newActionName, setNewActionName] = useState('')

  // Toast status
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState('success') // 'success' | 'error'

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg)
    setToastType(type)
    setTimeout(() => setToastMessage(''), 4000)
  }

  // Fetch All Permissions from Backend (GET /api/superadmin/permissions/get-all)
  const fetchPermissionsData = async () => {
    try {
      setLoadingPermissions(true)
      setFetchPermissionsError(null)
      const res = await getAllPermissions()
      
      const rawData = res?.data || res?.permissions || res

      if (rawData) {
        if (Array.isArray(rawData)) {
          setPermissions(prev => {
            const updated = JSON.parse(JSON.stringify(prev))
            rawData.forEach(item => {
              const role = item.role || 'Admin'
              const modCode = item.module || item.moduleName || item.name
              const uiModule = Object.keys(MODULE_CODE_MAP).find(
                k => MODULE_CODE_MAP[k] === modCode || k.toUpperCase() === String(modCode).toUpperCase()
              ) || modCode

              if (!updated[role]) updated[role] = {}
              if (!updated[role][uiModule]) updated[role][uiModule] = {}

              const actions = Array.isArray(item.actions)
                ? item.actions
                : Array.isArray(item.permissions)
                ? item.permissions
                : []

              actions.forEach(act => {
                const actKey = typeof act === 'string' ? act.toLowerCase() : act
                updated[role][uiModule][actKey] = true
              })
            })
            return updated
          })
        } else if (typeof rawData === 'object' && (rawData.Admin || rawData.Vendor || rawData.Customer)) {
          setPermissions(prev => ({
            ...prev,
            ...rawData
          }))
        }
      }
    } catch (err) {
      console.error('Failed to fetch all permissions:', err)
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to fetch permissions from server.'
      setFetchPermissionsError(errMsg)
    } finally {
      setLoadingPermissions(false)
    }
  }

  // Fetch Permissions for a Specific Admin (GET /api/superadmin/permissions/get-by-admin/:adminId)
  const fetchAdminPermissions = async (adminId) => {
    if (!adminId) return
    try {
      setLoadingPermissions(true)
      const res = await getPermissionsByAdminId(adminId)
      const rawData = res?.data || res?.permissions || res?.admin?.permissions || res

      if (rawData) {
        const permList = Array.isArray(rawData)
          ? rawData
          : Array.isArray(rawData?.permissions)
          ? rawData.permissions
          : []

        if (permList.length > 0) {
          setPermissions(prev => {
            const updated = JSON.parse(JSON.stringify(prev))
            if (!updated.Admin) updated.Admin = {}
            displayModules.forEach(mod => {
              updated.Admin[mod] = {}
            })

            permList.forEach(item => {
              const modCode = item.module || item.moduleName || item.name
              const uiModule = Object.keys(MODULE_CODE_MAP).find(
                k => MODULE_CODE_MAP[k] === modCode || k.toUpperCase() === String(modCode).toUpperCase()
              ) || modCode

              if (!updated.Admin[uiModule]) updated.Admin[uiModule] = {}

              const actions = Array.isArray(item.actions)
                ? item.actions
                : Array.isArray(item.permissions)
                ? item.permissions
                : []

              actions.forEach(act => {
                const actKey = typeof act === 'string' ? act.toLowerCase() : act
                updated.Admin[uiModule][actKey] = true
              })
            })
            return updated
          })
        }
      }
    } catch (err) {
      console.log('Admin specific permissions not found or failed, keeping default view:', err)
    } finally {
      setLoadingPermissions(false)
    }
  }

  // Fetch all admins on mount
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoadingAdmins(true)
        const res = await getAllAdmins()
        const admins = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.admins)
          ? res.admins
          : Array.isArray(res)
          ? res
          : []
        
        const formatted = admins.map(a => ({
          id: a.id || a._id || a.userId?._id || a.userId?.id,
          name: a.name || a.fullName || a.userId?.fullName || a.userId?.name || 'Admin',
          email: a.email || a.userId?.email || '',
          role: a.role || a.userId?.role || 'ADMIN'
        }))

        setAdminsList(formatted)
        if (formatted.length > 0) {
          setSelectedAdminId(formatted[0].id)
          fetchAdminPermissions(formatted[0].id)
        }
      } catch (err) {
        console.error('Failed to load admins for permissions assignment:', err)
      } finally {
        setLoadingAdmins(false)
      }
    }
    fetchAdmins()
    fetchPermissionsData()
  }, [])

  // Refetch admin permissions when selectedAdminId changes
  const handleAdminChange = (newAdminId) => {
    setSelectedAdminId(newAdminId)
    if (newAdminId) {
      fetchAdminPermissions(newAdminId)
    }
  }

  // Toggle single permission checkbox
  const handleCheckboxChange = (columnRole, moduleName, actionName) => {
    const roleKey = ROLES_MAPPING[columnRole]
    setPermissions(prev => {
      const rolePerms = prev[roleKey] || {}
      const modulePerms = rolePerms[moduleName] || {}
      return {
        ...prev,
        [roleKey]: {
          ...rolePerms,
          [moduleName]: {
            ...modulePerms,
            [actionName]: !modulePerms[actionName]
          }
        }
      }
    })
  }

  // Toggle All Permissions across all roles (Admins, Vendors, Customers)
  const handleToggleAll = (enable = true) => {
    setPermissions(prev => {
      const updated = { ...prev }
      COLUMN_ROLES.forEach(colRole => {
        const roleKey = ROLES_MAPPING[colRole]
        updated[roleKey] = { ...(updated[roleKey] || {}) }
        displayModules.forEach(mod => {
          updated[roleKey][mod] = { ...(updated[roleKey][mod] || {}) }
          const actions = validActionsMap[mod] || []
          actions.forEach(act => {
            updated[roleKey][mod][act] = enable
          })
        })
      })
      return updated
    })
  }

  // Toggle All Permissions for a specific Role
  const handleToggleAllForRole = (columnRole, enable = true) => {
    const roleKey = ROLES_MAPPING[columnRole]
    setPermissions(prev => {
      const newRolePerms = {}
      displayModules.forEach(mod => {
        newRolePerms[mod] = {}
        const actions = validActionsMap[mod] || []
        actions.forEach(act => {
          newRolePerms[mod][act] = enable
        })
      })
      return {
        ...prev,
        [roleKey]: newRolePerms
      }
    })
  }

  // Save changes & Assign Permissions to selected Admin via API
  const handleSaveAndAssign = async () => {
    // 1. Always save local preferences
    localStorage.setItem('zyvora_permissions', JSON.stringify(permissions))
    localStorage.setItem('zyvora_valid_actions_map', JSON.stringify(validActionsMap))

    // 2. If an Admin is selected, dispatch POST /api/superadmin/permissions/assign
    if (!selectedAdminId) {
      showToast('Permissions saved locally. Select an admin to assign to backend.', 'success')
      return
    }

    setIsAssigning(true)
    setAssignError('')

    try {
      // Build permissions list formatted as:
      // [{ module: "VENDOR_MANAGEMENT", actions: ["VIEW", "ADD", "EDIT"] }]
      // Filter strictly to modules and actions supported by the backend schema validator
      const formattedPermissions = displayModules
        .map(mod => {
          const modKey = MODULE_CODE_MAP[mod] || mod.toUpperCase().replace(/\s+/g, '_').replace(/&/g, '')
          // Only send modules that backend supports in its validation schema
          if (!ALLOWED_BACKEND_MODULES.includes(modKey)) {
            return null
          }

          const allowed = validActionsMap[mod] || []
          const activeActions = allowed
            .filter(act => permissions['Admin']?.[mod]?.[act])
            .map(act => act.toUpperCase())
            .filter(act => ALLOWED_BACKEND_ACTIONS.includes(act))

          return {
            module: modKey,
            actions: activeActions
          }
        })
        .filter(p => p !== null && p.actions.length > 0)

      if (formattedPermissions.length === 0) {
        showToast('Please select at least one valid module permission (Vendor, Customer, Order, Product) before assigning.', 'error')
        setIsAssigning(false)
        return
      }

      let res
      try {
        // Primary endpoint: POST /api/superadmin/permissions/assign
        res = await assignPermissions({ adminId: selectedAdminId, permissions: formattedPermissions })
      } catch (postErr) {
        // If backend responds that record already exists or requires PUT update
        if (postErr.response?.status === 409 || postErr.response?.status === 400 && (postErr.response?.data?.message?.toLowerCase().includes('exist') || postErr.response?.data?.message?.toLowerCase().includes('update'))) {
          res = await updatePermissions(selectedAdminId, { permissions: formattedPermissions })
        } else {
          throw postErr
        }
      }

      const targetAdmin = adminsList.find(a => a.id === selectedAdminId)
      const adminName = targetAdmin ? targetAdmin.name : 'Admin'
      const successMsg = res?.message || `Permissions assigned successfully for ${adminName}.`
      showToast(successMsg, 'success')
    } catch (err) {
      console.error('Failed to assign/update permissions:', err)
      
      // Extract detailed validation message from backend
      let detailedMsg = err?.response?.data?.message || err?.message || 'Validation Failed'
      if (err?.response?.data?.errors) {
        if (Array.isArray(err.response.data.errors)) {
          detailedMsg += ': ' + err.response.data.errors.map(e => e.msg || e.message || JSON.stringify(e)).join(', ')
        } else if (typeof err.response.data.errors === 'object') {
          detailedMsg += ': ' + Object.entries(err.response.data.errors).map(([k, v]) => `${k} - ${typeof v === 'object' ? v.message || JSON.stringify(v) : v}`).join(', ')
        }
      }
      setAssignError(detailedMsg)
      showToast(detailedMsg, 'error')
    } finally {
      setIsAssigning(false)
    }
  }

  // Delete / Reset Permissions for the selected Admin (DELETE /api/superadmin/permissions/delete/:adminId)
  const handleDeletePermissions = async () => {
    if (!selectedAdminId) {
      showToast('Please select an Administrator to reset permissions.', 'error')
      return
    }

    const targetAdmin = adminsList.find(a => a.id === selectedAdminId)
    const adminName = targetAdmin ? targetAdmin.name : 'Admin'

    if (!window.confirm(`Are you sure you want to delete custom permissions for ${adminName}?`)) {
      return
    }

    setIsDeleting(true)
    try {
      const res = await deletePermissions(selectedAdminId)
      // Reset Admin permissions locally
      setPermissions(prev => {
        const updated = JSON.parse(JSON.stringify(prev))
        if (!updated.Admin) updated.Admin = {}
        displayModules.forEach(mod => {
          updated.Admin[mod] = {}
        })
        return updated
      })
      const successMsg = res?.message || `Permissions deleted successfully for ${adminName}.`
      showToast(successMsg, 'success')
    } catch (err) {
      console.error('Failed to delete permissions:', err)
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to delete permissions.'
      showToast(errMsg, 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  // Drawer Edit Module Actions
  const handleOpenEditModule = async (moduleName) => {
    setEditingModule(moduleName)
    setTempActions([...(validActionsMap[moduleName] || [])])
    setNewActionName('')

    if (selectedAdminId) {
      const modCode = MODULE_CODE_MAP[moduleName] || moduleName.toUpperCase().replace(/\s+/g, '_').replace(/&/g, '')
      try {
        const res = await checkModulePermission(selectedAdminId, modCode)
        const rawData = res?.data || res?.permission || res?.permissions || res
        if (rawData) {
          showToast(res?.message || `Checked permissions for ${getModuleDisplayName(moduleName)}.`, 'success')
        }
      } catch (err) {
        console.log(`Check permission for module ${modCode} returned:`, err?.message)
      }
    }
  }

  const handleAddTempAction = (e) => {
    e.preventDefault()
    const cleanAction = newActionName.trim()
    if (!cleanAction) return
    if (tempActions.includes(cleanAction)) {
      alert('Action already exists for this module!')
      return
    }
    setTempActions([...tempActions, cleanAction])
    setNewActionName('')
  }

  const handleRemoveTempAction = (act) => {
    setTempActions(tempActions.filter(a => a !== act))
  }

  const handleSaveModuleActions = () => {
    setValidActionsMap(prev => ({
      ...prev,
      [editingModule]: tempActions
    }))
    setEditingModule(null)
    showToast(`Updated allowed actions for ${editingModule}.`, 'success')
  }

  // Render module display name
  const getModuleDisplayName = (mod) => {
    if (mod === 'Vendors Management') return 'Vendor Management'
    if (mod === 'Customers Management') return 'Customer Management'
    if (mod === 'Orders Management') return 'Order Management'
    return mod
  }

  // Get module icon matching screenshot
  const getModuleIcon = (mod) => {
    if (mod === 'Dashboard') return <LayoutDashboard className="module-icon" size={18} />
    if (mod === 'Reports') return <BarChart2 className="module-icon" size={18} />
    if (mod === 'Admins Management') return <Users className="module-icon" size={18} />
    if (mod === 'Vendors Management') return <Shield className="module-icon" size={18} />
    if (mod === 'Customers Management') return <User className="module-icon" size={18} />
    if (mod === 'Product Management') return <Package className="module-icon" size={18} />
    if (mod === 'Category Management') return <FolderTree className="module-icon" size={18} />
    if (mod === 'Orders Management') return <ShoppingBag className="module-icon" size={18} />
    if (mod === 'Permissions Management') return <Key className="module-icon" size={18} />
    if (mod === 'Offers & Coupons') return <Percent className="module-icon" size={18} />
    if (mod === 'Commission Management') return <DollarSign className="module-icon" size={18} />
    if (mod === 'Payment Monitoring') return <CreditCard className="module-icon" size={18} />
    return <Shield className="module-icon" size={18} />
  }

  // Render action display name dynamically based on module
  const getActionDisplayName = (action, module) => {
    const isVendor = module.includes('Vendor')
    const isCustomer = module.includes('Customer')
    const isOrder = module.includes('Order')
    const isAdmin = module.includes('Admin')
    const isProduct = module.includes('Product')
    const isCategory = module.includes('Category')
    const isCoupon = module.includes('Coupon') || module.includes('Offers')
    const isPayment = module.includes('Payment')
    const isCommission = module.includes('Commission')

    if (action === 'view') {
      if (isVendor) return 'View Vendor profile'
      if (isCustomer) return 'View Customer profile'
      if (isOrder) return 'Check All Orders'
      if (isAdmin) return 'View Admin Profiles'
      if (isProduct) return 'View Product List'
      if (isCategory) return 'View Category List'
      if (isCoupon) return 'View Coupons & Offers'
      if (isPayment) return 'View Payments Log'
      if (isCommission) return 'View Commission Metrics'
      return `View ${module}`
    }
    if (action === 'add') {
      if (isVendor) return 'Add New Vendor'
      if (isCustomer) return 'Add New Customer'
      if (isAdmin) return 'Add New Admin'
      if (isProduct) return 'Add New Product'
      if (isCategory) return 'Add New Category'
      if (isCoupon) return 'Create Coupon'
      return `Add New ${module}`
    }
    if (action === 'edit') {
      if (isVendor) return 'Edit Vendor Details'
      if (isCustomer) return 'Edit Customer Details'
      if (isOrder) return 'Cancel Order'
      if (isAdmin) return 'Edit Admin Details'
      if (isProduct) return 'Edit Product Details'
      if (isCategory) return 'Edit Category Details'
      if (isCommission) return 'Modify Commission Rates'
      return `Edit ${module} Details`
    }
    if (action === 'delete') {
      if (isVendor) return 'Delete Vendor'
      if (isCustomer) return 'Delete Customer'
      if (isAdmin) return 'Delete Admin'
      if (isProduct) return 'Delete Product'
      if (isCategory) return 'Delete Category'
      if (isCoupon) return 'Delete Coupon'
      return `Delete ${module}`
    }
    if (action === 'approve') return `Approve ${module}`
    if (action === 'reject') return `Reject ${module}`
    if (action === 'activate') return `Activate ${module}`
    if (action === 'deactivate') return `Deactivate ${module}`

    return action.charAt(0).toUpperCase() + action.slice(1)
  }

  const selectedAdmin = adminsList.find(a => a.id === selectedAdminId)

  return (
    <div className="permissions-page-container">
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`permissions-toast ${toastType === 'error' ? 'error' : ''}`}>
          {toastType === 'error' ? (
            <AlertCircle style={{ width: '18px', height: '18px', color: '#dc2626' }} />
          ) : (
            <CheckCircle style={{ width: '18px', height: '18px', color: '#2e7d32' }} />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Title and Actions Row */}
      <div className="permissions-content-header">
        <div className="title-area">
          <h2>Permission Management</h2>
          <p>Manage and assign module permissions for administrators.</p>
        </div>
        
        <div className="permissions-header-controls">
          {/* Admin Selection Dropdown */}
          <div className="admin-selector-wrapper">
            <label htmlFor="admin-select" className="admin-select-label">
              <Users size={16} />
              <span>Target Admin:</span>
            </label>
            <select
              id="admin-select"
              className="admin-select-dropdown"
              value={selectedAdminId}
              onChange={(e) => handleAdminChange(e.target.value)}
              disabled={loadingAdmins || isAssigning}
            >
              {loadingAdmins ? (
                <option value="">Loading admins...</option>
              ) : adminsList.length > 0 ? (
                adminsList.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.email})
                  </option>
                ))
              ) : (
                <option value="">No admins found</option>
              )}
            </select>
          </div>

          <div className="permissions-quick-actions">
            <button
              type="button"
              className="quick-toggle-btn"
              onClick={fetchPermissionsData}
              disabled={loadingPermissions}
              title="Refresh permissions from server"
            >
              <RotateCw size={14} style={{ animation: loadingPermissions ? 'spin 1s linear infinite' : 'none' }} />
              <span>{loadingPermissions ? 'Loading...' : 'Refresh'}</span>
            </button>
            <button
              type="button"
              className="quick-toggle-btn"
              onClick={() => handleToggleAll(true)}
              title="Select all permissions across all roles and modules"
            >
              <CheckSquare size={15} />
              <span>Select All</span>
            </button>
            <button
              type="button"
              className="quick-toggle-btn"
              onClick={() => handleToggleAll(false)}
              title="Clear all permissions across all roles and modules"
            >
              <Square size={15} />
              <span>Clear All</span>
            </button>
          </div>

          <button
            className="save-changes-btn"
            onClick={handleSaveAndAssign}
            disabled={isAssigning}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {isAssigning ? (
              <>
                <RotateCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Assigning...</span>
              </>
            ) : (
              <>
                <Key size={16} />
                <span>Assign Permissions</span>
              </>
            )}
          </button>
        </div>
      </div>

      {fetchPermissionsError && (
        <div style={{
          backgroundColor: '#FEF2F2',
          border: '1px solid #F87171',
          color: '#DC2626',
          padding: '10px 16px',
          borderRadius: '8px',
          fontSize: '13px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>⚠️ {fetchPermissionsError}</span>
          <button
            onClick={fetchPermissionsData}
            style={{
              backgroundColor: '#DC2626',
              color: '#fff',
              border: 'none',
              padding: '4px 10px',
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

      {selectedAdmin && (
        <div className="selected-admin-badge-banner">
          <div className="badge-info">
            <span className="badge-label">Assigning permissions to:</span>
            <strong className="badge-name">{selectedAdmin.name}</strong>
            <span className="badge-email">({selectedAdmin.email})</span>
          </div>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="permissions-layout-grid">
        <div className="table-container">
          <table className="permissions-table">
            <thead>
              <tr className="table-header-row">
                <th className="col-actions">Actions</th>
                {COLUMN_ROLES.map(role => (
                  <th key={role} className="col-role text-center">
                    {role}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayModules.map(moduleName => {
                const allowedActions = validActionsMap[moduleName] || []
                return (
                  <React.Fragment key={moduleName}>
                    {/* Module Group Header */}
                    <tr className="module-group-header-row">
                      <td colSpan={1 + COLUMN_ROLES.length}>
                        <div className="module-header-content">
                          <div className="module-name-wrapper">
                            {getModuleIcon(moduleName)}
                            <span className="module-name">{getModuleDisplayName(moduleName)}</span>
                          </div>
                          <button
                            className="edit-module-btn"
                            onClick={() => handleOpenEditModule(moduleName)}
                            title={`Edit ${getModuleDisplayName(moduleName)} permissions`}
                          >
                            <Pencil size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Actions Rows */}
                    {allowedActions.map((action, index) => {
                      const isLastPermission = index === allowedActions.length - 1
                      return (
                        <tr key={action} className={`permission-item-row ${isLastPermission ? 'last-in-group' : ''}`}>
                          <td className="permission-name-cell">
                            {getActionDisplayName(action, moduleName)}
                          </td>
                          {COLUMN_ROLES.map(colRole => {
                            const roleKey = ROLES_MAPPING[colRole]
                            const hasPermission = !!permissions[roleKey]?.[moduleName]?.[action]

                            return (
                              <td key={colRole} className="text-center checkbox-cell">
                                <label className="custom-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={hasPermission}
                                    onChange={() => handleCheckboxChange(colRole, moduleName, action)}
                                  />
                                  <span className="checkmark"></span>
                                </label>
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Dynamic Sidebar / Drawer for Module Permissions */}
        {editingModule && (
          <div className="permissions-drawer-backdrop" onClick={() => setEditingModule(null)}>
            <div className="permissions-drawer-container" onClick={(e) => e.stopPropagation()}>
              <div className="drawer-header">
                <div className="drawer-title-wrapper">
                  {getModuleIcon(editingModule)}
                  <h3>{getModuleDisplayName(editingModule)}</h3>
                </div>
                <button className="drawer-close-btn" onClick={() => setEditingModule(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="drawer-body">
                <ul className="drawer-permissions-list">
                  {tempActions.map(act => (
                    <li key={act} className="drawer-permission-item">
                      <span className="perm-text">{getActionDisplayName(act, editingModule)}</span>
                      <button
                        className="delete-perm-btn"
                        onClick={() => handleRemoveTempAction(act)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>

                <form onSubmit={handleAddTempAction} className="add-permission-form">
                  <label htmlFor="new-permission-input" className="form-label">
                    Add New Permission
                  </label>
                  <input
                    id="new-permission-input"
                    type="text"
                    placeholder="Enter new permission"
                    value={newActionName}
                    onChange={(e) => setNewActionName(e.target.value)}
                  />
                  <button type="submit" className="add-perm-btn-submit">
                    Add
                  </button>
                </form>
              </div>

              <div className="drawer-footer">
                <button className="drawer-save-btn" onClick={handleSaveModuleActions}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PermissionsManagement
