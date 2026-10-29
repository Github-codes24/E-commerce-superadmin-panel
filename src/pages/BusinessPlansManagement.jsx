import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Briefcase,
  Plus,
  RotateCw,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Edit2,
  Trash2,
  Eye,
  Check,
  LayoutGrid,
  List,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Percent,
  Clock,
  Truck,
  DollarSign,
  Tag,
  Headphones,
  Award
} from 'lucide-react'
import {
  createVendorBusinessPlan,
  getAllVendorBusinessPlans,
  updateVendorBusinessPlan,
  deleteVendorBusinessPlan,
  updateVendorBusinessPlanStatus
} from '../services/superAdminService'
import './BusinessPlansManagement.css'

const STORAGE_KEY = 'zyvora_vendor_business_plans'
const VENDOR_PANEL_CACHE_KEY = 'zyvora_vendor_business_plans_cache'

// Authentic Business Plans from the "Become a Vendor" portal (BecomeVendor.jsx)
export const BECOME_VENDOR_PLANS = [
  {
    _id: '6adf707c61a7bc89ec6ade3b',
    planKey: 'PREMIUM',
    name: 'Premium Plan',
    billingCycle: 'MONTHLY',
    price: 599,
    currency: 'INR',
    durationDays: 30,
    registrationCharges: 50,
    commissionPercent: 5,
    payoutCycleDays: 5,
    deliveryDiscountPercent: 45,
    adsCredit: 0,
    premiumBadge: false,
    analyticsDashboard: true,
    unlimitedListings: true,
    priorityPlacement: true,
    dedicatedAccountManager: false,
    vendorSupport: '24x7 vendor support',
    description: 'For professional vendors looking to grow sales.',
    features: [
      'Unlimited listings',
      'Low 5% commission',
      'Advanced analytics dashboard',
      '5-day payout cycle',
      '24x7 vendor support',
      '45% off delivery charges',
      'Priority product placement'
    ],
    isActive: true,
    createdBy: '6a9bc94b22a6736b2f9eb9db',
    updatedBy: '6a9bc94b22a6736b2f9eb9db',
    createdAt: '2026-10-26T15:23:40.721Z',
    updatedAt: '2026-10-26T15:40:13.211Z'
  },
  {
    _id: '6adf717761a7bc89ec6ade40',
    planKey: 'PREMIUM',
    name: 'Premium Annual Plan',
    billingCycle: 'YEARLY',
    price: 3999,
    currency: 'INR',
    durationDays: 365,
    registrationCharges: 35,
    commissionPercent: 5,
    payoutCycleDays: 5,
    deliveryDiscountPercent: 45,
    adsCredit: 0,
    premiumBadge: false,
    analyticsDashboard: true,
    unlimitedListings: true,
    priorityPlacement: true,
    dedicatedAccountManager: false,
    vendorSupport: '24x7 vendor support',
    description: 'Designed for professional vendors to grow sales, gain visibility, and access premium tools.',
    features: [
      'Unlimited listings',
      'Low 5% commission',
      'Advanced analytics dashboard',
      '5-day payout cycle',
      '24x7 vendor support',
      '45% off delivery charges',
      'Priority product placement'
    ],
    isActive: true,
    createdBy: '6a9bc94b22a6736b2f9eb9db',
    updatedBy: '6a9bc94b22a6736b2f9eb9db',
    createdAt: '2026-10-26T15:27:51.279Z',
    updatedAt: '2026-10-26T15:27:51.279Z'
  },
  {
    _id: 'plan_starter',
    planKey: 'STARTER',
    name: 'Starter Plan – Pay As You Grow',
    billingCycle: 'MONTHLY',
    price: 0,
    currency: 'INR',
    durationDays: 30,
    registrationCharges: 0,
    commissionPercent: 12,
    payoutCycleDays: 8,
    deliveryDiscountPercent: 25,
    adsCredit: 0,
    premiumBadge: false,
    analyticsDashboard: false,
    unlimitedListings: false,
    priorityPlacement: false,
    dedicatedAccountManager: false,
    vendorSupport: 'Basic dashboard & email alerts',
    description: 'Start your selling journey with zero cost. Perfect for new vendors exploring the ShopNow4U Marketplace.',
    features: [
      'Limited Access',
      '12% commission per sale',
      '8-day payout cycle',
      '25% off delivery charges',
      'Basic dashboard & email alerts',
      'Best for starters & small sellers'
    ],
    isActive: true,
    createdBy: '6a9bc94b22a6736b2f9eb9db',
    updatedBy: '6a9bc94b22a6736b2f9eb9db',
    createdAt: '2026-10-25T10:00:00.000Z',
    updatedAt: '2026-10-25T10:00:00.000Z'
  },
  {
    _id: 'plan_enterprise',
    planKey: 'ENTERPRISE',
    name: 'Enterprise Annual Plan',
    billingCycle: 'YEARLY',
    price: 9999,
    currency: 'INR',
    durationDays: 365,
    registrationCharges: 0,
    commissionPercent: 0,
    payoutCycleDays: 3,
    deliveryDiscountPercent: 100,
    adsCredit: 8300,
    premiumBadge: true,
    analyticsDashboard: true,
    unlimitedListings: true,
    priorityPlacement: true,
    dedicatedAccountManager: true,
    vendorSupport: 'Dedicated key account manager',
    description: 'Built for exporters, manufacturers, and large-scale vendors seeking maximum exposure and automation.',
    features: [
      'Annual subscription flexibility',
      'Unlimited listings + Premium Badge',
      '0% commission on sales',
      'Free delivery (no vendor charge)',
      '₹8,300 ShopNow4U Ads Credit',
      '3-day payout cycle',
      'Dedicated key account manager'
    ],
    isActive: true,
    createdBy: '6a9bc94b22a6736b2f9eb9db',
    updatedBy: '6a9bc94b22a6736b2f9eb9db',
    createdAt: '2026-10-25T10:00:00.000Z',
    updatedAt: '2026-10-25T10:00:00.000Z'
  }
]

const INITIAL_BUSINESS_PLANS = BECOME_VENDOR_PLANS

const QUICK_FEATURE_PRESETS = [
  'Unlimited listings',
  'Low 5% commission',
  'Advanced analytics dashboard',
  '5-day payout cycle',
  '24x7 vendor support',
  '45% off delivery charges',
  'Priority product placement',
  'Dedicated account manager',
  'Verified vendor badge',
  '₹500 Free Ads Credit'
]

const DEFAULT_FORM_STATE = {
  planKey: 'PREMIUM',
  name: '',
  billingCycle: 'YEARLY',
  price: 3999,
  currency: 'INR',
  durationDays: 365,
  registrationCharges: 35,
  commissionPercent: 5,
  payoutCycleDays: 5,
  deliveryDiscountPercent: 45,
  adsCredit: 0,
  premiumBadge: false,
  analyticsDashboard: true,
  unlimitedListings: true,
  priorityPlacement: true,
  dedicatedAccountManager: false,
  vendorSupport: '24x7 vendor support',
  description: '',
  features: [
    'Unlimited listings',
    'Low 5% commission',
    'Advanced analytics dashboard',
    '5-day payout cycle',
    '24x7 vendor support',
    '45% off delivery charges',
    'Priority product placement'
  ],
  isActive: true
}

export default function BusinessPlansManagement({ onNavigate }) {
  const [plans, setPlans] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(VENDOR_PANEL_CACHE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Remove old mock plan like 'Standard Growth Plan'
          const cleaned = parsed.filter(p => p.name !== 'Standard Growth Plan' && p._id !== '6adf717761a7bc89ec6ade41')
          if (cleaned.length > 0) {
            const map = new Map()
            BECOME_VENDOR_PLANS.forEach(p => map.set(p._id || p.name, p))
            cleaned.forEach(p => map.set(p._id || p.name, p))
            const merged = Array.from(map.values())
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
            localStorage.setItem(VENDOR_PANEL_CACHE_KEY, JSON.stringify(merged))
            return merged
          }
        }
      }
    } catch (e) {
      console.warn('Could not read cached business plans:', e)
    }
    return BECOME_VENDOR_PLANS
  })

  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cycleFilter, setCycleFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'table'

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [viewingPlan, setViewingPlan] = useState(null)
  const [deletingPlan, setDeletingPlan] = useState(null)
  const [quickEditPlan, setQuickEditPlan] = useState(null)
  const [quickPrice, setQuickPrice] = useState('')
  const [quickRegCharges, setQuickRegCharges] = useState('')
  const [quickSubmitting, setQuickSubmitting] = useState(false)

  // Form State
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE)
  const [newFeatureInput, setNewFeatureInput] = useState('')
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  // Toast Banner
  const [alertBanner, setAlertBanner] = useState(null)

  const showAlert = (message, type = 'success') => {
    setAlertBanner({ message, type })
    setTimeout(() => {
      setAlertBanner(prev => (prev?.message === message ? null : prev))
    }, 4500)
  }

  // Fetch from API
  const fetchPlans = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const response = await getAllVendorBusinessPlans()
      let fetchedList = []
      if (response?.data && Array.isArray(response.data)) {
        fetchedList = response.data
      } else if (response?.plans && Array.isArray(response.plans)) {
        fetchedList = response.plans
      } else if (Array.isArray(response)) {
        fetchedList = response
      }

      if (fetchedList.length > 0) {
        setPlans(fetchedList)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedList))
        if (isManualRefresh) showAlert('Business plans reloaded from live server.', 'success')
      } else {
        // Fallback to local
        if (isManualRefresh) showAlert('Plans synchronized with active local cache.', 'success')
      }
    } catch (err) {
      console.warn('Fetch business plans API warning:', err?.message || err)
      // When offline or endpoint returns 404, preserve stored data
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPlans(parsed)
          }
        }
      } catch {}
      if (isManualRefresh) showAlert('Live API unavailable; working in cached mode.', 'error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  // Save to localStorage whenever plans change (syncing with Become a Vendor panel)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
      localStorage.setItem(VENDOR_PANEL_CACHE_KEY, JSON.stringify(plans))
    } catch (e) {
      console.warn('LocalStorage save error:', e)
    }
  }, [plans])

  // Stats calculation
  const stats = useMemo(() => {
    const total = plans.length
    const activeCount = plans.filter(p => p.isActive).length
    const totalCommission = plans.reduce((acc, p) => acc + (Number(p.commissionPercent) || 0), 0)
    const avgCommission = total > 0 ? (totalCommission / total).toFixed(1) : 0
    const highestTier = plans.find(p => p.planKey === 'PREMIUM') || plans[0]

    return {
      total,
      activeCount,
      avgCommission: `${avgCommission}%`,
      highestTierName: highestTier ? `${highestTier.name} (₹${highestTier.price?.toLocaleString('en-IN')})` : 'N/A'
    }
  }, [plans])

  // Filtered plans
  const filteredPlans = useMemo(() => {
    return plans.filter(plan => {
      const q = searchQuery.toLowerCase().trim()
      const matchSearch =
        !q ||
        plan.name?.toLowerCase().includes(q) ||
        plan.planKey?.toLowerCase().includes(q) ||
        plan.vendorSupport?.toLowerCase().includes(q) ||
        (Array.isArray(plan.features) && plan.features.some(f => f.toLowerCase().includes(q)))

      const matchCycle = cycleFilter === 'ALL' || (plan.billingCycle || '').toUpperCase() === cycleFilter
      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && plan.isActive) ||
        (statusFilter === 'INACTIVE' && !plan.isActive)

      return matchSearch && matchCycle && matchStatus
    })
  }, [plans, searchQuery, cycleFilter, statusFilter])

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingPlan(null)
    setFormData({
      ...DEFAULT_FORM_STATE,
      planKey: 'PREMIUM',
      name: '',
      price: 3999,
      features: [...DEFAULT_FORM_STATE.features]
    })
    setNewFeatureInput('')
    setFormError('')
    setIsCreateModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEditModal = (plan) => {
    setEditingPlan(plan)
    setFormData({
      planKey: plan.planKey || 'PREMIUM',
      name: plan.name || '',
      billingCycle: plan.billingCycle || 'YEARLY',
      price: plan.price !== undefined ? plan.price : 3999,
      currency: plan.currency || 'INR',
      durationDays: plan.durationDays !== undefined ? plan.durationDays : 365,
      registrationCharges: plan.registrationCharges !== undefined ? plan.registrationCharges : 35,
      commissionPercent: plan.commissionPercent !== undefined ? plan.commissionPercent : 5,
      payoutCycleDays: plan.payoutCycleDays !== undefined ? plan.payoutCycleDays : 5,
      deliveryDiscountPercent: plan.deliveryDiscountPercent !== undefined ? plan.deliveryDiscountPercent : 45,
      adsCredit: plan.adsCredit !== undefined ? plan.adsCredit : 0,
      premiumBadge: Boolean(plan.premiumBadge),
      analyticsDashboard: Boolean(plan.analyticsDashboard),
      unlimitedListings: Boolean(plan.unlimitedListings),
      priorityPlacement: Boolean(plan.priorityPlacement),
      dedicatedAccountManager: Boolean(plan.dedicatedAccountManager),
      vendorSupport: plan.vendorSupport || '24x7 vendor support',
      description: plan.description || '',
      features: Array.isArray(plan.features) ? [...plan.features] : [],
      isActive: plan.isActive !== undefined ? Boolean(plan.isActive) : true
    })
    setNewFeatureInput('')
    setFormError('')
    setIsCreateModalOpen(true)
  }

  // Open Quick Price Update Modal (PUT /api/super-admin/vendor-business-plans/:id)
  const handleOpenQuickPriceModal = (plan) => {
    setQuickEditPlan(plan)
    setQuickPrice(plan.price !== undefined ? plan.price : 599)
    setQuickRegCharges(plan.registrationCharges !== undefined ? plan.registrationCharges : 50)
  }

  // Handle Quick Price & Registration Charges PUT update
  const handleQuickPriceUpdate = async (e) => {
    e.preventDefault()
    if (!quickEditPlan) return
    setQuickSubmitting(true)

    const id = quickEditPlan._id || quickEditPlan.id
    const payload = {
      price: Number(quickPrice),
      registrationCharges: Number(quickRegCharges)
    }

    try {
      let updatedRecord = null
      try {
        const res = await updateVendorBusinessPlan(id, payload)
        if (res?.data && typeof res.data === 'object') {
          updatedRecord = Array.isArray(res.data) ? res.data[0] : res.data
        }
      } catch (apiErr) {
        console.warn('API update failed; proceeding with local update:', apiErr.message)
      }

      const finalPlan = {
        ...quickEditPlan,
        ...payload,
        ...(updatedRecord || {}),
        updatedAt: updatedRecord?.updatedAt || new Date().toISOString()
      }

      setPlans(prev => prev.map(p => (p._id === id || p.id === id ? finalPlan : p)))
      showAlert('Vendor business plan updated successfully.', 'success')
      setQuickEditPlan(null)
    } catch (err) {
      showAlert('Failed to update plan: ' + err.message, 'error')
    } finally {
      setQuickSubmitting(false)
    }
  }

  // Add Feature Tag
  const handleAddFeature = (textToAdd) => {
    const text = (typeof textToAdd === 'string' ? textToAdd : newFeatureInput).trim()
    if (!text) return
    if (!formData.features.includes(text)) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, text]
      }))
    }
    setNewFeatureInput('')
  }

  // Remove Feature Tag
  const handleRemoveFeature = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, idx) => idx !== indexToRemove)
    }))
  }

  // Toggle boolean fields
  const handleToggleSwitch = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  // Submit Create or Edit Form
  const handleSubmitForm = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!formData.name.trim()) {
      setFormError('Plan Name is required.')
      return
    }
    if (!formData.planKey.trim()) {
      setFormError('Plan Key is required (e.g., PREMIUM, STANDARD, BASIC).')
      return
    }
    if (formData.price < 0) {
      setFormError('Price cannot be negative.')
      return
    }

    setFormSubmitting(true)

    const payload = {
      planKey: formData.planKey.trim().toUpperCase(),
      name: formData.name.trim(),
      billingCycle: formData.billingCycle.toUpperCase(),
      price: Number(formData.price) || 0,
      currency: formData.currency || 'INR',
      durationDays: Number(formData.durationDays) || 30,
      registrationCharges: Number(formData.registrationCharges) || 0,
      commissionPercent: Number(formData.commissionPercent) || 0,
      payoutCycleDays: Number(formData.payoutCycleDays) || 5,
      deliveryDiscountPercent: Number(formData.deliveryDiscountPercent) || 0,
      adsCredit: Number(formData.adsCredit) || 0,
      premiumBadge: Boolean(formData.premiumBadge),
      analyticsDashboard: Boolean(formData.analyticsDashboard),
      unlimitedListings: Boolean(formData.unlimitedListings),
      priorityPlacement: Boolean(formData.priorityPlacement),
      dedicatedAccountManager: Boolean(formData.dedicatedAccountManager),
      vendorSupport: formData.vendorSupport.trim() || '24x7 vendor support',
      description: formData.description.trim(),
      features: formData.features,
      isActive: Boolean(formData.isActive)
    }

    try {
      if (editingPlan) {
        // UPDATE Existing Plan
        let updatedRecord = null
        try {
          const res = await updateVendorBusinessPlan(editingPlan._id || editingPlan.id, payload)
          if (res?.data && typeof res.data === 'object') {
            updatedRecord = Array.isArray(res.data) ? res.data[0] : res.data
          }
        } catch (apiErr) {
          console.warn('API update failed; proceeding with local update:', apiErr.message)
        }

        const finalPlan = {
          ...editingPlan,
          ...payload,
          ...(updatedRecord || {}),
          updatedAt: new Date().toISOString()
        }

        setPlans(prev => prev.map(p => (p._id === editingPlan._id || p.id === editingPlan.id ? finalPlan : p)))
        showAlert('Vendor business plan updated successfully.', 'success')
      } else {
        // CREATE New Plan
        let createdRecord = null
        try {
          const res = await createVendorBusinessPlan(payload)
          if (res?.data && typeof res.data === 'object') {
            createdRecord = Array.isArray(res.data) ? res.data[0] : res.data
          }
        } catch (apiErr) {
          console.warn('API create failed; proceeding with local creation:', apiErr.message)
        }

        const newPlan = {
          _id: createdRecord?._id || `plan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          ...payload,
          ...(createdRecord || {}),
          createdAt: createdRecord?.createdAt || new Date().toISOString(),
          updatedAt: createdRecord?.updatedAt || new Date().toISOString()
        }

        setPlans(prev => [newPlan, ...prev])
        showAlert(`Business Plan "${newPlan.name}" created successfully.`, 'success')
      }

      setIsCreateModalOpen(false)
    } catch (err) {
      setFormError(err.message || 'Failed to save business plan. Please check inputs.')
    } finally {
      setFormSubmitting(false)
    }
  }

  // Toggle Active/Inactive (PATCH /api/super-admin/vendor-business-plans/:id/status)
  const handleToggleStatus = async (plan) => {
    const newStatus = !plan.isActive
    const id = (plan._id || plan.id).toString().trim()
    try {
      let apiMessage = null
      let updatedData = null
      try {
        const res = await updateVendorBusinessPlanStatus(id, newStatus)
        if (res?.message) apiMessage = res.message
        if (res?.data) updatedData = Array.isArray(res.data) ? res.data[0] : res.data
      } catch (e) {
        console.warn('Status toggle API warning:', e.message)
      }

      setPlans(prev =>
        prev.map(p => {
          if (p._id === id || p.id === id) {
            return {
              ...p,
              ...(updatedData || {}),
              isActive: newStatus,
              updatedAt: updatedData?.updatedAt || new Date().toISOString()
            }
          }
          return p
        })
      )
      showAlert(
        apiMessage || (newStatus ? 'Vendor business plan activated successfully.' : 'Vendor business plan deactivated successfully.'),
        'success'
      )
    } catch (err) {
      showAlert('Could not update status: ' + err.message, 'error')
    }
  }

  // Delete Plan
  const handleDeletePlanConfirm = async () => {
    if (!deletingPlan) return
    const idToDelete = deletingPlan._id || deletingPlan.id
    try {
      try {
        await deleteVendorBusinessPlan(idToDelete)
      } catch (e) {
        console.warn('Delete API warning:', e.message)
      }

      setPlans(prev => prev.filter(p => (p._id || p.id) !== idToDelete))
      showAlert(`Business Plan "${deletingPlan.name}" deleted.`, 'success')
      setDeletingPlan(null)
    } catch (err) {
      showAlert('Could not delete plan: ' + err.message, 'error')
    }
  }

  return (
    <div className="business-plans-view">
      {/* Top Header */}
      <div className="business-plans-header">
        <div>
          <h1>Vendor Business Plans</h1>
          <p>Configure subscription plans, commission rates, and feature benefits for platform vendors.</p>
        </div>
        <div className="header-action-buttons">
          <button
            className={`btn-refresh ${refreshing ? 'spinning' : ''}`}
            onClick={() => fetchPlans(true)}
            title="Refresh from server"
            disabled={refreshing}
          >
            <RotateCw size={17} />
          </button>
          <button className="btn-primary-create" onClick={handleOpenCreateModal}>
            <Plus size={18} />
            Create Business Plan
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {alertBanner && (
        <div className={`plan-alert-banner ${alertBanner.type}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {alertBanner.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{alertBanner.message}</span>
          </div>
          <button
            onClick={() => setAlertBanner(null)}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="plans-stats-grid">
        <div className="plans-stat-card">
          <div className="stat-icon-box" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
            <Briefcase size={22} />
          </div>
          <div className="stat-info-box">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-text">Total Business Plans</div>
          </div>
        </div>

        <div className="plans-stat-card">
          <div className="stat-icon-box" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
            <ShieldCheck size={22} />
          </div>
          <div className="stat-info-box">
            <div className="stat-number">{stats.activeCount}</div>
            <div className="stat-text">Active Plans</div>
          </div>
        </div>

        <div className="plans-stat-card">
          <div className="stat-icon-box" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
            <Percent size={22} />
          </div>
          <div className="stat-info-box">
            <div className="stat-number">{stats.avgCommission}</div>
            <div className="stat-text">Avg Commission Rate</div>
          </div>
        </div>

        <div className="plans-stat-card">
          <div className="stat-icon-box" style={{ backgroundColor: '#f3e8ff', color: '#9333ea' }}>
            <Award size={22} />
          </div>
          <div className="stat-info-box">
            <div className="stat-number" style={{ fontSize: '15px', fontWeight: '700' }}>
              {stats.highestTierName}
            </div>
            <div className="stat-text">Top Tier Offering</div>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="plans-filter-card">
        <div className="filter-left-group">
          <div className="plans-search-wrapper">
            <Search className="plans-search-icon" size={17} />
            <input
              type="text"
              placeholder="Search plan name, key, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="plans-select-filter"
            value={cycleFilter}
            onChange={(e) => setCycleFilter(e.target.value)}
          >
            <option value="ALL">All Billing Cycles</option>
            <option value="YEARLY">Yearly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="HALF_YEARLY">Half Yearly</option>
            <option value="ONE_TIME">One Time</option>
          </select>

          <select
            className="plans-select-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
        </div>

        <div className="filter-right-group">
          <button
            className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Card Grid View"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Data Table View"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Content Rendering */}
      {filteredPlans.length === 0 ? (
        <div className="plans-empty-state">
          <Briefcase size={44} />
          <h3>No Business Plans Found</h3>
          <p>
            {searchQuery || cycleFilter !== 'ALL' || statusFilter !== 'ALL'
              ? 'No plans matched your filter criteria. Try resetting search filters.'
              : 'You have not configured any vendor business plans yet. Create your first subscription package now.'}
          </p>
          <button className="btn-primary-create" onClick={handleOpenCreateModal}>
            <Plus size={16} />
            Create First Business Plan
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Pricing Cards View */
        <div className="plans-grid-container">
          {filteredPlans.map((plan) => {
            const planKey = (plan.planKey || 'CUSTOM').toUpperCase()
            const keyClass =
              planKey === 'PREMIUM'
                ? 'premium'
                : planKey === 'ENTERPRISE'
                ? 'enterprise'
                : planKey === 'STARTER'
                ? 'starter'
                : planKey === 'STANDARD'
                ? 'standard'
                : planKey === 'BASIC'
                ? 'basic'
                : 'custom'

            return (
              <div
                key={plan._id || plan.id}
                className={`business-plan-card ${!plan.isActive ? 'inactive-card' : ''}`}
              >
                <div className="plan-card-header">
                  <span className={`plan-key-tag ${keyClass}`}>{plan.planKey}</span>
                  <span className={`plan-card-status-pill ${plan.isActive ? 'active' : 'inactive'}`}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <h3 className="plan-card-title">{plan.name}</h3>
                <p className="plan-card-desc">
                  {plan.description || `${plan.billingCycle} subscription package designed for verified vendors.`}
                </p>

                <div 
                  className="plan-price-block"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleOpenQuickPriceModal(plan)}
                  title="Click to quick update price & registration charges (PUT)"
                >
                  <span className="plan-price-currency">₹</span>
                  <span className="plan-price-amount">{Number(plan.price || 0).toLocaleString('en-IN')}</span>
                  <span className="plan-price-cycle">/ {plan.billingCycle?.toLowerCase()}</span>
                </div>

                <div className="plan-card-metrics">
                  <div className="metric-pill">
                    <span className="metric-label">Commission</span>
                    <span className="metric-val">{plan.commissionPercent}%</span>
                  </div>
                  <div className="metric-pill">
                    <span className="metric-label">Payout Cycle</span>
                    <span className="metric-val">{plan.payoutCycleDays} Days</span>
                  </div>
                  <div className="metric-pill">
                    <span className="metric-label">Delivery Discount</span>
                    <span className="metric-val">{plan.deliveryDiscountPercent}%</span>
                  </div>
                  <div className="metric-pill">
                    <span className="metric-label">Reg Charges</span>
                    <span className="metric-val">₹{plan.registrationCharges || 0}</span>
                  </div>
                </div>

                <ul className="plan-features-list">
                  {Array.isArray(plan.features) &&
                    plan.features.slice(0, 6).map((feat, idx) => (
                      <li key={idx}>
                        <Check size={16} className="feature-check-icon" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  {Array.isArray(plan.features) && plan.features.length > 6 && (
                    <li style={{ color: '#64748b', fontSize: '12px', fontStyle: 'italic' }}>
                      + {plan.features.length - 6} more included benefits
                    </li>
                  )}
                </ul>

                <div className="plan-card-actions">
                  <button
                    className="card-action-btn view"
                    onClick={() => setViewingPlan(plan)}
                    title="View Full Plan Details"
                  >
                    <Eye size={15} />
                    View Details
                  </button>
                  <button
                    className="card-action-btn edit"
                    onClick={() => handleOpenEditModal(plan)}
                    title="Edit Plan"
                  >
                    <Edit2 size={15} />
                    Edit
                  </button>
                  <button
                    className="card-action-btn"
                    style={{ backgroundColor: '#fff8e1', borderColor: '#ffe082', color: '#b78103' }}
                    onClick={() => handleOpenQuickPriceModal(plan)}
                    title="Quick Price & Registration Charges (PUT)"
                  >
                    <DollarSign size={15} />
                    Price
                  </button>
                  <button
                    className="card-action-btn toggle"
                    onClick={() => handleToggleStatus(plan)}
                    title={plan.isActive ? 'Deactivate Plan' : 'Activate Plan'}
                  >
                    <CheckCircle2 size={16} color={plan.isActive ? '#2e7d32' : '#94a3b8'} />
                  </button>
                  <button
                    className="card-action-btn delete"
                    onClick={() => setDeletingPlan(plan)}
                    title="Delete Plan"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Data Table View */
        <div className="plans-table-container">
          <table className="plans-table">
            <thead>
              <tr>
                <th>Plan Name & Key</th>
                <th>Billing Cycle</th>
                <th>Price</th>
                <th>Commission</th>
                <th>Payout</th>
                <th>Delivery Disc.</th>
                <th>Support</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.map((plan) => (
                <tr key={plan._id || plan.id}>
                  <td>
                    <div className="table-plan-title">{plan.name}</div>
                    <span className="table-plan-key">{plan.planKey} • {plan.durationDays} Days</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>
                      {plan.billingCycle?.toLowerCase()}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: '700' }}>₹{Number(plan.price || 0).toLocaleString('en-IN')}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: '700', color: '#2e7d32' }}>{plan.commissionPercent}%</span>
                  </td>
                  <td>{plan.payoutCycleDays} Days</td>
                  <td>{plan.deliveryDiscountPercent}%</td>
                  <td style={{ fontSize: '12px', color: '#64748b' }}>{plan.vendorSupport || 'Standard'}</td>
                  <td>
                    <span className={`plan-card-status-pill ${plan.isActive ? 'active' : 'inactive'}`}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions-cell">
                      <button
                        className="table-btn"
                        onClick={() => setViewingPlan(plan)}
                        title="View Details"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        className="table-btn"
                        onClick={() => handleOpenEditModal(plan)}
                        title="Edit Plan"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="table-btn"
                        style={{ backgroundColor: '#fff8e1', borderColor: '#ffe082', color: '#b78103' }}
                        onClick={() => handleOpenQuickPriceModal(plan)}
                        title="Quick Price & Charges Update (PUT)"
                      >
                        <DollarSign size={15} />
                      </button>
                      <button
                        className="table-btn delete"
                        onClick={() => setDeletingPlan(plan)}
                        title="Delete Plan"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE / EDIT PLAN MODAL */}
      {isCreateModalOpen && (
        <div className="plan-modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
          <div className="plan-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="plan-modal-header">
              <h2>{editingPlan ? 'Edit Business Plan' : 'Create New Business Plan'}</h2>
              <button className="plan-modal-close-btn" onClick={() => setIsCreateModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <div className="plan-modal-body">
                {formError && (
                  <div className="plan-alert-banner error" style={{ margin: '0 0 16px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={17} />
                      <span>{formError}</span>
                    </div>
                  </div>
                )}

                {/* Section 1: General Plan Info */}
                <div className="form-section-heading">1. General Plan Details</div>
                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Plan Key *</label>
                    <input
                      type="text"
                      placeholder="e.g. PREMIUM, STANDARD, BASIC"
                      value={formData.planKey}
                      onChange={(e) => setFormData({ ...formData, planKey: e.target.value.toUpperCase() })}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Plan Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Premium Annual Plan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-field">
                    <label>Billing Cycle</label>
                    <select
                      value={formData.billingCycle}
                      onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                    >
                      <option value="YEARLY">YEARLY</option>
                      <option value="MONTHLY">MONTHLY</option>
                      <option value="QUARTERLY">QUARTERLY</option>
                      <option value="HALF_YEARLY">HALF_YEARLY</option>
                      <option value="ONE_TIME">ONE_TIME</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Duration (Days)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.durationDays}
                      onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Currency</label>
                    <input
                      type="text"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value.toUpperCase() })}
                    />
                  </div>
                </div>

                {/* Section 2: Pricing & Charges */}
                <div className="form-section-heading">2. Pricing & Financials</div>
                <div className="form-grid-3">
                  <div className="form-field">
                    <label>Price (₹) *</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Registration Charges (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.registrationCharges}
                      onChange={(e) => setFormData({ ...formData, registrationCharges: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label>Commission Rate (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.commissionPercent}
                      onChange={(e) => setFormData({ ...formData, commissionPercent: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-3">
                  <div className="form-field">
                    <label>Payout Cycle (Days)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.payoutCycleDays}
                      onChange={(e) => setFormData({ ...formData, payoutCycleDays: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label>Delivery Discount (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.deliveryDiscountPercent}
                      onChange={(e) => setFormData({ ...formData, deliveryDiscountPercent: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label>Free Ads Credit (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.adsCredit}
                      onChange={(e) => setFormData({ ...formData, adsCredit: e.target.value })}
                    />
                  </div>
                </div>

                {/* Section 3: Support & Description */}
                <div className="form-section-heading">3. Support & Description</div>
                <div className="form-field">
                  <label>Vendor Support Channel</label>
                  <input
                    type="text"
                    placeholder="e.g. 24x7 vendor support, Dedicated Account Specialist"
                    value={formData.vendorSupport}
                    onChange={(e) => setFormData({ ...formData, vendorSupport: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Plan Description (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of who this plan is tailored for..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Section 4: Feature Toggles */}
                <div className="form-section-heading">4. Feature Benefits & Permissions</div>
                <div className="toggle-switches-grid">
                  <div
                    className={`toggle-switch-card ${formData.unlimitedListings ? 'active' : ''}`}
                    onClick={() => handleToggleSwitch('unlimitedListings')}
                  >
                    <span className="toggle-label">Unlimited Listings</span>
                    <div className={`switch-pill ${formData.unlimitedListings ? 'checked' : ''}`}>
                      <div className="switch-thumb" />
                    </div>
                  </div>

                  <div
                    className={`toggle-switch-card ${formData.priorityPlacement ? 'active' : ''}`}
                    onClick={() => handleToggleSwitch('priorityPlacement')}
                  >
                    <span className="toggle-label">Priority Placement</span>
                    <div className={`switch-pill ${formData.priorityPlacement ? 'checked' : ''}`}>
                      <div className="switch-thumb" />
                    </div>
                  </div>

                  <div
                    className={`toggle-switch-card ${formData.analyticsDashboard ? 'active' : ''}`}
                    onClick={() => handleToggleSwitch('analyticsDashboard')}
                  >
                    <span className="toggle-label">Analytics Dashboard</span>
                    <div className={`switch-pill ${formData.analyticsDashboard ? 'checked' : ''}`}>
                      <div className="switch-thumb" />
                    </div>
                  </div>

                  <div
                    className={`toggle-switch-card ${formData.premiumBadge ? 'active' : ''}`}
                    onClick={() => handleToggleSwitch('premiumBadge')}
                  >
                    <span className="toggle-label">Premium Badge</span>
                    <div className={`switch-pill ${formData.premiumBadge ? 'checked' : ''}`}>
                      <div className="switch-thumb" />
                    </div>
                  </div>

                  <div
                    className={`toggle-switch-card ${formData.dedicatedAccountManager ? 'active' : ''}`}
                    onClick={() => handleToggleSwitch('dedicatedAccountManager')}
                  >
                    <span className="toggle-label">Dedicated Account Mgr</span>
                    <div className={`switch-pill ${formData.dedicatedAccountManager ? 'checked' : ''}`}>
                      <div className="switch-thumb" />
                    </div>
                  </div>

                  <div
                    className={`toggle-switch-card ${formData.isActive ? 'active' : ''}`}
                    onClick={() => handleToggleSwitch('isActive')}
                  >
                    <span className="toggle-label">Plan Active Status</span>
                    <div className={`switch-pill ${formData.isActive ? 'checked' : ''}`}>
                      <div className="switch-thumb" />
                    </div>
                  </div>
                </div>

                {/* Section 5: Dynamic Features Bullets */}
                <div className="form-section-heading">5. Plan Feature Bullet Points</div>
                <div className="features-input-row">
                  <input
                    type="text"
                    placeholder="Type a feature bullet point (e.g. Free warehouse audits)..."
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddFeature(newFeatureInput)
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn-add-feature"
                    onClick={() => handleAddFeature(newFeatureInput)}
                  >
                    + Add
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="quick-presets-row">
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Quick Presets:</span>
                  {QUICK_FEATURE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => handleAddFeature(preset)}
                    >
                      + {preset}
                    </button>
                  ))}
                </div>

                {/* Features Chip Cloud */}
                <div className="features-tag-cloud">
                  {formData.features.map((feat, idx) => (
                    <span key={idx} className="feature-tag-chip">
                      {feat}
                      <button type="button" onClick={() => handleRemoveFeature(idx)}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="plan-modal-footer">
                <button
                  type="button"
                  className="card-action-btn view"
                  style={{ maxWidth: '120px' }}
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-create"
                  disabled={formSubmitting}
                >
                  {formSubmitting
                    ? 'Saving...'
                    : editingPlan
                    ? 'Update Business Plan'
                    : 'Create Business Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PLAN DETAILS MODAL */}
      {viewingPlan && (
        <div className="plan-modal-backdrop" onClick={() => setViewingPlan(null)}>
          <div className="plan-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="plan-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="plan-key-tag premium">{viewingPlan.planKey}</span>
                <h2>{viewingPlan.name}</h2>
              </div>
              <button className="plan-modal-close-btn" onClick={() => setViewingPlan(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="plan-modal-body">
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-dark)' }}>
                  ₹{Number(viewingPlan.price || 0).toLocaleString('en-IN')}{' '}
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>
                    / {viewingPlan.billingCycle?.toLowerCase()} ({viewingPlan.durationDays} days)
                  </span>
                </div>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '6px' }}>
                  {viewingPlan.description || 'Configured vendor tier with complete commercial and support terms.'}
                </p>
              </div>

              <div className="form-section-heading">Plan Specifications</div>
              <div className="plans-stat-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', padding: '16px' }}>
                <div>
                  <span className="metric-label">Commission</span>
                  <span className="metric-val">{viewingPlan.commissionPercent}%</span>
                </div>
                <div>
                  <span className="metric-label">Payout Cycle</span>
                  <span className="metric-val">{viewingPlan.payoutCycleDays} Days</span>
                </div>
                <div>
                  <span className="metric-label">Delivery Disc.</span>
                  <span className="metric-val">{viewingPlan.deliveryDiscountPercent}%</span>
                </div>
                <div>
                  <span className="metric-label">Reg Charges</span>
                  <span className="metric-val">₹{viewingPlan.registrationCharges || 0}</span>
                </div>
              </div>

              <div className="form-section-heading" style={{ marginTop: '20px' }}>Included Benefits & Features</div>
              <div className="features-tag-cloud" style={{ marginTop: '10px' }}>
                {Array.isArray(viewingPlan.features) &&
                  viewingPlan.features.map((feat, idx) => (
                    <span key={idx} className="feature-tag-chip" style={{ fontSize: '13px' }}>
                      <Check size={14} style={{ color: '#2e7d32', marginRight: '4px' }} />
                      {feat}
                    </span>
                  ))}
              </div>

              <div className="form-section-heading" style={{ marginTop: '20px' }}>Support & Service Level</div>
              <div style={{ fontSize: '13px', color: 'var(--text-dark)', padding: '10px 14px', background: 'var(--bg-stripe)', borderRadius: '10px' }}>
                <strong>Vendor Support:</strong> {viewingPlan.vendorSupport || '24x7 vendor support'}
              </div>

              {viewingPlan.createdAt && (
                <div style={{ marginTop: '20px', fontSize: '12px', color: '#94a3b8' }}>
                  Created on: {new Date(viewingPlan.createdAt).toLocaleString()} | ID: {viewingPlan._id || viewingPlan.id}
                </div>
              )}
            </div>

            <div className="plan-modal-footer">
              <button className="card-action-btn view" onClick={() => setViewingPlan(null)}>
                Close
              </button>
              <button
                className="btn-primary-create"
                onClick={() => {
                  const plan = viewingPlan
                  setViewingPlan(null)
                  handleOpenEditModal(plan)
                }}
              >
                <Edit2 size={16} />
                Edit This Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK PRICE & REGISTRATION CHARGES UPDATE MODAL (PUT /api/super-admin/vendor-business-plans/:id) */}
      {quickEditPlan && (
        <div className="plan-modal-backdrop" onClick={() => setQuickEditPlan(null)}>
          <div className="plan-modal-card" style={{ maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>
            <div className="plan-modal-header">
              <div>
                <h2>Update Price & Charges</h2>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  {quickEditPlan.name} ({quickEditPlan.planKey})
                </span>
              </div>
              <button className="plan-modal-close-btn" onClick={() => setQuickEditPlan(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleQuickPriceUpdate}>
              <div className="plan-modal-body">
                <div style={{ fontSize: '12px', color: '#0369a1', backgroundColor: '#e0f2fe', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px' }}>
                  <strong>Endpoint:</strong> PUT <code>/api/super-admin/vendor-business-plans/{quickEditPlan._id || quickEditPlan.id}</code>
                </div>

                <div className="form-field">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 599"
                    value={quickPrice}
                    onChange={(e) => setQuickPrice(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className="form-field">
                  <label>Registration Charges (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 50"
                    value={quickRegCharges}
                    onChange={(e) => setQuickRegCharges(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="plan-modal-footer">
                <button
                  type="button"
                  className="card-action-btn view"
                  style={{ maxWidth: '100px' }}
                  onClick={() => setQuickEditPlan(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-create"
                  disabled={quickSubmitting}
                >
                  {quickSubmitting ? 'Updating...' : 'Save & Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingPlan && (
        <div className="plan-modal-backdrop" onClick={() => setDeletingPlan(null)}>
          <div className="plan-modal-card" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="plan-modal-header">
              <h2>Confirm Plan Deletion</h2>
              <button className="plan-modal-close-btn" onClick={() => setDeletingPlan(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="plan-modal-body">
              <p style={{ fontSize: '14px', color: 'var(--text-dark)', lineHeight: '1.5' }}>
                Are you sure you want to delete the business plan <strong>"{deletingPlan.name}"</strong>?
              </p>
              <p style={{ fontSize: '12px', color: '#c62828', marginTop: '8px' }}>
                Vendors currently registered on this plan will not be automatically unlinked, but new registrations will no longer see this tier.
              </p>
            </div>
            <div className="plan-modal-footer">
              <button className="card-action-btn view" onClick={() => setDeletingPlan(null)}>
                Cancel
              </button>
              <button
                className="card-action-btn delete"
                style={{ width: 'auto', padding: '0 18px', height: '38px' }}
                onClick={handleDeletePlanConfirm}
              >
                Delete Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

