import React, { useState } from 'react'
import {
  Search,
  ChevronDown,
  Plus,
  Eye,
  Edit,
  Trash2,
  X,
  ChevronLeft,
} from 'lucide-react'
import './CommissionManagement.css'

/* ─────────────────────────────────────────
   Mock Data
───────────────────────────────────────── */
const INITIAL_COMMISSIONS = [
  { id: 1, srNo: 1, category: 'Fashion', rate: '8%', vendors: 42, status: 'Active' },
  { id: 2, srNo: 2, category: 'Beauty', rate: '12%', vendors: 67, status: 'Inactive' },
  { id: 3, srNo: 3, category: 'Home', rate: '10%', vendors: 85, status: 'Active' },
  { id: 4, srNo: 4, category: 'Mobile', rate: '15%', vendors: 36, status: 'Active' },
  { id: 5, srNo: 5, category: 'Electronics', rate: '5%', vendors: 54, status: 'Active' },
  { id: 6, srNo: 6, category: 'Sports', rate: '10%', vendors: 22, status: 'Active' },
  { id: 7, srNo: 7, category: 'Toys', rate: '7%', vendors: 19, status: 'Inactive' },
  { id: 8, srNo: 8, category: 'Groceries', rate: '4%', vendors: 98, status: 'Active' },
  { id: 9, srNo: 9, category: 'Books', rate: '6%', vendors: 14, status: 'Active' },
  { id: 10, srNo: 10, category: 'Furniture', rate: '12%', vendors: 31, status: 'Inactive' },
]

function CommissionManagement() {
  const [commissionsList, setCommissionsList] = useState(INITIAL_COMMISSIONS)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Views & Modals State
  const [viewedItem, setViewedItem] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deletingItem, setDeletingItem] = useState(null)

  // Form states
  const [formData, setFormData] = useState({
    category: '',
    rate: '',
    vendors: '',
    status: 'Active',
  })

  // Open modal triggers
  const handleOpenAdd = () => {
    setFormData({
      category: '',
      rate: '',
      vendors: '0',
      status: 'Active',
    })
    setIsAdding(true)
  }

  const handleOpenEdit = (item) => {
    setEditingItem(item)
    setFormData({
      category: item.category,
      rate: item.rate.replace('%', ''),
      vendors: item.vendors,
      status: item.status,
    })
  }

  // Submit operations
  const handleAddSubmit = (e) => {
    e.preventDefault()
    const rateVal = formData.rate.includes('%') ? formData.rate : `${formData.rate}%`
    const newItem = {
      id: Date.now(),
      srNo: commissionsList.length + 1,
      category: formData.category,
      rate: rateVal,
      vendors: Number(formData.vendors) || 0,
      status: formData.status,
    }
    setCommissionsList([...commissionsList, newItem])
    setIsAdding(false)
    setCurrentPage(1)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    const rateVal = formData.rate.includes('%') ? formData.rate : `${formData.rate}%`
    setCommissionsList(
      commissionsList.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              category: formData.category,
              rate: rateVal,
              vendors: Number(formData.vendors) || 0,
              status: formData.status,
            }
          : item
      )
    )
    setEditingItem(null)
  }

  // Delete operation
  const handleConfirmDelete = () => {
    if (!deletingItem) return
    setCommissionsList(commissionsList.filter((item) => item.id !== deletingItem.id))
    setDeletingItem(null)
    setCurrentPage(1)
  }

  // Filtering
  const filteredList = commissionsList.filter((item) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q ||
      item.category.toLowerCase().includes(q) ||
      item.rate.toLowerCase().includes(q)
    const matchesStatus = !statusFilter || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Pagination math
  const totalItems = filteredList.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedList = filteredList.slice(startIndex, startIndex + itemsPerPage)

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  return (
    <div className="commission-management-view">
      {/* Title Header */}
      <div className="commission-title-header">
        <h1>Commission Management</h1>
        <p>Manage all the Commission</p>
      </div>

      {/* Main card container */}
      <div className="dashboard-card-panel commission-main-card">
        {/* Table Filters Row */}
        <div className="table-filter-bar commission-filters-bar">
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
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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
                <th style={{ width: '120px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedList.length > 0 ? (
                paginatedList.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: '500' }}>{item.srNo}</td>
                    <td style={{ fontWeight: '600' }}>{item.category}</td>
                    <td style={{ fontWeight: '500' }}>{item.rate}</td>
                    <td style={{ fontWeight: '500' }}>{item.vendors}</td>
                    <td>
                      <span className={`commission-status-badge ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="commission-actions-row">
                        <button
                          className="commission-action-btn view"
                          onClick={() => setViewedItem(item)}
                          aria-label="View Commission"
                        >
                          <Eye style={{ width: '16px', height: '16px', color: '#2196f3' }} />
                        </button>
                        <button
                          className="commission-action-btn edit"
                          onClick={() => handleOpenEdit(item)}
                          aria-label="Edit Commission"
                        >
                          <Edit style={{ width: '16px', height: '16px', color: '#2196f3' }} />
                        </button>
                        <button
                          className="commission-action-btn delete"
                          onClick={() => setDeletingItem(item)}
                          aria-label="Delete Commission"
                        >
                          <Trash2 style={{ width: '16px', height: '16px', color: '#f44336' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#90a4ae' }}>
                    No commission rules found.
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
              <div className="commission-modal-field">
                <label>Category</label>
                <input
                  type="text"
                  placeholder="Enter Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>

              <div className="commission-modal-row">
                <div className="commission-modal-field flex-1">
                  <label>Rate(%)</label>
                  <input
                    type="text"
                    placeholder="Enter Rate in %"
                    value={formData.rate}
                    onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                    required
                  />
                </div>

                <div className="commission-modal-field flex-1">
                  <label>Vendor</label>
                  <input
                    type="number"
                    placeholder="Enter No. Of Vendors"
                    value={formData.vendors}
                    onChange={(e) => setFormData({ ...formData, vendors: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Status Switch Toggle */}
              <div className="commission-modal-field status-toggle-row">
                <label className="toggle-label-text">Status</label>
                <label className="premium-toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.status === 'Active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'Active' : 'Inactive' })}
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
                >
                  Cancel
                </button>
                <button type="submit" className="commission-btn-submit">
                  {isAdding ? 'Add' : 'Save'}
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
              <h2>View Commission</h2>
              <button className="commission-modal-close" onClick={() => setViewedItem(null)}>
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>

            <div className="commission-view-content">
              <div className="commission-view-details">
                <div className="commission-view-row">
                  <span className="view-label">Category</span>
                  <span className="view-value">{viewedItem.category}</span>
                </div>
                <div className="commission-view-row">
                  <span className="view-label">Rate</span>
                  <span className="view-value">{viewedItem.rate}</span>
                </div>
                <div className="commission-view-row">
                  <span className="view-label">Vendors</span>
                  <span className="view-value">{viewedItem.vendors}</span>
                </div>
              </div>
              <span className={`commission-status-badge viewed ${viewedItem.status.toLowerCase()}`}>
                {viewedItem.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deletingItem && (
        <div className="modal-overlay" onClick={() => setDeletingItem(null)}>
          <div className="delete-modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="delete-modal-title">Delete</h2>
            <p className="delete-modal-question">Are You Sure Want To Delete?</p>
            <div className="delete-modal-actions">
              <button className="delete-btn-cancel" onClick={() => setDeletingItem(null)}>
                Cancel
              </button>
              <button className="delete-btn-confirm" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CommissionManagement
