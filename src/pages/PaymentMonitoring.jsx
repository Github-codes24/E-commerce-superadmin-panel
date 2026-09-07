import React, { useState } from 'react'
import {
  Search,
  ChevronDown,
  Eye,
  ChevronLeft,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import './PaymentMonitoring.css'

/* ─────────────────────────────────────────
   Mock Data
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
    method: 'Apple Pay',
    date: '12 May 2026',
    time: '05:00 PM',
    status: 'Success',
    amount: '₹9500',
    productName: 'Nike Air Zoom',
    productSize: 'UK 10',
    productColor: 'Grey',
    qty: 1,
    productPrice: '₹ 9,400',
    totalAmount: '₹ 9,500',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 6,
    srNo: 6,
    paymentId: 'Pay_106',
    orderId: 'Order#28456876',
    customerName: 'Alice Smith',
    customerPhone: '9123456789',
    customerEmail: 'alice@gmail.com',
    method: 'UPI',
    date: '13 May 2026',
    time: '10:00 AM',
    status: 'Success',
    amount: '₹4200',
    productName: 'Wireless Earbuds',
    productSize: 'Regular',
    productColor: 'White',
    qty: 1,
    productPrice: '₹ 4,100',
    totalAmount: '₹ 4,200',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 7,
    srNo: 7,
    paymentId: 'Pay_107',
    orderId: 'Order#28456876',
    customerName: 'Bob Jones',
    customerPhone: '9988776655',
    customerEmail: 'bob@gmail.com',
    method: 'Credit Card',
    date: '13 May 2026',
    time: '11:30 AM',
    status: 'Refund',
    amount: '₹600',
    productName: 'Designer Mug',
    productSize: 'Regular',
    productColor: 'Yellow',
    qty: 1,
    productPrice: '₹ 550',
    totalAmount: '₹ 600',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150',
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

  // Calculations for stats
  const totalPayments = paymentsList.length
  const totalSuccess = paymentsList.filter((p) => p.status === 'Success').length
  const totalRefund = paymentsList.filter((p) => p.status === 'Refund').length

  // Filter logic
  const filteredPayments = paymentsList.filter((p) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q ||
      p.paymentId.toLowerCase().includes(q) ||
      p.customerName.toLowerCase().includes(q) ||
      p.orderId.toLowerCase().includes(q)
    const matchesStatus = !statusFilter || p.status === statusFilter
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

  if (viewedPayment) {
    return <ViewPaymentDetail payment={viewedPayment} onBack={() => setViewedPayment(null)} />
  }

  return (
    <div className="payment-monitoring-view">
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
          <div className="payment-stat-value">{totalPayments}</div>
          <div className="payment-stat-label">Total Payments</div>
        </div>

        <div 
          className={`payment-stat-card card-green clickable ${statusFilter === 'Success' ? 'active-filter' : ''}`}
          onClick={() => { setStatusFilter('Success'); setCurrentPage(1); }}
          style={{ cursor: 'pointer', color: '#2ecc71' }}
        >
          <div className="payment-stat-icon icon-green">
            <CheckCircle2 />
          </div>
          <div className="payment-stat-value">{totalSuccess}</div>
          <div className="payment-stat-label">Total Success Payments</div>
        </div>

        <div 
          className={`payment-stat-card card-pink clickable ${statusFilter === 'Refund' ? 'active-filter' : ''}`}
          onClick={() => { setStatusFilter('Refund'); setCurrentPage(1); }}
          style={{ cursor: 'pointer', color: '#f43f5e' }}
        >
          <div className="payment-stat-icon icon-pink">
            <AlertTriangle />
          </div>
          <div className="payment-stat-value">{totalRefund}</div>
          <div className="payment-stat-label">Total Refunded Payments</div>
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
                <option value="">Select</option>
                <option value="Success">Success</option>
                <option value="Refund">Refund</option>
              </select>
              <ChevronDown className="select-chevron" />
            </div>
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
              {paginatedPayments.length > 0 ? (
                paginatedPayments.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: '500' }}>{p.srNo}</td>
                    <td style={{ fontWeight: '500' }}>{p.paymentId}</td>
                    <td style={{ fontWeight: '500', color: '#607d8b' }}>{p.orderId}</td>
                    <td style={{ fontWeight: '600' }}>{p.customerName}</td>
                    <td style={{ fontWeight: '500' }}>{p.method}</td>
                    <td>{p.date}</td>
                    <td>
                      <span className={`payment-status-badge ${p.status.toLowerCase()}`}>
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
