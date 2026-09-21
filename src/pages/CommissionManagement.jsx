import React, { useState, useEffect, useCallback } from 'react'
import {
  Search,
  ChevronDown,
  Plus,
  Eye,
  Edit,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import {
  getAllCommissions,
  getCommissionById,
  createCommission,
  updateCommission,
  deleteCommission,
  getAllCategories,
} from '../services/superAdminService'
import './CommissionManagement.css'

/* ─────────────────────────────────────────
   Fallback Initial Commissions
───────────────────────────────────────── */
const FALLBACK_COMMISSIONS = [
  { _id: '1', id: 1, srNo: 1, category: 'Fashion', rate: '8%', vendors: 42, status: 'ACTIVE' },
  { _id: '2', id: 2, srNo: 2, category: 'Beauty', rate: '12%', vendors: 67, status: 'INACTIVE' },
  { _id: '3', id: 3, srNo: 3, category: 'Home', rate: '10%', vendors: 85, status: 'ACTIVE' },
  { _id: '4', id: 4, srNo: 4, category: 'Mobile', rate: '15%', vendors: 36, status: 'ACTIVE' },
  { _id: '5', id: 5, srNo: 5, category: 'Electronics', rate: '5%', vendors: 54, status: 'ACTIVE' },
  { _id: '6', id: 6, srNo: 6, category: 'Sports', rate: '10%', vendors: 22, status: 'ACTIVE' },
  { _id: '7', id: 7, srNo: 7, category: 'Toys', rate: '7%', vendors: 19, status: 'INACTIVE' },
  { _id: '8', id: 8, srNo: 8, category: 'Groceries', rate: '4%', vendors: 98, status: 'ACTIVE' },
  { _id: '9', id: 9, srNo: 9, category: 'Books', rate: '6%', vendors: 14, status: 'ACTIVE' },
  { _id: '10', id: 10, srNo: 10, category: 'Furniture', rate: '12%', vendors: 31, status: 'INACTIVE' },
]

function CommissionManagement() {
  const [commissionsList, setCommissionsList] = useState([])
  const [categoriesList, setCategoriesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isApiLoaded, setIsApiLoaded] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Pagination state from API
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  })

  // Views & Modals State
  const [viewedItem, setViewedItem] = useState(null)
  const [viewLoading, setViewLoading] = useState(false)
  const [viewError, setViewError] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deletingItem, setDeletingItem] = useState(null)
  const [deletingLoading, setDeletingLoading] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  // Form submission states
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type })
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev))
    }, 4000)
  }

  // Form states
  const [formData, setFormData] = useState({
    categoryId: '',
    category: '',
    rate: '',
    vendors: '0',
    status: 'ACTIVE',
  })

  // Helper to format raw commission record from API
  const formatCommissionItem = (item, index, pageOffset = 0) => {
    const rawId = item._id || item.id || `comm-${index}`
    const rawCategory =
      item.category ||
      (typeof item.categoryId === 'object' && item.categoryId?.name ? item.categoryId.name : '') ||
      'General'
    
    let rawRate = '0%'
    if (item.rate !== undefined && item.rate !== null) {
      const numRate = typeof item.rate === 'number' ? item.rate : parseFloat(item.rate)
      rawRate = !isNaN(numRate) ? `${numRate}%` : String(item.rate)
    }

    const rawVendors = item.vendors !== undefined ? Number(item.vendors) : 0
    const rawStatus = item.status
      ? (item.status.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE')
      : 'ACTIVE'

    return {
      _id: item._id || item.id,
      id: rawId,
      srNo: pageOffset + index + 1,
      categoryId: typeof item.categoryId === 'object' ? item.categoryId?._id : item.categoryId,
      category: rawCategory,
      rate: rawRate,
      rawRateNumber: typeof item.rate === 'number' ? item.rate : parseFloat(item.rate) || 0,
      vendors: rawVendors,
      status: rawStatus,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }
  }

  // Fetch Categories for selection
  const fetchCategories = async () => {
    try {
      const res = await getAllCategories()
      let cats = []
      if (res?.data && typeof res.data === 'object') {
        if (Array.isArray(res.data.categories)) cats = res.data.categories
        else if (Array.isArray(res.data.data)) cats = res.data.data
        else if (Array.isArray(res.data)) cats = res.data
      } else if (Array.isArray(res?.categories)) {
        cats = res.categories
      } else if (Array.isArray(res?.data)) {
        cats = res.data
      } else if (Array.isArray(res)) {
        cats = res
      }
      if (cats.length > 0) {
        setCategoriesList(cats)
      }
    } catch (err) {
      console.warn('Could not fetch categories for commission management:', err)
    }
  }

  // Fetch Commissions from API: GET /api/super-admin/commissions
  const fetchCommissions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = {}
      if (currentPage) params.page = currentPage
      if (itemsPerPage) params.limit = itemsPerPage
      if (statusFilter && (statusFilter === 'ACTIVE' || statusFilter === 'INACTIVE')) {
        params.status = statusFilter
      }

      const res = await getAllCommissions(params)
      console.log('Fetched commissions response:', res)

      let rawList = []
      if (res && res.success && Array.isArray(res.data)) {
        rawList = res.data
      } else if (res?.data && Array.isArray(res.data.commissions)) {
        rawList = res.data.commissions
      } else if (Array.isArray(res?.commissions)) {
        rawList = res.commissions
      } else if (Array.isArray(res?.data)) {
        rawList = res.data
      } else if (Array.isArray(res)) {
        rawList = res
      }

      if (rawList && rawList.length > 0) {
        const pageOffset = (currentPage - 1) * itemsPerPage
        const formatted = rawList.map((item, idx) => formatCommissionItem(item, idx, pageOffset))
        setCommissionsList(formatted)
        setIsApiLoaded(true)
      } else if (res?.success && rawList.length === 0) {
        // API returned valid empty list
        setCommissionsList([])
        setIsApiLoaded(true)
      } else {
        // Fallback if data structure is unexpected
        setCommissionsList(FALLBACK_COMMISSIONS)
      }

      if (res?.pagination) {
        setPaginationInfo({
          total: res.pagination.total !== undefined ? res.pagination.total : rawList.length,
          page: res.pagination.page || currentPage,
          limit: res.pagination.limit || itemsPerPage,
          totalPages: res.pagination.totalPages || Math.ceil((res.pagination.total || rawList.length) / itemsPerPage) || 1,
          hasNextPage: !!res.pagination.hasNextPage,
          hasPreviousPage: !!res.pagination.hasPreviousPage,
        })
      } else {
        setPaginationInfo({
          total: rawList.length,
          page: currentPage,
          limit: itemsPerPage,
          totalPages: Math.ceil(rawList.length / itemsPerPage) || 1,
          hasNextPage: false,
          hasPreviousPage: false,
        })
      }
    } catch (err) {
      console.error('Failed to fetch commissions:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to fetch commissions.'
      setError(errorMsg)
      // If we don't have data yet, show fallback so the admin can still browse
      if (!isApiLoaded && commissionsList.length === 0) {
        setCommissionsList(FALLBACK_COMMISSIONS)
      }
    } finally {
      setLoading(false)
    }
  }, [currentPage, itemsPerPage, statusFilter, isApiLoaded, commissionsList.length])

  useEffect(() => {
    fetchCommissions()
    fetchCategories()
  }, [fetchCommissions])

  // Open modal triggers
  const handleOpenView = async (item) => {
    setViewedItem(item)
    setViewError(null)

    const id = item._id || item.id
    if (id && !String(id).startsWith('temp-')) {
      try {
        setViewLoading(true)
        const res = await getCommissionById(id)
        console.log('Commission by ID fetched successfully:', res)
        if (res && res.success && res.data) {
          const formatted = formatCommissionItem(res.data, (item.srNo ? item.srNo - 1 : 0), 0)
          setViewedItem(formatted)
        } else if (res?.data) {
          const formatted = formatCommissionItem(res.data, (item.srNo ? item.srNo - 1 : 0), 0)
          setViewedItem(formatted)
        }
      } catch (err) {
        console.error('Failed to fetch commission by ID:', err)
        const errorMsg = err?.response?.data?.message || err?.message || 'Failed to fetch full commission details.'
        setViewError(errorMsg)
      } finally {
        setViewLoading(false)
      }
    }
  }

  const handleOpenAdd = () => {
    setFormError(null)
    const firstCat = categoriesList.length > 0 ? categoriesList[0] : null
    setFormData({
      categoryId: firstCat ? (firstCat._id || firstCat.id || '') : '',
      category: firstCat ? (firstCat.name || firstCat.title || '') : '',
      rate: '',
      vendors: '0',
      status: 'ACTIVE',
    })
    setIsAdding(true)
  }

  const handleOpenEdit = (item) => {
    setFormError(null)
    setEditingItem(item)

    let foundCatId = item.categoryId
    if (!foundCatId && item.category) {
      const match = categoriesList.find(c => (c.name || '').toLowerCase() === item.category.toLowerCase())
      if (match) foundCatId = match._id || match.id
    }

    setFormData({
      categoryId: foundCatId || '',
      category: item.category || '',
      rate: String(item.rate).replace('%', ''),
      vendors: item.vendors !== undefined ? String(item.vendors) : '0',
      status: item.status ? item.status.toUpperCase() : 'ACTIVE',
    })
  }

  // Submit operations (Create Commission: POST /api/super-admin/commissions)
  const handleAddSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    // Determine categoryId
    let catId = formData.categoryId
    if (!catId && formData.category) {
      const match = categoriesList.find(c => (c.name || '').toLowerCase() === formData.category.toLowerCase())
      if (match) catId = match._id || match.id
    }

    if (!catId) {
      setFormError('Please select a valid category.')
      return
    }

    const cleanRate = parseFloat(String(formData.rate).replace('%', ''))
    if (isNaN(cleanRate) || cleanRate < 0) {
      setFormError('Please enter a valid rate percentage.')
      return
    }

    try {
      setFormSubmitting(true)
      const res = await createCommission({
        categoryId: catId,
        rate: cleanRate,
        status: formData.status || 'ACTIVE',
      })
      console.log('Created commission response:', res)

      showToast(res?.message || 'Commission created successfully.', 'success')
      setIsAdding(false)
      fetchCommissions()
    } catch (err) {
      console.error('Failed to create commission:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to create commission.'
      setFormError(errorMsg)
    } finally {
      setFormSubmitting(false)
    }
  }

  // Submit operations (Update Commission: PUT /api/super-admin/commissions/:id)
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    const commissionId = editingItem?._id || editingItem?.id

    // Determine categoryId
    let catId = formData.categoryId
    if (!catId && formData.category) {
      const match = categoriesList.find(c => (c.name || '').toLowerCase() === formData.category.toLowerCase())
      if (match) catId = match._id || match.id
    }

    if (!catId) {
      setFormError('Please select a valid category.')
      return
    }

    const cleanRate = parseFloat(String(formData.rate).replace('%', ''))
    if (isNaN(cleanRate) || cleanRate < 0) {
      setFormError('Please enter a valid rate percentage.')
      return
    }

    // If item has a real backend ID, call updateCommission API
    if (commissionId && !String(commissionId).startsWith('temp-')) {
      try {
        setFormSubmitting(true)
        const res = await updateCommission(commissionId, {
          categoryId: catId,
          rate: cleanRate,
          status: formData.status || 'ACTIVE',
        })
        console.log('Update commission response:', res)

        showToast(res?.message || 'Commission updated successfully.', 'success')
        setEditingItem(null)
        fetchCommissions()
      } catch (err) {
        console.error('Failed to update commission:', err)
        const errorMsg = err?.response?.data?.message || err?.message || 'Failed to update commission.'
        setFormError(errorMsg)
      } finally {
        setFormSubmitting(false)
      }
    } else {
      // Local fallback for demo / temp items
      const rateVal = `${cleanRate}%`
      setCommissionsList(
        commissionsList.map((item) =>
          (item._id && item._id === editingItem._id) || item.id === editingItem.id
            ? {
                ...item,
                categoryId: catId,
                category: formData.category,
                rate: rateVal,
                vendors: Number(formData.vendors) || 0,
                status: formData.status,
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      )
      setEditingItem(null)
      showToast('Commission updated successfully.', 'success')
    }
  }

  // Delete operation (DELETE /api/super-admin/commissions/:id)
  const handleConfirmDelete = async () => {
    if (!deletingItem) return
    setDeleteError(null)

    const id = deletingItem._id || deletingItem.id

    if (id && !String(id).startsWith('temp-')) {
      try {
        setDeletingLoading(true)
        const res = await deleteCommission(id)
        console.log('Delete commission response:', res)

        showToast(res?.message || 'Commission deleted successfully.', 'success')
        setDeletingItem(null)
        fetchCommissions()
      } catch (err) {
        console.error('Failed to delete commission:', err)
        const errorMsg = err?.response?.data?.message || err?.message || 'Failed to delete commission.'
        setDeleteError(errorMsg)
      } finally {
        setDeletingLoading(false)
      }
    } else {
      setCommissionsList(
        commissionsList.filter((item) =>
          item._id ? item._id !== deletingItem._id : item.id !== deletingItem.id
        )
      )
      setDeletingItem(null)
      showToast('Commission deleted successfully.', 'success')
    }
  }

  // Filtering (Search query & status if filtering client-side)
  const filteredList = commissionsList.filter((item) => {
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      item.category.toLowerCase().includes(q) ||
      String(item.rate).toLowerCase().includes(q)

    const matchesStatus =
      !statusFilter ||
      item.status.toUpperCase() === statusFilter.toUpperCase()

    return matchesSearch && matchesStatus
  })

  // Pagination calculation
  const totalItems = paginationInfo.total || filteredList.length
  const totalPages = paginationInfo.totalPages || Math.ceil(filteredList.length / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  
  // If backend already paginated, we display filteredList directly, or slice if client-side fallback
  const displayList = isApiLoaded && paginationInfo.total > 0 && !searchQuery
    ? filteredList
    : filteredList.slice(startIndex, startIndex + itemsPerPage)

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="commission-management-view">
      {/* Title Header */}
      <div className="commission-title-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Commission Management</h1>
            <p>Manage category commission rates and vendor percentages</p>
          </div>
          <button
            className="commission-refresh-btn"
            onClick={() => fetchCommissions()}
            title="Refresh Commission Data"
            disabled={loading}
          >
            <RotateCw className={loading ? 'spin-icon' : ''} style={{ width: '16px', height: '16px' }} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Error Banner if API call failed */}
      {error && (
        <div className="commission-error-banner">
          <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <strong>API Notice:</strong> {error}
          </div>
          <button className="commission-retry-btn" onClick={() => fetchCommissions()}>
            Retry
          </button>
        </div>
      )}

      {/* Main card container */}
      <div className="dashboard-card-panel commission-main-card">
        {/* Table Filters Row */}
        <div className="table-filter-bar commission-filters-bar">
          <div className="table-search-wrapper" style={{ width: '280px' }}>
            <Search />
            <input
              type="text"
              placeholder="Search category or rate..."
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
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              <ChevronDown className="select-chevron" />
            </div>

            <button className="add-commission-green-btn" onClick={handleOpenAdd}>
              <Plus style={{ width: '16px', height: '16px' }} />
              Add Commission
            </button>
          </div>
        </div>

        {/* Table wrapper */}
        <div className="admins-table-wrapper">
          <table className="admins-table commission-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Sr.No.</th>
                <th>Category</th>
                <th>Rate</th>
                <th>Vendors</th>
                <th>Status</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '48px 24px' }}>
                    <div className="commission-loading-state">
                      <RotateCw className="spin-icon" style={{ width: '24px', height: '24px', color: '#7cb342' }} />
                      <span>Loading live commission data...</span>
                    </div>
                  </td>
                </tr>
              ) : displayList.length > 0 ? (
                displayList.map((item, idx) => {
                  const isActive = (item.status || '').toUpperCase() === 'ACTIVE'
                  return (
                    <tr key={item._id || item.id || idx}>
                      <td style={{ fontWeight: '500' }}>{item.srNo || idx + 1}</td>
                      <td style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{item.category}</td>
                      <td style={{ fontWeight: '600', color: '#2e7d32' }}>{item.rate}</td>
                      <td style={{ fontWeight: '500' }}>{item.vendors}</td>
                      <td>
                        <span className={`commission-status-badge ${isActive ? 'active' : 'inactive'}`}>
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="commission-actions-row">
                          <button
                            className="commission-action-btn view"
                            onClick={() => handleOpenView(item)}
                            title="View Commission Details"
                            aria-label="View Commission"
                          >
                            <Eye style={{ width: '16px', height: '16px', color: '#2196f3' }} />
                          </button>
                          <button
                            className="commission-action-btn edit"
                            onClick={() => handleOpenEdit(item)}
                            title="Edit Commission"
                            aria-label="Edit Commission"
                          >
                            <Edit style={{ width: '16px', height: '16px', color: '#2196f3' }} />
                          </button>
                          <button
                            className="commission-action-btn delete"
                            onClick={() => setDeletingItem(item)}
                            title="Delete Commission"
                            aria-label="Delete Commission"
                          >
                            <Trash2 style={{ width: '16px', height: '16px', color: '#f44336' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px 24px', color: '#90a4ae' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle style={{ width: '28px', height: '28px', color: '#b0bec5' }} />
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>No commission records found.</span>
                      <span style={{ fontSize: '12px' }}>Try adjusting your search query or status filter.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Entries and Pagination */}
        <div className="offers-table-footer">
          <span className="footer-entries-text">
            Showing {displayList.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} Entries
          </span>
          <div className="offers-pagination">
            <button
              className="pag-btn prev"
              onClick={handlePrevPage}
              disabled={currentPage === 1 || loading}
              style={{
                opacity: currentPage === 1 || loading ? 0.5 : 1,
                cursor: currentPage === 1 || loading ? 'not-allowed' : 'pointer',
              }}
              aria-label="Previous page"
            >
              <ChevronLeft style={{ width: '16px', height: '16px' }} />
            </button>
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={`pag-btn ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => setCurrentPage(pageNum)}
                disabled={loading}
              >
                {pageNum}
              </button>
            ))}
            <button
              className="pag-btn next"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || loading}
              style={{
                opacity: currentPage === totalPages || loading ? 0.5 : 1,
                cursor: currentPage === totalPages || loading ? 'not-allowed' : 'pointer',
              }}
              aria-label="Next page"
            >
              <ChevronRight style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`commission-toast ${toastMessage.type === 'error' ? 'error' : ''}`}>
          {toastMessage.type === 'error' ? (
            <AlertCircle style={{ width: '18px', height: '18px' }} />
          ) : (
            <CheckCircle2 style={{ width: '18px', height: '18px' }} />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Add / Edit Form Modal Box Overlay */}
      {(isAdding || editingItem) && (
        <div className="modal-overlay" onClick={() => { setIsAdding(false); setEditingItem(null); }}>
          <div className="commission-form-modal-box" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="commission-modal-header">
              <h2>{isAdding ? 'Add Commission' : 'Edit Commission'}</h2>
              <button
                className="commission-modal-close"
                onClick={() => { setIsAdding(false); setEditingItem(null); }}
              >
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>

            <form onSubmit={isAdding ? handleAddSubmit : handleEditSubmit} className="commission-modal-form">
              {formError && (
                <div className="commission-form-error">
                  <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                  <span>{formError}</span>
                </div>
              )}

              <div className="commission-modal-field">
                <label>Category <span style={{ color: '#e53935' }}>*</span></label>
                {categoriesList.length > 0 ? (
                  <select
                    className="commission-modal-select"
                    value={formData.categoryId}
                    onChange={(e) => {
                      const selectedId = e.target.value
                      const selectedCat = categoriesList.find(c => (c._id || c.id) === selectedId)
                      setFormData({
                        ...formData,
                        categoryId: selectedId,
                        category: selectedCat ? (selectedCat.name || selectedCat.title || '') : ''
                      })
                    }}
                    required
                  >
                    <option value="">-- Select Category --</option>
                    {categoriesList.map((cat) => (
                      <option key={cat._id || cat.id} value={cat._id || cat.id}>
                        {cat.name || cat.title || 'Category'}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter Category Name (e.g. Electronics)"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                )}
              </div>

              <div className="commission-modal-row">
                <div className="commission-modal-field flex-1">
                  <label>Rate (%) <span style={{ color: '#e53935' }}>*</span></label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="e.g. 10"
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                    required
                  />
                </div>

                <div className="commission-modal-field flex-1">
                  <label>Vendors Count</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Enter No. Of Vendors"
                    value={formData.vendors}
                    onChange={(e) => setFormData({ ...formData, vendors: e.target.value })}
                    disabled={isAdding}
                    title={isAdding ? 'Vendors count is dynamically calculated by backend' : ''}
                  />
                </div>
              </div>

              {/* Status Switch Toggle */}
              <div className="commission-modal-field status-toggle-row">
                <label className="toggle-label-text">
                  Status: <strong>{formData.status === 'ACTIVE' ? 'Active' : 'Inactive'}</strong>
                </label>
                <label className="premium-toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.status === 'ACTIVE'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.checked ? 'ACTIVE' : 'INACTIVE',
                      })
                    }
                  />
                  <span className="premium-toggle-slider"></span>
                </label>
              </div>

              {/* Action Buttons Cancel / Submit or Save */}
              <div className="commission-modal-buttons">
                <button
                  type="button"
                  className="commission-btn-cancel"
                  onClick={() => { setIsAdding(false); setEditingItem(null); }}
                  disabled={formSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="commission-btn-submit"
                  disabled={formSubmitting}
                  style={{
                    opacity: formSubmitting ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {formSubmitting ? (
                    <>
                      <RotateCw className="spin-icon" style={{ width: '14px', height: '14px' }} />
                      <span>Saving...</span>
                    </>
                  ) : (
                    isAdding ? 'Add Commission' : 'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal Overlay */}
      {viewedItem && (
        <div className="modal-overlay" onClick={() => setViewedItem(null)}>
          <div className="commission-view-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="commission-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2>View Commission Details</h2>
                {viewLoading && (
                  <RotateCw className="spin-icon" style={{ width: '16px', height: '16px', color: '#7cb342' }} />
                )}
              </div>
              <button className="commission-modal-close" onClick={() => setViewedItem(null)}>
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>

            {viewError && (
              <div style={{ padding: '8px 24px', backgroundColor: '#fff3e0', color: '#e65100', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle style={{ width: '14px', height: '14px' }} />
                <span>{viewError}</span>
              </div>
            )}

            <div className="commission-view-content">
              <div className="commission-view-details">
                {viewedItem._id && (
                  <div className="commission-view-row">
                    <span className="view-label">ID</span>
                    <span className="view-value" style={{ fontFamily: 'monospace', fontSize: '12px', color: '#546e7a' }}>
                      {viewedItem._id}
                    </span>
                  </div>
                )}
                <div className="commission-view-row">
                  <span className="view-label">Category</span>
                  <span className="view-value" style={{ fontWeight: '700' }}>{viewedItem.category}</span>
                </div>
                {viewedItem.categoryId && (
                  <div className="commission-view-row">
                    <span className="view-label">Category ID</span>
                    <span className="view-value" style={{ fontFamily: 'monospace', fontSize: '12px', color: '#546e7a' }}>
                      {viewedItem.categoryId}
                    </span>
                  </div>
                )}
                <div className="commission-view-row">
                  <span className="view-label">Rate</span>
                  <span className="view-value" style={{ fontWeight: '700', color: '#2e7d32' }}>
                    {viewedItem.rate}
                  </span>
                </div>
                <div className="commission-view-row">
                  <span className="view-label">Vendors</span>
                  <span className="view-value">{viewedItem.vendors} Vendors</span>
                </div>
                {viewedItem.createdAt && (
                  <div className="commission-view-row">
                    <span className="view-label">Created At</span>
                    <span className="view-value">{formatDate(viewedItem.createdAt)}</span>
                  </div>
                )}
                {viewedItem.updatedAt && (
                  <div className="commission-view-row">
                    <span className="view-label">Updated At</span>
                    <span className="view-value">{formatDate(viewedItem.updatedAt)}</span>
                  </div>
                )}
              </div>
              <span className={`commission-status-badge viewed ${(viewedItem.status || '').toLowerCase()}`}>
                {viewedItem.status === 'ACTIVE' ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deletingItem && (
        <div className="modal-overlay" onClick={() => { if (!deletingLoading) setDeletingItem(null); }}>
          <div className="delete-modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="delete-modal-title">Delete Commission</h2>
            <p className="delete-modal-question">
              Are you sure you want to delete the commission rule for <strong>{deletingItem.category}</strong>?
            </p>

            {deleteError && (
              <div style={{ margin: '12px 0', padding: '8px 12px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="delete-modal-actions">
              <button
                className="delete-btn-cancel"
                onClick={() => setDeletingItem(null)}
                disabled={deletingLoading}
              >
                Cancel
              </button>
              <button
                className="delete-btn-confirm"
                onClick={handleConfirmDelete}
                disabled={deletingLoading}
                style={{
                  opacity: deletingLoading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {deletingLoading ? (
                  <>
                    <RotateCw className="spin-icon" style={{ width: '14px', height: '14px' }} />
                    <span>Deleting...</span>
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CommissionManagement

