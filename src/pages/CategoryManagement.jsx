import React, { useState, useRef, useEffect, useCallback } from 'react'
import { LayoutGrid, Package, CheckSquare, AlertTriangle, Eye, Edit, Trash2, Search, ArrowLeft, Upload, Plus, ChevronDown, Check, X, ChevronRight, ChevronLeft, Loader2, RefreshCw, AlertCircle } from 'lucide-react'
import { getAllCategories, createCategory, getCategoryById, updateCategory, deleteCategory, updateCategoryStatus, getAllProducts } from '../services/superAdminService'
import './CategoryManagement.css'

// Helper for local persistence of custom created / edited categories
const getStoredCustomCategories = () => {
  try {
    const saved = localStorage.getItem('zyvora_custom_categories')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const saveCustomCategories = (categories) => {
  try {
    localStorage.setItem('zyvora_custom_categories', JSON.stringify(categories))
  } catch (e) {
    console.warn('Failed to save custom categories to localStorage:', e)
  }
}

const DEFAULT_CATEGORIES = [
  { id: 2, name: 'Beauty', subcatsCount: 5, productsCount: 76, status: 'inactive', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=200&h=200', checked: false },
  { id: 3, name: 'Home', subcatsCount: 4, productsCount: 543, status: 'active', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=200&h=200', checked: false },
  { id: 4, name: 'Mobiles', subcatsCount: 2, productsCount: 268, status: 'active', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=200&h=200', checked: false },
  { id: 5, name: 'Electronics', subcatsCount: 128, productsCount: 2450, status: 'active', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=200&h=200', checked: false },
  { id: 6, name: 'Perfumes', subcatsCount: 7, productsCount: 101, status: 'active', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=200&h=200', checked: false },
  { id: 7, name: 'Handmades', subcatsCount: 2, productsCount: 420, status: 'active', image: 'https://images.unsplash.com/photo-1576016770956-debb63d90029?auto=format&fit=crop&q=80&w=200&h=200', checked: false },
]

function CategoryManagement() {
  // API loading & error states
  const [loading, setLoading] = useState(false)
  const [categoryDetailsLoading, setCategoryDetailsLoading] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const [isApiLoaded, setIsApiLoaded] = useState(false)
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCategories: 0,
    limit: 10
  })

  // Form loading & feedback states
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [statusUpdatingId, setStatusUpdatingId] = useState(null)
  const [successToast, setSuccessToast] = useState('')

  // Filter & pagination states for Categories (main list)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryPage, setCategoryPage] = useState(1)
  const categoryItemsPerPage = 10

  // Initial Categories List Data
  const [categoriesList, setCategoriesList] = useState(() => {
    try {
      const custom = getStoredCustomCategories()
      const saved = localStorage.getItem('zyvora_categoriesList')
      const base = saved ? JSON.parse(saved) : DEFAULT_CATEGORIES
      if (custom.length > 0) {
        const map = new Map()
        custom.forEach(c => map.set(String(c._id || c.id || c.name).toLowerCase(), c))
        base.forEach(c => {
          const key = String(c._id || c.id || c.name).toLowerCase()
          if (!map.has(key)) map.set(key, c)
        })
        return Array.from(map.values())
      }
      return base
    } catch {
      return DEFAULT_CATEGORIES
    }
  })

  // Helper to get backend base URL for relative image paths
  const getBackendBaseUrl = () => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://e-commerce-backend-1-we80.onrender.com/api'
    return apiBase.replace(/\/api\/?$/, '')
  }

  // Helper to convert relative image paths like /uploads/... to full URL
  const getFullImageUrl = (imgUrl) => {
    if (!imgUrl || typeof imgUrl !== 'string') return ''
    if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://') || imgUrl.startsWith('data:') || imgUrl.startsWith('blob:')) {
      return imgUrl
    }
    const backendBase = getBackendBaseUrl()
    const cleanPath = imgUrl.startsWith('/') ? imgUrl : `/${imgUrl}`
    return `${backendBase}${cleanPath}`
  }

  // Helper function to extract categories list from various backend response shapes
  const extractCategoriesList = (res) => {
    if (!res) return []
    if (Array.isArray(res)) return res
    if (res.message && typeof res.message === 'object') {
      if (Array.isArray(res.message.categories)) return res.message.categories
      if (Array.isArray(res.message.data)) return res.message.data
      if (Array.isArray(res.message)) return res.message
    }
    if (res.data && typeof res.data === 'object') {
      if (Array.isArray(res.data.categories)) return res.data.categories
      if (Array.isArray(res.data.data)) return res.data.data
      if (Array.isArray(res.data)) return res.data
    }
    if (Array.isArray(res.categories)) return res.categories
    return []
  }

  // Helper to extract pagination data
  const extractPaginationData = (res) => {
    if (!res) return null
    if (res.message && typeof res.message === 'object' && res.message.pagination) {
      return res.message.pagination
    }
    if (res.data && typeof res.data === 'object' && res.data.pagination) {
      return res.data.pagination
    }
    return res.pagination || null
  }

  // Helper function to format API categories
  const formatCategoryItem = (cat, idx, productCountsMap = {}) => {
    let status = 'active'
    if (typeof cat.status === 'boolean') {
      status = cat.status ? 'active' : 'inactive'
    } else if (typeof cat.isActive === 'boolean') {
      status = cat.isActive ? 'active' : 'inactive'
    } else if (typeof cat.status === 'string') {
      status = cat.status.toLowerCase() === 'inactive' ? 'inactive' : 'active'
    }

    const rawImg = cat.image || cat.imageUrl || cat.categoryImage || cat.icon
    const image = rawImg ? getFullImageUrl(rawImg) : 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=200&h=200'

    const catName = cat.name || cat.categoryName || 'Unnamed Category'
    const subcatsCount = cat.subcategoriesCount ?? cat.subcatsCount ?? (Array.isArray(cat.subcategories) ? cat.subcategories.length : 0)
    
    // Live product count from backend or cross-referenced map
    const mappedProductCount = productCountsMap[catName.toLowerCase()] ?? productCountsMap[cat._id]
    const productsCount = cat.productsCount ?? cat.totalProducts ?? cat.productCount ?? (Array.isArray(cat.products) ? cat.products.length : (mappedProductCount !== undefined ? mappedProductCount : 0))

    return {
      id: cat._id || cat.id || `cat-${idx + 1}`,
      rawId: cat._id || cat.id,
      _id: cat._id || cat.id,
      name: catName,
      slug: cat.slug || '',
      description: cat.description || '',
      subcatsCount: typeof subcatsCount === 'number' ? subcatsCount : 0,
      productsCount: typeof productsCount === 'number' ? productsCount : 0,
      status: status,
      isActive: status === 'active',
      image: image,
      checked: false,
      rawData: cat,
    }
  }

  // Fetch Categories from Backend API (with live backend products sync)
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setFetchError(null)

      const params = {
        page: categoryPage,
        limit: categoryItemsPerPage,
      }

      if (statusFilter !== 'all') {
        params.status = statusFilter === 'active' ? true : false
      }

      if (searchQuery.trim()) {
        params.search = searchQuery.trim()
      }

      let categoriesData = []
      let pagination = null

      // 1. First fetch live products to calculate accurate product counts per category
      const productCountsMap = {}
      try {
        const prodRes = await getAllProducts()
        let products = []
        if (prodRes?.data && Array.isArray(prodRes.data.products)) {
          products = prodRes.data.products
        } else if (Array.isArray(prodRes?.data)) {
          products = prodRes.data
        } else if (Array.isArray(prodRes?.products)) {
          products = prodRes.products
        } else if (Array.isArray(prodRes)) {
          products = prodRes
        }

        products.forEach(p => {
          const catObj = typeof p.categoryId === 'object' && p.categoryId !== null ? p.categoryId : null
          const pCatName = (catObj?.name || (typeof p.category === 'object' ? p.category?.name : p.category) || p.categoryName || '').trim().toLowerCase()
          if (pCatName) {
            productCountsMap[pCatName] = (productCountsMap[pCatName] || 0) + 1
          }
          if (catObj?._id) {
            productCountsMap[catObj._id] = (productCountsMap[catObj._id] || 0) + 1
          }
        })
      } catch (prodErr) {
        console.warn('Could not fetch products count mapping:', prodErr)
      }

      // 2. Fetch from categories endpoint (handles both res.message.categories and res.data.categories)
      try {
        const res = await getAllCategories(params)
        categoriesData = extractCategoriesList(res)
        pagination = extractPaginationData(res)

        if (!categoriesData || categoriesData.length === 0) {
          // Fallback without params in case backend doesn't support query filters
          const resNoParams = await getAllCategories()
          categoriesData = extractCategoriesList(resNoParams)
          pagination = extractPaginationData(resNoParams)
        }
      } catch (catErr) {
        console.warn('Category API with params failed, trying without params:', catErr)
        try {
          const resNoParams = await getAllCategories()
          categoriesData = extractCategoriesList(resNoParams)
          pagination = extractPaginationData(resNoParams)
        } catch (e) {
          console.warn('Direct categories fetch failed:', e)
        }
      }

      // 3. If categoriesData is still empty, derive from live backend products
      if (!categoriesData || categoriesData.length === 0) {
        try {
          const prodRes = await getAllProducts()
          let products = []
          if (prodRes?.data && Array.isArray(prodRes.data.products)) {
            products = prodRes.data.products
          } else if (Array.isArray(prodRes?.data)) {
            products = prodRes.data
          } else if (Array.isArray(prodRes?.products)) {
            products = prodRes.products
          } else if (Array.isArray(prodRes)) {
            products = prodRes
          }

          if (products.length > 0) {
            const catMap = new Map()

            products.forEach((p, idx) => {
              const catObj = typeof p.categoryId === 'object' && p.categoryId !== null ? p.categoryId : null
              const catName = (catObj?.name || (typeof p.category === 'object' ? p.category?.name : p.category) || p.categoryName || 'General').trim()
              const catKey = catName.toLowerCase()
              const catId = catObj?._id || catObj?.id || p.categoryId || `cat-${idx + 1}`
              const catStatus = (catObj?.isActive !== undefined ? catObj.isActive : (p.status !== 'inactive' && p.status !== 'INACTIVE')) ? 'active' : 'inactive'
              const prodImg = (Array.isArray(p.images) && p.images[0]) || p.image || ''

              if (!catMap.has(catKey)) {
                catMap.set(catKey, {
                  _id: catId,
                  id: catId,
                  rawId: catId,
                  name: catName,
                  subcatsCount: 0,
                  productsCount: 1,
                  status: catStatus,
                  isActive: catStatus === 'active',
                  image: catObj?.image ? getFullImageUrl(catObj.image) : (prodImg ? getFullImageUrl(prodImg) : 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=200&h=200'),
                  checked: false,
                  rawData: p
                })
              } else {
                const existing = catMap.get(catKey)
                existing.productsCount += 1
                if (!existing.image && prodImg) {
                  existing.image = getFullImageUrl(prodImg)
                }
              }
            })

            categoriesData = Array.from(catMap.values())
          }
        } catch (prodErr) {
          console.error('Failed to sync categories from products API:', prodErr)
        }
      }

      const custom = getStoredCustomCategories()
      const apiFormatted = (categoriesData || []).map((item, idx) => formatCategoryItem(item, idx, productCountsMap))

      const mergedMap = new Map()
      // Custom created categories first (preserve user uploaded images)
      custom.forEach(c => {
        const key = String(c._id || c.id || c.name).toLowerCase()
        mergedMap.set(key, c)
      })
      apiFormatted.forEach(c => {
        const key = String(c._id || c.id || c.name).toLowerCase()
        if (!mergedMap.has(key)) {
          mergedMap.set(key, c)
        } else {
          // If custom has an uploaded image (e.g. data URL or custom image), keep the custom image
          const existing = mergedMap.get(key)
          mergedMap.set(key, {
            ...c,
            ...existing,
            image: existing.image || c.image
          })
        }
      })

      let mergedList = Array.from(mergedMap.values())
      if (mergedList.length === 0 && !isApiLoaded) {
        mergedList = custom.length > 0 ? custom : DEFAULT_CATEGORIES
      }

      setCategoriesList(mergedList)
      setIsApiLoaded(true)

      const totalItems = pagination?.totalCategories !== undefined ? pagination.totalCategories : mergedList.length
      setPaginationData({
        currentPage: pagination?.currentPage || 1,
        limit: pagination?.limit || categoryItemsPerPage,
        totalCategories: totalItems,
        totalPages: pagination?.totalPages || Math.ceil(totalItems / categoryItemsPerPage) || 1
      })
    } catch (err) {
      console.error('Failed to fetch categories:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to fetch categories.'
      setFetchError(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [categoryPage, statusFilter, searchQuery, categoryItemsPerPage])

  // Trigger fetch on mount and filter/page changes
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

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
    description: '',
    isVisible: true,
    imagePreview: '',
    imageName: ''
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
  const totalCount = isApiLoaded && paginationData.totalCategories !== undefined ? paginationData.totalCategories : categoriesList.length
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
        setFormData(prev => ({ 
          ...prev, 
          imagePreview: reader.result,
          imageName: file.name
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleResetForm = () => {
    setFormData({
      name: '',
      description: '',
      isVisible: true,
      imagePreview: '',
      imageName: ''
    })
    setFormError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setFormError('Category name is required.')
      return
    }

    const targetStatus = formData.isVisible ? 'active' : 'inactive'
    setFormError('')

    const uploadedImage = formData.imagePreview || (formData.imageFile ? URL.createObjectURL(formData.imageFile) : '') || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=200&h=200'

    if (editingCategory) {
      // Edit mode: Call PUT /api/superadmin/categories/:id
      const catId = editingCategory.rawId || editingCategory._id || editingCategory.id
      const finalImage = formData.imagePreview || editingCategory.image || uploadedImage
      const payload = {
        name: formData.name.trim(),
        description: formData.description ? formData.description.trim() : `${formData.name.trim()} products`,
        image: finalImage,
        isActive: formData.isVisible
      }

      try {
        setFormLoading(true)
        if (catId && typeof catId !== 'number' && !catId.toString().startsWith('cat-')) {
          try {
            await updateCategory(catId, payload)
          } catch (apiErr) {
            console.warn('Backend updateCategory note:', apiErr?.message)
          }
        }

        const updatedCategories = categoriesList.map(c => {
          if (c.id === editingCategory.id || c.rawId === catId || c._id === catId) {
            return {
              ...c,
              name: payload.name,
              description: payload.description,
              status: targetStatus,
              isActive: formData.isVisible,
              image: finalImage
            }
          }
          return c
        })
        setCategoriesList(updatedCategories)

        // Save to custom categories
        const storedCustom = getStoredCustomCategories()
        const updatedCustom = storedCustom.map(c => (c.id === editingCategory.id || c.rawId === catId || c._id === catId) ? {
          ...c,
          name: payload.name,
          description: payload.description,
          status: targetStatus,
          isActive: formData.isVisible,
          image: finalImage
        } : c)
        saveCustomCategories(updatedCustom)

        setSuccessToast('Category updated successfully.')
        setTimeout(() => setSuccessToast(''), 4000)
        handleResetForm()
        setEditingCategory(null)
        setIsAdding(false)
      } catch (err) {
        console.error('Failed to update category:', err)
        const errorMsg = err?.response?.data?.message || err?.message || 'Failed to update category.'
        setFormError(errorMsg)
      } finally {
        setFormLoading(false)
      }
    } else {
      // Add mode: Call POST /api/superadmin/categories
      try {
        setFormLoading(true)
        const finalImage = formData.imagePreview || uploadedImage
        const payload = {
          name: formData.name.trim(),
          description: formData.description ? formData.description.trim() : `${formData.name.trim()} products`,
          image: finalImage,
          isActive: formData.isVisible
        }

        let createdRes = null
        try {
          createdRes = await createCategory(payload)
        } catch (apiErr) {
          console.warn('Backend createCategory note (persisting locally):', apiErr?.message)
        }

        const generatedId = createdRes?.data?._id || createdRes?.data?.id || `cat-custom-${Date.now()}`
        const newCat = {
          id: generatedId,
          rawId: generatedId,
          _id: generatedId,
          name: formData.name.trim(),
          slug: formData.name.trim().toLowerCase().replace(/\s+/g, '-'),
          description: payload.description,
          subcatsCount: 0,
          productsCount: 0,
          status: targetStatus,
          isActive: formData.isVisible,
          image: finalImage,
          checked: false
        }

        // Persist to custom categories
        const storedCustom = getStoredCustomCategories()
        const updatedCustom = [newCat, ...storedCustom.filter(c => c.name.toLowerCase() !== newCat.name.toLowerCase() && c.id !== newCat.id)]
        saveCustomCategories(updatedCustom)

        setCategoriesList(prev => [newCat, ...prev.filter(c => c.name.toLowerCase() !== newCat.name.toLowerCase() && c.id !== newCat.id)])

        setSuccessToast('Category created successfully.')
        setTimeout(() => setSuccessToast(''), 4000)

        handleResetForm()
        setEditingCategory(null)
        setIsAdding(false)
      } catch (err) {
        console.error('Failed to create category:', err)
        const errorMsg = err?.response?.data?.message || err?.message || 'Failed to create category.'
        setFormError(errorMsg)
      } finally {
        setFormLoading(false)
      }
    }
  }

  // Live fetch category by ID
  const handleViewCategory = async (category) => {
    setViewedCategory(category)
    setExpandedSubcatId(null)

    const catId = category.rawId || category._id || category.id
    if (!catId || typeof catId === 'number' || (typeof catId === 'string' && catId.startsWith('cat-'))) {
      return
    }

    try {
      setCategoryDetailsLoading(true)
      const res = await getCategoryById(catId)
      const data = res?.data || res?.category || res

      if (data) {
        const rawId = data._id || data.id || category.id
        const rawName = data.name || data.categoryName || category.name
        const rawSlug = data.slug || ''
        const rawDesc = data.description || category.description || ''
        const rawProductCount = data.productCount !== undefined ? data.productCount : (data.productsCount !== undefined ? data.productsCount : category.productsCount)
        const rawStatus = typeof data.isActive === 'boolean'
          ? (data.isActive ? 'active' : 'inactive')
          : (data.status ? data.status.toLowerCase() : category.status)

        setViewedCategory(prev => ({
          ...(prev || category),
          id: rawId,
          _id: rawId,
          rawId: rawId,
          name: rawName,
          slug: rawSlug,
          description: rawDesc,
          productsCount: rawProductCount,
          productCount: rawProductCount,
          status: rawStatus,
          image: data.image ? getFullImageUrl(data.image) : (data.imageUrl ? getFullImageUrl(data.imageUrl) : category.image),
          rawData: data
        }))
      }
    } catch (err) {
      console.warn('Failed to fetch full category by ID:', err?.message || err)
    } finally {
      setCategoryDetailsLoading(false)
    }
  }

  const handleOpenEdit = async (category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name || '',
      description: category.description || category.rawData?.description || '',
      isVisible: category.status === 'active',
      imagePreview: category.image || '',
      imageName: ''
    })
    setFormError('')
    setIsAdding(true)

    const catId = category.rawId || category._id || category.id
    if (catId && typeof catId !== 'number' && !catId.toString().startsWith('cat-')) {
      try {
        const res = await getCategoryById(catId)
        const data = res?.data || res?.category || res
        if (data) {
          setFormData(prev => ({
            ...prev,
            name: data.name || prev.name,
            description: data.description || prev.description,
            isVisible: typeof data.isActive === 'boolean' ? data.isActive : prev.isVisible,
            imagePreview: data.image || prev.imagePreview
          }))
        }
      } catch (err) {
        console.warn('Could not fetch category by ID for edit:', err?.message || err)
      }
    }
  }

  // Activate / Deactivate Category (PATCH /api/superadmin/categories/:id/status)
  const handleToggleCategoryStatus = async (categoryOrId) => {
    const category = typeof categoryOrId === 'object'
      ? categoryOrId
      : categoriesList.find(c => c.id === categoryOrId || c.rawId === categoryOrId || c._id === categoryOrId)

    if (!category) return

    const catId = category.rawId || category._id || category.id
    const isCurrentlyActive = category.status === 'active'
    const nextIsActive = !isCurrentlyActive
    const nextStatus = nextIsActive ? 'active' : 'inactive'

    try {
      setStatusUpdatingId(catId)

      if (catId && typeof catId !== 'number' && !catId.toString().startsWith('cat-')) {
        const res = await updateCategoryStatus(catId, nextIsActive)
        const successMsg = res?.message || (nextIsActive ? 'Category activated successfully.' : 'Category deactivated successfully.')
        setSuccessToast(successMsg)
        setTimeout(() => setSuccessToast(''), 4000)
      } else {
        const successMsg = nextIsActive ? 'Category activated successfully.' : 'Category deactivated successfully.'
        setSuccessToast(successMsg)
        setTimeout(() => setSuccessToast(''), 4000)
      }

      // Update categoriesList state
      setCategoriesList(prev => prev.map(c => {
        if (c.id === category.id || c.rawId === catId || c._id === catId) {
          return { ...c, status: nextStatus, isActive: nextIsActive }
        }
        return c
      }))

      // Update viewedCategory if opened
      if (viewedCategory && (viewedCategory.id === category.id || viewedCategory.rawId === catId || viewedCategory._id === catId)) {
        setViewedCategory(prev => prev ? ({ ...prev, status: nextStatus, isActive: nextIsActive }) : null)
      }
    } catch (err) {
      console.error('Failed to update category status:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to update category status.'
      setFetchError(errorMsg)
      setTimeout(() => setFetchError(null), 5000)
    } finally {
      setStatusUpdatingId(null)
    }
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

  const handleDeleteConfirm = async () => {
    if (!deletingCategoryId) return

    const categoryToDelete = categoriesList.find((c) => c.id === deletingCategoryId || c.rawId === deletingCategoryId || c._id === deletingCategoryId)
    const catId = categoryToDelete?.rawId || categoryToDelete?._id || categoryToDelete?.id || deletingCategoryId

    setDeleteLoading(true)
    setDeleteError('')

    const isValidMongoId = typeof catId === 'string' && /^[0-9a-fA-F]{24}$/.test(catId)

    if (isValidMongoId) {
      try {
        const res = await deleteCategory(catId)

        // Remove from local state
        setCategoriesList(prev => prev.filter(c => c.id !== deletingCategoryId && c.rawId !== catId && c._id !== catId))

        // Remove from custom local storage
        const storedCustom = getStoredCustomCategories()
        saveCustomCategories(storedCustom.filter(c => c.id !== deletingCategoryId && c.rawId !== catId && c._id !== catId))

        setSuccessToast(res?.message || 'Category deleted successfully.')
        setTimeout(() => setSuccessToast(''), 4000)

        if (viewedCategory && (viewedCategory.id === deletingCategoryId || viewedCategory.rawId === catId || viewedCategory._id === catId)) {
          setViewedCategory(null)
        }

        setDeletingCategoryId(null)
        await fetchCategories()
      } catch (err) {
        console.error('Failed to delete category:', err)
        const errMsg = err?.response?.data?.message || err?.message || ''
        const isNotFound = err?.response?.status === 404 || errMsg.toLowerCase().includes('not found')

        if (isNotFound) {
          // If already deleted from backend, remove immediately from UI & local storage and refresh list
          setCategoriesList(prev => prev.filter(c => c.id !== deletingCategoryId && c.rawId !== catId && c._id !== catId))
          const storedCustom = getStoredCustomCategories()
          saveCustomCategories(storedCustom.filter(c => c.id !== deletingCategoryId && c.rawId !== catId && c._id !== catId))

          if (viewedCategory && (viewedCategory.id === deletingCategoryId || viewedCategory.rawId === catId || viewedCategory._id === catId)) {
            setViewedCategory(null)
          }

          setDeletingCategoryId(null)
          setSuccessToast('Category removed from listing.')
          setTimeout(() => setSuccessToast(''), 4000)
          await fetchCategories()
        } else {
          setDeleteError(errMsg || 'Cannot delete category. Products are associated with this category.')
        }
      } finally {
        setDeleteLoading(false)
      }
    } else {
      // Fallback for custom/mock items
      setCategoriesList(prev => prev.filter(c => c.id !== deletingCategoryId && c.rawId !== catId && c._id !== catId))
      const storedCustom = getStoredCustomCategories()
      saveCustomCategories(storedCustom.filter(c => c.id !== deletingCategoryId && c.rawId !== catId && c._id !== catId))

      setSuccessToast('Category deleted successfully.')
      setTimeout(() => setSuccessToast(''), 4000)
      if (viewedCategory && (viewedCategory.id === deletingCategoryId || viewedCategory.rawId === catId || viewedCategory._id === catId)) {
        setViewedCategory(null)
      }
      setDeletingCategoryId(null)
      setDeleteLoading(false)
    }
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
    const q = (searchQuery || '').trim().toLowerCase()
    const nameMatch = (cat.name || '').toLowerCase().includes(q)
    const matchesSearch = !q || nameMatch
    const matchesStatus =
      statusFilter === 'all' ? true : (cat.status || '').toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  // Pagination index slicing for Categories table
  const totalCatItems = filteredCategories.length
  const totalCatPages = Math.max(1, Math.ceil(totalCatItems / categoryItemsPerPage))
  const catStartIndex = (categoryPage - 1) * categoryItemsPerPage
  const paginatedCategories = filteredCategories.slice(catStartIndex, catStartIndex + categoryItemsPerPage)

  const displayTotalCount = categoriesList.length
  const displayActiveCount = categoriesList.filter(c => c.status === 'active').length
  const displayInactiveCount = categoriesList.filter(c => c.status === 'inactive').length
  const displayTotalProds = categoriesList.reduce((sum, c) => sum + (c.productsCount || 0), 0)

  // Clamp current page when total pages shrink
  useEffect(() => {
    if (categoryPage > totalCatPages && totalCatPages > 0) {
      setCategoryPage(totalCatPages)
    }
  }, [totalCatPages, categoryPage])

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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#607d8b' }}>Category Details</div>
                {viewedCategory.slug && (
                  <span style={{ fontSize: '11px', background: 'rgba(0,0,0,0.06)', padding: '2px 8px', borderRadius: '6px', color: '#546e7a', fontWeight: '600' }}>
                    slug: {viewedCategory.slug}
                  </span>
                )}
                {categoryDetailsLoading && (
                  <Loader2 className="spinning-loader" style={{ width: '14px', height: '14px', color: '#00897b' }} />
                )}
              </div>
              <span className="category-banner-name" style={{ fontSize: '22px', fontWeight: '800' }}>{viewedCategory.name}</span>
              {viewedCategory.description && (
                <p style={{ fontSize: '13px', color: '#546e7a', margin: '4px 0 0 0' }}>{viewedCategory.description}</p>
              )}
              <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
                <span className="category-banner-subcats" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong>Total Sub-Categories:</strong> {viewedCategory.subcatsCount !== undefined ? viewedCategory.subcatsCount : (subcategoriesData.filter(sc => sc.parentCategory === viewedCategory.name).length || 0)}
                </span>
                <span className="category-banner-subcats" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong>Total Products:</strong> {(viewedCategory.productsCount !== undefined ? viewedCategory.productsCount : (viewedCategory.productCount !== undefined ? viewedCategory.productCount : (subcategoriesData.filter(sc => sc.parentCategory === viewedCategory.name).reduce((sum, sc) => sum + sc.productsCount, 0) || 0))).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
            <span
              className={`admin-status-badge clickable ${isCatActive ? 'active' : 'inactive-orange'}`}
              style={{
                padding: '6px 16px',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onClick={() => !statusUpdatingId && handleToggleCategoryStatus(viewedCategory)}
              title="Click to toggle status"
            >
              {statusUpdatingId === (viewedCategory.rawId || viewedCategory.id) && (
                <Loader2 style={{ width: '12px', height: '12px', animation: 'spin 1s linear infinite' }} />
              )}
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
                                      Showing {prodStartIndex + 1} to {Math.min(prodStartIndex + prodItemsPerPage, totalProdItems)} of {totalProdItems} Entries
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
              Showing {Math.min(subcatStartIndex + 1, totalSubcatItems)} to {Math.min(subcatStartIndex + subcatItemsPerPage, totalSubcatItems)} of {totalSubcatItems} Entries
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
          {/* Form Error Banner */}
          {formError && (
            <div style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '12px 16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              border: '1px solid #ffcdd2'
            }}>
              <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
              <span>{formError}</span>
            </div>
          )}

          {/* Card 1: Category Details */}
          <div className="form-section-card" style={{ margin: 0, padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '20px', borderBottom: '1px solid #f1f3f4', paddingBottom: '10px' }}>Category Details</h3>

            <div className="form-fields-grid" style={{ marginBottom: '20px' }}>
              <div className="form-field-item" style={{ gridColumn: 'span 2' }}>
                <label htmlFor="cat-name">Category Name *</label>
                <input
                  id="cat-name"
                  type="text"
                  placeholder="e.g. Electronics, Fashion, Mobiles"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-field-item" style={{ gridColumn: 'span 2' }}>
                <label htmlFor="cat-desc">Description</label>
                <textarea
                  id="cat-desc"
                  placeholder="Enter category description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light, #cfd8dc)',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {formData.imageName && (
                      <span style={{ fontSize: '12px', color: '#607d8b' }}>{formData.imageName}</span>
                    )}
                    <button
                      type="button"
                      className="btn-cancel-red"
                      style={{ padding: '8px 16px', fontSize: '12px' }}
                      onClick={() => setFormData(prev => ({ ...prev, imagePreview: '', imageName: '' }))}
                    >
                      Remove Image
                    </button>
                  </div>
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
              disabled={formLoading}
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
              disabled={formLoading}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: formLoading ? 0.7 : 1 }}
            >
              {formLoading && <Loader2 className="spinning-loader" style={{ width: '16px', height: '16px' }} />}
              {editingCategory ? 'Save Changes' : (formLoading ? 'Creating Category...' : 'Create Category')}
            </button>
          </div>

        </form>
      </div>
    )
  }

  // 3. DEFAULT LIST VIEW
  const stats = [
    { id: 'total-cats', label: 'Total Categories', value: displayTotalCount, icon: LayoutGrid, background: '#ffecb3', color: '#3b82f6', filterVal: 'all' },
    { id: 'total-prods', label: 'Total Products', value: displayTotalProds, icon: Package, background: '#b2dfdb', color: '#3b82f6', filterVal: 'products' },
    { id: 'active-cats', label: 'Active Categories', value: displayActiveCount, icon: CheckSquare, background: '#c8e6c9', color: '#2ecc71', filterVal: 'active' },
    { id: 'inactive-cats', label: 'Inactive Categories', value: displayInactiveCount, icon: AlertTriangle, background: '#ffcdd2', color: '#f43f5e', filterVal: 'inactive' }
  ]

  return (
    <div className="category-management-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Success Notification Banner */}
      {successToast && (
        <div style={{
          backgroundColor: '#e8f5e9',
          color: '#2e7d32',
          padding: '12px 16px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '14px',
          border: '1px solid #c8e6c9',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check style={{ width: '18px', height: '18px', color: '#2e7d32' }} />
            <span>{successToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2e7d32', padding: 0 }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      )}

      {/* Title Header with Add Category and Refresh buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Categories</h1>
          <p style={{ color: '#607d8b', fontSize: '13px' }}>
            Manage all Categories available on the platform.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            type="button"
            className="btn-reset-white"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}
            onClick={fetchCategories}
            disabled={loading}
            title="Refresh Categories"
          >
            <RefreshCw style={{ width: '15px', height: '15px', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            <span>Refresh</span>
          </button>
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
      </div>

      {/* Error / Warning Notice */}
      {fetchError && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '12px 16px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '14px',
          border: '1px solid #ffcdd2',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
            <span><strong>Notice:</strong> {fetchError.includes('jwt expired') ? 'Login session expired (jwt expired). Showing fallback categories. Please log in again to sync live data.' : fetchError}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setFetchError(null)}
              style={{
                backgroundColor: '#fff',
                color: '#c62828',
                border: '1px solid #c62828',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600'
              }}
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={fetchCategories}
              style={{
                backgroundColor: '#c62828',
                color: '#fff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )}

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
                  setCategoryPage(1)
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
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCategoryPage(1)
              }}
            />
          </div>

          <div>
            <select
              className="status-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setCategoryPage(1)
              }}
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
                <th style={{ width: '60px', textAlign: 'center' }}>Sr.No.</th>
                <th>Category Image</th>
                <th>Category Name</th>
                <th>Sub-categories</th>
                <th>Products</th>
                <th>Status</th>
                <th style={{ width: '150px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '48px', color: '#607d8b' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      <Loader2 className="spinning-loader" style={{ width: '32px', height: '32px', color: 'var(--primary-teal, #00897b)' }} />
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>Fetching categories...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedCategories.length > 0 ? (
                paginatedCategories.map((cat, idx) => (
                  <tr key={cat.id || idx}>
                    <td style={{ textAlign: 'center', fontWeight: '500', color: '#64748b' }}>{catStartIndex + idx + 1}</td>
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
                        onClick={() => handleViewCategory(cat)}
                      >
                        {cat.name}
                      </span>
                    </td>
                    <td>{cat.subcatsCount !== undefined ? cat.subcatsCount : (subcategoriesData.filter(sc => sc.parentCategory === cat.name).length || 0)}</td>
                    <td>{(cat.productsCount !== undefined ? cat.productsCount : (cat.productCount !== undefined ? cat.productCount : (subcategoriesData.filter(sc => sc.parentCategory === cat.name).reduce((sum, sc) => sum + sc.productsCount, 0) || 0))).toLocaleString()}</td>
                    <td>
                      <span
                        className={`admin-status-badge clickable ${cat.status === 'active' ? 'active' : 'inactive-orange'}`}
                        onClick={() => !statusUpdatingId && handleToggleCategoryStatus(cat)}
                        title="Click to toggle status"
                        style={{
                          opacity: statusUpdatingId === (cat.rawId || cat.id) ? 0.6 : 1,
                          cursor: statusUpdatingId === (cat.rawId || cat.id) ? 'wait' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {statusUpdatingId === (cat.rawId || cat.id) && (
                          <Loader2 style={{ width: '12px', height: '12px', animation: 'spin 1s linear infinite' }} />
                        )}
                        {cat.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="action-icon-group">
                        {/* Eye details view button */}
                        <button
                          className="btn-action-icon view-details"
                          title="View Category Details"
                          onClick={() => handleViewCategory(cat)}
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
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#90a4ae' }}>
                    No categories found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Categories Table Footer & Pagination */}
        <div className="offers-table-footer" style={{ borderTop: 'none', paddingTop: '16px' }}>
          <div className="footer-entries-text">
            Showing {totalCatItems === 0 ? 0 : catStartIndex + 1} to {catStartIndex + paginatedCategories.length} of {totalCatItems} Entries
          </div>
          <div className="offers-pagination">
            <button
              className="pag-btn"
              onClick={() => categoryPage > 1 && setCategoryPage(categoryPage - 1)}
              disabled={categoryPage === 1 || loading}
              style={{ opacity: categoryPage === 1 || loading ? 0.5 : 1, cursor: categoryPage === 1 || loading ? 'not-allowed' : 'pointer' }}
            >
              &lt;
            </button>
            {Array.from({ length: totalCatPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={`pag-btn ${categoryPage === pageNum ? 'active' : ''}`}
                onClick={() => setCategoryPage(pageNum)}
                disabled={loading}
              >
                {pageNum}
              </button>
            ))}
            <button
              className="pag-btn"
              onClick={() => categoryPage < totalCatPages && setCategoryPage(categoryPage + 1)}
              disabled={categoryPage === totalCatPages || loading}
              style={{ opacity: categoryPage === totalCatPages || loading ? 0.5 : 1, cursor: categoryPage === totalCatPages || loading ? 'not-allowed' : 'pointer' }}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal Overlay */}
      {deletingCategoryId && (
        <div
          className="modal-overlay"
          onClick={() => {
            if (!deleteLoading) {
              setDeleteError('')
              setDeletingCategoryId(null)
            }
          }}
        >
          <div className="delete-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-title">Delete Category</div>
            <div className="delete-modal-subtitle">Are you sure you want to delete this category? This action cannot be undone.</div>

            {deleteError && (
              <div style={{
                margin: '12px 0 6px',
                padding: '10px 14px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#dc2626',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textAlign: 'left',
                lineHeight: '1.4'
              }}>
                <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="delete-modal-buttons" style={{ marginTop: deleteError ? '14px' : '20px' }}>
              <button
                type="button"
                className="btn-delete-cancel"
                onClick={() => {
                  setDeleteError('')
                  setDeletingCategoryId(null)
                }}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-delete-confirm"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  opacity: deleteLoading ? 0.7 : 1,
                  cursor: deleteLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {deleteLoading && <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />}
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryManagement
