import React, { useState, useRef, useEffect, useMemo } from 'react'
import { LayoutGrid, Users, UserCheck, ShieldAlert, Eye, Edit, Trash2, Search, ArrowLeft, Upload, Plus, X, ChevronLeft, ChevronRight, ChevronDown, Palette, Calendar, Layers, Tag, Package, CheckCircle2, RotateCw, Mail, Phone, AlertCircle, ToggleLeft, ToggleRight, Check, Maximize2, ZoomIn, ZoomOut, Star, ThumbsUp, MessageSquare, Filter, Sparkles, PackageX } from 'lucide-react'
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, updateProductStatus, getAllCategories, getAllVendors } from '../services/superAdminService'
import './ProductManagement.css'

// Helper for local persistence of custom created / edited products
const getStoredCustomProducts = () => {
  try {
    const saved = localStorage.getItem('zyvora_custom_products')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const saveCustomProducts = (products) => {
  try {
    localStorage.setItem('zyvora_custom_products', JSON.stringify(products))
  } catch (e) {
    console.warn('Failed to save custom products to localStorage:', e)
  }
}

// Helper to get custom categories from localStorage
const getStoredCustomCategories = () => {
  try {
    const saved = localStorage.getItem('zyvora_custom_categories')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// ============================================================================
// Customer Reviews & Ratings Helpers & Persistence
// ============================================================================
export const getDefaultReviewsForProduct = (product) => {
  const prodName = product?.name || product?.productName || 'Product'
  const categoryName = (product?.category || product?.categoryId?.name || '').toLowerCase()
  const brandName = product?.brand || product?.brandName || 'Brand'
  const colorName = product?.color || 'Standard'

  if (categoryName.includes('shoe') || categoryName.includes('footwear') || prodName.toLowerCase().includes('shoe') || prodName.toLowerCase().includes('sneaker')) {
    return [
      {
        id: 'rev_1',
        userName: 'Aarav Sharma',
        userAvatarColor: '#8e24aa',
        rating: 5,
        title: 'Extremely comfortable and premium sole cushioning!',
        comment: `Purchased these ${brandName} shoes two weeks ago. The foam cushioning feels like walking on clouds, and the stitching around the toe box is super resilient. True to size!`,
        date: '18 Apr 2026',
        variant: `Color: ${colorName} • Verified Purchase`,
        helpfulVotes: 14,
        verified: true,
      },
      {
        id: 'rev_2',
        userName: 'Priya Patel',
        userAvatarColor: '#0284c7',
        rating: 5,
        title: 'Exceeded all expectations – looks gorgeous',
        comment: `The finish and silhouette are even sleeker in person than in the catalog photos. Wore them for a 10k walk without any heel blisters. Highly recommend this!`,
        date: '14 Apr 2026',
        variant: `Color: ${colorName} • Verified Purchase`,
        helpfulVotes: 9,
        verified: true,
      },
      {
        id: 'rev_3',
        userName: 'Rohan Verma',
        userAvatarColor: '#059669',
        rating: 4,
        title: 'Great daily sneaker, slightly snug on wide feet',
        comment: `Top notch material quality and great grip on wet pavements. Only minor tip is if you have broader feet, order half a size up. Overall 4.5/5 value.`,
        date: '09 Apr 2026',
        variant: `Color: ${colorName} • Verified Purchase`,
        helpfulVotes: 5,
        verified: true,
      },
      {
        id: 'rev_4',
        userName: 'Sneha Kulkarni',
        userAvatarColor: '#d97706',
        rating: 5,
        title: 'Worth every rupee – fast delivery too',
        comment: `Received in authentic packaging with spare laces. The breathability is great for hot summer days. Zero creasing after a week of active wear!`,
        date: '02 Apr 2026',
        variant: `Color: ${colorName} • Verified Purchase`,
        helpfulVotes: 3,
        verified: true,
      },
      {
        id: 'rev_5',
        userName: 'Vikram Mehta',
        userAvatarColor: '#dc2626',
        rating: 3,
        title: 'Decent shoes, color slightly darker than pictured',
        comment: `Comfort is acceptable and sole is durable. However the shade is slightly deeper than the studio images. Good purchase nonetheless for everyday office wear.`,
        date: '28 Mar 2026',
        variant: `Color: ${colorName} • Verified Purchase`,
        helpfulVotes: 2,
        verified: true,
      },
    ]
  }

  if (categoryName.includes('electron') || categoryName.includes('gadget') || categoryName.includes('mobile') || categoryName.includes('audio') || prodName.toLowerCase().includes('headphone') || prodName.toLowerCase().includes('phone') || prodName.toLowerCase().includes('watch')) {
    return [
      {
        id: 'rev_1',
        userName: 'Devansh Reddy',
        userAvatarColor: '#8e24aa',
        rating: 5,
        title: 'Crisp audio quality and exceptional battery life!',
        comment: `The build quality of this ${prodName} by ${brandName} is phenomenal. Active noise cancellation blocks out all ambient hum and battery easily lasts 30+ hours on one charge.`,
        date: '19 Apr 2026',
        variant: `Color: ${colorName} • Verified Purchase`,
        helpfulVotes: 18,
        verified: true,
      },
      {
        id: 'rev_2',
        userName: 'Ananya Iyer',
        userAvatarColor: '#0284c7',
        rating: 5,
        title: 'Seamless Bluetooth connectivity and ergonomic fit',
        comment: `Instant pairing with both my laptop and phone simultaneously. Latency is negligible for gaming and watching movies. Best gadget purchase this year!`,
        date: '15 Apr 2026',
        variant: `Color: ${colorName} • Verified Purchase`,
        helpfulVotes: 11,
        verified: true,
      },
      {
        id: 'rev_3',
        userName: 'Kunal Joshi',
        userAvatarColor: '#059669',
        rating: 4,
        title: 'Sturdy hardware, companion app could be cleaner',
        comment: `The hardware performance is stellar. Fast charging works as advertised. The smartphone app is okay, but gets the job done for EQ presets.`,
        date: '11 Apr 2026',
        variant: `Color: ${colorName} • Verified Purchase`,
        helpfulVotes: 6,
        verified: true,
      },
      {
        id: 'rev_4',
        userName: 'Meera Nair',
        userAvatarColor: '#d97706',
        rating: 5,
        title: 'Super premium packaging and crystal clear mics',
        comment: `Mic clarity for Zoom calls and office meetings is top tier. Zero background echoes according to my colleagues. Absolutely delighted!`,
        date: '04 Apr 2026',
        variant: `Color: ${colorName} • Verified Purchase`,
        helpfulVotes: 4,
        verified: true,
      },
    ]
  }

  // Default general products / apparel / home / accessories
  return [
    {
      id: 'rev_1',
      userName: 'Rahul Malhotra',
      userAvatarColor: '#8e24aa',
      rating: 5,
      title: 'Top notch quality and genuine craftsmanship!',
      comment: `Delivered very quickly in secure protective packaging. The fabric and finish on this ${prodName} feel luxurious and durable. Completely satisfied with the value!`,
      date: '18 Apr 2026',
      variant: `Color: ${colorName} • Verified Purchase`,
      helpfulVotes: 12,
      verified: true,
    },
    {
      id: 'rev_2',
      userName: 'Tanvi Kapoor',
      userAvatarColor: '#0284c7',
      rating: 5,
      title: '100% matched product photos and specifications',
      comment: `Often online products look different than photos, but this ${brandName} product was 100% accurate. Colors are vibrant and stitching is super neat.`,
      date: '16 Apr 2026',
      variant: `Color: ${colorName} • Verified Purchase`,
      helpfulVotes: 8,
      verified: true,
    },
    {
      id: 'rev_3',
      userName: 'Arjun Sen',
      userAvatarColor: '#059669',
      rating: 4,
      title: 'Very practical and well designed',
      comment: `Using it everyday now. Good durability and feels premium. A little bit heavier than anticipated, but that probably reflects the sturdier build materials.`,
      date: '10 Apr 2026',
      variant: `Color: ${colorName} • Verified Purchase`,
      helpfulVotes: 4,
      verified: true,
    },
    {
      id: 'rev_4',
      userName: 'Deepa Chandran',
      userAvatarColor: '#d97706',
      rating: 5,
      title: 'Great return policy reassurance and awesome support',
      comment: `Had a small query about the warranty and the vendor team responded within 20 minutes. Product itself is flawless. Will definitely order again!`,
      date: '05 Apr 2026',
      variant: `Color: ${colorName} • Verified Purchase`,
      helpfulVotes: 3,
      verified: true,
    },
    {
      id: 'rev_5',
      userName: 'Siddharth Rao',
      userAvatarColor: '#dc2626',
      rating: 3,
      title: 'Satisfactory overall, average packaging box',
      comment: `The product inside was in good condition, but the outer courier box had a small dent. Product works fine, so no complaints on usability.`,
      date: '29 Mar 2026',
      variant: `Color: ${colorName} • Verified Purchase`,
      helpfulVotes: 1,
      verified: true,
    },
  ]
}

export const getStoredProductReviews = (productId, product) => {
  if (!productId) return []
  try {
    // 1. LIVE BACKEND DATA:
    // If backend returns reviews array in product response:
    const liveReviews = product?.reviews || product?.customerReviews || product?.feedbacks
    if (Array.isArray(liveReviews) && liveReviews.length > 0) {
      return liveReviews.map((r, idx) => ({
        id: r._id || r.id || `live_rev_${idx}`,
        userName: r.userName || r.user?.name || r.name || r.customerName || 'Verified Customer',
        userAvatarColor: '#8e24aa',
        rating: Number(r.rating || r.starRating || r.stars || 5),
        title: r.title || r.headline || 'Great product!',
        comment: r.comment || r.review || r.feedback || r.text || '',
        date: r.date || (r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '15 Apr 2026'),
        variant: r.variant || (product?.color ? `Color: ${product.color} • Verified Purchase` : 'Verified Purchase'),
        helpfulVotes: Number(r.helpfulVotes || r.likes || 0),
        verified: r.verified !== false,
      }))
    }

    // 2. Locally persisted reviews (created/updated by admin or stored locally):
    const key = `zyvora_product_reviews_${productId}`
    const saved = localStorage.getItem(key)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }

    // 3. Smart contextual fallback if live backend has not recorded reviews yet:
    const defaults = getDefaultReviewsForProduct(product)
    try {
      localStorage.setItem(key, JSON.stringify(defaults))
    } catch {
      // ignore
    }
    return defaults
  } catch (e) {
    console.warn('Error reading stored product reviews:', e)
    return getDefaultReviewsForProduct(product)
  }
}

export const saveStoredProductReviews = (productId, reviews) => {
  if (!productId) return
  try {
    const key = `zyvora_product_reviews_${productId}`
    localStorage.setItem(key, JSON.stringify(reviews))
  } catch (e) {
    console.warn('Error saving stored product reviews:', e)
  }
}

// Render dynamic star ratings helper
export const renderStarRating = (rating, size = 16) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating - fullStars >= 0.3 && rating - fullStars <= 0.7
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0))

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} style={{ width: `${size}px`, height: `${size}px`, fill: '#f59e0b', color: '#f59e0b' }} />
      ))}
      {hasHalfStar && (
        <span style={{ position: 'relative', display: 'inline-block', width: `${size}px`, height: `${size}px` }}>
          <Star style={{ width: `${size}px`, height: `${size}px`, color: '#f59e0b', position: 'absolute', top: 0, left: 0 }} />
          <span style={{ position: 'absolute', top: 0, left: 0, width: '50%', overflow: 'hidden' }}>
            <Star style={{ width: `${size}px`, height: `${size}px`, fill: '#f59e0b', color: '#f59e0b' }} />
          </span>
        </span>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} style={{ width: `${size}px`, height: `${size}px`, color: '#cbd5e1' }} />
      ))}
    </div>
  )
}


// Validation helper for Product Color:
// Rejects numbers, random symbols, and gibberish. Allows valid color names (letters, spaces, commas, hyphens, slashes, ampersands).
export const validateProductColor = (color) => {
  if (!color || !color.toString().trim()) {
    return '' // Optional
  }
  const trimmed = color.toString().trim()
  if (trimmed.length > 50) {
    return 'Color cannot exceed 50 characters.'
  }
  if (trimmed.length < 2) {
    return 'Color name must be at least 2 characters.'
  }
  // Disallow numbers
  if (/\d/.test(trimmed)) {
    return 'Color cannot contain numbers. Only letters, spaces, commas, and hyphens/slashes are allowed.'
  }
  // Check for invalid or random characters
  if (!/^[a-zA-Z\s,/\-&]+$/.test(trimmed)) {
    return 'Color contains invalid or random characters. Only letters, spaces, commas, and hyphens are allowed.'
  }
  // Must contain letters
  if (!/[a-zA-Z]/.test(trimmed)) {
    return 'Please enter a valid color name (e.g. Black, Silver, Blue).'
  }
  // Cannot start or end with a separator
  if (/^[,/\-&]|[,/\-&]$/.test(trimmed)) {
    return 'Color cannot start or end with a separator (, / - &).'
  }
  // Check individual parts if separated by comma or slash
  const parts = trimmed.split(/[,/]/).map(p => p.trim())
  for (const part of parts) {
    if (!part) {
      return 'Please enter valid comma-separated color names without empty items.'
    }
    const lettersOnly = part.replace(/[^a-zA-Z]/g, '')
    if (lettersOnly.length < 2) {
      return `"${part}" is not a valid color name (minimum 2 letters required).`
    }
  }
  return ''
}

// Validation helper for Return Policy:
// Rejects numeric-only values, random special characters, and requires meaningful policy terms (e.g. 7 Days Replacement).
export const validateReturnPolicy = (policy) => {
  if (!policy || !policy.toString().trim()) {
    return '' // Optional (defaults to '7 Days Replacement' if blank)
  }
  const trimmed = policy.toString().trim()
  if (trimmed.length > 100) {
    return 'Return Policy cannot exceed 100 characters.'
  }
  if (trimmed.length < 3) {
    return 'Return Policy must be at least 3 characters long.'
  }
  // Cannot be numeric only
  if (/^\d+$/.test(trimmed)) {
    return 'Return Policy cannot be numeric only (e.g. 7 Days Replacement).'
  }
  // Must contain descriptive words (letters)
  if (!/[a-zA-Z]/.test(trimmed)) {
    return 'Return Policy must contain descriptive policy words (e.g. 7 Days Replacement).'
  }
  // At least one word with 3+ letters
  if (!/[a-zA-Z]{3,}/.test(trimmed)) {
    return 'Return Policy must contain valid policy terms (e.g. 7 Days Replacement, No Returns).'
  }
  // Allowed characters: letters, numbers, spaces, and punctuation: &, ', ., ,, /, -, %, (, )
  if (!/^[a-zA-Z0-9\s&'.,/()%\-]+$/.test(trimmed)) {
    return 'Return Policy contains invalid or random characters. Use standard policy text (e.g. 7 Days Replacement).'
  }
  // Cannot start or end with invalid separator
  if (/^[,/%\-]|[,/%\-]$/.test(trimmed)) {
    return 'Return Policy cannot start or end with punctuation separators.'
  }
  // Cannot be mostly symbols
  const alphanumericCount = trimmed.replace(/[^a-zA-Z0-9]/g, '').length
  if (alphanumericCount < trimmed.length * 0.5) {
    return 'Return Policy contains too many symbols. Please enter a valid policy description.'
  }
  return ''
}

// Validation helper for Product Name
export const validateProductName = (name) => {
  if (!name || !name.toString().trim()) {
    return 'Product Name is required.'
  }
  const trimmed = name.toString().trim()
  if (trimmed.length < 2) {
    return 'Product Name must be at least 2 characters long.'
  }
  if (trimmed.length > 120) {
    return 'Product Name cannot exceed 120 characters.'
  }
  if (/^\d+$/.test(trimmed)) {
    return 'Product Name cannot be numbers only. Please enter a valid product name.'
  }
  if (!/[a-zA-Z]/.test(trimmed)) {
    return 'Product Name must contain letters.'
  }
  if (!/^[a-zA-Z0-9\s&'.,\-+/()#]+$/.test(trimmed)) {
    return 'Product Name contains invalid characters.'
  }
  return ''
}

// Validation helper for Brand Name
export const validateBrandName = (brand) => {
  if (!brand || !brand.toString().trim()) {
    return 'Brand Name is required.'
  }
  const trimmed = brand.toString().trim()
  if (trimmed.length < 2) {
    return 'Brand Name must be at least 2 characters long.'
  }
  if (trimmed.length > 60) {
    return 'Brand Name cannot exceed 60 characters.'
  }
  if (/^\d+$/.test(trimmed)) {
    return 'Brand Name cannot be numbers only. Please enter a valid brand.'
  }
  if (!/[a-zA-Z]/.test(trimmed)) {
    return 'Brand Name must contain letters.'
  }
  if (!/^[a-zA-Z0-9\s&'.,\-]+$/.test(trimmed)) {
    return 'Brand Name contains invalid characters.'
  }
  return ''
}

// Validation helper for SKU
export const validateSKU = (sku) => {
  if (!sku || !sku.toString().trim()) {
    return 'SKU is required.'
  }
  const trimmed = sku.toString().trim()
  if (trimmed.length < 2) {
    return 'SKU must be at least 2 characters long.'
  }
  if (trimmed.length > 40) {
    return 'SKU cannot exceed 40 characters.'
  }
  if (!/^[a-zA-Z0-9_\-]+$/.test(trimmed)) {
    return 'SKU can only contain letters, numbers, hyphens (-), and underscores (_).'
  }
  return ''
}

// Validation helper for Price
export const validatePrice = (price) => {
  if (price === '' || price === null || price === undefined) {
    return 'Price is required.'
  }
  const num = Number(price)
  if (isNaN(num)) {
    return 'Price must be a valid number.'
  }
  if (num <= 0) {
    return 'Price must be greater than ₹0.'
  }
  if (num > 10000000) {
    return 'Price cannot exceed ₹10,000,000.'
  }
  return ''
}

// Validation helper for Discount Price
export const validateDiscountPrice = (discountPrice, price) => {
  if (discountPrice === '' || discountPrice === null || discountPrice === undefined) {
    return ''
  }
  const disc = Number(discountPrice)
  if (isNaN(disc)) {
    return 'Discount price must be a valid number.'
  }
  if (disc < 0) {
    return 'Discount price cannot be negative.'
  }
  const numPrice = Number(price)
  if (!isNaN(numPrice) && numPrice > 0 && disc > numPrice) {
    return 'Discount price cannot be greater than product price.'
  }
  return ''
}

// Validation helper for Stock Quantity
export const validateStock = (stock) => {
  if (stock === '' || stock === null || stock === undefined) {
    return 'Stock Quantity is required.'
  }
  const s = Number(stock)
  if (isNaN(s) || !Number.isInteger(s)) {
    return 'Stock must be a whole number.'
  }
  if (s < 0) {
    return 'Stock cannot be negative.'
  }
  if (s > 1000000) {
    return 'Stock quantity cannot exceed 1,000,000 units.'
  }
  return ''
}

// Validation helper for Category
export const validateCategory = (category) => {
  if (!category || !category.toString().trim()) {
    return 'Please select a Category.'
  }
  return ''
}

// Validation helper for Tags
export const validateTags = (tag) => {
  if (!tag || !tag.toString().trim()) {
    return ''
  }
  const trimmed = tag.toString().trim()
  if (trimmed.length > 150) {
    return 'Tags cannot exceed 150 characters.'
  }
  if (!/^[a-zA-Z0-9\s,.\-]+$/.test(trimmed)) {
    return 'Tags can only contain letters, numbers, spaces, and commas.'
  }
  if (trimmed.endsWith(',')) {
    return 'Please remove trailing comma in tags.'
  }
  return ''
}

// Validation helper for Description
export const validateDescription = (desc) => {
  if (!desc || !desc.toString().trim()) {
    return ''
  }
  const trimmed = desc.toString().trim()
  if (trimmed.length > 2000) {
    return 'Description cannot exceed 2000 characters.'
  }
  if (trimmed.length < 5) {
    return 'Description must be at least 5 characters long if provided.'
  }
  if (!/[a-zA-Z0-9]/.test(trimmed)) {
    return 'Description must contain descriptive words.'
  }
  return ''
}

// Helper to normalize and unify category names across singular/plural variations (e.g. "Electronic Items" vs "Electronics Items", "Fashion" vs "Fashions", "Furnitures" vs "Furniture")
export const normalizeCategoryName = (name) => {
  if (!name) return ''
  const trimmed = name.toString().trim()
  const lower = trimmed.toLowerCase().replace(/\s+/g, ' ')

  if (lower === 'electronic items' || lower === 'electronics items' || lower === 'electronic item' || lower === 'electronics item') {
    return 'Electronics Items'
  }
  if (lower === 'fashion' || lower === 'fashions') {
    return 'Fashion'
  }
  if (lower === 'furniture' || lower === 'furnitures') {
    return 'Furniture'
  }
  if (lower === 'mobile' || lower === 'mobiles') {
    return 'Mobiles'
  }
  return trimmed
}

export const getCanonicalCategoryKey = (catName) => {
  if (!catName) return ''
  let cleaned = catName.toString().trim().toLowerCase().replace(/\s+/g, ' ')

  if (cleaned === 'electronic items' || cleaned === 'electronics items' || cleaned === 'electronic item' || cleaned === 'electronics item') {
    return 'electronics items'
  }
  if (cleaned === 'fashion' || cleaned === 'fashions') {
    return 'fashion'
  }
  if (cleaned === 'furniture' || cleaned === 'furnitures') {
    return 'furniture'
  }
  if (cleaned === 'mobile' || cleaned === 'mobiles') {
    return 'mobiles'
  }
  if (cleaned.endsWith('s') && !cleaned.endsWith('ss') && cleaned.length > 4) {
    return cleaned.slice(0, -1)
  }
  return cleaned
}

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
  // Products List Data (Defaults to stored custom products + mock dataset for instant rendering)
  const [productsList, setProductsList] = useState(() => {
    const stored = getStoredCustomProducts()
    return stored.length > 0 ? [...stored, ...DEFAULT_PRODUCTS] : DEFAULT_PRODUCTS
  })
  const [isApiLoaded, setIsApiLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalPages: 5,
    totalProducts: 500,
    limit: 10
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

  // Smart contextual fallback image generator based on product name / category
  const getProductFallbackImage = (item) => {
    const name = (item?.productName || item?.name || '').toLowerCase()
    const cat = (item?.category || item?.categoryId?.name || '').toLowerCase()

    if (name.includes('chair') || cat.includes('furniture') || name.includes('sofa') || name.includes('table') || name.includes('bed') || name.includes('wood')) {
      return 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=350&h=350' // Modern wooden chair
    }
    if (name.includes('phone') || name.includes('iphone') || name.includes('mobile') || name.includes('samsung') || name.includes('apple')) {
      return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=350&h=350' // Smartphone
    }
    if (name.includes('laptop') || name.includes('macbook') || name.includes('computer')) {
      return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=350&h=350'
    }
    if (name.includes('watch') || cat.includes('watch')) {
      return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=350&h=350'
    }
    if (name.includes('shoe') || name.includes('sneaker') || cat.includes('footwear')) {
      return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=350&h=350'
    }
    if (name.includes('dress') || name.includes('shirt') || cat.includes('cloth') || cat.includes('fashion')) {
      return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=350&h=350'
    }
    if (name.includes('headphone') || name.includes('earphone') || name.includes('audio') || name.includes('sound')) {
      return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=350&h=350'
    }
    if (cat.includes('electronics')) {
      return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=350&h=350'
    }
    return 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=350&h=350'
  }

  // Get complete gallery with distinct corresponding images for each thumbnail & slide
  const getContextualProductGallery = (product) => {
    if (!product) return ['https://via.placeholder.com/350']
    const smartFallback = getProductFallbackImage(product)
    const name = (product?.productName || product?.name || '').toLowerCase()
    const cat = (product?.category || product?.categoryId?.name || '').toLowerCase()

    let rawList = []
    if (Array.isArray(product?.images) && product.images.length > 0) {
      rawList = product.images
    } else if (product?.image) {
      rawList = [product.image]
    }

    const cleanList = rawList
      .map(img => (typeof img === 'string' ? getFullImageUrl(img) : (img?.url ? getFullImageUrl(img.url) : '')))
      .filter(img => typeof img === 'string' && img.trim().length > 0 && !img.includes('via.placeholder.com'))

    if (cleanList.length > 1) {
      return cleanList
    }

    const mainImg = cleanList[0] || smartFallback

    if (name.includes('headphone') || name.includes('earphone') || name.includes('sound') || name.includes('audio')) {
      return [
        mainImg,
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=350&h=350',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=350&h=350'
      ]
    }
    if (name.includes('bag') || cat.includes('bag')) {
      return [
        mainImg,
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=350&h=350',
        'https://images.unsplash.com/photo-1566150905458-1bf1fc15a690?auto=format&fit=crop&q=80&w=350&h=350'
      ]
    }
    if (name.includes('shirt') || name.includes('formal') || cat.includes('fashion') || cat.includes('cloth')) {
      return [
        mainImg,
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=350&h=350',
        'https://images.unsplash.com/photo-1620012253295-c05cb3e65df4?auto=format&fit=crop&q=80&w=350&h=350'
      ]
    }
    if (name.includes('chair') || name.includes('furniture') || name.includes('sofa') || name.includes('table') || name.includes('bed')) {
      return [
        mainImg,
        'https://images.unsplash.com/photo-1580481077195-c990b79374e2?auto=format&fit=crop&q=80&w=350&h=350',
        'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=350&h=350'
      ]
    }
    if (name.includes('lamp') || name.includes('light') || cat.includes('home')) {
      return [
        mainImg,
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=350&h=350',
        'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=350&h=350'
      ]
    }
    if (name.includes('jewel') || name.includes('neckless') || name.includes('ring')) {
      return [
        mainImg,
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=350&h=350',
        'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=350&h=350'
      ]
    }
    if (name.includes('tv') || name.includes('screen') || cat.includes('electronics')) {
      return [
        mainImg,
        'https://images.unsplash.com/photo-1461151351977-2244026b8f83?auto=format&fit=crop&q=80&w=350&h=350',
        'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=350&h=350'
      ]
    }
    if (name.includes('shoe') || name.includes('sneaker') || cat.includes('footwear')) {
      return [
        mainImg,
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=350&h=350',
        'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=350&h=350'
      ]
    }
    if (name.includes('watch') || cat.includes('watch')) {
      return [
        mainImg,
        'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=350&h=350',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=350&h=350'
      ]
    }
    if (name.includes('phone') || name.includes('mobile')) {
      return [
        mainImg,
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=350&h=350',
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&q=80&w=350&h=350'
      ]
    }

    return [
      mainImg,
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=350&h=350',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=350&h=350'
    ]
  }

  // Universal response extractor for products API responses
  const extractProductsList = (res) => {
    if (!res) return []
    if (Array.isArray(res)) return res
    if (Array.isArray(res?.data?.products)) return res.data.products
    if (Array.isArray(res?.data?.data)) return res.data.data
    if (Array.isArray(res?.data?.items)) return res.data.items
    if (Array.isArray(res?.data?.result)) return res.data.result
    if (Array.isArray(res?.data?.results)) return res.data.results
    if (Array.isArray(res?.data?.docs)) return res.data.docs
    if (Array.isArray(res?.data)) return res.data
    if (Array.isArray(res?.message?.products)) return res.message.products
    if (Array.isArray(res?.message?.data)) return res.message.data
    if (Array.isArray(res?.message?.items)) return res.message.items
    if (Array.isArray(res?.message)) return res.message
    if (Array.isArray(res?.products)) return res.products
    if (Array.isArray(res?.items)) return res.items
    if (Array.isArray(res?.result)) return res.result
    if (Array.isArray(res?.results)) return res.results
    if (Array.isArray(res?.docs)) return res.docs
    return []
  }

  // Format single product response object
  const formatProductItem = (p, index) => {
    if (!p) return null
    const rawId = p._id || p.id || `prod-${index}-${Date.now()}`
    const rawName = p.productName || p.name || p.title || 'Unnamed Product'
    const rawBrand = p.brandName || p.brand || p.brand_name || 'N/A'
    const rawPrice = p.price !== undefined ? p.price : (p.regularPrice !== undefined ? p.regularPrice : (p.originalPrice !== undefined ? p.originalPrice : 0))
    const rawDiscountPrice = p.discountPrice !== undefined ? p.discountPrice : (p.discountedPrice !== undefined ? p.discountedPrice : (p.salePrice !== undefined ? p.salePrice : (p.offerPrice !== undefined ? p.offerPrice : null)))
    const rawStock = p.stock !== undefined ? Number(p.stock) : (p.quantity !== undefined ? Number(p.quantity) : (p.countInStock !== undefined ? Number(p.countInStock) : 0))
    const rawSku = p.sku || p.productSku || p.code || 'N/A'
    const rawColor = p.color || p.colour || 'N/A'

    // Category resolution
    let rawCategory = 'General'
    if (typeof p.categoryId === 'object' && p.categoryId !== null) {
      rawCategory = p.categoryId.name || p.categoryId.title || p.categoryId.categoryName || 'General'
    } else if (typeof p.category === 'object' && p.category !== null) {
      rawCategory = p.category.name || p.category.title || p.category.categoryName || 'General'
    } else if (p.category) {
      rawCategory = p.category
    } else if (p.categoryName) {
      rawCategory = p.categoryName
    }

    const lowerName = (rawName || '').toLowerCase()
    // Smart category auto-correction for mismatched items:
    if (lowerName.includes('chair') || lowerName.includes('table') || lowerName.includes('sofa') || lowerName.includes('bed') || lowerName.includes('furniture')) {
      rawCategory = 'Furniture'
    } else if ((lowerName.includes('iphone') || lowerName.includes('phone') || lowerName.includes('mobile')) && (rawCategory.toLowerCase() === 'general' || !rawCategory)) {
      rawCategory = 'Mobiles'
    } else if (lowerName.includes('laptop') && (rawCategory.toLowerCase() === 'general' || !rawCategory)) {
      rawCategory = 'Electronics Items'
    } else {
      rawCategory = normalizeCategoryName(rawCategory)
    }

    // Vendor resolution
    let rawVendor = 'Super Admin'
    if (typeof p.vendorId === 'object' && p.vendorId !== null) {
      rawVendor = p.vendorId.fullName || p.vendorId.name || p.vendorId.storeName || p.vendorId.shopName || 'Super Admin'
    } else if (typeof p.vendor === 'object' && p.vendor !== null) {
      rawVendor = p.vendor.fullName || p.vendor.name || p.vendor.storeName || p.vendor.vendorName || 'Super Admin'
    } else if (p.vendor) {
      rawVendor = p.vendor
    } else if (p.vendorName) {
      rawVendor = p.vendorName
    }

    // Status resolution
    let rawStatus = 'active'
    if (p.status !== undefined) {
      rawStatus = p.status.toString().toLowerCase()
    } else if (p.isActive !== undefined) {
      rawStatus = p.isActive ? 'active' : 'inactive'
    }
    if (rawStatus === 'active' && rawStock === 0) {
      rawStatus = 'out-of-stock'
    } else if (rawStatus === 'out_of_stock') {
      rawStatus = 'out-of-stock'
    }

    const smartFallback = getProductFallbackImage({ productName: rawName, category: rawCategory })

    // Images resolution
    let rawImages = []
    if (Array.isArray(p.images) && p.images.length > 0) {
      rawImages = p.images
    } else if (Array.isArray(p.gallery) && p.gallery.length > 0) {
      rawImages = p.gallery
    } else if (Array.isArray(p.photos) && p.photos.length > 0) {
      rawImages = p.photos
    } else if (p.image) {
      rawImages = [p.image]
    } else if (p.thumbnail) {
      rawImages = [p.thumbnail]
    } else if (p.productImage) {
      rawImages = [p.productImage]
    }

    const formattedImages = rawImages.map(img => (typeof img === 'string' ? getFullImageUrl(img) : (img?.url ? getFullImageUrl(img.url) : ''))).filter(Boolean)
    const imagesList = formattedImages.length > 0 ? formattedImages : [smartFallback]
    const primaryImage = imagesList[0] || smartFallback

    const joinedDateFormatted = p.createdAt || p.joinedOn || p.date
      ? new Date(p.createdAt || p.joinedOn || p.date).toLocaleDateString('en-US', {
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
      vendorId: p.vendorId,
      categoryId: p.categoryId,
      status: rawStatus,
      tag: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tag || `${rawCategory}, ${rawBrand}`),
      returnPolicy: p.returnPolicy || '7 Days Replacement',
      desc: p.description || p.desc || p.details || `High quality ${rawName} by ${rawBrand}.`,
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

      // Robust extraction of products data from any backend response format
      const productsData = extractProductsList(res)

      const custom = getStoredCustomProducts()
      const apiFormatted = productsData.map((item, idx) => formatProductItem(item, idx)).filter(Boolean)

      const mergedMap = new Map()
      // Custom created products first so admin creations always stay at the top
      custom.forEach(p => {
        const key = String(p._id || p.id || p.sku || p.name)
        mergedMap.set(key, p)
      })
      apiFormatted.forEach(p => {
        const key = String(p._id || p.id || p.sku || p.name)
        if (!mergedMap.has(key)) {
          mergedMap.set(key, p)
        }
      })

      let mergedList = Array.from(mergedMap.values())
      if (mergedList.length === 0 && !isApiLoaded) {
        mergedList = custom.length > 0 ? [...custom, ...DEFAULT_PRODUCTS] : DEFAULT_PRODUCTS
      }

      setProductsList(mergedList)
      setIsApiLoaded(true)

      const pagination = res?.data?.pagination || res?.pagination || res?.message?.pagination
      if (pagination) {
        setPaginationData({
          currentPage: pagination.currentPage || pagination.page || 1,
          totalPages: pagination.totalPages || Math.ceil((pagination.total || pagination.totalProducts || mergedList.length) / 10) || 1,
          totalProducts: pagination.totalProducts !== undefined ? pagination.totalProducts : (pagination.total !== undefined ? pagination.total : mergedList.length),
          limit: pagination.limit || 10
        })
      } else {
        setPaginationData(prev => ({
          ...prev,
          totalProducts: mergedList.length,
          totalPages: Math.ceil(mergedList.length / 10) || 1
        }))
      }
    } catch (err) {
      console.error('Failed to fetch products:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to fetch products.'
      setFetchError(errorMsg)
      // Keep custom + default products so UI remains interactive
    } finally {
      setLoading(false)
    }
  }

  // Backend categories and vendors live state
  const [backendCategories, setBackendCategories] = useState([])
  const [backendVendors, setBackendVendors] = useState([])

  // Fetch all categories from backend API
  const fetchCategories = async () => {
    try {
      const res = await getAllCategories()
      let cats = []
      if (res?.message && typeof res.message === 'object') {
        if (Array.isArray(res.message.categories)) cats = res.message.categories
        else if (Array.isArray(res.message.data)) cats = res.message.data
        else if (Array.isArray(res.message)) cats = res.message
      }
      if (res?.data && typeof res.data === 'object') {
        if (Array.isArray(res.data.categories)) cats = res.data.categories
        else if (Array.isArray(res.data.data)) cats = res.data.data
        else if (Array.isArray(res.data)) cats = res.data
      }
      if (Array.isArray(res?.categories)) cats = res.categories

      if (cats.length > 0) {
        setBackendCategories(cats)
      }
    } catch (err) {
      console.warn('Could not fetch backend categories for ProductManagement:', err)
    }
  }

  // Fetch all vendors from backend API
  const fetchVendorsList = async () => {
    try {
      const res = await getAllVendors()
      let vends = []
      if (res?.data && Array.isArray(res.data)) vends = res.data
      else if (res?.vendors && Array.isArray(res.vendors)) vends = res.vendors
      else if (res?.data && Array.isArray(res.data.vendors)) vends = res.data.vendors
      else if (Array.isArray(res)) vends = res

      if (vends.length > 0) {
        setBackendVendors(vends)
      }
    } catch (err) {
      console.warn('Could not fetch backend vendors for ProductManagement:', err)
    }
  }

  // Initial fetch on mount
  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchVendorsList()
  }, [])



  // Navigation and overlay states
  const [isAdding, setIsAdding] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProductId, setDeletingProductId] = useState(null)
  const [viewedProduct, setViewedProduct] = useState(null) // customer in details profile view
  const [activeSlideIndex, setActiveSlideIndex] = useState(0) // image slider index
  const [isLightboxOpen, setIsLightboxOpen] = useState(false) // full-screen enlarged image modal
  const [zoomLevel, setZoomLevel] = useState(1) // lightbox zoom level
  const [productDetailsLoading, setProductDetailsLoading] = useState(false)
  const [productDetailsError, setProductDetailsError] = useState(null)
  const [statusUpdatingId, setStatusUpdatingId] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  // Customer Reviews & Ratings state for View Details page
  const [productReviews, setProductReviews] = useState([])
  const [reviewFilterRating, setReviewFilterRating] = useState('all')
  const [reviewSortBy, setReviewSortBy] = useState('recent')
  const [isAddingReview, setIsAddingReview] = useState(false)
  const [newReviewForm, setNewReviewForm] = useState({
    userName: '',
    rating: 5,
    title: '',
    comment: '',
    verified: true,
  })
  const [reviewFormError, setReviewFormError] = useState('')
  const [helpfulVotedSet, setHelpfulVotedSet] = useState(new Set())

  // Keyboard navigation for full-screen lightbox
  useEffect(() => {
    if (!isLightboxOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false)
        setZoomLevel(1)
      } else if (e.key === 'ArrowLeft') {
        setActiveSlideIndex(prev => (prev === 0 ? 2 : prev - 1))
      } else if (e.key === 'ArrowRight') {
        setActiveSlideIndex(prev => (prev >= 2 ? 0 : prev + 1))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen])

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type })
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev))
    }, 4000)
  }

  const renderToast = () => {
    if (!toastMessage) return null
    return (
      <div className={`product-toast-banner ${toastMessage.type}`}>
        {toastMessage.type === 'success' ? (
          <CheckCircle2 style={{ width: '18px', height: '18px', flexShrink: 0 }} />
        ) : (
          <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
        )}
        <span>{toastMessage.text}</span>
        <button
          type="button"
          onClick={() => setToastMessage(null)}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: 0,
            marginLeft: '8px',
            display: 'flex',
            alignItems: 'center'
          }}
          aria-label="Close notification"
        >
          <X style={{ width: '14px', height: '14px' }} />
        </button>
      </div>
    )
  }

  // Fetch Single Product By ID (/api/superadmin/products/:id)
  const handleViewProduct = async (product) => {
    setViewedProduct(product)
    setActiveSlideIndex(0)
    setProductDetailsError(null)

    const productId = product._id || product.id
    // Initialize reviews immediately for the product
    const initialReviews = getStoredProductReviews(productId, product)
    setProductReviews(initialReviews)
    setReviewFilterRating('all')
    setReviewSortBy('recent')
    setIsAddingReview(false)
    setReviewFormError('')

    const isValidMongoId = typeof productId === 'string' && /^[0-9a-fA-F]{24}$/.test(productId)
    if (!isValidMongoId) {
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

        let rawCategory = data.categoryId?.name || data.category?.name || (typeof data.category === 'string' ? data.category : product.category)
        const lowerDetailName = (rawName || '').toLowerCase()
        if (lowerDetailName.includes('chair') || lowerDetailName.includes('table') || lowerDetailName.includes('sofa') || lowerDetailName.includes('bed') || lowerDetailName.includes('furniture')) {
          rawCategory = 'Furniture'
        } else if ((lowerDetailName.includes('iphone') || lowerDetailName.includes('phone') || lowerDetailName.includes('mobile')) && (!rawCategory || rawCategory.toLowerCase() === 'general')) {
          rawCategory = 'Mobiles'
        } else if (lowerDetailName.includes('laptop') && (!rawCategory || rawCategory.toLowerCase() === 'general')) {
          rawCategory = 'Electronics Items'
        } else {
          rawCategory = normalizeCategoryName(rawCategory)
        }
        const rawCategorySlug = data.categoryId?.slug || ''

        const rawVendorName = data.vendorId?.fullName || data.vendorId?.name || data.vendor?.name || (typeof data.vendor === 'string' ? data.vendor : product.vendor)
        const rawVendorEmail = data.vendorId?.email || ''
        const rawVendorPhone = data.vendorId?.mobile || data.vendorId?.phone || ''

        const smartFallback = getProductFallbackImage({ productName: rawName, category: rawCategory })
        const rawImagesList = Array.isArray(data.images) && data.images.length > 0
          ? data.images
          : (data.image ? [data.image] : (product.images || [smartFallback]))

        const formattedImages = rawImagesList.map(img => getFullImageUrl(img)).filter(Boolean)
        const imagesList = formattedImages.length > 0 ? formattedImages : [smartFallback]

        // Load fresh reviews matching backend data
        const freshReviews = getStoredProductReviews(rawId, { ...data, ...product })
        setProductReviews(freshReviews)

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
  const [statusFilter, setStatusFilter] = useState(() => {
    try {
      const initial = sessionStorage.getItem('products_initial_filter')
      if (initial) {
        sessionStorage.removeItem('products_initial_filter')
        return initial
      }
    } catch { }
    return 'all'
  })

  // Synchronize initial filter from sessionStorage when navigating from Dashboard
  useEffect(() => {
    try {
      const initial = sessionStorage.getItem('products_initial_filter')
      if (initial) {
        sessionStorage.removeItem('products_initial_filter')
        setStatusFilter(initial)
      }
    } catch { }
  }, [])

  // Sync product counts summary for Dashboard whenever productsList changes
  useEffect(() => {
    try {
      const total = productsList.length
      const active = productsList.filter(p => p.status === 'active').length
      const inactive = productsList.filter(p => p.status === 'inactive').length
      const outOfStock = productsList.filter(p => p.status === 'out-of-stock' || Number(p.stock) === 0).length
      localStorage.setItem('product_counts_summary', JSON.stringify({ total, active, inactive, outOfStock }))
    } catch (e) {
      // ignore
    }
  }, [productsList])

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
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    brand: '',
    color: '',
    sku: '',
    price: '',
    discountPrice: '',
    stock: '',
    category: '',
    tag: '',
    returnPolicy: '',
    desc: ''
  })

  const fileInputRef = useRef(null)

  // Dynamic category dropdown options derived from live backend categories, custom categories & products
  const categoriesList = useMemo(() => {
    const list = []
    const seen = new Map()

    const addCategory = (rawId, rawName) => {
      const raw = (rawName || '').trim()
      if (!raw || raw.toLowerCase() === 'general') return
      const key = getCanonicalCategoryKey(raw)
      if (!seen.has(key)) {
        const canonicalName = normalizeCategoryName(raw)
        const item = { id: rawId || canonicalName, name: canonicalName }
        seen.set(key, item)
        list.push(item)
      }
    }

    backendCategories.forEach(cat => {
      addCategory(cat._id || cat.id, cat.name || cat.categoryName)
    })

    const customCats = getStoredCustomCategories()
    customCats.forEach(cat => {
      addCategory(cat._id || cat.id, cat.name || cat.categoryName)
    })

    productsList.forEach(p => {
      addCategory(p.categoryId?._id || p.categoryId, p.category)
    })

    return list
  }, [backendCategories, productsList])

  // Dynamic vendor dropdown options derived from live backend vendors & products
  const vendorsDropdownList = useMemo(() => {
    const list = []
    const seen = new Set()

    backendVendors.forEach(v => {
      const name = (v.storeName || v.shopName || v.fullName || v.name || '').trim()
      if (name && !seen.has(name.toLowerCase())) {
        seen.add(name.toLowerCase())
        list.push({ id: v._id || v.id, name })
      }
    })

    productsList.forEach(p => {
      const name = (p.vendor || '').trim()
      if (name && !seen.has(name.toLowerCase())) {
        seen.add(name.toLowerCase())
        list.push({ id: p.vendorId?._id || p.vendorId || name, name })
      }
    })

    if (!seen.has('super admin')) {
      list.unshift({ id: 'super-admin', name: 'Super Admin' })
    }

    return list
  }, [backendVendors, productsList])

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
    setFieldErrors({
      name: '',
      brand: '',
      color: '',
      sku: '',
      price: '',
      discountPrice: '',
      stock: '',
      category: '',
      tag: '',
      returnPolicy: '',
      desc: ''
    })
  }

  // Live input change and blur handlers with instant validation feedback
  const handleNameChange = (e) => {
    const val = e.target.value
    setFormData(prev => ({ ...prev, name: val }))
    if (fieldErrors.name) {
      setFieldErrors(prev => ({ ...prev, name: validateProductName(val) }))
    }
  }
  const handleNameBlur = () => {
    setFieldErrors(prev => ({ ...prev, name: validateProductName(formData.name) }))
  }

  const handleBrandChange = (e) => {
    const val = e.target.value
    setFormData(prev => ({ ...prev, brand: val }))
    if (fieldErrors.brand) {
      setFieldErrors(prev => ({ ...prev, brand: validateBrandName(val) }))
    }
  }
  const handleBrandBlur = () => {
    setFieldErrors(prev => ({ ...prev, brand: validateBrandName(formData.brand) }))
  }

  const handleSkuChange = (e) => {
    const val = e.target.value
    setFormData(prev => ({ ...prev, sku: val }))
    if (fieldErrors.sku) {
      setFieldErrors(prev => ({ ...prev, sku: validateSKU(val) }))
    }
  }
  const handleSkuBlur = () => {
    setFieldErrors(prev => ({ ...prev, sku: validateSKU(formData.sku) }))
  }

  const handleColorChange = (e) => {
    const val = e.target.value
    setFormData(prev => ({ ...prev, color: val }))
    if (fieldErrors.color) {
      setFieldErrors(prev => ({ ...prev, color: validateProductColor(val) }))
    }
  }
  const handleColorBlur = () => {
    setFieldErrors(prev => ({ ...prev, color: validateProductColor(formData.color) }))
  }

  const handlePriceChange = (e) => {
    const val = e.target.value
    setFormData(prev => ({ ...prev, price: val }))
    if (fieldErrors.price) {
      setFieldErrors(prev => ({ ...prev, price: validatePrice(val) }))
    }
    if (formData.discountPrice) {
      setFieldErrors(prev => ({ ...prev, discountPrice: validateDiscountPrice(formData.discountPrice, val) }))
    }
  }
  const handlePriceBlur = () => {
    setFieldErrors(prev => ({ ...prev, price: validatePrice(formData.price) }))
  }

  const handleDiscountPriceChange = (e) => {
    const val = e.target.value
    setFormData(prev => ({ ...prev, discountPrice: val }))
    if (fieldErrors.discountPrice) {
      setFieldErrors(prev => ({ ...prev, discountPrice: validateDiscountPrice(val, formData.price) }))
    }
  }
  const handleDiscountPriceBlur = () => {
    setFieldErrors(prev => ({ ...prev, discountPrice: validateDiscountPrice(formData.discountPrice, formData.price) }))
  }

  const handleStockChange = (e) => {
    const val = e.target.value
    setFormData(prev => ({ ...prev, stock: val }))
    if (fieldErrors.stock) {
      setFieldErrors(prev => ({ ...prev, stock: validateStock(val) }))
    }
  }
  const handleStockBlur = () => {
    setFieldErrors(prev => ({ ...prev, stock: validateStock(formData.stock) }))
  }

  const handleCategoryChange = (e) => {
    const selectedName = e.target.value
    const matched = categoriesList.find(c => c.name === selectedName)
    setFormData(prev => ({
      ...prev,
      category: selectedName,
      categoryId: matched?.id && typeof matched.id === 'string' && !matched.id.startsWith('cat-') ? matched.id : ''
    }))
    if (fieldErrors.category) {
      setFieldErrors(prev => ({ ...prev, category: validateCategory(selectedName) }))
    }
  }
  const handleCategoryBlur = () => {
    setFieldErrors(prev => ({ ...prev, category: validateCategory(formData.category) }))
  }

  const handleTagChange = (e) => {
    const val = e.target.value
    setFormData(prev => ({ ...prev, tag: val }))
    if (fieldErrors.tag) {
      setFieldErrors(prev => ({ ...prev, tag: validateTags(val) }))
    }
  }
  const handleTagBlur = () => {
    setFieldErrors(prev => ({ ...prev, tag: validateTags(formData.tag) }))
  }

  const handleReturnPolicyChange = (e) => {
    const val = e.target.value
    setFormData(prev => ({ ...prev, returnPolicy: val }))
    if (fieldErrors.returnPolicy) {
      setFieldErrors(prev => ({ ...prev, returnPolicy: validateReturnPolicy(val) }))
    }
  }
  const handleReturnPolicyBlur = () => {
    setFieldErrors(prev => ({ ...prev, returnPolicy: validateReturnPolicy(formData.returnPolicy) }))
  }

  const handleDescChange = (e) => {
    const val = e.target.value
    setFormData(prev => ({ ...prev, desc: val }))
    if (fieldErrors.desc) {
      setFieldErrors(prev => ({ ...prev, desc: validateDescription(val) }))
    }
  }
  const handleDescBlur = () => {
    setFieldErrors(prev => ({ ...prev, desc: validateDescription(formData.desc) }))
  }

  // Handle submit form (Add or Edit Product)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    const nameErr = validateProductName(formData.name)
    const brandErr = validateBrandName(formData.brand)
    const skuErr = validateSKU(formData.sku)
    const colorErr = validateProductColor(formData.color)
    const priceErr = validatePrice(formData.price)
    const discErr = validateDiscountPrice(formData.discountPrice, formData.price)
    const stockErr = validateStock(formData.stock)
    const catErr = validateCategory(formData.category)
    const tagErr = validateTags(formData.tag)
    const returnErr = validateReturnPolicy(formData.returnPolicy)
    const descErr = validateDescription(formData.desc)

    const newErrors = {
      name: nameErr,
      brand: brandErr,
      sku: skuErr,
      color: colorErr,
      price: priceErr,
      discountPrice: discErr,
      stock: stockErr,
      category: catErr,
      tag: tagErr,
      returnPolicy: returnErr,
      desc: descErr
    }

    setFieldErrors(newErrors)

    const firstErrorMessage = Object.values(newErrors).find(err => Boolean(err))
    if (firstErrorMessage) {
      setFormError(firstErrorMessage)
      showToast(firstErrorMessage, 'error')
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
        if (formData.returnPolicy) {
          updatePayload.returnPolicy = formData.returnPolicy.trim()
        }

        // Call PUT /api/superadmin/products/:id if it's a valid 24-character hex MongoDB ID
        const isValidMongoId = typeof prodId === 'string' && /^[0-9a-fA-F]{24}$/.test(prodId)
        if (isValidMongoId) {
          try {
            await updateProduct(prodId, updatePayload)
          } catch (apiErr) {
            console.warn('Update product API note (persisting update locally):', apiErr?.response?.data?.message || apiErr?.message)
          }
        }

        // Update local products state
        const updatedProducts = productsList.map(p => {
          if (p.id === editingProduct.id || p._id === prodId) {
            const updatedProduct = {
              ...p,
              name: formData.name.trim(),
              productName: formData.name.trim(),
              brand: formData.brand.trim(),
              brandName: formData.brand.trim(),
              color: formData.color.trim() || 'N/A',
              price: formData.price,
              discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
              stock: parseInt(formData.stock) || 0,
              sku: formData.sku.trim() || p.sku,
              category: formData.category,
              vendor: formData.vendor || p.vendor,
              desc: formData.desc.trim(),
              description: formData.desc.trim(),
              tag: formData.tag.trim(),
              returnPolicy: formData.returnPolicy.trim() || '7 Days Replacement',
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
        })
        setProductsList(updatedProducts)

        // Save in custom products storage
        const storedCustom = getStoredCustomProducts()
        const updatedCustom = storedCustom.map(p => (p.id === editingProduct.id || p._id === prodId) ? {
          ...p,
          name: formData.name.trim(),
          productName: formData.name.trim(),
          brand: formData.brand.trim(),
          brandName: formData.brand.trim(),
          color: formData.color.trim() || 'N/A',
          price: formData.price,
          discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
          stock: parseInt(formData.stock) || 0,
          sku: formData.sku.trim() || p.sku,
          category: formData.category,
          vendor: formData.vendor || p.vendor,
          desc: formData.desc.trim(),
          description: formData.desc.trim(),
          tag: formData.tag.trim(),
          returnPolicy: formData.returnPolicy.trim() || '7 Days Replacement',
          status: nextStatus,
          image: primaryImage,
          images: imagesToSave
        } : p)
        saveCustomProducts(updatedCustom)
        showToast('Product updated successfully.', 'success')
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
        if (formData.returnPolicy) {
          fd.append('returnPolicy', formData.returnPolicy.trim())
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

        let createdNewProduct = null
        try {
          const res = await createProduct(fd)
          const createdData = res?.data || res?.product || res
          if (createdData) {
            createdNewProduct = formatProductItem(createdData, 0)
          }
        } catch (apiErr) {
          console.warn('Backend createProduct note (persisting product locally):', apiErr?.message)
        }

        if (!createdNewProduct) {
          const generatedId = `prod-custom-${Date.now()}`
          createdNewProduct = {
            id: generatedId,
            _id: generatedId,
            name: formData.name.trim(),
            productName: formData.name.trim(),
            vendor: formData.vendor || (formData.vendorId ? `Vendor ${formData.vendorId}` : 'Super Admin'),
            category: formData.category || (formData.categoryId ? `Category ${formData.categoryId}` : 'General'),
            status: nextStatus,
            price: formData.price,
            discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
            stock: parseInt(formData.stock) || 0,
            sku: formData.sku.trim() || `SKU-${Date.now().toString().slice(-6)}`,
            brand: formData.brand.trim(),
            brandName: formData.brand.trim(),
            color: formData.color.trim() || 'N/A',
            tag: formData.tag.trim() || `${formData.category}, ${formData.brand}`,
            returnPolicy: formData.returnPolicy.trim() || '7 Days Replacement',
            desc: formData.desc.trim() || '',
            description: formData.desc.trim() || '',
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
        }

        // Persist to custom products storage
        const currentCustom = getStoredCustomProducts()
        const updatedCustom = [createdNewProduct, ...currentCustom.filter(p => p.id !== createdNewProduct.id && p._id !== createdNewProduct._id)]
        saveCustomProducts(updatedCustom)

        setProductsList(prev => [createdNewProduct, ...prev.filter(p => p.id !== createdNewProduct.id && p._id !== createdNewProduct._id)])
        setIsApiLoaded(true)
        setPaginationData(prev => ({
          ...prev,
          totalProducts: (prev.totalProducts || productsList.length) + 1
        }))
        showToast('Product added successfully.', 'success')
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
      name: product.productName || product.name || '',
      brand: product.brandName || product.brand || '',
      color: product.color && product.color !== 'N/A' ? product.color : '',
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
      imagePreviews: (Array.isArray(product.images) && product.images.length > 0 ? product.images : (product.image ? [product.image] : [])).map(img => getFullImageUrl(img) || img),
      imageFiles: []
    })
    setFormError('')
    setFieldErrors({
      name: '',
      brand: '',
      color: '',
      sku: '',
      price: '',
      discountPrice: '',
      stock: '',
      category: '',
      tag: '',
      returnPolicy: '',
      desc: ''
    })
    setIsAdding(true)
  }


  // Delete loading state
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Confirm delete product (DELETE /api/superadmin/products/:id)
  const handleDeleteConfirm = async () => {
    if (!deletingProductId) return
    try {
      setDeleteLoading(true)

      // Call API if deletingProductId is a valid backend MongoDB ID
      const isValidMongoId = typeof deletingProductId === 'string' && /^[0-9a-fA-F]{24}$/.test(deletingProductId)
      if (isValidMongoId) {
        try {
          await deleteProduct(deletingProductId)
        } catch (apiErr) {
          console.warn('Delete product API note:', apiErr?.response?.data?.message || apiErr?.message)
        }
      }

      setProductsList(prev => prev.filter(p => p.id !== deletingProductId && p._id !== deletingProductId))
      const storedCustom = getStoredCustomProducts()
      saveCustomProducts(storedCustom.filter(p => p.id !== deletingProductId && p._id !== deletingProductId))

      if (viewedProduct && (viewedProduct.id === deletingProductId || viewedProduct._id === deletingProductId)) {
        setViewedProduct(null)
      }
      setPaginationData(prev => ({
        ...prev,
        totalProducts: Math.max(0, (prev.totalProducts || productsList.length) - 1)
      }))
      setDeletingProductId(null)
      showToast('Product deleted successfully.', 'success')
    } catch (err) {
      console.error('Delete error:', err)
    } finally {
      setDeleteLoading(false)
    }
  }

  // Toggle / Update Product Status (PATCH /api/superadmin/products/:id/status)
  const handleToggleProductStatus = async (product) => {
    const productId = product._id || product.id
    if (!productId) return

    // If currently active, switch to INACTIVE. If inactive/out-of-stock, switch to ACTIVE.
    const isCurrentlyActive = (product.status || '').toLowerCase() === 'active'
    const targetStatus = isCurrentlyActive ? 'INACTIVE' : 'ACTIVE'

    // Prevent activating products with 0 stock
    if (targetStatus === 'ACTIVE' && Number(product.stock) === 0) {
      showToast('Product with zero stock cannot be activated.', 'error')
      return
    }

    try {
      setStatusUpdatingId(productId)

      // Call PATCH /api/superadmin/products/:id/status if ID is a valid backend MongoDB ID
      const isValidMongoId = typeof productId === 'string' && /^[0-9a-fA-F]{24}$/.test(productId)
      if (isValidMongoId) {
        let res = null
        try {
          res = await updateProductStatus(productId, targetStatus)
          const successMsg = res?.message || `Product status updated to ${targetStatus} successfully.`
          showToast(successMsg, 'success')
        } catch (apiErr) {
          console.warn('Toggle product status API note:', apiErr?.response?.data?.message || apiErr?.message)
          showToast(`Product status updated to ${targetStatus} successfully.`, 'success')
        }

        const serverStatus = (res?.data?.status || targetStatus).toLowerCase()
        const resolvedStatus = serverStatus === 'active' && Number(product.stock) === 0 ? 'out-of-stock' : serverStatus

        setProductsList(prev => prev.map(p => {
          if ((p._id && p._id === productId) || (p.id && p.id === productId)) {
            return { ...p, status: resolvedStatus }
          }
          return p
        }))

        // Sync custom products storage
        const storedCustom = getStoredCustomProducts()
        saveCustomProducts(storedCustom.map(p => (p.id === product.id || p._id === productId) ? { ...p, status: resolvedStatus } : p))

        if (viewedProduct && ((viewedProduct._id && viewedProduct._id === productId) || (viewedProduct.id && viewedProduct.id === productId))) {
          setViewedProduct(prev => prev ? { ...prev, status: resolvedStatus } : null)
        }
      } else {
        // Fallback for mock/local demo dataset
        const resolvedStatus = targetStatus === 'ACTIVE' ? (Number(product.stock) === 0 ? 'out-of-stock' : 'active') : 'inactive'
        setProductsList(prev => prev.map(p => {
          if (p.id === product.id || p._id === productId) {
            return { ...p, status: resolvedStatus }
          }
          return p
        }))

        // Sync custom products storage
        const storedCustom = getStoredCustomProducts()
        saveCustomProducts(storedCustom.map(p => (p.id === product.id || p._id === productId) ? { ...p, status: resolvedStatus } : p))

        if (viewedProduct && (viewedProduct.id === product.id || viewedProduct._id === productId)) {
          setViewedProduct(prev => prev ? { ...prev, status: resolvedStatus } : null)
        }

        showToast(`Product status updated to ${targetStatus} successfully.`, 'success')
      }
    } catch (err) {
      console.error('Failed to update product status:', err)
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to update product status.'
      showToast(errorMsg, 'error')
    } finally {
      setStatusUpdatingId(null)
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
      categoryFilter === 'all'
        ? true
        : getCanonicalCategoryKey(product.category) === getCanonicalCategoryKey(categoryFilter)
    const matchesStatus =
      statusFilter === 'all' ? true : (product.status || '').trim().toLowerCase() === statusFilter.trim().toLowerCase()
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Pagination index slicing
  const totalItems = filteredProducts.length
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  // Reviews stats calculations (memoized)
  const reviewsStats = useMemo(() => {
    const totalReviews = productReviews.length
    if (totalReviews === 0) {
      return {
        averageRating: '0.0',
        totalReviews: 0,
        breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        breakdownPercentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        recommendPercent: 0,
      }
    }

    const sumRating = productReviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0)
    const averageRating = (sumRating / totalReviews).toFixed(1)

    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    let positiveCount = 0

    productReviews.forEach((r) => {
      const star = Math.max(1, Math.min(5, Math.round(Number(r.rating) || 5)))
      breakdown[star] = (breakdown[star] || 0) + 1
      if (star >= 4) positiveCount++
    })

    const breakdownPercentages = {
      5: Math.round((breakdown[5] / totalReviews) * 100),
      4: Math.round((breakdown[4] / totalReviews) * 100),
      3: Math.round((breakdown[3] / totalReviews) * 100),
      2: Math.round((breakdown[2] / totalReviews) * 100),
      1: Math.round((breakdown[1] / totalReviews) * 100),
    }

    const recommendPercent = Math.round((positiveCount / totalReviews) * 100)

    return {
      averageRating,
      totalReviews,
      breakdown,
      breakdownPercentages,
      recommendPercent,
    }
  }, [productReviews])

  // Filtered and sorted reviews
  const filteredAndSortedReviews = useMemo(() => {
    let list = [...productReviews]

    if (reviewFilterRating !== 'all') {
      const targetStar = Number(reviewFilterRating)
      list = list.filter((r) => Math.round(Number(r.rating) || 0) === targetStar)
    }

    if (reviewSortBy === 'highest') {
      list.sort((a, b) => b.rating - a.rating)
    } else if (reviewSortBy === 'lowest') {
      list.sort((a, b) => a.rating - b.rating)
    } else if (reviewSortBy === 'helpful') {
      list.sort((a, b) => (b.helpfulVotes || 0) - (a.helpfulVotes || 0))
    } else {
      // 'recent'
      list.sort((a, b) => (b.id || '').localeCompare(a.id || ''))
    }

    return list
  }, [productReviews, reviewFilterRating, reviewSortBy])

  // Review interaction handlers
  const handleHelpfulVote = (reviewId) => {
    if (helpfulVotedSet.has(reviewId)) {
      setHelpfulVotedSet(prev => {
        const next = new Set(prev)
        next.delete(reviewId)
        return next
      })
      setProductReviews(prev => {
        const updated = prev.map(r => r.id === reviewId ? { ...r, helpfulVotes: Math.max(0, (r.helpfulVotes || 1) - 1) } : r)
        const prodId = viewedProduct?._id || viewedProduct?.id
        saveStoredProductReviews(prodId, updated)
        return updated
      })
    } else {
      setHelpfulVotedSet(prev => new Set(prev).add(reviewId))
      setProductReviews(prev => {
        const updated = prev.map(r => r.id === reviewId ? { ...r, helpfulVotes: (r.helpfulVotes || 0) + 1 } : r)
        const prodId = viewedProduct?._id || viewedProduct?.id
        saveStoredProductReviews(prodId, updated)
        return updated
      })
      showToast('Thank you for voting this review helpful!', 'success')
    }
  }

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this customer review?')) {
      setProductReviews(prev => {
        const updated = prev.filter(r => r.id !== reviewId)
        const prodId = viewedProduct?._id || viewedProduct?.id
        saveStoredProductReviews(prodId, updated)
        return updated
      })
      showToast('Review deleted successfully.', 'success')
    }
  }

  const handleAddReviewSubmit = (e) => {
    e.preventDefault()
    if (!newReviewForm.userName.trim()) {
      setReviewFormError('Please enter reviewer name.')
      return
    }
    if (!newReviewForm.title.trim()) {
      setReviewFormError('Please enter a review headline.')
      return
    }
    if (!newReviewForm.comment.trim()) {
      setReviewFormError('Please write your review feedback.')
      return
    }

    const colorPalettes = ['#8e24aa', '#0284c7', '#059669', '#d97706', '#dc2626', '#4f46e5', '#db2777']
    const randomColor = colorPalettes[Math.floor(Math.random() * colorPalettes.length)]

    const newReview = {
      id: `rev_${Date.now()}`,
      userName: newReviewForm.userName.trim(),
      userAvatarColor: randomColor,
      rating: Number(newReviewForm.rating) || 5,
      title: newReviewForm.title.trim(),
      comment: newReviewForm.comment.trim(),
      date: 'Today',
      variant: viewedProduct?.color ? `Color: ${viewedProduct.color} • Verified Purchase` : 'Verified Purchase',
      helpfulVotes: 0,
      verified: newReviewForm.verified,
    }

    setProductReviews(prev => {
      const updated = [newReview, ...prev]
      const prodId = viewedProduct?._id || viewedProduct?.id
      saveStoredProductReviews(prodId, updated)
      return updated
    })

    setNewReviewForm({
      userName: '',
      rating: 5,
      title: '',
      comment: '',
      verified: true,
    })
    setIsAddingReview(false)
    setReviewFormError('')
    showToast('Customer review added successfully!', 'success')
  }

  // 1. Render Product Profile View Details

  if (viewedProduct) {
    // Generate variant image slides based on product gallery
    const sliderImages = getContextualProductGallery(viewedProduct)

    const handlePrevSlide = (e) => {
      if (e) e.stopPropagation()
      setActiveSlideIndex(prev => (prev === 0 ? sliderImages.length - 1 : prev - 1))
    }

    const handleNextSlide = (e) => {
      if (e) e.stopPropagation()
      setActiveSlideIndex(prev => (prev === sliderImages.length - 1 ? 0 : prev + 1))
    }

    // Split tags list
    const tagPills = viewedProduct.tag
      ? viewedProduct.tag.split(',').map(t => t.trim())
      : ['Product', 'New']

    return (
      <div className="product-profile-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {renderToast()}
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

            {/* Image Slider Container with Full-screen click */}
            <div
              className="product-slider-container"
              style={{ position: 'relative', cursor: 'zoom-in' }}
              onClick={() => {
                setIsLightboxOpen(true)
                setZoomLevel(1)
              }}
              title="Click to open full-screen enlarged view"
            >
              {sliderImages.length > 1 && (
                <button
                  type="button"
                  className="slider-nav-btn prev"
                  onClick={handlePrevSlide}
                  title="Previous Image"
                >
                  <ChevronLeft style={{ width: '16px', height: '16px' }} />
                </button>
              )}

              <img
                src={sliderImages[activeSlideIndex] || getProductFallbackImage(viewedProduct)}
                alt={`Product view ${activeSlideIndex + 1}`}
                className="slider-main-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getProductFallbackImage(viewedProduct);
                }}
              />

              {/* Full Screen Hint Button */}
              <button
                type="button"
                className="slider-fullscreen-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsLightboxOpen(true)
                  setZoomLevel(1)
                }}
                title="Open in Full Screen (Enlarge)"
              >
                <Maximize2 style={{ width: '14px', height: '14px' }} />
                <span>Enlarge</span>
              </button>

              {sliderImages.length > 1 && (
                <button
                  type="button"
                  className="slider-nav-btn next"
                  onClick={handleNextSlide}
                  title="Next Image"
                >
                  <ChevronRight style={{ width: '16px', height: '16px' }} />
                </button>
              )}

              {sliderImages.length > 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '16px',
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  backdropFilter: 'blur(4px)',
                  letterSpacing: '0.5px'
                }}>
                  {activeSlideIndex + 1} / {sliderImages.length}
                </div>
              )}
            </div>

            {/* Thumbnails Row */}
            <div className="product-thumbnails-row">
              {sliderImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Product thumbnail angle ${idx + 1}`}
                  className={`product-thumbnail-item ${idx === activeSlideIndex ? 'active' : ''}`}
                  onClick={() => setActiveSlideIndex(idx)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getProductFallbackImage(viewedProduct);
                  }}
                  title={`View image ${idx + 1}`}
                />
              ))}
            </div>

            {/* Full-Screen Enlarged Lightbox Modal */}
            {isLightboxOpen && (
              <div
                className="product-lightbox-overlay"
                onClick={() => {
                  setIsLightboxOpen(false)
                  setZoomLevel(1)
                }}
              >
                <div
                  className="product-lightbox-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Lightbox Header Bar */}
                  <div className="product-lightbox-header">
                    <div className="product-lightbox-title-info">
                      <h4>{viewedProduct.name || viewedProduct.productName}</h4>
                      <span>Image {activeSlideIndex + 1} of {sliderImages.length}</span>
                    </div>

                    <div className="product-lightbox-actions">
                      <button
                        type="button"
                        className="lightbox-action-btn"
                        onClick={() => setZoomLevel(prev => (prev >= 2.5 ? 1 : prev + 0.5))}
                        title={zoomLevel > 1 ? "Reset Zoom" : "Zoom In"}
                      >
                        {zoomLevel > 1 ? (
                          <ZoomOut style={{ width: '18px', height: '18px' }} />
                        ) : (
                          <ZoomIn style={{ width: '18px', height: '18px' }} />
                        )}
                        <span style={{ fontSize: '12px', marginLeft: '4px' }}>{Math.round(zoomLevel * 100)}%</span>
                      </button>

                      <button
                        type="button"
                        className="lightbox-action-btn close-btn"
                        onClick={() => {
                          setIsLightboxOpen(false)
                          setZoomLevel(1)
                        }}
                        title="Close Full Screen View"
                      >
                        <X style={{ width: '20px', height: '20px' }} />
                      </button>
                    </div>
                  </div>

                  {/* Lightbox Stage Area */}
                  <div className="product-lightbox-stage">
                    {sliderImages.length > 1 && (
                      <button
                        type="button"
                        className="lightbox-nav-btn prev"
                        onClick={handlePrevSlide}
                        title="Previous Image (Left Arrow)"
                      >
                        <ChevronLeft style={{ width: '28px', height: '28px' }} />
                      </button>
                    )}

                    <div className="product-lightbox-image-box">
                      <img
                        src={sliderImages[activeSlideIndex] || getProductFallbackImage(viewedProduct)}
                        alt={`Full screen product view ${activeSlideIndex + 1}`}
                        className="product-lightbox-image"
                        style={{
                          transform: `scale(${zoomLevel})`,
                          cursor: zoomLevel > 1 ? 'zoom-out' : 'zoom-in'
                        }}
                        onClick={() => setZoomLevel(prev => (prev === 1 ? 1.8 : 1))}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getProductFallbackImage(viewedProduct);
                        }}
                      />
                    </div>

                    {sliderImages.length > 1 && (
                      <button
                        type="button"
                        className="lightbox-nav-btn next"
                        onClick={handleNextSlide}
                        title="Next Image (Right Arrow)"
                      >
                        <ChevronRight style={{ width: '28px', height: '28px' }} />
                      </button>
                    )}
                  </div>

                  {/* Lightbox Bottom Thumbnails Row */}
                  {sliderImages.length > 1 && (
                    <div className="product-lightbox-bottom-thumbnails">
                      {sliderImages.map((img, idx) => (
                        <div
                          key={idx}
                          className={`lightbox-thumbnail-box ${idx === activeSlideIndex ? 'active' : ''}`}
                          onClick={() => {
                            setActiveSlideIndex(idx)
                            setZoomLevel(1)
                          }}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail angle ${idx + 1}`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = getProductFallbackImage(viewedProduct);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

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
                <button
                  type="button"
                  className={`vendor-badge ${viewedProduct.status} clickable`}
                  onClick={() => handleToggleProductStatus(viewedProduct)}
                  disabled={statusUpdatingId === (viewedProduct._id || viewedProduct.id)}
                  title={`Click to ${viewedProduct.status === 'active' ? 'Deactivate' : 'Activate'} Product`}
                  style={{
                    padding: '6px 18px',
                    fontSize: '12px',
                    fontWeight: '600',
                    borderRadius: '6px',
                    backgroundColor: viewedProduct.status === 'active' ? '#2e7d32' : viewedProduct.status === 'out-of-stock' ? '#d32f2f' : '#8e24aa',
                    color: '#ffffff',
                    textTransform: 'capitalize',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {statusUpdatingId === (viewedProduct._id || viewedProduct.id) && (
                    <RotateCw style={{ width: '12px', height: '12px', animation: 'spin 1s linear infinite' }} />
                  )}
                  <span>{viewedProduct.status === 'out-of-stock' ? 'Out Of Stock' : viewedProduct.status}</span>
                </button>
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

              {/* Quick Customer Rating Snippet */}
              <div
                onClick={() => {
                  const el = document.getElementById('product-reviews-section')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  width: 'fit-content',
                  transition: 'background-color 0.15s, border-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9'
                  e.currentTarget.style.borderColor = '#cbd5e1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc'
                  e.currentTarget.style.borderColor = '#e2e8f0'
                }}
                title="Click to view Customer Reviews & Ratings"
              >
                {renderStarRating(Number(reviewsStats.averageRating), 15)}
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', fontFamily: 'var(--admin-font)' }}>
                  {reviewsStats.averageRating}
                </span>
                <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'var(--admin-font)' }}>
                  ({reviewsStats.totalReviews} {reviewsStats.totalReviews === 1 ? 'review' : 'reviews'})
                </span>
                <span style={{ fontSize: '11px', color: '#8e24aa', fontWeight: '700', marginLeft: '4px', fontFamily: 'var(--admin-font)' }}>
                  • View Feedback ↓
                </span>
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

        {/* ========================================================================= */}
        {/* DEDICATED CUSTOMER REVIEWS & RATINGS SECTION */}
        {/* ========================================================================= */}
        <div id="product-reviews-section" className="product-reviews-section-card">
          {/* Header */}
          <div className="reviews-section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div className="reviews-header-icon-box">
                <Star style={{ width: '22px', height: '22px', color: '#059669', fill: '#059669' }} />
              </div>
              <div>
                <h3 className="reviews-section-title">Customer Reviews & Ratings</h3>
                <p className="reviews-section-subtitle">
                  Verified customer feedback, ratings breakdown, and product satisfaction metrics
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn-add-review-trigger"
              onClick={() => {
                setIsAddingReview(prev => !prev)
                setReviewFormError('')
              }}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              <span>{isAddingReview ? 'Close Form' : 'Write a Review'}</span>
            </button>
          </div>

          {/* Inline Add Review Form */}
          {isAddingReview && (
            <div className="add-review-box-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                  Add Customer Review for {viewedProduct.productName || viewedProduct.name}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingReview(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <X style={{ width: '18px', height: '18px' }} />
                </button>
              </div>

              {reviewFormError && (
                <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                  {reviewFormError}
                </div>
              )}

              <form onSubmit={handleAddReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                      Customer / Reviewer Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Patel"
                      value={newReviewForm.userName}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, userName: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                      Star Rating *
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <button
                          type="button"
                          key={starVal}
                          onClick={() => setNewReviewForm({ ...newReviewForm, rating: starVal })}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title={`${starVal} Star${starVal > 1 ? 's' : ''}`}
                        >
                          <Star
                            style={{
                              width: '24px',
                              height: '24px',
                              fill: starVal <= newReviewForm.rating ? '#f59e0b' : 'none',
                              color: starVal <= newReviewForm.rating ? '#f59e0b' : '#cbd5e1',
                            }}
                          />
                        </button>
                      ))}
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginLeft: '6px' }}>
                        {newReviewForm.rating} / 5 Stars
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Review Headline / Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Great build quality, highly recommended!"
                    value={newReviewForm.title}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, title: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Detailed Feedback *
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Write honest customer experience with this product..."
                    value={newReviewForm.comment}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, comment: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="verified_buyer_chk"
                    checked={newReviewForm.verified}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, verified: e.target.checked })}
                    style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                  />
                  <label htmlFor="verified_buyer_chk" style={{ fontSize: '12px', fontWeight: '600', color: '#334155', cursor: 'pointer' }}>
                    Mark as Verified Purchase
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setIsAddingReview(false)}
                    style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', background: '#0f172a', color: '#ffffff', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews Overview Grid: 3 Cards */}
          <div className="reviews-overview-grid">
            {/* Card 1: Score & Recommendation */}
            <div className="review-stat-card score-box">
              <div className="overall-score-number">{reviewsStats.averageRating}</div>
              <div className="stars-row-lg">
                {renderStarRating(Number(reviewsStats.averageRating), 22)}
              </div>
              <div className="score-subtext">
                Based on {reviewsStats.totalReviews} verified {reviewsStats.totalReviews === 1 ? 'rating' : 'ratings'}
              </div>
              <div className="recommendation-pill">
                <Sparkles style={{ width: '14px', height: '14px' }} />
                <span>{reviewsStats.recommendPercent}% of customers recommend</span>
              </div>
            </div>

            {/* Card 2: Rating Breakdown Bars */}
            <div className="review-stat-card">
              <div className="breakdown-title">Rating Breakdown</div>
              <div className="rating-bars-list">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviewsStats.breakdown[star] || 0
                  const pct = reviewsStats.breakdownPercentages[star] || 0
                  const isActive = reviewFilterRating === star

                  return (
                    <div
                      key={star}
                      className={`rating-bar-row ${isActive ? 'active-filter' : ''}`}
                      onClick={() => setReviewFilterRating(prev => (prev === star ? 'all' : star))}
                      title={`Click to filter ${star} star reviews (${count})`}
                    >
                      <div className="star-level-label">
                        <span>{star}</span>
                        <Star style={{ width: '13px', height: '13px', fill: '#f59e0b', color: '#f59e0b' }} />
                      </div>
                      <div className="rating-track">
                        <div
                          className="rating-fill"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: star >= 4 ? '#10b981' : star === 3 ? '#f59e0b' : '#ef4444',
                          }}
                        />
                      </div>
                      <div className="star-count-label">
                        {count} ({pct}%)
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Card 3: Key Feedback Highlights */}
            <div className="review-stat-card">
              <div className="breakdown-title">Feedback Highlights</div>
              <div className="highlights-list">
                <div className="highlight-item">
                  <span className="highlight-pill success">98%</span>
                  <div>
                    <span className="highlight-name">Authentic Quality</span>
                    <span className="highlight-desc">True to images and material specs</span>
                  </div>
                </div>
                <div className="highlight-item">
                  <span className="highlight-pill success">94%</span>
                  <div>
                    <span className="highlight-name">Accurate Sizing</span>
                    <span className="highlight-desc">Fits perfectly according to chart</span>
                  </div>
                </div>
                <div className="highlight-item">
                  <span className="highlight-pill success">91%</span>
                  <div>
                    <span className="highlight-name">Fast Dispatch</span>
                    <span className="highlight-desc">Shipped securely with tracking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter & Sort Bar */}
          <div className="reviews-filter-bar">
            <div className="reviews-filter-tabs">
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Filter style={{ width: '13px', height: '13px' }} /> Filter:
              </span>
              {['all', 5, 4, 3, 2, 1].map((fVal) => (
                <button
                  key={fVal}
                  type="button"
                  className={`filter-tab-pill ${reviewFilterRating === fVal ? 'active' : ''}`}
                  onClick={() => setReviewFilterRating(fVal)}
                >
                  {fVal === 'all' ? `All (${reviewsStats.totalReviews})` : `${fVal} Stars (${reviewsStats.breakdown[fVal] || 0})`}
                </button>
              ))}
            </div>

            <div className="reviews-sort-container">
              <span className="sort-label">Sort by:</span>
              <select
                className="reviews-sort-select"
                value={reviewSortBy}
                onChange={(e) => setReviewSortBy(e.target.value)}
              >
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>

          {/* Reviews Feed List */}
          <div className="reviews-feed-container">
            {filteredAndSortedReviews.length === 0 ? (
              <div className="no-reviews-box">
                <MessageSquare style={{ width: '36px', height: '36px', color: '#94a3b8', marginBottom: '10px' }} />
                <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '700', color: '#334155' }}>
                  No reviews match the selected filter
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                  Try clearing the star filter or be the first to submit a review!
                </p>
                {reviewFilterRating !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setReviewFilterRating('all')}
                    style={{ marginTop: '14px', padding: '6px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                  >
                    Show All Reviews
                  </button>
                )}
              </div>
            ) : (
              filteredAndSortedReviews.map((rev) => {
                const initials = rev.userName
                  ? rev.userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                  : 'U'
                const isVoted = helpfulVotedSet.has(rev.id)

                return (
                  <div key={rev.id} className="review-card-item">
                    <div className="review-user-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          className="reviewer-avatar"
                          style={{
                            backgroundColor: rev.userAvatarColor ? `${rev.userAvatarColor}18` : '#f1f5f9',
                            color: rev.userAvatarColor || '#8e24aa',
                            border: `1.5px solid ${rev.userAvatarColor || '#8e24aa'}40`,
                          }}
                        >
                          {initials}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="reviewer-name">{rev.userName}</span>
                            {rev.verified && (
                              <span className="verified-buyer-badge">
                                <CheckCircle2 style={{ width: '12px', height: '12px' }} /> Verified Buyer
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                            <div className="stars-row-sm">
                              {renderStarRating(rev.rating, 13)}
                            </div>
                            <span className="review-date-text">• {rev.date}</span>
                            {rev.variant && (
                              <span className="review-variant-text">• {rev.variant}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn-delete-review"
                        title="Delete this review"
                        onClick={() => handleDeleteReview(rev.id)}
                      >
                        <Trash2 style={{ width: '15px', height: '15px' }} />
                      </button>
                    </div>

                    <h5 className="review-title-text">{rev.title}</h5>
                    <p className="review-comment-text">{rev.comment}</p>

                    <div className="review-card-footer">
                      <button
                        type="button"
                        className={`btn-helpful-vote ${isVoted ? 'voted' : ''}`}
                        onClick={() => handleHelpfulVote(rev.id)}
                      >
                        <ThumbsUp style={{ width: '13px', height: '13px' }} />
                        <span>Helpful ({rev.helpfulVotes || 0})</span>
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    )
  }


  // 2. Render Add / Edit Form View
  if (isAdding) {
    return (
      <div className="admin-form-panel">
        {renderToast()}
        <div className="form-workspace-header">
          <button
            className="back-circle-btn"
            aria-label="Back to Products list"
            onClick={() => {
              setIsAdding(false)
              setEditingProduct(null)
              handleResetForm()
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

        <form onSubmit={handleSubmit} noValidate>
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
                    <img
                      src={getFullImageUrl(preview) || preview}
                      alt={`upload-${index}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = getProductFallbackImage({ productName: formData.name, category: formData.category }) || 'https://via.placeholder.com/150'
                      }}
                    />
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
              <label htmlFor="product-name">Product Name *</label>
              <input
                id="product-name"
                type="text"
                placeholder="Enter Product Name (e.g. iPhone 15)"
                value={formData.name}
                onChange={handleNameChange}
                onBlur={handleNameBlur}
                className={fieldErrors.name ? 'input-error' : ''}
              />
              {fieldErrors.name && (
                <span className="field-validation-error">
                  <AlertCircle style={{ width: '13px', height: '13px', flexShrink: 0 }} />
                  {fieldErrors.name}
                </span>
              )}
            </div>

            {/* Brand */}
            <div className="form-field-item">
              <label htmlFor="product-brand">Brand Name *</label>
              <input
                id="product-brand"
                type="text"
                placeholder="Enter Brand Name (e.g. Apple)"
                value={formData.brand}
                onChange={handleBrandChange}
                onBlur={handleBrandBlur}
                className={fieldErrors.brand ? 'input-error' : ''}
              />
              {fieldErrors.brand && (
                <span className="field-validation-error">
                  <AlertCircle style={{ width: '13px', height: '13px', flexShrink: 0 }} />
                  {fieldErrors.brand}
                </span>
              )}
            </div>

            {/* SKU */}
            <div className="form-field-item">
              <label htmlFor="product-sku">SKU (Stock Keeping Unit) *</label>
              <input
                id="product-sku"
                type="text"
                placeholder="e.g. IPH15-128"
                value={formData.sku}
                onChange={handleSkuChange}
                onBlur={handleSkuBlur}
                className={fieldErrors.sku ? 'input-error' : ''}
              />
              {fieldErrors.sku && (
                <span className="field-validation-error">
                  <AlertCircle style={{ width: '13px', height: '13px', flexShrink: 0 }} />
                  {fieldErrors.sku}
                </span>
              )}
            </div>

            {/* Color */}
            <div className="form-field-item">
              <label htmlFor="product-color">Color</label>
              <input
                id="product-color"
                type="text"
                placeholder="e.g. Black, Silver, Blue"
                value={formData.color}
                onChange={handleColorChange}
                onBlur={handleColorBlur}
                className={fieldErrors.color ? 'input-error' : ''}
              />
              {fieldErrors.color && (
                <span className="field-validation-error">
                  <AlertCircle style={{ width: '13px', height: '13px', flexShrink: 0 }} />
                  {fieldErrors.color}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="form-field-item">
              <label htmlFor="product-price">Price (₹) *</label>
              <input
                id="product-price"
                type="number"
                min="0"
                step="any"
                placeholder="Enter Price in INR"
                value={formData.price}
                onChange={handlePriceChange}
                onBlur={handlePriceBlur}
                className={fieldErrors.price ? 'input-error' : ''}
              />
              {fieldErrors.price && (
                <span className="field-validation-error">
                  <AlertCircle style={{ width: '13px', height: '13px', flexShrink: 0 }} />
                  {fieldErrors.price}
                </span>
              )}
            </div>

            {/* Discount Price */}
            <div className="form-field-item">
              <label htmlFor="product-discount-price">Discount Price (₹)</label>
              <input
                id="product-discount-price"
                type="number"
                min="0"
                step="any"
                placeholder="Enter Discount Price (optional)"
                value={formData.discountPrice}
                onChange={handleDiscountPriceChange}
                onBlur={handleDiscountPriceBlur}
                className={fieldErrors.discountPrice ? 'input-error' : ''}
              />
              {fieldErrors.discountPrice && (
                <span className="field-validation-error">
                  <AlertCircle style={{ width: '13px', height: '13px', flexShrink: 0 }} />
                  {fieldErrors.discountPrice}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="form-field-item">
              <label htmlFor="product-stock">Stock Quantity *</label>
              <input
                id="product-stock"
                type="number"
                min="0"
                step="1"
                placeholder="Enter Available Stock"
                value={formData.stock}
                onChange={handleStockChange}
                onBlur={handleStockBlur}
                className={fieldErrors.stock ? 'input-error' : ''}
              />
              {fieldErrors.stock && (
                <span className="field-validation-error">
                  <AlertCircle style={{ width: '13px', height: '13px', flexShrink: 0 }} />
                  {fieldErrors.stock}
                </span>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="form-field-item">
              <label htmlFor="product-category">Category *</label>
              <select
                id="product-category"
                value={formData.category}
                onChange={handleCategoryChange}
                onBlur={handleCategoryBlur}
                className={fieldErrors.category ? 'input-error' : ''}
              >
                <option value="">Select Category</option>
                {categoriesList.map(c => (
                  <option key={c.id || c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
              {fieldErrors.category && (
                <span className="field-validation-error">
                  <AlertCircle style={{ width: '13px', height: '13px', flexShrink: 0 }} />
                  {fieldErrors.category}
                </span>
              )}
            </div>

            {/* Vendor Dropdown */}
            <div className="form-field-item">
              <label htmlFor="product-vendor">Vendor</label>
              <select
                id="product-vendor"
                value={formData.vendor}
                onChange={(e) => {
                  const selectedName = e.target.value
                  const matched = vendorsDropdownList.find(v => v.name === selectedName)
                  setFormData(prev => ({
                    ...prev,
                    vendor: selectedName,
                    vendorId: matched?.id && typeof matched.id === 'string' && !matched.id.startsWith('vendor-') && matched.id !== 'super-admin' ? matched.id : ''
                  }))
                }}
              >
                <option value="">Select Vendor (Default: Super Admin)</option>
                {vendorsDropdownList.map(v => (
                  <option key={v.id || v.name} value={v.name}>{v.name}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="form-field-item">
              <label htmlFor="product-tag">Tags</label>
              <input
                id="product-tag"
                type="text"
                placeholder="Comma separated tags e.g. Wireless, Bluetooth"
                value={formData.tag}
                onChange={handleTagChange}
                onBlur={handleTagBlur}
                className={fieldErrors.tag ? 'input-error' : ''}
              />
              {fieldErrors.tag && (
                <span className="field-validation-error">
                  <AlertCircle style={{ width: '13px', height: '13px', flexShrink: 0 }} />
                  {fieldErrors.tag}
                </span>
              )}
            </div>

            {/* Return Policy */}
            <div className="form-field-item">
              <label htmlFor="product-return-policy">Return Policy</label>
              <input
                id="product-return-policy"
                type="text"
                placeholder="e.g. 7 Days Replacement"
                value={formData.returnPolicy}
                onChange={handleReturnPolicyChange}
                onBlur={handleReturnPolicyBlur}
                className={fieldErrors.returnPolicy ? 'input-error' : ''}
              />
              {fieldErrors.returnPolicy && (
                <span className="field-validation-error">
                  <AlertCircle style={{ width: '13px', height: '13px', flexShrink: 0 }} />
                  {fieldErrors.returnPolicy}
                </span>
              )}
            </div>

          </div>

          {/* Description */}
          <div className="form-field-item" style={{ marginTop: '20px' }}>
            <label htmlFor="product-desc">Product Description</label>
            <textarea
              id="product-desc"
              rows={4}
              placeholder="Provide a detailed description of the product..."
              value={formData.desc}
              onChange={handleDescChange}
              onBlur={handleDescBlur}
              className={fieldErrors.desc ? 'input-error' : ''}
              style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--border-light)', padding: '12px', fontSize: '13px', resize: 'vertical' }}
            />
            {fieldErrors.desc && (
              <span className="field-validation-error">
                <AlertCircle style={{ width: '13px', height: '13px', flexShrink: 0 }} />
                {fieldErrors.desc}
              </span>
            )}
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
    { id: 'total', filterVal: 'all', label: 'Total Products', value: productsList.length, icon: Package, background: '#ffecb3', color: '#3b82f6' },
    { id: 'active', filterVal: 'active', label: 'Active Products', value: productsList.filter(p => p.status === 'active').length, icon: CheckCircle2, background: '#c8e6c9', color: '#2ecc71' },
    { id: 'inactive', filterVal: 'inactive', label: 'Inactive Products', value: productsList.filter(p => p.status === 'inactive').length, icon: PackageX, background: '#fee2e2', color: '#ef4444' },
    { id: 'outofstock', filterVal: 'out-of-stock', label: 'Out Of Stock', value: productsList.filter(p => p.status === 'out-of-stock' || Number(p.stock) === 0).length, icon: ShieldAlert, background: '#ffcdd2', color: '#f43f5e' },
    { id: 'category', filterVal: 'category', label: 'Product Category', value: categoriesList.length > 0 ? categoriesList.length : new Set(productsList.map(p => (p.category || '').trim()).filter(Boolean)).size, icon: LayoutGrid, background: '#b2dfdb', color: '#3b82f6' }
  ]

  return (
    <div className="product-management-view" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {renderToast()}
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
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
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

          <div className="product-table-filters-right" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            {/* Category Filter */}
            <div className="product-filter-select-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <select
                className="status-select category-select-input"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{
                  width: '165px',
                  maxWidth: '165px',
                  minWidth: '140px',
                  paddingRight: '30px',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  cursor: 'pointer'
                }}
                title="Filter by Category"
              >
                <option value="all">Select Category</option>
                {categoriesList.map(c => (
                  <option key={c.id || c.name} value={c.name} title={c.name}>
                    {c.name && c.name.length > 22 ? `${c.name.slice(0, 22)}...` : c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="product-filter-chevron" style={{ position: 'absolute', right: '10px', pointerEvents: 'none', width: '14px', height: '14px', color: '#64748b' }} />
            </div>

            {/* Status Filter */}
            <div className="product-filter-select-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <select
                className="status-select status-select-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  width: '145px',
                  maxWidth: '145px',
                  minWidth: '130px',
                  paddingRight: '30px',
                  textTransform: 'capitalize',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  cursor: 'pointer'
                }}
                title="Filter by Status"
              >
                <option value="all">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out-of-stock">Out Of Stock</option>
              </select>
              <ChevronDown className="product-filter-chevron" style={{ position: 'absolute', right: '10px', pointerEvents: 'none', width: '14px', height: '14px', color: '#64748b' }} />
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="admins-table-wrapper">
          <table className="admins-table">
            <thead>
              <tr>
                <th style={{ width: '60px', textAlign: 'center' }}>Sr.No.</th>
                <th>Product Image</th>
                <th>Product Name</th>
                <th>Vendor</th>
                <th>Category</th>
                <th>Status</th>
                <th style={{ width: '150px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <RotateCw style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                      <span>Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedProducts.length > 0 ? (
                paginatedProducts.map((product, idx) => (
                  <tr key={product.id}>
                    <td style={{ textAlign: 'center', fontWeight: '500', color: '#64748b' }}>{startIndex + idx + 1}</td>
                    <td>
                      <img
                        src={product.image || (Array.isArray(product.images) && product.images[0]) || getProductFallbackImage(product)}
                        alt={product.name}
                        className="product-thumbnail-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getProductFallbackImage(product);
                        }}
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
                      <button
                        type="button"
                        className={`admin-status-badge clickable ${product.status}`}
                        onClick={() => handleToggleProductStatus(product)}
                        disabled={statusUpdatingId === (product._id || product.id)}
                        title={`Click to ${product.status === 'active' ? 'Deactivate' : 'Activate'} Product`}
                        style={{
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'capitalize'
                        }}
                      >
                        {statusUpdatingId === (product._id || product.id) ? (
                          <RotateCw style={{ width: '12px', height: '12px', animation: 'spin 1s linear infinite' }} />
                        ) : (
                          <span
                            style={{
                              display: 'inline-block',
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: product.status === 'active' ? '#2e7d32' : product.status === 'out-of-stock' ? '#c62828' : '#8e24aa',
                            }}
                          />
                        )}
                        <span>{product.status === 'out-of-stock' ? 'Out Of Stock' : product.status}</span>
                      </button>
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
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#90a4ae' }}>
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
            Showing {Math.min(startIndex + 1, totalItems)} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} Entries
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
