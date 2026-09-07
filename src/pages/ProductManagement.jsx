import React, { useState, useRef, useEffect } from 'react'
import { LayoutGrid, Users, UserCheck, ShieldAlert, Eye, Edit, Trash2, Search, ArrowLeft, Upload, Plus, X, ChevronLeft, ChevronRight, Palette, Calendar, Layers, Tag, Package, CheckCircle2 } from 'lucide-react'
import './ProductManagement.css'


function ProductManagement() {
  // Initial Products List Data
  const [productsList, setProductsList] = useState([
    { 
      id: 1, 
      name: 'Wireless Headphones Pro', 
      vendor: 'Sony Center', 
      category: 'Electronics', 
      status: 'active', 
      price: '12000', 
      stock: 48, 
      brand: 'SoundPro', 
      color: 'White & Blue', 
      tag: 'Wireless, Headphones, Noise Cancellation, Bluetooth, Blue', 
      returnPolicy: '7 Days Replacement', 
      desc: 'Premium wireless headphones with active noise cancellation.', 
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=350&h=350', 
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=350&h=350',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=350&h=350',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=350&h=350'
      ],
      joinedOn: '20 April 2026', 
      sales: 128, 
      checked: false 
    },
    { 
      id: 2, 
      name: 'Leather Hand Bag', 
      vendor: 'Chanel Classic', 
      category: 'Bags', 
      status: 'out-of-stock', 
      price: '6999', 
      stock: 0, 
      brand: 'Chanel Classic', 
      color: 'Brown', 
      tag: 'Lather, Vegan, Easy to carry, Classic, Brown', 
      returnPolicy: '7 Days Replacement', 
      desc: 'Premium Lather Bag for everyday look and meetings.', 
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=350&h=350', 
      images: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=350&h=350',
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=350&h=350',
        'https://images.unsplash.com/photo-1566150905458-1bf1fc15a690?auto=format&fit=crop&q=80&w=350&h=350'
      ],
      joinedOn: '18 April 2026', 
      sales: 56, 
      checked: false 
    },
    { 
      id: 3, 
      name: 'Formal Shirt', 
      vendor: 'A.K.Fashion', 
      category: 'Fashion', 
      status: 'active', 
      price: '2499', 
      stock: 85, 
      brand: 'A.K.Fashion', 
      color: 'White', 
      tag: 'Clothing, Formal, Cotton', 
      returnPolicy: '15 Days Return', 
      desc: '100% premium cotton formal shirt.', 
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=350&h=350', 
      images: [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=350&h=350',
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=350&h=350',
        'https://images.unsplash.com/photo-1620012253295-c05cb3e65df4?auto=format&fit=crop&q=80&w=350&h=350'
      ],
      joinedOn: '15 March 2026', 
      sales: 90, 
      checked: false 
    },
    { 
      id: 4, 
      name: 'Trending Summer Wear', 
      vendor: 'Tommy Hilfiger', 
      category: 'Fashion', 
      status: 'inactive', 
      price: '2999', 
      stock: 50, 
      brand: 'Tommy Hilfiger', 
      color: 'Blue', 
      tag: 'Light, Casual, Summer Wear, Comfortable, Blue', 
      returnPolicy: '7 Days Replacement', 
      desc: 'Comfortable Summer wear Blue dress.', 
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=350&h=350', 
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=350&h=350',
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=350&h=350',
        'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&q=80&w=350&h=350'
      ],
      joinedOn: '18 May 2026', 
      sales: 100, 
      checked: false 
    },
    { 
      id: 5, 
      name: 'Lamp', 
      vendor: 'City Lights', 
      category: 'Home', 
      status: 'active', 
      price: '1899', 
      stock: 40, 
      brand: 'City Lights', 
      color: 'Golden', 
      tag: 'Lighting, Home Decor', 
      returnPolicy: '30 Days Warranty', 
      desc: 'Elegant desk study lamp light.', 
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=350&h=350', 
      images: [
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=350&h=350',
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=350&h=350',
        'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=350&h=350'
      ],
      joinedOn: '12 January 2026', 
      sales: 38, 
      checked: false 
    },
    { 
      id: 6, 
      name: 'Neckless', 
      vendor: 'Dass Jewellers', 
      category: 'Jewellery', 
      status: 'active', 
      price: '95000', 
      stock: 8, 
      brand: 'Dass Jewellers', 
      color: 'Golden Black', 
      tag: 'Jewellery, Premium, Neckless', 
      returnPolicy: 'No Returns', 
      desc: 'Beautiful custom golden necklace pendant.', 
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=350&h=350', 
      images: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=350&h=350',
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=350&h=350',
        'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=350&h=350'
      ],
      joinedOn: '28 February 2026', 
      sales: 14, 
      checked: false 
    },
    { 
      id: 7, 
      name: 'Smart TV', 
      vendor: 'Sony Center', 
      category: 'Electronics', 
      status: 'out-of-stock', 
      price: '35000', 
      stock: 0, 
      brand: 'Sony', 
      color: 'Black', 
      tag: 'Electronics, Smart TV', 
      returnPolicy: '1 Year Warranty', 
      desc: '4K Smart TV screen.', 
      image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=350&h=350', 
      images: [
        'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=350&h=350',
        'https://images.unsplash.com/photo-1461151351977-2244026b8f83?auto=format&fit=crop&q=80&w=350&h=350',
        'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=350&h=350'
      ],
      joinedOn: '10 January 2026', 
      sales: 45, 
      checked: false 
    },
  ])

  // Navigation and overlay states
  const [isAdding, setIsAdding] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProductId, setDeletingProductId] = useState(null)
  const [viewedProduct, setViewedProduct] = useState(null) // customer in details profile view
  const [activeSlideIndex, setActiveSlideIndex] = useState(0) // image slider index

  // Filter lists
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, categoryFilter, statusFilter])

  // Form input states
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    color: '',
    price: '',
    stock: '',
    category: '',
    desc: '',
    tag: '',
    returnPolicy: '',
    isActive: true,
    imagePreviews: []
  })

  const fileInputRef = useRef(null)

  // Dropdown options lists
  const categoriesList = [
    'Fashion', 'Beauty', 'Home', 'Mobiles', 'Electronics', 'Perfumes', 'Handmades', 'Jewellery', 'Watches'
  ]

  // Derive counts
  const totalCount = productsList.length
  const activeCount = productsList.filter(p => p.status === 'active').length
  const outOfStockCount = productsList.filter(p => p.status === 'out-of-stock').length

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked
    setProductsList(productsList.map(p => ({ ...p, checked: isChecked })))
  }

  const handleRowCheckbox = (id) => {
    setProductsList(
      productsList.map(p => p.id === id ? { ...p, checked: !p.checked } : p)
    )
  }

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      files.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            imagePreviews: [...prev.imagePreviews, reader.result]
          }))
        }
        reader.readAsDataURL(file)
      })
    }
  }

  // Reset form inputs
  const handleResetForm = () => {
    setFormData({
      name: '',
      brand: '',
      color: '',
      price: '',
      stock: '',
      category: '',
      desc: '',
      tag: '',
      returnPolicy: '',
      isActive: true,
      imagePreviews: []
    })
  }

  // Handle submit form (Add or Edit)
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.category) return

    let nextStatus = 'inactive'
    if (formData.isActive) {
      nextStatus = parseInt(formData.stock) === 0 ? 'out-of-stock' : 'active'
    } else {
      nextStatus = 'inactive'
    }

    const defaultImages = [
      'https://via.placeholder.com/350',
      'https://via.placeholder.com/350',
      'https://via.placeholder.com/350'
    ]

    const imagesToSave = formData.imagePreviews.length > 0 ? formData.imagePreviews : defaultImages
    const primaryImage = imagesToSave[0]

    if (editingProduct) {
      // Edit Product
      setProductsList(productsList.map(p => {
        if (p.id === editingProduct.id) {
          const updatedProduct = {
            ...p,
            name: formData.name,
            brand: formData.brand,
            color: formData.color,
            price: formData.price,
            stock: parseInt(formData.stock) || 0,
            category: formData.category,
            desc: formData.desc,
            tag: formData.tag,
            returnPolicy: formData.returnPolicy,
            status: nextStatus,
            image: primaryImage,
            images: imagesToSave
          }
          if (viewedProduct && viewedProduct.id === editingProduct.id) {
            setViewedProduct(updatedProduct)
          }
          return updatedProduct
        }
        return p
      }))
    } else {
      // Add Product
      const newProduct = {
        id: Date.now(),
        name: formData.name,
        vendor: 'Super Admin',
        category: formData.category,
        status: nextStatus,
        price: formData.price,
        stock: parseInt(formData.stock) || 0,
        brand: formData.brand,
        color: formData.color,
        tag: formData.tag,
        returnPolicy: formData.returnPolicy,
        desc: formData.desc,
        image: primaryImage,
        images: imagesToSave,
        joinedOn: new Date().toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }),
        sales: 0,
        checked: false
      }
      setProductsList([newProduct, ...productsList])
    }

    handleResetForm()
    setEditingProduct(null)
    setIsAdding(false)
  }

  // Open Edit Mode
  const handleOpenEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      brand: product.brand || '',
      color: product.color || '',
      price: product.price || '',
      stock: product.stock !== undefined ? product.stock.toString() : '',
      category: product.category,
      desc: product.desc || '',
      tag: product.tag || '',
      returnPolicy: product.returnPolicy || '',
      isActive: product.status === 'active' || product.status === 'out-of-stock',
      imagePreviews: product.images || [product.image]
    })
    setIsAdding(true)
  }

  // Confirm delete product
  const handleDeleteConfirm = () => {
    setProductsList(productsList.filter(p => p.id !== deletingProductId))
    if (viewedProduct && viewedProduct.id === deletingProductId) {
      setViewedProduct(null)
    }
    setDeletingProductId(null)
  }

  // Filter products list
  const filteredProducts = productsList.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.vendor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      categoryFilter === 'all' ? true : product.category === categoryFilter
    const matchesStatus =
      statusFilter === 'all' ? true : product.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Pagination index slicing
  const totalItems = filteredProducts.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  // 1. Render Product Profile View Details
  if (viewedProduct) {
    // Generate variant image slides based on product image
    const sliderImages = viewedProduct.images && viewedProduct.images.length > 0
      ? viewedProduct.images
      : [viewedProduct.image]

    const handlePrevSlide = () => {
      setActiveSlideIndex(prev => (prev === 0 ? sliderImages.length - 1 : prev - 1))
    }

    const handleNextSlide = () => {
      setActiveSlideIndex(prev => (prev === sliderImages.length - 1 ? 0 : prev + 1))
    }

    // Split tags list
    const tagPills = viewedProduct.tag
      ? viewedProduct.tag.split(',').map(t => t.trim())
      : ['Product', 'New']

    return (
      <div className="product-profile-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header section with back chevron button */}
        <div className="form-workspace-header">
          <button 
            className="back-circle-btn" 
            aria-label="Back to Products list"
            onClick={() => {
              setViewedProduct(null)
              setActiveSlideIndex(0)
            }}
          >
            <ArrowLeft style={{ width: '18px', height: '18px' }} />
          </button>
          <h2>View Product</h2>
        </div>

        {/* Double-column profile grid */}
        <div className="form-split-layout">
          
          {/* Left Column (Image Slider and Details table) */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            
            {/* Image Slider Container */}
            <div className="product-slider-container">
              <button type="button" className="slider-nav-btn prev" onClick={handlePrevSlide}>
                <ChevronLeft style={{ width: '16px', height: '16px' }} />
              </button>
              
              <img 
                src={sliderImages[activeSlideIndex]} 
                alt="Product slider view" 
                className="slider-main-img"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/350' }}
              />

              <button type="button" className="slider-nav-btn next" onClick={handleNextSlide}>
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            {/* Thumbnails Row */}
            <div className="product-thumbnails-row">
              {sliderImages.map((img, idx) => (
                <img 
                  key={idx}
                  src={img} 
                  alt={`Thumbnail ${idx}`}
                  className={`product-thumbnail-item ${idx === activeSlideIndex ? 'active' : ''}`}
                  onClick={() => setActiveSlideIndex(idx)}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/60' }}
                />
              ))}
            </div>

            {/* Product Details properties card */}
            <div className="product-props-card">
              <div className="product-props-card-title">Product Details</div>
              <div className="product-props-list">
                <div className="product-prop-row">
                  <span className="product-prop-left">
                    <Layers style={{ width: '15px', height: '15px' }} />
                    Category
                  </span>
                  <span className="product-prop-value">{viewedProduct.category}</span>
                </div>
                <div className="product-prop-row">
                  <span className="product-prop-left">
                    <Tag style={{ width: '15px', height: '15px' }} />
                    Brand
                  </span>
                  <span className="product-prop-value">{viewedProduct.brand || 'N/A'}</span>
                </div>
                <div className="product-prop-row">
                  <span className="product-prop-left">
                    <Palette style={{ width: '15px', height: '15px' }} />
                    Color
                  </span>
                  <span className="product-prop-value">{viewedProduct.color || 'N/A'}</span>
                </div>
                <div className="product-prop-row">
                  <span className="product-prop-left">
                    <Calendar style={{ width: '15px', height: '15px' }} />
                    Added on
                  </span>
                  <span className="product-prop-value">{viewedProduct.joinedOn || '20 April 2026'}</span>
                </div>
              </div>
            </div>

          </div>

           {/* Right Column (Info text, stock metrics, and Additional Information) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Header info name, badge, and price */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#000000', margin: 0, fontFamily: 'var(--admin-font)' }}>{viewedProduct.name}</h1>
                <span 
                  className={`vendor-badge ${viewedProduct.status}`} 
                  style={{ 
                    padding: '6px 18px', 
                    fontSize: '12px', 
                    fontWeight: '600',
                    borderRadius: '6px',
                    backgroundColor: viewedProduct.status === 'active' ? '#2e7d32' : viewedProduct.status === 'out-of-stock' ? '#d32f2f' : '#8e24aa',
                    color: '#ffffff',
                    textTransform: 'capitalize'
                  }}
                >
                  {viewedProduct.status === 'out-of-stock' ? 'Out Of Stock' : viewedProduct.status}
                </span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#8e24aa', fontFamily: 'var(--admin-font)' }}>
                ₹ {parseInt(viewedProduct.price).toLocaleString()}
              </div>

              {/* Description */}
              <div style={{ marginTop: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '6px', fontFamily: 'var(--admin-font)' }}>Description</span>
                <p style={{ fontSize: '12px', color: '#607d8b', lineHeight: '1.6', margin: 0, fontFamily: 'var(--admin-font)', borderBottom: '1px solid #e0e0e0', paddingBottom: '16px' }}>{viewedProduct.desc}</p>
              </div>
            </div>

            {/* Twin Stock / Sales cards */}
            <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
              <div className="prod-stats-card">
                <span className="prod-stats-value">{viewedProduct.stock}</span>
                <span className="prod-stats-label">Stock</span>
              </div>
              <div className="prod-stats-card">
                <span className="prod-stats-value">{viewedProduct.sales || 128}</span>
                <span className="prod-stats-label">Sales</span>
              </div>
            </div>

            {/* Additional Information Card */}
            <div className="form-section-card" style={{ margin: 0, padding: '24px', backgroundColor: '#ffffff', border: '1px solid var(--border-light)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.06)'; }}>
              <div className="additional-info-title" style={{ fontSize: '14px', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #eee', fontWeight: '700', color: '#000000', fontFamily: 'var(--admin-font)' }}>
                Additional Information
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', fontFamily: 'var(--admin-font)' }}>Tag</span>
                  <div className="tags-container" style={{ margin: 0 }}>
                    {tagPills.map((pill, idx) => (
                      <span key={idx} className="tag-pill-badge" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', border: '1px solid #c8e6c9' }}>{pill}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontFamily: 'var(--admin-font)' }}>Return Policy</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-dark)', fontFamily: 'var(--admin-font)' }}>{viewedProduct.returnPolicy || '7 Days Replacement'}</span>
                </div>

                <div>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontFamily: 'var(--admin-font)' }}>Availability</span>
                  <span className={`avail-status-tag ${viewedProduct.stock > 0 ? 'in-stock' : 'out-of-stock'}`} style={{ fontFamily: 'var(--admin-font)' }}>
                    {viewedProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    )
  }

  // 2. Render Add / Edit Form View
  if (isAdding) {
    return (
      <div className="admin-form-panel">
        <div className="form-workspace-header">
          <button 
            className="back-circle-btn" 
            aria-label="Back to Products list"
            onClick={() => {
              setIsAdding(false)
              setEditingProduct(null)
            }}
          >
            <ArrowLeft style={{ width: '18px', height: '18px' }} />
          </button>
          <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Uploader Image container - Full Width at Top */}
          <div className="form-section-card" style={{ padding: '20px 24px', margin: '0 0 24px 0', width: '100%', boxSizing: 'border-box' }}>
            <span className="image-upload-label" style={{ marginBottom: '12px', display: 'block' }}>Upload Product Images</span>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              {formData.imagePreviews && formData.imagePreviews.map((preview, idx) => (
                <div key={idx} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                  <img 
                    src={preview} 
                    alt={`Preview ${idx + 1}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <button 
                    type="button" 
                    style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px' }}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        imagePreviews: prev.imagePreviews.filter((_, i) => i !== idx)
                      }))
                    }}
                  >
                    <X style={{ width: '12px', height: '12px' }} />
                  </button>
                </div>
              ))}

              {(!formData.imagePreviews || formData.imagePreviews.length < 4) && (
                <div className="image-upload-box" style={{ width: '100px', height: '100px', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} onClick={handleImageClick}>
                  <Upload style={{ width: '20px', height: '20px', color: '#607d8b' }} />
                  <span className="upload-primary-text" style={{ fontSize: '10px', marginTop: '4px' }}>Add Image</span>
                </div>
              )}
            </div>
          </div>

          <div className="form-split-layout">
            {/* Main Left Form Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
              
              {/* Inputs Details Grid container */}
              <div className="form-section-card" style={{ margin: 0 }}>
                <div className="form-fields-grid" style={{ marginBottom: '20px' }}>
                  {/* Product Name */}
                  <div className="form-field-item">
                    <label htmlFor="prod-name">Product Name</label>
                    <input 
                      id="prod-name"
                      type="text" 
                      placeholder="Enter Product Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  {/* Brand Name */}
                  <div className="form-field-item">
                    <label htmlFor="prod-brand">Brand Name</label>
                    <input 
                      id="prod-brand"
                      type="text" 
                      placeholder="Enter Brand Name"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                  </div>

                  {/* Color */}
                  <div className="form-field-item">
                    <label htmlFor="prod-color">Color</label>
                    <input 
                      id="prod-color"
                      type="text" 
                      placeholder="Enter Product Color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />
                  </div>

                  {/* Price */}
                  <div className="form-field-item">
                    <label htmlFor="prod-price">Price(₹)</label>
                    <input 
                      id="prod-price"
                      type="number" 
                      placeholder="Enter Price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>

                  {/* Stock */}
                  <div className="form-field-item">
                    <label htmlFor="prod-stock">Stock</label>
                    <input 
                      id="prod-stock"
                      type="number" 
                      placeholder="Enter Stock"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>

                  {/* Category select */}
                  <div className="form-field-item">
                    <label htmlFor="prod-category">Category</label>
                    <select 
                      id="prod-category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      <option value="">Select Category</option>
                      {categoriesList.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="form-field-full">
                  <label htmlFor="prod-desc" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px', display: 'block' }}>Description</label>
                  <textarea 
                     id="prod-desc"
                     placeholder="Write about product..."
                     value={formData.desc}
                     onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                     style={{ width: '100%', minHeight: '120px', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cfd8dc', fontFamily: 'var(--admin-font)', fontSize: '13px', outline: 'none' }}
                  />
                </div>
              </div>

            </div>

            {/* Right Column Additional Information Card */}
            <div className="additional-info-panel">
              <div className="additional-info-title">Additional Information</div>
              
              {/* Tag (Optional) */}
              <div className="form-field-item" style={{ width: '100%' }}>
                <label htmlFor="prod-tag" style={{ color: 'var(--text-dark)' }}>Tag (Optional)</label>
                <input 
                  id="prod-tag"
                  type="text" 
                  placeholder="Enter Product Name"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  style={{ backgroundColor: '#ffffff' }}
                />
              </div>

              {/* Return Policy (Optional) */}
              <div className="form-field-item" style={{ width: '100%' }}>
                <label htmlFor="prod-policy" style={{ color: 'var(--text-dark)' }}>Return Policy (Optional)</label>
                <input 
                  id="prod-policy"
                  type="text" 
                  placeholder="Enter Product Name"
                  value={formData.returnPolicy}
                  onChange={(e) => setFormData({ ...formData, returnPolicy: e.target.value })}
                  style={{ backgroundColor: '#ffffff' }}
                />
              </div>

              {/* Status toggle slider */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)' }}>Status</span>
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
          </div>

          {/* Buttons Row */}
          <div className="form-actions-row" style={{ marginTop: '32px' }}>
            <button 
              type="button" 
              className="btn-reset-white"
              onClick={handleResetForm}
            >
              Reset
            </button>
            <button 
              type="submit" 
              className="btn-save-green"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    )
  }

  // 3. Default List View
  const stats = [
    { id: 'total', filterVal: 'all', label: 'Total Product', value: totalCount + 493, icon: Package, background: '#ffecb3', color: '#3b82f6' }, 
    { id: 'active', filterVal: 'active', label: 'Active Products', value: activeCount + 446, icon: CheckCircle2, background: '#c8e6c9', color: '#2ecc71' }, 
    { id: 'outofstock', filterVal: 'out-of-stock', label: 'Out Of Stock', value: outOfStockCount + 48, icon: ShieldAlert, background: '#ffcdd2', color: '#f43f5e' }, 
    { id: 'category', filterVal: 'category', label: 'Product Category', value: 20, icon: LayoutGrid, background: '#b2dfdb', color: '#3b82f6' } 
  ]

  return (
    <div className="product-management-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title Header with Add button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Products</h1>
          <p style={{ color: '#607d8b', fontSize: '13px' }}>
            Manage all Products available on the platform.
          </p>
        </div>
        <button 
          className="edit-profile-btn" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
          onClick={() => {
            setEditingProduct(null)
            handleResetForm()
            setIsAdding(true)
          }}
        >
          <Plus style={{ width: '16px', height: '16px' }} />
          Add New Product
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {stats.map((stat) => {
          const Icon = stat.icon
          const isActive = stat.filterVal === 'category' ? false : statusFilter === stat.filterVal
          return (
            <div 
              key={stat.id} 
              className={`stat-card clickable ${isActive ? 'active-filter' : ''}`} 
              style={{ backgroundColor: stat.background, borderColor: stat.color, color: stat.color }}
              onClick={() => {
                if (stat.filterVal !== 'category') {
                  setStatusFilter(stat.filterVal)
                }
              }}
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

      {/* Products Table Card */}
      <div className="dashboard-card-panel">
        {/* Table Filters */}
        <div className="table-filter-bar">
          <div className="table-search-wrapper">
            <Search />
            <input 
              type="text" 
              placeholder="Search Product..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <select 
              className="status-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Select Category</option>
              {categoriesList.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select 
              className="status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ textTransform: 'capitalize' }}
            >
              <option value="all">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="out-of-stock">Out Of Stock</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="admins-table-wrapper">
          <table className="admins-table">
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    className="admins-table-checkbox"
                    checked={productsList.length > 0 && productsList.every(p => p.checked)}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Sr.No.</th>
                <th>Product Image</th>
                <th>Product Name</th>
                <th>Vendor</th>
                <th>Category</th>
                <th>Status</th>
                <th style={{ width: '150px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product, idx) => (
                  <tr key={product.id}>
                    <td style={{ textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        className="admins-table-checkbox"
                        checked={product.checked}
                        onChange={() => handleRowCheckbox(product.id)}
                      />
                    </td>
                    <td>{startIndex + idx + 1}</td>
                    <td>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="product-thumbnail-img"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/50' }}
                      />
                    </td>
                    <td>
                      <span 
                        className="table-link-name" 
                        onClick={() => {
                          setViewedProduct(product)
                          setActiveSlideIndex(0)
                        }}
                      >
                        {product.name}
                      </span>
                    </td>
                    <td>{product.vendor}</td>
                    <td>{product.category}</td>
                    <td>
                      <span className={`admin-status-badge ${product.status}`}>
                        {product.status === 'out-of-stock' ? 'Out Of Stock' : product.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="action-icon-group">
                        {/* Eye View details icon */}
                        <button 
                          className="btn-action-icon view-details"
                          title="View Product Details"
                          onClick={() => {
                            setViewedProduct(product)
                            setActiveSlideIndex(0)
                          }}
                        >
                          <Eye style={{ width: '16px', height: '16px' }} />
                        </button>
                        
                        {/* Edit Product icon */}
                        <button 
                          className="btn-action-icon view-details"
                          title="Edit Product"
                          onClick={() => handleOpenEdit(product)}
                        >
                          <Edit style={{ width: '16px', height: '16px' }} />
                        </button>

                        {/* Delete product trigger */}
                        <button 
                          className="btn-action-icon delete-record"
                          title="Delete Product"
                          onClick={() => setDeletingProductId(product.id)}
                        >
                          <Trash2 style={{ width: '16px', height: '16px' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: '#90a4ae' }}>
                    No products found matching criteria.
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
      {deletingProductId && (
        <div className="modal-overlay" onClick={() => setDeletingProductId(null)}>
          <div className="delete-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-title">Delete</div>
            <div className="delete-modal-subtitle">Are You Sure Want To Delete?</div>
            <div className="delete-modal-buttons">
              <button 
                type="button" 
                className="btn-delete-cancel"
                onClick={() => setDeletingProductId(null)}
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

export default ProductManagement
