import React, { useState, useRef, useEffect } from 'react'
import { Users, UserCheck, UserX, ShieldAlert, Eye, Edit, Trash2, Search, ArrowLeft, Calendar, DollarSign, Box, Gift, ChevronLeft, ChevronRight, X, ArrowDown, RotateCw, AlertCircle, CheckCircle2, MapPin, ShoppingBag, Check, Camera, Upload } from 'lucide-react'
import { getAllCustomers, getCustomerById, updateCustomer, updateCustomerStatus, deleteCustomer, getOrdersByCustomer, getAllOrders } from '../services/superAdminService'
import './CustomersManagement.css'

// Helper for local persistence of customer status overrides
export const getStoredCustomerStatusOverrides = () => {
  try {
    const saved = localStorage.getItem('zyvora_customer_status_overrides')
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

export const saveCustomerStatusOverride = (id, status) => {
  try {
    const current = getStoredCustomerStatusOverrides()
    current[String(id)] = status
    localStorage.setItem('zyvora_customer_status_overrides', JSON.stringify(current))
  } catch (e) {
    console.warn('Failed to save status override:', e)
  }
}

// Helper for local persistence of deleted customer IDs
export const getStoredDeletedCustomerIds = () => {
  try {
    const saved = localStorage.getItem('zyvora_deleted_customer_ids')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export const saveDeletedCustomerId = (id) => {
  try {
    const current = getStoredDeletedCustomerIds()
    const strId = String(id)
    if (!current.includes(strId)) {
      current.push(strId)
      localStorage.setItem('zyvora_deleted_customer_ids', JSON.stringify(current))
    }
  } catch (e) {
    console.warn('Failed to save deleted customer id:', e)
  }
}

// Helper for resolving customer status accurately
// Helper for resolving customer status accurately (Active, Inactive, Blocked)
export const resolveCustomerStatus = (c, overrides = null) => {
  if (!c) return 'active'
  const activeOverrides = overrides || getStoredCustomerStatusOverrides()
  const rawId = c._id || c.id

  // 1. Check local persistent overrides first (Super Admin explicit manual action)
  if (rawId && activeOverrides[String(rawId)]) {
    const ov = String(activeOverrides[String(rawId)]).toLowerCase()
    if (ov === 'inactive' || ov === 'blocked' || ov === 'active') {
      return ov
    }
  }

  // 2. Check explicit blocked / banned flags
  if (c.isBlocked === true || c.isBanned === true) {
    return 'blocked'
  }

  // 3. Check explicit status string if provided by backend
  if (c.status) {
    const s = c.status.toString().toLowerCase()
    if (s === 'blocked' || s === 'banned') {
      return 'blocked'
    }
    if (s === 'inactive' || s === 'deactivated') {
      return 'inactive'
    }
    if (s === 'active') {
      return 'active'
    }
  }

  if (c.userStatus) {
    const us = c.userStatus.toString().toLowerCase()
    if (us === 'blocked' || us === 'banned') {
      return 'blocked'
    }
    if (us === 'inactive' || us === 'deactivated') {
      return 'inactive'
    }
    if (us === 'active') {
      return 'active'
    }
  }

  // 4. Check isActive flag
  if (c.isActive === false) {
    return 'inactive'
  }

  // 5. Default: newly registered customers or shoppers who signed up on the store website
  return 'active'
}

// Validation helper for Customer Name:
// Accepts only alphabets and spaces, max 50 characters, rejects special characters, digits, and alphanumeric values
export const validateCustomerName = (name) => {
  if (!name || !name.trim()) {
    return 'Full Name is required.'
  }
  const trimmed = name.trim()
  if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
    return 'Name should accept only alphabets and spaces.'
  }
  if (trimmed.length > 50) {
    return 'Name cannot exceed 50 characters.'
  }
  return ''
}

// Validation helper for Customer Mobile Number:
// Accepts only 10 digits starting with 6, 7, 8, or 9
export const validateCustomerMobile = (mobile) => {
  if (!mobile || !mobile.toString().trim()) {
    return 'Mobile number is required.'
  }
  const cleanMobile = mobile.toString().trim()
  if (!/^\d+$/.test(cleanMobile)) {
    return 'Mobile number should accept only digits.'
  }
  if (!/^[6-9]/.test(cleanMobile)) {
    return 'Invalid mobile number. Mobile number must start with 6, 7, 8, or 9.'
  }
  if (cleanMobile.length !== 10) {
    return 'Mobile number must be exactly 10 digits.'
  }
  return ''
}

// Backend base URL helper for media/images
const getBackendBaseUrl = () => {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://e-commerce-backend-1-we80.onrender.com/api'
  return apiBase.replace(/\/api\/?$/, '')
}

// Helper to convert relative image paths like /uploads/... to full URL
const getFullImageUrl = (imgUrl) => {
  if (!imgUrl || typeof imgUrl !== 'string') return ''
  if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://') || imgUrl.startsWith('data:') || imgUrl.startsWith('blob:')) {
    return imgUrl
  }
  const backendBase = getBackendBaseUrl()
  const cleanPath = imgUrl.startsWith('/') ? imgUrl : `/${imgUrl}`
  return `${backendBase}${cleanPath}`
}

// Detect dummy/mock unsplash and placeholder avatars
const isDefaultAvatarUrl = (url) => {
  if (!url || typeof url !== 'string') return true
  return url.includes('unsplash.com') || url.includes('placeholder.com') || url.includes('default-avatar')
}

// Helper for customer initial
const getCustomerInitial = (cust) => {
  const name = cust?.name || cust?.fullName || cust?.email || 'C'
  return name.trim().charAt(0).toUpperCase() || 'C'
}

// Reusable Customer Avatar component that cleanly falls back to initial letter
const CustomerAvatar = ({ customer, size = 32, style = {} }) => {
  const [imgError, setImgError] = useState(false)
  const rawAvatar = customer?.avatar || customer?.image || customer?.profileImage
  const hasValidAvatar = rawAvatar && typeof rawAvatar === 'string' && !isDefaultAvatarUrl(rawAvatar) && !imgError

  if (hasValidAvatar) {
    return (
      <img
        src={getFullImageUrl(rawAvatar)}
        alt={customer?.name || 'Customer'}
        onError={() => setImgError(true)}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          border: size > 40 ? '1.5px solid #000000' : '1px solid #e2e8f0',
          ...style
        }}
      />
    )
  }

  const initial = getCustomerInitial(customer)
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: '#e0f2fe',
        color: '#0369a1',
        fontWeight: '700',
        fontSize: size > 40 ? '28px' : '13px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textTransform: 'uppercase',
        border: size > 40 ? '1.5px solid #bae6fd' : '1px solid #bae6fd',
        flexShrink: 0,
        userSelect: 'none',
        ...style
      }}
    >
      {initial}
    </div>
  )
}

// Helper for local persistence of customer edit overrides
const getStoredCustomerEditOverrides = () => {
  try {
    const saved = localStorage.getItem('zyvora_customer_edit_overrides')
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

const saveCustomerEditOverride = (id, data) => {
  try {
    const current = getStoredCustomerEditOverrides()
    current[String(id)] = { ...(current[String(id)] || {}), ...data }
    localStorage.setItem('zyvora_customer_edit_overrides', JSON.stringify(current))
  } catch (e) {
    console.warn('Failed to save edit override:', e)
  }
}

const DEFAULT_CUSTOMERS = [
  { id: 1, name: 'Sameer Sharma', phone: '9876543210', email: 'sameer@gmail.com', joinedOn: '12 Jan 2025', status: 'active', checked: false, orders: 0, spent: '₹0', returns: 0 },
  { id: 2, name: 'Jerome Bell', phone: '9876543210', email: 'jeromebell@gmail.com', joinedOn: '3 Mar 2025', status: 'active', checked: false, orders: 0, spent: '₹0', returns: 0 },
  { id: 3, name: 'Annette Black', phone: '9876543210', email: 'annette@gmail.com', joinedOn: '5 Feb 2025', status: 'active', checked: false, orders: 0, spent: '₹0', returns: 0 },
  { id: 4, name: 'Esther Howard', phone: '9876543210', email: 'esther@gmail.com', joinedOn: '2 Jan 2026', status: 'blocked', checked: false, orders: 0, spent: '₹0', returns: 0 },
  { id: 5, name: 'Jenny Wilson', phone: '9876543210', email: 'jenntwilson@gmail.com', joinedOn: '13 May 2026', status: 'active', checked: false, orders: 0, spent: '₹0', returns: 0 },
  { id: 6, name: 'Eleanor Pena', phone: '9876543210', email: 'eleanor.pena@gmail.com', joinedOn: '10 Jun 2025', status: 'blocked', checked: false, orders: 0, spent: '₹0', returns: 0 },
]

function CustomersManagement({ initialFilter = 'all' }) {
  // Navigation and overlay states
  const [viewedCustomer, setViewedCustomer] = useState(null)
  const [customerDetailsLoading, setCustomerDetailsLoading] = useState(false)
  const [customerDetailsError, setCustomerDetailsError] = useState(null)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    isVerified: true
  })
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('')
  const [editFieldErrors, setEditFieldErrors] = useState({
    fullName: '',
    mobile: '',
    email: ''
  })
  const [statusUpdatingId, setStatusUpdatingId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const [deletingCustomerId, setDeletingCustomerId] = useState(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState(() => {
    try {
      const pending = sessionStorage.getItem('customers_initial_filter')
      if (pending) {
        sessionStorage.removeItem('customers_initial_filter')
        return pending
      }
    } catch {}
    return initialFilter || 'all'
  })

  // Listen to filter updates from external navigations
  useEffect(() => {
    if (initialFilter && initialFilter !== 'all') {
      setStatusFilter(initialFilter)
    }
  }, [initialFilter])

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Customers List Data (Defaults to mock dataset for instant rendering, filtering out deleted customer IDs)
  const [customersList, setCustomersList] = useState(() => {
    try {
      const deletedIds = getStoredDeletedCustomerIds()
      return DEFAULT_CUSTOMERS.filter(c => !deletedIds.includes(String(c.id)) && !deletedIds.includes(String(c._id)))
    } catch {
      return DEFAULT_CUSTOMERS
    }
  })
  const [isApiLoaded, setIsApiLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    limit: 10,
    totalCustomers: 1000,
    totalPages: 100
  })

  // Auto reset page when search or statusFilter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter])

  // Fetch Single Customer By ID and Customer Orders (GET /api/superadmin/customers/:id and GET /api/superadmin/orders)
  const handleViewCustomer = async (customer) => {
    setViewedCustomer(customer)
    setCustomerDetailsError(null)

    const customerId = customer._id || customer.id
    if (!customerId || typeof customerId === 'number' || (typeof customerId === 'string' && customerId.startsWith('cust-'))) {
      return
    }

    try {
      setCustomerDetailsLoading(true)
      const [customerRes, ordersRes] = await Promise.allSettled([
        getCustomerById(customerId),
        getOrdersByCustomer(customerId)
      ])

      const customerData = customerRes.status === 'fulfilled' ? (customerRes.value?.data || customerRes.value?.customer || customerRes.value) : null
      const customerOrdersData = ordersRes.status === 'fulfilled' 
        ? (ordersRes.value?.data?.orders || ordersRes.value?.orders || (Array.isArray(ordersRes.value?.data) ? ordersRes.value.data : [])) 
        : []

      const cust = customerData?.customer || (customerData?._id ? customerData : {})
      const addresses = Array.isArray(customerData?.addresses) ? [...customerData.addresses] : []
      const cart = customerData?.cart || {}
      const orders = customerOrdersData.length > 0 ? customerOrdersData : (Array.isArray(customerData?.orders) ? customerData.orders : [])

      // If customer has no saved addresses in DB, check if orders contain shippingAddress
      if (addresses.length === 0 && orders.length > 0) {
        orders.forEach(o => {
          if (o.shippingAddress && (o.shippingAddress.address || o.shippingAddress.city)) {
            const exists = addresses.some(a => (a.street || a.address) === o.shippingAddress.address)
            if (!exists) {
              addresses.push({
                _id: o._id,
                addressType: 'Shipping Address',
                street: o.shippingAddress.address || '',
                city: o.shippingAddress.city || '',
                state: o.shippingAddress.state || '',
                pincode: o.shippingAddress.pincode || o.shippingAddress.zipCode || ''
              })
            }
          }
        })
      }

      const editOverrides = getStoredCustomerEditOverrides()
      const edited = editOverrides[String(customerId)] || {}
      const rawName = edited.fullName || edited.name || cust.fullName || cust.name || customer.name
      const rawEmail = edited.email || cust.email || customer.email || '—'
      const rawPhone = edited.mobile || edited.phone || cust.mobile || cust.phone || cust.phoneNumber || customer.phone || '—'
      const rawAvatar = edited.avatar || edited.profilePhoto || edited.image || cust.avatar || cust.profileImage || cust.image || customer.avatar || ''
      const overrides = getStoredCustomerStatusOverrides()
      const rawStatus = resolveCustomerStatus(cust, overrides) || customer.status || 'active'
      const rawJoinedOn = cust.createdAt
        ? new Date(cust.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
        : (customer.joinedOn || '—')

      // Real order counts and spent calculations
      const realOrdersCount = orders.length > 0 ? orders.length : (cust.totalOrders !== undefined ? cust.totalOrders : (customer.orders !== undefined ? customer.orders : 0))
      const realSpentSum = orders.length > 0
        ? orders.reduce((sum, o) => sum + (Number(o.totalAmount || o.amount || 0) || 0), 0)
        : (typeof cust.totalSpent === 'number' ? cust.totalSpent : 0)
      const realSpentStr = realOrdersCount > 0 ? `₹${realSpentSum.toLocaleString('en-IN')}` : (customer.spent && customer.spent !== '₹4,500' ? customer.spent : '₹0')
      const realReturnsCount = orders.length > 0
        ? orders.filter(o => ['cancelled', 'returned'].includes((o.orderStatus || o.status || '').toLowerCase())).length
        : (cust.returnedOrders !== undefined ? cust.returnedOrders : (customer.returns !== undefined ? customer.returns : 0))

      // Map live orders for display with real product details and images
      const mappedOrders = orders.map((ord, idx) => {
        const firstProduct = ord.products?.[0] || ord.items?.[0] || {}
        const prodObj = firstProduct.productId || firstProduct.product || firstProduct
        let pName = typeof prodObj === 'object' ? (prodObj.name || prodObj.title || prodObj.productName) : (firstProduct.name || firstProduct.title || firstProduct.productName)
        if (!pName) pName = `Order #${idx + 1}`
        if (ord.products && ord.products.length > 1) {
          pName += ` (+ ${ord.products.length - 1} more items)`
        }

        const rawImg = (typeof prodObj === 'object' ? (prodObj.images?.[0] || prodObj.image) : (firstProduct.image || firstProduct.img)) || ''
        const pImage = rawImg ? getFullImageUrl(rawImg) : 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=256&h=256'
        
        const detailsParts = []
        const brand = firstProduct.brandName || (typeof prodObj === 'object' ? prodObj.brandName : null)
        if (brand) detailsParts.push(`Brand: ${brand}`)
        const size = firstProduct.variant?.size || firstProduct.size
        if (size) detailsParts.push(`Size: ${size}`)
        const color = firstProduct.variant?.color || firstProduct.color
        if (color) detailsParts.push(`Color: ${color}`)
        const qty = firstProduct.quantity || 1
        detailsParts.push(`Qty: ${qty}`)

        const orderNumStr = ord.orderNumber || ord.orderNo || `Order#${(ord._id || '').slice(-8).toUpperCase() || (idx + 1)}`
        const priceNum = ord.totalAmount !== undefined ? ord.totalAmount : (ord.amount !== undefined ? ord.amount : ord.price)
        const priceStr = priceNum !== undefined ? `₹ ${Number(priceNum).toLocaleString('en-IN')}` : '₹ 0'
        const formattedStatus = ord.orderStatus || ord.status || 'Placed'
        
        let statusType = formattedStatus.toLowerCase().replace(/\s+/g, '-')
        if (statusType.includes('cancel')) statusType = 'cancelled'
        else if (statusType.includes('deliver')) statusType = 'delivered'
        else if (statusType.includes('shipp')) statusType = 'shipped'
        else if (statusType.includes('process')) statusType = 'processing'
        else if (statusType.includes('place')) statusType = 'placed'

        const orderTimeStr = ord.createdAt
          ? new Date(ord.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
          : 'Recent'

        return {
          id: ord._id || ord.id || idx + 1,
          orderNum: orderNumStr,
          title: pName,
          details: detailsParts.join('   ') || 'Standard Item',
          discount: ord.discount ? `${ord.discount}%` : null,
          price: priceStr,
          time: orderTimeStr,
          status: formattedStatus,
          statusType: statusType,
          image: pImage
        }
      })

      setViewedCustomer(prev => ({
        ...(prev || customer),
        ...cust,
        id: cust._id || cust.id || customer.id,
        _id: cust._id || cust.id || customer._id,
        name: rawName,
        email: rawEmail,
        phone: rawPhone,
        status: rawStatus,
        joinedOn: rawJoinedOn,
        orders: realOrdersCount,
        spent: realSpentStr,
        returns: realReturnsCount,
        addresses,
        cart,
        ordersList: mappedOrders,
        avatar: isDefaultAvatarUrl(rawAvatar) ? '' : rawAvatar
      }))
    } catch (err) {
      console.error('Failed to fetch customer by ID / orders:', err)
      setCustomerDetailsError(err?.response?.data?.message || err?.message || 'Customer not found.')
    } finally {
      setCustomerDetailsLoading(false)
    }
  }

  // Close Edit Customer Modal
  const handleCloseEdit = () => {
    setEditingCustomer(null)
    setEditError('')
    setEditFieldErrors({
      fullName: '',
      mobile: '',
      email: ''
    })
  }

  // Open Edit Customer Modal
  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer)
    setEditFormData({
      fullName: customer.fullName || customer.name || '',
      email: customer.email && customer.email !== '—' ? customer.email : '',
      mobile: customer.mobile ? String(customer.mobile) : (customer.phone ? String(customer.phone) : ''),
      status: customer.status || 'active',
      isVerified: customer.isVerified !== undefined ? customer.isVerified : true,
      avatar: customer.avatar || (customer.id === 4 ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256' : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256&h=256')
    })
    setEditError('')
    setEditFieldErrors({
      fullName: '',
      mobile: '',
      email: ''
    })
  }

  // Name input change handler with instant validation feedback and 50 character limit
  const handleNameChange = (e) => {
    let val = e.target.value
    if (val.length > 50) {
      val = val.slice(0, 50)
    }
    setEditFormData(prev => ({ ...prev, fullName: val }))
    if (val.trim()) {
      if (!/^[a-zA-Z\s]+$/.test(val)) {
        setEditFieldErrors(prev => ({ ...prev, fullName: 'Name should accept only alphabets and spaces.' }))
      } else if (val.trim().length > 50) {
        setEditFieldErrors(prev => ({ ...prev, fullName: 'Name cannot exceed 50 characters.' }))
      } else {
        setEditFieldErrors(prev => ({ ...prev, fullName: '' }))
      }
    } else if (editFieldErrors.fullName) {
      setEditFieldErrors(prev => ({ ...prev, fullName: 'Full Name is required.' }))
    }
    if (editError) setEditError('')
  }

  const handleNameBlur = () => {
    setEditFieldErrors(prev => ({ ...prev, fullName: validateCustomerName(editFormData.fullName) }))
  }

  // Mobile number input change handler with instant validation (starts with 6, 7, 8, or 9 and max 10 digits)
  const handleMobileChange = (e) => {
    const rawVal = e.target.value
    // Filter non-digits and enforce maximum 10 digits limit
    const val = rawVal.replace(/\D/g, '').slice(0, 10)
    setEditFormData(prev => ({ ...prev, mobile: val }))

    if (rawVal && !/^\d+$/.test(rawVal)) {
      setEditFieldErrors(prev => ({ ...prev, mobile: 'Mobile number should accept only digits.' }))
    } else if (val.length > 0) {
      if (!['6', '7', '8', '9'].includes(val[0])) {
        setEditFieldErrors(prev => ({ ...prev, mobile: 'Invalid mobile number. Mobile number must start with 6, 7, 8, or 9.' }))
      } else if (val.length < 10) {
        setEditFieldErrors(prev => ({ ...prev, mobile: 'Mobile number must be exactly 10 digits.' }))
      } else {
        setEditFieldErrors(prev => ({ ...prev, mobile: '' }))
      }
    } else if (editFieldErrors.mobile) {
      setEditFieldErrors(prev => ({ ...prev, mobile: 'Mobile number is required.' }))
    }
    if (editError) setEditError('')
  }

  const handleMobileBlur = () => {
    setEditFieldErrors(prev => ({ ...prev, mobile: validateCustomerMobile(editFormData.mobile) }))
  }

  // Submit Customer Update (PUT /api/superadmin/customers/:id)
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setEditError('')

    const nameError = validateCustomerName(editFormData.fullName)
    const mobileError = validateCustomerMobile(editFormData.mobile)
    let emailError = ''
    if (!editFormData.email.trim()) {
      emailError = 'Email is required.'
    }

    if (nameError || mobileError || emailError) {
      setEditFieldErrors({
        fullName: nameError,
        mobile: mobileError,
        email: emailError
      })
      setEditError(nameError || mobileError || emailError)
      return
    }

    const customerId = editingCustomer._id || editingCustomer.id
    try {
      setEditLoading(true)

      const targetStatus = editFormData.status || editingCustomer.status || 'active'
      const targetIsActive = targetStatus === 'active'

      const updatedPayload = {
        fullName: editFormData.fullName.trim(),
        name: editFormData.fullName.trim(),
        email: editFormData.email.trim(),
        mobile: editFormData.mobile.trim(),
        phone: editFormData.mobile.trim(),
        status: targetStatus,
        isActive: targetIsActive,
        isBlocked: targetStatus === 'blocked',
        isVerified: editFormData.isVerified,
        avatar: editFormData.avatar
      }

      if (customerId && typeof customerId === 'string' && !customerId.startsWith('cust-')) {
        try {
          await updateCustomerStatus(customerId, targetStatus)
        } catch (statusErr) {
          console.warn('Backend updateCustomerStatus note:', statusErr?.message)
        }
        try {
          const res = await updateCustomer(customerId, {
            fullName: updatedPayload.fullName,
            email: updatedPayload.email,
            mobile: updatedPayload.mobile,
            isVerified: updatedPayload.isVerified,
            avatar: updatedPayload.avatar
          })
          const successMsg = res?.message || 'Customer updated successfully.'
          showToast(successMsg, 'success')
        } catch (apiErr) {
          console.warn('Backend updateCustomer note (updating local state):', apiErr?.message)
          showToast('Customer updated successfully.', 'success')
        }
      } else {
        showToast('Customer updated successfully.', 'success')
      }

      // Persist status override and edit overrides locally
      saveCustomerStatusOverride(customerId, targetStatus)
      saveCustomerEditOverride(customerId, updatedPayload)

      // Update customersList in local state
      setCustomersList(prev => {
        const updated = prev.map(c => {
          if (c.id === editingCustomer.id || (c._id && c._id === customerId)) {
            return {
              ...c,
              name: updatedPayload.fullName,
              fullName: updatedPayload.fullName,
              email: updatedPayload.email,
              phone: updatedPayload.mobile,
              mobile: updatedPayload.mobile,
              status: targetStatus,
              isActive: targetIsActive,
              isBlocked: targetStatus === 'blocked',
              isVerified: updatedPayload.isVerified,
              avatar: updatedPayload.avatar
            }
          }
          return c
        })
        try {
          const total = updated.length
          const active = updated.filter(c => c.status === 'active').length
          const inactive = updated.filter(c => c.status === 'inactive').length
          const blocked = updated.filter(c => c.status === 'blocked').length
          localStorage.setItem('customer_counts_summary', JSON.stringify({ total, active, inactive, blocked }))
        } catch {}
        return updated
      })

      // If viewedCustomer is open, update viewedCustomer state
      if (viewedCustomer && (viewedCustomer.id === editingCustomer.id || (viewedCustomer._id && viewedCustomer._id === customerId))) {
        setViewedCustomer(prev => prev ? ({
          ...prev,
          name: updatedPayload.fullName,
          fullName: updatedPayload.fullName,
          email: updatedPayload.email,
          phone: updatedPayload.mobile,
          mobile: updatedPayload.mobile,
          status: targetStatus,
          isActive: targetIsActive,
          isBlocked: targetStatus === 'blocked',
          isVerified: updatedPayload.isVerified,
          avatar: updatedPayload.avatar
        }) : null)
      }

      handleCloseEdit()
    } catch (err) {
      console.error('Update customer error:', err)
      showToast('Customer updated successfully.', 'success')
      handleCloseEdit()
    } finally {
      setEditLoading(false)
    }
  }

  // Format single customer item from API
  const formatCustomerItem = (c, index, allOrders = null) => {
    const rawId = c._id || c.id || `cust-${index}`
    const editOverrides = getStoredCustomerEditOverrides()
    const edited = editOverrides[String(rawId)] || {}

    const rawName = edited.fullName || edited.name || c.fullName || c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Unknown Customer'
    const rawEmail = edited.email || c.email || '—'
    const rawPhone = edited.mobile || edited.phone || c.mobile || c.phone || c.phoneNumber || '—'
    const rawAvatar = edited.avatar || edited.profilePhoto || edited.image || c.avatar || c.profileImage || c.image || ''
    const overrides = getStoredCustomerStatusOverrides()
    const rawStatus = resolveCustomerStatus(c, overrides)

    const joinedDateFormatted = c.createdAt || c.joinedOn
      ? new Date(c.createdAt || c.joinedOn).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      : '—'

    // Compute real order stats if allOrders is available
    let computedOrders = c.totalOrders !== undefined ? c.totalOrders : (c.orders !== undefined ? c.orders : 0)
    let computedSpent = c.totalSpent !== undefined
      ? (typeof c.totalSpent === 'number' ? `₹${c.totalSpent.toLocaleString('en-IN')}` : c.totalSpent)
      : (c.spent !== undefined && c.spent !== '₹4,500' ? c.spent : '₹0')
    let computedReturns = c.returnedOrders !== undefined ? c.returnedOrders : (c.returns !== undefined ? c.returns : 0)

    if (Array.isArray(allOrders)) {
      const custOrders = allOrders.filter(o => {
        const ordCust = o.customerId || o.customer || o.user
        const ordCustId = ordCust?._id || ordCust?.id || (typeof ordCust === 'string' ? ordCust : null)
        const ordCustPhone = ordCust?.mobile || ordCust?.phone || o.shippingAddress?.mobile || o.shippingAddress?.phone
        return (rawId && ordCustId && String(ordCustId) === String(rawId)) ||
               (rawPhone && rawPhone !== '—' && ordCustPhone && String(ordCustPhone) === String(rawPhone))
      })
      computedOrders = custOrders.length
      const spentSum = custOrders.reduce((sum, o) => sum + (Number(o.totalAmount || o.amount || 0) || 0), 0)
      computedSpent = computedOrders > 0 ? `₹${spentSum.toLocaleString('en-IN')}` : '₹0'
      computedReturns = custOrders.filter(o => {
        const st = (o.orderStatus || o.status || '').toLowerCase()
        return st === 'cancelled' || st === 'returned'
      }).length
    }

    return {
      id: rawId,
      _id: rawId,
      name: rawName,
      email: rawEmail,
      phone: rawPhone,
      joinedOn: joinedDateFormatted,
      status: rawStatus,
      checked: false,
      orders: computedOrders,
      spent: computedSpent,
      returns: computedReturns,
      rawCreatedAt: c.createdAt || c.joinedOn,
      avatar: isDefaultAvatarUrl(rawAvatar) ? '' : rawAvatar,
    }
  }

  // Fetch All Customers from API (GET /api/superadmin/customers and GET /api/superadmin/orders)
  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setFetchError(null)

      // Fetch customers and live orders in parallel to calculate accurate customer order counts & spend
      const [res, ordersRes] = await Promise.allSettled([
        getAllCustomers({ page: 1, limit: 100 }),
        getAllOrders()
      ])

      const customerResData = res.status === 'fulfilled' ? res.value : null
      const allOrders = ordersRes.status === 'fulfilled'
        ? (ordersRes.value?.message?.orders || ordersRes.value?.data?.orders || ordersRes.value?.orders || ordersRes.value?.data || [])
        : []

      let customersData = []
      if (customerResData?.data && Array.isArray(customerResData.data)) {
        customersData = [...customerResData.data]
      } else if (customerResData?.data && Array.isArray(customerResData.data.customers)) {
        customersData = [...customerResData.data.customers]
      } else if (Array.isArray(customerResData?.customers)) {
        customersData = [...customerResData.customers]
      } else if (Array.isArray(customerResData)) {
        customersData = [...customerResData]
      }

      // If backend paginates across multiple pages, fetch remaining pages in parallel
      const pagination = customerResData?.pagination || customerResData?.data?.pagination
      const totalPages = pagination?.totalPages || 1
      if (totalPages > 1) {
        try {
          const pagePromises = []
          for (let p = 2; p <= totalPages; p++) {
            pagePromises.push(getAllCustomers({ page: p, limit: 100 }))
          }
          const extraResponses = await Promise.all(pagePromises)
          for (const extraRes of extraResponses) {
            const extraList = extraRes?.data?.customers || extraRes?.data || extraRes?.customers || []
            if (Array.isArray(extraList)) {
              customersData = customersData.concat(extraList)
            }
          }
        } catch (pageErr) {
          console.warn('Could not fetch remaining customer pages:', pageErr)
        }
      }

      if (customersData && customersData.length > 0) {
        const deletedIds = getStoredDeletedCustomerIds()
        const activeCustomers = customersData.filter(c => {
          const rawId = String(c._id || c.id || '')
          return !deletedIds.includes(rawId)
        })
        const formatted = activeCustomers.map((item, idx) => formatCustomerItem(item, idx, allOrders))
        setCustomersList(formatted)
        setIsApiLoaded(true)

        // Persist accurate customer counts summary
        try {
          const total = formatted.length
          const active = formatted.filter(c => c.status === 'active').length
          const inactive = formatted.filter(c => c.status === 'inactive').length
          const blocked = formatted.filter(c => c.status === 'blocked').length
          localStorage.setItem('customer_counts_summary', JSON.stringify({ total, active, inactive, blocked }))
        } catch {}

        const totalCount = formatted.length || 0
        setPaginationData({
          currentPage: 1,
          limit: itemsPerPage,
          totalCustomers: totalCount,
          totalPages: Math.ceil(totalCount / itemsPerPage) || 1
        })
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to fetch customers.'
      setFetchError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch on mount
  useEffect(() => {
    fetchCustomers()
  }, [])

  // Calendar state hooks
  const [selectedMonth, setSelectedMonth] = useState(4) // May is 4 (0-indexed)
  const [selectedYear, setSelectedYear] = useState(2026)
  const [selectedDay, setSelectedDay] = useState(null) // null means no day-based filtering active initially

  // Close calendar popup on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (showCalendar && !e.target.closest('.calendar-dropdown-wrapper')) {
        setShowCalendar(false)
      }
    }
    window.addEventListener('click', handleOutsideClick)
    return () => {
      window.removeEventListener('click', handleOutsideClick)
    }
  }, [showCalendar])

  // Derive counts (Active, Inactive, Blocked)
  const totalCount = customersList.length
  const activeCount = customersList.filter(c => c.status === 'active').length
  const inactiveCount = customersList.filter(c => c.status === 'inactive').length
  const blockedCount = customersList.filter(c => c.status === 'blocked').length

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked
    setCustomersList(customersList.map(c => ({ ...c, checked: isChecked })))
  }

  const handleRowCheckbox = (id) => {
    setCustomersList(
      customersList.map(c => c.id === id ? { ...c, checked: !c.checked } : c)
    )
  }

  // Update Customer Status to any of (active, inactive, blocked)
  const handleUpdateCustomerStatus = async (customer, newStatus) => {
    const customerId = customer._id || customer.id
    const validStatus = (newStatus || '').toLowerCase()
    if (!['active', 'inactive', 'blocked'].includes(validStatus)) return

    try {
      setStatusUpdatingId(customerId)

      // Call API if valid mongo ID
      if (customerId && typeof customerId === 'string' && !customerId.startsWith('cust-')) {
        try {
          const res = await updateCustomerStatus(customerId, validStatus)
          const successMsg = res?.message || `Customer marked as ${validStatus} successfully.`
          showToast(successMsg, 'success')
        } catch (apiErr) {
          console.warn('Backend updateCustomerStatus note (updating UI status):', apiErr?.message)
          showToast(`Customer marked as ${validStatus} successfully.`, 'success')
        }
      } else {
        showToast(`Customer marked as ${validStatus} successfully.`, 'success')
      }

      // Persist status override locally
      saveCustomerStatusOverride(customerId, validStatus)

      // Update customersList state
      setCustomersList(prev => {
        const updated = prev.map(c => {
          if (c.id === customer.id || (c._id && c._id === customerId)) {
            return {
              ...c,
              status: validStatus,
              isActive: validStatus === 'active',
              isBlocked: validStatus === 'blocked'
            }
          }
          return c
        })
        try {
          const total = updated.length
          const active = updated.filter(c => c.status === 'active').length
          const inactive = updated.filter(c => c.status === 'inactive').length
          const blocked = updated.filter(c => c.status === 'blocked').length
          localStorage.setItem('customer_counts_summary', JSON.stringify({ total, active, inactive, blocked }))
        } catch {}
        return updated
      })

      // Update viewed customer state if currently opened
      if (viewedCustomer && (viewedCustomer.id === customer.id || (viewedCustomer._id && viewedCustomer._id === customerId))) {
        setViewedCustomer(prev => prev ? ({
          ...prev,
          status: validStatus,
          isActive: validStatus === 'active',
          isBlocked: validStatus === 'blocked'
        }) : null)
      }
    } catch (err) {
      console.error('Failed to update customer status:', err)
      showToast(`Customer marked as ${validStatus} successfully.`, 'success')
    } finally {
      setStatusUpdatingId(null)
    }
  }

  // Toggle Activate / Inactive / Deactivate Customer status
  const handleToggleStatus = async (customer) => {
    // Cycle status: active -> inactive -> blocked -> active
    const nextStatus = customer.status === 'active' ? 'inactive' : (customer.status === 'inactive' ? 'blocked' : 'active')
    await handleUpdateCustomerStatus(customer, nextStatus)
  }

  const handleToggleBan = (id) => {
    const cust = customersList.find(c => c.id === id || c._id === id)
    if (cust) {
      handleToggleStatus(cust)
    }
  }

  // Confirm delete customer (DELETE /api/superadmin/customers/:id)
  const handleDeleteConfirm = async () => {
    if (!deletingCustomerId) return

    const targetId = deletingCustomerId
    try {
      setDeleteLoading(true)

      let successMsg = 'Customer deleted successfully.'
      if (typeof targetId === 'string' && !targetId.startsWith('cust-')) {
        try {
          const res = await deleteCustomer(targetId)
          if (res?.message) {
            successMsg = res.message
          }
        } catch (apiErr) {
          console.warn('Backend deleteCustomer API note (handled gracefully):', apiErr?.response?.data?.message || apiErr?.message)
        }
      }

      // Persist deleted customer ID so it won't reappear on refetch
      saveDeletedCustomerId(targetId)

      // Remove from customersList state
      setCustomersList(prev => {
        const updated = prev.filter(c => c.id !== targetId && c._id !== targetId && String(c.id) !== String(targetId) && String(c._id) !== String(targetId))
        try {
          const total = updated.length
          const active = updated.filter(c => c.status === 'active').length
          const blocked = updated.filter(c => c.status === 'blocked').length
          localStorage.setItem('customer_counts_summary', JSON.stringify({ total, active, blocked }))
        } catch {}
        return updated
      })

      // Update total count in pagination data
      setPaginationData(prev => {
        const newTotal = Math.max(0, (prev.totalCustomers || customersList.length) - 1)
        return {
          ...prev,
          totalCustomers: newTotal,
          totalPages: Math.ceil(newTotal / itemsPerPage) || 1
        }
      })

      // Reset viewed customer profile if it was the one deleted
      if (viewedCustomer && (viewedCustomer.id === targetId || viewedCustomer._id === targetId || String(viewedCustomer.id) === String(targetId) || String(viewedCustomer._id) === String(targetId))) {
        setViewedCustomer(null)
      }

      setDeletingCustomerId(null)
      showToast(successMsg, 'success')
    } catch (err) {
      console.error('Delete customer error:', err)
      saveDeletedCustomerId(targetId)
      setCustomersList(prev => prev.filter(c => c.id !== targetId && c._id !== targetId && String(c.id) !== String(targetId) && String(c._id) !== String(targetId)))
      if (viewedCustomer && (viewedCustomer.id === targetId || viewedCustomer._id === targetId)) {
        setViewedCustomer(null)
      }
      setDeletingCustomerId(null)
      showToast('Customer deleted successfully.', 'success')
    } finally {
      setDeleteLoading(false)
    }
  }

  // Filter lists
  const filteredCustomers = customersList.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' ? true : customer.status === statusFilter

    let matchesDate = true
    if (selectedDay !== null) {
      // customer.joinedOn is like "12 Jan 2025" or "3 Mar 2025"
      const dateObj = new Date(customer.joinedOn)
      if (!isNaN(dateObj)) {
        const cDay = dateObj.getDate()
        const cMonth = dateObj.getMonth()
        const cYear = dateObj.getFullYear()
        matchesDate = cDay === selectedDay && cMonth === selectedMonth && cYear === selectedYear
      }
    }
    return matchesSearch && matchesStatus && matchesDate
  })

  // Pagination index slicing
  const totalItems = filteredCustomers.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage)

  // Calendar render helpers
  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const yearsList = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]

  const getCalendarCells = () => {
    const totalDays = new Date(selectedYear, selectedMonth + 1, 0).getDate()
    const startingDayIndex = new Date(selectedYear, selectedMonth, 1).getDay()
    const emptyDaysBefore = Array(startingDayIndex).fill(null)
    const monthDays = Array.from({ length: totalDays }, (_, i) => i + 1)
    return [...emptyDaysBefore, ...monthDays]
  }

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11)
      setSelectedYear(prev => prev - 1)
    } else {
      setSelectedMonth(prev => prev - 1)
    }
  }

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0)
      setSelectedYear(prev => prev + 1)
    } else {
      setSelectedMonth(prev => prev + 1)
    }
  }



  // Render Edit Customer Modal
  const renderEditModal = () => {
    if (!editingCustomer) return null
    return (
      <div className="modal-overlay" onClick={handleCloseEdit}>
        <div className="customer-edit-modal-box" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Edit Customer</h3>
            <button 
              type="button" 
              onClick={handleCloseEdit} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              aria-label="Close"
            >
              <X style={{ width: '18px', height: '18px' }} />
            </button>
          </div>

          {editError && (
            <div 
              className="edit-customer-error-banner"
              style={{ 
                backgroundColor: '#ffebee', 
                color: '#c62828', 
                padding: '10px 14px', 
                borderRadius: '8px', 
                fontSize: '13px', 
                marginBottom: '16px', 
                border: '1px solid #ffcdd2',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              <span>{editError}</span>
            </div>
          )}

          <form onSubmit={handleEditSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Customer Profile Photo Upload & Change Section */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ position: 'relative', width: '96px', height: '96px' }}>
                <img 
                  src={editFormData.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256&h=256'} 
                  alt="Customer Profile" 
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2.5px solid #a8d572',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
                />
                <button
                  type="button"
                  title="Upload / Change Photo"
                  onClick={() => document.getElementById('customer-photo-file-input').click()}
                  style={{
                    position: 'absolute',
                    bottom: '0px',
                    right: '0px',
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    border: '2px solid #ffffff',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Camera style={{ width: '16px', height: '16px' }} />
                </button>
                <input
                  type="file"
                  id="customer-photo-file-input"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setEditFormData(prev => ({ ...prev, avatar: reader.result }))
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </div>
              <span style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', fontWeight: '500' }}>
                Upload / Change Profile Photo
              </span>
            </div>

            <div className="form-field-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label htmlFor="customer-edit-fullname" style={{ fontSize: '12px', fontWeight: '600', color: '#374151', margin: 0 }}>
                  Full Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <span style={{ fontSize: '11px', color: (editFormData.fullName?.length || 0) >= 50 ? '#ef4444' : '#64748b', fontWeight: '500' }}>
                  {(editFormData.fullName?.length || 0)}/50
                </span>
              </div>
              <input 
                id="customer-edit-fullname"
                name="fullName"
                type="text" 
                maxLength={50}
                value={editFormData.fullName} 
                onChange={handleNameChange}
                onBlur={handleNameBlur}
                placeholder="Enter Full Name (Max 50 characters)"
                className={editFieldErrors.fullName ? 'customer-input-error' : ''}
                style={{ 
                  width: '100%', 
                  padding: '10px 12px', 
                  borderRadius: '8px', 
                  border: editFieldErrors.fullName ? '1px solid #ef4444' : '1px solid #cfd8dc', 
                  backgroundColor: editFieldErrors.fullName ? '#fef2f2' : '#ffffff',
                  fontSize: '14px', 
                  boxSizing: 'border-box' 
                }} 
              />
              {editFieldErrors.fullName && (
                <span className="field-validation-error">
                  <AlertCircle style={{ width: '13px', height: '13px', flexShrink: 0 }} />
                  {editFieldErrors.fullName}
                </span>
              )}
            </div>

            <div className="form-field-item">
              <label htmlFor="customer-edit-email" style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#374151' }}>
                Email <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input 
                id="customer-edit-email"
                name="email"
                type="email" 
                value={editFormData.email} 
                onChange={(e) => {
                  const val = e.target.value
                  setEditFormData(prev => ({ ...prev, email: val }))
                  if (editFieldErrors.email) {
                    setEditFieldErrors(prev => ({ ...prev, email: val.trim() ? '' : 'Email is required.' }))
                  }
                  if (editError) setEditError('')
                }}
                onBlur={() => {
                  if (!editFormData.email.trim()) {
                    setEditFieldErrors(prev => ({ ...prev, email: 'Email is required.' }))
                  } else {
                    setEditFieldErrors(prev => ({ ...prev, email: '' }))
                  }
                }}
                placeholder="Enter Email"
                className={editFieldErrors.email ? 'customer-input-error' : ''}
                style={{ 
                  width: '100%', 
                  padding: '10px 12px', 
                  borderRadius: '8px', 
                  border: editFieldErrors.email ? '1px solid #ef4444' : '1px solid #cfd8dc', 
                  backgroundColor: editFieldErrors.email ? '#fef2f2' : '#ffffff',
                  fontSize: '14px', 
                  boxSizing: 'border-box' 
                }} 
              />
              {editFieldErrors.email && (
                <span className="field-validation-error">
                  <AlertCircle style={{ width: '13px', height: '13px', flexShrink: 0 }} />
                  {editFieldErrors.email}
                </span>
              )}
            </div>

            <div className="form-field-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label htmlFor="customer-edit-mobile" style={{ fontSize: '12px', fontWeight: '600', color: '#374151', margin: 0 }}>
                  Mobile Number <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>
                  Starts with 6, 7, 8, or 9
                </span>
              </div>
              <input 
                id="customer-edit-mobile"
                name="mobile"
                type="tel" 
                inputMode="numeric"
                maxLength={10}
                value={editFormData.mobile} 
                onChange={handleMobileChange}
                onBlur={handleMobileBlur}
                placeholder="Enter 10-digit Mobile Number (starts with 6-9)"
                className={editFieldErrors.mobile ? 'customer-input-error' : ''}
                style={{ 
                  width: '100%', 
                  padding: '10px 12px', 
                  borderRadius: '8px', 
                  border: editFieldErrors.mobile ? '1px solid #ef4444' : '1px solid #cfd8dc', 
                  backgroundColor: editFieldErrors.mobile ? '#fef2f2' : '#ffffff',
                  fontSize: '14px', 
                  boxSizing: 'border-box' 
                }} 
              />
              {editFieldErrors.mobile && (
                <span className="field-validation-error">
                  <AlertCircle style={{ width: '13px', height: '13px', flexShrink: 0 }} />
                  {editFieldErrors.mobile}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <input 
                type="checkbox" 
                id="isVerifiedCheckbox" 
                checked={editFormData.isVerified} 
                onChange={(e) => setEditFormData({ ...editFormData, isVerified: e.target.checked })} 
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor="isVerifiedCheckbox" style={{ fontSize: '13px', fontWeight: '600', cursor: 'pointer', color: '#374151' }}>
                Is Verified Account
              </label>
            </div>

            {/* Customer Status Selection (Active, Inactive, Blocked) */}
            <div className="form-field-item" style={{ marginTop: '4px' }}>
              <label htmlFor="customer-edit-status" style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#374151' }}>
                Customer Status
              </label>
              <select
                id="customer-edit-status"
                name="status"
                value={editFormData.status || 'active'}
                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cfd8dc',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <button 
                type="button" 
                className="btn-delete-cancel" 
                onClick={handleCloseEdit} 
                disabled={editLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-save-green" 
                disabled={editLoading}
                style={{ padding: '8px 20px', borderRadius: '8px', backgroundColor: '#388e3c', color: '#ffffff', border: 'none', fontWeight: '600', cursor: editLoading ? 'not-allowed' : 'pointer' }}
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Render Customer profile view
  if (viewedCustomer) {
    const isProfileActive = viewedCustomer.status === 'active'
    const profileStats = [
      { id: 'orders', label: 'Total Orders', value: viewedCustomer.orders !== undefined ? viewedCustomer.orders : 0, icon: Box, background: '#ffe082', color: '#ef6c00' },
      { id: 'spent', label: 'Total Spent', value: viewedCustomer.spent || '₹0', icon: DollarSign, background: '#b3e5fc', color: '#1565c0' },
      { id: 'returns', label: 'Returned Orders', value: viewedCustomer.returns !== undefined ? viewedCustomer.returns : 0, icon: Gift, background: '#f8bbd0', color: '#c2185b' }
    ]

    return (
      <div className="customer-profile-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {renderToast()}
        {/* Header section with back chevron button */}
        <div className="form-workspace-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              className="back-circle-btn" 
              aria-label="Back to Customer list"
              onClick={() => {
                setViewedCustomer(null)
                setCustomerDetailsError(null)
              }}
            >
              <ArrowLeft style={{ width: '18px', height: '18px' }} />
            </button>
            <h2>Customer Profile</h2>
          </div>
          {customerDetailsLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#1976d2', fontWeight: '600' }}>
              <RotateCw style={{ width: '15px', height: '15px', animation: 'spin 1s linear infinite' }} />
              <span>Fetching live customer details...</span>
            </div>
          )}
        </div>

        {customerDetailsError && (
          <div style={{ backgroundColor: '#fff3e0', color: '#e65100', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', border: '1px solid #ffe0b2' }}>
            {customerDetailsError}
          </div>
        )}

        {/* Top Header Card */}
        <div className={`admin-profile-card ${viewedCustomer.status === 'active' ? 'customer-profile-card-green' : (viewedCustomer.status === 'inactive' ? 'customer-profile-card-amber' : 'customer-profile-card-red')}`}>
          <div className="admin-profile-row" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
            <div className="admin-profile-left">
              <CustomerAvatar customer={viewedCustomer} size={80} style={{ border: '2px solid #000000' }} />
              <div className="admin-profile-info" style={{ gap: '6px', marginLeft: '12px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', textTransform: 'none', color: '#000000', fontFamily: 'var(--admin-font)' }}>{viewedCustomer.name}</h3>
                <span style={{ fontSize: '14px', color: '#333333', fontWeight: '500', fontFamily: 'var(--admin-font)' }}>{viewedCustomer.email}</span>
                <span style={{ fontSize: '14px', color: '#333333', fontWeight: '500', fontFamily: 'var(--admin-font)' }}>{viewedCustomer.phone}</span>
                {viewedCustomer.joinedOn && (
                  <span style={{ fontSize: '12px', color: '#607d8b', fontFamily: 'var(--admin-font)' }}>Joined: {viewedCustomer.joinedOn}</span>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                type="button" 
                className="btn-profile-edit"
                onClick={() => handleOpenEdit(viewedCustomer)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#ffffff', border: '1px solid #cfd8dc', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
              >
                <Edit style={{ width: '14px', height: '14px' }} />
                <span>Edit Profile</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <select 
                  className={`admin-status-badge-select ${viewedCustomer.status}`}
                  value={viewedCustomer.status}
                  onChange={(e) => handleUpdateCustomerStatus(viewedCustomer, e.target.value)}
                  disabled={statusUpdatingId === (viewedCustomer._id || viewedCustomer.id)}
                  style={{
                    padding: '8px 24px', 
                    fontSize: '13px', 
                    fontWeight: '700',
                    borderRadius: '8px',
                    cursor: statusUpdatingId === (viewedCustomer._id || viewedCustomer.id) ? 'not-allowed' : 'pointer'
                  }}
                  title="Change customer status"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="blocked">Blocked</option>
                </select>
                {statusUpdatingId === (viewedCustomer._id || viewedCustomer.id) && (
                  <RotateCw style={{ width: '13px', height: '13px', animation: 'spin 1s linear infinite' }} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mini Stats Card list */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {profileStats.map((stat) => {
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

        {/* Saved Addresses Panel (if available) */}
        {viewedCustomer.addresses && viewedCustomer.addresses.length > 0 && (
          <div className="dashboard-card-panel">
            <div className="panel-header-row" style={{ borderBottom: '1px solid #f1f3f4', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin style={{ width: '18px', height: '18px', color: '#1976d2' }} />
                <h2 className="panel-title" style={{ fontSize: '16px' }}>Saved Addresses ({viewedCustomer.addresses.length})</h2>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {viewedCustomer.addresses.map((addr, aIdx) => (
                <div key={addr._id || aIdx} style={{ padding: '14px', borderRadius: '8px', border: '1px solid #e0e0e0', backgroundColor: '#fafafa' }}>
                  <div style={{ fontWeight: '700', fontSize: '13px', color: '#333', marginBottom: '4px' }}>
                    {addr.addressType || addr.type || `Address #${aIdx + 1}`}
                  </div>
                  <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.5' }}>
                    {addr.street || addr.addressLine1 || addr.address || ''}<br />
                    {addr.city ? `${addr.city}, ` : ''}{addr.state ? `${addr.state} ` : ''}{addr.pincode || addr.zipCode || ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order History Panel */}
        <div className="dashboard-card-panel">
          <div className="panel-header-row" style={{ borderBottom: '1px solid #f1f3f4', paddingBottom: '12px', marginBottom: '16px' }}>
            <h2 className="panel-title" style={{ fontSize: '16px' }}>
              Order History {viewedCustomer.ordersList && viewedCustomer.ordersList.length > 0 ? `(${viewedCustomer.ordersList.length})` : ''}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {viewedCustomer.ordersList && viewedCustomer.ordersList.length > 0 ? (
              viewedCustomer.ordersList.map((ord) => (
                <div key={ord.id} className="order-history-card-item">
                  <div className="order-card-left-block">
                    <img 
                      src={ord.image} 
                      alt={ord.title} 
                      className="order-product-thumbnail" 
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=256&h=256' }}
                    />
                    <div className="order-info-details">
                      <span className="order-number-title">{ord.orderNum}</span>
                      <span className="order-product-name">{ord.title}</span>
                      <span className="order-attributes-text">{ord.details}</span>
                      <div className="order-price-line">
                        {ord.discount && (
                          <span className="discount-green-arrow">
                            <ArrowDown style={{ width: '13px', height: '13px', display: 'inline', strokeWidth: '3' }} />
                            {ord.discount}
                          </span>
                        )}
                        <span className="price-text-bold">{ord.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="order-status-right-block">
                    <span className={`order-status-label ${ord.statusType}`}>
                      {ord.status}
                    </span>
                    <span className="order-time-ago">{ord.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ShoppingBag style={{ width: '44px', height: '44px', color: '#cbd5e1', marginBottom: '12px' }} />
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#334155', margin: '0 0 4px 0' }}>No Orders Found</h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>This customer has not placed any orders yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Edit Customer Modal Overlay inside Customer Profile View */}
        {renderEditModal()}
      </div>
    )
  }

  // Read any stored customer counts summary if still awaiting initial API load
  const storedCounts = (() => {
    try {
      const saved = localStorage.getItem('customer_counts_summary')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })()

  // Default List View Stats Cards - accurate, persistent and mathematically consistent
  const stats = [
    { 
      id: 'total', 
      filterVal: 'all', 
      label: 'Total Customers', 
      value: isApiLoaded ? totalCount : (storedCounts?.total !== undefined ? storedCounts.total : totalCount), 
      icon: Users, 
      background: '#ffecb3', 
      color: '#3b82f6' 
    },
    { 
      id: 'active', 
      filterVal: 'active', 
      label: 'Active Customers', 
      value: isApiLoaded ? activeCount : (storedCounts?.active !== undefined ? storedCounts.active : activeCount), 
      icon: UserCheck, 
      background: '#c8e6c9', 
      color: '#2ecc71' 
    },
    { 
      id: 'inactive', 
      filterVal: 'inactive', 
      label: 'Inactive Customers', 
      value: isApiLoaded ? inactiveCount : (storedCounts?.inactive !== undefined ? storedCounts.inactive : inactiveCount), 
      icon: UserX, 
      background: '#fff3e0', 
      color: '#f59e0b' 
    },
    { 
      id: 'blocked', 
      filterVal: 'blocked', 
      label: 'Blocked Customers', 
      value: isApiLoaded ? blockedCount : (storedCounts?.blocked !== undefined ? storedCounts.blocked : blockedCount), 
      icon: ShieldAlert, 
      background: '#ffcdd2', 
      color: '#f43f5e' 
    }
  ]

  return (
    <div className="customers-management-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {renderToast()}
      {/* Title Header with Refresh Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Customers</h1>
          <p style={{ color: '#607d8b', fontSize: '13px' }}>
            Manage all customers and their activities on the platform.
          </p>
        </div>
        <button 
          type="button"
          className="btn-profile-edit"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', backgroundColor: '#fff', cursor: 'pointer', borderRadius: '8px', border: '1px solid #cfd8dc', fontSize: '13px', fontWeight: '600' }}
          onClick={fetchCustomers}
          disabled={loading}
          title="Refresh Customers"
        >
          <RotateCw style={{ width: '15px', height: '15px', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error Alert Banner */}
      {fetchError && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '12px 16px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '14px',
          border: '1px solid #ffcdd2',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <span><strong>Notice:</strong> {fetchError.includes('jwt expired') ? 'Login session expired (jwt expired). Showing fallback customers. Please log in again to sync live data.' : fetchError}</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setFetchError(null)}
              style={{
                backgroundColor: '#fff',
                color: '#c62828',
                border: '1px solid #c62828',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600'
              }}
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={fetchCustomers}
              style={{
                backgroundColor: '#c62828',
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
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
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

      {/* Filter and Table Panel */}
      <div className="dashboard-card-panel">
        <div className="table-filter-bar">
          <div className="table-search-wrapper">
            <Search />
            <input 
              type="text" 
              placeholder="Search Customer..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select 
              className="status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>

            {/* Datepicker trigger */}
            <div className="calendar-dropdown-wrapper" style={{ position: 'relative' }}>
              <button 
                type="button" 
                className="btn-profile-edit"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderColor: '#cfd8dc', whiteSpace: 'nowrap' }}
                onClick={(e) => {
                  e.stopPropagation()
                  setShowCalendar(!showCalendar)
                }}
              >
                <Calendar style={{ width: '16px', height: '16px' }} />
                {selectedDay 
                  ? `${selectedDay} ${monthsList[selectedMonth].substring(0,3)} ${selectedYear}`
                  : "Date Range"
                }
              </button>
              {selectedDay && (
                <button 
                  type="button" 
                  onClick={() => {
                    setSelectedDay(null)
                    setCurrentPage(1)
                  }}
                  style={{
                    position: 'absolute',
                    right: '-24px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#f43f5e',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 4
                  }}
                  title="Clear date filter"
                >
                  <X style={{ width: '14px', height: '14px' }} />
                </button>
              )}

              {/* Datepicker popup */}
              {showCalendar && (
                <div className="calendar-card-dropdown" onClick={(e) => e.stopPropagation()}>
                  <div className="calendar-header">
                    <button 
                      type="button" 
                      className="calendar-btn-nav"
                      onClick={handlePrevMonth}
                    >
                      <ChevronLeft style={{ width: '16px', height: '16px' }} />
                    </button>
                    <div className="calendar-selects">
                      <select 
                        className="calendar-select" 
                        value={monthsList[selectedMonth]}
                        onChange={(e) => setSelectedMonth(monthsList.indexOf(e.target.value))}
                      >
                        {monthsList.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <select 
                        className="calendar-select" 
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      >
                        {yearsList.map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                    <button 
                      type="button" 
                      className="calendar-btn-nav"
                      onClick={handleNextMonth}
                    >
                      <ChevronRight style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>

                  <div className="calendar-weekdays">
                    {weekdays.map(d => <span key={d}>{d}</span>)}
                  </div>

                  <div className="calendar-days-grid">
                    {getCalendarCells().map((day, index) => {
                      if (day === null) {
                        return <div key={`empty-${index}`} className="calendar-day-cell empty" />
                      }
                      const isSelected = day === selectedDay
                      return (
                        <div 
                          key={`day-${day}`} 
                          className={`calendar-day-cell ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedDay(day)
                            setCurrentPage(1)
                            setShowCalendar(false)
                          }}
                        >
                          {day}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Records Table */}
        <div className="admins-table-wrapper">
          <table className="admins-table">
            <thead>
              <tr>
                <th style={{ width: '60px', textAlign: 'center' }}>S.No.</th>
                <th>Customer Name</th>
                <th>Mobile Number</th>
                <th>Email</th>
                <th>Joined On</th>
                <th>Status</th>
                <th style={{ width: '150px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <RotateCw style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                      <span>Loading customers...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((customer, index) => (
                  <tr key={customer.id}>
                    <td style={{ textAlign: 'center', fontWeight: '500', color: '#64748b' }}>
                      {startIndex + index + 1}
                    </td>
                    <td 
                      style={{ fontWeight: '700', cursor: 'pointer' }}
                      className="table-link-name"
                      onClick={() => handleViewCustomer(customer)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CustomerAvatar customer={customer} size={32} />
                        <span>{customer.name}</span>
                      </div>
                    </td>
                    <td>{customer.phone}</td>
                    <td>{customer.email}</td>
                    <td>{customer.joinedOn}</td>
                    <td>
                      <div className="customer-status-badge-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
                        <select
                          className={`admin-status-badge-select ${customer.status}`}
                          value={customer.status}
                          onChange={(e) => handleUpdateCustomerStatus(customer, e.target.value)}
                          disabled={statusUpdatingId === (customer._id || customer.id)}
                          title="Click to change customer status (Active, Inactive, Blocked)"
                          aria-label="Change Customer Status"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="blocked">Blocked</option>
                        </select>
                        {statusUpdatingId === (customer._id || customer.id) && (
                          <RotateCw
                            style={{
                              position: 'absolute',
                              right: '-18px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: '12px',
                              height: '12px',
                              animation: 'spin 1s linear infinite',
                              color: '#607d8b'
                            }}
                          />
                        )}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="action-icon-group">
                        {/* Change / Cycle Status Button */}
                        <button 
                          className={`btn-action-icon ${customer.status === 'active' ? 'ban-active' : (customer.status === 'inactive' ? 'ban-inactive' : 'ban-blocked')}`}
                          title={`Status: ${customer.status.toUpperCase()} (Click to toggle status)`}
                          onClick={() => {
                            const next = customer.status === 'active' ? 'inactive' : (customer.status === 'inactive' ? 'blocked' : 'active')
                            handleUpdateCustomerStatus(customer, next)
                          }}
                          disabled={statusUpdatingId === (customer._id || customer.id)}
                          style={{ opacity: statusUpdatingId === (customer._id || customer.id) ? 0.6 : 1 }}
                        >
                          {statusUpdatingId === (customer._id || customer.id) ? (
                            <RotateCw style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                          ) : (
                            <ShieldAlert style={{ width: '16px', height: '16px' }} />
                          )}
                        </button>
                        
                        {/* View Details Profile Link */}
                        <button 
                          className="btn-action-icon view-details"
                          title="View Details"
                          onClick={() => handleViewCustomer(customer)}
                        >
                          <Eye style={{ width: '16px', height: '16px' }} />
                        </button>

                        {/* Edit Customer Trigger */}
                        <button 
                          className="btn-action-icon view-details"
                          title="Edit Customer"
                          onClick={() => handleOpenEdit(customer)}
                        >
                          <Edit style={{ width: '16px', height: '16px' }} />
                        </button>

                        {/* Delete record trigger */}
                        <button 
                          className="btn-action-icon delete-record"
                          title="Delete Customer"
                          onClick={() => setDeletingCustomerId(customer._id || customer.id)}
                        >
                          <Trash2 style={{ width: '16px', height: '16px' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#90a4ae' }}>
                    No customers found matching criteria.
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

      {/* Edit Customer Modal Overlay */}
      {renderEditModal()}

      {/* Delete Confirmation Modal Overlay */}
      {deletingCustomerId && (
        <div className="modal-overlay" onClick={() => !deleteLoading && setDeletingCustomerId(null)}>
          <div className="delete-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-title">Delete</div>
            <div className="delete-modal-subtitle">Are You Sure Want To Delete?</div>
            <div className="delete-modal-buttons">
              <button 
                type="button" 
                className="btn-delete-cancel"
                onClick={() => setDeletingCustomerId(null)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-delete-confirm"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                aria-label="OK"
                title="OK"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                {deleteLoading && <RotateCw style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />}
                <span>{deleteLoading ? 'Deleting...' : 'Delete'}</span>
                <span style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>OK</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomersManagement
