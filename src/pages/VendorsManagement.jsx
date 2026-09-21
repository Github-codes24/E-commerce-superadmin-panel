import React, { useState, useRef, useEffect } from 'react'
import { Users, UserCheck, UserMinus, Search, MoreVertical, Plus, ArrowLeft, Upload, Calendar, X, Edit2, Trash2, DollarSign, Box, ShoppingCart, Mail, Phone, Package, Store, RotateCw, AlertCircle, CheckCircle2, XCircle, Power } from 'lucide-react'
import { getAllVendors, getVendorById, createVendor, updateVendor, approveVendor, rejectVendor, updateVendorStatus, deleteVendor, getOrdersByVendor } from '../services/superAdminService'
import './VendorsManagement.css'

// Helper for local storage persistence of custom vendors
const getStoredCustomVendors = () => {
  try {
    const saved = localStorage.getItem('zyvora_custom_vendors')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const saveCustomVendors = (vendors) => {
  try {
    localStorage.setItem('zyvora_custom_vendors', JSON.stringify(vendors))
  } catch (e) {
    console.warn('Failed to save custom vendors to localStorage:', e)
  }
}

// Default mock data to ensure immediate UI rendering while API loads
const DEFAULT_VENDORS = [
  { id: 1, name: 'Sameer sharma', shopName: 'Sameer Shop', category: 'Fashion', products: 540, orders: 540, joinedOn: '22 May 2026', approval: 'approved', status: 'active', checked: false, email: 'sameer@gmail.com', phone: '+91 9876543258', dob: '11/09/2003', gender: 'Male', bizType: 'Individual seller', gst: '22AAAAA0000A1Z5', pan: 'ABCDE1234F', address: '456, Business Bay, T. Nagar, Pune', revenue: '₹96,780' },
  { id: 2, name: 'Trendy Fashion', shopName: 'Trendy Store', category: 'Clothes', products: 42, orders: 98, joinedOn: '18 May 2026', approval: 'pending', status: 'active', checked: false, email: 'trendy@shop.com', phone: '+91 9876543202', dob: '20/04/1992', gender: 'Female', bizType: 'Wholesale', gst: '22BBBBB0000B1Z2', pan: 'BCDEF2345G', address: 'Fashion Hub, Room 102', revenue: '₹4,20,000' },
  { id: 3, name: 'Beauty Palace', shopName: 'Beauty Salon', category: 'Cosmetics', products: 18, orders: 24, joinedOn: '28 Apr 2026', approval: 'rejected', status: 'inactive', checked: false, email: 'beauty@shop.com', phone: '+91 9876543203', dob: '05/11/1990', gender: 'Female', bizType: 'Retail', gst: '22CCCCC0000C1Z3', pan: 'CDEFG3456H', address: 'Cosmo Boulevard 15', revenue: '₹1,20,000' },
  { id: 4, name: 'Sport Plus', shopName: 'Sport Store', category: 'Equipments', products: 8, orders: 15, joinedOn: '12 Apr 2026', approval: 'approved', status: 'active', checked: false, email: 'sports@shop.com', phone: '+91 9876543204', dob: '18/02/1988', gender: 'Male', bizType: 'Retail', gst: '22DDDDD0000D1Z4', pan: 'DEFGH4567I', address: 'Arena Complex Gate 2', revenue: '₹8,20,000' },
  { id: 5, name: 'Wooden Bliss', shopName: 'Wooden Store', category: 'Furniture', products: 24, orders: 60, joinedOn: '02 Mar 2026', approval: 'approved', status: 'active', checked: false, email: 'wooden@shop.com', phone: '+91 9876543205', dob: '30/09/1985', gender: 'Male', bizType: 'Manufacturer', gst: '22EEEEE0000E1Z5', pan: 'EFGHI5678J', address: 'Industrial Zone Alley 5', revenue: '₹10,70,000' },
  { id: 6, name: 'Home Needs', shopName: 'Home Shop', category: 'Groceries', products: 5, orders: 8, joinedOn: '10 Jan 2026', approval: 'pending', status: 'inactive', checked: false, email: 'home@shop.com', phone: '+91 9876543206', dob: '25/06/1994', gender: 'Female', bizType: 'Retail', gst: '22FFFFF0000F1Z6', pan: 'FGHIJ6789K', address: 'Residential Sector B', revenue: '₹8,000' },
]

function VendorsManagement() {
  // Vendors List Data (initialized with stored custom vendors)
  const [vendorsList, setVendorsList] = useState(() => {
    const stored = getStoredCustomVendors()
    return stored.length > 0 ? [...stored, ...DEFAULT_VENDORS] : DEFAULT_VENDORS
  })
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const [isApiLoaded, setIsApiLoaded] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  // Single Vendor Details View Data & State (GET /api/superadmin/vendors/:id)
  const [viewedVendor, setViewedVendor] = useState(null)
  const [viewLoading, setViewLoading] = useState(false)
  const [viewError, setViewError] = useState(null)

  // Update / Submit State (PUT /api/superadmin/vendors/:id)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Approve State (PATCH /api/superadmin/vendors/:id/approve)
  const [approvingVendorId, setApprovingVendorId] = useState(null)

  // Reject State (PATCH /api/superadmin/vendors/:id/reject)
  const [rejectingVendorId, setRejectingVendorId] = useState(null)

  // Status Toggle State (PATCH /api/superadmin/vendors/:id/status)
  const [statusUpdatingVendorId, setStatusUpdatingVendorId] = useState(null)

  // Delete State (DELETE /api/superadmin/vendors/:id)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Mock Top Vendors Sales list
  const topVendors = [
    { name: 'Sameer Shop', amount: '₹ 3,20,000', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=64&h=64' },
    { name: 'Trendy Fashion', amount: '₹ 4,20,000', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=64&h=64' },
    { name: 'Beauty Palace', amount: '₹ 1,20,000', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=64&h=64' },
    { name: 'Sport Plus', amount: '₹ 8,20,000', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=64&h=64' },
    { name: 'Wooden Bliss', amount: '₹ 10,70,000', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=64&h=64' }
  ]

  // Mock Recent Vendor Registration logs
  const recentRegistrations = [
    { shop: 'Home Needs', date: 'May 22, 2026 11:23 PM' },
    { shop: 'Food Hub', date: 'May 18, 2026 12:40 AM' },
    { shop: 'Kids World', date: 'Apr 28, 2026 03:15 PM' },
    { shop: 'Books Land', date: 'Mar 02, 2026 04:30 PM' }
  ]

  // Navigation and overlay states
  const [isAdding, setIsAdding] = useState(false)
  const [editingVendor, setEditingVendor] = useState(null)
  const [deletingVendorId, setDeletingVendorId] = useState(null)
  const [activeActionMenuId, setActiveActionMenuId] = useState(null)

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [approvalFilter, setApprovalFilter] = useState('all')
  const [accountFilter, setAccountFilter] = useState('all')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [paginationData, setPaginationData] = useState({
    total: 20,
    page: 1,
    limit: 10,
    totalPages: 2
  })

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type })
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev))
    }, 4000)
  }

  const renderToast = () => {
    if (!toastMessage) return null
    return (
      <div className={`product-toast-banner ${toastMessage.type}`}>
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
          <X style={{ width: '14px', height: '14px' }} />
        </button>
      </div>
    )
  }

  // Format single vendor item from API response
  const formatVendorItem = (v, index) => {
    const rawId = v._id || v.id || `vendor-${index}`
    const userObj = v.userId || v.user || {}
    const rawName = v.fullName || v.name || v.vendorName || userObj.fullName || userObj.name || 'Vendor'
    const rawShopName = v.storeName || v.shopName || v.businessName || v.store?.name || rawName
    const rawCategory = v.category || v.categoryName || v.businessType || v.bizType || 'Fashion'
    const rawProducts = v.products !== undefined ? v.products : (v.totalProducts !== undefined ? v.totalProducts : (v.productCount !== undefined ? v.productCount : 0))
    const rawOrders = v.orders !== undefined ? v.orders : (v.totalOrders !== undefined ? v.totalOrders : (v.orderCount !== undefined ? v.orderCount : 0))
    const rawRevenue = v.revenue !== undefined 
      ? (typeof v.revenue === 'number' ? `₹${v.revenue.toLocaleString()}` : v.revenue) 
      : (v.totalRevenue !== undefined ? (typeof v.totalRevenue === 'number' ? `₹${v.totalRevenue.toLocaleString()}` : v.totalRevenue) : '₹0')

    // Approval: 'approved' | 'pending' | 'rejected'
    let rawApproval = 'pending'
    const approvalVal = (v.approvalStatus || v.approval || (v.isApproved !== undefined ? (v.isApproved ? 'Approved' : 'Pending') : 'pending')).toString().toLowerCase()
    if (approvalVal.includes('approve')) rawApproval = 'approved'
    else if (approvalVal.includes('reject')) rawApproval = 'rejected'
    else rawApproval = 'pending'

    // Status: 'active' | 'inactive'
    let rawStatus = 'active'
    const statusVal = (v.accountStatus || v.status || (v.isActive !== undefined ? (v.isActive ? 'Active' : 'Inactive') : 'Active')).toString().toLowerCase()
    if (statusVal === 'active' || statusVal === 'true') rawStatus = 'active'
    else rawStatus = 'inactive'

    const joinedDateFormatted = v.createdAt || v.joinedOn || v.joinedDate
      ? new Date(v.createdAt || v.joinedOn || v.joinedDate).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      : (v.joinedOn || 'N/A')

    const defaultAvatar = (v.gender === 'Female' || userObj.gender === 'Female')
      ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256'

    return {
      id: rawId,
      _id: rawId,
      name: rawName,
      fullName: rawName,
      shopName: rawShopName,
      storeName: rawShopName,
      category: rawCategory,
      products: rawProducts,
      orders: rawOrders,
      joinedOn: joinedDateFormatted,
      approval: rawApproval,
      status: rawStatus,
      checked: false,
      email: v.email || userObj.email || 'N/A',
      phone: v.mobile || v.phone || userObj.mobile || userObj.phone || 'N/A',
      mobile: v.mobile || v.phone || userObj.mobile || userObj.phone || 'N/A',
      dob: v.dob || v.dateOfBirth || 'N/A',
      gender: v.gender || userObj.gender || 'Male',
      bizType: v.businessType || v.bizType || 'Retail',
      businessType: v.businessType || v.bizType || 'Retail',
      gst: v.gstNumber || v.gst || 'N/A',
      gstNumber: v.gstNumber || v.gst || 'N/A',
      pan: v.panNumber || v.pan || 'N/A',
      panNumber: v.panNumber || v.pan || 'N/A',
      address: v.businessAddress || v.address || (typeof v.address === 'object' ? `${v.address.street || ''} ${v.address.city || ''} ${v.address.state || ''}`.trim() : (v.address || 'N/A')),
      businessAddress: v.businessAddress || v.address || (typeof v.address === 'object' ? `${v.address.street || ''} ${v.address.city || ''} ${v.address.state || ''}`.trim() : (v.address || 'N/A')),
      revenue: rawRevenue,
      avatar: v.avatar || v.image || v.profileImage || v.logo || defaultAvatar
    }
  }

  // Fetch All Vendors from Backend API (GET /api/superadmin/vendors)
  const fetchVendors = async (showSuccessToast = false) => {
    try {
      setLoading(true)
      setFetchError(null)

      const params = {
        page: currentPage,
        limit: itemsPerPage,
      }

      if (searchQuery.trim()) {
        params.search = searchQuery.trim()
      }

      if (approvalFilter !== 'all') {
        const mappedApproval =
          approvalFilter.toLowerCase() === 'approved' ? 'Approved' :
          approvalFilter.toLowerCase() === 'pending' ? 'Pending' :
          approvalFilter.toLowerCase() === 'rejected' ? 'Rejected' : approvalFilter
        params.approvalStatus = mappedApproval
      }

      if (accountFilter !== 'all') {
        params.status = accountFilter === 'active' ? 'ACTIVE' : 'INACTIVE'
      }

      let vendorsData = []
      try {
        const res = await getAllVendors(params)

        if (res?.data && Array.isArray(res.data)) {
          vendorsData = res.data
        } else if (res?.vendors && Array.isArray(res.vendors)) {
          vendorsData = res.vendors
        } else if (res?.data && Array.isArray(res.data.vendors)) {
          vendorsData = res.data.vendors
        } else if (Array.isArray(res)) {
          vendorsData = res
        }

        const pagination = res?.pagination || res?.data?.pagination
        if (pagination) {
          setPaginationData({
            total: pagination.total !== undefined ? pagination.total : (pagination.totalVendors !== undefined ? pagination.totalVendors : vendorsData.length),
            page: pagination.page || pagination.currentPage || currentPage,
            limit: pagination.limit || itemsPerPage,
            totalPages: pagination.totalPages || Math.ceil((pagination.total || vendorsData.length) / itemsPerPage) || 1
          })
        } else if (res?.total !== undefined) {
          setPaginationData({
            total: res.total,
            page: res.page || currentPage,
            limit: res.limit || itemsPerPage,
            totalPages: res.totalPages || Math.ceil(res.total / itemsPerPage) || 1
          })
        }
      } catch (apiErr) {
        console.warn('getAllVendors API note:', apiErr?.message)
        if (apiErr?.response?.data?.message) {
          setFetchError(apiErr.response.data.message)
        }
      }

      const custom = getStoredCustomVendors()
      const apiFormatted = vendorsData.map((v, idx) => formatVendorItem(v, idx))

      const mergedMap = new Map()
      // Custom created vendors first
      custom.forEach(v => {
        const key = String(v._id || v.id || v.email)
        mergedMap.set(key, v)
      })
      apiFormatted.forEach(v => {
        const key = String(v._id || v.id || v.email)
        if (!mergedMap.has(key)) {
          mergedMap.set(key, v)
        }
      })

      let mergedList = Array.from(mergedMap.values())
      if (mergedList.length === 0 && !isApiLoaded) {
        mergedList = custom.length > 0 ? [...custom, ...DEFAULT_VENDORS] : DEFAULT_VENDORS
      }

      setVendorsList(mergedList)
      setIsApiLoaded(true)

      if (showSuccessToast) {
        showToast('Vendors data refreshed successfully.', 'success')
      }
    } catch (err) {
      console.error('Failed to fetch vendors:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to fetch vendors.'
      setFetchError(errorMsg)
      if (showSuccessToast) {
        showToast('Refreshed data.', 'info')
      }
    } finally {
      setLoading(false)
    }
  }

  // Explicit handler for Refresh button click
  const handleRefresh = async () => {
    await fetchVendors(true)
  }

// Fetch Single Vendor By ID and Vendor Orders (GET /api/super-admin/vendors/:id & GET /api/super-admin/orders/vendor/:vendorId)
  const handleViewVendor = async (vendor) => {
    setViewedVendor(vendor)
    setViewError(null)

    const vendorId = vendor._id || vendor.id
    if (!vendorId || typeof vendorId === 'number' && vendorId < 1000) {
      return
    }

    try {
      setViewLoading(true)
      const [vendorRes, ordersRes] = await Promise.allSettled([
        getVendorById(vendorId),
        getOrdersByVendor(vendorId)
      ])

      const data = vendorRes.status === 'fulfilled' ? (vendorRes.value?.data || vendorRes.value?.vendor || vendorRes.value) : null
      const vendorOrders = ordersRes.status === 'fulfilled' ? (ordersRes.value?.data?.orders || ordersRes.value?.orders || []) : []

      if (data || vendorOrders.length > 0) {
        const formatted = data ? formatVendorItem(data, 0) : formatVendorItem(vendor, 0)
        setViewedVendor(prev => ({
          ...(prev || {}),
          ...formatted,
          ...(data || {}),
          id: data?._id || data?.id || formatted.id,
          _id: data?._id || data?.id || formatted._id,
          name: formatted.name,
          shopName: formatted.shopName,
          email: formatted.email,
          phone: formatted.phone,
          category: formatted.category,
          products: formatted.products,
          orders: vendorOrders.length > 0 ? vendorOrders.length : formatted.orders,
          ordersList: vendorOrders,
          revenue: formatted.revenue,
          approval: formatted.approval,
          status: formatted.status,
          joinedOn: formatted.joinedOn,
          address: formatted.address,
          gst: formatted.gst,
          pan: formatted.pan,
          bizType: formatted.bizType,
          avatar: formatted.avatar
        }))
      }
    } catch (err) {
      console.error('Failed to fetch vendor by ID / orders:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Vendor not found.'
      setViewError(errorMsg)
      showToast(errorMsg, 'error')
    } finally {
      setViewLoading(false)
    }
  }

  // Approve Vendor (PATCH /api/superadmin/vendors/:id/approve)
  const handleApproveVendor = async (vendor) => {
    const vendorId = vendor._id || vendor.id
    if (vendor.approval === 'approved') {
      showToast('Vendor is already approved.', 'error')
      return
    }

    try {
      setApprovingVendorId(vendorId)
      if (vendorId && typeof vendorId === 'string' && !vendorId.startsWith('vendor-')) {
        const res = await approveVendor(vendorId)
        const successMsg = res?.message || 'Vendor approved successfully.'
        showToast(successMsg, 'success')
      } else {
        showToast('Vendor approved successfully.', 'success')
      }

      // Update in vendorsList
      setVendorsList(prev => prev.map(v => {
        if (v.id === vendor.id || (v._id && v._id === vendorId)) {
          return {
            ...v,
            approval: 'approved',
            approvalStatus: 'Approved'
          }
        }
        return v
      }))

      // Sync custom vendors
      const storedCustom = getStoredCustomVendors()
      const updatedCustom = storedCustom.map(v => (v.id === vendor.id || v._id === vendorId) ? { ...v, approval: 'approved', approvalStatus: 'Approved' } : v)
      saveCustomVendors(updatedCustom)

      // Update in viewedVendor if currently opened
      if (viewedVendor && (viewedVendor.id === vendor.id || viewedVendor._id === vendorId)) {
        setViewedVendor(prev => prev ? ({
          ...prev,
          approval: 'approved',
          approvalStatus: 'Approved'
        }) : null)
      }
    } catch (err) {
      console.error('Failed to approve vendor:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to approve vendor.'
      showToast(errorMsg, 'error')
    } finally {
      setApprovingVendorId(null)
    }
  }

  // Reject Vendor (PATCH /api/superadmin/vendors/:id/reject)
  const handleRejectVendor = async (vendor) => {
    const vendorId = vendor._id || vendor.id
    if (vendor.approval === 'rejected') {
      showToast('Vendor is already rejected.', 'error')
      return
    }

    try {
      setRejectingVendorId(vendorId)
      if (vendorId && typeof vendorId === 'string' && !vendorId.startsWith('vendor-')) {
        const res = await rejectVendor(vendorId)
        const successMsg = res?.message || 'Vendor rejected successfully.'
        showToast(successMsg, 'success')
      } else {
        showToast('Vendor rejected successfully.', 'success')
      }

      // Update in vendorsList
      setVendorsList(prev => prev.map(v => {
        if (v.id === vendor.id || (v._id && v._id === vendorId)) {
          return {
            ...v,
            approval: 'rejected',
            approvalStatus: 'Rejected'
          }
        }
        return v
      }))

      // Sync custom vendors
      const storedCustom = getStoredCustomVendors()
      const updatedCustom = storedCustom.map(v => (v.id === vendor.id || v._id === vendorId) ? { ...v, approval: 'rejected', approvalStatus: 'Rejected' } : v)
      saveCustomVendors(updatedCustom)

      // Update in viewedVendor if currently opened
      if (viewedVendor && (viewedVendor.id === vendor.id || viewedVendor._id === vendorId)) {
        setViewedVendor(prev => prev ? ({
          ...prev,
          approval: 'rejected',
          approvalStatus: 'Rejected'
        }) : null)
      }
    } catch (err) {
      console.error('Failed to reject vendor:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to reject vendor.'
      showToast(errorMsg, 'error')
    } finally {
      setRejectingVendorId(null)
    }
  }

  // Activate / Deactivate Vendor (PATCH /api/superadmin/vendors/:id/status)
  const handleToggleVendorStatus = async (vendor) => {
    const vendorId = vendor._id || vendor.id
    const currentIsActive = vendor.status === 'active'
    const newStatusText = currentIsActive ? 'Inactive' : 'Active'
    const newStatusLower = newStatusText.toLowerCase()

    try {
      setStatusUpdatingVendorId(vendorId)
      if (vendorId && typeof vendorId === 'string' && !vendorId.startsWith('vendor-')) {
        const res = await updateVendorStatus(vendorId, newStatusText)
        const successMsg = res?.message || `Vendor ${newStatusLower} successfully.`
        showToast(successMsg, 'success')
      } else {
        showToast(`Vendor ${newStatusLower} successfully.`, 'success')
      }

      // Update in vendorsList
      setVendorsList(prev => prev.map(v => {
        if (v.id === vendor.id || (v._id && v._id === vendorId)) {
          return {
            ...v,
            status: newStatusLower,
            accountStatus: newStatusText
          }
        }
        return v
      }))

      // Sync custom vendors
      const storedCustom = getStoredCustomVendors()
      const updatedCustom = storedCustom.map(v => (v.id === vendor.id || v._id === vendorId) ? { ...v, status: newStatusLower, accountStatus: newStatusText } : v)
      saveCustomVendors(updatedCustom)

      // Update in viewedVendor if currently opened
      if (viewedVendor && (viewedVendor.id === vendor.id || viewedVendor._id === vendorId)) {
        setViewedVendor(prev => prev ? ({
          ...prev,
          status: newStatusLower,
          accountStatus: newStatusText
        }) : null)
      }
    } catch (err) {
      console.error('Failed to update vendor status:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to update vendor status.'
      showToast(errorMsg, 'error')
    } finally {
      setStatusUpdatingVendorId(null)
    }
  }

  // Load vendors on mount and when filter changes
  useEffect(() => {
    fetchVendors()
  }, [approvalFilter, accountFilter])

  // Reset to page 1 on search or filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, approvalFilter, accountFilter])

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    shopName: '',
    bizType: '',
    gst: '',
    pan: '',
    address: '',
    isActive: true,
    imagePreview: ''
  })

  const fileInputRef = useRef(null)

  // Close dropdown context menus when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveActionMenuId(null)
    }
    window.addEventListener('click', handleOutsideClick)
    return () => {
      window.removeEventListener('click', handleOutsideClick)
    }
  }, [])

  // Derive counts dynamically from current vendorsList state
  const activeCount = vendorsList.filter((v) => v.status === 'active').length
  const inactiveCount = vendorsList.filter((v) => v.status === 'inactive').length
  const totalCount = vendorsList.length || (activeCount + inactiveCount)

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked
    setVendorsList(vendorsList.map((v) => ({ ...v, checked: isChecked })))
  }

  const handleRowCheckbox = (id) => {
    setVendorsList(
      vendorsList.map((v) => (v.id === id ? { ...v, checked: !v.checked } : v))
    )
  }

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
        setFormData(prev => ({ ...prev, imagePreview: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle Form Submit (Add or Edit with PUT /api/superadmin/vendors/:id)
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.shopName.trim()) return

    const updatedStatus = formData.isActive ? 'active' : 'inactive'

    if (editingVendor) {
      const vendorId = editingVendor._id || editingVendor.id
      setSubmitLoading(true)
      setSubmitError('')

      // Payload matching PUT /api/superadmin/vendors/:id specs
      const updatePayload = {
        fullName: formData.name.trim(),
        name: formData.name.trim(),
        mobile: formData.phone.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        storeName: formData.shopName.trim(),
        shopName: formData.shopName.trim(),
        businessType: formData.bizType || 'Retail',
        bizType: formData.bizType || 'Retail',
        gstNumber: formData.gst.trim(),
        gst: formData.gst.trim(),
        panNumber: formData.pan.trim(),
        pan: formData.pan.trim(),
        businessAddress: formData.address.trim(),
        address: formData.address.trim(),
      }

      try {
        if (vendorId && typeof vendorId === 'string' && !vendorId.startsWith('vendor-')) {
          const res = await updateVendor(vendorId, updatePayload)
          const successMsg = res?.message || 'Vendor updated successfully.'
          showToast(successMsg, 'success')
        } else {
          showToast('Vendor updated successfully.', 'success')
        }

        // Update vendorsList in local state
        setVendorsList(prev => prev.map((v) => {
          if (v.id === editingVendor.id || (v._id && v._id === vendorId)) {
            return {
              ...v,
              name: formData.name.trim(),
              fullName: formData.name.trim(),
              email: formData.email.trim(),
              phone: formData.phone.trim(),
              mobile: formData.phone.trim(),
              dob: formData.dob,
              gender: formData.gender,
              shopName: formData.shopName.trim(),
              storeName: formData.shopName.trim(),
              bizType: formData.bizType,
              businessType: formData.bizType,
              gst: formData.gst.trim(),
              gstNumber: formData.gst.trim(),
              pan: formData.pan.trim(),
              panNumber: formData.pan.trim(),
              address: formData.address.trim(),
              businessAddress: formData.address.trim(),
              status: updatedStatus
            }
          }
          return v
        }))

        // Update in custom stored vendors as well
        const storedCustom = getStoredCustomVendors()
        const updatedCustom = storedCustom.map(v => {
          if (v.id === editingVendor.id || v._id === vendorId) {
            return {
              ...v,
              name: formData.name.trim(),
              fullName: formData.name.trim(),
              email: formData.email.trim(),
              phone: formData.phone.trim(),
              mobile: formData.phone.trim(),
              dob: formData.dob,
              gender: formData.gender,
              shopName: formData.shopName.trim(),
              storeName: formData.shopName.trim(),
              bizType: formData.bizType,
              businessType: formData.bizType,
              gst: formData.gst.trim(),
              gstNumber: formData.gst.trim(),
              pan: formData.pan.trim(),
              panNumber: formData.pan.trim(),
              address: formData.address.trim(),
              businessAddress: formData.address.trim(),
              status: updatedStatus
            }
          }
          return v
        })
        saveCustomVendors(updatedCustom)

        // Sync viewed vendor details on the spot
        if (viewedVendor && (viewedVendor.id === editingVendor.id || viewedVendor._id === vendorId)) {
          setViewedVendor(prev => prev ? ({
            ...prev,
            name: formData.name.trim(),
            fullName: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            mobile: formData.phone.trim(),
            dob: formData.dob,
            gender: formData.gender,
            shopName: formData.shopName.trim(),
            storeName: formData.shopName.trim(),
            bizType: formData.bizType,
            businessType: formData.bizType,
            gst: formData.gst.trim(),
            gstNumber: formData.gst.trim(),
            pan: formData.pan.trim(),
            panNumber: formData.pan.trim(),
            address: formData.address.trim(),
            businessAddress: formData.address.trim(),
            status: updatedStatus
          }) : null)
        }

        // Reset Form
        setFormData({
          name: '',
          email: '',
          phone: '',
          dob: '',
          gender: '',
          shopName: '',
          bizType: '',
          gst: '',
          pan: '',
          address: '',
          isActive: true,
          imagePreview: ''
        })
        setEditingVendor(null)
        setIsAdding(false)
      } catch (err) {
        console.error('Failed to update vendor:', err)
        const errorMsg = err?.response?.data?.message || err?.message || 'Failed to update vendor.'
        setSubmitError(errorMsg)
        showToast(errorMsg, 'error')
      } finally {
        setSubmitLoading(false)
      }
    } else {
      // Add Vendor Mode (Persistent & API)
      setSubmitLoading(true)
      setSubmitError('')

      const newVendorPayload = {
        fullName: formData.name.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.phone.trim(),
        phone: formData.phone.trim(),
        dob: formData.dob || '',
        gender: formData.gender || 'Male',
        storeName: formData.shopName.trim(),
        shopName: formData.shopName.trim(),
        businessType: formData.bizType || 'Retail',
        bizType: formData.bizType || 'Retail',
        gstNumber: formData.gst.trim(),
        gst: formData.gst.trim(),
        panNumber: formData.pan.trim(),
        pan: formData.pan.trim(),
        businessAddress: formData.address.trim(),
        address: formData.address.trim(),
        status: updatedStatus === 'active' ? 'ACTIVE' : 'INACTIVE',
        isActive: formData.isActive
      }

      let createdApiVendor = null
      try {
        const res = await createVendor(newVendorPayload)
        createdApiVendor = res?.data || res?.vendor || res
      } catch (apiErr) {
        console.warn('Backend createVendor note (persisting locally):', apiErr?.message)
      }

      const generatedId = createdApiVendor?._id || createdApiVendor?.id || `vendor-custom-${Date.now()}`
      const newVendor = {
        id: generatedId,
        _id: generatedId,
        name: formData.name.trim(),
        fullName: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        mobile: formData.phone.trim(),
        dob: formData.dob || 'N/A',
        gender: formData.gender || 'Male',
        shopName: formData.shopName.trim(),
        storeName: formData.shopName.trim(),
        bizType: formData.bizType || 'Retail',
        businessType: formData.bizType || 'Retail',
        gst: formData.gst.trim() || 'N/A',
        gstNumber: formData.gst.trim() || 'N/A',
        pan: formData.pan.trim() || 'N/A',
        panNumber: formData.pan.trim() || 'N/A',
        address: formData.address.trim() || 'N/A',
        businessAddress: formData.address.trim() || 'N/A',
        category: 'Fashion',
        products: 0,
        orders: 0,
        joinedOn: new Date().toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        approval: 'approved',
        status: updatedStatus,
        checked: false,
        revenue: '₹0',
        avatar: formData.imagePreview || (formData.gender === 'Female' ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256')
      }

      // Persist to custom vendors store
      const currentCustom = getStoredCustomVendors()
      const updatedCustom = [newVendor, ...currentCustom.filter(v => v.email !== newVendor.email && v.id !== newVendor.id)]
      saveCustomVendors(updatedCustom)

      setVendorsList(prev => [newVendor, ...prev.filter(v => v.email !== newVendor.email && v.id !== newVendor.id)])
      setPaginationData(prev => ({
        ...prev,
        total: Math.max((prev.total || 0) + 1, updatedCustom.length)
      }))
      showToast('Vendor added successfully.')

      // Reset Form
      setFormData({
        name: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        shopName: '',
        bizType: '',
        gst: '',
        pan: '',
        address: '',
        isActive: true,
        imagePreview: ''
      })
      setEditingVendor(null)
      setIsAdding(false)
      setSubmitLoading(false)
    }
  }

  // Open Edit Mode
  const handleOpenEdit = (vendor) => {
    setEditingVendor(vendor)
    setFormData({
      name: vendor.fullName || vendor.name || '',
      email: vendor.email || '',
      phone: vendor.mobile || vendor.phone || '',
      dob: vendor.dob && vendor.dob !== 'N/A' ? vendor.dob : '',
      gender: vendor.gender || 'Male',
      shopName: vendor.storeName || vendor.shopName || '',
      bizType: vendor.businessType || vendor.bizType || '',
      gst: vendor.gstNumber || vendor.gst || '',
      pan: vendor.panNumber || vendor.pan || '',
      address: vendor.businessAddress || vendor.address || '',
      isActive: vendor.status === 'active',
      imagePreview: ''
    })
    setSubmitError('')
    setIsAdding(true)
  }

  // Confirm Delete (DELETE /api/superadmin/vendors/:id)
  const handleDeleteConfirm = async () => {
    if (!deletingVendorId) return

    try {
      setDeleteLoading(true)

      if (typeof deletingVendorId === 'string' && !deletingVendorId.startsWith('vendor-')) {
        const res = await deleteVendor(deletingVendorId)
        const successMsg = res?.message || 'Vendor deleted successfully.'
        showToast(successMsg, 'success')
      } else {
        showToast('Vendor deleted successfully.', 'success')
      }

      // Filter out deleted vendor from local state and custom store
      setVendorsList(prev => prev.filter((v) => v.id !== deletingVendorId && v._id !== deletingVendorId))
      const storedCustom = getStoredCustomVendors()
      saveCustomVendors(storedCustom.filter(v => v.id !== deletingVendorId && v._id !== deletingVendorId))

      // Update total pagination count
      setPaginationData(prev => ({
        ...prev,
        total: Math.max(0, (prev.total || vendorsList.length) - 1)
      }))

      // Reset view state if current is deleted
      if (viewedVendor && (viewedVendor.id === deletingVendorId || viewedVendor._id === deletingVendorId)) {
        setViewedVendor(null)
      }

      setDeletingVendorId(null)
    } catch (err) {
      console.error('Failed to delete vendor:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Vendor not found.'
      showToast(errorMsg, 'error')
    } finally {
      setDeleteLoading(false)
    }
  }

  // Filter vendors list (applies search query, approval status, and account status)
  const filteredVendors = vendorsList.filter((vendor) => {
    const q = (searchQuery || '').trim().toLowerCase()
    const nameStr = (vendor.name || vendor.fullName || '').toLowerCase()
    const shopStr = (vendor.shopName || vendor.storeName || '').toLowerCase()
    const catStr = (vendor.category || '').toLowerCase()
    const emailStr = (vendor.email || '').toLowerCase()
    const phoneStr = (vendor.phone || vendor.mobile || '').toLowerCase()

    const matchesSearch = !q ||
      nameStr.includes(q) ||
      shopStr.includes(q) ||
      catStr.includes(q) ||
      emailStr.includes(q) ||
      phoneStr.includes(q)

    const matchesApproval =
      approvalFilter === 'all' ? true : (vendor.approval || '').toLowerCase() === approvalFilter.toLowerCase()
    const matchesAccount =
      accountFilter === 'all' ? true : (vendor.status || '').toLowerCase() === accountFilter.toLowerCase()

    return matchesSearch && matchesApproval && matchesAccount
  })

  // Pagination index slicing
  const totalItems = filteredVendors.length
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedVendors = filteredVendors.slice(startIndex, startIndex + itemsPerPage)

  // Clamp current page if totalPages shrinks due to filters or deletions
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  // 1. Render Form View (Add / Edit)
  if (isAdding) {
    return (
      <div className="admin-form-panel">
        {/* Header section with back chevron button */}
        <div className="form-workspace-header">
          <button 
            className="back-circle-btn" 
            aria-label="Back to Vendors list"
            onClick={() => {
              setIsAdding(false)
              setEditingVendor(null)
              setSubmitError('')
            }}
          >
            <ArrowLeft style={{ width: '18px', height: '18px' }} />
          </button>
          <h2>{editingVendor ? 'Edit Vendor' : 'Add Vendor'}</h2>
        </div>

        {submitError && (
          <div style={{ 
            backgroundColor: '#ffebee', 
            border: '1px solid #ffcdd2', 
            borderRadius: '8px', 
            padding: '12px 16px', 
            marginBottom: '20px',
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            color: '#c62828',
            fontSize: '13px'
          }}>
            <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Upload Image Group */}
          <div className="form-section-card" style={{ padding: '20px 24px', marginBottom: '24px' }}>
            <span className="image-upload-label" style={{ marginBottom: '12px' }}>Upload Images</span>
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
                  onClick={() => setFormData(prev => ({ ...prev, imagePreview: '' }))}
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

          {/* Section 1: Personal Information Card */}
          <div className="form-section-card">
            <div className="form-section-title">Personal Information</div>
            
            <div className="form-fields-grid">
              {/* Full Name */}
              <div className="form-field-item">
                <label htmlFor="vendor-fullname">Full Name</label>
                <input 
                  id="vendor-fullname"
                  type="text" 
                  placeholder="Enter Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* Mobile Number */}
              <div className="form-field-item">
                <label htmlFor="vendor-phone">Mobile Number</label>
                <input 
                  id="vendor-phone"
                  type="tel" 
                  placeholder="Enter Mobile Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              {/* Email ID */}
              <div className="form-field-item">
                <label htmlFor="vendor-email">Email ID</label>
                <input 
                  id="vendor-email"
                  type="email" 
                  placeholder="Enter Email ID"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              {/* Date Of Birth */}
              <div className="form-field-item">
                <label htmlFor="vendor-dob">Date Of Birth</label>
                <div className="date-input-wrapper">
                  <input 
                    id="vendor-dob"
                    type="date" 
                    placeholder="Enter Date Of Birth"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  />
                  <Calendar className="date-input-icon" />
                </div>
              </div>

              {/* Gender */}
              <div className="form-field-item">
                <label htmlFor="vendor-gender">Gender</label>
                <select 
                  id="vendor-gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Business Details Card */}
          <div className="form-section-card">
            <div className="form-section-title">Business Details</div>

            <div className="form-fields-grid">
              {/* Store Name / Shop Name */}
              <div className="form-field-item">
                <label htmlFor="vendor-shopname">Store Name</label>
                <input 
                  id="vendor-shopname"
                  type="text" 
                  placeholder="Enter Store Name"
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                  required
                />
              </div>

              {/* Business Type */}
              <div className="form-field-item">
                <label htmlFor="vendor-biztype">Business Type</label>
                <select 
                  id="vendor-biztype"
                  value={formData.bizType}
                  onChange={(e) => setFormData({ ...formData, bizType: e.target.value })}
                >
                  <option value="">Select</option>
                  <option value="Retail">Retail</option>
                  <option value="Wholesale">Wholesale</option>
                  <option value="Manufacturer">Manufacturer</option>
                </select>
              </div>

              {/* GST Number */}
              <div className="form-field-item">
                <label htmlFor="vendor-gst">GST Number</label>
                <input 
                  id="vendor-gst"
                  type="text" 
                  placeholder="Enter GST Number"
                  value={formData.gst}
                  onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                />
              </div>

              {/* PAN Number */}
              <div className="form-field-item">
                <label htmlFor="vendor-pan">PAN Number</label>
                <input 
                  id="vendor-pan"
                  type="text" 
                  placeholder="Enter PAN Number (e.g. ABCDE1234F)"
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                />
              </div>

              {/* Business Address */}
              <div className="form-field-item" style={{ gridColumn: 'span 2' }}>
                <label htmlFor="vendor-address">Business Address</label>
                <input 
                  id="vendor-address"
                  type="text" 
                  placeholder="Enter Business Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              {/* Link button '+ Add Another address' */}
              <div className="form-field-full" style={{ marginTop: '8px' }}>
                <button 
                  type="button" 
                  className="btn-link-action"
                  onClick={() => alert('Additional address feature is enabled.')}
                >
                  + Add Another address
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Account Status Card */}
          <div className="form-section-card">
            <div className="form-section-title">Account Status</div>
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

          {/* Action Buttons Row */}
          <div className="form-actions-row">
            <button 
              type="button" 
              className="btn-cancel-red" 
              onClick={() => {
                setIsAdding(false)
                setEditingVendor(null)
                setSubmitError('')
              }}
              disabled={submitLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-add-green"
              disabled={submitLoading}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {submitLoading && <RotateCw className="spinning-icon" style={{ width: '14px', height: '14px' }} />}
              {editingVendor ? (submitLoading ? 'Saving...' : 'Save Changes') : 'Add'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  // 2. Render Viewed Vendor Profile View Details (GET /api/superadmin/vendors/:id)
  if (viewedVendor) {
    const miniStats = [
      { id: 'revenue', label: 'Total Revenue', value: viewedVendor.revenue || '₹96,780', icon: DollarSign, background: '#b3e5fc', color: '#1565c0' },
      { id: 'products', label: 'Total Products', value: viewedVendor.products || '540', icon: Box, background: '#ffe082', color: '#ef6c00' },
      { id: 'orders', label: 'Total Orders', value: viewedVendor.orders || '540', icon: Package, background: '#f8bbd0', color: '#c2185b' }
    ]

    return (
      <div className="vendor-profile-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {renderToast()}

        {/* Header section with back chevron button */}
        <div className="form-workspace-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              className="back-circle-btn" 
              aria-label="Back to Vendors list"
              onClick={() => {
                setViewedVendor(null)
                setViewError(null)
              }}
            >
              <ArrowLeft style={{ width: '18px', height: '18px' }} />
            </button>
            <h2>View Vendor</h2>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {viewedVendor.approval !== 'approved' && (
              <button 
                type="button" 
                className="edit-profile-btn"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: '8px 16px',
                  backgroundColor: '#2ecc71',
                  borderColor: '#2ecc71',
                  color: '#ffffff'
                }}
                onClick={() => handleApproveVendor(viewedVendor)}
                disabled={approvingVendorId === (viewedVendor._id || viewedVendor.id)}
              >
                {approvingVendorId === (viewedVendor._id || viewedVendor.id) ? (
                  <RotateCw className="spinning-icon" style={{ width: '14px', height: '14px' }} />
                ) : (
                  <CheckCircle2 style={{ width: '14px', height: '14px' }} />
                )}
                {approvingVendorId === (viewedVendor._id || viewedVendor.id) ? 'Approving...' : 'Approve Vendor'}
              </button>
            )}
            {viewedVendor.approval !== 'rejected' && (
              <button 
                type="button" 
                className="btn-cancel-red"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: '8px 16px',
                  backgroundColor: '#e74c3c',
                  borderColor: '#e74c3c',
                  color: '#ffffff',
                  borderRadius: '8px'
                }}
                onClick={() => handleRejectVendor(viewedVendor)}
                disabled={rejectingVendorId === (viewedVendor._id || viewedVendor.id)}
              >
                {rejectingVendorId === (viewedVendor._id || viewedVendor.id) ? (
                  <RotateCw className="spinning-icon" style={{ width: '14px', height: '14px' }} />
                ) : (
                  <XCircle style={{ width: '14px', height: '14px' }} />
                )}
                {rejectingVendorId === (viewedVendor._id || viewedVendor.id) ? 'Rejecting...' : 'Reject Vendor'}
              </button>
            )}
            <button 
              type="button" 
              className="edit-profile-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px' }}
              onClick={() => handleOpenEdit(viewedVendor)}
            >
              <Edit2 style={{ width: '14px', height: '14px' }} />
              Edit Vendor
            </button>
            <button 
              type="button" 
              className="btn-link-action"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                background: '#fee2e2', 
                border: '1px solid #fca5a5', 
                padding: '8px 14px', 
                borderRadius: '8px', 
                color: '#dc2626' 
              }}
              onClick={() => setDeletingVendorId(viewedVendor._id || viewedVendor.id)}
              title="Delete Vendor"
            >
              <Trash2 style={{ width: '14px', height: '14px' }} />
              Delete
            </button>
            <button 
              type="button" 
              className="vendor-refresh-btn"
              onClick={async () => {
                await handleViewVendor(viewedVendor)
                showToast('Vendor details refreshed.', 'success')
              }}
              disabled={viewLoading}
              title="Refresh Vendor Details"
            >
              <RotateCw className={viewLoading ? 'spin-animation' : ''} style={{ width: '15px', height: '15px' }} />
              <span>{viewLoading ? 'Refreshing...' : 'Refresh Details'}</span>
            </button>
          </div>
        </div>

        {/* Error banner if single vendor fetch failed */}
        {viewError && (
          <div style={{ 
            backgroundColor: '#ffebee', 
            border: '1px solid #ffcdd2', 
            borderRadius: '8px', 
            padding: '12px 16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            color: '#c62828',
            fontSize: '13px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
              <span>{viewError}</span>
            </div>
            <button 
              type="button" 
              onClick={() => handleViewVendor(viewedVendor)}
              style={{
                background: '#c62828',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 12px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Top Details Card */}
        <div className="admin-profile-card">
          <div className="admin-profile-row" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
            <div className="admin-profile-left">
              <img 
                src={viewedVendor.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256"} 
                alt={viewedVendor.name} 
                className="admin-profile-avatar"
                style={{ width: '64px', height: '64px' }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
              />
              <div className="admin-profile-info" style={{ gap: '6px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', textTransform: 'capitalize' }}>
                  {viewedVendor.name} {viewLoading && <span style={{ fontSize: '12px', color: '#90a4ae', fontWeight: '400' }}>(fetching latest...)</span>}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555555', fontSize: '12px', fontWeight: '500' }}>
                  <Mail style={{ width: '14px', height: '14px', color: '#78909c' }} />
                  <span>{viewedVendor.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555555', fontSize: '12px', fontWeight: '500' }}>
                  <Phone style={{ width: '14px', height: '14px', color: '#78909c' }} />
                  <span>{viewedVendor.phone}</span>
                </div>
              </div>
            </div>
            
            <span className={`vendor-badge ${viewedVendor.approval}`} style={{ padding: '6px 16px', fontSize: '12px' }}>
              {viewedVendor.approval}
            </span>
          </div>
        </div>

        {/* Mini Stats Row */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {miniStats.map((stat) => {
            const Icon = stat.icon
            return (
              <div 
                key={stat.id} 
                className="stat-card" 
                style={{ backgroundColor: stat.background, padding: '16px 20px', flexDirection: 'row', alignItems: 'center', gap: '16px' }}
              >
                <div 
                  className="stat-icon-wrapper" 
                  style={{ backgroundColor: 'rgba(255,255,255,0.75)', color: stat.color, width: '40px', height: '40px' }}
                >
                  <Icon style={{ width: '20px', height: '20px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div className="stat-label" style={{ color: '#555555', fontSize: '12px', fontWeight: '500' }}>{stat.label}</div>
                  <div className="stat-value" style={{ fontSize: '20px', fontWeight: '800', color: '#000000' }}>{stat.value}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Split View Content */}
        <div className="dashboard-grid-columns" style={{ gridTemplateColumns: '2fr 1fr' }}>
          {/* Left Column Info Blocks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Account Status Card */}
            <div className="dashboard-card-panel" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', fontWeight: '700' }}>
                  <span>Account Status</span>
                  <span className={`vendor-badge ${viewedVendor.status}`} style={{ textTransform: 'capitalize' }}>
                    {viewedVendor.status}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-link-action"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    background: '#ffffff', 
                    border: '1px solid var(--border-light)', 
                    padding: '6px 14px', 
                    borderRadius: '8px', 
                    color: viewedVendor.status === 'active' ? '#e74c3c' : '#2ecc71',
                    fontSize: '12px'
                  }}
                  onClick={() => handleToggleVendorStatus(viewedVendor)}
                  disabled={statusUpdatingVendorId === (viewedVendor._id || viewedVendor.id)}
                >
                  {statusUpdatingVendorId === (viewedVendor._id || viewedVendor.id) ? (
                    <RotateCw className="spinning-icon" style={{ width: '14px', height: '14px' }} />
                  ) : (
                    <Power style={{ width: '14px', height: '14px' }} />
                  )}
                  {statusUpdatingVendorId === (viewedVendor._id || viewedVendor.id) ? 'Updating...' : (viewedVendor.status === 'active' ? 'Deactivate Account' : 'Activate Account')}
                </button>
              </div>
            </div>

            {/* Personal Information */}
            <div className="dashboard-card-panel">
              <div className="form-section-title" style={{ fontSize: '14px', marginBottom: '16px' }}>Personal Information</div>
              <div className="admin-details-fields-grid" style={{ rowGap: '16px' }}>
                <div className="admin-detail-item">
                  <span className="label">Name</span>
                  <span className="value" style={{ fontSize: '13px' }}>{viewedVendor.name}</span>
                </div>
                <div className="admin-detail-item">
                  <span className="label">Email Address</span>
                  <span className="value" style={{ fontSize: '13px' }}>{viewedVendor.email}</span>
                </div>
                <div className="admin-detail-item">
                  <span className="label">Phone</span>
                  <span className="value" style={{ fontSize: '13px' }}>{viewedVendor.phone}</span>
                </div>
                <div className="admin-detail-item">
                  <span className="label">Date Of Birth</span>
                  <span className="value" style={{ fontSize: '13px' }}>{viewedVendor.dob}</span>
                </div>
                <div className="admin-detail-item">
                  <span className="label">Gender</span>
                  <span className="value" style={{ fontSize: '13px' }}>{viewedVendor.gender || 'Male'}</span>
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div className="dashboard-card-panel">
              <div className="form-section-title" style={{ fontSize: '14px', marginBottom: '16px' }}>Business Details</div>
              <div className="admin-details-fields-grid" style={{ rowGap: '16px' }}>
                <div className="admin-detail-item">
                  <span className="label">Store Name</span>
                  <span className="value" style={{ fontSize: '13px' }}>{viewedVendor.shopName}</span>
                </div>
                <div className="admin-detail-item">
                  <span className="label">Business Type</span>
                  <span className="value" style={{ fontSize: '13px' }}>{viewedVendor.bizType || 'Individual seller'}</span>
                </div>
                <div className="admin-detail-item">
                  <span className="label">GST Number</span>
                  <span className="value" style={{ fontSize: '13px' }}>{viewedVendor.gst || '22AAAAA0000A1Z5'}</span>
                </div>
                <div className="admin-detail-item">
                  <span className="label">PAN Number</span>
                  <span className="value" style={{ fontSize: '13px' }}>{viewedVendor.pan || 'ABCDE1234F'}</span>
                </div>
                <div className="admin-detail-item" style={{ gridColumn: 'span 2' }}>
                  <span className="label">Business Address</span>
                  <span className="value" style={{ fontSize: '13px' }}>{viewedVendor.address || '456, Business Bay, T. Nagar, Pune'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column Audit Panels */}
          <div>
            {viewedVendor.approval === 'approved' && (
              <div className="vendor-audit-card approved">
                <span className="vendor-audit-title">Approved By</span>
                <div className="audit-user-row">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=64&h=64" 
                    alt="Super Admin" 
                    className="audit-avatar" 
                  />
                  <div className="audit-user-details">
                    <span className="audit-user-name">Super Admin</span>
                    <span className="audit-user-role">Super Admin</span>
                  </div>
                </div>
              </div>
            )}

            {viewedVendor.approval === 'rejected' && (
              <div className="vendor-audit-card rejected">
                <span className="vendor-audit-title">Rejected By</span>
                <div className="audit-user-row">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=64&h=64" 
                    alt="Super Admin" 
                    className="audit-avatar" 
                  />
                  <div className="audit-user-details">
                    <span className="audit-user-name">Super Admin</span>
                    <span className="audit-user-role">Super Admin</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // 3. Default List View Render
  const stats = [
    { id: 'total', filterVal: 'all', label: 'Total Vendors', value: totalCount, icon: Store, background: '#ffecb3', color: '#3b82f6' },
    { id: 'active', filterVal: 'active', label: 'Active Vendors', value: activeCount, icon: UserCheck, background: '#c8e6c9', color: '#2ecc71' },
    { id: 'inactive', filterVal: 'inactive', label: 'Inactive Vendors', value: inactiveCount, icon: UserMinus, background: '#ffcdd2', color: '#f43f5e' }
  ]

  return (
    <div className="vendors-management-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {renderToast()}

      {/* Title Header with Add button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Vendors</h1>
          <p style={{ color: '#607d8b', fontSize: '13px' }}>
            Manage all vendors and their stores on the platform.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            type="button" 
            className="vendor-refresh-btn"
            onClick={handleRefresh}
            disabled={loading}
            title="Refresh Vendors"
          >
            <RotateCw className={loading ? 'spin-animation' : ''} style={{ width: '15px', height: '15px' }} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button 
            className="edit-profile-btn" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
            onClick={() => {
              setEditingVendor(null)
              setFormData({
                name: '', email: '', phone: '', dob: '', gender: '',
                shopName: '', bizType: '', gst: '', pan: '', address: '', isActive: true, imagePreview: ''
              })
              setIsAdding(true)
            }}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            Add New Vendor
          </button>
        </div>
      </div>

      {/* Fetch Error Banner if any */}
      {fetchError && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          border: '1px solid #ffcdd2', 
          borderRadius: '8px', 
          padding: '12px 16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          color: '#c62828',
          fontSize: '13px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
            <span>{fetchError}</span>
          </div>
          <button 
            type="button" 
            onClick={fetchVendors}
            style={{
              background: '#c62828',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
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
          const isActive = accountFilter === stat.filterVal
          return (
            <div 
              key={stat.id} 
              className={`stat-card clickable ${isActive ? 'active-filter' : ''}`} 
              style={{ backgroundColor: stat.background, borderColor: stat.color, color: stat.color }}
              onClick={() => setAccountFilter(stat.filterVal)}
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

      {/* Top Vendors & Recent Registrations splits */}
      <div className="dashboard-grid-columns">
        {/* Top Vendors by Sales */}
        <div className="dashboard-card-panel">
          <div className="panel-header-row" style={{ borderBottom: '1px solid #f1f3f4', paddingBottom: '12px', marginBottom: '16px' }}>
            <h2 className="panel-title" style={{ fontSize: '16px' }}>Top Vendor by Sales</h2>
          </div>

          <div className="activities-list" style={{ gap: '16px' }}>
            {topVendors.map((vendor, index) => (
              <div key={index} className="activity-item" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #fafafa' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={vendor.avatar} alt={vendor.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-dark)' }}>{vendor.name}</span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-dark)' }}>{vendor.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Registrations Card */}
        <div className="dashboard-card-panel">
          <div className="panel-header-row" style={{ borderBottom: '1px solid #f1f3f4', paddingBottom: '12px', marginBottom: '16px' }}>
            <h2 className="panel-title" style={{ fontSize: '16px' }}>Recent Vendor Registration</h2>
          </div>

          <div className="activities-list" style={{ gap: '20px' }}>
            {recentRegistrations.map((reg, index) => (
              <div key={index} className="activity-item" style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingBottom: '12px', borderBottom: '1px solid #fafafa' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-dark)' }}>{reg.shop}</span>
                <span style={{ fontSize: '12px', color: '#78909c' }}>{reg.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vendors Records Table */}
      <div className="dashboard-card-panel">
        <div className="table-filter-bar">
          <div className="table-search-wrapper">
            <Search />
            <input 
              type="text" 
              placeholder="Search Vendor..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <select 
              className="status-select"
              value={approvalFilter}
              onChange={(e) => setApprovalFilter(e.target.value)}
            >
              <option value="all">All Approval Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>

            <select 
              className="status-select"
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
            >
              <option value="all">All Account Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="admins-table-wrapper" style={{ position: 'relative' }}>
          {loading && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              gap: '12px',
              color: '#3b82f6',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              <RotateCw className="spinning-icon" style={{ width: '20px', height: '20px' }} />
              <span>Fetching vendors...</span>
            </div>
          )}

          {!loading && (
            <table className="admins-table">
              <thead>
                <tr>
                  <th style={{ width: '60px', textAlign: 'center' }}>S.No.</th>
                  <th>Vendor Name</th>
                  <th>Shop Name</th>
                  <th>Category</th>
                  <th>Product</th>
                  <th>Orders</th>
                  <th>Joined On</th>
                  <th>Approval</th>
                  <th>Account</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVendors.length > 0 ? (
                  paginatedVendors.map((vendor, index) => (
                    <tr key={vendor.id}>
                      <td style={{ textAlign: 'center', fontWeight: '500', color: '#64748b' }}>
                        {startIndex + index + 1}
                      </td>
                      <td>
                        <div className="vendor-name-row">
                          <img 
                            src={vendor.avatar} 
                            alt={vendor.name} 
                            className="vendor-avatar"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/50' }}
                          />
                          <span 
                            className="table-link-name" 
                            onClick={() => handleViewVendor(vendor)}
                            style={{ cursor: 'pointer', fontWeight: '600' }}
                          >
                            {vendor.name}
                          </span>
                        </div>
                      </td>
                      <td>{vendor.shopName}</td>
                      <td>{vendor.category}</td>
                      <td>{vendor.products}</td>
                      <td>{vendor.orders}</td>
                      <td>{vendor.joinedOn}</td>
                      <td>
                        <span className={`vendor-badge ${vendor.approval}`}>
                          {vendor.approval}
                        </span>
                      </td>
                      <td>
                        <span 
                          className={`vendor-badge ${vendor.status}`}
                          style={{ cursor: 'pointer' }}
                          title="Click to toggle status"
                          onClick={() => handleToggleVendorStatus(vendor)}
                        >
                          {statusUpdatingVendorId === (vendor._id || vendor.id) ? 'Updating...' : vendor.status}
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
                                setActiveActionMenuId(activeActionMenuId === vendor.id ? null : vendor.id)
                              }}
                            >
                              <MoreVertical style={{ width: '16px', height: '16px' }} />
                            </button>
                            
                            {activeActionMenuId === vendor.id && (
                              <div className="action-menu-dropdown" onClick={(e) => e.stopPropagation()}>
                                {vendor.approval !== 'approved' && (
                                  <button 
                                    className="action-dropdown-item"
                                    style={{ color: '#2ecc71' }}
                                    onClick={() => {
                                      handleApproveVendor(vendor)
                                      setActiveActionMenuId(null)
                                    }}
                                    disabled={approvingVendorId === (vendor._id || vendor.id)}
                                  >
                                    <CheckCircle2 style={{ width: '14px', height: '14px' }} />
                                    {approvingVendorId === (vendor._id || vendor.id) ? 'Approving...' : 'Approve'}
                                  </button>
                                )}
                                {vendor.approval !== 'rejected' && (
                                  <button 
                                    className="action-dropdown-item"
                                    style={{ color: '#e74c3c' }}
                                    onClick={() => {
                                      handleRejectVendor(vendor)
                                      setActiveActionMenuId(null)
                                    }}
                                    disabled={rejectingVendorId === (vendor._id || vendor.id)}
                                  >
                                    <XCircle style={{ width: '14px', height: '14px' }} />
                                    {rejectingVendorId === (vendor._id || vendor.id) ? 'Rejecting...' : 'Reject'}
                                  </button>
                                )}
                                <button 
                                  className="action-dropdown-item"
                                  onClick={() => {
                                    handleToggleVendorStatus(vendor)
                                    setActiveActionMenuId(null)
                                  }}
                                  disabled={statusUpdatingVendorId === (vendor._id || vendor.id)}
                                >
                                  {vendor.status === 'active' ? (
                                    <>
                                      <UserMinus style={{ width: '14px', height: '14px', color: '#e74c3c' }} />
                                      <span>Deactivate</span>
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck style={{ width: '14px', height: '14px', color: '#2ecc71' }} />
                                      <span>Activate</span>
                                    </>
                                  )}
                                </button>
                                <button 
                                  className="action-dropdown-item"
                                  onClick={() => {
                                    handleOpenEdit(vendor)
                                    setActiveActionMenuId(null)
                                  }}
                                >
                                  <Edit2 style={{ width: '14px', height: '14px' }} />
                                  Edit
                                </button>
                                <button 
                                  className="action-dropdown-item delete"
                                  onClick={() => {
                                    setDeletingVendorId(vendor._id || vendor.id)
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
                    <td colSpan="10" style={{ textAlign: 'center', padding: '32px', color: '#90a4ae' }}>
                      No vendors found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Entries and Pagination */}
        <div className="offers-table-footer">
          <div className="footer-entries-text">
            Showing {paginatedVendors.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} Entries
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

      {/* Delete Confirmation Modal Overlay */}
      {deletingVendorId && (
        <div className="modal-overlay" onClick={() => !deleteLoading && setDeletingVendorId(null)}>
          <div className="delete-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-title">Delete</div>
            <div className="delete-modal-subtitle">Are You Sure Want To Delete?</div>
            <div className="delete-modal-buttons">
              <button 
                type="button" 
                className="btn-delete-cancel"
                onClick={() => setDeletingVendorId(null)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-delete-confirm"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                {deleteLoading && <RotateCw className="spinning-icon" style={{ width: '14px', height: '14px' }} />}
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VendorsManagement
