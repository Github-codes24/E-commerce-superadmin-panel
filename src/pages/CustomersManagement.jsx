import React, { useState, useRef, useEffect } from 'react'
import { Users, UserCheck, ShieldAlert, Eye, Trash2, Search, ArrowLeft, Calendar, DollarSign, Box, Gift, ChevronLeft, ChevronRight, X, ArrowDown } from 'lucide-react'
import './CustomersManagement.css'


function CustomersManagement() {
  // Initial Customers List Data
  const [customersList, setCustomersList] = useState([
    { id: 1, name: 'Sameer Sharma', phone: '9876543210', email: 'sameer@gmail.com', joinedOn: '12 Jan 2025', status: 'active', checked: false, orders: 100, spent: '₹45,780', returns: 34 },
    { id: 2, name: 'Jerome Bell', phone: '9876543210', email: 'jeromebell@gmail.com', joinedOn: '3 Mar 2025', status: 'active', checked: false, orders: 15, spent: '₹6,400', returns: 1 },
    { id: 3, name: 'Annette Black', phone: '9876543210', email: 'annette@gmail.com', joinedOn: '5 Feb 2025', status: 'active', checked: false, orders: 28, spent: '₹12,850', returns: 4 },
    { id: 4, name: 'Esther Howard', phone: '9876543210', email: 'esther@gmail.com', joinedOn: '2 Jan 2026', status: 'blocked', checked: false, orders: 100, spent: '₹45,780', returns: 34 },
    { id: 5, name: 'Jenny Wilson', phone: '9876543210', email: 'jenntwilson@gmail.com', joinedOn: '13 May 2026', status: 'active', checked: false, orders: 54, spent: '₹22,900', returns: 8 },
    { id: 6, name: 'Eleanor Pena', phone: '9876543210', email: 'eleanor.pena@gmail.com', joinedOn: '10 Jun 2025', status: 'blocked', checked: false, orders: 4, spent: '₹1,500', returns: 0 },
  ])

  // Navigation and overlay states
  const [viewedCustomer, setViewedCustomer] = useState(null) // customer in details profile view
  const [deletingCustomerId, setDeletingCustomerId] = useState(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter])

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

  // Toggle Ban / Unban status inline
  const handleToggleBan = (id) => {
    setCustomersList(customersList.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'active' ? 'blocked' : 'active'
        // Sync viewed profile details if opened
        if (viewedCustomer && viewedCustomer.id === id) {
          setViewedCustomer(prev => ({ ...prev, status: nextStatus }))
        }
        return { ...c, status: nextStatus }
      }
      return c
    }))
  }

  // Confirm delete customer
  const handleDeleteConfirm = () => {
    setCustomersList(customersList.filter(c => c.id !== deletingCustomerId))
    if (viewedCustomer && viewedCustomer.id === deletingCustomerId) {
      setViewedCustomer(null)
    }
    setDeletingCustomerId(null)
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
        {/* Header section with back chevron button */}
        <div className="form-workspace-header">
          <button 
            className="back-circle-btn" 
            aria-label="Back to Customer list"
            onClick={() => setViewedCustomer(null)}
          >
            <ArrowLeft style={{ width: '18px', height: '18px' }} />
          </button>
          <h2>Customer Profile</h2>
        </div>

        {/* Top Header Card */}
        <div className={`admin-profile-card ${isProfileActive ? 'customer-profile-card-green' : 'customer-profile-card-red'}`}>
          <div className="admin-profile-row" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
            <div className="admin-profile-left">
              <img 
                src={viewedCustomer.id === 4 ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256' : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256&h=256'} 
                alt={viewedCustomer.name} 
                className="admin-profile-avatar"
                style={{ width: '80px', height: '80px', border: '1.5px solid #000000', borderRadius: '50%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
              />
              <div className="admin-profile-info" style={{ gap: '6px', marginLeft: '12px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', textTransform: 'none', color: '#000000', fontFamily: 'var(--admin-font)' }}>{viewedCustomer.name.toLowerCase() === 'sameer sharma' ? 'Sameer sharma' : viewedCustomer.name}</h3>
                <span style={{ fontSize: '14px', color: '#333333', fontWeight: '500', fontFamily: 'var(--admin-font)' }}>{viewedCustomer.email}</span>
                <span style={{ fontSize: '14px', color: '#333333', fontWeight: '500', fontFamily: 'var(--admin-font)' }}>{viewedCustomer.phone}</span>
              </div>
            </div>
            
            <span 
              className={`vendor-badge ${isProfileActive ? 'active' : 'inactive'}`} 
              style={{ 
                padding: '8px 24px', 
                fontSize: '13px', 
                fontWeight: '600',
                borderRadius: '8px',
                backgroundColor: isProfileActive ? '#388e3c' : '#d32f2f',
                color: '#ffffff',
                textTransform: 'capitalize'
              }}
            >
              {viewedCustomer.status}
            </span>
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

        {/* Order History Panel */}
        <div className="dashboard-card-panel">
          <div className="panel-header-row" style={{ borderBottom: '1px solid #f1f3f4', paddingBottom: '12px', marginBottom: '16px' }}>
            <h2 className="panel-title" style={{ fontSize: '16px' }}>Order History</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {customerOrders.map((ord) => (
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
    { id: 'total', filterVal: 'all', label: 'Total Customers', value: totalCount + 994, icon: Users, background: '#ffecb3', color: '#3b82f6' }, // adjusted to match 1000 total customers
    { id: 'active', filterVal: 'active', label: 'Active Customers', value: activeCount + 896, icon: UserCheck, background: '#c8e6c9', color: '#2ecc71' }, // adjusted to match 900 active customers
    { id: 'blocked', filterVal: 'blocked', label: 'Blocked Customers', value: blockedCount + 98, icon: ShieldAlert, background: '#ffcdd2', color: '#f43f5e' } // adjusted to match 100 blocked customers
  ]

  return (
    <div className="customers-management-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Customer</h1>
        <p style={{ color: '#607d8b', fontSize: '13px' }}>
          Manage all customers and their activities on the platform.
        </p>
      </div>

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
              {paginatedCustomers.length > 0 ? (
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
                      onClick={() => setViewedCustomer(customer)}
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
                        {/* Ban / Unban Toggle Button */}
                        <button 
                          className={`btn-action-icon ${customer.status === 'active' ? 'ban-active' : 'ban-blocked'}`}
                          title={customer.status === 'active' ? 'Block Customer' : 'Activate Customer'}
                          onClick={() => handleToggleBan(customer.id)}
                        >
                          <ShieldAlert style={{ width: '16px', height: '16px' }} />
                        </button>
                        
                        {/* View Details Profile Link */}
                        <button 
                          className="btn-action-icon view-details"
                          title="View Details"
                          onClick={() => setViewedCustomer(customer)}
                        >
                          <Eye style={{ width: '16px', height: '16px' }} />
                        </button>

                        {/* Delete record trigger */}
                        <button 
                          className="btn-action-icon delete-record"
                          title="Delete Customer"
                          onClick={() => setDeletingCustomerId(customer.id)}
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

      {/* Delete Confirmation Modal Overlay */}
      {deletingCustomerId && (
        <div className="modal-overlay" onClick={() => setDeletingCustomerId(null)}>
          <div className="delete-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-title">Delete</div>
            <div className="delete-modal-subtitle">Are You Sure Want To Delete?</div>
            <div className="delete-modal-buttons">
              <button 
                type="button" 
                className="btn-delete-cancel"
                onClick={() => setDeletingCustomerId(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-delete-confirm"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomersManagement
