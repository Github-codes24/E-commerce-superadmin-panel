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
  LayoutDashboard,
  BarChart2,
  Package,
  FolderTree,
  Key,
  Percent,
  DollarSign,
  CreditCard
} from 'lucide-react'
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

const VALID_ACTIONS_MAP = {
  // Admin Modules
  'Dashboard': ['view'],
  'Reports': ['view'],
  'Admins Management': ['view', 'add', 'edit', 'delete', 'activate', 'deactivate'],
  'Vendors Management': ['view', 'add', 'edit', 'delete', 'approve', 'reject', 'activate', 'deactivate'],
  'Customers Management': ['view', 'add', 'edit', 'delete', 'activate', 'deactivate'],
  'Product Management': ['view', 'add', 'edit', 'delete', 'activate', 'deactivate'],
  'Category Management': ['view', 'add', 'edit', 'delete'],
  'Orders Management': ['view', 'edit', 'approve', 'reject'],
  'Permissions Management': ['view', 'add', 'edit', 'delete'],
  'Offers & Coupons': ['view', 'add', 'edit', 'delete', 'activate', 'deactivate'],
  'Commission Management': ['view', 'add', 'edit', 'delete'],
  'Payment Monitoring': ['view', 'approve'],
  
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
    const saved = localStorage.getItem('zyvora_permissions')
    return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(DEFAULT_PERMISSIONS))
  })

  const [validActionsMap, setValidActionsMap] = useState(() => {
    const saved = localStorage.getItem('zyvora_valid_actions_map')
    return saved ? JSON.parse(saved) : VALID_ACTIONS_MAP
  })

  // List of active modules to display as rows (All modules from ADMIN_MODULES)
  const displayModules = ADMIN_MODULES

  // Drawer / Side panel state
  const [editingModule, setEditingModule] = useState(null)
  const [tempActions, setTempActions] = useState([])
  const [newActionName, setNewActionName] = useState('')

  // Toast status
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
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

  // Save changes to localStorage
  const handleSave = () => {
    localStorage.setItem('zyvora_permissions', JSON.stringify(permissions))
    localStorage.setItem('zyvora_valid_actions_map', JSON.stringify(validActionsMap))
    showToast('Permissions saved successfully.')
  }

  // Drawer Edit Module Actions
  const handleOpenEditModule = (moduleName) => {
    setEditingModule(moduleName)
    setTempActions([...(validActionsMap[moduleName] || [])])
    setNewActionName('')
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
    showToast(`Updated allowed actions for ${editingModule}.`)
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

  return (
    <div className="permissions-page-container">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="permissions-toast">
          <CheckCircle style={{ width: '18px', height: '18px', color: '#2e7d32' }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Title and Actions Row */}
      <div className="permissions-content-header">
        <div className="title-area">
          <h2>Permission</h2>
          <p>Manage role based permission for admins.</p>
        </div>
        <button className="save-changes-btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>

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
