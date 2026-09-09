import React, { useState, useRef, useEffect } from 'react'
import { LayoutGrid, Users, UserCheck, ShieldAlert, Eye, Edit, Trash2, Search, ArrowLeft, Upload, Plus, X, ChevronLeft, ChevronRight, Palette, Calendar, Layers, Tag, Package, CheckCircle2, RotateCw, Mail, Phone, AlertCircle } from 'lucide-react'
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../services/superAdminService'
import './ProductManagement.css'




const DEFAULT_PRODUCTS = [
  { 
    id: 1, 
    name: 'Wireless Headphones Pro', 
    productName: 'Wireless Headphones Pro',
    vendor: 'Sony Center', 
    category: 'Electronics', 
    status: 'active', 
    price: '12000', 
    stock: 48, 
    brand: 'SoundPro', 
    brandName: 'SoundPro',
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
    productName: 'Leather Hand Bag',
    vendor: 'Chanel Classic', 
    category: 'Bags', 
    status: 'out-of-stock', 
    price: '6999', 
    stock: 0, 
    brand: 'Chanel Classic', 
    brandName: 'Chanel Classic',
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
    productName: 'Formal Shirt',
    vendor: 'A.K.Fashion', 
    category: 'Fashion', 
    status: 'active', 
    price: '2499', 
    stock: 85, 
    brand: 'A.K.Fashion', 
    brandName: 'A.K.Fashion',
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
    productName: 'Trending Summer Wear',
    vendor: 'Tommy Hilfiger', 
    category: 'Fashion', 
    status: 'inactive', 
    price: '2999', 
    stock: 50, 
    brand: 'Tommy Hilfiger', 
    brandName: 'Tommy Hilfiger',
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
    productName: 'Lamp',
    vendor: 'City Lights', 
    category: 'Home', 
    status: 'active', 
    price: '1899', 
    stock: 40, 
    brand: 'City Lights', 
    brandName: 'City Lights',
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
    productName: 'Neckless',
    vendor: 'Dass Jewellers', 
    category: 'Jewellery', 
    status: 'active', 
    price: '95000', 
    stock: 8, 
    brand: 'Dass Jewellers', 
    brandName: 'Dass Jewellers',
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
    productName: 'Smart TV',
    vendor: 'Sony Center', 
    category: 'Electronics', 
    status: 'out-of-stock', 
    price: '35000', 
    stock: 0, 
    brand: 'Sony', 
    brandName: 'Sony',
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
  }
]

function ProductManagement() {
  // Products List Data (Defaults to mock dataset for instant rendering)
  const [productsList, setProductsList] = useState(DEFAULT_PRODUCTS)
  const [isApiLoaded, setIsApiLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalPages: 5,
    totalProducts: 500,
    limit: 10
  })

  // Format single product response object
  const formatProductItem = (p, index) => {
    const rawId = p._id || p.id || `prod-${index}`
    const rawName = p.productName || p.name || 'Unnamed Product'
    const rawBrand = p.brandName || p.brand || 'N/A'
    const rawPrice = p.price !== undefined ? p.price : 0
    const rawDiscountPrice = p.discountPrice !== undefined ? p.discountPrice : (p.discountedPrice || null)
    const rawStock = p.stock !== undefined ? Number(p.stock) : 0
    const rawSku = p.sku || 'N/A'
    const rawColor = p.color || 'N/A'
    const rawCategory = typeof p.category === 'object' ? (p.category?.name || p.category?.categoryName || 'General') : (p.category || p.categoryName || 'General')
    const rawVendor = typeof p.vendor === 'object' ? (p.vendor?.name || p.vendor?.vendorName || 'Super Admin') : (p.vendor || p.vendorName || 'Super Admin')

    let rawStatus = (p.status || (rawStock === 0 ? 'OUT_OF_STOCK' : 'ACTIVE')).toString().toLowerCase()
    if (rawStatus === 'active' && rawStock === 0) {
      rawStatus = 'out-of-stock'
    } else if (rawStatus === 'out_of_stock') {
      rawStatus = 'out-of-stock'
    }

    const defaultImages = [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=350&h=350',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=350&h=350',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=350&h=350'
    ]

    const imagesList = Array.isArray(p.images) && p.images.length > 0
      ? p.images
      : (p.image ? [p.image] : defaultImages)

    const primaryImage = imagesList[0] || defaultImages[0]

    const joinedDateFormatted = p.createdAt || p.joinedOn
      ? new Date(p.createdAt || p.joinedOn).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })
      : '20 April 2026'

    return {
      id: rawId,
      _id: rawId,
      name: rawName,
      productName: rawName,
      brand: rawBrand,
      brandName: rawBrand,
      price: rawPrice,
      discountPrice: rawDiscountPrice,
      stock: rawStock,
      sku: rawSku,
      color: rawColor,
      category: rawCategory,
      vendor: rawVendor,
      status: rawStatus,
      tag: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tag || `${rawCategory}, ${rawBrand}`),
      returnPolicy: p.returnPolicy || '7 Days Replacement',
      desc: p.description || p.desc || `High quality ${rawName} by ${rawBrand}.`,
      image: primaryImage,
      images: imagesList,
      joinedOn: joinedDateFormatted,
      sales: p.sales || p.totalSales || (rawStock > 0 ? 12 : 0),
      checked: false
    }
  }

  // Fetch All Products from API (/api/superadmin/products)
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setFetchError(null)
      const res = await getAllProducts()

      // Handle response formats:
      // 1. { success: true, message: "...", data: { products: [...], pagination: { ... } } }
      // 2. { success: true, data: [...] }
      // 3. { products: [...] }
      let productsData = []
      if (res?.data && Array.isArray(res.data.products)) {
        productsData = res.data.products
      } else if (Array.isArray(res?.data)) {
        productsData = res.data
      } else if (Array.isArray(res?.products)) {
        productsData = res.products
      } else if (Array.isArray(res)) {
        productsData = res
      }

      if (productsData && productsData.length > 0) {
        const formatted = productsData.map((item, idx) => formatProductItem(item, idx))
        setProductsList(formatted)
        setIsApiLoaded(true)
      }

      const pagination = res?.data?.pagination || res?.pagination
      if (pagination) {
        setPaginationData({
          currentPage: pagination.currentPage || 1,
          totalPages: pagination.totalPages || 1,
          totalProducts: pagination.totalProducts !== undefined ? pagination.totalProducts : (productsData.length || 500),
          limit: pagination.limit || 10
        })
      }
    } catch (err) {
      console.error('Failed to fetch products:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to fetch products.'
      setFetchError(errorMsg)
      // Keep default products so UI remains interactive
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch on mount
  useEffect(() => {
    fetchProducts()
  }, [])



  // Navigation and overlay states
  const [isAdding, setIsAdding] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProductId, setDeletingProductId] = useState(null)
  const [viewedProduct, setViewedProduct] = useState(null) // customer in details profile view
  const [activeSlideIndex, setActiveSlideIndex] = useState(0) // image slider index
  const [productDetailsLoading, setProductDetailsLoading] = useState(false)
  const [productDetailsError, setProductDetailsError] = useState(null)

  // Fetch Single Product By ID (/api/superadmin/products/:id)
  const handleViewProduct = async (product) => {
    setViewedProduct(product)
    setActiveSlideIndex(0)
    setProductDetailsError(null)

    const productId = product._id || product.id
    if (!productId || typeof productId === 'number' || (typeof productId === 'string' && productId.startsWith('prod-'))) {
      return
    }

    try {
      setProductDetailsLoading(true)
      const res = await getProductById(productId)
      const data = res?.data || res?.product || res

      if (data) {
        const rawId = data._id || data.id || product.id
        const rawName = data.productName || data.name || product.name
        const rawBrand = data.brandName || data.brand || product.brand
        const rawDesc = data.description || data.desc || product.desc
        const rawPrice = data.price !== undefined ? data.price : product.price
        const rawDiscountPrice = data.discountPrice !== undefined ? data.discountPrice : product.discountPrice
        const rawStock = data.stock !== undefined ? Number(data.stock) : product.stock
        const rawSku = data.sku || product.sku
        const rawColor = data.color || product.color
        const rawStatus = (data.status || product.status || 'active').toString().toLowerCase() === 'active'
          ? (rawStock === 0 ? 'out-of-stock' : 'active')
          : (data.status?.toLowerCase() || product.status)

        const rawCategory = data.categoryId?.name || data.category?.name || (typeof data.category === 'string' ? data.category : product.category)
        const rawCategorySlug = data.categoryId?.slug || ''

        const rawVendorName = data.vendorId?.fullName || data.vendorId?.name || data.vendor?.name || (typeof data.vendor === 'string' ? data.vendor : product.vendor)
        const rawVendorEmail = data.vendorId?.email || ''
        const rawVendorPhone = data.vendorId?.mobile || data.vendorId?.phone || ''

        const defaultImages = [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=350&h=350'
        ]
        const imagesList = Array.isArray(data.images) && data.images.length > 0
          ? data.images
          : (data.image ? [data.image] : (product.images || defaultImages))

        setViewedProduct(prev => ({
          ...(prev || product),
          id: rawId,
          _id: rawId,
          name: rawName,
          productName: rawName,
          brand: rawBrand,
          brandName: rawBrand,
          desc: rawDesc,
          description: rawDesc,
          price: rawPrice,
          discountPrice: rawDiscountPrice,
          stock: rawStock,
          sku: rawSku,
          color: rawColor,
          status: rawStatus,
          category: rawCategory,
          categorySlug: rawCategorySlug,
          vendor: rawVendorName,
          vendorEmail: rawVendorEmail,
          vendorPhone: rawVendorPhone,
          vendorId: data.vendorId,
          categoryId: data.categoryId,
          images: imagesList,
          image: imagesList[0] || product.image,
        }))
      }
    } catch (err) {
      console.error('Failed to fetch product by ID:', err)
      setProductDetailsError(err?.response?.data?.message || err?.message || 'Failed to fetch product details')
    } finally {
      setProductDetailsLoading(false)
    }
  }

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
    discountPrice: '',
    stock: '',
    sku: '',
    category: '',
    categoryId: '',
    vendor: '',
    vendorId: '',
    desc: '',
    tag: '',
    returnPolicy: '',
    isActive: true,
    imagePreviews: [],
    imageFiles: []
  })

  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')

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
      setFormData(prev => ({
        ...prev,
        imageFiles: [...(prev.imageFiles || []), ...files]
      }))
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
      discountPrice: '',
      stock: '',
      sku: '',
      category: '',
      categoryId: '',
      vendor: '',
      vendorId: '',
      desc: '',
      tag: '',
      returnPolicy: '',
      isActive: true,
      imagePreviews: [],
      imageFiles: []
    })
    setFormError('')
  }

  // Handle submit form (Add or Edit Product)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!formData.name.trim()) {
      setFormError('Product Name is required.')
      return
    }
    if (!formData.brand.trim()) {
      setFormError('Brand Name is required.')
      return
    }
    if (!formData.price) {
      setFormError('Price is required.')
      return
    }
    if (formData.discountPrice && Number(formData.discountPrice) > Number(formData.price)) {
      setFormError('Discount price cannot be greater than product price.')
      return
    }

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

    try {
      setFormLoading(true)

      if (editingProduct) {
        const prodId = editingProduct._id || editingProduct.id
        const updatePayload = {
          productName: formData.name.trim(),
          price: Number(formData.price),
          stock: Number(formData.stock) || 0,
        }
        if (formData.discountPrice) {
          updatePayload.discountPrice = Number(formData.discountPrice)
        }
        if (formData.brand) {
          updatePayload.brandName = formData.brand.trim()
        }
        if (formData.desc) {
          updatePayload.description = formData.desc.trim()
        }
        if (formData.color) {
          updatePayload.color = formData.color.trim()
        }

        // Call PUT /api/superadmin/products/:id if it's a backend ID
        if (prodId && ((typeof prodId === 'string' && !prodId.startsWith('prod-local-')) || (typeof prodId === 'number' && prodId > 100))) {
          try {
            await updateProduct(prodId, updatePayload)
          } catch (apiErr) {
            console.error('Update product API error:', apiErr)
            const errMsg = apiErr?.response?.data?.message || apiErr?.message || 'Failed to update product on server.'
            if (apiErr?.response?.status === 404 || apiErr?.response?.status === 400) {
              setFormError(errMsg)
              setFormLoading(false)
              return
            }
          }
        }

        // Update local products state
        setProductsList(productsList.map(p => {
          if (p.id === editingProduct.id || p._id === prodId) {
            const updatedProduct = {
              ...p,
              name: formData.name,
              productName: formData.name,
              brand: formData.brand,
              brandName: formData.brand,
              color: formData.color,
              price: formData.price,
              discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
              stock: parseInt(formData.stock) || 0,
              sku: formData.sku || p.sku,
              category: formData.category,
              vendor: formData.vendor || p.vendor,
              desc: formData.desc,
              description: formData.desc,
              tag: formData.tag,
              returnPolicy: formData.returnPolicy,
              status: nextStatus,
              image: primaryImage,
              images: imagesToSave
            }
            if (viewedProduct && (viewedProduct.id === editingProduct.id || viewedProduct._id === prodId)) {
              setViewedProduct(updatedProduct)
            }
            return updatedProduct
          }
          return p
        }))
      } else {
        // 1. Prepare Multipart FormData for Backend API (POST /api/superadmin/products)
        const fd = new FormData()
        fd.append('productName', formData.name.trim())
        fd.append('brandName', formData.brand.trim())
        fd.append('price', formData.price)
        if (formData.discountPrice) {
          fd.append('discountPrice', formData.discountPrice)
        }
        fd.append('stock', formData.stock || 0)
        if (formData.sku) {
          fd.append('sku', formData.sku.trim())
        }
        if (formData.color) {
          fd.append('color', formData.color.trim())
        }
        if (formData.desc) {
          fd.append('description', formData.desc.trim())
        }
        if (formData.categoryId) {
          fd.append('categoryId', formData.categoryId.trim())
        }
        if (formData.vendorId) {
          fd.append('vendorId', formData.vendorId.trim())
        }

        if (formData.imageFiles && formData.imageFiles.length > 0) {
          formData.imageFiles.forEach(file => {
            fd.append('images', file)
          })
        }

        try {
          const res = await createProduct(fd)
          const createdData = res?.data || res?.product || res

          if (createdData) {
            const newFormatted = formatProductItem(createdData, 0)
            setProductsList(prev => [newFormatted, ...prev])
            setIsApiLoaded(true)
            setPaginationData(prev => ({
              ...prev,
              totalProducts: (prev.totalProducts || productsList.length) + 1
            }))
          }
        } catch (apiErr) {
          console.error('Create product API response error:', apiErr)
          const errMsg = apiErr?.response?.data?.message || apiErr?.message || 'Failed to create product on server.'

          // If backend validation error occurred, display it to user
          if (apiErr?.response?.status === 400 || apiErr?.response?.status === 409 || apiErr?.response?.status === 404) {
            setFormError(errMsg)
            setFormLoading(false)
            return
          } else {
            // Local fallback creation if token expired/server unreachable
            const newProduct = {
              id: Date.now(),
              _id: `prod-local-${Date.now()}`,
              name: formData.name,
              productName: formData.name,
              vendor: formData.vendor || (formData.vendorId ? `Vendor ${formData.vendorId}` : 'Super Admin'),
              category: formData.category || (formData.categoryId ? `Category ${formData.categoryId}` : 'General'),
              status: nextStatus,
              price: formData.price,
              discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
              stock: parseInt(formData.stock) || 0,
              sku: formData.sku || `SKU-${Date.now().toString().slice(-6)}`,
              brand: formData.brand,
              brandName: formData.brand,
              color: formData.color || 'N/A',
              tag: formData.tag || `${formData.category}, ${formData.brand}`,
              returnPolicy: formData.returnPolicy || '7 Days Replacement',
              desc: formData.desc,
              description: formData.desc,
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
            setProductsList(prev => [newProduct, ...prev])
            setPaginationData(prev => ({
              ...prev,
              totalProducts: (prev.totalProducts || productsList.length) + 1
            }))
          }
        }
      }

      handleResetForm()
      setEditingProduct(null)
      setIsAdding(false)
    } catch (err) {
      console.error('Product submit error:', err)
      setFormError(err?.response?.data?.message || err?.message || 'Failed to save product.')
    } finally {
      setFormLoading(false)
    }
  }

  // Open Edit Mode
  const handleOpenEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.productName || product.name,
      brand: product.brandName || product.brand || '',
      color: product.color || '',
      price: product.price || '',
      discountPrice: product.discountPrice !== null && product.discountPrice !== undefined ? product.discountPrice : '',
      stock: product.stock !== undefined ? product.stock.toString() : '',
      sku: product.sku || '',
      category: product.category || '',
      categoryId: product.categoryId?._id || product.categoryId || '',
      vendor: product.vendor || '',
      vendorId: product.vendorId?._id || product.vendorId || '',
      desc: product.description || product.desc || '',
      tag: product.tag || '',
      returnPolicy: product.returnPolicy || '',
      isActive: product.status === 'active' || product.status === 'out-of-stock',
      imagePreviews: product.images || [product.image],
      imageFiles: []
    })
    setFormError('')
    setIsAdding(true)
  }

  // Delete loading state
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Confirm delete product (DELETE /api/superadmin/products/:id)
  const handleDeleteConfirm = async () => {
    if (!deletingProductId) return
    try {
      setDeleteLoading(true)

      // Call API if deletingProductId is a backend ID
      if (typeof deletingProductId === 'string' && !deletingProductId.startsWith('prod-local-')) {
        try {
          await deleteProduct(deletingProductId)
        } catch (apiErr) {
          console.error('Delete product API error:', apiErr)
          // 404 handled gracefully
        }
      }

      setProductsList(prev => prev.filter(p => p.id !== deletingProductId && p._id !== deletingProductId))
      if (viewedProduct && (viewedProduct.id === deletingProductId || viewedProduct._id === deletingProductId)) {
        setViewedProduct(null)
      }
      setPaginationData(prev => ({
        ...prev,
        totalProducts: Math.max(0, (prev.totalProducts || productsList.length) - 1)
      }))
      setDeletingProductId(null)
    } catch (err) {
      console.error('Delete error:', err)
    } finally {
      setDeleteLoading(false)
    }
  }

  // Filter products list
  const filteredProducts = productsList.filter((product) => {
    const matchesSearch =
      (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.productName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.vendor || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sku || '').toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className="form-workspace-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              className="back-circle-btn" 
              aria-label="Back to Products list"
              onClick={() => {
                setViewedProduct(null)
                setActiveSlideIndex(0)
                setProductDetailsError(null)
              }}
            >
              <ArrowLeft style={{ width: '18px', height: '18px' }} />
            </button>
            <h2>View Product</h2>
          </div>
          {productDetailsLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#1976d2', fontWeight: '600' }}>
              <RotateCw style={{ width: '15px', height: '15px', animation: 'spin 1s linear infinite' }} />
              <span>Fetching live product details...</span>
            </div>
          )}
        </div>

        {productDetailsError && (
          <div style={{ backgroundColor: '#fff3e0', color: '#e65100', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', border: '1px solid #ffe0b2' }}>
            {productDetailsError}
          </div>
        )}

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
                  <span className="product-prop-value">{viewedProduct.categoryId?.name || viewedProduct.category}</span>
                </div>
                <div className="product-prop-row">
                  <span className="product-prop-left">
                    <Tag style={{ width: '15px', height: '15px' }} />
                    Brand
                  </span>
                  <span className="product-prop-value">{viewedProduct.brandName || viewedProduct.brand || 'N/A'}</span>
                </div>
                <div className="product-prop-row">
                  <span className="product-prop-left">
                    <Package style={{ width: '15px', height: '15px' }} />
                    SKU
                  </span>
                  <span className="product-prop-value">{viewedProduct.sku || 'N/A'}</span>
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
                <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#000000', margin: 0, fontFamily: 'var(--admin-font)' }}>{viewedProduct.productName || viewedProduct.name}</h1>
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
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <div style={{ fontSize: '22px', fontWeight: '800', color: '#8e24aa', fontFamily: 'var(--admin-font)' }}>
                  ₹ {parseInt(viewedProduct.discountPrice !== null && viewedProduct.discountPrice !== undefined ? viewedProduct.discountPrice : viewedProduct.price).toLocaleString()}
                </div>
                {viewedProduct.discountPrice !== null && viewedProduct.discountPrice !== undefined && Number(viewedProduct.discountPrice) < Number(viewedProduct.price) && (
                  <div style={{ fontSize: '15px', color: '#90a4ae', textDecoration: 'line-through', fontWeight: '500' }}>
                    ₹ {parseInt(viewedProduct.price).toLocaleString()}
                  </div>
                )}
              </div>

              {/* Description */}
              <div style={{ marginTop: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '6px', fontFamily: 'var(--admin-font)' }}>Description</span>
                <p style={{ fontSize: '12px', color: '#607d8b', lineHeight: '1.6', margin: 0, fontFamily: 'var(--admin-font)', borderBottom: '1px solid #e0e0e0', paddingBottom: '16px' }}>{viewedProduct.description || viewedProduct.desc}</p>
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

                {/* Vendor Details */}
                {(viewedProduct.vendor || viewedProduct.vendorEmail || viewedProduct.vendorPhone) && (
                  <div style={{ borderTop: '1px solid #f1f3f4', paddingTop: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontFamily: 'var(--admin-font)' }}>Vendor Details</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-dark)', fontFamily: 'var(--admin-font)' }}>
                        {viewedProduct.vendor}
                      </span>
                      {viewedProduct.vendorEmail && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#607d8b' }}>
                          <Mail style={{ width: '13px', height: '13px' }} />
                          <span>{viewedProduct.vendorEmail}</span>
                        </div>
                      )}
                      {viewedProduct.vendorPhone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#607d8b' }}>
                          <Phone style={{ width: '13px', height: '13px' }} />
                          <span>{viewedProduct.vendorPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
            border: '1px solid #ffcdd2',
            marginBottom: '20px'
          }}>
            <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
            <span><strong>Error:</strong> {formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Uploader Image container - Full Width at Top */}
          <div className="form-section-card" style={{ padding: '20px 24px', margin: '0 0 24px 0', width: '100%', boxSizing: 'border-box' }}>
            <span className="image-upload-label" style={{ marginBottom: '12px', display: 'block' }}>Upload Product Images</span>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              multiple 
              accept="image/*"
              onChange={handleImageChange}
            />

            <div 
              className="dropzone-area clickable"
              onClick={handleImageClick}
              style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px dashed #90caf9', borderRadius: '12px', backgroundColor: '#f5faff' }}
            >
              <Upload style={{ width: '28px', height: '28px', color: '#1976d2', marginBottom: '8px' }} />
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1976d2' }}>Click to Upload Product Images</div>
              <div style={{ fontSize: '12px', color: '#90a4ae', marginTop: '4px' }}>PNG, JPG, JPEG up to 5MB</div>
            </div>

            {/* Uploaded Images Preview list */}
            {formData.imagePreviews.length > 0 && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                {formData.imagePreviews.map((preview, index) => (
                  <div key={index} style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                    <img src={preview} alt={`upload-${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button 
                      type="button" 
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
                          imageFiles: prev.imageFiles ? prev.imageFiles.filter((_, i) => i !== index) : []
                        }))
                      }}
                      style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                    >
                      <X style={{ width: '12px', height: '12px' }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Two Column inputs layout */}
          <div className="form-grid-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            
            {/* Product Name */}
            <div className="form-field-item">
              <label>Product Name *</label>
              <input 
                type="text" 
                placeholder="Enter Product Name (e.g. iPhone 15)" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required 
              />
            </div>

            {/* Brand */}
            <div className="form-field-item">
              <label>Brand Name *</label>
              <input 
                type="text" 
                placeholder="Enter Brand Name (e.g. Apple)" 
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required 
              />
            </div>

            {/* SKU */}
            <div className="form-field-item">
              <label>SKU (Stock Keeping Unit) *</label>
              <input 
                type="text" 
                placeholder="e.g. IPH15-128" 
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required 
              />
            </div>

            {/* Color */}
            <div className="form-field-item">
              <label>Color</label>
              <input 
                type="text" 
                placeholder="e.g. Black, Silver, Blue" 
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>

            {/* Price */}
            <div className="form-field-item">
              <label>Price (₹) *</label>
              <input 
                type="number" 
                placeholder="Enter Price in INR" 
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required 
              />
            </div>

            {/* Discount Price */}
            <div className="form-field-item">
              <label>Discount Price (₹)</label>
              <input 
                type="number" 
                placeholder="Enter Discount Price (optional)" 
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
              />
            </div>

            {/* Stock */}
            <div className="form-field-item">
              <label>Stock Quantity *</label>
              <input 
                type="number" 
                placeholder="Enter Available Stock" 
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required 
              />
            </div>

            {/* Category */}
            <div className="form-field-item">
              <label>Category *</label>
              <select 
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

            {/* Category ID (Optional) */}
            <div className="form-field-item">
              <label>Category ID (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. 65cat123" 
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              />
            </div>

            {/* Vendor ID (Optional) */}
            <div className="form-field-item">
              <label>Vendor ID (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. 65ven123" 
                value={formData.vendorId}
                onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
              />
            </div>

            {/* Tags */}
            <div className="form-field-item">
              <label>Tags</label>
              <input 
                type="text" 
                placeholder="Comma separated tags e.g. Wireless, Bluetooth" 
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              />
            </div>

            {/* Return Policy */}
            <div className="form-field-item">
              <label>Return Policy</label>
              <input 
                type="text" 
                placeholder="e.g. 7 Days Replacement" 
                value={formData.returnPolicy}
                onChange={(e) => setFormData({ ...formData, returnPolicy: e.target.value })}
              />
            </div>

          </div>

          {/* Description */}
          <div className="form-field-item" style={{ marginTop: '20px' }}>
            <label>Product Description</label>
            <textarea 
              rows={4}
              placeholder="Provide a detailed description of the product..."
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--border-light)', padding: '12px', fontSize: '13px', resize: 'vertical' }}
            />
          </div>

          {/* Active Status toggle */}
          <div className="status-toggle-wrapper" style={{ marginTop: '20px' }}>
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

          {/* Form Actions */}
          <div className="form-actions-row" style={{ marginTop: '32px' }}>
            <button 
              type="button" 
              className="btn-reset-white"
              onClick={handleResetForm}
              disabled={formLoading}
            >
              Reset
            </button>
            <button 
              type="submit" 
              className="btn-save-green"
              disabled={formLoading}
            >
              {formLoading ? 'Creating Product...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    )
  }


  // 3. Default List View
  const stats = [
    { id: 'total', filterVal: 'all', label: 'Total Product', value: isApiLoaded ? (paginationData.totalProducts || productsList.length) : 500, icon: Package, background: '#ffecb3', color: '#3b82f6' }, 
    { id: 'active', filterVal: 'active', label: 'Active Products', value: isApiLoaded ? productsList.filter(p => p.status === 'active').length : 450, icon: CheckCircle2, background: '#c8e6c9', color: '#2ecc71' }, 
    { id: 'outofstock', filterVal: 'out-of-stock', label: 'Out Of Stock', value: isApiLoaded ? productsList.filter(p => p.status === 'out-of-stock' || p.stock === 0).length : 50, icon: ShieldAlert, background: '#ffcdd2', color: '#f43f5e' }, 
    { id: 'category', filterVal: 'category', label: 'Product Category', value: isApiLoaded ? new Set(productsList.map(p => p.category)).size : 20, icon: LayoutGrid, background: '#b2dfdb', color: '#3b82f6' } 
  ]

  return (
    <div className="product-management-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title Header with Add and Refresh buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Products</h1>
          <p style={{ color: '#607d8b', fontSize: '13px' }}>
            Manage all Products available on the platform.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            type="button"
            className="btn-reset-white"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px' }}
            onClick={fetchProducts}
            disabled={loading}
            title="Refresh Products"
          >
            <RotateCw style={{ width: '15px', height: '15px', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            <span>Refresh</span>
          </button>
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
      </div>

      {/* Error Alert Banner */}
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
          <span><strong>Notice:</strong> {fetchError.includes('jwt expired') ? 'Login session expired (jwt expired). Showing fallback products. Please log in again to sync live data.' : fetchError}</span>
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
              onClick={fetchProducts}
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
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <RotateCw style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                      <span>Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedProducts.length > 0 ? (
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
                        onClick={() => handleViewProduct(product)}
                      >
                        {product.productName || product.name}
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
                          onClick={() => handleViewProduct(product)}
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
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-delete-confirm"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductManagement
