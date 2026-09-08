import React, { useState, useRef, useEffect } from 'react'
import { LayoutGrid, Package, CheckSquare, AlertTriangle, Eye, Edit, Trash2, Search, ArrowLeft, Upload, Plus, ChevronDown, Check, X, ChevronRight, ChevronLeft } from 'lucide-react'
import './CategoryManagement.css'


function CategoryManagement() {
  // Initial Categories List Data
  const [categoriesList, setCategoriesList] = useState(() => {
    try {
      const saved = localStorage.getItem('zyvora_categoriesList')
      return saved ? JSON.parse(saved) : [
        { id: 2, name: 'Beauty', subcatsCount: 5, productsCount: 76, status: 'inactive', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=200&h=200', checked: false },
        { id: 3, name: 'Home', subcatsCount: 4, productsCount: 543, status: 'active', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=200&h=200', checked: false },
        { id: 4, name: 'Mobiles', subcatsCount: 2, productsCount: 268, status: 'active', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=200&h=200', checked: false },
        { id: 5, name: 'Electronics', subcatsCount: 128, productsCount: 2450, status: 'active', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=200&h=200', checked: false },
        { id: 6, name: 'Perfumes', subcatsCount: 7, productsCount: 101, status: 'active', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=200&h=200', checked: false },
        { id: 7, name: 'Handmades', subcatsCount: 2, productsCount: 420, status: 'active', image: 'https://images.unsplash.com/photo-1576016770956-debb63d90029?auto=format&fit=crop&q=80&w=200&h=200', checked: false },
      ]
    } catch {
      return [
        { id: 2, name: 'Beauty', subcatsCount: 5, productsCount: 76, status: 'inactive', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=200&h=200', checked: false },
        { id: 3, name: 'Home', subcatsCount: 4, productsCount: 543, status: 'active', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=200&h=200', checked: false },
        { id: 4, name: 'Mobiles', subcatsCount: 2, productsCount: 268, status: 'active', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=200&h=200', checked: false },
        { id: 5, name: 'Electronics', subcatsCount: 128, productsCount: 2450, status: 'active', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=200&h=200', checked: false },
        { id: 6, name: 'Perfumes', subcatsCount: 7, productsCount: 101, status: 'active', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=200&h=200', checked: false },
        { id: 7, name: 'Handmades', subcatsCount: 2, productsCount: 420, status: 'active', image: 'https://images.unsplash.com/photo-1576016770956-debb63d90029?auto=format&fit=crop&q=80&w=200&h=200', checked: false },
      ]
    }
  })

  // Sub-categories mock database
  const [subcategoriesData, setSubcategoriesData] = useState(() => {
    try {
      const saved = localStorage.getItem('zyvora_subcategoriesData')
      return saved ? JSON.parse(saved) : [
        { id: 1, parentCategory: 'Electronics', name: 'Mobiles', productsCount: 245, status: 'active', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=150&h=150', createdDate: '2026-05-10' },
        { id: 2, parentCategory: 'Electronics', name: 'Laptops', productsCount: 120, status: 'active', image: 'https://images.unsplash.com/photo-1496181130204-7552cc142438?auto=format&fit=crop&q=80&w=150&h=150', createdDate: '2026-05-11' },
        { id: 3, parentCategory: 'Electronics', name: 'TVs', productsCount: 85, status: 'active', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=150&h=150', createdDate: '2026-05-12' },
        { id: 4, parentCategory: 'Electronics', name: 'Cameras', productsCount: 64, status: 'active', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=150&h=150', createdDate: '2026-05-13' },
        ...Array.from({ length: 124 }, (_, i) => ({
          id: i + 5,
          parentCategory: 'Electronics',
          name: `Subcat Option ${i + 5}`,
          productsCount: Math.floor(Math.random() * 80) + 10,
          status: i % 7 === 0 ? 'inactive' : 'active',
          image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=150&h=150',
          createdDate: '2026-05-14'
        }))
      ]
    } catch {
      return [
        { id: 1, parentCategory: 'Electronics', name: 'Mobiles', productsCount: 245, status: 'active', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=150&h=150', createdDate: '2026-05-10' },
        { id: 2, parentCategory: 'Electronics', name: 'Laptops', productsCount: 120, status: 'active', image: 'https://images.unsplash.com/photo-1496181130204-7552cc142438?auto=format&fit=crop&q=80&w=150&h=150', createdDate: '2026-05-11' },
        { id: 3, parentCategory: 'Electronics', name: 'TVs', productsCount: 85, status: 'active', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=150&h=150', createdDate: '2026-05-12' },
        { id: 4, parentCategory: 'Electronics', name: 'Cameras', productsCount: 64, status: 'active', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=150&h=150', createdDate: '2026-05-13' },
      ]
    }
  })

  // Products mock database
  const [productsData, setProductsData] = useState(() => {
    try {
      const saved = localStorage.getItem('zyvora_productsData')
      return saved ? JSON.parse(saved) : [
        { id: 1, subcatName: 'Mobiles', parentCategory: 'Electronics', name: 'iPhone 15', price: 79999, stock: 120, status: 'active' },
        { id: 2, subcatName: 'Mobiles', parentCategory: 'Electronics', name: 'Samsung S25', price: 69999, stock: 95, status: 'active' },
        { id: 3, subcatName: 'Mobiles', parentCategory: 'Electronics', name: 'OnePlus 13', price: 59999, stock: 80, status: 'active' },
        { id: 4, subcatName: 'Mobiles', parentCategory: 'Electronics', name: 'Google Pixel', price: 54999, stock: 60, status: 'active' },
        ...Array.from({ length: 241 }, (_, i) => ({
          id: i + 5,
          subcatName: 'Mobiles',
          parentCategory: 'Electronics',
          name: `Device Model ${i + 5}`,
          price: (Math.floor(Math.random() * 50) + 15) * 1000,
          stock: Math.floor(Math.random() * 150) + 5,
          status: i % 8 === 0 ? 'inactive' : 'active'
        }))
      ]
    } catch {
      return [
        { id: 1, subcatName: 'Mobiles', parentCategory: 'Electronics', name: 'iPhone 15', price: 79999, stock: 120, status: 'active' },
        { id: 2, subcatName: 'Mobiles', parentCategory: 'Electronics', name: 'Samsung S25', price: 69999, stock: 95, status: 'active' },
        { id: 3, subcatName: 'Mobiles', parentCategory: 'Electronics', name: 'OnePlus 13', price: 59999, stock: 80, status: 'active' },
        { id: 4, subcatName: 'Mobiles', parentCategory: 'Electronics', name: 'Google Pixel', price: 54999, stock: 60, status: 'active' },
      ]
    }
  })

  // Navigation and view states
  const [isAdding, setIsAdding] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deletingCategoryId, setDeletingCategoryId] = useState(null)
  const [viewedCategory, setViewedCategory] = useState(null)

  // Sub-category expanded row ID
  const [expandedSubcatId, setExpandedSubcatId] = useState(null)

  // Sub-category form states
  const [isAddingSubcat, setIsAddingSubcat] = useState(false)
  const [editingSubcat, setEditingSubcat] = useState(null)
  const [subcatFormData, setSubcatFormData] = useState({
    name: '',
    imagePreview: '',
    isVisible: true
  })

  // Product form states
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [productFormData, setProductFormData] = useState({
    name: '',
    price: '',
    stock: '',
    isVisible: true
  })

  // Filter & pagination states for Categories (main list)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryPage, setCategoryPage] = useState(1)
  const categoryItemsPerPage = 10

  // Filter & pagination states for Sub-Categories inside Category Details
  const [subcatSearch, setSubcatSearch] = useState('')
  const [subcatStatusFilter, setSubcatStatusFilter] = useState('all')
  const [subcatSort, setSubcatSort] = useState('newest')
  const [subcatPage, setSubcatPage] = useState(1)
  const subcatItemsPerPage = 10

  // Filter & pagination states for Products inside Expanded Sub-Category
  const [prodSearch, setProdSearch] = useState('')
  const [prodStatusFilter, setProdStatusFilter] = useState('all')
  const [prodPage, setProdPage] = useState(1)
  const prodItemsPerPage = 10

  // Form input states for Parent Category Form
  const [formData, setFormData] = useState({
    name: '',
    isVisible: true,
    imagePreview: ''
  })

  const fileInputRef = useRef(null)
  const subcatFileInputRef = useRef(null)

  // Auto reset expanded subcategory when pages change
  useEffect(() => {
    setExpandedSubcatId(null)
    setProdPage(1)
  }, [subcatPage, subcatSearch, subcatStatusFilter])

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('zyvora_categoriesList', JSON.stringify(categoriesList))
  }, [categoriesList])

  useEffect(() => {
    localStorage.setItem('zyvora_subcategoriesData', JSON.stringify(subcategoriesData))
  }, [subcategoriesData])

  useEffect(() => {
    localStorage.setItem('zyvora_productsData', JSON.stringify(productsData))
  }, [productsData])

  // Derive counts
  const totalCount = categoriesList.length
  const activeCount = categoriesList.filter(c => c.status === 'active').length
  const inactiveCount = categoriesList.filter(c => c.status === 'inactive').length

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked
    setCategoriesList(categoriesList.map(c => ({ ...c, checked: isChecked })))
  }

  const handleRowCheckbox = (id) => {
    setCategoriesList(
      categoriesList.map(c => c.id === id ? { ...c, checked: !c.checked } : c)
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

  const handleResetForm = () => {
    setFormData({
      name: '',
      isVisible: true,
      imagePreview: ''
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    const targetStatus = formData.isVisible ? 'active' : 'inactive'

    if (editingCategory) {
      // Edit mode
      setCategoriesList(categoriesList.map(c => {
        if (c.id === editingCategory.id) {
          return {
            ...c,
            name: formData.name,
            status: targetStatus,
            image: formData.imagePreview || c.image
          }
        }
        return c
      }))
    } else {
      // Add mode
      const newCat = {
        id: Date.now(),
        name: formData.name,
        subcatsCount: 0,
        productsCount: 0,
        status: targetStatus,
        image: formData.imagePreview || 'https://via.placeholder.com/200',
        checked: false
      }
      setCategoriesList([newCat, ...categoriesList])
    }

    handleResetForm()
    setEditingCategory(null)
    setIsAdding(false)
  }

  const handleOpenEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      isVisible: category.status === 'active',
      imagePreview: category.image
    })
    setIsAdding(true)
  }

  const handleToggleCategoryStatus = (id) => {
    setCategoriesList(prev => prev.map(cat => {
      if (cat.id === id) {
        const nextStatus = cat.status === 'active' ? 'inactive' : 'active'
        return { ...cat, status: nextStatus }
      }
      return cat
    }))
  }

  const handleToggleSubcatStatus = (id) => {
    setSubcategoriesData(prev => prev.map(sc => {
      if (sc.id === id) {
        const nextStatus = sc.status === 'active' ? 'inactive' : 'active'
        return { ...sc, status: nextStatus }
      }
      return sc
    }))
  }

  const handleToggleProductStatus = (id) => {
    setProductsData(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'active' ? 'inactive' : 'active'
        return { ...p, status: nextStatus }
      }
      return p
    }))
  }

  const handleDeleteConfirm = () => {
    setCategoriesList(categoriesList.filter(c => c.id !== deletingCategoryId))
    setDeletingCategoryId(null)
  }

  // Sub-category form submit handler
  const handleSubcatSubmit = (e) => {
    e.preventDefault()
    if (!subcatFormData.name.trim()) return

    const targetStatus = subcatFormData.isVisible ? 'active' : 'inactive'

    if (editingSubcat) {
      setSubcategoriesData(subcategoriesData.map(sc => {
        if (sc.id === editingSubcat.id) {
          return {
            ...sc,
            name: subcatFormData.name,
            status: targetStatus,
            image: subcatFormData.imagePreview || sc.image
          }
        }
        return sc
      }))
    } else {
      const newSub = {
        id: Date.now(),
        parentCategory: viewedCategory.name,
        name: subcatFormData.name,
        productsCount: 0,
        status: targetStatus,
        image: subcatFormData.imagePreview || 'https://via.placeholder.com/150',
        createdDate: new Date().toISOString().split('T')[0]
      }
      setSubcategoriesData([newSub, ...subcategoriesData])

      // Increment subcatsCount in categories list dynamically
      setCategoriesList(categoriesList.map(c => {
        if (c.name === viewedCategory.name) {
          return { ...c, subcatsCount: c.subcatsCount + 1 }
        }
        return c
      }))
      if (viewedCategory) {
        setViewedCategory(prev => ({ ...prev, subcatsCount: prev.subcatsCount + 1 }))
      }
    }

    setIsAddingSubcat(false)
    setEditingSubcat(null)
  }

  // Product form submit handler
  const handleProductSubmit = (e) => {
    e.preventDefault()
    if (!productFormData.name.trim()) return

    const targetStatus = productFormData.isVisible ? 'active' : 'inactive'
    const expandedSub = subcategoriesData.find(sc => sc.id === expandedSubcatId)

    if (editingProduct) {
      setProductsData(productsData.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: productFormData.name,
            price: parseFloat(productFormData.price) || 0,
            stock: parseInt(productFormData.stock) || 0,
            status: targetStatus
          }
        }
        return p
      }))
    } else {
      const newProd = {
        id: Date.now(),
        subcatName: expandedSub.name,
        parentCategory: viewedCategory.name,
        name: productFormData.name,
        price: parseFloat(productFormData.price) || 0,
        stock: parseInt(productFormData.stock) || 0,
        status: targetStatus
      }
      setProductsData([newProd, ...productsData])

      // Increment products count in subcategory & category dynamically
      setSubcategoriesData(subcategoriesData.map(sc => {
        if (sc.id === expandedSubcatId) {
          return { ...sc, productsCount: sc.productsCount + 1 }
        }
        return sc
      }))
      setCategoriesList(categoriesList.map(c => {
        if (c.name === viewedCategory.name) {
          return { ...c, productsCount: c.productsCount + 1 }
        }
        return c
      }))
      if (viewedCategory) {
        setViewedCategory(prev => ({ ...prev, productsCount: prev.productsCount + 1 }))
      }
    }

    setIsAddingProduct(false)
    setEditingProduct(null)
  }

  // Filter list
  const filteredCategories = categoriesList.filter((cat) => {
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' ? true : cat.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // 1. RENDER VIEW CATEGORY DETAILS WITH EXPANDABLE SUB-CATEGORIES
  if (viewedCategory) {
    const isCatActive = viewedCategory.status === 'active'

    // Get subcategories filtered for this category
    const rawSubcats = subcategoriesData.filter(sc => sc.parentCategory === viewedCategory.name)
    const filteredSubcats = rawSubcats.filter(sc => {
      const matchesSearch = sc.name.toLowerCase().includes(subcatSearch.toLowerCase())
      const matchesStatus = subcatStatusFilter === 'all' ? true : sc.status === subcatStatusFilter
      return matchesSearch && matchesStatus
    }).sort((a, b) => {
      if (subcatSort === 'newest') return b.id - a.id
      if (subcatSort === 'oldest') return a.id - b.id
      if (subcatSort === 'alpha') return a.name.localeCompare(b.name)
      return 0
    })

    // Sub-category Pagination
    const totalSubcatItems = filteredSubcats.length
    const totalSubcatPages = Math.ceil(totalSubcatItems / subcatItemsPerPage) || 1
    const subcatStartIndex = (subcatPage - 1) * subcatItemsPerPage
    const paginatedSubcats = filteredSubcats.slice(subcatStartIndex, subcatStartIndex + subcatItemsPerPage)

    return (
      <div className="view-category-details" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header navigation back circle button */}
        <div className="form-workspace-header">
          <button 
            className="back-circle-btn" 
            aria-label="Back to categories list"
            onClick={() => {
              setViewedCategory(null)
              setExpandedSubcatId(null)
            }}
          >
            <ArrowLeft style={{ width: '18px', height: '18px' }} />
          </button>
          <h2>View Category Details</h2>
        </div>

        {/* Top Banner Category Details Card */}
        <div className={`category-banner-card ${isCatActive ? 'active' : 'inactive'}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <img 
              src={viewedCategory.image} 
              alt={viewedCategory.name} 
              className="category-banner-img"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/120x80' }}
            />
            <div className="category-banner-info">
              <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>Category Name</div>
              <span className="category-banner-name" style={{ fontSize: '22px', fontWeight: '800' }}>{viewedCategory.name}</span>
              <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
                <span className="category-banner-subcats" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong>Total Sub-Categories:</strong> {subcategoriesData.filter(sc => sc.parentCategory === viewedCategory.name).length}
                </span>
                <span className="category-banner-subcats" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong>Total Products:</strong> {subcategoriesData.filter(sc => sc.parentCategory === viewedCategory.name).reduce((sum, sc) => sum + sc.productsCount, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
            <span className={`admin-status-badge ${isCatActive ? 'active' : 'inactive-orange'}`} style={{ padding: '6px 16px', fontSize: '13px' }}>
              {isCatActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Sub-categories Table Section */}
        <div className="dashboard-card-panel" style={{ marginTop: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #f1f3f4', paddingBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--text-dark)' }}>Sub-Category Details</h3>
            <button 
              className="edit-profile-btn" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
              onClick={() => {
                setSubcatFormData({ name: '', imagePreview: '', isVisible: true })
                setEditingSubcat(null)
                setIsAddingSubcat(true)
              }}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              Add Sub-Category
            </button>
          </div>

          {/* Filters Bar for Sub-categories */}
          <div className="table-filter-bar" style={{ marginBottom: '20px' }}>
            <div className="table-search-wrapper" style={{ width: '280px' }}>
              <Search />
              <input 
                type="text" 
                placeholder="Search Sub-Category..." 
                value={subcatSearch} 
                onChange={(e) => setSubcatSearch(e.target.value)} 
              />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <select className="status-select" value={subcatStatusFilter} onChange={(e) => setSubcatStatusFilter(e.target.value)}>
                <option value="all">Status: All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <select className="status-select" value={subcatSort} onChange={(e) => setSubcatSort(e.target.value)}>
                <option value="newest">Sort: Newest</option>
                <option value="oldest">Sort: Oldest</option>
                <option value="alpha">Sort: A-Z</option>
              </select>
            </div>
          </div>

          {/* Sub-categories Table */}
          <div className="admins-table-wrapper">
            <table className="admins-table">
              <thead>
                <tr>
                  <th style={{ width: '60px', textAlign: 'center' }}>Expand</th>
                  <th>Sub-Category Name</th>
                  <th>Products</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th style={{ width: '150px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSubcats.length > 0 ? (
                  paginatedSubcats.map(sc => {
                    const isExpanded = expandedSubcatId === sc.id
                    
                    // Filter products for this subcat
                    const rawProducts = productsData.filter(p => p.subcatName === sc.name && p.parentCategory === viewedCategory.name)
                    const filteredProducts = rawProducts.filter(p => {
                      const matchesSearch = p.name.toLowerCase().includes(prodSearch.toLowerCase())
                      const matchesStatus = prodStatusFilter === 'all' ? true : p.status === prodStatusFilter
                      return matchesSearch && matchesStatus
                    })

                    // Products Pagination inside expanded view
                    const totalProdItems = filteredProducts.length
                    const totalProdPages = Math.ceil(totalProdItems / prodItemsPerPage) || 1
                    const prodStartIndex = (prodPage - 1) * prodItemsPerPage
                    const paginatedProducts = filteredProducts.slice(prodStartIndex, prodStartIndex + prodItemsPerPage)

                    return (
                      <React.Fragment key={sc.id}>
                        <tr>
                          <td style={{ textAlign: 'center' }}>
                            <button 
                              type="button"
                              className="table-action-btn"
                              style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s ease', margin: 'auto' }}
                              onClick={() => {
                                setExpandedSubcatId(isExpanded ? null : sc.id)
                                setProdPage(1)
                                setProdSearch('')
                                setProdStatusFilter('all')
                              }}
                            >
                              <ChevronRight style={{ width: '18px', height: '18px' }} />
                            </button>
                          </td>
                          <td style={{ fontWeight: '700' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img src={sc.image} alt={sc.name} style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/32' }} />
                              {sc.name}
                            </div>
                          </td>
                          <td>{sc.productsCount} Products</td>
                          <td>
                            <span 
                              className={`admin-status-badge clickable ${sc.status === 'active' ? 'active' : 'inactive-orange'}`}
                              onClick={() => handleToggleSubcatStatus(sc.id)}
                              title="Click to toggle status"
                            >
                              {sc.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{sc.createdDate || '2026-05-14'}</td>
                          <td style={{ textAlign: 'center' }}>
                            <div className="action-icon-group">
                              <button 
                                className="btn-action-icon view-details" 
                                title="Edit Sub-Category"
                                onClick={() => {
                                  setEditingSubcat(sc)
                                  setSubcatFormData({ name: sc.name, imagePreview: sc.image, isVisible: sc.status === 'active' })
                                  setIsAddingSubcat(true)
                                }}
                              >
                                <Edit style={{ width: '15px', height: '15px' }} />
                              </button>
                              <button 
                                className="btn-action-icon delete-record" 
                                title="Delete Sub-Category"
                                onClick={() => {
                                  if (window.confirm("Are you sure you want to delete this sub-category?")) {
                                    setSubcategoriesData(subcategoriesData.filter(item => item.id !== sc.id))
                                    setCategoriesList(categoriesList.map(c => {
                                      if (c.name === viewedCategory.name) {
                                        return { ...c, subcatsCount: Math.max(0, c.subcatsCount - 1) }
                                      }
                                      return c
                                    }))
                                    setViewedCategory(prev => ({ ...prev, subcatsCount: Math.max(0, prev.subcatsCount - 1) }))
                                  }
                                }}
                              >
                                <Trash2 style={{ width: '15px', height: '15px' }} />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded products row details */}
                        {isExpanded && (
                          <tr>
                            <td colSpan="6" style={{ backgroundColor: '#f8fafc', padding: '24px', borderBottom: '1px solid #cfd8dc' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--text-dark)' }}>Products under {sc.name}</h4>
                                  <button 
                                    className="edit-profile-btn" 
                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '12px' }}
                                    onClick={() => {
                                      setProductFormData({ name: '', price: '', stock: '', isVisible: true })
                                      setEditingProduct(null)
                                      setIsAddingProduct(true)
                                    }}
                                  >
                                    <Plus style={{ width: '14px', height: '14px' }} />
                                    Add Product
                                  </button>
                                </div>

                                {/* Product Filter bar */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                  <div className="table-search-wrapper" style={{ width: '220px' }}>
                                    <Search style={{ width: '14px', height: '14px' }} />
                                    <input 
                                      type="text" 
                                      placeholder="Search Product..." 
                                      value={prodSearch} 
                                      onChange={(e) => setProdSearch(e.target.value)} 
                                      style={{ padding: '6px 10px 6px 32px', fontSize: '12px' }}
                                    />
                                  </div>
                                  <div>
                                    <select className="status-select" value={prodStatusFilter} onChange={(e) => setProdStatusFilter(e.target.value)} style={{ padding: '6px 12px', fontSize: '12px' }}>
                                      <option value="all">Status: All</option>
                                      <option value="active">Active</option>
                                      <option value="inactive">Inactive</option>
                                    </select>
                                  </div>
                                </div>

                                {/* Products inside sub-category nested table */}
                                <div className="admins-table-wrapper" style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                  <table className="admins-table" style={{ background: '#ffffff' }}>
                                    <thead>
                                      <tr style={{ background: '#f1f5f9' }}>
                                        <th>Product Name</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Status</th>
                                        <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {paginatedProducts.length > 0 ? (
                                        paginatedProducts.map(p => (
                                          <tr key={p.id}>
                                            <td style={{ fontWeight: '600' }}>{p.name}</td>
                                            <td>₹{p.price.toLocaleString()}</td>
                                            <td>{p.stock} units</td>
                                            <td>
                                              <span 
                                                className={`admin-status-badge clickable ${p.status === 'active' ? 'active' : 'inactive-orange'}`} 
                                                style={{ fontSize: '10px', padding: '2px 8px' }}
                                                onClick={() => handleToggleProductStatus(p.id)}
                                                title="Click to toggle status"
                                              >
                                                {p.status === 'active' ? 'Active' : 'Inactive'}
                                              </span>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                              <div className="action-icon-group">
                                                <button 
                                                  className="btn-action-icon view-details" 
                                                  title="Edit Product"
                                                  onClick={() => {
                                                    setEditingProduct(p)
                                                    setProductFormData({ name: p.name, price: p.price.toString(), stock: p.stock.toString(), isVisible: p.status === 'active' })
                                                    setIsAddingProduct(true)
                                                  }}
                                                >
                                                  <Edit style={{ width: '14px', height: '14px' }} />
                                                </button>
                                                <button 
                                                  className="btn-action-icon delete-record" 
                                                  title="Delete Product"
                                                  onClick={() => {
                                                    if (window.confirm("Are you sure you want to delete this product?")) {
                                                      setProductsData(productsData.filter(item => item.id !== p.id))
                                                      setSubcategoriesData(subcategoriesData.map(sub => {
                                                        if (sub.id === sc.id) {
                                                          return { ...sub, productsCount: Math.max(0, sub.productsCount - 1) }
                                                        }
                                                        return sub
                                                      }))
                                                      setCategoriesList(categoriesList.map(c => {
                                                        if (c.name === viewedCategory.name) {
                                                          return { ...c, productsCount: Math.max(0, c.productsCount - 1) }
                                                        }
                                                        return c
                                                      }))
                                                      setViewedCategory(prev => ({ ...prev, productsCount: Math.max(0, prev.productsCount - 1) }))
                                                    }
                                                  }}
                                                >
                                                  <Trash2 style={{ width: '14px', height: '14px' }} />
                                                </button>
                                              </div>
                                            </td>
                                          </tr>
                                        ))
                                      ) : (
                                        <tr>
                                          <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '12px' }}>No products found in this sub-category.</td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>

                                {/* Expanded Products Table Footer & Pagination */}
                                {totalProdPages > 1 && (
                                  <div className="offers-table-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
                                    <div className="footer-entries-text" style={{ fontSize: '11px' }}>
                                      Showing {prodStartIndex + 1} to {Math.min(prodStartIndex + prodItemsPerPage, totalProdItems)} of {totalProdItems} entries
                                    </div>
                                    <div className="offers-pagination">
                                      <button className="pag-btn" onClick={() => prodPage > 1 && setProdPage(prodPage - 1)} disabled={prodPage === 1} style={{ opacity: prodPage === 1 ? 0.5 : 1, padding: '4px 8px', fontSize: '11px' }}>&lt;</button>
                                      {Array.from({ length: totalProdPages }, (_, i) => i + 1).map(pageNum => (
                                        <button key={pageNum} className={`pag-btn ${prodPage === pageNum ? 'active' : ''}`} onClick={() => setProdPage(pageNum)} style={{ padding: '4px 8px', fontSize: '11px' }}>{pageNum}</button>
                                      ))}
                                      <button className="pag-btn" onClick={() => prodPage < totalProdPages && setProdPage(prodPage + 1)} disabled={prodPage === totalProdPages} style={{ opacity: prodPage === totalProdPages ? 0.5 : 1, padding: '4px 8px', fontSize: '11px' }}>&gt;</button>
                                    </div>
                                  </div>
                                )}

                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#90a4ae' }}>
                      No sub-categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Sub-categories Table Footer & Pagination */}
          <div className="offers-table-footer">
            <div className="footer-entries-text">
              Showing {Math.min(subcatStartIndex + 1, totalSubcatItems)} to {Math.min(subcatStartIndex + subcatItemsPerPage, totalSubcatItems)} of {totalSubcatItems} entries
            </div>
            <div className="offers-pagination">
              <button 
                className="pag-btn" 
                onClick={() => subcatPage > 1 && setSubcatPage(subcatPage - 1)}
                disabled={subcatPage === 1}
                style={{ opacity: subcatPage === 1 ? 0.5 : 1, cursor: subcatPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                &lt;
              </button>
              {Array.from({ length: totalSubcatPages }, (_, i) => i + 1).map((pageNum) => (
                <button 
                  key={pageNum}
                  className={`pag-btn ${subcatPage === pageNum ? 'active' : ''}`}
                  onClick={() => setSubcatPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}
              <button 
                className="pag-btn" 
                onClick={() => subcatPage < totalSubcatPages && setSubcatPage(subcatPage + 1)}
                disabled={subcatPage === totalSubcatPages}
                style={{ opacity: subcatPage === totalSubcatPages ? 0.5 : 1, cursor: subcatPage === totalSubcatPages ? 'not-allowed' : 'pointer' }}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Nested Add/Edit Sub-Category modal popup */}
        {isAddingSubcat && (
          <div className="modal-overlay" onClick={() => setIsAddingSubcat(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">{editingSubcat ? 'Edit Sub-Category' : 'Add Sub-Category'}</h3>
              <form onSubmit={handleSubcatSubmit}>
                <div className="modal-field">
                  <label className="modal-label">Parent Category</label>
                  <input type="text" className="modal-input" value={viewedCategory.name} disabled />
                </div>
                <div className="modal-field">
                  <label className="modal-label">Sub-Category Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter Sub-Category Name"
                    className="modal-input" 
                    value={subcatFormData.name}
                    onChange={(e) => setSubcatFormData({ ...subcatFormData, name: e.target.value })}
                    required 
                  />
                </div>
                <div className="modal-field">
                  <label className="modal-label">Sub-Category Image</label>
                  <input 
                    type="file" 
                    ref={subcatFileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => setSubcatFormData(prev => ({ ...prev, imagePreview: reader.result }))
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                  {subcatFormData.imagePreview ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src={subcatFormData.imagePreview} alt="Preview" style={{ width: '80px', height: '60px', borderRadius: '6px', objectFit: 'cover' }} />
                      <button type="button" className="btn-cancel-red" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={() => setSubcatFormData(prev => ({ ...prev, imagePreview: '' }))}>Remove</button>
                    </div>
                  ) : (
                    <div className="image-upload-box" style={{ height: '100px' }} onClick={() => subcatFileInputRef.current && subcatFileInputRef.current.click()}>
                      <Upload className="upload-icon-cloud" style={{ width: '20px', height: '20px' }} />
                      <span className="upload-primary-text" style={{ fontSize: '11px' }}>Upload Sub-Category Image</span>
                    </div>
                  )}
                </div>
                <div className="modal-field">
                  <label className="modal-label">Visibility</label>
                  <div 
                    className={`status-toggle-container ${subcatFormData.isVisible ? 'active' : ''}`}
                    onClick={() => setSubcatFormData(prev => ({ ...prev, isVisible: !prev.isVisible }))}
                  >
                    <div className="status-toggle-pill">
                      <span className="status-toggle-text">{subcatFormData.isVisible ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="modal-btn cancel-btn" onClick={() => setIsAddingSubcat(false)}>Cancel</button>
                  <button type="submit" className="modal-btn submit-btn">{editingSubcat ? 'Save' : 'Add'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Nested Add/Edit Product modal popup */}
        {isAddingProduct && (
          <div className="modal-overlay" onClick={() => setIsAddingProduct(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <h3 className="modal-title">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
              <form onSubmit={handleProductSubmit}>
                <div className="modal-field">
                  <label className="modal-label">Parent Category</label>
                  <input type="text" className="modal-input" value={viewedCategory.name} disabled />
                </div>
                <div className="modal-field">
                  <label className="modal-label">Parent Sub-Category</label>
                  <input type="text" className="modal-input" value={subcategoriesData.find(sc => sc.id === expandedSubcatId)?.name || ''} disabled />
                </div>
                <div className="modal-field">
                  <label className="modal-label">Product Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter Product Name"
                    className="modal-input" 
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                    required 
                  />
                </div>
                <div className="modal-field">
                  <label className="modal-label">Price (₹)</label>
                  <input 
                    type="number" 
                    placeholder="Enter Price"
                    className="modal-input" 
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                    required 
                  />
                </div>
                <div className="modal-field">
                  <label className="modal-label">Stock</label>
                  <input 
                    type="number" 
                    placeholder="Enter Stock Quantity"
                    className="modal-input" 
                    value={productFormData.stock}
                    onChange={(e) => setProductFormData({ ...productFormData, stock: e.target.value })}
                    required 
                  />
                </div>
                <div className="modal-field">
                  <label className="modal-label">Status</label>
                  <div 
                    className={`status-toggle-container ${productFormData.isVisible ? 'active' : ''}`}
                    onClick={() => setProductFormData(prev => ({ ...prev, isVisible: !prev.isVisible }))}
                  >
                    <div className="status-toggle-pill">
                      <span className="status-toggle-text">{productFormData.isVisible ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="modal-btn cancel-btn" onClick={() => setIsAddingProduct(false)}>Cancel</button>
                  <button type="submit" className="modal-btn submit-btn">{editingProduct ? 'Save' : 'Add'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    )
  }

  // 2. RENDER ADD / EDIT CATEGORY FORM VIEW
  if (isAdding) {
    return (
      <div className="admin-form-panel">
        <div className="form-workspace-header">
          <button 
            className="back-circle-btn" 
            aria-label="Back to categories list"
            onClick={() => {
              setIsAdding(false)
              setEditingCategory(null)
            }}
          >
            <ArrowLeft style={{ width: '18px', height: '18px' }} />
          </button>
          <h2>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Card 1: Category Details */}
          <div className="form-section-card" style={{ margin: 0, padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '20px', borderBottom: '1px solid #f1f3f4', paddingBottom: '10px' }}>Category Details</h3>
            
            <div className="form-fields-grid" style={{ marginBottom: '20px' }}>
              <div className="form-field-item" style={{ gridColumn: 'span 2' }}>
                <label htmlFor="cat-name">Category Name</label>
                <input 
                  id="cat-name"
                  type="text" 
                  placeholder="Enter Category Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Category Image Uploader */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px', display: 'block' }}>Category Image</label>
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
                    style={{ width: '150px', height: '100px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #cfd8dc' }} 
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
                <div className="image-upload-box" style={{ height: '140px' }} onClick={handleImageClick}>
                  <Upload className="upload-icon-cloud" />
                  <span className="upload-primary-text" style={{ fontSize: '13px' }}>Upload Category Image</span>
                </div>
              )}
            </div>

            {/* Visibility Slider toggle */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dark)' }}>Visibility</span>
              <div 
                className={`status-toggle-container ${formData.isVisible ? 'active' : ''}`}
                onClick={() => setFormData(prev => ({ ...prev, isVisible: !prev.isVisible }))}
              >
                <div className="status-toggle-pill">
                  <span className="status-toggle-text">
                    {formData.isVisible ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Action buttons */}
          <div className="form-actions-row" style={{ marginTop: '12px' }}>
            <button 
              type="button" 
              className="btn-reset-white"
              onClick={() => {
                setIsAdding(false)
                setEditingCategory(null)
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-save-green"
            >
              {editingCategory ? 'Save' : 'Add'}
            </button>
          </div>

        </form>
      </div>
    )
  }

  // 3. DEFAULT LIST VIEW
  const stats = [
    { id: 'total-cats', label: 'Total Categories', value: totalCount, icon: LayoutGrid, background: '#ffecb3', color: '#3b82f6', filterVal: 'all' },
    { id: 'total-prods', label: 'Total Products', value: subcategoriesData.reduce((sum, c) => sum + c.productsCount, 0), icon: Package, background: '#b2dfdb', color: '#3b82f6', filterVal: 'products' },
    { id: 'active-cats', label: 'Active Categories', value: activeCount, icon: CheckSquare, background: '#c8e6c9', color: '#2ecc71', filterVal: 'active' },
    { id: 'inactive-cats', label: 'Inactive Categories', value: inactiveCount, icon: AlertTriangle, background: '#ffcdd2', color: '#f43f5e', filterVal: 'inactive' }
  ]

  return (
    <div className="category-management-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title Header with Add Category button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Categories</h1>
          <p style={{ color: '#607d8b', fontSize: '13px' }}>
            Manage all Categories available on the platform.
          </p>
        </div>
        <button 
          className="edit-profile-btn" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
          onClick={() => {
            setEditingCategory(null)
            handleResetForm()
            setIsAdding(true)
          }}
        >
          <Plus style={{ width: '16px', height: '16px' }} />
          Add New Category
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {stats.map((stat) => {
          const Icon = stat.icon
          const isActive = stat.filterVal === 'products' ? false : statusFilter === stat.filterVal
          return (
            <div 
              key={stat.id} 
              className={`stat-card clickable ${isActive ? 'active-filter' : ''}`}
              style={{ backgroundColor: stat.background, borderColor: stat.color, color: stat.color }}
              onClick={() => {
                if (stat.filterVal !== 'products') {
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
              <div className="stat-value" style={{ fontSize: '24px', fontWeight: '700' }}>{stat.value.toLocaleString()}</div>
              <div className="stat-label" style={{ color: '#546e7a', fontWeight: '500' }}>{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Categories table card */}
      <div className="dashboard-card-panel">
        {/* Table Filters */}
        <div className="table-filter-bar">
          <div className="table-search-wrapper">
            <Search />
            <input 
              type="text" 
              placeholder="Search Category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <select 
              className="status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Categories Table */}
        <div className="admins-table-wrapper">
          <table className="admins-table">
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    className="admins-table-checkbox"
                    checked={categoriesList.length > 0 && categoriesList.every(c => c.checked)}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Sr.No.</th>
                <th>Category Image</th>
                <th>Category Name</th>
                <th>Sub-categories</th>
                <th>Products</th>
                <th>Status</th>
                <th style={{ width: '150px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const totalCatItems = filteredCategories.length
                const totalCatPages = Math.ceil(totalCatItems / categoryItemsPerPage) || 1
                const catStartIndex = (categoryPage - 1) * categoryItemsPerPage
                const paginatedCategories = filteredCategories.slice(catStartIndex, catStartIndex + categoryItemsPerPage)

                if (paginatedCategories.length > 0) {
                  return paginatedCategories.map((cat, idx) => (
                    <tr key={cat.id}>
                      <td style={{ textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          className="admins-table-checkbox"
                          checked={cat.checked}
                          onChange={() => handleRowCheckbox(cat.id)}
                        />
                      </td>
                      <td>{catStartIndex + idx + 1}</td>
                    <td>
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="product-thumbnail-img"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/50' }}
                      />
                    </td>
                    <td style={{ fontWeight: '700' }}>
                      <span 
                        className="table-link-name"
                        onClick={() => setViewedCategory(cat)}
                      >
                        {cat.name}
                      </span>
                    </td>
                    <td>{subcategoriesData.filter(sc => sc.parentCategory === cat.name).length}</td>
                    <td>{subcategoriesData.filter(sc => sc.parentCategory === cat.name).reduce((sum, sc) => sum + sc.productsCount, 0).toLocaleString()}</td>
                    <td>
                      <span 
                        className={`admin-status-badge clickable ${cat.status === 'active' ? 'active' : 'inactive-orange'}`}
                        onClick={() => handleToggleCategoryStatus(cat.id)}
                        title="Click to toggle status"
                      >
                        {cat.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="action-icon-group">
                        {/* Eye details view button */}
                        <button 
                          className="btn-action-icon view-details"
                          title="View Category Details"
                          onClick={() => setViewedCategory(cat)}
                        >
                          <Eye style={{ width: '16px', height: '16px' }} />
                        </button>
                        
                        {/* Edit details form button */}
                        <button 
                          className="btn-action-icon view-details"
                          title="Edit Category"
                          onClick={() => handleOpenEdit(cat)}
                        >
                          <Edit style={{ width: '16px', height: '16px' }} />
                        </button>

                        {/* Delete category button */}
                        <button 
                          className="btn-action-icon delete-record"
                          title="Delete Category"
                          onClick={() => setDeletingCategoryId(cat.id)}
                        >
                          <Trash2 style={{ width: '16px', height: '16px' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                } else {
                  return (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: '#90a4ae' }}>
                        No categories found matching criteria.
                      </td>
                    </tr>
                  )
                }
              })()}
            </tbody>
          </table>
        </div>

        {/* Categories Table Footer & Pagination */}
        {(() => {
          const totalCatItems = filteredCategories.length
          const totalCatPages = Math.ceil(totalCatItems / categoryItemsPerPage) || 1
          const catStartIndex = (categoryPage - 1) * categoryItemsPerPage

          if (totalCatItems === 0) return null

          return (
            <div className="offers-table-footer" style={{ borderTop: 'none', paddingTop: '16px' }}>
              <div className="footer-entries-text">
                Showing {totalCatItems === 0 ? 0 : catStartIndex + 1} to {Math.min(catStartIndex + categoryItemsPerPage, totalCatItems)} of {totalCatItems} entries
              </div>
              {totalCatPages > 1 && (
                <div className="offers-pagination">
                  <button 
                    className="pag-btn" 
                    onClick={() => categoryPage > 1 && setCategoryPage(categoryPage - 1)}
                    disabled={categoryPage === 1}
                    style={{ opacity: categoryPage === 1 ? 0.5 : 1, cursor: categoryPage === 1 ? 'not-allowed' : 'pointer' }}
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalCatPages }, (_, i) => i + 1).map((pageNum) => (
                    <button 
                      key={pageNum}
                      className={`pag-btn ${categoryPage === pageNum ? 'active' : ''}`}
                      onClick={() => setCategoryPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button 
                    className="pag-btn" 
                    onClick={() => categoryPage < totalCatPages && setCategoryPage(categoryPage + 1)}
                    disabled={categoryPage === totalCatPages}
                    style={{ opacity: categoryPage === totalCatPages ? 0.5 : 1, cursor: categoryPage === totalCatPages ? 'not-allowed' : 'pointer' }}
                  >
                    &gt;
                  </button>
                </div>
              )}
            </div>
          )
        })()}
      </div>

      {/* Delete Confirmation Modal Overlay */}
      {deletingCategoryId && (
        <div className="modal-overlay" onClick={() => setDeletingCategoryId(null)}>
          <div className="delete-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-title">Delete</div>
            <div className="delete-modal-subtitle">Are You Sure Want To Delete?</div>
            <div className="delete-modal-buttons">
              <button 
                type="button" 
                className="btn-delete-cancel"
                onClick={() => setDeletingCategoryId(null)}
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

export default CategoryManagement
