import React, { useState, useRef } from 'react'
import {
  Tag,
  Ticket,
  CheckCircle2,
  Clock,
  Search,
  ChevronDown,
  Plus,
  Eye,
  Edit,
  Trash2,
  X,
  Upload,
  Calendar,
  ChevronLeft,
  MapPin,
  Percent,
} from 'lucide-react'
import './OffersCoupons.css'

/* ─────────────────────────────────────────
   Mock Data
───────────────────────────────────────── */
const INITIAL_OFFERS = [
  {
    id: 1,
    srNo: 1,
    name: 'Season Sale',
    subtitle: 'Fashion',
    value: '20% off Fashion',
    status: 'Sheduled',
    location: 'Home',
    tags: 'Dresses, Shirts, Sarees, Dupattas, Tops, Kids Wear, Jeans',
    startDate: '2026-06-01',
    endDate: '2026-06-11',
    description: '20% off Fashion',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600&h=200',
  },
  {
    id: 2,
    srNo: 4,
    name: 'Electronics Mega Deal',
    subtitle: 'BOAT',
    value: 'Up to 35% off',
    status: 'Ending',
    location: 'Home',
    tags: 'Wireless, Headphones, Noise Cancellation, Bluetooth, Black',
    startDate: '2026-05-11',
    endDate: '2026-05-25',
    description: 'Rockerz headphone upto 35% OFF',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600&h=200',
  },
  {
    id: 3,
    srNo: 5,
    name: 'Samsung Sale',
    subtitle: 'SAMSUNG',
    value: 'Just at ₹ 43,999',
    status: 'Active',
    location: 'Home',
    tags: 'Samsung, Galaxy, Phones, Smart Phones, Deal',
    startDate: '2026-05-22',
    endDate: '2026-06-09',
    description: 'Galaxy S25 FE Just ₹ 43,999',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600&h=200',
  },
  {
    id: 4,
    srNo: 6,
    name: 'Mega Clearance',
    subtitle: 'Fashion',
    value: 'Flat 50% Off Everything',
    status: 'Active',
    location: 'Home',
    tags: 'Sale, Clothing, Accessories',
    startDate: '2026-07-01',
    endDate: '2026-07-15',
    description: 'Flat 50% Off Everything',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600&h=200',
  },
  {
    id: 5,
    srNo: 7,
    name: 'Sports Shoes Discount',
    subtitle: 'Nike',
    value: 'Buy 1 Get 1 Free',
    status: 'Sheduled',
    location: 'Home',
    tags: 'Shoes, Activewear, Nike',
    startDate: '2026-08-01',
    endDate: '2026-08-10',
    description: 'Nike sport shoes BOGO Deal',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600&h=200',
  },
  {
    id: 6,
    srNo: 8,
    name: 'Watch Collection Sale',
    subtitle: 'Fossil',
    value: 'Up to 40% Off',
    status: 'Active',
    location: 'Home',
    tags: 'Watches, Fashion, Fossil',
    startDate: '2026-07-10',
    endDate: '2026-07-25',
    description: 'Fossil watches mega deal',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600&h=200',
  },
  {
    id: 7,
    srNo: 9,
    name: 'Beauty Care Combo',
    subtitle: 'Nykaa',
    value: 'Just at ₹ 999',
    status: 'Ending',
    location: 'Home',
    tags: 'Nykaa, Beauty, Skincare, Makeup',
    startDate: '2026-06-25',
    endDate: '2026-07-05',
    description: 'Nykaa best beauty care combo set',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=600&h=200',
  },
  {
    id: 8,
    srNo: 10,
    name: 'Kitchen Appliance Deal',
    subtitle: 'Prestige',
    value: 'Save up to ₹ 2,000',
    status: 'Sheduled',
    location: 'Home',
    tags: 'Home, Kitchen, Prestige',
    startDate: '2026-09-01',
    endDate: '2026-09-15',
    description: 'Prestige smart kitchen appliances sale',
    image: 'https://images.unsplash.com/photo-1576016770956-debb63d90029?auto=format&fit=crop&q=80&w=600&h=200',
  },
]

const INITIAL_COUPONS = [
  {
    id: 101,
    srNo: 1,
    code: 'SUMMER25',
    discount: '25%',
    startDate: '2026-06-01',
    endDate: '2026-06-11',
    status: 'Sheduled',
    location: 'Home',
  },
  {
    id: 102,
    srNo: 4,
    code: 'OLDCODE',
    discount: '15%',
    startDate: '2026-05-11',
    endDate: '2026-05-25',
    status: 'Ending',
    location: 'Home',
  },
  {
    id: 103,
    srNo: 5,
    code: 'WELCOME10',
    discount: '10%',
    startDate: '-',
    endDate: '-',
    status: 'Active',
    location: 'Home',
  },
  {
    id: 104,
    srNo: 6,
    code: 'SAVE50',
    discount: '50%',
    startDate: '2026-07-01',
    endDate: '2026-07-15',
    status: 'Active',
    location: 'Home',
  },
  {
    id: 105,
    srNo: 7,
    code: 'FESTIVE30',
    discount: '30%',
    startDate: '2026-10-01',
    endDate: '2026-10-15',
    status: 'Sheduled',
    location: 'Home',
  },
  {
    id: 106,
    srNo: 8,
    code: 'HOLIDAY15',
    discount: '15%',
    startDate: '2026-12-15',
    endDate: '2026-12-31',
    status: 'Sheduled',
    location: 'Home',
  },
  {
    id: 107,
    srNo: 9,
    code: 'FREESHIP',
    discount: 'Free Delivery',
    startDate: '-',
    endDate: '-',
    status: 'Active',
    location: 'Home',
  },
  {
    id: 108,
    srNo: 10,
    code: 'CASHBACK10',
    discount: '10% Cashback',
    startDate: '2026-06-15',
    endDate: '2026-07-15',
    status: 'Ending',
    location: 'Home',
  },
]

/* ─────────────────────────────────────────
   Helper: Format Date as "Jun 1 2026"
───────────────────────────────────────── */
const formatDateNoComma = (dateStr) => {
  if (!dateStr || dateStr === '-') return '-'
  const dateObj = new Date(dateStr)
  if (isNaN(dateObj)) return dateStr
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[dateObj.getMonth()]} ${dateObj.getDate()} ${dateObj.getFullYear()}`
}

/* ─────────────────────────────────────────
   Countdown Timer Component for Scheduled items
───────────────────────────────────────── */
function CountdownTimer({ targetDate }) {
  const calculateTimeLeft = () => {
    if (!targetDate || targetDate === '-') {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }
    const difference = +new Date(targetDate) - +new Date()
    let timeLeft = {}

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }
    return timeLeft
  }

  const [timeLeft, setTimeLeft] = React.useState(calculateTimeLeft())

  React.useEffect(() => {
    // Initial run
    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="countdown-timer-banner">
      <span className="timer-label">Starts In:</span>
      <div className="timer-digits-row">
        <div className="timer-digit-box">
          <span className="digit-num">{timeLeft.days}</span>
          <span className="digit-lbl">Days</span>
        </div>
        <div className="timer-digit-box">
          <span className="digit-num">{timeLeft.hours}</span>
          <span className="digit-lbl">Hrs</span>
        </div>
        <div className="timer-digit-box">
          <span className="digit-num">{timeLeft.minutes}</span>
          <span className="digit-lbl">Mins</span>
        </div>
        <div className="timer-digit-box">
          <span className="digit-num">{timeLeft.seconds}</span>
          <span className="digit-lbl">Secs</span>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   View Details Sub-View for Offers
───────────────────────────────────────── */
function ViewOfferDetail({ offer, onBack }) {
  const tagsList = offer.tags ? offer.tags.split(',').map((t) => t.trim()) : []

  return (
    <div className="view-offer-detail-container">
      {/* Detail Header */}
      <div className="view-offer-header">
        <button className="back-circle-btn" onClick={onBack} aria-label="Back to offers list">
          <ChevronLeft style={{ width: '18px', height: '18px' }} />
        </button>
        <h2>View Offer</h2>
      </div>

      <div className="offer-detail-main-layout">
        {/* Left Column */}
        <div className="offer-detail-left-col">
          <div className="detail-banner-card">
            <img src={offer.image} alt={offer.name} className="detail-banner-img" />
          </div>

          <div className="detail-info-card">
            <h3>Offer Details</h3>
            
            <div className="detail-field-row">
              <div className="detail-field-left">
                <Tag className="detail-field-icon" style={{ width: '16px', height: '16px', color: '#607d8b' }} />
                <span className="field-label">Offer Name</span>
              </div>
              <span className="field-value">{offer.name}</span>
            </div>

            <div className="detail-field-row">
              <div className="detail-field-left">
                <Percent className="detail-field-icon" style={{ width: '16px', height: '16px', color: '#607d8b' }} />
                <span className="field-label">Value</span>
              </div>
              <span className="field-value">{offer.value}</span>
            </div>

            <div className="detail-field-row">
              <div className="detail-field-left">
                <MapPin className="detail-field-icon" style={{ width: '16px', height: '16px', color: '#607d8b' }} />
                <span className="field-label">Location</span>
              </div>
              <span className="field-value">{offer.location}</span>
            </div>

            <div className="detail-field-row">
              <div className="detail-field-left">
                <Calendar className="detail-field-icon" style={{ width: '16px', height: '16px', color: '#607d8b' }} />
                <span className="field-label">Start Date</span>
              </div>
              <span className="field-value">{formatDateNoComma(offer.startDate)}</span>
            </div>

            <div className="detail-field-row">
              <div className="detail-field-left">
                <Calendar className="detail-field-icon" style={{ width: '16px', height: '16px', color: '#607d8b' }} />
                <span className="field-label">End Date</span>
              </div>
              <span className="field-value">{formatDateNoComma(offer.endDate)}</span>
            </div>

          </div>

          {offer.status && (offer.status.toLowerCase() === 'sheduled' || offer.status.toLowerCase() === 'scheduled') && (
            <CountdownTimer targetDate={offer.startDate} />
          )}
        </div>

        {/* Right Column */}
        <div className="offer-detail-right-col">
          <div className="right-col-header-info">
            <div className="right-col-meta">
              <span className="offer-brand-subtitle">{offer.subtitle || 'Promo'}</span>
              <span className={`offer-status-badge ${offer.status.toLowerCase()}`}>{offer.status}</span>
            </div>
            <h2>{offer.name}</h2>
            <p className="offer-desc-text">{offer.description}</p>
          </div>

          <div className="additional-info-card">
            <h3>Additional Information</h3>
            <div className="info-tags-section">
              <span className="info-section-title">Tag</span>
              <div className="info-tags-list">
                {tagsList.map((tag, idx) => (
                  <span key={idx} className="info-tag-badge">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="info-availability-section">
              <span className="info-section-title">Availability</span>
              <span className="availability-status">In Stock</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   View Details Sub-View for Coupons
───────────────────────────────────────── */
function ViewCouponDetail({ coupon, onBack }) {
  return (
    <div className="view-offer-detail-container">
      {/* Detail Header */}
      <div className="view-offer-header">
        <button className="back-circle-btn" onClick={onBack} aria-label="Back to coupons list">
          <ChevronLeft style={{ width: '18px', height: '18px' }} />
        </button>
        <h2>View Coupons</h2>
      </div>

      <div className="coupon-detail-main-layout">
        {/* Top Header Card */}
        <div className="coupon-header-banner-card">
          <div className="coupon-code-meta-left">
            <div className="coupon-icon-rounded-bg">
              <Ticket style={{ width: '20px', height: '20px', color: '#9c27b0' }} />
            </div>
            <span className="coupon-banner-code-txt">{coupon.code}</span>
          </div>
          <span className={`offer-status-badge ${coupon.status.toLowerCase()}`}>{coupon.status}</span>
        </div>

        {coupon.status && (coupon.status.toLowerCase() === 'sheduled' || coupon.status.toLowerCase() === 'scheduled') && (
          <CountdownTimer targetDate={coupon.startDate} />
        )}

        {/* Bottom Details Card */}
        <div className="detail-info-card" style={{ marginTop: '20px' }}>
          <h3>Coupon Details</h3>

          <div className="detail-field-row">
            <div className="detail-field-left">
              <Tag className="detail-field-icon" style={{ width: '16px', height: '16px', color: '#607d8b' }} />
              <span className="field-label">Coupon Code</span>
            </div>
            <span className="field-value">{coupon.code}</span>
          </div>

          <div className="detail-field-row">
            <div className="detail-field-left">
              <Percent className="detail-field-icon" style={{ width: '16px', height: '16px', color: '#607d8b' }} />
              <span className="field-label">Discount</span>
            </div>
            <span className="field-value">{coupon.discount}</span>
          </div>

          <div className="detail-field-row">
            <div className="detail-field-left">
              <MapPin className="detail-field-icon" style={{ width: '16px', height: '16px', color: '#607d8b' }} />
              <span className="field-label">Location</span>
            </div>
            <span className="field-value">{coupon.location}</span>
          </div>

          <div className="detail-field-row">
            <div className="detail-field-left">
              <Calendar className="detail-field-icon" style={{ width: '16px', height: '16px', color: '#607d8b' }} />
              <span className="field-label">Start Date</span>
            </div>
            <span className="field-value">{formatDateNoComma(coupon.startDate)}</span>
          </div>

          <div className="detail-field-row">
            <div className="detail-field-left">
              <Calendar className="detail-field-icon" style={{ width: '16px', height: '16px', color: '#607d8b' }} />
              <span className="field-label">End Date</span>
            </div>
            <span className="field-value">{formatDateNoComma(coupon.endDate)}</span>
          </div>

        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
function OffersCoupons() {
  const [activeTab, setActiveTab] = useState('Offers')
  const [offersList, setOffersList] = useState(INITIAL_OFFERS)
  const [couponsList, setCouponsList] = useState(INITIAL_COUPONS)
  const fileInputRef = useRef(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // View states
  const [viewedOffer, setViewedOffer] = useState(null)
  const [viewedCoupon, setViewedCoupon] = useState(null)

  // Modals state
  const [isAdding, setIsAdding] = useState(false)
  const [editingOffer, setEditingOffer] = useState(null)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [deletingItem, setDeletingItem] = useState(null)

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    location: '',
    tags: '',
    startDate: '',
    endDate: '',
    description: '',
    image: '',
    code: '',
    discount: '',
    status: '',
  })

  // Open Add modal
  const handleOpenAdd = () => {
    setFormData({
      name: '',
      value: '',
      location: '',
      tags: '',
      startDate: '',
      endDate: '',
      description: '',
      image: '',
      code: '',
      discount: '',
      status: 'Active',
    })
    setIsAdding(true)
  }

  // Open Edit modal
  const handleOpenEdit = (item, type) => {
    if (type === 'offer') {
      setEditingOffer(item)
      setFormData({
        name: item.name,
        value: item.value,
        location: item.location,
        tags: item.tags,
        startDate: item.startDate,
        endDate: item.endDate,
        description: item.description,
        image: item.image,
        status: item.status,
      })
    } else {
      setEditingCoupon(item)
      setFormData({
        code: item.code,
        discount: item.discount,
        location: item.location,
        startDate: item.startDate === '-' ? '' : item.startDate,
        endDate: item.endDate === '-' ? '' : item.endDate,
        status: item.status,
      })
    }
  }

  // Add submission
  const handleAddSubmit = (e) => {
    e.preventDefault()
    if (activeTab === 'Offers') {
      const newOffer = {
        id: Date.now(),
        srNo: offersList.length + 1,
        name: formData.name,
        subtitle: 'Promo',
        value: formData.value,
        status: formData.status || 'Active',
        location: formData.location || 'Home',
        tags: formData.tags,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description || formData.value,
        image: formData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600&h=200',
      }
      setOffersList([...offersList, newOffer])
    } else {
      const newCoupon = {
        id: Date.now(),
        srNo: couponsList.length + 1,
        code: formData.code,
        discount: formData.discount,
        location: formData.location || 'Home',
        startDate: formData.startDate || '-',
        endDate: formData.endDate || '-',
        status: formData.status || 'Active',
      }
      setCouponsList([...couponsList, newCoupon])
    }
    setIsAdding(false)
    setCurrentPage(1)
  }

  // Edit submission
  const handleEditSubmit = (e) => {
    e.preventDefault()
    if (activeTab === 'Offers') {
      setOffersList(
        offersList.map((o) =>
          o.id === editingOffer.id
            ? {
                ...o,
                name: formData.name,
                value: formData.value,
                location: formData.location,
                tags: formData.tags,
                startDate: formData.startDate,
                endDate: formData.endDate,
                description: formData.description,
                image: formData.image,
                status: formData.status,
              }
            : o
        )
      )
      setEditingOffer(null)
    } else {
      setCouponsList(
        couponsList.map((c) =>
          c.id === editingCoupon.id
            ? {
                ...c,
                code: formData.code,
                discount: formData.discount,
                location: formData.location,
                startDate: formData.startDate || '-',
                endDate: formData.endDate || '-',
                status: formData.status,
              }
            : c
        )
      )
      setEditingCoupon(null)
    }
  }

  // Delete Item
  const handleDeleteItem = (id, type) => {
    setDeletingItem({ id, type })
  }

  const handleConfirmDelete = () => {
    if (!deletingItem) return
    const { id, type } = deletingItem
    if (type === 'offer') {
      setOffersList(offersList.filter((o) => o.id !== id))
    } else {
      setCouponsList(couponsList.filter((c) => c.id !== id))
    }
    setDeletingItem(null)
    setCurrentPage(1)
  }

  // Handle local image upload click and changes
  const handleImageUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Filtering
  const filteredOffers = offersList.filter((o) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q || o.name.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
    const matchesStatus = !statusFilter || o.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const filteredCoupons = couponsList.filter((c) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q || c.code.toLowerCase().includes(q) || c.discount.toLowerCase().includes(q)
    const matchesStatus = !statusFilter || c.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  // Sliced data for current page
  const totalItems = activeTab === 'Offers' ? filteredOffers.length : filteredCoupons.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  
  const paginatedOffers = filteredOffers.slice(startIndex, startIndex + itemsPerPage)
  const paginatedCoupons = filteredCoupons.slice(startIndex, startIndex + itemsPerPage)

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  if (viewedOffer) {
    return <ViewOfferDetail offer={viewedOffer} onBack={() => setViewedOffer(null)} />
  }

  if (viewedCoupon) {
    return <ViewCouponDetail coupon={viewedCoupon} onBack={() => setViewedCoupon(null)} />
  }

  const totalOffersCount = offersList.length
  const totalCouponsCount = couponsList.length
  const activeOffersCount = offersList.filter((o) => o.status === 'Active').length
  const activeCouponsCount = couponsList.filter((c) => c.status === 'Active').length

  return (
    <div className="offers-coupons-view">
      {/* Title */}
      <div className="offers-title-header">
        <h1>Offers & Coupons</h1>
        <p>Manage all the offers & coupons</p>
      </div>

      {/* Stats row */}
      <div className="offers-stats-grid">
        <div 
          className={`offers-stat-card card-yellow clickable ${activeTab === 'Offers' && statusFilter === '' ? 'active-filter' : ''}`}
          onClick={() => { setActiveTab('Offers'); setStatusFilter(''); setCurrentPage(1); }}
          style={{ cursor: 'pointer', color: '#3b82f6' }}
        >
          <div className="offers-stat-icon icon-yellow">
            <Tag />
          </div>
          <div className="offers-stat-value">{totalOffersCount}</div>
          <div className="offers-stat-label">Total Offer</div>
        </div>

        <div 
          className={`offers-stat-card card-green clickable ${activeTab === 'Coupons' && statusFilter === '' ? 'active-filter' : ''}`}
          onClick={() => { setActiveTab('Coupons'); setStatusFilter(''); setCurrentPage(1); }}
          style={{ cursor: 'pointer', color: '#3b82f6' }}
        >
          <div className="offers-stat-icon icon-green">
            <Ticket />
          </div>
          <div className="offers-stat-value">{totalCouponsCount}</div>
          <div className="offers-stat-label">Total Coupons</div>
        </div>

        <div 
          className={`offers-stat-card card-teal clickable ${activeTab === 'Offers' && statusFilter === 'Active' ? 'active-filter' : ''}`}
          onClick={() => { setActiveTab('Offers'); setStatusFilter('Active'); setCurrentPage(1); }}
          style={{ cursor: 'pointer', color: '#2ecc71' }}
        >
          <div className="offers-stat-icon icon-teal">
            <CheckCircle2 />
          </div>
          <div className="offers-stat-value">{activeOffersCount}</div>
          <div className="offers-stat-label">Active Offers</div>
        </div>

        <div 
          className={`offers-stat-card card-pink clickable ${activeTab === 'Coupons' && statusFilter === 'Active' ? 'active-filter' : ''}`}
          onClick={() => { setActiveTab('Coupons'); setStatusFilter('Active'); setCurrentPage(1); }}
          style={{ cursor: 'pointer', color: '#2ecc71' }}
        >
          <div className="offers-stat-icon icon-pink">
            <Clock />
          </div>
          <div className="offers-stat-value">{activeCouponsCount}</div>
          <div className="offers-stat-label">Active Coupons</div>
        </div>
      </div>

      {/* Main filter + tabs block */}
      <div className="dashboard-card-panel offers-tabs-card">
        {/* Tab switcher headers */}
        <div className="offers-tab-headers-row">
          <button
            className={`offers-tab-btn ${activeTab === 'Offers' ? 'active' : ''}`}
            onClick={() => { setActiveTab('Offers'); setCurrentPage(1); }}
          >
            Offers
          </button>
          <button
            className={`offers-tab-btn ${activeTab === 'Coupons' ? 'active' : ''}`}
            onClick={() => { setActiveTab('Coupons'); setCurrentPage(1); }}
          >
            Coupons
          </button>
        </div>

        {/* Tab actions (Filters, search, and Add button) */}
        <div className="table-filter-bar offers-filters-bar">
          <div className="table-search-wrapper" style={{ width: '280px' }}>
            <Search />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <div className="filter-actions-right">
            <div className="orders-select-wrapper">
              <select
                className="status-select"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Sheduled">Scheduled</option>
                <option value="Ending">Ending</option>
              </select>
              <ChevronDown className="select-chevron" />
            </div>

            <button className="add-offer-green-btn" onClick={handleOpenAdd}>
              <Plus style={{ width: '16px', height: '16px' }} />
              {activeTab === 'Offers' ? 'Add Offer' : 'Add Coupon'}
            </button>
          </div>
        </div>

        {/* Offers list rendering */}
        {activeTab === 'Offers' ? (
          <div className="admins-table-wrapper">
            <table className="admins-table offers-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Sr.No.</th>
                  <th>Offer Image</th>
                  <th>Offer Name</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOffers.length > 0 ? (
                  paginatedOffers.map((o) => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: '500' }}>{o.srNo}</td>
                      <td>
                        <img src={o.image} alt={o.name} className="table-offer-banner-img" />
                      </td>
                      <td style={{ fontWeight: '600' }}>{o.name}</td>
                      <td style={{ fontWeight: '500' }}>{o.value}</td>
                      <td>
                        <span className={`offer-status-badge ${o.status.toLowerCase()}`}>
                          {o.status}
                        </span>
                      </td>
                      <td>
                        <div className="offers-actions-row">
                          <button
                            className="offer-action-btn view"
                            onClick={() => setViewedOffer(o)}
                            aria-label="View Offer"
                          >
                            <Eye style={{ width: '16px', height: '16px' }} />
                          </button>
                          <button
                            className="offer-action-btn edit"
                            onClick={() => handleOpenEdit(o, 'offer')}
                            aria-label="Edit Offer"
                          >
                            <Edit style={{ width: '16px', height: '16px' }} />
                          </button>
                          <button
                            className="offer-action-btn delete"
                            onClick={() => handleDeleteItem(o.id, 'offer')}
                            aria-label="Delete Offer"
                          >
                            <Trash2 style={{ width: '16px', height: '16px' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#90a4ae' }}>
                      No offers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Coupons list rendering */
          <div className="admins-table-wrapper">
            <table className="admins-table coupons-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Sr.No.</th>
                  <th>Coupon Code</th>
                  <th>Discount</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCoupons.length > 0 ? (
                  paginatedCoupons.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: '500' }}>{c.srNo}</td>
                      <td style={{ fontWeight: '700', color: '#2e7d32' }}>{c.code}</td>
                      <td style={{ fontWeight: '500' }}>{c.discount}</td>
                      <td>{formatDateNoComma(c.startDate)}</td>
                      <td>{formatDateNoComma(c.endDate)}</td>
                      <td>
                        <span className={`offer-status-badge ${c.status.toLowerCase()}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>
                        <div className="offers-actions-row">
                          <button
                            className="offer-action-btn view"
                            onClick={() => setViewedCoupon(c)}
                            aria-label="View Coupon"
                          >
                            <Eye style={{ width: '16px', height: '16px' }} />
                          </button>
                          <button
                            className="offer-action-btn edit"
                            onClick={() => handleOpenEdit(c, 'coupon')}
                            aria-label="Edit Coupon"
                          >
                            <Edit style={{ width: '16px', height: '16px' }} />
                          </button>
                          <button
                            className="offer-action-btn delete"
                            onClick={() => handleDeleteItem(c.id, 'coupon')}
                            aria-label="Delete Coupon"
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
                      No coupons found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

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

      {/* Add / Edit Form Modal Overlay */}
      {(isAdding || editingOffer || editingCoupon) && (
        <div className="modal-overlay" onClick={() => { setIsAdding(false); setEditingOffer(null); setEditingCoupon(null); }}>
          <div className="offer-form-modal-box" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="offer-modal-header-row">
              <h2>
                {isAdding 
                  ? (activeTab === 'Offers' ? 'Add Offer' : 'Add Coupon') 
                  : (editingOffer ? 'Edit Offer' : 'Edit Coupon')}
              </h2>
              <button
                className="offer-modal-circle-close"
                onClick={() => { setIsAdding(false); setEditingOffer(null); setEditingCoupon(null); }}
              >
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>

            <form onSubmit={isAdding ? handleAddSubmit : handleEditSubmit} className="offer-modal-form">
              {activeTab === 'Offers' ? (
                /* Offers Fields */
                <>
                  <div className="offer-modal-field">
                    <label>Offer Name</label>
                    <input
                      type="text"
                      placeholder="Enter Offer Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="offer-modal-field">
                    <label>Value</label>
                    <input
                      type="text"
                      placeholder="Enter Value"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      required
                    />
                  </div>

                  <div className="offer-modal-form-row">
                    <div className="offer-modal-field flex-1">
                      <label>Location</label>
                      <div className="orders-select-wrapper">
                        <select
                          className="status-select"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        >
                          <option value="">Enter Location</option>
                          <option value="Home">Home</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Fashion">Fashion</option>
                        </select>
                        <ChevronDown className="select-chevron" />
                      </div>
                    </div>

                    <div className="offer-modal-field flex-1">
                      <label>Tags</label>
                      <input
                        type="text"
                        placeholder="Add Tags"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="offer-modal-field">
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <div className="offer-upload-dashed-box" onClick={handleImageUploadClick}>
                      {formData.image ? (
                        <div className="upload-image-preview-container">
                          <img src={formData.image} alt="Preview" className="upload-preview-banner" />
                          <div className="upload-preview-overlay">
                            <Upload style={{ width: '20px', height: '20px' }} />
                            <span>Upload Offer Image</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload style={{ width: '22px', height: '22px', color: '#78909c' }} />
                          <span>Upload Offer Image</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="offer-modal-field">
                    <label>Status</label>
                    <div className="orders-select-wrapper">
                      <select
                        className="status-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="Active">Active</option>
                        <option value="Sheduled">Scheduled</option>
                        <option value="Ending">Ending</option>
                      </select>
                      <ChevronDown className="select-chevron" />
                    </div>
                  </div>
                </>
              ) : (
                /* Coupons Fields */
                <>
                  <div className="offer-modal-field">
                    <label>Coupon Code</label>
                    <input
                      type="text"
                      placeholder="Enter Coupon Code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      required
                    />
                  </div>

                  <div className="offer-modal-field">
                    <label>Discount</label>
                    <input
                      type="text"
                      placeholder="Enter Discount Value"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      required
                    />
                  </div>

                  <div className="offer-modal-field">
                    <label>Location</label>
                    <div className="orders-select-wrapper">
                      <select
                        className="status-select"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      >
                        <option value="">Enter Coupon Location</option>
                        <option value="Home">Home</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                      </select>
                      <ChevronDown className="select-chevron" />
                    </div>
                  </div>

                  <div className="offer-modal-field">
                    <label>Status</label>
                    <div className="orders-select-wrapper">
                      <select
                        className="status-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="Active">Active</option>
                        <option value="Sheduled">Scheduled</option>
                        <option value="Ending">Ending</option>
                      </select>
                      <ChevronDown className="select-chevron" />
                    </div>
                  </div>
                </>
              )}

              {/* Start Date & End Date Row (Used by both) */}
              <div className="offer-modal-form-row">
                <div className="offer-modal-field flex-1">
                  <label>Start Date</label>
                  <div className="date-input-wrapper">
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                    <Calendar className="date-calendar-icon" />
                  </div>
                </div>

                <div className="offer-modal-field flex-1">
                  <label>End Date</label>
                  <div className="date-input-wrapper">
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                    <Calendar className="date-calendar-icon" />
                  </div>
                </div>
              </div>

              {/* Action Buttons Cancel / Add or Save */}
              <div className="offer-modal-buttons-row">
                <button
                  type="button"
                  className="offer-btn-cancel"
                  onClick={() => { setIsAdding(false); setEditingOffer(null); setEditingCoupon(null); }}
                >
                  Cancel
                </button>
                <button type="submit" className="offer-btn-submit">
                  {isAdding ? 'Add' : 'Save'}
                </button>
              </div>
            </form>
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

export default OffersCoupons
