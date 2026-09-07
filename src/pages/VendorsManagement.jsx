import React, { useState, useRef, useEffect } from 'react'
import { Users, UserCheck, UserMinus, Search, MoreVertical, Plus, ArrowLeft, Upload, Calendar, X, Edit2, Trash2, DollarSign, Box, ShoppingCart, Mail, Phone, Package, Store } from 'lucide-react'
import './VendorsManagement.css'


function VendorsManagement() {
  // Initial Vendors List Data
  const [vendorsList, setVendorsList] = useState([
    { id: 1, name: 'Sameer sharma', shopName: 'Sameer Shop', category: 'Fashion', products: 540, orders: 540, joinedOn: '22 May 2026', approval: 'approved', status: 'active', checked: false, email: 'sameer@gmail.com', phone: '+91 9876543258', dob: '11/09/2003', gender: 'Male', bizType: 'Individual seller', gst: '22AAAAA0000A1Z5', address: '456, Business Bay, T. Nagar, Pune', revenue: '₹96,780' },
    { id: 2, name: 'Trendy Fashion', shopName: 'Trendy Store', category: 'Clothes', products: 42, orders: 98, joinedOn: '18 May 2026', approval: 'pending', status: 'active', checked: false, email: 'trendy@shop.com', phone: '+91 9876543202', dob: '20/04/1992', gender: 'Female', bizType: 'Wholesale', gst: '22BBBBB0000B1Z2', address: 'Fashion Hub, Room 102', revenue: '₹4,20,000' },
    { id: 3, name: 'Beauty Palace', shopName: 'Beauty Salon', category: 'Cosmetics', products: 18, orders: 24, joinedOn: '28 Apr 2026', approval: 'rejected', status: 'inactive', checked: false, email: 'beauty@shop.com', phone: '+91 9876543203', dob: '05/11/1990', gender: 'Female', bizType: 'Retail', gst: '22CCCCC0000C1Z3', address: 'Cosmo Boulevard 15', revenue: '₹1,20,000' },
    { id: 4, name: 'Sport Plus', shopName: 'Sport Store', category: 'Equipments', products: 8, orders: 15, joinedOn: '12 Apr 2026', approval: 'approved', status: 'active', checked: false, email: 'sports@shop.com', phone: '+91 9876543204', dob: '18/02/1988', gender: 'Male', bizType: 'Retail', gst: '22DDDDD0000D1Z4', address: 'Arena Complex Gate 2', revenue: '₹8,20,000' },
    { id: 5, name: 'Wooden Bliss', shopName: 'Wooden Store', category: 'Furniture', products: 24, orders: 60, joinedOn: '02 Mar 2026', approval: 'approved', status: 'active', checked: false, email: 'wooden@shop.com', phone: '+91 9876543205', dob: '30/09/1985', gender: 'Male', bizType: 'Manufacturer', gst: '22EEEEE0000E1Z5', address: 'Industrial Zone Alley 5', revenue: '₹10,70,000' },
    { id: 6, name: 'Home Needs', shopName: 'Home Shop', category: 'Groceries', products: 5, orders: 8, joinedOn: '10 Jan 2026', approval: 'pending', status: 'inactive', checked: false, email: 'home@shop.com', phone: '+91 9876543206', dob: '25/06/1994', gender: 'Female', bizType: 'Retail', gst: '22FFFFF0000F1Z6', address: 'Residential Sector B', revenue: '₹8,000' },
  ])

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
  const [editingVendor, setEditingVendor] = useState(null) // stores vendor being edited
  const [viewedVendor, setViewedVendor] = useState(null) // stores vendor in detailed profile view
  const [deletingVendorId, setDeletingVendorId] = useState(null)
  const [activeActionMenuId, setActiveActionMenuId] = useState(null)

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [approvalFilter, setApprovalFilter] = useState('all')
  const [accountFilter, setAccountFilter] = useState('all')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

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

  // Derive counts
  const totalCount = vendorsList.length
  const activeCount = vendorsList.filter((v) => v.status === 'active').length
  const inactiveCount = vendorsList.filter((v) => v.status === 'inactive').length

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

  // Handle Form Submit (Add or Edit)
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.shopName.trim()) return

    const updatedStatus = formData.isActive ? 'active' : 'inactive'

    if (editingVendor) {
      // Edit Vendor Mode
      setVendorsList(vendorsList.map((v) => {
        if (v.id === editingVendor.id) {
          return {
            ...v,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            dob: formData.dob,
            gender: formData.gender,
            shopName: formData.shopName,
            bizType: formData.bizType,
            gst: formData.gst,
            address: formData.address,
            status: updatedStatus
          }
        }
        return v
      }))

      // Sync viewed vendor details on the spot
      if (viewedVendor && viewedVendor.id === editingVendor.id) {
        setViewedVendor(prev => ({
          ...prev,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          dob: formData.dob,
          gender: formData.gender,
          shopName: formData.shopName,
          bizType: formData.bizType,
          gst: formData.gst,
          address: formData.address,
          status: updatedStatus
        }))
      }
    } else {
      // Add Vendor Mode
      const newVendor = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        shopName: formData.shopName,
        bizType: formData.bizType,
        gst: formData.gst,
        address: formData.address,
        category: 'Electronics',
        products: 0,
        orders: 0,
        joinedOn: new Date().toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        approval: 'pending',
        status: updatedStatus,
        checked: false,
        revenue: '₹0'
      }
      setVendorsList([newVendor, ...vendorsList])
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
      address: '',
      isActive: true,
      imagePreview: ''
    })
    setEditingVendor(null)
    setIsAdding(false)
  }

  // Open Edit Mode
  const handleOpenEdit = (vendor) => {
    setEditingVendor(vendor)
    setFormData({
      name: vendor.name,
      email: vendor.email || '',
      phone: vendor.phone || '',
      dob: vendor.dob || '',
      gender: vendor.gender || '',
      shopName: vendor.shopName,
      bizType: vendor.bizType || '',
      gst: vendor.gst || '',
      address: vendor.address || '',
      isActive: vendor.status === 'active',
      imagePreview: ''
    })
    setIsAdding(true)
  }

  // Confirm Delete
  const handleDeleteConfirm = () => {
    setVendorsList(vendorsList.filter((v) => v.id !== deletingVendorId))
    
    // Reset view state if current is deleted
    if (viewedVendor && viewedVendor.id === deletingVendorId) {
      setViewedVendor(null)
    }
    
    setDeletingVendorId(null)
  }

  // Filter vendors list
  const filteredVendors = vendorsList.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.shopName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesApproval =
      approvalFilter === 'all' ? true : vendor.approval === approvalFilter
    const matchesAccount =
      accountFilter === 'all' ? true : vendor.status === accountFilter
    return matchesSearch && matchesApproval && matchesAccount
  })

  // Pagination index slicing
  const totalItems = filteredVendors.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedVendors = filteredVendors.slice(startIndex, startIndex + itemsPerPage)

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
            }}
          >
            <ArrowLeft style={{ width: '18px', height: '18px' }} />
          </button>
          <h2>{editingVendor ? 'Edit Vendor' : 'Add Vendor'}</h2>
        </div>

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
              {/* Shop Name */}
              <div className="form-field-item">
                <label htmlFor="vendor-shopname">Shop Name</label>
                <input 
                  id="vendor-shopname"
                  type="text" 
                  placeholder="Enter Shop Name"
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

              {/* Business Address */}
              <div className="form-field-item">
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
                  onClick={() => alert('Additional address logic sandbox mode.')}
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
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-add-green"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    )
  }

  // 2. Render Viewed Vendor Profile View Details
  if (viewedVendor) {
    const miniStats = [
      { id: 'revenue', label: 'Total Revenue', value: viewedVendor.revenue || '₹96,780', icon: DollarSign, background: '#b3e5fc', color: '#1565c0' },
      { id: 'products', label: 'Total Products', value: viewedVendor.products || '540', icon: Box, background: '#ffe082', color: '#ef6c00' },
      { id: 'orders', label: 'Total Orders', value: viewedVendor.orders || '540', icon: Package, background: '#f8bbd0', color: '#c2185b' }
    ]

    return (
      <div className="vendor-profile-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header section with back chevron button */}
        <div className="form-workspace-header">
          <button 
            className="back-circle-btn" 
            aria-label="Back to Vendors list"
            onClick={() => setViewedVendor(null)}
          >
            <ArrowLeft style={{ width: '18px', height: '18px' }} />
          </button>
          <h2>View Vendor</h2>
        </div>

        {/* Top Details Card */}
        <div className="admin-profile-card">
          <div className="admin-profile-row" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
            <div className="admin-profile-left">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256" 
                alt={viewedVendor.name} 
                className="admin-profile-avatar"
                style={{ width: '64px', height: '64px' }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
              />
              <div className="admin-profile-info" style={{ gap: '6px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', textTransform: 'capitalize' }}>{viewedVendor.name}</h3>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', fontWeight: '700' }}>
                <span>Account Status</span>
                <span className={`vendor-badge ${viewedVendor.status}`} style={{ textTransform: 'capitalize' }}>
                  {viewedVendor.status}
                </span>
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
                    alt="Sameer Raina" 
                    className="audit-avatar" 
                  />
                  <div className="audit-user-details">
                    <span className="audit-user-name">Sameer Raina</span>
                    <span className="audit-user-role">Admin</span>
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
                    alt="Sameer Raina" 
                    className="audit-avatar" 
                  />
                  <div className="audit-user-details">
                    <span className="audit-user-name">Sameer Raina</span>
                    <span className="audit-user-role">Admin</span>
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
    { id: 'total', filterVal: 'all', label: 'Total Vendors', value: totalCount + 204, icon: Store, background: '#ffecb3', color: '#3b82f6' },
    { id: 'active', filterVal: 'active', label: 'Active Vendors', value: activeCount + 192, icon: UserCheck, background: '#c8e6c9', color: '#2ecc71' },
    { id: 'inactive', filterVal: 'inactive', label: 'Inactive Vendors', value: inactiveCount + 11, icon: UserMinus, background: '#ffcdd2', color: '#f43f5e' }
  ]

  return (
    <div className="vendors-management-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title Header with Add button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Vendors</h1>
          <p style={{ color: '#607d8b', fontSize: '13px' }}>
            Manage all vendors and their stores on the platform.
          </p>
        </div>
        <button 
          className="edit-profile-btn" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
          onClick={() => {
            setEditingVendor(null)
            setFormData({
              name: '', email: '', phone: '', dob: '', gender: '',
              shopName: '', bizType: '', gst: '', address: '', isActive: true, imagePreview: ''
            })
            setIsAdding(true)
          }}
        >
          <Plus style={{ width: '16px', height: '16px' }} />
          Add New Vendor
        </button>
      </div>

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
              <option value="all">Approval Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>

            <select 
              className="status-select"
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
            >
              <option value="all">Account Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="admins-table-wrapper">
          <table className="admins-table">
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    className="admins-table-checkbox"
                    checked={vendorsList.length > 0 && vendorsList.every(v => v.checked)}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Vendor Name</th>
                <th>Shop Name</th>
                <th>Category</th>
                <th>Product</th>
                <th>Orders</th>
                <th>Joined On</th>
                <th>Approval</th>
                <th>Account</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVendors.length > 0 ? (
                paginatedVendors.map((vendor) => (
                  <tr key={vendor.id}>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        className="admins-table-checkbox"
                        checked={vendor.checked}
                        onChange={() => handleRowCheckbox(vendor.id)}
                      />
                    </td>
                    <td>
                      <div className="vendor-name-row">
                        <img 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=64&h=64" 
                          alt={vendor.name} 
                          className="vendor-avatar"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/50' }}
                        />
                        <span 
                          className="table-link-name" 
                          onClick={() => setViewedVendor(vendor)}
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
                      <span className={`vendor-badge ${vendor.status}`}>
                        {vendor.status}
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
                                  setDeletingVendorId(vendor.id)
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
      {deletingVendorId && (
        <div className="modal-overlay" onClick={() => setDeletingVendorId(null)}>
          <div className="delete-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-title">Delete</div>
            <div className="delete-modal-subtitle">Are You Sure Want To Delete?</div>
            <div className="delete-modal-buttons">
              <button 
                type="button" 
                className="btn-delete-cancel"
                onClick={() => setDeletingVendorId(null)}
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

export default VendorsManagement
