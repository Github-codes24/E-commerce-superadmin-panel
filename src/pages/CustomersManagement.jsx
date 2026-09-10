import React, { useState, useRef, useEffect } from 'react'
import { Users, UserCheck, ShieldAlert, Eye, Edit, Trash2, Search, ArrowLeft, Calendar, DollarSign, Box, Gift, ChevronLeft, ChevronRight, X, ArrowDown, RotateCw, AlertCircle, CheckCircle2, MapPin, ShoppingBag, Check } from 'lucide-react'
import { getAllCustomers, getCustomerById, updateCustomer, updateCustomerStatus, deleteCustomer } from '../services/superAdminService'
import './CustomersManagement.css'

const DEFAULT_CUSTOMERS = [
  { id: 1, name: 'Sameer Sharma', phone: '9876543210', email: 'sameer@gmail.com', joinedOn: '12 Jan 2025', status: 'active', checked: false, orders: 100, spent: '₹45,780', returns: 34 },
  { id: 2, name: 'Jerome Bell', phone: '9876543210', email: 'jeromebell@gmail.com', joinedOn: '3 Mar 2025', status: 'active', checked: false, orders: 15, spent: '₹6,400', returns: 1 },
  { id: 3, name: 'Annette Black', phone: '9876543210', email: 'annette@gmail.com', joinedOn: '5 Feb 2025', status: 'active', checked: false, orders: 28, spent: '₹12,850', returns: 4 },
  { id: 4, name: 'Esther Howard', phone: '9876543210', email: 'esther@gmail.com', joinedOn: '2 Jan 2026', status: 'blocked', checked: false, orders: 100, spent: '₹45,780', returns: 34 },
  { id: 5, name: 'Jenny Wilson', phone: '9876543210', email: 'jenntwilson@gmail.com', joinedOn: '13 May 2026', status: 'active', checked: false, orders: 54, spent: '₹22,900', returns: 8 },
  { id: 6, name: 'Eleanor Pena', phone: '9876543210', email: 'eleanor.pena@gmail.com', joinedOn: '10 Jun 2025', status: 'blocked', checked: false, orders: 4, spent: '₹1,500', returns: 0 },
]

function CustomersManagement() {
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
  const [statusUpdatingId, setStatusUpdatingId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const [deletingCustomerId, setDeletingCustomerId] = useState(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

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

  // Customers List Data (Defaults to mock dataset for instant rendering)
  const [customersList, setCustomersList] = useState(DEFAULT_CUSTOMERS)
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

  // Fetch Single Customer By ID (GET /api/superadmin/customers/:id)
  const handleViewCustomer = async (customer) => {
    setViewedCustomer(customer)
    setCustomerDetailsError(null)

    const customerId = customer._id || customer.id
    if (!customerId || typeof customerId === 'number' || (typeof customerId === 'string' && customerId.startsWith('cust-'))) {
      return
    }

    try {
      setCustomerDetailsLoading(true)
      const res = await getCustomerById(customerId)
      const data = res?.data || res?.customer || res

      if (data) {
        const cust = data.customer || (data._id ? data : {})
        const addresses = Array.isArray(data.addresses) ? data.addresses : []
        const cart = data.cart || {}
        const orders = Array.isArray(data.orders) ? data.orders : []

        const rawName = cust.fullName || cust.name || customer.name
        const rawEmail = cust.email || customer.email
        const rawPhone = cust.mobile || cust.phone || cust.phoneNumber || customer.phone
        const rawStatus = (cust.status || customer.status || 'ACTIVE').toString().toLowerCase() === 'active' ? 'active' : 'blocked'
        const rawJoinedOn = cust.createdAt
          ? new Date(cust.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
          : customer.joinedOn

        const rawOrdersCount = orders.length > 0 ? orders.length : (cust.totalOrders !== undefined ? cust.totalOrders : customer.orders)
        const rawSpent = cust.totalSpent !== undefined 
          ? (typeof cust.totalSpent === 'number' ? `₹${cust.totalSpent.toLocaleString()}` : cust.totalSpent)
          : customer.spent
        const rawReturns = cust.returnedOrders !== undefined ? cust.returnedOrders : customer.returns

        // Map live orders for display
        const mappedOrders = orders.map((ord, idx) => ({
          id: ord._id || ord.id || idx + 1,
          orderNum: ord.orderNumber || ord.orderNum || `Order#${(ord._id || '').slice(-8).toUpperCase() || '28456876'}`,
          title: ord.items?.[0]?.productName || ord.items?.[0]?.name || ord.title || `Order #${idx + 1}`,
          details: ord.items?.[0]?.variant ? `Size : ${ord.items[0].variant.size || 'M'}   Color : ${ord.items[0].variant.color || 'Standard'}` : (ord.details || 'Standard Order'),
          discount: ord.discount || null,
          price: ord.totalAmount ? `₹ ${Number(ord.totalAmount).toLocaleString()}` : (ord.price || '₹ 3,599'),
          time: ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) : 'Recent',
          status: ord.orderStatus ? `${ord.orderStatus.charAt(0).toUpperCase() + ord.orderStatus.slice(1).toLowerCase()}` : (ord.status || 'Delivered'),
          statusType: (ord.orderStatus || ord.statusType || 'delivered').toLowerCase(),
          image: ord.items?.[0]?.image || ord.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=256&h=256'
        }))

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
          orders: rawOrdersCount,
          spent: rawSpent,
          returns: rawReturns,
          addresses,
          cart,
          ordersList: mappedOrders.length > 0 ? mappedOrders : null,
          avatar: cust.avatar || cust.profileImage || cust.image || customer.avatar
        }))
      }
    } catch (err) {
      console.error('Failed to fetch customer by ID:', err)
      setCustomerDetailsError(err?.response?.data?.message || err?.message || 'Customer not found.')
    } finally {
      setCustomerDetailsLoading(false)
    }
  }

  // Open Edit Customer Modal
  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer)
    setEditFormData({
      fullName: customer.fullName || customer.name || '',
      email: customer.email || '',
      mobile: customer.mobile || customer.phone || '',
      isVerified: customer.isVerified !== undefined ? customer.isVerified : true
    })
    setEditError('')
  }

  // Submit Customer Update (PUT /api/superadmin/customers/:id)
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setEditError('')

    if (!editFormData.fullName.trim()) {
      setEditError('Full Name is required.')
      return
    }
    if (!editFormData.email.trim()) {
      setEditError('Email is required.')
      return
    }
    if (!editFormData.mobile.trim()) {
      setEditError('Mobile number is required.')
      return
    }

    const customerId = editingCustomer._id || editingCustomer.id
    try {
      setEditLoading(true)

      if (customerId && typeof customerId === 'string' && !customerId.startsWith('cust-')) {
        const res = await updateCustomer(customerId, {
          fullName: editFormData.fullName.trim(),
          email: editFormData.email.trim(),
          mobile: editFormData.mobile.trim(),
          isVerified: editFormData.isVerified
        })

        const successMsg = res?.message || 'Customer updated successfully.'
        showToast(successMsg, 'success')
      } else {
        showToast('Customer updated successfully.', 'success')
      }

      // Update customersList in local state
      setCustomersList(prev => prev.map(c => {
        if (c.id === editingCustomer.id || (c._id && c._id === customerId)) {
          return {
            ...c,
            name: editFormData.fullName.trim(),
            fullName: editFormData.fullName.trim(),
            email: editFormData.email.trim(),
            phone: editFormData.mobile.trim(),
            mobile: editFormData.mobile.trim(),
            isVerified: editFormData.isVerified
          }
        }
        return c
      }))

      // If viewedCustomer is open, update viewedCustomer state
      if (viewedCustomer && (viewedCustomer.id === editingCustomer.id || (viewedCustomer._id && viewedCustomer._id === customerId))) {
        setViewedCustomer(prev => prev ? ({
          ...prev,
          name: editFormData.fullName.trim(),
          fullName: editFormData.fullName.trim(),
          email: editFormData.email.trim(),
          phone: editFormData.mobile.trim(),
          mobile: editFormData.mobile.trim(),
          isVerified: editFormData.isVerified
        }) : null)
      }

      setEditingCustomer(null)
    } catch (err) {
      console.error('Update customer error:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to update customer.'
      setEditError(errorMsg)
    } finally {
      setEditLoading(false)
    }
  }

  // Format single customer item from API
  const formatCustomerItem = (c, index) => {
    const rawId = c._id || c.id || `cust-${index}`
    const rawName = c.fullName || c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Unknown Customer'
    const rawEmail = c.email || 'N/A'
    const rawPhone = c.mobile || c.phone || c.phoneNumber || '9876543210'
    const rawStatus = (c.status || 'ACTIVE').toString().toLowerCase() === 'active' ? 'active' : 'blocked'

    const joinedDateFormatted = c.createdAt || c.joinedOn
      ? new Date(c.createdAt || c.joinedOn).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      : '12 Jan 2025'

    const rawOrders = c.totalOrders !== undefined ? c.totalOrders : (c.orders !== undefined ? c.orders : (c.orderCount !== undefined ? c.orderCount : 12))
    const rawSpent = c.totalSpent !== undefined
      ? (typeof c.totalSpent === 'number' ? `₹${c.totalSpent.toLocaleString()}` : c.totalSpent)
      : (c.spent !== undefined ? c.spent : '₹4,500')
    const rawReturns = c.returnedOrders !== undefined ? c.returnedOrders : (c.returns !== undefined ? c.returns : 0)

    return {
      id: rawId,
      _id: rawId,
      name: rawName,
      email: rawEmail,
      phone: rawPhone,
      joinedOn: joinedDateFormatted,
      status: rawStatus,
      checked: false,
      orders: rawOrders,
      spent: rawSpent,
      returns: rawReturns,
      rawCreatedAt: c.createdAt || c.joinedOn,
      avatar: c.avatar || c.profileImage || c.image || null,
    }
  }

  // Fetch All Customers from API (GET /api/superadmin/customers)
  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setFetchError(null)

      const params = {
        page: currentPage,
        limit: itemsPerPage,
      }

      if (statusFilter !== 'all') {
        params.status = statusFilter === 'active' ? 'ACTIVE' : 'INACTIVE'
      }

      const res = await getAllCustomers(params)

      let customersData = []
      if (res?.data && Array.isArray(res.data)) {
        customersData = res.data
      } else if (res?.data && Array.isArray(res.data.customers)) {
        customersData = res.data.customers
      } else if (Array.isArray(res?.customers)) {
        customersData = res.customers
      } else if (Array.isArray(res)) {
        customersData = res
      }

      if (customersData && customersData.length > 0) {
        const formatted = customersData.map((item, idx) => formatCustomerItem(item, idx))
        setCustomersList(formatted)
        setIsApiLoaded(true)
      }

      const pagination = res?.pagination || res?.data?.pagination
      if (pagination) {
        setPaginationData({
          currentPage: pagination.currentPage || 1,
          limit: pagination.limit || itemsPerPage,
          totalCustomers: pagination.totalCustomers !== undefined ? pagination.totalCustomers : (customersData.length || 20),
          totalPages: pagination.totalPages || 1
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

  // Initial fetch
  useEffect(() => {
    fetchCustomers()
  }, [statusFilter])

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

  // Derive counts
  const totalCount = customersList.length
  const activeCount = customersList.filter(c => c.status === 'active').length
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

  // Toggle Activate / Deactivate Customer status (PATCH /api/superadmin/customers/:id/status)
  const handleToggleStatus = async (customer) => {
    const customerId = customer._id || customer.id
    const isCurrentlyActive = customer.status === 'active'
    const nextIsActive = !isCurrentlyActive
    const nextStatus = nextIsActive ? 'active' : 'blocked'

    try {
      setStatusUpdatingId(customerId)

      // Call API if valid mongo ID
      if (customerId && typeof customerId === 'string' && !customerId.startsWith('cust-')) {
        const res = await updateCustomerStatus(customerId, nextIsActive)
        const successMsg = res?.message || (nextIsActive ? 'Customer activated successfully.' : 'Customer deactivated successfully.')
        showToast(successMsg, 'success')
      } else {
        showToast(nextIsActive ? 'Customer activated successfully.' : 'Customer deactivated successfully.', 'success')
      }

      // Update customersList state
      setCustomersList(prev => prev.map(c => {
        if (c.id === customer.id || (c._id && c._id === customerId)) {
          return { ...c, status: nextStatus }
        }
        return c
      }))

      // Update viewed customer state if currently opened
      if (viewedCustomer && (viewedCustomer.id === customer.id || (viewedCustomer._id && viewedCustomer._id === customerId))) {
        setViewedCustomer(prev => prev ? ({ ...prev, status: nextStatus }) : null)
      }
    } catch (err) {
      console.error('Failed to update customer status:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to update customer status.'
      showToast(errorMsg, 'error')
    } finally {
      setStatusUpdatingId(null)
    }
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

    try {
      setDeleteLoading(true)
      if (typeof deletingCustomerId === 'string' && !deletingCustomerId.startsWith('cust-')) {
        const res = await deleteCustomer(deletingCustomerId)
        const successMsg = res?.message || 'Customer deleted successfully.'
        showToast(successMsg, 'success')
      } else {
        showToast('Customer deleted successfully.', 'success')
      }

      setCustomersList(prev => prev.filter(c => c.id !== deletingCustomerId && c._id !== deletingCustomerId))
      if (viewedCustomer && (viewedCustomer.id === deletingCustomerId || viewedCustomer._id === deletingCustomerId)) {
        setViewedCustomer(null)
      }
      setDeletingCustomerId(null)
    } catch (err) {
      console.error('Delete customer error:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Customer not found.'
      showToast(errorMsg, 'error')
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

  // Mock Order history for viewed customer profile matching mockup
  const customerOrders = [
    {
      id: 1,
      orderNum: 'Order#28456876',
      title: "Women's Flare Dress",
      details: 'Size : M   Color : Pink',
      discount: '64%',
      price: '₹ 3,599',
      time: '8h ago',
      status: 'Delivered on May 09, 2026',
      statusType: 'delivered',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=256&h=256'
    },
    {
      id: 2,
      orderNum: 'Order#28456876',
      title: "Women's A -Line Dress",
      details: 'Size : M   Color : Blue',
      discount: '64%',
      price: '₹ 3,599',
      time: '8h ago',
      status: 'Order Placed',
      statusType: 'placed',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256&h=256'
    },
    {
      id: 3,
      orderNum: 'Order#28456876',
      title: 'Women Scarf',
      details: 'Size : Free Size   Color : Yellow',
      discount: null,
      price: '₹ 3,599',
      time: '8h ago',
      status: 'Cancelled on May 02, 2026',
      statusType: 'cancelled',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=256&h=256'
    }
  ]

  // Render Customer profile view
  if (viewedCustomer) {
    const isProfileActive = viewedCustomer.status === 'active'
    const profileStats = [
      { id: 'orders', label: 'Total Orders', value: viewedCustomer.orders || '100', icon: Box, background: '#ffe082', color: '#ef6c00' },
      { id: 'spent', label: 'Total Spent', value: viewedCustomer.spent || '₹45,780', icon: DollarSign, background: '#b3e5fc', color: '#1565c0' },
      { id: 'returns', label: 'Returned Orders', value: viewedCustomer.returns || '34', icon: Gift, background: '#f8bbd0', color: '#c2185b' }
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
        <div className={`admin-profile-card ${isProfileActive ? 'customer-profile-card-green' : 'customer-profile-card-red'}`}>
          <div className="admin-profile-row" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
            <div className="admin-profile-left">
              <img 
                src={viewedCustomer.avatar || (viewedCustomer.id === 4 ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256' : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256&h=256')} 
                alt={viewedCustomer.name} 
                className="admin-profile-avatar"
                style={{ width: '80px', height: '80px', border: '1.5px solid #000000', borderRadius: '50%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
              />
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

              <button 
                type="button" 
                className={`vendor-badge ${isProfileActive ? 'active' : 'inactive'}`} 
                onClick={() => handleToggleStatus(viewedCustomer)}
                disabled={statusUpdatingId === (viewedCustomer._id || viewedCustomer.id)}
                style={{ 
                  padding: '8px 24px', 
                  fontSize: '13px', 
                  fontWeight: '600',
                  borderRadius: '8px',
                  backgroundColor: isProfileActive ? '#388e3c' : '#d32f2f',
                  color: '#ffffff',
                  border: 'none',
                  cursor: statusUpdatingId === (viewedCustomer._id || viewedCustomer.id) ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textTransform: 'capitalize'
                }}
                title={isProfileActive ? 'Click to Deactivate Customer' : 'Click to Activate Customer'}
              >
                {statusUpdatingId === (viewedCustomer._id || viewedCustomer.id) && (
                  <RotateCw style={{ width: '13px', height: '13px', animation: 'spin 1s linear infinite' }} />
                )}
                <span>{viewedCustomer.status}</span>
              </button>
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
            <h2 className="panel-title" style={{ fontSize: '16px' }}>Order History</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {(viewedCustomer.ordersList && viewedCustomer.ordersList.length > 0 ? viewedCustomer.ordersList : customerOrders).map((ord) => (
              <div key={ord.id} className="order-history-card-item">
                <div className="order-card-left-block">
                  <img 
                    src={ord.image} 
                    alt={ord.title} 
                    className="order-product-thumbnail" 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/80' }}
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
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Default List View
  const stats = [
    { id: 'total', filterVal: 'all', label: 'Total Customers', value: isApiLoaded ? (paginationData.totalCustomers || customersList.length) : 1000, icon: Users, background: '#ffecb3', color: '#3b82f6' },
    { id: 'active', filterVal: 'active', label: 'Active Customers', value: isApiLoaded ? customersList.filter(c => c.status === 'active').length : 900, icon: UserCheck, background: '#c8e6c9', color: '#2ecc71' },
    { id: 'blocked', filterVal: 'blocked', label: 'Blocked Customers', value: isApiLoaded ? customersList.filter(c => c.status === 'blocked').length : 100, icon: ShieldAlert, background: '#ffcdd2', color: '#f43f5e' }
  ]

  return (
    <div className="customers-management-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {renderToast()}
      {/* Title Header with Refresh Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Customer</h1>
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
                <th style={{ width: '40px', textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    className="admins-table-checkbox"
                    checked={customersList.length > 0 && customersList.every(c => c.checked)}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Customer Name</th>
                <th>Mobile Number</th>
                <th>Email</th>
                <th>Joined On</th>
                <th>Status</th>
                <th style={{ width: '150px', textAlign: 'center' }}>Action</th>
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
                paginatedCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        className="admins-table-checkbox"
                        checked={customer.checked}
                        onChange={() => handleRowCheckbox(customer.id)}
                      />
                    </td>
                    <td 
                      style={{ fontWeight: '700', cursor: 'pointer' }}
                      className="table-link-name"
                      onClick={() => handleViewCustomer(customer)}
                    >
                      {customer.name}
                    </td>
                    <td>{customer.phone}</td>
                    <td>{customer.email}</td>
                    <td>{customer.joinedOn}</td>
                    <td>
                      <span className={`admin-status-badge ${customer.status}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="action-icon-group">
                        {/* Activate / Deactivate Toggle Button */}
                        <button 
                          className={`btn-action-icon ${customer.status === 'active' ? 'ban-active' : 'ban-blocked'}`}
                          title={customer.status === 'active' ? 'Deactivate Customer' : 'Activate Customer'}
                          onClick={() => handleToggleStatus(customer)}
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

      {/* Edit Customer Modal Overlay */}
      {editingCustomer && (
        <div className="modal-overlay" onClick={() => setEditingCustomer(null)}>
          <div className="customer-edit-modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Edit Customer</h3>
              <button 
                type="button" 
                onClick={() => setEditingCustomer(null)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>

            {editError && (
              <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', border: '1px solid #ffcdd2' }}>
                {editError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#374151' }}>Full Name *</label>
                <input 
                  type="text" 
                  value={editFormData.fullName} 
                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })} 
                  required 
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cfd8dc', fontSize: '14px', boxSizing: 'border-box' }} 
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#374151' }}>Email *</label>
                <input 
                  type="email" 
                  value={editFormData.email} 
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} 
                  required 
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cfd8dc', fontSize: '14px', boxSizing: 'border-box' }} 
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px', color: '#374151' }}>Mobile Number *</label>
                <input 
                  type="text" 
                  value={editFormData.mobile} 
                  onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })} 
                  required 
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cfd8dc', fontSize: '14px', boxSizing: 'border-box' }} 
                />
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button 
                  type="button" 
                  className="btn-delete-cancel" 
                  onClick={() => setEditingCustomer(null)} 
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
      )}

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
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                {deleteLoading && <RotateCw style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />}
                <span>{deleteLoading ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomersManagement
