import React, { useState, useEffect, useCallback } from 'react'
import {
  Search,
  ChevronDown,
  Eye,
  ChevronLeft,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Loader2,
  RotateCw,
  X,
  AlertCircle,
} from 'lucide-react'
import { getAllPayments, getPaymentStats, getFailedPayments } from '../services/superAdminService'
import './PaymentMonitoring.css'

/* ─────────────────────────────────────────
   Mock Data Fallback
───────────────────────────────────────── */
const INITIAL_PAYMENTS = [
  {
    id: 1,
    srNo: 1,
    paymentId: 'Pay_101',
    orderId: 'Order#28456876',
    customerName: 'John Doe',
    customerPhone: '9875663201',
    customerEmail: 'johndoe@gmail.com',
    method: 'Apple Pay',
    date: '12 May 2026',
    time: '01:00 PM',
    status: 'Success',
    amount: '₹5000',
    productName: 'Sony Camera',
    productSize: 'Free Size',
    productColor: 'Black',
    qty: 1,
    productPrice: '₹ 7,198',
    totalAmount: '₹ 7,213',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 2,
    srNo: 2,
    paymentId: 'Pay_102',
    orderId: 'Order#28456876',
    customerName: 'John Doe',
    customerPhone: '9875663201',
    customerEmail: 'johndoe@gmail.com',
    method: 'Apple Pay',
    date: '12 May 2026',
    time: '01:00 PM',
    status: 'Refund',
    amount: '₹5000',
    productName: 'Sony Camera',
    productSize: 'Free Size',
    productColor: 'Black',
    qty: 1,
    productPrice: '₹ 7,198',
    totalAmount: '₹ 7,213',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 3,
    srNo: 3,
    paymentId: 'Pay_103',
    orderId: 'Order#28456876',
    customerName: 'John Doe',
    customerPhone: '9875663201',
    customerEmail: 'johndoe@gmail.com',
    method: 'COD',
    date: '12 May 2026',
    time: '02:30 PM',
    status: 'Success',
    amount: '₹3200',
    productName: 'Leather Jacket',
    productSize: 'L',
    productColor: 'Brown',
    qty: 1,
    productPrice: '₹ 3,150',
    totalAmount: '₹ 3,200',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 4,
    srNo: 4,
    paymentId: 'Pay_104',
    orderId: 'Order#28456876',
    customerName: 'John Doe',
    customerPhone: '9875663201',
    customerEmail: 'johndoe@gmail.com',
    method: 'UPI',
    date: '12 May 2026',
    time: '04:15 PM',
    status: 'Success',
    amount: '₹1500',
    productName: 'Smart Band',
    productSize: 'M',
    productColor: 'Blue',
    qty: 1,
    productPrice: '₹ 1,450',
    totalAmount: '₹ 1,500',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 5,
    srNo: 5,
    paymentId: 'Pay_105',
    orderId: 'Order#28456876',
    customerName: 'John Doe',
    customerPhone: '9875663201',
    customerEmail: 'johndoe@gmail.com',
    method: 'Net Banking',
    date: '13 May 2026',
    time: '11:00 AM',
    status: 'Success',
    amount: '₹8900',
    productName: 'Gaming Mouse',
    productSize: 'Free Size',
    productColor: 'RGB',
    qty: 1,
    productPrice: '₹ 8,700',
    totalAmount: '₹ 8,900',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 6,
    srNo: 6,
    paymentId: 'Pay_106',
    orderId: 'Order#28456876',
    customerName: 'John Doe',
    customerPhone: '9875663201',
    customerEmail: 'johndoe@gmail.com',
    method: 'Credit Card',
    date: '13 May 2026',
    time: '05:45 PM',
    status: 'Refund',
    amount: '₹4200',
    productName: 'Wireless Earbuds',
    productSize: 'Free Size',
    productColor: 'White',
    qty: 1,
    productPrice: '₹ 4,100',
    totalAmount: '₹ 4,200',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 7,
    srNo: 7,
    paymentId: 'Pay_107',
    orderId: 'Order#28456876',
    customerName: 'John Doe',
    customerPhone: '9875663201',
    customerEmail: 'johndoe@gmail.com',
    method: 'Debit Card',
    date: '14 May 2026',
    time: '09:10 AM',
    status: 'Success',
    amount: '₹2100',
    productName: 'Fitness Tracker',
    productSize: 'S',
    productColor: 'Pink',
    qty: 1,
    productPrice: '₹ 2,050',
    totalAmount: '₹ 2,100',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 8,
    srNo: 8,
    paymentId: 'Pay_108',
    orderId: 'Order#28456876',
    customerName: 'Emma Watson',
    customerPhone: '9876543210',
    customerEmail: 'emma@gmail.com',
    method: 'Net Banking',
    date: '14 May 2026',
    time: '03:20 PM',
    status: 'Success',
    amount: '₹12500',
    productName: 'Mechanical Keyboard',
    productSize: 'Full',
    productColor: 'Black',
    qty: 1,
    productPrice: '₹ 12,300',
    totalAmount: '₹ 12,500',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150',
  },
]

/* ─────────────────────────────────────────
   Helper Formatters
───────────────────────────────────────── */
const formatDate = (dateStr) => {
  if (!dateStr || dateStr === '-') return '-'
  const dateObj = new Date(dateStr)
  if (isNaN(dateObj.getTime())) return dateStr
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`
}

const formatTime = (timeStr) => {
  if (!timeStr || timeStr === '-') return ''
  const dateObj = new Date(timeStr)
  if (isNaN(dateObj.getTime())) return timeStr
  let hours = dateObj.getHours()
  const minutes = dateObj.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12
  return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`
}

const formatCurrency = (val) => {
  if (val === undefined || val === null || val === '') return '₹0'
  if (typeof val === 'string' && (val.includes('₹') || val.includes('$'))) return val
  const num = Number(val)
  if (isNaN(num)) return `₹${val}`
  return `₹${num.toLocaleString('en-IN')}`
}

/* ─────────────────────────────────────────
   View Details Page Component
───────────────────────────────────────── */
function ViewPaymentDetail({ payment, onBack }) {
  return (
    <div className="view-payment-detail-container">
      {/* Detail Header */}
      <div className="view-payment-header">
        <button className="back-circle-btn" onClick={onBack} aria-label="Back to payments list">
          <ChevronLeft style={{ width: '18px', height: '18px' }} />
        </button>
        <h2>View Payment</h2>
      </div>

      <div className="payment-detail-main-layout">
        {/* Customer Top Card */}
        <div className="payment-customer-banner-card">
          <div className="customer-avatar-meta-left">
            <img src={payment.avatar} alt={payment.customerName} className="customer-detail-avatar-img" />
            <div className="customer-avatar-info">
              <h3>{payment.customerName}</h3>
              <p>Mobile Number : {payment.customerPhone}</p>
              <p>Email ID : {payment.customerEmail}</p>
            </div>
          </div>
          <span className={`payment-status-badge ${payment.status.toLowerCase()}`}>
            {payment.status}
          </span>
        </div>

        {/* Transaction Information Card */}
        <div className="payment-info-card">
          <h3>Transaction Information</h3>
          <div className="payment-details-table">
            <div className="payment-detail-row">
              <span className="info-label">Payment ID :</span>
              <span className="info-value">{payment.paymentId}</span>
            </div>
            <div className="payment-detail-row">
              <span className="info-label">Amount Paid :</span>
              <span className="info-value">{payment.amount}</span>
            </div>
            <div className="payment-detail-row">
              <span className="info-label">Payment Date :</span>
              <span className="info-value">{payment.date} {payment.time}</span>
            </div>
            <div className="payment-detail-row">
              <span className="info-label">Payment Method :</span>
              <span className="info-value">{payment.method}</span>
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="payment-info-card">
          <h3>Order Details</h3>
          <div className="payment-details-table">
            <div className="payment-detail-row">
              <span className="info-label">Order ID :</span>
              <span className="info-value">{payment.orderId}</span>
            </div>
            <div className="payment-detail-row">
              <span className="info-label">Product :</span>
              <span className="info-value">{payment.productName}</span>
            </div>
            <div className="payment-detail-row">
              <span className="info-label">Size :</span>
              <span className="info-value">{payment.productSize}</span>
            </div>
            <div className="payment-detail-row">
              <span className="info-label">Color :</span>
              <span className="info-value">{payment.productColor}</span>
            </div>
            <div className="payment-detail-row">
              <span className="info-label">Qty :</span>
              <span className="info-value">{payment.qty}</span>
            </div>
            <div className="payment-detail-row">
              <span className="info-label">Price :</span>
              <span className="info-value">{payment.productPrice}</span>
            </div>
            <div className="payment-detail-row highlight">
              <span className="info-label">Total Amount :</span>
              <span className="info-value">{payment.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
function PaymentMonitoring() {
  const [paymentsList, setPaymentsList] = useState(INITIAL_PAYMENTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Sliced Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Selected payment for detail view
  const [viewedPayment, setViewedPayment] = useState(null)

  // API states
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)
  const [paymentStats, setPaymentStats] = useState(null)

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type })
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev))
    }, 4000)
  }

  // Fetch payments, stats, and failed payments from API
  const fetchPayments = useCallback(async (showToastNotice = false) => {
    setLoading(true)
    setFetchError(null)
    try {
      const [paymentsRes, statsRes, failedRes] = await Promise.allSettled([
        getAllPayments(),
        getPaymentStats(),
        getFailedPayments(),
      ])

      let response = null
      let allMappedPayments = []

      if (paymentsRes.status === 'fulfilled') {
        response = paymentsRes.value
        const dataObj = response?.message || response?.data || response
        
        let rawPayments = []
        if (dataObj && typeof dataObj === 'object') {
          if (Array.isArray(dataObj.payments)) {
            rawPayments = dataObj.payments
          } else if (Array.isArray(response?.payments)) {
            rawPayments = response.payments
          } else if (Array.isArray(dataObj)) {
            rawPayments = dataObj
          }
        }

        if (rawPayments && rawPayments.length > 0) {
          allMappedPayments = rawPayments.map((item, index) => {
            const rawStatus = (item.status || 'Success').toString()
            const capitalizedStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase()
            const createdDate = item.createdAt || item.paymentDate || item.date || item.updatedAt
            
            return {
              id: item._id || item.id || `pay-${index + 1}`,
              _id: item._id,
              srNo: index + 1,
              paymentId: item.paymentId || item.transactionId || item.transactionNo || item._id || `Pay_${100 + index + 1}`,
              orderId: item.orderId || item.order?.orderId || (item.order ? `Order#${item.order}` : `Order#2845687${index + 1}`),
              customerName: item.customerName || item.customer?.fullName || item.customer?.name || item.user?.fullName || item.user?.name || item.userName || 'Customer',
              customerPhone: item.customerPhone || item.customer?.mobile || item.customer?.phone || item.user?.mobile || item.user?.phone || '9875663201',
              customerEmail: item.customerEmail || item.customer?.email || item.user?.email || 'customer@example.com',
              method: item.method || item.paymentMethod || item.paymentMode || 'Online',
              date: item.date ? item.date : formatDate(createdDate),
              time: item.time ? item.time : formatTime(createdDate),
              status: capitalizedStatus,
              amount: formatCurrency(item.amount || item.totalAmount || 0),
              productName: item.productName || item.product?.name || item.order?.items?.[0]?.name || 'Sony Camera',
              productSize: item.productSize || item.size || 'Free Size',
              productColor: item.productColor || item.color || 'Black',
              qty: item.qty || item.quantity || 1,
              productPrice: formatCurrency(item.productPrice || item.price || item.amount || 0),
              totalAmount: formatCurrency(item.totalAmount || item.amount || 0),
              avatar: item.avatar || item.customer?.avatar || item.user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
              raw: item,
            }
          })
        }
      }

      // If failed payments endpoint returned additional records, merge without duplicates
      if (failedRes.status === 'fulfilled') {
        const failedDataObj = failedRes.value?.message || failedRes.value?.data || failedRes.value
        const rawFailedList = Array.isArray(failedDataObj?.payments)
          ? failedDataObj.payments
          : (Array.isArray(failedRes.value?.payments) ? failedRes.value.payments : (Array.isArray(failedDataObj) ? failedDataObj : []))

        if (rawFailedList.length > 0) {
          const existingIds = new Set(allMappedPayments.map((p) => p._id || p.id || p.paymentId))
          const mappedFailed = rawFailedList
            .filter((item) => !existingIds.has(item._id || item.id || item.paymentId))
            .map((item, index) => {
              const createdDate = item.createdAt || item.paymentDate || item.date || item.updatedAt
              return {
                id: item._id || item.id || `pay-failed-${index + 1}`,
                _id: item._id,
                srNo: allMappedPayments.length + index + 1,
                paymentId: item.paymentId || item.transactionId || item.transactionNo || item._id || `Pay_F${100 + index + 1}`,
                orderId: item.orderId || item.order?.orderId || (item.order ? `Order#${item.order}` : `Order#2845687${index + 1}`),
                customerName: item.customerName || item.customer?.fullName || item.customer?.name || item.user?.fullName || item.user?.name || item.userName || 'Customer',
                customerPhone: item.customerPhone || item.customer?.mobile || item.customer?.phone || item.user?.mobile || item.user?.phone || '9875663201',
                customerEmail: item.customerEmail || item.customer?.email || item.user?.email || 'customer@example.com',
                method: item.method || item.paymentMethod || item.paymentMode || 'Online',
                date: item.date ? item.date : formatDate(createdDate),
                time: item.time ? item.time : formatTime(createdDate),
                status: 'Failed',
                amount: formatCurrency(item.amount || item.totalAmount || 0),
                productName: item.productName || item.product?.name || item.order?.items?.[0]?.name || 'Sony Camera',
                productSize: item.productSize || item.size || 'Free Size',
                productColor: item.productColor || item.color || 'Black',
                qty: item.qty || item.quantity || 1,
                productPrice: formatCurrency(item.productPrice || item.price || item.amount || 0),
                totalAmount: formatCurrency(item.totalAmount || item.amount || 0),
                avatar: item.avatar || item.customer?.avatar || item.user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
                raw: item,
              }
            })
          allMappedPayments = [...allMappedPayments, ...mappedFailed]
        }
      }

      if (allMappedPayments.length > 0) {
        setPaymentsList(allMappedPayments)
      } else if (paymentsRes.status === 'fulfilled' && Array.isArray(paymentsRes.value?.message?.payments)) {
        setPaymentsList([])
      }

      if (statsRes.status === 'fulfilled') {
        const statsData = statsRes.value?.message || statsRes.value?.data || statsRes.value
        if (statsData && typeof statsData === 'object') {
          setPaymentStats(statsData)
        }
      }

      if (showToastNotice) {
        const successMsg = typeof response?.data === 'string'
          ? response.data
          : (typeof statsRes.value?.data === 'string' ? statsRes.value.data : 'Payments data fetched successfully')
        showToast(successMsg, 'success')
      }
    } catch (err) {
      console.error('Error fetching payments:', err)
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch payments'
      setFetchError(errorMsg)
      if (showToastNotice) {
        showToast(errorMsg, 'error')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPayments(false)
  }, [fetchPayments])

  // Calculations for stats
  const totalPaymentsCount = paymentStats?.totalPayments !== undefined
    ? paymentStats.totalPayments
    : paymentsList.length

  const totalRevenueAmount = paymentStats?.totalAmount !== undefined
    ? formatCurrency(paymentStats.totalAmount)
    : null

  const totalPaidCount = paymentStats?.paid?.count !== undefined
    ? paymentStats.paid.count
    : paymentsList.filter((p) => p.status === 'Success' || p.status === 'Paid').length

  const totalPaidAmount = paymentStats?.paid?.amount !== undefined
    ? formatCurrency(paymentStats.paid.amount)
    : null

  const totalPendingCount = paymentStats?.pending?.count !== undefined
    ? paymentStats.pending.count
    : paymentsList.filter((p) => p.status === 'Pending').length

  const totalPendingAmount = paymentStats?.pending?.amount !== undefined
    ? formatCurrency(paymentStats.pending.amount)
    : null

  const totalFailedCount = paymentStats?.failed?.count !== undefined
    ? paymentStats.failed.count
    : paymentsList.filter((p) => p.status === 'Refund' || p.status === 'Failed').length

  const totalFailedAmount = paymentStats?.failed?.amount !== undefined
    ? formatCurrency(paymentStats.failed.amount)
    : null

  // Filter logic
  const filteredPayments = paymentsList.filter((p) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q ||
      p.paymentId.toLowerCase().includes(q) ||
      p.customerName.toLowerCase().includes(q) ||
      p.orderId.toLowerCase().includes(q)
    
    let matchesStatus = true
    if (statusFilter) {
      const pStatus = (p.status || '').toLowerCase()
      const fStatus = statusFilter.toLowerCase()
      if (fStatus === 'success' || fStatus === 'paid') {
        matchesStatus = pStatus === 'success' || pStatus === 'paid'
      } else if (fStatus === 'failed' || fStatus === 'refund') {
        matchesStatus = pStatus === 'failed' || pStatus === 'refund'
      } else {
        matchesStatus = pStatus === fStatus
      }
    }
    return matchesSearch && matchesStatus
  })

  // Pagination index slicing
  const totalItems = filteredPayments.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage)

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
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
            alignItems: 'center',
          }}
          aria-label="Close notification"
        >
          <X style={{ width: '14px', height: '14px' }} />
        </button>
      </div>
    )
  }

  if (viewedPayment) {
    return <ViewPaymentDetail payment={viewedPayment} onBack={() => setViewedPayment(null)} />
  }

  return (
    <div className="payment-monitoring-view">
      {renderToast()}

      {/* Title */}
      <div className="payment-title-header">
        <h1>Payment Monitoring</h1>
        <p>Manage and Monitor all the payments</p>
      </div>

      {/* Stats row */}
      <div className="payment-stats-grid">
        <div 
          className={`payment-stat-card card-yellow clickable ${statusFilter === '' ? 'active-filter' : ''}`}
          onClick={() => { setStatusFilter(''); setCurrentPage(1); }}
          style={{ cursor: 'pointer', color: '#3b82f6' }}
        >
          <div className="payment-stat-icon icon-yellow">
            <DollarSign />
          </div>
          <div className="payment-stat-value">{totalPaymentsCount}</div>
          <div className="payment-stat-label">
            Total Payments
            {totalRevenueAmount && <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>{totalRevenueAmount}</span>}
          </div>
        </div>

        <div 
          className={`payment-stat-card card-green clickable ${statusFilter === 'Success' ? 'active-filter' : ''}`}
          onClick={() => { setStatusFilter('Success'); setCurrentPage(1); }}
          style={{ cursor: 'pointer', color: '#2ecc71' }}
        >
          <div className="payment-stat-icon icon-green">
            <CheckCircle2 />
          </div>
          <div className="payment-stat-value">{totalPaidCount}</div>
          <div className="payment-stat-label">
            Paid Payments
            {totalPaidAmount && <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>{totalPaidAmount}</span>}
          </div>
        </div>

        <div 
          className={`payment-stat-card card-yellow clickable ${statusFilter === 'Pending' ? 'active-filter' : ''}`}
          onClick={() => { setStatusFilter('Pending'); setCurrentPage(1); }}
          style={{ cursor: 'pointer', color: '#f59e0b' }}
        >
          <div className="payment-stat-icon icon-yellow" style={{ backgroundColor: 'transparent' }}>
            <Clock />
          </div>
          <div className="payment-stat-value">{totalPendingCount}</div>
          <div className="payment-stat-label">
            Pending Payments
            {totalPendingAmount && <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>{totalPendingAmount}</span>}
          </div>
        </div>

        <div 
          className={`payment-stat-card card-pink clickable ${statusFilter === 'Refund' || statusFilter === 'Failed' ? 'active-filter' : ''}`}
          onClick={() => { setStatusFilter('Refund'); setCurrentPage(1); }}
          style={{ cursor: 'pointer', color: '#f43f5e' }}
        >
          <div className="payment-stat-icon icon-pink">
            <AlertTriangle />
          </div>
          <div className="payment-stat-value">{totalFailedCount}</div>
          <div className="payment-stat-label">
            Failed / Refund
            {totalFailedAmount && <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>{totalFailedAmount}</span>}
          </div>
        </div>
      </div>

      {/* Main card panels */}
      <div className="dashboard-card-panel payment-main-card">
        {/* Table Filters Row */}
        <div className="table-filter-bar payment-filters-bar">
          <div className="table-search-wrapper" style={{ width: '280px' }}>
            <Search />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>

          <div className="filter-actions-right">
            <div className="orders-select-wrapper">
              <select
                className="status-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="">All Status</option>
                <option value="Success">Success / Paid</option>
                <option value="Pending">Pending</option>
                <option value="Refund">Refund</option>
                <option value="Failed">Failed</option>
              </select>
              <ChevronDown className="select-chevron" />
            </div>

            <button
              className="export-btn"
              onClick={() => fetchPayments(true)}
              disabled={loading}
              title="Refresh payments list"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RotateCw className={loading ? 'btn-spinner' : ''} size={15} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Table layout list */}
        <div className="admins-table-wrapper">
          <table className="admins-table payment-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Sr.No.</th>
                <th>Payment ID</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Method</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ width: '100px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#607d8b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <Loader2 className="btn-spinner" size={20} color="#2e7d32" />
                      <span style={{ fontWeight: 500 }}>Loading payments...</span>
                    </div>
                  </td>
                </tr>
              ) : fetchError ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#f43f5e' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertCircle size={18} />
                        <span>{fetchError}</span>
                      </div>
                      <button
                        onClick={() => fetchPayments(true)}
                        style={{
                          padding: '6px 14px',
                          backgroundColor: '#2e7d32',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 500,
                          marginTop: '4px',
                        }}
                      >
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : paginatedPayments.length > 0 ? (
                paginatedPayments.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: '500' }}>{p.srNo}</td>
                    <td style={{ fontWeight: '500' }}>{p.paymentId}</td>
                    <td style={{ fontWeight: '500', color: '#607d8b' }}>{p.orderId}</td>
                    <td style={{ fontWeight: '600' }}>{p.customerName}</td>
                    <td style={{ fontWeight: '500' }}>{p.method}</td>
                    <td>{p.date}</td>
                    <td>
                      <span className={`payment-status-badge ${p.status ? p.status.toLowerCase() : 'success'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <div className="payment-actions-row">
                        <button
                          className="payment-action-btn view"
                          onClick={() => setViewedPayment(p)}
                          aria-label="View Payment Details"
                        >
                          <Eye style={{ width: '16px', height: '16px', color: '#2196f3' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: '#90a4ae' }}>
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Entries and Pagination */}
        <div className="offers-table-footer">
          <span className="footer-entries-text">
            Showing {totalItems > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} Entries
          </span>
          <div className="offers-pagination">
            <button
              className="pag-btn prev"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              aria-label="Previous page"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={`pag-btn ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}
            <button
              className="pag-btn next"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
              aria-label="Next page"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentMonitoring
